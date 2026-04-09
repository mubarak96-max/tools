import type { Metadata } from "next";

import PricePerSquareFootCalculator from "@/app/real-estate/price-per-square-foot-calculator/components/PricePerSquareFootCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/price-per-square-foot-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How do you calculate price per square foot?",
    answer:
      "Divide the total property price by the total area in square feet. If the property is measured in square metres instead, divide by square metres and then convert if you need the equivalent square-foot rate.",
  },
  {
    question: "Is price per square foot enough to judge a property?",
    answer:
      "No. It is useful for quick comparison, but it does not capture layout quality, view, age, parking, finishes, building condition, or service charges. It is a comparison metric, not a full valuation on its own.",
  },
  {
    question: "Can I use square metres instead of square feet?",
    answer:
      "Yes. This calculator accepts either square feet or square metres and shows the equivalent rate in both units so you can compare listings from different markets.",
  },
  {
    question: "Why do two similar homes have different price-per-area numbers?",
    answer:
      "Location within the building, view, renovation quality, layout efficiency, outdoor space, parking, and building age can all move the price-per-area number even when the raw size looks similar.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Price per Square Foot Calculator | Price per Square Metre Calculator",
    description:
      "Calculate price per square foot or square metre from the total property price and area.",
    path: PAGE_PATH,
  }),
  keywords: [
    "price per square foot calculator",
    "price per square metre calculator",
    "price per sq ft calculator",
    "property area price calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Price per Square Foot Calculator",
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
      "Free price per square foot calculator and price per square metre calculator for property comparisons.",
  };
}

export default function PricePerSquareFootCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Price per Square Foot Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Price per Square Foot Calculator"
        description="Calculate price per square foot or square metre so you can compare listings on the same size-adjusted basis."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Why price per area is one of the first filters buyers use</h2>
            <p>
              When two listings have different sizes, total asking price alone is not enough. Price per square foot or
              square metre gives you a faster way to compare value across multiple homes or units.
            </p>
            <h2>What this number is good at</h2>
            <p>
              It is excellent for spotting outliers. If one property is priced far above the local norm on a
              size-adjusted basis, it is usually worth asking what justifies the premium.
            </p>
            <h2>What it does not capture</h2>
            <p>
              Not every square foot is equally useful. Layout, usable storage, balcony space, finish quality, and even
              how the building is managed can matter as much as the raw area number.
            </p>
          </div>
        }
      >
        <PricePerSquareFootCalculator />
      </ToolPageScaffold>
    </>
  );
}
