# Requirements Document

## Introduction

The Tool Quality Audit System is a developer-facing CLI and reporting system that audits all built-in tool pages across the Next.js site against a defined quality rubric. The site contains 200+ built-in tools organized under `src/app/` in categories: finance, health, real-estate, construction, text, utility, image, pdf, ai, and sport. Each tool is a Next.js route with a `page.tsx` server component and a `components/` subfolder.

The system statically analyses each `page.tsx` file, scores it across three dimensions (SEO & content quality, UX & usability, and competitive features), produces a ranked report of tools needing improvement, and defines the canonical template that all tool pages must conform to. It is the built-in-tool equivalent of the existing `scoreToolDraft` / `scorePageDraft` system in `src/lib/generation/score.ts`.

## Glossary

- **Built-in Tool**: A tool page that lives as a static Next.js route under `src/app/{category}/{tool-slug}/page.tsx`, as opposed to a DB-driven tool.
- **Audit_Runner**: The CLI script (`scripts/audit-tools.ts`) that discovers, analyses, scores, and optionally fixes all built-in tool pages.
- **Fixer**: The module (`src/lib/audit/fixBuiltinPage.ts`) that applies automated code patches to a `page.tsx` file to resolve warnings identified by the Scorer.
- **Fix_Loop**: The audit → fix → re-audit cycle that the Audit_Runner executes for each tool when running in fix mode.
- **Scorer**: The module (`src/lib/audit/scoreBuiltinPage.ts`) that evaluates a single parsed tool page and returns a numeric score and warnings.
- **Parser**: The module (`src/lib/audit/parseBuiltinPage.ts`) that statically reads a `page.tsx` file and extracts structured signals (metadata fields, section presence, FAQ count, etc.).
- **Report**: The human-readable output produced by the Audit_Runner — a ranked list of tools with scores, warnings, and improvement suggestions.
- **Quality_Rubric**: The defined set of checks across SEO, content, UX, and competitive dimensions that the Scorer applies.
- **Standard_Template**: The canonical page structure that a fully-compliant built-in tool page must follow, derived from the compound-interest-calculator reference implementation.
- **Category**: One of the top-level route segments under `src/app/` that groups related tools (e.g. `finance`, `health`, `text`).
- **Tool_Slug**: The kebab-case directory name of a tool within its category (e.g. `compound-interest-calculator`).
- **SEO_Score**: The sub-score (0–100) measuring metadata completeness, structured data, and content signals.
- **UX_Score**: The sub-score (0–100) measuring page structure, navigation, and usability signals.
- **Feature_Score**: The sub-score (0–100) measuring presence of competitive content features relative to the Standard_Template.
- **Overall_Score**: The weighted composite of SEO_Score, UX_Score, and Feature_Score.
- **Threshold**: The minimum Overall_Score (default 70) below which a tool is flagged as needing improvement.
- **Fix_Status**: The outcome of a fix attempt — one of `fixed`, `partial`, or `skipped` — recorded per tool in the fix report.

---

## Requirements

### Requirement 1: Tool Discovery

**User Story:** As a developer, I want the Audit_Runner to automatically discover all built-in tool pages, so that I do not need to maintain a manual list of tools to audit.

#### Acceptance Criteria

1. THE Audit_Runner SHALL scan all subdirectories of `src/app/{category}/` for the presence of a `page.tsx` file, where `{category}` is one of: `finance`, `health`, `real-estate`, `construction`, `text`, `utility`, `image`, `pdf`, `ai`, `sport`.
2. WHEN a directory contains a `page.tsx` file and a `components/` subdirectory, THE Audit_Runner SHALL include it in the audit as a built-in tool page.
3. THE Audit_Runner SHALL exclude category index pages (e.g. `src/app/finance/page.tsx`) from the audit.
4. THE Audit_Runner SHALL exclude dynamic route segments (directories whose names start with `[`) from the audit.
5. WHEN discovery is complete, THE Audit_Runner SHALL report the total count of discovered tool pages before scoring begins.

---

### Requirement 2: Static Page Parsing

**User Story:** As a developer, I want the Parser to extract structured signals from each `page.tsx` without executing the code, so that the audit is fast and does not require a running server.

#### Acceptance Criteria

