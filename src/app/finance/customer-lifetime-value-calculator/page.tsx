import Link from "next/link";
import type { Metadata } from "next";
import { ClvCalculator } from "./components/ClvCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/customer-lifetime-value-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How do I calculate Customer Lifetime Value (CLV)?",
    answer: "The standard formula is: CLV = Average Order Value × Purchase Frequency per Year × Average Customer Lifespan (in years). For example, a customer who spends $80 on average, buys 4 times per year, and stays for 3 years has a CLV of $80 × 4 × 3 = $960."
  },
  {
    question: "What is a good Customer Lifetime Value?",
    answer: "There is no universal benchmark — it depends entirely on your industry and business model. The key metric to watch is your CLV to CAC (Customer Acquisition Cost) ratio. A healthy business should have a CLV that is at least 3x its CAC, meaning every $1 spent acquiring a customer returns $3 in lifetime value."
  },
  {
    question: "How can I increase my Customer Lifetime Value?",
    answer: "The three most impactful levers are: 1) Increase average order value through upsells and bundles, 2) Increase purchase frequency with loyalty programs, subscriptions, and automated re-engagement campaigns, and 3) Extend customer lifespan by improving onboarding and customer success programs to reduce churn."
  },
  {
    question: "What is the difference between historic CLV and predictive CLV?",
    answer: "Historic CLV is calculated from actual past transaction data. It is accurate but backward-looking. Predictive CLV uses statistical models and behavioral signals to forecast how much a customer will spend in the future. Predictive CLV is more valuable for proactive marketing decisions but requires more data."
  }
];

export const metadata: Metadata = {
  title: "Customer Lifetime Value (CLV) Calculator | Revenue Predictor",
  description: "Calculate the total lifetime value of your customers. Understand long-term revenue potential, profit margins, and the CLV to CAC ratio for sustainable growth.",
  keywords: ["customer lifetime value calculator", "clv calculator", "ltv calculator", "customer revenue", "saas metrics", "clv cac ratio"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Customer Lifetime Value (CLV) Calculator", description: "Predict total customer revenue and lifetime profitability." },
};

export default function ClvCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "CLV Calculator", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">CLV Calculator</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">Startup & SaaS Tool</p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">Customer Lifetime Value Calculator</h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">Predict exactly how much revenue a single customer will generate over the course of your relationship — and whether your acquisition costs justify it.</p>
        </div>
        <div className="mt-8 max-w-2xl"><PrivacyNote /></div>
      </section>

      <ClvCalculator />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Customer Lifetime Value: Your Most Important Metric</h2>
          <p>CLV (also called LTV or CLTV) is the total net revenue a business expects from a single customer account throughout the entire business relationship. It answers the critical question every founder must know: <strong>How much is one customer worth to me?</strong></p>
          <h3 className="text-foreground font-black italic">01. The Core Formula</h3>
          <p className="p-6 bg-muted/20 border-l-4 border-primary font-mono text-sm leading-relaxed">CLV = Average Order Value × Purchase Frequency (per Year) × Customer Lifespan (Years)</p>
          <h3 className="text-foreground font-black italic">02. Why CLV Unlocks Marketing ROI</h3>
          <p>Without knowing your CLV, you are flying blind on ad spend. If you know a customer is worth $960 over their lifetime but you are currently spending $400 to acquire them (CAC of $400), you know you have a positive unit economics model. You can scale confidently because every customer generates a clear net margin.</p>
          <h3 className="text-foreground font-black italic">03. The CLV:CAC Ratio</h3>
          <p>Venture capitalists and growth investors consider a <strong>CLV:CAC ratio of 3:1 or higher</strong> to be healthy for a scalable business. A ratio below 1:1 means you are losing money on every customer. A ratio above 5:1 might indicate you are underinvesting in acquisition and leaving growth on the table.</p>
          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm">The Profit Margin Adjustment</h3>
            <p className="opacity-80 leading-relaxed mb-0">Raw CLV uses revenue, not profit. For a more accurate picture of business health, multiply your CLV by your gross profit margin percentage to get <strong>Gross Profit CLV</strong>. If your CLV is $960 but your margin is 60%, your true economic value per customer is $576 — the number you should be comparing to your CAC.</p>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">CLV Strategy FAQ</h2>
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
