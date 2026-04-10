import Link from "next/link";
import type { Metadata } from "next";

import RoiCalculator from "@/app/finance/roi-calculator/components/RoiCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/roi-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is ROI?",
    answer:
      "ROI stands for return on investment. It measures profit or loss relative to the total money committed to an investment or project.",
  },
  {
    question: "How do I calculate ROI?",
    answer:
      "Subtract the total cost basis from the final value to find net profit, then divide by total cost basis and multiply by 100.",
  },
  {
    question: "What is annualized return?",
    answer:
      "Annualized return converts a total multi-year result into an equivalent yearly growth rate so you can compare investments held for different time periods.",
  },
];

export const metadata: Metadata = {
  title: "ROI Calculator | Return on Investment and Annualized Return",
  description:
    "Calculate ROI, total profit, return multiple, and annualized return from investment cost, extra costs, and final value.",
  keywords: [
    "roi calculator",
    "return on investment calculator",
    "annualized return calculator",
    "investment return calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "ROI Calculator",
    description:
      "Measure return on investment, profit, and annualized return in one calculator.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROI Calculator",
    description:
      "Calculate profit, ROI percentage, and annualized return from an investment.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ROI Calculator",
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
      "Free online ROI calculator with total return, cost basis, and annualized return.",
    featureList: [
      "ROI percentage",
      "Net profit or loss",
      "Annualized return estimate",
    ],
  };
}

export default function RoiCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "ROI Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">ROI Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Investment Math
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            ROI Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate total return on investment from money in, money out, and extra costs. Use it to compare investments, projects, and one-time purchases with a single ROI formula.
          </p>
        </div>
      </section>

      <RoiCalculator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">ROI formula</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This calculator uses <code>(final value - total cost basis) / total cost basis x 100</code>. Total cost basis includes the initial investment plus extra fees or other direct costs you enter.
          </p>
        </div>
      </section>

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
