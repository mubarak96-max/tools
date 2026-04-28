import type { Metadata } from "next";
import HouseAffordabilityCalculator from "@/components/HouseAffordabilityCalculator";

// ─── SEO metadata ──────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "House Affordability Calculator Australia — How Much Can I Borrow?",
  description:
    "Free house affordability calculator for Australia. Calculate stamp duty by state, LMI, FHOG, monthly repayments and borrowing capacity with the APRA 3% serviceability buffer. Accurate 2024 rates for all states.",
  keywords: [
    "house affordability calculator australia",
    "how much can i borrow australia",
    "home loan affordability calculator",
    "stamp duty calculator australia",
    "mortgage affordability calculator australia",
    "first home buyer calculator australia",
    "how much deposit do i need to buy a house australia",
    "lmi calculator australia",
    "borrowing capacity calculator australia",
    "can i afford to buy a house australia",
    "home buying costs australia",
    "fhog calculator australia",
  ],
  openGraph: {
    title: "House Affordability Calculator Australia 2024",
    description:
      "See exactly what you can afford, your stamp duty by state, LMI, upfront costs, and monthly repayments. Covers all Australian states and territories.",
    url: "https://findbest.tools/house-affordability-calculator-australia",
  },
  alternates: {
    canonical: "https://findbest.tools/house-affordability-calculator-australia",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "House Affordability Calculator Australia",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  description:
    "Free Australian house affordability calculator with stamp duty, LMI, FHOG, APRA borrowing capacity and monthly repayment estimates for all states.",
  areaServed: "AU",
};

// ─── Content data ──────────────────────────────────────────────────

const STAMP_DUTY_SUMMARY = [
  { state: "NSW",  name: "New South Wales",         fhbExemption: "Full exemption ≤ $800k",    maxRate: "7%",    rate: "$10,530 + 4.5% over $351k" },
  { state: "VIC",  name: "Victoria",                fhbExemption: "Full exemption ≤ $600k",    maxRate: "5.5%",  rate: "$2,870 + 6% over $130k" },
  { state: "QLD",  name: "Queensland",              fhbExemption: "Full concession ≤ $500k",   maxRate: "5.75%", rate: "$1,050 + 3.5% over $75k" },
  { state: "WA",   name: "Western Australia",       fhbExemption: "Full exemption ≤ $430k",    maxRate: "5.1%",  rate: "$9,435 + 5% over $360k" },
  { state: "SA",   name: "South Australia",         fhbExemption: "Exemption new homes ≤ $650k",maxRate: "5.5%", rate: "$21,330 + 5.5% over $500k" },
  { state: "TAS",  name: "Tasmania",                fhbExemption: "50% concession ≤ $600k",    maxRate: "4.5%",  rate: "$12,860 + 4.25% over $375k" },
  { state: "ACT",  name: "Australian Capital Territory", fhbExemption: "Full exemption ≤ $1M", maxRate: "5.4%",  rate: "$31,697 + 5.1% over $1M" },
  { state: "NT",   name: "Northern Territory",      fhbExemption: "$10k discount on new homes", maxRate: "4.95%","rate": "Formula-based below $525k" },
];

const UPFRONT_COSTS = [
  { item: "Stamp duty",              range: "$0–$40,000+",    notes: "Biggest variable — depends on state and price" },
  { item: "Lenders Mortgage Insurance", range: "$0–$25,000+", notes: "Required when LVR > 80%. Can be capitalised." },
  { item: "Conveyancing / legal",    range: "$1,500–$3,000",  notes: "Varies by state and conveyancer" },
  { item: "Building & pest inspection", range: "$400–$800",   notes: "Strongly recommended for houses" },
  { item: "Loan application fees",   range: "$0–$1,000",      notes: "Many lenders waive these" },
  { item: "Moving costs",            range: "$500–$3,000",    notes: "Depends on distance and volume" },
  { item: "Connection / utility setup", range: "$200–$500",   notes: "Power, gas, internet setup" },
  { item: "Immediate repairs/renovations", range: "Varies",   notes: "Budget 1–2% of purchase price as a buffer" },
];

