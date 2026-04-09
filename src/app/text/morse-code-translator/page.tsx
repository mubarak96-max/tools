import Link from "next/link";
import type { Metadata } from "next";

import MorseCodeTranslator from "@/app/text/morse-code-translator/components/MorseCodeTranslator";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { FREE_TOOLS } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/text/morse-code-translator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What can I do with a Morse code translator?",
    answer:
      "It converts plain text into Morse code and converts Morse code back into readable text, depending on the mode you choose.",
  },
  {
    question: "How do I separate words in Morse code?",
    answer:
      "Use spaces between letters and a forward slash between words. This tool follows that convention for two-way translation.",
  },
  {
    question: "Does the translator support numbers and punctuation?",
    answer:
      "Yes. It supports letters, digits, and a core set of common punctuation marks used in Morse code workflows.",
  },
  {
    question: "What happens to unsupported characters?",
    answer:
      "Unsupported items are skipped in the translation output and counted in the stats panel so you can spot where conversion was incomplete.",
  },
];

export const metadata: Metadata = {
  title: "Morse Code Translator | Text to Morse and Morse to Text",
  description:
    "Translate text to Morse code and Morse code to text instantly with one free translator. Supports letters, numbers, and common punctuation.",
  keywords: [
    "morse code translator",
    "text to morse code",
    "morse code to text",
    "morse code converter",
    "translate morse code",
    "morse alphabet translator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Morse Code Translator for Fast Two-Way Conversion",
    description:
      "Convert text to Morse code or Morse code back to text in one free translation tool.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Morse Code Translator",
    description:
      "Translate text and Morse code instantly with two-way conversion support.",
  },
};

function buildMorseTranslatorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Morse Code Translator",
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
      "Free Morse code translator with two-way conversion: text to Morse code and Morse code to text.",
    featureList: [
      "Text to Morse conversion",
      "Morse to text conversion",
      "Letter and number support",
      "Punctuation support",
      "Copy result",
    ],
  };
}

export default function MorseCodeTranslatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Text", path: "/text" },
    { name: "Morse Code Translator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildMorseTranslatorJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/text" className="hover:text-primary">Text</Link></li>
            <li>/</li>
            <li className="text-foreground">Morse Code Translator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Text utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Morse Code Translator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Translate plain text into Morse code or decode Morse code back into text in one fast utility. Useful for learning, demonstrations, quick encoding, and decoding short messages.
          </p>
          {currentTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{currentTool.description}</p>
          ) : null}
        </div>
      
        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <MorseCodeTranslator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How Morse code translation works</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Morse code represents letters, numbers, and some punctuation through combinations of dots and dashes. A translator maps those symbols to readable characters and can also reverse the process to create encoded output from plain text.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This tool supports both directions, so you can use it for quick learning, decoding examples, message formatting, and lightweight communication experiments.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Input rules for Morse mode</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Separate letters with spaces.</li>
            <li>Separate words with a forward slash.</li>
            <li>Unsupported or invalid tokens are skipped and counted in the stats.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common use cases</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Learning the Morse code alphabet</li>
            <li>Encoding or decoding short messages quickly</li>
            <li>Testing examples for educational content</li>
            <li>Converting names, phrases, and short strings for novelty use</li>
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


