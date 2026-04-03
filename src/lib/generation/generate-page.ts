import { nowIso } from "@/lib/dates";
import { buildPageEditorialPrompt } from "@/lib/generation/prompts";
import { scorePageDraft } from "@/lib/generation/score";
import { requestStructuredObject } from "@/lib/openrouter";
import { scoreAlternative } from "@/lib/ranking/alternatives";
import { scoreComparisonPair } from "@/lib/ranking/comparisons";
import { comparisonSlug, slugify } from "@/lib/slug";
import { compactText, toTitleCase } from "@/lib/text";
import type { CustomPage, Tool } from "@/types/database";

type GeneratedPageEditorial = {
  intro?: string;
  editorial_verdict?: string;
  faq?: Array<{ question: string; answer: string }>;
};

export type PageDraftPreview = {
  draft: Partial<CustomPage>;
  selectedTools: Tool[];
  qualityScore: number;
  warnings: string[];
  averageTopicOverlap: number;
};

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2)
    .filter((token) => !["best", "tools", "tool", "software", "for", "the", "and", "with"].includes(token));
}

function scoreTopicMatch(tool: Tool, topicTokens: string[]) {
  if (topicTokens.length === 0) {
    return 0;
  }

  const haystacks = [
    { text: tool.name, weight: 4 },
    { text: tool.slug, weight: 4 },
    { text: tool.category, weight: 3 },
    { text: tool.shortDescription, weight: 2 },
    { text: tool.useCases.join(" "), weight: 3 },
    { text: tool.features.join(" "), weight: 2 },
    { text: tool.audiences.join(" "), weight: 2 },
    { text: tool.platforms.join(" "), weight: 1 },
  ];

  return haystacks.reduce((total, haystack) => {
    const normalized = haystack.text.toLowerCase();
    const matches = topicTokens.filter((token) => normalized.includes(token)).length;
    return total + matches * haystack.weight;
  }, 0);
}

function findToolByLooseName(query: string, tools: Tool[]) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  return (
    tools.find((tool) => tool.slug === slugify(query)) ||
    tools.find((tool) => tool.name.toLowerCase() === normalized) ||
    tools.find((tool) => tool.name.toLowerCase().includes(normalized)) ||
    tools.find((tool) => normalized.includes(tool.name.toLowerCase()))
  );
}

function parseComparisonTopic(topic: string) {
  const parts = topic.split(/\s+vs\.?\s+|\s+versus\s+/i).map((part) => compactText(part));
  return parts.length === 2 ? parts : null;
}

function parseAlternativesTopic(topic: string) {
  const match = topic.match(/alternatives?\s+to\s+(.+)/i);
  return match ? compactText(match[1]) : compactText(topic);
}

function buildPageIdentity(
  topic: string,
  templateType: CustomPage["templateType"],
  selectedTools: Tool[],
) {
  if (templateType === "comparison" && selectedTools.length >= 2) {
    const [left, right] = selectedTools;
    return {
      slug: comparisonSlug(left.slug, right.slug),
      title: `${left.name} vs ${right.name}: Which Tool Fits Better?`,
      metaDescription: `Compare ${left.name} and ${right.name} across pricing, workflow fit, and ideal use cases before you choose.`,
    };
  }

  if (templateType === "alternatives" && selectedTools.length >= 1) {
    const [target] = selectedTools;
    return {
      slug: `alternatives-to-${target.slug}`,
      title: `Best Alternatives to ${target.name}`,
      metaDescription: `Explore the strongest alternatives to ${target.name}, with structured comparisons on fit, pricing, and workflow.`,
    };
  }

  const normalizedTopic = compactText(topic);
  const titleTopic = toTitleCase(normalizedTopic.replace(/\btools?\b/gi, "").trim() || normalizedTopic);

  return {
    slug: slugify(normalizedTopic),
    title: normalizedTopic.toLowerCase().startsWith("best ")
      ? toTitleCase(normalizedTopic)
      : `Best Tools for ${titleTopic}`,
    metaDescription: `Discover the best software options for ${titleTopic.toLowerCase()}, with curated picks and structured decision guidance.`,
  };
}

function selectToolsForComparison(topic: string, tools: Tool[]) {
  const explicit = parseComparisonTopic(topic);
  if (explicit) {
    const left = findToolByLooseName(explicit[0], tools);
    const right = findToolByLooseName(explicit[1], tools);

    if (left && right && left.slug !== right.slug) {
      return [left, right];
    }
  }

  const ranked = [...tools]
    .map((tool) => ({ tool, score: scoreTopicMatch(tool, tokenize(topic)) }))
    .sort((left, right) => right.score - left.score || left.tool.name.localeCompare(right.tool.name))
    .slice(0, 8)
    .map((entry) => entry.tool);

  let bestPair: [Tool, Tool] | null = null;
  let bestScore = -1;

  for (let index = 0; index < ranked.length; index += 1) {
    for (let inner = index + 1; inner < ranked.length; inner += 1) {
      const pairScore = scoreComparisonPair(ranked[index], ranked[inner]);
      if (pairScore > bestScore) {
        bestScore = pairScore;
        bestPair = [ranked[index], ranked[inner]];
      }
    }
  }

  return bestPair || ranked.slice(0, 2);
}

