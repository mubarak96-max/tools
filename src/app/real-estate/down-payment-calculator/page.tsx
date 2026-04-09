import type { Metadata } from "next";

import DownPaymentCalculator from "@/app/real-estate/down-payment-calculator/components/DownPaymentCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/down-payment-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How much down payment do I need to buy a house?",
    answer:
      "It depends on the loan type, the country, and the lender. Some buyers put down a smaller percentage to get into the market sooner, while others use a larger down payment to reduce the loan amount and lower monthly payments.",
  },
  {
    question: "What does loan-to-value mean?",
    answer:
      "Loan-to-value, or LTV, shows how much of the property is being financed relative to its price. If the loan covers 80% of the purchase price, the LTV is 80%. Lower LTV usually means less lender risk.",
  },
  {
    question: "Does a larger down payment always make the deal better?",
    answer:
      "Not always. A larger deposit lowers the loan and monthly payment, but it also ties up more cash. The best answer depends on your reserves, emergency fund, and how you want to balance monthly affordability against liquidity.",
  },
  {
    question: "Is this calculator only for first-time buyers?",
    answer:
      "No. It works for any home buyer who wants to turn a percentage target into a real cash amount and see how much financing would still be needed.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Down Payment Calculator | Home Deposit and Loan-to-Value Calculator",
    description:
      "Calculate down payment amount, loan amount, and loan-to-value from a home price and deposit percentage.",
    path: PAGE_PATH,
  }),
  keywords: [
    "down payment calculator",
    "home down payment calculator",
    "loan to value calculator",
    "house deposit calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Down Payment Calculator",
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
      "Free down payment calculator for home price, deposit amount, loan amount, and loan-to-value.",
  };
}

export default function DownPaymentCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Down Payment Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Down Payment Calculator"
        description="Turn a deposit percentage into a real cash amount, loan amount, and loan-to-value ratio before you talk to a lender."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Why buyers start with the percentage but feel the cash amount</h2>
            <p>
              Listings, lenders, and advice articles often talk in percentages, but the real pressure lands on the cash
              amount you need to put together. This page helps bridge that gap.
            </p>
            <h2>What a lower loan-to-value can change</h2>
            <p>
              A lower LTV can improve how a lender sees the deal, reduce the loan size, and make the monthly payment
              more manageable. It is one of the first ratios many borrowers look at.
            </p>
            <h2>Use the result as part of a wider cash plan</h2>
            <p>
              The deposit is only one part of the upfront cost. It still makes sense to pair it with closing costs,
              moving costs, and an emergency buffer before calling the budget finished.
            </p>
          </div>
        }
      >
        <DownPaymentCalculator />
      </ToolPageScaffold>
    </>
  );
}
