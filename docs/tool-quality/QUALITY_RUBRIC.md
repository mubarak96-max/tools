# Tool Quality Rubric

This rubric is used by `scripts/tool-quality-program.ts` to prioritize improvements across 300+ tools.

## Weighted Priority Score

`priorityScore = 0.35*contentRisk + 0.25*seoOpportunity + 0.20*uxImpact + 0.10*templateDebt + 0.10*quickWin`

- `contentRisk` (35%): generic copy density, repeated intent wording, weak FAQ depth.
- `seoOpportunity` (25%): inverse of current SEO score from built-in audit.
- `uxImpact` (20%): inverse of current UX score from built-in audit.
- `templateDebt` (10%): scaffold overuse + styling drift indicators.
- `quickWin` (10%): percentage of warnings that are auto-fixable.

## Scoring Components

- **Content risk inputs**
  - Generic phrase matches from `src/lib/audit/program-rubric.ts`
  - Similarity collisions from `EXACT_TEXT_SEO_CONTENT`
  - FAQ depth check (`faqItemCount < 4`)
- **SEO/UX inputs**
  - Derived from `scoreBuiltinPage()`
- **Template debt inputs**
  - `ToolPageScaffold` dependence
  - `HealthToolPage` dependence
  - Raw `text-slate-*` / `text-gray-*` / `bg-*` / `border-*` class usage
  - `prose-invert` usage in light-mode oriented content blocks
- **Quick-win inputs**
  - Warning count vs fixable-warning count

## Prioritization Output

Each run writes:

- `reports/tool-quality/priority-scores.json`
- `reports/tool-quality/top-20-priority.json`
- `reports/tool-quality/top-20-priority.md`

Use the top-20 list as the redesign pilot batch.

