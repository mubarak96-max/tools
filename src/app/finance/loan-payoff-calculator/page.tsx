import Link from "next/link";
import type { Metadata } from "next";

import LoanPayoffCalculator from "@/app/finance/loan-payoff-calculator/components/LoanPayoffCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/loan-payoff-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How is the payment calculated?",
    answer:
      "The base payment uses the standard fixed-rate amortizing-loan formula for the balance, APR, and months remaining.",
  },
  {
    question: "What does extra payment do?",
    answer:
      "Extra payment is treated as additional principal paid each month. That reduces the balance faster, which shortens the term and lowers total interest.",
  },
  {
    question: "Does this work for all loans?",
    answer:
      "It works best for fixed-rate amortizing loans. Variable-rate loans, fees, and irregular payment schedules can change real lender statements.",
  },
];

export const metadata: Metadata = {
  title: "Loan Payoff Calculator | Early Payoff and Interest Saved",
  description:
    "Calculate scheduled loan payments, early payoff timing, months saved, and interest saved from an extra monthly payment.",
  keywords: [
    "loan payoff calculator",
    "early payoff calculator",
    "extra payment calculator",
    "interest saved calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Loan Payoff Calculator",
    description:
      "See how extra monthly payments change payoff time and total interest on a fixed-rate loan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loan Payoff Calculator",
    description:
      "Measure early-payoff timing and interest saved from extra payments.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Loan Payoff Calculator",
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
      "Free loan payoff calculator for fixed-rate amortizing loans with optional extra monthly payment.",
    featureList: [
      "Scheduled payment calculation",
      "Months saved from extra payment",
      "Interest saved estimate",
    ],
  };
}

export default function LoanPayoffCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Loan Payoff Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">Loan Payoff Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Repayment Math
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Loan Payoff Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            See the scheduled payment for a fixed-rate loan, then compare the standard payoff path against an accelerated plan with extra monthly principal.
          </p>
        </div>
      </section>

      <LoanPayoffCalculator />

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
