import "server-only";

import type { ComparisonRecord } from "@/types/database";

import { scoreComparisonPair } from "@/lib/ranking/comparisons";
import { comparisonSlug } from "@/lib/slug";
import { listTools, getToolBySlug } from "@/lib/db/tools";
import { normalizeComparisonRecord } from "@/lib/validation/comparison";

const MAX_STATIC_COMPARISON_PAGES = 120;

export async function listComparisonSlugs() {
  const tools = await listTools({ status: ["published"] });

  return tools
    .flatMap((tool, index) =>
      tools.slice(index + 1).map((candidate) => ({
        slug: comparisonSlug(tool.slug, candidate.slug),
        score: scoreComparisonPair(tool, candidate),
      })),
    )
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.slug.localeCompare(right.slug))
    .slice(0, MAX_STATIC_COMPARISON_PAGES)
    .map((entry) => entry.slug);
}

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
