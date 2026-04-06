import { nowIso } from "@/lib/dates";
import { buildToolEditorialPrompt, buildToolFactsPrompt } from "@/lib/generation/prompts";
import { scoreToolDraft } from "@/lib/generation/score";
import { requestStructuredObject } from "@/lib/openrouter";
import { slugify } from "@/lib/slug";
import { getToolTaxonomyHints } from "@/lib/taxonomy/registry";
import { compactText } from "@/lib/text";
import type { Tool } from "@/types/database";

type GeneratedToolFacts = {
  slug?: string;
  category?: string;
  short_description?: string;
  pricing_model?: Tool["pricingModel"];
  pricing_range?: string;
  starting_price?: number | string | null;
  starting_price_currency?: string;
  billing_period?: string;
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

function normalizeCurrencyCode(value: string | undefined) {
  const normalized = compactText(value || "").toUpperCase();
  return /^[A-Z]{3}$/.test(normalized) ? normalized : undefined;
}

function normalizeBillingPeriod(value: string | undefined): Tool["billingPeriod"] {
  const normalized = compactText(value || "").toLowerCase();

  if (normalized === "daily" || normalized === "weekly" || normalized === "monthly" || normalized === "yearly") {
    return normalized;
  }

  if (normalized === "day") return "daily";
  if (normalized === "week") return "weekly";
  if (normalized === "month") return "monthly";
  if (normalized === "year" || normalized === "annual" || normalized === "annually") return "yearly";

  return undefined;
}

function parseStartingPrice(value: number | string | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
  }

  return undefined;
}

function formatPricingRange(input: {
  pricingModel: Tool["pricingModel"];
  pricingRange?: string;
  startingPrice?: number;
  startingPriceCurrency?: string;
  billingPeriod?: Tool["billingPeriod"];
  hasFreePlan?: boolean;
}) {
  const explicitRange = compactText(input.pricingRange || "");
  if (explicitRange) {
    return explicitRange;
  }

  if (input.pricingModel === "free") {
    return "Free";
  }

  if (input.pricingModel === "custom") {
    return "Custom pricing";
  }

  if (input.startingPrice === undefined) {
    return input.hasFreePlan ? "Free plan available" : "";
  }

  const currency = input.startingPriceCurrency || "USD";
  const amount = currency === "USD" ? `$${input.startingPrice}` : `${currency} ${input.startingPrice}`;
  const periodSuffix = input.billingPeriod ? `/${input.billingPeriod}` : "";

  if (input.pricingModel === "freemium" || input.hasFreePlan) {
    return `Free plan, paid from ${amount}${periodSuffix}`;
  }

  return `From ${amount}${periodSuffix}`;
}

function normalizeToolDraft(
  input: {
    toolName: string;
    website?: string;
  },
  facts: GeneratedToolFacts,
  existingTools: Array<Pick<Tool, "slug" | "name">>,
  approvedCategories: string[],
): ToolDraftPreview {
  const slug = slugify(facts.slug || input.toolName);
  const startingPrice = parseStartingPrice(facts.starting_price);
  const startingPriceCurrency = normalizeCurrencyCode(facts.starting_price_currency);
  const billingPeriod = normalizeBillingPeriod(facts.billing_period);
  const pricingModel = facts.pricing_model || "freemium";
  const hasFreePlan = Boolean(facts.has_free_plan);
  const draft: Partial<Tool> = {
    slug,
    name: input.toolName.trim(),
    website: facts.website || input.website || "",
    category: facts.category || "",
    shortDescription:
      compactText(facts.short_description || `${input.toolName} software profile pending fact review.`),
    description:
      compactText(facts.short_description || `${input.toolName} software profile pending fact review.`),
    pricingModel,
    pricing: pricingModel
      ? pricingModel === "free"
        ? "Free"
        : pricingModel === "paid"
          ? "Paid"
          : pricingModel === "custom"
            ? "Custom"
            : "Freemium"
      : "Freemium",
    pricingRange: formatPricingRange({
      pricingModel,
      pricingRange: facts.pricing_range,
      startingPrice,
      startingPriceCurrency,
      billingPeriod,
      hasFreePlan,
    }),
    startingPrice,
    startingPriceCurrency,
    billingPeriod,
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
    hasFreePlan,
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

  const { confidence, warnings } = scoreToolDraft(draft, existingTools, {
    approvedCategories,
  });
  draft.sourceConfidence = confidence;

  return { draft, confidence, warnings };
}

export async function generateToolFactsPreview(input: {
  toolName: string;
  website?: string;
  categories: string[];
  existingTools?: Array<Pick<Tool, "slug" | "name">>;
}): Promise<ToolDraftPreview | null> {
  const taxonomyHints = getToolTaxonomyHints(input.categories);
  const facts = await requestStructuredObject<GeneratedToolFacts>(
    buildToolFactsPrompt({
      toolName: input.toolName,
      website: input.website,
      categories: taxonomyHints.categories,
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
    taxonomyHints.categories,
  );
}

export async function generateToolEditorialPreview(
  draft: Partial<Tool>,
  existingTools: Array<Pick<Tool, "slug" | "name">> = [],
  options?: {
    approvedCategories?: string[];
  },
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

  const { confidence, warnings } = scoreToolDraft(nextDraft, existingTools, {
    approvedCategories: options?.approvedCategories,
  });
  nextDraft.sourceConfidence = confidence;
  nextDraft.status = confidence >= 0.82 ? "draft" : "review";

  return {
    draft: nextDraft,
    confidence,
    warnings,
  };
}
