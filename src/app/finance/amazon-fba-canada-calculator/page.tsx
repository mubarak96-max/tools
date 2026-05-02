import Link from "next/link";
import type { Metadata } from "next";

import { AmazonCanadaFBATool } from "./components/AmazonCanadaFBATool";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/amazon-fba-canada-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = "2026-05-01T00:00:00.000Z";

const faq = [
  {
    question: "What does this Amazon.ca calculator estimate?",
    answer:
      "It estimates Amazon.ca referral fees, FBA fulfilment fees, storage costs, dimensional weight effects, and unit-level profit in Canadian dollars.",
  },
  {
    question: "Why does the calculator ask for centimetres and grams?",
    answer:
      "Amazon Canada uses metric size tiers, so the calculator uses centimetres and grams to map products to the right fulfilment fee band.",
  },
  {
    question: "Does it account for GST or HST on FBA fees?",
    answer:
      "Yes. The calculator includes tax-sensitive fee logic so Canadian sellers can see how province-level GST or HST changes the real cost of fulfilment.",
  },
  {
    question: "When do aged inventory surcharges matter in Canada?",
    answer:
      "They matter when inventory sits too long in storage. The calculator helps you see how slow turnover can erode margin even before ad spend is considered.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Amazon FBA Calculator Canada | Amazon.ca Fees and Profit",
    description:
      "Calculate Amazon.ca referral fees, FBA fulfilment, storage, and net profit in CAD. Model Amazon Canada size tiers, tax impact, and inventory costs before you list.",
    path: PAGE_PATH,
  }),
  keywords: [
    "amazon fba calculator canada",
    "amazon fba fee calculator canada",
    "amazon canada fba calculator",
    "amazon ca fba fees",
    "amazon canada seller fees",
    "amazon canada profit calculator",
  ],
  openGraph: {
    title: "Amazon FBA Calculator Canada",
    description:
      "Estimate Amazon.ca seller fees, storage, and profit in Canadian dollars with a Canada-specific FBA calculator.",
    url: PAGE_URL,
    type: "website",
  },
  other: {
    "article:modified_time": LAST_UPDATED_ISO,
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Amazon FBA Calculator Canada",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CAD",
    },
    description:
      "Free Amazon Canada FBA calculator for referral fees, fulfilment, storage, and product margin planning.",
  };
}

export default function AmazonFbaCanadaCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Finance", path: "/finance" },
            { name: "Amazon FBA Calculator Canada", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Finance"
        categoryHref="/finance"
        title="Amazon FBA Calculator Canada"
        description="Calculate Amazon.ca referral fees, FBA fulfilment, storage, and net profit in Canadian dollars."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <p className="text-sm font-medium text-slate-500">Last updated: May 2026</p>

            <h2>Why Amazon.ca needs its own FBA calculator</h2>
            <p>
              Amazon Canada uses its own fee cards, metric size tiers, and CAD-based unit
              economics. A generic US-focused calculator can give the wrong fulfilment tier, wrong
              fee expectations, and the wrong margin decision for Canadian sellers.
            </p>

            <h2>Where this calculator helps most</h2>
            <ul>
              <li>Checking whether dimensional weight changes your fee band.</li>
              <li>Comparing categories with different referral rates.</li>
              <li>Understanding how GST or HST affects fulfilment costs.</li>
              <li>Testing whether slow-moving inventory still works after storage costs.</li>
            </ul>

            <h2>Worked example</h2>
            <p>
              A product that looks profitable on raw product margin alone can become weak once
              storage, tax on fulfilment fees, and size-tier jumps are added. That is why a Canada-
              specific calculator matters before you commit to inventory.
            </p>

            <h2>Related calculators</h2>
            <p>
              You can also
              compare it with the{" "}
              <Link href="/finance/amazon-fba-calculator-uk">Amazon FBA calculator UK</Link>.
            </p>
          </div>
        }
      >
        <AmazonCanadaFBATool />
      </ToolPageScaffold>
    </>
  );
}