1. THE Parser SHALL extract the following signals from each `page.tsx` via static text analysis:
   - Presence and character length of `metadata.title`
   - Presence and character length of `metadata.description`
   - Presence of `metadata.keywords` array and its item count
   - Presence of `metadata.alternates.canonical`
   - Presence of `metadata.openGraph` block
   - Presence of `metadata.twitter` block
   - Presence of a `WebApplication` JSON-LD block
   - Presence of a `BreadcrumbList` JSON-LD block
   - Presence of a `FAQPage` JSON-LD block
   - Presence of an `<h1>` element
   - Presence of a breadcrumb `<nav>` element
   - Presence of a `PrivacyNote` component
   - Presence of a `RelatedToolsSection` component
   - Presence of an explanatory content `<section>` after the interactive component
   - Presence of a FAQ `<section>` with rendered FAQ items
   - Count of FAQ items defined in the page
   - Presence of `revalidate` export
   - Presence of a category chip label (the `primary-chip` element)
   - Presence of an intro paragraph below the `<h1>`
2. WHEN a signal cannot be determined from static analysis, THE Parser SHALL record it as absent rather than throwing an error.
3. THE Parser SHALL return a typed `ParsedPageSignals` object for each tool page.

---

### Requirement 3: SEO & Content Scoring

**User Story:** As a developer, I want each tool page scored on SEO and content quality, so that I can identify pages with weak metadata or thin content.

#### Acceptance Criteria

1. THE Scorer SHALL compute an SEO_Score (0–100) for each tool page based on the signals in the `ParsedPageSignals` object.
2. WHEN `metadata.title` is absent or fewer than 30 characters, THE Scorer SHALL deduct points and add the warning `"Weak or missing metadata title"`.
3. WHEN `metadata.description` is absent or fewer than 80 characters, THE Scorer SHALL deduct points and add the warning `"Weak or missing metadata description"`.
4. WHEN `metadata.keywords` is absent or contains fewer than 5 items, THE Scorer SHALL add the warning `"Insufficient keywords"`.
5. WHEN `metadata.alternates.canonical` is absent, THE Scorer SHALL deduct points and add the warning `"Missing canonical URL"`.
6. WHEN `metadata.openGraph` is absent, THE Scorer SHALL deduct points and add the warning `"Missing OpenGraph metadata"`.
7. WHEN `metadata.twitter` is absent, THE Scorer SHALL deduct points and add the warning `"Missing Twitter card metadata"`.
8. WHEN the `WebApplication` JSON-LD block is absent, THE Scorer SHALL deduct points and add the warning `"Missing WebApplication structured data"`.
9. WHEN the `BreadcrumbList` JSON-LD block is absent, THE Scorer SHALL deduct points and add the warning `"Missing BreadcrumbList structured data"`.
10. WHEN the `FAQPage` JSON-LD block is absent, THE Scorer SHALL deduct points and add the warning `"Missing FAQPage structured data"`.
11. WHEN the FAQ section contains fewer than 4 items, THE Scorer SHALL add the warning `"FAQ has fewer than 4 items"`.
12. WHEN the explanatory content section is absent, THE Scorer SHALL deduct points and add the warning `"Missing explanatory content section"`.

---

### Requirement 4: UX & Usability Scoring

**User Story:** As a developer, I want each tool page scored on UX and usability signals, so that I can identify pages missing navigation, privacy notices, or structural elements.

#### Acceptance Criteria

1. THE Scorer SHALL compute a UX_Score (0–100) for each tool page based on the signals in the `ParsedPageSignals` object.
2. WHEN the breadcrumb `<nav>` element is absent, THE Scorer SHALL deduct points and add the warning `"Missing breadcrumb navigation"`.
3. WHEN the `<h1>` element is absent, THE Scorer SHALL deduct points and add the warning `"Missing H1 heading"`.
4. WHEN the intro paragraph below the `<h1>` is absent, THE Scorer SHALL deduct points and add the warning `"Missing intro paragraph"`.
5. WHEN the `PrivacyNote` component is absent, THE Scorer SHALL deduct points and add the warning `"Missing PrivacyNote"`.
6. WHEN the `RelatedToolsSection` component is absent, THE Scorer SHALL deduct points and add the warning `"Missing RelatedToolsSection"`.
7. WHEN the category chip label is absent, THE Scorer SHALL add the warning `"Missing category chip label"`.
8. WHEN the `revalidate` export is absent, THE Scorer SHALL add the warning `"Missing revalidate export"`.

---

### Requirement 5: Competitive Feature Scoring

**User Story:** As a developer, I want each tool page scored on competitive content features, so that I can identify pages that are missing elements present in the best-performing tools.

#### Acceptance Criteria

