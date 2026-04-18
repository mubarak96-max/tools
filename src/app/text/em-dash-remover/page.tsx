import Link from "next/link";
import type { Metadata } from "next";

import EmDashRemover from "@/app/text/em-dash-remover/components/EmDashRemover";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { FREE_TOOLS } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/text/em-dash-remover";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How do I remove em dashes from ChatGPT or AI writing?",
    answer:
      "Paste your AI-generated text into the input box. Most AI tools use em dashes (—) frequently. Select 'Comma' or 'Hyphen' from the replacement dropdown, and the tool will instantly swap them out, making your text look more natural and human-written.",
  },
  {
    question: "When should I use an em dash remover?",
    answer:
      "Use it when you need to standardize punctuation for web publishing, avoid stylistic 'tells' in AI writing, or ensure compatibility with plain-text systems that don't support special dash characters.",
  },
  {
    question: "Does this tool also catch en dashes (–)?",
    answer:
      "Yes. The tool detects and replaces both em dashes (—) and en dashes (–) in one step, so you can clean up a variety of punctuation styles simultaneously.",
  },
  {
    question: "Can I remove dashes completely without replacing them?",
    answer:
      "Yes. Select the 'Remove Completely' (nothing) option. This will delete the dash characters and intelligently merge the surrounding text with single spaces, preventing double spacing issues.",
  },
];

export const metadata: Metadata = {
  title: "Em Dash Remover — Free Online Tool | Clean AI & Editorial Text",
  description:
    "Free long dash remover. Replace — with comma, hyphen, space, or nothing. Clean AI-generated text, editorial drafts, and plain-text workflows instantly.",
  keywords: [
    "em dash remover",
    "long dash remover",
    "replace em dash",
    "replacing em dashes with commas",
    "remove em dashes from text",
    "replace em dash with hyphen",
    "punctuation cleanup tool",
    "clean ai writing em dash",
    "chatgpt em dash remover",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Em Dash Remover — Free Online Text Cleanup Tool",
    description:
      "Instantly replace em dashes and en dashes with a comma, hyphen, or space. Perfect for cleaning up AI-generated text and editorial drafts.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Em Dash Remover — Clean AI Punctuation",
    description:
      "The fastest way to replace em dashes and en dashes in your drafts and AI-generated content.",
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
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildEmDashRemoverJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
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
            Em Dash Remover — Free Online Tool
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Our free <strong>long dash remover</strong> lets you replace em dashes and en dashes quickly with a comma, hyphen, space, or nothing. Perfect for <strong>replacing em dashes with commas</strong> in AI-generated text or editorial drafts.
          </p>
          {currentTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{currentTool.description}</p>
          ) : null}
        </div>
      
        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
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

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How the long dash remover works</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Both em dashes (—) and en dashes (–) are detected in the input.</li>
            <li>You choose one replacement style, such as replacing em dashes with commas or hyphens.</li>
            <li>The tool cleans leftover spacing after replacement so the output stays readable.</li>
            <li>The rest of the text stays intact.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Perfect for AI & ChatGPT writing cleanup</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            If you use AI writers like ChatGPT or Claude, you probably noticed they love using em dashes (—) to structure sentences. While grammatically correct, an overabundance of these dashes is a well-known "tell" for AI-generated content.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Our tool helps you "humanize" your AI drafts by instantly swapping these stylistic tells for more natural punctuation like commas or hyphens. For a complete transformation, you can also use our <Link href="/ai/ai-humanizer" className="text-primary hover:underline font-medium">AI Humanizer</Link> to refine the overall flow and tone of your text.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common use cases</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong>AI Content Polish:</strong> Removing distinctive AI writing patterns for a more human feel.</li>
            <li><strong>Editorial Workflow:</strong> Standardizing drafts before publishing to platforms like WordPress.</li>
            <li><strong>Plain-Text Emails:</strong> Converting em dashes to hyphens for guaranteed compatibility across email clients.</li>
            <li><strong>Academic Writing:</strong> Adjusting punctuation to meet specific university style guide requirements.</li>
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


