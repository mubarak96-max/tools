import { z } from "zod";

import type { ComparisonRecord, RecordStatus } from "@/types/database";
import { comparisonSlug } from "@/lib/slug";
import { asRecord, isoDateOrUndefined, recordStatusValues, stringOrUndefined } from "@/lib/validation/shared";

const recordStatusSchema = z.enum(recordStatusValues);
const faqSchema = z.object({
  question: z.string().trim().min(3).max(160),
  answer: z.string().trim().min(3).max(500),
});

export const comparisonSchema = z.object({
  id: z.string().trim().optional(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  toolA: z.string().trim().min(1),
  toolB: z.string().trim().min(1),
  title: z.string().trim().min(1).max(160),
  intro: z.string().trim().max(2000).optional(),
  winnerSummary: z.string().trim().max(600).optional(),
  bestForA: z.string().trim().max(240).optional(),
  bestForB: z.string().trim().max(240).optional(),
  faq: z.array(faqSchema).max(10),
  status: recordStatusSchema,
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export function normalizeComparisonRecord(
  input: unknown,
  options?: {
    fallbackStatus?: RecordStatus;
  },
): ComparisonRecord {
  const raw = asRecord(input);
  const toolA = stringOrUndefined(raw.toolA) ?? stringOrUndefined(raw.slug)?.split("-vs-")[0] ?? "";
  const toolB = stringOrUndefined(raw.toolB) ?? stringOrUndefined(raw.slug)?.split("-vs-")[1] ?? "";
  const status = recordStatusSchema.safeParse(raw.status).success
    ? (raw.status as RecordStatus)
    : options?.fallbackStatus ?? "published";

  return comparisonSchema.parse({
    id: stringOrUndefined(raw.id),
    slug: comparisonSlug(toolA, toolB),
    toolA,
    toolB,
    title:
      stringOrUndefined(raw.title) ??
      `${toolA} vs ${toolB}`,
    intro: stringOrUndefined(raw.intro),
    winnerSummary: stringOrUndefined(raw.winnerSummary),
    bestForA: stringOrUndefined(raw.bestForA),
    bestForB: stringOrUndefined(raw.bestForB),
    faq: Array.isArray(raw.faq) ? raw.faq : [],
    status,
    createdAt: isoDateOrUndefined(raw.createdAt),
    updatedAt: isoDateOrUndefined(raw.updatedAt),
  });
}
