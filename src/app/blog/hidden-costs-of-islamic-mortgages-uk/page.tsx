import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/hidden-costs-of-islamic-mortgages-uk";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Hidden Costs of Islamic Mortgages UK: 2026 Fee Guide | FindBest Tools",
  description: "Uncover the true costs of halal mortgages in the UK. From arrangement fees to early settlement charges, learn what Islamic home finance really costs.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "The 'Hidden' Costs of Islamic Mortgages: What UK Lenders Don't Tell You",
    description: "Budgeting for a Sharia-compliant home? Discover the fees, taxes, and structural costs that impact your total halal mortgage outlay.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Are Islamic mortgages more expensive than conventional mortgages?",
    answer: "Sometimes. While profit rates are often benchmarked to market rates (like SONIA), upfront fees can be higher due to specialized legal work and Sharia audits. Over 25 years, the total cost may be 1–4% higher, though the gap is narrowing.",
  },
  {
    question: "Do Islamic banks charge compound interest?",
    answer: "No. Sharia boards strictly prohibit compounding. Late payment penalties are usually structured as charitable donations to avoid interest-like gain. However, always review your Key Facts Illustration (KFI) for specific fee details.",
  },
  {
    question: "Who pays for repairs in a Diminishing Musharakah structure?",
    answer: "In a Diminishing Musharakah (partnership), you are typically responsible for 100% of maintenance and repair costs from day one, even though you co-own the property with the bank. This is a key structural point to budget for.",
  },
  {
    question: "Can I negotiate Islamic mortgage arrangement fees?",
    answer: "Arrangement fees are sometimes negotiable, particularly for high-deposit buyers (40% LTV or more). Using a broker can help you compare and negotiate across providers like Al Rayan, Gatehouse, and Ahli United.",
  },
];

export default function HiddenCostsIslamicMortgageBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Hidden Costs of Islamic Mortgages UK", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">UK Real Estate</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold uppercase tracking-wider">
            Finance · UK Mortgage
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            The &quot;Hidden&quot; Costs of Islamic Mortgages: What UK Providers Don&apos;t Put on the Front Page
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Arrangement fees, valuation costs, and early exit charges—uncover the true price of Sharia-compliant home finance in 2026.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>Last updated: April 25, 2026</span>
            <span>•</span>
            <span>10 min read</span>
          </div>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <p className="leading-relaxed text-lg">
            If you&apos;re comparing <strong>halal mortgages in the UK</strong>, you&apos;ve probably focused on the monthly payment and the &quot;profit rate.&quot; That&apos;s natural—it&apos;s the biggest number on every Islamic bank&apos;s website.
          </p>
          <p className="mt-4 leading-relaxed">
            But here&apos;s what most <strong>Sharia-compliant mortgage calculators</strong> won&apos;t show you: the <strong>fees, charges, and structural costs</strong> that add thousands to your total outlay before you ever pick up the keys.
          </p>
          <p className="mt-4 leading-relaxed p-6 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-2xl italic">
            This guide pulls back the curtain on the <strong>true cost of Islamic home finance</strong> in the UK. Whether you&apos;re looking at <strong>Al Rayan Bank</strong>, <strong>Gatehouse Bank</strong>, or <strong>HSBC Amanah</strong>, these are the line items you need to budget for.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">1. Arrangement and Administration Fees</h2>
          <p className="leading-relaxed">
            Every <strong>Islamic mortgage provider in the UK</strong> charges upfront fees. These vary by structure and lender, but they can be significantly higher than conventional products due to the specialized legal work required.
          </p>
          <div className="overflow-x-auto mt-8">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left uppercase text-xs font-bold text-muted-foreground">
                <tr>
                  <th className="py-3 px-2">Fee Type</th>
                  <th className="py-3 px-2">Typical Cost</th>
                  <th className="py-3 px-2">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-4 px-2 font-bold">Arrangement fee</td>
                  <td className="py-4 px-2">£0 – £1,999</td>
                  <td className="py-4 px-2 text-slate-600">Often higher for buy-to-let Islamic products</td>
                </tr>
                <tr>
                  <td className="py-4 px-2 font-bold">Booking/Reservation</td>
                  <td className="py-4 px-2">£99 – £499</td>
                  <td className="py-4 px-2 text-slate-600">Deducted from arrangement fee at completion</td>
                </tr>
                <tr>
                  <td className="py-4 px-2 font-bold">Sharia audit fee</td>
                  <td className="py-4 px-2">£100 – £300</td>
                  <td className="py-4 px-2 text-slate-600">Unique to Islamic finance; covers Sharia board review</td>
                </tr>
                <tr>
                  <td className="py-4 px-2 font-bold">Bank&apos;s Legal fees</td>
                  <td className="py-4 px-2">£500 – £1,200</td>
                  <td className="py-4 px-2 text-slate-600">You typically pay both your and the bank&apos;s legal costs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-border">
          <h2 className="text-3xl font-bold mb-6">2. Early Settlement and Exit Charges</h2>
          <p className="leading-relaxed mb-6">
            This is where <strong>Islamic mortgage costs</strong> diverge most sharply from conventional loans. The structure matters significantly.
          </p>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border">
              <h3 className="font-bold mb-3 text-emerald-600">Musharakah Early Exit</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                In a partnership, you buy out the bank&apos;s remaining share. If property values have risen, you may pay <strong>more</strong> to buy out the share than originally agreed, depending on your contract&apos;s revaluation clause.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border">
              <h3 className="font-bold mb-3 text-blue-600">Murabaha Settlement</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Because profit is fixed at the start, some Murabaha contracts may <strong>not rebate future profit</strong> if you settle early, meaning you pay the full 25-year profit even if you finish in year 5.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">3. Stamp Duty Land Tax (SDLT)</h2>
          <p className="leading-relaxed">
            Before 2003, Islamic mortgages triggered <strong>double Stamp Duty</strong>—once for the bank&apos;s purchase and once for yours. Today, that is abolished, but nuances remain.
          </p>
          <ul className="mt-6 space-y-4 list-none p-0">
            <li className="flex gap-3 items-start">
              <span className="mt-1 text-emerald-500">✔</span>
              <span><strong>SDLT Exemption:</strong> Major structures are exempt from double taxation under the Finance Act 2003.</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="mt-1 text-emerald-500">✔</span>
              <span><strong>BTL Surcharge:</strong> Buy-to-let Islamic mortgages still attract the 3% SDLT surcharge.</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="mt-1 text-emerald-500">✔</span>
              <span><strong>Timing:</strong> For Ijara, SDLT is often paid at the point of initial occupancy, though legal title remains with the bank.</span>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">True Cost Summary: A Realistic Budget</h2>
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900 text-white shadow-xl">
             <p className="text-xs text-white/50 uppercase tracking-[0.2em] mb-6 font-bold">Estimated Outlay for £300k Property</p>
             <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-2"><span>Monthly payments (25y)</span> <span className="font-bold">~£418,000</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span>Upfront fees</span> <span className="font-bold">£2,500 – £4,000</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span>Valuation and legal</span> <span className="font-bold">£1,000 – £2,500</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span>Insurance (25y)</span> <span className="font-bold">£8,000 – £15,000</span></div>
                <div className="flex justify-between pt-4 text-emerald-400">
                  <span className="font-black text-lg uppercase tracking-tighter">Total Realistic Cost</span>
                  <span className="font-black text-xl">£450k+</span>
                </div>
             </div>
          </div>
        </section>

        <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">How to Minimize Costs</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-6 rounded-2xl border border-border">
                <p className="font-bold mb-2">Request Total Cost of Ownership</p>
                <p className="text-sm text-muted-foreground">Don&apos;t just look at the monthly rental rate. Ask for a full breakdown including all administrative fees over the term.</p>
              </div>
              <div className="p-6 rounded-2xl border border-border">
                <p className="font-bold mb-2">Use an Islamic Mortgage Broker</p>
                <p className="text-sm text-muted-foreground">Brokers can access specialized products and compare early settlement terms across all UK providers.</p>
              </div>
            </div>
        </section>

        <hr className="my-16 border-border" />

        <section id="faq" className="scroll-mt-20 mb-12">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-12">Cost & Fee FAQs</h2>
          <div className="grid gap-6">
            {faq.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <h4 className="text-lg font-bold text-foreground mb-3">{item.question}</h4>
                <p className="m-0 text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-20 p-10 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-[2rem] text-center">
          <h2 className="text-3xl font-bold mb-4">Start with the Core Numbers</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            Use the Halal Mortgage Calculator to model your base payments, then factor in the fees and charges discussed in this guide.
          </p>
          <Link 
            href="/finance/halal-mortgage-calculator" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20"
          >
            Calculate Core Payments →
          </Link>
        </div>
      </div>
    </div>
  );
}
