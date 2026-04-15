import Link from "next/link";
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
    question: "What is NYC Real Property Transfer Tax (RPTT)?",
    answer:
      "RPTT is a tax levied by New York City on the transfer of real property or interests in real property (like co-ops). The tax is based on the purchase price and varies by property type and price threshold.",
  },
  {
    question: "Who pays the NYC transfer tax, the buyer or the seller?",
    answer:
      "In most resale transactions, the seller is responsible for paying the NYC transfer tax. However, in new construction (sponsor sales), the buyer typically assumes this cost contractually, along with the sponsor's legal fees.",
  },
  {
    question: "How much is the New York State transfer tax?",
    answer:
      "In addition to NYC tax, the State charges 0.4% ($2 per $500) for properties under $2M, and 0.65% for residential properties over $2M (or commercial over $3M).",
  },
  {
    question: "Is NYC transfer tax applicable to condos and co-ops?",
    answer:
      "Yes. Both condos (real property) and co-ops (shares in a corporation) are subject to the NYC Real Property Transfer Tax. Co-op transfers were included in the tax code in 1989.",
  },
  {
    question: "When is the transfer tax paid?",
    answer:
      "The tax is typically paid at the closing of the transaction. The RPTT return must be filed and the tax paid within 30 days of the transfer.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "NYC & NYS Transfer Tax Calculator 2025 - 2026: RPTT & Mansion Tax",
    description:
      "Calculate 2025 NYC Real Property Transfer Tax (RPTT), NYS Transfer Tax, and Mansion Tax. Factual rates for Co-ops, Condos, and Residential homes.",
    path: PAGE_PATH,
  }),
  keywords: [
    "nyc transfer tax calculator",
    "new york city transfer tax calculator",
    "nys transfer tax nyc",
    "who pays transfer tax nyc",
    "nyc rptt rates 2025",
    "mansion tax nyc",
    "sponsor sale transfer tax",
    "nyc co-op transfer tax",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "NYC & NYS Transfer Tax Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "Accurate calculator for NYC RPTT, NYS Transfer Tax, and Mansion Tax for 2025 real estate transactions.",
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
        title="NYC & NYS Transfer Tax Calculator"
        description="Estimate New York City RPTT, New York State Transfer Tax, and Mansion Tax based on current 2025 thresholds."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold">What is NYC Real Property Transfer Tax (RPTT)?</h2>
            <p>
              The New York City Real Property Transfer Tax (RPTT) applies to nearly every real estate transaction in the five boroughs totaling over $25,000. This includes the sale of houses, condos, and even co-op apartments.
            </p>

            <h2 className="text-2xl font-bold mt-8">NYS Transfer Tax Rates (Standard & Peat Tax)</h2>
            <p>
              Beyond the city-level tax, all transactions in the state are subject to the <strong>New York State Transfer Tax</strong>.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Standard Rate:</strong> 0.4% ($2 per $500) for most transactions.</li>
              <li><strong>NYC High-Value Rate (Peat Tax):</strong> For transfers within NYC, the rate increases to 0.65% if the price is $3 million or more for residential properties (1-3 family) or $2 million or more for non-residential properties.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8">NYC Real Property Transfer Tax Rates (2025)</h2>
            <p>NYC uses a two-tier rate system based on the property type and the sale price:</p>

            <div className="overflow-x-auto my-6">
              <table className="min-w-full border border-border rounded-lg">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left border-b border-border">Property Type</th>
                    <th className="px-4 py-3 text-left border-b border-border">Under $500,000</th>
                    <th className="px-4 py-3 text-left border-b border-border">$500,000 and Above</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-medium">Residential (1-3 Family, Condo, Co-op)</td>
                    <td className="px-4 py-3">1.000%</td>
                    <td className="px-4 py-3">1.425%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">All Other Types (Commercial)</td>
                    <td className="px-4 py-3">1.425%</td>
                    <td className="px-4 py-3">2.625%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold mt-8">The NYS Mansion Tax</h2>
            <p>
              Residential purchases of $1 million or more trigger the <strong>NYS Mansion Tax</strong>. Unlike the transfer taxes which are typically paid by the seller, the Mansion Tax is almost always paid by the <strong>buyer</strong>. The rate starts at 1% and scales progressively:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-1">
              <li>$1,000,000 to $1,999,999: 1.00%</li>
              <li>$2,000,000 to $2,999,999: 1.25%</li>
              <li>$3,000,000 to $4,999,999: 1.50%</li>
              <li>Up to 3.90% for $25 million+</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8">Who Pays Transfer Tax in NYC?</h2>
            <p>
              In a standard <strong>resale transaction</strong>, the custom in NYC is for the <strong>seller</strong> to pay both the City and State transfer taxes.
            </p>
            <p className="mt-4">
              However, in <strong>New Construction (Sponsor Sales)</strong>, it is common for the sponsor to contractually shift the burden of both NYC/NYS transfer taxes to the <strong>buyer</strong>. This is why "Sponsor Sales" are more expensive in terms of closing costs.
            </p>

            <h2 className="text-2xl font-bold mt-8">Co-op vs. Condo Tax Nuances</h2>
            <p>
              While the RPTT rates are identical for condos and co-ops, the legal structure differs. Condo transfers involve a deed, while co-op transfers involve shares in a corporation and a proprietary lease. Despite being personal property, co-ops have been subject to RPTT since 1989.
            </p>
          </div>
        }
      >
        <NYCTransferTaxCalculator />
      </ToolPageScaffold>
    </>
  );
}
