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
    question: "What is price per square foot?",
    answer:
      "Price per square foot is the property price divided by the total area in square feet. It helps standardize listings so buyers, investors, and agents can compare properties of different sizes more easily.",
  },
  {
    question: "How do you calculate price per square foot?",
    answer:
      "Divide the total price by the total area. For example, if a property costs 1,000,000 and has 1,000 square feet, the price per square foot is 1,000. The same idea works for rent per square foot and price per square metre.",
  },
  {
    question: "Is a higher price per square foot always worse?",
    answer:
      "No. A higher rate can reflect a better location, stronger building quality, views, newer finishes, parking, or a more efficient layout. The metric is useful for comparison, but it does not explain the reason for a premium on its own.",
  },
  {
    question: "Can I use this calculator for rent per square foot?",
    answer:
      "Yes. Switch the calculator to rent mode and enter the monthly rent instead of the sale price. This helps compare lease listings on a size-adjusted basis.",
  },
  {
    question: "Can I calculate total property price from a target rate?",
    answer:
      "Yes. Reverse mode lets you enter the area and a target price-per-square-foot or price-per-square-metre rate to estimate the total amount.",
  },
  {
    question: "Is price per square foot enough to value a property?",
    answer:
      "No. It is a starting point, not a full valuation. Condition, amenities, view, floor level, service charges, location quality, and building management can materially change what a property is worth.",
  },
  {
    question: "What are example price-per-square-foot ranges in Dubai?",
    answer:
      "Dubai rates change frequently, but area averages can differ sharply. As an example reference from Bayut's H1 2025 apartment sales report, Jumeirah Lake Towers was around AED 1,561 per sq ft, Dubai Marina around AED 2,004, Business Bay around AED 2,076, Dubai Creek Harbour around AED 2,539, and Downtown Dubai around AED 3,149.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Price per Square Foot Calculator | Compare Property Value by Area",
    description:
      "Calculate price per square foot or square metre, reverse-calculate total property value, compare properties, and check rent or sale rates on the same size-adjusted basis.",
    path: PAGE_PATH,
  }),
  keywords: [
    "price per square foot calculator",
    "price per square metre calculator",
    "cost per square foot calculator",
    "rent per square foot calculator",
    "property price per sqm",
    "price per sq ft calculator",
    "compare property value",
    "reverse price per square foot calculator",
    "price per sq ft Dubai",
    "Dubai property price per square foot",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
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
      "Free property comparison calculator for price per square foot, price per square metre, reverse property valuation, and rent per square foot analysis.",
    featureList: [
      "Price per square foot and square metre calculation",
      "Reverse mode to estimate total property value from a target rate",
      "Buy and rent modes",
      "Custom benchmark comparison",
      "Two-property comparison workflow",
      "Real estate learning content and FAQ",
    ],
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
        description="Compare property value instantly using price per square foot or square metre, reverse-calculate total price, and evaluate sale or rent listings on the same size-adjusted basis."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>What price per square foot means</h2>
            <p>
              Price per square foot shows how much you pay for each unit of space. The formula is simple: total price
              divided by total area. Buyers, investors, and agents use it because it standardizes listings with
              different sizes and helps surface overpriced or underpriced properties faster.
            </p>

            <h2>Why this metric matters</h2>
            <p>
              Total listing price alone is hard to compare when one property is 850 square feet and another is 1,250.
              Price per square foot or square metre gives you a common denominator. It is especially useful when
              comparing similar units in the same neighborhood, tower, or building class.
            </p>

            <h2>Dubai-specific context</h2>
            <p>
              This metric is especially useful in Dubai because buyers often compare apartments across towers and
              communities where total prices can vary dramatically. Example apartment sale benchmarks from Bayut&apos;s
              H1 2025 Dubai market report show how different the market can be: Jumeirah Lake Towers at about AED 1,561
              per sq ft, Dubai Marina around AED 2,004, Business Bay around AED 2,076, Dubai Creek Harbour around AED
              2,539, and Downtown Dubai around AED 3,149. These numbers are directional and change over time, but they
              show why a benchmark matters.
            </p>

            <h2>How to use price per square foot when buying property</h2>
            <p>
              Start by comparing similar properties in the same market. Then ask why one listing is above or below the
              benchmark. A lower rate may indicate better value, but it may also reflect weaker layout, poorer
              condition, higher service charges, or a less attractive view. A higher rate may be justified if the unit
              is renovated, well positioned, or in a stronger building.
            </p>

            <h2>Use it for rent too</h2>
            <p>
              Rent per square foot works the same way. Monthly rent divided by area helps you compare lease listings and
              judge whether a tenant or landlord is paying a premium for location, quality, or convenience.
            </p>

            <h2>Important limitations</h2>
            <p>
              Price per area is a starting point, not a final verdict. It does not fully account for layout efficiency,
              balconies, parking, ceiling height, natural light, service charges, amenities, building age, or local
              demand. Use it to narrow decisions, then validate with deeper due diligence.
            </p>

            <div className="mt-12 p-8 bg-slate-50 rounded-3xl border border-slate-100 not-prose">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Should you Rent or Buy?</h3>
                <p className="text-slate-600 mb-6">
                    Once you&apos;ve compared the price per square foot, the next big question is whether buying the asset makes more financial sense than renting it.
                </p>
                <a href="/real-estate/rent-vs-buy-calculator" className="inline-flex items-center gap-2 font-bold text-primary hover:underline">
                    Try the Rent vs Buy Calculator →
                </a>
            </div>
          </div>
        }
      >
        <PricePerSquareFootCalculator />
      </ToolPageScaffold>
    </>
  );
}
