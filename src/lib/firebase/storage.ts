import { getAdminStorage } from "@/lib/firebase/admin";
import { slugify } from "@/lib/slug";

export function buildToolLogoPath(slug: string): string {
  return `tools/${slugify(slug)}/logo`;
}

export function buildToolScreenshotPath(slug: string, index: number): string {
  return `tools/${slugify(slug)}/screenshots/${index + 1}`;
}

export function getStorageBucket() {
  return getAdminStorage()?.bucket() ?? null;
}
