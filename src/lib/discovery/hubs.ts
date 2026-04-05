import { listCategories } from "@/lib/db/taxonomies";
import { listTools } from "@/lib/db/tools";
import { scoreComparisonPair } from "@/lib/ranking/comparisons";
import { comparisonSlug, slugify } from "@/lib/slug";
import { toTitleCase } from "@/lib/text";
import type { Tool } from "@/types/database";

type ComparisonHighlight = {
  slug: string;
  label: string;
  summary: string;
};

type LinkItem = {
  label: string;
  slug: string;
  count: number;
};

export type CategoryHubData = {
  categoryLabel: string;
  categorySlug: string;
  categoryDescription: string;
  tools: Tool[];
  featuredTools: Tool[];
  audienceLinks: LinkItem[];
  useCaseLinks: LinkItem[];
  comparisonHighlights: ComparisonHighlight[];
  alternativeTargets: Tool[];
};

export type CategoryAudienceHubData = CategoryHubData & {
  audienceLabel: string;
  audienceSlug: string;
};

export type UseCaseHubData = {
  useCaseLabel: string;
  useCaseSlug: string;
  description: string;
  tools: Tool[];
  featuredTools: Tool[];
  categoryLinks: LinkItem[];
  audienceLinks: LinkItem[];
  comparisonHighlights: ComparisonHighlight[];
  alternativeTargets: Tool[];
};

function countLinks(values: string[]) {
  const counts = new Map<string, number>();

  for (const value of values.filter(Boolean)) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([label, count]) => ({
      label,
      slug: slugify(label),
      count,
    }));
}

function getComparisonHighlights(tools: Tool[], limit = 4): ComparisonHighlight[] {
  return tools
    .flatMap((tool, index) =>
      tools.slice(index + 1).map((candidate) => ({
        left: tool,
        right: candidate,
        score: scoreComparisonPair(tool, candidate),
      })),
    )
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ left, right }) => ({
      slug: comparisonSlug(left.slug, right.slug),
      label: `${left.name} vs ${right.name}`,
      summary:
        left.aiInsights?.comparisonSummary ||
        right.aiInsights?.comparisonSummary ||
        `Compare ${left.name} and ${right.name} across pricing, fit, and workflow.`,
    }));
}

function matchesCategory(tool: Tool, categorySlug: string) {
  const categories = tool.categories?.length ? tool.categories : [tool.category];
  return categories.some((category) => slugify(category) === categorySlug);
}

function matchesAudience(tool: Tool, audienceSlug: string) {
  return tool.audiences.some((audience) => slugify(audience) === audienceSlug);
}

function getFallbackCategoryDescription(categoryLabel: string, count: number) {
  return `Browse ${count} reviewed ${categoryLabel.toLowerCase()} tools by pricing, workflow fit, audience, and onboarding complexity.`;
}

function rankToolsForHub(tools: Tool[]) {
  return [...tools].sort((left, right) => {
    const scoreLeft =
      (left.sourceConfidence ?? 0) +
      left.features.length * 0.02 +
      left.useCases.length * 0.03 +
      (left.hasFreePlan ? 0.05 : 0);
    const scoreRight =
      (right.sourceConfidence ?? 0) +
      right.features.length * 0.02 +
      right.useCases.length * 0.03 +
      (right.hasFreePlan ? 0.05 : 0);

    return scoreRight - scoreLeft || left.name.localeCompare(right.name);
  });
}

export function formatHubLabel(slug: string) {
  return toTitleCase(slug.replace(/-/g, " "));
}

export async function getCategoryHubData(categorySlug: string): Promise<CategoryHubData | null> {
  const [categories, tools] = await Promise.all([
    listCategories(),
    listTools({ status: ["published"] }),
  ]);

  const categoryTools = tools.filter((tool) => matchesCategory(tool, categorySlug));
  if (categoryTools.length === 0) {
    return null;
  }

  const categoryRecord = categories.find((category) => category.slug === categorySlug);
  const categoryLabel = categoryRecord?.name || categoryTools[0].category || formatHubLabel(categorySlug);
  const rankedTools = rankToolsForHub(categoryTools);

  return {
    categoryLabel,
    categorySlug,
    categoryDescription:
      categoryRecord?.description || getFallbackCategoryDescription(categoryLabel, categoryTools.length),
    tools: rankedTools,
    featuredTools: rankedTools.slice(0, 6),
    audienceLinks: countLinks(categoryTools.flatMap((tool) => tool.audiences)).slice(0, 8),
    useCaseLinks: countLinks(categoryTools.flatMap((tool) => tool.useCases)).slice(0, 8),
    comparisonHighlights: getComparisonHighlights(categoryTools),
    alternativeTargets: rankedTools.slice(0, 4),
  };
}

