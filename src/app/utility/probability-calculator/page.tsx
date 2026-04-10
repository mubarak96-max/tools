import Link from "next/link";
import type { Metadata } from "next";

import ProbabilityCalculator from "@/app/utility/probability-calculator/components/ProbabilityCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/probability-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is basic probability?",
    answer:
      "Basic probability is favorable outcomes divided by total outcomes, assuming all outcomes are equally likely.",
  },
  {
    question: "What is the difference between combinations and permutations?",
    answer:
      "Combinations count selections where order does not matter, while permutations count arrangements where order does matter.",
  },
  {
    question: "What does the binomial section calculate?",
    answer:
      "It calculates the probability of getting exactly k successes in n independent trials when each trial has the same success probability.",
  },
];

export const metadata: Metadata = {
  title: "Probability Calculator | Basic Probability, nCr, nPr, and Binomial",
  description:
    "Calculate basic probability, combinations, permutations, and exact binomial probability from common input values.",
  keywords: ["probability calculator", "ncr calculator", "npr calculator", "binomial probability calculator"],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Probability Calculator",
    description: "Compute basic probability, combinations, permutations, and binomial outcomes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Probability Calculator",
    description: "A practical probability calculator for common formulas.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Probability Calculator",
    url: PAGE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free probability calculator for common formulas including nCr, nPr, and binomial probability.",
  };
}

export default function ProbabilityCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "Probability Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/utility" className="hover:text-primary">Utility</Link></li>
            <li>/</li>
            <li className="text-foreground">Probability Calculator</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">Math Utility</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Probability Calculator</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Work out basic probability, count combinations and permutations, and calculate exact binomial outcomes from a simple set of inputs.
          </p>
        </div>
      </section>
      <ProbabilityCalculator />
      <section className="space-y-6 border-t border-border/60 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faq.map((item, index) => (
            <article key={item.question} className={`py-4 ${index === 0 ? "" : "border-t border-border/50"}`}>
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
      <RelatedToolsSection category="Utility" categoryHref="/utility" currentPath={PAGE_PATH} />
    </div>
  );
}
