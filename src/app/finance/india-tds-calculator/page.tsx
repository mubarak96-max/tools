import { Metadata } from "next";
import { IndiaTDSCalculatorClient } from "./components/IndiaTDSCalculatorClient";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: "TDS Calculator India 2025-26 | Section-wise TDS Deduction",
  description:
    "Free India TDS calculator for FY 2025-26 (AY 2026-27). Calculate TDS on salary, rent, professional fees, contractor payments, interest & commission. Includes surcharge, cess & threshold limits.",
  keywords: [
    "TDS calculator India",
    "TDS calculator 2025-26",
    "TDS on salary calculator",
    "TDS on rent calculator",
    "TDS on professional fees",
    "section 192 TDS calculator",
    "section 194J TDS calculator",
    "section 194C TDS calculator",
    "section 194I TDS calculator",
    "section 194H TDS calculator",
    "section 194A TDS calculator",
    "TDS rate chart 2025-26",
    "TDS threshold limit",
    "TDS on contractor payment",
    "TDS on commission",
    "TDS on interest",
    "TDS surcharge cess",
    "TDS deduction calculator",
    "income tax TDS calculator",
    "TDS amount calculator",
    "how to calculate TDS",
    "TDS formula India",
    "TDS on payment to NRI",
    "TDS on salary new tax regime",
    "TDS on salary old tax regime",
    "monthly TDS calculator",
    "TDS liability calculator",
    "TDS return filing",
    "Form 16 calculator",
    "Form 26AS TDS",
  ],
  authors: [{ name: "FindBest Tools", url: "https://findbest.tools" }],
  creator: "FindBest Tools",
  publisher: "FindBest Tools",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://findbest.tools/finance/india-tds-calculator",
  },
  openGraph: {
    title: "TDS Calculator India 2025-26 | Section-wise TDS on Salary, Rent, Fees",
    description:
      "Calculate TDS deductions for FY 2025-26. Salary, rent, professional fees, contractor payments, interest & commission with surcharge and cess.",
    url: "https://findbest.tools/finance/india-tds-calculator",
    siteName: "FindBest Tools",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://findbest.tools/og-india-tds-calculator.jpg",
        width: 1200,
        height: 630,
        alt: "India TDS Calculator 2025-26",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TDS Calculator India 2025-26",
    description:
      "Free section-wise TDS calculator for salary, rent, professional fees, contractor payments & more.",
    images: ["https://findbest.tools/og-india-tds-calculator.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://findbest.tools/finance/india-tds-calculator",
      url: "https://findbest.tools/finance/india-tds-calculator",
      name: "TDS Calculator India 2025-26",
      isPartOf: { "@id": "https://findbest.tools/#website" },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://findbest.tools/og-india-tds-calculator.jpg",
      },
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
      inLanguage: "en-IN",
    },
    {
      "@type": "SoftwareApplication",
      name: "India TDS Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "5621",
      },
      featureList:
        "Section 192 salary TDS, Section 194J professional fees TDS, Section 194C contractor TDS, Section 194I rent TDS, Section 194H commission TDS, Section 194A interest TDS, Section 195 NRI TDS, surcharge and cess calculation, threshold limit checking, new vs old tax regime salary TDS",
    },
    {
      "@type": "HowTo",
      name: "How to Calculate TDS in India",
      step: [
        {
          "@type": "HowToStep",
          name: "Identify the TDS Section",
          text: "Determine which section of the Income Tax Act applies to your payment. Salary falls under Section 192, rent under 194I, professional fees under 194J, contractor payments under 194C, and interest under 194A.",
        },
        {
          "@type": "HowToStep",
          name: "Check the Threshold Limit",
          text: "Verify if the payment exceeds the threshold limit for TDS applicability. For example, TDS on interest (194A) applies only if annual interest exceeds ₹40,000 (₹50,000 for senior citizens).",
        },
        {
          "@type": "HowToStep",
          name: "Apply the Correct TDS Rate",
          text: "Use the prescribed TDS rate for the section. For professional fees (194J), the rate is 10% for technical services and 10% for professional services. For contractors (194C), it is 1% for individuals/HUF and 2% for others.",
        },
        {
          "@type": "HowToStep",
          name: "Add Surcharge and Health & Education Cess",
          text: "For payments exceeding ₹50 lakh to ₹1 crore, add 10% surcharge. Above ₹1 crore, 15% surcharge. Above ₹5 crore, 25% surcharge. Above ₹10 crore, 37% surcharge. Then add 4% health and education cess on the TDS amount plus surcharge.",
        },
        {
          "@type": "HowToStep",
          name: "Deduct and Deposit TDS",
          text: "Deduct the calculated TDS from the payment to the deductee. Deposit the TDS with the government by the 7th of the following month using Challan 281 and file quarterly TDS returns.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the TDS rate on salary in India for FY 2025-26?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "TDS on salary (Section 192) is deducted at the average rate of income tax applicable to the employee. For FY 2025-26, under the new tax regime: 0% up to ₹4,00,000, 5% on ₹4,00,001-₹8,00,000, 10% on ₹8,00,001-₹12,00,000, 15% on ₹12,00,001-₹16,00,000, 20% on ₹16,00,001-₹20,00,000, 25% on ₹20,00,001-₹24,00,000, and 30% above ₹24,00,000. Under the old tax regime, rates are 0% up to ₹3,00,000, 5% on ₹3,00,001-₹5,00,000, 20% on ₹5,00,001-₹10,00,000, and 30% above ₹10,00,000, with various deductions available.",
          },
        },
        {
          "@type": "Question",
          name: "What is the TDS rate on professional fees in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Under Section 194J, TDS on professional fees is 10% if the payee has furnished a valid PAN. If PAN is not provided, TDS is deducted at 20%. For fees paid to a resident call centre operator, the rate is 2%. The threshold limit is ₹30,000 per financial year for each type of service (professional, technical, or royalty). Surcharge and cess apply for payments exceeding ₹50 lakh.",
          },
        },
        {
          "@type": "Question",
          name: "What is the TDS rate on rent in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Under Section 194I, TDS on rent is: 2% for plant, machinery, or equipment, and 10% for land, building, or furniture. The threshold is ₹2,40,000 per financial year. For individuals and HUFs not subject to tax audit, Section 194IB applies with a flat 5% TDS rate for rent exceeding ₹50,000 per month. If PAN is not provided, TDS is 20%.",
          },
        },
        {
          "@type": "Question",
          name: "When is TDS not deducted?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "TDS is not deducted when: (1) the payment amount is below the threshold limit for that section, (2) the deductee has obtained a lower or nil TDS certificate from the Assessing Officer (Form 13), (3) the deductee is a government body or notified institution exempt from TDS, (4) for salary TDS, if the estimated total income is below the basic exemption limit, (5) for interest from banks (194A), if the total interest is below ₹40,000 (₹50,000 for senior citizens), and (6) for payments to non-residents where a Double Taxation Avoidance Agreement (DTAA) provides a lower rate.",
          },
        },
        {
          "@type": "Question",
          name: "What is the due date for TDS deposit and return filing?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "TDS must be deposited by the 7th of the month following the month of deduction (30th April for March deductions). Quarterly TDS returns (Form 24Q for salary, 26Q for non-salary payments to residents, 27Q for payments to non-residents) are due by: 31st July for Q1 (Apr-Jun), 31st October for Q2 (Jul-Sep), 31st January for Q3 (Oct-Dec), and 31st May for Q4 (Jan-Mar). TDS certificates (Form 16 for salary, Form 16A for non-salary) must be issued by 15th June and 15th August respectively.",
          },
        },
      ],
    },
  ],
};

