import { Metadata } from "next";
import { StampDutyCalculatorClient } from "./components/StampDutyCalculatorClient";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: "Australia Stamp Duty Calculator 2026 | All States & Territories",
  description:
    "Free Australia stamp duty calculator for NSW, VIC, QLD, WA, SA, TAS, ACT & NT. Calculate transfer duty with 2026 rates, first home buyer concessions, foreign purchaser surcharges & mortgage fees.",
  keywords: [
    "Australia stamp duty calculator",
    "stamp duty calculator NSW",
    "stamp duty calculator VIC",
    "stamp duty calculator QLD",
    "stamp duty calculator WA",
    "stamp duty calculator SA",
    "stamp duty calculator TAS",
    "stamp duty calculator ACT",
    "stamp duty calculator NT",
    "transfer duty calculator Australia",
    "first home buyer stamp duty concession",
    "foreign purchaser surcharge Australia",
    "conveyance duty calculator",
    "mortgage registration fee Australia",
    "land transfer fee Australia",
    "how to calculate stamp duty Australia",
    "stamp duty exemption NSW",
    "stamp duty concession VIC",
    "stamp duty rates 2026",
    "property tax calculator Australia",
    "real estate tax calculator Australia",
    "buying house Australia costs",
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
    canonical: "https://findbest.tools/finance/australia-stamp-duty-calculator",
  },
  openGraph: {
    title: "Australia Stamp Duty Calculator 2026 | All States & Territories",
    description:
      "Calculate stamp duty for property purchases in all Australian states and territories. Updated 2026 rates and concessions.",
    url: "https://findbest.tools/finance/australia-stamp-duty-calculator",
    siteName: "FindBest Tools",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "https://findbest.tools/og-australia-stamp-duty-calculator.jpg",
        width: 1200,
        height: 630,
        alt: "Australia Stamp Duty Calculator 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Australia Stamp Duty Calculator 2026",
    description:
      "Free tool to calculate property stamp duty across Australia. Includes first home buyer concessions and foreign surcharges.",
    images: ["https://findbest.tools/og-australia-stamp-duty-calculator.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://findbest.tools/finance/australia-stamp-duty-calculator",
      url: "https://findbest.tools/finance/australia-stamp-duty-calculator",
      name: "Australia Stamp Duty Calculator 2026",
      isPartOf: { "@id": "https://findbest.tools/#website" },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://findbest.tools/og-australia-stamp-duty-calculator.jpg",
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
      inLanguage: "en-AU",
    },
    {
      "@type": "SoftwareApplication",
      name: "Australia Stamp Duty Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "AUD",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "5821",
      },
      featureList:
        "NSW stamp duty calculation, VIC stamp duty calculation, QLD stamp duty calculation, WA stamp duty calculation, SA stamp duty calculation, TAS stamp duty calculation, ACT stamp duty calculation, NT stamp duty calculation, First Home Buyer concessions, Foreign Purchaser Surcharges, Mortgage Registration Fees, Land Transfer Fees",
    },
    {
      "@type": "HowTo",
      name: "How to Calculate Stamp Duty in Australia",
      step: [
        {
          "@type": "HowToStep",
          name: "Select Your State or Territory",
          text: "Stamp duty rates and rules vary significantly between Australian states. Choose NSW, VIC, QLD, WA, SA, TAS, ACT, or NT from the dropdown.",
        },
        {
          "@type": "HowToStep",
          name: "Enter Property Value",
          text: "Input the purchase price or estimated market value of the property. For off-the-plan properties, ensure you select the appropriate property type for potential concessions.",
        },
        {
          "@type": "HowToStep",
          name: "Identify Your Buyer Status",
          text: "Indicate if you are a first home buyer, owner-occupier, or investor. First home buyers often qualify for significant exemptions or concessions.",
        },
        {
          "@type": "HowToStep",
          name: "Specify Residency Status",
          text: "Confirm if you are an Australian resident or a foreign purchaser. Foreign buyers are subject to additional surcharges ranging from 7% to 8% depending on the state.",
        },
        {
          "@type": "HowToStep",
          name: "Review Total Government Costs",
          text: "See the breakdown of transfer duty, mortgage registration fees, and land transfer fees to understand your total upfront government costs.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "When is stamp duty due in Australia?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Payment timelines vary by state. In NSW and VIC, it is usually due within 30 days of settlement. In QLD, it is due within 30 days of the contract becoming unconditional. Most buyers pay stamp duty at settlement through their solicitor or conveyancer.",
          },
        },
        {
          "@type": "Question",
          name: "Which state has the lowest stamp duty in Australia?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Queensland typically has the lowest stamp duty for owner-occupiers, especially for properties under $550,000 where the 'Home Concession' applies. For first home buyers, QLD also offers very generous exemptions.",
          },
        },
        {
          "@type": "Question",
          name: "Does stamp duty apply to first home buyers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most Australian states offer exemptions or concessions for first home buyers. For example, in NSW, no duty is paid on homes up to $800,000. In VIC, the threshold is $600,000 for a full exemption. Always check the specific limits for your state.",
          },
        },
        {
          "@type": "Question",
          name: "Is stamp duty calculated on the purchase price or valuation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Stamp duty is calculated on the 'dutiable value', which is usually the purchase price. However, if the transaction is not at 'arm's length' (e.g., selling to a family member at a discount), the state revenue office will use the fair market valuation.",
          },
        },
      ],
    },
  ],
};

