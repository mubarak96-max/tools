import type { Metadata } from "next";
import RentVsBuyCalculator from "@/components/RentVsBuyCalculator";
import { Landmark, TrendingUp, Home, Wrench } from "lucide-react";

// ─── SEO metadata ──────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Rent vs Buy Calculator — With Mortgage Interest Tax Deductions",
  description:
    "Should you rent or buy a house? Our rent vs buy calculator factors in mortgage interest tax savings, property appreciation, opportunity cost, and the SALT deduction cap. Free, no sign-up.",
  keywords: [
    "rent vs buy calculator",
    "rent versus buy calculator",
    "rent or buy calculator",
    "renting vs buying a house",
    "should i rent or buy a house",
    "buy or rent a house",
    "buying vs renting a home",
    "mortgage interest tax deduction calculator",
    "rent or buy break even",
  ],
  openGraph: {
    title: "Rent vs Buy Calculator — Mortgage Interest Tax Deductions Included",
    description:
      "See whether renting or buying wins after tax savings, opportunity cost, and home appreciation. Includes US mortgage interest deduction and SALT cap.",
    url: "https://yourdomain.com/rent-vs-buy-calculator",
  },
  alternates: {
    canonical: "https://yourdomain.com/rent-vs-buy-calculator",
  },
};

// ─── Schema ────────────────────────────────────────────────────────
const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Rent vs Buy Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free rent vs buy calculator with mortgage interest tax deduction modelling, opportunity cost analysis, and year-by-year net worth comparison.",
};

// ─── Content data ──────────────────────────────────────────────────
const FACTORS = [
  {
    title: "Mortgage interest tax deduction",
    icon: <Landmark className="w-6 h-6 text-primary" />,
    body: "US homeowners who itemise can deduct interest paid on up to $750,000 of mortgage debt. In early loan years when interest is highest, this deduction can be worth thousands of dollars annually — meaningfully reducing the true cost of buying. Our calculator models this precisely, including the $10,000 SALT cap on property tax deductions and the break-even point against the standard deduction.",
  },
  {
    title: "Opportunity cost of the down payment",
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
    body: "A 20% down payment on a $450,000 home is $90,000 out of your pocket upfront. If that money were invested in a diversified portfolio returning 7% annually, it would grow to over $176,000 in 10 years. A thorough rent or buy calculator must account for this — it's one of the most common reasons renting wins on shorter time horizons.",
  },
  {
    title: "Home appreciation vs rent inflation",
    icon: <Home className="w-6 h-6 text-primary" />,
    body: "Homes have historically appreciated at roughly 3–4% annually in the US (National Association of Realtors data), while rents have grown at similar rates. But appreciation compounds your equity, while rent inflation only compounds your cost. Over a 20–30 year horizon, appreciation typically swings the math decisively in favour of buying.",
  },
  {
    title: "Hidden costs of homeownership",
    icon: <Wrench className="w-6 h-6 text-primary" />,
    body: "Maintenance (typically 1% of home value annually), insurance, HOA fees, and selling costs (5–6% in agent commissions and closing fees) are frequently underestimated. A home worth $500,000 can cost $5,000–$8,000 per year in upkeep alone — costs that renters never face. These are built into every scenario in this calculator.",
  },
];

