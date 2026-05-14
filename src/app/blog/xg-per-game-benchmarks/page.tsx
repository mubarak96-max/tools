import Link from "next/link";
import { AuthorSection } from "@/components/blog/AuthorSection";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/xg-per-game-benchmarks";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "xG Per Game: What's a Good Number for Teams and Players?",
  description: "Expected goals numbers mean little without context. This guide gives you the benchmarks for teams, players, and positions to interpret any xG figure.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "xG Per Game Benchmarks — What's a Good Number?",
    description: "Learn the benchmarks for match totals, team averages, and player rates to master expected goals analysis.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "What's a good combined xG for a match?",
    answer: "Around 2.5–3.5 combined is normal for a top-flight match. Above 4.0 indicates a particularly open game; below 2.0 suggests a cagey, low-chance affair.",
  },
  {
    question: "How many goals should a player score relative to their xG?",
    answer: "Over large samples, most players score within 10–15% of their xG total. Elite finishers can sustainably outperform by 5–10%. Consistent outperformance of 20%+ over multiple seasons is rare.",
  },
  {
    question: "Is 0.5 xG per 90 realistic for a striker?",
    answer: "Over full seasons, it's exceptional territory — typically only achieved by the very best forwards, and often with penalty contributions. An npxG per 90 of 0.4+ across a full season is truly elite.",
  },
  {
    question: "What xG should I target for my fantasy football striker?",
    answer: "Generally, look for forwards generating at least 0.20 npxG per 90 in a team that averages 1.4+ xG per match. This combination suggests regular individual contributions.",
  },
  {
    question: "Do these benchmarks apply to women's football?",
    answer: "The direction of the relationships is the same, but the absolute numbers may differ. Women's top-flight football uses the same xG methodology; league-specific benchmarks should be verified.",
  },
];

