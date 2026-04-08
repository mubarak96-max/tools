import Link from "next/link";
import type { Metadata } from "next";

import ProfitMarginCalculator from "@/app/finance/profit-margin-calculator/components/ProfitMarginCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/profit-margin-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is the difference between margin and markup?",
    answer:
      "Margin is profit divided by selling price, while markup is profit divided by cost. They are related but produce different percentages.",
  },
  {
    question: "How do I calculate selling price from a target margin?",
    answer:
      "Divide cost by one minus the target margin expressed as a decimal. That gives the selling price required to achieve the target margin.",
  },
  {
    question: "How do I calculate selling price from markup?",
    answer:
      "Multiply cost by one plus the markup expressed as a decimal. That gives the final selling price based on markup.",
  },
  {
    question: "Why does a 50 percent markup not mean a 50 percent margin?",
    answer:
      "Because markup is based on cost and margin is based on selling price. On a 100 cost with 50 markup, the selling price becomes 150, so the margin is only 33.3 percent.",
  },
];

export const metadata: Metadata = {
  title: "Profit Margin Calculator | Margin, Markup, and Selling Price Calculator",
  description:
    "Calculate profit margin, markup, gross profit, and selling price from cost using one real-time profit margin calculator.",
  keywords: [
    "profit margin calculator",
    "margin calculator",
    "markup calculator",
    "selling price calculator",
    "gross profit calculator",
    "margin vs markup calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Profit Margin Calculator for Margin, Markup, and Pricing",
    description:
      "Use one calculator to work from cost and price, cost and target margin, or cost and markup percentage.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profit Margin Calculator",
    description:
      "Calculate margin, markup, gross profit, and selling price in real time.",
  },
};

function buildProfitApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Profit Margin Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free profit margin calculator with margin, markup, and target-pricing modes for businesses, freelancers, and retailers.",
    featureList: [
      "Margin from price mode",
      "Price from target margin mode",
      "Price from markup mode",
      "Margin health indicator",
      "Markup and margin comparison",
    ],
  };
}

export default function ProfitMarginCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Profit Margin Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const relatedTools = getRelatedFreeTools(PAGE_PATH);
  const tool = FREE_TOOLS.find((item) => item.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildProfitApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/finance" className="hover:text-primary">Finance</Link></li>
            <li>/</li>
            <li className="text-foreground">Profit Margin Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Finance calculator
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Profit Margin Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate gross profit, margin, markup, and selling price from cost with three practical pricing modes in one tool.
          </p>
          {tool ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{tool.description}</p> : null}
        </div>
      </section>

      <ProfitMarginCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why margin and markup get confused</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Many pricing mistakes happen because margin and markup are treated like the same number. They are not. Margin tells you how much of the selling price becomes profit, while markup tells you how much profit was added relative to cost.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            That means two businesses can use the same cost base and talk about pricing differently depending on whether they work in margin terms or markup terms.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Three ways to use this calculator</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Start with cost and selling price to measure your current margin and markup.</li>
            <li>Start with cost and target margin to work out what you need to charge.</li>
            <li>Start with cost and markup to convert wholesale-style pricing into an actual margin.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Why the health indicator matters</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Margin strength depends on industry, but a qualitative signal still helps quickly show whether pricing is dangerously thin, broadly healthy, or exceptionally strong.
          </p>
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
            href="/finance"
            className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
          >
            <h3 className="text-base font-semibold text-foreground">Browse finance tools</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Return to the hub for pricing, salary, tax, and finance tools.
            </p>
          </Link>
          <Link
            href="/finance/vat-calculator"
            className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
          >
            <h3 className="text-base font-semibold text-foreground">VAT Calculator</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Pair margin calculations with VAT-inclusive and VAT-exclusive pricing checks.
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
