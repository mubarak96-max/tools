import { listPages } from "../src/lib/db/pages";
import { createCategoryRecord, listCategories } from "../src/lib/db/taxonomies";
import { listTools } from "../src/lib/db/tools";
import { slugify } from "../src/lib/slug";

import { fail, info } from "./_shared";

function buildCategoryDescription(name: string) {
  return `${name} software and tooling records curated for structured search and comparison pages.`;
}

async function main() {
  const [tools, pages, categories] = await Promise.all([
    listTools(),
    listPages(),
    listCategories(),
  ]);

  const existing = new Set(categories.map((category) => category.slug));
  const candidateNames = new Set<string>();

  for (const tool of tools) {
    for (const category of tool.categories?.length ? tool.categories : [tool.category]) {
      if (category) {
        candidateNames.add(category);
      }
    }
  }

  for (const page of pages) {
    if (page.category) {
      candidateNames.add(page.category);
    }
  }

  let created = 0;

  for (const name of [...candidateNames].sort((left, right) => left.localeCompare(right))) {
    const slug = slugify(name);
    if (!slug || existing.has(slug)) {
      continue;
    }

    await createCategoryRecord({
      slug,
      name,
      description: buildCategoryDescription(name),
      synonyms: [],
      status: "published",
    });

    info(`Created category: ${name}`);
    existing.add(slug);
    created += 1;
  }

  info(`Taxonomy sync complete. Created ${created} missing categories.`);
}

void main().catch((error) => {
  fail(error instanceof Error ? error.message : "Taxonomy sync failed.");
  process.exit(1);
});
