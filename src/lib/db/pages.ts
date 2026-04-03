import type { CustomPage, RecordStatus } from "@/types/database";

import { getAdminDb, requireAdminDb } from "@/lib/firebase/admin";
import { COLLECTIONS, mapQuerySnapshot, withTimestamps } from "@/lib/db/shared";
import { normalizePageRecord, preparePageWrite } from "@/lib/validation/page";

export async function listPages(options?: {
  status?: RecordStatus[];
}): Promise<CustomPage[]> {
  const db = getAdminDb();
  if (!db) {
    return [];
  }

  const pages = await mapQuerySnapshot(
    db.collection(COLLECTIONS.pages).orderBy("createdAt", "desc"),
    (id, data) => normalizePageRecord(data, { id }),
  );

  if (!options?.status?.length) {
    return pages;
  }

  return pages.filter((page) => options.status?.includes(page.status));
}

export async function getPageBySlug(slug: string, options?: { includeDrafts?: boolean }) {
  const db = getAdminDb();
  if (!db || !slug || slug.startsWith("[") || slug === "undefined") {
    return null;
  }

  const doc = await db.collection(COLLECTIONS.pages).doc(slug).get();
  if (!doc.exists) {
    return null;
  }

  const page = normalizePageRecord(doc.data(), { id: doc.id });
  if (!options?.includeDrafts && page.status !== "published") {
    return null;
  }

  return page;
}

export async function createPageRecord(
  data: Partial<CustomPage>,
  fallbackStatus: RecordStatus = "draft",
) {
  const db = requireAdminDb();
  const prepared = preparePageWrite(data, { fallbackStatus });
  const docRef = db.collection(COLLECTIONS.pages).doc(prepared.slug);
  const existingDoc = await docRef.get();

  if (existingDoc.exists) {
    throw new Error("A page with this slug already exists.");
  }

  await docRef.set(withTimestamps(prepared));

  return prepared.slug;
}

export async function updatePageRecord(
  slug: string,
  data: Partial<CustomPage>,
  fallbackStatus: RecordStatus = "draft",
) {
  const db = requireAdminDb();
  const existingDoc = await db.collection(COLLECTIONS.pages).doc(slug).get();

  if (!existingDoc.exists) {
    throw new Error("Page not found.");
  }

  const existing = normalizePageRecord(existingDoc.data(), { id: existingDoc.id });
  const merged = preparePageWrite(
    {
      ...existing,
      ...data,
      slug,
    },
    { id: slug, fallbackStatus },
  );

  await db.collection(COLLECTIONS.pages).doc(slug).set(
    withTimestamps(merged, { preserveCreatedAt: existing.createdAt }),
  );

  return slug;
}

export async function deletePageRecord(slug: string) {
  const db = requireAdminDb();
  await db.collection(COLLECTIONS.pages).doc(slug).delete();
}
