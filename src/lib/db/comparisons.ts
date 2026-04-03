import type { ComparisonRecord } from "@/types/database";

import { getToolBySlug } from "@/lib/db/tools";
import { normalizeComparisonRecord } from "@/lib/validation/comparison";

export async function getComparisonBySlug(slug: string): Promise<ComparisonRecord | null> {
  if (!slug.includes("-vs-")) {
    return null;
  }

  const [toolA, toolB] = slug.split("-vs-");
  const [left, right] = await Promise.all([
    getToolBySlug(toolA),
    getToolBySlug(toolB),
  ]);

  if (!left || !right) {
    return null;
  }

  return normalizeComparisonRecord({
    slug,
    toolA: left.slug,
    toolB: right.slug,
    title: `${left.name} vs ${right.name}`,
    intro: `Compare ${left.name} and ${right.name} across pricing, fit, and workflow.`,
    winnerSummary: left.editorialSummary || right.editorialSummary || "",
    bestForA: left.bestFor || left.aiInsights?.bestFor,
    bestForB: right.bestFor || right.aiInsights?.bestFor,
    status: "published",
  });
}