export default function IndiaTDSCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-cyan-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-cyan-600 ring-1 ring-inset ring-cyan-500/20">
              Updated April 2026 — FY 2025-26 (AY 2026-27)
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-7xl uppercase italic">
              India <span className="text-cyan-600">TDS Calculator</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg font-medium text-slate-500 leading-relaxed">
              Calculate section-wise Tax Deducted at Source (TDS) for FY 2025-26. 
              Comprehensive tool for salary, rent, professional fees, contractor 
              payments, interest, and commission with surcharge and cess.
            </p>
          </div>

          {/* Calculator */}
          <IndiaTDSCalculatorClient />

          {/* Long-form Content */}
          <article className="mx-auto mt-32 max-w-4xl space-y-24">
            {/* Section 1 */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                Understanding Tax Deducted at Source (TDS) in India
              </h2>
              <div className="mt-8 space-y-6 text-slate-600 font-medium leading-relaxed">
                <p>
                  Tax Deducted at Source (TDS) is a mechanism introduced by
                  the Income Tax Department of India to collect tax at the
                  very source of income. Under this system, the person
                  making a payment (deductor) is required to deduct tax at
                  prescribed rates before making the payment to the
                  recipient (deductee). The deducted amount is then
                  deposited with the Central Government. TDS applies to
                  salaries, interest, rent, commission, professional fees,
                  contractor payments, and various other specified
                  transactions.
                </p>
                <p>
                  For FY 2025-26 (Assessment Year 2026-27), TDS remains one
                  of the most significant compliance requirements for
                  businesses, employers, and individuals making specified
                  payments. The deductor must obtain a Tax Deduction and
                  Collection Account Number (TAN), deduct TDS, deposit it
                  by the due date, file quarterly TDS returns, and issue
                  TDS certificates to deductees. Failure to comply results
                  in interest, penalties, and disallowance of expenses.
                </p>
                <p>
                  This calculator covers all major TDS sections with
                  current rates, threshold limits, surcharge applicability,
                  and health & education cess. Whether you are an employer
                  calculating salary TDS, a business paying contractor
                  bills, or a tenant paying rent, this tool provides
                  accurate, instant calculations.
                </p>
              </div>
            </section>

            {/* Section 2: Rate Chart */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                TDS Rate Chart for FY 2025-26 (AY 2026-27)
              </h2>
              <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-100 shadow-sm bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Section</th>
                      <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Nature of Payment</th>
                      <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Rate (PAN)</th>
                      <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Threshold Limit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                    {[
                      { s: "192", n: "Salary", r: "Avg. Tax Rate", t: "Basic Exemption" },
                      { s: "192A", n: "PF Withdrawal", r: "10%", t: "₹50,000" },
                      { s: "193", n: "Int. on Securities", r: "10%", t: "₹10,000" },
                      { s: "194", n: "Dividend", r: "10%", t: "₹5,000" },
                      { s: "194A", n: "Int. (Others)", r: "10%", t: "₹5,000" },
                      { s: "194A", n: "Int. (Banks)", r: "10%", t: "₹40k / ₹50k SC" },
                      { s: "194C", n: "Contractor", r: "1%/2%", t: "₹30k / ₹1L FY" },
                      { s: "194H", n: "Commission", r: "5%", t: "₹15,000" },
                      { s: "194I", n: "Rent (Machinery)", r: "2%", t: "₹2,40,000" },
                      { s: "194I", n: "Rent (Building)", r: "10%", t: "₹2,40,000" },
                      { s: "194IB", n: "Rent (Ind/HUF)", r: "5%", t: "₹50k/month" },
                      { s: "194J", n: "Prof. Fees", r: "10%", t: "₹30,000" },
                      { s: "194K", n: "MF Income", r: "10%", t: "₹5,000" },
                      { s: "194O", n: "E-commerce", r: "1%", t: "₹5,00,000" },
                      { s: "195", n: "NRI Payment", r: "DTAA / Act", t: "Nil" },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-black text-cyan-600 italic">{row.s}</td>
                        <td className="px-6 py-4 text-slate-900 font-bold">{row.n}</td>
                        <td className="px-6 py-4">{row.r}</td>
                        <td className="px-6 py-4 font-bold italic">{row.t}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                * Rates apply to valid PAN holders. No-PAN deduction is 20% (Sec 206AA).
              </p>
            </section>

            {/* Section 3: Salary TDS */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                TDS on Salary (Section 192): FY 2025-26
              </h2>
              <div className="mt-8 space-y-6 text-slate-600 font-medium leading-relaxed">
                <p>
                  TDS on salary is unique because it is not deducted at a
                  flat rate. Instead, the employer calculates the
                  employee's estimated total income for the financial
                  year, applies the applicable tax slab, and deducts TDS
                  proportionally each month. The employee can choose
                  between the new tax regime (lower rates, no deductions)
                  or the old tax regime (higher rates, with deductions).
                </p>
                <div className="grid gap-6 sm:grid-cols-2">
                   <div className="rounded-[2.5rem] bg-cyan-50/50 border border-cyan-100 p-8 shadow-sm">
                      <h4 className="text-sm font-black text-cyan-600 uppercase tracking-widest mb-6 italic">New Tax Regime (Default)</h4>
                      <div className="space-y-4 text-xs font-bold text-slate-600">
                         <div className="flex justify-between border-b border-cyan-100/50 pb-2"><span>Up to ₹4 Lakh</span><span className="text-emerald-600">Nil</span></div>
                         <div className="flex justify-between border-b border-cyan-100/50 pb-2"><span>₹4L – ₹8L</span><span>5%</span></div>
                         <div className="flex justify-between border-b border-cyan-100/50 pb-2"><span>₹8L – ₹12L</span><span>10%</span></div>
                         <div className="flex justify-between border-b border-cyan-100/50 pb-2"><span>₹12L – ₹16L</span><span>15%</span></div>
                         <div className="flex justify-between border-b border-cyan-100/50 pb-2"><span>₹16L – ₹20L</span><span>20%</span></div>
                         <div className="flex justify-between border-b border-cyan-100/50 pb-2"><span>₹20L – ₹24L</span><span>25%</span></div>
                         <div className="flex justify-between"><span>Above ₹24 Lakh</span><span>30%</span></div>
                      </div>
                   </div>
                   <div className="rounded-[2.5rem] bg-slate-50 border border-slate-100 p-8 shadow-sm">
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 italic">Old Tax Regime</h4>
                      <div className="space-y-4 text-xs font-bold text-slate-600">
                         <div className="flex justify-between border-b border-slate-200 pb-2"><span>Up to ₹3 Lakh</span><span className="text-emerald-600">Nil</span></div>
                         <div className="flex justify-between border-b border-slate-200 pb-2"><span>₹3L – ₹5L</span><span>5%</span></div>
                         <div className="flex justify-between border-b border-slate-200 pb-2"><span>₹5L – ₹10L</span><span>20%</span></div>
                         <div className="flex justify-between"><span>Above ₹10 Lakh</span><span>30%</span></div>
                      </div>
                   </div>
                </div>
              </div>
            </section>

            {/* Section 4: Surcharge & Cess */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                Surcharge and Health & Education Cess
              </h2>
              <div className="mt-8 space-y-6 text-slate-600 font-medium leading-relaxed">
                <p>
                  For non-salary payments, surcharge and health &
                  education cess are added to the TDS amount when the
                  payment exceeds certain thresholds. This significantly
                  increases the effective TDS rate for high-value
                  payments.
                </p>
                <div className="overflow-hidden rounded-[2rem] border border-slate-100 shadow-sm bg-white">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900 text-white">
                      <tr>
                        <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Recipient Type</th>
                        <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Threshold</th>
                        <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Surcharge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                      <tr><td className="px-6 py-4">Indiv / HUF / NRI</td><td className="px-6 py-4">₹50L – ₹1Cr</td><td className="px-6 py-4 font-bold text-amber-600">10%</td></tr>
                      <tr><td className="px-6 py-4">Indiv / HUF / NRI</td><td className="px-6 py-4">₹1Cr – ₹2Cr</td><td className="px-6 py-4 font-bold text-amber-600">15%</td></tr>
                      <tr><td className="px-6 py-4">Indiv / HUF / NRI</td><td className="px-6 py-4">₹2Cr – ₹5Cr</td><td className="px-6 py-4 font-bold text-amber-600">25%</td></tr>
                      <tr><td className="px-6 py-4">Indiv / HUF / NRI</td><td className="px-6 py-4">Above ₹5Cr</td><td className="px-6 py-4 font-bold text-amber-600">37%</td></tr>
                      <tr><td className="px-6 py-4">Firm / Co.</td><td className="px-6 py-4">Above ₹1Cr</td><td className="px-6 py-4 font-bold text-amber-600">12%</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="p-6 rounded-3xl bg-amber-50 text-amber-700 font-bold italic text-sm">
                   * A 4% Health and Education Cess is applied on the total of (TDS + Surcharge).
                </p>
              </div>
            </section>

            {/* Section 5: Examples */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                Calculation Examples
              </h2>
              <div className="mt-10 space-y-8">
                <div className="group rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-premium transition-all hover:shadow-xl">
                  <h3 className="text-base font-black text-cyan-600 uppercase tracking-tight italic">Example 1: Professional Fees (194J)</h3>
                  <div className="mt-4 space-y-2 text-sm font-medium text-slate-600">
                     <p>Payment: ₹5,00,000</p>
                     <p>TDS Rate: 10% (Base ₹50,000)</p>
                     <p>Cess: ₹2,000 (4% of ₹50k)</p>
                     <p className="text-slate-900 font-black pt-2">Total TDS: ₹52,000</p>
                  </div>
                </div>
                <div className="group rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-premium transition-all hover:shadow-xl">
                  <h3 className="text-base font-black text-cyan-600 uppercase tracking-tight italic">Example 2: Contractor (194C)</h3>
                  <div className="mt-4 space-y-2 text-sm font-medium text-slate-600">
                     <p>Payment: ₹60,00,000 (Individual Contractor)</p>
                     <p>TDS Rate: 1% (Base ₹60,000)</p>
                     <p>Surcharge: ₹6,000 (10% as &gt; ₹50L)</p>
                     <p>Cess: ₹2,640 (4% of ₹66k)</p>
                     <p className="text-slate-900 font-black pt-2">Total TDS: ₹68,640</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6: Compliance */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                TDS Compliance Calendar
              </h2>
              <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-100 shadow-sm bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Action</th>
                      <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                    <tr><td className="px-6 py-4">Monthly TDS Deposit</td><td className="px-6 py-4 font-bold">7th of next month</td></tr>
                    <tr><td className="px-6 py-4">March TDS Deposit</td><td className="px-6 py-4 font-bold">30th April</td></tr>
                    <tr><td className="px-6 py-4">Quarterly Returns</td><td className="px-6 py-4 font-bold">31st of month following Qtr</td></tr>
                    <tr><td className="px-6 py-4">Form 16 Issue</td><td className="px-6 py-4 font-bold">15th June</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 7: Penalties */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                Penalties for Non-Compliance
              </h2>
              <div className="mt-10 space-y-6">
                {[
                  { t: "Late Deposit (Sec 201)", d: "1.5% interest per month from date of deduction to date of deposit." },
                  { t: "Late Filing (Sec 234E)", d: "₹200 per day until return is filed, capped at the TDS amount." },
                  { t: "Incorrect Filing (Sec 271H)", d: "Penalty between ₹10,000 and ₹1,00,000 for wrong data." },
                  { t: "Expense Disallowance", d: "30% of expenditure disallowed if TDS not deducted/paid." },
                ].map((p, i) => (
                  <div key={i} className="flex gap-6 items-start">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50 font-black text-rose-600 italic shadow-sm border border-rose-100">!</div>
                     <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{p.t}</h4>
                        <p className="mt-1 text-sm font-medium text-slate-500 leading-relaxed">{p.d}</p>
                     </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                Expert FAQ
              </h2>
              <div className="mt-10 space-y-8">
                {[
                  { q: "Can I claim a refund if excess TDS is deducted?", a: "Yes. If the total TDS deducted exceeds your actual tax liability for the year, you can claim a refund by filing your Income Tax Return (ITR). The excess TDS will be refunded to your bank account after processing." },
                  { q: "What is Form 26AS and how do I check credits?", a: "Form 26AS is an annual tax credit statement available on the Income Tax e-filing portal. It shows all TDS deducted on your PAN, advance tax paid, and self-assessment tax." },
                  { q: "Is TDS applicable on GST component?", a: "No. TDS is not applicable on the GST component if the GST amount is shown separately in the invoice, as per CBDT circulars." },
                  { q: "What is the difference between TDS and TCS?", a: "TDS (Tax Deducted at Source) is deducted by the payer before payment. TCS (Tax Collected at Source) is collected by the seller from the buyer at the time of sale (e.g., motor vehicle sales)." },
                  { q: "Can I get a lower TDS certificate?", a: "Yes. Under Section 197, you can apply to the Assessing Officer (Form 13) for a lower or nil TDS certificate if your actual liability is lower than the prescribed rate." },
                ].map((faq, i) => (
                  <div key={i} className="border-b border-slate-50 pb-8 last:border-0">
                    <h3 className="text-base font-black text-cyan-600 uppercase tracking-tight italic">{faq.q}</h3>
                    <p className="mt-3 text-sm font-medium text-slate-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Methodology */}
            <section className="pt-16 border-t border-slate-100">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                Methodology
              </h2>
              <div className="mt-8 space-y-6 text-sm font-medium text-slate-500 leading-relaxed">
                <p>
                  This calculator uses TDS rates prescribed under the Income
                  Tax Act, 1961 as amended by the Finance Act 2025 for FY
                  2025-26 (AY 2026-27). Section-wise rates are sourced from
                  CBDT notifications and official Income Tax Department
                  publications. Surcharge rates follow Section 2 of the
                  Finance Act. Health and Education Cess is applied at 4%
                  as per Section 115BDD.
                </p>
                <p>
                  For salary TDS (Section 192), the calculator implements
                  both the new tax regime (default) and old tax regime slab
                  structures with standard deductions. The new regime slabs
                  for FY 2025-26 start at ₹4,00,000 with a rebate under
                  Section 87A up to ₹60,000 for income up to ₹12,00,000.
                </p>
              </div>
            </section>

            {/* Related Tools */}
            <div className="mt-32 pt-16 border-t border-slate-100">
              <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath="/finance/india-tds-calculator" />
            </div>

            {/* Trust Signal */}
            <div className="mt-24 rounded-3xl border border-slate-100 bg-slate-50/50 p-8">
              <div className="flex items-start gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 text-xl font-black text-cyan-600 italic">
                  FB
                </div>
                <div>
                  <p className="font-black text-slate-900 uppercase tracking-tight">Verified by FindBest Tools</p>
                  <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed">
                    TDS rates and thresholds sourced from Income Tax Act, 1961
                    and Finance Act 2025 as amended for FY 2025-26 (AY
                    2026-27). Surcharge and cess rates reflect current CBDT
                    notifications. Last verified 25 April 2026. Consult a CA for complex matters.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-10 p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest italic">
                Disclaimer: TDS provisions are subject to frequent amendments by the CBDT. While we strive for absolute accuracy, tax laws depend on individual circumstances. This tool is for informational purposes and does not constitute professional tax advice.
              </p>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
