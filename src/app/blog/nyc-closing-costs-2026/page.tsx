import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/nyc-closing-costs-2026";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "NYC Closing Costs 2026: The Complete Buyer's Guide | FindBest Tools",
  description: "Budgeting for NYC real estate? Learn about Mansion Tax, Mortgage Recording Tax, RPTT, and co-op vs. condo closing fees in our 2026 NYC buyer's guide.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "NYC Closing Costs in 2026: The Complete Buyer's Guide",
    description: "Navigate NYC's complex closing costs, from Mansion Tax to Mortgage Recording Tax, with our detailed 2026 breakdown.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "What is the Mansion Tax in NYC?",
    answer: "The Mansion Tax is a progressive tax levied by New York State on residential purchases of $1 million or more. The rate starts at 1% for purchases between $1M and $2M and scales up to 3.90% for sales of $25M or more.",
  },
  {
    question: "Do co-ops pay Mortgage Recording Tax in NYC?",
    answer: "No. Co-ops are technically a purchase of shares in a corporation, not real property. Therefore, co-op mortgages are not recorded against real estate, and the state's Mortgage Recording Tax does not apply, saving buyers thousands.",
  },
  {
    question: "How much are closing costs for a buyer in NYC?",
    answer: "Buyer closing costs in NYC typically range from 2% to 6% of the purchase price. Co-op purchases usually sit at the lower end (2-3%) because they avoid title insurance and mortgage taxes, while condos can reach 4-6% depending on financing.",
  },
  {
    question: "Who pays the NYC Transfer Tax in a sponsor sale?",
    answer: "In a standard resale, the seller pays the NYC RPTT and NYS Transfer Tax. However, in new construction (sponsor sales), the buyer is almost always contractually required to pay these taxes, along with the sponsor's legal fees.",
  },
];

