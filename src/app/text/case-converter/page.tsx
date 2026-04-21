import Link from "next/link";
import type { Metadata } from "next";

import CaseConverter from "@/app/text/case-converter/components/CaseConverter";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const revalidate = 43200;

const PAGE_PATH = "/text/case-converter";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "When would I use a case converter?",
    answer:
      "Use it when text needs to move between writing, SEO, and developer formats such as uppercase, sentence case, SEO title case, camelCase, snake_case, kebab-case, or CONSTANT_CASE.",
  },
  {
    question: "What is camelCase?",
    answer:
      "camelCase joins words without spaces and capitalizes each word after the first, like productImageUrl. It is common for JavaScript variables and object keys.",
  },
  {
    question: "What is the difference between title case and sentence case?",
    answer:
      "Title case capitalizes the main words in a heading, while sentence case capitalizes the start of a sentence and leaves the rest mostly lowercase.",
  },
  {
    question: "When would I use snake_case or kebab-case?",
    answer:
      "Snake case is common in file names, database fields, and variables, while kebab case is common in URLs, CSS naming patterns, and slugs.",
  },
  {
    question: "Which case should I use for URLs?",
    answer:
      "Use kebab-case for most URL slugs, such as case-converter-tool. Hyphenated lowercase URLs are readable and widely used for SEO-friendly paths.",
  },
  {
    question: "Can I copy the converted result directly?",
    answer:
      "Yes. The tool includes a copy action so you can move the converted output straight into your next workflow.",
  },
];

export const metadata: Metadata = {
  title: "Case Converter for Writing, SEO, and Developer Formats",
  description:
    "Convert text into uppercase, lowercase, smart title case, sentence case, camelCase, PascalCase, kebab-case, snake_case, CONSTANT_CASE, and more.",
  keywords: [
    "case converter",
    "uppercase converter",
    "lowercase converter",
    "title case converter",
    "sentence case converter",
    "camel case converter",
    "snake case converter",
    "kebab case converter",
    "pascal case converter",
    "constant case converter",
    "seo title case converter",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Case Converter for Writing, SEO, and Code",
    description:
      "Convert, format, and optimize text for headings, URLs, variables, filenames, and developer naming conventions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Converter",
    description:
      "Convert text into multiple naming and writing styles instantly with one free case converter.",
  },
};

function buildCaseConverterJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Case Converter",
    url: PAGE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free case converter for writing, SEO, and developer formats including smart title case, camelCase, PascalCase, kebab-case, snake_case, CONSTANT_CASE, dot.case, path/case, alternating case, and inverse case.",
    featureList: [
      "Uppercase conversion",
      "Lowercase conversion",
      "Title case conversion",
      "Sentence case conversion",
      "camelCase conversion",
      "PascalCase conversion",
      "kebab-case conversion",
      "snake_case conversion",
      "CONSTANT_CASE conversion",
      "Find and replace before conversion",
      "Line-by-line conversion",
      "Copy per format",
    ],
  };
}

export default function CaseConverterPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Text", path: "/text" },
    { name: "Case Converter", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildCaseConverterJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/text" className="hover:text-primary">Text</Link></li>
            <li>/</li>
            <li className="text-foreground">Case Converter</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Text utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Case Converter
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Convert text into the exact format you need for writing, SEO, or code. Use smart title case for headings, kebab-case for URLs, snake_case for databases, and camelCase or PascalCase for development.
          </p>
        </div>
      
        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <CaseConverter />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Types of text case explained</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Text case is more than capitalization. Writers use title case and sentence case for readable headings and body copy. SEO teams use kebab-case for slugs and clean URLs. Developers use camelCase, PascalCase, snake_case, CONSTANT_CASE, dot.case, and path/case to match language, API, database, and file naming conventions. A strong case converter helps text move between those contexts without repetitive manual edits.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This tool supports both writing-oriented formats like title case and sentence case, and developer- or structure-oriented formats like camelCase, PascalCase, kebab-case, and snake_case.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Case formats in programming</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">camelCase:</strong> JavaScript variables, JSON keys, and frontend identifiers.</li>
            <li><strong className="text-foreground">PascalCase:</strong> React components, classes, and exported type names.</li>
            <li><strong className="text-foreground">snake_case:</strong> Python variables, database columns, and analytics fields.</li>
            <li><strong className="text-foreground">kebab-case:</strong> URL slugs, CSS-friendly labels, and route paths.</li>
            <li><strong className="text-foreground">CONSTANT_CASE:</strong> environment variables, constants, and config keys.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Case conversion for SEO</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Case formatting matters for titles, metadata, and URLs. Use SEO Title Case for page titles and headlines where readability matters. Use kebab-case for slugs because lowercase hyphenated URLs are easy to scan, paste, and share. If you are preparing copy for publishing, continue into the <Link href="/text/duplicate-word-finder" className="text-primary hover:underline">duplicate word finder</Link> or <Link href="/text/readability-flesch-kincaid-calculator" className="text-primary hover:underline">readability calculator</Link> after conversion.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common use cases</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Cleaning up headings, captions, and meta descriptions</li>
            <li>Turning phrases into URL slugs or structured labels</li>
            <li>Renaming variables and component identifiers</li>
            <li>Standardizing imported or pasted text before publishing</li>
          </ul>
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faq.map((item) => (
            <article key={item.question} className="rounded-[1.25rem] border border-border bg-background p-5">
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <RelatedToolsSection category="Text" categoryHref="/text" currentPath={PAGE_PATH} />
    </div>
  );
}


