import { Metadata } from "next";
import { AustraliaGSTCalculatorClient } from "./components/AustraliaGSTCalculatorClient";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: "Australia GST Calculator 2026 | Free GST Inclusive/Exclusive Tool",
  description:
    "Free Australia GST calculator for 2026. Add or remove 10% GST from any amount. Calculate GST-inclusive and GST-exclusive prices instantly. Perfect for small business, invoicing, and BAS reporting.",
  keywords: [
    "Australia GST calculator",
    "Australian GST calculator",
    "GST calculator Australia",
    "add GST calculator",
    "remove GST calculator",
    "GST inclusive calculator",
    "GST exclusive calculator",
    "10% GST calculator",
    "how to calculate GST Australia",
    "GST formula Australia",
    "GST on $100",
    "GST on $1000",
    "GST registration threshold Australia",
    "BAS calculator",
    "small business GST calculator",
    "GST for freelancers Australia",
    "GST for sole traders Australia",
    "GST free items Australia",
    "GST exempt Australia",
    "how much is GST in Australia",
    "ATO GST calculator",
    "GST withholding calculator",
    "GST on imports Australia",
    "GST for e-commerce Australia",
    "GST for Uber drivers Australia",
    "GST for contractors Australia",
    "quarterly BAS calculator",
    "GST input tax credit calculator",
    "net GST payable calculator",
    "GST component calculator",
    "reverse GST calculator",
    "backwards GST calculator",
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
    canonical: "https://findbest.tools/finance/australia-gst-calculator",
  },
  openGraph: {
    title: "Australia GST Calculator 2026 | Add/Remove 10% GST",
    description:
      "Free Australian GST calculator. Instantly add or remove 10% GST. Calculate GST-inclusive and GST-exclusive prices for invoicing and BAS.",
    url: "https://findbest.tools/finance/australia-gst-calculator",
    siteName: "FindBest Tools",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "https://findbest.tools/og-australia-gst-calculator.jpg",
        width: 1200,
        height: 630,
        alt: "Australia GST Calculator 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Australia GST Calculator 2026",
    description:
      "Free tool to add or remove 10% GST from any amount. GST inclusive and exclusive calculations for Australian businesses.",
    images: ["https://findbest.tools/og-australia-gst-calculator.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://findbest.tools/finance/australia-gst-calculator",
      url: "https://findbest.tools/finance/australia-gst-calculator",
      name: "Australia GST Calculator 2026",
      isPartOf: { "@id": "https://findbest.tools/#website" },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://findbest.tools/og-australia-gst-calculator.jpg",
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
      name: "Australia GST Calculator",
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
        ratingCount: "3421",
      },
      featureList:
        "GST inclusive calculation, GST exclusive calculation, GST component extraction, multiple item GST summation, GST-free item handling, BAS reporting helper, invoice GST line item calculation",
    },
    {
      "@type": "HowTo",
      name: "How to Calculate GST in Australia",
      step: [
        {
          "@type": "HowToStep",
          name: "Determine if GST Applies",
          text: "Check if your goods or services are subject to 10% GST, GST-free, or input-taxed. Most goods and services in Australia attract 10% GST, but basic food, medical services, education, and exports are GST-free.",
        },
        {
          "@type": "HowToStep",
          name: "Calculate GST from an Exclusive Price",
          text: "To add GST to a GST-exclusive price, multiply the amount by 1.10. For example, $100 exclusive becomes $110 inclusive ($100 + $10 GST).",
        },
        {
          "@type": "HowToStep",
          name: "Calculate GST from an Inclusive Price",
          text: "To remove GST from a GST-inclusive price, divide the amount by 11 to find the GST component, then subtract from the total. For example, $110 inclusive contains $10 GST ($110 ÷ 11) and $100 net.",
        },
        {
          "@type": "HowToStep",
          name: "Report on Your BAS",
          text: "Record total GST collected on sales (G1) and total GST credits on purchases (G11). The difference is your net GST payable or refundable for the quarter.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How much is GST in Australia?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The standard Goods and Services Tax (GST) rate in Australia is 10%. It applies to most goods and services sold or consumed in Australia. Some items are GST-free (0%) including basic food, medical services, education, and exports. Others are input-taxed (no GST charged, but no GST credits available) including financial services and residential rent.",
          },
        },
        {
          "@type": "Question",
          name: "How do I calculate GST from a GST-inclusive price?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "To calculate the GST component from a GST-inclusive price, divide the total amount by 11. For example, $110 inclusive ÷ 11 = $10 GST. The net price before GST is $110 − $10 = $100. Alternatively, divide the inclusive price by 1.10 to get the exclusive price: $110 ÷ 1.10 = $100. Then subtract: $110 − $100 = $10 GST.",
          },
        },
        {
          "@type": "Question",
          name: "What is the GST registration threshold in Australia?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You must register for GST if your GST turnover (gross income minus GST-free sales) meets or exceeds $75,000 in any 12-month period. For non-profit organisations, the threshold is $150,000. For taxi and ride-sourcing drivers (including Uber), there is no threshold — you must register regardless of turnover. Registration is optional below the threshold.",
          },
        },
        {
          "@type": "Question",
          name: "What items are GST-free in Australia?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "GST-free items in Australia include: most basic foods (bread, milk, fruit, vegetables, meat), medical services and health care, education courses, childcare, exports, religious services, and some precious metals. While no GST is charged on these sales, businesses can still claim GST credits on purchases used to make GST-free sales.",
          },
        },
        {
          "@type": "Question",
          name: "How often do I need to lodge a BAS in Australia?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most businesses lodge a Business Activity Statement (BAS) quarterly. The due dates are 28 October (Q1: Jul-Sep), 28 February (Q2: Oct-Dec), 28 April (Q3: Jan-Mar), and 28 July (Q4: Apr-Jun). Businesses with turnover over $20 million must lodge monthly. Some small businesses may be eligible to lodge annually with an annual GST return and quarterly PAYG instalments.",
          },
        },
      ],
    },
  ],
};

