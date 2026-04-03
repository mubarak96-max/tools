import type { CustomPage, Tool } from "@/types/database";

export type ToolGenerationWarning =
  | "Missing website"
  | "Missing approved category"
  | "Possible duplicate slug"
  | "Possible duplicate name"
  | "Missing pricing snapshot"
  | "Sparse use cases"
  | "Sparse features"
  | "Missing editorial summary"
  | "Missing pros/cons";

export type PageGenerationWarning =
  | "No linked tools"
  | "Comparison needs exactly 2 tools"
  | "Alternatives page needs a target tool and replacements"
  | "Weak topic overlap"
  | "Missing editorial verdict"
  | "FAQ needs at least 2 items";

type DraftCandidate = Pick<Tool, "slug" | "name">;

function normalizedText(value: string | undefined) {
  return (value || "").trim().toLowerCase();
}

export function scoreToolDraft(
  draft: Partial<Tool>,
  existingTools: DraftCandidate[] = [],
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

  if (!draft.category) {
    warnings.push("Missing approved category");
  } else {
    score += 0.12;
  }

  if (!draft.pricingRange) {
    warnings.push("Missing pricing snapshot");
  } else {
    score += 0.08;
  }

  if ((draft.useCases?.length ?? 0) < 3) {
    warnings.push("Sparse use cases");
  } else {
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
  }

  if ((draft.pros?.length ?? 0) < 3 || (draft.cons?.length ?? 0) < 2) {
    warnings.push("Missing pros/cons");
  } else {
    score += 0.06;
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

  if (averageTopicOverlap < 1.4) {
    warnings.push("Weak topic overlap");
    score -= 10;
  } else {
    score += Math.min(18, Math.round(averageTopicOverlap * 6));
  }

  if (!draft.editorialVerdict) {
    warnings.push("Missing editorial verdict");
  } else {
    score += 14;
  }

  if ((draft.faq?.length ?? 0) < 2) {
    warnings.push("FAQ needs at least 2 items");
  } else {
    score += 10;
  }

  return {
    qualityScore: Math.max(0, Math.min(100, score)),
    warnings,
  };
}
