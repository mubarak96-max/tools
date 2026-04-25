import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/first-time-buyer-halal-mortgage-guide-uk";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "First-Time Buyer Guide to Halal Mortgages UK (2026) | FindBest Tools",
  description: "A complete step-by-step guide for first-time buyers seeking Sharia-compliant home finance in the UK. Learn deposit requirements and how it works.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "First-Time Buyer's Guide to Halal Mortgages in the UK",
    description: "Navigate the journey from deposit to ownership without riba. Our 2026 guide covers everything first-time buyers need to know.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Can I get a halal mortgage with a 5% deposit?",
    answer: "Rarely in the UK. Most Islamic banks require a minimum 10% deposit, with 15–20% being standard. Government schemes like 'Help to Buy' are not always directly compatible with Sharia structures.",
  },
  {
    question: "How much can I borrow on an Islamic mortgage?",
    answer: "Islamic banks are generally more conservative, typically capping borrowing at 3.5x–4.5x your annual income. They also stress-test affordability against potential rate increases in the rental component.",
  },
  {
    question: "How long does the application process take?",
    answer: "Typically 6–12 weeks. The process can take slightly longer than conventional mortgages due to the Sharia review and dual legal representation required for co-ownership structures.",
  },
  {
    question: "Can non-Muslims apply for an Islamic home purchase plan?",
    answer: "Yes. Islamic finance is open to everyone. Some non-Muslims choose it for ethical reasons or for the payment certainty provided by the Murabaha structure.",
  },
];

export default function FirstTimeBuyerHalalMortgageBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "First-Time Buyer Halal Mortgage Guide UK", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Buying Your First Home</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            Guide · First-Time Buyer
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            First-Time Buyer&apos;s Guide to Halal Home Finance: From Deposit to Ownership Without Riba
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Everything you need to know about starting your home ownership journey with Sharia-compliant finance in the UK.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>Last updated: April 25, 2026</span>
            <span>•</span>
            <span>12 min read</span>
          </div>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <p className="leading-relaxed text-lg">
            Buying your first home is already stressful. Add the requirement for <strong>Sharia-compliant finance</strong>, and the process can feel overwhelming.
          </p>
          <p className="mt-4 leading-relaxed">
            If you&apos;ve searched for <strong>&quot;how do halal mortgages work for first-time buyers&quot;</strong> or <strong>&quot;Islamic mortgage deposit requirements UK,&quot;</strong> this guide is for you. We&apos;ll walk through every stage—from saving your deposit to holding the keys—using the <strong>Diminishing Musharakah</strong> structure most common in the UK.
          </p>
          <p className="mt-4 leading-relaxed">
            By the end, you&apos;ll know exactly what Islamic banks like <strong>Al Rayan Bank</strong> and <strong>Gatehouse Bank</strong> require, how affordability checks differ, and how to use a <Link href="/finance/halal-mortgage-calculator" className="text-primary font-bold underline">Halal Mortgage Calculator</Link> to plan your budget.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Step 1: Understanding Deposit Requirements</h2>
          <p className="leading-relaxed">
            Islamic mortgage providers in the UK typically require <strong>higher deposits</strong> than conventional products to account for regulatory capital requirements.
          </p>
          <div className="overflow-x-auto mt-8">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left uppercase text-xs font-bold text-muted-foreground">
                <tr>
                  <th className="py-3 px-2">Product Type</th>
                  <th className="py-3 px-2">Min Deposit</th>
                  <th className="py-3 px-2">Max LTV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="py-4 px-2 font-bold">Residential Musharakah</td><td className="py-4 px-2">10 – 20%</td><td className="py-4 px-2 text-slate-600">80 – 90%</td></tr>
                <tr><td className="py-4 px-2 font-bold">Residential Murabaha</td><td className="py-4 px-2">15 – 25%</td><td className="py-4 px-2 text-slate-600">75 – 85%</td></tr>
                <tr><td className="py-4 px-2 font-bold">Buy-to-Let Ijara</td><td className="py-4 px-2">25 – 40%</td><td className="py-4 px-2 text-slate-600">60 – 75%</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-border">
          <h2 className="text-3xl font-bold mb-6">Step 2: Sharia-Compliant Affordability</h2>
          <p className="leading-relaxed mb-6">
            Islamic banks are generally <strong>more conservative</strong> than conventional lenders. They assess your &quot;Rent&quot; component against potential rate increases.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border">
              <h3 className="font-bold mb-2">Income Multiples</h3>
              <p className="text-sm text-slate-600">While conventional lenders may offer 4.5x–5x income, Islamic banks typically cap at <strong>3.5x–4.5x</strong>.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border">
              <h3 className="font-bold mb-2">Stress Testing</h3>
              <p className="text-sm text-slate-600">Banks test if you can still afford payments if the BoE base rate rises by 3% or more.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Step 3: The Application Journey</h2>
          <div className="space-y-8">
             <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black">1</div>
                <div>
                   <h3 className="text-xl font-bold mb-1">Agreement in Principle (AIP)</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">Establish your borrowing limit before searching. Valid for 30–90 days.</p>
                </div>
             </div>
             <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black">2</div>
                <div>
                   <h3 className="text-xl font-bold mb-1">Property Search & Offer</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">Make an offer subject to Sharia-compliant finance. Budget for fees and Stamp Duty early.</p>
                </div>
             </div>
             <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black">3</div>
                <div>
                   <h3 className="text-xl font-bold mb-1">Underwriting & Sharia Review</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">Full scrutiny of finances, property valuation, and contract verification by the Sharia Board.</p>
                </div>
             </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Understanding Monthly Payments</h2>
          <div className="p-8 rounded-3xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900">
             <h3 className="font-bold mb-4 text-center">Example: £250k Home with 20% Deposit</h3>
             <div className="grid gap-8 md:grid-cols-3 text-center">
                <div>
                   <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Initial Rent</p>
                   <p className="text-2xl font-black text-indigo-600">£850</p>
                </div>
                <div>
                   <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Buyout Payment</p>
                   <p className="text-2xl font-black text-indigo-600">£500</p>
                </div>
                <div>
                   <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Total Monthly</p>
                   <p className="text-2xl font-black text-indigo-600">£1,350</p>
                </div>
             </div>
             <p className="mt-6 text-center text-sm text-slate-500 italic">As you buy more units, the rent portion decreases each year.</p>
          </div>
        </section>

        <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Ownership & Responsibilities</h2>
            <p className="leading-relaxed">
              In a <strong>Diminishing Musharakah</strong> setup, you are a co-owner. You bear 100% of maintenance costs, benefit from capital appreciation on your share, and have the right to live in the property as long as rent is paid.
            </p>
        </section>

        <hr className="my-16 border-border" />

        <section id="faq" className="scroll-mt-20 mb-12">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-12">First-Time Buyer FAQs</h2>
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
          <h2 className="text-3xl font-bold mb-4">Plan Your First-Time Purchase</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            Establish your budget and model your ownership timeline with our professional halal mortgage tools.
          </p>
          <Link 
            href="/finance/halal-mortgage-calculator" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20"
          >
            Calculate Your Budget →
          </Link>
        </div>
      </div>
    </div>
  );
}
