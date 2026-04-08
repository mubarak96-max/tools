import Link from "next/link";
import type { Metadata } from "next";

import CaseConverter from "@/app/text/case-converter/components/CaseConverter";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/text/case-converter";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What does a case converter do?",
    answer:
      "It rewrites the same text into a different letter case style, such as uppercase, lowercase, title case, sentence case, camelCase, snake_case, or kebab-case.",
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
    question: "Can I copy the converted result directly?",
    answer:
      "Yes. The tool includes a copy action so you can move the converted output straight into your next workflow.",
  },
];

export const metadata: Metadata = {
  title: "Case Converter | Free Uppercase, Lowercase, Title Case Tool",
  description:
    "Convert text into uppercase, lowercase, title case, sentence case, camelCase, PascalCase, kebab-case, and snake_case with one free tool.",
  keywords: [
    "case converter",
    "uppercase converter",
    "lowercase converter",
    "title case converter",
    "sentence case converter",
    "camel case converter",
    "snake case converter",
    "kebab case converter",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Case Converter for Fast Text Cleanup",
    description:
      "Convert text across uppercase, lowercase, title, sentence, camel, pascal, kebab, and snake case instantly.",
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
      "Free case converter for uppercase, lowercase, title case, sentence case, camelCase, PascalCase, kebab-case, and snake_case text conversion.",
    featureList: [
      "Uppercase conversion",
      "Lowercase conversion",
      "Title case conversion",
      "Sentence case conversion",
      "camelCase conversion",
      "PascalCase conversion",
      "kebab-case conversion",
      "snake_case conversion",
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
  const relatedTools = getRelatedFreeTools(PAGE_PATH).filter((tool) => tool.category === "Text");
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildCaseConverterJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
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
            Convert text between writing styles and naming conventions in one pass. Useful for headlines, content cleanup, file naming, slugs, variables, and structured copy workflows.
          </p>
          {currentTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{currentTool.description}</p>
          ) : null}
        </div>
      </section>

      <CaseConverter />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why a case converter is useful</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Text often needs to move between contexts: a headline becomes a slug, a sentence becomes a variable, or a rough draft needs cleaner capitalization. A case converter removes that repetitive cleanup work.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This tool supports both writing-oriented formats like title case and sentence case, and developer- or structure-oriented formats like camelCase, PascalCase, kebab-case, and snake_case.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">When to use each format</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Uppercase:</strong> labels, emphasis, and short UI strings.</li>
            <li><strong className="text-foreground">Lowercase:</strong> normalized plain text.</li>
            <li><strong className="text-foreground">Title or sentence case:</strong> editorial and marketing copy.</li>
            <li><strong className="text-foreground">camelCase and PascalCase:</strong> variables, identifiers, and component names.</li>
            <li><strong className="text-foreground">kebab-case and snake_case:</strong> URLs, file names, slugs, and machine-readable labels.</li>
          </ul>

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

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Related tool paths</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Link
            href="/text"
            className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
          >
            <h3 className="text-base font-semibold text-foreground">Browse text tools</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Return to the text hub and move across focused language and analysis utilities.
            </p>
          </Link>
          <Link
            href="/tools"
            className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
          >
            <h3 className="text-base font-semibold text-foreground">Explore software tools</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Go back to the main software directory for structured comparisons and product reviews.
            </p>
          </Link>
          {relatedTools[0] ? (
            <Link
              href={relatedTools[0].href}
              className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
            >
              <h3 className="text-base font-semibold text-foreground">{relatedTools[0].name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{relatedTools[0].description}</p>
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}
