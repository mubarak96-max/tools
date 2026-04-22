import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/who-pays-transfer-tax-nyc";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Who Pays Transfer Tax in NYC? Seller Closing Costs Explained (2026) | FindBest Tools",
  description: "Selling an apartment in New York? Learn about RPTT, State transfer taxes, and why sponsor sales change the rules. A 2026 guide for NYC sellers.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Who Pays Transfer Tax in NYC? Seller Closing Costs Explained",
    description: "Detailed breakdown of NYC seller closing costs in 2026, focusing on RPTT, NYS Transfer Tax, and the developer 'sponsor' exception.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Who pays transfer tax in NYC: buyer or seller?",
    answer: "In a standard resale transaction, the seller pays both the NYC Real Property Transfer Tax (RPTT) and the New York State Transfer Tax. However, in sponsor sales (new construction), the buyer is frequently contractually required to pay these taxes.",
  },
  {
    question: "How much is the NYC RPTT for residential properties?",
    answer: "For residential properties (1-3 family, condo, co-op), the rate is 1.000% if the purchase price is under $500,000, and 1.425% if the price is $500,000 or more.",
  },
  {
    question: "Do co-ops trigger NYC transfer taxes?",
    answer: "Yes. Since 1989, co-op transfers (shares in a corporation) have been fully subject to the NYC Real Property Transfer Tax, at the same rates as condos and single-family homes.",
  },
  {
    question: "What is a flip tax in NYC?",
    answer: "A flip tax is a fee charged by a co-op building upon the sale of a unit. Unlike government transfer taxes, the flip tax goes directly to the building's reserve fund. It is typically calculated as a percentage of the sale price (1-3%) or per share.",
  },
];

export default function WhoPaysTransferTaxBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Who Pays Transfer Tax NYC", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">NYC Seller Guide</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-wider">
            Finance · Seller Strategy
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Who Pays Transfer Tax in NYC? Seller Closing Costs Explained (2026)
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Customary rules vs. technical reality: A comprehensive breakdown of what NYC sellers actually pay when the keys change hands.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>Last updated: April 2026</span>
            <span>•</span>
            <span>10 min read</span>
          </div>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <p className="leading-relaxed">
            When a New York City real estate deal closes, the question of who pays what doesn&apos;t always follow a simple script. Most costs have a customary answer — but customary isn&apos;t the same as guaranteed, and there are real situations where the usual rules get flipped entirely.
          </p>
          <p className="mt-4 leading-relaxed">
            Transfer taxes are the biggest variable. They can represent $10,000 on a modest sale or well over $100,000 on a high-end transaction. Understanding who&apos;s on the hook, and when that changes, is essential whether you&apos;re selling your first apartment or your tenth investment property.
          </p>
        </section>

        <section className="mb-12 bg-emerald-50/50 dark:bg-emerald-950/10 p-8 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/20">
          <h2 className="text-3xl font-bold mb-6">The Short Answer</h2>
          <p className="leading-relaxed">
            In a standard resale transaction, the <strong>seller pays both the NYC Real Property Transfer Tax (RPTT) and the New York State Transfer Tax</strong>. The buyer pays the Mansion Tax (if applicable) and the Mortgage Recording Tax.
          </p>
          <p className="mt-4 leading-relaxed italic text-emerald-700 dark:text-emerald-400">
            That&apos;s the customary split. But there&apos;s a major exception: new construction sponsor sales.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">NYC Real Property Transfer Tax (RPTT): What Sellers Owe</h2>
          <p className="leading-relaxed mb-6">
            The NYC RPTT is charged on the total consideration paid for the property. The rate depends on the property type and the price:
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left uppercase text-xs font-bold text-muted-foreground">
                <tr>
                  <th className="py-3 px-2 text-slate-900">Property Type</th>
                  <th className="py-3 px-2 text-slate-900">Under $500,000</th>
                  <th className="py-3 px-2 text-slate-900">$500,000 and Above</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="py-3 px-2 font-medium">Residential (1–3 family, condo, co-op)</td><td className="py-3 px-2">1.000%</td><td className="py-3 px-2 font-bold">1.425%</td></tr>
                <tr><td className="py-3 px-2 font-medium">Commercial / Other</td><td className="py-3 px-2">1.425%</td><td className="py-3 px-2 font-bold">2.625%</td></tr>
              </tbody>
            </table>
          </div>
          <p className="leading-relaxed mb-4">
            <strong>The $500,000 threshold is absolute.</strong> At $499,000, a residential seller pays 1%. At $501,000, they pay 1.425% on the entire amount. This sometimes leads to tactical pricing discussions between attorneys during negotiations.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Step 1: Calculate Your Total Tax Bill</h2>
          <p className="leading-relaxed text-center mb-8">
            The fastest way to get exact figures is our interactive calculator.
          </p>
          <div className="p-8 bg-slate-900 text-white rounded-[2rem] text-center shadow-xl">
              <h4 className="text-xl font-bold mb-4">Free NYC Transfer Tax Calculator</h4>
              <p className="text-slate-400 mb-6 text-sm">Estimate NYC RPTT and NYS transfer tax for 2026 instantly.</p>
              <Link href="/real-estate/nyc-transfer-tax-calculator" className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-lg hover:scale-105 transition-transform">
                Open Calculator →
              </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The Big Exception: Sponsor (New Construction) Sales</h2>
          <p className="leading-relaxed">
            In new development buildings, the seller is typically the <strong>sponsor</strong> (the developer). Sponsors routinely include a clause in their purchase agreements requiring the <strong>buyer</strong> to pay the NYC and NYS transfer taxes.
          </p>
          <div className="mt-6 p-6 bg-red-50 dark:bg-red-950/20 border border-red-100 rounded-2xl">
              <h4 className="text-lg font-bold text-red-900 dark:text-red-400 mb-2">The New Construction Penalty</h4>
              <p className="text-sm leading-relaxed text-red-800 dark:text-red-300">
                On a $1,500,000 new construction condo, the 1.825% total transfer taxes (~$27,375) are flipped to the buyer. This is one reason new construction closing costs frequently hit 6% rather than 2-3%.
              </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Net Proceeds Breakdown: Sample Case</h2>
          <p className="mb-8 text-center text-muted-foreground italic text-sm">Selling a $1,100,000 NYC co-op with $600k mortgage payoff.</p>
          <div className="max-w-md mx-auto rounded-3xl border border-border bg-card overflow-hidden">
             <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-b border-border font-bold">Seller Net Proceeds</div>
             <div className="p-6 space-y-3 text-sm">
                <div className="flex justify-between"><span>Sale Price</span> <span className="font-bold">$1,100,000</span></div>
                <div className="flex justify-between text-red-500"><span>Mortgage Payoff</span> <span>($600,000)</span></div>
                <div className="flex justify-between text-red-500"><span>Broker Fee (5.5%)</span> <span>($60,500)</span></div>
                <div className="flex justify-between text-red-500"><span>NYC/NYS Taxes</span> <span>($20,075)</span></div>
                <div className="flex justify-between text-red-500"><span>Flip Tax (2%)</span> <span>($22,000)</span></div>
                <div className="flex justify-between text-red-500"><span>Attorney/Misc</span> <span>($4,000)</span></div>
                <div className="pt-4 border-t border-border flex justify-between font-black text-lg">
                    <span>Estimated Net</span>
                    <span className="text-primary">~$393,425</span>
                </div>
             </div>
          </div>
        </section>

        <section className="mb-12 p-8 bg-muted/30 rounded-[2rem] border border-border">
          <h2 className="text-2xl font-bold mb-6">Timing: When Is the Tax Paid?</h2>
          <p className="leading-relaxed">
            Transfer taxes are due at closing. In practice, <strong>your attorney handles this at the closing table</strong> — the funds come from your sale proceeds directly. You don&apos;t usually write a check in advance, but you do need to mentally subtract these amounts from your proceeds when negotiating and planning what happens after closing.
          </p>
        </section>

        <hr className="my-16 border-border" />

        <section id="faq" className="scroll-mt-20 mb-12">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-12">Seller FAQ</h2>
          <div className="grid gap-6">
            {faq.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <h4 className="text-lg font-bold text-foreground mb-3">{item.question}</h4>
                <p className="m-0 text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-20 p-10 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[2rem] text-center">
          <h2 className="text-3xl font-bold mb-4">Calculate Your Seller Taxes</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            Planning your next move? Get exact NYC RPTT and state tax figures for your sale price instantly.
          </p>
          <Link 
            href="/real-estate/nyc-transfer-tax-calculator" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
          >
            Access Seller Tax Calculator →
          </Link>
        </div>
      </div>
    </div>
  );
}
