import type { Metadata } from "next";

import StampDutyCalculator from "@/app/real-estate/stamp-duty-calculator/components/StampDutyCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/stamp-duty-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is stamp duty on property purchases?",
    answer:
      "Stamp duty is a transaction charge or transfer tax collected when a property is purchased in many markets. The exact rules vary a lot by country, city, buyer type, and sometimes property value bands.",
  },
  {
    question: "Why does this calculator ask for a custom duty rate?",
    answer:
      "Because there is no single global rule that fits every buyer. A custom rate lets you use the number that actually applies in your market or transaction instead of forcing a preset that may be wrong.",
  },
  {
    question: "Should legal fees and registration charges be included too?",
    answer:
      "Yes. Buyers usually need to budget for more than the duty itself. Legal work, registration, filing, and similar transaction fees can add a meaningful amount to the cash needed.",
  },
  {
    question: "Can I use this calculator outside the UK?",
    answer:
      "Yes. Even though the phrase stamp duty is common in some markets and transfer tax is more common in others, the estimate works anywhere you want to apply a property purchase charge as a percentage plus fixed fees.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Stamp Duty Calculator | Estimate Property Transfer Tax and Fees",
    description:
      "Estimate stamp duty, transfer tax, legal costs, and registration fees from a property purchase price and custom duty rate.",
    path: PAGE_PATH,
  }),
  keywords: [
    "stamp duty calculator",
    "property transfer tax calculator",
    "real estate stamp duty calculator",
    "property purchase fee calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Stamp Duty Calculator",
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
      "Free stamp duty calculator for property transfer tax, legal fees, and registration charges.",
  };
}

export default function StampDutyCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Stamp Duty Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Stamp Duty Calculator"
        description="Estimate stamp duty or property transfer tax with your own rate, then add legal and registration fees to see the fuller transaction cost."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Why transaction taxes catch buyers off guard</h2>
            <p>
              Buyers often focus on the property price and the down payment, then discover later that the transaction
              taxes and legal work add a meaningful extra layer to the cash requirement.
            </p>
            <h2>Why this page avoids pretending one preset fits every market</h2>
            <p>
              Property purchase charges are highly location-specific. Using a custom rate makes the calculator more
              flexible for the US, UK, Europe, Dubai, Singapore, Hong Kong, and other markets where the rules differ.
            </p>
            <h2>Use it as a planning calculator, then replace with the exact local numbers</h2>
            <p>
              Once you have a property and jurisdiction in view, swap the estimate for the exact fee schedule from the
              relevant professionals or government sources. This page is designed for early planning, not legal advice.
            </p>
          </div>
        }
      >
        <StampDutyCalculator />
      </ToolPageScaffold>
    </>
  );
}
