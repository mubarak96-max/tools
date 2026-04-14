import fs from "fs";
import path from "path";
import { parseArgs, parseNumberArg, info, fail } from "./_shared";
import { discoverToolPages, KNOWN_CATEGORIES } from "../src/lib/audit/discoverToolPages";
import { parseBuiltinPage } from "../src/lib/audit/parseBuiltinPage";
import { scoreBuiltinPage, STANDARD_TEMPLATE_FEATURES } from "../src/lib/audit/scoreBuiltinPage";
import { fixBuiltinPage } from "../src/lib/audit/fixBuiltinPage";
import type { ScoredToolPage, FixResult } from "../src/lib/audit/types";

// ─── CLI args ────────────────────────────────────────────────────────────────

const { flags, values } = parseArgs(process.argv.slice(2));

const doJson = flags.has("json");
const doFix = flags.has("fix");
const doChecklist = flags.has("checklist");
const categoryArg = values.get("category");
const toolArg = values.get("tool");
const threshold = parseNumberArg(values, "threshold", 70, { min: 0, max: 100 });

// ─── checklist mode ──────────────────────────────────────────────────────────

if (doChecklist) {
    const lines: string[] = [
        "# Tool Page Quality Checklist",
        "",
        "Every built-in tool page should satisfy all of the following requirements.",
        "Reference implementation: `src/app/finance/compound-interest-calculator/page.tsx`",
        "",
        "## Standard Template Features",
        "",
    ];

    for (const feature of STANDARD_TEMPLATE_FEATURES) {
        lines.push(`### ${feature.label} (weight: ${feature.weight})`);
        lines.push("");
        lines.push(feature.description);
        lines.push("");
        lines.push(`**Example:** \`${feature.example}\``);
        lines.push("");
    }

    const outPath = path.resolve(process.cwd(), "TOOL_TEMPLATE_CHECKLIST.md");
    fs.writeFileSync(outPath, lines.join("\n"), "utf8");
    info(`Checklist written to ${outPath}`);
    process.exit(0);
}

// ─── category validation ─────────────────────────────────────────────────────

if (categoryArg && !(KNOWN_CATEGORIES as readonly string[]).includes(categoryArg)) {
    fail(`Unknown category "${categoryArg}". Valid categories: ${KNOWN_CATEGORIES.join(", ")}`);
    process.exit(1);
}

// ─── single-tool mode ────────────────────────────────────────────────────────

if (toolArg) {
    const parts = toolArg.split("/");
    if (parts.length < 2) {
        fail(`Invalid --tool value "${toolArg}". Expected format: category/tool-slug`);
        process.exit(1);
    }
    const [cat, ...slugParts] = parts;
    const slug = slugParts.join("/");
    const pagePath = `src/app/${cat}/${slug}/page.tsx`;
    const absPath = path.resolve(process.cwd(), pagePath);

    if (!fs.existsSync(absPath)) {
        fail(`Tool page not found: ${pagePath}`);
        process.exit(1);
    }

    const signals = parseBuiltinPage(absPath);
    const scored = scoreBuiltinPage(signals, slug, cat, `/${cat}/${slug}`, { threshold });

    info(`\nAuditing: ${pagePath}`);
    info(`Overall: ${Math.round(scored.overallScore)}  SEO: ${Math.round(scored.seoScore)}  UX: ${Math.round(scored.uxScore)}  Features: ${Math.round(scored.featureScore)}  ${scored.needsWork ? "[NEEDS WORK]" : "[OK]"}`);
    info(`Content words: ${signals.contentWordCount}`);

    if (scored.warnings.length > 0) {
        info("\nWarnings and suggested fixes:");
        const fixes: Record<string, string> = {
            "Missing revalidate export": "Add: export const revalidate = 43200;",
            "Missing canonical URL": "Add alternates: { canonical: absoluteUrl(PAGE_PATH) } to metadata",
            "Missing OpenGraph metadata": "Add openGraph block to metadata",
            "Missing Twitter card metadata": "Add twitter block to metadata",
            "Missing WebApplication structured data": "Add buildWebApplicationJsonLd() and <JsonLd> render",
            "Missing BreadcrumbList structured data": "Add buildBreadcrumbJsonLd() and <JsonLd> render",
            "Missing FAQPage structured data": "Add buildFaqJsonLd(faq) and <JsonLd> render",
            "Missing PrivacyNote": "Import PrivacyNote from ToolPageScaffold and render <PrivacyNote />",
            "Missing RelatedToolsSection": "Import RelatedToolsSection and render at bottom of page",
            "Missing category chip label": "Add <p className=\"primary-chip\"> above <h1>",
            "Missing breadcrumb navigation": "Add <nav aria-label=\"Breadcrumb\"> above category chip",
            "Insufficient content depth (below 1000 words)": "Add 1000+ words of useful content sections below the tool",
        };
        for (const w of scored.warnings) {
            const fix = fixes[w];
            info(`  ✗ ${w}`);
            if (fix) info(`    → ${fix}`);
        }
    }

    if (doFix && scored.needsWork) {
        info("\nApplying fixes...");
        const result = fixBuiltinPage(absPath, scored, { threshold });
        info(`Score: ${Math.round(result.scoreBefore)} → ${Math.round(result.scoreAfter)}  [${result.fixStatus}]`);
        if (result.appliedFixes.length > 0) info(`Applied: ${result.appliedFixes.join(", ")}`);
        if (result.skippedWarnings.length > 0) info(`Skipped: ${result.skippedWarnings.join(", ")}`);
    }

    process.exit(0);
}

