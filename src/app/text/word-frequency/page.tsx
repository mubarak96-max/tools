import Link from "next/link";
import type { Metadata } from "next";

import WordFrequency from "@/app/text/word-frequency/components/WordFrequency";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/text/word-frequency";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is word frequency?",
    answer:
      "Word frequency is the number of times each word appears in a text. A word frequency counter ranks those words so you can spot repetition, dominant terms, and topic signals.",
  },
  {
    question: "How is keyword density shown here?",
    answer:
      "Each ranked word includes a percentage so you can see how much of the analyzed text that term represents. That is useful for SEO review, editing, and checking whether a phrase appears too often.",
  },
  {
    question: "What is a good keyword frequency?",
    answer:
      "There is no universal ideal count. Use frequency and density as review signals: your main terms should be visible, but repeated wording should still read naturally.",
  },
  {
    question: "What is keyword stuffing?",
    answer:
      "Keyword stuffing is the unnatural overuse of a term to manipulate search relevance. High word frequency alone does not mean better SEO; context and readability matter.",
  },
  {
    question: "How many times should a keyword appear?",
    answer:
      "Use the count, density percentage, and overuse warnings together. If a word dominates the text, rewrite nearby repeats, use natural variants, and check readability before publishing.",
  },
];

export const metadata: Metadata = {
  title: "Word Frequency Counter | Keyword Frequency and Repetition Tool",
  description:
    "Analyze word frequency, keyword density, repeated words, dominant topics, rare words, and vocabulary diversity with a free text analysis tool.",
  keywords: [
    "word frequency counter",
    "keyword frequency checker",
    "text analyzer",
    "most used words tool",
    "word repetition checker",
    "keyword density tool",
    "word usage analyzer",
    "most used words in text",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Word Frequency Counter and Keyword Repetition Tool",
    description:
      "Find repeated words, density percentages, dominant terms, rare words, and practical editing signals.",
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
      "Free word frequency counter that analyzes text instantly, ranks repeated words, highlights keyword density, groups frequent and rare words, and surfaces editing recommendations.",
    featureList: [
      "Real-time word frequency analysis",
      "Keyword density percentages",
      "Stop-word filtering",
      "Overuse warnings",
      "Grouped frequent and rare words",
      "Word cloud and bar visualization",
      "Most frequent word summary",
      "Unique word count",
      "Copy and CSV export",
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

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildWordFrequencyApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
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
            Find what you repeat, what matters, and how to improve your content. Paste text to see word counts, keyword density, dominant terms, rare words, visual charts, and overuse warnings.
          </p>
        </div>
      
        <div className="mt-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-tight text-success">
            Private and browser-native
          </div>
        </div>
      </section>

      <WordFrequency />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is a word frequency counter?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A word frequency counter counts how many times each word appears in a piece of text, then ranks the words by usage. It helps you see which terms dominate a draft, which words repeat too often, and whether the vocabulary is varied enough for the purpose. Writers use it to tighten repetitive language, SEO teams use it to review keyword focus, and researchers use it to surface common terms in notes, transcripts, interviews, and source material.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This tool goes beyond a flat count by showing density percentages, stop-word filtering, grouped results, overuse warnings, dominant topic terms, rare words, and a simple visual layer for fast scanning.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How word frequency helps SEO</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Word frequency helps SEO by showing whether important terms are present without forcing unnatural repetition. Use the dominant terms to confirm topic focus, density percentages to spot possible keyword stuffing, and rare-word groups to find thin or one-off language. Frequency is not a ranking score, but it is a useful content audit signal before checking readability, search intent, and coverage.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to use word frequency results</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Review overused words first, especially if density is high and the wording feels repetitive.</li>
            <li>Check the top 3 dominant terms to confirm the page or draft matches the intended topic.</li>
            <li>Use stop-word filtering when reviewing SEO keywords, themes, and content focus.</li>
            <li>Export CSV when you need to compare drafts, share a content audit, or save keyword usage data.</li>
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

      <section className="mt-16 border-t border-slate-100 pt-16">
        <Link href="/text" className="secondary-button px-4 py-2 text-xs">
          View All Text Tools
        </Link>
      </section>
    </div>
  );
}


