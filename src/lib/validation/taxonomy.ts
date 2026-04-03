import { z } from "zod";

import type { RecordStatus, TaxonomyRecord, TaxonomyType } from "@/types/database";
import { slugify } from "@/lib/slug";
import {
  asRecord,
  isoDateOrUndefined,
  recordStatusValues,
  stringArray,
  stringOrUndefined,
} from "@/lib/validation/shared";

const recordStatusSchema = z.enum(recordStatusValues);
const taxonomyTypeSchema = z.enum([
  "category",
  "audience",
  "use-case",
  "integration",
  "platform",
  "pricing-model",
]);

export const taxonomySchema = z.object({
  id: z.string().trim().optional(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(320),
  taxonomyType: taxonomyTypeSchema,
  iconId: z.string().trim().max(80).optional(),
  synonyms: z.array(z.string().trim().min(1).max(80)).max(20),
  status: recordStatusSchema,
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export function normalizeTaxonomyRecord(
  input: unknown,
  options?: {
    id?: string;
    taxonomyType?: TaxonomyType;
    fallbackStatus?: RecordStatus;
  },
): TaxonomyRecord {
  const raw = asRecord(input);
  const name = stringOrUndefined(raw.name) ?? "Untitled Taxonomy";
  const status = recordStatusSchema.safeParse(raw.status).success
    ? (raw.status as RecordStatus)
    : options?.fallbackStatus ?? "published";

  return taxonomySchema.parse({
    id: options?.id,
    slug: slugify(stringOrUndefined(raw.slug) ?? options?.id ?? name),
    name,
    description:
      stringOrUndefined(raw.description) ?? `${name} taxonomy entry pending editorial review.`,
    taxonomyType:
      (stringOrUndefined(raw.taxonomyType) as TaxonomyType | undefined) ??
      options?.taxonomyType ??
      "category",
    iconId: stringOrUndefined(raw.iconId),
    synonyms: stringArray(raw.synonyms),
    status,
    createdAt: isoDateOrUndefined(raw.createdAt),
    updatedAt: isoDateOrUndefined(raw.updatedAt),
  });
}

export function prepareTaxonomyWrite(
  input: Partial<TaxonomyRecord>,
  options?: {
    id?: string;
    taxonomyType?: TaxonomyType;
    fallbackStatus?: RecordStatus;
  },
) {
  const normalized = normalizeTaxonomyRecord(input, options);

  return {
    slug: normalized.slug,
    name: normalized.name,
    description: normalized.description,
    taxonomyType: normalized.taxonomyType,
    iconId: normalized.iconId ?? "",
    synonyms: normalized.synonyms,
    status: normalized.status,
    createdAt: normalized.createdAt ?? null,
    updatedAt: normalized.updatedAt ?? null,
  };
}
