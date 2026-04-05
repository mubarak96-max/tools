import type { Tool } from "@/types/database";

import { scoreAlternativeDetailed } from "@/lib/ranking/alternatives";
import { comparisonPairKey } from "@/lib/slug";

export type ComparisonScoreDetail = {
  key: string;
  score: number;
  categoryMatch: boolean;
  audienceOverlap: number;
  useCaseOverlap: number;
  pricingParity: boolean;
};

export function scoreComparisonPairDetailed(left: Tool, right: Tool): ComparisonScoreDetail {
  if (left.slug === right.slug) {
    return {
      key: comparisonPairKey(left.slug, right.slug),
      score: -1,
      categoryMatch: false,
      audienceOverlap: 0,
      useCaseOverlap: 0,
      pricingParity: false,
    };
  }

  const leftDetail = scoreAlternativeDetailed(left, right);
  const rightDetail = scoreAlternativeDetailed(right, left);
  const leftCategories = new Set((left.categories?.length ? left.categories : [left.category]).map((value) => value.toLowerCase()));
  const rightCategories = new Set((right.categories?.length ? right.categories : [right.category]).map((value) => value.toLowerCase()));
  const categoryMatch = [...leftCategories].some((value) => rightCategories.has(value));
  const useCaseOverlap = Math.min(leftDetail.sharedUseCases, rightDetail.sharedUseCases);
  const audienceOverlap = Math.min(leftDetail.sharedAudiences, rightDetail.sharedAudiences);
  const pricingParity = left.pricingModel === right.pricingModel;
  let score = leftDetail.score + rightDetail.score;

  if (categoryMatch) {
    score += 2;
  }

  if (!categoryMatch && useCaseOverlap === 0 && audienceOverlap === 0) {
    score -= 6;
  }

  if (pricingParity) {
    score += 1;
  }

  return {
    key: comparisonPairKey(left.slug, right.slug),
    score,
    categoryMatch,
    audienceOverlap,
    useCaseOverlap,
    pricingParity,
  };
}

export function scoreComparisonPair(left: Tool, right: Tool): number {
  return scoreComparisonPairDetailed(left, right).score;
}
