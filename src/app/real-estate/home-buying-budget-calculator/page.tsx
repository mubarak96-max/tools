import type { Metadata } from "next";

import HomeBuyingBudgetCalculator from "@/app/real-estate/home-buying-budget-calculator/components/HomeBuyingBudgetCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/home-buying-budget-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How much house can I afford based on my income?",
    answer:
      "A useful starting point is the monthly housing budget your income can support after debt and recurring ownership costs are considered. This calculator works backwards from that budget to estimate a practical home price range.",
  },
  {
    question: "Why are ownership costs separate from the mortgage payment?",
    answer:
      "Owning a home usually comes with costs outside the loan itself, such as taxes, insurance, HOA dues, or routine maintenance. If they are ignored, the home budget can look larger than it really is.",
  },
  {
    question: "Is the result the same as a lender approval?",
    answer:
      "No. This is a planning estimate based on the assumptions you enter. A lender may use different debt rules, credit criteria, rates, fees, or underwriting standards.",
  },
  {
    question: "Why does the interest rate change the affordable budget so much?",
    answer:
      "Because the rate changes how much loan balance a given monthly payment can support. Higher rates mean more of the payment goes to interest, which lowers the affordable loan size.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Home Buying Budget Calculator | Estimate How Much House You Can Afford",
    description:
      "Estimate a realistic home-buying budget from income, debt, down payment, ownership costs, mortgage rate, and loan term.",
    path: PAGE_PATH,
  }),
  keywords: [
    "home buying budget calculator",
    "how much house can i afford calculator",
    "house budget calculator",
    "home affordability budget calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Home Buying Budget Calculator",
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
      "Free home buying budget calculator for estimating a practical home price from income, debt, down payment, and mortgage assumptions.",
  };
}

export default function HomeBuyingBudgetCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Home Buying Budget Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Home Buying Budget Calculator"
        description="Estimate a grounded home budget from your income, debts, down payment, monthly ownership costs, and mortgage assumptions."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Why a home budget should start with the monthly payment you can carry</h2>
            <p>
              It is easy to get pulled into asking prices and broad lender marketing. A better first step is to decide
              what monthly housing cost your budget can actually support without making everything else feel tight.
            </p>
            <h2>What this calculator is really solving for</h2>
            <p>
              This page takes the monthly budget, debt load, interest rate, term, and down payment, then turns that
              into a home-price estimate. It is meant to help you shop inside a range that already fits your numbers.
            </p>
            <h2>Use the result as a planning range, not the ceiling you must spend</h2>
            <p>
              Even if the calculator says a home budget is possible, many buyers choose to stay below it for comfort,
              reserves, or flexibility. The strongest budget is often the one that still feels manageable after life changes.
            </p>
          </div>
        }
      >
        <HomeBuyingBudgetCalculator />
      </ToolPageScaffold>
    </>
  );
}
