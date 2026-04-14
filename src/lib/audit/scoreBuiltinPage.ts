import type { ParsedPageSignals, ScoredToolPage, StandardTemplateFeature } from "./types";

export const STANDARD_TEMPLATE_FEATURES: StandardTemplateFeature[] = [
    {
        id: "explanatory-section",
        label: "Explanatory content section with ≥2 h2 headings",
        description:
            "A dedicated explanatory section with at least two h2 headings improves SEO depth and helps users understand the tool's purpose and methodology.",
        weight: 15,
        example:
            '<section><h2>How It Works</h2>...<h2>Formula Used</h2>...</section>',
        signalKey: "explanatorySectionH2Count",
    },
    {
        id: "faq-section",
        label: "FAQ section with ≥7 items",
        description:
            "A FAQ section with at least 7 question-answer pairs enables FAQPage JSON-LD structured data and targets long-tail search queries.",
        weight: 15,
        example:
            'const faq = [{ q: "What is...", a: "..." }, { q: "How do I...", a: "..." }, ...]',
        signalKey: "faqItemCount",
    },
    {
        id: "related-tools",
        label: "RelatedToolsSection component",
        description:
            "The RelatedToolsSection component surfaces contextually relevant tools, improving internal linking and user engagement.",
        weight: 15,
        example: '<RelatedToolsSection category="finance" currentSlug={TOOL_SLUG} />',
        signalKey: "hasRelatedToolsSection",
    },
    {
        id: "privacy-note",
        label: "PrivacyNote component",
        description:
            "The PrivacyNote component reassures users that their data is processed client-side and never sent to a server.",
        weight: 15,
        example: '<PrivacyNote />',
        signalKey: "hasPrivacyNote",
    },
    {
        id: "web-app-jsonld",
        label: "WebApplication JSON-LD structured data",
        description:
            "WebApplication JSON-LD enables rich results in Google Search and signals to crawlers that the page hosts an interactive tool.",
        weight: 15,
        example: '{ "@type": "WebApplication", "name": "...", "featureList": [...] }',
        signalKey: "hasWebApplicationJsonLd",
    },
    {
        id: "breadcrumb",
        label: "Breadcrumb navigation and JSON-LD",
        description:
            "Breadcrumb navigation improves UX wayfinding and, combined with BreadcrumbList JSON-LD, enables breadcrumb rich results in SERPs.",
        weight: 15,
        example:
            '<nav aria-label="Breadcrumb">...</nav> + { "@type": "BreadcrumbList", ... }',
        signalKey: "hasBreadcrumbNav",
    },
    {
        id: "category-chip",
        label: "Category chip label",
        description:
            "A visible category chip above the h1 provides immediate context about the tool's domain and reinforces topical relevance.",
        weight: 5,
        example: '<p className="primary-chip">Finance</p>',
        signalKey: "hasCategoryChip",
    },
    {
        id: "intro-paragraph",
        label: "Intro paragraph ≥80 characters",
        description:
            "An introductory paragraph of at least 80 characters sets context for the tool and contributes to content depth signals.",
        weight: 5,
        example: '<p className="intro-p">Use this calculator to quickly determine...</p>',
        signalKey: "introPLength",
    },
];

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

