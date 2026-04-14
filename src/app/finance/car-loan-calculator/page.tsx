import Link from "next/link";
import type { Metadata } from "next";

import CarLoanCalculator from "@/app/finance/car-loan-calculator/components/CarLoanCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const revalidate = 43200;

const PAGE_PATH = "/finance/car-loan-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Car Loan Calculator | Monthly Payment, Interest, and Affordability",
  description:
    "Estimate your car loan EMI or monthly payment, total interest, total repayment, and what car you can afford. Includes down payment, trade-in, and term comparison support.",
  keywords: [
    "car loan calculator",
    "auto loan calculator",
    "car payment calculator",
    "car EMI calculator",
    "car affordability calculator",
    "monthly car payment calculator",
    "used car loan calculator",
    "car loan calculator with trade in",
    "Dubai car loan calculator",
    "UAE car EMI calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Car Loan Calculator",
    description:
      "Estimate monthly car payments, total loan cost, and what car budget fits your monthly plan.",
  },
};

const faq = [
  {
    question: "What is a car loan EMI?",
    answer:
      "EMI means Equated Monthly Instalment. It is the fixed monthly payment used to repay a car loan over time. Each EMI usually includes both principal repayment and interest.",
  },
  {
    question: "How is car loan EMI calculated?",
    answer:
      "Car loan EMI depends on the amount financed, annual interest rate, and loan tenure in months. The standard amortization formula uses the principal, monthly interest rate, and number of payments to produce a fixed monthly payment.",
  },
  {
    question: "What affects my monthly car payment the most?",
    answer:
      "The biggest drivers are loan amount, down payment, trade-in value, annual interest rate, and tenure. A bigger down payment reduces the loan immediately, while a longer tenure lowers EMI but usually increases total interest paid.",
  },
  {
    question: "What is a good down payment for a car loan?",
    answer:
      "A larger down payment generally improves the loan by reducing both monthly payment and interest cost. Many buyers aim to put meaningful cash down rather than financing the entire purchase price, especially because cars depreciate quickly.",
  },
  {
    question: "How much car can I afford?",
    answer:
      "A common planning guide is keeping the monthly car payment within roughly 20% of gross monthly income, with 25% acting as a stretched upper band for many budgets. This is not a lender rule or guarantee; it is a budgeting checkpoint.",
  },
  {
    question: "Can I calculate a car budget from my target EMI?",
    answer:
      "Yes. Reverse mode lets you start with the monthly payment you want to stay within, then estimate the maximum loan amount and total car budget after adding down payment and trade-in value.",
  },
  {
    question: "Are these results exact lender quotes?",
    answer:
      "No. This calculator is for planning only. Actual financing depends on lender fees, approval criteria, credit profile, car age, dealer promotions, insurance, and local market conditions.",
  },
];

function buildCarLoanApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Car Loan Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free car loan calculator for monthly payment, total interest, affordability planning, reverse EMI budgeting, and term comparison.",
    featureList: [
      "Monthly car loan payment calculation",
      "Total interest and total repayment breakdown",
      "Down payment and trade-in support",
      "Reverse mode to estimate affordable car budget from target EMI",
      "Loan term comparison",
      "Multi-currency support including AED",
    ],
  };
}

export default function CarLoanCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Car Loan Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildCarLoanApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/finance" className="hover:text-primary">
                Finance
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">Car Loan Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Car finance planning
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Car Loan Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Estimate your monthly car payment, total interest, and total repayment before you sign a finance contract.
            Use down payment, trade-in, and loan term inputs to test realistic scenarios or switch to reverse mode to
            ask the more useful question: what car can I actually afford?
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <CarLoanCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is a car loan EMI?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A car loan EMI is the fixed monthly payment used to repay an auto loan over time. Each payment usually
            includes both principal and interest, which is why the same loan can feel affordable month to month while
            still becoming expensive in total.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How car loan EMI is calculated</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The standard EMI calculation uses:
          </p>
          <div className="mt-4 rounded-[1.25rem] border border-border bg-background p-4 font-mono text-sm text-foreground">
            EMI = P x R x (1 + R)^N / [(1 + R)^N - 1]
          </div>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">P:</strong> loan amount after down payment and trade-in value</li>
            <li><strong className="text-foreground">R:</strong> monthly interest rate</li>
            <li><strong className="text-foreground">N:</strong> total number of monthly payments</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">What affects your car loan EMI?</h2>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Loan amount:</strong> a larger loan raises the monthly payment.</li>
            <li><strong className="text-foreground">Down payment:</strong> more cash upfront lowers the loan and reduces interest.</li>
            <li><strong className="text-foreground">Interest rate:</strong> even a small rate difference can materially change total cost.</li>
            <li><strong className="text-foreground">Tenure:</strong> longer loans lower EMI but usually increase total interest paid.</li>
            <li><strong className="text-foreground">Trade-in value:</strong> credit from an existing vehicle reduces the financed amount.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Why affordability matters more than EMI alone</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A lower EMI is not automatically a better loan. Stretching the term can reduce the monthly bill while
            increasing the total amount paid. That is why this tool pairs EMI with total interest, total repayment, and
            an optional income-based affordability check. It is meant for financial planning, not just calculation.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Important disclaimer</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Results are estimates only. Actual car financing depends on lender fees, approval criteria, vehicle age,
            credit profile, local regulations, dealer campaigns, insurance, and other charges. Use this calculator to
            compare options and prepare questions before speaking with a bank, lender, or dealer.
          </p>
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
