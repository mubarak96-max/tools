import type { Tool } from "@/types/database";

import { scoreAlternative } from "@/lib/ranking/alternatives";

export function scoreComparisonPair(left: Tool, right: Tool): number {
  const sharedAlternativeScore = scoreAlternative(left, right) + scoreAlternative(right, left);

  if (left.slug === right.slug) {
    return -1;
  }

  return sharedAlternativeScore;
}
