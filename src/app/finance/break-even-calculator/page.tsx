import Link from "next/link";
import type { Metadata } from "next";
import { BreakEvenCalculator } from "./components/BreakEvenCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/break-even-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is the break-even point?",
    answer: "The break-even point is the level of output, sales, or revenue at which total costs equal total revenues — resulting in zero profit or loss. Below this point the business operates at a loss; above it, the business is profitable. Every unit sold above the break-even point contributes directly to profit."
  },
  {
    question: "What is the formula for break-even analysis?",
    answer: "Break-Even Units = Fixed Costs / (Selling Price per Unit - Variable Cost per Unit). The denominator in this formula is known as the 'Contribution Margin' — the amount each unit sale contributes toward covering fixed costs and generating profit."
  },
  {
    question: "What are fixed vs. variable costs?",
    answer: "Fixed costs are expenses that remain constant regardless of production volume — rent, salaries, insurance, and software subscriptions are examples. Variable costs change directly with production — raw materials, packaging, shipping per item, and direct labor are examples."
  },
  {
    question: "What is the margin of safety?",
    answer: "The margin of safety measures how far current sales can fall before the business hits break-even. It is expressed as a percentage: (Current Revenue - Break-Even Revenue) / Current Revenue × 100. A higher margin of safety means the business is more resilient to revenue downturns."
  }
];

export const metadata: Metadata = {
  title: "Break-Even Analysis Calculator | Find Your Break-Even Point",
  description: "Calculate your break-even point in units and revenue. Understand fixed vs variable costs, contribution margin, and margin of safety for your business.",
  keywords: ["break even calculator", "break even analysis", "contribution margin", "fixed costs", "variable costs", "margin of safety"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Break-Even Analysis Calculator", description: "Find when revenue equals costs and calculate your margin of safety." },
};

export default function BreakEvenPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Break-Even Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd && <JsonLd data={serializeJsonLd(faqJsonLd)} />}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li className="opacity-50">/</li>
            <li><Link href="/finance" className="hover:text-primary transition-colors">Finance</Link></li>
            <li className="opacity-50">/</li>
            <li className="text-foreground font-medium">Break-Even Calculator</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">Business Finance Tool</p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">Break-Even Calculator</h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">Determine exactly how many units you need to sell to cover all your costs. Calculate contribution margin, break-even revenue, and margin of safety.</p>
        </div>
        <div className="mt-8 max-w-2xl"><PrivacyNote /></div>
      </section>

      <BreakEvenCalculator />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Break-Even Analysis: Know Your Floor</h2>
          <p>Break-even analysis is one of the most fundamental tools in business planning and financial management. Before launching a product, setting a price, or evaluating an investment, every entrepreneur and manager must know the minimum level of sales required to avoid losing money.</p>
          <h3 className="text-foreground font-black italic">01. The Contribution Margin</h3>
          <p>At the heart of break-even analysis is the <strong>Contribution Margin</strong> — the amount each individual unit sale contributes toward covering fixed overhead and then generating profit.</p>
          <p className="p-6 bg-muted/20 border-l-4 border-primary font-mono text-sm">Contribution Margin = Selling Price per Unit - Variable Cost per Unit</p>
          <p>If you sell a product for $50 and it costs $20 in direct materials and labor to make, your contribution margin is $30. Each sale of one unit covers $30 of your fixed overhead.</p>
          <h3 className="text-foreground font-black italic">02. Break-Even in Units</h3>
          <p className="p-6 bg-muted/20 border-l-4 border-primary font-mono text-sm">Break-Even Units = Fixed Costs / Contribution Margin per Unit</p>
          <p>If your monthly fixed costs are $15,000 and your contribution margin is $30, you need to sell 500 units to break even. The 501st unit begins generating pure profit.</p>
          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm">Using Break-Even for Pricing Strategy</h3>
            <p className="opacity-80 leading-relaxed mb-0">Break-even analysis is a powerful tool for validating pricing decisions. If your current fixed costs and sales forecast require a break-even price of $45 but the market will only bear $40, you have three choices: reduce fixed costs, reduce variable costs, or increase volume dramatically. Running these scenarios before price commitment prevents costly miscalculations.</p>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Break-Even FAQ</h2>
        <div className="mt-16 grid gap-8 md:grid-cols-2 text-balance">
          {faq.map((item) => (
            <article key={item.question} className="p-8 rounded-[2.5rem] border border-border bg-background hover:shadow-2xl transition-all flex flex-col justify-between group">
              <div>
                <h3 className="text-lg font-black text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">{item.question}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Expert Analysis
              </div>
            </article>
          ))}
        </div>
      </section>

      <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath={PAGE_PATH} />
    </div>
  );
}
