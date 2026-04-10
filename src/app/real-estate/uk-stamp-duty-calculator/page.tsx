import type { Metadata } from "next";

import UKStampDutyCalculator from "@/app/real-estate/uk-stamp-duty-calculator/components/UKStampDutyCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/uk-stamp-duty-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Does this calculator use current UK stamp duty bands?",
    answer:
      "This page uses the current residential SDLT bands for England and Northern Ireland, including first-time buyer relief rules and the main residential surcharge options.",
  },
  {
    question: "Does this work for Scotland and Wales?",
    answer:
      "No. Scotland and Wales use different property transaction taxes, so they need separate calculators. This page is specifically for SDLT in England and Northern Ireland.",
  },
  {
    question: "How does first-time buyer relief work here?",
    answer:
      "The calculator applies first-time buyer relief when the purchase qualifies under the current residential SDLT rules. If the transaction does not qualify, it falls back to the standard residential bands.",
  },
  {
    question: "Can I include the higher rates for additional dwellings?",
    answer:
      "Yes. There is a specific option for the additional dwelling surcharge, and another one for the non-UK resident surcharge.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "UK Stamp Duty Calculator | England and Northern Ireland SDLT Calculator",
    description:
      "Calculate current residential SDLT for England and Northern Ireland, including first-time buyer relief and surcharge options.",
    path: PAGE_PATH,
  }),
  keywords: [
    "uk stamp duty calculator",
    "sdlt calculator",
    "england stamp duty calculator",
    "northern ireland sdlt calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "UK Stamp Duty Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
    },
    description:
      "Free England and Northern Ireland SDLT calculator with first-time buyer relief and surcharge options.",
  };
}

export default function UKStampDutyCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "UK Stamp Duty Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="UK Stamp Duty Calculator"
        description="Calculate current residential SDLT for England and Northern Ireland with first-time buyer relief and surcharge options."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Why this UK stamp duty page is jurisdiction-specific</h2>
            <p>
              Property transaction taxes in the UK are not one national rule. England and Northern Ireland use SDLT,
              while Scotland and Wales use separate systems. This page stays accurate by covering only the SDLT jurisdiction it is built for.
            </p>
            <h2>What this calculator is built to answer</h2>
            <p>
              It is designed for the common residential purchase question: how much SDLT applies once the current bands,
              first-time buyer relief, and surcharge options are taken into account.
            </p>
          </div>
        }
      >
        <UKStampDutyCalculator />
      </ToolPageScaffold>
    </>
  );
}
