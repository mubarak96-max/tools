import Link from "next/link";
import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import EMICalculator from "@/app/free-tools/emi-calculator/components/EMICalculator";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";
import { absoluteUrl } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  serializeJsonLd,
} from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/free-tools/emi-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is EMI?",
    answer:
      "EMI stands for Equated Monthly Instalment. It is the fixed monthly amount you pay to repay a loan, covering both principal and interest.",
  },
  {
    question: "How is EMI calculated?",
    answer:
      "EMI is calculated using the standard loan formula based on principal, monthly interest rate, and tenure in months.",
  },
  {
    question: "Does this EMI calculator work for home, car, and personal loans?",
    answer:
      "Yes. The same repayment formula applies across those loan types. You only need to change the loan amount, rate, and tenure.",
  },
  {
    question: "What is an amortization schedule?",
    answer:
      "An amortization schedule is a month-by-month breakdown showing how much of each EMI goes to interest, how much goes to principal, and the remaining balance.",
  },
  {
    question: "How can I reduce my EMI?",
    answer:
      "You can reduce EMI by increasing tenure, lowering the interest rate, making a larger down payment, or prepaying part of the loan balance.",
  },
];

export const metadata: Metadata = {
  title: "EMI Calculator | Free Loan Payment Calculator for USD, EUR, GBP, AED, INR",
  description:
    "Calculate monthly loan EMI for home, car, and personal loans. Supports USD, EUR, GBP, AED, and INR with instant results and amortization schedule.",
  keywords: [
    "EMI calculator",
    "loan EMI calculator",
    "monthly payment calculator",
    "home loan EMI calculator",
    "car loan EMI calculator",
    "personal loan calculator",
    "EMI calculator India",
    "loan calculator UAE",
    "mortgage calculator",
    "loan repayment calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free EMI Calculator for Home, Car, and Personal Loans",
    description:
      "Estimate monthly EMI, total interest, and total repayment in USD, EUR, GBP, AED, and INR.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free EMI Calculator",
    description:
      "Calculate monthly loan repayments with multi-currency support and a full amortization schedule.",
  },
};

function buildEmiApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "EMI Calculator",
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
      "Free EMI calculator for home loans, car loans, and personal loans with support for USD, EUR, GBP, AED, and INR.",
    featureList: [
      "Monthly EMI calculation",
      "Multi-currency support",
      "Amortization schedule",
      "Instant repayment estimates",
    ],
  };
}

export default function EMICalculatorPage() {
  const relatedTools = getRelatedFreeTools(PAGE_PATH);
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Free Tools", path: "/free-tools" },
    { name: "EMI Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const emiTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildEmiApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/free-tools" className="hover:text-primary">
                Free Tools
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">EMI Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Finance calculator
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            EMI Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate monthly loan repayments instantly. Adjust loan amount, interest rate, tenure,
            and currency to estimate your EMI, total interest payable, and complete repayment amount.
          </p>
          {emiTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {emiTool.description}
            </p>
          ) : null}
        </div>
      </section>

      <EMICalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is EMI?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            EMI stands for Equated Monthly Instalment. It is the fixed monthly payment a borrower
            makes to a lender until the loan is fully repaid. Each EMI includes one part that pays
            down the principal and one part that covers interest.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            In the early stage of a loan, a larger share of the EMI goes toward interest. As the
            outstanding balance decreases, more of each payment starts reducing the principal. That
            shift is what you see in the amortization schedule below the calculator.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">EMI formula</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The standard EMI formula is:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-[1rem] border border-border bg-background p-4 text-sm text-foreground">
            <code>EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)</code>
          </pre>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">P</strong>: principal loan amount
            </li>
            <li>
              <strong className="text-foreground">r</strong>: monthly interest rate
            </li>
            <li>
              <strong className="text-foreground">n</strong>: tenure in months
            </li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            How to use this EMI calculator
          </h2>
          <ol className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Select a currency relevant to your market.</li>
            <li>Adjust the loan amount to match the expected borrowing size.</li>
            <li>Set the annual interest rate offered by your lender.</li>
            <li>Choose the loan tenure in months.</li>
            <li>Review the monthly EMI, total interest, and total repayment instantly.</li>
            <li>Open the amortization schedule to inspect the month-by-month breakdown.</li>
          </ol>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            How to reduce your EMI
          </h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Increase loan tenure to spread the balance across more months.</li>
            <li>Negotiate a lower interest rate before accepting the loan.</li>
            <li>Make a larger down payment to reduce the financed amount.</li>
            <li>Prepay part of the principal when your lender allows it.</li>
          </ul>
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Frequently asked questions
        </h2>
        <div className="mt-6 space-y-4">
          {faq.map((item) => (
            <article key={item.question} className="rounded-[1.25rem] border border-border bg-background p-5">
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Related tool paths</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Link
            href="/free-tools"
            className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
          >
            <h3 className="text-base font-semibold text-foreground">Browse free tools</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Return to the free-tools hub and navigate upcoming calculators and utilities.
            </p>
          </Link>

          <Link
            href="/tools"
            className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
          >
            <h3 className="text-base font-semibold text-foreground">Explore software tools</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Jump into the main software directory for structured comparisons and recommendations.
            </p>
          </Link>

          {relatedTools[0] ? (
            <Link
              href={relatedTools[0].href}
              className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
            >
              <h3 className="text-base font-semibold text-foreground">{relatedTools[0].name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {relatedTools[0].description}
              </p>
            </Link>
          ) : (
            <div className="rounded-[1.25rem] border border-dashed border-border bg-background p-5">
              <h3 className="text-base font-semibold text-foreground">More calculators soon</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                This free-tools section is ready for more finance and conversion utilities.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
