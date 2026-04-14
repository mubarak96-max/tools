import type { Metadata } from "next";

import RentVsBuyCalculator from "@/app/real-estate/rent-vs-buy-calculator/components/RentVsBuyCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/rent-vs-buy-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Is it cheaper to rent or buy?",
    answer:
      "It depends on how long you expect to stay, the size of the down payment, your monthly mortgage, the non-mortgage ownership costs, and the rent you would otherwise pay. A short stay can often favour renting, while a longer stay may justify buying.",
  },
  {
    question: "What costs should be included when comparing rent and buy?",
    answer:
      "For a simple first comparison, include the down payment, monthly mortgage, and monthly ownership costs on the buy side, then compare them against the monthly rent over the same time period.",
  },
  {
    question: "Does this calculator include home appreciation?",
    answer:
      "No. This version is a straightforward cost comparison. It does not model price appreciation, rent increases, resale proceeds, or the investment return you could earn on the down payment.",
  },
  {
    question: "Why does the number of years matter so much?",
    answer:
      "The longer you stay, the more the upfront cost of buying can be spread across time. Short stays often make the upfront cash and monthly ownership costs harder to justify.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Rent vs Buy Calculator | Compare the Cost of Renting and Buying",
    description:
      "Compare rent cost and buy cost over the years you expect to stay in a property.",
    path: PAGE_PATH,
  }),
  keywords: [
    "rent vs buy calculator",
    "should I rent or buy calculator",
    "buying vs renting calculator",
    "rent versus buy comparison",
    "is it better to rent or buy",
    "rent or buy decision calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Rent vs Buy Calculator",
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
      "Free rent vs buy calculator for comparing rent and ownership costs over the years you expect to stay in the property.",
  };
}

export default function RentVsBuyCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Rent vs Buy Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Rent vs Buy Calculator"
        description="Compare the cost of renting and buying across the years you expect to stay in the property."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>The rent-vs-buy decision is primarily a time-horizon question</h2>
            <p>
              The single most important variable in the rent-vs-buy decision is how long you plan to stay. Buying a home involves significant upfront costs — down payment, closing costs, legal fees, and moving expenses — that typically total 3–6% of the purchase price. These costs need to be amortised over the years you own the property. The shorter the stay, the harder it is for buying to make financial sense.
            </p>
            <p>
              A common rule of thumb is the &quot;5-year rule&quot; — if you plan to stay fewer than 5 years, renting is often cheaper when all costs are considered. Beyond 5 years, buying typically becomes more advantageous, though this varies significantly by local market conditions, interest rates, and property appreciation.
            </p>

            <h2>What this calculator measures</h2>
            <p>
              This calculator focuses on the direct cash costs of each option over your expected stay. For buying, it totals the down payment, monthly mortgage payments, and monthly ownership costs (property taxes, insurance, maintenance). For renting, it totals the monthly rent payments over the same period.
            </p>
            <p>
              This is a simplified model. It does not account for home price appreciation, rent increases over time, the investment return you could earn on the down payment if you rented instead, mortgage interest tax deductions, or the equity you build through mortgage payments. A full financial model would include all of these factors, but this calculator gives you a clear first-pass comparison of the direct costs.
            </p>

            <h2>Hidden costs of homeownership</h2>
            <p>
              Many first-time buyers underestimate the ongoing costs of owning a home beyond the mortgage payment. A realistic budget should include:
            </p>
            <p>
              Property taxes typically range from 0.5–2.5% of the home&apos;s value annually depending on location. Homeowner&apos;s insurance averages 0.5–1% of the home&apos;s value per year. Maintenance and repairs average 1–2% of the home&apos;s value annually — older homes and larger properties tend toward the higher end. HOA fees, if applicable, can add $200–$600 per month. These costs can easily add $500–$1,500 per month to the true cost of ownership beyond the mortgage.
            </p>

            <h2>When renting makes more financial sense</h2>
            <p>
              Renting is not always the financially inferior choice. In high-cost markets where price-to-rent ratios are very high, renting and investing the difference can outperform buying over medium-term horizons. Renting also provides flexibility — the ability to move for career opportunities, family changes, or lifestyle preferences without the transaction costs of selling a home.
            </p>
            <p>
              The financial comparison also depends heavily on what you do with the down payment if you rent. If you invest it in a diversified portfolio earning 7–8% annually, the opportunity cost of tying up capital in a home becomes significant. This calculator does not model this scenario, but it is worth considering in your overall decision.
            </p>
          </div>
        }
      >
        <RentVsBuyCalculator />
      </ToolPageScaffold>
    </>
  );
}
