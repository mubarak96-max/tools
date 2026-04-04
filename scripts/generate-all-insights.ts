import { listTools, updateToolRecord } from "../src/lib/db/tools";
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

async function main() {
  requireOpenRouterKey();
  const { flags, values } = parseArgs(process.argv.slice(2));
  const dryRun = isDryRun(flags);
  const concurrency = parseNumberArg(values, "concurrency", 2, { min: 1, max: 4 });

  const tools = await listTools();
  const tracker = createProgressTracker("insights", tools.length);

  await runWithConcurrency(tools, concurrency, async (tool) => {
    if (tool.aiInsights && tool.editorialSummary && (tool.sourceConfidence ?? 0) >= 0.82) {
      tracker.skip(tool.slug);
      return;
    }

    info(`Generating insights for ${tool.slug}`);
    try {
      const preview = await withRetry(`insights ${tool.slug}`, async () => {
        const result = await generateToolEditorialPreview(
          tool,
          tools.map((entry) => ({ slug: entry.slug, name: entry.name })),
        );

        if (!result) {
          throw new Error("Generator returned no preview.");
        }

        return result;
      });

      if (dryRun) {
        tracker.success(`dry-run ${tool.slug}`);
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
  info(
    `Insight generation complete. Updated ${summary.succeeded}, skipped ${summary.skipped}, failed ${summary.failed}.`,
  );
}

void main().catch((error) => {
  fail(error instanceof Error ? error.message : "Insight generation failed.");
  process.exit(1);
});
