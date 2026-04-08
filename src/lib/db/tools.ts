import "server-only";

import type { RecordStatus, Tool } from "@/types/database";

import { listCategories } from "@/lib/db/taxonomies";
import { getAdminDb, requireAdminDb } from "@/lib/firebase/admin";
import { COLLECTIONS, mapQuerySnapshot, withTimestamps } from "@/lib/db/shared";
import { logServerError } from "@/lib/monitoring/logger";
import { scoreAlternative } from "@/lib/ranking/alternatives";
import { enforceToolTaxonomy } from "@/lib/taxonomy/registry";
import { normalizeToolRecord, prepareToolWrite } from "@/lib/validation/tool";

async function listApprovedCategoryNames() {
  const categories = await listCategories();
  const approved = categories
    .filter((category) => category.status === "published")
    .map((category) => category.name);

  return approved.length > 0 ? approved : categories.map((category) => category.name);
}

async function listAllTools(): Promise<Tool[]> {
  const db = getAdminDb();
  if (!db) {
    return [];
  }

  try {
    return await mapQuerySnapshot(
      db.collection(COLLECTIONS.tools).orderBy("name"),
      (id, data) => normalizeToolRecord(data, { id }),
    );
  } catch (error) {
    logServerError("list_tools_failed", error);
    return [];
  }
}

export async function listTools(options?: {
  status?: RecordStatus[];
  limit?: number;
}): Promise<Tool[]> {
  const tools = await listAllTools();
  const filtered = options?.status?.length
    ? tools.filter((tool) => options.status?.includes(tool.status))
    : tools;

  return typeof options?.limit === "number" ? filtered.slice(0, options.limit) : filtered;
}

export async function getFeaturedTools(limit = 6): Promise<Tool[]> {
  return listTools({ status: ["published"], limit });
}

export async function getToolBySlug(slug: string, options?: { includeDrafts?: boolean }) {
  const db = getAdminDb();
  if (!db) {
    return null;
  }

  if (!slug || slug.startsWith("[") || slug === "undefined") {
    return null;
  }

  let doc;

  try {
    doc = await db.collection(COLLECTIONS.tools).doc(slug).get();
  } catch (error) {
    logServerError("get_tool_by_slug_failed", error, { slug });
    return null;
  }

  if (!doc.exists) {
    return null;
  }

  const tool = normalizeToolRecord(doc.data(), { id: doc.id });

  if (!options?.includeDrafts && tool.status !== "published") {
    return null;
  }

  return tool;
}

export async function getToolsBySlugs(slugs: string[], options?: { includeDrafts?: boolean }) {
  const requested = Array.from(new Set(slugs.filter(Boolean)));
  if (requested.length === 0) {
    return [];
  }

  const db = getAdminDb();
  if (!db) {
    return [];
  }

  let snapshots;

  try {
    snapshots = await db.getAll(
      ...requested.map((slug) => db.collection(COLLECTIONS.tools).doc(slug)),
    );
  } catch (error) {
    logServerError("get_tools_by_slugs_failed", error, { slugs: requested });
    return [];
  }

  return snapshots
    .filter((snapshot) => snapshot.exists)
    .map((snapshot) => normalizeToolRecord(snapshot.data(), { id: snapshot.id }))
    .filter((tool) => options?.includeDrafts || tool.status === "published");
}

export async function getAlternativeTools(targetTool: Tool, limit = 10): Promise<Tool[]> {
  const tools = await listTools({ status: ["published"] });

  return tools
    .filter((tool) => tool.slug !== targetTool.slug)
    .map((tool) => ({ tool, score: scoreAlternative(targetTool, tool) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.tool.name.localeCompare(right.tool.name))
    .slice(0, limit)
    .map((entry) => entry.tool);
}

export async function createToolRecord(
  data: Partial<Tool>,
  fallbackStatus: RecordStatus = "draft",
): Promise<string> {
  const db = requireAdminDb();
  const approvedCategories = await listApprovedCategoryNames();
  const normalized = normalizeToolRecord(data, { fallbackStatus });
  const enforced = enforceToolTaxonomy(normalized, { approvedCategories }).data;
  const prepared = prepareToolWrite(enforced, { fallbackStatus });
  const docRef = db.collection(COLLECTIONS.tools).doc(prepared.slug);
  const existingDoc = await docRef.get();

  if (existingDoc.exists) {
    throw new Error("A tool with this slug already exists.");
  }

  await docRef.set(withTimestamps(enforced));

  return prepared.slug;
}

export async function updateToolRecord(
  slug: string,
  data: Partial<Tool>,
  fallbackStatus: RecordStatus = "draft",
): Promise<string> {
  const db = requireAdminDb();
  const approvedCategories = await listApprovedCategoryNames();
  const existingDoc = await db.collection(COLLECTIONS.tools).doc(slug).get();

  if (!existingDoc.exists) {
    throw new Error("Tool not found.");
  }

  const existing = normalizeToolRecord(existingDoc.data(), { id: existingDoc.id });
  const merged = normalizeToolRecord(
    {
      ...existing,
      ...data,
      slug,
    },
    { id: slug, fallbackStatus },
  );
  const enforced = enforceToolTaxonomy(merged, { approvedCategories }).data;
  const prepared = prepareToolWrite(enforced, { id: slug, fallbackStatus });

  await db.collection(COLLECTIONS.tools).doc(slug).set(
    withTimestamps(prepared, { preserveCreatedAt: existing.createdAt }),
  );

  return slug;
}

export async function deleteToolRecord(slug: string) {
  const db = requireAdminDb();
  await db.collection(COLLECTIONS.tools).doc(slug).delete();
}
