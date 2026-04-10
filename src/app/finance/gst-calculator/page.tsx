import Link from "next/link";
import type { Metadata } from "next";

import GstCalculator from "@/app/finance/gst-calculator/components/GstCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/gst-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What GST rate does this calculator use?",
    answer:
      "This page uses Singapore's current prevailing GST rate of 9% for standard-rated supplies. It also distinguishes between zero-rated supplies at 0% and exempt supplies where GST is not charged.",
  },
  {
    question: "What is the difference between zero-rated and exempt supplies?",
    answer:
      "IRAS treats zero-rated supplies as taxable supplies charged at 0%, while exempt supplies are not charged GST. That distinction matters for tax treatment even though both show 0% GST on this calculator.",
  },
  {
    question: "Can I use this calculator for every business case?",
    answer:
      "No. IRAS has specific rules for customer accounting, imported services, low-value goods, and other special cases. This page is meant for straightforward standard-rated, zero-rated, and exempt supply calculations.",
  },
  {
    question: "How do I remove GST from a GST-inclusive amount?",
    answer:
      "For a standard-rated supply, the GST portion is extracted from the inclusive amount using the GST fraction method rather than by simply taking 9% of the gross amount.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "GST Calculator | Singapore GST Calculator",
    description:
      "Calculate Singapore GST using the current 9% standard rate and the official IRAS distinction between standard-rated, zero-rated, and exempt supplies.",
    path: PAGE_PATH,
  }),
  keywords: [
    "gst calculator",
    "singapore gst calculator",
    "add gst singapore",
    "remove gst singapore",
    "9% gst calculator singapore",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "GST Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "SGD",
    },
    description:
      "Free Singapore GST calculator using the current 9% GST rate and official IRAS supply-type distinctions.",
    featureList: [
      "Add GST",
      "Remove GST",
      "Standard-rated supply handling",
      "Zero-rated supply handling",
      "Exempt supply handling",
    ],
  };
}

export default function GstCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "GST Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">GST Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Finance calculator
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            GST Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate Singapore GST using the current 9% standard rate and the official IRAS distinction between standard-rated, zero-rated, and exempt supplies.
          </p>
        </div>
      </section>

      <GstCalculator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What this page is based on</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            IRAS states that GST is charged at the prevailing rate of 9% on standard-rated supplies made in Singapore. IRAS also explains that exported goods and qualifying international services may be zero-rated at 0%, while exempt supplies are not charged GST.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Official references checked on April 10, 2026: <a href="https://www.iras.gov.sg/taxes/goods-services-tax-%28gst%29/charging-gst-%28output-tax%29/when-to-charge-goods-and-services-tax-%28gst%29" target="_blank" rel="noopener noreferrer">IRAS When to Charge GST</a> and <a href="https://www.iras.gov.sg/taxes/goods-services-tax-%28gst%29/charging-gst-%28output-tax%29/when-is-gst-not-charged/supplies-exempt-from-gst" target="_blank" rel="noopener noreferrer">IRAS Supplies Exempt from GST</a>.
          </p>
          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">What this calculator does not cover</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            It does not cover every special GST regime. Customer accounting, imported services, imported low-value goods, and other detailed cases can require separate treatment under IRAS rules.
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
