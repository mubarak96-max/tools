'use server';

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  createPageRecord,
  deletePageRecord,
  getPageBySlug,
  updatePageRecord,
} from "@/lib/db/pages";
import {
  createCategoryRecord,
  deleteCategoryRecord,
  getCategoryBySlug,
  listCategories,
  updateCategoryRecord,
} from "@/lib/db/taxonomies";
import {
  createToolRecord,
  deleteToolRecord,
  getToolBySlug,
  getToolsBySlugs,
  listTools,
  updateToolRecord,
} from "@/lib/db/tools";
import { CACHE_TAGS } from "@/lib/db/shared";
import { nowIso } from "@/lib/dates";
import {
  generatePageEditorialPreview,
  generatePageStructurePreview,
} from "@/lib/generation/generate-page";
import {
  generateToolEditorialPreview,
  generateToolFactsPreview,
} from "@/lib/generation/generate-tool";
import { getPagePublishBlockers, getToolPublishBlockers } from "@/lib/generation/score";
import { slugify } from "@/lib/slug";
import { compactText } from "@/lib/text";
import type { CustomPage, Tool, ToolCategory } from "@/types/database";

function revalidateSharedPublicPaths() {
  revalidatePath("/");
  revalidatePath("/tools");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/review");
}

function revalidateSharedDataTags() {
  revalidateTag(CACHE_TAGS.tools, "max");
  revalidateTag(CACHE_TAGS.pages, "max");
  revalidateTag(CACHE_TAGS.categories, "max");
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

async function listApprovedCategoryNames() {
  const categories = await listCategories();
  return categories.map((category) => category.name);
}

async function ensureCategoryRecords(categoryNames: string[] = []) {
  const normalizedNames = Array.from(
    new Map(
      categoryNames
        .map((name) => compactText(name || ""))
        .filter(Boolean)
        .map((name) => [name.toLowerCase(), name]),
    ).values(),
  );

  for (const normalizedName of normalizedNames) {
    const slug = slugify(normalizedName);
    const existing = await getCategoryBySlug(slug);
    if (existing) {
      continue;
    }

    await createCategoryRecord({
      slug,
      name: normalizedName,
      description: `${normalizedName} tools.`,
      synonyms: [],
      status: "draft",
    });
  }
}

async function assessToolDraft(draft: Partial<Tool>, currentSlug?: string) {
  const approvedCategories = await listApprovedCategoryNames();
  const allTools = await listTools();
  const comparableTools = allTools
    .filter((tool) => tool.slug !== currentSlug)
    .map((tool) => ({ slug: tool.slug, name: tool.name }));
  const assessment = getToolPublishBlockers(
    {
      ...draft,
      sourceConfidence: undefined,
    },
    comparableTools,
    { approvedCategories },
  );

  return {
    approvedCategories,
    ...assessment,
  };
}

async function assertToolPublishableTaxonomy(draft: Partial<Tool>, currentSlug?: string) {
  const blockers = (await assessToolDraft(draft, currentSlug)).blockers;

  if (blockers.length > 0) {
    throw new Error(`Fix publish blockers before publishing: ${blockers.join("; ")}`);
  }
}

async function assertPagePublishableTaxonomy(draft: Partial<CustomPage>) {
  const blockers = getPagePublishBlockers(draft).blockers;

  if (blockers.length > 0) {
    throw new Error(`Fix publish blockers before publishing: ${blockers.join("; ")}`);
  }
}

function normalizePageDraftInput(data: Partial<CustomPage>): Partial<CustomPage> {
  const templateType =
    data.templateType ??
    (data.pageType === "comparison"
      ? "comparison"
      : data.pageType === "alternatives"
        ? "alternatives"
        : "curated-list");

  return {
    ...data,
    templateType,
    pageType: templateType,
  };
}

function assertPageTemplateShape(draft: Partial<CustomPage>) {
  const toolCount = draft.toolSlugs?.filter(Boolean).length ?? 0;

  if (draft.templateType === "comparison" && toolCount !== 2) {
    throw new Error("Comparison pages require exactly 2 selected tools.");
  }

  if (draft.templateType === "alternatives" && toolCount < 2) {
    throw new Error("Alternatives pages require at least 2 selected tools.");
  }
}

export async function createTool(data: Partial<Tool>) {
  await ensureCategoryRecords([data.category || "", ...(data.categories || [])]);
  const assessment = await assessToolDraft(data);
  const nextData = {
    ...data,
    sourceConfidence: assessment.confidence,
  };

  if (nextData.status === "published") {
    await assertToolPublishableTaxonomy(nextData);
  }

  const slug = await createToolRecord(nextData, "draft");

  revalidateSharedDataTags();
  revalidatePath("/admin/tools");
  revalidateSharedPublicPaths();
  redirect(`/admin/tools/${slug}/edit`);
}

export async function updateTool(slug: string, data: Partial<Tool>) {
  await ensureCategoryRecords([data.category || "", ...(data.categories || [])]);
  const assessment = await assessToolDraft(data, slug);
  const nextData = {
    ...data,
    sourceConfidence: assessment.confidence,
  };

  if (nextData.status === "published") {
    await assertToolPublishableTaxonomy(nextData, slug);
  }

  await updateToolRecord(slug, nextData);

  revalidateSharedDataTags();
  revalidateToolPaths(slug);
  redirect("/admin/tools");
}

export async function deleteTool(slug: string) {
  await deleteToolRecord(slug);

  revalidateSharedDataTags();
  revalidatePath("/admin/tools");
  revalidatePath("/admin/review");
  revalidatePath(`/tools/${slug}`);
  revalidateSharedPublicPaths();
}

export async function generateFullToolProfile(toolName: string, config: { categories: string[] }) {
  const approvedCategories = await listApprovedCategoryNames();
  const facts = await generateToolFactsPreview({
    toolName,
    categories: approvedCategories.length > 0 ? approvedCategories : config.categories,
  });
  if (!facts) {
    throw new Error("Failed to generate AI insights from OpenRouter.");
  }

  const editorial = await generateToolEditorialPreview(facts.draft, [], {
    approvedCategories,
  });
  if (!editorial) {
    throw new Error("Failed to generate AI editorial layer.");
  }

  return {
    slug: editorial.draft.slug || slugify(toolName),
    category: editorial.draft.category || "",
    pricing_model: editorial.draft.pricingModel || "freemium",
    difficulty_level: editorial.draft.difficultyLevel || "intermediate",
    price_range: editorial.draft.pricingRange || "",
    starting_price: editorial.draft.startingPrice,
    starting_price_currency: editorial.draft.startingPriceCurrency || "",
    billing_period: editorial.draft.billingPeriod || "",
    has_free_plan: editorial.draft.hasFreePlan ?? false,
    has_free_trial: editorial.draft.hasFreeTrial ?? false,
    description: editorial.draft.shortDescription || editorial.draft.description || "",
    use_cases: editorial.draft.useCases || [],
    features: editorial.draft.features || [],
    platforms: editorial.draft.platforms || [],
    integrations: editorial.draft.integrations || [],
    audiences: editorial.draft.audiences || [],
    team_fit: editorial.draft.teamFit || [],
    setup_time: editorial.draft.setupTime || "",
    why_this_tool: editorial.draft.editorialSummary || "",
    comparison_summary: editorial.draft.aiInsights?.comparisonSummary || "",
    best_for: editorial.draft.bestFor || "",
    anti_recommendation: editorial.draft.notIdealFor || "",
    pros: editorial.draft.pros || [],
    cons: editorial.draft.cons || [],
    faq: editorial.draft.faq || [],
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
  const nextData = normalizePageDraftInput(data);
  assertPageTemplateShape(nextData);

  if (nextData.status === "published") {
    await assertPagePublishableTaxonomy(nextData);
  }

  const slug = await createPageRecord(nextData, "draft");

  revalidateSharedDataTags();
  revalidatePagePaths(slug);
  redirect(`/admin/pages/${slug}/edit`);
}

export async function updatePage(slug: string, data: Partial<CustomPage>) {
  const nextData = normalizePageDraftInput(data);
  assertPageTemplateShape(nextData);

  if (nextData.status === "published") {
    await assertPagePublishableTaxonomy(nextData);
  }

  await updatePageRecord(slug, nextData);

  revalidateSharedDataTags();
  revalidatePagePaths(slug);
  redirect("/admin/pages");
}

export async function deletePage(slug: string) {
  await deletePageRecord(slug);

  revalidateSharedDataTags();
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
  const approvedCategories = await listApprovedCategoryNames();
  const preview = await generateToolFactsPreview({
    toolName: input.toolName,
    website: input.website,
    categories: approvedCategories.length > 0 ? approvedCategories : input.categories,
    existingTools,
  });

  if (!preview) {
    throw new Error("Failed to generate structured tool facts.");
  }

  return preview;
}

export async function previewGeneratedToolEditorial(draft: Partial<Tool>) {
  const existingTools = (await listTools()).map((tool) => ({ slug: tool.slug, name: tool.name }));
  const preview = await generateToolEditorialPreview(draft, existingTools, {
    approvedCategories: await listApprovedCategoryNames(),
  });

  if (!preview) {
    throw new Error("Failed to generate editorial copy for this tool.");
  }

  return preview;
}

export async function saveGeneratedToolDraft(draft: Partial<Tool>) {
  if (draft.status === "published") {
    await assertToolPublishableTaxonomy(draft);
  }

  const slug = await createToolRecord(
    {
      ...draft,
      sourceConfidence: draft.sourceConfidence ?? estimateToolConfidence({}),
      status: draft.status ?? "review",
      aiLastGeneratedAt: draft.aiLastGeneratedAt ?? nowIso(),
    },
    draft.status ?? "review",
  );

  revalidateSharedDataTags();
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
  const nextDraft = normalizePageDraftInput(draft);
  assertPageTemplateShape(nextDraft);

  if (nextDraft.status === "published") {
    await assertPagePublishableTaxonomy(nextDraft);
  }

  const slug = await createPageRecord(
    {
      ...nextDraft,
      slug: nextDraft.slug || slugify(nextDraft.title || "generated-page"),
      pageType: nextDraft.pageType || nextDraft.templateType || "curated-list",
      templateType: nextDraft.templateType || "curated-list",
      sourceMethod: nextDraft.sourceMethod || "ai-assisted",
      status: nextDraft.status || "review",
    },
    nextDraft.status || "review",
  );

  revalidateSharedDataTags();
  revalidatePagePaths(slug);
  redirect(`/admin/pages/${slug}/edit`);
}

export async function approveToolForPublish(slug: string) {
  const tool = await getToolBySlug(slug, { includeDrafts: true });

  if (!tool) {
    throw new Error("Tool not found.");
  }

  const assessment = await assessToolDraft(tool, slug);
  await assertToolPublishableTaxonomy(tool, slug);

  await updateToolRecord(slug, {
    ...tool,
    status: "published",
    sourceConfidence: assessment.confidence,
    factsLastVerifiedAt: nowIso(),
  });

  revalidateSharedDataTags();
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

  revalidateSharedDataTags();
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

  revalidateSharedDataTags();
  revalidateToolPaths(slug);
}

export async function approvePageForPublish(slug: string) {
  const page = await getPageBySlug(slug, { includeDrafts: true });

  if (!page) {
    throw new Error("Page not found.");
  }

  await assertPagePublishableTaxonomy(page);

  await updatePageRecord(slug, {
    ...page,
    status: "published",
  });

  revalidateSharedDataTags();
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

  revalidateSharedDataTags();
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

  revalidateSharedDataTags();
  revalidatePagePaths(slug);
}

export async function createCategory(data: Partial<ToolCategory>) {
  await createCategoryRecord(data);
  revalidateSharedDataTags();
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(slug: string, data: Partial<ToolCategory>) {
  await updateCategoryRecord(slug, data);
  revalidateSharedDataTags();
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(slug: string) {
  await deleteCategoryRecord(slug);
  revalidateSharedDataTags();
  revalidatePath("/admin/categories");
}
