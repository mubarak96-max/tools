# Rollout Governance

This document defines the operating cadence for scaling quality across 300+ tools.

## Cadence

- **Weekly**
  - Run `npm run quality:program`
  - Review `reports/tool-quality/top-20-priority.md`
  - Pull 5 tools into active polish sprint
- **Per release**
  - Run `npm run quality:guardrails`
  - Block release if strict guardrails fail
- **Monthly**
  - Review template debt report and consolidate shared patterns

## Publish Gate

A tool page is publish-ready when:

- It has no strict guardrail violations.
- Its overall score meets team threshold.
- It includes specific use-case copy (not only template filler).
- It follows the tool-first layout structure.

## Pilot Structure

- Phase 1: Top 20 by priority score.
- Phase 2: Expand to next 50 pages.
- Phase 3: Long-tail pages via template and registry improvements.

## Ownership

- **Content owner:** resolves copy quality and FAQ depth.
- **Frontend owner:** resolves template debt and design consistency.
- **SEO owner:** resolves metadata collisions and SERP differentiation.

## Artifacts

Maintain these generated files in each run:

- `reports/tool-quality/inventory.json`
- `reports/tool-quality/template-debt-report.md`
- `reports/tool-quality/top-20-priority.md`
- `reports/tool-quality/guardrail-violations.json`

