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

export function withTimestamps<T extends Record<string, unknown>>(
  data: T,
  options?: {
    preserveCreatedAt?: string;
  },
) {
  const timestamp = nowIso();

  return {
    ...data,
    createdAt: options?.preserveCreatedAt ?? timestamp,
    updatedAt: timestamp,
  };
}
