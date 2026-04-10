import type { Metadata } from "next";

import DubaiServiceChargeCalculator from "@/app/real-estate/dubai-service-charge-calculator/components/DubaiServiceChargeCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/dubai-service-charge-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What does this Dubai service charge calculator estimate?",
    answer:
      "It estimates the annual service charge and monthly equivalent from the title deed area and the approved service charge rate per square foot.",
  },
  {
    question: "Why does the calculator ask for title deed area instead of saleable area?",
    answer:
      "Dubai service charges are typically applied to the title deed area used in the approved community service-charge schedule, not to a marketing floor area figure.",
  },
  {
    question: "Does every Dubai building use the same rate?",
    answer:
      "No. The approved rate varies by development and property type, which is why this page uses a custom rate input rather than pretending there is one Dubai-wide service-charge number.",
  },
  {
    question: "Is this a substitute for the official community statement?",
    answer:
      "No. It is an estimate for planning and comparison. The official approved rate and the actual billed amount should still be confirmed from the relevant building or community records.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Dubai Service Charge Calculator | Annual Property Service Charge Estimate",
    description:
      "Estimate Dubai annual service charges and monthly equivalent from the title deed area and approved rate per square foot.",
    path: PAGE_PATH,
  }),
  keywords: [
    "dubai service charge calculator",
    "dubai property service charge calculator",
    "dubai annual service charge calculator",
    "dubai maintenance fee calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Dubai Service Charge Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "AED",
    },
    description:
      "Free Dubai service charge calculator for estimating annual property service charges from title deed area and approved rate per square foot.",
  };
}

export default function DubaiServiceChargeCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Dubai Service Charge Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Dubai Service Charge Calculator"
        description="Estimate Dubai annual service charges and monthly equivalent from the title deed area and the approved rate per square foot."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Why Dubai service charges deserve a separate calculator</h2>
            <p>
              Buyers and landlords often focus on purchase price, transfer fees, and mortgage costs first. The annual
              service charge can still be a meaningful carrying cost, especially in communities with higher approved
              rates or larger title deed areas.
            </p>
            <h2>What this page is best used for</h2>
            <p>
              It works best for comparing properties, validating broker assumptions, or pressure-testing an ownership
              budget before you commit to a community. Use the approved rate from the relevant development rather than a
              generic market average.
            </p>
          </div>
        }
      >
        <DubaiServiceChargeCalculator />
      </ToolPageScaffold>
    </>
  );
}
