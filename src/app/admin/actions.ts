'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createPageRecord,
  deletePageRecord,
  getPageBySlug,
  updatePageRecord,
} from "@/lib/db/pages";
import { createCategoryRecord, deleteCategoryRecord, updateCategoryRecord } from "@/lib/db/taxonomies";
import {
  createToolRecord,
  deleteToolRecord,
  getToolBySlug,
  getToolsBySlugs,
  listTools,
  updateToolRecord,
} from "@/lib/db/tools";
import { nowIso } from "@/lib/dates";
import {
  generatePageEditorialPreview,
  generatePageStructurePreview,
} from "@/lib/generation/generate-page";
import {
  generateToolEditorialPreview,
  generateToolFactsPreview,
} from "@/lib/generation/generate-tool";
import { slugify } from "@/lib/slug";
import type { CustomPage, Tool, ToolCategory } from "@/types/database";

function revalidateSharedPublicPaths() {
  revalidatePath("/");
  revalidatePath("/tools");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/review");
}

function revalidateToolPaths(slug: string) {
  revalidatePath("/admin/tools");
  revalidatePath(`/admin/tools/${slug}/edit`);
  revalidatePath(`/tools/${slug}`);
  revalidateSharedPublicPaths();
}

function revalidatePagePaths(slug: string) {
  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${slug}/edit`);
  revalidatePath(`/p/${slug}`);
  revalidateSharedPublicPaths();
}

function estimateToolConfidence(profile: {
  website?: string;
  category?: string;
  price_range?: string;
  features?: string[];
  use_cases?: string[];
}) {
  let score = 0.35;

  if (profile.website) score += 0.2;
  if (profile.category) score += 0.15;
  if (profile.price_range) score += 0.1;
  if ((profile.features?.length ?? 0) >= 5) score += 0.1;
  if ((profile.use_cases?.length ?? 0) >= 5) score += 0.1;

  return Math.min(score, 0.95);
}

export async function createTool(data: Partial<Tool>) {
  const slug = await createToolRecord(data, "draft");

  revalidatePath("/admin/tools");
  revalidateSharedPublicPaths();
  redirect(`/admin/tools/${slug}/edit`);
}

export async function updateTool(slug: string, data: Partial<Tool>) {
  await updateToolRecord(slug, data);

  revalidateToolPaths(slug);
  redirect("/admin/tools");
}

export async function deleteTool(slug: string) {
  await deleteToolRecord(slug);

  revalidatePath("/admin/tools");
  revalidatePath("/admin/review");
  revalidatePath(`/tools/${slug}`);
  revalidateSharedPublicPaths();
}

export async function generateFullToolProfile(toolName: string, config: { categories: string[] }) {
  const facts = await generateToolFactsPreview({
    toolName,
    categories: config.categories,
  });
  if (!facts) {
    throw new Error("Failed to generate AI insights from OpenRouter.");
  }

  const editorial = await generateToolEditorialPreview(facts.draft);
  if (!editorial) {
    throw new Error("Failed to generate AI editorial layer.");
  }

  return {
    slug: editorial.draft.slug || slugify(toolName),
    category: editorial.draft.category || "",
    pricing_model: editorial.draft.pricingModel || "freemium",
    difficulty_level: editorial.draft.difficultyLevel || "intermediate",
    price_range: editorial.draft.pricingRange || "",
    description: editorial.draft.shortDescription || editorial.draft.description || "",
    use_cases: editorial.draft.useCases || [],
    features: editorial.draft.features || [],
    platforms: editorial.draft.platforms || [],
    why_this_tool: editorial.draft.editorialSummary || "",
    comparison_summary: editorial.draft.aiInsights?.comparisonSummary || "",
    best_for: editorial.draft.bestFor || "",
    anti_recommendation: editorial.draft.notIdealFor || "",
    pros: editorial.draft.pros || [],
    cons: editorial.draft.cons || [],
    website: editorial.draft.website || "",
  };
}

export async function autoCreateTool(toolName: string, config: { categories: string[] }) {
  const preview = await previewGeneratedToolFacts({
    toolName,
    categories: config.categories,
  });
  const completed = await previewGeneratedToolEditorial(preview.draft);
  await saveGeneratedToolDraft(completed.draft);
}

export async function createPage(data: Partial<CustomPage>) {
  const slug = await createPageRecord(data, "draft");

  revalidatePagePaths(slug);
  redirect(`/admin/pages/${slug}/edit`);
}

export async function updatePage(slug: string, data: Partial<CustomPage>) {
  await updatePageRecord(slug, data);

  revalidatePagePaths(slug);
  redirect("/admin/pages");
}

export async function deletePage(slug: string) {
  await deletePageRecord(slug);

  revalidatePath("/admin/pages");
  revalidatePath("/admin/review");
  revalidatePath(`/p/${slug}`);
}

export async function autoCreateCustomPage(
  topic: string,
  templateType: "comparison" | "alternatives" | "curated-list",
  toolsList: { slug: string; name: string; category: string }[],
) {
  const publishedTools = (await listTools({ status: ["published"] })).filter((tool) =>
    toolsList.some((candidate) => candidate.slug === tool.slug),
  );
  const structure = await generatePageStructurePreview({
    topic,
    templateType,
    availableTools: publishedTools,
  });
  const editorial = await generatePageEditorialPreview({
    topic,
    templateType,
    draft: structure.draft,
    selectedTools: structure.selectedTools,
  });

  if (!editorial) {
    throw new Error("Failed to generate the custom page draft.");
  }

  await saveGeneratedPageDraft(editorial.draft);
}

export async function previewGeneratedToolFacts(input: {
  toolName: string;
  website?: string;
  categories: string[];
}) {
  const existingTools = (await listTools()).map((tool) => ({ slug: tool.slug, name: tool.name }));
  const preview = await generateToolFactsPreview({
    toolName: input.toolName,
    website: input.website,
    categories: input.categories,
    existingTools,
  });

  if (!preview) {
    throw new Error("Failed to generate structured tool facts.");
  }

  return preview;
}

export async function previewGeneratedToolEditorial(draft: Partial<Tool>) {
  const existingTools = (await listTools()).map((tool) => ({ slug: tool.slug, name: tool.name }));
  const preview = await generateToolEditorialPreview(draft, existingTools);

  if (!preview) {
    throw new Error("Failed to generate editorial copy for this tool.");
  }

  return preview;
}

export async function saveGeneratedToolDraft(draft: Partial<Tool>) {
  const slug = await createToolRecord(
    {
      ...draft,
      sourceConfidence: draft.sourceConfidence ?? estimateToolConfidence({}),
      status: draft.status ?? "review",
      aiLastGeneratedAt: draft.aiLastGeneratedAt ?? nowIso(),
    },
    draft.status ?? "review",
  );

  revalidateToolPaths(slug);
  redirect(`/admin/tools/${slug}/edit`);
}

export async function previewGeneratedPageStructure(input: {
  topic: string;
  templateType: CustomPage["templateType"];
}) {
  const tools = await listTools({ status: ["published"] });
  return generatePageStructurePreview({
    topic: input.topic,
    templateType: input.templateType,
    availableTools: tools,
  });
}

export async function previewGeneratedPageEditorial(input: {
  topic: string;
  templateType: CustomPage["templateType"];
  draft: Partial<CustomPage>;
  selectedToolSlugs: string[];
}) {
  const selectedTools = await getToolsBySlugs(input.selectedToolSlugs, { includeDrafts: true });
  const preview = await generatePageEditorialPreview({
    topic: input.topic,
    templateType: input.templateType,
    draft: input.draft,
    selectedTools,
  });

  if (!preview) {
    throw new Error("Failed to generate editorial blocks for this page.");
  }

  return preview;
}

export async function saveGeneratedPageDraft(draft: Partial<CustomPage>) {
  const slug = await createPageRecord(
    {
      ...draft,
      slug: draft.slug || slugify(draft.title || "generated-page"),
      pageType: draft.pageType || draft.templateType || "curated-list",
      templateType: draft.templateType || "curated-list",
      sourceMethod: draft.sourceMethod || "ai-assisted",
      status: draft.status || "review",
    },
    draft.status || "review",
  );

  revalidatePagePaths(slug);
  redirect(`/admin/pages/${slug}/edit`);
}

export async function approveToolForPublish(slug: string) {
  const tool = await getToolBySlug(slug, { includeDrafts: true });

  if (!tool) {
    throw new Error("Tool not found.");
  }

  await updateToolRecord(slug, {
    ...tool,
    status: "published",
    factsLastVerifiedAt: nowIso(),
  });

  revalidateToolPaths(slug);
}

export async function returnToolToDraft(slug: string) {
  const tool = await getToolBySlug(slug, { includeDrafts: true });

  if (!tool) {
    throw new Error("Tool not found.");
  }

  await updateToolRecord(slug, {
    ...tool,
    status: "draft",
  });

  revalidateToolPaths(slug);
}

export async function regenerateToolEditorial(slug: string) {
  const tool = await getToolBySlug(slug, { includeDrafts: true });

  if (!tool) {
    throw new Error("Tool not found.");
  }

  const preview = await previewGeneratedToolEditorial(tool);
  await updateToolRecord(slug, {
    ...tool,
    ...preview.draft,
    status: preview.draft.status ?? "review",
    sourceConfidence: preview.confidence,
  });

  revalidateToolPaths(slug);
}

export async function approvePageForPublish(slug: string) {
  const page = await getPageBySlug(slug, { includeDrafts: true });

  if (!page) {
    throw new Error("Page not found.");
  }

  await updatePageRecord(slug, {
    ...page,
    status: "published",
  });

  revalidatePagePaths(slug);
}

export async function returnPageToDraft(slug: string) {
  const page = await getPageBySlug(slug, { includeDrafts: true });

  if (!page) {
    throw new Error("Page not found.");
  }

  await updatePageRecord(slug, {
    ...page,
    status: "draft",
  });

  revalidatePagePaths(slug);
}

export async function regeneratePageEditorial(slug: string) {
  const page = await getPageBySlug(slug, { includeDrafts: true });

  if (!page) {
    throw new Error("Page not found.");
  }

  const selectedTools = await getToolsBySlugs(page.toolSlugs, { includeDrafts: true });

  if (selectedTools.length === 0) {
    throw new Error("Page has no linked tools to regenerate against.");
  }

  const preview = await generatePageEditorialPreview({
    topic: page.useCase || page.title,
    templateType: page.templateType,
    draft: page,
    selectedTools,
  });

  if (!preview) {
    throw new Error("Failed to regenerate page editorial.");
  }

  await updatePageRecord(slug, {
    ...page,
    ...preview.draft,
    status: preview.draft.status ?? "review",
    qualityScore: preview.qualityScore,
  });

  revalidatePagePaths(slug);
}

export async function createCategory(data: Partial<ToolCategory>) {
  await createCategoryRecord(data);
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(slug: string, data: Partial<ToolCategory>) {
  await updateCategoryRecord(slug, data);
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(slug: string) {
  await deleteCategoryRecord(slug);
  revalidatePath("/admin/categories");
}
