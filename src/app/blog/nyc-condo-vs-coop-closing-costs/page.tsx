import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/nyc-condo-vs-coop-closing-costs";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Condo vs. Co-op NYC: Closing Cost & Tax Differences (2026) | FindBest Tools",
  description: "Budgeting for an NYC apartment? Compare condo vs. co-op closing costs, Mortgage Recording Tax exemptions, flip taxes, and Mansion Tax implications for 2026.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Condo vs. Co-op in NYC: How Closing Costs and Transfer Taxes Differ",
    description: "The financial side of the decision: why co-op buyers save $20k+ on closing costs compared to condos, and when a flip tax changes the math.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Which has lower closing costs: condo or co-op in NYC?",
    answer: "Generally, co-ops have significantly lower closing costs (up to $20k-$30k less) because they are exempt from the Mortgage Recording Tax and don't require traditional title insurance.",
  },
  {
    question: "Do co-ops pay Mortgage Recording Tax?",
    answer: "No. Because a co-op purchase is a transfer of shares in a corporation rather than real property, there is no mortgage recorded against real estate, and therefore no Mortgage Recording Tax applies.",
  },
  {
    question: "What is a flip tax in a co-op building?",
    answer: "A flip tax is a fee charged by the co-op corporation upon a sale. It is typically 1-3% of the sale price or a fixed fee per share. It goes to the building's reserve fund rather than the government.",
  },
  {
    question: "Does the NYC Mansion Tax apply to co-ops?",
    answer: "Yes. The Mansion Tax applies equally to residential condos and co-ops on purchases of $1 million or more in New York State.",
  },
];

export default function NycCondoCoopClosingBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "NYC Condo vs Co-op Closing Costs", path: PAGE_PATH },
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
            <li>/</li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Condo vs. Co-op</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            Finance · Property Types
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Condo vs. Co-op in NYC: How Closing Costs and Transfer Taxes Differ
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            The secret math of NYC real estate: why choosing a co-op can save you $20,000 at the closing table—and how a flip tax can take it back.
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
            The condo vs. co-op question is one of the most-Googled real estate topics in New York City. While board approvals and sublet rules get the headlines, the <strong>financial side</strong> of the decision is often where the real impact is felt.
          </p>
          <p className="mt-4 leading-relaxed">
            The closing costs, tax exposure, and the math of buying and selling are meaningfully different between a condo and a co-op — and those differences can add up to tens of thousands of dollars.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Closing Costs: Side-by-Side Comparison</h2>
          <p className="mb-8 italic text-sm text-muted-foreground">Example: Buying at $900,000 with a 20% down payment ($720k loan).</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs uppercase font-bold text-muted-foreground">
                <tr><th className="py-3 px-4 text-left">Estimated Fee</th><th className="py-3 px-4 text-right">Condo</th><th className="py-3 px-4 text-right">Co-op</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="py-3 px-4 font-medium">Mortgage Recording Tax</td><td className="py-3 px-4 text-right font-bold text-red-500">~$13,860</td><td className="py-3 px-4 text-right font-bold text-success">$0</td></tr>
                <tr><td className="py-3 px-4 font-medium">Title Insurance</td><td className="py-3 px-4 text-right font-bold text-red-500">~$2,500</td><td className="py-3 px-4 text-right font-bold text-success">$0 - $500</td></tr>
                <tr><td className="py-3 px-4 font-medium">Attorney Fee</td><td className="py-3 px-4 text-right">$3,500</td><td className="py-3 px-4 text-right">$3,500</td></tr>
                <tr><td className="py-3 px-4 font-medium">Board Application Fees</td><td className="py-3 px-4 text-right">~$1,000</td><td className="py-3 px-4 text-right">~$1,500</td></tr>
                <tr className="bg-slate-50 dark:bg-slate-900/50"><td className="py-3 px-4 font-black">TOTAL ESTIMATE</td><td className="py-3 px-4 text-right font-black">~$27,360</td><td className="py-3 px-4 text-right font-black text-primary">~$12,450</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            At $900k, buying a co-op saves roughly <strong>$15,000+</strong> in upfront costs.
          </p>
        </section>

        <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Calculate Your Specific Taxes</h2>
            <div className="p-8 border border-indigo-100 bg-indigo-50/30 rounded-[2rem] text-center shadow-sm">
                <Link href="/real-estate/nyc-transfer-tax-calculator" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20">
                    Compare Taxes Instantly →
                </Link>
            </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The Mortgage Recording Tax: The Co-op Exemption</h2>
          <p className="leading-relaxed">
            NY State charges a Mortgage Recording Tax of <strong>1.925%</strong> for loans over $500k. Because a co-op purchase is technically shares in a corporation, the tax doesn&apos;t apply.
          </p>
          <div className="mt-6 p-6 border border-slate-100 rounded-2xl bg-slate-50 dark:bg-slate-900">
              <p className="m-0 text-sm leading-relaxed">
                  On a $2M co-op with 20% down ($1.6M mortgage), you save <strong>~$30,800</strong> at closing simply by choosing a co-op over a condo.
              </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Sellers beware: The Flip Tax</h2>
          <p className="leading-relaxed">
            While buyers save in a co-op, sellers often lose some ground back to the &quot;flip tax.&quot; This building-specific fee is typically <strong>1-3% of the gross sale price</strong>.
          </p>
          <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50/10 rounded-r-xl mt-4">
              <p className="m-0 text-sm italic font-medium">Selling a $1.2M co-op with a 2% flip tax? You&apos;ll pay <strong>$24,000</strong> to the building's reserve fund at closing.</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Monthly Carrying Costs: Maintenance vs. Common Charges</h2>
          <p className="leading-relaxed">
            Closing costs are one-time; carrying costs are forever.
          </p>
          <div className="grid gap-6 md:grid-cols-2 mt-8">
              <div className="p-6 bg-card border border-border rounded-3xl">
                  <h4 className="font-bold mb-2">🏢 Co-op Maintenance</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                      Includes building staff, heat, hot water, AND the building's underlying mortgage and property taxes.
                  </p>
              </div>
              <div className="p-6 bg-card border border-border rounded-3xl">
                  <h4 className="font-bold mb-2">🏠 Condo Common Charges</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                      Covers building operations, but you pay real estate taxes directly to the city (or through escrow).
                  </p>
              </div>
          </div>
        </section>

        <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">When to Choose Which?</h2>
            <ul className="space-y-4">
                <li><strong>Choose Co-op if:</strong> You are financing heavily and planning to stay long-term. The closing cost savings are massive.</li>
                <li><strong>Choose Condo if:</strong> You want subletting flexibility, you&apos;re buying as an investor, or you are an all-cash buyer (where the mortgage tax advantage is moot).</li>
            </ul>
        </section>

        <hr className="my-16 border-border" />

        <section id="faq" className="scroll-mt-20 mb-12">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-12">Finance Focused FAQ</h2>
          <div className="grid gap-6">
            {faq.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <h4 className="text-lg font-bold text-foreground mb-3">{item.question}</h4>
                <p className="m-0 text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-20 p-10 bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-[2rem] text-center">
          <h2 className="text-3xl font-bold mb-4">Model Your Next Purchase</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            Toggle between Condo and Co-op settings to see the tax breakdown side-by-side.
          </p>
          <Link 
            href="/real-estate/nyc-transfer-tax-calculator" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20"
          >
            Access Comparison Calculator →
          </Link>
        </div>
      </div>
    </div>
  );
}
