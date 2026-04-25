import type { Metadata } from "next";
import Link from "next/link";
import HalalMortgageCalculator from "./components/HalalMortgageCalculator";
import { buildMetadata } from "@/lib/seo/metadata";

const PAGE_PATH = "/finance/halal-mortgage-calculator";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Halal Mortgage Calculator | Sharia-Compliant Home Finance Master Guide",
    description: "Compare Halal home finance structures: Diminishing Musharakah, Murabaha, and Ijara. Instant monthly payments and full schedules for Sharia-compliant home buying.",
    path: PAGE_PATH,
  }),
  keywords: [
    "halal mortgage calculator",
    "islamic mortgage calculator",
    "sharia compliant mortgage",
    "diminishing musharakah calculator",
    "murabaha calculator",
    "ijara mortgage",
    "halal home finance UK",
  ],
};

const STRUCTURES = [
  {
    id: "musharakah",
    name: "Diminishing Musharakah",
    arabicName: "المشاركة المتناقصة",
    badge: "Most common in UK & UAE",
    badgeColor: "bg-emerald-100 text-emerald-800",
    summary:
      "You and the bank co-own the property from the date of purchase. Each month you make two payments: rent on the bank's share of the property, and a fixed buyout instalment that transfers a portion of the bank's ownership to you. As your equity stake grows, the rent portion decreases because you're renting a smaller share. By the end of the term, you own 100% of the property outright.",
    howItWorks: [
      "Bank and customer enter a Shirkat ul Milk (joint ownership) agreement",
      "Customer pays monthly rent (Ijara) on the bank's share",
      "Customer also pays a fixed instalment to buy out the bank's units of ownership",
      "As ownership units transfer, the rental base shrinks each year",
      "Full ownership transfers when all units are purchased",
    ],
    bestFor: "First-time buyers, residential purchases, remortgages",
    lenders: "Al Rayan Bank, Gatehouse Bank, HSBC Amanah, Lloyds Islamic, Ahli United",
    shariahBasis: "Approved under AAOIFI Sharia Standard No. 12 (Sharika/Musharakah)",
  },
  {
    id: "murabaha",
    name: "Murabaha",
    arabicName: "المرابحة",
    badge: "Fixed profit — no rate changes",
    badgeColor: "bg-blue-100 text-blue-800",
    summary:
      "The bank purchases the property outright in its own name and then sells it to you at a pre-agreed higher price. The difference between the two prices is the bank's profit, and it is fixed at the point of signing — it cannot increase, decrease, or compound over time. You pay the total sale price in monthly instalments over the agreed term. Because this is a sale transaction and not a loan, no interest (riba) is involved.",
    howItWorks: [
      "Bank buys the property from the seller in a cash transaction",
      "Bank discloses its cost price to the customer (transparency is a Murabaha requirement)",
      "Customer agrees to buy the property from the bank at cost + agreed profit margin",
      "Total sale price is divided into equal monthly instalments",
      "Once the final instalment is paid, legal title transfers to the customer",
    ],
    bestFor: "New builds, shorter terms (5–15 years), buyers who want payment certainty",
    lenders: "Islamic Bank of Britain, Gatehouse Bank, United National Bank",
    shariahBasis: "Approved under AAOIFI Sharia Standard No. 8 (Murabaha)",
  },
  {
    id: "ijara",
    name: "Ijara wa Iqtina",
    arabicName: "الإجارة والاقتناء",
    badge: "Popular in GCC & buy-to-let",
    badgeColor: "bg-amber-100 text-amber-800",
    summary:
      "The bank purchases and retains ownership of the property throughout the term. You lease the property from the bank and pay monthly rent. Separately, you make capital contributions that accumulate towards the eventual purchase. At the end of the term, ownership transfers to you — either automatically or for a nominal sum — under a separate sale or gift agreement (hiba). This structure is particularly common in the Gulf Cooperation Council (GCC) and for buy-to-let investment finance.",
    howItWorks: [
      "Bank purchases property and becomes full legal owner",
      "Customer and bank sign a forward purchase undertaking (wa'd)",
      "Customer pays monthly rent (Ujra) for use of the property",
      "Monthly capital contributions build towards ownership transfer",
      "Ownership transfers at term end via gift (hiba) or nominal sale",
    ],
    bestFor: "Buy-to-let, commercial property, GCC residents, portfolio landlords",
    lenders: "Amlak Finance, Mashreq Al Islami, Emirates Islamic, DIB",
    shariahBasis: "Approved under AAOIFI Sharia Standard No. 9 (Ijara)",
  },
];

