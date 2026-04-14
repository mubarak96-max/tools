import Link from "next/link";
import type { Metadata } from "next";

import CharacterCounter from "@/app/text/character-counter/components/CharacterCounter";
import { FreeToolIcon } from "@/components/tools/FreeToolIcon";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { PrivacyNote } from "@/components/tools/ToolPageScaffold";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";
import {
  WORD_COUNTER_LANDINGS_ANCHOR_ID,
  getWordCounterLandingNavHighlights,
} from "@/lib/word-counter-landings/registry";

export const revalidate = 43200;

const PAGE_PATH = "/text/character-counter";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a character counter?",
    answer:
      "A character counter measures text length, including letters, numbers, spaces, punctuation, and line breaks. This tool also counts words, sentences, paragraphs, reading time, and characters without spaces.",
  },
  {
    question: "What is the ideal meta description length?",
    answer:
      "A practical meta description range is about 120 to 160 characters. It is not a strict ranking rule, but staying in that range helps reduce search-result truncation and keeps the snippet useful.",
  },
  {
    question: "How many characters should an SEO title have?",
    answer:
      "A common target for Google title tags is up to about 60 characters. Put the most important words first because search results may truncate longer titles.",
  },
  {
    question: "How many characters are allowed in a tweet or X post?",
    answer:
      "Standard X posts support up to 280 characters. The counter includes an X / Twitter preset so you can see progress and overflow while writing.",
  },
  {
    question: "Why do characters without spaces matter?",
    answer:
      "Some forms, contests, databases, and technical systems count raw characters differently. The no-spaces count gives you a stricter view when whitespace is excluded.",
  },
  {
    question: "Can this help improve writing, not just count it?",
    answer:
      "Yes. Use the platform presets, overflow preview, progress bar, repeated-word insight, and sentence-length warnings to trim text before publishing.",
  },
];

export const metadata: Metadata = {
  title: "Character Counter for SEO, Social Posts, and Writing Limits",
  description:
    "Count characters and optimize text for SEO titles, meta descriptions, Twitter/X posts, captions, ads, and custom writing limits with live overflow feedback.",
  keywords: [
    "character counter",
    "word counter",
    "character count tool",
    "characters without spaces",
    "text length checker",
    "reading time calculator",
    "meta description length checker",
    "title tag length checker",
    "twitter character counter",
    "social media character counter",
    "character counter for SEO",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Character Counter and Content Length Optimizer",
    description:
      "Write to the right length for SEO snippets, social posts, ads, bios, and custom limits with live progress and overflow feedback.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Character Counter",
    description:
      "Count characters, words, and reading time while checking SEO and social media limits.",
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
      "Free online character counter and text length optimizer with platform presets, overflow preview, writing signals, repeated-word insight, and reading-time estimates.",
    featureList: [
      "Character count",
      "Characters without spaces",
      "Word count",
      "Sentence count",
      "Paragraph count",
      "Reading time estimate",
      "SEO title length preset",
      "Meta description length preset",
      "Twitter/X character limit preset",
      "Overflow preview",
      "Repeated-word insight",
    ],
  };
}

export default function CharacterCounterPage() {
  const wordCounterNav = getWordCounterLandingNavHighlights();
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
            Character Counter and Text Length Optimizer
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Write the perfect length for SEO, social media, ads, bios, and forms. Count characters instantly, choose a platform target, see overflow, and trim text before it gets truncated.
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
            Character count matters because the same sentence can perform differently depending on where it appears. Search snippets can truncate, social posts can hit hard limits, ad headlines need to stay concise, and form fields may reject text that runs long. A passive counter tells you the number. A useful character counter also tells you whether that number fits the job.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This tool is built for marketers, writers, SEO professionals, students, and anyone working inside text limits. Use it to check a Google title, meta description, X post, LinkedIn update, Instagram caption, ad line, product description, or custom field. The progress bar, overflow preview, repeated-word insight, and sentence-length signals help you edit faster instead of guessing what to cut.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Character limits for popular platforms</h2>
          <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-border bg-background">
            <div className="grid grid-cols-[minmax(0,1fr)_8rem_minmax(0,1.3fr)] border-b border-border bg-muted/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <span>Use case</span>
              <span>Target</span>
              <span>Best practice</span>
            </div>
            {[
              ["Google title tag", "~60 characters", "Front-load the primary keyword and brand only when it helps clarity."],
              ["Meta description", "120-160 characters", "Summarize the page benefit and avoid filler that may truncate."],
              ["X / Twitter post", "280 characters", "Keep the hook early and remove repeated setup words."],
              ["Instagram caption", "2,200 characters", "Lead with the key idea because only the opening is immediately visible."],
              ["LinkedIn post", "3,000 characters", "Use short paragraphs and make the first two lines strong."],
            ].map(([useCase, target, bestPractice]) => (
              <div key={useCase} className="grid grid-cols-[minmax(0,1fr)_8rem_minmax(0,1.3fr)] border-b border-border px-4 py-3 text-sm last:border-b-0">
                <span className="font-medium text-foreground">{useCase}</span>
                <span className="text-muted-foreground">{target}</span>
                <span className="text-muted-foreground">{bestPractice}</span>
              </div>
            ))}
          </div>

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
            <li>SEO teams can check title tags, meta descriptions, and landing-page snippets before publishing.</li>
            <li>Marketers can trim ad copy, email subject lines, social hooks, and campaign captions.</li>
            <li>Writers can spot long sentences, repeated words, and drafts that need tighter phrasing.</li>
            <li>Students and applicants can stay within essay, abstract, bio, and form-field limits.</li>
            <li>Editors can move from this counter into the <Link href="/text/readability-flesch-kincaid-calculator" className="text-primary hover:underline">readability calculator</Link> or <Link href="/text/word-frequency" className="text-primary hover:underline">word frequency counter</Link> for deeper review.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Best practices for writing within limits</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Front-load important words because titles, snippets, and captions often show the beginning first.</li>
            <li>Cut repeated setup phrases before removing useful information.</li>
            <li>Use shorter sentences when the average sentence length starts to feel heavy.</li>
            <li>Check both total characters and characters without spaces when a platform is strict.</li>
          </ul>
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">More ways to use this counter</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          The same metrics power intent-specific pages—essay limits, SEO snippets, reading time, and more. Open any link for tailored guidance, or browse the full list from the text tools index.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {wordCounterNav.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/25 hover:bg-primary-soft hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
        </div>
        <p className="mt-5 text-sm text-muted-foreground">
          <Link href={`/text#${WORD_COUNTER_LANDINGS_ANCHOR_ID}`} className="font-medium text-primary hover:underline">
            All word counter entry points on the Text tools page →
          </Link>
        </p>
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
            All text tools →
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
                <div className="shrink-0 rounded-md border border-border bg-muted p-1.5">
                  <FreeToolIcon tool={tool} size={16} />
                </div>
              </div>
              <p className="text-xs leading-5 text-muted-foreground line-clamp-2">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}

