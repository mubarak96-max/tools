import Link from "next/link";
import type { Metadata } from "next";

import CreditCardPayoffCalculator from "@/app/finance/credit-card-payoff-calculator/components/CreditCardPayoffCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/credit-card-payoff-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What does the 36-month payment mean?",
    answer:
      "CFPB rules require card issuers to show how much a consumer would need to pay each month to repay the current statement balance in 36 months, assuming no new purchases. This page mirrors that planning idea with a single-APR payoff model.",
  },
  {
    question: "Why does this calculator ask for my payment instead of estimating the minimum payment?",
    answer:
      "Minimum payment formulas vary by issuer, so using the actual payment from your statement is more defensible than pretending there is one universal minimum-payment rule.",
  },
  {
    question: "Why might my statement payoff differ from this result?",
    answer:
      "CFPB explains that many issuers calculate interest daily using the average daily balance. This page uses a fixed monthly APR model, so it is a planning estimate rather than a statement replica.",
  },
  {
    question: "Does this assume I stop using the card?",
    answer:
      "Yes. CFPB repayment disclosures are based on the current balance and do not take future purchases into account. This calculator follows the same no-new-purchases assumption.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Credit Card Payoff Calculator | Payoff Time and Interest Calculator",
    description:
      "Estimate credit card payoff time, total interest, and the payment needed to clear a balance in 36 months under a fixed-APR payment plan.",
    path: PAGE_PATH,
  }),
  keywords: [
    "credit card payoff calculator",
    "credit card interest calculator",
    "pay off credit card calculator",
    "36 month credit card payment calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Credit Card Payoff Calculator",
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
      "Free credit card payoff calculator for payoff time, total interest, and a 36-month target payment estimate.",
    featureList: [
      "Payoff time estimate",
      "Total interest estimate",
      "36-month target payment",
      "Month-by-month payoff schedule",
    ],
  };
}

export default function CreditCardPayoffCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Credit Card Payoff Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">Credit Card Payoff Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Finance calculator
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Credit Card Payoff Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Estimate how long it will take to pay off a credit card balance, how much interest you may pay, and what fixed monthly payment would clear the balance in 36 months.
          </p>
        </div>
      </section>

      <CreditCardPayoffCalculator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What this page is based on</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            CFPB says card issuers are required to tell consumers how long it will take to repay the current balance if they make no further charges and pay only the minimum, and also how much they would need to pay each month to repay the current balance in 36 months. This page uses that same no-new-purchases planning frame.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Official references checked on April 10, 2026: <a href="https://www.consumerfinance.gov/ask-cfpb/a-box-on-my-credit-card-bill-says-that-i-will-pay-off-the-balance-in-three-years-if-i-pay-a-certain-amount-what-does-that-mean-do-i-have-to-pay-that-much-if-i-pay-that-much-and-make-new-purchases-will-i-still-owe-nothing-after-three-years-en-36/" target="_blank" rel="noopener noreferrer">CFPB 36-month repayment disclosure explainer</a>, <a href="https://www.consumerfinance.gov/ask-cfpb/how-does-my-credit-card-company-calculate-the-amount-of-interest-i-owe-en-51/" target="_blank" rel="noopener noreferrer">CFPB credit card interest explainer</a>, and <a href="https://www.consumerfinance.gov/rules-policy/regulations/1026/7" target="_blank" rel="noopener noreferrer">CFPB Regulation Z repayment disclosures</a>.
          </p>
          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">What this calculator does not do</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            It does not reproduce an issuer's exact statement engine. Different cards can have promotional rates, separate APR buckets, fees, and daily-balance interest methods. This page keeps one APR, one balance, and one recurring payment so the estimate stays understandable and defensible.
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
