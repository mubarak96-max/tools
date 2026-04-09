import type { Metadata } from "next";

import PropertyManagementFeeCalculator from "@/app/real-estate/property-management-fee-calculator/components/PropertyManagementFeeCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/property-management-fee-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How are property management fees usually charged?",
    answer:
      "They are often charged as a percentage of collected rent, though some managers also add separate leasing, renewal, inspection, or maintenance coordination fees.",
  },
  {
    question: "What is the difference between a management fee and a leasing fee?",
    answer:
      "The management fee is usually the ongoing charge for handling the property. The leasing fee is typically an extra charge for placing or renewing a tenant.",
  },
  {
    question: "Why should landlords calculate owner net after fees?",
    answer:
      "Because the gross rent can look healthy while the owner's real income changes a lot once the management agreement and repair spending are included.",
  },
  {
    question: "Can this calculator help compare self-management versus outsourcing?",
    answer:
      "Yes. It is a quick way to see what the outsourced fee structure costs, which makes it easier to compare against the time and effort of self-managing the property.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Property Management Fee Calculator | Estimate Owner Net After Fees",
    description:
      "Estimate management fees, leasing fees, and owner net income from monthly rent and annual repair costs.",
    path: PAGE_PATH,
  }),
  keywords: [
    "property management fee calculator",
    "rental management fee calculator",
    "landlord management fee calculator",
    "owner net income calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Property Management Fee Calculator",
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
      "Free property management fee calculator for management charges, leasing fees, and owner net income.",
  };
}

export default function PropertyManagementFeeCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Property Management Fee Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Property Management Fee Calculator"
        description="Estimate what management fees, leasing fees, and repair costs do to the rent your property actually leaves you."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Gross rent is not the same thing as owner income</h2>
            <p>
              Landlords often talk about the rent first because it is the headline number. The management agreement is
              what determines how much of that rent the owner really keeps.
            </p>
            <h2>Why fee structures are worth comparing before signing</h2>
            <p>
              A low monthly management fee can still be paired with a high leasing fee or other charges that make the
              overall arrangement more expensive than expected.
            </p>
            <h2>Use this page to compare scenarios, not just one contract</h2>
            <p>
              The strongest use case is comparing options side by side: one manager versus another, or outsourced
              management versus self-management with a realistic repair budget.
            </p>
          </div>
        }
      >
        <PropertyManagementFeeCalculator />
      </ToolPageScaffold>
    </>
  );
}
