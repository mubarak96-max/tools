import type { Metadata } from "next";

import ScotlandLbttCalculator from "@/app/real-estate/scotland-lbtt-calculator/components/ScotlandLbttCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/scotland-lbtt-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Does this calculator use Scotland's current LBTT bands?",
    answer:
      "Yes. It is built for the current Scottish residential LBTT bands, including the wider nil-rate band for qualifying first-time buyers.",
  },
  {
    question: "Does this include the Additional Dwelling Supplement?",
    answer:
      "Yes. If the transaction is an additional dwelling purchase, the calculator adds the current Additional Dwelling Supplement on top of the main LBTT amount.",
  },
  {
    question: "Is this the same as UK stamp duty?",
    answer:
      "No. Scotland uses Land and Buildings Transaction Tax instead of SDLT, so the bands and surcharges are not the same as England and Northern Ireland.",
  },
  {
    question: "Should I still confirm the figure with my solicitor?",
    answer:
      "Yes. This page is meant to help with early budgeting and scenario planning. Your solicitor or conveyancer should confirm the final tax position for the actual transaction.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Scotland LBTT Calculator | Scottish Land and Buildings Transaction Tax",
    description:
      "Calculate Scottish residential LBTT with current bands, first-time buyer relief, and the Additional Dwelling Supplement.",
    path: PAGE_PATH,
  }),
  keywords: [
    "scotland lbtt calculator",
    "lbtt calculator scotland",
    "scottish stamp duty calculator",
    "additional dwelling supplement calculator scotland",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Scotland LBTT Calculator",
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
      "Free Scotland LBTT calculator with current residential bands, first-time buyer relief, and the Additional Dwelling Supplement.",
  };
}

export default function ScotlandLbttCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Scotland LBTT Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Scotland LBTT Calculator"
        description="Calculate Scottish residential LBTT with current bands, first-time buyer relief, and the Additional Dwelling Supplement."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Why Scottish property tax needs its own calculator</h2>
            <p>
              Scotland does not use the SDLT system that applies in England and Northern Ireland. It uses Land and
              Buildings Transaction Tax, and that means the residential thresholds, first-time buyer relief, and extra-home
              surcharge rules need to be calculated separately.
            </p>
            <h2>What this page helps you plan</h2>
            <p>
              It gives you a realistic starting point when comparing purchase scenarios in Scotland, especially if you
              want to see the difference between a standard purchase, a qualifying first-time buyer purchase, and an
              additional dwelling purchase.
            </p>
          </div>
        }
      >
        <ScotlandLbttCalculator />
      </ToolPageScaffold>
    </>
  );
}
