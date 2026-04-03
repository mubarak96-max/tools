import { z } from "zod";

import type { AIInsights, DifficultyLevel, PricingModel, RecordStatus, Tool } from "@/types/database";
import { slugify } from "@/lib/slug";
import { compactText, toTitleCase } from "@/lib/text";
import {
  asRecord,
  booleanOrUndefined,
  isoDateOrUndefined,
  numberOrUndefined,
  recordStatusValues,
  stringArray,
  stringOrUndefined,
} from "@/lib/validation/shared";

const recordStatusSchema = z.enum(recordStatusValues);
const pricingModelSchema = z.enum(["free", "freemium", "paid", "custom"]);
const difficultyLevelSchema = z.enum(["beginner", "intermediate", "advanced"]);
const faqSchema = z.object({
  question: z.string().trim().min(3).max(160),
  answer: z.string().trim().min(3).max(500),
});

const aiInsightsSchema = z.object({
  whyThisToolFits: z.string().trim().min(1),
  pros: z.array(z.string().trim().min(1)).max(12),
  cons: z.array(z.string().trim().min(1)).max(12),
  bestFor: z.string().trim().min(1),
  antiRecommendation: z.string().trim().min(1),
  comparisonSummary: z.string().trim().min(1),
});

export const toolSchema = z.object({
  id: z.string().trim().optional(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(1).max(120),
  website: z.url().optional(),
  logoUrl: z.url().optional(),
  category: z.string().trim().min(1).max(80),
  subcategories: z.array(z.string().trim().min(1).max(80)).max(10),
  shortDescription: z.string().trim().min(20).max(320),
  longDescription: z.string().trim().max(4000).optional(),
  bestFor: z.string().trim().max(240).optional(),
  notIdealFor: z.string().trim().max(240).optional(),
  useCases: z.array(z.string().trim().min(1).max(120)).max(20),
  audiences: z.array(z.string().trim().min(1).max(80)).max(20),
  platforms: z.array(z.string().trim().min(1).max(40)).max(10),
  pricingModel: pricingModelSchema,
  startingPrice: z.number().nonnegative().optional(),
  startingPriceCurrency: z.string().trim().length(3).optional(),
  billingPeriod: z.string().trim().max(40).optional(),
  hasFreePlan: z.boolean(),
  hasFreeTrial: z.boolean(),
  difficultyLevel: difficultyLevelSchema,
  setupTime: z.string().trim().max(80).optional(),
  teamFit: z.array(z.string().trim().min(1).max(80)).max(10),
  integrations: z.array(z.string().trim().min(1).max(80)).max(40),
  features: z.array(z.string().trim().min(1).max(160)).max(40),
  pros: z.array(z.string().trim().min(1).max(160)).max(20),
  cons: z.array(z.string().trim().min(1).max(160)).max(20),
  alternatives: z.array(z.string().trim().min(1).max(120)).max(20),
  competitors: z.array(z.string().trim().min(1).max(120)).max(20),
  screenshots: z.array(z.url()).max(12),
  editorialSummary: z.string().trim().max(600).optional(),
  faq: z.array(faqSchema).max(10),
  status: recordStatusSchema,
  sourceConfidence: z.number().min(0).max(1).optional(),
  factsLastVerifiedAt: z.string().datetime().optional(),
  aiLastGeneratedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  description: z.string().trim().min(20).max(320),
  pricing: z.enum(["Free", "Freemium", "Paid", "Custom"]),
  pricingRange: z.string().trim().max(120),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  aiInsights: aiInsightsSchema.optional(),
});

function normalizePricingModel(value: unknown): PricingModel {
  const normalized = stringOrUndefined(value)?.toLowerCase();

  if (normalized === "free" || normalized === "freemium" || normalized === "paid" || normalized === "custom") {
    return normalized;
  }

  return "freemium";
}

function normalizeDifficultyLevel(value: unknown): DifficultyLevel {
  const normalized = stringOrUndefined(value)?.toLowerCase();

  if (normalized === "beginner" || normalized === "intermediate" || normalized === "advanced") {
    return normalized;
  }

  return "intermediate";
}

function legacyPricingLabel(pricingModel: PricingModel): Tool["pricing"] {
  switch (pricingModel) {
    case "free":
      return "Free";
    case "paid":
      return "Paid";
    case "custom":
      return "Custom";
    default:
      return "Freemium";
  }
}

function legacyDifficultyLabel(level: DifficultyLevel): Tool["difficulty"] {
  switch (level) {
    case "beginner":
      return "Beginner";
    case "advanced":
      return "Advanced";
    default:
      return "Intermediate";
  }
}

function inferPricingRange(raw: Record<string, unknown>, pricingModel: PricingModel): string {
  const fromInput = stringOrUndefined(raw.pricingRange);
  if (fromInput) {
    return fromInput;
  }

  if (pricingModel === "free") {
    return "Free";
  }

  const startingPrice = numberOrUndefined(raw.startingPrice);
  if (startingPrice === undefined) {
    return pricingModel === "paid" ? "Custom pricing" : "Free plan available";
  }

  const currency = stringOrUndefined(raw.startingPriceCurrency)?.toUpperCase() ?? "USD";
  const billingPeriod = stringOrUndefined(raw.billingPeriod);
  const amount = currency === "USD" ? `$${startingPrice}` : `${currency} ${startingPrice}`;

  return billingPeriod ? `${amount}/${billingPeriod}` : amount;
}

function buildAIInsights(raw: Record<string, unknown>): AIInsights | undefined {
  const aiSource = asRecord(raw.aiInsights);

  const whyThisToolFits =
    stringOrUndefined(aiSource.whyThisToolFits) ?? stringOrUndefined(raw.editorialSummary);
  const bestFor = stringOrUndefined(aiSource.bestFor) ?? stringOrUndefined(raw.bestFor);
  const antiRecommendation =
    stringOrUndefined(aiSource.antiRecommendation) ?? stringOrUndefined(raw.notIdealFor);
  const comparisonSummary =
    stringOrUndefined(aiSource.comparisonSummary) ?? stringOrUndefined(raw.editorialSummary);
  const pros = stringArray(aiSource.pros ?? raw.pros);
  const cons = stringArray(aiSource.cons ?? raw.cons);

  if (!whyThisToolFits && !bestFor && !antiRecommendation && !comparisonSummary && pros.length === 0 && cons.length === 0) {
    return undefined;
  }

  return aiInsightsSchema.parse({
    whyThisToolFits: whyThisToolFits ?? "Structured editorial summary pending review.",
    bestFor: bestFor ?? "General software evaluation.",
    antiRecommendation: antiRecommendation ?? "Cases requiring manual review.",
    comparisonSummary: comparisonSummary ?? "Comparison summary pending review.",
    pros,
    cons,
  });
}

function normalizeStatus(value: unknown, fallbackStatus: RecordStatus): RecordStatus {
  const parsed = recordStatusSchema.safeParse(value);
  return parsed.success ? parsed.data : fallbackStatus;
}

export function normalizeToolRecord(
  input: unknown,
  options?: {
    id?: string;
    fallbackStatus?: RecordStatus;
  },
): Tool {
  const raw = asRecord(input);
  const slug = slugify(
    stringOrUndefined(raw.slug) ?? options?.id ?? stringOrUndefined(raw.name) ?? "untitled-tool",
  );
  const name =
    stringOrUndefined(raw.name) ??
    toTitleCase(slug.replace(/-/g, " "));
  const pricingModel = normalizePricingModel(raw.pricingModel ?? raw.pricing);
  const difficultyLevel = normalizeDifficultyLevel(raw.difficultyLevel ?? raw.difficulty);
  const editorialSummary =
    stringOrUndefined(raw.editorialSummary) ??
    stringOrUndefined(asRecord(raw.aiInsights).whyThisToolFits);
  const shortDescription =
    stringOrUndefined(raw.shortDescription) ??
    stringOrUndefined(raw.description) ??
    editorialSummary ??
    `${name} is a software tool in the ${stringOrUndefined(raw.category) ?? "software"} category.`;
  const bestFor =
    stringOrUndefined(raw.bestFor) ?? stringOrUndefined(asRecord(raw.aiInsights).bestFor);
  const notIdealFor =
    stringOrUndefined(raw.notIdealFor) ??
    stringOrUndefined(asRecord(raw.aiInsights).antiRecommendation);
  const aiInsights = buildAIInsights(raw);
  const status = normalizeStatus(raw.status, options?.fallbackStatus ?? "published");

  return toolSchema.parse({
    id: options?.id,
    slug,
    name,
    website: stringOrUndefined(raw.website),
    logoUrl: stringOrUndefined(raw.logoUrl),
    category: stringOrUndefined(raw.category) ?? "General",
    subcategories: stringArray(raw.subcategories),
    shortDescription: compactText(shortDescription),
    longDescription: stringOrUndefined(raw.longDescription),
    bestFor,
    notIdealFor,
    useCases: stringArray(raw.useCases),
    audiences: stringArray(raw.audiences),
    platforms: stringArray(raw.platforms),
    pricingModel,
    startingPrice: numberOrUndefined(raw.startingPrice),
    startingPriceCurrency: stringOrUndefined(raw.startingPriceCurrency)?.toUpperCase(),
    billingPeriod: stringOrUndefined(raw.billingPeriod),
    hasFreePlan:
      booleanOrUndefined(raw.hasFreePlan) ??
      (pricingModel === "free" || pricingModel === "freemium"),
    hasFreeTrial: booleanOrUndefined(raw.hasFreeTrial) ?? false,
    difficultyLevel,
    setupTime: stringOrUndefined(raw.setupTime),
    teamFit: stringArray(raw.teamFit),
    integrations: stringArray(raw.integrations),
    features: stringArray(raw.features),
    pros: stringArray(raw.pros ?? asRecord(raw.aiInsights).pros),
    cons: stringArray(raw.cons ?? asRecord(raw.aiInsights).cons),
    alternatives: stringArray(raw.alternatives),
    competitors: stringArray(raw.competitors),
    screenshots: stringArray(raw.screenshots),
    editorialSummary,
    faq: Array.isArray(raw.faq) ? raw.faq : [],
    status,
    sourceConfidence: numberOrUndefined(raw.sourceConfidence),
    factsLastVerifiedAt: isoDateOrUndefined(raw.factsLastVerifiedAt),
    aiLastGeneratedAt: isoDateOrUndefined(raw.aiLastGeneratedAt),
    createdAt: isoDateOrUndefined(raw.createdAt),
    updatedAt: isoDateOrUndefined(raw.updatedAt),
    description: compactText(shortDescription),
    pricing: legacyPricingLabel(pricingModel),
    pricingRange: inferPricingRange(raw, pricingModel),
    difficulty: legacyDifficultyLabel(difficultyLevel),
    aiInsights,
  });
}

export function prepareToolWrite(
  input: Partial<Tool>,
  options?: {
    id?: string;
    fallbackStatus?: RecordStatus;
  },
) {
  const normalized = normalizeToolRecord(input, options);

  return {
    slug: normalized.slug,
    name: normalized.name,
    website: normalized.website ?? "",
    logoUrl: normalized.logoUrl ?? "",
    category: normalized.category,
    subcategories: normalized.subcategories,
    shortDescription: normalized.shortDescription,
    longDescription: normalized.longDescription ?? "",
    bestFor: normalized.bestFor ?? "",
    notIdealFor: normalized.notIdealFor ?? "",
    useCases: normalized.useCases,
    audiences: normalized.audiences,
    platforms: normalized.platforms,
    pricingModel: normalized.pricingModel,
    startingPrice: normalized.startingPrice ?? null,
    startingPriceCurrency: normalized.startingPriceCurrency ?? "",
    billingPeriod: normalized.billingPeriod ?? "",
    hasFreePlan: normalized.hasFreePlan,
    hasFreeTrial: normalized.hasFreeTrial,
    difficultyLevel: normalized.difficultyLevel,
    setupTime: normalized.setupTime ?? "",
    teamFit: normalized.teamFit,
    integrations: normalized.integrations,
    features: normalized.features,
    pros: normalized.pros,
    cons: normalized.cons,
    alternatives: normalized.alternatives,
    competitors: normalized.competitors,
    screenshots: normalized.screenshots,
    editorialSummary: normalized.editorialSummary ?? "",
    faq: normalized.faq,
    status: normalized.status,
    sourceConfidence: normalized.sourceConfidence ?? null,
    factsLastVerifiedAt: normalized.factsLastVerifiedAt ?? null,
    aiLastGeneratedAt: normalized.aiLastGeneratedAt ?? null,
    createdAt: normalized.createdAt ?? null,
    updatedAt: normalized.updatedAt ?? null,
    description: normalized.description,
    pricing: normalized.pricing,
    pricingRange: normalized.pricingRange,
    difficulty: normalized.difficulty,
    aiInsights: normalized.aiInsights ?? null,
  };
}
