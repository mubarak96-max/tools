import "server-only";

import type { CustomPage, RecordStatus } from "@/types/database";

import { listCategories } from "@/lib/db/taxonomies";
import { getAdminDb, requireAdminDb } from "@/lib/firebase/admin";
import { COLLECTIONS, mapQuerySnapshot, withTimestamps } from "@/lib/db/shared";
import { logServerError } from "@/lib/monitoring/logger";
import { enforcePageTaxonomy } from "@/lib/taxonomy/registry";
import { normalizePageRecord, preparePageWrite } from "@/lib/validation/page";

async function listApprovedCategoryNames() {
  const categories = await listCategories();
  const approved = categories
    .filter((category) => category.status === "published")
    .map((category) => category.name);

  return approved.length > 0 ? approved : categories.map((category) => category.name);
}

export async function listPages(options?: {
  status?: RecordStatus[];
}): Promise<CustomPage[]> {
  const db = getAdminDb();
  if (!db) {
    return [];
  }

  let pages: CustomPage[];

  try {
    pages = await mapQuerySnapshot(
      db.collection(COLLECTIONS.pages).orderBy("createdAt", "desc"),
      (id, data) => normalizePageRecord(data, { id }),
    );
  } catch (error) {
    logServerError("list_pages_failed", error);
    return [];
  }

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

  let doc;

  try {
    doc = await db.collection(COLLECTIONS.pages).doc(slug).get();
  } catch (error) {
    logServerError("get_page_by_slug_failed", error, { slug });
    return null;
  }

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
): Promise<string> {
  const db = requireAdminDb();
  const approvedCategories = await listApprovedCategoryNames();
  const normalized = normalizePageRecord(data, { fallbackStatus });
  const enforced = enforcePageTaxonomy(normalized, { approvedCategories }).data;
  const prepared = preparePageWrite(enforced, { fallbackStatus });
  const docRef = db.collection(COLLECTIONS.pages).doc(prepared.slug);
  const existingDoc = await docRef.get();

  if (existingDoc.exists) {
    throw new Error("A page with this slug already exists.");
  }

  await docRef.set(withTimestamps(enforced));

  return prepared.slug;
}

export async function updatePageRecord(
  slug: string,
  data: Partial<CustomPage>,
  fallbackStatus: RecordStatus = "draft",
): Promise<string> {
  const db = requireAdminDb();
  const approvedCategories = await listApprovedCategoryNames();
  const existingDoc = await db.collection(COLLECTIONS.pages).doc(slug).get();

  if (!existingDoc.exists) {
    throw new Error("Page not found.");
  }

  const existing = normalizePageRecord(existingDoc.data(), { id: existingDoc.id });
  const merged = normalizePageRecord(
    {
      ...existing,
      ...data,
      slug,
    },
    { id: slug, fallbackStatus },
  );
  const enforced = enforcePageTaxonomy(merged, { approvedCategories }).data;
  const prepared = preparePageWrite(enforced, { id: slug, fallbackStatus });

  await db.collection(COLLECTIONS.pages).doc(slug).set(
    withTimestamps(prepared, { preserveCreatedAt: existing.createdAt }),
  );

  return slug;
}

export async function deletePageRecord(slug: string) {
  const db = requireAdminDb();
  await db.collection(COLLECTIONS.pages).doc(slug).delete();
}
