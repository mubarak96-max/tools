import fs from "fs";
import path from "path";

import { parseArgs, parseNumberArg, info, fail } from "./_shared";
import { discoverToolPages } from "../src/lib/audit/discoverToolPages";
import { parseBuiltinPage } from "../src/lib/audit/parseBuiltinPage";
import { scoreBuiltinPage } from "../src/lib/audit/scoreBuiltinPage";
import {
  CONTENT_GUARDRAILS,
  GENERIC_PHRASES,
  NON_FIXABLE_WARNINGS,
  QUALITY_RUBRIC_WEIGHTS,
} from "../src/lib/audit/program-rubric";
import { FREE_TOOLS } from "../src/lib/tools/registry";
import { EXACT_TEXT_SEO_CONTENT } from "../src/lib/tools/exact-text-seo";
import { EXACT_TEXT_TOOLS, EXACT_UTILITY_TOOLS } from "../src/lib/tools/exact-catalog";
import { getAllWordCounterLandingSlugs } from "../src/lib/word-counter-landings/registry";

type InventoryRow = {
  kind: "builtin-page" | "free-tool-registry" | "exact-text" | "exact-utility" | "word-counter-landing";
  key: string;
  category: string;
  route: string;
  source: string;
};

type GuardrailViolation = {
  type: "metadata-title-duplicate" | "metadata-description-duplicate" | "generic-phrase-density" | "thin-faq";
  toolKey: string;
  pagePath: string;
  detail: string;
};

type PriorityRow = {
  toolKey: string;
  category: string;
  pagePath: string;
  overallScore: number;
  contentRisk: number;
  seoOpportunity: number;
  uxImpact: number;
  templateDebt: number;
  quickWin: number;
  priorityScore: number;
  warningCount: number;
};

function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function countGenericPhraseHits(source: string): number {
  const normalized = source.toLowerCase();
  return GENERIC_PHRASES.reduce((sum, phrase) => {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = normalized.match(new RegExp(escaped, "g"));
    return sum + (matches?.length ?? 0);
  }, 0);
}

