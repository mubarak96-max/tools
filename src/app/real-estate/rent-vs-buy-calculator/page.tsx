import type { Metadata } from "next";

import RentVsBuyCalculator from "@/app/real-estate/rent-vs-buy-calculator/components/RentVsBuyCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/rent-vs-buy-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Is it cheaper to rent or buy?",
    answer:
      "It depends on how long you expect to stay, the size of the down payment, your monthly mortgage, the non-mortgage ownership costs, and the rent you would otherwise pay. A short stay can often favour renting, while a longer stay may justify buying.",
  },
  {
    question: "What costs should be included when comparing rent and buy?",
    answer:
      "For a simple first comparison, include the down payment, monthly mortgage, and monthly ownership costs on the buy side, then compare them against the monthly rent over the same time period.",
  },
  {
    question: "Does this calculator include home appreciation?",
    answer:
      "No. This version is a straightforward cost comparison. It does not model price appreciation, rent increases, resale proceeds, or the investment return you could earn on the down payment.",
  },
  {
    question: "Why does the number of years matter so much?",
    answer:
      "The longer you stay, the more the upfront cost of buying can be spread across time. Short stays often make the upfront cash and monthly ownership costs harder to justify.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Rent vs Buy Calculator | Compare the Cost of Renting and Buying",
    description:
      "Compare rent cost and buy cost over the years you expect to stay in a property.",
    path: PAGE_PATH,
  }),
  keywords: [
    "rent vs buy calculator",
    "should i rent or buy calculator",
    "buying vs renting calculator",
    "rent versus buy calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Rent vs Buy Calculator",
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
      "Free rent vs buy calculator for comparing rent and ownership costs over the years you expect to stay in the property.",
  };
}

export default function RentVsBuyCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Rent vs Buy Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Rent vs Buy Calculator"
        description="Compare the cost of renting and buying across the years you expect to stay in the property."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>The rent-vs-buy question is really a time-horizon question</h2>
            <p>
              The biggest driver is often not the property itself. It is how long you expect to stay. The shorter the
              stay, the harder it usually is for buying costs to justify themselves.
            </p>
            <h2>Why this calculator keeps the model simple</h2>
            <p>
              Many people want a quick answer before they build a full spreadsheet. This page focuses on the main cash
              outflows so you can see the cost gap fast, then decide whether a deeper model is worth your time.
            </p>
            <h2>Use the result as a first screen, not a final life decision</h2>
            <p>
              Lifestyle, flexibility, family plans, job stability, and local housing risk all matter alongside the
              numbers. This calculator is here to clarify the financial side, not replace the rest of the decision.
            </p>
          </div>
        }
      >
        <RentVsBuyCalculator />
      </ToolPageScaffold>
    </>
  );
}
