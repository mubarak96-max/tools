import Link from "next/link";
import type { Metadata } from "next";

import NYCTransferTaxCalculator from "@/app/real-estate/nyc-transfer-tax-calculator/components/NYCTransferTaxCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/nyc-transfer-tax-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is the NYC Real Property Transfer Tax (RPTT)?",
    answer:
      "RPTT is a tax levied by New York City on the transfer of real property or interests in real property (like co-op shares). It applies to nearly all transactions over $25,000 within the five boroughs. The rate is determined by the property type and the sale price, with a significant rate jump at the $500,000 threshold.",
  },
  {
    question: "Who pays the transfer tax in NYC: Buyer or Seller?",
    answer:
      "In a standard resale, the seller is legally responsible for paying both NYC RPTT and NYS Transfer Tax. However, in 'Sponsor Sales' (new construction or condo conversions), the buyer is almost always contractually required to pay these taxes, which can add tens of thousands to their closing costs.",
  },
  {
    question: "Do co-ops pay transfer tax in New York City?",
    answer:
      "Yes. While co-op buyers save on Mortgage Recording Tax and Title Insurance, they (or the seller) must still pay the NYC RPTT and NYS Transfer Tax. Co-ops have been subject to these taxes since 1989 because the sale of shares is considered a transfer of an interest in real property.",
  },
  {
    question: "What is the Mansion Tax, and when does it apply?",
    answer:
      "The Mansion Tax is a New York State tax on residential purchases of $1 million or more. It starts at 1% for sales between $1M and $2M and scales progressively up to 3.9% for sales of $25M+. Unlike transfer taxes, the Mansion Tax is almost always paid by the buyer.",
  },
  {
    question: "Is NYC transfer tax tax-deductible?",
    answer:
      "Generally, transfer taxes are not deductible as an itemized expense. However, for the seller, they are treated as a cost of sale which reduces the capital gain (lowering potential capital gains tax). For the buyer, if they pay the tax, it is added to their 'cost basis,' which reduces their future capital gains when they sell.",
  },
  {
    question: "What is the 'Peat Tax' in NYC?",
    answer:
      "The 'Peat Tax' refers to the supplemental New York State transfer tax rate of 0.25% (totaling 0.65%) that applies to residential transfers over $3 million and commercial transfers over $2 million within New York City.",
  },
  {
    question: "Does the 4-unit rule affect transfer tax rates?",
    answer:
      "Yes. Properties with 1-3 residential units are taxed at the 'Residential' rate. If a property has 4 or more residential units, NYC classifies it as 'All Other Types' (Commercial), which triggers a much higher RPTT rate of 2.625% if the price is over $500,000.",
  },
  {
    question: "How do you calculate transfer tax on a gift or 'love and affection' transfer?",
    answer:
      "Even if no money changes hands, the tax may be based on the remaining mortgage balance on the property. If there is no mortgage and no consideration, the tax may be zero, but a return must still be filed (Form NYC-RPT).",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "NYC Transfer Tax Calculator 2026 | RPTT, Mansion Tax & NYS Rates",
    description:
      "Calculate NYC Real Property Transfer Tax (RPTT), NYS transfer tax, and mansion tax instantly. Updated 2026 rates for condos, co-ops, and 1-3 family homes.",
    path: PAGE_PATH,
  }),
  keywords: [
    "nyc transfer tax calculator",
    "new york city transfer tax calculator",
    "nys transfer tax nyc",
    "who pays transfer tax nyc",
    "nyc rptt rates 2026",
    "mansion tax nyc",
    "sponsor sale transfer tax",
    "nyc co-op transfer tax",
    "deducting nyc transfer tax",
    "new construction nyc closing costs",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "NYC & NYS Transfer Tax Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "Instant estimator for NYC RPTT, NYS Transfer Tax, and Mansion Tax. Updated with 2026 rates for residential and commercial New York real estate.",
  };
}

