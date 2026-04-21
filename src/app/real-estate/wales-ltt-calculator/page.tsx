import type { Metadata } from "next";

import WalesLttCalculator from "@/app/real-estate/wales-ltt-calculator/components/WalesLttCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/wales-ltt-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Does this calculator use current Welsh LTT bands?",
    answer:
      "Yes. It uses the current residential Land Transaction Tax bands for Wales and lets you switch between the standard rates and the higher residential rates.",
  },
  {
    question: "What does the higher-rates option mean?",
    answer:
      "It is there for purchases that fall into the higher residential rate rules rather than the normal main-residence bands. The higher rates are much steeper, so that switch matters.",
  },
  {
    question: "Can I use this for England, Northern Ireland, or Scotland?",
    answer:
      "No. Those jurisdictions use different property transaction tax systems. This page is only for Welsh residential LTT.",
  },
  {
    question: "Is this enough for final completion figures?",
    answer:
      "It is a planning calculator rather than a legal completion statement. Use it to budget and compare scenarios, then confirm the final figure with your conveyancer.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Wales LTT Calculator | Welsh Land Transaction Tax Calculator",
    description:
      "Calculate Welsh residential Land Transaction Tax with the current standard and higher residential rates.",
    path: PAGE_PATH,
  }),
  keywords: [
    "wales ltt calculator",
    "welsh land transaction tax calculator",
    "wales stamp duty calculator",
    "higher rates ltt calculator wales",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Wales LTT Calculator",
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
      "Free Wales Land Transaction Tax calculator for standard and higher residential rates.",
  };
}

export default function WalesLttCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Wales LTT Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Wales LTT Calculator"
        description="Calculate Welsh residential Land Transaction Tax with the current standard and higher residential rates."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Why this page focuses only on Wales</h2>
            <p>
              Wales has its own residential transaction tax system, and the bands are different from Scotland and from
              England and Northern Ireland. A dedicated LTT calculator is the only way to keep the estimate aligned with
              the Welsh structure people actually pay under.
            </p>
            <h2>Where this calculator is most useful</h2>
            <p>
              It is useful when you want to compare normal main-residence purchases with higher-rate scenarios and see
              the tax effect before you start adding solicitor fees, deposit cash, or mortgage costs to the wider budget.
            </p>
          </div>
        }
      >
        <WalesLttCalculator />
      </ToolPageScaffold>
    </>
  );
}
