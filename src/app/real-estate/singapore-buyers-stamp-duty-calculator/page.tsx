import type { Metadata } from "next";

import SingaporeBuyersStampDutyCalculator from "@/app/real-estate/singapore-buyers-stamp-duty-calculator/components/SingaporeBuyersStampDutyCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/singapore-buyers-stamp-duty-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Does this page include both BSD and ABSD?",
    answer:
      "Yes. It estimates the normal progressive Buyer's Stamp Duty and then adds Additional Buyer's Stamp Duty based on the current residential buyer profile you select.",
  },
  {
    question: "Why does the buyer profile matter so much in Singapore?",
    answer:
      "Because the ABSD rate depends on residency status and how many residential properties the profile already holds. That is why the total duty can change sharply between profiles even at the same purchase price.",
  },
  {
    question: "Is this only for residential purchases?",
    answer:
      "Yes. This page is deliberately focused on residential buyer duty because that is where the BSD and ABSD structure is most important for budgeting.",
  },
  {
    question: "Should I still confirm the duty with my conveyancing team?",
    answer:
      "Yes. Use this for planning and comparison, then confirm the final duty treatment with the professionals handling the actual transaction.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Singapore Buyer's Stamp Duty Calculator | BSD and ABSD Calculator",
    description:
      "Calculate Singapore residential BSD and ABSD using the current buyer profile and property ownership rules.",
    path: PAGE_PATH,
  }),
  keywords: [
    "singapore buyers stamp duty calculator",
    "singapore BSD calculator",
    "singapore ABSD calculator",
    "singapore property buyer duty",
    "additional buyers stamp duty calculator",
    "singapore residential property tax",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Singapore Buyer's Stamp Duty Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "SGD",
    },
    description:
      "Free Singapore residential buyer's stamp duty calculator for BSD and ABSD.",
  };
}

export default function SingaporeBuyersStampDutyCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Singapore Buyer's Stamp Duty Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Singapore Buyer's Stamp Duty Calculator"
        description="Calculate Singapore residential BSD and ABSD using the current buyer profile and property ownership rules."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Understanding Singapore Buyer&apos;s Stamp Duty (BSD)</h2>
            <p>
              Buyer&apos;s Stamp Duty is a tax payable on the purchase of property in Singapore. It applies to all property purchases — residential, commercial, and industrial — and is calculated on the higher of the purchase price or the market value of the property. BSD is a progressive tax, meaning higher-value properties attract higher rates on the portion above each threshold.
            </p>
            <p>
              For residential properties, the BSD rates are: 1% on the first S$180,000, 2% on the next S$180,000, 3% on the next S$640,000, 4% on the next S$500,000, 5% on the next S$1,500,000, and 6% on the remainder above S$3,000,000. These rates were revised in February 2023 to add the higher tiers for luxury properties.
            </p>

            <h2>Additional Buyer&apos;s Stamp Duty (ABSD)</h2>
            <p>
              ABSD is an additional tax layered on top of BSD for residential property purchases. It was introduced in 2011 as a cooling measure and has been revised multiple times. The ABSD rate depends on the buyer&apos;s residency status and the number of residential properties they already own.
            </p>
            <p>
              Singapore Citizens purchasing their first residential property pay 0% ABSD. Their second property attracts 20% ABSD, and subsequent properties attract 30%. Singapore Permanent Residents pay 5% on their first property and 30% on subsequent properties. Foreigners pay 60% ABSD on any residential property purchase. Entities (companies and trusts) pay 65% ABSD.
            </p>

            <h2>Why the buyer profile matters so much</h2>
            <p>
              The ABSD rate can change the total stamp duty dramatically. A Singapore Citizen buying a S$2 million property as their first home pays BSD only (approximately S$54,600). The same buyer purchasing a second property pays BSD plus 20% ABSD (S$400,000 additional), bringing total duty to over S$454,000. A foreign buyer pays BSD plus 60% ABSD — over S$1.2 million in total duty on the same property.
            </p>
            <p>
              This is why selecting the correct buyer profile in this calculator is critical. The difference between profiles can be hundreds of thousands of dollars, making it essential to understand your ABSD position before committing to a purchase.
            </p>

            <h2>BSD and ABSD payment timeline</h2>
            <p>
              BSD must be paid within 14 days of signing the Sale and Purchase Agreement (or within 30 days if the document is signed overseas). ABSD must be paid within the same timeframe. Both are typically handled by your conveyancing solicitor as part of the transaction process. Late payment attracts penalties of up to 4 times the unpaid duty.
            </p>
          </div>
        }
      >
        <SingaporeBuyersStampDutyCalculator />
      </ToolPageScaffold>
    </>
  );
}
