import { createPageRecord, listPages } from "../src/lib/db/pages";
import { listTools } from "../src/lib/db/tools";
import {
  generatePageEditorialPreview,
  generatePageStructurePreview,
} from "../src/lib/generation/generate-page";
import { slugify } from "../src/lib/slug";

import {
  createProgressTracker,
  fail,
  info,
  isDryRun,
  parseArgs,
  parseNumberArg,
  requireOpenRouterKey,
  runWithConcurrency,
  withRetry,
} from "./_shared";

async function main() {
  requireOpenRouterKey();

  const { flags, values } = parseArgs(process.argv.slice(2));
  const limit = parseNumberArg(values, "limit", 5, { min: 1, max: 50 });
  const concurrency = parseNumberArg(values, "concurrency", 2, { min: 1, max: 4 });
  const dryRun = isDryRun(flags);

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

  const tracker = createProgressTracker("backfill", candidates.length);

  await runWithConcurrency(candidates, concurrency, async ([useCase]) => {
    const topic = `Best tools for ${useCase}`;
    const fallbackSlug = slugify(topic);
    if (existingSlugs.has(fallbackSlug)) {
      tracker.skip(`existing ${fallbackSlug}`);
      return;
    }

    try {
      const structure = await withRetry(`page structure ${fallbackSlug}`, () =>
        generatePageStructurePreview({
          topic,
          templateType: "curated-list",
          availableTools: tools,
        }),
      );

      if (structure.selectedTools.length === 0) {
        tracker.skip(`${fallbackSlug}: no deterministic candidates`);
        return;
      }

      const editorial = await withRetry(`page editorial ${fallbackSlug}`, async () => {
        const result = await generatePageEditorialPreview({
          topic,
          templateType: "curated-list",
          draft: structure.draft,
          selectedTools: structure.selectedTools,
        });

        if (!result) {
          throw new Error("Generator returned no preview.");
        }

        return result;
      });

      const candidateSlug = editorial.draft.slug || fallbackSlug;
      if (existingSlugs.has(candidateSlug)) {
        tracker.skip(`existing ${candidateSlug}`);
        return;
      }

      if (dryRun) {
        existingSlugs.add(candidateSlug);
        tracker.success(`dry-run ${candidateSlug}`);
        return;
      }

      const slug = await createPageRecord(
        {
          ...editorial.draft,
          slug: candidateSlug,
          useCase,
          sourceMethod: "ai-assisted",
          status: editorial.draft.status || "review",
        },
        editorial.draft.status || "review",
      );

      existingSlugs.add(slug);
      tracker.success(slug);
    } catch (error) {
      tracker.failure(`${fallbackSlug}: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  });

  const summary = tracker.summary();
  info(
    `Backfill complete. Created ${summary.succeeded} page drafts, skipped ${summary.skipped}, failed ${summary.failed}.`,
  );
}

void main().catch((error) => {
  fail(error instanceof Error ? error.message : "Page backfill failed.");
  process.exit(1);
});
