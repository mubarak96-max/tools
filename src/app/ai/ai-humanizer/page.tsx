import Link from "next/link";
import type { Metadata } from "next";

import AIHumanizer from "@/app/ai/ai-humanizer/components/AIHumanizer";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/ai/ai-humanizer";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is an AI humanizer?",
    answer:
      "An AI humanizer rewrites AI-generated text so it sounds more natural, varied, and human without changing the core meaning.",
  },
  {
    question: "Does this work on text from ChatGPT, Claude, and Gemini?",
    answer:
      "Yes. It targets writing patterns that show up across major AI tools, including ChatGPT, Claude, Gemini, and Copilot.",
  },
  {
    question: "Why is the limit 300 characters?",
    answer:
      "The short cap keeps the tool fast, reduces abuse, and controls API cost while still being useful for paragraphs and short sections.",
  },
  {
    question: "Will the meaning of my text change?",
    answer:
      "It should not. The prompt is designed to preserve facts, technical terms, and intent while changing phrasing and rhythm.",
  },
  {
    question: "Why is there a queue before the result appears?",
    answer:
      "The queue is a client-side delay that spaces requests out, slows abuse, and gives users visible processing feedback instead of instant low-trust output.",
  },
  {
    question: "Is the API key exposed in the browser?",
    answer:
      "No. The browser only calls a local API route. The OpenRouter key stays on the server.",
  },
];

export const metadata: Metadata = {
  title: "AI Humanizer | Humanize AI Text from ChatGPT, Claude, and Gemini",
  description:
    "Free AI humanizer for ChatGPT, Claude, and Gemini text. Rewrite robotic AI copy into natural human-sounding writing with no sign-up.",
  keywords: [
    "AI humanizer",
    "humanize AI text",
    "make AI text sound human",
    "ChatGPT humanizer",
    "Claude humanizer",
    "Gemini humanizer",
    "AI text rewriter",
    "AI to human text converter",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "AI Humanizer for ChatGPT, Claude, and Gemini text",
    description:
      "Rewrite AI-generated text to sound natural and human with a clean queue-based workflow and no sign-up.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Humanizer",
    description:
      "Humanize AI text from ChatGPT, Claude, and Gemini without exposing any API key in the client.",
  },
};

function buildHumanizerApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AI Humanizer",
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
      "Rewrite AI-generated text to sound natural and human while preserving the meaning and technical details.",
    featureList: [
      "300-character AI text rewrite",
      "Server-side API key handling",
      "Queue-style progress flow",
      "Copyable rewritten output",
      "Basic rate limiting",
    ],
  };
}

export default function AIHumanizerPage() {
  const relatedTools = getRelatedFreeTools(PAGE_PATH);
  const faqJsonLd = buildFaqJsonLd(faq);
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "AI", path: "/ai" },
    { name: "AI Humanizer", path: PAGE_PATH },
  ]);
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildHumanizerApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/ai" className="hover:text-primary">AI</Link></li>
            <li>/</li>
            <li className="text-foreground">AI Humanizer</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            AI writing tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            AI Humanizer
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Paste AI-generated text and get a more natural rewrite for short paragraphs, answers, and polished snippets.
            It targets patterns common in ChatGPT, Claude, Gemini, and similar tools.
          </p>
          {currentTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{currentTool.description}</p>
          ) : null}
        </div>
      </section>

      <AIHumanizer />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Why AI-generated text often sounds robotic
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            AI writing is often grammatically fine but rhythmically flat. It leans on predictable transitions,
            uniform sentence length, cautious phrasing, and openings that sound helpful without saying anything useful.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Human writing tends to move differently. A short sentence. Then a longer one with more texture, more
            directness, and less symmetry. That is the gap this tool is trying to close.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            What this tool changes
          </h2>
          <div className="mt-4 overflow-x-auto rounded-[1rem] border border-border">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">AI pattern</th>
                  <th className="px-4 py-3">Typical example</th>
                  <th className="px-4 py-3">Human rewrite direction</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Filler opener", '"Certainly! I would be happy to help."', "Start with the answer"],
                  ["Formal transition", '"Furthermore, it is important to consider..."', "Use plain connectors"],
                  ["Hedging phrase", '"It is worth noting that..."', "State it directly"],
                  ["Passive voice", '"The plan was created by the team."', '"The team created the plan."'],
                  ["Uniform sentence length", "Every sentence feels the same size", "Vary rhythm and pacing"],
                  ["No contractions", '"It is not possible to do this."', `"It's not possible."`],
                ].map(([pattern, example, rewrite]) => (
                  <tr key={pattern} className="border-t border-border align-top">
                    <td className="px-4 py-3 font-medium text-foreground">{pattern}</td>
                    <td className="px-4 py-3 text-muted-foreground">{example}</td>
                    <td className="px-4 py-3 text-muted-foreground">{rewrite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Tips for better results
          </h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Paste one short paragraph at a time to stay inside the 300-character cap.</li>
            <li>Use the output as a draft, then make a quick pass to match your own voice.</li>
            <li>Run a second pass on especially stiff sections if the first rewrite still feels too clean.</li>
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
            href="/ai"
            className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
          >
            <h3 className="text-base font-semibold text-foreground">Browse AI tools</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Return to the AI hub for writing-focused tools and future prompt-driven utilities.
            </p>
          </Link>
          <Link
            href="/tools"
            className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
          >
            <h3 className="text-base font-semibold text-foreground">Explore software tools</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Jump back into the broader directory for comparisons, alternatives, and structured reviews.
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
