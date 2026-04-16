import Link from "next/link";
import type { Metadata } from "next";
import { RoasCalculator } from "./components/RoasCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/return-on-ad-spend-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a good ROAS (Return on Ad Spend)?",
    answer: "A ROAS of 4:1 (returning $4 for every $1 spent on ads) is a commonly cited benchmark. However, the 'right' ROAS depends entirely on your profit margins. A business with a 20% gross margin needs a much higher ROAS than a software company with an 80% margin to be profitable."
  },
  {
    question: "How is ROAS different from ROI?",
    answer: "ROAS (Return on Ad Spend) only measures revenue generated against the money spent on the ads themselves. ROI (Return on Investment) is a broader measure that accounts for all costs, including the cost of goods sold, operational costs, and the ad spend. ROAS is a top-level efficiency metric; ROI shows true profitability."
  },
  {
    question: "How do I calculate my minimum break-even ROAS?",
    answer: "The minimum break-even ROAS is determined by your gross profit margin. Break-Even ROAS = 1 / Gross Profit Margin. If your gross profit margin is 40%, you need a ROAS of at least 1 / 0.40 = 2.5x just to break even on your ad campaigns (before factoring in operational overhead)."
  },
  {
    question: "How can I improve my ROAS?",
    answer: "Improving ROAS works from two directions simultaneously: 1) On the cost side — audit and exclude low-performing keywords, tighten audience targeting, and reduce bids on underperforming segments. 2) On the revenue side — improve your landing page conversion rate (CVR), increase your average order value (AOV) with upsells, and improve post-click experience."
  }
];

export const metadata: Metadata = {
  title: "ROAS Calculator | Return on Ad Spend Tool",
  description: "Calculate your Return on Ad Spend (ROAS) instantly. Determine ad campaign efficiency, find your break-even ROAS, and benchmark against industry standards.",
  keywords: ["roas calculator", "return on ad spend", "advertising roi", "ad campaign performance", "marketing roas", "break even roas"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "ROAS Calculator — Ad Spend Efficiency", description: "Calculate and optimize Return on Ad Spend for any campaign." },
};

export default function RoasCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "ROAS Calculator", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">ROAS Calculator</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">Digital Marketing Tool</p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">ROAS Calculator</h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">Determine if your advertising dollars are generating profitable returns. Calculate your ROAS, find your break-even point, and compare to industry standards.</p>
        </div>
        <div className="mt-8 max-w-2xl"><PrivacyNote /></div>
      </section>

      <RoasCalculator />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">ROAS: The Advertising Efficiency Metric</h2>
          <p>Return on Ad Spend (ROAS) is the single most important campaign-level diagnostic in digital advertising. Unlike broad metrics such as impressions or clicks, ROAS connects your marketing efforts directly to revenue, telling you exactly how many dollars of revenue each advertising dollar generates.</p>
          <h3 className="text-foreground font-black italic">01. The ROAS Formula</h3>
          <p className="p-6 bg-muted/20 border-l-4 border-primary font-mono text-sm">ROAS = Revenue from Ads / Total Ad Spend</p>
          <p>A ROAS of 4x means for every $1 you spend on advertising, you generate $4 in revenue.</p>
          <h3 className="text-foreground font-black italic">02. Your Break-Even ROAS</h3>
          <p>Before scaling any campaign, you must know your break-even ROAS — the minimum return needed just to cover the cost of the products being sold (not profit, just covering the direct cost).</p>
          <p className="p-6 bg-muted/20 border-l-4 border-primary font-mono text-sm">Break-Even ROAS = 1 / Gross Profit Margin</p>
          <p>If your gross margin is 50%, you need at minimum a 2.0x ROAS to not lose money on the cost of goods. Any target ROAS must sit comfortably above this floor.</p>
          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm">ROAS vs ROI: A Critical Distinction</h3>
            <p className="opacity-80 leading-relaxed mb-0">A 4x ROAS sounds great, but it does NOT mean your campaign is profitable. If your gross margin is 30%, a 4x ROAS means you are generating $4 revenue for every $1 spent advertising, but only $1.20 of that is gross profit — barely covering your $1 ad cost. Always model ROAS in context of your specific margin structure before declaring victory.</p>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">ROAS Strategy FAQ</h2>
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
