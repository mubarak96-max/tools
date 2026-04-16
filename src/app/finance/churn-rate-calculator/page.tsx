import Link from "next/link";
import type { Metadata } from "next";
import { ChurnRateCalculator } from "./components/ChurnRateCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/churn-rate-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a good churn rate?",
    answer: "A 'good' churn rate heavily depends on your industry and customer base. For enterprise B2B SaaS companies targeting large corporations, an annual churn rate of 5-7% is excellent. For B2C subscriptions (like Netflix or Spotify), a monthly churn rate of 3-5% is typical. Anything above a 10% monthly churn rate generally signifies a critical product-market fit issue."
  },
  {
    question: "How do I calculate customer churn rate?",
    answer: "The basic formula is: (Customers Lost during a period) / (Customers at the Beginning of the period) × 100. Note that new customers acquired during that specific period are NOT included in the denominator for the basic formula, because they could not have been 'lost' from the starting pool."
  },
  {
    question: "What is the difference between Customer Churn and Revenue Churn?",
    answer: "Customer churn tracks the raw number of users who cancel or fail to renew. Revenue churn (or MRR Churn) tracks the total dollar amount lost. If you lose one enterprise client paying $5,000/month, your customer churn might be low, but your revenue churn will be dangerously high."
  },
  {
    question: "How can I reduce my churn rate?",
    answer: "The most effective ways to combat churn are: 1) Improving onboarding to ensure users find value quickly, 2) Identifying 'at-risk' behavior (like lack of logins) and proactively reaching out, 3) Locking users into annual contracts to build long-term habits, and 4) Implementing a dunning management system to catch failed credit card payments."
  }
];

export const metadata: Metadata = {
  title: "Customer Churn Rate Calculator | SaaS Retention Tool",
  description: "Calculate your customer churn and retention rates instantly. Track customers lost, analyze growth sustainability, and compare against industry benchmarks.",
  keywords: ["churn rate calculator", "customer retention rate", "saas churn", "calculate churn", "customer attrition", "retention calculator"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Customer Churn Rate Calculator — Retention Tracker", description: "Calculate customer churn rate and measure business retention." },
};

export default function ChurnRateCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Churn Rate Calculator", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Churn Rate Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">
            Startup & SaaS Tool
          </p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">
            Churn Rate Calculator
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            Measure your customer retention effectively. Calculate the percentage of users leaving your service and determine if your business is leaking revenue.
          </p>
        </div>

        <div className="mt-8 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <ChurnRateCalculator />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Understanding Churn: The Silent Killer</h2>
          <p>
            In any subscription business—whether a SaaS application, a gym, or a monthly box service—growth is heavily reliant on <strong>retention</strong>. You can spend millions acquiring thousands of new customers, but if they cancel the following month, your business is a leaky bucket.
          </p>
          
          <h3 className="text-foreground font-black italic">01. The Basic Churn Formula</h3>
          <p>
            Customer Churn Rate determines the percentage of your starting customer base that leaves over a given time period (usually tracked monthly or annually).
          </p>
          <p className="p-6 bg-muted/20 border-l-4 border-primary font-mono text-sm leading-relaxed">
            Churn Rate = (Customers Lost During Period) / (Customers at Start of Period) × 100
          </p>
          <p>
            <strong>Note:</strong> Customers acquired <em>during</em> the month are generally excluded from the denominator in standard accounting, because they were not at risk of churning for the entire period.
          </p>

          <h3 className="text-foreground font-black italic">02. Negative Churn: The Holy Grail</h3>
          <p>
            Is it possible to have "Negative Churn"? Yes, but only when calculating Revenue Churn (not Customer Churn). 
          </p>
          <ul>
            <li>If the amount of expansion revenue (upsells, cross-sells, tiered upgrades) from your <em>remaining</em> customers exceeds the revenue lost from customers who cancelled, you have achieved Negative Revenue Churn.</li>
            <li>In this state, your business will grow automatically every month even if you acquire exactly zero new customers.</li>
          </ul>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm text-balance">The Involuntary Churn Trap</h3>
             <p className="opacity-80 leading-relaxed mb-0">
               Not all customers who leave actually wanted to cancel. Up to 40% of standard B2C churn is "Involuntary"—meaning their credit card expired, their bank declined the charge, or they hit a spending limit. Employing an automated Dunning process (emailing users to update their cards) is the fastest way to instantly lower your churn rate without changing your product.
             </p>
          </div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Retention FAQ</h2>
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
