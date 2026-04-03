import { requireAdminDb } from "../src/lib/firebase-admin";
import { COLLECTIONS } from "../src/lib/db/shared";
import { scorePageDraft, scoreToolDraft } from "../src/lib/generation/score";
import { normalizePageRecord } from "../src/lib/validation/page";
import { normalizeTaxonomyRecord } from "../src/lib/validation/taxonomy";
import { normalizeToolRecord } from "../src/lib/validation/tool";
import { serializeData } from "../src/lib/utils";

import { fail, info } from "./_shared";

async function validateAll() {
  const db = requireAdminDb();
  const [toolSnapshot, pageSnapshot, categorySnapshot] = await Promise.all([
    db.collection(COLLECTIONS.tools).get(),
    db.collection(COLLECTIONS.pages).get(),
    db.collection(COLLECTIONS.categories).get(),
  ]);

  const invalidRecords: string[] = [];
  const warningRecords: string[] = [];
  const parsedTools = toolSnapshot.docs.flatMap((doc) => {
    try {
      const tool = normalizeToolRecord(serializeData(doc.data()), { id: doc.id });
      const warnings = scoreToolDraft(
        tool,
        toolSnapshot.docs.map((entry) => ({
          slug: entry.id,
          name: String(entry.data().name || ""),
        })),
      ).warnings;

      if (warnings.length > 0) {
        warningRecords.push(`Tool ${doc.id}: ${warnings.join(", ")}`);
      }

      return [tool];
    } catch (error) {
      invalidRecords.push(`Tool ${doc.id}: ${error instanceof Error ? error.message : "Invalid record"}`);
      return [];
    }
  });

  for (const doc of pageSnapshot.docs) {
    try {
      const page = normalizePageRecord(serializeData(doc.data()), { id: doc.id });
      const warnings = scorePageDraft(page).warnings;

      if (warnings.length > 0) {
        warningRecords.push(`Page ${doc.id}: ${warnings.join(", ")}`);
      }
    } catch (error) {
      invalidRecords.push(`Page ${doc.id}: ${error instanceof Error ? error.message : "Invalid record"}`);
    }
  }

  for (const doc of categorySnapshot.docs) {
    try {
      normalizeTaxonomyRecord(serializeData(doc.data()), { id: doc.id, taxonomyType: "category" });
    } catch (error) {
      invalidRecords.push(`Category ${doc.id}: ${error instanceof Error ? error.message : "Invalid record"}`);
    }
  }

  info(`Validated ${parsedTools.length} tools, ${pageSnapshot.size} pages, and ${categorySnapshot.size} categories.`);

  if (warningRecords.length > 0) {
    info("");
    info("Warnings:");
    for (const warning of warningRecords) {
      info(`- ${warning}`);
    }
  }

  if (invalidRecords.length > 0) {
    fail("");
    fail("Invalid records:");
    for (const invalid of invalidRecords) {
      fail(`- ${invalid}`);
    }
    process.exit(1);
  }

  info("");
  info("Validation complete with no invalid records.");
}

void validateAll().catch((error) => {
  fail(error instanceof Error ? error.message : "Validation failed.");
  process.exit(1);
});
