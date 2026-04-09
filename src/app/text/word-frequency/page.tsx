import Link from "next/link";
import type { Metadata } from "next";

import WordFrequency from "@/app/text/word-frequency/components/WordFrequency";
import JsonLd from "@/components/seo/JsonLd";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/text/word-frequency";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What can a word frequency counter tell me about my text?",
    answer:
      "It shows which words appear most often, how heavily certain terms dominate the draft, and whether your wording feels repetitive or overly concentrated around a few phrases.",
  },
  {
    question: "How is keyword density shown here?",
    answer:
      "Each ranked word includes a percentage so you can see how much of the analyzed text that term represents. That is useful for SEO review, editing, and checking whether a phrase appears too often.",
  },
  {
    question: "Can I use this for SEO without treating it like a strict SEO score?",
    answer:
      "Yes. It works well as a quick keyword review tool, but it is best used as a writing aid rather than a rigid target. Repetition data is most useful when you combine it with human editing judgment.",
  },
  {
    question: "Can I use this tool for SEO and content analysis?",
    answer:
      "Yes. It is useful for keyword frequency review, editorial cleanup, research notes, transcripts, and any draft where you want a faster read on repeated wording.",
  },
];

export const metadata: Metadata = {
  title: "Word Frequency Counter | Free Online Text Analyzer",
  description:
    "Analyze text instantly with a free word frequency counter. Count repeated words, review keyword density, and surface the most-used terms in one clean tool.",
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
      "Paste text, count repeated words, review density, and surface the most frequent terms instantly.",
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
      "Free word frequency counter that analyzes text instantly, ranks repeated words, highlights keyword density, and surfaces the most-used terms.",
    featureList: [
      "Real-time word frequency analysis",
      "Keyword density percentages",
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
      
        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
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
            This tool normalizes words, ranks them from highest frequency to lowest, and shows density percentages so you can see which terms are carrying too much of the page or draft.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How the analysis works</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Text is normalized so capitalized and lowercase versions of the same word count together.</li>
            <li>Punctuation is stripped before counting, which keeps the ranking clean.</li>
            <li>Each word receives a count and a density percentage so you can judge frequency more realistically.</li>
            <li>You can copy the ranked list or export it as CSV for a quick handoff into a sheet or report.</li>
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

      <RelatedToolsSection category="Text" categoryHref="/text" currentPath={PAGE_PATH} />
    </div>
  );
}
