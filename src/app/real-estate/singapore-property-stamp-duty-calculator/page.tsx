import type { Metadata } from "next";

import SingaporePropertyStampDutyCalculator from "@/app/real-estate/singapore-property-stamp-duty-calculator/components/SingaporePropertyStampDutyCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/singapore-property-stamp-duty-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Does this calculator include BSD and ABSD?",
    answer:
      "Yes. It estimates Buyer's Stamp Duty and Additional Buyer's Stamp Duty using the current residential BSD bands and current buyer-profile ABSD rates.",
  },
  {
    question: "Why does this page also ask about SSD?",
    answer:
      "Seller's Stamp Duty depends on how long the property is held before sale. Including it helps you test the later exit cost under the relevant recent SSD regime.",
  },
  {
    question: "Does the buyer profile matter for ABSD?",
    answer:
      "Yes. ABSD varies sharply by buyer profile, including whether the buyer is a Singapore citizen, permanent resident, foreigner, or entity, and by the residential property count in the profile.",
  },
  {
    question: "Is this only for residential property?",
    answer:
      "Yes. This page is focused on residential property stamp duties because those are the rates and buyer profiles most often searched and compared.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Singapore Property Stamp Duty Calculator | BSD, ABSD, and SSD Calculator",
    description:
      "Calculate Singapore residential BSD, ABSD, and SSD using current buyer profiles and recent seller-duty regimes.",
    path: PAGE_PATH,
  }),
  keywords: [
    "singapore property stamp duty calculator",
    "bsd absd calculator singapore",
    "singapore absd calculator",
    "singapore stamp duty calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Singapore Property Stamp Duty Calculator",
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
      "Free Singapore residential property stamp duty calculator for BSD, ABSD, and SSD.",
  };
}

export default function SingaporePropertyStampDutyCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Singapore Property Stamp Duty Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Singapore Property Stamp Duty Calculator"
        description="Calculate Singapore residential BSD, ABSD, and SSD using current buyer profiles and recent seller-duty regimes."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Why Singapore property stamp duty needs a dedicated calculator</h2>
            <p>
              Singapore residential property duties are not a single flat charge. BSD is progressive, ABSD depends on the
              buyer profile, and SSD depends on the holding period and the acquisition-date regime.
            </p>
            <h2>What this page covers better than a generic property tax estimate</h2>
            <p>
              It reflects the actual structure of Singapore residential duties instead of collapsing them into one broad
              percentage. That makes it much more useful for real purchase planning.
            </p>
          </div>
        }
      >
        <SingaporePropertyStampDutyCalculator />
      </ToolPageScaffold>
    </>
  );
}
