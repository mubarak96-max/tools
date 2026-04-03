import { z } from "zod";

import type { CustomPage, PageType, RecordStatus } from "@/types/database";
import { slugify } from "@/lib/slug";
import {
  asRecord,
  isoDateOrUndefined,
  numberOrUndefined,
  recordStatusValues,
  stringArray,
  stringOrUndefined,
} from "@/lib/validation/shared";

const recordStatusSchema = z.enum(recordStatusValues);
const pageTypeSchema = z.enum([
  "curated-list",
  "comparison",
  "alternatives",
  "category",
  "audience",
  "use-case",
  "editorial",
]);

const faqSchema = z.object({
  question: z.string().trim().min(3).max(160),
  answer: z.string().trim().min(3).max(500),
});

export const pageSchema = z.object({
  id: z.string().trim().optional(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1).max(160),
  metaDescription: z.string().trim().min(30).max(200),
  pageType: pageTypeSchema,
  category: z.string().trim().max(80).optional(),
  audience: z.string().trim().max(80).optional(),
  useCase: z.string().trim().max(120).optional(),
  toolSlugs: z.array(z.string().trim().min(1).max(120)).max(30),
  intro: z.string().trim().max(2000).optional(),
  bodySections: z.array(z.string().trim().min(1).max(4000)).max(20),
  faq: z.array(faqSchema).max(10),
  editorialVerdict: z.string().trim().max(4000).optional(),
  status: recordStatusSchema,
  qualityScore: z.number().min(0).max(100).optional(),
  sourceMethod: z.enum(["manual", "ai-assisted", "reviewed", "imported"]).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  templateType: z.enum(["curated-list", "comparison", "alternatives"]),
});

function templateTypeFromPageType(pageType: PageType): CustomPage["templateType"] {
  if (pageType === "comparison") {
    return "comparison";
  }

  if (pageType === "alternatives") {
    return "alternatives";
  }

  return "curated-list";
}

export function normalizePageRecord(
  input: unknown,
  options?: {
    id?: string;
    fallbackStatus?: RecordStatus;
  },
): CustomPage {
  const raw = asRecord(input);
  const pageType = pageTypeSchema.safeParse(raw.pageType ?? raw.templateType).success
    ? (raw.pageType ?? raw.templateType) as PageType
    : "curated-list";

  const title = stringOrUndefined(raw.title) ?? "Untitled Page";
  const slug = slugify(stringOrUndefined(raw.slug) ?? options?.id ?? title);
  const editorialVerdict =
    stringOrUndefined(raw.editorialVerdict) ?? stringOrUndefined(raw.intro);
  const status = recordStatusSchema.safeParse(raw.status).success
    ? (raw.status as RecordStatus)
    : options?.fallbackStatus ?? "published";

  return pageSchema.parse({
    id: options?.id,
    slug,
    title,
    metaDescription:
      stringOrUndefined(raw.metaDescription) ??
      `Discover curated software recommendations for ${title.toLowerCase()}.`,
    pageType,
    category: stringOrUndefined(raw.category),
    audience: stringOrUndefined(raw.audience),
    useCase: stringOrUndefined(raw.useCase),
    toolSlugs: stringArray(raw.toolSlugs),
    intro: editorialVerdict,
    bodySections: stringArray(raw.bodySections),
    faq: Array.isArray(raw.faq) ? raw.faq : [],
    editorialVerdict,
    status,
    qualityScore: numberOrUndefined(raw.qualityScore),
    sourceMethod:
      stringOrUndefined(raw.sourceMethod) as CustomPage["sourceMethod"] | undefined,
    createdAt: isoDateOrUndefined(raw.createdAt),
    updatedAt: isoDateOrUndefined(raw.updatedAt),
    templateType: templateTypeFromPageType(pageType),
  });
}

export function preparePageWrite(
  input: Partial<CustomPage>,
  options?: {
    id?: string;
    fallbackStatus?: RecordStatus;
  },
) {
  const normalized = normalizePageRecord(input, options);

  return {
    slug: normalized.slug,
    title: normalized.title,
    metaDescription: normalized.metaDescription,
    pageType: normalized.pageType,
    category: normalized.category ?? "",
    audience: normalized.audience ?? "",
    useCase: normalized.useCase ?? "",
    toolSlugs: normalized.toolSlugs,
    intro: normalized.intro ?? "",
    bodySections: normalized.bodySections,
    faq: normalized.faq,
    editorialVerdict: normalized.editorialVerdict ?? "",
    status: normalized.status,
    qualityScore: normalized.qualityScore ?? null,
    sourceMethod: normalized.sourceMethod ?? "manual",
    createdAt: normalized.createdAt ?? null,
    updatedAt: normalized.updatedAt ?? null,
    templateType: normalized.templateType,
  };
}
