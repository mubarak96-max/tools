import type { Metadata } from "next";

import CapRateCalculator from "@/app/real-estate/cap-rate-calculator/components/CapRateCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/cap-rate-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is cap rate in real estate?",
    answer:
      "Cap rate is the property's net operating income divided by its value or purchase price. It is a quick way to compare the income performance of one property against another before financing is considered.",
  },
  {
    question: "What expenses belong in NOI?",
    answer:
      "NOI usually includes recurring operating costs such as maintenance, management, insurance, taxes, vacancy allowance, and similar costs. Mortgage payments are normally excluded because cap rate is meant to be financing-neutral.",
  },
  {
    question: "Is cap rate the same as ROI?",
    answer:
      "No. Cap rate focuses on the property's income relative to value. ROI is broader and can include financing, appreciation, sale proceeds, and the total cash you invested in the deal.",
  },
  {
    question: "Should I use purchase price or current market value?",
    answer:
      "Either can be useful, depending on the decision you are making. Purchase price is common when analysing a new deal. Current market value can be more useful when reviewing an existing property in your portfolio.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Cap Rate Calculator | Calculate NOI and Property Cap Rate",
    description:
      "Calculate cap rate and net operating income from property value, annual rent, and yearly operating expenses.",
    path: PAGE_PATH,
  }),
  keywords: [
    "cap rate calculator",
    "noi calculator",
    "property cap rate calculator",
    "real estate cap rate calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Cap Rate Calculator",
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
      "Free cap rate calculator for net operating income and capitalization rate based on property value, rent, and operating expenses.",
  };
}

export default function CapRateCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Cap Rate Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Cap Rate Calculator"
        description="Calculate capitalization rate and net operating income from property value, annual rent, and annual operating expenses."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Why cap rate is still one of the first numbers investors check</h2>
            <p>
              Cap rate helps you compare properties quickly without getting tied up in the buyer&apos;s personal financing
              structure. That makes it one of the fastest ways to benchmark income properties across a shortlist.
            </p>
            <h2>What this calculator is designed to answer</h2>
            <p>
              This page is built for the question, &quot;How strong is the property&apos;s income relative to its value?&quot; It is
              not trying to replace a full deal model. It is meant to give you a clean first-pass answer.
            </p>
            <h2>Where cap rate can mislead you</h2>
            <p>
              A high cap rate can sometimes reflect more risk rather than a better deal. Weak tenant quality, higher
              turnover, deferred maintenance, or location issues can all push the number up.
            </p>
          </div>
        }
      >
        <CapRateCalculator />
      </ToolPageScaffold>
    </>
  );
}
