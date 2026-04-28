import type { Metadata } from "next";
import Link from "next/link";
import IndiaTaxCalculator from "@/components/IndiaTaxCalculator";

// ─── SEO metadata ──────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "India Income Tax Calculator 2026–26 — Old vs New Regime",
  description:
    "Free India income tax calculator FY 2026–26. Compare Old vs New Tax Regime side by side. Includes Section 80C, 80D, HRA, NPS deductions, surcharge, 4% cess and Section 87A rebate. Accurate AY 2026–27 slabs.",
  keywords: [
    "india income tax calculator",
    "income tax calculator india 2026 26",
    "old vs new tax regime calculator",
    "new tax regime calculator 2026",
    "old regime vs new regime which is better",
    "income tax calculator fy 2026 26",
    "section 80c tax calculator india",
    "how to calculate income tax india",
    "income tax slabs 2026 26 india",
    "take home salary calculator india",
    "hra exemption calculator india",
    "section 87a rebate calculator",
  ],
  openGraph: {
    title: "India Income Tax Calculator 2026–26 — Old vs New Regime",
    description:
      "Calculate and compare your income tax under Old and New Regimes for FY 2026–26. Includes all deductions, surcharge, cess and rebate u/s 87A.",
    url: "https://findbest.tools/finance/income-tax-calculator-india",
  },
  alternates: {
    canonical: "https://findbest.tools/finance/income-tax-calculator-india",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "India Income Tax Calculator 2026–26",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  description:
    "Free India income tax calculator for FY 2026–26 (AY 2026–27). Compares Old vs New Tax Regime with all deductions, 87A rebate, surcharge and cess.",
  areaServed: "IN",
};

// ─── Content data ──────────────────────────────────────────────────

const NEW_REGIME_SLABS = [
  { range: "₹0 – ₹3,00,000",         rate: "Nil",  note: "No tax" },
  { range: "₹3,00,001 – ₹7,00,000",  rate: "5%",   note: "Rebate u/s 87A makes it zero if income ≤ ₹7L" },
  { range: "₹7,00,001 – ₹10,00,000", rate: "10%",  note: "" },
  { range: "₹10,00,001 – ₹12,00,000",rate: "15%",  note: "" },
  { range: "₹12,00,001 – ₹15,00,000",rate: "20%",  note: "" },
  { range: "₹15,00,001+",            rate: "30%",  note: "Plus surcharge if applicable" },
];

const OLD_REGIME_SLABS = [
  { range: "₹0 – ₹2,50,000",         rate: "Nil",  note: "₹3L for 60–80 yrs; ₹5L for 80+ yrs" },
  { range: "₹2,50,001 – ₹5,00,000",  rate: "5%",   note: "Rebate u/s 87A up to ₹12,500 if income ≤ ₹5L" },
  { range: "₹5,00,001 – ₹10,00,000", rate: "20%",  note: "" },
  { range: "₹10,00,001+",            rate: "30%",  note: "Plus surcharge if applicable" },
];

const DEDUCTIONS = [
  { section: "Section 80C",      limit: "₹1,50,000",  what: "PPF, ELSS, LIC premium, EPF, home loan principal, tuition fees, NSC, SCSS" },
  { section: "Section 80D",      limit: "₹25,000–₹1,00,000", what: "Health insurance premium (self + family + parents); higher limits for senior citizens" },
  { section: "HRA Exemption",    limit: "Least of three formulas", what: "Actual HRA received, 50%/40% of salary, excess rent over 10% of salary" },
  { section: "Section 24(b)",    limit: "₹2,00,000",  what: "Home loan interest for self-occupied property" },
  { section: "Section 80CCD(2)", limit: "No upper cap", what: "Employer's NPS contribution — up to 10% of salary (14% for central govt employees)" },
  { section: "Section 80E",      limit: "Full interest paid", what: "Interest on education loan (8 years)" },
  { section: "Section 80G",      limit: "50%–100% of donation", what: "Donations to approved charitable funds" },
  { section: "Section 80TTA",    limit: "₹10,000",    what: "Interest on savings bank account (not applicable for senior citizens — use 80TTB)" },
  { section: "LTA",              limit: "Actual fare (2 journeys in 4 years)", what: "Leave Travel Allowance for domestic travel" },
  { section: "Standard Deduction", limit: "₹50,000", what: "Flat deduction for salaried employees and pensioners" },
];

