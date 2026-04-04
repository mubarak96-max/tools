import type { Tool } from "@/types/database";

function normalizedValues(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean)));
}

function overlapScore(base: string[], candidate: string[], weight: number) {
  const baseSet = new Set(normalizedValues(base));
  const candidateSet = new Set(normalizedValues(candidate));
  const overlap = [...baseSet].filter((value) => candidateSet.has(value)).length;

  return overlap * weight;
}

function overlapRatio(base: string[], candidate: string[]) {
  const baseSet = new Set(normalizedValues(base));
  const candidateSet = new Set(normalizedValues(candidate));

  if (baseSet.size === 0 || candidateSet.size === 0) {
    return 0;
  }

  const overlap = [...baseSet].filter((value) => candidateSet.has(value)).length;

  return overlap / Math.max(baseSet.size, candidateSet.size);
}

function sharedCount(base: string[], candidate: string[]) {
  const baseSet = new Set(normalizedValues(base));
  const candidateSet = new Set(normalizedValues(candidate));

  return [...baseSet].filter((value) => candidateSet.has(value)).length;
}

export type AlternativeScoreDetail = {
  score: number;
  sharedCategory: boolean;
  sharedUseCases: number;
  sharedAudiences: number;
  sharedPlatforms: number;
  sharedTeamFit: number;
  sharedIntegrations: number;
  pricingSimilarity: number;
};

export function scoreAlternativeDetailed(target: Tool, candidate: Tool): AlternativeScoreDetail {
  let score = 0;
  const sharedCategory = target.category === candidate.category;
  const sharedUseCases = sharedCount(target.useCases, candidate.useCases);
  const sharedAudiences = sharedCount(target.audiences, candidate.audiences);
  const sharedPlatforms = sharedCount(target.platforms, candidate.platforms);
  const sharedTeamFit = sharedCount(target.teamFit, candidate.teamFit);
  const sharedIntegrations = sharedCount(target.integrations, candidate.integrations);

  if (sharedCategory) {
    score += 6;
  }

  let pricingSimilarity = 0;
  if (target.pricingModel === candidate.pricingModel) {
    pricingSimilarity += 3;
  }

  if (target.hasFreePlan === candidate.hasFreePlan) {
    pricingSimilarity += 1.2;
  }

  if (target.hasFreeTrial === candidate.hasFreeTrial) {
    pricingSimilarity += 0.6;
  }
  score += pricingSimilarity;

  if (target.difficultyLevel === candidate.difficultyLevel) {
    score += 1.8;
  }

  score += overlapScore(target.useCases, candidate.useCases, 3.5);
  score += overlapScore(target.audiences, candidate.audiences, 2.5);
  score += overlapScore(target.platforms, candidate.platforms, 2.2);
  score += overlapScore(target.teamFit, candidate.teamFit, 1.8);
  score += overlapScore(target.integrations, candidate.integrations, 1.2);

  if (!sharedCategory && overlapRatio(target.useCases, candidate.useCases) === 0) {
    score -= 3.5;
  }

  if ((target.sourceConfidence ?? 0.5) < 0.45 || (candidate.sourceConfidence ?? 0.5) < 0.45) {
    score -= 0.75;
  }

  return {
    score,
    sharedCategory,
    sharedUseCases,
    sharedAudiences,
    sharedPlatforms,
    sharedTeamFit,
    sharedIntegrations,
    pricingSimilarity,
  };
}

export function scoreAlternative(target: Tool, candidate: Tool): number {
  return scoreAlternativeDetailed(target, candidate).score;
}
