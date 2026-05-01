import Link from "next/link";
import type { Metadata } from "next";

import WalesLttCalculator from "@/app/real-estate/wales-ltt-calculator/components/WalesLttCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/wales-ltt-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = "2026-05-01T00:00:00.000Z";

const faq = [
  {
    question: "Does this calculator use current Welsh LTT bands?",
    answer:
      "Yes. It uses the current residential Land Transaction Tax bands for Wales and lets you compare the standard and higher residential rates.",
  },
  {
    question: "What does the higher-rates option mean?",
    answer:
      "It is for purchases that fall under the higher residential rates rather than the standard main-residence bands.",
  },
  {
    question: "Can I use this for England, Northern Ireland, or Scotland?",
    answer:
      "No. Those jurisdictions use different property transaction tax systems, so this page is only for Welsh residential LTT.",
  },
  {
    question: "Is this enough for final completion figures?",
    answer:
      "It is a planning calculator. Use it to budget and compare scenarios, then confirm the final figure with your conveyancer.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Wales LTT Calculator | Land Transaction Tax for Wales",
    description:
      "Calculate Wales Land Transaction Tax with current residential bands and higher rates. Estimate your Welsh property tax before exchange and completion.",
    path: PAGE_PATH,
  }),
  keywords: [
    "wales ltt calculator",
    "welsh land transaction tax calculator",
    "wales stamp duty calculator",
    "higher rates ltt calculator wales",
  ],
  openGraph: {
    title: "Wales LTT Calculator",
    description:
      "Estimate Welsh Land Transaction Tax using current residential and higher-rate bands.",
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
            <p className="text-sm font-medium text-slate-500">Last updated: May 2026</p>

            <h2>Why this page focuses only on Wales</h2>
            <p>
              Wales has its own Land Transaction Tax system. The bands are different from Scotland
              and from England and Northern Ireland, so a dedicated Wales LTT calculator is the only
              way to produce a realistic estimate.
            </p>

            <h2>Where this calculator is most useful</h2>
            <p>
              Use it when you want to compare a standard main-residence purchase with a higher-rate
              scenario before layering in deposit, legal fees, and mortgage costs.
            </p>

            <h2>Worked example</h2>
            <p>
              If you are deciding between a normal residential move and a purchase that triggers the
              higher rates, this calculator shows the tax gap immediately. That makes it easier to
              budget your total cash required before exchange.
            </p>

            <h2>Related guides and calculators</h2>
            <p>
              Read our{" "}
              <Link href="/blog/wales-ltt-guide">Wales LTT guide</Link> for a plain-English
              walkthrough. You can also compare Welsh property tax with the{" "}
              <Link href="/real-estate/scotland-lbtt-calculator">Scotland LBTT calculator</Link> or
              the <Link href="/real-estate/uk-stamp-duty-calculator">UK stamp duty calculator</Link>.
            </p>
          </div>
        }
      >
        <WalesLttCalculator />
      </ToolPageScaffold>
    </>
  );
}
