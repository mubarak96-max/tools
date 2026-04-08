import Link from "next/link";
import type { Metadata } from "next";

import AsciiArtGenerator from "@/app/text/ascii-art-generator/components/AsciiArtGenerator";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/text/ascii-art-generator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "When would I use an ASCII art generator?",
    answer:
      "It converts normal text into stylized ASCII art using FIGlet-style fonts, which render characters as multi-line text banners.",
  },
  {
    question: "Does this use real FIGlet fonts?",
    answer:
      "Yes. This version uses the figlet engine with a curated built-in font set instead of a hand-drawn text effect.",
  },
  {
    question: "What does the layout option change?",
    answer:
      "The layout setting changes how glyphs are spaced and fitted together. Some layouts keep wider spacing, while others compress the output more tightly.",
  },
  {
    question: "Can I copy the ASCII output directly?",
    answer:
      "Yes. The tool includes a copy action so you can paste the generated banner into docs, README files, notes, or other plain-text environments.",
  },
];

export const metadata: Metadata = {
  title: "ASCII Art Generator | FIGlet Text Banner Generator",
  description:
    "Generate ASCII art text banners instantly with real FIGlet fonts. Choose a font, adjust layout, and copy the output in one free tool.",
  keywords: [
    "ascii art generator",
    "figlet generator",
    "text to ascii art",
    "ascii text banner",
    "ascii font generator",
    "taag alternative",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "ASCII Art Generator with FIGlet Fonts",
    description:
      "Generate ASCII art banners with a curated FIGlet font set and layout controls.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASCII Art Generator",
    description:
      "Turn text into ASCII art with FIGlet fonts and copy the output instantly.",
  },
};

function buildAsciiArtJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ASCII Art Generator",
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
      "Free ASCII art generator powered by real FIGlet fonts, with a curated font set and layout controls for text banners.",
    featureList: [
      "FIGlet font rendering",
      "Multiple font styles",
      "Layout controls",
      "ASCII banner output",
      "Copy result",
    ],
  };
}

export default function AsciiArtGeneratorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Text", path: "/text" },
    { name: "ASCII Art Generator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const relatedTools = getRelatedFreeTools(PAGE_PATH).filter((tool) => tool.category === "Text");
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildAsciiArtJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/text" className="hover:text-primary">Text</Link></li>
            <li>/</li>
            <li className="text-foreground">ASCII Art Generator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Text utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            ASCII Art Generator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Turn plain text into FIGlet-style ASCII banners with a curated font set and layout controls. Useful for README headers, plain-text signatures, banners, and playful text formatting.
          </p>
          {currentTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{currentTool.description}</p>
          ) : null}
        </div>
      </section>

      <AsciiArtGenerator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What this does</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This generator uses the real FIGlet rendering engine with a curated subset of banner fonts. That gives you authentic ASCII art output without the full complexity of a power-user editor.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            You can switch between several font styles, adjust layout behavior, and copy the resulting ASCII banner directly into plain-text environments.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">When ASCII art is useful</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>README headers and terminal-friendly project banners</li>
            <li>Plain-text docs, notes, and signatures</li>
            <li>Retro text styling for demos or experiments</li>
            <li>Quick banner generation without design software</li>
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
