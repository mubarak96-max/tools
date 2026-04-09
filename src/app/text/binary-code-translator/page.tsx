import Link from "next/link";
import type { Metadata } from "next";

import BinaryCodeTranslator from "@/app/text/binary-code-translator/components/BinaryCodeTranslator";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { FREE_TOOLS } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/text/binary-code-translator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "When is a binary code translator useful?",
    answer:
      "It converts normal text into 8-bit binary and converts valid binary byte groups back into readable text.",
  },
  {
    question: "How should binary input be formatted?",
    answer:
      "Use space-separated 8-bit groups, such as 01001000 01101001. Each valid group is treated as one byte when converting back to text.",
  },
  {
    question: "What happens to invalid binary groups?",
    answer:
      "Invalid groups are skipped in the translation output and counted in the stats panel so you can spot bad input quickly.",
  },
  {
    question: "Can I copy the binary result directly?",
    answer:
      "Yes. The tool includes a copy action so you can move the converted output into another workflow immediately.",
  },
];

export const metadata: Metadata = {
  title: "Binary Code Translator | Text to Binary and Binary to Text",
  description:
    "Translate text to binary and binary to text instantly with one free binary code translator. Supports 8-bit byte conversion with live validation.",
  keywords: [
    "binary code translator",
    "text to binary",
    "binary to text",
    "binary translator",
    "ascii to binary",
    "binary converter",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Binary Code Translator for Fast Two-Way Conversion",
    description:
      "Convert text to 8-bit binary and binary back to text in one free translator.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Binary Code Translator",
    description:
      "Translate text and binary instantly with two-way conversion support.",
  },
};

function buildBinaryTranslatorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Binary Code Translator",
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
      "Free binary code translator with two-way conversion: text to binary and binary to text.",
    featureList: [
      "Text to binary conversion",
      "Binary to text conversion",
      "8-bit byte support",
      "Invalid-group counting",
      "Copy result",
    ],
  };
}

export default function BinaryCodeTranslatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Text", path: "/text" },
    { name: "Binary Code Translator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildBinaryTranslatorJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/text" className="hover:text-primary">Text</Link></li>
            <li>/</li>
            <li className="text-foreground">Binary Code Translator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Text utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Binary Code Translator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Convert normal text into 8-bit binary or decode binary back into readable text in one fast utility. Useful for learning binary, checking byte output, and simple encoding experiments.
          </p>
          {currentTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{currentTool.description}</p>
          ) : null}
        </div>
      
        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <BinaryCodeTranslator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How binary translation works</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Binary translation maps each character to a byte, usually shown as an 8-bit group of zeros and ones. In the other direction, valid 8-bit groups can be decoded back into characters.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This tool handles both directions so you can experiment with encoding, decode simple binary strings, or use it as a quick teaching reference.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Input rules for binary mode</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Use one 8-bit group per byte.</li>
            <li>Separate groups with spaces.</li>
            <li>Invalid groups are skipped and counted in the stats panel.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common use cases</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Learning how text maps to binary bytes</li>
            <li>Decoding short binary messages</li>
            <li>Testing examples for tutorials or technical content</li>
            <li>Running quick encoding checks during experiments</li>
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


