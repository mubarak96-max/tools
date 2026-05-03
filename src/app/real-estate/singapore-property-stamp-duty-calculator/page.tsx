import type { Metadata } from "next";
import StampDutyCalculator from "@/components/singapore-stamp-duty/StampDutyCalculator";

export const metadata: Metadata = {
  title: "Singapore Property Stamp Duty Calculator 2025–2026 | BSD, ABSD & SSD",
  description:
    "Free Singapore property stamp duty calculator for 2025–2026. Calculate Buyer's Stamp Duty (BSD), Additional Buyer's Stamp Duty (ABSD), and Seller's Stamp Duty (SSD) instantly. Updated with July 2025 SSD rate changes. Accurate for Singapore Citizens, PRs, foreigners, and entities.",
  keywords: [
    "singapore stamp duty calculator",
    "singapore property stamp duty",
    "BSD calculator Singapore",
    "ABSD calculator 2025",
    "SSD calculator July 2025",
    "how much stamp duty for condo Singapore",
    "singapore property tax calculator",
    "buyer stamp duty rates Singapore",
    "additional buyer stamp duty foreigners",
    "seller stamp duty new rates 2025",
    "stamp duty for second property Singapore",
    "PR stamp duty Singapore",
    "HDB stamp duty calculator",
    "private property stamp duty Singapore",
    "property cooling measures stamp duty",
  ],
  alternates: {
    canonical: "https://findbest.tools/real-estate/singapore-property-stamp-duty-calculator",
  },
  openGraph: {
    title: "Singapore Property Stamp Duty Calculator 2025–2026",
    description:
      "Calculate BSD, ABSD & SSD instantly. Updated with July 2025 SSD changes. Free, accurate, and mobile-friendly.",
    url: "https://findbest.tools/real-estate/singapore-property-stamp-duty-calculator",
    type: "website",
  },
};

// JSON-LD Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Singapore Property Stamp Duty Calculator",
      url: "https://findbest.tools/real-estate/singapore-property-stamp-duty-calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "SGD",
      },
      description:
        "Calculate Buyer's Stamp Duty, Additional Buyer's Stamp Duty, and Seller's Stamp Duty for Singapore residential and commercial properties.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the current Buyer's Stamp Duty (BSD) rate in Singapore for 2025?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Buyer's Stamp Duty in Singapore is tiered based on property value: 1% on the first $180,000, 2% on the next $180,000, 3% on the next $640,000, 4% on the next $500,000, 5% on the next $1,500,000, and 6% on any amount above $3,000,000. These rates apply to all residential property purchases.",
          },
        },
        {
          "@type": "Question",
          name: "How much ABSD do foreigners pay when buying property in Singapore?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Foreigners pay a flat 60% Additional Buyer's Stamp Duty (ABSD) on any residential property purchase in Singapore as of 2025. However, nationals of the United States, Switzerland, Norway, Iceland, and Liechtenstein are treated as Singapore Citizens under Free Trade Agreements, paying 0% ABSD on their first property.",
          },
        },
        {
          "@type": "Question",
          name: "What are the new Seller's Stamp Duty (SSD) rates from July 2025?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For residential properties purchased on or after 4 July 2025, SSD rates are: 16% if sold within 1 year, 12% if sold within 2 years, 8% if sold within 3 years, and 4% if sold within 4 years. No SSD is payable after 4 years. This is an increase from the previous 3-year holding period framework.",
          },
        },
        {
          "@type": "Question",
          name: "Can I use CPF to pay stamp duty in Singapore?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, you can use CPF Ordinary Account savings to pay both Buyer's Stamp Duty (BSD) and Additional Buyer's Stamp Duty (ABSD). However, you must first pay the stamp duty in cash and then apply for reimbursement from your CPF account. The reimbursement is typically processed together with your CPF withdrawal application for the property purchase.",
          },
        },
      ],
    },
  ],
};

