import Link from "next/link";
import type { Metadata } from "next";

import RemoveDuplicateLines from "@/app/text/remove-duplicate-lines/components/RemoveDuplicateLines";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/text/remove-duplicate-lines";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What does remove duplicate lines do?",
    answer:
      "It scans multiline text, keeps the first occurrence of each line, and removes repeated lines while preserving the original order.",
  },
  {
    question: "Does the tool keep the first matching line?",
    answer:
      "Yes. When duplicates are found, the first instance is kept and later repeated lines are removed from the output.",
  },
  {
    question: "Can I ignore case or whitespace differences?",
    answer:
      "Yes. You can compare lines case-insensitively and trim leading or trailing whitespace before duplicate detection.",
  },
  {
    question: "What is this useful for?",
    answer:
      "It is useful for cleaning keyword lists, email exports, logs, copied spreadsheet rows, and any repeated multiline text before reuse.",
  },
];

export const metadata: Metadata = {
  title: "Remove Duplicate Lines | Free Online Line Deduplicator",
  description:
    "Remove duplicate lines from text instantly. Clean repeated rows, keep the first occurrence, and copy the unique-line result in one free online tool.",
  keywords: [
    "remove duplicate lines",
    "deduplicate lines",
    "remove repeated lines",
    "unique lines tool",
    "line deduplicator",
    "remove duplicate rows from text",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Remove Duplicate Lines from Text Instantly",
    description:
      "Clean repeated lines, keep unique entries, and copy the deduplicated result in one text utility.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Duplicate Lines",
    description:
      "Remove repeated lines from multiline text and keep only unique entries.",
  },
};

function buildRemoveDuplicateLinesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Remove Duplicate Lines",
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
      "Free online tool to remove duplicate lines from text while preserving the first occurrence of each line.",
    featureList: [
      "Remove duplicate lines",
      "Preserve first occurrence order",
      "Case-sensitive comparison option",
      "Trim whitespace option",
      "Ignore blank lines option",
      "Copy cleaned result",
    ],
  };
}

export default function RemoveDuplicateLinesPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Text", path: "/text" },
    { name: "Remove Duplicate Lines", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const relatedTools = getRelatedFreeTools(PAGE_PATH).filter((tool) => tool.category === "Text");
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildRemoveDuplicateLinesJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/text" className="hover:text-primary">Text</Link></li>
            <li>/</li>
            <li className="text-foreground">Remove Duplicate Lines</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Text utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Remove Duplicate Lines
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Clean repeated lines from lists, rows, logs, and copied text instantly. Keep only the first
            occurrence of each line and export a cleaner multiline result in one pass.
          </p>
          {currentTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{currentTool.description}</p>
          ) : null}
        </div>
      </section>

      <RemoveDuplicateLines />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why removing duplicate lines helps</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Repeated lines can make exported lists messy and harder to work with. They show up often in
            copied spreadsheet rows, search-keyword lists, email exports, and logs where multiple identical
            entries end up mixed together.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A line deduplicator gives you a fast cleanup pass before you paste that data somewhere else or
            use it in another workflow.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How this tool works</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Each line is checked in the order it appears.</li>
            <li>The first version of a line is kept.</li>
            <li>Later repeated copies of the same line are removed.</li>
            <li>You can choose whether case and whitespace differences should count as unique lines.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common use cases</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Cleaning copied keyword lists and search terms</li>
            <li>Deduplicating email exports or contact rows</li>
            <li>Removing repeated lines from logs or transcripts</li>
            <li>Preparing cleaner text before importing it into another tool</li>
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
              Return to the text hub and move across focused cleanup and analysis utilities.
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
