import Link from "next/link";
import type { Metadata } from "next";
import BreakEvenCalculator from "@/app/finance/break-even-calculator/components/BreakEvenCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { TrendingUp, BarChart3, Calculator, Target, BookOpen, Layers, CheckCircle2, ChevronRight, FileSpreadsheet, Percent, Info, ShieldCheck } from "lucide-react";

export const revalidate = 43200;

const PAGE_PATH = "/finance/break-even-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is the break even point formula?",
    answer: "The break even point formula in units is: BEP = Fixed Costs ÷ Contribution Margin Per Unit. To find it in revenue: BEP ($) = Fixed Costs ÷ Contribution Margin Ratio. The contribution margin is simply your selling price minus the variable cost per unit."
  },
  {
    q: "What's the difference between break even units and break even sales?",
    a: "Break even units tells you the minimum number of products or services you must sell to cover your costs. Break even sales revenue converts that figure into dollar terms by multiplying by the selling price. For service businesses, the revenue figure is often more practical."
  },
  {
    question: "How do I use this for a service business?",
    answer: "In a service business, use billable hours or projects as your 'unit.' Your variable costs would be the direct cost of delivery (e.g., contractor fees or software per project). The break even sales tab will show you precisely what gross revenue you need each month to remain solvent."
  },
  {
    question: "Does break even analysis account for taxes?",
    answer: "Standard break even analysis is a 'before-tax' calculation. It focuses on operational solvency. To include taxes, you would need to adjust your target profit to a 'before-tax' equivalent by dividing your desired after-tax profit by (1 - Tax Rate)."
  },
  {
    question: "What is a 'good' contribution margin?",
    answer: "It varies by industry. SaaS companies often see 80%+, while manufacturing is lower (30-40%). The goal is a margin high enough to cover your fixed overhead at a sales volume your market can realistically support."
  },
  {
    question: "Can I export my results to Excel?",
    answer: "Yes. Our tool allows you to export your unit-by-unit analysis as a CSV file, which can be imported into Excel or Google Sheets for deeper financial modeling or boardroom presentations."
  }
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Break Even Calculator | Free Analysis Tool & Graph Generator",
    description: "Calculate your break even point instantly. Free break even analysis tool with chart maker, profit forecasting, and CSV export. No sign-up required.",
    path: PAGE_PATH,
  }),
  keywords: [
    "break even calculator",
    "break even point formula",
    "break even analysis tool",
    "calculate break even point",
    "business break even calculator",
    "profit forecasting tool",
    "fixed and variable cost calculator",
    "break even graph generator"
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Break Even Point Calculator",
    url: PAGE_URL,
    applicationCategory: "BusinessApplication",
    description: "Instant browser-based break even point analysis for entrepreneurs. Supports units, sales revenue, and target profit modeling with interactive charts.",
  };
}

