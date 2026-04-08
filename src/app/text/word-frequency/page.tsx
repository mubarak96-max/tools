import Link from "next/link";
import type { Metadata } from "next";

import WordFrequency from "@/app/text/word-frequency/components/WordFrequency";
import JsonLd from "@/components/seo/JsonLd";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/text/word-frequency";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What does a word frequency counter do?",
    answer:
      "It scans a block of text, normalizes repeated words, and ranks them by how often they appear so you can see dominant terms quickly.",
  },
  {
    question: "Why would I ignore stop words?",
    answer:
      "Common words like 'the', 'and', or 'is' can dominate a text without telling you much. Ignoring them makes the output more useful for SEO, research, and editing.",
  },
  {
    question: "What does minimum word length change?",
    answer:
      "It filters out short words so you can focus on more substantial terms. For example, setting a minimum length of 4 removes many low-signal words.",
  },
  {
    question: "Can I use this tool for SEO and content analysis?",
    answer:
      "Yes. It works well for keyword frequency review, content optimization, academic analysis, and spotting repeated phrasing in drafts.",
  },
];

export const metadata: Metadata = {
  title: "Word Frequency Counter | Free Online Text Analyzer",
  description:
    "Analyze text instantly with a free word frequency counter. Count repeated words, filter stop words, and surface the most-used terms in one clean tool.",
  keywords: [
    "word frequency counter",
    "keyword frequency checker",
    "text analyzer",
    "most used words tool",
    "word repetition checker",
    "keyword density tool",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Word Frequency Counter for Fast Text Analysis",
    description:
      "Paste text, count repeated words, filter stop words, and surface the most frequent terms instantly.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Word Frequency Counter",
    description:
      "Count repeated words and analyze text structure instantly with stop-word and length filters.",
  },
};

function buildWordFrequencyApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Word Frequency Counter",
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
      "Free word frequency counter that analyzes text instantly, ranks repeated words, filters stop words, and highlights the most-used terms.",
    featureList: [
      "Real-time word frequency analysis",
      "Stop-word filtering",
      "Minimum word length filtering",
      "Most frequent word summary",
      "Unique word count",
    ],
  };
}

export default function WordFrequencyCounterPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Text", path: "/text" },
    { name: "Word Frequency Counter", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const relatedTools = getRelatedFreeTools(PAGE_PATH);
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildWordFrequencyApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/text" className="hover:text-primary">Text</Link></li>
            <li>/</li>
            <li className="text-foreground">Word Frequency Counter</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Text utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Word Frequency Counter
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Paste any block of text and instantly see which words appear most often, how many unique terms you use, and whether repeated phrases are dominating the draft.
          </p>
          {currentTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{currentTool.description}</p>
          ) : null}
        </div>
      </section>

      <WordFrequency />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What a word frequency counter helps you spot</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Repeated words can reveal a lot about a draft. In SEO copy, they show keyword emphasis. In essays, they expose repetition and weak variation. In research or interviews, they help surface the dominant language inside a source document.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This tool cleans your text, normalizes words to lowercase, and ranks the output from highest frequency to lowest. That gives you an instant view of which terms carry the most weight.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How the analysis works</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Text is normalized so capitalized and lowercase versions of the same word count together.</li>
            <li>Punctuation is stripped before counting, which keeps the ranking clean.</li>
            <li>Optional stop-word filtering removes common filler words like &quot;the&quot; and &quot;and&quot;.</li>
            <li>A minimum length filter helps focus on more meaningful keywords.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common use cases</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>SEO keyword review before publishing a landing page or blog post</li>
            <li>Editing support for essays, reports, and academic writing</li>
            <li>Content optimization to reduce repetition and tighten language</li>
            <li>Quick text analysis for research notes, transcripts, and interviews</li>
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
