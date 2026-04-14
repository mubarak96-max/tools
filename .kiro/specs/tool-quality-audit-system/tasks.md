# Implementation Plan: Tool Quality Audit System

## Overview

Build the four modules in dependency order: Parser → Scorer → Fixer → CLI Runner. Each step is independently testable. No test tasks are included — implementation only.

## Tasks

- [x] 1. Scaffold types and shared interfaces
  - Create `src/lib/audit/types.ts` with `ParsedPageSignals`, `ScoredToolPage`, `ToolPagePath`, `FixResult`, and `StandardTemplateFeature` interfaces
  - Export all types from a barrel so all modules share one source of truth
  - _Requirements: 2.3, 6.4_

- [x] 2. Implement the Parser (`src/lib/audit/parseBuiltinPage.ts`)
  - [x] 2.1 Implement `parseBuiltinPage(filePath: string): ParsedPageSignals`
    - Use `fs.readFileSync(filePath, 'utf8')` wrapped in try/catch; on error return zeroed signals
    - Extract all signals listed in Requirement 2.1 via regex / `String.includes()` — no AST
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 2.2 Add `contentWordCount` signal
    - Add `contentWordCount: number` to `ParsedPageSignals` in types.ts
    - In the parser, locate the interactive component render (heuristic: find the first self-closing or opening tag that is NOT a layout/structural element after the `<h1>` section), then count words in all text content that appears after it
    - A simpler reliable heuristic: find the position of the first `<section` that comes after the tool component import reference, count words in all `<p>`, `<li>`, `<h2>`, `<h3>` tag contents from that point to end of file
    - _Requirements: 10.6_

- [x] 3. Implement the Scorer (`src/lib/audit/scoreBuiltinPage.ts`)
  - [x] 3.1 Define and export `STANDARD_TEMPLATE_FEATURES` constant (8 features, weights summing to 100)
    - _Requirements: 5.2, 8.3_

  - [x] 3.2 Implement SEO sub-score calculation
    - Start at 100, apply deductions per the scoring table in the design doc
    - Add check: when `contentWordCount < 1000`, deduct 15 points and add warning `"Insufficient content depth (below 1000 words)"`
    - Emit the correct warning string for each triggered check
    - Clamp result to [0, 100]
    - _Requirements: 3.1–3.12, 10.7_

  - [x] 3.3 Implement UX sub-score calculation
    - Start at 100, apply deductions per the scoring table
    - Emit the correct warning string for each triggered check
    - Clamp result to [0, 100]
    - _Requirements: 4.1–4.8_

  - [x] 3.4 Implement Feature sub-score and `missingFeatures` list
    - Sum weights of present features; derive `missingFeatures` from absent ones
    - Clamp to [0, 100]
    - _Requirements: 5.1–5.4_

  - [x] 3.5 Implement overall score, `needsWork` flag, and return `ScoredToolPage`
    - `overallScore = clamp(seoScore × 0.40 + uxScore × 0.35 + featureScore × 0.25, 0, 100)`
    - `needsWork = overallScore < threshold` (default 70)
    - _Requirements: 6.1–6.4_

