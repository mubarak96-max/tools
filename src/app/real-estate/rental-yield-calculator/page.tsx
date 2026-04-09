import type { Metadata } from "next";

import RentalYieldCalculator from "@/app/real-estate/rental-yield-calculator/components/RentalYieldCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/rental-yield-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a good rental yield?",
    answer:
      "There is no single good number for every market. A stronger yield in one city can still be a weaker deal if vacancy, maintenance, or tenant risk is much higher. Use yield to compare similar properties in the same market, not as a universal pass-or-fail rule.",
  },
  {
    question: "What is the difference between gross yield and net yield?",
    answer:
      "Gross yield uses the annual rent before costs. Net yield subtracts annual operating expenses first. Net yield is usually the more realistic measure because it reflects what the property keeps after recurring costs.",
  },
  {
    question: "Should mortgage payments be included in net yield?",
    answer:
      "No. Net yield is usually calculated before financing. Mortgage payments affect your cash flow, but yield is meant to show how the property performs on its own.",
  },
  {
    question: "Which expenses should I include?",
    answer:
      "Include the recurring annual costs tied to owning and operating the property, such as maintenance, service charges, insurance, vacancy allowance, management fees, and similar outgoings.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Rental Yield Calculator | Gross Yield and Net Yield Calculator",
    description:
      "Calculate rental yield, net yield, and net operating income from property price, monthly rent, and annual expenses.",
    path: PAGE_PATH,
  }),
  keywords: [
    "rental yield calculator",
    "gross yield calculator",
    "net yield calculator",
    "property yield calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Rental Yield Calculator",
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
      "Free rental yield calculator for gross yield, net yield, and net operating income from property price, rent, and annual expenses.",
  };
}

export default function RentalYieldCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Rental Yield Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Rental Yield Calculator"
        description="Calculate gross yield, net yield, and annual property income from the purchase price, monthly rent, and operating costs."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>When investors look at rental yield first</h2>
            <p>
              Rental yield is often the fastest way to compare one income property with another before you get pulled
              into financing details. It tells you how much rent the property produces relative to its value.
            </p>
            <h2>Why net yield matters more than headline rent</h2>
            <p>
              A property can look strong on the listing price and rent alone, then look very different once service
              charges, management, vacancy, insurance, and maintenance are included. Net yield helps you see that gap.
            </p>
            <h2>Use this page as a first filter, not the final investment model</h2>
            <p>
              This calculator is best for quick screening. Once a property makes the shortlist, move to a deeper cash
              flow model that includes financing, tax, reserves, and exit assumptions.
            </p>
          </div>
        }
      >
        <RentalYieldCalculator />
      </ToolPageScaffold>
    </>
  );
}
