export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeComparisonPair(toolA: string, toolB: string) {
  return [slugify(toolA), slugify(toolB)].sort((left, right) => left.localeCompare(right));
}

export function comparisonPairKey(toolA: string, toolB: string): string {
  return normalizeComparisonPair(toolA, toolB).join("::");
}

export function comparisonSlug(toolA: string, toolB: string): string {
  return normalizeComparisonPair(toolA, toolB).join("-vs-");
}

export function getComparisonPath(toolA: string, toolB: string): string {
  return `/compare/${comparisonSlug(toolA, toolB)}`;
}
