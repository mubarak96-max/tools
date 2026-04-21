export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function comparisonSlug(leftSlug: string, rightSlug: string) {
  return [slugify(leftSlug), slugify(rightSlug)].sort().join("-vs-");
}
