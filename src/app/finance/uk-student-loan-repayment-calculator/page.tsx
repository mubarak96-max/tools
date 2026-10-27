import type { Metadata } from "next";
import StudentLoanCalculator from "@/components/StudentLoanCalculator";
import { Calculator, TrendingUp, PoundSterling, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "UK Student Loan Repayment Calculator — Plans 1, 2, 4, 5 & Postgraduate",
  description:
    "Free UK student loan repayment calculator for Plans 1, 2, 4 and 5. See your monthly repayments, total repaid, interest charged, and whether your loan gets written off. Updated for 2026/27 thresholds.",
  keywords: [
    "uk student loan repayment calculator",
    "student loan calculator uk",
    "plan 2 student loan calculator",
    "plan 5 student loan calculator",
    "how much student loan will i repay",
    "student loan write off calculator uk",
    "student loan repayment threshold 2026/27",
    "how does student loan repayment work uk",
    "student loan monthly repayment calculator",
    "postgraduate loan repayment calculator",
    "will my student loan be written off",
    "student loan interest calculator uk",
  ],
  openGraph: {
    title: "UK Student Loan Repayment Calculator — All Plans 2026/27",
    description:
      "Calculate exactly how much you'll repay on your UK student loan, whether it'll be written off, and your monthly deductions at any salary.",
    url: "https://findbest.tools/finance/uk-student-loan-repayment-calculator",
  },
  alternates: {
    canonical: "https://findbest.tools/finance/uk-student-loan-repayment-calculator",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "UK Student Loan Repayment Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
  description:
    "Free UK student loan repayment calculator covering Plans 1, 2, 4, 5 and Postgraduate loans with 2026/27 repayment thresholds, September 2026 interest rates, write-off modelling and a yearly schedule.",
  dateModified: "2026-10-27",
  areaServed: "GB",
};

const PLAN_COMPARISON = [
  {
    plan: "Plan 1",
    who: "England/Wales before Sept 2012; all NI students",
    threshold: "£26,900",
    rate: "9%",
    interest: "Lower of RPI or BoE base + 1% (4.1%)",
    writeOff: "25 years",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    plan: "Plan 2",
    who: "England Sept 2012 – July 2023; Wales from Sept 2012",
    threshold: "£29,385",
    rate: "9%",
    interest: "RPI to RPI + 3% by income (4.1%–6%, capped)",
    writeOff: "30 years",
    badge: "bg-purple-100 text-purple-700",
  },
  {
    plan: "Plan 4",
    who: "Scotland (post-1998 entrants)",
    threshold: "£33,795",
    rate: "9%",
    interest: "Lower of RPI or BoE base + 1% (4.1%)",
    writeOff: "30 years",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    plan: "Plan 5",
    who: "England, from August 2023 onwards",
    threshold: "£25,000",
    rate: "9%",
    interest: "RPI only (4.1%)",
    writeOff: "40 years",
    badge: "bg-orange-100 text-orange-700",
  },
  {
    plan: "Postgraduate",
    who: "Postgraduate Master's or Doctoral (England/Wales)",
    threshold: "£21,000",
    rate: "6%",
    interest: "RPI + 3%, capped at 6% for 2026/27",
    writeOff: "30 years",
    badge: "bg-rose-100 text-rose-700",
  },
];

const FAQS = [
  {
    q: "How does UK student loan repayment work?",
    a: "UK student loan repayment is income-contingent — you only repay when your income exceeds a threshold, and repayments are calculated as a percentage of what you earn above that threshold, not on your total salary. For most graduates (Plans 2 and 5), you repay 9% of income above the threshold. On a £35,000 salary under Plan 2 (threshold £29,385), you pay 9% of £5,615 = £505.35 per year, or about £42.11/month. Deductions are made automatically through PAYE by your employer, just like income tax and National Insurance. If your income drops below the threshold, repayments stop automatically.",
  },
  {
    q: "What is the student loan repayment threshold in 2026/27?",
    a: "The thresholds for the 2026/27 tax year (6 April 2026 to 5 April 2027) are: Plan 1: £26,900/year (£2,241/month); Plan 2: £29,385/year (£2,448/month); Plan 4 (Scotland): £33,795/year (£2,816/month); Plan 5: £25,000/year (£2,083/month); Postgraduate Loan: £21,000/year (£1,750/month). For employees, deductions are worked out on pay in each pay period; if you are self-employed, HMRC uses your total taxable income through Self Assessment. Thresholds are reviewed each year — the Plan 1 threshold is already confirmed to rise to £28,005 from 6 April 2027.",
  },
  {
    q: "Will my student loan be written off?",
    a: "The majority of Plan 2 graduates are projected to have their loans written off rather than fully repaid, according to the Institute for Fiscal Studies. Loans are written off a set number of years after the April you were first due to repay: Plan 1 — 25 years; Plans 2 and 4 — 30 years; Plan 5 — 40 years; Postgraduate — 30 years. Older Plan 1 and Plan 4 loans can instead be written off at age 65. Whether your specific loan is written off depends on your balance, earnings trajectory, and interest rate. Higher earners are more likely to clear their balance; lower and median earners typically see a significant write-off. This calculator models both outcomes so you can see which applies to your numbers.",
  },
  {
    q: "How does student loan interest work in the UK?",
    a: "Student loan interest in the UK is linked to the Retail Price Index (RPI) measure of inflation, and is updated each September. Plans 1 and 4: the lower of RPI or Bank of England base rate + 1%. Plan 2: RPI while earning at or below the threshold, rising on a sliding scale to RPI + 3% for higher earners. Plan 5: RPI only. Postgraduate Loan: RPI + 3%. From 1 September 2026 to 31 August 2027, RPI is 4.1%, so Plans 1, 4 and 5 charge 4.1%. The government has capped Plan 2 and Postgraduate Loan interest at 6% for that year, so Plan 2 ranges from 4.1% to 6% depending on income and the Postgraduate Loan is 6% instead of 7.1%.",
  },
  {
    q: "What is the difference between Plan 2 and Plan 5?",
    a: "Plan 2 applies to students who started in England between September 2012 and July 2023, and to Welsh students who started from September 2012. Plan 5 applies to students in England starting from August 2023 onwards. The key differences: Plan 2 has a higher threshold (£29,385 vs £25,000 for Plan 5 in 2026/27), which means Plan 2 graduates start repaying at a higher income. Plan 5 has a 40-year write-off versus 30 years for Plan 2 — meaning Plan 5 graduates who don't repay fully will be repaying for a decade longer. Both plans charge 9% above their respective thresholds. Plan 5 interest is RPI-only, while Plan 2 charges RPI + up to 3%.",
  },
  {
    q: "Can I make voluntary overpayments on my student loan?",
    a: "Yes — you can make voluntary overpayments directly to the Student Loans Company (SLC) at any time. However, whether this makes financial sense depends heavily on your individual circumstances. For most graduates whose loans are projected to be written off, overpaying is financially disadvantageous — you pay off money that would have been cancelled anyway. Overpaying only makes sense if your modelling shows you will repay the full balance before write-off anyway (i.e., you would repay more in interest by not overpaying than you save). If your loan is projected to be written off, the money is generally better deployed in a pension, ISA, or paying off higher-interest debts.",
  },
  {
    q: "How does repayment work for the Postgraduate Loan?",
    a: "Postgraduate Loans are repaid on a separate track from undergraduate loans. The repayment rate is 6% (not 9%) of income above £21,000. If you have both an undergraduate loan and a Postgraduate Loan, you repay both simultaneously — the undergraduate plan's 9% and the postgrad's 6% are calculated independently from your gross income. Both have their own 30-year write-off clocks. The Postgraduate Loan accrues interest at RPI + 3% regardless of income level — unlike Plan 2 undergraduate loans which use a sliding scale — although it is capped at 6% from 1 September 2026 to 31 August 2027.",
  },
  {
    q: "Is student loan repayment affected by self-employment?",
    a: "Yes. If you are self-employed, student loan repayments are calculated through Self Assessment rather than PAYE. HMRC calculates the repayment as 9% (or 6% for postgrad) of your profits above the threshold, and you pay it alongside your income tax and National Insurance in the January and July Self Assessment payments. Self-employed individuals with fluctuating income may find their repayments vary significantly year to year. The threshold rules are the same as for employees — repayments only apply to income above your plan's threshold.",
  },
];

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold text-stone-900 mb-4 mt-12">{children}</h2>;
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-stone-800 mb-2 mt-6">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-stone-600 leading-relaxed mb-4 text-[15px]">{children}</p>;
}

