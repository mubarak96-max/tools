import Link from "next/link";
import type { Metadata } from "next";
import { CpcCpmCalculator } from "./components/CpcCpmCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/cpc-cpm-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is the difference between CPC and CPM?",
    answer: "CPC stands for 'Cost Per Click', meaning you only pay the advertising platform when a user actually clicks your ad. CPM stands for 'Cost Per Mille' (Cost Per Thousand Impressions), meaning you pay a flat rate every time your ad is shown 1,000 times, regardless of how many people click it."
  },
  {
    question: "When should I use a CPC billing model?",
    answer: "CPC is best for direct-response performance marketing, where your goal is to drive immediate traffic to a landing page to generate sales or leads. Because you only pay for clicks, it guarantees you get traffic for your budget."
  },
  {
    question: "When should I use a CPM billing model?",
    answer: "CPM is ideal for brand awareness campaigns where the goal is simply visibility. If you have an incredibly high-performing ad with a massive Click-Through Rate (CTR), paying via CPM can actually become much cheaper per click than paying via CPC."
  },
  {
    question: "How do I optimize my ad spend?",
    answer: "Optimizing ad spend requires a dual strategy: increasing your Click-Through Rate (CTR) lowers your cost on platforms like Google Search, while increasing your landing page Conversion Rate (CVR) ensures the clicks you pay for actually turn into revenue."
  }
];

export const metadata: Metadata = {
  title: "CPC & CPM Calculator | Ad Spend Analytics",
  description: "Calculate your Cost Per Click (CPC) and Cost Per Mille (CPM) instantly. Analyze ad campaign costs, impressions, and click-through performance.",
  keywords: ["cpc calculator", "cpm calculator", "cost per click", "cost per mille", "ad spend calculator", "marketing analytics"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "CPC & CPM Calculator — Ad Spend Analytics", description: "Calculate advertising CPC and CPM rates." },
};

export default function CpcCpmCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "CPC/CPM Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd && <JsonLd data={serializeJsonLd(faqJsonLd)} />}

      <section className="space-y-4 py-2 sm:py-4 text-balance">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li className="opacity-50">/</li>
            <li><Link href="/finance" className="hover:text-primary transition-colors">Finance</Link></li>
            <li className="opacity-50">/</li>
            <li className="text-foreground font-medium">CPC & CPM Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">
            Digital Marketing Tool
          </p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">
            CPC & CPM Calculator
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            Analyze your advertising budget efficiency. Calculate Cost Per Click and Cost per Thousand Impressions based on your total spend.
          </p>
        </div>

        <div className="mt-8 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <CpcCpmCalculator />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Decoding Ad Spend: CPC vs CPM</h2>
          <p>
            Whether you are running Google Search Ads, Facebook Video Ads, or programmatic display banners, understanding the relationship between your Total Spend, Impressions, and Clicks is the foundation of profitable media buying.
          </p>
          
          <h3 className="text-foreground font-black italic">01. Cost Per Click (CPC)</h3>
          <p>
            CPC is the exact cost you pay for a single user to click your advertisement.
          </p>
          <p className="p-6 bg-muted/20 border-l-4 border-primary font-mono text-sm leading-relaxed">
            CPC = Total Ad Spend / Total Clicks
          </p>
          <p>
            The CPC bidding model removes the risk of paying for impressions that no one engages with. It is the gold standard for performance marketing, especially on high-intent platforms like Google Search.
          </p>

          <h3 className="text-foreground font-black italic">02. Cost Per Mille (CPM)</h3>
          <p>
            "Mille" is the Latin word for 1,000. CPM represents how much it costs to have your ad shown 1,000 times (impressions).
          </p>
          <p className="p-6 bg-muted/20 border-l-4 border-primary font-mono text-sm leading-relaxed">
            CPM = (Total Ad Spend / Total Impressions) × 1000
          </p>
          <p>
            The CPM bidding model is best suited for massive brand-awareness campaigns. Because the platform charges you regardless of clicks, it incentivizes you to create highly engaging, clickable ad creatives to squeeze as much value from those 1,000 views as possible.
          </p>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm text-balance">The Secret Mathematical Link</h3>
             <p className="opacity-80 leading-relaxed mb-0">
               CPC and CPM are permanently tethered together by your Click-Through Rate (CTR). The relationship is strictly mathematical: **CPC = CPM / (CTR × 10)**. If your campaign is bidding on a CPM model and you launch a new ad creative that doubles your click-through rate, your effectively paid CPC will drop by exactly 50%.
             </p>
          </div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Marketing Budget FAQ</h2>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-2 text-balance">
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