function selectToolsForAlternatives(topic: string, tools: Tool[]) {
  const target = findToolByLooseName(parseAlternativesTopic(topic), tools);
  if (!target) {
    return [];
  }

  const alternatives = tools
    .filter((tool) => tool.slug !== target.slug)
    .map((tool) => ({ tool, score: scoreAlternative(target, tool) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.tool.name.localeCompare(right.tool.name))
    .slice(0, 5)
    .map((entry) => entry.tool);

  return [target, ...alternatives];
}

function selectToolsForCuratedList(topic: string, tools: Tool[]) {
  const topicTokens = tokenize(topic);
  return [...tools]
    .map((tool) => ({ tool, score: scoreTopicMatch(tool, topicTokens) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.tool.name.localeCompare(right.tool.name))
    .slice(0, 6)
    .map((entry) => entry.tool);
}

function buildPageDraft(
  topic: string,
  templateType: CustomPage["templateType"],
  selectedTools: Tool[],
): PageDraftPreview {
  const topicTokens = tokenize(topic);
  const overlapScores = selectedTools.map((tool) => scoreTopicMatch(tool, topicTokens));
  const averageTopicOverlap =
    overlapScores.length > 0
      ? overlapScores.reduce((sum, score) => sum + score, 0) / overlapScores.length
      : 0;
  const identity = buildPageIdentity(topic, templateType, selectedTools);

  const draft: Partial<CustomPage> = {
    slug: identity.slug,
    title: identity.title,
    metaDescription: identity.metaDescription,
    pageType: templateType,
    templateType,
    toolSlugs: selectedTools.map((tool) => tool.slug),
    useCase: templateType === "curated-list" ? compactText(topic) : "",
    intro: "",
    bodySections: [],
    faq: [],
    editorialVerdict: "",
    sourceMethod: "ai-assisted",
    status: "review",
    qualityScore: 0,
    updatedAt: nowIso(),
  };

  const { qualityScore, warnings } = scorePageDraft(draft, averageTopicOverlap);
  draft.qualityScore = qualityScore;

  return {
    draft,
    selectedTools,
    qualityScore,
    warnings,
    averageTopicOverlap,
  };
}

export async function generatePageStructurePreview(input: {
  topic: string;
  templateType: CustomPage["templateType"];
  availableTools: Tool[];
}): Promise<PageDraftPreview> {
  const publishedTools = input.availableTools.filter((tool) => tool.status === "published");
  const selectedTools =
    input.templateType === "comparison"
      ? selectToolsForComparison(input.topic, publishedTools)
      : input.templateType === "alternatives"
        ? selectToolsForAlternatives(input.topic, publishedTools)
        : selectToolsForCuratedList(input.topic, publishedTools);

  return buildPageDraft(input.topic, input.templateType, selectedTools);
}

export async function generatePageEditorialPreview(input: {
  topic: string;
  templateType: CustomPage["templateType"];
  selectedTools: Tool[];
  draft: Partial<CustomPage>;
}): Promise<PageDraftPreview | null> {
  const editorial = await requestStructuredObject<GeneratedPageEditorial>(
    buildPageEditorialPrompt({
      topic: input.topic,
      templateType: input.templateType,
      selectedTools: input.selectedTools.map((tool) => ({
        name: tool.name,
        slug: tool.slug,
        category: tool.category,
        shortDescription: tool.shortDescription,
        pricingRange: tool.pricingRange,
        bestFor: tool.bestFor,
        useCases: tool.useCases,
      })),
    }),
  );

  if (!editorial) {
    return null;
  }

  const nextDraft: Partial<CustomPage> = {
    ...input.draft,
    intro: editorial.intro || "",
    editorialVerdict: editorial.editorial_verdict || "",
    faq: (editorial.faq || []).slice(0, 4),
    updatedAt: nowIso(),
  };

  const topicTokens = tokenize(input.topic);
  const overlapScores = input.selectedTools.map((tool) => scoreTopicMatch(tool, topicTokens));
  const averageTopicOverlap =
    overlapScores.length > 0
      ? overlapScores.reduce((sum, score) => sum + score, 0) / overlapScores.length
      : 0;
  const { qualityScore, warnings } = scorePageDraft(nextDraft, averageTopicOverlap);

  nextDraft.qualityScore = qualityScore;
  nextDraft.status = qualityScore >= 78 ? "draft" : "review";

  return {
    draft: nextDraft,
    selectedTools: input.selectedTools,
    qualityScore,
    warnings,
    averageTopicOverlap,
  };
}