const FAQS = [
  {
    q: "Which is better — Old Regime or New Regime for FY 2026–26?",
    a: "It depends entirely on your deductions. The New Regime has lower slab rates but allows almost no deductions. The Old Regime has higher rates but allows substantial deductions under 80C, 80D, HRA, home loan interest, and more. As a rule of thumb: if your total deductions (including standard deduction) exceed approximately ₹3.75 lakh for incomes around ₹15 lakh, the Old Regime is likely better. For lower deduction claimers — especially those without HRA, home loans, or significant 80C investments — the New Regime usually wins. Use the calculator above to compare your exact numbers.",
  },
  {
    q: "What is the Section 87A tax rebate for FY 2026–26?",
    a: "Section 87A provides a tax rebate to individuals with modest taxable income. Under the New Regime, if your net taxable income is ₹7 lakh or below, you get a full rebate of up to ₹25,000 — meaning your tax liability becomes zero. Under the Old Regime, the rebate is up to ₹12,500 for taxable income at or below ₹5 lakh. Importantly, the rebate applies after calculating tax on the taxable income — it is not an exemption. If your taxable income is ₹7,00,001 in the new regime, the rebate does not apply and you owe the full tax on the entire amount.",
  },
  {
    q: "What changed in the New Tax Regime after Budget 2026?",
    a: "Budget 2026 continued the provisions of the New Tax Regime: the standard deduction for salaried employees is ₹75,000 (raised from ₹50,000 in Budget 2024); the family pension deduction is ₹25,000; and the employer NPS contribution deduction u/s 80CCD(2) is up to 14% of salary for private sector employees. The tax slabs themselves were unchanged. These additions make the New Regime very attractive for salaried taxpayers.",
  },
  {
    q: "How is surcharge calculated on income tax in India?",
    a: "Surcharge is an additional levy charged on top of income tax for higher earners. It applies to the income tax amount (before cess), not to the income itself. Under both regimes: 10% surcharge for income between ₹50 lakh and ₹1 crore; 15% for ₹1 crore to ₹2 crore; 25% for ₹2 crore to ₹5 crore. Above ₹5 crore, the Old Regime charges 37% but the New Regime caps the surcharge at 25% — making the New Regime significantly more attractive for ultra-high earners. Marginal relief applies near the threshold to prevent a situation where paying more tax than extra income earned.",
  },
  {
    q: "What is Health and Education Cess in India?",
    a: "Health and Education Cess is a 4% levy charged on the combined amount of income tax and surcharge. It replaced the earlier 3% cess from FY 2018–19 onwards. The cess funds the National Health Mission and educational initiatives. It applies to all taxpayers regardless of income level — there is no exemption threshold. The cess is calculated last, after all rebates and surcharge have been applied to the income tax amount.",
  },
  {
    q: "Can I switch between Old and New Tax Regime every year?",
    a: "Salaried individuals (without business income) can switch between the Old and New Regime every financial year. You declare your regime choice to your employer at the start of the year for TDS purposes, and can finalise your choice when filing your ITR. If you have business or professional income (self-employed), you can switch to the Old Regime only once — after switching back from the New Regime, you cannot return to the New Regime in future years. The New Regime is the default from FY 2023–24; if you want the Old Regime, you must explicitly opt in.",
  },
  {
    q: "How much can I save under Section 80C?",
    a: "Section 80C allows a deduction of up to ₹1,50,000 per financial year from taxable income under the Old Regime. Eligible investments and expenditures include: PPF (Public Provident Fund), ELSS mutual funds, life insurance premiums, EPF contributions, 5-year tax-saving FDs, NSC, home loan principal repayment, tuition fees, and SCSS. To maximise the benefit, invest the full ₹1.5 lakh. At a 30% tax rate, this saves ₹45,000 in tax (plus cess). Note that 80C deductions are not available under the New Regime.",
  },
  {
    q: "How is HRA exemption calculated?",
    a: "HRA (House Rent Allowance) exemption under the Old Regime is the minimum of three amounts: (1) actual HRA received from employer; (2) actual rent paid minus 10% of basic salary; (3) 50% of basic salary if you live in a metro city (Delhi, Mumbai, Kolkata, Chennai) or 40% for non-metro cities. You can claim HRA exemption only if you are actually paying rent and not owning a house in the city you work in. Rent receipts and a PAN card of the landlord (for annual rent above ₹1 lakh) are required as documentation.",
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
export default function IndiaTaxPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="max-w-5xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
            FY 2026–26 (AY 2026–27) · Budget 2026 · Free
          </div>
          <h1 className="text-4xl font-bold text-stone-900 leading-tight mb-3">
            India Income Tax Calculator
            <span className="block text-2xl font-normal text-stone-400 mt-1">Old Regime vs New Regime — FY 2026–26</span>
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed">
            Calculate your income tax under both regimes and instantly see which saves
            you more money. Includes all deductions — Section 80C, 80D, HRA, NPS,
            home loan interest — plus surcharge, 4% cess, and Section 87A rebate.
            Accurate Finance Act 2026 rates.
          </p>
        </div>

        {/* Calculator */}
        <IndiaTaxCalculator />

        {/* ── CONTENT ── */}

        <H2>Income tax slabs FY 2026–26 (AY 2026–27)</H2>
        <P>
          India operates two parallel income tax systems that coexist: the New Tax Regime
          (introduced in FY 2020–21 under Section 115BAC and made the default from
          FY 2023–24) and the Old Tax Regime with its legacy slabs and comprehensive
          deduction system. Both regimes use progressive tax rates — higher income is
          taxed at higher marginal rates — but the slab structure, exemptions, and
          deductions differ significantly.
        </P>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* New regime table */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-orange-700">New Tax Regime</span>
              <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">Default</span>
            </div>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-orange-50 border border-orange-100">
                  <th className="py-2 px-3 text-left font-semibold text-stone-600">Income slab</th>
                  <th className="py-2 px-3 text-right font-semibold text-stone-600">Rate</th>
                </tr>
              </thead>
              <tbody className="border border-stone-200">
                {NEW_REGIME_SLABS.map((row) => (
                  <tr key={row.range} className="border-b border-stone-100 last:border-0">
                    <td className="py-2 px-3 text-stone-700">{row.range}</td>
                    <td className="py-2 px-3 text-right">
                      <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${row.rate === "Nil" ? "bg-green-100 text-green-700" : row.rate === "30%" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                        {row.rate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[11px] text-stone-400 mt-1.5">Standard deduction: ₹75,000 (salaried). No other deductions.</p>
          </div>

          {/* Old regime table */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-blue-700">Old Tax Regime</span>
              <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">Opt-in required</span>
            </div>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-blue-50 border border-blue-100">
                  <th className="py-2 px-3 text-left font-semibold text-stone-600">Income slab</th>
                  <th className="py-2 px-3 text-right font-semibold text-stone-600">Rate</th>
                </tr>
              </thead>
              <tbody className="border border-stone-200">
                {OLD_REGIME_SLABS.map((row) => (
                  <tr key={row.range} className="border-b border-stone-100 last:border-0">
                    <td className="py-2 px-3 text-stone-700">
                      {row.range}
                      {row.note && <p className="text-[10px] text-stone-400">{row.note}</p>}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${row.rate === "Nil" ? "bg-green-100 text-green-700" : row.rate === "30%" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                        {row.rate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[11px] text-stone-400 mt-1.5">Standard deduction: ₹50,000. All major deductions allowed.</p>
          </div>
        </div>

        <H2>Old Regime vs New Regime — which is better for you?</H2>
        <P>
          The fundamental trade-off between the two regimes is rates versus deductions.
          The New Regime offers lower slab rates — particularly in the ₹3 lakh to ₹15 lakh
          range — but strips away almost all deductions. The Old Regime's higher slab rates
          can be significantly offset by claiming deductions for investments, insurance,
          rent, and home loan interest.
        </P>
        <P>
          The break-even point — where both regimes produce the same tax liability — varies
          by income level. For a salaried individual earning ₹12 lakh per year, the break-even
          deduction level is roughly ₹3.5–4 lakh. If your total deductions (including the ₹50,000
          standard deduction) are above this figure, the Old Regime is cheaper. Below it, the
          New Regime wins. At higher incomes of ₹20 lakh+, the break-even deduction level is
          proportionally larger — meaning the Old Regime needs substantial investments in 80C,
          HRA, and home loan interest to compete with the lower new regime rates.
        </P>

        <H3>Key deductions available under the Old Regime</H3>
        <P>
          The Old Regime's advantage comes entirely from the deductions it permits. Here
          is a comprehensive list of the most commonly used deductions for salaried
          taxpayers:
        </P>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-50 border border-blue-100">
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Section</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Limit</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">What qualifies</th>
              </tr>
            </thead>
            <tbody className="border border-stone-200">
              {DEDUCTIONS.map((row) => (
                <tr key={row.section} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                  <td className="py-2.5 px-4 font-medium text-stone-800 text-xs whitespace-nowrap">{row.section}</td>
                  <td className="py-2.5 px-4 text-xs font-semibold text-blue-700 whitespace-nowrap">{row.limit}</td>
                  <td className="py-2.5 px-4 text-stone-500 text-xs">{row.what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H3>New Regime advantages</H3>
        <P>
          Budget 2024 and 2026 made the New Regime more attractive in three ways. First, the standard
          deduction for salaried employees was raised from ₹50,000 to ₹75,000 — reducing the
          effective taxable income for all salaried taxpayers by an additional ₹25,000.
          Second, the employer's NPS contribution deduction under Section 80CCD(2) was
          increased from 10% to 14% of salary for private sector employees (it was already
          14% for central government employees). Third, the family pension standard deduction
          was raised to ₹25,000. These changes mean the New Regime now provides meaningful
          relief even for employees who would previously have had no reason to choose it.
        </P>

        <H2>Surcharge and Health & Education Cess</H2>
        <P>
          Beyond the basic slab rates, two additional levies apply. The surcharge is charged
          on income tax for higher earners: 10% for income between ₹50 lakh and ₹1 crore;
          15% for ₹1–2 crore; 25% for ₹2–5 crore. Above ₹5 crore, the Old Regime levies
          37% surcharge while the New Regime caps it at 25% — a significant difference that
          makes the New Regime substantially cheaper for ultra-high-income individuals. Marginal
          relief provisions prevent the tax from exceeding the incremental income in each band.
          The Health and Education Cess of 4% is then applied on the combined income tax and
          surcharge, with no exemptions.
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

        {/* Disclaimer */}
        <div className="mt-10 p-4 bg-stone-50 rounded-xl border border-stone-200">
          <p className="text-xs text-stone-500 leading-relaxed">
            <strong className="text-stone-700">Disclaimer:</strong> This calculator uses
            income tax slabs and provisions as per the Finance Act 2026 for FY 2026–26
            (Assessment Year 2026–27). It is provided for general informational purposes
            only and does not constitute tax advice. Individual circumstances — including
            capital gains, agricultural income, special incomes, and state-specific levies —
            may affect your actual tax liability. For official rates and filing, refer to
            the Income Tax Department of India at{" "}
            <span className="text-stone-700">incometax.gov.in</span> or consult a
            qualified Chartered Accountant.
          </p>
        </div>

        {/* Related Tools */}
        <H2>Related Indian finance tools</H2>
        <div className="grid gap-3 sm:grid-cols-2 mt-4">
          <Link href="/finance/india-tds-calculator" className="group p-5 border border-stone-200 rounded-2xl hover:border-orange-300 hover:bg-orange-50/30 transition-colors">
            <h3 className="font-semibold text-stone-900 group-hover:text-orange-700">India TDS Calculator</h3>
            <p className="text-sm text-stone-500 mt-1">Calculate Section-wise TDS on salary, rent, professional fees, contractor payments, and more.</p>
          </Link>
          <Link href="/finance/india-sip-calculator" className="group p-5 border border-stone-200 rounded-2xl hover:border-orange-300 hover:bg-orange-50/30 transition-colors">
            <h3 className="font-semibold text-stone-900 group-hover:text-orange-700">India SIP Calculator</h3>
            <p className="text-sm text-stone-500 mt-1">Calculate mutual fund returns with step-up SIP, lumpsum, and SWP modes with inflation adjustment.</p>
          </Link>
        </div>

      </main>
    </>
  );
}