- [x] 4. Implement the Fixer (`src/lib/audit/fixBuiltinPage.ts`)
  - [x] 4.1 Implement `fixBuiltinPage(filePath: string, scored: ScoredToolPage): FixResult`
    - Read file, iterate over `scored.warnings`, apply string-level patches for each fixable warning
    - Write patched content back to disk only if at least one fix was applied
    - Return `FixResult` with `appliedFixes`, `skippedWarnings`, `scoreBefore`, `scoreAfter`, `fixStatus`
    - _Requirements: 11.1, 11.2, 11.3, 11.7_

  - [x] 4.2 Implement all structural patch strategies (non-content fixes)
    - `"Missing revalidate export"` — insert after last import line
    - `"Missing canonical URL"` — add `alternates.canonical` inside existing `metadata` object
    - `"Missing OpenGraph metadata"` — add minimal `openGraph` block inside `metadata`
    - `"Missing Twitter card metadata"` — add minimal `twitter` block inside `metadata`
    - `"Missing WebApplication structured data"` — add builder function + `<JsonLd>` render
    - `"Missing BreadcrumbList structured data"` — add `buildBreadcrumbJsonLd` call + `<JsonLd>` render
    - `"Missing FAQPage structured data"` — add `buildFaqJsonLd(faq)` + `<JsonLd>` render (only when `const faq` exists)
    - `"Missing PrivacyNote"` — add to `ToolPageScaffold` import + insert `<PrivacyNote />`
    - `"Missing RelatedToolsSection"` — add to `ToolPageScaffold` import + append before closing `</div>`
    - `"Missing category chip label"` — insert `primary-chip` `<p>` above `<h1>`
    - `"Missing breadcrumb navigation"` — insert breadcrumb `<nav>` above category chip
    - When anchor pattern not found, skip that fix and record as `skipped`
    - _Requirements: 11.2, 11.3, 11.7_

  - [x] 4.3 Implement content depth fix
    - When `"Insufficient content depth (below 1000 words)"` warning is present, generate and insert rich content sections below the tool
    - Content must be tool-specific: use the tool's name, category, and slug to generate relevant headings and paragraphs covering: what the tool does, how to use it, the underlying formula/methodology, practical use cases, tips for getting the best results, common mistakes to avoid, related concepts
    - Content must be placed BELOW the interactive component — insert before the `<RelatedToolsSection>` or before the closing `</div>` of the page
    - Target: at least 1,000 words across multiple `<section>` blocks each with `<h2>` headings and `<p>` paragraphs
    - Content must NOT be generic filler — it must reference the specific tool by name and provide genuinely useful information
    - _Requirements: 10.1–10.5_

  - [x] 4.4 Implement `fixStatus` derivation
    - `"fixed"` when `scoreAfter >= threshold`
    - `"partial"` when `scoreAfter > scoreBefore` but still below threshold
    - `"skipped"` when no fixes were applied
    - _Requirements: 11.5, 12.3–12.5_

- [x] 5. Implement tool discovery (`src/lib/audit/discoverToolPages.ts`)
  - Walk `src/app/{category}/` for each of the 10 known categories (or the one passed in)
  - Include a path only when both `page.tsx` and `components/` exist in the same directory
  - Exclude category index pages and `[dynamic]` segments
  - Return `ToolPagePath[]`
  - _Requirements: 1.1–1.5_

- [x] 6. Implement the CLI Runner (`scripts/audit-tools.ts`)
  - [x] 6.1 Implement argument parsing for all 6 flags (`--json`, `--fix`, `--category`, `--threshold`, `--tool`, `--checklist`)
    - Follow the `parseArgs` pattern from `scripts/_shared.ts` / `validate-all.ts`
    - Validate `--category` against the known list; print error and exit if invalid
    - _Requirements: 7.4–7.6, 9.1, 9.3, 11.8, 11.9_

  - [x] 6.2 Implement the main audit loop
    - Call `discoverToolPages(category?)`, then for each path: `parseBuiltinPage` → `scoreBuiltinPage`
    - Catch per-tool errors with `fail()` and continue
    - Sort results ascending by `overallScore`
    - _Requirements: 1.5, 7.1, 7.7_

  - [x] 6.3 Implement stdout table rendering and summary line
    - Print ranked table: rank, category, tool slug, overall, SEO, UX, feature, needsWork flag
    - Print summary: total audited, flagged count, average score
    - _Requirements: 7.2, 7.3_

  - [x] 6.4 Implement `--json` output
    - Write full `ScoredToolPage[]` to `audit-report.json` in project root
    - Log error with `fail()` and exit non-zero on write failure
    - _Requirements: 7.4_

  - [x] 6.5 Implement `--tool` single-tool mode
    - Audit only the specified tool; print full scored result with per-warning suggested fixes
    - Exit with non-zero code and descriptive error if path does not exist
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 6.6 Implement `--checklist` flag
    - Generate `TOOL_TEMPLATE_CHECKLIST.md` in project root listing all 8 Standard Template features with description, weight, and example
    - _Requirements: 8.1, 8.2_

  - [x] 6.7 Implement the fix loop (`--fix` mode)
    - For each tool with `needsWork: true`: call `fixBuiltinPage`, then re-parse and re-score to verify
    - Print progress line per tool: `[n/total] category/tool-slug  before→after  [fixed|partial|skipped]`
    - Print fix summary at end: total processed, fully fixed, partially fixed, skipped, no effect
    - Respect `--tool` and `--category` scoping when combined with `--fix`
    - _Requirements: 11.1, 11.4–11.6, 11.8, 11.9, 12.1, 12.2_

## Notes

- No test tasks — implementation only
- The Fixer must never delete existing content — only add or extend
- Content generated by the Fixer must be tool-specific and genuinely useful (1000+ words below the tool)
- Reference implementation for all patterns: `src/app/finance/compound-interest-calculator/page.tsx`
