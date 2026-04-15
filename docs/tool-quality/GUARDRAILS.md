# Tool Page Guardrails

Guardrails are enforced by `npm run quality:guardrails`.

## Hard Checks

- Duplicate metadata title across built-in tool pages.
- Duplicate metadata description across built-in tool pages.
- Generic phrase density above threshold.
- FAQ depth below minimum when FAQ exists.

## Thresholds

Defined in `src/lib/audit/program-rubric.ts`:

- `minFaqItems = 4`
- `maxGenericPhraseHits = 3`
- `similarityThreshold = 0.82` (used for content-risk analysis)

## Generic Phrase Watchlist

The audit checks for repeated patterns such as:

- "free, browser-based tool"
- "no sign-up"
- "all processing happens in your browser"
- "never sent to any server"
- "operational clarity instead of filler"

## Outputs

- `reports/tool-quality/guardrail-violations.json`
- Non-zero exit in strict mode if any violations exist.

## Recommended CI Usage

Run both:

- `npm run quality:program`
- `npm run quality:guardrails`

If strict mode fails, resolve top violations before shipping a new batch of pages.

