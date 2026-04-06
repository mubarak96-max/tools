import type { CustomPage, Tool } from "@/types/database";
import { inspectPageTaxonomy, inspectToolTaxonomy } from "@/lib/taxonomy/registry";

export type ToolGenerationWarning = string;

export type PageGenerationWarning = string;

type DraftCandidate = Pick<Tool, "slug" | "name">;

const criticalToolWarnings = new Set([
  "Missing website",
  "Missing pricing snapshot",
  "Weak metadata description",
  "Editorial summary is too short",
  "FAQ needs at least 2 items",
  "Pricing is too vague for publish confidence",
]);

const criticalPageWarnings = new Set([
  "No linked tools",
  "Comparison needs exactly 2 tools",
  "Alternatives page needs a target tool and replacements",
  "Weak metadata description",
  "Intro is too short",
  "Editorial verdict is too short",
  "Intro and verdict are too similar",
  "FAQ needs at least 2 items",
  "Quality score is below publish threshold",
]);

function normalizedText(value: string | undefined) {
  return (value || "").trim().toLowerCase();
}

function stripHtml(value: string | undefined) {
  return normalizedText((value || "").replace(/<[^>]+>/g, " "));
}

function hasGenericPricing(value: string | undefined) {
  const normalized = normalizedText(value);
  return Boolean(
    normalized &&
      /^(custom pricing|contact sales|contact for pricing|enterprise pricing|varies)$/i.test(
        normalized,
      ),
  );
}

function hasDuplicateStrings(...groups: Array<string[] | undefined>) {
  const values = groups
    .flatMap((group) => group || [])
    .map((value) => normalizedText(value))
    .filter(Boolean);

  return new Set(values).size !== values.length;
}

export function scoreToolDraft(
  draft: Partial<Tool>,
  existingTools: DraftCandidate[] = [],
  options?: {
    approvedCategories?: string[];
  },
): {
  confidence: number;
  warnings: ToolGenerationWarning[];
} {
  const warnings: ToolGenerationWarning[] = [];
  let score = 0.32;

  if (!draft.website) {
    warnings.push("Missing website");
  } else {
    score += 0.16;
  }

  const taxonomyIssues = inspectToolTaxonomy(draft, {
    approvedCategories: options?.approvedCategories,
  }).issues.filter((issue) => issue.field !== "audiences");
  if (taxonomyIssues.length > 0) {
    warnings.push(...taxonomyIssues.map((issue) => issue.message));
    score -= Math.min(0.22, taxonomyIssues.length * 0.05);
  }

  if (!draft.pricingRange) {
    warnings.push("Missing pricing snapshot");
  } else {
    score += 0.08;
  }

  if ((draft.shortDescription?.trim().length ?? 0) < 70) {
    warnings.push("Weak metadata description");
    score -= 0.04;
  } else {
    score += 0.05;
  }

  if ((draft.useCases?.length ?? 0) > 0) {
    score += 0.1;
  }

  if ((draft.features?.length ?? 0) < 4) {
    warnings.push("Sparse features");
  } else {
    score += 0.1;
  }

  if (!draft.editorialSummary) {
    warnings.push("Missing editorial summary");
  } else {
    score += 0.06;
    if (draft.editorialSummary.trim().length < 120) {
      warnings.push("Editorial summary is too short");
      score -= 0.05;
    }
  }

  if ((draft.pros?.length ?? 0) < 3 || (draft.cons?.length ?? 0) < 2) {
    warnings.push("Missing pros/cons");
  } else {
    score += 0.06;
  }

  if ((draft.faq?.length ?? 0) < 2) {
    warnings.push("FAQ needs at least 2 items");
    score -= 0.05;
  } else {
    score += 0.04;
  }

  if (
    (draft.pricingModel === "paid" || draft.pricingModel === "custom") &&
    hasGenericPricing(draft.pricingRange)
  ) {
    warnings.push("Pricing is too vague for publish confidence");
    score -= 0.06;
  }

  if (hasDuplicateStrings(draft.features, draft.pros, draft.cons)) {
    warnings.push("Duplicate feature or review bullets");
    score -= 0.05;
  }

  const duplicateSlug = existingTools.some((tool) => tool.slug === draft.slug);
  const duplicateName = existingTools.some(
    (tool) => normalizedText(tool.name) === normalizedText(draft.name),
  );

  if (duplicateSlug) {
    warnings.push("Possible duplicate slug");
    score -= 0.18;
  }

  if (duplicateName) {
    warnings.push("Possible duplicate name");
    score -= 0.12;
  }

  return {
    confidence: Math.max(0.15, Math.min(0.98, score)),
    warnings,
  };
}

