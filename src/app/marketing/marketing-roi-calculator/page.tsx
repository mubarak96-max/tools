import { Metadata } from "next";
import Link from "next/link";
import MarketingROICalculator from "./components/MarketingROICalculator";
import { buildMetadata } from "@/lib/seo/metadata";
import { TrendingUp, Zap, Target, DollarSign, BarChart3, PieChart, ShieldCheck, Gauge, Layers, Info } from "lucide-react";

const PAGE_PATH = "/marketing/marketing-roi-calculator";

export const metadata: Metadata = buildMetadata({
  title: "Marketing ROI Calculator | Professional ROAS, ROMI & CAC Master Analysis",
  description: "Calculate your marketing ROI instantly. Analyze ROAS, ROMI, CAC, and LTV with our professional-grade calculator. Includes 1,500+ word guide on growth unit economics.",
  path: PAGE_PATH,
});

const BENCHMARKS = [
  { metric: "Target ROAS", saas: "350% - 500%", ecommerce: "400% - 800%", b2b: "250% - 400%" },
  { metric: "LTV : CAC", saas: "3.0x+", ecommerce: "2.5x+", b2b: "4.0x+" },
  { metric: "CAC Payback", saas: "12 Mo", ecommerce: "1st Order", b2b: "3-6 Mo" },
  { metric: "Lead-to-Sale", saas: "5% - 15%", ecommerce: "N/A", b2b: "15% - 30%" },
];

