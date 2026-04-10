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
    "singapore bsd calculator",
    "singapore absd calculator",
    "singapore buyer duty calculator",
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
            <h2>Why Singapore buyer duty works best as its own page</h2>
            <p>
              Buyer duty in Singapore is not one number. The BSD scale is progressive, while ABSD changes by residency
              profile and by residential property count. That is exactly the kind of structure that deserves a dedicated
              page instead of a flat percentage shortcut.
            </p>
            <h2>What this tool helps you compare</h2>
            <p>
              It is useful when you want to compare how the same purchase price lands for a citizen, a permanent resident,
              a foreign buyer, or an entity. That makes the page practical for early acquisition planning and scenario work.
            </p>
          </div>
        }
      >
        <SingaporeBuyersStampDutyCalculator />
      </ToolPageScaffold>
    </>
  );
}
