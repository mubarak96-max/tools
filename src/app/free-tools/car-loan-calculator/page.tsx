import Link from "next/link";
import type { Metadata } from "next";

import CarLoanCalculator from "@/app/free-tools/car-loan-calculator/components/CarLoanCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/free-tools/car-loan-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How does a car loan calculator work?",
    answer:
      "It subtracts down payment and trade-in value from the vehicle price, then calculates monthly repayment from the financed amount, interest rate, and loan term.",
  },
  {
    question: "What is a good down payment for a car loan?",
    answer:
      "Many buyers target around 20 percent for a new car and 10 percent for a used car, though the right number depends on budget and lender requirements.",
  },
  {
    question: "What is trade-in value in a car loan?",
    answer:
      "Trade-in value is the amount credited for your current vehicle when buying another one. It directly reduces the amount you need to finance.",
  },
  {
    question: "Are rates usually higher for used cars?",
    answer:
      "Yes. Used car loans often carry higher rates because the vehicle is older and the lender takes on more risk.",
  },
  {
    question: "What loan tenure is best for a car loan?",
    answer:
      "Shorter terms save interest overall, while longer terms reduce monthly pressure. Around 48 to 60 months is a common balance point.",
  },
];

export const metadata: Metadata = {
  title: "Car Loan Calculator | Monthly Auto Loan Payment for USD, EUR, GBP, AED, INR",
  description:
    "Calculate monthly car loan payments with down payment and trade-in. Supports new and used cars across USD, EUR, GBP, AED, and INR.",
  keywords: [
    "car loan calculator",
    "auto loan calculator",
    "car payment calculator",
    "monthly car payment",
    "car finance calculator",
    "vehicle loan calculator",
    "used car loan calculator",
    "new car loan calculator",
    "car EMI calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free Car Loan Calculator for New and Used Cars",
    description:
      "Estimate monthly auto loan payments with down payment and trade-in support across major currencies.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Car Loan Calculator",
    description:
      "Monthly auto loan payments with down payment and trade-in support in USD, EUR, GBP, AED, and INR.",
  },
};

function buildCarLoanApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Car Loan Calculator",
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
      "Free car loan calculator with down payment and trade-in support for new and used cars across major currencies.",
    featureList: [
      "New car loan calculation",
      "Used car loan calculation",
      "Down payment support",
      "Trade-in value deduction",
      "Total car cost breakdown",
    ],
  };
}

export default function CarLoanCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Free Tools", path: "/free-tools" },
    { name: "Car Loan Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const relatedTools = getRelatedFreeTools(PAGE_PATH);
  const carTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildCarLoanApplicationJsonLd())} />
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
            <li className="text-foreground">Car Loan Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Finance calculator
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Car Loan Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate monthly payments for new and used vehicles with down payment and trade-in built in.
            See how financing changes your real total car cost before you sign anything.
          </p>
          {carTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{carTool.description}</p>
          ) : null}
        </div>
      </section>

      <CarLoanCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How a car loan works</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A car loan is a fixed repayment plan used to finance some or all of a vehicle purchase.
            The financed amount is usually the sticker price minus any down payment and minus any trade-in credit.
            That financed amount is then repaid in equal monthly installments plus interest.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The biggest monthly-payment drivers are purchase price, down payment, annual rate, and loan term.
            Used-car rates are often higher than new-car rates, which is why the calculator lets you switch between them.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Down payment and trade-in value</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A higher down payment reduces the amount borrowed immediately. A trade-in does the same by applying the value of your current car against the purchase.
            Both reduce monthly payment and total interest over the life of the loan.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">New car vs used car loans</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            New car financing typically comes with lower rates, especially when manufacturers subsidize loans.
            Used car loans often cost more because the vehicle is older and depreciates differently.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Choosing the right loan tenure</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Shorter tenures increase the monthly payment but reduce total interest. Longer tenures lower the monthly bill while increasing the final amount paid.
            This is why 48 to 60 months tends to be the most practical range for many buyers.
          </p>

          <table className="mt-6 w-full border-collapse overflow-hidden rounded-[1rem] border border-border text-sm">
            <caption className="mb-3 text-left text-sm text-muted-foreground">
              Example impact of tenure on a $25,000 loan at 7% APR
            </caption>
            <thead className="bg-muted">
              <tr>
                <th className="border border-border px-3 py-2 text-left">Tenure</th>
                <th className="border border-border px-3 py-2 text-left">Monthly Payment</th>
                <th className="border border-border px-3 py-2 text-left">Total Interest</th>
                <th className="border border-border px-3 py-2 text-left">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border px-3 py-2">36 months</td><td className="border border-border px-3 py-2">$772</td><td className="border border-border px-3 py-2">$2,791</td><td className="border border-border px-3 py-2">$27,791</td></tr>
              <tr><td className="border border-border px-3 py-2">48 months</td><td className="border border-border px-3 py-2">$598</td><td className="border border-border px-3 py-2">$3,706</td><td className="border border-border px-3 py-2">$28,706</td></tr>
              <tr><td className="border border-border px-3 py-2">60 months</td><td className="border border-border px-3 py-2">$495</td><td className="border border-border px-3 py-2">$4,752</td><td className="border border-border px-3 py-2">$29,752</td></tr>
              <tr><td className="border border-border px-3 py-2">72 months</td><td className="border border-border px-3 py-2">$427</td><td className="border border-border px-3 py-2">$5,731</td><td className="border border-border px-3 py-2">$30,731</td></tr>
              <tr><td className="border border-border px-3 py-2">84 months</td><td className="border border-border px-3 py-2">$378</td><td className="border border-border px-3 py-2">$6,762</td><td className="border border-border px-3 py-2">$31,762</td></tr>
            </tbody>
          </table>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Tips to get a better car loan rate</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Check credit before applying and fix avoidable issues early.</li>
            <li>Compare bank, dealer, and credit-union offers instead of taking the first quote.</li>
            <li>Use a larger down payment where possible to lower lender risk.</li>
            <li>Avoid rolling unnecessary add-ons into the financed amount.</li>
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

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Related tool paths</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Link
            href="/free-tools/emi-calculator"
            className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
          >
            <h3 className="text-base font-semibold text-foreground">EMI Calculator</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use the general EMI tool for broader loan repayment scenarios.
            </p>
          </Link>
          <Link
            href="/free-tools"
            className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
          >
            <h3 className="text-base font-semibold text-foreground">Browse free tools</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Return to the finance and utility tool hub.
            </p>
          </Link>
          {relatedTools[0] ? (
            <Link
              href={relatedTools[0].href}
              className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
            >
              <h3 className="text-base font-semibold text-foreground">{relatedTools[0].name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{relatedTools[0].description}</p>
            </Link>
          ) : (
            <div className="rounded-[1.25rem] border border-dashed border-border bg-background p-5">
              <h3 className="text-base font-semibold text-foreground">More calculators soon</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                This section is ready for more related finance utilities.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
