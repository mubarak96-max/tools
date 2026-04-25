import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/halal-mortgage-structure-comparison";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Diminishing Musharakah vs Murabaha vs Ijara: Halal Mortgage Guide 2026",
  description: "Compare Diminishing Musharakah, Murabaha, and Ijara side-by-side with real numbers. See which Sharia-compliant mortgage structure costs less for your home purchase.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Diminishing Musharakah vs Murabaha vs Ijara: Which Structure Saves You Money?",
    description: "Choosing a Sharia-compliant mortgage? Learn the cost differences between Musharakah, Murabaha, and Ijara in our 2026 guide.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Is Diminishing Musharakah better than Murabaha?",
    answer: "Not universally. Diminishing Musharakah is better for long-term residential ownership where you want payments to decrease. Murabaha is better for shorter-term certainty and simple transactions where a fixed markup is preferred.",
  },
  {
    question: "Why do Murabaha and Musharakah monthly payments look similar?",
    answer: "Islamic banks benchmark profit rates against conventional mortgage rates (like SONIA or Base Rate) to remain competitive. The numeric rate may look similar, but the contractual basis is fundamentally different—partnership vs. sale.",
  },
  {
    question: "Can I switch from one halal mortgage structure to another?",
    answer: "Generally no. Switching requires a full refinance, which involves a new contract, new property valuation, and legal fees. You are essentially 'remortgaging' from one Sharia-compliant product to another.",
  },
  {
    question: "Which halal mortgage structure is most common in the UK?",
    answer: "Diminishing Musharakah is the standard for residential purchases in the UK, offered by major providers like Al Rayan Bank and Gatehouse Bank. Ijara is more common for Buy-to-Let investments.",
  },
];

