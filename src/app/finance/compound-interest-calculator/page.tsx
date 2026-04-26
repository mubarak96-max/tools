import type { Metadata } from "next";
import CompoundInterestCalculator from "@/components/CompoundInterestCalculator";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

// ─── SEO ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Compound Interest Calculator with Monthly Contributions",
  description:
    "Free compound interest calculator with monthly contributions. See how regular deposits grow over time with daily, monthly, or annual compounding. Includes inflation-adjusted real value, yearly schedule, and rate comparison.",
  keywords: [
    "compound interest calculator with monthly contributions",
    "compound interest calculator",
    "compound interest with monthly deposits",
    "monthly contribution investment calculator",
    "how does compound interest work",
    "compound interest formula",
    "daily vs monthly compounding calculator",
    "investment growth calculator",
    "future value calculator with contributions",
    "how much will my investment grow",
    "rule of 72 calculator",
  ],
  openGraph: {
    title: "Compound Interest Calculator with Monthly Contributions",
    description:
      "See exactly how your money grows with compound interest and regular monthly contributions. Yearly schedule, inflation adjustment, and rate comparison included.",
    url: "https://yourdomain.com/compound-interest-calculator",
  },
  alternates: {
    canonical: "https://yourdomain.com/compound-interest-calculator",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Compound Interest Calculator with Monthly Contributions",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free compound interest calculator with monthly contributions, inflation adjustment, multiple compounding frequencies, and full yearly schedule.",
};

// ─── Content data ──────────────────────────────────────────────────

const COMPOUNDING_TABLE = [
  { frequency: "Daily", n: "365", example10k: "$20,138", note: "Best for savings accounts and money market funds" },
  { frequency: "Monthly", n: "12", example10k: "$20,097", note: "Common for investment accounts and ISAs" },
  { frequency: "Quarterly", n: "4", example10k: "$20,016", note: "Common for some bonds and GICs" },
  { frequency: "Semi-annual", n: "2", example10k: "$19,990", note: "Common for government bonds" },
  { frequency: "Annually", n: "1", example10k: "$19,672", note: "Baseline — used in simple compound interest" },
];

const SCENARIOS = [
  {
    title: "The early starter",
    age: "Starts at 22, retires at 65",
    initial: "$5,000",
    monthly: "$200/month",
    rate: "7%",
    result: "~$680,000",
    years: 43,
    color: "border-emerald-200 bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-800",
    lesson: "Starting early is the single most powerful factor in wealth building. 43 years of compounding does the heavy lifting — the total deposited is only around $108,600.",
  },
  {
    title: "The late starter",
    age: "Starts at 40, retires at 65",
    initial: "$20,000",
    monthly: "$500/month",
    rate: "7%",
    result: "~$430,000",
    years: 25,
    color: "border-blue-200 bg-blue-50",
    badge: "bg-blue-100 text-blue-800",
    lesson: "Starting later requires much larger contributions to compensate for lost time. Despite depositing more per month, the final balance is significantly lower — 18 fewer years of compounding costs dearly.",
  },
  {
    title: "The lump-sum investor",
    age: "One-time investment, 30 years",
    initial: "$50,000",
    monthly: "$0/month",
    rate: "8%",
    result: "~$503,000",
    years: 30,
    color: "border-amber-200 bg-amber-50",
    badge: "bg-amber-100 text-amber-800",
    lesson: "A single large initial investment with no monthly contributions can still build significant wealth over 30 years. The $50,000 grows 10× entirely through compound interest.",
  },
];