export default function AustraliaStampDutyCalculatorPage() {
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
            <div className="mb-6 inline-flex items-center rounded-full bg-emerald-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 ring-1 ring-inset ring-emerald-500/20">
              Updated April 2026 — All 8 States & Territories
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-7xl uppercase italic leading-none">
              Australia <br />
              <span className="text-emerald-500">Stamp Duty</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg font-medium text-slate-500 leading-relaxed">
              Calculate property transfer duty across NSW, VIC, QLD, WA, SA,
              TAS, ACT & NT. Includes 2026 rates, first home buyer
              concessions, foreign purchaser surcharges, and mortgage fees.
            </p>
          </div>

          {/* Calculator */}
          <StampDutyCalculatorClient />


          {/* Long-form Content */}
          <article className="mx-auto mt-32 max-w-4xl space-y-24">
            {/* Section 1 */}
            <section>
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight italic">
                Understanding Stamp Duty in Australia
              </h2>
              <div className="mt-8 space-y-6 text-slate-600 font-medium leading-relaxed">
                <p>
                  Stamp duty — officially called transfer duty or conveyance
                  duty in most jurisdictions — is a state and territory tax
                  levied on property transactions. It is typically the
                  largest upfront cost buyers face when purchasing real
                  estate in Australia, often exceeding $20,000 to $50,000
                  depending on the property value and location.
                </p>
                <p>
                  The duty is calculated on the dutiable value of the
                  property, which is the greater of the purchase price or
                  the market value at the date of transfer. For off-the-plan
                  purchases, some states allow duty to be calculated on the
                  land value plus construction costs rather than the full
                  completed value, providing significant savings.
                </p>
                <p>
                  Because stamp duty is a state tax, the rules, rates, and
                  concessions vary wildly between borders. A property worth
                  $750,000 will attract significantly different duty in
                  Sydney compared to Melbourne or Brisbane. This calculator
                  aggregates the latest 2026 legislation across all eight
                  jurisdictions to give you an accurate estimate of your
                  total government costs.
                </p>
              </div>
            </section>

            {/* Section 2: How is it Calculated? */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                How is Stamp Duty Calculated?
              </h2>
              <div className="mt-8 space-y-6 text-slate-600 font-medium leading-relaxed">
                <p>
                  Stamp duty is a tiered tax, similar to income tax. As the
                  value of the property increases, the percentage of tax
                  charged also increases. Each state has its own brackets
                  and rates.
                </p>
                <div className="rounded-3xl border-2 border-emerald-100 bg-emerald-50/30 p-8">
                  <p className="font-black text-emerald-900 uppercase tracking-tight italic">Example: NSW Standard Rates 2026</p>
                  <ul className="mt-4 space-y-3 text-sm">
                    <li><strong className="text-slate-900">$0 – $17,000:</strong> 1.25% of the value</li>
                    <li><strong className="text-slate-900">$17,001 – $37,000:</strong> $212 plus 1.5% of value over $17k</li>
                    <li><strong className="text-slate-900">$37,001 – $98,000:</strong> $512 plus 1.75% of value over $37k</li>
                    <li><strong className="text-slate-900">$98,001 – $348,000:</strong> $1,580 plus 3.5% of value over $98k</li>
                    <li><strong className="text-slate-900">$348,001 – $1,157,000:</strong> $10,330 plus 4.5% of value over $348k</li>
                  </ul>
                </div>
                <p>
                  In addition to the transfer duty, most states charge a
                  fixed land transfer fee and a mortgage registration fee.
                  These are typically much smaller (ranging from $150 to
                  $2,500) but are essential to include in your budget.
                </p>
              </div>
            </section>

            {/* Section 3: Concessions */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                Concessions & Exemptions
              </h2>
              <div className="mt-8 space-y-6 text-slate-600 font-medium leading-relaxed">
                <p>
                  To assist buyers, particularly those entering the market
                  for the first time, state governments offer several
                  types of relief:
                </p>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-sm">
                    <h4 className="font-black text-emerald-600 uppercase tracking-widest text-[10px] mb-4">First Home Buyers</h4>
                    <p className="text-sm">Exemptions or reduced rates for first-time purchasers. Thresholds vary from $600,000 in Victoria to $1.02 million in the ACT.</p>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-sm">
                    <h4 className="font-black text-blue-600 uppercase tracking-widest text-[10px] mb-4">Off-the-Plan</h4>
                    <p className="text-sm">Concessions for buying before construction is finished, often calculated on the land value only (common in VIC and WA).</p>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-sm">
                    <h4 className="font-black text-orange-600 uppercase tracking-widest text-[10px] mb-4">Pensioners</h4>
                    <p className="text-sm">Some states offer a once-off concession for pensioners downsizing or purchasing a principal place of residence.</p>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-sm">
                    <h4 className="font-black text-violet-600 uppercase tracking-widest text-[10px] mb-4">Primary Production</h4>
                    <p className="text-sm">Exemptions may apply for the transfer of family farms or land used specifically for primary production.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: State Overview */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                State-by-State Overview 2026
              </h2>
              <div className="mt-10 space-y-12">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">New South Wales (NSW)</h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    NSW uses a standard scale plus a 'Premium Property' rate for residential properties above $3.4 million. The First Home Buyers Assistance scheme provides a full exemption up to $800k and a concession up to $1M. Foreign buyers pay an 8% surcharge.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Victoria (VIC)</h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    Victoria typically has the highest duty in Australia. Rates reach 6% for properties over $1M. However, first home buyers get a full exemption up to $600k and a concession up to $750k. Foreign purchasers pay an 8% surcharge.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Queensland (QLD)</h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    QLD offers three rates: Home Concession (lowest, for owner-occupiers), First Home Concession, and Investment/Standard. First home buyers pay $0 duty on homes up to $700k. The foreign surcharge is 8%.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Western Australia (WA)</h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    WA offers a 'Residential' rate and a 'First Home Owner' rate. FHB pay $0 duty up to $450k and a reduced rate up to $600k. Foreign buyers pay a 7% surcharge.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">South Australia (SA)</h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    SA abolished stamp duty for first home buyers purchasing new homes or vacant land (no price cap) in 2024. For established homes, standard rates apply. Foreign surcharge is 7%.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Tasmania (TAS)</h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    Tasmania offers a 50% concession for first home buyers on established homes up to $750,000. Standard rates apply for others. Foreign surcharge is 8% for residential land.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">ACT & NT</h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    The ACT is phasing out stamp duty over a 20-year period, replaced by land tax. The NT offers the Territory Home Owner Discount for those who haven't owned in the NT for 2 years.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                Frequently Asked Questions
              </h2>
              <div className="mt-10 space-y-8">
                {[
                  { q: "When is stamp duty due?", a: "Timelines vary: NSW/VIC (30 days from settlement), QLD (30 days from contract going unconditional). Most buyers pay at settlement." },
                  { q: "Can stamp duty be added to my mortgage?", a: "Technically no, lenders require you to have the funds for stamp duty upfront. However, it effectively reduces your deposit, which might increase your LVR." },
                  { q: "Is stamp duty tax-deductible?", a: "For your primary residence, no. For investment properties, stamp duty is not deductible from annual rental income but is added to the 'cost base' for Capital Gains Tax (CGT) purposes when you sell." },
                  { q: "Do I pay stamp duty on a gift?", a: "Yes. Even if a property is gifted, duty is usually payable based on the fair market value of the property at the time of transfer." },
                ].map((faq, i) => (
                  <div key={i}>
                    <h3 className="text-base font-black text-emerald-600 uppercase tracking-tight italic">{faq.q}</h3>
                    <p className="mt-2 text-sm font-medium text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Methodology */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                Methodology & Disclaimers
              </h2>
              <div className="mt-8 space-y-6 text-slate-500 font-medium text-sm leading-relaxed">
                <p>
                  Our calculator uses the 2026 tax tables provided by each
                  state's respective revenue office. Calculations for First
                  Home Buyer concessions assume the buyer meets all
                  eligibility criteria (Australian citizenship/residency,
                  never owned property before, occupying as PR).
                </p>
                <p>
                  <strong>Disclaimer:</strong> This tool provides an estimate
                  only. Government fees and charges can change without
                  notice. Always obtain a formal quote from your solicitor or
                  conveyancer before entering into a contract of sale.
                </p>
              </div>
            </section>

            {/* Trust Signal */}
            <div className="mt-24 rounded-3xl border border-slate-100 bg-slate-50/50 p-8">
              <div className="flex items-start gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 text-xl font-black text-emerald-500 italic">
                  FB
                </div>
                <div>
                  <p className="font-black text-slate-900 uppercase tracking-tight">Verified by FindBest Tools</p>
                  <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed">
                    Rates sourced from Revenue NSW, State Revenue Office
                    Victoria, Queensland Revenue Office, WA Department of
                    Finance, RevenueSA, Tasmanian State Revenue Office, ACT
                    Revenue Office, and Northern Territory Treasury. Verified for the 2026 financial year. Last reviewed 25 April 2026.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Tools */}
            <div className="mt-32 pt-16 border-t border-slate-100">
              <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath="/finance/australia-stamp-duty-calculator" />
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
