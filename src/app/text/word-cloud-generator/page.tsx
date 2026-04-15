import Link from "next/link";
import type { Metadata } from "next";

import WordCloudGenerator from "@/app/text/word-cloud-generator/components/WordCloudGenerator";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { FREE_TOOLS } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/text/word-cloud-generator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a word cloud?",
    answer:
      "A word cloud is a visual summary of text where frequently used terms appear larger. It helps you quickly spot dominant topics, repeated themes, and keyword concentration.",
  },
  {
    question: "What is a word cloud used for?",
    answer:
      "People use word clouds in presentations, classrooms, content audits, and research summaries to make recurring terms easy to see without reading full frequency tables.",
  },
  {
    question: "How do I make a word cloud for free?",
    answer:
      "Paste your text, choose controls like max words and minimum length, keep stop-word filtering enabled, and generate the cloud instantly in your browser.",
  },
  {
    question: "How is word size determined in the cloud?",
    answer:
      "Words that appear more often in the source text receive larger visual weight, while less frequent words are displayed smaller.",
  },
  {
    question: "What are stop words in a word cloud?",
    answer:
      "Stop words are common terms like 'the', 'and', and 'is'. Filtering them removes noise so meaningful terms stand out more clearly.",
  },
  {
    question: "How many words should I use for a word cloud?",
    answer:
      "For clearer visuals, start with 25-60 words and at least 200+ words of source text. Very short samples often produce noisy or repetitive clouds.",
  },
  {
    question: "Can I download the word cloud as an image?",
    answer:
      "Yes. This tool can export your current cloud as a PNG image so you can use it in slides, reports, and social posts.",
  },
  {
    question: "Can I use a word cloud for a presentation?",
    answer:
      "Yes. Word clouds are useful for visual summaries in decks, especially when you want to highlight dominant themes quickly.",
  },
  {
    question: "What is the difference between a word cloud and a word frequency counter?",
    answer:
      "A word cloud is visual and presentation-friendly. A frequency counter is table-based and better for precise analysis and sorting.",
  },
  {
    question: "Can I copy the top words list?",
    answer:
      "Yes. You can copy a ranked CSV-style word list with counts for deeper analysis or reporting.",
  },
];

export const metadata: Metadata = {
  title: "Free Word Cloud Generator - Create a Word Cloud from Any Text",
  description:
    "Paste any text and instantly generate a frequency-based word cloud. Filter common words, control word count, and copy or download the top terms output.",
  keywords: [
    "word cloud generator",
    "word cloud maker",
    "word cloud creator",
    "free word cloud generator",
    "word cloud online",
    "make a word cloud",
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
    title: "Free Word Cloud Generator from Text",
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
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildWordCloudJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
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
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is a word cloud?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A word cloud is a visual representation of text where frequently repeated terms appear larger
            than less common terms. It is a fast way to identify dominant ideas in essays, transcripts,
            survey responses, and content drafts. Modern word cloud maker tools are used in classrooms,
            SEO workflows, and research reporting because they communicate patterns instantly.
          </p>

          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How a word cloud helps with text analysis</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A word cloud gives you a fast visual summary of the terms that dominate a document. Instead of reading a long frequency table first, you can spot the biggest topics immediately because the most repeated words appear at the largest size.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            That makes it useful for content audits, SEO review, transcripts, essays, interview notes, and any text where you want a quick sense of topic concentration.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Word cloud vs word frequency counter</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Use a word cloud creator when you want a visual summary for a slide, report, or quick scan.
            Use a frequency counter when you need exact counts, sorting, and spreadsheet-style review.
            This tool gives both: a visual cloud and a copyable ranked terms list.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">What you can do</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>See dominant themes immediately with frequency-based word sizing.</li>
            <li>Control cloud density by setting a maximum displayed word count.</li>
            <li>Reduce noise with minimum word length and stop-word filtering.</li>
            <li>Copy ranked terms for deeper analysis and reporting workflows.</li>
            <li>Download a PNG image for presentations and documents.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to make a good word cloud</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Use a large enough sample (often 200+ words) so patterns are meaningful.</li>
            <li>Keep stop-word filtering on unless you specifically need function-word analysis.</li>
            <li>Set minimum word length to 4+ for cleaner, theme-focused clouds.</li>
            <li>Start with 30-50 max words, then widen only if you need finer detail.</li>
            <li>Use the copied word list to validate assumptions before sharing visuals.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common audiences and use cases</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Teachers and educators:</strong> visualize class writing themes and survey responses.</li>
            <li><strong className="text-foreground">SEO and content teams:</strong> spot over-used terms and keyword concentration before publishing.</li>
            <li><strong className="text-foreground">Researchers:</strong> summarize recurring language in interview transcripts and notes.</li>
            <li><strong className="text-foreground">Presenters:</strong> create quick visual summaries for slides and reports.</li>
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


