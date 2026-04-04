import { getPageBySlug, listPages, updatePageRecord } from "../src/lib/db/pages";
import { getToolsBySlugs, getToolBySlug, listTools, updateToolRecord } from "../src/lib/db/tools";
import { generatePageEditorialPreview } from "../src/lib/generation/generate-page";
import { generateToolEditorialPreview } from "../src/lib/generation/generate-tool";

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

async function regenerateTools(
  slugFilter: string | undefined,
  options: {
    concurrency: number;
    dryRun: boolean;
  },
) {
  const tools: Awaited<ReturnType<typeof listTools>> = slugFilter
    ? [await getToolBySlug(slugFilter, { includeDrafts: true })].filter(
        (tool): tool is NonNullable<Awaited<ReturnType<typeof getToolBySlug>>> => Boolean(tool),
      )
    : (await listTools()).filter(
        (tool) =>
          tool.status !== "published" ||
          !tool.editorialSummary ||
          !tool.aiInsights ||
          (tool.sourceConfidence ?? 1) < 0.82,
      );

  const tracker = createProgressTracker("tools", tools.length);

  await runWithConcurrency(tools, options.concurrency, async (tool) => {
    info(`Regenerating tool editorial: ${tool.slug}`);

    try {
      const preview = await withRetry(`tool editorial ${tool.slug}`, async () => {
        const result = await generateToolEditorialPreview(
          tool,
          tools.map((entry) => ({ slug: entry.slug, name: entry.name })),
        );

        if (!result) {
          throw new Error("Generator returned no preview.");
        }

        return result;
      });

      if (options.dryRun) {
        tracker.success(`dry-run ${tool.slug} (${Math.round(preview.confidence * 100)}%)`);
        return;
      }

      await updateToolRecord(tool.slug, {
        ...tool,
        ...preview.draft,
        sourceConfidence: preview.confidence,
        status: preview.draft.status ?? "review",
      });

      tracker.success(tool.slug);
    } catch (error) {
      tracker.failure(`${tool.slug}: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  });

  const summary = tracker.summary();
  info(`Tool regeneration summary: ${summary.succeeded} updated, ${summary.failed} failed.`);
}

async function regeneratePages(
  slugFilter: string | undefined,
  options: {
    concurrency: number;
    dryRun: boolean;
  },
) {
  const pages: Awaited<ReturnType<typeof listPages>> = slugFilter
    ? [await getPageBySlug(slugFilter, { includeDrafts: true })].filter(
        (page): page is NonNullable<Awaited<ReturnType<typeof getPageBySlug>>> => Boolean(page),
      )
    : (await listPages()).filter(
        (page) =>
          page.status !== "published" ||
          !page.editorialVerdict ||
          (page.qualityScore ?? 0) < 78,
      );

  const tracker = createProgressTracker("pages", pages.length);

  await runWithConcurrency(pages, options.concurrency, async (page) => {
    try {
      const selectedTools = await getToolsBySlugs(page.toolSlugs, { includeDrafts: true });
      if (selectedTools.length === 0) {
        tracker.skip(`${page.slug}: no linked tools`);
        return;
      }

      info(`Regenerating page editorial: ${page.slug}`);
      const preview = await withRetry(`page editorial ${page.slug}`, async () => {
        const result = await generatePageEditorialPreview({
          topic: page.useCase || page.title,
          templateType: page.templateType,
          draft: page,
          selectedTools,
        });

        if (!result) {
          throw new Error("Generator returned no preview.");
        }

        return result;
      });

      if (options.dryRun) {
        tracker.success(`dry-run ${page.slug} (${preview.qualityScore}%)`);
        return;
      }

      await updatePageRecord(page.slug, {
        ...page,
        ...preview.draft,
        qualityScore: preview.qualityScore,
        status: preview.draft.status ?? "review",
      });

      tracker.success(page.slug);
    } catch (error) {
      tracker.failure(`${page.slug}: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  });

  const summary = tracker.summary();
  info(
    `Page regeneration summary: ${summary.succeeded} updated, ${summary.failed} failed, ${summary.skipped} skipped.`,
  );
}

async function main() {
  requireOpenRouterKey();

  const { flags, values } = parseArgs(process.argv.slice(2));
  const runTools = flags.has("tools") || (!flags.has("tools") && !flags.has("pages"));
  const runPages = flags.has("pages") || (!flags.has("tools") && !flags.has("pages"));
  const slug = values.get("slug");
  const concurrency = parseNumberArg(values, "concurrency", 2, { min: 1, max: 4 });
  const dryRun = isDryRun(flags);

  info(`Editorial regeneration starting. dryRun=${dryRun} concurrency=${concurrency}`);

  if (runTools) {
    await regenerateTools(slug, { concurrency, dryRun });
  }

  if (runPages) {
    await regeneratePages(slug, { concurrency, dryRun });
  }

  info("Editorial regeneration complete.");
}

void main().catch((error) => {
  fail(error instanceof Error ? error.message : "Editorial regeneration failed.");
  process.exit(1);
});