1. THE Scorer SHALL compute a Feature_Score (0–100) for each tool page based on the presence of features defined in the Standard_Template.
2. THE Standard_Template SHALL define the following required features, each worth a proportional share of the Feature_Score:
   - Explanatory content section with at least 2 sub-headings (`<h2>`)
   - FAQ section with at least 4 items
   - `RelatedToolsSection` component
   - `PrivacyNote` component
   - `WebApplication` JSON-LD with a `featureList` array
   - Breadcrumb navigation (both visual and JSON-LD)
   - Category chip label
   - Intro paragraph of at least 80 characters
3. WHEN a required feature is absent, THE Scorer SHALL record it as a gap in the Feature_Score calculation.
4. THE Scorer SHALL return the list of missing Standard_Template features as part of the scored result.

---

### Requirement 6: Overall Score Calculation

**User Story:** As a developer, I want a single Overall_Score per tool so that I can rank tools and prioritise improvement work.

#### Acceptance Criteria

1. THE Scorer SHALL compute the Overall_Score as a weighted composite: SEO_Score × 0.40 + UX_Score × 0.35 + Feature_Score × 0.25.
2. THE Overall_Score SHALL be clamped to the range 0–100.
3. WHEN the Overall_Score is below the Threshold (default 70), THE Scorer SHALL mark the tool as `needsWork: true`.
4. THE Scorer SHALL return a `ScoredToolPage` object containing: `toolSlug`, `category`, `pagePath`, `seoScore`, `uxScore`, `featureScore`, `overallScore`, `needsWork`, and `warnings`.

---

### Requirement 7: Audit Report Generation

**User Story:** As a developer, I want the Audit_Runner to produce a ranked report so that I can immediately see which tools need the most work.

#### Acceptance Criteria

1. WHEN all tool pages have been scored, THE Audit_Runner SHALL sort results by Overall_Score ascending (lowest-scoring tools first).
2. THE Audit_Runner SHALL print a summary table to stdout containing: rank, category, tool slug, overall score, SEO score, UX score, feature score, and a `needsWork` flag.
3. THE Audit_Runner SHALL print the total count of tools audited, the count flagged as `needsWork`, and the average Overall_Score.
4. WHEN the `--json` flag is passed, THE Audit_Runner SHALL write the full scored results array to `audit-report.json` in the project root instead of printing the table.
5. WHEN the `--category` flag is passed with a category name, THE Audit_Runner SHALL restrict the audit to tools in that category only.
6. WHEN the `--threshold` flag is passed with a numeric value, THE Audit_Runner SHALL use that value as the Threshold instead of the default 70.
7. IF any tool page fails to parse, THEN THE Audit_Runner SHALL log the error with the tool path and continue auditing remaining tools without exiting.

---

### Requirement 8: Standard Template Documentation

**User Story:** As a developer, I want a machine-readable and human-readable definition of the Standard_Template, so that I can use it as a checklist when improving tool pages.

#### Acceptance Criteria

1. THE Audit_Runner SHALL generate a `TOOL_TEMPLATE_CHECKLIST.md` file in the project root when the `--checklist` flag is passed.
2. THE checklist SHALL list every Standard_Template feature with a description, the scoring weight it contributes, and an example drawn from the compound-interest-calculator reference implementation.
3. THE Scorer module SHALL export a `STANDARD_TEMPLATE_FEATURES` constant that enumerates all required features with their weights, so that other scripts can import and reuse the definition.

---

### Requirement 9: Incremental Re-audit

**User Story:** As a developer, I want to re-audit a single tool after making improvements, so that I can verify the score has improved without waiting for a full audit.

#### Acceptance Criteria

1. WHEN the `--tool` flag is passed with a tool path (e.g. `finance/compound-interest-calculator`), THE Audit_Runner SHALL audit only that single tool and print its full scored result including all warnings.
2. WHEN the `--tool` flag is used, THE Audit_Runner SHALL print each warning with a suggested fix drawn from the Standard_Template.
3. IF the specified tool path does not exist, THEN THE Audit_Runner SHALL print a descriptive error message and exit with a non-zero code.

---

### Requirement 10: Minimum Content Depth

**User Story:** As a site owner, I want every tool page to have at least 1,000 words of useful content below the tool, so that pages rank well and provide genuine value to users.

#### Acceptance Criteria

