export const QUALITY_RUBRIC_WEIGHTS = {
  contentRisk: 0.35,
  seoOpportunity: 0.25,
  uxImpact: 0.2,
  templateDebt: 0.1,
  quickWin: 0.1,
} as const;

export const GENERIC_PHRASES = [
  "free, browser-based tool",
  "no sign-up",
  "no signup",
  "instantly",
  "all processing happens in your browser",
  "never sent to any server",
  "operational clarity instead of filler",
  "utility pages in this category",
];

export const CONTENT_GUARDRAILS = {
  minFaqItems: 4,
  maxIntroParagraphs: 4,
  maxGenericPhraseHits: 3,
  similarityThreshold: 0.82,
} as const;

export const NON_FIXABLE_WARNINGS = new Set([
  "Weak or missing metadata title",
  "Weak or missing metadata description",
  "Insufficient keywords",
  "FAQ has fewer than 4 items",
  "Missing explanatory content section",
  "Missing H1 heading",
  "Missing intro paragraph",
]);

