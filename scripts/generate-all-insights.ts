import { listTools, updateToolRecord } from "../src/lib/db/tools";
import { generateToolEditorialPreview } from "../src/lib/generation/generate-tool";

import { fail, info, requireOpenRouterKey, sleep } from "./_shared";

async function main() {
  requireOpenRouterKey();

  const tools = await listTools();
  let generated = 0;
  let skipped = 0;

  for (const tool of tools) {
    if (tool.aiInsights && tool.editorialSummary && (tool.sourceConfidence ?? 0) >= 0.82) {
      skipped += 1;
      continue;
    }

    info(`Generating insights for ${tool.slug}`);
    const preview = await generateToolEditorialPreview(
      tool,
      tools.map((entry) => ({ slug: entry.slug, name: entry.name })),
    );

    if (!preview) {
      fail(`Failed to generate insights for ${tool.slug}`);
      continue;
    }

    await updateToolRecord(tool.slug, {
      ...tool,
      ...preview.draft,
      sourceConfidence: preview.confidence,
      status: preview.draft.status ?? "review",
    });

    generated += 1;
    await sleep(500);
  }

  info(`Insight generation complete. Generated ${generated}, skipped ${skipped}.`);
}

void main().catch((error) => {
  fail(error instanceof Error ? error.message : "Insight generation failed.");
  process.exit(1);
});