export function scorePageDraft(
  draft: Partial<CustomPage>,
  averageTopicOverlap = 0,
  options?: {
    approvedCategories?: string[];
  },
): {
  qualityScore: number;
  warnings: PageGenerationWarning[];
} {
  const warnings: PageGenerationWarning[] = [];
  let score = 38;

  if ((draft.toolSlugs?.length ?? 0) === 0) {
    warnings.push("No linked tools");
  } else {
    score += 18;
  }

  if (draft.templateType === "comparison" && (draft.toolSlugs?.length ?? 0) !== 2) {
    warnings.push("Comparison needs exactly 2 tools");
    score -= 18;
  }

  if (draft.templateType === "alternatives" && (draft.toolSlugs?.length ?? 0) < 2) {
    warnings.push("Alternatives page needs a target tool and replacements");
    score -= 14;
  }

  if (averageTopicOverlap > 0 && averageTopicOverlap < 1.4) {
    warnings.push("Weak topic overlap");
    score -= 10;
  } else if (averageTopicOverlap >= 1.4) {
    score += Math.min(18, Math.round(averageTopicOverlap * 6));
  }

  const taxonomyIssues = inspectPageTaxonomy(draft, {
    approvedCategories: options?.approvedCategories,
  }).issues;
  if (taxonomyIssues.length > 0) {
    warnings.push(...taxonomyIssues.map((issue) => issue.message));
    score -= Math.min(15, taxonomyIssues.length * 4);
  }

  if ((draft.metaDescription?.trim().length ?? 0) < 80) {
    warnings.push("Weak metadata description");
    score -= 8;
  } else {
    score += 6;
  }

  const introText = stripHtml(draft.intro);
  if (introText.length < 120) {
    warnings.push("Intro is too short");
    score -= 9;
  } else {
    score += 8;
  }

  if (!draft.editorialVerdict) {
    warnings.push("Missing editorial verdict");
  } else {
    score += 14;
    if (stripHtml(draft.editorialVerdict).length < 120) {
      warnings.push("Editorial verdict is too short");
      score -= 8;
    }
  }

  if ((draft.faq?.length ?? 0) < 2) {
    warnings.push("FAQ needs at least 2 items");
  } else {
    score += 10;
  }

  if (
    draft.intro &&
    draft.editorialVerdict &&
    stripHtml(draft.intro) === stripHtml(draft.editorialVerdict)
  ) {
    warnings.push("Intro and verdict are too similar");
    score -= 10;
  }

  return {
    qualityScore: Math.max(0, Math.min(100, score)),
    warnings,
  };
}

export function getToolPublishBlockers(
  draft: Partial<Tool>,
  existingTools: DraftCandidate[] = [],
  options?: {
    approvedCategories?: string[];
  },
) {
  const result = scoreToolDraft(draft, existingTools, options);
  const blockers = result.warnings.filter((warning) => criticalToolWarnings.has(warning));

  if ((draft.sourceConfidence ?? result.confidence) < 0.72) {
    blockers.push("Confidence is below publish threshold");
  }

  return {
    confidence: result.confidence,
    warnings: result.warnings,
    blockers: Array.from(new Set(blockers)),
  };
}

export function getPagePublishBlockers(draft: Partial<CustomPage>) {
  const result = scorePageDraft(draft, 0);
  const blockers = result.warnings.filter((warning) => criticalPageWarnings.has(warning));

  if ((draft.qualityScore ?? result.qualityScore) < 78) {
    blockers.push("Quality score is below publish threshold");
  }

  return {
    qualityScore: result.qualityScore,
    warnings: result.warnings,
    blockers: Array.from(new Set(blockers)),
  };
}
