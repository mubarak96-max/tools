import Link from "next/link";
import type { Metadata } from "next";

import ScotlandLbttCalculator from "@/app/real-estate/scotland-lbtt-calculator/components/ScotlandLbttCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/scotland-lbtt-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = "2026-05-01T00:00:00.000Z";

const faq = [
  {
    question: "Does this calculator use Scotland's current LBTT bands?",
    answer:
      "Yes. It uses the current Scottish residential LBTT bands, including the wider nil-rate band for qualifying first-time buyers.",
  },
  {
    question: "Does this include the Additional Dwelling Supplement?",
    answer:
      "Yes. If the purchase is an additional dwelling, the calculator adds the current Additional Dwelling Supplement on top of the main LBTT amount.",
  },
  {
    question: "Is this the same as UK stamp duty?",
    answer:
      "No. Scotland uses LBTT instead of SDLT, so the bands and surcharges are different from England and Northern Ireland.",
  },
  {
    question: "Should I still confirm the figure with my solicitor?",
    answer:
      "Yes. Use this page for early budgeting and scenario planning, then confirm the final tax position with your solicitor or conveyancer.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Scotland LBTT Calculator | Scottish Property Tax Estimate",
    description:
      "Calculate Scotland LBTT with current residential bands, first-time buyer relief, and Additional Dwelling Supplement. Budget Scottish property tax before completion.",
    path: PAGE_PATH,
  }),
  keywords: [
    "scotland lbtt calculator",
    "lbtt calculator scotland",
    "scottish stamp duty calculator",
    "additional dwelling supplement calculator scotland",
  ],
  openGraph: {
    title: "Scotland LBTT Calculator",
    description:
      "Estimate Scottish LBTT with current residential bands, first-time buyer relief, and ADS.",
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
            <p className="text-sm font-medium text-slate-500">Last updated: May 2026</p>

            <h2>Why Scottish property tax needs its own calculator</h2>
            <p>
              Scotland does not use the SDLT system that applies in England and Northern Ireland.
              It uses Land and Buildings Transaction Tax, so the residential bands, first-time buyer
              relief, and additional-dwelling surcharge need to be calculated separately.
            </p>

            <h2>What this page helps you plan</h2>
            <p>
              It gives you a realistic starting point when comparing a standard purchase, a
              qualifying first-time buyer purchase, and an additional dwelling purchase in
              Scotland.
            </p>

            <h2>Worked example</h2>
            <p>
              A buyer moving into a main residence may see a very different tax result from an
              investor buying an extra property at the same purchase price. This calculator is built
              to make that difference visible immediately.
            </p>

            <h2>Related guides and calculators</h2>
            <p>
              For a detailed walkthrough, read our{" "}
              <Link href="/blog/scotland-lbtt-guide">Scotland LBTT guide</Link>. You can also compare
              the Welsh system with the{" "}
              <Link href="/real-estate/wales-ltt-calculator">Wales LTT calculator</Link> or review
              England and Northern Ireland using the{" "}
              <Link href="/real-estate/uk-stamp-duty-calculator">UK stamp duty calculator</Link>.
            </p>
          </div>
        }
      >
        <ScotlandLbttCalculator />
      </ToolPageScaffold>
    </>
  );
}
