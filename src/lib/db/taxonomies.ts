import "server-only";

import type { TaxonomyRecord } from "@/types/database";
import { unstable_cache } from "next/cache";

import { getAdminDb, requireAdminDb } from "@/lib/firebase/admin";
import { CACHE_TAGS, COLLECTIONS, mapQuerySnapshot, withTimestamps } from "@/lib/db/shared";
import { logServerError } from "@/lib/monitoring/logger";
import { normalizeTaxonomyRecord, prepareTaxonomyWrite } from "@/lib/validation/taxonomy";

async function listCategoriesFromDb(): Promise<TaxonomyRecord[]> {
  const db = getAdminDb();
  if (!db) {
    return [];
  }

  try {
    return await mapQuerySnapshot(
      db.collection(COLLECTIONS.categories).orderBy("name"),
      (id, data) => normalizeTaxonomyRecord(data, { id, taxonomyType: "category" }),
    );
  } catch (error) {
    logServerError("list_categories_failed", error);
    return [];
  }
}

const listCategoriesCached = unstable_cache(listCategoriesFromDb, ["categories-all"], {
  tags: [CACHE_TAGS.categories],
  revalidate: 3600,
});

export async function listCategories(): Promise<TaxonomyRecord[]> {
  return listCategoriesCached();
}

export async function getCategoryBySlug(slug: string): Promise<TaxonomyRecord | null> {
  const db = getAdminDb();
  if (!db) {
    return null;
  }

  const doc = await db.collection(COLLECTIONS.categories).doc(slug).get();

  if (!doc.exists) {
    return null;
  }

  return normalizeTaxonomyRecord(doc.data(), { id: doc.id, taxonomyType: "category" });
}

export async function createCategoryRecord(data: Partial<TaxonomyRecord>) {
  const db = requireAdminDb();
  const prepared = prepareTaxonomyWrite(data, { taxonomyType: "category" });
  const docRef = db.collection(COLLECTIONS.categories).doc(prepared.slug);
  const existingDoc = await docRef.get();

  if (existingDoc.exists) {
    throw new Error("Category exists");
  }

  await docRef.set(withTimestamps(prepared));

  return prepared.slug;
}

export async function updateCategoryRecord(slug: string, data: Partial<TaxonomyRecord>) {
  const db = requireAdminDb();
  const existingDoc = await db.collection(COLLECTIONS.categories).doc(slug).get();

  if (!existingDoc.exists) {
    throw new Error("Category not found.");
  }

  const existing = normalizeTaxonomyRecord(existingDoc.data(), {
    id: existingDoc.id,
    taxonomyType: "category",
  });
  const merged = prepareTaxonomyWrite(
    {
      ...existing,
      ...data,
      slug,
    },
    { id: slug, taxonomyType: "category" },
  );

  await db.collection(COLLECTIONS.categories).doc(slug).set(
    withTimestamps(merged, { preserveCreatedAt: existing.createdAt }),
  );

  return slug;
}

export async function deleteCategoryRecord(slug: string) {
  const db = requireAdminDb();
  await db.collection(COLLECTIONS.categories).doc(slug).delete();
}