export default function NYCTransferTaxCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "NYC Transfer Tax Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <div className="space-y-8 sm:space-y-10">
        <section className="relative overflow-hidden pt-8 sm:pt-12">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/real-estate" className="primary-chip rounded-full px-3 py-1 shadow-sm drop-shadow-sm">
                Real Estate
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-tight text-primary">
                Updated for 2026
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                NYC Transfer Tax Calculator (2026) – RPTT & Mansion Tax
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <span className="flex h-2 w-2 rounded-full bg-success" />
                Last Updated: April 22, 2026
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              Estimate New York City RPTT, New York State transfer tax, and mansion tax based on current 2026 public rate references.
            </p>
            <p className="mt-4 max-w-3xl rounded-[1rem] border border-amber-300/40 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
              This calculator is for general education and planning only. It is not legal,
              tax, accounting, or closing-cost advice. Confirm the result with your attorney,
              CPA, title company, or the relevant tax agency before relying on it for a transaction.
            </p>

            <nav aria-label="Breadcrumb" className="mt-8">
              <ol className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-slate-400">
                <li><Link href="/" className="hover:text-primary">Home</Link></li>
                <li>/</li>
                <li><Link href="/real-estate" className="hover:text-primary">Real Estate</Link></li>
                <li>/</li>
                <li className="text-slate-900">NYC Transfer Tax Calculator</li>
              </ol>
            </nav>
          </div>
        </section>

        <NYCTransferTaxCalculator />

        <section className="space-y-16 border-t border-border/60 pt-16 pb-24">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-8">The Definitive NYC Transfer Tax Encyclopedia (2026 Edition)</h2>
            
            <p className="text-xl leading-relaxed text-slate-600 mb-12">
              Buying or selling a property in New York City is not just a real estate transaction; it is a complex navigation through a multi-layered tax environment. The <strong>Real Property Transfer Tax (RPTT)</strong> and the <strong>New York State Transfer Tax</strong> represent some of the most significant line items on a closing statement. This guide provides over 2,000 words of actionable, factual intelligence to help you master these costs.
            </p>

            <div className="grid gap-8 lg:grid-cols-3 mb-16">
              <div className="lg:col-span-2 space-y-8">
                <h3 className="text-2xl font-bold text-slate-900 border-b pb-4">1. Understanding the Core Rates</h3>
                <p>
                  NYC taxes property transfers based on two primary factors: the <strong>property class</strong> and the <strong>consideration</strong> (sale price).
                </p>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="p-4 text-left font-bold text-slate-900 border">Property Type</th>
                                <th className="p-4 text-left font-bold text-slate-900 border">Under $500,000</th>
                                <th className="p-4 text-left font-bold text-slate-900 border">$500,000 & Above</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-4 border font-medium">Residential (1-3 Family, Condo, Co-op)</td>
                                <td className="p-4 border text-primary font-bold">1.000%</td>
                                <td className="p-4 border text-primary font-bold">1.425%</td>
                            </tr>
                            <tr>
                                <td className="p-4 border font-medium">Commercial & Multi-Family (4+ Units)</td>
                                <td className="p-4 border text-primary font-bold">1.425%</td>
                                <td className="p-4 border text-primary font-bold">2.625%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-sm text-slate-500 italic">
                    Note: "Consideration" includes the cash paid plus the amount of any mortgage or lien remaining on the property at the time of transfer.
                </p>
              </div>
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white h-fit">
                <h4 className="text-lg font-bold mb-4 text-primary">Quick Calculation Shortcut</h4>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    For a typical $1.2M condo resale in NYC:
                </p>
                <ul className="space-y-3 text-sm">
                    <li className="flex justify-between"><span>NYC RPTT (1.425%)</span> <strong>$17,100</strong></li>
                    <li className="flex justify-between"><span>NYS Tax (0.4%)</span> <strong>$4,800</strong></li>
                    <li className="flex justify-between border-t border-white/20 pt-2 text-primary font-bold"><span>Total Seller Tax</span> <span>$21,900</span></li>
                </ul>
              </div>
            </div>

            <h3 className="text-3xl font-bold text-slate-900 mt-16 mb-6">2. The Filing Process: ACRIS, Forms, and Timelines</h3>
            <p>
                In New York City, the payment of transfer tax is inextricably linked with the filing of the <strong>Real Property Transfer Tax Return (Form NYC-RPT)</strong>. This process is managed through <strong>ACRIS</strong> (Automated City Register Information System).
            </p>
            <div className="grid md:grid-cols-2 gap-8 my-10">
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-2">The 30-Day Rule</h4>
                    <p className="text-sm text-blue-800 leading-relaxed">
                        You have exactly <strong>30 days</strong> from the date of the transfer (usually the closing date) to file the return and pay the tax. Failure to do so triggers immediate penalties and interest.
                    </p>
                </div>
                <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                    <h4 className="font-bold text-red-900 mb-2">Penalty Scenarios</h4>
                    <p className="text-sm text-red-800 leading-relaxed">
                        Late filing penalties start at 5% of the tax due for each month of delay, up to a maximum of 25%. Interest is also charged, currently calculated at a rate determined by the NYC Department of Finance.
                    </p>
                </div>
            </div>
            <p>
                For properties in <strong>Staten Island</strong> (Richmond County), filings are not done through ACRIS but through the Richmond County Clerk's office, though the tax rates remain the same.
            </p>

            <h3 className="text-3xl font-bold text-slate-900 mt-16 mb-6">3. Deep Dive: Transfer Tax vs. Cost Basis Math</h3>
            <p>
                A common question is: <em>"Can I deduct NYC transfer tax on my income tax return?"</em> The answer is nuanced. While you cannot "deduct" it as an itemized expense like property taxes, it plays a vital role in your <strong>Cost Basis</strong>.
            </p>
            <div className="my-10 p-8 border border-slate-200 rounded-[2.5rem] bg-white shadow-sm">
                <h4 className="text-xl font-bold mb-6">The Financial Lifecycle of a $1M Purchase</h4>
                <div className="space-y-6">
                    <div>
                        <h5 className="font-bold text-slate-700 mb-2">Scenario A: Standard Resale (Seller Pays Tax)</h5>
                        <p className="text-sm text-slate-600">
                            The seller receives $1,000,000 but pays $18,250 in taxes. On their tax return, their "Amount Realized" is $981,750. This effectively reduces their taxable capital gain.
                        </p>
                    </div>
                    <div className="border-t pt-6">
                        <h5 className="font-bold text-slate-700 mb-2">Scenario B: Sponsor Sale (Buyer Pays Tax)</h5>
                        <p className="text-sm text-slate-600">
                            The buyer pays $1,000,000 to the seller PLUS $18,250 in taxes to NYC/NYS. The buyer's <strong>adjusted cost basis</strong> becomes $1,018,250. When they sell the property years later for $1.5M, their taxable gain is calculated from this higher basis, saving them thousands in capital gains tax.
                        </p>
                    </div>
                </div>
            </div>

            <h3 className="text-3xl font-bold text-slate-900 mt-16 mb-6">4. The "4-Unit Trap" & Mixed-Use Complexity</h3>
            <p>
                One of the most dangerous pitfalls for small-scale investors is the <strong>4-unit classification jump</strong>. In NYC, a 3-unit building is "Residential," but a 4-unit building is taxed at the "All Other Types" (Commercial) rate.
            </p>
            <div className="my-10 overflow-hidden rounded-2xl border border-slate-200">
                <div className="bg-slate-900 p-4 text-white font-bold text-center">The 4-Unit Rate Cliff ($1,000,000 Sale)</div>
                <div className="grid grid-cols-2 text-center divide-x border-b">
                    <div className="p-8">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">3-Unit (Residential)</p>
                        <p className="text-3xl font-bold text-slate-900">1.425%</p>
                        <p className="text-sm text-slate-500 mt-1">$14,250 RPTT</p>
                    </div>
                    <div className="p-8 bg-primary/5">
                        <p className="text-xs font-bold text-primary uppercase mb-2">4-Unit (Commercial)</p>
                        <p className="text-3xl font-bold text-primary">2.625%</p>
                        <p className="text-sm text-primary/70 mt-1">$26,250 RPTT</p>
                    </div>
                </div>
            </div>
            <p>
                <strong>Mixed-Use Properties:</strong> If a building contains both residential and commercial space, the classification depends on the predominant use. However, if there is <em>any</em> commercial use in a building with 1-3 residential units, it typically retains the lower residential rate for RPTT, provided it doesn't cross the unit count threshold.
            </p>

            <h3 className="text-3xl font-bold text-slate-900 mt-16 mb-6">5. Progressive Mansion Tax Tiers (2026)</h3>
            <p>
                While transfer taxes are the seller's domain, the <strong>NYS Mansion Tax</strong> is the buyer's burden. It is a progressive tax that triggers at exactly $1,000,000.
            </p>
            <div className="my-10 space-y-4">
                {[
                    { range: "$1,000,000 - $1,999,999", rate: "1.00%" },
                    { range: "$2,000,000 - $2,999,999", rate: "1.25%" },
                    { range: "$3,000,000 - $4,999,999", rate: "1.50%" },
                    { range: "$5,000,000 - $9,999,999", rate: "2.25%" },
                    { range: "$10,000,000 - $14,999,999", rate: "3.25%" },
                    { range: "$15,000,000 - $19,999,999", rate: "3.50%" },
                    { range: "$20,000,000 - $24,999,999", rate: "3.75%" },
                    { range: "$25,000,000+", rate: "3.90%" },
                ].map((tier, i) => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                        <span className="font-medium text-slate-700">{tier.range}</span>
                        <span className="font-mono font-bold text-primary">{tier.rate}</span>
                    </div>
                ))}
            </div>

            <h3 className="text-3xl font-bold text-slate-900 mt-16 mb-6">6. Negotiation Strategies: Who Pays What?</h3>
            <p>
                The NYC real estate market is highly transactional, and everything—including tax responsibility—can be negotiated.
            </p>
            <ul className="space-y-6 my-8">
                <li className="flex gap-4">
                    <div className="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
                    <div>
                        <h4 className="font-bold text-slate-900">The "Gross-Up" Offer</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            In a slow market, a buyer might offer a higher price but ask the seller to pay the Mansion Tax. Because the Mansion Tax is legally a buyer's tax, the seller paying it is considered a "concession" and must be carefully worded in the contract to avoid "taxing the tax."
                        </p>
                    </div>
                </li>
                <li className="flex gap-4">
                    <div className="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
                    <div>
                        <h4 className="font-bold text-slate-900">Sponsor Sale Credits</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Buyers of new construction should always try to negotiate a "credit" for transfer taxes. While the developer's contract says the buyer pays, a savvy buyer's attorney will ask the developer to cover these costs as a closing incentive.
                        </p>
                    </div>
                </li>
                <li className="flex gap-4">
                    <div className="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
                    <div>
                        <h4 className="font-bold text-slate-900">The $999,000 Strategy</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Properties listed at $1,050,000 often sell for $999,000 because the "Mansion Tax Cliff" at $1M adds $10,000+ to the buyer's cost. Sellers often accept a slightly lower price to keep the buyer under the threshold.
                        </p>
                    </div>
                </li>
            </ul>

            <h3 className="text-3xl font-bold text-slate-900 mt-16 mb-6">7. Entity Transfers & Article 31 (The 50% Rule)</h3>
            <p>
                You don't just pay transfer tax when you record a deed. You also pay it when you transfer a <strong>controlling interest</strong> (50% or more) in an entity that owns real property in New York.
            </p>
            <p>
                This is governed by <strong>Article 31</strong> of the NYS Tax Law. If you own an LLC that holds a commercial building in Brooklyn and you sell 51% of that LLC to a partner, NYC and NYS will treat that as a taxable transfer of the underlying real estate, even though no new deed is filed in ACRIS.
            </p>

            <h3 className="text-3xl font-bold text-slate-900 mt-16 mb-6">8. Inherited Property & "Love & Affection" Transfers</h3>
            <p>
                Transferring property to a family member or via an estate can sometimes be tax-exempt, but it is a common area for audits.
            </p>
            <div className="grid md:grid-cols-2 gap-8 my-10">
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-4">True Gifts</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        A transfer with "zero consideration" (no money, no mortgage payoff) is generally exempt from RPTT. However, you must still file the RPT return and prove the "Love & Affection" status to the Department of Finance.
                    </p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-4">Mortgage Assumption</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        If you "gift" a property but the recipient assumes the existing $400,000 mortgage, NYC considers that $400,000 to be <strong>consideration</strong>. You will owe RPTT on that $400,000 balance.
                    </p>
                </div>
            </div>

            <h3 className="text-3xl font-bold text-slate-900 mt-16 mb-6">9. 2026 Policy Outlook & Historical Context</h3>
            <p>
                NYC's transfer taxes have historically been a primary lever for city revenue. Since the introduction of the "Peat Tax" (supplemental rate) and the progressive Mansion Tax tiers in 2019, the tax burden on high-end NYC real estate has reached historic highs.
            </p>
            <p>
                Looking into 2026, there is ongoing debate in the City Council regarding "Pied-à-terre" taxes and further adjustments to the Mansion Tax. Staying updated with a professional calculator is essential for any multi-year planning.
            </p>

            <div className="mt-16 p-10 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-6">Final Practical Takeaway</h2>
                    <p className="text-slate-400 mb-8 max-w-2xl leading-relaxed">
                        Never rely on a "back-of-the-napkin" estimate for NYC closing costs. A 0.5% error on a $2 million sale is $10,000—enough to derail a deal at the closing table. Always use a dynamic calculator and verify the "Property Class" with your title company or attorney early in the process.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/blog/nyc-closing-costs-2026" className="px-8 py-4 bg-primary rounded-2xl font-bold hover:scale-105 transition-transform text-white">Full 2026 Closing Guide</Link>
                        <Link href="/real-estate" className="px-8 py-4 bg-white/10 rounded-2xl font-bold hover:bg-white/20 transition-colors">More Tools</Link>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
            </div>

            <h2 className="text-3xl font-bold mt-24 mb-12">Expanded NYC Real Estate FAQs (Master List)</h2>
            <div className="grid gap-6 md:grid-cols-2">
                {faq.concat([
                    {
                        question: "Can I use a 1031 Exchange to avoid NYC Transfer Tax?",
                        answer: "No. A 1031 Exchange allows you to defer Federal and State capital gains taxes, but it does NOT defer or exempt you from NYC Real Property Transfer Tax or NYS Transfer Tax. Those must be paid at every closing."
                    },
                    {
                        question: "What is the 'controlling interest' transfer tax?",
                        answer: "If you sell 50% or more of an entity (LLC, Corp) that owns NYC real estate, you must file a transfer tax return. The city looks through the entity to the real estate value."
                    },
                    {
                        question: "Is there a transfer tax on HDFC co-ops?",
                        answer: "Yes, but some HDFC transfers may be subject to different 'Flip Tax' rules mandated by the city's regulatory agreement. The standard NYC RPTT still applies based on the sale price."
                    },
                    {
                        question: "Does the buyer pay RPTT in a foreclosure sale?",
                        answer: "Usually, the buyer in a foreclosure or REO sale is responsible for the transfer taxes, which is a major difference from a standard resale."
                    }
                ]).map((item, i) => (
                    <div key={i} className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-lg font-bold text-slate-900 mb-4">{item.question}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{item.answer}</p>
                    </div>
                ))}
            </div>

            <div className="mt-24 p-12 bg-slate-50 rounded-[3rem] border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Beyond Transfer Taxes: The Full Picture</h3>
                <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
                    Closing costs are just the beginning. Before committing to a New York purchase, determine if the numbers truly beat renting in the long run.
                </p>
                <div className="flex justify-center">
                    <Link href="/real-estate/rent-vs-buy-calculator" className="group flex items-center gap-4 p-6 bg-white rounded-3xl border border-slate-200 hover:border-primary/30 transition-all shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">R/B</div>
                        <div>
                            <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">Rent vs Buy Calculator</h4>
                            <p className="text-sm text-slate-500">Includes NYC-specific tax deduction modelling</p>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="mt-24 p-8 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 text-center">Referenced Official Data Sources</h4>
                <div className="flex flex-wrap justify-center gap-8">
                    <a href="https://www.nyc.gov/site/finance/property/property-real-property-transfer-tax-rptt.page" target="_blank" className="text-sm font-bold text-slate-900 hover:text-primary transition-colors">NYC Dept. of Finance (RPTT)</a>
                    <a href="https://www.tax.ny.gov/bus/transfer/rptidx.htm" target="_blank" className="text-sm font-bold text-slate-900 hover:text-primary transition-colors">NYS Dept. of Taxation (Transfer Tax)</a>
                    <a href="https://www.nyc.gov/site/finance/taxes/acris.page" target="_blank" className="text-sm font-bold text-slate-900 hover:text-primary transition-colors">ACRIS Portal</a>
                </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
