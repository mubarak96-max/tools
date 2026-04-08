import Link from "next/link";
import type { Metadata } from "next";

import StrikethroughText from "@/app/text/strikethrough-text/components/StrikethroughText";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/text/strikethrough-text";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "When would I use styled text like strikethrough or underline?",
    answer:
      "It converts plain text into stylized Unicode text using line effects such as strike-through, double underline, underline, dotted line, and wave line.",
  },
  {
    question: "Can I use more than one line style?",
    answer:
      "This version applies one style at a time. You choose the line treatment from the style grid and the output updates instantly.",
  },
  {
    question: "Will styled text work everywhere?",
    answer:
      "Not always. The output uses Unicode combining marks, so results depend on the font and rendering support of the app, device, or platform where you paste the text.",
  },
  {
    question: "Can I copy the styled text directly?",
    answer:
      "Yes. The tool includes a copy action so you can move the styled output into a social bio, post, note, or draft quickly.",
  },
];

export const metadata: Metadata = {
  title: "Strikethrough Text | Strike, Underline, Dotted, and Wave Text Styles",
  description:
    "Generate strike-through, underline, double underline, dotted line, and wave line text styles instantly with one free text styling tool.",
  keywords: [
    "strikethrough text",
    "strikethrough text generator",
    "underline text generator",
    "dotted text generator",
    "wave text generator",
    "unicode text style generator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Strikethrough and Line Text Style Generator",
    description:
      "Convert plain text into strike-through, underline, double underline, dotted, or wave-styled Unicode text instantly.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Strikethrough Text Generator",
    description:
      "Apply strike-through, underline, dotted, or wave line styles to text in one free tool.",
  },
};

function buildStrikethroughTextJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Strikethrough Text",
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
      "Free text styling generator for strike-through, double underline, underline, dotted line, and wave line Unicode effects.",
    featureList: [
      "Strike-through text",
      "Double underline text",
      "Underline text",
      "Dotted line text",
      "Wave line text",
      "Copy styled result",
    ],
  };
}

export default function StrikethroughTextPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Text", path: "/text" },
    { name: "Strikethrough Text", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const relatedTools = getRelatedFreeTools(PAGE_PATH).filter((tool) => tool.category === "Text");
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildStrikethroughTextJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/text" className="hover:text-primary">Text</Link></li>
            <li>/</li>
            <li className="text-foreground">Strikethrough Text</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Text utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Strikethrough Text
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Style plain text with strike-through, underline, double underline, dotted line, or wave line effects using Unicode combining marks. Useful for bios, notes, captions, and lightweight decorative text.
          </p>
          {currentTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{currentTool.description}</p>
          ) : null}
        </div>
      </section>

      <StrikethroughText />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How styled Unicode text works</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This tool does not use CSS or rich text formatting. Instead, it places Unicode combining marks after each character so the visible text carries a line effect when pasted into supported environments.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            That makes it useful for social content, notes, and plain-text workflows where formatting controls are limited but styled text is still accepted.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Available styles</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Strike-through:</strong> for crossed-out or edited text effects.</li>
            <li><strong className="text-foreground">Double underline:</strong> a stronger emphasis line below text.</li>
            <li><strong className="text-foreground">Underline:</strong> a cleaner single-line emphasis style.</li>
            <li><strong className="text-foreground">Dotted line:</strong> decorative dotted emphasis below the text.</li>
            <li><strong className="text-foreground">Wave line:</strong> a softer, stylized underline effect.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common use cases</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Creating stylized social bios and captions</li>
            <li>Decorating headings in plain-text posts or notes</li>
            <li>Marking edits or emphasis in shared drafts</li>
            <li>Generating Unicode text effects without design software</li>
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
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Related tools</h2>
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
