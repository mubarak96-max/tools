import type { Metadata } from "next";

import DubaiPropertyTransferFeeCalculator from "@/app/real-estate/dubai-property-transfer-fee-calculator/components/DubaiPropertyTransferFeeCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/dubai-property-transfer-fee-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is the main Dubai property transfer fee?",
    answer:
      "The main DLD transfer fee is 4% of the sale value. That is the headline fee most buyers and sellers refer to when budgeting a Dubai transfer.",
  },
  {
    question: "Are there fees on top of the 4% DLD transfer fee?",
    answer:
      "Yes. There are also registration trustee fees and other title-related charges that still affect the cash needed at transfer, even though the 4% fee is the largest component.",
  },
  {
    question: "Why does the trustee fee change at AED 500,000?",
    answer:
      "The registration trustee fee follows the published Dubai fee structure, which uses AED 2,100 below AED 500,000 and AED 4,200 from AED 500,000 upward.",
  },
  {
    question: "Does this calculator replace the final statement from the transfer office?",
    answer:
      "No. It is an estimate built from the published fee structure so you can plan early. The final payable amount should still be confirmed through the actual transaction process.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Dubai Property Transfer Fee Calculator | DLD Transfer Fee Calculator",
    description:
      "Estimate Dubai Land Department transfer fees, trustee fees, and title-related charges from the property sale price.",
    path: PAGE_PATH,
  }),
  keywords: [
    "dubai property transfer fee calculator",
    "dld transfer fee calculator",
    "dubai transfer fee calculator",
    "dubai property registration fee calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Dubai Property Transfer Fee Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "AED",
    },
    description:
      "Free Dubai property transfer fee calculator for DLD transfer fees, trustee fees, and title-related charges.",
  };
}

export default function DubaiPropertyTransferFeeCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Dubai Property Transfer Fee Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Dubai Property Transfer Fee Calculator"
        description="Estimate Dubai Land Department transfer fees, trustee fees, and title-related charges from the sale price."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Why Dubai transfer fees deserve their own calculator</h2>
            <p>
              Dubai property transactions are often discussed around the 4% DLD fee, but the registration trustee fee
              and the other smaller title-related charges still affect the real transfer cash requirement.
            </p>
            <h2>What this page is meant to solve</h2>
            <p>
              It gives buyers, sellers, and brokers a cleaner pre-transfer estimate based on the published fee structure
              instead of relying only on the headline percentage.
            </p>
          </div>
        }
      >
        <DubaiPropertyTransferFeeCalculator />
      </ToolPageScaffold>
    </>
  );
}