1. EACH tool page SHALL contain at least 1,000 words of content placed below the interactive tool component.
2. THE content SHALL be relevant and beneficial to the tool — explaining concepts, formulas, use cases, tips, and related context — not filler or repeated text.
3. THE content SHALL be structured with `<h2>` and `<h3>` headings to aid readability and SEO.
4. THE content SHALL NOT appear above the interactive tool component — the tool must be the first thing users interact with after the page header.
5. WHEN the Fixer runs in `--fix` mode and a page has fewer than 1,000 words of content below the tool, THE Fixer SHALL generate and insert appropriate content sections to meet the threshold.
6. THE Parser SHALL extract an approximate word count of content below the interactive component as the `contentWordCount` signal.
7. WHEN `contentWordCount` is below 1,000, THE Scorer SHALL add the warning `"Insufficient content depth (below 1000 words)"` and deduct points from the SEO_Score.

---

### Requirement 11: Automated Fix Application

**User Story:** As a developer, I want the system to automatically fix issues it finds in each tool page, so that I don't have to manually apply the same structural improvements across 100+ files.

#### Acceptance Criteria

1. WHEN the `--fix` flag is passed, THE Audit_Runner SHALL attempt to automatically fix every warning it can resolve for each tool that has `needsWork: true`.
2. THE Fixer SHALL be capable of automatically resolving the following warning types by patching the `page.tsx` source:
   - `"Missing canonical URL"` — add `alternates: { canonical: absoluteUrl(PAGE_PATH) }` to the metadata export
   - `"Missing OpenGraph metadata"` — add a minimal `openGraph` block to the metadata export
   - `"Missing Twitter card metadata"` — add a minimal `twitter` block to the metadata export
   - `"Missing WebApplication structured data"` — add a `buildWebApplicationJsonLd()` function and render its output via `<JsonLd>`
   - `"Missing BreadcrumbList structured data"` — add `buildBreadcrumbJsonLd` call and render via `<JsonLd>`
   - `"Missing FAQPage structured data"` — add `buildFaqJsonLd` call and render via `<JsonLd>` (only when a `faq` array already exists in the file)
   - `"Missing PrivacyNote"` — add `<PrivacyNote />` import and render it in the page header section
   - `"Missing RelatedToolsSection"` — add `<RelatedToolsSection>` import and render it at the bottom of the page
   - `"Missing revalidate export"` — add `export const revalidate = 43200;` near the top of the file
   - `"Missing category chip label"` — add the `primary-chip` label element above the `<h1>`
   - `"Missing breadcrumb navigation"` — add a breadcrumb `<nav>` element above the `<h1>`
3. WHEN a warning cannot be automatically fixed (e.g. `"FAQ has fewer than 4 items"` requires content generation, `"Weak or missing metadata title"` requires human judgement), THE Fixer SHALL skip it and record it as `skipped`.
4. AFTER applying fixes to a tool page, THE Audit_Runner SHALL re-parse and re-score the file to verify the fix was effective.
5. THE Audit_Runner SHALL record the Fix_Status (`fixed`, `partial`, or `skipped`) for each tool processed in fix mode.
6. WHEN fix mode completes, THE Audit_Runner SHALL print a fix summary showing: total tools processed, count fully fixed (score ≥ threshold after fix), count partially fixed (score improved but still below threshold), count skipped (no fixable warnings), and count where fix had no effect.
7. THE Fixer SHALL never delete existing content — it SHALL only add missing elements or extend existing structures.
8. WHEN the `--fix` flag is combined with `--tool`, THE Audit_Runner SHALL fix only the specified tool.
9. WHEN the `--fix` flag is combined with `--category`, THE Audit_Runner SHALL fix only tools in the specified category.

---

### Requirement 12: Fix Progress Tracking

**User Story:** As a developer, I want to see progress as tools are fixed one by one, so that I know the system is working and can monitor which tools have been improved.

#### Acceptance Criteria

1. WHILE fix mode is running, THE Audit_Runner SHALL print a progress line for each tool as it is processed, showing the tool path, before score, after score, and Fix_Status.
2. THE progress output SHALL use a consistent format: `[n/total] category/tool-slug  before→after  [fixed|partial|skipped]`.
3. WHEN a tool's score reaches or exceeds the Threshold after fixing, THE Audit_Runner SHALL mark it as `fixed` in the progress output.
4. WHEN a tool's score improves but remains below the Threshold after fixing, THE Audit_Runner SHALL mark it as `partial`.
5. WHEN a tool has no automatically fixable warnings, THE Audit_Runner SHALL mark it as `skipped` without modifying the file.
