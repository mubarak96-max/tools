import Link from "next/link";
import type { Metadata } from "next";

import NetWorthCalculator from "@/app/finance/net-worth-calculator/components/NetWorthCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/net-worth-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is net worth?",
    answer:
      "Net worth is total assets minus total liabilities. It shows the value left after paying off all debts.",
  },
  {
    question: "Should property and retirement accounts be included?",
    answer:
      "Yes. Net worth is a balance-sheet measure, so long-term assets and retirement balances are normally included alongside cash and investments.",
  },
  {
    question: "Why track net worth over time?",
    answer:
      "Net worth helps you see whether assets are growing faster than debts, which makes it useful for long-term financial progress tracking.",
  },
];

export const metadata: Metadata = {
  title: "Net Worth Calculator | Assets Minus Liabilities",
  description:
    "Calculate total assets, total liabilities, and net worth from cash, investments, property, debts, and other balance-sheet items.",
  keywords: [
    "net worth calculator",
    "assets minus liabilities calculator",
    "personal balance sheet calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Net Worth Calculator",
    description:
      "Measure total assets, liabilities, and net worth in one balance-sheet calculator.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Net Worth Calculator",
    description:
      "Track assets and debts to see your current net worth.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Net Worth Calculator",
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
      "Free online net worth calculator for assets, liabilities, and liquid-asset tracking.",
    featureList: [
      "Total assets",
      "Total liabilities",
      "Net worth and debt ratio",
    ],
  };
}

export default function NetWorthCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Net Worth Calculator", path: PAGE_PATH },
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
            <li><Link href="/finance" className="hover:text-primary">Finance</Link></li>
            <li>/</li>
            <li className="text-foreground">Net Worth Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Balance Sheet
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Net Worth Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Add up the major asset and debt categories in your personal balance sheet to calculate current net worth and see how much of your position is liquid.
          </p>
        </div>
      </section>

      <NetWorthCalculator />

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

      <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath={PAGE_PATH} />
    </div>
  );
}
