import type { Metadata } from "next";

import HongKongStampDutyCalculator from "@/app/real-estate/hong-kong-stamp-duty-calculator/components/HongKongStampDutyCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/hong-kong-stamp-duty-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What kind of Hong Kong duty does this page estimate?",
    answer:
      "This page estimates ad valorem stamp duty for residential purchases using the current Scale 2 schedule published on the Hong Kong Government rates page.",
  },
  {
    question: "Why is this not a generic Asia stamp-duty calculator?",
    answer:
      "Hong Kong uses its own stepped schedule with several piecewise bands. A generic percentage estimate would be misleading, so this page stays focused on the Hong Kong rules instead.",
  },
  {
    question: "Does this cover every possible Hong Kong property duty case?",
    answer:
      "No. It is built around the main residential ad valorem duty schedule that buyers often want for budgeting. More specialised cases may need separate legal or tax review.",
  },
  {
    question: "Why can the effective rate jump between ranges?",
    answer:
      "Hong Kong's schedule is not a single flat percentage. Some ranges use a straight percentage and others use a fixed amount plus a marginal formula, so the effective rate moves with the property value.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Hong Kong Stamp Duty Calculator | Ad Valorem Residential Stamp Duty",
    description:
      "Estimate Hong Kong residential ad valorem stamp duty using the current Scale 2 duty schedule.",
    path: PAGE_PATH,
  }),
  keywords: [
    "hong kong stamp duty calculator",
    "hong kong property stamp duty calculator",
    "hong kong ad valorem stamp duty calculator",
    "hong kong residential stamp duty",
  ],
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
            <h2>Why Hong Kong needs its own stamp-duty page</h2>
            <p>
              Hong Kong residential stamp duty is not a simple percentage. The published schedule uses a stepped
              piecewise structure, which means the estimate changes sharply across different value bands. A dedicated
              page avoids hiding that behind a generic property-tax shortcut.
            </p>
            <h2>How to use this estimate well</h2>
            <p>
              Use it to get a realistic early figure for the residential ad valorem duty before you combine it with other
              purchase costs. It is especially useful when you are comparing more than one purchase price range and want
              to see how the duty moves between bands.
            </p>
          </div>
        }
      >
        <HongKongStampDutyCalculator />
      </ToolPageScaffold>
    </>
  );
}
