import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { AuthorSection } from "@/components/blog/AuthorSection";

const PAGE_PATH = "/blog/difference-between-xg-xga-npxg-xgot";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "What's the Difference Between xG, xGA, npxG, and xGOT? The Complete Guide",
  description: "A complete guide to the expected goals family: xG, xGA, npxG, and xGOT. Learn when to use each metric and how they help you read a football match more accurately.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "xG, xGA, npxG, and xGOT Explained — Complete Guide",
    description: "Master the members of the expected goals family. Learn the difference between chance quality and shot execution.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Is npxG better than xG for comparing strikers?",
    answer: "Generally yes, for comparing open-play attacking ability. npxG removes the distortion of penalty frequency, which varies significantly between players and teams.",
  },
  {
    question: "What's a good xGOT value?",
    answer: "This depends on the model and provider. The key is comparing relative to xG — a player whose average xGOT consistently exceeds their average xG is adding value through placement.",
  },
  {
    question: "Can a goalkeeper sustainably outperform xGOT?",
    answer: "Yes, more sustainably than outperforming standard xG. xGOT is a better measure of actual goalkeeping difficulty, so a consistently low goals-conceded-to-xGOT ratio over multiple seasons is strong evidence of elite goalkeeping.",
  },
  {
    question: "Where can I find npxG and xGOT data?",
    answer: "FBref.com provides npxG data (powered by StatsBomb). xGOT is available on some premium data platforms. For learning the concepts interactively, the xG calculator at FindBest Tools is a great free starting point.",
  },
  {
    question: "Why doesn't every broadcaster show npxG and xGOT?",
    answer: "Broadcast graphics prioritise simplicity for general audiences. Total xG is already unfamiliar to many viewers; adding npxG and xGOT would confuse more people than it helps in a live broadcast context.",
  },
];