const FAQS = [
  {
    q: "Is a halal mortgage really free from interest?",
    a: "Yes — all three structures avoid riba (interest) by design. In Murabaha, the bank earns a profit on a sale transaction, not interest on a loan. In Musharakah and Ijara, the bank earns rent as a property owner, not interest as a lender. These are fundamentally different contractual relationships, even though the monthly payment amounts can look similar to a conventional mortgage.",
  },
  {
    q: "Why is the profit rate similar to conventional mortgage rates?",
    a: "Islamic finance providers operate in the same competitive market as conventional lenders and face similar funding costs. The profit/rental rate is benchmarked to market rates (often SONIA or the Bank of England base rate in the UK) to remain competitive. The rate being similar to interest does not make it interest — the underlying contractual structure determines Sharia compliance, not the numeric value of the rate.",
  },
  {
    q: "Which halal mortgage structure is cheapest?",
    a: "For the same property value, deposit, term, and rate, Diminishing Musharakah and Ijara produce identical total costs because they use the same amortising payment formula. Murabaha is calculated differently — the profit is a flat markup rather than a declining balance calculation — which means the total cost can differ, especially on longer terms. Use the calculator above to compare all three with your actual numbers.",
  },
  {
    q: "Can I get a halal mortgage in the UAE or Saudi Arabia?",
    a: "Yes. Islamic home finance is the dominant product in the GCC. In the UAE, providers include Emirates Islamic, Mashreq Al Islami, Amlak, and DIB. In Saudi Arabia, Al Rajhi Bank and Saudi National Bank (SNB) both offer Sharia-compliant home finance products. The structures used are most commonly Diminishing Musharakah and Ijara, aligned with local Sharia supervisory board approvals.",
  },
  {
    q: "What deposit do I need for a halal mortgage?",
    a: "Requirements vary by lender and product. In the UK, most Islamic mortgage providers require a minimum 10–20% deposit for residential purchases (80–90% LTV). For buy-to-let, a 25–40% deposit is typically required. A larger deposit (lower LTV) generally earns a better profit rate, exactly as with conventional products.",
  },
];

const UK_LENDERS = [
  { name: "Al Rayan Bank", type: "Dedicated Islamic bank", structures: "Musharakah, Murabaha", note: "Largest UK Islamic mortgage lender by volume" },
  { name: "Gatehouse Bank", type: "Dedicated Islamic bank", structures: "Musharakah", note: "Strong buy-to-let range" },
  { name: "HSBC Amanah", type: "Islamic window", structures: "Musharakah", note: "Mainstream lender with Islamic option" },
  { name: "Lloyds Islamic", type: "Islamic window", structures: "Musharakah", note: "Available in selected branches" },
  { name: "Ahli United Bank", type: "Islamic bank", structures: "Murabaha, Musharakah", note: "GCC-connected, UK operations" },
];

