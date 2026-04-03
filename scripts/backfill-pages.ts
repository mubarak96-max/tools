import { createPageRecord, listPages } from "../src/lib/db/pages";
import { listTools } from "../src/lib/db/tools";
import {
  generatePageEditorialPreview,
  generatePageStructurePreview,
} from "../src/lib/generation/generate-page";
import { slugify } from "../src/lib/slug";

import { fail, info, parseArgs, requireOpenRouterKey, sleep } from "./_shared";

async function main() {
  requireOpenRouterKey();

  const { values } = parseArgs(process.argv.slice(2));
  const limit = Number(values.get("limit") || "5");

  const [tools, pages] = await Promise.all([
    listTools({ status: ["published"] }),
    listPages(),
  ]);

  const existingSlugs = new Set(pages.map((page) => page.slug));
  const useCaseCounts = new Map<string, number>();

  for (const tool of tools) {
    for (const useCase of tool.useCases) {
      useCaseCounts.set(useCase, (useCaseCounts.get(useCase) || 0) + 1);
    }
  }

  const candidates = [...useCaseCounts.entries()]
    .filter(([, count]) => count >= 2)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit);

  let created = 0;

  for (const [useCase] of candidates) {
    const topic = `Best tools for ${useCase}`;
    const fallbackSlug = slugify(topic);
    if (existingSlugs.has(fallbackSlug)) {
      info(`Skipping existing page: ${fallbackSlug}`);
      continue;
    }

    const structure = await generatePageStructurePreview({
      topic,
      templateType: "curated-list",
      availableTools: tools,
    });

    if (structure.selectedTools.length === 0) {
      info(`Skipping ${topic}: no deterministic candidates.`);
      continue;
    }

    const editorial = await generatePageEditorialPreview({
      topic,
      templateType: "curated-list",
      draft: structure.draft,
      selectedTools: structure.selectedTools,
    });

    if (!editorial) {
      fail(`Failed to generate page editorial for ${topic}`);
      continue;
    }

    const slug = await createPageRecord(
      {
        ...editorial.draft,
        slug: editorial.draft.slug || fallbackSlug,
        useCase,
        sourceMethod: "ai-assisted",
        status: editorial.draft.status || "review",
      },
      editorial.draft.status || "review",
    );

    info(`Created page draft: ${slug}`);
    existingSlugs.add(slug);
    created += 1;
    await sleep(500);
  }

  info(`Backfill complete. Created ${created} page drafts.`);
}

void main().catch((error) => {
  fail(error instanceof Error ? error.message : "Page backfill failed.");
  process.exit(1);
});
