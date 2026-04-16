import Link from "next/link";
import type { Metadata } from "next";
import { CtrCalculator } from "./components/CtrCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/click-through-rate-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a good Click-Through Rate (CTR)?",
    answer: "A 'good' CTR varies wildly by industry, platform, and placement. For Google Search Ads, a good average is across 4-6%. For Google Display Network ads, average CTR is much lower, often around 0.5%. For email marketing campaigns, a typical CTR ranges from 2-5%."
  },
  {
    question: "How do you calculate Click-Through Rate (CTR)?",
    answer: "The formula is straightforward: (Total Clicks divided by Total Impressions) multiplied by 100. If your advertisement was shown 1,000 times (impressions) and clicked on 20 times (clicks), your CTR is 2%."
  },
  {
    question: "Why is CTR important for SEO and Ads?",
    answer: "In advertising platforms like Google Ads or Facebook Ads, higher CTRs directly improve your 'Quality Score'. A higher Quality Score lowers your cost-per-click (CPC) and gets your ad better placements. In SEO, organic CTR signals to search engines that your title and meta description are highly relevant to the search query."
  },
  {
    question: "How can I improve my CTR?",
    answer: "To improve CTR, test different headlines that create urgency or curiosity. Use clear, action-oriented calls-to-action (CTAs). If running display ads or social media ads, test higher-contrast imagery. For organic search, ensure your meta descriptions directly answer the user's search intent."
  }
];

export const metadata: Metadata = {
  title: "Click-Through Rate (CTR) Calculator | Ad Performance",
  description: "Calculate your Click-Through Rate (CTR) instantly. Determine the effectiveness of your ad campaigns, email marketing, and organic search impressions.",
  keywords: ["ctr calculator", "click through rate", "ad performance", "marketing calculator", "cpc optimization", "email ctr"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Click-Through Rate (CTR) Calculator — Marketing Tool", description: "Calculate CTR to measure ad and link performance." },
};

export default function CtrCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "CTR Calculator", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">CTR Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">
            Digital Marketing Tool
          </p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">
            Click-Through Rate Calculator
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            Determine exactly how effective your campaigns are. Calculate the ratio of users who clicked on your link versus the total number of users who viewed it.
          </p>
        </div>

        <div className="mt-8 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <CtrCalculator />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Understanding Click-Through Rate</h2>
          <p>
            The Click-Through Rate (CTR) is the single most important top-of-funnel diagnostic metric in digital marketing. It tells you exactly how compelling your offer, headline, and creative are to your target audience.
          </p>
          
          <h3 className="text-foreground font-black italic">01. The CTR Formula</h3>
          <p>
            The calculation for CTR is universally standard across all advertising platforms:
          </p>
          <p className="p-6 bg-muted/20 border-l-4 border-primary font-mono text-sm leading-relaxed">
            CTR = (Total Clicks / Total Impressions) × 100
          </p>
          <p>
            <strong>Impressions</strong> represent the amount of times your ad, link, or email was served to a user's screen. If an email is sent but bounces, it doesn't count as an impression.
          </p>

          <h3 className="text-foreground font-black italic">02. Platform Benchmarks</h3>
          <p>
            Comparing a display ad's CTR to a search ad's CTR or an email's CTR is comparing apples to oranges. Understanding intent is critical:
          </p>
          <ul>
            <li><strong>Search Ads (Google/Bing):</strong> Very High Intent. The user is actively searching for a solution. Average CTR ranges from <strong>4% to 8%</strong>.</li>
            <li><strong>Display Ads:</strong> Low Intent. The user is reading an article or browsing a forum, and fixing their problem is not top-of-mind. Average CTR is <strong>0.3% to 0.6%</strong>.</li>
            <li><strong>Email Marketing:</strong> Warm Intent. The user already opted-in to your list. Depending on list hygiene, a good CTR is <strong>2% to 4%</strong>.</li>
          </ul>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm text-balance">The Ad Rank Multiplier</h3>
             <p className="opacity-80 leading-relaxed mb-0">
               On platforms like Google Search and Facebook, your CTR acts as a vote of confidence from the users. If your ad achieves a 10% CTR while your competitor has a 2% CTR, the platform algorithm determines your ad is 5x more relevant. **Because algorithmic platforms want to show engaging content, they will actually charge you less per click (CPC) than your competitor.** High CTRs directly save you money.
             </p>
          </div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Marketing ROI FAQ</h2>
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
