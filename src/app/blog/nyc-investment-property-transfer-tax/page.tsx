import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/nyc-investment-property-transfer-tax";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "NYC Transfer Tax on Investment Properties (2026) | FindBest Tools",
  description: "Investing in NYC real estate? Learn about commercial RPTT rates, 1031 exchanges, controlling interest transfers, and the 4-unit threshold in our 2026 guide.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "NYC Transfer Tax on Investment Properties: What Investors Need to Know",
    description: "Navigate high-value NYC real estate taxes: commercial RPTT, entity transfers, and the full tax stack for property investors in 2026.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "What is the NYC RPTT rate for commercial properties?",
    answer: "For commercial properties, mixed-use buildings, and residential properties with 4 or more units, the NYC RPTT rate is 1.425% for sales under $500,000 and 2.625% for sales of $500,000 or more.",
  },
  {
    question: "Does a 1031 exchange eliminate NYC transfer taxes?",
    answer: "No. A Section 1031 exchange allows you to defer federal capital gains tax, but it does not exempt you from NYC RPTT or NYS transfer taxes. These are transaction taxes due at the time of the transfer.",
  },
  {
    question: "What is a 'controlling interest' transfer in NYC?",
    answer: "A controlling interest transfer occurs when 50% or more of the ownership interest in an entity (like an LLC) that owns real property is transferred. NYC taxes these transfers as if the real estate itself were sold directly.",
  },
  {
    question: "Are residential buildings with 4 units taxed differently?",
    answer: "Yes. In NYC, residential buildings with 1-3 units are taxed at residential RPTT rates. Buildings with 4 or more units are categorized as 'all other' and subject to the higher commercial RPTT rates.",
  },
];

export default function NycInvestmentTransferTaxBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Investment Property Transfer Tax NYC", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Investment Property</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-500/10 text-slate-600 text-xs font-bold uppercase tracking-wider">
            Finance · Portfolio Strategy
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            NYC Transfer Tax on Investment Properties: What Investors Need to Know (2026)
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            From the 4-unit residential threshold to controlling interest transfers: A professional guide to navigating the high-end NYC tax landscape.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>Last updated: April 2026</span>
            <span>•</span>
            <span>11 min read</span>
          </div>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <p className="leading-relaxed">
            Residential buyers worry about the Mansion Tax. Sellers worry about RPTT. But investors — especially those dealing in commercial properties, multi-family buildings, and high-value portfolios — face a tax picture that&apos;s considerably more complex, and considerably more expensive.
          </p>
          <p className="mt-4 leading-relaxed">
            The NYC transfer tax rate for commercial and &quot;other&quot; property types tops out at 2.625%. On a $10 million office building, that&apos;s $262,500 in city transfer tax alone before New York State gets involved.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The Investor&apos;s Rate Table</h2>
          <p className="leading-relaxed mb-6">
            NYC RPTT has a two-tier rate structure based on property type. For investors, the distinction between residential and commercial is critical:
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
                <tr><td className="py-3 px-2">1–3 Family Residential, Condo, Co-op</td><td className="py-3 px-2">1.000%</td><td className="py-3 px-2">1.425%</td></tr>
                <tr><td className="py-3 px-2 font-bold text-primary">All Other (Commercial, 4+ Units)</td><td className="py-3 px-2">1.425%</td><td className="py-3 px-2 font-bold">2.625%</td></tr>
              </tbody>
            </table>
          </div>
          <p className="leading-relaxed">
            &quot;All other&quot; covers office buildings, retail, mixed-use, and critically, <strong>residential buildings with 4 or more units</strong>. A 6-unit brownstone is taxed at commercial rates.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Plan Your Transaction</h2>
          <div className="p-8 bg-slate-900 text-white rounded-[2rem] text-center shadow-2xl border border-white/5">
              <h4 className="text-2xl font-black mb-4">NYC Transfer Tax Model</h4>
              <p className="text-slate-400 mb-8 max-w-sm mx-auto text-sm">Run specific price and property type scenarios to project your closing tax bill.</p>
              <Link href="/real-estate/nyc-transfer-tax-calculator" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform">
                Open Investment Calculator →
              </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">LLC Transfers and Controlling Interests</h2>
          <p className="leading-relaxed">
            Many investors try to avoid RPTT by selling the LLC that owns the property. However, New York mandates that when you transfer a <strong>&quot;controlling interest&quot; (50% or more)</strong> in an entity owning NYC real property, it is subject to RPTT as if the property itself were sold.
          </p>
          <p className="mt-4 leading-relaxed font-semibold italic text-slate-500">
            Entity structure doesn&apos;t automatically bypass the tax. Careful legal planning is essential to manage these transfers correctly.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">1031 Exchanges and Transfer Tax</h2>
          <p className="leading-relaxed">
            While a Section 1031 exchange defers federal capital gains tax, it **does not** eliminate NYC or NYS transfer taxes. These are transaction taxes due at the time of the transfer, regardless of gain deferral.
          </p>
          <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 flex gap-4 items-start">
              <span className="text-2xl">💡</span>
              <p className="text-sm leading-relaxed text-blue-900 dark:text-blue-300 m-0">
                  <strong>Net Proceeds Tip:</strong> Model outbound transfer taxes and potential inbound taxes (on sponsor sales) early to ensure your exchange remains fully funded.
              </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The Multi-Family &quot;4-Unit&quot; Trap</h2>
          <p className="leading-relaxed">
            Buildings with 4 or more residential units trigger commercial rates.
          </p>
          <div className="grid gap-4 mt-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl">
                    <span className="text-sm font-medium">3-Family Sale ($2,000,000)</span>
                    <span className="font-bold text-success">$28,500 Tax</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl">
                    <span className="text-sm font-medium">4-Family Sale ($2,000,000)</span>
                    <span className="font-bold text-red-500">$52,500 Tax</span>
                </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground text-center">That&apos;s a $24,000 difference for just one additional unit.</p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">The NYC Investor Tax Stack</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs uppercase font-bold text-muted-foreground">
                <tr><th className="py-3 px-4 text-left">Tax Layer</th><th className="py-3 px-4 text-right">Approx. Rate</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="py-3 px-4">Federal Long-Term Gain</td><td className="py-3 px-4 text-right font-bold">15% - 20%</td></tr>
                <tr><td className="py-3 px-4">Depreciation Recapture</td><td className="py-3 px-4 text-right font-bold">25% (Fed)</td></tr>
                <tr><td className="py-3 px-4">NYS Income Tax</td><td className="py-3 px-4 text-right font-bold">Up to 10.9%</td></tr>
                <tr><td className="py-3 px-4">NYC RPTT (Commercial)</td><td className="py-3 px-4 text-right font-bold text-primary">2.625%</td></tr>
                <tr><td className="py-3 px-4">NYS Transfer Tax</td><td className="py-3 px-4 text-right font-bold text-primary">0.65%</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr className="my-16 border-border" />

        <section id="faq" className="scroll-mt-20 mb-12">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-12">Investor FAQ</h2>
          <div className="grid gap-6">
            {faq.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <h4 className="text-lg font-bold text-foreground mb-3">{item.question}</h4>
                <p className="m-0 text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-20 p-10 bg-gradient-to-br from-slate-500/10 to-transparent border border-slate-500/20 rounded-[2rem] text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Run the Numbers?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            Ensure your pro forma is accurate by calculating your exact transfer tax liabilities before making a move.
          </p>
          <Link 
            href="/real-estate/nyc-transfer-tax-calculator" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20"
          >
            Access Investment Tax Calculator →
          </Link>
        </div>
      </div>
    </div>
  );
}