export async function getCategoryAudienceHubData(
  categorySlug: string,
  audienceSlug: string,
): Promise<CategoryAudienceHubData | null> {
  const categoryHub = await getCategoryHubData(categorySlug);
  if (!categoryHub) {
    return null;
  }

  const audienceTools = categoryHub.tools.filter((tool) => matchesAudience(tool, audienceSlug));
  if (audienceTools.length === 0) {
    return null;
  }

  const audienceLabel =
    audienceTools.flatMap((tool) => tool.audiences).find((audience) => slugify(audience) === audienceSlug) ||
    formatHubLabel(audienceSlug);
  const rankedTools = rankToolsForHub(audienceTools);

  return {
    ...categoryHub,
    audienceLabel,
    audienceSlug,
    tools: rankedTools,
    featuredTools: rankedTools.slice(0, 6),
    useCaseLinks: countLinks(rankedTools.flatMap((tool) => tool.useCases)).slice(0, 8),
    comparisonHighlights: getComparisonHighlights(rankedTools),
    alternativeTargets: rankedTools.slice(0, 4),
  };
}

export async function listCategoryHubSlugs() {
  const [categories, tools] = await Promise.all([
    listCategories(),
    listTools({ status: ["published"] }),
  ]);
  const toolCategorySlugs = new Set(
    tools.flatMap((tool) => (tool.categories?.length ? tool.categories : [tool.category]).map((category) => slugify(category))),
  );
  const categorySlugs = new Set<string>();

  for (const category of categories) {
    if (toolCategorySlugs.has(category.slug)) {
      categorySlugs.add(category.slug);
    }
  }

  for (const tool of tools) {
    for (const category of tool.categories?.length ? tool.categories : [tool.category]) {
      categorySlugs.add(slugify(category));
    }
  }

  return [...categorySlugs].sort((left, right) => left.localeCompare(right));
}

export async function listCategoryAudienceHubSlugs() {
  const tools = await listTools({ status: ["published"] });
  const categoryAudiencePairs = new Set<string>();

  for (const tool of tools) {
    for (const category of tool.categories?.length ? tool.categories : [tool.category]) {
      const categorySlug = slugify(category);
      for (const audience of tool.audiences) {
        categoryAudiencePairs.add(`${categorySlug}::${slugify(audience)}`);
      }
    }
  }

  return [...categoryAudiencePairs].map((entry) => {
    const [category, audience] = entry.split("::");
    return { category, audience };
  });
}

export async function getUseCaseHubData(useCaseSlug: string): Promise<UseCaseHubData | null> {
  const tools = await listTools({ status: ["published"] });
  const matchingTools = tools.filter((tool) =>
    tool.useCases.some((useCase) => slugify(useCase) === useCaseSlug),
  );

  if (matchingTools.length === 0) {
    return null;
  }

  const label =
    matchingTools
      .flatMap((tool) => tool.useCases)
      .find((useCase) => slugify(useCase) === useCaseSlug) || formatHubLabel(useCaseSlug);
  const rankedTools = rankToolsForHub(matchingTools);

  return {
    useCaseLabel: label,
    useCaseSlug,
    description: `Browse ${label.toLowerCase()} tools by category, audience fit, pricing model, and comparison path.`,
    tools: rankedTools,
    featuredTools: rankedTools.slice(0, 6),
    categoryLinks: countLinks(
      rankedTools.flatMap((tool) => (tool.categories?.length ? tool.categories : [tool.category])),
    ).slice(0, 8),
    audienceLinks: countLinks(rankedTools.flatMap((tool) => tool.audiences)).slice(0, 8),
    comparisonHighlights: getComparisonHighlights(rankedTools),
    alternativeTargets: rankedTools.slice(0, 4),
  };
}

export async function listUseCaseHubSlugs() {
  const tools = await listTools({ status: ["published"] });
  const useCaseSlugs = new Set<string>();

  for (const tool of tools) {
    for (const useCase of tool.useCases) {
      useCaseSlugs.add(slugify(useCase));
    }
  }

  return [...useCaseSlugs].sort((left, right) => left.localeCompare(right));
}
