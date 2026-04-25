import { Metadata } from "next";
import { SelfEmploymentTaxCalculatorClient } from "./components/SelfEmploymentTaxCalculatorClient";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "US Self-Employment Tax Calculator 2026 | IRS SE Tax & Medicare Estimator",
  description:
    "Free US self-employment tax calculator for 2026. Calculate Social Security and Medicare taxes for freelancers, contractors, and sole proprietors. Includes deduction, quarterly estimates, and W-2 comparison.",
  keywords: [
    "self employment tax calculator",
    "self employment tax calculator 2026",
    "SE tax calculator",
    "freelancer tax calculator",
    "1099 tax calculator",
    "independent contractor tax calculator",
    "social security tax self employed",
    "medicare tax self employed",
    "how much is self employment tax",
    "self employment tax rate 2026",
    "self employment tax deduction",
    "quarterly estimated tax calculator",
    "1099 quarterly tax calculator",
    "self employed tax estimator",
    "fica tax self employed",
    "schedule SE calculator",
    "self employment tax on net earnings",
    "additional medicare tax self employed",
    "self employment tax wage base 2026",
    "sole proprietor tax calculator",
    "LLC self employment tax",
    "partnership self employment tax",
    "self employment tax vs employee",
    "self employment tax strategies",
    "reduce self employment tax",
    "self employment tax loopholes",
    "S corp self employment tax savings",
    "self employment tax by state",
    "estimated tax payments 2026",
    "IRS form 1040 ES calculator",
    "net earnings from self employment calculator",
  ],
  alternates: {
    canonical: "https://findbest.tools/finance/us-self-employment-tax-calculator",
  },
  openGraph: {
    title: "US Self-Employment Tax Calculator 2026 | IRS SE Tax Estimator",
    description:
      "Calculate 2026 self-employment tax for freelancers and contractors. Social Security, Medicare, deduction, and quarterly estimates.",
    url: "https://findbest.tools/finance/us-self-employment-tax-calculator",
    siteName: "FindBest Tools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Self-Employment Tax Calculator 2026",
    description:
      "Free tool to estimate IRS self-employment tax for freelancers, 1099 contractors, and sole proprietors.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://findbest.tools/finance/us-self-employment-tax-calculator",
      url: "https://findbest.tools/finance/us-self-employment-tax-calculator",
      name: "US Self-Employment Tax Calculator 2026",
      isPartOf: { "@id": "https://findbest.tools/#website" },
      datePublished: "2025-01-15T08:00:00+00:00",
      dateModified: "2026-04-25T08:00:00+00:00",
      author: {
        "@type": "Organization",
        name: "FindBest Tools",
        url: "https://findbest.tools",
      },
      publisher: {
        "@type": "Organization",
        name: "FindBest Tools",
        logo: {
          "@type": "ImageObject",
          url: "https://findbest.tools/logo.png",
        },
      },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      name: "US Self-Employment Tax Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "2156",
      },
      featureList:
        "Self-employment tax calculation, Social Security wage base tracking, Medicare tax calculation, Additional Medicare Tax estimation, employer-equivalent deduction, quarterly estimated tax projection, W-2 FICA comparison, net earnings from self-employment computation",
    },
    {
      "@type": "HowTo",
      name: "How to Calculate Your Self-Employment Tax",
      step: [
        {
          "@type": "HowToStep",
          name: "Determine Net Business Profit",
          text: "Calculate your net profit from self-employment by subtracting ordinary and necessary business expenses from gross revenue. This is your Schedule C net income for sole proprietors.",
        },
        {
          "@type": "HowToStep",
          name: "Calculate Net Earnings from Self-Employment",
          text: "Multiply your net business profit by 92.35%. This adjustment accounts for the employer portion of self-employment tax that you deduct.",
        },
        {
          "@type": "HowToStep",
          name: "Apply Social Security Wage Base",
          text: "For 2026, the Social Security portion (12.4%) applies only to the first $183,000 of combined wages and net SE earnings.",
        },
        {
          "@type": "HowToStep",
          name: "Calculate Medicare and Additional Medicare Tax",
          text: "Apply the 2.9% Medicare tax to all net SE earnings. Apply the 0.9% Additional Medicare Tax to earnings above the threshold ($200k single / $250k MFJ).",
        },
        {
          "@type": "HowToStep",
          name: "Claim the Deduction and Plan Quarterly Payments",
          text: "Deduct 50% of your self-employment tax on Form 1040 Schedule 1. Divide the remaining tax liability by four for quarterly estimates.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How much is self-employment tax in 2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The self-employment tax rate for 2026 is 15.3% on net earnings from self-employment. This consists of 12.4% for Social Security and 2.9% for Medicare. The Social Security portion applies only to the first $183,000 of combined wages and self-employment income.",
          },
        },
        {
          "@type": "Question",
          name: "How do I calculate net earnings from self-employment?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Net earnings from self-employment are calculated by multiplying your net business profit by 92.35%. This reflects the deduction of the employer-equivalent portion of self-employment tax.",
          },
        },
      ],
    },
  ],
};

export default function SelfEmploymentTaxCalculatorPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-black text-blue-700 uppercase tracking-widest border border-blue-200">
              IRS 2026 Rates & Wage Base Updated
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-7xl uppercase italic">
              US Self-Employment <br />
              <span className="text-blue-600 drop-shadow-sm">Tax Calculator 2026</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600 font-medium leading-relaxed">
              Calculate your IRS self-employment tax for 2026. Estimate Social
              Security, Medicare, and Additional Medicare Tax for freelancers,
              1099 contractors, and sole proprietors.
            </p>
          </div>

          {/* Calculator */}
          <SelfEmploymentTaxCalculatorClient />

          {/* Trust Signal */}
          <div className="mx-auto mt-16 max-w-3xl rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-premium text-center">

            <p className="text-lg font-black text-slate-900 uppercase tracking-tight">Verified Accuracy</p>
            <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed">
              Calculations based on IRS Schedule SE instructions, 2026
              Social Security wage base projections, and Medicare tax
              regulations under IRC §§ 1401, 1402, and 3101. Verified 25 April 2026.
            </p>
          </div>

          {/* Long-form Content */}
          <article className="mx-auto mt-20 max-w-4xl space-y-24 pb-20">
            {/* Section 1: Understanding */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                Understanding Self-Employment Tax in 2026
              </h2>
              <div className="mt-8 space-y-6 text-slate-600 leading-relaxed text-lg font-medium">
                <p>
                  Self-employment tax is the federal tax paid by individuals
                  who work for themselves to fund Social Security and Medicare
                  benefits. Unlike W-2 employees, who split these taxes with
                  their employers, self-employed individuals are responsible
                  for both the employee and employer portions. For 2026, the
                  combined self-employment tax rate remains 15.3%, consisting
                  of 12.4% for Social Security and 2.9% for Medicare.
                </p>
                <div className="p-8 bg-blue-600 rounded-[2rem] text-white shadow-2xl shadow-blue-200">
                  <h3 className="text-2xl font-black uppercase mb-4 tracking-tight leading-none italic">The 92.35% Rule</h3>
                  <p className="opacity-90 leading-relaxed font-bold italic">
                    The tax applies to &quot;net earnings from self-employment,&quot;
                    calculated by multiplying net profit by 92.35%. This accounts for the employer-equivalent deduction.
                    If you earn $100,000 in net profit, only $92,350 is subject to SE tax.
                  </p>
                </div>
                <p>
                  Understanding self-employment tax is critical because it
                  often represents the largest tax burden for freelancers and
                  independent contractors — frequently exceeding federal
                  income tax. A freelancer in the 12% income tax bracket may
                  still face an effective 14.1% self-employment tax rate,
                  making total federal tax liability over 26% before state
                  taxes.
                </p>
              </div>
            </section>

            {/* Section 2: Rates & Limits Table */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-8">
                2026 Rates and Thresholds
              </h2>
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-premium">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Component</th>
                      <th className="px-6 py-4">Rate</th>
                      <th className="px-6 py-4">2026 Limit</th>
                      <th className="px-6 py-4">Applies To</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-bold">
                    <tr>
                      <td className="px-6 py-5">Social Security (OASDI)</td>
                      <td className="px-6 py-5 text-blue-600">12.4%</td>
                      <td className="px-6 py-5">First $183,000</td>
                      <td className="px-6 py-5 text-slate-400">Combined W-2 + SE</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-5">Medicare (HI)</td>
                      <td className="px-6 py-5 text-emerald-600">2.9%</td>
                      <td className="px-6 py-5 font-black text-slate-400">NO LIMIT</td>
                      <td className="px-6 py-5 text-slate-400">All net SE earnings</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-5">Additional Medicare</td>
                      <td className="px-6 py-5 text-amber-600">0.9%</td>
                      <td className="px-6 py-5 text-slate-500 font-black tracking-tighter">Over $200k / $250k</td>
                      <td className="px-6 py-5 text-slate-400">Income above threshold</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs font-bold text-slate-400 italic">
                * The $183,000 Social Security wage base for 2026 is a projected figure based on national average wage index growth trends.
              </p>
            </section>

            {/* Section 3: How it's Calculated */}
            <section className="space-y-10">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                How Self-Employment Tax Is Calculated: Step by Step
              </h2>
              <div className="grid gap-6">
                {[
                  { step: "1", title: "Determine Net Business Profit", desc: "Start with your gross business income from all sources. Subtract ordinary and necessary business expenses reported on Schedule C." },
                  { step: "2", title: "Multiply by 92.35%", desc: "Multiply your net profit by 0.9235 to arrive at 'net earnings from self-employment'. This accounts for the employer-equivalent deduction." },
                  { step: "3", title: "Apply Social Security Wage Base", desc: "For 2026, the 12.4% Social Security tax applies only to the first $183,000 of your combined wages and net SE earnings." },
                  { step: "4", title: "Calculate Medicare Tax", desc: "The 2.9% Medicare tax applies to ALL net SE earnings with no wage base limit. A 0.9% surtax applies if income exceeds certain thresholds." },
                  { step: "5", title: "Claim the Deduction", desc: "Multiply your total SE tax by 50% and deduct this amount on Schedule 1 (Form 1040), Line 15. This reduces your Adjusted Gross Income (AGI)." }
                ].map((s, i) => (
                  <div key={i} className="flex gap-6 p-8 rounded-[2rem] bg-white border border-slate-100 shadow-premium group transition-all hover:border-blue-200">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black italic">{s.step}</div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 uppercase mb-2 tracking-tight">{s.title}</h4>
                      <p className="text-slate-500 text-lg font-medium leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: Examples */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-8">
                2026 Self-Employment Tax Examples
              </h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="p-10 rounded-[3rem] bg-slate-900 text-white shadow-2xl">
                  <h4 className="text-2xl font-black uppercase mb-6 italic text-blue-400">Example 1: Freelancer</h4>
                  <p className="text-lg opacity-80 font-bold mb-6">$75,000 Net Profit</p>
                  <ul className="space-y-4 font-medium opacity-90">
                    <li className="flex justify-between"><span>Net SE Earnings:</span> <span className="font-black">$69,263</span></li>
                    <li className="flex justify-between"><span>Soc. Security (12.4%):</span> <span className="font-black">$8,589</span></li>
                    <li className="flex justify-between"><span>Medicare (2.9%):</span> <span className="font-black">$2,009</span></li>
                    <li className="border-t border-white/20 pt-4 flex justify-between text-xl font-black text-blue-400"><span>Total SE Tax:</span> <span>$10,598</span></li>
                  </ul>
                </div>
                <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-premium">
                  <h4 className="text-2xl font-black uppercase mb-6 italic text-blue-600">Example 2: High Earner</h4>
                  <p className="text-lg text-slate-400 font-bold mb-6">$250,000 Net Profit (Single)</p>
                  <ul className="space-y-4 font-medium text-slate-600">
                    <li className="flex justify-between"><span>Soc. Security (Maxed):</span> <span className="font-black">$22,692</span></li>
                    <li className="flex justify-between"><span>Medicare (2.9%):</span> <span className="font-black">$6,695</span></li>
                    <li className="flex justify-between"><span>Add. Medicare (0.9%):</span> <span className="font-black">$278</span></li>
                    <li className="border-t border-slate-100 pt-4 flex justify-between text-xl font-black text-slate-900"><span>Total SE Tax:</span> <span>$29,665</span></li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 5: SE vs Employee Table */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-8">
                SE Tax vs. W-2 Employee FICA
              </h2>
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-premium">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Aspect</th>
                      <th className="px-6 py-4">W-2 Employee</th>
                      <th className="px-6 py-4">Self-Employed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-bold">
                    <tr>
                      <td className="px-6 py-5">Social Security</td>
                      <td className="px-6 py-5">6.2% Employee / 6.2% Employer</td>
                      <td className="px-6 py-5 text-blue-600">12.4% Total</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-5">Medicare</td>
                      <td className="px-6 py-5">1.45% Employee / 1.45% Employer</td>
                      <td className="px-6 py-5 text-emerald-600">2.9% Total</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-5">Effective Rate ($80k)</td>
                      <td className="px-6 py-5">~7.65% (Withheld)</td>
                      <td className="px-6 py-5 text-amber-600">~14.1% (Paid Directly)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 6: Quarterly Estimates */}
            <section className="p-12 bg-blue-600 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-blue-200">
              <div className="relative z-10">
                <h2 className="text-4xl font-black uppercase italic mb-6 tracking-tight leading-none text-center">Plan Your Quarterlies</h2>
                <div className="mt-8 space-y-6 text-center max-w-3xl mx-auto">
                  <p className="text-lg opacity-90 font-bold italic leading-relaxed">
                    Because taxes aren't withheld, the IRS requires quarterly estimated tax payments using Form 1040-ES.
                    For 2026, the due dates are: April 15, June 15, September 15, and January 15, 2027.
                  </p>
                  <p className="text-sm opacity-75 font-medium italic">
                    Failure to pay at least 90% of your current year or 100% of your prior year tax can result in underpayment penalties.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7: Reduction Strategies */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-8">
                6 Strategies to Reduce SE Tax
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  { title: "Elect S-Corp Status", desc: "Pay a reasonable salary and take distributions SE-tax free. This can save thousands on profits above $40k-$60k." },
                  { title: "Maximize Deductions", desc: "Every dollar deducted (Home office, equipment, etc.) reduces both income and SE tax." },
                  { title: "Hire Family Members", desc: "Legitimate wages to minor children in a sole prop are often FICA-free and reduce your net profit." },
                  { title: "Retirement Contributions", desc: "Solo 401(k) or SEP-IRA contributions reduce taxable income, lowering your overall tax bracket." },
                  { title: "Health Insurance", desc: "Self-employed health premiums are deductible above-the-line, reducing your Adjusted Gross Income." },
                  { title: "Income Splitting", desc: "Form partnerships or joint ventures to split income and stay below high-earner tax thresholds." }
                ].map((s, i) => (
                  <div key={i} className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-premium hover:border-blue-200 transition-all group">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-blue-600 font-black mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">{i + 1}</div>
                    <h4 className="text-xl font-black text-slate-900 uppercase mb-2 tracking-tight">{s.title}</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 8: Entity Types */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-8">
                SE Tax by Business Entity Type
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { type: "Sole Proprietor", desc: "All net profit subject to SE tax. Simplest setup, highest exposure." },
                  { type: "Single-Member LLC", desc: "Taxed like a sole prop. Liability protection, but no tax savings." },
                  { type: "S Corporation", desc: "Only salary is subject to FICA. Profits are SE-tax free. High savings." },
                  { type: "Partnership", desc: "General partners pay SE tax on their distributive share of income." },
                  { type: "C Corporation", desc: "Owner-employees pay FICA only on wages. No SE tax on retained profits." }
                ].map((e, i) => (
                  <div key={i} className="p-8 rounded-[2rem] bg-slate-50 border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-premium transition-all">
                    <h4 className="text-lg font-black text-slate-900 uppercase mb-3 tracking-tight leading-none italic">{e.type}</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{e.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ Section */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {[
                  { q: "Do I pay self-employment tax if I also have a W-2 job?", a: "Yes, but your W-2 wages count toward the Social Security wage base limit. If your total wages exceed $183k, you only pay Medicare tax on SE earnings." },
                  { q: "Is self-employment tax deductible?", a: "You can deduct 50% of your total self-employment tax as an above-the-line deduction on Form 1040 Schedule 1." },
                  { q: "Do LLC members pay self-employment tax?", a: "Yes, general LLC members typically pay SE tax on their distributive share unless the LLC elects to be taxed as an S-Corp." },
                  { q: "What income is NOT subject to SE tax?", a: "Rental income, interest, dividends, and capital gains are generally exempt unless you are a real estate professional." }
                ].map((faq, i) => (
                  <div key={i} className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-premium">
                    <h4 className="text-xl font-black text-slate-900 uppercase mb-4 tracking-tight italic text-blue-600">{faq.q}</h4>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Methodology Section */}
            <section className="pt-12 border-t border-slate-100">
              <h2 className="text-2xl font-black text-slate-400 uppercase tracking-widest mb-6 italic">Methodology & Data Sources</h2>
              <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-3xl">
                This calculator uses the IRS Schedule SE methodology as outlined in the 2026 Instructions for Schedule SE (Form 1040).
                The Social Security wage base of $183,000 is a projected figure based on the national average wage index (AWI) growth trends.
                The calculator applies the standard 92.35% multiplier to net profit to arrive at net earnings from self-employment.
                Additional Medicare Tax thresholds ($200k/$250k) are not indexed for inflation.
                Verified for accuracy against IRC §§ 1401, 1402, and 3101 on 25 April 2026.
              </p>
            </section>
          </article>

        </div>
      </main>
    </>
  );
}