const FAQS = [
  {
    q: "Should I rent or buy a house right now?",
    a: "There's no universal answer — it depends on how long you plan to stay, your local market, and what you'd do with the money you don't put into a down payment. This calculator lets you model your specific numbers. As a rule of thumb, buying vs renting a home tends to favour buying if you plan to stay for 5 or more years. Below that threshold, transaction costs (closing costs in, selling costs out) often eat any equity gains, and renting with investing the savings frequently wins.",
  },
  {
    q: "How does the mortgage interest tax deduction work?",
    a: "US taxpayers can deduct mortgage interest paid on qualified home loans up to $750,000 (the limit set by the 2017 Tax Cuts and Jobs Act; $1 million for loans originated before December 16, 2017). To benefit, you must itemise deductions rather than take the standard deduction ($14,600 single / $29,200 married filing jointly in 2024). In practice, many homeowners — especially those with smaller mortgages or in low-tax states — find the standard deduction exceeds their itemised total, meaning they see no net tax benefit from mortgage interest. This calculator shows both scenarios.",
  },
  {
    q: "What is the SALT deduction cap and how does it affect homeowners?",
    a: "SALT stands for State and Local Taxes. The TCJA capped the deduction for state income tax, local income tax, and property tax combined at $10,000 per year ($5,000 married filing separately). Before 2018, there was no cap. This hits hardest in high-tax states like California, New York, and New Jersey, where property taxes alone can exceed $10,000 — meaning the excess is not deductible. Our calculator applies the $10,000 SALT cap to all property tax deduction calculations.",
  },
  {
    q: "What's a realistic home appreciation rate to use?",
    a: "The US national average for home price appreciation is roughly 3–4% per year over long historical periods (Federal Housing Finance Agency data). However, appreciation varies dramatically by location — coastal metros like San Francisco and New York have historically appreciated at 5–7%+, while some Midwest markets have seen 1–2%. Use your local market's historical rate as a starting point, and run the calculator at both a conservative (2%) and optimistic (5%) rate to see how sensitive the outcome is.",
  },
  {
    q: "Why does the calculator account for investment returns?",
    a: "When buying vs renting a home, the down payment is a large lump sum that could alternatively be invested. If a renter puts that same money into an index fund and earns 7% annually, the compounding return is a real economic benefit of renting. A genuine rent versus buy calculator must include this opportunity cost — ignoring it artificially favours buying. You can adjust the assumed investment return to match your own risk tolerance and expected portfolio performance.",
  },
  {
    q: "How long does it take for buying to break even vs renting?",
    a: "The break-even point — where buying surpasses renting in terms of net worth — typically falls between 4 and 8 years in most US markets, though it can be much longer in expensive cities with high property taxes and low appreciation. Transaction costs (closing costs of 2–5% when buying, agent fees of 5–6% when selling) mean the first few years almost always favour renting. Use the calculator with your specific numbers and drag the time horizon slider to see exactly when the lines cross.",
  },
  {
    q: "Does renting vs buying a house affect my credit score?",
    a: "A mortgage, paid on time, is one of the most powerful ways to build credit. It adds a long-tenure installment loan to your credit file and demonstrates consistent payment history. Renting does not directly affect your credit score, though some services (Experian Boost, for example) allow rent payments to be reported. From a credit-building perspective, buying an advantage — but this is a small factor compared to the financial variables this calculator measures.",
  },
  {
    q: "Should I include PMI in my calculations?",
    a: "If your down payment is less than 20%, most conventional lenders will require Private Mortgage Insurance (PMI), which typically costs 0.5–1.5% of the loan amount annually. PMI is usually removed automatically when your LTV drops to 78%. You can model this by temporarily increasing your maintenance/costs percentage in the calculator for the years until you'd expect PMI to fall off. A future version of this tool will include a dedicated PMI field.",
  },
];

const SCENARIOS = [
  {
    title: "Short-term stay (3–5 years)",
    verdict: "Usually favours renting",
    color: "border-blue-200 bg-blue-50",
    badgeColor: "bg-blue-100 text-blue-800",
    reasoning:
      "Closing costs (2–5%) plus selling costs (5–6%) total up to 11% of the home price — all of which you pay before any equity benefit. Unless appreciation is rapid and mortgage rates are low, a 3-year hold rarely recovers these transaction costs. Renting and investing the down payment nearly always wins at this horizon.",
  },
  {
    title: "Medium-term stay (7–12 years)",
    verdict: "Depends on market & rate",
    color: "border-amber-200 bg-amber-50",
    badgeColor: "bg-amber-100 text-amber-800",
    reasoning:
      "This is the contested zone. Appreciation begins to compound meaningfully. Tax savings accumulate. Equity builds. But rising rent inflation also starts to hurt renters. Run this calculator with your actual rent, home price, and local appreciation rate — the answer will differ significantly between markets.",
  },
  {
    title: "Long-term stay (15+ years)",
    verdict: "Usually favours buying",
    color: "border-emerald-200 bg-emerald-50",
    badgeColor: "bg-emerald-100 text-emerald-800",
    reasoning:
      "Over 15–30 years, buying almost always wins. Rent inflation compounds relentlessly while mortgage payments (on a fixed-rate loan) stay flat. Equity grows. The mortgage eventually pays off entirely. And when you sell, the $250,000/$500,000 capital gains exclusion often makes the gain tax-free. Renting for 30 years means 30 years of escalating payments with no asset to show for it.",
  },
];

// ─── Sub-components ────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold text-stone-900 mb-4 mt-12">{children}</h2>;
}
function Prose({ children }: { children: React.ReactNode }) {
  return <p className="text-stone-600 leading-relaxed mb-4 text-[15px]">{children}</p>;
}

