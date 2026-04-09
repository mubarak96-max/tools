import Link from "next/link";
import type { Metadata } from "next";

import DuplicateWordFinder from "@/app/text/duplicate-word-finder/components/DuplicateWordFinder";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/text/duplicate-word-finder";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "When is a duplicate word finder useful?",
    answer:
      "It scans text, groups repeated words together, and shows which terms appear more than once so you can spot overused language quickly.",
  },
  {
    question: "Why is duplicate-word detection useful?",
    answer:
      "Repeated words can make writing feel weak, repetitive, or careless. Detecting them helps when editing essays, product copy, captions, and long-form content.",
  },
  {
    question: "Does this tool ignore punctuation and case?",
    answer:
      "Yes. The duplicate finder normalizes text to lowercase and strips punctuation before counting, which keeps repeated-word detection clean.",
  },
  {
    question: "Can I copy the duplicate-word results?",
    answer:
      "Yes. The tool includes a copy action so you can move the result list into another workflow or review document.",
  },
];

export const metadata: Metadata = {
  title: "Duplicate Word Finder | Free Repeated Word Checker",
  description:
    "Find repeated words in text instantly with a free duplicate word finder. Surface overused terms, duplicate counts, and the most repeated words in one tool.",
  keywords: [
    "duplicate word finder",
    "repeated word checker",
    "duplicate words tool",
    "find repeated words",
    "word repetition checker",
    "overused words checker",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Duplicate Word Finder for Fast Draft Cleanup",
    description:
      "Find repeated words, duplicate counts, and overused terms instantly in one text-cleanup tool.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Duplicate Word Finder",
    description:
      "Scan text for repeated words and duplicate counts instantly with one free checker.",
  },
};

function buildDuplicateWordFinderJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Duplicate Word Finder",
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
      "Free duplicate word finder that identifies repeated words, ranks overused terms, and summarizes repeated-word counts for quick editing.",
    featureList: [
      "Repeated word detection",
      "Duplicate word ranking",
      "Copy results",
      "Total repeated-occurrence summary",
      "Most repeated word summary",
    ],
  };
}

export default function DuplicateWordFinderPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Text", path: "/text" },
    { name: "Duplicate Word Finder", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const relatedTools = getRelatedFreeTools(PAGE_PATH).filter((tool) => tool.category === "Text");
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildDuplicateWordFinderJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/text" className="hover:text-primary">Text</Link></li>
            <li>/</li>
            <li className="text-foreground">Duplicate Word Finder</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Text utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Duplicate Word Finder
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Scan any draft for repeated words, overused terms, and duplicate counts in one pass. Useful for editing essays, landing pages, captions, and long-form content before publishing.
          </p>
          {currentTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{currentTool.description}</p>
          ) : null}
        </div>
      
        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <DuplicateWordFinder />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why duplicate-word checks matter</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Repeated words can weaken otherwise strong writing. They make copy feel rushed, reduce rhythm, and often point to places where a sentence needs a cleaner structure or better vocabulary choice.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A duplicate word finder gives you a fast editing pass before you move into deeper rewriting. It helps with articles, product pages, captions, essays, and any text where repetition stands out.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How the checker works</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Text is normalized to lowercase so the same word is grouped consistently.</li>
            <li>Punctuation is stripped before counting repeated terms.</li>
            <li>Only words with more than one use are surfaced in the result list.</li>
            <li>The most repeated word and total duplicate occurrences are summarized automatically.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common use cases</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Editing essays, reports, and long-form drafts</li>
            <li>Checking landing-page copy for overused terms</li>
            <li>Cleaning up social captions, bios, and short marketing copy</li>
            <li>Reviewing AI-generated or first-pass text before publishing</li>
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
