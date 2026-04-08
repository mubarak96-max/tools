import Link from "next/link";
import type { Metadata } from "next";

import MortgageCalculator from "@/app/finance/mortgage-calculator/components/MortgageCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/mortgage-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is PITI in a mortgage?",
    answer:
      "PITI stands for principal, interest, taxes, and insurance. It represents the full monthly housing payment many borrowers budget for.",
  },
  {
    question: "How is a mortgage payment calculated?",
    answer:
      "Mortgage payments are calculated using the loan amount, monthly interest rate, and term in months. Property tax and homeowners insurance are then added to estimate PITI.",
  },
  {
    question: "How much down payment do I need for a mortgage?",
    answer:
      "That depends on the country, lender, and loan program. Many buyers target 10 to 20 percent, but some markets and products require more or less.",
  },
  {
    question: "How can I lower my monthly mortgage payment?",
    answer:
      "A larger down payment, lower interest rate, longer term, or later refinancing can reduce the monthly payment. Extra principal payments can also cut long-term interest.",
  },
  {
    question: "What is an amortization schedule?",
    answer:
      "It is a month-by-month breakdown of each payment, showing how much goes to interest, how much goes to principal, and the remaining balance.",
  },
  {
    question: "Does this mortgage calculator work for different countries?",
    answer:
      "Yes. It includes market-specific defaults for USD, EUR, GBP, AED, and INR so you can start with more realistic examples for your region.",
  },
];

export const metadata: Metadata = {
  title: "Mortgage Calculator | Free Home Loan Payment Calculator for USD, EUR, GBP, AED, INR",
  description:
    "Calculate monthly mortgage payments with down payment, property tax, insurance, and amortization schedule. Supports USD, EUR, GBP, AED, and INR.",
  keywords: [
    "mortgage calculator",
    "home loan calculator",
    "monthly mortgage payment calculator",
    "mortgage repayment calculator",
    "house loan calculator",
    "mortgage calculator India",
    "home loan calculator UAE",
    "mortgage calculator UK",
    "PITI calculator",
    "amortization calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free Mortgage Calculator with PITI and Amortization",
    description:
      "Estimate monthly mortgage payments across USD, EUR, GBP, AED, and INR with tax, insurance, and full amortization.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Mortgage Calculator",
    description:
      "Calculate home loan payments, down payment impact, and amortization across major currencies.",
  },
};

function buildMortgageApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Mortgage Calculator",
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
      "Free mortgage calculator with down payment, property tax, insurance, and amortization schedule across USD, EUR, GBP, AED, and INR.",
    featureList: [
      "Monthly mortgage payment calculation",
      "Down payment planning",
      "PITI estimate",
      "Amortization schedule",
      "Multi-currency defaults",
    ],
  };
}

export default function MortgageCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Mortgage Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const relatedTools = getRelatedFreeTools(PAGE_PATH);
  const mortgageTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildMortgageApplicationJsonLd())} />
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
              <Link href="/finance" className="hover:text-primary">
                Finance
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">Mortgage Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Finance calculator
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Mortgage Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate monthly mortgage payments instantly with home price, down payment,
            interest rate, property tax, and insurance. Review both principal-and-interest
            payments and a fuller monthly PITI estimate.
          </p>
          {mortgageTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{mortgageTool.description}</p>
          ) : null}
        </div>
      </section>

      <MortgageCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How mortgage payments work</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A mortgage is a long-term loan used to buy real estate. Each monthly payment is split between
            principal, which reduces the balance, and interest, which is the cost of borrowing. Early in the
            loan, more of the payment usually goes toward interest. Over time, the principal portion grows.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Many borrowers also budget for taxes and insurance on top of the loan payment. That full estimate
            is often called PITI: principal, interest, taxes, and insurance.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Mortgage payment formula</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The core monthly payment formula is:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-[1rem] border border-border bg-background p-4 text-sm text-foreground">
            <code>M = P * r * (1 + r)^n / ((1 + r)^n - 1)</code>
          </pre>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">P</strong>: loan amount after down payment</li>
            <li><strong className="text-foreground">r</strong>: monthly interest rate</li>
            <li><strong className="text-foreground">n</strong>: loan term in months</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to use this mortgage calculator</h2>
          <ol className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Select the currency closest to your market.</li>
            <li>Adjust the home price and down payment.</li>
            <li>Set the annual mortgage rate and loan term.</li>
            <li>Add annual property tax and insurance to estimate PITI.</li>
            <li>Review monthly payment, total interest, and amortization schedule.</li>
          </ol>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to lower your monthly mortgage payment</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Increase the down payment to reduce the financed amount.</li>
            <li>Choose a longer loan term to spread payments across more months.</li>
            <li>Compare lenders to find a lower rate.</li>
            <li>Consider extra principal payments later to reduce total interest.</li>
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
            href="/finance"
            className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
          >
            <h3 className="text-base font-semibold text-foreground">Browse finance tools</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              See the full calculator hub and move between finance utilities quickly.
            </p>
          </Link>
          <Link
            href="/tools"
            className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
          >
            <h3 className="text-base font-semibold text-foreground">Explore software tools</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Return to the main software directory for structured product discovery.
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
                This finance section is ready for more finance and conversion utilities.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
