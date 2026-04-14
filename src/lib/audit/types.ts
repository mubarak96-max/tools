export interface ParsedPageSignals {
    // SEO signals
    metaTitleLength: number;
    metaDescriptionLength: number;
    metaKeywordsCount: number;
    hasCanonical: boolean;
    hasOpenGraph: boolean;
    hasTwitterCard: boolean;
    hasWebApplicationJsonLd: boolean;
    hasBreadcrumbJsonLd: boolean;
    hasFaqPageJsonLd: boolean;
    hasExplanatorySection: boolean;

    // UX signals
    hasH1: boolean;
    hasBreadcrumbNav: boolean;
    hasPrivacyNote: boolean;
    hasRelatedToolsSection: boolean;
    hasCategoryChip: boolean;
    hasIntroP: boolean;
    hasRevalidateExport: boolean;

    // Feature signals
    faqItemCount: number;
    explanatorySectionH2Count: number;
    introPLength: number;
    contentWordCount: number;
}

export interface ScoredToolPage {
    toolSlug: string;
    category: string;
    pagePath: string;
    seoScore: number;
    uxScore: number;
    featureScore: number;
    overallScore: number;
    needsWork: boolean;
    warnings: string[];
    missingFeatures: string[];
}

export interface FixResult {
    filePath: string;
    appliedFixes: string[];
    skippedWarnings: string[];
    scoreBefore: number;
    scoreAfter: number;
    fixStatus: "fixed" | "partial" | "skipped";
}

export interface StandardTemplateFeature {
    id: string;
    label: string;
    description: string;
    weight: number;
    example: string;
    signalKey: keyof ParsedPageSignals;
}

export interface ToolPagePath {
    category: string;
    toolSlug: string;
    pagePath: string;
}
