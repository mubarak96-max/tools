import type { Metadata } from "next";

import RentalCashFlowCalculator from "@/app/real-estate/rental-cash-flow-calculator/components/RentalCashFlowCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/rental-cash-flow-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is rental cash flow?",
    answer:
      "Rental cash flow is the money left after rental income has covered vacancy, mortgage payments, and operating costs. Positive cash flow means the property is still generating cash after those costs are paid.",
  },
  {
    question: "Why should I include a vacancy allowance?",
    answer:
      "Very few rentals stay fully occupied forever. A vacancy allowance creates a buffer so the income estimate is closer to real life instead of assuming every month is perfect.",
  },
  {
    question: "What are reserve costs in a rental calculator?",
    answer:
      "Reserve costs are larger irregular expenses you still expect over time, such as appliance replacement, repairs, or periodic maintenance. They are not monthly every time, but they still belong in the budget.",
  },
  {
    question: "Can a property have good yield but weak cash flow?",
    answer:
      "Yes. A property may look attractive on yield while still producing weak monthly cash flow once the mortgage and operating costs are included. That is why cash flow deserves its own page and its own test.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Rental Cash Flow Calculator | Monthly and Annual Property Cash Flow",
    description:
      "Estimate rental cash flow after vacancy, mortgage costs, monthly expenses, and annual reserve costs.",
    path: PAGE_PATH,
  }),
  keywords: [
    "rental cash flow calculator",
    "property cash flow calculator",
    "rental property cash flow calculator",
    "monthly rental cash flow calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Rental Cash Flow Calculator",
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
      "Free rental cash flow calculator for monthly and annual property cash flow after vacancy, mortgage, and operating costs.",
  };
}

export default function RentalCashFlowCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Rental Cash Flow Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Rental Cash Flow Calculator"
        description="Estimate monthly and annual rental cash flow after vacancy, mortgage payments, operating costs, and reserve spending."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Cash flow answers a different question from yield</h2>
            <p>
              Yield tells you how the property performs relative to value. Cash flow tells you whether the property is
              likely to leave money in your pocket after the income and costs move through the real monthly budget.
            </p>
            <h2>Why conservative cash flow assumptions matter</h2>
            <p>
              Rental income can look comfortable until vacancy, repairs, and reserve costs are added. This page is meant
              to pressure-test the deal instead of assuming every month will go exactly to plan.
            </p>
            <h2>Use this page to screen for durability</h2>
            <p>
              If a property only works when vacancy is zero and repairs never happen, it is often too fragile. A
              stronger rental still looks workable after a realistic allowance is built into the numbers.
            </p>
          </div>
        }
      >
        <RentalCashFlowCalculator />
      </ToolPageScaffold>
    </>
  );
}
