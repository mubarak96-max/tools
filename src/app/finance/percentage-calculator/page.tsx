import Link from "next/link";
import type { Metadata } from "next";

import PercentageCalculator from "@/app/finance/percentage-calculator/components/PercentageCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/percentage-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How do I calculate a percentage of a number?",
    answer:
      "To find a percentage of a number, multiply the number by the percentage fraction. For example, to find 15% of 200: (15 / 100) × 200 = 30.",
  },
  {
    question: "How do I find out what percentage one number is of another?",
    answer:
      "Divide the first number by the second number, then multiply by 100. For example, to find out what percent 30 is of 150: (30 / 150) × 100 = 20%.",
  },
  {
    question: "How do I calculate percentage change (increase or decrease)?",
    answer:
      "Subtract the old number from the new number to find the difference. Then divide the difference by the old number and multiply by 100. If the result is positive, it's an increase; if negative, it's a decrease.",
  },
  {
    question: "Why use an online percentage calculator?",
    answer:
      "Percentage math can be tricky to do in your head or remember the exact formulas for. An online calculator guarantees instant, error-free results for taxes, discounts, growth rates, and math problems.",
  },
];

export const metadata: Metadata = {
  title: "Percentage Calculator | Find % Increase, Decrease & Values",
  description:
    "Free online percentage calculator. Instantly find a percentage of a number, calculate what percent x is of y, and find percentage increases or decreases.",
  keywords: [
    "percentage calculator",
    "percent calculator",
    "how to calculate percent",
    "percentage increase calculator",
    "percentage decrease calculator",
    "percentage change",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Percentage Calculator",
    description:
      "Instantly calculate percentages, percentage changes, and fractions online.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Percentage Calculator",
    description:
      "Free online percentage calculator for immediate math answers.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Percentage Calculator",
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
      "Free online math tool to calculate percentage values, percentage differences, and percentage proportions.",
    featureList: [
      "Find X% of Y",
      "Find what % X is of Y",
      "Calculate percentage increase and decrease",
      "Instant math results",
    ],
  };
}

export default function PercentageCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Percentage Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">Percentage Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Math Utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Percentage Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Instantly calculate percentages, find out what percent one number is of another, and determine percentage increases or decreases without remembering the formulas.
          </p>
        </div>
      </section>

      <PercentageCalculator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Percentage Formulas Explained</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            If you ever need to calculate these values manually or in an Excel spreadsheet, here are the core mathematical formulas our calculator uses behind the scenes.
          </p>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Common Formulas</h2>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">Percentage of a value:</strong> To find a percentage (P) of a number (V), the formula is: <code>(P / 100) * V</code>.
            </li>
            <li>
              <strong className="text-foreground">Finding the percentage:</strong> If you want to know what percentage number A is of number B, use: <code>(A / B) * 100</code>.
            </li>
            <li>
              <strong className="text-foreground">Percentage Change:</strong> To find the growth or decline between an Old Value and a New Value: <code>((New Value - Old Value) / Old Value) * 100</code>.
            </li>
          </ul>
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
