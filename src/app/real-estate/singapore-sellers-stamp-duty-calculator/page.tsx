import type { Metadata } from "next";

import SingaporeSellersStampDutyCalculator from "@/app/real-estate/singapore-sellers-stamp-duty-calculator/components/SingaporeSellersStampDutyCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/singapore-sellers-stamp-duty-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What does this Singapore seller's stamp duty calculator estimate?",
    answer:
      "It estimates residential Seller's Stamp Duty based on the sale price or market value, acquisition date, disposal date, and the published SSD regime that applies to that acquisition period.",
  },
  {
    question: "Why do the acquisition date and disposal date both matter?",
    answer:
      "Singapore SSD depends on both the holding period and the regime triggered by when the property was acquired. That is why the calculator needs both dates instead of using only a sale price.",
  },
  {
    question: "Does this page use the post-4 July 2025 SSD rules?",
    answer:
      "Yes. It distinguishes between the 11 March 2017 to 3 July 2025 regime and the regime for acquisitions on or after 4 July 2025.",
  },
  {
    question: "Can this replace formal tax or conveyancing advice?",
    answer:
      "No. It is a planning tool for working out the likely duty exposure early. The final SSD treatment should still be confirmed as part of the live transaction.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Singapore Seller's Stamp Duty Calculator | Residential SSD Calculator",
    description:
      "Estimate Singapore residential Seller's Stamp Duty using the acquisition date, disposal date, and current SSD regime.",
    path: PAGE_PATH,
  }),
  keywords: [
    "singapore sellers stamp duty calculator",
    "singapore SSD calculator",
    "singapore property seller duty",
    "SSD holding period calculator",
    "singapore residential stamp duty",
    "singapore property tax calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Singapore Seller's Stamp Duty Calculator",
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
      "Free Singapore residential Seller's Stamp Duty calculator for current SSD regimes and holding periods.",
  };
}

export default function SingaporeSellersStampDutyCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Singapore Seller's Stamp Duty Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Singapore Seller's Stamp Duty Calculator"
        description="Estimate Singapore residential Seller's Stamp Duty using the acquisition date, disposal date, and current SSD regime."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Understanding Singapore Seller&apos;s Stamp Duty</h2>
            <p>
              Singapore&apos;s Seller&apos;s Stamp Duty (SSD) is a tax imposed on residential property sellers who dispose of their property within a specified holding period. It was introduced in 2010 as a cooling measure to discourage short-term speculative buying and has been revised several times since.
            </p>
            <p>
              The SSD rate is tiered based on the holding period — the shorter the hold, the higher the rate. Properties held for longer periods attract lower rates, and properties held beyond the maximum holding period are exempt entirely. The applicable regime depends on when the property was acquired, not when it is sold.
            </p>

            <h2>The two SSD regimes</h2>
            <p>
              Properties acquired between 11 March 2017 and 3 July 2025 fall under one regime, while properties acquired on or after 4 July 2025 fall under a revised regime. This calculator distinguishes between both based on your acquisition date, ensuring the correct rates are applied.
            </p>
            <p>
              Under the 2017–2025 regime, SSD applies to properties sold within 3 years of acquisition. Under the post-July 2025 regime, the holding period and rate structure may differ. Always verify the current rates with IRAS (Inland Revenue Authority of Singapore) or your conveyancing solicitor before completing a transaction.
            </p>

            <h2>How SSD is calculated</h2>
            <p>
              SSD is calculated on the higher of the sale price or the market value of the property at the time of disposal. The applicable rate is determined by the holding period — the time between the acquisition date and the disposal date. The calculator uses both dates to determine the exact holding period and applies the correct rate from the applicable regime.
            </p>
            <p>
              SSD is payable within 14 days of the date of execution of the sale and purchase agreement (or transfer document if there is no agreement). Late payment attracts penalties. SSD is a seller&apos;s liability and cannot be passed to the buyer.
            </p>

            <h2>When SSD does not apply</h2>
            <p>
              SSD does not apply to industrial and commercial properties, HDB flats (which have their own Minimum Occupation Period rules), properties acquired through inheritance, and properties disposed of after the maximum holding period. Certain other exemptions may apply — consult IRAS guidelines for the full list.
            </p>

            <h2>Using this calculator for exit planning</h2>
            <p>
              This tool is most useful when evaluating the financial impact of different disposal timelines. By adjusting the disposal date, you can see how waiting an additional month or year affects your SSD liability. This is particularly valuable when the holding period is close to a rate threshold — a small delay in disposal can sometimes save a significant amount in duty.
            </p>
          </div>
        }
      >
        <SingaporeSellersStampDutyCalculator />
      </ToolPageScaffold>
    </>
  );
}
