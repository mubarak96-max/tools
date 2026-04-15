import Link from "next/link";
import type { Metadata } from "next";

import EMICalculator from "@/app/finance/emi-calculator/components/EMICalculator";
import JsonLd from "@/components/seo/JsonLd";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  serializeJsonLd,
} from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/emi-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is EMI?",
    answer:
      "EMI stands for Equated Monthly Instalment. It is the fixed monthly loan payment that covers both principal and interest until the loan is fully repaid.",
  },
  {
    question: "How is EMI calculated?",
    answer:
      "EMI is calculated from three core inputs: loan amount, monthly interest rate, and total number of months. This page uses the standard amortizing loan formula to estimate repayments.",
  },
  {
    question: "What is a good EMI relative to income?",
    answer:
      "A common planning guideline is to keep the loan payment near 20% to 25% of monthly income, with total monthly debt often staying below roughly 40%. Actual lender rules vary by country, lender, and credit profile.",
  },
  {
    question: "How can I reduce my EMI?",
    answer:
      "You can reduce EMI by lowering the loan amount, increasing the tenure, negotiating a lower interest rate, or making a larger down payment when the loan type allows it.",
  },
  {
    question: "Why does a longer tenure lower EMI but increase total interest?",
    answer:
      "A longer term spreads the balance across more months, so each payment gets smaller. The tradeoff is that interest keeps accruing for longer, which usually increases the total repayment amount.",
  },
  {
    question: "Can this EMI calculator tell me the exact offer from a bank?",
    answer:
      "No. This tool provides planning estimates only. Lenders may apply different rates, fees, insurance, processing charges, and eligibility rules when issuing a real loan offer.",
  },
];

export const metadata: Metadata = {
  title: "EMI Calculator | Loan EMI, Total Interest, Affordability, and Repayment",
  description:
    "Use this free EMI calculator to estimate monthly loan payments, total interest, total repayment, affordability, and maximum loan size for home, car, and personal loans.",
  keywords: [
    "EMI calculator",
    "loan EMI calculator",
    "monthly loan payment calculator",
    "home loan EMI calculator",
    "car loan EMI calculator",
    "personal loan EMI calculator",
    "EMI calculator UAE",
    "loan calculator Dubai",
    "how EMI is calculated",
    "what EMI can I afford",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "EMI Calculator With Affordability and Total Interest",
    description:
      "Calculate EMI, compare repayment burden, estimate total interest, and understand what loan size may fit your budget.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EMI Calculator",
    description:
      "Estimate monthly EMI, total repayment, affordability, and a rough maximum loan amount.",
  },
};

function buildEmiApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
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
      "Free EMI calculator for home, car, and personal loans with affordability guidance, total interest, and amortization schedule.",
    featureList: [
      "Monthly EMI calculation",
      "Total interest and repayment estimate",
      "Affordability signal based on income and debts",
      "Estimated maximum affordable loan",
      "Amortization schedule",
      "Multi-currency support",
    ],
  };
}

export default function EMICalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "EMI Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildEmiApplicationJsonLd())} />
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
            <li className="text-foreground">EMI Calculator</li>
          </ol>
        </nav>

        <div className="max-w-4xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Loan planning tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            EMI Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            EMI is the fixed monthly payment used to repay a loan over time. This calculator goes
            beyond the basic number by showing total interest, total repayment, affordability
            signals, and a rough estimate of the loan size your budget can support.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Results are estimates only and do not include lender-specific fees, insurance,
            processing charges, or approval criteria.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <EMICalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is EMI?</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              EMI stands for Equated Monthly Instalment. It is the recurring monthly payment used to
              repay a loan. Every EMI includes two parts: one reduces the principal balance and the
              other covers interest charged by the lender.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              That means a low EMI does not always mean a cheap loan. A longer tenure usually lowers
              the monthly payment but can push total interest much higher over the full repayment period.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              How EMI is calculated
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Standard EMI calculations use three variables only: loan amount, monthly interest rate,
              and total number of monthly payments.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-[1rem] border border-border bg-background p-4 text-sm text-foreground">
              <code>EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)</code>
            </pre>
            <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
              <li>
                <strong className="text-foreground">P</strong>: loan amount
              </li>
              <li>
                <strong className="text-foreground">r</strong>: monthly interest rate
              </li>
              <li>
                <strong className="text-foreground">n</strong>: total number of months
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              What affects your EMI most?
            </h2>
            <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
              <li>Higher loan amounts increase EMI because you are financing more principal.</li>
              <li>Higher interest rates increase both EMI and the total cost of borrowing.</li>
              <li>Longer tenure lowers EMI but usually increases total interest paid.</li>
              <li>Larger down payments reduce the financed balance and can improve affordability.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              EMI and affordability
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The monthly EMI should be interpreted against income, not viewed in isolation. A common
              planning rule is to keep the loan payment near 20% to 25% of monthly income, while total
              monthly debt often stays below roughly 40%.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              That is why this page also estimates a rough maximum affordable loan based on your income,
              other debts, chosen interest rate, and tenure. It is a planning shortcut, not underwriting.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              How to reduce EMI
            </h2>
            <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
              <li>Borrow less by increasing the down payment or choosing a lower-cost asset.</li>
              <li>Negotiate a lower interest rate before signing the loan agreement.</li>
              <li>Stretch the tenure only if the interest tradeoff still makes financial sense.</li>
              <li>Use prepayments carefully to reduce outstanding principal faster when allowed.</li>
            </ul>
          </div>
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

      <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath={PAGE_PATH} />
    </div>
  );
}