// ─── full audit ──────────────────────────────────────────────────────────────

const toolPaths = discoverToolPages(categoryArg);
info(`\nTool Quality Audit — discovering tools...`);
info(`Found ${toolPaths.length} tool pages\n`);

const results: ScoredToolPage[] = [];
const errors: string[] = [];

for (const tp of toolPaths) {
    try {
        const absPath = path.resolve(process.cwd(), tp.pagePath);
        const signals = parseBuiltinPage(absPath);
        const scored = scoreBuiltinPage(signals, tp.toolSlug, tp.category, `/${tp.category}/${tp.toolSlug}`, { threshold });
        results.push(scored);
    } catch (err) {
        const msg = `${tp.pagePath}: ${err instanceof Error ? err.message : "unknown error"}`;
        errors.push(msg);
        fail(`  ERROR: ${msg}`);
    }
}

// Sort ascending by overallScore (lowest first)
results.sort((a, b) => a.overallScore - b.overallScore);

const needsWorkCount = results.filter((r) => r.needsWork).length;
const avgScore = results.length > 0 ? results.reduce((s, r) => s + r.overallScore, 0) / results.length : 0;

// ─── JSON output ─────────────────────────────────────────────────────────────

if (doJson) {
    const outPath = path.resolve(process.cwd(), "audit-report.json");
    try {
        fs.writeFileSync(outPath, JSON.stringify(results, null, 2), "utf8");
        info(`Audit report written to ${outPath}`);
    } catch (err) {
        fail(`Failed to write audit-report.json: ${err instanceof Error ? err.message : "unknown error"}`);
        process.exit(1);
    }
} else {
    // ─── stdout table ───────────────────────────────────────────────────────────
    const col = (s: string | number, w: number) => String(s).padEnd(w).slice(0, w);
    const rCol = (s: string | number, w: number) => String(s).padStart(w).slice(0, w);

    info(`Tool Quality Audit — ${results.length} tools audited, ${needsWorkCount} need work, avg score ${avgScore.toFixed(1)}\n`);
    info(
        `${rCol("Rank", 5)}  ${col("Category", 12)}  ${col("Tool Slug", 38)}  ${rCol("Overall", 7)}  ${rCol("SEO", 5)}  ${rCol("UX", 5)}  ${rCol("Feat", 5)}  ⚠`,
    );
    info("─".repeat(90));

    results.forEach((r, i) => {
        info(
            `${rCol(i + 1, 5)}  ${col(r.category, 12)}  ${col(r.toolSlug, 38)}  ${rCol(Math.round(r.overallScore), 7)}  ${rCol(Math.round(r.seoScore), 5)}  ${rCol(Math.round(r.uxScore), 5)}  ${rCol(Math.round(r.featureScore), 5)}  ${r.needsWork ? "✗" : "✓"}`,
        );
    });

    info("\n" + "─".repeat(90));
    info(`Total: ${results.length}  |  Needs work: ${needsWorkCount}  |  Avg score: ${avgScore.toFixed(1)}`);
}

// ─── fix mode ────────────────────────────────────────────────────────────────

if (doFix) {
    const toFix = results.filter((r) => r.needsWork);
    info(`\nFix mode — processing ${toFix.length} tools...\n`);

    let fullyFixed = 0;
    let partiallyFixed = 0;
    let skipped = 0;
    let noEffect = 0;
    const fixResults: FixResult[] = [];

    toFix.forEach((scored, i) => {
        const absPath = path.resolve(process.cwd(), scored.pagePath.startsWith("src/") ? scored.pagePath : `src/app/${scored.category}/${scored.toolSlug}/page.tsx`);
        try {
            const result = fixBuiltinPage(absPath, scored, { threshold });
            fixResults.push(result);

            const progress = `[${i + 1}/${toFix.length}] ${scored.category}/${scored.toolSlug}`;
            const scoreChange = `${Math.round(result.scoreBefore)}→${Math.round(result.scoreAfter)}`;
            info(`${progress.padEnd(55)} ${scoreChange.padStart(8)}  [${result.fixStatus}]`);

            if (result.fixStatus === "fixed") fullyFixed++;
            else if (result.fixStatus === "partial") partiallyFixed++;
            else if (result.appliedFixes.length === 0) skipped++;
            else noEffect++;
        } catch (err) {
            fail(`  ERROR fixing ${scored.toolSlug}: ${err instanceof Error ? err.message : "unknown error"}`);
            skipped++;
        }
    });

    info("\n" + "─".repeat(90));
    info(`Fix summary:`);
    info(`  Fully fixed (score ≥ ${threshold}): ${fullyFixed}`);
    info(`  Partially fixed (improved, still below ${threshold}): ${partiallyFixed}`);
    info(`  Skipped (no fixable warnings): ${skipped}`);
    info(`  No effect: ${noEffect}`);

    if (doJson) {
        const outPath = path.resolve(process.cwd(), "fix-report.json");
        try {
            fs.writeFileSync(outPath, JSON.stringify(fixResults, null, 2), "utf8");
            info(`Fix report written to ${outPath}`);
        } catch (err) {
            fail(`Failed to write fix-report.json: ${err instanceof Error ? err.message : "unknown error"}`);
        }
    }
}
