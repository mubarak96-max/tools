import Link from "next/link";
import type { Metadata } from "next";

import TipCalculator from "@/app/utility/tip-calculator/components/TipCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/tip-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How do I calculate a tip?",
    answer:
      "Multiply the bill amount by the tip percentage, then divide by 100. Add that tip amount back to the bill to get the total.",
  },
  {
    question: "How do I split a bill with tip?",
    answer:
      "First calculate the total bill including tip, then divide that amount by the number of people sharing the bill.",
  },
  {
    question: "What tip percentage should I use?",
    answer:
      "That depends on local custom and service quality. Many people use 15 percent to 20 percent for table service, while quick-service and takeaway situations often differ.",
  },
];

export const metadata: Metadata = {
  title: "Tip Calculator | Split Bill and Tip Instantly",
  description:
    "Calculate tip amount, total bill, and per-person split from a bill amount and tip percentage.",
  keywords: [
    "tip calculator",
    "bill split calculator",
    "gratuity calculator",
    "split bill with tip",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Tip Calculator",
    description:
      "Work out tip amount, full bill total, and per-person share instantly.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tip Calculator",
    description:
      "Calculate gratuity and split the bill in one quick calculator.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Tip Calculator",
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
      "Free online tip calculator for gratuity, bill total, and per-person split.",
    featureList: [
      "Tip amount calculation",
      "Bill split calculation",
      "Quick preset percentages",
    ],
  };
}

export default function TipCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "Tip Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">Tip Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Money Utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Tip Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate gratuity, full bill total, and per-person split in a few seconds. Adjust the percentage or use common presets for a quick answer at the table.
          </p>
        </div>
      </section>

      <TipCalculator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Tip formula</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The tip amount is <code>bill x tip percentage / 100</code>. The total bill is <code>bill + tip</code>, and the split amount is <code>total / number of people</code>.
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

      <RelatedToolsSection category="Utility" categoryHref="/utility" currentPath={PAGE_PATH} />
    </div>
  );
}
