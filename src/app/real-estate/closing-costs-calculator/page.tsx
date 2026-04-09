import type { Metadata } from "next";

import ClosingCostsCalculator from "@/app/real-estate/closing-costs-calculator/components/ClosingCostsCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/closing-costs-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What are closing costs when buying a home?",
    answer:
      "Closing costs are the extra transaction fees paid around the purchase itself. They often include lender charges, legal fees, inspections, appraisal, taxes, registration, insurance, and other costs needed to complete the deal.",
  },
  {
    question: "Are closing costs included in the down payment?",
    answer:
      "Usually not. The down payment is the upfront portion of the property's price. Closing costs are additional charges on top of that, which is why total cash needed is often higher than buyers first expect.",
  },
  {
    question: "How much should I budget for closing costs?",
    answer:
      "Many buyers start with a percentage estimate, then add any known fixed fees on top. The exact number depends on the country, lender, local taxes, legal costs, and the type of property being purchased.",
  },
  {
    question: "Can closing costs be financed into the loan?",
    answer:
      "Sometimes, but it depends on the lender and the market. Even where that is possible, buyers often still need part of the cost in cash. This page is designed for upfront planning rather than lender-specific structuring.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Closing Costs Calculator | Estimate Total Cash Needed to Buy",
    description:
      "Estimate closing costs and the total cash needed to buy property from the purchase price, down payment, and extra fees.",
    path: PAGE_PATH,
  }),
  keywords: [
    "closing costs calculator",
    "home buying closing costs calculator",
    "cash needed to close calculator",
    "real estate closing cost calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Closing Costs Calculator",
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
      "Free closing costs calculator for estimating fees and total cash needed when buying property.",
  };
}

export default function ClosingCostsCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Closing Costs Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Closing Costs Calculator"
        description="Estimate closing fees and total cash needed before buying a property, instead of planning around the down payment alone."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>The cash gap buyers miss most often</h2>
            <p>
              It is common to save for the down payment and still feel underprepared once lender fees, taxes, legal
              costs, inspections, and registration charges start stacking up. This is the gap closing-cost planning is meant to catch.
            </p>
            <h2>Why a percentage estimate is still useful early on</h2>
            <p>
              Before a lender or conveyancer gives you exact figures, a blended percentage estimate is often the fastest
              way to stress-test whether the purchase is realistic for your cash position.
            </p>
            <h2>Replace this estimate with deal-specific numbers later</h2>
            <p>
              Once you are serious about a property, switch from generic assumptions to the actual fee schedule from the
              parties handling the transaction. That is where the planning number becomes a real closing budget.
            </p>
          </div>
        }
      >
        <ClosingCostsCalculator />
      </ToolPageScaffold>
    </>
  );
}
