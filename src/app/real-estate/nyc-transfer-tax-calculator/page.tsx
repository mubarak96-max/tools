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
    question: "What is NYC Real Property Transfer Tax (RPTT)?",
    answer:
      "RPTT is a tax levied by New York City on the transfer of real property or interests in real property (like co-ops). The tax is based on the purchase price and varies by property type and price threshold.",
  },
  {
    question: "Do I pay transfer tax on a co-op in NYC?",
    answer:
      "Yes. Both condos (real property) and co-ops (shares in a corporation) are subject to the NYC Real Property Transfer Tax. Co-op transfers have been subject to RPTT since 1989 because they represent a transfer of an interest in real property.",
  },
  {
    question: "How much is transfer tax on a $2 million NYC condo?",
    answer:
      "For a $2 million NYC condo, the seller typically pays 1.425% NYC RPTT ($28,500) and 0.65% NYS Transfer Tax ($13,000). Total transfer taxes equal $41,500. Additionally, the buyer likely pays the NYS Mansion Tax of 1.25% ($25,000).",
  },
  {
    question: "Who pays the NYC transfer tax, the buyer or the seller?",
    answer:
      "In most resale transactions, the seller is responsible for paying both NYC and NYS transfer taxes. However, in new construction (sponsor sales), the buyer typically assumes this cost contractually, which can significantly increase closing costs.",
  },
  {
    question: "Can you deduct NYC transfer tax?",
    answer:
      "Generally, you cannot deduct transfer taxes as an itemized deduction on your federal income tax return. Instead, for the seller, they are treated as an expense of sale that reduces the capital gain. For the buyer, they are added to the property's cost basis.",
  },
  {
    question: "How much is the New York State transfer tax?",
    answer:
      "In addition to NYC tax, the State charges 0.4% ($2 per $500) for properties under $2M, and 0.65% for residential properties over $2M (or commercial over $3M).",
  },
  {
    question: "Transfer tax on new construction NYC",
    answer:
      "On new construction (sponsor sales), the buyer is almost always expected to pay the NYC RPTT and NYS Transfer Tax, as well as the sponsor's legal fees. This is a key difference from resale purchases where the seller pays.",
  },
  {
    question: "When is the transfer tax paid?",
    answer:
      "The tax is typically paid at the closing of the transaction. The RPTT return must be filed and the tax paid within 30 days of the transfer.",
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

        <section className="space-y-4 border-t border-border/60 pt-8">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold">What is NYC Real Property Transfer Tax (RPTT)?</h2>
            <p>
              The New York City Real Property Transfer Tax (RPTT) applies to nearly every real estate transaction in the five boroughs totaling over $25,000. This includes the sale of houses, condos, and co-op apartments.
            </p>

            <div className="my-10 bg-slate-50 border border-slate-100 rounded-[2rem] p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Worked Example: $1.5M Condo Purchase (NYC Resale)</h3>
              <p className="text-sm text-slate-600 mb-6 italic">How much would the taxes be on a $1,500,000 condo? Here is the breakdown:</p>
              <div className="grid gap-4 sm:grid-cols-2 text-slate-900">
                <div className="rounded-xl bg-white p-5 border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Seller Responsibilities</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between"><span>NYC RPTT (1.425%)</span> <span className="font-bold">$21,375</span></li>
                    <li className="flex justify-between"><span>NYS Transfer Tax (0.4%)</span> <span className="font-bold">$6,000</span></li>
                    <li className="border-t pt-2 flex justify-between font-bold text-slate-900"><span>Total Seller Tax</span> <span>$27,375</span></li>
                  </ul>
                </div>
                <div className="rounded-xl bg-white p-5 border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Buyer Responsibilities</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between"><span>NYS Mansion Tax (1.0%)</span> <span className="font-bold">$15,000</span></li>
                    <li className="border-t pt-2 flex justify-between font-bold text-slate-900"><span>Total Buyer Tax</span> <span>$15,000</span></li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-8 bg-primary/5 rounded-[2rem] border border-primary/10">
                <h4 className="text-lg font-bold text-slate-900 mb-2 text-center">Comprehensive NYC Closing Cost Guides</h4>
                <p className="text-sm text-slate-600 mb-8 text-center">
                    Transfer taxes are just one part of the equation. Explore our detailed 2026 guides for a complete breakdown of every fee.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link 
                        href="/blog/nyc-closing-costs-2026"
                        className="group flex flex-col gap-1 p-4 bg-white rounded-xl border border-border hover:border-primary/30 transition-all shadow-sm"
                    >
                        <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">NYC Buyer&apos;s Closing Guide</span>
                        <span className="text-xs text-slate-500">Mansion Tax & standard resale fees</span>
                    </Link>
                    <Link 
                        href="/blog/who-pays-transfer-tax-nyc"
                        className="group flex flex-col gap-1 p-4 bg-white rounded-xl border border-border hover:border-primary/30 transition-all shadow-sm"
                    >
                        <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Seller Tax Explained</span>
                        <span className="text-xs text-slate-500">RPTT, Net proceeds & broker fees</span>
                    </Link>
                    <Link 
                        href="/blog/nyc-investment-property-transfer-tax"
                        className="group flex flex-col gap-1 p-4 bg-white rounded-xl border border-border hover:border-primary/30 transition-all shadow-sm"
                    >
                        <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Investor & Commercial Guide</span>
                        <span className="text-xs text-slate-500">4-unit trap & entity transfers</span>
                    </Link>
                    <Link 
                        href="/blog/nyc-sponsor-sales-closing-costs"
                        className="group flex flex-col gap-1 p-4 bg-white rounded-xl border border-border hover:border-primary/30 transition-all shadow-sm"
                    >
                        <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Sponsor Sale (New Dev) Guide</span>
                        <span className="text-xs text-slate-500">The "Transfer Tax Flip" cost gap</span>
                    </Link>
                    <Link 
                        href="/blog/nyc-condo-vs-coop-closing-costs"
                        className="group flex flex-col gap-1 p-4 bg-white rounded-xl border border-border hover:border-primary/30 transition-all shadow-sm sm:col-span-2 lg:col-span-2"
                    >
                        <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Condo vs. Co-op: The Financial Side</span>
                        <span className="text-xs text-slate-500">Mortgage tax exemptions & flip taxes</span>
                    </Link>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8">Transfer Tax Responsibility: Buyer vs. Seller</h2>
            <p>Understanding who pays what is crucial for budgeting closing costs in NYC.</p>
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border border-border rounded-lg text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left border-b border-border font-bold">Closing Cost</th>
                    <th className="px-4 py-3 text-left border-b border-border font-bold">Standard Resale</th>
                    <th className="px-4 py-3 text-left border-b border-border font-bold">Sponsor Sale (New Construction)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-medium">NYC RPTT</td>
                    <td className="px-4 py-3">Typically Seller</td>
                    <td className="px-4 py-3 font-bold text-primary">Buyer Pays</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">NYS Transfer Tax</td>
                    <td className="px-4 py-3">Typically Seller</td>
                    <td className="px-4 py-3 font-bold text-primary">Buyer Pays</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Mansion Tax</td>
                    <td className="px-4 py-3">Always Buyer</td>
                    <td className="px-4 py-3">Always Buyer</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Title Insurance</td>
                    <td className="px-4 py-3">Buyer Pays</td>
                    <td className="px-4 py-3">Buyer Pays</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold mt-8">NYS Transfer Tax Rates (Standard & Peat Tax)</h2>
            <p>
              Beyond the city-level tax, all transactions in the state are subject to the <strong>New York State Transfer Tax</strong>.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Standard Rate:</strong> 0.4% ($2 per $500) for most transactions.</li>
              <li><strong>NYC High-Value Rate (Peat Tax):</strong> For transfers within NYC, the rate increases to 0.65% if the price is $3 million or more for residential properties (1-3 family) or $2 million or more for non-residential properties.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8">NYC Real Property Transfer Tax Rates</h2>
            <p>NYC uses a two-tier rate system based on the property type and the sale price:</p>

            <div className="overflow-x-auto my-6">
              <table className="min-w-full border border-border rounded-lg">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left border-b border-border">Property Type</th>
                    <th className="px-4 py-3 text-left border-b border-border">Under $500,000</th>
                    <th className="px-4 py-3 text-left border-b border-border">$500,000 and Above</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-medium">Residential (1-3 Family, Condo, Co-op)</td>
                    <td className="px-4 py-3">1.000%</td>
                    <td className="px-4 py-3">1.425%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">All Other Types (Commercial)</td>
                    <td className="px-4 py-3">1.425%</td>
                    <td className="px-4 py-3">2.625%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold mt-8">The NYS Mansion Tax</h2>
            <p>
              Residential purchases of $1 million or more trigger the <strong>NYS Mansion Tax</strong>. Unlike the transfer taxes which are typically paid by the seller, the Mansion Tax is almost always paid by the <strong>buyer</strong>. The rate starts at 1% and scales progressively:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-1">
              <li>$1,000,000 to $1,999,999: 1.00%</li>
              <li>$2,000,000 to $2,999,999: 1.25%</li>
              <li>$3,000,000 to $4,999,999: 1.50%</li>
              <li>Up to 3.90% for $25 million+</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8">Co-op vs. Condo Tax Nuances</h2>
            <p>
              While the RPTT rates are identical for condos and co-ops, the legal structure differs. Condo transfers involve a deed, while co-op transfers involve shares in a corporation and a proprietary lease. Despite being personal property, co-ops have been subject to RPTT since 1989.
            </p>

            <h2 className="text-2xl font-bold mt-8">Official References</h2>
            <p>
              Rate references should be checked again before a real
              transaction, because filing instructions and exemptions can change.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <a
                  href="https://www.nyc.gov/site/finance/property/property-real-property-transfer-tax-rptt.page"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  NYC Department of Finance: Real Property Transfer Tax
                </a>
              </li>
              <li>
                <a
                  href="https://www.tax.ny.gov/bus/transfer/rptidx.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  New York State Department of Taxation and Finance: Real estate transfer tax
                </a>
              </li>
              <li>
                <a
                  href="https://www.tax.ny.gov/forms/real_prop_tran_cur_forms.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  NYS current real estate transfer tax forms and TP-584-NYC instructions
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-16 space-y-8 border-t border-border/60 pt-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">NYC Real Estate FAQs</h2>
            <p className="mt-2 text-slate-500">Common questions about transfer taxes, Mansion Tax, and NYC closing costs.</p>
          </div>
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {faq.map((item) => (
              <article key={item.question} className="rounded-3xl border border-slate-100 bg-white/30 p-6 shadow-sm backdrop-blur-sm">
                <h3 className="text-[17px] font-bold text-slate-900">{item.question}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 space-y-8 border-t border-slate-100 pt-16">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">More Real Estate Tools</h2>
              <p className="mt-1 text-sm text-slate-500">Other property and tax calculators for local and international markets.</p>
            </div>
            <Link href="/real-estate" className="secondary-button px-4 py-2 text-xs">View All</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "UK Stamp Duty Calculator",
                href: "/real-estate/uk-stamp-duty-calculator",
                icon: "SDLT",
                desc: "Calculate Stamp Duty Land Tax (SDLT) for property purchases in England and Northern Ireland."
              },
              {
                name: "Singapore Buyer Stamp Duty",
                href: "/real-estate/singapore-buyers-stamp-duty-calculator",
                icon: "BSD",
                desc: "Estimate BSD and ABSD for residential and commercial property acquisition in Singapore."
              },
              {
                name: "Price Per Square Foot",
                href: "/real-estate/price-per-square-foot-calculator",
                icon: "PSF",
                desc: "Analyze property value and compare local real estate listing prices efficiently."
              }
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col gap-3 rounded-2xl border border-white/40 bg-white/40 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:bg-white/60 hover:shadow-hover"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[11px] font-black text-primary shadow-sm ring-1 ring-black/5">
                  {tool.icon}
                </span>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900 transition-colors group-hover:text-primary">
                    {tool.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-50">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
