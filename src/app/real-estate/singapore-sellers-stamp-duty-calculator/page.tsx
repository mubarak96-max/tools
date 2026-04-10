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
    "singapore ssd calculator",
    "singapore seller duty calculator",
    "singapore property ssd calculator",
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
            <h2>Why Singapore seller duty needs its own calculator</h2>
            <p>
              Seller duty in Singapore is not just a simple resale tax. The applicable rate depends on how long the
              property was held and which published regime applies based on the acquisition date, so a dedicated page is
              much more reliable than a flat-rate shortcut.
            </p>
            <h2>How this page is best used</h2>
            <p>
              It is most useful when you are testing exit timing, comparing disposal scenarios, or sanity-checking the
              effect of the post-4 July 2025 rules before a property is sold.
            </p>
          </div>
        }
      >
        <SingaporeSellersStampDutyCalculator />
      </ToolPageScaffold>
    </>
  );
}
