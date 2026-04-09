import Link from "next/link";
import type { Metadata } from "next";

import CharacterCounter from "@/app/text/character-counter/components/CharacterCounter";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { PrivacyNote } from "@/components/tools/ToolPageScaffold";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/text/character-counter";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What does a character counter count?",
    answer:
      "It counts every character in your text, including letters, numbers, spaces, punctuation, and line breaks. This version also shows a second total without spaces.",
  },
  {
    question: "Why is character count without spaces useful?",
    answer:
      "Some platforms, forms, and submission systems care about raw text length without spaces. That makes the no-spaces number useful for stricter field limits.",
  },
  {
    question: "Does this tool also count words and sentences?",
    answer:
      "Yes. It gives you total words, sentences, paragraphs, and estimated reading time alongside the character count.",
  },
  {
    question: "Can I use this for social captions and meta descriptions?",
    answer:
      "Yes. A character counter is useful for headlines, ad copy, social posts, meta descriptions, and any form where text length matters.",
  },
];

export const metadata: Metadata = {
  title: "Character Counter | Free Online Character and Word Count Tool",
  description:
    "Count characters, characters without spaces, words, sentences, paragraphs, and reading time in one free online character counter.",
  keywords: [
    "character counter",
    "word counter",
    "character count tool",
    "characters without spaces",
    "text length checker",
    "reading time calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Character Counter for Fast Text Length Checks",
    description:
      "Check characters, words, sentences, paragraphs, and reading time instantly in one text utility.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Character Counter",
    description:
      "Count characters, words, and reading time instantly with a clean text-length checker.",
  },
};

function buildCharacterCounterJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Character Counter",
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
      "Free online character counter with word count, sentence count, paragraph count, no-space total, and reading-time estimates.",
    featureList: [
      "Character count",
      "Characters without spaces",
      "Word count",
      "Sentence count",
      "Paragraph count",
      "Reading time estimate",
    ],
  };
}

export default function CharacterCounterPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Text", path: "/text" },
    { name: "Character Counter", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const relatedTools = getRelatedFreeTools(PAGE_PATH).filter((tool) => tool.category === "Text");
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildCharacterCounterJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/text" className="hover:text-primary">Text</Link></li>
            <li>/</li>
            <li className="text-foreground">Character Counter</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Text utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Character Counter
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Check text length instantly for headlines, captions, bios, form fields, and SEO copy. One paste shows character totals, no-space counts, words, sentences, paragraphs, and reading time.
          </p>
          {currentTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{currentTool.description}</p>
          ) : null}
        </div>
      
        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <CharacterCounter />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why a character counter matters</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Text length limits show up everywhere: social posts, profile bios, ad headlines, metadata fields, product descriptions, and application forms. A fast character counter lets you check those limits without manually trimming text or guessing where you stand.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This version goes beyond a single number. It also shows words, sentences, paragraphs, and an estimated reading time, which makes it useful for both short-form and long-form writing workflows.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">What each metric tells you</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Characters:</strong> total text length, including spaces and punctuation.</li>
            <li><strong className="text-foreground">Without spaces:</strong> stricter raw text length for systems that exclude spacing.</li>
            <li><strong className="text-foreground">Words:</strong> quick length and scope check for drafts and summaries.</li>
            <li><strong className="text-foreground">Sentences and paragraphs:</strong> useful for structure review.</li>
            <li><strong className="text-foreground">Reading time:</strong> rough estimate based on standard reading speed.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common use cases</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Checking social captions, bios, titles, and meta descriptions before publishing</li>
            <li>Reviewing landing-page and ad-copy length</li>
            <li>Estimating reading time for blog intros and content sections</li>
            <li>Checking draft structure before editing or summarizing</li>
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
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Related text tools</h2>
          <Link href="/text" className="text-sm font-medium text-primary hover:underline">
            All text tools â†’
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {relatedTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group rounded-[1.25rem] border border-border bg-background p-4 transition-all hover:border-primary/20 hover:bg-primary-soft"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
                {tool.icon && (
                  <span className="shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">{tool.icon}</span>
                )}
              </div>
              <p className="text-xs leading-5 text-muted-foreground line-clamp-2">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}


