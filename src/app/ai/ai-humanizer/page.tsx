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
    question: "How does an AI humanizer work?",
    answer:
      "It identifies linguistic 'fingerprints' common in AI models—such as overly consistent sentence lengths, predictable word choices, and formal transitions. It then rewrites the text using more varied syntax and natural cadences used by human writers.",
  },
  {
    question: "Can AI detectors tell if text has been humanized?",
    answer:
      "Modern AI detectors are constantly evolving. While humanizing AI text makes it significantly harder for detectors to flag robotic patterns, no tool can guarantee 100% 'invisiblity'. The goal should always be to improve readability and natural flow first.",
  },
  {
    question: "Is using an AI humanizer considered cheating?",
    answer:
      "It depends on your institution's or organization's policies. Using a humanizer to polish an AI draft into something more readable and personal is common for professionals. However, turning in pure AI output as original work often violates academic integrity policies.",
  },
  {
    question: "What is the difference between humanizing and paraphrasing?",
    answer:
      "Paraphrasing simply swaps words or shifts sentence order. Humanizing goes deeper, specifically targeting the 'robotic' tells of AI, like removing filler openers, diversifying the rhythm, and adding natural confident phrasing.",
  },
  {
    question: "Does this work for academic essays?",
    answer:
      "Yes. Many students use this to edit AI-generated research drafts into a more consistent and personal voice. We recommend a final manual pass to ensure your own unique perspective is present.",
  },
  {
    question: "Why does humanized AI text still sound off sometimes?",
    answer:
      "AI humanizers struggle if the original prompt was too vague. If the underlying logic of the text is robotic, the rewrite can only do so much. The best results come from high-quality AI drafts that are then humanized.",
  },
  {
    question: "What AI patterns are hardest to remove?",
    answer:
      "Overly balanced paragraph structures and the 'neutral' tone common in ChatGPT are the hardest fingerprints to erase. Our tool diversifies those structures to make them feel more organic.",
  },
  {
    question: "Can I use this for professional emails and LinkedIn?",
    answer:
      "Absolutely! Professionals use this to ensure their AI-assisted responses don't come across as cold or robotic to colleagues and clients.",
  },
  {
    question: "Is there a free AI humanizer with no word limit?",
    answer:
      "Most 'no limit' tools are actually low-quality simple scrapers. We offer a generous 1,500-character limit for free to ensure high-quality, privacy-first rewrites for everyone.",
  },
];

export const metadata: Metadata = {
  title: "Free AI Humanizer – Rewrite ChatGPT, Claude & Gemini Text to Sound Human",
  description:
    "Paste AI-generated text and get a natural-sounding rewrite instantly. Free AI humanizer that removes robotic patterns from ChatGPT, Claude, Gemini, and Copilot output. No sign-up needed.",
  keywords: [
    "ai humanizer free",
    "humanize ai text",
    "make ai text sound human",
    "ai text rewriter",
    "bypass ai detection",
    "chatgpt humanizer",
    "ai writing humanizer",
    "remove ai from text",
    "ai humanizer no sign up",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free AI Humanizer – Sound More Human, Faster",
    description:
      "A privacy-first tool to rewrite robotic AI text into natural, human-sounding content.",
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
      "1,500-character AI text rewrite",
      "Server-side API key handling",
      "Queue-style progress flow",
      "Copyable rewritten output",
      "Deep AI pattern diversification",
    ],
  };
}

export default function AIHumanizerPage() {
  const relatedTools = getRelatedFreeTools(PAGE_PATH);
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "AI", path: "/ai" },
    { name: "AI Humanizer", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildHumanizerApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/ai" className="hover:text-primary">
                AI
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">AI Humanizer</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            AI Utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Free Online AI Humanizer
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Paste AI-generated text and get a more natural, human-sounding rewrite instantly. Our tool identifies and fixes robotic patterns from ChatGPT, Claude, and Gemini.
          </p>
        </div>
      </section>

      <AIHumanizer />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            What makes AI writing detectable?
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            AI models are trained to be helpful, harmless, and honest, which results in a very specific linguistic "fingerprint." To an AI detector, your writing is often flagged not because of what you say, but **how you say it**. Common tells include an over-reliance on em-dashes for sentence expansion, unnaturally balanced paragraph lengths, and a repetitive "Subject-Verb-Object" rhythm.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Furthermore, AI often uses "stopgate" transitions like "Moreover," "In conclusion," or "It is important to note." These are logical anchors that human writers rarely use so consistently. Our humanizer breaks these anchors to create a more organic flow.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Does humanized text bypass AI detectors?
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This is the most common question in the AI space. The short answer: **usually, but not always.** Humanizing AI text removes the obvious mathematical patterns that detectors like GPTZero or Originality.ai look for. However, detectors are constantly being updated with new training data.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            We advocate for the "Human-in-the-loop" approach. Use this tool to broaden the vocabulary and vary the syntax, but perform a final manual pass to add personal anecdotes, specific references, or a unique voice that an LLM cannot replicate.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Common AI Writing Patterns and How to Fix Them
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
            Common Use Cases for AI Humanizing
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
              <h4 className="font-bold text-foreground mb-2">Content Marketing</h4>
              <p className="text-sm text-muted-foreground">Cleaning up AI-generated blog drafts and social captions to sound more personable and less like a corporate manual.</p>
            </div>
            <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
              <h4 className="font-bold text-foreground mb-2">Academic Editing</h4>
              <p className="text-sm text-muted-foreground">Refining research summaries and essay drafts to ensure a consistent, academic-yet-human voice.</p>
            </div>
            <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
              <h4 className="font-bold text-foreground mb-2">Business Email</h4>
              <p className="text-sm text-muted-foreground">Personalizing AI-generated outreach or replies so they don't come across as cold or automated to clients.</p>
            </div>
          </div>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Tips for better results
          </h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Paste your AI text in sections to stay inside the 1,500-character cap.</li>
            <li>Identify specific "stiff" paragraphs and humanize them individually for deeper rewrites.</li>
            <li>Always review the final output to ensure your specific technical details were preserved.</li>
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
            href="/ai"
            className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
          >
            <h3 className="text-base font-semibold text-foreground">Browse AI tools</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Return to the AI hub for writing-focused tools and future prompt-driven utilities.
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

