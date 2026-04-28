import type { Metadata } from "next";
import Link from "next/link";
import AuTaxCalculator from "@/components/AuTaxCalculator";

// ─── SEO metadata ──────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Australia Income Tax Calculator 2026–26 — ATO Tax Rates",
  description:
    "Free Australia income tax calculator for FY 2026–26. Includes Stage 3 tax cuts, Medicare levy, LITO offset, HECS-HELP repayment, and superannuation. Accurate ATO rates for residents, non-residents and working holiday makers.",
  keywords: [
    "australia income tax calculator",
    "australian tax calculator 2026 25",
    "ato tax calculator",
    "how much tax do i pay australia",
    "income tax calculator australia 2026",
    "medicare levy calculator australia",
    "hecs help repayment calculator",
    "stage 3 tax cuts calculator",
    "take home pay calculator australia",
    "australian tax brackets 2026",
    "superannuation calculator australia",
    "working holiday maker tax calculator australia",
  ],
  openGraph: {
    title: "Australia Income Tax Calculator 2026–26",
    description:
      "Calculate your Australian income tax, Medicare levy, HECS-HELP repayment and take-home pay for FY 2026–26. Includes Stage 3 tax cuts.",
    url: "https://findbest.tools/finance/income-tax-calculator-australia",
  },
  alternates: {
    canonical: "https://findbest.tools/finance/income-tax-calculator-australia",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Australia Income Tax Calculator 2026–26",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
  description:
    "Free Australia income tax calculator for FY 2026–26 with Stage 3 tax cuts, Medicare levy, LITO, HECS-HELP and superannuation.",
  areaServed: "AU",
};

// ─── Content data ──────────────────────────────────────────────────

const TAX_BRACKETS_2026_25 = [
  { range: "$0 – $18,200",       rate: "0%",    tax: "Nil",           note: "Tax-free threshold" },
  { range: "$18,201 – $45,000",  rate: "19%",   tax: "19¢ per $1 over $18,200",    note: "" },
  { range: "$45,001 – $120,000", rate: "32.5%", tax: "$5,092 + 32.5¢ per $1 over $45,000", note: "Most Australians are in this bracket" },
  { range: "$120,001 – $180,000",rate: "37%",   tax: "$29,467 + 37¢ per $1 over $120,000", note: "" },
  { range: "$180,001+",          rate: "45%",   tax: "$51,667 + 45¢ per $1 over $180,000", note: "Plus 2% Medicare levy" },
];

