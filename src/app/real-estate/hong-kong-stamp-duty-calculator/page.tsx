import Link from "next/link";
import type { Metadata } from "next";

import HongKongStampDutyCalculator from "@/app/real-estate/hong-kong-stamp-duty-calculator/components/HongKongStampDutyCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/hong-kong-stamp-duty-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = "2026-05-01T00:00:00.000Z";

const faq = [
  {
    question: "What kind of Hong Kong duty does this page estimate?",
    answer:
      "This page estimates residential ad valorem stamp duty using the current Hong Kong Scale 2 schedule.",
  },
  {
    question: "Why is this not a generic Asia stamp duty calculator?",
    answer:
      "Hong Kong uses a specific piecewise schedule, so a generic flat percentage would be misleading for real planning.",
  },
  {
    question: "Does this cover every Hong Kong property duty case?",
    answer:
      "No. It is built for the main residential ad valorem duty estimate that buyers commonly need when budgeting a purchase.",
  },
  {
    question: "Why can the effective rate jump between ranges?",
    answer:
      "Because some Hong Kong bands use formulas and fixed amounts instead of one simple rate, the effective duty changes as the property value moves across those ranges.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Hong Kong Stamp Duty Calculator | Residential Scale 2 Estimate",
    description:
      "Estimate Hong Kong residential stamp duty using the current Scale 2 schedule. Compare price bands and budget the ad valorem duty before completion.",
    path: PAGE_PATH,
  }),
  keywords: [
    "hong kong stamp duty calculator",
    "hong kong property stamp duty calculator",
    "hong kong ad valorem stamp duty calculator",
    "hong kong residential stamp duty",
  ],
  openGraph: {
    title: "Hong Kong Stamp Duty Calculator",
    description:
      "Calculate Hong Kong residential ad valorem stamp duty with the current Scale 2 structure.",
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
    name: "Hong Kong Stamp Duty Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "HKD",
    },
    description:
      "Free Hong Kong residential ad valorem stamp duty calculator using the current Scale 2 schedule.",
  };
}

export default function HongKongStampDutyCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Hong Kong Stamp Duty Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Hong Kong Stamp Duty Calculator"
        description="Estimate Hong Kong residential ad valorem stamp duty using the current Scale 2 duty schedule."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <p className="text-sm font-medium text-slate-500">Last updated: May 2026</p>

            <h2>Why Hong Kong needs a dedicated stamp duty calculator</h2>
            <p>
              Hong Kong residential stamp duty is not just a single percentage. The published
              structure uses different bands and formulas, so the total duty changes non-linearly as
              the purchase price rises.
            </p>

            <h2>How to use the estimate well</h2>
            <p>
              Use this calculator when you are comparing multiple price points and want a realistic
              estimate before adding legal fees, financing costs, or other closing expenses. It is
              especially useful when you are close to a band change and want to understand the
              marginal impact.
            </p>

            <h2>Worked example</h2>
            <p>
              A buyer comparing two similar flats can see how the ad valorem duty changes between
              purchase prices without manually stepping through the full Scale 2 table. That makes
              the tool more useful than a flat-rate estimate.
            </p>

            <h2>Related property tax guides</h2>
            <p>
              For a plain-English walkthrough, read our{" "}
              <Link href="/blog/hong-kong-stamp-duty-guide">Hong Kong stamp duty guide</Link>. You
              can also compare other location-specific property tax tools such as the{" "}
              <Link href="/real-estate/singapore-buyers-stamp-duty-calculator">
                Singapore buyer's stamp duty calculator
              </Link>{" "}
              and the <Link href="/real-estate/scotland-lbtt-calculator">Scotland LBTT calculator</Link>.
            </p>
          </div>
        }
      >
        <HongKongStampDutyCalculator />
      </ToolPageScaffold>
    </>
  );
}
