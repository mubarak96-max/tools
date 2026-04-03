import { nowIso } from "@/lib/dates";
import { buildToolEditorialPrompt, buildToolFactsPrompt } from "@/lib/generation/prompts";
import { scoreToolDraft } from "@/lib/generation/score";
import { requestStructuredObject } from "@/lib/openrouter";
import { slugify } from "@/lib/slug";
import { compactText } from "@/lib/text";
import type { Tool } from "@/types/database";

type GeneratedToolFacts = {
  slug?: string;
  category?: string;
  short_description?: string;
  pricing_model?: Tool["pricingModel"];
  pricing_range?: string;
  difficulty_level?: Tool["difficultyLevel"];
  platforms?: string[];
  use_cases?: string[];
  features?: string[];
  integrations?: string[];
  audiences?: string[];
  team_fit?: string[];
  setup_time?: string;
  has_free_plan?: boolean;
  has_free_trial?: boolean;
  best_for?: string;
  not_ideal_for?: string;
  website?: string;
};

type GeneratedToolEditorial = {
  editorial_summary?: string;
  comparison_summary?: string;
  pros?: string[];
  cons?: string[];
  faq?: Array<{ question: string; answer: string }>;
};

export type ToolDraftPreview = {
  draft: Partial<Tool>;
  confidence: number;
  warnings: string[];
};

function normalizeList(values: string[] | undefined, max = 10) {
  return Array.from(new Set((values || []).map((value) => compactText(value)).filter(Boolean))).slice(0, max);
}

function normalizeToolDraft(
  input: {
    toolName: string;
    website?: string;
  },
  facts: GeneratedToolFacts,
  existingTools: Array<Pick<Tool, "slug" | "name">>,
): ToolDraftPreview {
  const slug = slugify(facts.slug || input.toolName);
  const draft: Partial<Tool> = {
    slug,
    name: input.toolName.trim(),
    website: facts.website || input.website || "",
    category: facts.category || "",
    shortDescription:
      compactText(facts.short_description || `${input.toolName} software profile pending fact review.`),
    description:
      compactText(facts.short_description || `${input.toolName} software profile pending fact review.`),
    pricingModel: facts.pricing_model || "freemium",
    pricing: facts.pricing_model
      ? facts.pricing_model === "free"
        ? "Free"
        : facts.pricing_model === "paid"
          ? "Paid"
          : facts.pricing_model === "custom"
            ? "Custom"
            : "Freemium"
      : "Freemium",
    pricingRange: compactText(facts.pricing_range || ""),
    difficultyLevel: facts.difficulty_level || "intermediate",
    difficulty: facts.difficulty_level
      ? facts.difficulty_level === "beginner"
        ? "Beginner"
        : facts.difficulty_level === "advanced"
          ? "Advanced"
          : "Intermediate"
      : "Intermediate",
    platforms: normalizeList(facts.platforms, 8),
    useCases: normalizeList(facts.use_cases, 10),
    features: normalizeList(facts.features, 12),
    integrations: normalizeList(facts.integrations, 12),
    audiences: normalizeList(facts.audiences, 8),
    teamFit: normalizeList(facts.team_fit, 6),
    setupTime: compactText(facts.setup_time || ""),
    hasFreePlan: Boolean(facts.has_free_plan),
    hasFreeTrial: Boolean(facts.has_free_trial),
    bestFor: compactText(facts.best_for || ""),
    notIdealFor: compactText(facts.not_ideal_for || ""),
    editorialSummary: "",
    pros: [],
    cons: [],
    faq: [],
    status: "review",
    sourceConfidence: 0,
    factsLastVerifiedAt: nowIso(),
    aiLastGeneratedAt: nowIso(),
  };

  const { confidence, warnings } = scoreToolDraft(draft, existingTools);
  draft.sourceConfidence = confidence;

  return { draft, confidence, warnings };
}

export async function generateToolFactsPreview(input: {
  toolName: string;
  website?: string;
  categories: string[];
  existingTools?: Array<Pick<Tool, "slug" | "name">>;
}): Promise<ToolDraftPreview | null> {
  const facts = await requestStructuredObject<GeneratedToolFacts>(
    buildToolFactsPrompt({
      toolName: input.toolName,
      website: input.website,
      categories: input.categories,
    }),
  );

  if (!facts) {
    return null;
  }

  return normalizeToolDraft(
    {
      toolName: input.toolName,
      website: input.website,
    },
    facts,
    input.existingTools || [],
  );
}

export async function generateToolEditorialPreview(
  draft: Partial<Tool>,
  existingTools: Array<Pick<Tool, "slug" | "name">> = [],
): Promise<ToolDraftPreview | null> {
  const editorial = await requestStructuredObject<GeneratedToolEditorial>(
    buildToolEditorialPrompt(draft),
  );

  if (!editorial) {
    return null;
  }

  const nextDraft: Partial<Tool> = {
    ...draft,
    editorialSummary: compactText(editorial.editorial_summary || ""),
    pros: normalizeList(editorial.pros, 8),
    cons: normalizeList(editorial.cons, 6),
    faq: (editorial.faq || []).slice(0, 5),
    aiInsights: {
      whyThisToolFits: compactText(editorial.editorial_summary || ""),
      comparisonSummary: compactText(editorial.comparison_summary || ""),
      bestFor: compactText(draft.bestFor || ""),
      antiRecommendation: compactText(draft.notIdealFor || ""),
      pros: normalizeList(editorial.pros, 8),
      cons: normalizeList(editorial.cons, 6),
    },
    aiLastGeneratedAt: nowIso(),
  };

  const { confidence, warnings } = scoreToolDraft(nextDraft, existingTools);
  nextDraft.sourceConfidence = confidence;
  nextDraft.status = confidence >= 0.82 ? "draft" : "review";

  return {
    draft: nextDraft,
    confidence,
    warnings,
  };
}
