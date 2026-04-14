import fs from "fs";
import type { ParsedPageSignals } from "./types";

function zeroedSignals(): ParsedPageSignals {
    return {
        metaTitleLength: 0,
        metaDescriptionLength: 0,
        metaKeywordsCount: 0,
        hasCanonical: false,
        hasOpenGraph: false,
        hasTwitterCard: false,
        hasWebApplicationJsonLd: false,
        hasBreadcrumbJsonLd: false,
        hasFaqPageJsonLd: false,
        hasExplanatorySection: false,
        hasH1: false,
        hasBreadcrumbNav: false,
        hasPrivacyNote: false,
        hasRelatedToolsSection: false,
        hasCategoryChip: false,
        hasIntroP: false,
        hasRevalidateExport: false,
        faqItemCount: 0,
        explanatorySectionH2Count: 0,
        introPLength: 0,
        contentWordCount: 0,
    };
}

function countWordsAfterTool(source: string): number {
    // Find second <section to approximate "below the tool"
    const firstSection = source.indexOf('<section');
    if (firstSection !== -1) {
        const secondSection = source.indexOf('<section', firstSection + 1);
        const startPos = secondSection !== -1 ? secondSection : firstSection;
        const contentPart = source.slice(startPos);
        const textMatches = contentPart.match(/>([^<]+)</g) ?? [];
        const words = textMatches
            .map(m => m.slice(1, -1).trim())
            .filter(t => t.length > 2 && !/^[\{\}\(\)\[\]"'`=:;,\.\/\\]/.test(t))
            .join(' ')
            .split(/\s+/)
            .filter(w => w.length > 0);
        if (words.length > 50) return words.length;
    }

    // Fallback: count words in learn={...} or infoSection={...} props (ToolPageScaffold / HealthToolPage pattern)
    // Find the learn or infoSection prop content
    const learnMatch = source.match(/(?:learn|infoSection)\s*=\s*\{([\s\S]+?)(?=\n\s*\}[\s\n]*>|\n\s*[a-zA-Z])/);
    if (learnMatch) {
        const textMatches = learnMatch[1].match(/>([^<{]+)</g) ?? [];
        const words = textMatches
            .map(m => m.slice(1, -1).trim())
            .filter(t => t.length > 2 && !/^[\{\}\(\)\[\]"'`=:;,\.\/\\]/.test(t))
            .join(' ')
            .split(/\s+/)
            .filter(w => w.length > 0);
        return words.length;
    }

    return 0;
}

export function parseBuiltinPage(filePath: string): ParsedPageSignals {
    const signals = zeroedSignals();

    try {
        const source = fs.readFileSync(filePath, "utf8");

        // --- SEO signals ---

        // metaTitleLength — direct property OR inside buildMetadata({title: "..."})
        try {
            const titleMatch = source.match(/title\s*:\s*["'`]([^"'`]+)["'`]/);
            signals.metaTitleLength = titleMatch ? titleMatch[1].length : 0;
        } catch { /* ignore */ }

        // metaDescriptionLength — direct property OR inside buildMetadata({description: "..."})
        try {
            const descMatch = source.match(/description\s*:\s*["'`]([^"'`]+)["'`]/);
            signals.metaDescriptionLength = descMatch ? descMatch[1].length : 0;
        } catch { /* ignore */ }

        // metaKeywordsCount
        try {
            const kwMatch = source.match(/keywords\s*:\s*\[([\s\S]+?)\]/);
            signals.metaKeywordsCount = kwMatch
                ? (kwMatch[1].match(/["'`][^"'`]+["'`]/g) ?? []).length
                : 0;
        } catch { /* ignore */ }

        // hasCanonical — direct alternates OR buildMetadata (which always sets canonical)
        try {
            signals.hasCanonical = (source.includes("alternates") && source.includes("canonical")) || source.includes("buildMetadata(");
        } catch { /* ignore */ }

        // hasOpenGraph — direct openGraph OR buildMetadata (which always sets openGraph)
        try {
            signals.hasOpenGraph = source.includes("openGraph") || source.includes("buildMetadata(");
        } catch { /* ignore */ }

        // hasTwitterCard — direct twitter OR buildMetadata (which always sets twitter)
        try {
            signals.hasTwitterCard = source.includes("twitter") || source.includes("buildMetadata(");
        } catch { /* ignore */ }

        // hasWebApplicationJsonLd — WebApplication OR SoftwareApplication (used by ToolPageScaffold)
        try {
            signals.hasWebApplicationJsonLd =
                source.includes('"WebApplication"') ||
                source.includes('"SoftwareApplication"') ||
                source.includes("ToolPageScaffold");
        } catch { /* ignore */ }

        // hasBreadcrumbJsonLd — inline type string OR helper function call OR ToolPageScaffold/HealthToolPage
        try {
            signals.hasBreadcrumbJsonLd =
                source.includes('"BreadcrumbList"') ||
                source.includes("buildBreadcrumbJsonLd") ||
                source.includes("ToolPageScaffold") ||
                source.includes("HealthToolPage");
        } catch { /* ignore */ }

        // hasFaqPageJsonLd — inline type string OR helper function call OR ToolPageScaffold with faqs prop
        try {
            signals.hasFaqPageJsonLd =
                source.includes('"FAQPage"') ||
                source.includes("buildFaqJsonLd") ||
                (source.includes("ToolPageScaffold") && source.includes("faqs="));
        } catch { /* ignore */ }

        // hasWebApplicationJsonLd — WebApplication OR SoftwareApplication (used by ToolPageScaffold)
        try {
            signals.hasWebApplicationJsonLd =
                source.includes('"WebApplication"') ||
                source.includes('"SoftwareApplication"') ||
                source.includes("ToolPageScaffold") ||
                source.includes("HealthToolPage");
        } catch { /* ignore */ }

        // hasExplanatorySection — heuristic: more than one <section in the source
        try {
            const sectionMatches = source.match(/<section/g);
            signals.hasExplanatorySection = sectionMatches !== null && sectionMatches.length > 1;
        } catch { /* ignore */ }

        // --- UX signals ---

        // hasH1
        try {
            signals.hasH1 = source.includes("<h1") || source.includes("ToolPageScaffold") || source.includes("HealthToolPage");
        } catch { /* ignore */ }

        // hasBreadcrumbNav
        try {
            signals.hasBreadcrumbNav =
                source.includes('aria-label="Breadcrumb"') ||
                source.includes("aria-label='Breadcrumb'") ||
                source.includes("ToolPageScaffold") ||
                source.includes("HealthToolPage");
        } catch { /* ignore */ }

        // hasPrivacyNote
        try {
            signals.hasPrivacyNote = source.includes("<PrivacyNote") || source.includes("ToolPageScaffold") || source.includes("HealthToolPage");
        } catch { /* ignore */ }

        // hasRelatedToolsSection
        try {
            signals.hasRelatedToolsSection = source.includes("<RelatedToolsSection") || source.includes("ToolPageScaffold") || source.includes("HealthToolPage");
        } catch { /* ignore */ }

        // hasCategoryChip
        try {
            signals.hasCategoryChip = source.includes("primary-chip") || source.includes("ToolPageScaffold") || source.includes("HealthToolPage");
        } catch { /* ignore */ }

        // hasIntroP — heuristic: source has both <h1 and at least one <p
        try {
            signals.hasIntroP = (source.includes("<h1") && source.includes("<p")) || source.includes("ToolPageScaffold") || source.includes("HealthToolPage");
        } catch { /* ignore */ }

        // hasRevalidateExport
        try {
            signals.hasRevalidateExport = source.includes("export const revalidate");
        } catch { /* ignore */ }

        // --- Feature signals ---

        // faqItemCount — count { occurrences inside the faq array, or faqs prop items
        try {
            const faqArrayMatch = source.match(/const faq\s*=\s*\[([\s\S]+?)\]/);
            if (faqArrayMatch) {
                signals.faqItemCount = (faqArrayMatch[1].match(/\{/g) ?? []).length;
            } else {
                // ToolPageScaffold pattern: faqs={faq} where faq is defined as array
                const faqsMatch = source.match(/(?:const|let|var)\s+faq[s]?\s*=\s*\[([\s\S]+?)\]/);
                signals.faqItemCount = faqsMatch ? (faqsMatch[1].match(/\{/g) ?? []).length : 0;
            }
        } catch { /* ignore */ }

        // explanatorySectionH2Count — count all <h2 occurrences
        try {
            const h2Matches = source.match(/<h2/g);
            signals.explanatorySectionH2Count = h2Matches ? h2Matches.length : 0;
        } catch { /* ignore */ }

        // introPLength — length of first <p> content after <h1>
        try {
            const h1Index = source.indexOf("<h1");
            if (h1Index !== -1) {
                const afterH1 = source.slice(h1Index);
                const pMatch = afterH1.match(/<p[^>]*>([^<]+)<\/p>/);
                signals.introPLength = pMatch ? pMatch[1].length : 0;
            }
        } catch { /* ignore */ }

        // contentWordCount — count words in content below the tool
        try {
            signals.contentWordCount = countWordsAfterTool(source);
        } catch { /* ignore */ }
    } catch {
        // File unreadable or any top-level error — return zeroed signals
        return zeroedSignals();
    }

    return signals;
}
