import Link from "next/link";
import type { Metadata } from "next";
import { MarkupMarginCalculator } from "./components/MarkupMarginCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/markup-vs-margin-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is the difference between markup and margin?",
    answer: "Markup is the percentage added ON TOP of the cost price. Margin (gross profit margin) is the profit expressed as a percentage OF the selling price. They use different bases: markup uses cost as the base, while margin uses revenue (selling price) as the base. This is why they can never be the same number for the same transaction."
  },
  {
    question: "How do I convert markup to margin?",
    answer: "Margin = Markup / (1 + Markup). For example, if your markup is 50% (0.50 in decimal), your margin is 0.50 / 1.50 = 33.3%. Conversely, to convert margin to markup: Markup = Margin / (1 - Margin)."
  },
  {
    question: "Why do retailers use markup instead of margin?",
    answer: "Retailers often use markup because it is easier to calculate at the point of purchase — they know the cost and apply a multiplier. However, accountants and executives tend to think in terms of margin because profit margins map directly to income statements and are more useful for benchmarking against industry standards."
  },
  {
    question: "What's a healthy gross profit margin?",
    answer: "Gross profit margins vary enormously by industry. Software companies typically have margins above 70-80%. Retailers average 25-50%. Restaurants typically operate between 60-70% gross margin but have extremely high operational overheads. Always benchmark against your specific industry."
  }
];

export const metadata: Metadata = {
  title: "Markup vs Margin Calculator | Profit Percentage Tool",
  description: "Understand the critical difference between markup and margin. Calculate both profit metrics from cost and selling price to make informed pricing decisions.",
  keywords: ["markup calculator", "margin calculator", "markup vs margin", "profit margin", "gross margin", "pricing calculator"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Markup vs Margin Calculator — Profit Tool", description: "Calculate and compare markup vs margin on any product." },
};

export default function MarkupMarginPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Markup vs Margin", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Markup vs Margin</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">Pricing Tool</p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">Markup vs Margin Calculator</h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">Two terms, two very different numbers. Understand exactly how markup and gross margin relate to your cost and revenue — and which one to use for your pricing strategy.</p>
        </div>
        <div className="mt-8 max-w-2xl"><PrivacyNote /></div>
      </section>

      <MarkupMarginCalculator />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Markup vs Margin: The Pricing Confusion</h2>
          <p>Markup and margin are both used to describe profit on a product, yet they are calculated differently and result in entirely different numbers — even for the exact same transaction. Confusing the two is one of the most common and costly mistakes in retail and manufacturing pricing.</p>
          <h3 className="text-foreground font-black italic">01. Markup — Cost as the Base</h3>
          <p className="p-6 bg-muted/20 border-l-4 border-primary font-mono text-sm">Markup % = (Selling Price - Cost) / Cost × 100</p>
          <p>A 50% markup on a $20 item means you add $10 (50% of the $20 cost) to arrive at a $30 selling price. The base of markup is always the <strong>cost</strong>.</p>
          <h3 className="text-foreground font-black italic">02. Margin — Revenue as the Base</h3>
          <p className="p-6 bg-muted/20 border-l-4 border-primary font-mono text-sm">Margin % = (Selling Price - Cost) / Selling Price × 100</p>
          <p>Using the same $20 cost and $30 selling price: Margin = $10 / $30 = 33.3%. The base of margin is always the <strong>revenue (selling price)</strong>.</p>
          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm">The Danger of Confusing Them</h3>
            <p className="opacity-80 leading-relaxed mb-0">If a business owner says "I want a 30% profit" but uses the markup formula instead of the margin formula, they will underprice their product. A 30% markup on a $100 cost item gives a $130 price (23% margin). But a 30% margin target requires a $142.86 price. The difference compounds dramatically at scale.</p>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Pricing Strategy FAQ</h2>
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
