import type { HubContent } from "./types";

export const realEstateHub: HubContent = {
  path: "/real-estate",
  label: "Real Estate Tools",
  metaTitle: "Property Calculators: Stamp Duty, Transfer Tax & Rental Yield",
  metaDescription:
    "Free property calculators for stamp duty and transfer tax in the UK, Scotland, Wales, NSW, Singapore, Hong Kong, NYC and Toronto, plus cap rate, rental yield and rent-vs-buy tools.",
  h1: "Property calculators for buyers, sellers and investors",
  lead:
    "Estimate the purchase taxes on a property, check whether a rental stacks up, or test whether buying beats renting. Each tax calculator follows the rate bands and reliefs of its own jurisdiction.",
  notice:
    "Property tax rules change with government budgets and can depend on your residency, how many homes you own and the buyer type. Use these results to plan, then confirm with your conveyancer, solicitor or the tax authority.",
  intro: [
    "Purchase taxes are often the biggest upfront cost after the deposit, and they vary a lot by location. A first-time buyer in England, a second-home buyer in Scotland and a foreign buyer in Singapore can face very different bills on the same price. These calculators apply each jurisdiction's bands, surcharges and first-time-buyer reliefs and show which band each part of the price falls into.",
    "For investors, the second group covers the core return metrics: gross and net rental yield, capitalisation rate and cash-on-cash return. They answer different questions. Yield and cap rate compare properties regardless of how they're financed, while cash-on-cash shows the return on the money you actually put in.",
  ],
  groups: [
    {
      heading: "Stamp duty and property transfer taxes",
      intro:
        "Calculate the tax due on a property purchase, including surcharges for additional homes and non-residents and reliefs for first-time buyers.",
      hrefs: [
        "/real-estate/uk-stamp-duty-calculator",
        "/real-estate/scotland-lbtt-calculator",
        "/real-estate/wales-ltt-calculator",
        "/real-estate/stamp-duty-calculator-nsw",
        "/finance/australia-stamp-duty-calculator",
        "/real-estate/singapore-property-stamp-duty-calculator",
        "/real-estate/singapore-buyers-stamp-duty-calculator",
        "/real-estate/singapore-sellers-stamp-duty-calculator",
        "/real-estate/hong-kong-stamp-duty-calculator",
        "/real-estate/nyc-transfer-tax-calculator",
        "/real-estate/land-transfer-tax-calculator-toronto",
      ],
    },
    {
      heading: "Rental and investment returns",
      intro:
        "Compare investment properties on yield, cap rate and the cash return on your deposit, and normalise listing prices to price per square foot.",
      hrefs: [
        "/real-estate/rental-yield-calculator",
        "/real-estate/cap-rate-calculator",
        "/real-estate/cash-on-cash-return-calculator",
        "/real-estate/price-per-square-foot-calculator",
      ],
    },
    {
      heading: "Affordability and buying decisions",
      intro:
        "Find out how much you can borrow under lender stress tests, and whether buying beats renting over the time you plan to stay.",
      hrefs: [
        "/real-estate/house-affordability-calculator-canada",
        "/real-estate/mortgage-qualifier-canada",
        "/finance/house-affordability-calculator-australia",
        "/real-estate/rent-vs-buy-calculator",
        "/finance/halal-mortgage-calculator",
        "/finance/pmi-calculator",
      ],
    },
  ],
  methodology: {
    heading: "How the property calculators work",
    points: [
      {
        title: "Band-by-band breakdown",
        body: "Progressive taxes such as SDLT, LBTT and LTT are calculated slice by slice, and the result shows how much tax each band adds.",
      },
      {
        title: "Buyer type matters",
        body: "Where the law treats buyers differently (first-time buyers, additional homes, non-residents, companies), the calculator asks for it and applies the right rate.",
      },
      {
        title: "Investor metrics defined",
        body: "Each return calculator states its formula, for example net operating income divided by price for cap rate, so you can compare like with like.",
      },
      {
        title: "No sign-up, no data kept",
        body: "Prices and incomes you enter stay in your browser.",
      },
    ],
  },
  guides: [
    { title: "UK residential stamp duty rates", href: "/blog/residential-stamp-duty-rates-uk" },
    { title: "First-time buyer stamp duty relief (UK)", href: "/blog/first-time-buyer-stamp-duty-relief-uk" },
    { title: "Stamp duty on second homes (UK)", href: "/blog/uk-stamp-duty-second-home-guide" },
    { title: "Buy-to-let stamp duty guide (UK)", href: "/blog/buy-to-let-stamp-duty-guide-uk" },
    { title: "SDLT vs stamp duty: what's the difference?", href: "/blog/what-is-sdlt-vs-stamp-duty" },
    { title: "NYC closing costs guide", href: "/blog/nyc-closing-costs-2025" },
    { title: "Who pays transfer tax in NYC?", href: "/blog/who-pays-transfer-tax-nyc" },
    { title: "NYC condo vs co-op closing costs", href: "/blog/nyc-condo-vs-coop-closing-costs" },
    { title: "NYC sponsor sale closing costs", href: "/blog/nyc-sponsor-sales-closing-costs" },
    { title: "NYC investment property transfer tax", href: "/blog/nyc-investment-property-transfer-tax" },
  ],
  faqs: [
    {
      question: "Is stamp duty the same in England, Scotland and Wales?",
      answer:
        "No. England and Northern Ireland use Stamp Duty Land Tax (SDLT), Scotland uses Land and Buildings Transaction Tax (LBTT) and Wales uses Land Transaction Tax (LTT). Each has its own bands, first-time buyer rules and surcharge for additional homes, which is why there are separate calculators.",
    },
    {
      question: "Who pays transfer tax: the buyer or the seller?",
      answer:
        "It depends on the jurisdiction. In the UK, Australia, Singapore and Hong Kong the buyer normally pays stamp duty. In New York City the seller usually pays the city and state transfer taxes, though the buyer pays the mansion tax and pays the transfer taxes on most new-development sponsor sales.",
    },
    {
      question: "What's the difference between rental yield and cap rate?",
      answer:
        "Gross rental yield is annual rent divided by property price. Cap rate uses net operating income (rent minus operating costs such as management, insurance and maintenance, but not mortgage payments) divided by price. Cap rate is the better measure for comparing properties with different running costs.",
    },
    {
      question: "Do these calculators include legal fees and other closing costs?",
      answer:
        "The tax calculators focus on the government tax. The guides above cover the other closing costs (legal, survey, lender and registration fees) for the UK and NYC markets.",
    },
  ],
};
