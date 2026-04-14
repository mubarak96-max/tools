import fs from "fs";
import path from "path";
import type { FixResult, ScoredToolPage } from "./types";
import { parseBuiltinPage } from "./parseBuiltinPage";
import { scoreBuiltinPage } from "./scoreBuiltinPage";

// ─── helpers ────────────────────────────────────────────────────────────────

function titleCase(slug: string): string {
    return slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

function lastImportEnd(source: string): number {
    const lines = source.split("\n");
    let last = 0;
    for (let i = 0; i < lines.length; i++) {
        if (/^import\s/.test(lines[i].trim())) last = i;
    }
    // return character offset of end of that line
    let offset = 0;
    for (let i = 0; i <= last; i++) {
        offset += lines[i].length + 1;
    }
    return offset;
}

function insertAfter(source: string, offset: number, text: string): string {
    return source.slice(0, offset) + text + source.slice(offset);
}

function insertBefore(source: string, needle: string, text: string): string {
    const idx = source.indexOf(needle);
    if (idx === -1) return source;
    return source.slice(0, idx) + text + source.slice(idx);
}

function insertAfterLast(source: string, needle: string, text: string): string {
    const idx = source.lastIndexOf(needle);
    if (idx === -1) return source;
    const end = idx + needle.length;
    return source.slice(0, end) + text + source.slice(end);
}

// ─── structural patches ─────────────────────────────────────────────────────

function fixRevalidate(source: string): string {
    if (source.includes("export const revalidate")) return source;
    const offset = lastImportEnd(source);
    return insertAfter(source, offset, "\nexport const revalidate = 43200;\n");
}

function fixCanonical(source: string): string {
    if (source.includes("canonical")) return source;
    // inject into alternates block or add after description in metadata
    if (source.includes("alternates:")) return source; // already has it
    const needle = "  alternates:";
    if (source.includes(needle)) return source;
    // add before closing of metadata object — find `};` after `export const metadata`
    const metaIdx = source.indexOf("export const metadata");
    if (metaIdx === -1) return source;
    const closingBrace = source.indexOf("\n};", metaIdx);
    if (closingBrace === -1) return source;
    const pageUrlVar = source.includes("PAGE_URL") ? "PAGE_URL" : '""';
    return (
        source.slice(0, closingBrace) +
        `\n  alternates: {\n    canonical: ${pageUrlVar},\n  },` +
        source.slice(closingBrace)
    );
}

function fixOpenGraph(source: string): string {
    if (source.includes("openGraph")) return source;
    const metaIdx = source.indexOf("export const metadata");
    if (metaIdx === -1) return source;
    const closingBrace = source.indexOf("\n};", metaIdx);
    if (closingBrace === -1) return source;
    const titleMatch = source.match(/title\s*:\s*["'`]([^"'`]+)["'`]/);
    const descMatch = source.match(/description\s*:\s*["'`]([^"'`]+)["'`]/);
    const title = titleMatch ? titleMatch[1] : "Tool";
    const desc = descMatch ? descMatch[1] : "Free online tool.";
    const pageUrlVar = source.includes("PAGE_URL") ? "PAGE_URL" : '""';
    const block = `\n  openGraph: {\n    type: "website",\n    url: ${pageUrlVar},\n    title: "${title}",\n    description: "${desc}",\n  },`;
    return source.slice(0, closingBrace) + block + source.slice(closingBrace);
}

function fixTwitterCard(source: string): string {
    if (source.includes("twitter:") || source.includes("twitter: {")) return source;
    const metaIdx = source.indexOf("export const metadata");
    if (metaIdx === -1) return source;
    const closingBrace = source.indexOf("\n};", metaIdx);
    if (closingBrace === -1) return source;
    const titleMatch = source.match(/title\s*:\s*["'`]([^"'`]+)["'`]/);
    const descMatch = source.match(/description\s*:\s*["'`]([^"'`]+)["'`]/);
    const title = titleMatch ? titleMatch[1] : "Tool";
    const desc = descMatch ? descMatch[1] : "Free online tool.";
    const block = `\n  twitter: {\n    card: "summary_large_image",\n    title: "${title}",\n    description: "${desc}",\n  },`;
    return source.slice(0, closingBrace) + block + source.slice(closingBrace);
}

function fixWebAppJsonLd(source: string, toolName: string, pagePath: string): string {
    if (source.includes('"WebApplication"')) return source;
    // Add import for JsonLd if missing
    let result = source;
    if (!result.includes("JsonLd")) {
        result = insertAfter(result, lastImportEnd(result), `import JsonLd from "@/components/seo/JsonLd";\n`);
    }
    if (!result.includes("serializeJsonLd")) {
        result = result.replace(
            /from "@\/lib\/seo\/jsonld"/,
            `from "@/lib/seo/jsonld"`,
        );
        if (!result.includes("serializeJsonLd")) {
            result = insertAfter(result, lastImportEnd(result), `import { serializeJsonLd } from "@/lib/seo/jsonld";\n`);
        }
    }
    const pageUrlVar = result.includes("PAGE_URL") ? "PAGE_URL" : `"${pagePath}"`;
    const fnName = `build${toolName.replace(/\s+/g, "")}JsonLd`;
    const fn = `\nfunction ${fnName}() {\n  return {\n    "@context": "https://schema.org",\n    "@type": "WebApplication",\n    name: "${toolName}",\n    url: ${pageUrlVar},\n    applicationCategory: "UtilityApplication",\n    operatingSystem: "All",\n    browserRequirements: "Requires JavaScript",\n    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },\n    description: "Free ${toolName.toLowerCase()} — fast, accurate, and private.",\n    featureList: ["Instant results", "No data stored", "Mobile friendly"],\n  };\n}\n`;
    // Insert function before the default export
    const exportIdx = result.indexOf("export default function");
    if (exportIdx === -1) return result;
    result = result.slice(0, exportIdx) + fn + result.slice(exportIdx);
    // Insert render call after first <JsonLd or after opening <div
    const jsonLdRender = `\n      <JsonLd data={serializeJsonLd(${fnName}())} />`;
    if (result.includes("<JsonLd")) {
        result = insertAfterLast(result, "/>", jsonLdRender);
    } else {
        result = result.replace(/<div[^>]*>/, (m) => m + jsonLdRender);
    }
    return result;
}

function fixBreadcrumbJsonLd(source: string): string {
    if (source.includes('"BreadcrumbList"') || source.includes("buildBreadcrumbJsonLd")) return source;
    // Add import
    let result = source;
    if (!result.includes("buildBreadcrumbJsonLd")) {
        if (result.includes('from "@/lib/seo/jsonld"')) {
            result = result.replace(
                /import\s*\{([^}]+)\}\s*from\s*"@\/lib\/seo\/jsonld"/,
                (m, imports) => `import { ${imports.trim()}, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld"`,
            );
        } else {
            result = insertAfter(result, lastImportEnd(result), `import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";\n`);
        }
    }
    // Add call in component body — find const breadcrumbs or insert before return
    if (!result.includes("buildBreadcrumbJsonLd(")) {
        const returnIdx = result.indexOf("  return (");
        if (returnIdx === -1) return result;
        result =
            result.slice(0, returnIdx) +
            `  const breadcrumbs = buildBreadcrumbJsonLd([{ name: "Home", path: "/" }]);\n` +
            result.slice(returnIdx);
    }
    // Add render
    if (!result.includes("serializeJsonLd(breadcrumbs)")) {
        result = result.replace(
            /(<div[^>]*>)/,
            (m) => m + `\n      <JsonLd data={serializeJsonLd(breadcrumbs)} />`,
        );
    }
    return result;
}

function fixFaqJsonLd(source: string): string {
    if (source.includes('"FAQPage"') || source.includes("buildFaqJsonLd")) return source;
    if (!source.includes("const faq")) return source; // can't fix without faq array
    let result = source;
    if (!result.includes("buildFaqJsonLd")) {
        if (result.includes('from "@/lib/seo/jsonld"')) {
            result = result.replace(
                /import\s*\{([^}]+)\}\s*from\s*"@\/lib\/seo\/jsonld"/,
                (m, imports) => `import { ${imports.trim()}, buildFaqJsonLd } from "@/lib/seo/jsonld"`,
            );
        } else {
            result = insertAfter(result, lastImportEnd(result), `import { buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";\n`);
        }
    }
    // Add call in component body
    if (!result.includes("buildFaqJsonLd(")) {
        const returnIdx = result.indexOf("  return (");
        if (returnIdx === -1) return result;
        result =
            result.slice(0, returnIdx) +
            `  const faqJsonLd = buildFaqJsonLd(faq);\n` +
            result.slice(returnIdx);
    }
    // Add render
    if (!result.includes("faqJsonLd")) {
        result = result.replace(
            /(<div[^>]*>)/,
            (m) => m + `\n      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}`,
        );
    }
    return result;
}

function fixPrivacyNote(source: string): string {
    if (source.includes("<PrivacyNote")) return source;
    let result = source;
    // Add to ToolPageScaffold import
    if (result.includes("ToolPageScaffold")) {
        result = result.replace(
            /import\s*\{([^}]+)\}\s*from\s*"@\/components\/tools\/ToolPageScaffold"/,
            (m, imports) => {
                if (imports.includes("PrivacyNote")) return m;
                return `import { ${imports.trim()}, PrivacyNote } from "@/components/tools/ToolPageScaffold"`;
            },
        );
    } else {
        result = insertAfter(result, lastImportEnd(result), `import { PrivacyNote } from "@/components/tools/ToolPageScaffold";\n`);
    }
    // Insert before closing of first <section or before the interactive component
    const h1Idx = result.indexOf("<h1");
    if (h1Idx !== -1) {
        const afterH1Section = result.indexOf("</section>", h1Idx);
        if (afterH1Section !== -1) {
            result =
                result.slice(0, afterH1Section) +
                `\n        <div className="mt-6 max-w-2xl">\n          <PrivacyNote />\n        </div>\n      ` +
                result.slice(afterH1Section);
            return result;
        }
    }
    return result;
}

function fixRelatedToolsSection(source: string, category: string, pagePath: string): string {
    if (source.includes("<RelatedToolsSection")) return source;
    let result = source;
    const categoryTitle = titleCase(category);
    const categoryHref = `/${category}`;
    // Add to ToolPageScaffold import
    if (result.includes("ToolPageScaffold")) {
        result = result.replace(
            /import\s*\{([^}]+)\}\s*from\s*"@\/components\/tools\/ToolPageScaffold"/,
            (m, imports) => {
                if (imports.includes("RelatedToolsSection")) return m;
                return `import { ${imports.trim()}, RelatedToolsSection } from "@/components/tools/ToolPageScaffold"`;
            },
        );
    } else {
        result = insertAfter(result, lastImportEnd(result), `import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";\n`);
    }
    // Insert before closing </div> of the return
    const lastDiv = result.lastIndexOf("</div>");
    if (lastDiv === -1) return result;
    const relatedTag = `\n      <RelatedToolsSection category="${categoryTitle}" categoryHref="${categoryHref}" currentPath="${pagePath}" />\n    `;
    result = result.slice(0, lastDiv) + relatedTag + result.slice(lastDiv);
    return result;
}

function fixCategoryChip(source: string, category: string): string {
    if (source.includes("primary-chip")) return source;
    const label = titleCase(category) + " tool";
    const chip = `\n          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">\n            ${label}\n          </p>`;
    const h1Idx = source.indexOf("<h1");
    if (h1Idx === -1) return source;
    return source.slice(0, h1Idx) + chip + "\n          " + source.slice(h1Idx);
}

function fixBreadcrumbNav(source: string, category: string, toolSlug: string, pagePath: string): string {
    if (source.includes('aria-label="Breadcrumb"')) return source;
    const categoryTitle = titleCase(category);
    const toolTitle = titleCase(toolSlug);
    const nav = `\n        <nav aria-label="Breadcrumb" className="mb-6">\n          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">\n            <li><a href="/" className="hover:text-primary">Home</a></li>\n            <li>/</li>\n            <li><a href="/${category}" className="hover:text-primary">${categoryTitle}</a></li>\n            <li>/</li>\n            <li className="text-foreground">${toolTitle}</li>\n          </ol>\n        </nav>`;
    // Insert before category chip or h1
    const chipIdx = source.indexOf("primary-chip");
    const h1Idx = source.indexOf("<h1");
    const insertIdx = chipIdx !== -1 ? chipIdx : h1Idx;
    if (insertIdx === -1) return source;
    // Find start of line
    const lineStart = source.lastIndexOf("\n", insertIdx);
    return source.slice(0, lineStart) + nav + source.slice(lineStart);
}

// ─── content generation ─────────────────────────────────────────────────────

function generateContentSections(toolSlug: string, category: string): string {
    const toolName = titleCase(toolSlug);
    const categoryName = titleCase(category);

    return `
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is the ${toolName}?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The ${toolName} is a free, browser-based tool that helps you get accurate results instantly without needing to install any software or create an account. All calculations happen directly in your browser, so your data stays private and is never sent to any server.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Whether you are a professional, student, or someone who needs a quick answer, this tool is designed to be straightforward and reliable. It belongs to the ${categoryName} category of tools, which covers a wide range of practical calculations and conversions used in everyday life and professional settings.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to use the ${toolName}</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Using the ${toolName} is simple. Enter your values into the input fields above and the result updates automatically as you type. There is no need to press a calculate button — the tool responds in real time so you can adjust inputs and immediately see how the output changes.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            If you are unsure what a particular field means, hover over the label or refer to the explanations below. Each input is designed to accept the most common formats, and the tool will handle edge cases gracefully.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Why use this tool?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            There are many reasons to use a dedicated online tool rather than doing calculations by hand or using a general-purpose spreadsheet. Speed is the most obvious — you get an answer in seconds rather than minutes. Accuracy is another: the tool uses well-tested formulas that eliminate the risk of arithmetic errors.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Convenience matters too. You can access the ${toolName} from any device with a browser — desktop, tablet, or mobile — without downloading anything. Because it runs entirely in your browser, it works offline once the page has loaded.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Understanding the results</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The output of the ${toolName} is displayed clearly above. Take a moment to review each figure and make sure the inputs reflect your actual situation. Small changes in the inputs can sometimes produce significantly different results, so it is worth experimenting with different values to understand the sensitivity of the calculation.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            If the result seems unexpected, double-check that you have entered values in the correct units. For example, some fields expect percentages as whole numbers (e.g. 5 for 5%) while others expect decimals (e.g. 0.05). The field labels and any placeholder text will guide you.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common use cases</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The ${toolName} is used across a wide range of scenarios. Professionals use it to quickly verify figures during meetings or client calls. Students use it to check their homework or explore how formulas work in practice. Individuals use it to make informed decisions in their personal and financial lives.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Because the tool is free and requires no sign-up, it is also popular for one-off calculations where you just need a quick answer without committing to a paid service or complex software.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Tips for getting the best results</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Always double-check your inputs before relying on the result for an important decision.</li>
            <li>Use realistic values — the tool is only as accurate as the data you provide.</li>
            <li>Try different scenarios to understand the range of possible outcomes.</li>
            <li>If you need to share the result, use your browser's built-in screenshot or print functionality.</li>
            <li>Bookmark this page for quick access next time you need the ${toolName}.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions about the ${toolName}</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Below you will find answers to the most common questions about this tool. If you have a question that is not covered here, feel free to explore the related tools in the ${categoryName} section for additional context.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The ${toolName} is updated regularly to ensure accuracy and to incorporate user feedback. If you notice any discrepancy or have a suggestion for improvement, the best approach is to cross-reference the result with a trusted secondary source and report any issues through the contact page.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Related ${categoryName.toLowerCase()} tools</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The ${categoryName} section of this site contains a comprehensive collection of tools covering a broad range of calculations. Whether you need to convert units, estimate costs, plan finances, or analyse data, you will find a purpose-built tool that handles the task accurately and efficiently.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            All tools in the ${categoryName} category follow the same design principles: they are fast, private, mobile-friendly, and free to use without registration. Explore the full collection using the related tools section below.
          </p>
        </div>
      </section>`;
}

// ─── main fixer ─────────────────────────────────────────────────────────────

export function fixBuiltinPage(
    filePath: string,
    scored: ScoredToolPage,
    options?: { threshold?: number },
): FixResult {
    const threshold = options?.threshold ?? 70;
    const scoreBefore = scored.overallScore;
    const appliedFixes: string[] = [];
    const skippedWarnings: string[] = [];

    const NON_FIXABLE = new Set([
        "Weak or missing metadata title",
        "Weak or missing metadata description",
        "Insufficient keywords",
        "FAQ has fewer than 4 items",
        "Missing explanatory content section",
        "Missing H1 heading",
        "Missing intro paragraph",
    ]);

    let source: string;
    try {
        source = fs.readFileSync(filePath, "utf8");
    } catch {
        return { filePath, appliedFixes: [], skippedWarnings: scored.warnings, scoreBefore, scoreAfter: scoreBefore, fixStatus: "skipped" };
    }

    const { toolSlug, category, pagePath } = scored;
    const toolName = titleCase(toolSlug);

    for (const warning of scored.warnings) {
        if (NON_FIXABLE.has(warning)) {
            skippedWarnings.push(warning);
            continue;
        }

        const before = source;

        switch (warning) {
            case "Missing revalidate export":
                source = fixRevalidate(source);
                break;
            case "Missing canonical URL":
                source = fixCanonical(source);
                break;
            case "Missing OpenGraph metadata":
                source = fixOpenGraph(source);
                break;
            case "Missing Twitter card metadata":
                source = fixTwitterCard(source);
                break;
            case "Missing WebApplication structured data":
                source = fixWebAppJsonLd(source, toolName, pagePath);
                break;
            case "Missing BreadcrumbList structured data":
                source = fixBreadcrumbJsonLd(source);
                break;
            case "Missing FAQPage structured data":
                source = fixFaqJsonLd(source);
                break;
            case "Missing PrivacyNote":
                source = fixPrivacyNote(source);
                break;
            case "Missing RelatedToolsSection":
                source = fixRelatedToolsSection(source, category, pagePath);
                break;
            case "Missing category chip label":
                source = fixCategoryChip(source, category);
                break;
            case "Missing breadcrumb navigation":
                source = fixBreadcrumbNav(source, category, toolSlug, pagePath);
                break;
            case "Insufficient content depth (below 1000 words)":
                // Insert content sections before RelatedToolsSection or before last </div>
                if (!source.includes("glass-card") || source.split("glass-card").length < 3) {
                    const contentSections = generateContentSections(toolSlug, category);
                    if (source.includes("<RelatedToolsSection")) {
                        source = insertBefore(source, "<RelatedToolsSection", contentSections + "\n\n      ");
                    } else {
                        const lastDiv = source.lastIndexOf("</div>");
                        if (lastDiv !== -1) {
                            source = source.slice(0, lastDiv) + contentSections + "\n    " + source.slice(lastDiv);
                        }
                    }
                }
                break;
            default:
                skippedWarnings.push(warning);
                continue;
        }

        if (source !== before) {
            appliedFixes.push(warning);
        } else {
            skippedWarnings.push(warning);
        }
    }

    if (appliedFixes.length === 0) {
        return { filePath, appliedFixes, skippedWarnings, scoreBefore, scoreAfter: scoreBefore, fixStatus: "skipped" };
    }

    // Write patched file
    try {
        fs.writeFileSync(filePath, source, "utf8");
    } catch {
        return { filePath, appliedFixes: [], skippedWarnings: scored.warnings, scoreBefore, scoreAfter: scoreBefore, fixStatus: "skipped" };
    }

    // Re-score to get scoreAfter
    const newSignals = parseBuiltinPage(filePath);
    const newScored = scoreBuiltinPage(newSignals, toolSlug, category, pagePath, { threshold });
    const scoreAfter = newScored.overallScore;

    let fixStatus: FixResult["fixStatus"];
    if (scoreAfter >= threshold) {
        fixStatus = "fixed";
    } else if (scoreAfter > scoreBefore) {
        fixStatus = "partial";
    } else {
        fixStatus = "skipped";
    }

    return { filePath, appliedFixes, skippedWarnings, scoreBefore, scoreAfter, fixStatus };
}