export default function SingaporeStampDutyPage() {
  return (
    <div className="min-h-screen bg-slate-50 -mt-20 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wide">
              Updated July 2025
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wide">
              IRAS-Aligned
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Singapore Property Stamp Duty Calculator
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed">
            Calculate <strong>Buyer's Stamp Duty (BSD)</strong>, <strong>Additional Buyer's Stamp Duty (ABSD)</strong>, and{" "}
            <strong>Seller's Stamp Duty (SSD)</strong> in seconds. Updated with the{" "}
            <strong>July 2025 SSD rate changes</strong> and current ABSD rates for Singapore Citizens, PRs, foreigners, and corporate entities.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="max-w-5xl mx-auto px-4 py-8 -mt-6">
        <StampDutyCalculator />
      </section>

      {/* Long-Form SEO Content */}
      <article className="max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-12">

        {/* Introduction */}
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold text-slate-900">Understanding Singapore Property Stamp Duty in 2025–2026</h2>
          <p className="text-slate-600 leading-relaxed">
            Buying or selling property in Singapore involves more than just the listed price. Stamp duty represents one of the largest upfront costs in any real estate transaction, often running into hundreds of thousands of dollars for high-value properties. Whether you are a first-time buyer eyeing an HDB resale flat in Tampines, a Permanent Resident upgrading to a condo in the Core Central Region, or a foreign investor considering a landed property in Sentosa Cove, understanding exactly how much stamp duty you will pay is essential for accurate budgeting.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Our <strong>Singapore property stamp duty calculator</strong> is designed to give you instant, accurate estimates for all three major types of property stamp duty: <strong>Buyer's Stamp Duty (BSD)</strong>, <strong>Additional Buyer's Stamp Duty (ABSD)</strong>, and <strong>Seller's Stamp Duty (SSD)</strong>. The tool is updated to reflect the latest regulatory changes, including the significant <strong>SSD rate increases and holding period extension announced on 3 July 2025</strong>, which took effect from 4 July 2025.
          </p>
        </div>

        {/* BSD Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">What Is Buyer's Stamp Duty (BSD) in Singapore?</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            <strong>Buyer's Stamp Duty (BSD)</strong> is a tax levied on all property purchases in Singapore, payable to the Inland Revenue Authority of Singapore (IRAS). It applies to both residential and non-residential properties, and the amount is calculated based on the <strong>higher of the purchase price or the market valuation</strong> of the property. This means even if you negotiate a condo down from $2.5 million to $2.3 million, but the bank values it at $2.5 million, your BSD will be computed on $2.5 million.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            For residential properties, BSD is calculated on a tiered basis. The first $180,000 attracts 1%, the next $180,000 attracts 2%, the following $640,000 attracts 3%, the next $500,000 attracts 4%, the subsequent $1.5 million attracts 5%, and any amount above $3 million attracts 6%. For non-residential properties such as commercial shophouses or industrial units, the maximum rate is capped at 5%.
          </p>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 my-4">
            <h4 className="font-semibold text-slate-800 text-sm mb-2">Quick BSD Calculation Example</h4>
            <p className="text-sm text-slate-600">
              For a $1.5 million condominium: <br />
              • First $180,000 × 1% = $1,800<br />
              • Next $180,000 × 2% = $3,600<br />
              • Next $640,000 × 3% = $19,200<br />
              • Remaining $500,000 × 4% = $20,000<br />
              <strong>Total BSD = $44,600</strong>
            </p>
          </div>
          <p className="text-slate-600 leading-relaxed">
            BSD must be paid within 14 days of executing the Sale and Purchase Agreement if signed in Singapore, or within 30 days if signed overseas. Late payment incurs penalties of up to 50% of the duty owed, plus interest. You can pay BSD via the IRAS e-Stamping portal using GIRO, cheque, or cashier's order, and subsequently apply for reimbursement from your CPF Ordinary Account.
          </p>
        </div>

        {/* ABSD Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Additional Buyer's Stamp Duty (ABSD) Rates and Rules</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            <strong>Additional Buyer's Stamp Duty (ABSD)</strong> was introduced as a property cooling measure to moderate investment demand and keep residential properties affordable for Singaporeans. Unlike BSD, ABSD only applies to residential properties, and the rate depends entirely on your residency status and the number of residential properties you already own at the time of purchase.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            As of 2025, Singapore Citizens pay <strong>0% ABSD on their first property</strong>, making homeownership accessible for genuine owner-occupiers. However, the rate jumps to <strong>20% for a second property</strong> and <strong>30% for a third or subsequent property</strong>. For Permanent Residents, the first property incurs 5% ABSD, the second 30%, and the third or more 35%.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Foreigners face the steepest rates. Since the 27 April 2023 cooling measures, non-FTA foreigners pay a flat <strong>60% ABSD</strong> on any residential property purchase, regardless of whether it is their first. On a $2 million condo, this translates to $1.2 million in ABSD alone, plus BSD. Entities and trusts are charged 65%, while housing developers pay 35% plus a 5% non-remittable component.
          </p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">ABSD Exemptions and Remissions</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            Not all foreigners pay 60%. Under Singapore's Free Trade Agreements (FTAs), nationals of the <strong>United States, Switzerland, Norway, Iceland, and Liechtenstein</strong> are treated the same as Singapore Citizens for ABSD purposes. A US citizen buying their first residential property in Singapore pays 0% ABSD, saving potentially over a million dollars compared to other foreigners on high-value purchases.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Married couples where one spouse is a Singapore Citizen may also qualify for ABSD remission when purchasing a second property jointly, provided they sell their first property within a specified timeframe. Additionally, seniors aged 55 and above who sell a higher-value private property and rightsize to a lower-value one may qualify for an ABSD refund under specific conditions introduced in recent years.
          </p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">How ABSD Affects Your Total Entry Cost</h3>
          <p className="text-slate-600 leading-relaxed">
            When budgeting for a property purchase, ABSD often represents the largest single cash outlay after the down payment. Because ABSD cannot be financed through your housing loan, it must be paid using cash or CPF funds. This significantly impacts your liquidity. For example, a Singapore Citizen couple upgrading from an HDB to a $1.8 million condo while keeping their flat will need $360,000 in cash or CPF just for ABSD, plus approximately $64,600 for BSD, before factoring in the minimum cash down payment and legal fees.
          </p>
        </div>

        {/* SSD Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Seller's Stamp Duty (SSD): July 2025 Changes Explained</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            <strong>Seller's Stamp Duty (SSD)</strong> is payable if you sell a residential property within a specified holding period from the date of acquisition. It was originally introduced in 2010 to curb speculative flipping. On 3 July 2025, the Singapore government announced significant changes to the SSD regime, reverting to a structure similar to the pre-2017 framework.
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-4">
            <p className="text-sm text-amber-900 font-medium">Key Changes Effective 4 July 2025:</p>
            <ul className="mt-2 space-y-1 text-sm text-amber-800 list-disc list-inside">
              <li>Holding period extended from <strong>3 years to 4 years</strong></li>
              <li>Rates increased by <strong>4 percentage points</strong> for each tier</li>
              <li>New tier added for sales between 3 and 4 years at <strong>4%</strong></li>
            </ul>
          </div>

          <p className="text-slate-600 leading-relaxed mb-4">
            For properties purchased on or after 4 July 2025, the new SSD rates are: <strong>16%</strong> if sold within 1 year, <strong>12%</strong> if sold within 2 years, <strong>8%</strong> if sold within 3 years, and <strong>4%</strong> if sold within 4 years. After 4 years, no SSD is payable. Properties acquired between 11 March 2017 and 3 July 2025 continue to follow the old 3-year schedule: 12%, 8%, and 4%.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            These changes were triggered by a sharp increase in private residential property transactions with short holding periods, particularly sub-sales of uncompleted units. The government aims to discourage speculative activity while ensuring genuine homeowners and long-term investors remain largely unaffected.
          </p>
          <p className="text-slate-600 leading-relaxed">
            It is important to note that <strong>HDB flat owners are not affected by SSD changes</strong> because they are already subject to a 5-year Minimum Occupation Period (MOP) before they can sell their flat. SSD is calculated on the higher of the selling price or market value at the time of disposal, and must be paid within 14 days of the sale contract.
          </p>
        </div>

        {/* Practical Guide */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Step-by-Step Guide to Calculating Your Total Stamp Duty</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Calculating your total property stamp duty in Singapore involves three clear steps. Our calculator automates this process, but understanding the mechanics helps you verify the numbers and plan your finances accurately.
          </p>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
              <div>
                <h4 className="font-semibold text-slate-800">Determine your property value base</h4>
                <p className="text-sm text-slate-600 mt-1">Use the higher of the agreed purchase price or the official market valuation. Banks and the government will always use the higher figure for stamp duty calculations.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
              <div>
                <h4 className="font-semibold text-slate-800">Calculate BSD first</h4>
                <p className="text-sm text-slate-600 mt-1">Apply the tiered BSD rates to the property value. Every buyer pays this, regardless of citizenship or property count.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
              <div>
                <h4 className="font-semibold text-slate-800">Add ABSD based on your profile</h4>
                <p className="text-sm text-slate-600 mt-1">Check your residency status and count your existing residential properties. Apply the corresponding ABSD rate on the full property value.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
              <div>
                <h4 className="font-semibold text-slate-800">Factor in SSD if selling early</h4>
                <p className="text-sm text-slate-600 mt-1">If you are selling within the holding period, check your acquisition date against the SSD schedule that applies to your purchase date.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scenario Comparisons */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Real-World Stamp Duty Scenarios</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            To illustrate how dramatically stamp duty varies by buyer profile, here are four realistic scenarios based on current 2025–2026 rates. All examples assume residential properties and use the higher of price or valuation.
          </p>

          <div className="space-y-4">
            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
              <h4 className="font-bold text-slate-800 text-sm">Scenario A: First-Time HDB Buyer (Singapore Citizen)</h4>
              <p className="text-sm text-slate-600 mt-1">$550,000 resale 4-room HDB in Jurong West. No existing properties.</p>
              <p className="text-sm font-semibold text-emerald-700 mt-2">Total Stamp Duty: $8,600 (BSD only, 0% ABSD)</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
              <h4 className="font-bold text-slate-800 text-sm">Scenario B: PR Buying First Condo</h4>
              <p className="text-sm text-slate-600 mt-1">$1.2 million Executive Condominium in Tampines. First property.</p>
              <p className="text-sm font-semibold text-emerald-700 mt-2">Total Stamp Duty: $91,600 (BSD $31,600 + ABSD 5% = $60,000)</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
              <h4 className="font-bold text-slate-800 text-sm">Scenario C: Citizen Upgrading (2nd Property)</h4>
              <p className="text-sm text-slate-600 mt-1">$1.8 million private condo in Bishan while keeping HDB.</p>
              <p className="text-sm font-semibold text-emerald-700 mt-2">Total Stamp Duty: $424,600 (BSD $64,600 + ABSD 20% = $360,000)</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
              <h4 className="font-bold text-slate-800 text-sm">Scenario D: Foreigner Buying Luxury Condo</h4>
              <p className="text-sm text-slate-600 mt-1">$3.5 million condo in Orchard. Non-FTA foreigner.</p>
              <p className="text-sm font-semibold text-emerald-700 mt-2">Total Stamp Duty: $2,330,400 (BSD $230,400 + ABSD 60% = $2,100,000)</p>
            </div>
          </div>
        </div>

        {/* CPF & Payment */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Using CPF for Stamp Duty and Payment Deadlines</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            A common question among buyers is whether CPF can be used to pay stamp duty. The answer is yes, but with an important procedural caveat. You must first pay the BSD and ABSD in cash upfront, then apply for a one-time reimbursement from your CPF Ordinary Account. This reimbursement is typically processed together with your application to use CPF savings for the property purchase.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            The deadline for stamp duty payment is strict: <strong>14 days from the date of execution</strong> of the Sale and Purchase Agreement for documents signed in Singapore, or <strong>30 days</strong> for documents signed overseas. Missing this deadline results in penalties of up to 50% of the duty owed, plus daily interest. There is no option for installment payments or deferment.
          </p>
          <p className="text-slate-600 leading-relaxed">
            For sellers, SSD must also be paid within 14 days of the sale contract. In collective sale scenarios, all owners—including those who did not consent—are liable for SSD if the sale occurs within the holding period. However, penalty waivers may be granted favorably if the stamping and waiver request are submitted within 14 days of the executed contract.
          </p>
        </div>

        {/* Long-tail Keywords Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions About Singapore Stamp Duty</h2>

          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-slate-800">How much stamp duty do I pay for a $1 million condo in Singapore?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                For a $1 million condominium, the BSD is $24,600. If you are a Singapore Citizen buying your first property, your total stamp duty is $24,600. A Permanent Resident pays an additional 5% ABSD ($50,000), totaling $74,600. A foreigner pays 60% ABSD ($600,000), bringing the total to $624,600.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">What is the difference between BSD and ABSD?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                BSD (Buyer's Stamp Duty) applies to all property buyers regardless of profile and is calculated on a tiered scale. ABSD (Additional Buyer's Stamp Duty) is an additional tax on residential properties that varies based on your citizenship status and property count. ABSD is designed to moderate investment demand, while BSD is a standard transaction tax.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Do I pay stamp duty when selling my HDB flat?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Sellers do not pay Buyer's Stamp Duty or ABSD. However, if you are selling a private residential property within the SSD holding period, you will pay Seller's Stamp Duty. HDB flats are generally exempt from SSD because owners must fulfill a 5-year Minimum Occupation Period before selling.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Can a married couple avoid ABSD on a second property?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Yes, under specific conditions. If a married couple includes one Singapore Citizen and the joint purchase is for a second property, they may apply for ABSD remission if they sell their first property within a stipulated period (typically 6 months of completion for completed properties, or before TOP for uncompleted properties). The remission is not automatic and must be applied for after paying ABSD upfront.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">What stamp duty applies to commercial property in Singapore?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Commercial and industrial properties are subject to BSD only, with no ABSD. The BSD rates for non-residential properties are tiered up to a maximum of 5%. Seller's Stamp Duty does not apply to commercial properties, but industrial properties have their own SSD schedule (15%, 10%, 5% for holding periods up to 3 years).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Are there any stamp duty exemptions for inherited properties?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Inherited properties are generally exempt from BSD at the point of inheritance. For SSD purposes, if you sell an inherited property, the acquisition date is treated as the date the deceased originally purchased it. This means if your father bought the property 20 years ago and you inherited and sold it immediately, no SSD is payable because the holding period is calculated from 20 years ago.
              </p>
            </div>
          </div>
        </div>

        {/* Trust & Authority */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 md:p-8 text-white">
          <h2 className="text-xl font-bold mb-3">Why Use Our Singapore Stamp Duty Calculator?</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Updated with <strong className="text-white">July 2025 SSD changes</strong> and current ABSD rates</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Covers all buyer profiles: <strong className="text-white">SC, PR, Foreigners, FTA nationals, Entities</strong></span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Calculates <strong className="text-white">BSD, ABSD, and SSD</strong> in a single tool</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Aligned with <strong className="text-white">IRAS guidelines</strong> and official rate schedules</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Disclaimer: This calculator provides estimates for planning purposes. For official assessments, always refer to the IRAS e-Stamping portal or consult a qualified conveyancing lawyer. Rates are accurate as of 2025–2026.
          </p>
        </div>

        {/* Related Guides & Deep Dives */}
        <div className="border-t border-slate-200 pt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Related Guides
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Singapore Buyer's Stamp Duty: The Definitive 2025 Guide",
                href: "/blog/singapore-buyers-stamp-duty-guide",
                desc: "A complete walkthrough of BSD, ABSD, and SSD rates with the latest cooling measures explained.",
              },
              {
                title: "Hong Kong Stamp Duty Guide: Rates for Residential Property",
                href: "/blog/hong-kong-stamp-duty-guide",
                desc: "Understanding the ad valorem stamp duty (AVD) and Special Stamp Duty (SSD) in Hong Kong.",
              },
              {
                title: "Toronto Land Transfer Tax: First-Time Buyer Rebates",
                href: "/blog/toronto-land-transfer-tax-guide",
                desc: "How to calculate provincial and municipal LTT in Toronto and claim your $8,475 in rebates.",
              },
              {
                title: "NYC Closing Costs 2025: A Guide for Buyers and Sellers",
                href: "/blog/nyc-closing-costs-2025",
                desc: "Breakdown of mansion tax, transfer taxes, and legal fees when transacting property in New York.",
              },
            ].map((guide) => (
              <a
                key={guide.href}
                href={guide.href}
                className="group p-5 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all flex flex-col"
              >
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed flex-grow">
                  {guide.desc}
                </p>
                <div className="mt-4 flex items-center text-emerald-600 text-sm font-semibold">
                  Read Guide
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        <div className="border-t border-slate-200 pt-12">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Related Property Calculators</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: "Rent vs Buy Calculator", desc: "Should you rent or buy in Singapore?", href: "/real-estate/rent-vs-buy-calculator" },
              { name: "House Affordability Calculator", desc: "How much property can you afford?", href: "/real-estate/house-affordability-calculator-canada" }, // Using Canada as placeholder/best match
              { name: "Mortgage Qualifier", desc: "Check your loan eligibility", href: "/real-estate/mortgage-qualifier-canada" },
              { name: "Rental Yield Calculator", desc: "Calculate investment returns", href: "/real-estate/rental-yield-calculator" },
              { name: "Cap Rate Calculator", desc: "Real estate capitalization rate", href: "/real-estate/cap-rate-calculator" },
              { name: "Cash on Cash Return", desc: "Rental property ROI analysis", href: "/real-estate/cash-on-cash-return-calculator" },
            ].map((tool) => (
              <a
                key={tool.name}
                href={tool.href}
                className="block p-4 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition group"
              >
                <p className="font-medium text-slate-800 group-hover:text-emerald-800">{tool.name}</p>
                <p className="text-xs text-slate-500 mt-1">{tool.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
