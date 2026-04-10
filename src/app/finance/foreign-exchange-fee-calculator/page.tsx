import Link from "next/link";
import type { Metadata } from "next";

import ForeignExchangeFeeCalculator from "@/app/finance/foreign-exchange-fee-calculator/components/ForeignExchangeFeeCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/foreign-exchange-fee-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Where do the exchange rates come from?",
    answer:
      "This calculator requests live reference rates from Frankfurter's free exchange-rate API, which documents official and central-bank-backed provider coverage.",
  },
  {
    question: "How is the bank charge applied?",
    answer:
      "The tool models the bank charge as a percentage deduction from the converted amount. Some banks instead widen the exchange spread or add a flat fee, so your provider's final quote may differ.",
  },
  {
    question: "What does the effective rate mean?",
    answer:
      "The effective rate is the final received amount divided by the source amount after the percentage fee is deducted.",
  },
];

export const metadata: Metadata = {
  title: "Foreign Exchange Fee Calculator | Live Rate Plus Bank Charge",
  description:
    "Convert between currencies using a live reference rate and estimate the final amount received after a bank charge percentage.",
  keywords: [
    "foreign exchange fee calculator",
    "fx fee calculator",
    "currency conversion fee calculator",
    "bank charge currency converter",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Foreign Exchange Fee Calculator",
    description:
      "Estimate the amount received after converting currency and applying a bank charge percentage.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Foreign Exchange Fee Calculator",
    description:
      "Use a live reference exchange rate and bank-charge percentage to estimate what arrives.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Foreign Exchange Fee Calculator",
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
      "Free foreign exchange fee calculator using a live reference rate and a user-entered bank charge percentage.",
    featureList: [
      "Live exchange-rate lookup",
      "From/to currency inputs",
      "Bank charge percentage deduction",
    ],
  };
}

export default function ForeignExchangeFeeCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Foreign Exchange Fee Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">Foreign Exchange Fee Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Live FX Math
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Foreign Exchange Fee Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Convert between currencies using a live reference rate and then apply a bank charge percentage to estimate the amount that actually arrives.
          </p>
        </div>
      </section>

      <ForeignExchangeFeeCalculator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Scope note</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This page uses a live reference FX rate, then applies the percentage fee you enter as a direct deduction from the converted amount. Some real providers charge through spread markups, transfer fees, or both, so treat this as a transparent estimate rather than a guaranteed bank quote.
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