const FAQS = [
  {
    q: "What is compound interest and how does it work?",
    a: "Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest — which is only ever calculated on the original principal — compound interest causes your balance to grow exponentially over time. The core mechanism is that each period's interest becomes part of the base for the next period's calculation. A $10,000 deposit at 7% annual interest earns $700 in year one, bringing the balance to $10,700. In year two, the 7% is applied to $10,700 — not the original $10,000 — earning $749. This 'interest on interest' effect compounds on itself every period, which is why Albert Einstein is often (perhaps apocryphally) credited with calling compound interest the eighth wonder of the world.",
  },
  {
    q: "What is the compound interest formula?",
    a: "The standard compound interest formula is A = P × (1 + r/n)^(n×t), where A is the final amount, P is the principal (starting balance), r is the annual interest rate as a decimal (e.g. 0.07 for 7%), n is the number of times interest compounds per year, and t is the number of years. When you add regular contributions (monthly deposits), the formula extends to include the future value of an annuity: FV = PMT × [((1 + r/n)^(n×t) − 1) / (r/n)], where PMT is the payment per period. The total future value is the sum of both components.",
  },
  {
    q: "How do monthly contributions affect compound interest growth?",
    a: "Monthly contributions dramatically accelerate wealth accumulation through two mechanisms. First, each new contribution immediately starts earning compound interest. Second, the additional capital increases the base on which future interest is calculated. Consider two scenarios at 7% over 30 years: a $10,000 lump sum with no contributions grows to about $76,000. The same $10,000 with $200 monthly contributions grows to around $250,000 — more than three times as much. The monthly contributions only add $72,000 in total deposits, but they generate over $168,000 in total interest because each contribution compounding for the years remaining in the investment horizon.",
  },
  {
    q: "What is the difference between daily, monthly, and annual compounding?",
    a: "The compounding frequency determines how often interest is calculated and added to your principal. More frequent compounding means slightly more growth because interest is added sooner and starts earning interest sooner. In practice, the difference between daily and monthly compounding is small — on a $10,000 investment at 7% over 10 years, daily compounding produces about $20,138 while monthly compounding produces $20,097, a difference of just $41. Annual compounding produces $19,672, noticeably less. The formula uses n to represent compounding frequency: n=365 for daily, n=12 for monthly, n=4 for quarterly, n=1 for annual.",
  },
  {
    q: "What is the Rule of 72?",
    a: "The Rule of 72 is a quick mental maths shortcut to estimate how many years it takes to double your money at a given compound interest rate. Divide 72 by your annual interest rate percentage to get the approximate doubling time. At 6%, your money doubles in about 72 ÷ 6 = 12 years. At 9%, it doubles in 72 ÷ 9 = 8 years. At 4%, it takes 72 ÷ 4 = 18 years. The rule is accurate within about 1% for rates between 1% and 25%. For higher precision, the exact formula is t = ln(2) / ln(1 + r), but the Rule of 72 is close enough for planning purposes.",
  },
  {
    q: "How does inflation affect compound interest growth?",
    a: "Nominal compound interest shows your raw dollar balance — how much money you will have. Real compound interest adjusts for inflation to show the purchasing power of that money in today's terms. If your investment grows at 7% annually but inflation runs at 3%, your real return is approximately 4% (using the Fisher equation: real rate = ((1 + nominal) / (1 + inflation)) − 1 ≈ 4.08%). A $10,000 investment that grows to $76,000 in 30 years sounds impressive, but if inflation averaged 3% over that period, the real purchasing power is only around $31,000 in today's dollars. This is why financial advisers emphasise real returns, not just nominal ones.",
  },
  {
    q: "Should contributions be made at the start or end of the period?",
    a: "Contributing at the start of each period (annuity due) produces a slightly higher return than contributing at the end (ordinary annuity) because each contribution earns one extra period of compound interest. On a 30-year investment at 7% with $200 monthly contributions, contributing at the start of each month produces approximately $800–$1,500 more than contributing at the end. In practice, the timing is usually determined by your investment platform — regular direct debits and payroll contributions often process at fixed dates regardless. The difference is real but not transformative compared to the impact of the rate, time horizon, and contribution amount.",
  },
  {
    q: "What annual interest rate should I use in the calculator?",
    a: "For long-term stock market investments, a commonly used historical average for diversified equity portfolios is 7–10% nominal (before inflation), based on the long-run historical performance of indices like the S&P 500. After inflation, the real return is typically estimated at 5–7%. For savings accounts and cash ISAs in the UK, rates vary between 3–5% in 2024. For government bonds, 3–5% is typical. For high-yield savings accounts in the US, 4–5% is common. Use a conservative estimate (5–6%) for long-range planning rather than assuming the historical highs will continue indefinitely.",
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
export default function CompoundInterestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="max-w-5xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="mb-8 max-w-2xl">

          <h1 className="text-4xl font-bold text-stone-900 leading-tight mb-3">
            Compound Interest Calculator<br />
            <span className="text-stone-400 text-3xl font-normal">with Monthly Contributions</span>
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed">
            See exactly how your savings or investments grow over time with the power of
            compound interest and regular contributions. Adjust compounding frequency,
            view a full yearly schedule, and compare what different interest rates do
            to your long-term wealth.
          </p>
        </div>

        {/* Calculator */}
        <CompoundInterestCalculator />

        {/* ── CONTENT ── */}

        <H2>What is compound interest?</H2>
        <P>
          Compound interest is often described as the most powerful force in personal finance —
          and for good reason. Unlike simple interest, which only ever calculates on your original
          deposit, compound interest calculates on your growing balance: your principal plus all
          the interest you have already earned. This creates a self-reinforcing feedback loop where
          money earns money, and that money earns more money.
        </P>
        <P>
          The longer your money compounds, the more dramatic this effect becomes. A $10,000
          investment at 7% annual compound interest grows to $19,672 after 10 years — nearly
          double without adding a single additional dollar. After 30 years it reaches $76,123.
          After 40 years, $149,745. The growth is not linear — it accelerates. The last 10 years
          of a 40-year investment adds more in absolute dollar terms than the first 30 years
          combined. This is the core insight that makes starting early so powerful, and why this
          compound interest calculator with monthly contributions shows year-by-year data rather
          than just a final number.
        </P>

        <H2>How monthly contributions transform compound growth</H2>
        <P>
          A lump-sum investment compounds on a fixed principal. Monthly contributions add new
          capital continuously — and each new deposit immediately starts its own compounding
          journey. The result is that compound interest with monthly deposits grows
          significantly faster than compound interest on a lump sum alone, even when the total
          deposited is the same.
        </P>
        <P>
          Consider an investor who puts $50,000 into an account at 7% for 30 years with no
          further contributions. They end up with about $380,000. Now consider an investor who
          starts with nothing and contributes $139/month for 30 years at the same rate — also
          depositing $50,000 in total. They end up with about $170,000. The lump-sum investor
          wins, because the full $50,000 compounded from day one. But if the second investor
          had deposited $500/month ($180,000 total) they would end up with around $610,000 —
          with interest doing the majority of the work on a much larger compounding base.
          Use the calculator above to model your own numbers and see exactly how contributions
          interact with compounding over your chosen horizon.
        </P>

        <H2>Compound interest formula explained</H2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
            <p className="text-sm font-semibold text-stone-800 mb-3">Lump sum only</p>
            <code className="block text-sm bg-white rounded-lg px-4 py-3 border border-stone-200 text-stone-700 font-mono mb-3">
              A = P × (1 + r/n)^(n×t)
            </code>
            <div className="space-y-1 text-xs text-stone-500">
              <p><strong className="text-stone-700">A</strong> = final amount</p>
              <p><strong className="text-stone-700">P</strong> = principal (initial deposit)</p>
              <p><strong className="text-stone-700">r</strong> = annual rate (decimal, e.g. 0.07)</p>
              <p><strong className="text-stone-700">n</strong> = compounding frequency per year</p>
              <p><strong className="text-stone-700">t</strong> = time in years</p>
            </div>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
            <p className="text-sm font-semibold text-stone-800 mb-3">With regular contributions</p>
            <code className="block text-sm bg-white rounded-lg px-4 py-3 border border-stone-200 text-stone-700 font-mono mb-3 leading-relaxed">
              FV = PMT × [((1+r/n)^(nt) − 1) / (r/n)]
            </code>
            <div className="space-y-1 text-xs text-stone-500">
              <p><strong className="text-stone-700">FV</strong> = future value of contributions</p>
              <p><strong className="text-stone-700">PMT</strong> = payment per period</p>
              <p>Total = lump-sum A + FV contributions</p>
              <p className="text-stone-400 pt-1">Multiply FV × (1 + r/n) for start-of-period contributions</p>
            </div>
          </div>
        </div>

        <H2>Does compounding frequency matter?</H2>
        <P>
          Yes — but less than most people expect. More frequent compounding means interest is
          calculated and added to your balance more often, giving each portion of interest a
          head start on its own compounding. Daily compounding produces the highest return,
          but the difference between daily and monthly is negligible in practice. The real
          comparison that matters is between frequent compounding (daily/monthly) and annual
          compounding.
        </P>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-green-50 border border-green-100">
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Frequency</th>
                <th className="text-center py-2.5 px-4 text-xs font-semibold text-stone-600">Times/year (n)</th>
                <th className="text-right py-2.5 px-4 text-xs font-semibold text-stone-600">$10k at 7% over 10 yrs</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Typical usage</th>
              </tr>
            </thead>
            <tbody className="border border-stone-200">
              {COMPOUNDING_TABLE.map((row) => (
                <tr key={row.frequency} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                  <td className="py-2.5 px-4 font-medium text-stone-800 text-xs">{row.frequency}</td>
                  <td className="py-2.5 px-4 text-center text-stone-600 text-xs">{row.n}</td>
                  <td className="py-2.5 px-4 text-right font-semibold text-emerald-700 text-xs">{row.example10k}</td>
                  <td className="py-2.5 px-4 text-stone-500 text-xs">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          The difference between daily and annual compounding on $10,000 at 7% over 10 years is
          just $466. Over 30 years at larger balances, the gap widens — but the compounding
          frequency is far less important than the interest rate, the investment horizon, and the
          consistency of your monthly contributions.
        </P>

        <H2>Real-world compound interest scenarios</H2>
        <P>
          Abstract numbers rarely motivate behaviour the way concrete scenarios do. Here are
          three illustrative examples showing how different starting points and contribution
          strategies play out over a lifetime of investing.
        </P>

        <div className="space-y-4 mb-6">
          {SCENARIOS.map((s) => (
            <div key={s.title} className={`border rounded-2xl p-5 ${s.color}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-base font-semibold text-stone-900">{s.title}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{s.age}</p>
                </div>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${s.badge}`}>{s.result}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {[
                  { label: "Initial", value: s.initial },
                  { label: "Monthly", value: s.monthly },
                  { label: "Rate", value: s.rate },
                ].map((m) => (
                  <div key={m.label} className="bg-white/60 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-stone-400">{m.label}</p>
                    <p className="text-sm font-semibold text-stone-800">{m.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">{s.lesson}</p>
            </div>
          ))}
        </div>

        <H2>The Rule of 72: a mental maths shortcut</H2>
        <P>
          The Rule of 72 is one of the most useful shortcuts in personal finance. To estimate
          how many years it takes to double your money at a given compound interest rate,
          simply divide 72 by the annual rate. At 6%: 72 ÷ 6 = 12 years to double. At 9%:
          8 years. At 4%: 18 years. The rule works in reverse too — if you want to double
          your money in 10 years, you need a rate of approximately 72 ÷ 10 = 7.2%.
        </P>
        <P>
          The Rule of 72 is accurate within about 1–2% for rates between 2% and 20%. It
          slightly overestimates at lower rates and underestimates at higher rates. For
          precise calculations, the exact formula is t = ln(2) / ln(1 + r) ≈ 0.693 / r.
          But for quick back-of-envelope planning, dividing 72 by your expected rate gives
          you a powerful intuition for how long compound growth actually takes.
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

        <div className="mt-10 p-4 bg-stone-50 rounded-xl border border-stone-200">
          <p className="text-xs text-stone-500 leading-relaxed">
            <strong className="text-stone-700">Disclaimer:</strong> This calculator is for
            educational and illustrative purposes only. It assumes a constant interest rate
            over the full investment period and does not account for taxes on interest income,
            investment fees, variable returns, or changes in contribution amounts. Past market
            performance does not guarantee future results. Consult a qualified financial
            adviser before making investment decisions.
          </p>
        </div>

        {/* Related Tools */}
        <div className="mt-20 border-t border-stone-100 pt-12">
          <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath="/finance/compound-interest-calculator" />
        </div>

      </main>
    </>
  );
}
