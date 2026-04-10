import type { Metadata } from "next";

import DubaiMortgageRegistrationCalculator from "@/app/real-estate/dubai-mortgage-registration-calculator/components/DubaiMortgageRegistrationCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/dubai-mortgage-registration-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is the main Dubai mortgage registration fee?",
    answer:
      "The main DLD mortgage registration fee is 0.25% of the mortgage amount. This page also adds the small fixed title-related charges that are typically part of the registration step.",
  },
  {
    question: "Is this the same as the Dubai property transfer fee?",
    answer:
      "No. Mortgage registration and property transfer are different fee events. This page is only for the mortgage registration side of the transaction.",
  },
  {
    question: "Why might my final bill still be higher than this estimate?",
    answer:
      "Some transactions also carry service partner or trustee-channel charges outside the core DLD fee items. This calculator is meant to show the published statutory baseline first.",
  },
  {
    question: "Can I use this for early mortgage budgeting?",
    answer:
      "Yes. It is useful for planning because the mortgage registration charge is tied directly to the registered mortgage value, which makes it easy to test different loan sizes.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Dubai Mortgage Registration Calculator | DLD Mortgage Fee Calculator",
    description:
      "Estimate Dubai mortgage registration fees from the mortgage amount using the published DLD fee structure.",
    path: PAGE_PATH,
  }),
  keywords: [
    "dubai mortgage registration calculator",
    "dld mortgage fee calculator",
    "dubai mortgage fee calculator",
    "dubai mortgage registration fee",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Dubai Mortgage Registration Calculator",
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
      "Free Dubai mortgage registration calculator using the published DLD mortgage fee structure.",
  };
}

export default function DubaiMortgageRegistrationCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Dubai Mortgage Registration Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Dubai Mortgage Registration Calculator"
        description="Estimate Dubai mortgage registration fees from the mortgage amount using the published DLD fee structure."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Why mortgage registration needs its own Dubai fee page</h2>
            <p>
              Buyers often budget for Dubai transfer fees and forget that mortgage registration is a separate cost line
              tied to the loan size. It makes sense as its own calculator because it answers a different question from
              the sale transfer itself.
            </p>
            <h2>What this page is best used for</h2>
            <p>
              It is best for testing how your registration cost changes as your mortgage amount changes. That helps when
              you are comparing financing structures, deposit sizes, or lender proposals before the transaction is locked in.
            </p>
          </div>
        }
      >
        <DubaiMortgageRegistrationCalculator />
      </ToolPageScaffold>
    </>
  );
}
