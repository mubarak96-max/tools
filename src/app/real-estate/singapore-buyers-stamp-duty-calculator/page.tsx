import Link from "next/link";
import type { Metadata } from "next";

import SingaporeBuyersStampDutyCalculator from "@/app/real-estate/singapore-buyers-stamp-duty-calculator/components/SingaporeBuyersStampDutyCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/singapore-buyers-stamp-duty-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = "2026-05-01T00:00:00.000Z";

const faq = [
  {
    question: "Does this page include both BSD and ABSD?",
    answer:
      "Yes. It estimates the progressive Buyer's Stamp Duty first and then adds Additional Buyer's Stamp Duty based on the buyer profile you select.",
  },
  {
    question: "Why does the buyer profile matter so much in Singapore?",
    answer:
      "Because ABSD depends on residency status and how many residential properties the buyer already owns. Two buyers looking at the same property price can face very different duty bills.",
  },
  {
    question: "Is this only for residential purchases?",
    answer:
      "Yes. This calculator is intentionally focused on residential transactions where BSD and ABSD planning matters most.",
  },
  {
    question: "Should I still confirm the duty with my conveyancing team?",
    answer:
      "Yes. Use this page for budgeting and comparison, then confirm the final duty treatment with your conveyancing solicitor before completion.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Singapore Buyer's Stamp Duty Calculator | BSD and ABSD Estimate",
    description:
      "Calculate Singapore BSD and ABSD for residential property purchases. Compare buyer profiles, estimate total stamp duty, and budget your upfront costs.",
    path: PAGE_PATH,
  }),
  keywords: [
    "singapore buyers stamp duty calculator",
    "singapore BSD calculator",
    "singapore ABSD calculator",
    "singapore property buyer duty",
    "additional buyers stamp duty calculator",
    "singapore residential property tax",
  ],
  openGraph: {
    title: "Singapore Buyer's Stamp Duty Calculator",
    description:
      "Estimate Singapore BSD and ABSD for residential buyers using current buyer profile rules and ownership counts.",
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
    name: "Singapore Buyer's Stamp Duty Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "SGD",
    },
    description:
      "Free Singapore residential buyer's stamp duty calculator for BSD and ABSD planning.",
  };
}

export default function SingaporeBuyersStampDutyCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Singapore Buyer's Stamp Duty Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Singapore Buyer's Stamp Duty Calculator"
        description="Calculate Singapore residential BSD and ABSD using the current buyer profile and property ownership rules."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <p className="text-sm font-medium text-slate-500">Last updated: May 2026</p>

            <h2>How Singapore buyer's stamp duty works</h2>
            <p>
              Singapore residential buyers usually need to model two layers of upfront tax. The
              first is standard BSD, which uses progressive bands. The second is ABSD, which can
              change sharply depending on residency and how many residential properties the buyer
              already holds.
            </p>
            <p>
              That is why this calculator is most useful before you make an offer or compare two
              purchase structures. A small change in buyer status can mean a very large change in
              total duty.
            </p>

            <h2>Worked example</h2>
            <p>
              On a S$2,000,000 residential purchase, a Singapore citizen buying a first home pays
              BSD only. A citizen buying a second residential property pays the same BSD plus the
              current ABSD for a second property. A foreign buyer may face a much larger ABSD bill
              on top of BSD. This is exactly the scenario the calculator helps you compare.
            </p>

            <h2>When to use this calculator</h2>
            <ul>
              <li>Comparing first-home and additional-property scenarios.</li>
              <li>Checking whether ABSD is the main driver of your closing budget.</li>
              <li>Pressure-testing affordability before legal fees and mortgage costs are added.</li>
            </ul>

            <h2>Related Singapore property guides</h2>
            <p>
              For a worked walkthrough, read our{" "}
              <Link href="/blog/singapore-buyers-stamp-duty-guide">
                Singapore buyer's stamp duty guide
              </Link>
              . You can also compare seller-side duty with the{" "}
              <Link href="/real-estate/singapore-sellers-stamp-duty-calculator">
                Singapore seller's stamp duty calculator
              </Link>{" "}
              or review the broader{" "}
              <Link href="/real-estate/singapore-property-stamp-duty-calculator">
                Singapore property stamp duty calculator
              </Link>
              .
            </p>
          </div>
        }
      >
        <SingaporeBuyersStampDutyCalculator />
      </ToolPageScaffold>
    </>
  );
}
