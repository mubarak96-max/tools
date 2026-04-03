import { getPageBySlug, listPages, updatePageRecord } from "../src/lib/db/pages";
import { getToolsBySlugs, getToolBySlug, listTools, updateToolRecord } from "../src/lib/db/tools";
import { generatePageEditorialPreview } from "../src/lib/generation/generate-page";
import { generateToolEditorialPreview } from "../src/lib/generation/generate-tool";

import { fail, info, parseArgs, requireOpenRouterKey, sleep } from "./_shared";

async function regenerateTools(slugFilter?: string) {
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

  for (const tool of tools) {
    if (!tool) {
      continue;
    }

    info(`Regenerating tool editorial: ${tool.slug}`);
    const preview = await generateToolEditorialPreview(tool, tools.map((entry) => ({ slug: entry.slug, name: entry.name })));

    if (!preview) {
      fail(`Failed to regenerate tool editorial for ${tool.slug}`);
      continue;
    }

    await updateToolRecord(tool.slug, {
      ...tool,
      ...preview.draft,
      sourceConfidence: preview.confidence,
      status: preview.draft.status ?? "review",
    });

    await sleep(500);
  }
}

async function regeneratePages(slugFilter?: string) {
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

  for (const page of pages) {
    if (!page) {
      continue;
    }

    const selectedTools = await getToolsBySlugs(page.toolSlugs, { includeDrafts: true });
    if (selectedTools.length === 0) {
      fail(`Skipping ${page.slug}: no linked tools.`);
      continue;
    }

    info(`Regenerating page editorial: ${page.slug}`);
    const preview = await generatePageEditorialPreview({
      topic: page.useCase || page.title,
      templateType: page.templateType,
      draft: page,
      selectedTools,
    });

    if (!preview) {
      fail(`Failed to regenerate page editorial for ${page.slug}`);
      continue;
    }

    await updatePageRecord(page.slug, {
      ...page,
      ...preview.draft,
      qualityScore: preview.qualityScore,
      status: preview.draft.status ?? "review",
    });

    await sleep(500);
  }
}

async function main() {
  requireOpenRouterKey();

  const { flags, values } = parseArgs(process.argv.slice(2));
  const runTools = flags.has("tools") || (!flags.has("tools") && !flags.has("pages"));
  const runPages = flags.has("pages") || (!flags.has("tools") && !flags.has("pages"));
  const slug = values.get("slug");

  if (runTools) {
    await regenerateTools(slug);
  }

  if (runPages) {
    await regeneratePages(slug);
  }

  info("Editorial regeneration complete.");
}

void main().catch((error) => {
  fail(error instanceof Error ? error.message : "Editorial regeneration failed.");
  process.exit(1);
});