export default function XGBenchmarksPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "xG Benchmarks", path: PAGE_PATH },
  ]);

  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <header className="mb-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">xG Benchmarks</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            xG Per Game: What&apos;s a Good Number for Teams and Players?
          </h1>
          <div className="pt-2">
            <AuthorSection />
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium mt-3">
              <span>15 min read</span>
              <span>•</span>
              <span>Published March 2026</span>
            </div>
          </div>
        </div>
      </header>

      <div className="[&_p]:mb-12 [&_h2]:mt-24 [&_h2]:mb-12 [&_h3]:mt-20 [&_h3]:mb-10 [&_ul]:mb-12 [&_li]:mb-6 [&_ol]:mb-12 [&_hr]:my-16 prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-0 prose-li:my-0 prose-li:leading-relaxed">
        <p className="italic text-lg text-muted-foreground">Expected goals numbers mean little without context. &quot;1.4 xG&quot; tells you almost nothing unless you know what&apos;s normal. This guide gives you the benchmarks — for teams, players, and positions — so you can immediately interpret any xG figure you encounter.</p>

        <hr className="my-12 border-border" />

        <h2 id="introduction-context-makes-xg-useful">Introduction: Context Makes xG Useful</h2>
        <p>One of the most common stumbling blocks for people learning about expected goals is the absence of context. You read that a team generated 1.7 xG in a match, or that a midfielder averages 0.12 xG per 90 minutes. But without knowing what a typical figure looks like, those numbers are difficult to evaluate.</p>
        <p>This guide provides the benchmarks you need across every dimension of expected goals: match totals, team per-game averages, player per-90-minute rates by position, and seasonal totals for different competition levels. By the end, you&apos;ll be able to pick up any xG figure and immediately assess whether it&apos;s impressive, average, or concerning.</p>

        <hr className="my-12 border-border" />

        <h2 id="match-totals-combined-xg">Match Totals: Combined xG</h2>
        <p>In most professional leagues, the combined xG of both teams in a single match typically lands between <strong>2.0 and 3.5.</strong></p>
        <ul>
          <li><strong>Under 1.5 Combined xG:</strong> A very &quot;cagey&quot; match with few clear chances. Often seen in high-stakes finals or between two defensive-minded teams.</li>
          <li><strong>2.5 – 3.5 Combined xG:</strong> A normal, standard top-flight football match.</li>
          <li><strong>Above 4.0 Combined xG:</strong> A highly open, &quot;end-to-end&quot; game where both defences struggled to contain the opposition.</li>
        </ul>

        <hr className="my-12 border-border" />

        <h2 id="team-benchmarks-per-game">Team Benchmarks: Per Game Averages</h2>
        <p>Over the course of a 38-game season, a team&apos;s average xG per match is the best indicator of their true performance level.</p>

        <h3>Attacking xG (Per Match)</h3>
        <ul>
          <li><strong>Under 1.0:</strong> Poor attacking output. Typically associated with teams in a relegation battle.</li>
          <li><strong>1.2 – 1.4:</strong> Average for a mid-table side in a major European league.</li>
          <li><strong>1.6 – 1.9:</strong> Strong attacking output. Typical for teams challenging for European qualification.</li>
          <li><strong>Above 2.0:</strong> Elite. Only the top 2–3 teams in a league (like Manchester City, Liverpool, or Bayern Munich) consistently maintain an average this high.</li>
        </ul>

        <h3>Defensive xGA (Expected Goals Against)</h3>
        <ul>
          <li><strong>Under 1.0:</strong> Elite defence. Extremely difficult to score against.</li>
          <li><strong>1.2 – 1.4:</strong> Good, solid defence.</li>
          <li><strong>Above 1.7:</strong> Concerning. High risk of conceding multiple goals per match.</li>
        </ul>

        <hr className="my-12 border-border" />

        <h2 id="player-benchmarks-per-90">Player Benchmarks: xG Per 90 Minutes</h2>
        <p>Because players have different amounts of game time, analysts use <strong>xG per 90 minutes</strong> to compare them fairly.</p>

        <h3>Strikers and Forwards</h3>
        <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card max-w-md">
          <table className="w-full text-sm text-left border-collapse m-0">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">xG per 90 (Forward)</th>
                <th className="px-6 py-4 font-bold">Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-6 py-4">Under 0.20</td><td className="px-6 py-4">Low goal threat for primary attacker</td></tr>
              <tr><td className="px-6 py-4">0.30 – 0.45</td><td className="px-6 py-4">Good, consistent goal threat</td></tr>
              <tr><td className="px-6 py-4">Above 0.60</td><td className="px-6 py-4">Elite (Golden Boot contender)</td></tr>
            </tbody>
          </table>
        </div>

        <h3>Midfielders and Other Positions</h3>
        <ul>
          <li><strong>Attacking Midfielders:</strong> 0.15 – 0.25 is considered a very strong threat.</li>
          <li><strong>Central Midfielders:</strong> 0.05 – 0.12 is typical for box-to-box players.</li>
          <li><strong>Centre-Backs:</strong> 0.02 – 0.06 is normal, with most of this coming from set-piece headers.</li>
        </ul>

        <hr className="my-12 border-border" />

        <h2 id="seasonal-totals">Seasonal Totals: The 20 xG Club</h2>
        <p>In a major 38-game league season, reaching <strong>20.0 xG</strong> (excluding penalties) is the gold standard for individual performance. Very few players achieve this in a single campaign. When a player does, they are usually among the most valuable assets in world football.</p>

        <hr className="my-12 border-border" />

        <h2 id="xg-for-fantasy-managers">xG for Fantasy Managers (FPL)</h2>
        <p>For fantasy football players, these benchmarks are the &quot;secret sauce.&quot; If you see a mid-priced midfielder suddenly averaging 0.35 xG over a 4-game spell, they are a high-priority transfer target, even if they haven&apos;t scored yet. The goals are almost certainly coming.</p>
        <p>Conversely, if a striker has scored 5 goals in 3 games but their xG per 90 is only 0.15, they are likely on a lucky &quot;hot streak&quot; that will soon end. This is often the best time to sell them before their price drops.</p>

        <hr className="my-12 border-border" />

        <h2 id="practice-interactive">Practice: Calibrate Your Eyes</h2>
        <p>To see what these numbers &quot;look like&quot; on a pitch, use our <strong><Link href="/utility/xg-expected-goals-calculator" className="text-primary hover:underline">interactive xG calculator</Link></strong>. Try to create a &quot;team performance&quot; by placing 12–15 shots of various qualities and see if you can hit a total of 1.7 xG. This will help you visualise exactly how much work a team has to do to reach an &quot;above average&quot; total.</p>

        <hr className="my-12 border-border" />

        <h2 id="conclusion">Conclusion: Context is King</h2>
        <p>xG numbers mean little in isolation. By using these benchmarks — match totals of 2.5+, team averages of 1.6+, and striker rates of 0.40+ — you can immediately place any figure into its proper context. This turns expected goals from a confusing statistic into a powerful tool for understanding the true hierarchies of football.</p>

        <hr className="my-12 border-border" />

        <h2 id="faq" className="mt-20 scroll-mt-20 mb-12 text-center text-foreground uppercase tracking-widest text-sm">Frequently Asked Questions</h2>
        <div className="grid gap-6">
          {faq.map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-[1.5rem] p-6 hover:shadow-lg transition-all duration-300">
              <h4 className="text-lg font-bold text-foreground mb-3">{item.question}</h4>
              <p className="m-0 text-muted-foreground leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
