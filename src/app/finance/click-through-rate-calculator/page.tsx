import Link from "next/link";
import type { Metadata } from "next";

import ClickThroughRateCalculator from "@/app/finance/click-through-rate-calculator/components/ClickThroughRateCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/click-through-rate-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is CTR?",
    answer:
      "CTR stands for click-through rate. It measures how often people clicked after seeing an ad, listing, email, or search result.",
  },
  {
    question: "How do I calculate CTR?",
    answer:
      "Divide clicks by impressions, then multiply by 100. For example, 50 clicks from 2,000 impressions gives a 2.5 percent CTR.",
  },
  {
    question: "Why is CTR useful?",
    answer:
      "CTR helps compare creative, keyword, and campaign performance because it shows how effectively impressions turn into engagement.",
  },
];

export const metadata: Metadata = {
  title: "Click-Through Rate Calculator | CTR Formula and Target Clicks",
  description:
    "Calculate click-through rate from impressions and clicks, and estimate the clicks needed to reach a target CTR.",
  keywords: [
    "click through rate calculator",
    "ctr calculator",
    "ctr formula",
    "ad ctr calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Click-Through Rate Calculator",
    description:
      "Measure CTR from clicks and impressions and estimate clicks for a target CTR.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Click-Through Rate Calculator",
    description:
      "Quick CTR calculator for ads, email, SEO listings, and campaign reporting.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Click-Through Rate Calculator",
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
      "Free online CTR calculator for impressions, clicks, and target click planning.",
    featureList: [
      "CTR calculation",
      "Target click estimate",
      "Clicks per 1,000 impressions",
    ],
  };
}

export default function ClickThroughRateCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Click-Through Rate Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">Click-Through Rate Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Marketing Math
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Click-Through Rate Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Measure CTR from clicks and impressions, then estimate the click volume needed to hit a target rate for ads, search listings, email campaigns, and landing-page tests.
          </p>
        </div>
      </section>

      <ClickThroughRateCalculator />

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
