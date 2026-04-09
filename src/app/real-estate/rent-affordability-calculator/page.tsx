import type { Metadata } from "next";

import RentAffordabilityCalculator from "@/app/real-estate/rent-affordability-calculator/components/RentAffordabilityCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/rent-affordability-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How much rent can I afford on my salary?",
    answer:
      "A common starting point is to keep housing around 30% of monthly income, then adjust for debt, utilities, and the rest of your budget. This calculator helps you make that adjustment instead of relying on the headline rule alone.",
  },
  {
    question: "Should I use gross income or take-home pay?",
    answer:
      "Use the figure you actually budget from. Some renters prefer gross income because landlords often qualify tenants that way, while others prefer take-home pay because it reflects the real cash available each month.",
  },
  {
    question: "Why do debt payments matter for rent affordability?",
    answer:
      "Debt payments reduce the money left for housing each month. Two people with the same income can have very different affordable-rent levels if one of them is already carrying car loans, student loans, or credit-card balances.",
  },
  {
    question: "Are utilities included in rent affordability?",
    answer:
      "They should be. A unit with lower rent but expensive utilities can still stretch your monthly budget more than expected. This page subtracts utilities so the rent estimate is closer to real life.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Rent Affordability Calculator | How Much Rent Can I Afford?",
    description:
      "Estimate an affordable monthly rent from income, debt payments, utilities, and your target housing ratio.",
    path: PAGE_PATH,
  }),
  keywords: [
    "rent affordability calculator",
    "how much rent can i afford",
    "rent budget calculator",
    "affordable rent calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Rent Affordability Calculator",
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
      "Free rent affordability calculator for monthly rent budgeting based on income, debt payments, utilities, and housing ratio.",
  };
}

export default function RentAffordabilityCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Rent Affordability Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Rent Affordability Calculator"
        description="Work out a realistic monthly rent budget from income, debt payments, utilities, and your preferred housing ratio."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>A rent budget is more useful than a listing wishlist</h2>
            <p>
              Rent affordability is easier to manage when you decide your budget before you start browsing listings. It
              keeps you from getting attached to properties that look good but squeeze the rest of your monthly finances.
            </p>
            <h2>Why a simple percentage rule is not enough on its own</h2>
            <p>
              Rules like 30% of income are useful starting points, but they ignore debt, utility costs, and the
              spending habits that make one renter comfortable at a number that would feel risky to someone else.
            </p>
            <h2>Use the final rent number as a ceiling, not a target</h2>
            <p>
              If the calculator says a rent level is possible, that does not mean you need to spend all the way up to
              it. Many renters intentionally stay below the limit to protect savings and keep more room in the monthly budget.
            </p>
          </div>
        }
      >
        <RentAffordabilityCalculator />
      </ToolPageScaffold>
    </>
  );
}