function computeSeoScore(signals: ParsedPageSignals): { score: number; warnings: string[] } {
    const warnings: string[] = [];
    let score = 100;

    if (signals.metaTitleLength < 30) {
        warnings.push("Weak or missing metadata title");
        score -= 15;
    }
    if (signals.metaDescriptionLength < 80) {
        warnings.push("Weak or missing metadata description");
        score -= 15;
    }
    if (signals.metaKeywordsCount < 5) {
        warnings.push("Insufficient keywords");
        score -= 5;
    }
    if (!signals.hasCanonical) {
        warnings.push("Missing canonical URL");
        score -= 10;
    }
    if (!signals.hasOpenGraph) {
        warnings.push("Missing OpenGraph metadata");
        score -= 10;
    }
    if (!signals.hasTwitterCard) {
        warnings.push("Missing Twitter card metadata");
        score -= 8;
    }
    if (!signals.hasWebApplicationJsonLd) {
        warnings.push("Missing WebApplication structured data");
        score -= 12;
    }
    if (!signals.hasBreadcrumbJsonLd) {
        warnings.push("Missing BreadcrumbList structured data");
        score -= 8;
    }
    if (!signals.hasFaqPageJsonLd) {
        warnings.push("Missing FAQPage structured data");
        score -= 8;
    }
    if (signals.faqItemCount < 4) {
        warnings.push("FAQ has fewer than 4 items");
        score -= 5;
    }
    if (!signals.hasExplanatorySection) {
        warnings.push("Missing explanatory content section");
        score -= 10;
    }
    if (signals.contentWordCount < 1000) {
        warnings.push("Insufficient content depth (below 1000 words)");
        score -= 15;
    }

    return { score: clamp(score, 0, 100), warnings };
}

function computeUxScore(signals: ParsedPageSignals): { score: number; warnings: string[] } {
    const warnings: string[] = [];
    let score = 100;

    if (!signals.hasBreadcrumbNav) {
        warnings.push("Missing breadcrumb navigation");
        score -= 20;
    }
    if (!signals.hasH1) {
        warnings.push("Missing H1 heading");
        score -= 20;
    }
    if (!signals.hasIntroP) {
        warnings.push("Missing intro paragraph");
        score -= 15;
    }
    if (!signals.hasPrivacyNote) {
        warnings.push("Missing PrivacyNote");
        score -= 15;
    }
    if (!signals.hasRelatedToolsSection) {
        warnings.push("Missing RelatedToolsSection");
        score -= 15;
    }
    if (!signals.hasCategoryChip) {
        warnings.push("Missing category chip label");
        score -= 8;
    }
    if (!signals.hasRevalidateExport) {
        warnings.push("Missing revalidate export");
        score -= 7;
    }

    return { score: clamp(score, 0, 100), warnings };
}

function computeFeatureScore(
    signals: ParsedPageSignals,
): { score: number; missingFeatures: string[] } {
    const missingFeatures: string[] = [];
    let score = 0;

    for (const feature of STANDARD_TEMPLATE_FEATURES) {
        let present = false;

        switch (feature.id) {
            case "explanatory-section":
                present = signals.explanatorySectionH2Count >= 2;
                break;
            case "faq-section":
                present = signals.faqItemCount >= 4;
                break;
            case "related-tools":
                present = signals.hasRelatedToolsSection;
                break;
            case "privacy-note":
                present = signals.hasPrivacyNote;
                break;
            case "web-app-jsonld":
                present = signals.hasWebApplicationJsonLd;
                break;
            case "breadcrumb":
                present = signals.hasBreadcrumbNav && signals.hasBreadcrumbJsonLd;
                break;
            case "category-chip":
                present = signals.hasCategoryChip;
                break;
            case "intro-paragraph":
                present = signals.introPLength >= 80;
                break;
        }

        if (present) {
            score += feature.weight;
        } else {
            missingFeatures.push(feature.label);
        }
    }

    return { score: clamp(score, 0, 100), missingFeatures };
}

export function scoreBuiltinPage(
    signals: ParsedPageSignals,
    toolSlug: string,
    category: string,
    pagePath: string,
    options?: { threshold?: number },
): ScoredToolPage {
    const threshold = options?.threshold ?? 70;

    const { score: seoScore, warnings: seoWarnings } = computeSeoScore(signals);
    const { score: uxScore, warnings: uxWarnings } = computeUxScore(signals);
    const { score: featureScore, missingFeatures } = computeFeatureScore(signals);

    const overallScore = clamp(seoScore * 0.4 + uxScore * 0.35 + featureScore * 0.25, 0, 100);
    const needsWork = overallScore < threshold;

    return {
        toolSlug,
        category,
        pagePath,
        seoScore,
        uxScore,
        featureScore,
        overallScore,
        needsWork,
        warnings: [...seoWarnings, ...uxWarnings],
        missingFeatures,
    };
}
