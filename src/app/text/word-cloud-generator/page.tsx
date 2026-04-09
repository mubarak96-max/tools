import Link from "next/link";
import type { Metadata } from "next";

import WordCloudGenerator from "@/app/text/word-cloud-generator/components/WordCloudGenerator";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/text/word-cloud-generator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a word cloud generator useful for?",
    answer:
      "It analyzes text, counts repeated words, and turns the most frequent terms into a visual cloud where stronger words appear larger.",
  },
  {
    question: "How is word size determined in the cloud?",
    answer:
      "Words that appear more often in the source text get a larger visual weight, while less frequent words stay smaller.",
  },
  {
    question: "Can I remove common filler words?",
    answer:
      "Yes. This tool includes an option to ignore common words, which helps the cloud focus on more meaningful terms.",
  },
  {
    question: "Can I copy the top words list?",
    answer:
      "Yes. You can copy the ranked top words and counts directly for analysis, reporting, or SEO review.",
  },
];

export const metadata: Metadata = {
  title: "Word Cloud Generator | Generate a Word Cloud from Text",
  description:
    "Generate a word cloud from text instantly. Turn repeated words into a visual keyword cloud with filtering, sizing, and copyable top-word output.",
  keywords: [
    "word cloud generator",
    "text to word cloud",
    "generate word cloud from text",
    "keyword cloud generator",
    "word frequency visualization",
    "tag cloud generator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Word Cloud Generator for Text Analysis",
    description:
      "Generate a word cloud from text instantly and highlight the most repeated terms visually.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Word Cloud Generator",
    description:
      "Turn text into a frequency-based word cloud with practical filters and copyable results.",
  },
};

function buildWordCloudJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Word Cloud Generator",
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
      "Free word cloud generator that turns text into a keyword cloud using word frequency analysis and simple filtering controls.",
    featureList: [
      "Generate word cloud from text",
      "Word frequency sizing",
      "Max words control",
      "Minimum length control",
      "Ignore common words",
      "Copy top words",
    ],
  };
}

export default function WordCloudGeneratorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Text", path: "/text" },
    { name: "Word Cloud Generator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const relatedTools = getRelatedFreeTools(PAGE_PATH).filter((tool) => tool.category === "Text");
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildWordCloudJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/text" className="hover:text-primary">Text</Link></li>
            <li>/</li>
            <li className="text-foreground">Word Cloud Generator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Text utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Word Cloud Generator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Generate a word cloud from text instantly and highlight the most repeated terms visually. Useful for keyword analysis, content review, topic discovery, and fast frequency-based text summaries.
          </p>
          {currentTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{currentTool.description}</p>
          ) : null}
        </div>
      
        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <WordCloudGenerator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How a word cloud helps with text analysis</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A word cloud gives you a fast visual summary of the terms that dominate a document. Instead of reading a long frequency table first, you can spot the biggest topics immediately because the most repeated words appear at the largest size.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            That makes it useful for content audits, SEO review, transcripts, essays, interview notes, and any text where you want a quick sense of topic concentration.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">What this version includes</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Frequency-based word sizing</li>
            <li>Maximum word count control</li>
            <li>Minimum word length control</li>
            <li>Optional stop-word filtering</li>
            <li>Copyable ranked word list</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common use cases</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Generating a keyword cloud from SEO drafts</li>
            <li>Summarizing transcripts and interview notes</li>
            <li>Checking content for dominant repeated terms</li>
            <li>Creating simple visual word summaries for reports or slides</li>
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