export default function NycClosingCostsBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "NYC Closing Costs Guide 2026", path: PAGE_PATH },
  ]);

  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <header className="mb-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">NYC Real Estate</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wider">
            Finance · Real Estate
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            NYC Closing Costs in 2026: The Complete Buyer&apos;s Guide
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            From the Mansion Tax to Mortgage Recording fees, discover the true cost of buying an apartment in New York City.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>Last updated: April 2026</span>
            <span>•</span>
            <span>12 min read</span>
          </div>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <p className="leading-relaxed">
            So you&apos;ve found an apartment in New York City and your offer just got accepted. Congratulations — now comes the part nobody in real estate likes to talk about until it&apos;s too late: <strong>closing costs</strong>.
          </p>
          <p className="mt-4 leading-relaxed">
            In most of the country, buyers budget 2–3% of the purchase price for closing costs and call it a day. In New York City, that math doesn&apos;t hold. Depending on what you&apos;re buying and how you&apos;re financing it, closing costs can run anywhere from <strong>2% to 6% of the purchase price</strong> — and on a $1.5 million condo, that gap is the difference between $30,000 and $90,000.
          </p>
          <p className="mt-4 leading-relaxed">
            This guide breaks down every single cost you&apos;ll encounter as an NYC buyer in 2026, who pays what, and where the real surprises tend to hide.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Why NYC Closing Costs Are So Much Higher</h2>
          <p className="leading-relaxed">
            The short version: New York layers on city-level taxes that most other states don&apos;t have.
          </p>
          <p className="mt-4 leading-relaxed">
            Beyond the standard stuff (attorney fees, title insurance, inspections), NYC buyers face the <strong>Mortgage Recording Tax</strong> — a tax you pay just for the privilege of taking out a mortgage in New York State. Add in the potential <strong>Mansion Tax</strong> on purchases over $1 million, and the costs stack up quickly.
          </p>
          <p className="mt-4 leading-relaxed">
            The type of property you&apos;re buying also changes the equation significantly. A co-op is structured differently than a condo, which is structured differently than a new construction sponsor unit — and each of those has its own set of fees and quirks.
          </p>
        </section>

        <section className="mb-12 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-border">
          <h2 className="text-3xl font-bold mb-6">The Mansion Tax</h2>
          <p className="leading-relaxed mb-6">
            If you&apos;re buying a residential property for $1 million or more, New York State charges you a Mansion Tax. Despite the name, this isn&apos;t just for mansions — it hits a significant portion of NYC transactions at today&apos;s prices.
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left uppercase text-xs font-bold text-muted-foreground">
                <tr>
                  <th className="py-3 px-2 text-slate-900">Purchase Price</th>
                  <th className="py-3 px-2 text-slate-900">Mansion Tax Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="py-3 px-2">$1,000,000 – $1,999,999</td><td className="py-3 px-2 font-bold">1.00%</td></tr>
                <tr><td className="py-3 px-2">$2,000,000 – $2,999,999</td><td className="py-3 px-2 font-bold">1.25%</td></tr>
                <tr><td className="py-3 px-2">$3,000,000 – $4,999,999</td><td className="py-3 px-2 font-bold">1.50%</td></tr>
                <tr><td className="py-3 px-2">$5,000,000 – $9,999,999</td><td className="py-3 px-2 font-bold">2.25%</td></tr>
                <tr><td className="py-3 px-2">$10,000,000 – $14,999,999</td><td className="py-3 px-2 font-bold">3.25%</td></tr>
                <tr><td className="py-3 px-2">$15,000,000 and above</td><td className="py-3 px-2 font-bold">Up to 3.90%</td></tr>
              </tbody>
            </table>
          </div>
          <p className="leading-relaxed">
            One thing buyers often miss: the Mansion Tax applies to the <strong>entire purchase price</strong>, not just the portion above $1 million. So if you&apos;re buying at $1,050,000, you owe 1% on the full $1,050,000 — not just the $50,000 above the threshold. That&apos;s $10,500. On a $999,000 purchase, you owe nothing.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The Mortgage Recording Tax</h2>
          <p className="leading-relaxed">
            This is the one that catches people off guard. New York State charges a tax every time a mortgage is recorded — meaning every time a bank lends money secured by property in NYC.
          </p>
          <ul className="mt-4 space-y-2 list-disc pl-6">
            <li><strong>1- to 3-family homes and condos under $500,000:</strong> 1.80% of the loan amount</li>
            <li><strong>All other properties (condos $500K+, commercial):</strong> 1.925% of the loan amount</li>
          </ul>
          <p className="mt-4 leading-relaxed p-6 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r-2xl italic">
            <strong>Co-ops don&apos;t pay Mortgage Recording Tax.</strong> This is one of the lesser-known financial advantages of buying a co-op. Because co-op purchases are technically a purchase of shares in a corporation, the tax doesn&apos;t apply.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">NYC Real Property Transfer Tax (RPTT)</h2>
          <p className="leading-relaxed">
            In most transactions, this is a seller cost — but it&apos;s worth understanding because in <strong>new construction (sponsor sales)</strong>, it frequently gets flipped onto the buyer.
          </p>
          <p className="mt-4 leading-relaxed">
            Use the <Link href="/real-estate/nyc-transfer-tax-calculator" className="text-primary font-bold underline">NYC Transfer Tax Calculator</Link> to estimate exactly what this number looks like for any purchase price and property type.
          </p>
        </section>

        <section className="mb-12 grid gap-8 md:grid-cols-2">
            <div className="p-8 rounded-3xl border border-border bg-card">
                <h3 className="text-xl font-bold mb-4">🏠 Condo Closing Fees</h3>
                <ul className="space-y-3 text-sm text-muted-foreground list-none p-0">
                    <li className="flex gap-2"><span>✅</span> <strong>Title Insurance:</strong> Required by lenders ($2k - $4k)</li>
                    <li className="flex gap-2"><span>✅</span> <strong>Working Capital:</strong> 1-3 months of common charges</li>
                    <li className="flex gap-2"><span>✅</span> <strong>Managing Agent:</strong> Transfer processing (~$1k)</li>
                </ul>
            </div>
            <div className="p-8 rounded-3xl border border-border bg-card">
                <h3 className="text-xl font-bold mb-4">🏢 Co-op Closing Fees</h3>
                <ul className="space-y-3 text-sm text-muted-foreground list-none p-0">
                    <li className="flex gap-2"><span>✅</span> <strong>UCC-1 Filing:</strong> Financing statement ($100 - $250)</li>
                    <li className="flex gap-2"><span>✅</span> <strong>Board Fees:</strong> Application fees ($500 - $1,500)</li>
                    <li className="flex gap-2"><span>✅</span> <strong>Recognition Fee:</strong> Building's lender acknowledgement</li>
                </ul>
            </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Closing Cost Sample Scenarios</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border">
                <h4 className="font-bold mb-4">$750,000 Co-op (20% Down)</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Attorney Fee</span> <span>$3,000</span></div>
                    <div className="flex justify-between"><span>Mortgage Tax</span> <span>$0 (Exempt)</span></div>
                    <div className="flex justify-between"><span>Bank Fees</span> <span>$4,000</span></div>
                    <div className="border-t pt-2 flex justify-between font-bold"><span>Total Estimate</span> <span>~$9,500</span></div>
                </div>
            </div>
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                <h4 className="font-bold mb-4">$1.5M Condo (20% Down)</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Mortgage Tax</span> <span>$23,100</span></div>
                    <div className="flex justify-between"><span>Mansion Tax (1.25%)</span> <span>$18,750</span></div>
                    <div className="flex justify-between"><span>Title Insurance</span> <span>$3,500</span></div>
                    <div className="border-t pt-2 flex justify-between font-bold"><span>Total Estimate</span> <span>~$60,850</span></div>
                </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Final Advice</h2>
            <p className="leading-relaxed">
                Ask your attorney for a closing cost estimate <strong>before you sign the contract</strong> — not after. A good attorney will give you a line-by-line breakdown based on your specific purchase. If they can&apos;t do this, find a different attorney.
            </p>
            <p className="mt-4 leading-relaxed">
                And always hold a 10–15% buffer above your estimate. Closing costs have a way of expanding slightly between contract signing and the actual closing table.
            </p>
        </section>

        <hr className="my-16 border-border" />

        <section id="faq" className="scroll-mt-20 mb-12">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-12">NYC Real Estate FAQs</h2>
          <div className="grid gap-6">
            {faq.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <h4 className="text-lg font-bold text-foreground mb-3">{item.question}</h4>
                <p className="m-0 text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-20 p-10 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-[2rem] text-center">
          <h2 className="text-3xl font-bold mb-4">Estimate Your Taxes Instantly</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            Planning your NYC real estate move? Use our professional calculator to get exact RPTT and Mansion tax figures.
          </p>
          <Link 
            href="/real-estate/nyc-transfer-tax-calculator" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
          >
            Calculate Transfer Taxes →
          </Link>
        </div>
      </div>
    </div>
  );
}