export default function XGBlogFamilyPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "xG Family Guide", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">xG Family</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            What&apos;s the Difference Between xG, xGA, npxG, and xGOT? The Complete Guide to Football&apos;s Expected Goals Family
          </h1>
          <div className="pt-2">
            <AuthorSection />
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium mt-3">
              <span>15 min read</span>
              <span>•</span>
              <span>Published December 2025</span>
            </div>
          </div>
        </div>
      </header>

      <div className="[&_p]:mb-12 [&_h2]:mt-24 [&_h2]:mb-12 [&_h3]:mt-20 [&_h3]:mb-10 [&_ul]:mb-12 [&_li]:mb-6 [&_ol]:mb-12 [&_hr]:my-16 prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-0 prose-li:my-0 prose-li:leading-relaxed">
        <p className="italic text-lg text-muted-foreground">You&apos;ve seen xG on broadcast graphics. You&apos;ve heard npxG mentioned on podcasts. You&apos;ve spotted xGOT in a match report and quietly wondered what it means. This guide explains every member of the expected goals family, when each one matters, and how to use them together to read a football match more accurately than any simple scoreline can.</p>

        <hr className="my-12 border-border" />

        <h2 id="introduction-one-metric-many-variations">Introduction: One Metric, Many Variations</h2>
        <p>Expected goals (xG) didn&apos;t arrive alone. As football analytics matured, analysts recognised that a single number couldn&apos;t capture every dimension of attacking and defensive performance. Each variation of xG was developed to answer a slightly different question:</p>
        <ul>
          <li><strong>xG</strong> — How good were the chances created?</li>
          <li><strong>xGA</strong> — How good were the chances allowed defensively?</li>
          <li><strong>npxG</strong> — How good were the chances created, without penalties inflating the numbers?</li>
          <li><strong>xGOT</strong> — How well was the shot actually executed?</li>
        </ul>
        <p>Together, these four metrics give you a far more complete picture of a team or player&apos;s performance than any single statistic. Understanding them is the difference between reading football data superficially and using it with genuine insight.</p>

        <hr className="my-12 border-border" />

        <h2 id="xg-expected-goals-the-foundation">xG — Expected Goals (The Foundation)</h2>
        <p>Before diving into the variations, a quick recap of the core metric. <strong>xG assigns every shot a probability between 0 and 1</strong>, representing how often a chance of that type scores in historical data. A 0.35 xG shot would be expected to result in a goal roughly 35% of the time under similar conditions.</p>
        <p><strong>When to use it:</strong> Use total xG to evaluate the overall quality of chances a team or player produced in a match. It is the primary indicator of whether a team &quot;deserved&quot; more or fewer goals than they actually scored.</p>

        <hr className="my-12 border-border" />

        <h2 id="xga-expected-goals-against">xGA — Expected Goals Against</h2>
        <p><strong>xGA stands for Expected Goals Against.</strong> It is simply xG from the defensive team&apos;s perspective. If Team A has 1.5 xG, Team B automatically has 1.5 xGA.</p>
        <p><strong>Why it matters:</strong> xGA is a more reliable measure of defensive quality than goals conceded. A team might concede zero goals in a match despite an xGA of 2.5, usually because of elite goalkeeping or poor finishing by the opponent. Over a season, a team with low xGA will consistently be harder to beat than one relying on luck to keep clean sheets.</p>

        <hr className="my-12 border-border" />

        <h2 id="npxg-non-penalty-expected-goals">npxG — Non-Penalty Expected Goals</h2>
        <p><strong>npxG stands for Non-Penalty Expected Goals.</strong> As the name suggests, it is total xG minus any xG attributed to penalty kicks.</p>
        <p><strong>Why it matters:</strong> Penalties are extremely high-quality chances (~0.79 xG), but they are awarded based on defensive errors and refereeing decisions, not necessarily sustained attacking pressure. Using npxG allows you to compare the <strong>open-play attacking quality</strong> of teams and players fairly.</p>
        <p><strong>The Striker Comparison Paradox:</strong> If Striker A has 18 goals from 18 xG, and Striker B has 15 goals from 15 xG, Striker A looks better. But if Striker A scored 8 penalties while Striker B scored zero, Striker B is almost certainly the superior open-play goal threat. npxG reveals this distinction immediately.</p>

        <hr className="my-12 border-border" />

        <h2 id="xgot-expected-goals-on-target">xGOT — Expected Goals On Target</h2>
        <p>While xG measures the quality of the chance <strong>at the moment the shot is taken</strong>, xGOT (also called Post-Shot xG) measures the quality of the shot <strong>after it has been struck.</strong></p>
        <p><strong>How it works:</strong> If a player takes a shot from a 0.10 xG position and hits it straight at the keeper, the xGOT might be 0.05. If they hit it into the top corner, the xGOT might jump to 0.60. xGOT only applies to shots that are actually on target.</p>
        <p><strong>Why it matters:</strong></p>
        <ul>
          <li><strong>For Players:</strong> Comparing xG to xGOT tells you about a player&apos;s <strong>finishing skill.</strong> If a player&apos;s xGOT is consistently higher than their xG, it means they are adding value by placing their shots in difficult-to-save areas of the net.</li>
          <li><strong>For Goalkeepers:</strong> xGOT is the best way to evaluate goalkeepers. The difference between the xGOT they faced and the goals they actually conceded identifies the best shot-stoppers in the league.</li>
        </ul>

        <hr className="my-12 border-border" />

        <h2 id="metrics-together">How to Use the xG Family Together</h2>
        <p>The real power of these metrics comes from comparing them to each other. Here is how an analyst might read a single match report:</p>
        <ol>
          <li><strong>Check xG vs Actual Goals:</strong> Did the scoreline reflect the quality of chances?</li>
          <li><strong>Check npxG:</strong> How much of that threat came from open play versus penalties?</li>
          <li><strong>Check xGA:</strong> How much space did the defense concede?</li>
          <li><strong>Check xGOT:</strong> Did the attackers finish poorly, or did the opposition goalkeeper have an incredible game?</li>
        </ol>

        <hr className="my-12 border-border" />

        <h2 id="practice-interactive">Practice: See the Metrics in Action</h2>
        <p>To see exactly how a shot&apos;s characteristics translate into these different values, use our <strong><Link href="/utility/xg-expected-goals-calculator" className="text-primary hover:underline">interactive xG calculator</Link></strong>. You can model different shot types and see how factors like body part and defensive pressure impact the final expected goals figure.</p>

        <hr className="my-12 border-border" />

        <h2 id="conclusion">Summary: The Right Tool for the Job</h2>
        <p>Understanding the xG family is about picking the right tool for the job. Use xG for general quality, npxG for fair comparisons, xGA for defensive assessment, and xGOT for finishing and goalkeeping analysis. Together, they tell the full story of the beautiful game.</p>

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
