import Link from "next/link";
import type { Metadata } from "next";

import DiscountCalculator from "@/app/finance/discount-calculator/components/DiscountCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { FREE_TOOLS } from "@/lib/tools/registry";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/discount-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How do I calculate the final price after a discount?",
    answer:
      "Multiply the original price by the discount percentage to find the amount saved, then subtract that amount from the original price.",
  },
  {
    question: "How do I calculate what percent off a sale price is?",
    answer:
      "Subtract the sale price from the original price, then divide the savings by the original price and multiply by 100.",
  },
  {
    question: "Does this discount calculator work with any currency?",
    answer:
      "Yes. The tool does not lock you to one market. You can type the currency symbol you want and use the same calculation flow.",
  },
  {
    question: "What counts as a good discount?",
    answer:
      "That depends on the product category, but many shoppers treat 20 percent or more as a meaningful sale threshold.",
  },
];

export const metadata: Metadata = {
  title: "Discount Calculator | Final Price and Percent Off Calculator",
  description:
    "Calculate final price after discount or reverse-calculate percent off from original and sale price. Fast, free, and no sign-up required.",
  keywords: [
    "discount calculator",
    "sale price calculator",
    "percent off calculator",
    "discount percentage calculator",
    "price after discount calculator",
    "how much is 20 percent off",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Discount Calculator for Final Price and Percent Off",
    description:
      "Use one page to calculate final price after discount or reverse-calculate the discount percentage from prices.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discount Calculator",
    description:
      "Calculate sale price, amount saved, and discount percentage instantly.",
  },
};

function buildDiscountApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Discount Calculator",
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
      "Free discount calculator with two modes: final price from discount percent, and reverse percent-off calculation from original and sale price.",
    featureList: [
      "Final price calculation",
      "Reverse discount percent calculation",
      "Amount saved output",
      "Custom currency symbol support",
    ],
  };
}

export default function DiscountCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Discount Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const discountTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildDiscountApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/finance" className="hover:text-primary">Finance</Link></li>
            <li>/</li>
            <li className="text-foreground">Discount Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Shopping utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Discount Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Use one page to calculate the final price after a discount or reverse-calculate how much percent off a sale really is.
          </p>
          {discountTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{discountTool.description}</p>
          ) : null}
        </div>
      
        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <DiscountCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why a discount calculator is useful</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Shopping pages often show a mix of original prices, coupon percentages, and sale prices. A quick discount calculator removes the guesswork and shows the real amount saved.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This version supports both directions. You can start with the original price and the discount percentage, or start with the original price and the sale price and work backward to the percent off.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How the math works</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Discount amount = original price x discount percentage</li>
            <li>Final price = original price - discount amount</li>
            <li>Percent off = (amount saved / original price) x 100</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">When to use each mode</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Use <strong className="text-foreground">Final Price</strong> when a store advertises a discount percentage.</li>
            <li>Use <strong className="text-foreground">% Off</strong> when you only know the original price and sale price.</li>
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

      <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath={PAGE_PATH} />
    </div>
  );
}