const FAQS = [
  {
    q: "How much can I borrow to buy a house in Australia?",
    a: "Your borrowing capacity in Australia is assessed by lenders under APRA (Australian Prudential Regulation Authority) guidelines. Since October 2021, banks must test that you can afford repayments at your actual interest rate plus a 3% buffer. So if the current rate is 6.25%, the bank assesses you at 9.25%. Beyond the buffer, lenders look at your gross income, existing debts, number of dependants, and living expenses (often compared to the Household Expenditure Measure). As a rough guide, most lenders will approve loans of 5–7 times your annual gross income, but the actual figure depends heavily on your expenses and debt situation.",
  },
  {
    q: "How much deposit do I need to buy a house in Australia?",
    a: "The minimum deposit required is 5% of the property price, but there are important nuances. With less than 20% (LVR above 80%), you must pay Lenders Mortgage Insurance (LMI), which can add tens of thousands to your upfront costs. With exactly 5%, you may qualify for the First Home Guarantee (FHBG), where the government guarantees 15% of the loan so you can avoid LMI without a 20% deposit. In practice, saving 10–20% gives you more lender choice, avoids LMI, and gives you buffer against market fluctuation. You also need to set aside money for stamp duty and other upfront costs on top of your deposit.",
  },
  {
    q: "How is stamp duty calculated in Australia?",
    a: "Stamp duty (also called transfer duty or land transfer duty) is a state government tax on property purchases. Each state and territory has its own rate structure — there is no national rate. It is generally calculated as a percentage of the purchase price or property value, using a tiered system where higher-value properties attract higher rates. Stamp duty on a $750,000 property ranges from approximately $20,000 in QLD to over $30,000 in NSW. Most states offer substantial concessions or full exemptions for first home buyers, typically up to a purchase price threshold of $500,000–$1,000,000 depending on the state.",
  },
  {
    q: "What is LMI and how much does it cost?",
    a: "Lenders Mortgage Insurance (LMI) is insurance that protects the bank — not you — if you default on the loan when the LVR is above 80%. Despite protecting only the lender, the borrower pays the premium. The cost varies by lender, LMI provider (primarily Genworth and QBE), loan amount, and LVR. As a rough guide: at 85% LVR you might pay 0.5–0.7% of the loan; at 90% LVR around 1.2–1.5%; at 95% LVR around 2.5–3%. On an $800,000 loan at 90% LVR, LMI could be $12,000–$15,000. LMI can usually be capitalised into the loan, but this increases your total debt and repayments.",
  },
  {
    q: "What is the First Home Owner Grant (FHOG) in Australia?",
    a: "The First Home Owner Grant (FHOG) is a state government grant for eligible first home buyers purchasing or building a new home. The amount and eligibility criteria vary by state: Queensland currently offers $30,000; Tasmania $30,000; South Australia $15,000; and most other states $10,000. The grant typically applies only to new homes (not established homes in most states) and has a property price cap. The grant is separate from the federal First Home Guarantee (FHBG) scheme, which allows eligible buyers to purchase with a 5% deposit without paying LMI.",
  },
  {
    q: "What percentage of income should my mortgage be in Australia?",
    a: "The commonly cited guideline is that mortgage repayments should not exceed 30% of gross household income — above this is considered housing stress. In Australia's major cities where property is expensive relative to income, many buyers end up above this threshold, particularly in Sydney and Melbourne. APRA's serviceability buffer (3% above the lending rate) effectively means banks stress-test your repayments to a level significantly higher than the actual payment. A repayment-to-income ratio between 25–30% is considered comfortable, 30–35% is stretched but manageable, and above 35% increases financial vulnerability.",
  },
  {
    q: "What ongoing costs should I budget for after buying?",
    a: "Beyond the mortgage, homeowners in Australia should budget for: council rates ($1,000–$3,000+ annually depending on state and property value), home and contents insurance ($900–$2,500 annually), water rates (around $1,000–$1,500 annually), and maintenance (rule of thumb: 1% of property value per year for houses). Apartments also have body corporate (strata) fees ranging from $2,000 to $10,000+ annually depending on the building's facilities. These ongoing costs add $500–$1,500 per month to the true cost of ownership that is often overlooked when calculating affordability.",
  },
  {
    q: "Is it better to buy a house or apartment in Australia?",
    a: "From an affordability perspective, apartments are typically cheaper to purchase but often come with body corporate fees that can significantly add to monthly costs. Houses generally appreciate faster than apartments over the long term in most Australian markets, particularly in capital cities. Apartments may suit buyers with smaller deposits or those prioritising inner-city locations. The right choice depends on your lifestyle, location preferences, long-term goals, and budget for ongoing costs. This calculator includes body corporate fees in ongoing cost estimates for apartments, giving you a clearer total cost comparison.",
  },
];

