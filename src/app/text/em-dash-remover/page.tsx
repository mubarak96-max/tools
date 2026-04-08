import Link from "next/link";
import type { Metadata } from "next";

import EmDashRemover from "@/app/text/em-dash-remover/components/EmDashRemover";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/text/em-dash-remover";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What does an em dash remover do?",
    answer:
      "It scans text for em dashes and en dashes, then replaces them with a punctuation option you choose, such as a comma, hyphen, space, or nothing.",
  },
  {
    question: "Why would I replace em dashes?",
    answer:
      "Some style guides, publishing systems, and formatting workflows avoid em dashes. Replacing them can make text simpler, more consistent, or easier to paste into restricted editors.",
  },
  {
    question: "Does this tool also catch en dashes?",
    answer:
      "Yes. It counts and replaces both em dashes and en dashes so you can clean mixed punctuation in one pass.",
  },
  {
    question: "Can I remove dashes completely?",
    answer:
      "Yes. The replacement dropdown includes a nothing option, which removes the dash characters and then normalizes leftover spacing.",
  },
];

export const metadata: Metadata = {
  title: "Em Dash Remover | Replace Em Dashes with Comma, Hyphen, Space, or Nothing",
  description:
    "Replace em dashes and en dashes instantly with a comma, hyphen, space, or nothing using one free text-cleanup tool.",
  keywords: [
    "em dash remover",
    "replace em dash",
    "remove em dashes from text",
    "replace em dash with hyphen",
    "replace em dash with comma",
    "punctuation cleanup tool",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Em Dash Remover for Fast Punctuation Cleanup",
    description:
      "Replace em dashes and en dashes with a comma, hyphen, space, or nothing in one pass.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Em Dash Remover",
    description:
      "Clean up em dashes and en dashes instantly with flexible replacement options.",
  },
};

function buildEmDashRemoverJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Em Dash Remover",
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
      "Free em dash remover that replaces em dashes and en dashes with a comma, hyphen, space, or nothing while keeping the rest of the text intact.",
    featureList: [
      "Em dash replacement",
      "En dash replacement",
      "Comma replacement mode",
      "Hyphen replacement mode",
      "Space replacement mode",
      "Remove completely mode",
    ],
  };
}

export default function EmDashRemoverPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Text", path: "/text" },
    { name: "Em Dash Remover", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const relatedTools = getRelatedFreeTools(PAGE_PATH).filter((tool) => tool.category === "Text");
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildEmDashRemoverJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/text" className="hover:text-primary">Text</Link></li>
            <li>/</li>
            <li className="text-foreground">Em Dash Remover</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Text utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Em Dash Remover
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Replace em dashes and en dashes quickly with a comma, hyphen, space, or nothing. Useful for punctuation cleanup, stricter style guides, and plain-text publishing workflows.
          </p>
          {currentTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{currentTool.description}</p>
          ) : null}
        </div>
      </section>

      <EmDashRemover />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why remove or replace em dashes</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Em dashes are useful in editorial writing, but they are not welcome everywhere. Some brands avoid them, some editors replace them during cleanup, and some forms or plain-text systems do not handle long dash punctuation consistently.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A dedicated remover saves time when you need cleaner punctuation quickly. It lets you choose whether the dash becomes a comma, a simple hyphen, a space, or disappears entirely.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How the replacement works</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Both em dashes and en dashes are detected in the input.</li>
            <li>You choose one replacement style from the dropdown.</li>
            <li>The tool cleans leftover spacing after replacement so the output stays readable.</li>
            <li>The rest of the text stays intact.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common use cases</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Preparing text for style guides that avoid em dashes</li>
            <li>Cleaning AI-generated or editorial drafts before publishing</li>
            <li>Converting punctuation for plain-text systems and forms</li>
            <li>Standardizing typography before handing text to another team</li>
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
