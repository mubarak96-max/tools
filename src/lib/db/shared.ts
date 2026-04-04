import "server-only";

import type { DocumentData, Query } from "firebase-admin/firestore";

import { nowIso } from "@/lib/dates";
import { serializeData } from "@/lib/utils";

export const COLLECTIONS = {
  tools: "tools",
  pages: "pages",
  categories: "categories",
  comparisons: "comparisons",
} as const;

export async function mapQuerySnapshot<T>(
  query: Query<DocumentData>,
  mapper: (id: string, data: Record<string, unknown>) => T,
): Promise<T[]> {
  const snapshot = await query.get();

  return snapshot.docs.map((doc) =>
    mapper(doc.id, serializeData(doc.data()) as Record<string, unknown>),
  );
}

/**
 * Remove undefined values from an object to prevent Firestore errors.
 * Firestore does not allow undefined as a field value.
 */
export function stripUndefinedValues<T extends Record<string, unknown>>(
  data: T,
): Partial<T> {
  const cleaned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }

  return cleaned as Partial<T>;
}

export function withTimestamps<T extends Record<string, unknown>>(
  data: T,
  options?: {
    preserveCreatedAt?: string;
  },
) {
  const timestamp = nowIso();
  const cleaned = stripUndefinedValues(data);

  return {
    ...cleaned,
    createdAt: options?.preserveCreatedAt ?? timestamp,
    updatedAt: timestamp,
  };
}