function parseMetadataStrings(source: string) {
  const titleMatch = source.match(/title\s*:\s*["'`]([^"'`]+)["'`]/);
  const descriptionMatch = source.match(/description\s*:\s*["'`]([^"'`]+)["'`]/);
  return {
    title: titleMatch?.[1]?.trim() ?? "",
    description: descriptionMatch?.[1]?.trim() ?? "",
  };
}

function jaccardSimilarity(a: string, b: string): number {
  const tokenize = (input: string) =>
    new Set(
      input
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((token) => token.length > 2),
    );

  const setA = tokenize(a);
  const setB = tokenize(b);
  if (!setA.size && !setB.size) return 1;
  const intersection = [...setA].filter((token) => setB.has(token)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

function buildInventory(): InventoryRow[] {
  const rows: InventoryRow[] = [];

  const builtinPages = discoverToolPages();
  for (const page of builtinPages) {
    rows.push({
      kind: "builtin-page",
      key: `${page.category}/${page.toolSlug}`,
      category: page.category,
      route: `/${page.category}/${page.toolSlug}`,
      source: page.pagePath,
    });
  }

  for (const tool of FREE_TOOLS) {
    rows.push({
      kind: "free-tool-registry",
      key: tool.href,
      category: tool.category,
      route: tool.href,
      source: "src/lib/tools/registry.ts",
    });
  }

  for (const tool of EXACT_TEXT_TOOLS) {
    rows.push({
      kind: "exact-text",
      key: tool.slug,
      category: "text",
      route: `/text/${tool.slug}`,
      source: "src/lib/tools/exact-catalog.ts",
    });
  }

  for (const tool of EXACT_UTILITY_TOOLS) {
    rows.push({
      kind: "exact-utility",
      key: tool.slug,
      category: "utility",
      route: `/utility/${tool.slug}`,
      source: "src/lib/tools/exact-catalog.ts",
    });
  }

  for (const slug of getAllWordCounterLandingSlugs()) {
    rows.push({
      kind: "word-counter-landing",
      key: slug,
      category: "text",
      route: `/text/${slug}`,
      source: "src/lib/word-counter-landings/registry.ts",
    });
  }

  return rows;
}

function writeJson(filePath: string, value: unknown) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
}

function writeInventoryCsv(filePath: string, rows: InventoryRow[]) {
  const lines = ["kind,key,category,route,source"];
  for (const row of rows) {
    const escaped = [row.kind, row.key, row.category, row.route, row.source].map((item) =>
      `"${String(item).replace(/"/g, '""')}"`,
    );
    lines.push(escaped.join(","));
  }
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function generateSimilarityIndex() {
  const entries = Object.entries(EXACT_TEXT_SEO_CONTENT).map(([slug, content]) => ({
    slug,
    referenceText: [content.learnTitle, ...content.introParagraphs, ...content.sections.map((item) => item.heading)].join(
      " ",
    ),
  }));

  const similarityRisk = new Map<string, number>();
  for (let index = 0; index < entries.length; index += 1) {
    const base = entries[index];
    let highSimilarityCount = 0;
    for (let next = 0; next < entries.length; next += 1) {
      if (index === next) continue;
      const candidate = entries[next];
      const score = jaccardSimilarity(base.referenceText, candidate.referenceText);
      if (score >= CONTENT_GUARDRAILS.similarityThreshold) {
        highSimilarityCount += 1;
      }
    }
    similarityRisk.set(base.slug, highSimilarityCount);
  }
  return similarityRisk;
}

function runProgram(options: { threshold: number; topN: number; strict: boolean }) {
  const reportDir = path.resolve(process.cwd(), "reports/tool-quality");
  ensureDir(reportDir);

  const inventory = buildInventory();
  writeJson(path.join(reportDir, "inventory.json"), inventory);
  writeInventoryCsv(path.join(reportDir, "inventory.csv"), inventory);

  const similarityIndex = generateSimilarityIndex();
  const guardrailViolations: GuardrailViolation[] = [];

  const titleIndex = new Map<string, string[]>();
  const descriptionIndex = new Map<string, string[]>();
  const priorityRows: PriorityRow[] = [];
  const templateDebtRows: Array<{
    toolKey: string;
    pagePath: string;
    usesToolPageScaffold: boolean;
    usesHealthToolPage: boolean;
    rawColorTokenCount: number;
    proseInvertOnLightCount: number;
  }> = [];

  const builtinRows = inventory.filter((row) => row.kind === "builtin-page");
  for (const row of builtinRows) {
    const absolutePath = path.resolve(process.cwd(), row.source);
    const source = fs.readFileSync(absolutePath, "utf8");
    const signals = parseBuiltinPage(absolutePath);
    const scored = scoreBuiltinPage(signals, row.key.split("/")[1] ?? row.key, row.category, row.route, {
      threshold: options.threshold,
    });

    const metadata = parseMetadataStrings(source);
    if (metadata.title) {
      const key = metadata.title.toLowerCase();
      titleIndex.set(key, [...(titleIndex.get(key) ?? []), row.key]);
    }
    if (metadata.description) {
      const key = metadata.description.toLowerCase();
      descriptionIndex.set(key, [...(descriptionIndex.get(key) ?? []), row.key]);
    }

    const genericHits = countGenericPhraseHits(source);
    if (genericHits > CONTENT_GUARDRAILS.maxGenericPhraseHits) {
      guardrailViolations.push({
        type: "generic-phrase-density",
        toolKey: row.key,
        pagePath: row.source,
        detail: `Found ${genericHits} generic phrase hits (limit: ${CONTENT_GUARDRAILS.maxGenericPhraseHits})`,
      });
    }
    if (signals.faqItemCount > 0 && signals.faqItemCount < CONTENT_GUARDRAILS.minFaqItems) {
      guardrailViolations.push({
        type: "thin-faq",
        toolKey: row.key,
        pagePath: row.source,
        detail: `FAQ items: ${signals.faqItemCount} (minimum: ${CONTENT_GUARDRAILS.minFaqItems})`,
      });
    }

    const rawColorTokenCount = (source.match(/(?:text|bg|border)-(?:slate|gray)-[0-9]{2,3}/g) ?? []).length;
    const proseInvertOnLightCount = (source.match(/prose-invert/g) ?? []).length;
    const usesToolPageScaffold = source.includes("ToolPageScaffold");
    const usesHealthToolPage = source.includes("HealthToolPage");

    templateDebtRows.push({
      toolKey: row.key,
      pagePath: row.source,
      usesToolPageScaffold,
      usesHealthToolPage,
      rawColorTokenCount,
      proseInvertOnLightCount,
    });

    const warningCount = scored.warnings.length;
    const fixableWarningCount = scored.warnings.filter((warning) => !NON_FIXABLE_WARNINGS.has(warning)).length;
    const quickWin = warningCount === 0 ? 0 : clamp((fixableWarningCount / warningCount) * 100, 0, 100);

    const slug = row.key.split("/")[1] ?? "";
    const similarityHits = similarityIndex.get(slug) ?? 0;
    const contentRisk = clamp(genericHits * 12 + similarityHits * 8 + (signals.faqItemCount < 4 ? 12 : 0), 0, 100);
    const seoOpportunity = clamp(100 - scored.seoScore, 0, 100);
    const uxImpact = clamp(100 - scored.uxScore, 0, 100);
    const templateDebt = clamp(
      (usesToolPageScaffold ? 20 : 0) + (usesHealthToolPage ? 10 : 0) + rawColorTokenCount * 4 + proseInvertOnLightCount * 10,
      0,
      100,
    );
    const priorityScore =
      contentRisk * QUALITY_RUBRIC_WEIGHTS.contentRisk +
      seoOpportunity * QUALITY_RUBRIC_WEIGHTS.seoOpportunity +
      uxImpact * QUALITY_RUBRIC_WEIGHTS.uxImpact +
      templateDebt * QUALITY_RUBRIC_WEIGHTS.templateDebt +
      quickWin * QUALITY_RUBRIC_WEIGHTS.quickWin;

    priorityRows.push({
      toolKey: row.key,
      category: row.category,
      pagePath: row.source,
      overallScore: round2(scored.overallScore),
      contentRisk: round2(contentRisk),
      seoOpportunity: round2(seoOpportunity),
      uxImpact: round2(uxImpact),
      templateDebt: round2(templateDebt),
      quickWin: round2(quickWin),
      priorityScore: round2(priorityScore),
      warningCount,
    });
  }

  for (const [title, keys] of titleIndex.entries()) {
    if (keys.length <= 1) continue;
    for (const key of keys) {
      guardrailViolations.push({
        type: "metadata-title-duplicate",
        toolKey: key,
        pagePath: `src/app/${key}/page.tsx`,
        detail: `Duplicate title across tools: "${title.slice(0, 120)}"`,
      });
    }
  }
  for (const [description, keys] of descriptionIndex.entries()) {
    if (keys.length <= 1) continue;
    for (const key of keys) {
      guardrailViolations.push({
        type: "metadata-description-duplicate",
        toolKey: key,
        pagePath: `src/app/${key}/page.tsx`,
        detail: `Duplicate description across tools: "${description.slice(0, 120)}"`,
      });
    }
  }

  priorityRows.sort((a, b) => b.priorityScore - a.priorityScore);
  const topRows = priorityRows.slice(0, options.topN);
  const templateDebtSorted = [...templateDebtRows].sort((a, b) => {
    const scoreA = a.rawColorTokenCount + a.proseInvertOnLightCount + (a.usesToolPageScaffold ? 1 : 0);
    const scoreB = b.rawColorTokenCount + b.proseInvertOnLightCount + (b.usesToolPageScaffold ? 1 : 0);
    return scoreB - scoreA;
  });

  writeJson(path.join(reportDir, "priority-scores.json"), priorityRows);
  writeJson(path.join(reportDir, "top-20-priority.json"), topRows);
  writeJson(path.join(reportDir, "guardrail-violations.json"), guardrailViolations);

  const topMarkdownLines = [
    "# Top 20 Tool Redesign Priorities",
    "",
    "| Rank | Tool | Priority | Overall | Content Risk | SEO Opp | UX Impact | Template Debt | Quick Win |",
    "|---:|---|---:|---:|---:|---:|---:|---:|---:|",
  ];
  topRows.forEach((item, index) => {
    topMarkdownLines.push(
      `| ${index + 1} | ${item.toolKey} | ${item.priorityScore.toFixed(2)} | ${item.overallScore.toFixed(2)} | ${item.contentRisk.toFixed(2)} | ${item.seoOpportunity.toFixed(2)} | ${item.uxImpact.toFixed(2)} | ${item.templateDebt.toFixed(2)} | ${item.quickWin.toFixed(2)} |`,
    );
  });
  fs.writeFileSync(path.join(reportDir, "top-20-priority.md"), `${topMarkdownLines.join("\n")}\n`, "utf8");

  const templateDebtLines = [
    "# Template Debt Report",
    "",
    "| Tool | ToolPageScaffold | HealthToolPage | Raw Color Tokens | prose-invert Usage |",
    "|---|---:|---:|---:|---:|",
  ];
  templateDebtSorted.slice(0, 100).forEach((item) => {
    templateDebtLines.push(
      `| ${item.toolKey} | ${item.usesToolPageScaffold ? "yes" : "no"} | ${item.usesHealthToolPage ? "yes" : "no"} | ${item.rawColorTokenCount} | ${item.proseInvertOnLightCount} |`,
    );
  });
  fs.writeFileSync(path.join(reportDir, "template-debt-report.md"), `${templateDebtLines.join("\n")}\n`, "utf8");

  const summary = {
    generatedAt: new Date().toISOString(),
    threshold: options.threshold,
    topN: options.topN,
    inventoryCount: inventory.length,
    builtinPageCount: builtinRows.length,
    guardrailViolationCount: guardrailViolations.length,
    topPriority: topRows[0] ?? null,
  };
  writeJson(path.join(reportDir, "summary.json"), summary);

  info(`Generated reports in reports/tool-quality`);
  info(`Inventory rows: ${inventory.length}`);
  info(`Built-in pages scored: ${builtinRows.length}`);
  info(`Guardrail violations: ${guardrailViolations.length}`);
  info(`Top backlog size: ${topRows.length}`);

  if (options.strict && guardrailViolations.length > 0) {
    fail("Strict mode failed: guardrail violations detected.");
    process.exit(1);
  }
}

const { flags, values } = parseArgs(process.argv.slice(2));
const topN = parseNumberArg(values, "top", 20, { min: 1, max: 200 });
const threshold = parseNumberArg(values, "threshold", 70, { min: 0, max: 100 });
const strict = flags.has("strict");

runProgram({ threshold, topN, strict });

