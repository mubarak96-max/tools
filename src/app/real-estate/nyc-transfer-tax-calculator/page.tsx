import type { Metadata } from "next";

import NYCTransferTaxCalculator from "@/app/real-estate/nyc-transfer-tax-calculator/components/NYCTransferTaxCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/nyc-transfer-tax-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is NYC transfer tax?",
    answer:
      "This page estimates New York City's Real Property Transfer Tax, which is charged on transfers of real property in New York City and uses different rates depending on the property type and transfer-price threshold.",
  },
  {
    question: "Does this cover New York State transfer tax too?",
    answer:
      "No. This page is focused on the NYC transfer tax only. State-level charges and other closing costs should be estimated separately.",
  },
  {
    question: "Why does the property type change the rate?",
    answer:
      "Because NYC applies different transfer-tax rates to residential one-to-three family homes and to other property types, and the threshold structure also matters.",
  },
  {
    question: "Is this useful for condos and co-ops?",
    answer:
      "It is most directly useful for transfers where the NYC Real Property Transfer Tax structure applies as entered. Buyers should still confirm exact tax treatment with the professionals handling the transaction.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "NYC Transfer Tax Calculator | New York City Property Transfer Tax Calculator",
    description:
      "Estimate New York City Real Property Transfer Tax from the transfer price and property type.",
    path: PAGE_PATH,
  }),
  keywords: [
    "nyc transfer tax calculator",
    "new york city transfer tax calculator",
    "nyc real property transfer tax calculator",
    "new york property transfer tax calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "NYC Transfer Tax Calculator",
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
      "Free NYC Real Property Transfer Tax calculator based on current transfer-price thresholds and property type.",
  };
}

export default function NYCTransferTaxCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "NYC Transfer Tax Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="NYC Transfer Tax Calculator"
        description="Estimate New York City Real Property Transfer Tax from the transfer price and property type."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Why a city-specific transfer tax calculator matters</h2>
            <p>
              Property transfer taxes in the US are highly local. A generic national calculator would be inaccurate for
              NYC, where the transfer-tax structure has its own rates and thresholds.
            </p>
            <h2>What this page is designed for</h2>
            <p>
              It gives a fast estimate of the NYC city transfer tax itself so buyers, sellers, and brokers can isolate
              that part of the closing-cost picture before layering on the rest.
            </p>
          </div>
        }
      >
        <NYCTransferTaxCalculator />
      </ToolPageScaffold>
    </>
  );
}
