import type { Tool } from "@/types/database";

function overlapScore(base: string[], candidate: string[], weight: number) {
  const baseSet = new Set(base.map((value) => value.toLowerCase()));
  const candidateSet = new Set(candidate.map((value) => value.toLowerCase()));
  const overlap = [...baseSet].filter((value) => candidateSet.has(value)).length;

  return overlap * weight;
}

export function scoreAlternative(target: Tool, candidate: Tool): number {
  let score = 0;

  if (target.category === candidate.category) {
    score += 5;
  }

  if (target.pricingModel === candidate.pricingModel) {
    score += 3;
  }

  if (target.difficultyLevel === candidate.difficultyLevel) {
    score += 2;
  }

  score += overlapScore(target.useCases, candidate.useCases, 3);
  score += overlapScore(target.audiences, candidate.audiences, 2);
  score += overlapScore(target.platforms, candidate.platforms, 2);
  score += overlapScore(target.teamFit, candidate.teamFit, 2);

  return score;
}
