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
    title: "NYC Transfer Tax Calculator 2025 — RPTT & Mansion Tax Rates",
    description:
      "Calculate 2025 NYC Real Property Transfer Tax (RPTT) and NYS Mansion Tax. Factual rates for residential and commercial properties.",
    path: PAGE_PATH,
  }),
  keywords: [
    "nyc transfer tax calculator",
    "who pays transfer tax nyc",
    "nyc rptt rates 2025",
    "mansion tax nyc",
    "sponsor sale transfer tax",
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
    description: "Factual estimate of NYC Real Property Transfer Tax and NYS Mansion Tax for 2025 transactions.",
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
        description="Estimate New York City Real Property Transfer Tax (RPTT) and NYS Mansion Tax based on current thresholds."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold">What is NYC Real Property Transfer Tax (RPTT)?</h2>
            <p>
              The New York City Real Property Transfer Tax (RPTT) applies to nearly every real estate transaction in the five boroughs totaling over $25,000. This includes the sale of houses, condos, and even co-op apartments, as well as the transfer of a controlling interest in an entity that owns property.
            </p>

            <h2 className="text-2xl font-bold mt-8">NYC Transfer Tax Rates for 2025</h2>
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
                    <td className="px-4 py-3 font-medium">Residential (1-3 Family)</td>
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

            <h2 className="text-2xl font-bold mt-8">NYS Transfer Tax & The Mansion Tax</h2>
            <p>
              NYC properties are also subject to <strong>New York State Transfer Tax</strong>. The standard state rate is 0.4% ($2 per $500). However, residential sales over $2 million and commercial sales over $3 million trigger an additional "Base Tax" of 0.25%, bringing the state total to 0.65%.
            </p>
            <p className="mt-4">
              Furthermore, residential purchases of $1 million or more trigger the <strong>NYS Mansion Tax</strong>. This is paid by the buyer and scales from 1% up to 3.9% for properties sold for $25 million or more.
            </p>

            <h2 className="text-2xl font-bold mt-8">Who Pays Transfer Tax in NYC?</h2>
            <p>
              In a standard <strong>resale transaction</strong>, the custom in NYC is for the <strong>seller</strong> to pay both the City and State transfer taxes. 
            </p>
            <p className="mt-4">
              However, in <strong>New Construction (Sponsor Sales)</strong>, it is almost universal for the sponsor to contractually shift the burden of both NYC/NYS transfer taxes and the sponsor's legal fees to the <strong>buyer</strong>. This is a critical factor when estimating your <Link href="/real-estate/closing-costs-calculator" className="text-primary hover:underline">total closing costs</Link>.
            </p>

            <h2 className="text-2xl font-bold mt-8">New Construction vs. Resale Nuances</h2>
            <p>
              When a buyer pays the transfer tax on behalf of a sponsor (common in new construction), the NYC Department of Finance considers that tax payment to be a part of the total consideration. This results in "tax on tax," effectively increasing the total tax amount slightly. Our calculator estimates the base tax before such contractual gross-ups.
            </p>
          </div>
        }
      >
        <NYCTransferTaxCalculator />
      </ToolPageScaffold>
    </>
  );
}