const FAQS = [
  {
    q: "How is income tax calculated in Australia?",
    a: "Australia uses a progressive tax system — meaning higher income is taxed at higher rates, but only on the portion that falls within each bracket. For FY 2026–26, the first $18,200 is tax-free (the tax-free threshold). Income between $18,201 and $45,000 is taxed at 19%. Income from $45,001 to $120,000 is taxed at 32.5%. Income from $120,001 to $180,000 is taxed at 37%. Everything above $180,000 is taxed at 45%. The 45% rate doesn't apply to all your income — only the slice above $180,000. On top of income tax, most residents also pay the 2% Medicare levy.",
  },
  {
    q: "What are the Stage 3 tax cuts and how do they affect me?",
    a: "The Stage 3 tax cuts took effect from 1 July 2026 (FY 2026–26) and restructured Australia's middle income tax brackets. The key changes from the previous year: the 19% bracket was extended from $37,000 to $45,000; the 32.5% bracket was extended from $90,000 to $120,000; the 37% bracket was compressed; and the top 45% rate threshold remained at $180,001. The effect is a tax reduction for most Australians earning between $18,000 and $150,000. A person earning $80,000 saves approximately $1,679 per year compared to 2026–25 rates. Someone on $120,000 saves around $804.",
  },
  {
    q: "What is the Medicare levy and who pays it?",
    a: "The Medicare levy is a 2% charge on taxable income that funds Australia's public healthcare system (Medicare). It applies to most Australian tax residents. You are exempt if your income is below $26,000 (singles threshold 2026–26), with a phase-in between $26,000 and $32,500 where you pay a reduced levy. You may also be exempt if you hold certain visa types or have an exemption certificate for medical reasons. The Medicare Levy Surcharge (MLS) is an additional 1% charged to higher-income earners (above $93,000 singles, 2026–26) who do not hold private hospital cover — it is designed to encourage uptake of private health insurance.",
  },
  {
    q: "What is the Low Income Tax Offset (LITO)?",
    a: "The Low Income Tax Offset (LITO) is an offset that reduces the tax payable by low-income earners. For 2026–26: if your income is $37,500 or below, you receive the full $700 offset. Between $37,501 and $45,000, the offset phases out at 5 cents per dollar. Between $45,001 and $66,667, it phases out at 1.5 cents per dollar. Above $66,667 there is no offset. The LITO is not a cash payment — it reduces your tax bill. Combined with the tax-free threshold, it means you effectively pay no income tax until your income exceeds approximately $21,885 (where the full LITO exactly offsets the tax on income from $18,201 to that point).",
  },
  {
    q: "How does HECS-HELP repayment work?",
    a: "HECS-HELP debt is repaid compulsorily through the tax system once your income exceeds the repayment threshold, which is $54,435 for 2026–26. The repayment is a percentage of your total income — not just the amount above the threshold. Rates start at 1% and increase progressively to 10% for incomes above $159,664. For example, on a $70,000 income the repayment rate is 3%, meaning $2,100 is deducted annually. Repayments are made through your tax return (or PAYG withholding if you notify your employer). Your HELP debt also indexation each year on 1 June, tied to the Consumer Price Index (CPI) — in 2023 this was 7.1%, significantly increasing many balances.",
  },
  {
    q: "What is the Superannuation Guarantee and does it reduce my take-home pay?",
    a: "The Superannuation Guarantee (SG) is the minimum percentage of your ordinary time earnings that your employer must contribute to your superannuation fund. For 2026–26 the rate is 11.5%, rising to 12% from 1 July 2026. Importantly, employer super contributions are paid in addition to your salary — they do not reduce your take-home pay. If your salary is $80,000, your employer pays an additional $9,200 per year into your super fund. These contributions are taxed at 15% inside the fund (the concessional contributions tax rate), which is lower than most people's marginal tax rate, making super an extremely tax-efficient savings vehicle.",
  },
  {
    q: "How is tax calculated for non-residents and working holiday makers?",
    a: "Non-residents are taxed differently in two ways: they do not receive the tax-free threshold (tax starts from the first dollar), and they do not pay the Medicare levy. The non-resident tax rate is 32.5% from $0 to $120,000, then 37% to $180,000, then 45% above $180,000. Working holiday makers (subclass 417 or 462 visas) are taxed at 15% on the first $45,000, then at the same rates as non-residents above that. Working holiday makers do not access the tax-free threshold but may be eligible for the Low Income Tax Offset in some circumstances. Both non-residents and working holiday makers may have superannuation contributions made on their behalf, which they can claim as a Departing Australia Superannuation Payment (DASP) when leaving.",
  },
  {
    q: "What is the difference between effective tax rate and marginal tax rate?",
    a: "Your marginal tax rate is the rate that applies to the next dollar you earn — it's the rate of the highest bracket your income reaches. If you earn $90,000, your marginal rate is 32.5%. Your effective tax rate is your total tax as a percentage of your total income. Because the lower brackets are taxed at lower rates, your effective rate is always lower than your marginal rate. Someone earning $90,000 in 2026–26 pays about $19,717 in income tax (before LITO), giving an effective rate of approximately 21.9%, even though their marginal rate is 32.5%. Understanding the difference matters for financial decisions — a pay rise doesn't mean all your income is taxed at the new higher rate.",
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
export default function AuTaxPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="max-w-5xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />
            FY 2026–26 · Stage 3 cuts · ATO rates · Free
          </div>
          <h1 className="text-4xl font-bold text-stone-900 leading-tight mb-3">
            Australia Income Tax Calculator
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed">
            Calculate your Australian income tax, Medicare levy, HECS-HELP repayment,
            and take-home pay for the 2026–26 financial year. Accurate ATO tax brackets
            including the Stage 3 tax cuts. Covers residents, non-residents, and
            working holiday makers.
          </p>
        </div>

        {/* Calculator */}
        <AuTaxCalculator />

        {/* ── CONTENT ── */}

        <H2>Australian income tax rates 2026–26</H2>
        <P>
          Australia uses a progressive income tax system, which means different portions
          of your income are taxed at different rates. You do not pay the highest rate on
          all your income — only on the slice that falls within each bracket. The
          2026–26 financial year (1 July 2026 to 30 June 2026) reflects the Stage 3
          tax cuts, which restructured the middle brackets and delivered tax relief to
          most Australians earning between $18,000 and $150,000.
        </P>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-yellow-50 border border-yellow-100">
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Taxable income</th>
                <th className="text-right py-2.5 px-4 text-xs font-semibold text-stone-600">Rate</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Tax on this income</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Notes</th>
              </tr>
            </thead>
            <tbody className="border border-stone-200">
              {TAX_BRACKETS_2026_25.map((row) => (
                <tr key={row.range} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                  <td className="py-2.5 px-4 font-medium text-stone-800 text-xs">{row.range}</td>
                  <td className="py-2.5 px-4 text-right">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      row.rate === "0%" ? "bg-green-100 text-green-700" :
                      row.rate === "19%" ? "bg-blue-100 text-blue-700" :
                      row.rate === "32.5%" ? "bg-yellow-100 text-yellow-700" :
                      row.rate === "37%" ? "bg-orange-100 text-orange-700" :
                      "bg-red-100 text-red-700"
                    }`}>{row.rate}</span>
                  </td>
                  <td className="py-2.5 px-4 text-stone-600 text-xs">{row.tax}</td>
                  <td className="py-2.5 px-4 text-stone-400 text-xs">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <P>
          These rates apply to Australian residents. A separate rate schedule applies
          to non-residents (no tax-free threshold, 32.5% from the first dollar) and
          working holiday makers (15% on the first $45,000). Plus, most residents pay
          an additional 2% Medicare levy on top of these rates.
        </P>

        <H2>The Stage 3 tax cuts — what changed from 1 July 2026</H2>
        <P>
          The most significant change to Australian income tax in over a decade took effect
          at the start of FY 2026–26. The Stage 3 tax cuts, legislated by the Albanese
          Government in a modified form from the Morrison Government's original design,
          restructured the middle tax brackets in the following ways: the top of the 19%
          bracket moved from $37,000 to $45,000; the 32.5% bracket was extended from a
          ceiling of $90,000 up to $120,000; and the 37% bracket — which previously
          started at $120,000 — was retained but compressed, now applying only between
          $120,001 and $180,000 rather than starting at $90,001. The 45% rate threshold
          remained unchanged at $180,001.
        </P>
        <P>
          The practical effect is a meaningful tax reduction for middle-income earners.
          Someone earning $60,000 saves around $1,179 per year. Someone on $100,000
          saves roughly $2,179. Very high earners above $200,000 see little change relative
          to the 2026–25 rates. The cuts were designed to reduce bracket creep — the phenomenon
          where wage inflation pushes workers into higher tax brackets without any real
          increase in purchasing power.
        </P>

        <H3>Medicare levy and surcharge</H3>
        <P>
          On top of income tax, most Australian residents pay a Medicare levy of 2% of
          their taxable income. This funds Australia's universal public health system.
          The levy is reduced or waived for very low income earners — the phase-in threshold
          for singles is $26,000, meaning below this amount no levy is payable, with a
          gradual shade-in between $26,000 and $32,500.
        </P>
        <P>
          The Medicare Levy Surcharge (MLS) is a separate additional charge of 1% that
          applies to higher-income earners who do not hold an appropriate level of private
          hospital cover. The singles threshold is $93,000 for 2026–26. The purpose is to
          reduce pressure on the public health system by incentivising private health
          insurance uptake. For someone earning $100,000 without private hospital cover,
          the surcharge adds $1,000 to their annual tax bill — often making private cover
          a cost-neutral or cheaper option.
        </P>

        <H3>HECS-HELP debt: compulsory repayment through tax</H3>
        <P>
          If you have an outstanding HECS-HELP debt — the income-contingent loan that
          covers Australian university fees — you are required to make compulsory
          repayments through the tax system once your repayment income exceeds $54,435
          (2026–26). The repayment is calculated as a percentage of your total income,
          starting at 1% and reaching 10% for incomes above $159,664. Unlike UK student
          loans, HECS-HELP repayments are calculated on the full income, not just the
          amount above the threshold. This means at $70,000 income you repay 3% of
          $70,000 = $2,100, not 3% of ($70,000 − $54,435).
        </P>
        <P>
          Your HELP debt is indexed each year on 1 June to the Consumer Price Index (CPI),
          which means the real value of your debt stays constant but the nominal balance
          grows. In 2023, CPI indexation was 7.1% — unusually high due to inflation —
          and significantly increased many outstanding HECS balances. Voluntary repayments
          can be made at any time through the ATO, but there is no longer a discount for
          doing so (the 5% and 10% bonus schemes were abolished in 2017).
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
            ATO tax rates and thresholds for the 2026–26 financial year. It is provided
            for general informational purposes only and does not constitute tax advice.
            Individual circumstances — including deductions, offsets not modelled here,
            investment income, and state-based levies — may affect your actual tax
            liability. Always verify your tax position with a registered tax agent or
            the ATO at{" "}
            <span className="text-stone-700">ato.gov.au</span>.
          </p>
        </div>

        {/* Related Tools */}
        <H2>Related Australian finance tools</H2>
        <div className="grid gap-3 sm:grid-cols-2 mt-4">
          <Link href="/finance/australia-stamp-duty-calculator" className="group p-5 border border-stone-200 rounded-2xl hover:border-yellow-300 hover:bg-yellow-50/30 transition-colors">
            <h3 className="font-semibold text-stone-900 group-hover:text-yellow-700">Australia Stamp Duty Calculator</h3>
            <p className="text-sm text-stone-500 mt-1">Calculate property transfer duty for all Australian states with 2026 rates & concessions.</p>
          </Link>
          <Link href="/finance/australia-gst-calculator" className="group p-5 border border-stone-200 rounded-2xl hover:border-yellow-300 hover:bg-yellow-50/30 transition-colors">
            <h3 className="font-semibold text-stone-900 group-hover:text-yellow-700">Australia GST Calculator</h3>
            <p className="text-sm text-stone-500 mt-1">Calculate GST, add/remove GST, and see total price for Australian business transactions.</p>
          </Link>
        </div>

      </main>
    </>
  );
}