export default function HalalMortgageCalculatorPage() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Halal Mortgage Calculator",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
            description: "Calculate Sharia-compliant home finance payments for Diminishing Musharakah, Murabaha, and Ijara wa Iqtina structures.",
          }) 
        }}
      />

      <section className="relative overflow-hidden pt-8 sm:pt-12">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/finance" className="primary-chip rounded-full px-3 py-1 shadow-sm drop-shadow-sm">
              Finance
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-tight text-success">
              Sharia-Compliant
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Halal Mortgage Calculator
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            Calculate Sharia-compliant home finance across all three main structures — Musharakah, Murabaha, and Ijara — without interest (Riba).
          </p>
          <nav aria-label="Breadcrumb" className="mt-8">
            <ol className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-slate-400">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link href="/finance" className="hover:text-primary transition-colors">Finance</Link></li>
              <li>/</li>
              <li className="text-slate-900 font-bold">Halal Mortgage Calculator</li>
            </ol>
          </nav>
        </div>
      </section>

      <HalalMortgageCalculator />

      {/* ── EDUCATIONAL MASTERCLASS ── */}
      <section className="mx-auto max-w-4xl space-y-24 px-1 py-16">
        
        {/* Section 1: The Principle */}
        <article className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">The Principle: Financing Without Riba</h2>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            In Islamic finance, a "mortgage" is not a loan. It is a home purchase plan. In a conventional mortgage, the bank lends you money and charges interest (riba) for the use of that capital. In a halal mortgage, the bank provides an asset-based transaction — a sale, a lease, or a partnership.
          </p>
          <p className="text-slate-600 leading-relaxed mt-4">
            Each structure has a specific contractual basis verified by a Sharia Supervisory Board. While the monthly payments may look similar to a conventional loan, the <strong>legal nature of the transaction</strong> is fundamentally different. You are not a debtor; you are either a tenant, a partner, or a purchaser of a marked-up asset.
          </p>
        </article>

        {/* Section 2: Core Structures */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">The Three Pillars of Home Finance</h2>
             <p className="text-slate-500 font-medium">Understanding the legal chemistry behind your home ownership journey.</p>
          </div>

          <div className="grid gap-6">
            {STRUCTURES.map((s) => (
              <div key={s.id} className="p-8 sm:p-12 rounded-[3.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-none">{s.name}</h3>
                    <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">{s.arabicName}</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full ${s.badgeColor}`}>
                    {s.badge}
                  </span>
                </div>
                
                <p className="text-slate-600 leading-relaxed mb-10 text-sm font-medium">{s.summary}</p>
                
                <div className="grid sm:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400"># Process Chain</p>
                    <ul className="space-y-3">
                      {s.howItWorks.map((step, idx) => (
                        <li key={idx} className="flex gap-4 text-xs font-bold text-slate-700 leading-tight">
                          <span className="text-primary font-black">{idx + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-6 bg-slate-50 p-6 rounded-[2rem]">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Ideal Use Case</p>
                      <p className="text-xs font-bold text-slate-900">{s.bestFor}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Sharia Authority</p>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{s.shariahBasis}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Conventional vs Halal Comparison */}
        <section className="bg-slate-900 rounded-[4rem] p-10 sm:p-20 text-white overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-10 text-center uppercase tracking-tighter sm:text-4xl">Structural Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-white/40">Feature</th>
                    <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-white/40">Conventional Mortgage</th>
                    <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-emerald-400">Halal Finance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ["Contract Basis", "Loan with Interest", "Sale/Lease/Partnership"],
                    ["Bank's Revenue", "Riba (Interest Profit)", "Halal Rent/Trading Profit"],
                    ["Relationship", "Creditor / Debtor", "Partner / Tenant / Buyer"],
                    ["Default Treatment", "Interest Penalties", "Fair Resale / No Compounding"],
                    ["Ownership", "Customer (Secured)", "Shared until Completion"],
                  ].map(([f, c, h]) => (
                    <tr key={f} className="group">
                      <td className="py-6 px-4 text-xs font-bold text-white/60">{f}</td>
                      <td className="py-6 px-4 text-xs font-medium">{c}</td>
                      <td className="py-6 px-4 text-xs font-black text-emerald-400">{h}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 4: UK Market Context */}
        <article className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">Market Insight: UK Providers</h2>
          <p className="text-slate-600 leading-relaxed font-medium">
            The UK is home to one of the most mature Islamic finance markets globally. Government reforms in the 2000s removed double-transaction taxes, allowing halal mortgages to compete on a level playing field.
          </p>
          <div className="grid gap-4 mt-12">
            {UK_LENDERS.map((l) => (
              <div key={l.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="text-lg font-black text-slate-900">{l.name}</h4>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">{l.type}</p>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-4 sm:mt-0 max-w-[250px] leading-relaxed italic">
                  "{l.note}"
                </p>
              </div>
            ))}
          </div>
        </article>

        {/* Section 5: FAQ */}
        <section id="faq" className="space-y-16">
          <div className="text-center">
            <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter italic font-serif">Critical FAQ</h2>
            <p className="text-slate-500 font-medium">Addressing the most common points of confusion.</p>
          </div>
          <div className="grid gap-6">
            {FAQS.map((faq) => (
              <div key={faq.q} className="p-10 rounded-[3rem] border border-slate-100 bg-white hover:border-primary/40 hover:shadow-xl transition-all shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight">{faq.q}</h3>
                <p className="text-base text-slate-600 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Related Guides */}
        <section className="space-y-8 border-t border-slate-100 pt-16">
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Expert Guides & Analysis</h2>
            <p className="text-slate-500 font-medium text-sm mt-2">Deep dives into Sharia-compliant home finance structures.</p>
          </div>
          <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-3">
            <Link 
              href="/blog/halal-mortgage-structure-comparison"
              className="group block p-8 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest">Guide</span>
                <span className="text-xs font-bold text-emerald-600">9 min read</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                Structure Comparison: Musharakah vs Murabaha
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                A side-by-side comparison of the three main Islamic mortgage structures.
              </p>
              <div className="mt-6 flex items-center gap-2 text-emerald-600 font-bold text-sm">
                Read Guide <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>

            <Link 
              href="/blog/hidden-costs-of-islamic-mortgages-uk"
              className="group block p-8 rounded-[2.5rem] bg-amber-50 border border-amber-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 rounded-full bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest">Fee Guide</span>
                <span className="text-xs font-bold text-amber-600">10 min read</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                The &quot;Hidden&quot; Costs & Fees in the UK
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Uncover arrangement fees, valuation costs, and early exit charges.
              </p>
              <div className="mt-6 flex items-center gap-2 text-amber-600 font-bold text-sm">
                Read Fee Guide <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>

            <Link 
              href="/blog/first-time-buyer-halal-mortgage-guide-uk"
              className="group block p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">FTB Guide</span>
                <span className="text-xs font-bold text-indigo-600">12 min read</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                First-Time Buyer Guide: Deposit to Ownership
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Step-by-step walkthrough for first-time buyers seeking Sharia-compliant finance.
              </p>
              <div className="mt-6 flex items-center gap-2 text-indigo-600 font-bold text-sm">
                Read FTB Guide <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Legal Disclaimer */}
        <div className="p-8 rounded-[2rem] bg-slate-950 text-white/40 text-[10px] leading-relaxed uppercase tracking-widest text-center border border-white/5">
           <strong className="text-white">Strict Disclaimer:</strong> This calculator is an educational tool for modelling Sharia-compliant finance cashflows. It does not constitute financial, legal, or Sharia advisory. Home finance products carry risks; your home may be repossessed if you do not keep up with payments. Always consult a FCA-regulated and Sharia-vetted finance professional before entering into a legal agreement.
        </div>
      </section>

      {/* Relate Tools */}
      <section className="mt-16 space-y-8 border-t border-slate-100 pt-16">
        <div className="flex items-center justify-between px-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">More Finance Tools</h2>
            <p className="mt-1 text-sm text-slate-500">Utilities for better financial planning and analysis.</p>
          </div>
          <Link href="/finance" className="secondary-button px-4 py-2 text-xs">View All</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 px-4 pb-24">
          {[
            { name: "EMI Calculator", href: "/finance/emi-calculator", desc: "Calculate standard reducing balance interest loans." },
            { name: "Break Even Calculator", href: "/finance/break-even-calculator", desc: "Find your business profitability threshold." },
            { name: "Invoice Generator", href: "/finance/invoice-generator", desc: "Create professional invoices instantly." }
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col gap-3 rounded-3xl border border-white/40 bg-white/40 p-6 shadow-sm transition-all hover:bg-white/60 hover:shadow-xl"
            >
              <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-primary">
                {tool.name}
              </h3>
              <p className="text-xs leading-relaxed text-slate-500">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