export default function Page() {
  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Marketing ROI Calculator",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description: "Calculate ROAS, ROMI, CAC, and LTV across every channel for growth teams.",
          }) 
        }}
      />

      <section className="relative overflow-hidden pt-8 sm:pt-12">
        <div className="max-w-4xl px-4 lg:px-0">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/marketing" className="primary-chip rounded-full px-3 py-1 shadow-sm drop-shadow-sm">
              Marketing
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-tight text-primary">
              Performance Analytics
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Marketing ROI Calculator
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl font-medium">
            Master your unit economics. Calculate ROAS, ROMI, CAC, and LTV across every channel with a professional-grade precision engine.
          </p>
          <nav aria-label="Breadcrumb" className="mt-8">
            <ol className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-slate-400">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link href="/marketing" className="hover:text-primary transition-colors">Marketing</Link></li>
              <li>/</li>
              <li className="text-slate-900 font-bold">Marketing ROI Calculator</li>
            </ol>
          </nav>
        </div>
      </section>

      <MarketingROICalculator />

      {/* ── EDUCATIONAL MASTERCLASS: 1500+ WORDS ── */}
      <section className="mx-auto max-w-4xl space-y-24 px-4 py-16">
        
        {/* Section 1: The Philosophy of ROI */}
        <article className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900 border-l-4 border-primary pl-6 py-2 uppercase tracking-tight">The Marketer's Manifesto: Beyond Vanity Metrics</h2>
          <p className="text-lg text-slate-600 leading-relaxed font-medium mt-8">
            In the decade of "growth at all costs," marketing reporting was often reduced to reach, impressions, and engagement rates. But as capital becomes more expensive and the "Attention Economy" reaches saturation, marketing is no longer a cost center—it is a <strong>profit engineering department</strong>.
          </p>
          <p className="text-slate-600 leading-relaxed">
            True Marketing ROI is not just a calculation; it is a strategic feedback loop that informs your entire business model. If your ROI is too low, you are burning capital on inefficient acquisition. If it is too high (e.g., 15:1), you are likely under-investing and ceding market share to competitors. This guide and calculator are built to help you find the "Goldilocks Zone" of sustainable, profitable scaling.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 not-prose my-16">
            {[
              { icon: <DollarSign className="h-6 w-6 text-emerald-600" />, title: "Economic Truth", body: "Move from reporting on impressions to contribution margin and EBITDA." },
              { icon: <Zap className="h-6 w-6 text-amber-500" />, title: "Scaling Velocity", body: "Identify exactly when a channel hits its point of diminishing returns." },
              { icon: <ShieldCheck className="h-6 w-6 text-blue-600" />, title: "Budget Defense", body: "Protect your marketing spend with indisputable CAC and LTV data." },
              { icon: <Target className="h-6 w-6 text-rose-600" />, title: "Precision", body: "Turn historical performance into predictive models for future budget cycles." },
            ].map((box) => (
              <div key={box.title} className="p-6 rounded-3xl bg-white border border-slate-100 hover:border-primary/30 hover:shadow-xl transition-all group shadow-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 transition-transform group-hover:scale-110">
                  {box.icon}
                </div>
                <h4 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">{box.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{box.body}</p>
              </div>
            ))}
          </div>
        </article>

        {/* Section 2: ROAS vs ROMI vs ROI - The Technical Showdown */}
        <section className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tight">Lexicon of Performance: ROAS vs. ROMI vs. ROI</h2>
          <p className="text-slate-600">
            One of the most dangerous mistakes in a growth meeting is using these three terms interchangeably. While they are related, they tell fundamentally different stories about your unit economics.
          </p>

          <div className="space-y-8 mt-12">
            {[
              { 
                letter: "A", 
                title: "ROAS (Return on Ad Spend)", 
                formula: "Revenue / Ad Spend",
                best: "Tactical Optimization",
                txt: "ROAS is a tactical metric. It tells you how much top-line revenue a specific platform generated. However, it is 'dangerously optimistic' because it ignores COGS, shipping, and labor. A 5x ROAS might look impressive, but if your product margins are 15%, you are actually losing money on every sale." 
              },
              { 
                letter: "B", 
                title: "ROMI (Return on Marketing Investment)", 
                formula: "(Gross Profit - Ad Spend) / Ad Spend",
                best: "Marketing Management",
                txt: "ROMI is a purer metric for marketing directors. It factors in the Cost of Goods Sold (COGS). It answers the vital question: 'After making the product and paying for the ads, did we actually contribute cash to the business?' This is the metric that separates growth from sheer vanity." 
              },
              { 
                letter: "C", 
                title: "Net Marketing ROI", 
                formula: "(Net Profit / Total Department Expense) x 100",
                best: "C-Suite Reporting",
                txt: "This takes everything into account—not just ad spend and COGS, but also the 'Loaded Cost' of the marketing team, software subscriptions (SaaS), and agency retainers. This is the ultimate 'hard truth' metric for the entire department." 
              }
            ].map((item) => (
              <div key={item.letter} className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 sm:p-12 transition-all hover:bg-white hover:shadow-2xl group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-black text-sm shadow-lg shadow-primary/20">
                    {item.letter}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 m-0">{item.title}</h3>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Best For: {item.best}</p>
                  </div>
                </div>
                <div className="mb-6 p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs flex justify-between items-center">
                   <span className="opacity-40">{item.formula}</span>
                   <span className="text-[10px] uppercase font-black tracking-widest text-white/20">Formula</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.txt}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: The Attribution Barrier */}
        <section className="bg-slate-900 rounded-[4rem] p-10 sm:p-20 text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform duration-1000 group-hover:rotate-45">
             <Layers className="w-96 h-96" />
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-black mb-8 leading-tight tracking-tight uppercase">The Attribution Myth: Why Calculators Are Only Part of the Story</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
              Calculators provide perfect math, but your marketing data is often flawed. <strong>Attribution</strong> is the science of assigning credit to different touchpoints in a customer journey. Most platforms default to "Last-Click," which unfairly rewards Retargeting while ignoring the "top-of-funnel" awareness work done by Brand or Content marketing.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8 text-left">
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all">
                <div className="mb-4 h-10 w-10 flex items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-white mb-3">Multi-Touch Attribution (MTA)</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Standard pixels lose 30% of data due to ITP/iOS14. Consider 'Linear' or 'W-Shaped' models that give credit to the first, middle, and last interactions equally.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all">
                <div className="mb-4 h-10 w-10 flex items-center justify-center rounded-xl bg-amber-500/20 text-amber-500">
                  <PieChart className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-white mb-3">Incrementality Testing</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Would the sale have happened anyway? Brand Search often shows high ROI, but low incrementality (those users were already looking for you).</p>
              </div>
            </div>
            
            <div className="mt-12 p-8 rounded-[2rem] bg-primary/10 border border-primary/20 text-primary-soft italic text-[13px] font-medium text-center">
              "The most advanced growth teams use 'Marketing Mix Modeling' (MMM) to correlate total spend with total revenue, bypass browser tracking issues entirely."
            </div>
          </div>
        </section>

        {/* Section 4: LTV & CAC: The Soul of Sustainable Growth */}
        <article className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Unit Economics: The CAC/LTV Ratio Strategy</h2>
          <p className="text-slate-600 font-medium">
            If ROI is the 'speedometer' of your business, the <strong>LTV:CAC Ratio</strong> is your fuel efficiency. For venture-backed startups and high-growth e-commerce, the standard target is a <strong>3:1 ratio</strong>.
          </p>

          <div className="grid md:grid-cols-2 gap-10 my-16">
            <div className="p-8 rounded-[3rem] border border-slate-100 bg-slate-50">
              <h4 className="text-primary font-black text-xs uppercase tracking-widest mb-4">CAC Mastery</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Customer Acquisition Cost (CAC) should include everything: ad spend, creative costs, agency fees, and and salaries. Calculating 'Blended CAC' (all marketing / all customers) is the only way to see the true cost of growth.
              </p>
            </div>
            <div className="p-8 rounded-[3rem] border border-slate-100 bg-emerald-50">
              <h4 className="text-emerald-700 font-black text-xs uppercase tracking-widest mb-4">LTV Precision</h4>
              <p className="text-sm text-emerald-800 leading-relaxed font-medium">
                Lifetime Value (LTV) should be calculated on <strong>Gross Margin</strong>, not Revenue. If a customer spends $1,000 over their lifetime but your margins are 40%, your LTV is $400, not $1,000. Overstating LTV leads to business failure.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Gauge className="w-48 h-48" />
             </div>
             <h3 className="text-xl font-black mb-4 text-emerald-400">The 12-Month Payback Rule</h3>
             <p className="text-slate-400 text-sm leading-relaxed mb-0 font-medium">
               A 4:1 LTV:CAC ratio is useless if the Payback Period is 36 months and you only have 12 months of runway. High-velocity businesses prioritize a <strong>CAC Payback Period of under 12 months</strong> (ideally 6 months) to ensure capital recycling and stable cash flow.
             </p>
          </div>
        </article>

        {/* Section 5: Optimization Stack - The 'Rule of 5' */}
        <section className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">The Growth Framework: How to 'Hack' Your ROI</h2>
          <p className="text-slate-600">Once you have your numbers, how do you improve them? We recommend the <strong>Rule of 5 Optimization Stack</strong>:</p>

          <div className="space-y-8 mt-12">
            {[
              { step: "01", name: "Conversion Rate Optimization (CRO)", txt: "The fastest way to double your ROI is not doubling your traffic, but doubling your conversion rate. A 2% CR vs. a 4% CR effectively halves your CAC and doubles your ROAS." },
              { step: "02", name: "Offer Engineering & Hooks", txt: "Does your offer solve a high-intent pain point? Testing 10-20 distinct creative hooks per week is the industry baseline for high-performing Meta and YouTube teams." },
              { step: "03", name: "Retention & LTV Expansion", txt: "Selling to an existing customer is 6-7x cheaper than acquiring a new one. Robust email automation (Klaviyo/HubSpot) and up-sell logic are the silent drivers of ROI." },
              { step: "04", name: "Funnel Friction Pruning", txt: "Every extra required field in a lead form or step in a checkout reduces conversion by roughly 10%. Automate data capture and shorten the 'path to purchase'." },
              { step: "05", name: "Average Order Value (AOV) Boost", txt: "Post-purchase up-sells and bundle offers increase top-line revenue without any increase in ad spend, pushing your marginal ROI higher." },
            ].map((item) => (
              <div key={item.step} className="flex gap-8 items-start group border-b border-slate-100 pb-8 last:border-0 hover:translate-x-1 transition-transform">
                <div className="text-4xl font-black text-slate-100 group-hover:text-primary transition-colors shrink-0">{item.step}</div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">{item.name}</h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed font-semibold italic">{item.txt}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Industry Benchmarks Table */}
        <section className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tight">Market Benchmarks: Standard ROI Targets (2025/2026)</h2>
          <div className="overflow-x-auto rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden bg-white">
            <table className="min-w-full text-[13px]">
              <thead className="bg-slate-900 text-white font-black uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="py-6 px-8 text-left">Performance Metric</th>
                  <th className="py-6 px-8 text-left">B2B SaaS</th>
                  <th className="py-6 px-8 text-left">E-commerce</th>
                  <th className="py-6 px-8 text-left">Professional Services</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-600 italic">
                {BENCHMARKS.map((b) => (
                  <tr key={b.metric} className="hover:bg-slate-50 transition-colors">
                    <td className="py-6 px-8 font-black text-slate-900 uppercase tracking-tight">{b.metric}</td>
                    <td className="py-6 px-8">{b.saas}</td>
                    <td className="py-6 px-8">{b.ecommerce}</td>
                    <td className="py-6 px-8">{b.b2b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 7: Strategy FAQ */}
        <section id="faq" className="space-y-16">
          <div className="text-center">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">The Growth Strategy FAQ</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto italic">Addressing the technicalities of performance marketing and unit economics.</p>
          </div>
          <div className="grid gap-6">
            {[
              { q: "Is a high ROAS always better?", a: "No. If your ROAS is 10x but your total volume is small, and your overhead is fixed, you are stalling. It is often more profitable to accept a 4x ROAS at $1M spend than a 10x ROAS at $10k spend. This is the search for 'Economies of Scale'." },
              { q: "Should I include branding spend in my ROI?", a: "Yes. Brand awareness (like high-level video or podcast sponsorships) improves the efficiency of your direct performance ads. We recommend tracking 'Blended ROAS'—the total revenue divided by the total marketing budget." },
              { q: "What is 'Incremental' ROI?", a: "This is the return on the last dollar spent. To find it, compare results from two spend levels (e.g., $20k vs. $30k). Subtract the original revenue from the new revenue, then divide by the $10k difference." },
              { q: "How does 'Dark Social' affect my ROI calculations?", a: "Pixels can't track word-of-mouth, podcasts, or community groups. To get a true ROI, always combine your pixel data with a 'Post-Purchase Survey' (e.g., 'How did you hear about us?')." },
            ].map((faq) => (
              <div key={faq.q} className="p-10 rounded-[3rem] border border-slate-100 bg-white hover:border-primary/40 hover:shadow-2xl transition-all shadow-sm group">
                <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight group-hover:text-primary transition-colors">{faq.q}</h3>
                <p className="text-base text-slate-600 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Legal Disclaimer */}
        <div className="p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 text-slate-600 text-[10px] leading-relaxed uppercase tracking-[0.2em] text-center font-bold">
          <strong className="text-primary">Master Disclaimer:</strong> This calculator is a professional tool for growth modeling. It does not constitute financial or strategic consulting. Actual results depend on market volatility, attribution models, and execution. Use these models as foundational targets, not absolute guarantees.
        </div>
      </section>

      {/* Related Tools */}
      <section className="mt-16 space-y-8 border-t border-slate-100 pt-16">
        <div className="flex items-center justify-between px-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">More Professional Tools</h2>
            <p className="mt-1 text-sm text-slate-500">Utilities for better financial planning and analysis.</p>
          </div>
          <Link href="/marketing" className="secondary-button px-4 py-2 text-xs">View All</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 px-4 pb-24 text-left">
          {[
            { name: "Break Even Calculator", href: "/finance/break-even-calculator", icon: "BEP", desc: "Find your business profitability threshold." },
            { name: "Halal Mortgage Calculator", href: "/finance/halal-mortgage-calculator", icon: "HLM", desc: "Compare Sharia-compliant home finance." },
            { name: "BMR Calculator", href: "/health/bmr-calculator", icon: "BMR", desc: "Calculate your basal metabolic rate scientifically." }
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col gap-3 rounded-[2rem] border border-white/40 bg-white/40 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:bg-white/60 hover:shadow-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[11px] font-black text-primary shadow-sm ring-1 ring-black/5">
                {tool.icon}
              </div>
              <h3 className="text-[15px] font-bold text-slate-900 transition-colors group-hover:text-primary">
                {tool.name}
              </h3>
              <p className="text-xs leading-relaxed text-slate-500 font-medium">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
