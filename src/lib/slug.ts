export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function comparisonSlug(toolA: string, toolB: string): string {
  return [toolA, toolB].map(slugify).join("-vs-");
}
