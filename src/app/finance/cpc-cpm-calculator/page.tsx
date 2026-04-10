import Link from "next/link";
import type { Metadata } from "next";

import CpcCpmCalculator from "@/app/finance/cpc-cpm-calculator/components/CpcCpmCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/cpc-cpm-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is CPC?",
    answer:
      "CPC means cost per click. It is the amount spent divided by the number of clicks generated.",
  },
  {
    question: "What is CPM?",
    answer:
      "CPM means cost per mille, or cost per 1,000 impressions. It is the spend divided by impressions, multiplied by 1,000.",
  },
  {
    question: "When should I use CPC vs CPM?",
    answer:
      "Use CPC when the buying model or reporting focuses on clicks and direct traffic. Use CPM when campaigns are measured by reach, views, or impression delivery.",
  },
];

export const metadata: Metadata = {
  title: "CPC / CPM Calculator | Cost Per Click and Cost Per 1,000 Impressions",
  description:
    "Calculate CPC and CPM from ad spend, clicks, and impressions, and estimate spend for target traffic or reach.",
  keywords: [
    "cpc calculator",
    "cpm calculator",
    "cost per click calculator",
    "cost per thousand impressions calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "CPC / CPM Calculator",
    description:
      "Work out cost per click, cost per 1,000 impressions, and estimated spend targets.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CPC / CPM Calculator",
    description:
      "Calculate CPC and CPM metrics for paid campaigns in one tool.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CPC / CPM Calculator",
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
      "Free online CPC and CPM calculator for ad spend, clicks, impressions, and budget planning.",
    featureList: [
      "CPC calculation",
      "CPM calculation",
      "Estimated spend from target metrics",
    ],
  };
}

export default function CpcCpmCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "CPC / CPM Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">CPC / CPM Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Paid Media Math
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            CPC / CPM Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate cost per click and cost per 1,000 impressions from campaign spend, then estimate the budget needed for future traffic or reach targets.
          </p>
        </div>
      </section>

      <CpcCpmCalculator />

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