// ─── Page ──────────────────────────────────────────────────────────
export default function RentVsBuyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="max-w-5xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            Includes mortgage interest tax deduction · Free · No sign-up
          </div>
          <h1 className="text-4xl font-bold text-stone-900 leading-tight mb-3">
            Rent vs Buy Calculator
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed">
            The most complete rent or buy calculator online. Model mortgage interest tax savings,
            opportunity cost of the down payment, home appreciation, and rent inflation — all in
            one place. Find out exactly when buying vs renting a home tips in your favour.
          </p>
        </div>

        {/* Calculator */}
        <RentVsBuyCalculator />

        {/* ── CONTENT ── */}

        <SectionHeading>
          Renting vs buying a house: why the answer isn't simple
        </SectionHeading>
        <Prose>
          The question of whether to rent or buy a house is one of the most financially significant
          decisions most people ever make — and one of the most frequently oversimplified. Headlines
          alternate between "buying is always better" and "renting is throwing money away" with
          little nuance. The truth is that the right answer depends on your time horizon, your local
          market, prevailing mortgage rates, what you'd do with the down payment otherwise, and
          your marginal tax rate.
        </Prose>
        <Prose>
          A genuine rent versus buy calculator has to account for both sides of the ledger honestly.
          Buying comes with equity accumulation, inflation-protected fixed payments, and meaningful
          tax savings on mortgage interest. But it also comes with transaction costs, maintenance
          bills, property taxes, and a large illiquid down payment that could otherwise be growing
          in a market portfolio. This calculator models all of it.
        </Prose>

        {/* Key factors */}
        <SectionHeading>The four factors that swing the rent or buy decision</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {FACTORS.map((f) => (
            <div key={f.title} className="border border-stone-200 rounded-2xl p-5">
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-base font-semibold text-stone-900 mb-2">{f.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>

        {/* Tax deduction explainer */}
        <SectionHeading>
          How mortgage interest tax savings change the maths
        </SectionHeading>
        <Prose>
          One dimension of buying vs renting a home that is consistently underestimated is the
          cumulative value of the mortgage interest deduction. In the early years of a 30-year
          mortgage, the vast majority of each monthly payment is interest rather than principal.
          On a $360,000 loan at 6.5%, you pay roughly $23,000 in interest in year one alone.
          At a 24% marginal federal tax rate, that's a $5,520 reduction in your tax bill — if
          you itemise.
        </Prose>
        <Prose>
          The critical caveat is whether itemising makes sense for your situation. Since the 2017
          Tax Cuts and Jobs Act nearly doubled the standard deduction, fewer taxpayers benefit from
          itemising. A single filer with a $300,000 mortgage in a low-tax state may find their
          total itemised deductions — mortgage interest plus the $10,000 SALT cap — are still below
          the $14,600 standard deduction, yielding zero marginal benefit. Our calculator handles
          both cases: select "US — Always itemise" if you're confident you'll itemise, or
          "US — Standard deduction" to see only the marginal benefit above the threshold.
        </Prose>
        <Prose>
          The property tax deduction adds further complexity. The SALT (State and Local Tax) cap,
          introduced in 2018, limits the deduction for all state and local taxes combined —
          including property tax — to $10,000 per year. In high-tax states like California,
          New York, and New Jersey, annual property taxes on a median-priced home can easily
          exceed this cap, meaning the overage is not deductible. This calculator applies the
          $10,000 SALT cap in all US scenarios.
        </Prose>

        <SectionHeading>The Price-to-Rent Ratio: Your First Diagnostic Tool</SectionHeading>
        <Prose>
          Before diving into the complex math of this calculator, many real estate investors look at the <strong>Price-to-Rent Ratio</strong>. This is a quick-and-dirty metric that helps you understand whether a local market is fundamentally "overpriced" or "underpriced" relative to renting. To calculate it, simply divide the median home price by the median annual rent.
        </Prose>
        <div className="my-8 p-8 bg-stone-900 rounded-[2rem] text-white">
            <h4 className="text-xl font-bold mb-6">Price-to-Rent Benchmarks</h4>
            <div className="grid sm:grid-cols-3 gap-8">
                <div>
                    <p className="text-primary font-bold text-2xl mb-1">1 to 15</p>
                    <p className="text-sm font-semibold">Decisively Buy</p>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">The cost of buying is low relative to rent. You will likely break even in 3 years or less.</p>
                </div>
                <div>
                    <p className="text-primary font-bold text-2xl mb-1">16 to 20</p>
                    <p className="text-sm font-semibold">The Toss-Up Zone</p>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">Tax deductions and appreciation will decide the winner. Use this calculator for a precise breakdown.</p>
                </div>
                <div>
                    <p className="text-primary font-bold text-2xl mb-1">21+</p>
                    <p className="text-sm font-semibold">Decisively Rent</p>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">Markets like San Francisco or NYC often hit 30+. Renting is almost always cheaper unless you stay for 15+ years.</p>
                </div>
            </div>
        </div>

        <SectionHeading>Interest Rate Sensitivity: Why 1% Matters So Much</SectionHeading>
        <Prose>
          The most volatile variable in the rent vs buy equation is the <strong>mortgage interest rate</strong>. Because most buyers use leverage, a small move in interest rates has a disproportionate impact on the "cost of buying." As a general rule of thumb, every 1% increase in interest rates reduces your purchasing power by roughly 10% for the same monthly payment.
        </Prose>
        <Prose>
          In a high-rate environment, the "interest paid" component of your mortgage payment grows so large that it can outweigh the benefits of equity accumulation for several years. This shifts the break-even point further into the future. For example, at a 3% mortgage rate, buying might beat renting after 4 years. At a 7% rate, that same house might take 9 years to break even against the same rent.
        </Prose>

        <SectionHeading>The Hidden Trap: Property Tax Assessments</SectionHeading>
        <Prose>
          One of the most common errors users make when comparing renting vs buying is using the <em>current owner's</em> property tax bill as their input. In many jurisdictions (such as New York, California with Proposition 13, or Florida with Save Our Homes), property taxes are capped for long-term owners.
        </Prose>
        <Prose>
          When the property is sold, the tax is often <strong>reassessed at the new purchase price</strong>. This means your property tax bill could be 50% or even 100% higher than the previous owner's bill. If you don't account for this "tax jump," you will significantly underestimate the cost of buying. Always verify the local reassessment rules with your attorney or real estate agent before making a decision.
        </Prose>

        {/* Scenarios */}
        <SectionHeading>Rent or buy by time horizon</SectionHeading>
        <Prose>
          The single most important variable in any rent or buy analysis is how long you plan to
          stay. Transaction costs — closing costs when buying, agent commissions and transfer taxes
          when selling — mean that a short hold almost never makes buying worthwhile.
        </Prose>
        <div className="space-y-4 mb-6">
          {SCENARIOS.map((s) => (
            <div key={s.title} className={`border rounded-2xl p-5 ${s.color}`}>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-base font-semibold text-stone-900">{s.title}</h3>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.badgeColor}`}>
                  {s.verdict}
                </span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">{s.reasoning}</p>
            </div>
          ))}
        </div>

        <SectionHeading>The Capital Gains Exclusion: Your Ultimate Tax Shield</SectionHeading>
        <Prose>
          One massive benefit of buying that isn't captured in your monthly payment is the <strong>Section 121 Exclusion</strong>. Under current US tax law, if you have owned and lived in your home as a primary residence for at least two of the last five years, you can exclude up to <strong>$250,000 (single) or $500,000 (married filing jointly)</strong> of gain from the sale of your home from your income.
        </Prose>
        <Prose>
          This is essentially a tax-free investment. A renter who invests $100k in the S&P 500 and makes $500k in profit will owe 15-20% in capital gains tax. A homeowner who makes that same $500k in appreciation pays $0 in taxes. This "tax-free growth" is one of the primary reasons buying wins over long time horizons.
        </Prose>

        {/* What calculator models */}
        <SectionHeading>What this rent versus buy calculator models</SectionHeading>
        <Prose>
          Most online rent or buy tools make one of two mistakes: they ignore the opportunity cost
          of the down payment (overstating the case for buying), or they ignore the equity
          accumulation and tax savings (overstating the case for renting). This calculator is
          designed to be genuinely neutral and complete.
        </Prose>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-stone-50 border border-stone-200">
                <th className="text-left py-2.5 px-4 text-xs font-medium text-stone-500">Variable</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-stone-500">Buying model</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-stone-500">Renting model</th>
              </tr>
            </thead>
            <tbody className="border border-stone-200">
              {[
                ["Upfront capital", "Down payment (3–20%+)", "First month + deposit (low)"],
                ["Monthly payment", "Mortgage P+I, property tax, insurance, maintenance, HOA", "Rent + renter's insurance"],
                ["Tax treatment", "Mortgage interest deduction, SALT cap, itemise vs standard", "No deductions (renters have no property-related deductions)"],
                ["Capital growth", "Home appreciation on full value", "Investment return on down payment + monthly savings"],
                ["Inflation protection", "Fixed mortgage payment (on fixed-rate loan)", "Rent increases annually"],
                ["Transaction costs", "Closing costs in (2–5%) + selling costs out (5–6%)", "None"],
                ["Exit value", "Net sale proceeds minus remaining balance", "Investment portfolio value"],
                ["Net worth calculation", "Home equity minus cumulative net costs", "Portfolio value minus cumulative rent paid"],
              ].map(([v, buy, rent]) => (
                <tr key={v as string} className="border-b border-stone-100 last:border-0">
                  <td className="py-2.5 px-4 text-stone-500 text-xs font-medium">{v}</td>
                  <td className="py-2.5 px-4 text-stone-700 text-xs">{buy}</td>
                  <td className="py-2.5 px-4 text-stone-700 text-xs">{rent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <SectionHeading>Frequently asked questions</SectionHeading>
        <div className="space-y-3">
          {FAQS.concat([
              {
                  q: "What is the 'forced savings' benefit of a mortgage?",
                  a: "A mortgage payment consists of both interest (a cost) and principal (equity). Paying principal is essentially a forced savings plan. A renter must have the discipline to invest their monthly savings to match this equity growth. For many people, the 'forced' nature of a mortgage is a primary driver of long-term wealth building."
              },
              {
                  q: "Should I wait for interest rates to drop before buying?",
                  a: "If you wait for rates to drop, you may face increased competition and higher home prices as other buyers return to the market. This is known as 'buying the rate vs. buying the price.' Often, it is better to buy the price (when competition is lower) and refinance the rate later if they drop."
              },
              {
                  q: "Does the calculator account for the 'Cost of Capital'?",
                  a: "Yes. By including the 'Investment Return' field, we account for the cost of tying up your capital in a home rather than in a liquid, diversified investment portfolio."
              },
              {
                  q: "How does the 'Standard Deduction' impact my tax savings?",
                  a: "If your total itemized deductions (mortgage interest + property tax + charity) are less than the standard deduction ($14,600 single / $29,200 married), you get zero tax benefit from buying. Our calculator has a specific mode to show you exactly how much 'marginal' benefit you get once you cross that threshold."
              }
          ]).map((faq) => (
            <details
              key={faq.q}
              className="group border border-stone-200 rounded-xl overflow-hidden"
            >
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

        {/* Related Tools */}
        <div className="mt-16 border-t border-stone-200 pt-16">
          <h2 className="text-2xl font-semibold text-stone-900 mb-8">Related Real Estate Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "NYC Transfer Tax",
                href: "/real-estate/nyc-transfer-tax-calculator",
                desc: "Estimate NYC and NYS transfer taxes for residential and commercial deals.",
                icon: <Landmark className="w-5 h-5 text-primary" />,
              },
              {
                name: "Price per SQFT",
                href: "/real-estate/price-per-square-foot-calculator",
                desc: "Quickly calculate and compare property values using square footage.",
                icon: <TrendingUp className="w-5 h-5 text-primary" />,
              },
              {
                name: "UK Stamp Duty",
                href: "/real-estate/uk-stamp-duty-calculator",
                desc: "Calculate SDLT for property purchases in England and Northern Ireland.",
                icon: <Home className="w-5 h-5 text-primary" />,
              },
            ].map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className="group p-6 border border-stone-200 rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-stone-50 rounded-lg group-hover:bg-primary/5 transition-colors">
                    {tool.icon}
                  </div>
                  <h3 className="font-bold text-stone-900 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                </div>
                <p className="text-sm text-stone-500 leading-relaxed">{tool.desc}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 p-6 bg-stone-50 rounded-2xl border border-stone-200">
          <p className="text-xs text-stone-500 leading-relaxed">
            <strong className="text-stone-700">Disclaimer:</strong> This calculator is for
            illustrative and educational purposes only and does not constitute financial,
            tax, or legal advice. Tax rules, deduction limits, and standard deduction amounts
            change annually — verify current figures with the IRS or a qualified tax professional.
            Investment return assumptions are not guaranteed. Past home appreciation does not
            guarantee future results. Always consult a licensed financial adviser before making
            major real estate or investment decisions.
          </p>
        </div>

      </main>
    </>
  );
}
