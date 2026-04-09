import Link from "next/link";
import type { Metadata } from "next";

import ReverseTextGenerator from "@/app/text/reverse-text-generator/components/ReverseTextGenerator";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/text/reverse-text-generator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What can I do with a reverse text generator?",
    answer:
      "It transforms text by reversing all characters, reversing the word order, or reversing each word individually depending on the mode you choose.",
  },
  {
    question: "What is the difference between reverse text and reverse word order?",
    answer:
      "Reverse text flips every character in the entire input. Reverse word order keeps words readable but changes their order from last to first.",
  },
  {
    question: "What does reverse each word mean?",
    answer:
      "That mode mirrors each word in place, so the sentence structure stays in the same order while the letters inside each word are reversed.",
  },
  {
    question: "Can I copy the reversed result directly?",
    answer:
      "Yes. The tool includes a copy action so you can move the transformed output into another workflow immediately.",
  },
];

export const metadata: Metadata = {
  title: "Reverse Text Generator | Reverse Full Text, Word Order, or Each Word",
  description:
    "Reverse text instantly with one free tool. Flip all characters, reverse word order, or reverse each word in place with live output.",
  keywords: [
    "reverse text generator",
    "backward text generator",
    "reverse words tool",
    "mirror text generator",
    "reverse sentence tool",
    "reverse word order",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Reverse Text Generator for Fast Text Transformations",
    description:
      "Reverse full text, reverse word order, or reverse each word in one free text tool.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reverse Text Generator",
    description:
      "Flip text instantly with full reverse, reverse word order, or per-word reverse modes.",
  },
};

function buildReverseTextJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Reverse Text Generator",
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
      "Free reverse text generator with three modes: full text reverse, reverse word order, and reverse each word in place.",
    featureList: [
      "Full text reverse",
      "Reverse word order",
      "Reverse each word",
      "Copy result",
      "Clear text",
    ],
  };
}

export default function ReverseTextGeneratorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Text", path: "/text" },
    { name: "Reverse Text Generator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const relatedTools = getRelatedFreeTools(PAGE_PATH).filter((tool) => tool.category === "Text");
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildReverseTextJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/text" className="hover:text-primary">Text</Link></li>
            <li>/</li>
            <li className="text-foreground">Reverse Text Generator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Text utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Reverse Text Generator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Reverse entire text, flip word order, or mirror each word in place with live output. Useful for playful copy transformations, formatting experiments, and quick text effects.
          </p>
          {currentTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{currentTool.description}</p>
          ) : null}
        </div>
      
        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <ReverseTextGenerator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How reverse text modes differ</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Not every reverse-text use case needs the same transformation. Sometimes you want a full mirrored string, sometimes you only want to flip the order of words, and sometimes you want each word reversed while keeping sentence structure intact.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This tool gives you all three modes in one place so you can choose the exact transformation that fits your text experiment or formatting task.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Available reverse modes</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Reverse text:</strong> flips every character in the entire input.</li>
            <li><strong className="text-foreground">Reverse word order:</strong> keeps words intact but reorders them from end to start.</li>
            <li><strong className="text-foreground">Reverse each word:</strong> mirrors the letters inside each word while keeping the original word order.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common use cases</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Creating mirrored or playful text effects</li>
            <li>Testing string transformations during writing or coding workflows</li>
            <li>Reordering phrases for prompts or formatting experiments</li>
            <li>Generating novelty text for bios, posts, or drafts</li>
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