export default function HalalMortgageComparisonBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Halal Mortgage Structure Comparison", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Islamic Finance</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-wider">
            Finance · Halal Mortgage
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Diminishing Musharakah vs Murabaha vs Ijara: Which Saves You Money?
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Compare Sharia-compliant mortgage structures side-by-side to find the most cost-effective path to home ownership in 2026.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>Last updated: April 25, 2026</span>
            <span>•</span>
            <span>9 min read</span>
          </div>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <p className="leading-relaxed text-lg">
            Choosing a <strong>Sharia-compliant mortgage</strong> isn&apos;t just about avoiding interest (riba). It&apos;s about picking the right <strong>Islamic home finance structure</strong> for your situation—and understanding what it will actually cost you over 10, 15, or 25 years.
          </p>
          <p className="mt-4 leading-relaxed">
            If you&apos;ve searched for <strong>&quot;which halal mortgage is cheapest&quot;</strong> or <strong>&quot;Musharakah vs Murabaha monthly payments,&quot;</strong> you&apos;re not alone. Most Muslim homebuyers in the UK and UAE face the same confusion. The three main structures—<strong>Diminishing Musharakah</strong>, <strong>Murabaha</strong>, and <strong>Ijara wa Iqtina</strong>—all avoid riba, but they calculate costs differently.
          </p>
          <p className="mt-4 leading-relaxed">
            This guide breaks down each structure with real-world numbers, then shows you how to compare them instantly using a <Link href="/finance/halal-mortgage-calculator" className="text-primary font-bold underline">Halal Mortgage Calculator</Link>.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">What Are the Three Types of Halal Mortgages?</h2>
          <p className="leading-relaxed">
            Islamic banks do not lend money for profit. Instead, they use <strong>asset-based transactions</strong> approved by a Sharia Supervisory Board. Each structure creates a different legal relationship between you and the bank.
          </p>
          <div className="overflow-x-auto mt-8">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left uppercase text-xs font-bold text-muted-foreground">
                <tr>
                  <th className="py-3 px-2">Structure</th>
                  <th className="py-3 px-2">Legal Relationship</th>
                  <th className="py-3 px-2">How the Bank Earns</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-4 px-2 font-bold text-slate-900">Diminishing Musharakah</td>
                  <td className="py-4 px-2 text-slate-600">Co-ownership (partnership)</td>
                  <td className="py-4 px-2 text-slate-600">Rent on the bank&apos;s share + buyout instalments</td>
                </tr>
                <tr>
                  <td className="py-4 px-2 font-bold text-slate-900">Murabaha</td>
                  <td className="py-4 px-2 text-slate-600">Buyer and seller</td>
                  <td className="py-4 px-2 text-slate-600">Fixed profit markup on the sale price</td>
                </tr>
                <tr>
                  <td className="py-4 px-2 font-bold text-slate-900">Ijara wa Iqtina</td>
                  <td className="py-4 px-2 text-slate-600">Landlord and tenant</td>
                  <td className="py-4 px-2 text-slate-600">Monthly rent + capital contributions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-border">
          <h2 className="text-3xl font-bold mb-4">Diminishing Musharakah Explained</h2>
          <p className="leading-relaxed mb-6">
            <strong>Diminishing Musharakah</strong> (also called Diminishing Partnership) is the most common <strong>Islamic mortgage structure in the UK</strong> and UAE.
          </p>
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">How It Works</h3>
              <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                <li>You and the bank <strong>co-own the property</strong>.</li>
                <li>You pay <strong>Rent</strong> on the bank&apos;s share.</li>
                <li>You pay <strong>Buyout instalments</strong> to increase your share.</li>
                <li>The <strong>rent portion shrinks</strong> as your ownership grows.</li>
              </ol>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="font-bold mb-3 text-emerald-600 text-sm uppercase tracking-wider">Example: £350k Property</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Deposit (20%)</span> <span className="font-bold">£70,000</span></div>
                <div className="flex justify-between"><span>Bank Share</span> <span className="font-bold">£280,000</span></div>
                <div className="flex justify-between border-t pt-2"><span>Initial Payment</span> <span className="font-bold">~£1,890</span></div>
                <div className="flex justify-between"><span>Final Payment</span> <span className="font-bold">~£1,240</span></div>
              </div>
            </div>
          </div>
          <p className="leading-relaxed text-sm italic text-muted-foreground">
            The payment decreases over time because you&apos;re renting an ever-smaller share from the bank.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Murabaha: Fixed Price Certainty</h2>
          <p className="leading-relaxed">
            <strong>Murabaha</strong> is a <strong>cost-plus financing</strong> structure. The bank buys the property outright, marks up the price by a fixed profit margin, and sells it to you in instalments.
          </p>
          <div className="my-8 p-6 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r-2xl">
            <h3 className="font-bold mb-2">Key Difference: No Declining Balance</h3>
            <p className="leading-relaxed text-sm">
              Unlike Diminishing Musharakah, the <strong>profit is a flat markup</strong> calculated at the start. You do not benefit from reducing rent as your equity grows. On <strong>shorter terms (5–15 years)</strong>, this can be competitive, but on 30-year terms, it is often more expensive.
            </p>
          </div>
          <h3 className="text-xl font-bold mb-4 italic">Best For:</h3>
          <ul className="grid gap-2 md:grid-cols-3 list-none p-0">
            <li className="flex gap-2 text-sm"><span>✅</span> Absolute payment certainty</li>
            <li className="flex gap-2 text-sm"><span>✅</span> Shorter terms (5-15 years)</li>
            <li className="flex gap-2 text-sm"><span>✅</span> New build purchases</li>
          </ul>
        </section>

        <section className="mb-12 border-t border-border pt-12">
          <h2 className="text-3xl font-bold mb-6">Ijara wa Iqtina (Lease to Own)</h2>
          <p className="leading-relaxed">
            <strong>Ijara wa Iqtina</strong> combines a <strong>lease (Ijara)</strong> with a <strong>forward purchase undertaking</strong>. It is particularly common for Buy-to-Let investors and residents in the GCC region.
          </p>
          <p className="mt-4 leading-relaxed">
            Structurally, Ijara produces <strong>identical total costs to Diminishing Musharakah</strong> when using the same amortising formula. The primary difference is legal: the bank retains full ownership until the final transfer, rather than sharing legal title with you.
          </p>
        </section>

        <section className="mb-12 bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Side-by-Side Comparison</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <h4 className="font-bold text-emerald-400 mb-2">Musharakah</h4>
              <p className="text-xs text-slate-300 uppercase font-bold tracking-widest mb-4">Residential Standard</p>
              <ul className="text-sm space-y-2 list-none p-0">
                <li className="flex gap-2"><span>📉</span> Payment decreases</li>
                <li className="flex gap-2"><span>🤝</span> Gradual co-ownership</li>
                <li className="flex gap-2"><span>🏠</span> Best for 15-30 years</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <h4 className="font-bold text-blue-400 mb-2">Murabaha</h4>
              <p className="text-xs text-slate-300 uppercase font-bold tracking-widest mb-4">Fixed Certainty</p>
              <ul className="text-sm space-y-2 list-none p-0">
                <li className="flex gap-2"><span>📊</span> Fixed monthly payment</li>
                <li className="flex gap-2"><span>📦</span> Cost + Markup model</li>
                <li className="flex gap-2"><span>⏳</span> Best for 5-15 years</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <h4 className="font-bold text-violet-400 mb-2">Ijara</h4>
              <p className="text-xs text-slate-300 uppercase font-bold tracking-widest mb-4">BTL / GCC Choice</p>
              <ul className="text-sm space-y-2 list-none p-0">
                <li className="flex gap-2"><span>🏢</span> Landlord/Tenant legal</li>
                <li className="flex gap-2"><span>📈</span> Full ownership at end</li>
                <li className="flex gap-2"><span>💼</span> Best for Investors</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Which Halal Mortgage Is Cheapest?</h2>
          <p className="leading-relaxed">
            The honest answer: <strong>it depends on your term and deposit.</strong>
          </p>
          <ul className="mt-6 space-y-4 list-none p-0">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center font-bold">1</span>
              <span>For <strong>15-year terms</strong>, Murabaha&apos;s fixed markup often produces the lowest total cost.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center font-bold">2</span>
              <span>For <strong>25-year terms</strong>, Diminishing Musharakah typically costs less in total as the rent base shrinks.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center font-bold">3</span>
              <span>For <strong>buy-to-let</strong>, Ijara is often the most competitive and widely available structure.</span>
            </li>
          </ul>
        </section>

        <hr className="my-16 border-border" />

        <section id="faq" className="scroll-mt-20 mb-12">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-12">Halal Mortgage FAQs</h2>
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
          <h2 className="text-3xl font-bold mb-4">Run the Math for Your Situation</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            Don&apos;t guess your costs. Use our Sharia-compliant calculator to model all three structures with your exact deposit and property price.
          </p>
          <Link 
            href="/finance/halal-mortgage-calculator" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
          >
            Calculate Halal Mortgage Costs →
          </Link>
        </div>
      </div>
    </div>
  );
}