export default function BreakEvenPage() {
  const faqJsonLd = buildFaqJsonLd(faq.map(f => ({ question: f.question || (f as any).q, answer: f.answer || (f as any).a })));

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Finance Tools", path: "/finance" },
            { name: "Break Even Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <div className="space-y-12 sm:space-y-16 pb-16">
        {/* Hero Area */}
        <section className="relative overflow-hidden pt-10 sm:pt-16">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">


            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 mb-4 leading-[1.1]">
              Break Even Point <span className="text-primary">Calculator</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 font-medium">
              Identify the exact sales volume needed to cover your costs. Model profit scenarios, visualize your cross-over point, and export audit-ready data.
            </p>
          </div>
        </section>

        {/* The Calculator */}
        <section id="calculator" className="px-4">
          <BreakEvenCalculator />
        </section>

        {/* Content & SEO Section */}
        <div className="max-w-4xl mx-auto px-4 space-y-16 sm:space-y-20">

          {/* Why It Matters */}
          <section className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Launch Decisions",
                icon: <Target className="w-5 h-5" />,
                body: "Know exactly how many units your product must sell before you commit capital. Avoid high-risk projects with unachievable break even points."
              },
              {
                title: "Pricing Strategy",
                icon: <Percent className="w-5 h-5" />,
                body: "Instantly see how a 5% price increase or a 10% cost reduction shifts your survival threshold. Price for profit, not just volume."
              },
              {
                title: "Investor Ready",
                icon: <FileSpreadsheet className="w-5 h-5" />,
                body: "Generate the break-even data needed for business plans and pitch decks. Export to CSV to integrate with your existing financial models."
              }
            ].map((feature) => (
              <div key={feature.title} className="group p-6 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all">
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center mb-5 shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{feature.body}</p>
              </div>
            ))}
          </section>

          {/* Deep Dive: What is BEP? */}
          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              What is Break Even Analysis?
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Break even analysis is the financial bedrock of any business venture. It identifies
              the 'zero point' where total revenue exactly equals total costs — meaning your business
              generates $0 in profit but suffers $0 in loss. Understanding this threshold allows
              you to measure risk, set aggressive yet realistic sales targets, and determine the
              feasibility of new product lines or expansion plans.
            </p>
            <div className="p-6 rounded-2xl bg-slate-900 text-white my-8">
              <h4 className="text-primary-soft font-bold uppercase tracking-widest text-xs mb-3">The Logic of Survival</h4>
              <p className="text-sm text-slate-300 leading-relaxed m-0 italic">
                "Profitability begins the moment your Contribution Margin exceeds your Fixed Costs.
                Until that moment, you aren't just spending money — you're burning it. Break even
                analysis find the exact bucket of sales that stops the fire."
              </p>
            </div>
          </section>

          {/* Formula Table/Guide */}
          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-black text-slate-900">The Break Even Formula Explained</h2>
            <p>
              There are three main ways to calculate your break even point depending on your business
              model. Our calculator uses these exact formulas:
            </p>

            <div className="overflow-x-auto my-6">
              <table className="min-w-full text-xs border-collapse rounded-xl overflow-hidden shadow-sm">
                <thead className="bg-slate-100 font-bold uppercase tracking-widest text-[9px] text-slate-500">
                  <tr>
                    <th className="py-3 px-5 text-left">Goal</th>
                    <th className="py-3 px-5 text-left">Formula</th>
                    <th className="py-3 px-5 text-left">Best For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-5 font-bold">Units to Break Even</td>
                    <td className="py-3 px-5 font-mono bg-slate-50">Fixed Costs / (Price - Var. Cost)</td>
                    <td className="py-3 px-5">Physical products, retail, manufacturing</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5 font-bold text-primary">Sales to Break Even</td>
                    <td className="py-3 px-5 font-mono bg-slate-50">Fixed Costs / CM Ratio</td>
                    <td className="py-3 px-5">Service businesses, multi-product stores</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5 font-bold">Target Profit Units</td>
                    <td className="py-3 px-5 font-mono bg-slate-50">(Fixed Costs + Profit) / CM</td>
                    <td className="py-3 px-5">Growth planning, quota setting</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Fixed vs Variable */}
          <section className="grid sm:grid-cols-2 gap-8 not-prose bg-slate-50 rounded-[2rem] p-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Understanding Fixed Costs
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                These are your "overhead" — costs that do not change regardless of how many items
                you sell. Rent, administrative salaries, insurance, software subscriptions,
                and loan repayments are common fixed costs.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Understanding Variable Costs
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                These are costs that scale with production. Raw materials, shipping fees,
                packaging, payment processing (Stripe/PayPal fees), and direct labor
                hours are variable costs.
              </p>
            </div>
          </section>

          {/* Excel Section */}
          <section id="excel" className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-primary" />
              Break Even Analysis in Excel vs. Online Tools
            </h2>
            <p>
              Many businesses build their initial break even model in Excel. It's affordable and flexible, 
              but it requires manual maintenance and formula auditing. To build a <strong>break even analysis 
              in Excel</strong>, you typically set up four columns: Units Sold, Revenue, Variable Costs, 
              and Total Costs.
            </p>
            <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 text-sm">
              <p className="mt-0 font-bold text-slate-900">Pro Tip: Goal Seek</p>
              <p className="mb-0 text-slate-600 leading-relaxed italic">
                Use Excel's 'Goal Seek' function (Data &rarr; What-If Analysis) to back-solve for pricing. 
                For example, you can ask Excel: "What price do I need to break even at exactly 500 units?" 
                For faster results, use our online calculator above and export the data back to Excel for reporting.
              </p>
            </div>
          </section>

          {/* Industry Benchmarks */}
          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              Break Even Benchmarks by Industry
            </h2>
            <p>
              There is no single "normal" break even point — it varies enormously depending on your 
              cost structure, pricing power, and business model. Understanding typical benchmarks 
              helps you evaluate your own numbers intelligently.
            </p>
            <div className="grid sm:grid-cols-2 gap-8 not-prose mt-10">
              {[
                {
                   title: "Software & SaaS",
                   label: "70–85% CM Ratio",
                   body: "High fixed costs (salaries, R&D) but minimal variable costs per user. High break even customer counts, but exponential profit scaling once crossed."
                },
                {
                   title: "E-commerce",
                   label: "30–55% CM Ratio",
                   body: "Moderate fixed costs but high variable costs (shipping, duty, COGS). Break even is reachable at low volumes, but thin margins make growth sensitive to ad-spend."
                },
                {
                   title: "Restaurants",
                   label: "60–75% CM (Food)",
                   body: "Healthy food margins are offset by punishing fixed costs (prime rent, kitchen labor). Requires high daily throughput to maintain operational solvency."
                },
                {
                   title: "Service/Consulting",
                   label: "90% + CM Ratio",
                   body: "Low fixed overhead and zero variable costs if self-performed. Break even is reached in days; the challenge is capacity and acquisition."
                }
              ].map((b) => (
                <div key={b.title} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">{b.title}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-900 text-white px-2 py-0.5 rounded-md">{b.label}</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{b.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-8">
              <strong>Manufacturing businesses</strong> carry the most challenging profiles. High capital 
              expediture and equipment depreciation create massive fixed cost bases. Small swings in demand 
              have a disproportionate effect on profitability — a phenomenon known as operating leverage.
            </p>
          </section>

          {/* Price Setting section */}
          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <Calculator className="w-8 h-8 text-primary" />
              How to Use Break Even Analysis to Set Your Price
            </h2>
            <p>
              Pricing is one of the highest-leverage decisions in any business. Most people use a 
              calculator to check if a price is viable; professional CFOs use it to stress-test 
              points <em>before</em> committing.
            </p>
            <div className="space-y-8 mt-10 not-prose">
               {[
                 {
                   title: "Find your Price Floor",
                   body: "Your variable cost per unit is your absolute floor. You cannot price below it without losing money on every sale. The formula tells you if a price is mathematically sustainable; the market tells you if it's commercially viable."
                 },
                 {
                   title: "The Asymmetry of Sensitivity",
                   body: "A 10% price increase often results in a 25% jump in contribution margin and a 20% drop in break even volume. Conversely, a 10% discount can increase your required volume by over 33% just to cover the same costs."
                 },
                 {
                   title: "Model Multi-Point Scenarios",
                   body: "Run the analysis at $39, $49, and $59. Ask honestly: can we realistically sell the required volume at that price? This reframes pricing from accounting into market validation."
                 }
               ].map((item) => (
                 <div key={item.title} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm ring-1 ring-black/5 flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black shrink-0 mt-1">✓</div>
                    <div>
                       <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                       <p className="text-sm text-slate-500 leading-relaxed">{item.body}</p>
                    </div>
                 </div>
               ))}
            </div>
          </section>

          {/* Margin of Safety section */}
          <section className="prose prose-slate max-w-none">
             <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-primary" />
                Margin of Safety: Knowing Your Buffer
             </h2>
             <p className="text-lg">
               Calculating your break even point is the first step. Knowing how much distance you 
               have between current performance and that threshold is what allows you to make 
               calm operational decisions.
             </p>
             <div className="grid md:grid-cols-2 gap-8 my-10 not-prose">
                <div className="p-8 rounded-[2rem] bg-slate-900 text-white flex flex-col justify-center">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">The Formula</p>
                   <p className="text-xl font-mono text-primary-soft">MoS = (Actual Rev - BEP Rev) / Actual Rev</p>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                   <p className="text-slate-600 leading-relaxed text-sm">
                      A <strong>margin of safety</strong> of 30% means your revenue can fall by nearly a third 
                      before you start losing money. Any buffer below 15% is considered a 'warning zone' 
                      for businesses with high fixed costs.
                   </p>
                </div>
             </div>
             <p>
                Use this metric when making <strong>hiring decisions</strong>. Adding a salaried employee 
                increases fixed costs and compresses your margin of safety. If a hire takes your 
                MoS from 25% down to 5%, that hire may be premature unless they generate immediate 
                revenue impact.
             </p>
          </section>

          {/* Real Examples from Six Business Types */}
          <section className="prose prose-slate max-w-none">
             <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary" />
                Six Real-World Break Even Examples
             </h2>
             <p>
               Abstract formulas become useful when anchored to reality. Here is how break even analysis 
               behaves across different business structures:
             </p>

             <div className="grid gap-6 not-prose mt-12">
               {[
                 {
                   name: "Local Cafe",
                   context: "$12k Fixed Costs",
                   result: "108 drinks / day",
                   insight: "Profitability is driven by average order value (upselling food) rather than bean costs."
                 },
                 {
                   name: "SaaS Startup",
                   context: "$28k Fixed Costs",
                   result: "623 customers",
                   insight: "With a 92% CM Ratio, growth is prioritize over short-term savings every time."
                 },
                 {
                   name: "Fitness Studio",
                   context: "$18k Fixed Costs",
                   result: "900 bookings",
                   insight: "Requires only 18% capacity utilization to survive; focus should be recurring membership."
                 },
                 {
                   name: "D2C E-commerce",
                   context: "$6.5k Fixed Costs",
                   result: "192 orders / month",
                   insight: "Success is a traffic math game: 6,400 monthly visitors at 3% conversion = Break Even."
                 },
                 {
                    name: "Freelance Designer",
                    context: "$2.2k Fixed Costs",
                    result: "< 1 project / month",
                    insight: "Variable costs are zero. Financial constraint is capacity (billable hours), not costs."
                 },
                 {
                    name: "Manufacturer",
                    context: "$65k Fixed Costs",
                    result: "1,383 units / month",
                    insight: "High operating leverage. Utilization percentage is the critical survival metric."
                 }
               ].map((ex) => (
                 <div key={ex.name} className="group p-6 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 transition-all flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                       <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{ex.name}</h4>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{ex.context}</p>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                       <p className="text-xl font-black text-slate-900">{ex.result}</p>
                    </div>
                    <div className="flex-[2] min-w-[300px]">
                       <p className="text-xs text-slate-500 leading-relaxed italic border-l-2 border-slate-100 pl-4">"{ex.insight}"</p>
                    </div>
                 </div>
               ))}
             </div>
          </section>

          {/* FAQ Area */}
          <section id="faq" className="space-y-10 pb-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-black text-slate-900">Financial FAQ</h2>
              <p className="text-slate-500 max-w-lg mx-auto font-medium leading-relaxed text-sm">
                Common questions from business owners and students about break even analysis.
              </p>
            </div>

            <div className="grid gap-4">
              {faq.map((item, i) => (
                <div key={i} className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-primary/30 hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-sm bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black">Q</span>
                    {item.question || (item as any).q}
                  </h3>
                  <p className="text-slate-600 leading-relaxed pl-10 text-sm">
                    {item.answer || (item as any).a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer CTA */}
          <section className="bg-slate-900 rounded-[3rem] p-10 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all" />
            <Calculator className="w-16 h-16 text-white/5 absolute -bottom-4 -left-4 rotate-12" />

            <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">Master Your Business Numbers</h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto font-medium">Download your analysis to CSV and integrate it into your next business plan proposal.</p>

            <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
              <Link href="/finance/invoice-generator" className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:scale-105 transition-transform">
                Invoice Generator
              </Link>
              <Link href="/finance/emi-calculator" className="px-8 py-4 bg-slate-800 text-white font-bold rounded-2xl hover:scale-105 border border-slate-700 transition-transform">
                EMI Calculator
              </Link>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