export default function StudentLoanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="max-w-5xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
            Plans 1, 2, 4, 5 & Postgraduate · 2026/27 thresholds · Free
          </div>
          <h1 className="text-4xl font-bold text-stone-900 leading-tight mb-3">
            UK Student Loan Repayment Calculator
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed">
            See exactly how much you'll repay each month, how much interest accumulates,
            and whether your loan will be paid off or written off — based on your actual
            loan plan, salary, and expected earnings growth. Covers Plans 1, 2, 4, 5
            and Postgraduate Loans.
          </p>
        </div>

        {/* Calculator */}
        <StudentLoanCalculator />

        {/* ── CONTENT ── */}

        <H2>How UK student loan repayment works</H2>
        <P>
          UK student loans work very differently from personal loans or mortgages. They are
          income-contingent — meaning repayments are tied to what you earn, not to the size
          of your loan. You never have a fixed monthly bill that follows you regardless of
          income. Instead, your employer deducts a percentage of your earnings above a set
          threshold each month, automatically, through the PAYE system alongside your income
          tax and National Insurance contributions. If your income falls below the threshold
          for any period — due to a career break, redundancy, or working part-time — your
          repayments stop automatically with no penalty.
        </P>
        <P>
          This design has an important implication: for many graduates, especially those on
          Plan 2 who started university between 2012 and 2023, the loan functions more like
          a graduate tax than a traditional debt. The Institute for Fiscal Studies has
          projected that most Plan 2 graduates will not repay their loans in
          full before the 30-year write-off. For those graduates, total repayments are
          capped by income — the balance simply evaporates at write-off without affecting
          your credit score.
        </P>

        <H2>UK student loan plans explained (2026/27)</H2>
        <P>
          There are five distinct loan plans in England, Wales, Scotland, and Northern
          Ireland, each with different repayment thresholds, interest rates, and write-off
          periods. Your plan is determined by when and where you studied — you cannot
          choose it.
        </P>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-indigo-50 border border-indigo-100">
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Plan</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Who</th>
                <th className="text-right py-2.5 px-4 text-xs font-semibold text-stone-600">Threshold 26/27</th>
                <th className="text-right py-2.5 px-4 text-xs font-semibold text-stone-600">Rate</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Interest</th>
                <th className="text-right py-2.5 px-4 text-xs font-semibold text-stone-600">Write-off</th>
              </tr>
            </thead>
            <tbody className="border border-stone-200">
              {PLAN_COMPARISON.map((row) => (
                <tr key={row.plan} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                  <td className="py-2.5 px-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.badge}`}>{row.plan}</span>
                  </td>
                  <td className="py-2.5 px-4 text-stone-600 text-xs">{row.who}</td>
                  <td className="py-2.5 px-4 text-right font-semibold text-stone-800 text-xs">{row.threshold}</td>
                  <td className="py-2.5 px-4 text-right text-stone-600 text-xs">{row.rate}</td>
                  <td className="py-2.5 px-4 text-stone-500 text-xs">{row.interest}</td>
                  <td className="py-2.5 px-4 text-right text-stone-600 text-xs">{row.writeOff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H3>Plan 2 — the most common and most misunderstood</H3>
        <P>
          Plan 2 covers the largest cohort of current graduates — anyone who started an
          undergraduate degree in England between September 2012 and July 2023, or in Wales
          from September 2012. The threshold is £29,385 for 2026/27. Repayments are 9% of
          income above this figure. On a £35,000 salary, you repay 9% × (£35,000 − £29,385)
          = £505/year (£42.11/month). The interest rate is RPI for incomes at or below the
          threshold, rising on a sliding scale to RPI + 3% for higher earners. From
          1 September 2026, with RPI at 4.1% and a 6% cap, that means rates between 4.1% and 6%.
        </P>

        <H3>Plan 5 — the new system from 2023</H3>
        <P>
          Students starting in England from August 2023 onwards are on Plan 5. The threshold
          is lower (£25,000), meaning repayments begin at a lower income. Critically, the
          write-off period is 40 years — ten years longer than Plan 2. The interest rate is
          RPI only (4.1% from 1 September 2026), removing the additional +3% premium for high earners. The lower threshold
          combined with a 40-year term means the overall lifetime repayment for median earners
          is significantly higher than Plan 2 — Plan 5 was designed to increase graduate
          repayment rates and reduce the proportion of loans written off.
        </P>

        <H3>The write-off: why your loan balance isn't always what it seems</H3>
        <P>
          One of the most counterintuitive aspects of the UK student loan system is that a
          large balance does not necessarily mean a large financial burden. Because repayments
          are income-contingent and loans are written off after a fixed period, a graduate
          on a median salary with a £50,000 balance may ultimately repay less than a
          graduate with a £20,000 balance who earns a high income throughout their career.
          The write-off is not a penalty — it is an intentional feature of the system,
          functioning as a soft cap on total repayments for lower and median earners.
          For high earners, the opposite is true: they may repay the full balance plus
          substantial interest before write-off.
        </P>

        <H2>Strategic considerations: Managing your student loan</H2>

        <H3>Voluntary overpayments vs Investing</H3>
        <P>
          A common dilemma for graduates who manage to save a lump sum is whether to use it to pay down their student loan early. Psychologically, being "in debt" can be stressful, leading many to make voluntary overpayments to the Student Loans Company (SLC). However, mathematically, this is often a severe mistake for the majority of graduates.
        </P>
        <P>
          Because most Plan 2 loans will eventually be written off, making an overpayment often means you are paying off money that the government was going to cancel anyway. If your projected career earnings mean you will never clear the principal before the 30-year mark, every extra pound you voluntarily hand over is effectively a donation to the SLC. Overpaying only makes financial sense if your career trajectory guarantees you will clear the balance naturally before the write-off period. In that scenario, overpaying early saves you from the compounding interest (which, at RPI + 3% for high earners, can be considerable). 
        </P>
        <P>
          For everyone else, that capital is far better deployed elsewhere. Contributing to a workplace pension, investing in a Stocks and Shares ISA, or saving for a property deposit will almost certainly yield a better long-term net-worth outcome than paying off a loan that behaves like a time-limited tax.
        </P>

        <H3>How does a student loan affect getting a mortgage?</H3>
        <P>
          When you apply for a mortgage, lenders conduct strict affordability checks to ensure you can manage monthly repayments even if interest rates rise. Your student loan affects these checks, but not in the way traditional debt does. Mortgage lenders do not look at your total outstanding student loan balance. Having a £10,000 balance or a £100,000 balance makes zero difference to a mortgage underwriter.
        </P>
        <P>
          What lenders *do* care about is your monthly cash flow. Because your student loan repayment is deducted automatically from your payslip, it reduces your net monthly take-home pay. Mortgage affordability calculators will factor in this reduced net income when deciding how much they are willing to lend you. For example, if you earn £40,000, your gross monthly income is £3,333, but after tax, National Insurance, and an £80 Plan 2 student loan deduction (2026/27 threshold), your net income is lower. The lender assesses your ability to pay a mortgage based on the post-deduction figure. So, while a student loan won't stop you from getting a mortgage, it will slightly reduce the maximum amount you can borrow.
        </P>

        <H3>The impact of inflation and interest rates</H3>
        <P>
          Because UK student loan interest rates are pegged to the Retail Price Index (RPI), periods of high inflation (such as the cost-of-living crisis experienced in the early 2020s) cause interest rates to spike. The government has repeatedly stepped in with temporary caps — most recently limiting Plan 2 and Postgraduate Loan interest to 6% from 1 September 2026 to 31 August 2027, when RPI + 3% would otherwise have been 7.1%. 
        </P>
        <P>
          Despite the headlines, high interest rates on student loans only truly affect the highest earners. If your loan is destined to be written off, the interest rate is irrelevant to your day-to-day life — whether your balance is growing at 2% or 12%, your monthly repayment remains exactly the same (9% of your income above the threshold). The only people harmed by high interest rates are those who earn enough to actually pay off the loan, as the high interest extends the number of years they must make repayments before the balance hits zero.
        </P>

        <H3>Postgraduate Loans: The hidden double tax</H3>
        <P>
          If you take out a Master's or Doctoral loan, you are placed on the Postgraduate Loan plan. This operates simultaneously alongside your undergraduate loan. The threshold is much lower (£21,000), and the repayment rate is 6%. 
        </P>
        <P>
          Crucially, these deductions stack. If you earn £35,000, you will pay 9% on your income above £29,385 (for a Plan 2 undergrad loan) *plus* 6% on your income above £21,000 (for your postgrad loan). This creates an effective marginal tax rate that is exceptionally high for young professionals. When combining basic rate Income Tax (20%), National Insurance (8%), Plan 2 repayments (9%), and Postgraduate repayments (6%), your marginal deduction rate hits 43%. This means for every extra £100 you earn via a pay rise or bonus, you only keep £57. This "double deduction" is why postgraduates often feel their take-home pay does not reflect their gross salary.
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

        <div className="mt-12 p-4 bg-stone-50 rounded-xl border border-stone-200">
          <p className="text-sm font-semibold text-stone-800 mb-2">Sources &amp; last checked</p>
          <ul className="space-y-1 text-xs text-stone-600 leading-relaxed list-disc pl-4">
            {[
              { label: "GOV.UK — Repaying your student loan: what you pay (2026/27 thresholds)", href: "https://www.gov.uk/repaying-your-student-loan/what-you-pay" },
              { label: "GOV.UK — Student loans interest rates and repayment threshold announcement (10 August 2026)", href: "https://www.gov.uk/government/news/student-loans-interest-rates-and-repayment-threshold-announcement--7" },
              { label: "GOV.UK — Interest rate cap introduced to protect Plan 2 borrowers (7 April 2026)", href: "https://www.gov.uk/government/news/interest-rate-cap-introduced-to-protect-plan-2-borrowers" },
              { label: "GOV.UK — When your student loan gets written off or cancelled", href: "https://www.gov.uk/repaying-your-student-loan/when-your-student-loan-gets-written-off-or-cancelled" },
            ].map((src) => (
              <li key={src.href}>
                <a href={src.href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{src.label}</a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-stone-500 mt-2">Last checked: October 2026.</p>
        </div>

        <div className="mt-16 border-t border-stone-200 pt-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-8">Related Finance Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: "Salary After Tax", href: "/finance/salary-after-tax-calculator", desc: "Calculate take-home pay with tax brackets and compare regions.", icon: <Wallet className="w-5 h-5 text-indigo-600" /> },
              { name: "Compound Interest", href: "/finance/compound-interest-calculator", desc: "See how your investments and savings compound over time.", icon: <TrendingUp className="w-5 h-5 text-indigo-600" /> },
              { name: "UK Stamp Duty", href: "/real-estate/uk-stamp-duty-calculator", desc: "Calculate SDLT for residential and buy-to-let purchases.", icon: <PoundSterling className="w-5 h-5 text-indigo-600" /> },
              { name: "EMI Calculator", href: "/finance/emi-calculator", desc: "Estimate monthly loan EMI, total interest, and repayment schedules.", icon: <Calculator className="w-5 h-5 text-indigo-600" /> },
            ].map((tool) => (
              <a key={tool.href} href={tool.href} className="group p-5 border border-stone-200 rounded-2xl hover:border-indigo-200 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-bold text-stone-900 group-hover:text-indigo-600 transition-colors">{tool.name}</h3>
                </div>
                <p className="text-sm text-stone-500 leading-relaxed">{tool.desc}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 p-4 bg-stone-50 rounded-xl border border-stone-200">
          <p className="text-xs text-stone-500 leading-relaxed">
            <strong className="text-stone-700">Disclaimer:</strong> This calculator uses
            2026/27 repayment thresholds and holds them flat for future years, with interest
            rate assumptions you can edit, for illustrative purposes. Thresholds, interest rates, and write-off rules are set by the UK
            government and Student Loans Company and change annually. This tool does not
            constitute financial advice. For official repayment information visit{" "}
            <span className="text-stone-700">gov.uk/repaying-your-student-loan</span> or
            contact the Student Loans Company directly.
          </p>
        </div>

      </main>
    </>
  );
}