// ─── Sub-components ────────────────────────────────────────────────
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold text-stone-900 mb-4 mt-12">{children}</h2>;
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-stone-800 mb-2 mt-6">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-stone-600 leading-relaxed mb-4 text-[15px]">{children}</p>;
}

// ─── Page ──────────────────────────────────────────────────────────
export default function HouseAffordabilityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="max-w-5xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            All 8 states & territories · 2024 stamp duty rates · Free
          </div>
          <h1 className="text-4xl font-bold text-stone-900 leading-tight mb-3">
            House Affordability Calculator Australia
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed">
            Find out exactly how much you can borrow, what stamp duty you'll pay in your
            state, whether LMI applies, and what your monthly repayments will be. Includes
            APRA's 3% serviceability buffer, all state stamp duty rates, First Home Owner
            Grant, and full upfront cost breakdown.
          </p>
        </div>

        {/* Calculator */}
        <HouseAffordabilityCalculator />

        {/* ── CONTENT ── */}

        <H2>How much can I afford to spend on a house in Australia?</H2>
        <P>
          Affordability in the Australian property market involves several interconnected
          calculations that lenders, buyers, and financial advisers all approach slightly
          differently. The two most important dimensions are your borrowing capacity — how
          much a bank will lend you — and your actual repayment affordability — how much
          of your monthly income the repayments consume without creating financial stress.
          These are not the same number.
        </P>
        <P>
          Under APRA guidelines, Australian banks must assess mortgage applications using
          an interest rate at least 3 percentage points above the actual loan rate. In
          2024, with variable rates around 6.0–6.5%, this means banks stress-test your
          application at 9.0–9.5%. This buffer was introduced to ensure borrowers can
          handle rate rises. The result is that many buyers are approved for less than
          they might expect — and that the approval limit represents a genuine stress test,
          not a comfortable spending ceiling.
        </P>

        <H3>The 30% housing stress threshold</H3>
        <P>
          Australian policymakers and financial counsellors generally define housing stress
          as spending more than 30% of gross household income on mortgage repayments or
          rent. At current rates, a household earning $150,000 combined should ideally keep
          their monthly mortgage repayment below $3,750. On a 30-year loan at 6.25%, that
          corresponds to a loan of approximately $600,000 — well below median property
          prices in Sydney ($1.4M) and Melbourne ($900k), and closer to affordability in
          Brisbane ($800k), Adelaide ($700k), and Perth ($650k).
        </P>

        <H2>Stamp duty in Australia — all states compared (2024)</H2>
        <P>
          Stamp duty is the single largest variable upfront cost when buying property in
          Australia, and it varies dramatically by state. On a $750,000 property, stamp
          duty ranges from around $20,000 in Queensland to over $30,000 in New South Wales.
          First home buyers receive significant concessions in most states, with full
          exemptions available below certain price thresholds.
        </P>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-green-50 border border-green-100">
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">State</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">FHB exemption</th>
                <th className="text-right py-2.5 px-4 text-xs font-semibold text-stone-600">Top rate</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Mid-range example</th>
              </tr>
            </thead>
            <tbody className="border border-stone-200">
              {STAMP_DUTY_SUMMARY.map((row) => (
                <tr key={row.state} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                  <td className="py-2.5 px-4">
                    <span className="font-semibold text-stone-800 text-xs">{row.state}</span>
                    <span className="text-stone-400 text-xs ml-1.5">{row.name}</span>
                  </td>
                  <td className="py-2.5 px-4 text-xs text-emerald-700">{row.fhbExemption}</td>
                  <td className="py-2.5 px-4 text-right font-semibold text-stone-700 text-xs">{row.maxRate}</td>
                  <td className="py-2.5 px-4 text-xs text-stone-500">{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          Use the calculator above to get the precise stamp duty figure for your state and
          purchase price, including any first home buyer concession that applies.
        </P>

        <H2>Full upfront costs of buying a house in Australia</H2>
        <P>
          Stamp duty is the headline upfront cost, but several other expenses add up
          quickly when purchasing property. Buyers should budget for all of these before
          committing to a purchase price:
        </P>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-stone-50 border border-stone-200">
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Cost item</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Typical range</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Notes</th>
              </tr>
            </thead>
            <tbody className="border border-stone-200">
              {UPFRONT_COSTS.map((row) => (
                <tr key={row.item} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                  <td className="py-2.5 px-4 font-medium text-stone-800 text-xs">{row.item}</td>
                  <td className="py-2.5 px-4 font-semibold text-stone-700 text-xs">{row.range}</td>
                  <td className="py-2.5 px-4 text-stone-500 text-xs">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <P>
          A common mistake for first home buyers is to calculate the deposit as 10–20% of
          the purchase price without accounting for these additional upfront costs. On a
          $700,000 property with a 10% deposit ($70,000), the stamp duty alone in Victoria
          is around $37,000, leaving just $33,000 as the actual deposit — an LVR of 95%,
          which would trigger significant LMI costs. Always calculate available deposit
          <em> after</em> deducting all upfront costs.
        </P>

        <H2>Frequently asked questions</H2>
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group border border-stone-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer px-4 py-3.5 text-sm font-medium text-stone-800 list-none select-none hover:bg-stone-50">
                {faq.q}
                <span className="text-stone-400 ml-3 flex-shrink-0 group-open:rotate-45 transition-transform duration-150">+</span>
              </summary>
              <div className="px-4 pb-4 pt-1 text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        <H2>Related Finance & Real Estate Tools</H2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {[
            {
              title: "Australia Stamp Duty Calculator",
              desc: "Calculate precise stamp duty costs for any state or territory.",
              href: "/finance/australia-stamp-duty-calculator",
            },
            {
              title: "Income Tax Calculator Australia",
              desc: "Estimate your take-home pay and tax obligations in Australia.",
              href: "/finance/income-tax-calculator-australia",
            },
            {
              title: "Rent vs Buy Calculator",
              desc: "Compare the long-term financial impact of renting versus buying.",
              href: "/real-estate/rent-vs-buy-calculator",
            },
            {
              title: "Rental Yield Calculator",
              desc: "Calculate the return on investment for your rental property.",
              href: "/real-estate/rental-yield-calculator",
            },
          ].map((tool) => (
            <a
              key={tool.href}
              href={tool.href}
              className="block p-4 bg-white border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-sm transition-all group"
            >
              <h4 className="text-sm font-semibold text-stone-800 group-hover:text-green-700 mb-1">
                {tool.title}
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                {tool.desc}
              </p>
            </a>
          ))}
        </div>

        <div className="mt-10 p-4 bg-stone-50 rounded-xl border border-stone-200">
          <p className="text-xs text-stone-500 leading-relaxed">
            <strong className="text-stone-700">Disclaimer:</strong> This calculator provides
            estimates for informational purposes only. Stamp duty rates, first home buyer
            concessions, FHOG amounts, and LMI premiums change frequently — always verify
            current figures with your state revenue office and lender before making decisions.
            Borrowing capacity estimates are indicative only; actual approval depends on your
            lender's credit policy, credit history, employment status, and full financial
            assessment. This tool does not constitute financial or mortgage advice. Consult
            a licensed mortgage broker or financial adviser before proceeding.
          </p>
        </div>

      </main>
    </>
  );
}