export default function AustraliaGSTCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-[#F8FAFC] text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-amber-100 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-amber-700 ring-1 ring-inset ring-amber-200 shadow-sm">
              ATO 10% Rate — Updated April 2026
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl lg:text-7xl uppercase italic leading-none">
              Australia <br />
              <span className="text-amber-500 drop-shadow-sm">GST Calculator</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg font-medium text-slate-600 leading-relaxed">
              Professional-grade Australian GST tool for 2026. Calculate
              GST-inclusive and exclusive amounts for invoices, BAS, and
              accounting. Compliant with current ATO standards.
            </p>
          </div>

          {/* Calculator */}
          <AustraliaGSTCalculatorClient />


          {/* Long-form Content */}
          <article className="mx-auto mt-24 max-w-4xl space-y-24 pb-20">
            {/* Section 1 */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                The Australian GST System: A Comprehensive Overview
              </h2>
              <div className="mt-8 space-y-6 text-slate-600 leading-relaxed text-lg font-medium">
                <p>
                  The Goods and Services Tax (GST) is a 10% tax applied to most
                  goods and services sold or consumed in Australia. Introduced 
                  in 2000, it transformed the Australian tax landscape, 
                  replacing old wholesale sales taxes with a value-added 
                  model. While businesses collect GST from their customers, 
                  it is the final consumer who ultimately bears the cost.
                </p>
                <div className="p-8 bg-amber-500 rounded-[2rem] text-white shadow-2xl shadow-amber-200">
                  <h3 className="text-2xl font-black uppercase mb-4 tracking-tight leading-none italic">The $75k Threshold</h3>
                  <p className="opacity-95 leading-relaxed font-bold italic">
                    If your GST turnover is $75,000 or more, registration is mandatory. 
                    Ride-sourcing drivers (Uber/Didi) must register from dollar one, 
                    regardless of total turnover.
                  </p>
                </div>
                <p>
                  For small businesses, freelancers, and sole traders, GST 
                  compliance involves charging 10% on sales, claiming credits 
                  on business purchases, and lodging a Business Activity 
                  Statement (BAS) — usually every quarter. This tool simplifies 
                  that process by providing instant, accurate breakdowns 
                  for both single transactions and complex invoices.
                </p>
              </div>
            </section>

            {/* Section 2: Formulas */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-8">
                Mastering the Math: GST Formulas
              </h2>
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-premium group hover:border-amber-500 transition-all duration-300">
                  <h4 className="font-black text-amber-500 uppercase tracking-widest text-xs mb-4">Adding GST</h4>
                  <p className="text-slate-600 font-bold italic mb-4">
                    To add 10% GST to a net (exclusive) price:
                  </p>
                  <div className="rounded-2xl bg-slate-50 p-6 font-mono text-xl font-black text-slate-900 border border-slate-100 group-hover:bg-amber-50 transition-colors">
                    Price × 1.10
                  </div>
                  <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Example: $100 × 1.10 = $110</p>
                </div>
                <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-premium group hover:border-emerald-500 transition-all duration-300">
                  <h4 className="font-black text-emerald-500 uppercase tracking-widest text-xs mb-4">Extracting GST</h4>
                  <p className="text-slate-600 font-bold italic mb-4">
                    To find the GST component of a gross (inclusive) price:
                  </p>
                  <div className="rounded-2xl bg-slate-50 p-6 font-mono text-xl font-black text-slate-900 border border-slate-100 group-hover:bg-emerald-50 transition-colors">
                    Price ÷ 11
                  </div>
                  <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Example: $110 ÷ 11 = $10</p>
                </div>
              </div>
              <p className="mt-8 text-slate-600 font-medium text-lg leading-relaxed italic">
                The &quot;divide by 11&quot; rule is the secret weapon of Australian 
                accountants. Because 10% is one-eleventh of the final 110% 
                price, it provides the exact tax amount without needing 
                multiple calculation steps.
              </p>
            </section>

            {/* Section 3: Categories */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-8">
                Taxable vs GST-Free vs Input-Taxed
              </h2>
              <div className="space-y-6">
                <div className="flex gap-6 items-start p-8 rounded-[2rem] border border-amber-100 bg-amber-50/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-black italic">10</div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2">Taxable Supplies</h4>
                    <p className="text-slate-600 font-medium leading-relaxed">The standard category. Includes most retail goods, commercial services, and digital downloads. You charge 10% and can claim credits.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start p-8 rounded-[2rem] border border-emerald-100 bg-emerald-50/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-black italic">0</div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2">GST-Free Supplies</h4>
                    <p className="text-slate-600 font-medium leading-relaxed">Includes basic food, medical care, education, and exports. You don&apos;t charge GST but can still claim credits on your business costs.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start p-8 rounded-[2rem] border border-blue-100 bg-blue-50/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white font-black italic">X</div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2">Input-Taxed Supplies</h4>
                    <p className="text-slate-600 font-medium leading-relaxed">Mainly financial services and residential rent. You don&apos;t charge GST, but you also cannot claim credits on purchases related to these sales.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: BAS Dates */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-8">
                2026 BAS Lodgement Deadlines
              </h2>
              <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-premium">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                    <tr>
                      <th className="px-8 py-6">Quarter</th>
                      <th className="px-8 py-6">Period</th>
                      <th className="px-8 py-6">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-900 font-bold">
                    <tr>
                      <td className="px-8 py-6">Quarter 1</td>
                      <td className="px-8 py-6 text-slate-500">July – September</td>
                      <td className="px-8 py-6 text-amber-600">28 October</td>
                    </tr>
                    <tr>
                      <td className="px-8 py-6">Quarter 2</td>
                      <td className="px-8 py-6 text-slate-500">October – December</td>
                      <td className="px-8 py-6 text-amber-600">28 February</td>
                    </tr>
                    <tr>
                      <td className="px-8 py-6">Quarter 3</td>
                      <td className="px-8 py-6 text-slate-500">January – March</td>
                      <td className="px-8 py-6 text-amber-600">28 April</td>
                    </tr>
                    <tr>
                      <td className="px-8 py-6">Quarter 4</td>
                      <td className="px-8 py-6 text-slate-500">April – June</td>
                      <td className="px-8 py-6 text-amber-600">28 July</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-6 text-sm font-bold text-slate-500 italic text-center italic">
                *Note: Businesses with annual turnover over $20 million must lodge monthly.
              </p>
            </section>

            {/* Section 6: Quick Reference */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-8">
                GST Reference Table
              </h2>
              <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-premium">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                    <tr>
                      <th className="px-8 py-6">Net Price</th>
                      <th className="px-8 py-6">GST (10%)</th>
                      <th className="px-8 py-6">Gross Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-900 font-bold">
                    {[50, 100, 250, 500, 1000, 2500, 5000].map((amount) => (
                      <tr key={amount} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">${amount.toLocaleString()}.00</td>
                        <td className="px-8 py-6 text-amber-600">${(amount * 0.1).toFixed(2)}</td>
                        <td className="px-8 py-6 text-emerald-600">${(amount * 1.1).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 8: FAQ */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-12">
                Expert FAQ: Australian GST
              </h2>
              <div className="grid gap-12 sm:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none italic">
                    When must I register for GST?
                  </h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    You must register if your GST turnover is $75,000 or more 
                    ($150,000 for non-profits). Ride-sourcing drivers must 
                    register regardless of turnover. You can also register 
                    voluntarily to claim input tax credits.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none italic">
                    What is a Tax Invoice?
                  </h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    For taxable supplies over $82.50 (incl. GST), you must 
                    issue a valid Tax Invoice. It must include your ABN, 
                    the GST amount, and the words &quot;Tax Invoice&quot; clearly.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none italic">
                    Is GST charged on delivery?
                  </h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Generally, yes. Delivery fees follow the GST status of the 
                    goods. If the goods are taxable, the delivery is taxable. 
                    If the goods are GST-free (like basic food), the 
                    delivery may also be GST-free.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none italic">
                    How do I claim GST credits?
                  </h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    You can claim back the GST you paid on business purchases 
                    if you are registered and hold a valid tax invoice. This 
                    is reported as G11 on your BAS.
                  </p>
                </div>
              </div>
            </section>
          </article>
            {/* Trust Signal */}
            <div className="mt-24 rounded-3xl border border-slate-100 bg-slate-50/50 p-8">
              <div className="flex items-start gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 text-xl font-black text-amber-500 italic">
                  FB
                </div>
                <div>
                  <p className="font-black text-slate-900 uppercase tracking-tight">Verified by FindBest Tools</p>
                  <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed">
                    Calculations based on A New Tax System (Goods and Services Tax) Act 1999 
                    and latest ATO guidance. Verified for the 2026 financial year. 
                    Last reviewed: 25 April 2026.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Tools */}
          <div className="mt-20 border-t border-slate-100 pt-12">
            <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath="/finance/australia-gst-calculator" />
          </div>

        </div>
      </main>
    </>
  );
}
