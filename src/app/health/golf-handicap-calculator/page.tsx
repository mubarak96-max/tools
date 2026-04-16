import Link from "next/link";
import type { Metadata } from "next";
import { GolfHandicapCalculator } from "./components/GolfHandicapCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/golf-handicap-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a good golf handicap?",
    answer: "A golf handicap of 0 means you are a 'scratch golfer' — playing to the expected standard of a course. A handicap of 18 is considered an 'average' golfer. Most recreational players carry handicaps between 10 and 28. A handicap below 10 is considered 'good', while single digits (under 10) puts you in the top ~20% of all registered golfers worldwide."
  },
  {
    question: "How is a golf handicap calculated?",
    answer: "The World Handicap System (WHS) uses your best 8 out of your last 20 score differentials. A Score Differential is calculated as: (Adjusted Gross Score - Course Rating) × 113 / Slope Rating. Your Handicap Index is then the average of those best 8 differentials, multiplied by 0.96 (a small adjustment factor)."
  },
  {
    question: "What is the Course Rating?",
    answer: "Course Rating is the expected score for a scratch golfer (0 handicap) under normal player and course conditions on that specific golf course. It accounts for course length and obstacles. It is typically a number very close to par (e.g., 71.5 for a par-72 course)."
  },
  {
    question: "What is the Slope Rating?",
    answer: "Slope Rating measures the relative difficulty of a golf course for a bogey golfer compared to a scratch golfer. It ranges from 55 (easiest) to 155 (hardest), with 113 being the 'standard' difficulty. A course with a slope of 130 is significantly harder for high-handicap players than for scratch players."
  }
];

export const metadata: Metadata = {
  title: "Golf Handicap Calculator | WHS Handicap Index Tool",
  description: "Calculate your official Golf Handicap Index using the World Handicap System (WHS). Enter scores, course rating, and slope to get your accurate handicap differential.",
  keywords: ["golf handicap calculator", "handicap index", "whs handicap", "score differential", "golf handicap formula", "course rating slope"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Golf Handicap Calculator — WHS Index Tool", description: "Calculate your official golf handicap index using the World Handicap System." },
};

export default function GolfHandicapPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Golf Handicap Calculator", path: PAGE_PATH },
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
            <li><Link href="/health" className="hover:text-primary transition-colors">Health</Link></li>
            <li className="opacity-50">/</li>
            <li className="text-foreground font-medium">Golf Handicap Calculator</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">Sports Tool</p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">Golf Handicap Calculator</h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">Calculate your World Handicap System (WHS) Handicap Index from your score history. Enter up to 20 rounds to find your official Handicap Index.</p>
        </div>
        <div className="mt-8 max-w-2xl"><PrivacyNote /></div>
      </section>

      <GolfHandicapCalculator />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">How Golf Handicaps Work: The WHS System</h2>
          <p>The <strong>World Handicap System (WHS)</strong>, launched in 2020, unified six different handicap systems used globally into one standardized approach. It ensures that a golfer with an index of 12.0 is genuinely equivalent in skill level whether they play in Scotland, Japan, or the United States.</p>

          <h3 className="text-foreground font-black italic">01. The Score Differential</h3>
          <p>The fundamental unit of measure in the WHS is the <strong>Score Differential</strong>. It normalizes your raw score to account for both the difficulty of the specific course you played (Course Rating) and how much harder it is for average golfers versus scratch golfers (Slope Rating).</p>
          <p className="p-6 bg-muted/20 border-l-4 border-primary font-mono text-sm">Score Differential = (Adjusted Gross Score - Course Rating) × 113 / Slope Rating</p>

          <h3 className="text-foreground font-black italic">02. Handicap Index Calculation</h3>
          <p>Once you have at least 3 differentials recorded, the WHS system takes your best recent differentials (based on how many you have) and averages them.</p>
          <ul>
            <li>With 3–4 rounds: Best 1 differential</li>
            <li>With 5–6 rounds: Best 2 differentials</li>
            <li>With 7–8 rounds: Best 2 differentials</li>
            <li>With 19–20 rounds: Best 8 differentials (the maximum set)</li>
          </ul>
          <p>The average of those best differentials is then multiplied by <strong>0.96</strong> (the "playing conditions adjustment") to produce the final Handicap Index.</p>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm">The Slope Rating Explained</h3>
            <p className="opacity-80 leading-relaxed mb-0">The Slope Rating is the most misunderstood number on a golf scorecard. A slope of 113 is the "standard" difficulty. A course rated 130 means that a bogey golfer (roughly a 20 handicap) finds it proportionally much harder than a scratch golfer does. This means playing on a high-slope course can produce a lower Score Differential (better) than playing the same raw score on an easy course — rewarding golfers who tackle harder tracks.</p>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Golf Handicap FAQ</h2>
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

      <RelatedToolsSection category="Health" categoryHref="/health" currentPath={PAGE_PATH} />
    </div>
  );
}
