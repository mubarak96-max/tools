import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { AuthorSection } from "@/components/blog/AuthorSection";

const PAGE_PATH = "/blog/fbref-vs-understat-vs-opta-xg";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "FBref vs Understat vs Opta: Why Different xG Numbers Exist",
  description: "You've looked up a match on FBref and Understat and found different xG values. This guide explains why these disagreements exist and how to handle them.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "FBref vs Understat vs Opta xG Comparison — Why the Disagreement?",
    description: "Understand the technical reasons why different xG providers show different numbers for the same shot.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Which xG provider is most accurate?",
    answer: "StatsBomb, with their detailed 360 data, generally has the richest feature set. But 'accuracy' depends on your question — for historical trend analysis, Understat's long archive is valuable. For broadcast context, Opta's data is the most widely referenced.",
  },
  {
    question: "Why does FBref sometimes show different xG for the same match on different dates?",
    answer: "Data providers often revise their data after initial publication as additional information is incorporated or data errors are corrected. Always use the most recent version of FBref data for serious analysis.",
  },
  {
    question: "Can I mix FBref and Understat data for a player comparison?",
    answer: "No. Never compare values from different providers. Choose one and use it consistently throughout your analysis.",
  },
  {
    question: "Is there a 'ground truth' xG that all providers are trying to approximate?",
    answer: "Not exactly. Each model is making slightly different design choices about what factors to include and how to weight them. There's no single 'true' xG model — rather, different models optimise for different things, which is why they legitimately disagree.",
  },
  {
    question: "Do provider disagreements matter for betting analysis?",
    answer: "For broad analytical conclusions — whether a team is overperforming their xG — provider choice matters less than consistency. For fine-grained edge-seeking in specific markets, using the richest available model (StatsBomb where possible) is preferable.",
  },
];

export default function XGBlogComparisonPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "xG Providers Comparison", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Provider Comparison</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            FBref vs Understat vs Opta: Why Different xG Numbers Exist for the Same Shot
          </h1>
          <div className="pt-2">
            <AuthorSection />
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium mt-3">
              <span>18 min read</span>
              <span>•</span>
              <span>Published April 2026</span>
            </div>
          </div>
        </div>
      </header>

      <div className="[&_p]:mb-12 [&_h2]:mt-24 [&_h2]:mb-12 [&_h3]:mt-20 [&_h3]:mb-10 [&_ul]:mb-12 [&_li]:mb-6 [&_ol]:mb-12 [&_hr]:my-16 prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-0 prose-li:my-0 prose-li:leading-relaxed">
        <p className="italic text-lg text-muted-foreground">You&apos;ve looked up a match on FBref, then checked Understat, and found different xG values. Both sites are reputable. Both are using expected goals. So why don&apos;t the numbers match? This guide explains everything — from the technical reasons for disagreement to how you should handle conflicting sources in your analysis.</p>

        <hr className="my-12 border-border" />

        <h2 id="introduction-the-confusing-reality-of-multiple-xg-providers">Introduction: The Confusing Reality of Multiple xG Providers</h2>
        <p>Imagine watching a Premier League match. The broadcast graphic shows 1.8 xG for the home team. You check FBref afterward and it says 2.1. You open Understat and it shows 1.6. You see a tweet from a data journalist citing Opta&apos;s figure of 1.9.</p>
        <p>All four numbers are for the same match. None of them are wrong. And understanding why they disagree — genuinely understanding it, not just accepting it — will make you a far more sophisticated consumer of football analytics data.</p>
        <p>The short answer: different xG providers use different data, different methodologies, and different model architectures. Like four people measuring the same room with rulers of slightly different length, they&apos;ll all get sensible answers that don&apos;t perfectly agree.</p>
        <p>The long answer fills this entire guide.</p>

        <hr className="my-12 border-border" />

        <h2 id="the-major-xg-providers-who-are-they">The Major xG Providers: Who Are They?</h2>
        <p>Before diving into why they disagree, it helps to know who the main players are:</p>

        <h3>StatsBomb (via FBref.com)</h3>
        <p><strong>StatsBomb</strong> is a football data and analytics company that collects detailed event-level data and publishes a sophisticated, multi-feature xG model. Their data is accessible to the public through <strong>FBref.com</strong> for many competitions.</p>
        <p>StatsBomb is known for collecting what they call &quot;360 data&quot; — detailed information about player and goalkeeper positioning at the moment of each event, which most competitors don&apos;t capture. This enables more context-rich xG calculations. StatsBomb is generally considered one of the most comprehensive public data providers.</p>

        <h3>Understat.com</h3>
        <p><strong>Understat</strong> is a free website that publishes xG data for the top five European leagues and a few others. Their model uses a different set of features than StatsBomb and is built independently.</p>
        <p>Understat&apos;s data is popular among fans and analysts because it&apos;s free, covers multiple seasons, and has clean visualisations. Their xG values often differ from StatsBomb&apos;s, sometimes noticeably.</p>

        <h3>Opta (via various platforms: SofaScore, WhoScored, Sky Sports, ESPN)</h3>
        <p><strong>Opta</strong> (now part of StatsPerform) is one of the largest sports data companies in the world, supplying data to broadcasters, clubs, and media organisations globally. Their xG model powers broadcast graphics on Sky Sports and ESPN, among others.</p>
        <p>Opta&apos;s proprietary model is not fully disclosed, but they collect extensive event data across a huge range of competitions. Their xG figures are what most casual fans see via broadcast graphics and major sports websites.</p>

        <h3>Other Providers</h3>
        <ul>
          <li><strong>Wyscout</strong> (now part of StatsPerform): Used extensively by European football clubs for scouting and analysis</li>
          <li><strong>InStat:</strong> Popular in Eastern Europe and for lower-league data</li>
          <li><strong>Ateam / Metrica Sports:</strong> Provide tracking-data-enhanced models in some contexts</li>
          <li><strong>Club-built models:</strong> Many top clubs (Manchester City, Liverpool, Barcelona) have built proprietary internal xG models whose outputs never become public</li>
        </ul>

        <hr className="my-12 border-border" />

        <h2 id="why-the-numbers-differ-five-core-reasons">Why the Numbers Differ: Five Core Reasons</h2>

        <h3>Reason 1: Different Input Features</h3>
        <p>This is the most fundamental source of disagreement. <strong>Different models include different variables in their xG calculations.</strong></p>
        <p>All major models include the basics: distance to goal, angle to goal, and body part used. But beyond these, providers diverge significantly.</p>
        <p><strong>StatsBomb&apos;s enhanced features:</strong></p>
        <ul>
          <li>Goalkeeper position at the moment of the shot (their 360 data captures this)</li>
          <li>Defensive pressure from nearby players (with detailed positional information)</li>
          <li>Distance and position of the closest defender</li>
          <li>Whether the goalkeeper was &quot;unsighted&quot; by a screen</li>
        </ul>
        <p>These additional features — particularly goalkeeper positioning — can significantly alter xG values for certain shots. A chip or a shot when the goalkeeper is off their line will receive a much higher StatsBomb xG than a provider who doesn&apos;t capture goalkeeper position.</p>
        <p>The practical result: the same shot can receive meaningfully different xG values because one model &quot;sees&quot; factors the other doesn&apos;t.</p>

        <h3>Reason 2: Different Training Data</h3>
        <p>Machine learning models learn from historical shot data. <strong>The models&apos; outputs depend heavily on what data they were trained on.</strong></p>
        <ul>
          <li><strong>Dataset size:</strong> A model trained on 2 million shots will generally have better statistical calibration than one trained on 200,000 shots. Larger datasets smooth out noise and allow more reliable probability estimates for rare situations.</li>
          <li><strong>Competition coverage:</strong> A model trained primarily on the English Premier League will have learned patterns specific to that competition. Applied to La Liga or the Bundesliga, it may systematically over- or underestimate xG because playing styles, defensive structures, and goalkeeping tendencies differ between leagues.</li>
          <li><strong>Historical period:</strong> Shot patterns have changed over time as teams have become more sophisticated in set-piece routines, high-pressing tactics, and chance creation from specific zones. A model trained on data from 2005–2015 may produce different values than one trained on 2015–2024 data.</li>
          <li><strong>Data collection methodology:</strong> How a shot&apos;s characteristics are recorded affects model training. Was &quot;defensive pressure&quot; collected as a binary (yes/no) or a continuous measure? Was the shot location marked as a precise coordinate or assigned to a zone? These coding choices affect what the model learns.</li>
        </ul>

        <h3>Reason 3: Different Model Architectures</h3>
        <p>Even with identical data and identical features, different modelling approaches produce different outputs.</p>
        <ul>
          <li><strong>Logistic regression:</strong> Simple, interpretable, well-calibrated on average. May miss complex interaction effects between variables.</li>
          <li><strong>Random forests / Gradient boosting:</strong> Can capture non-linear interactions. For example, the effect of distance might interact differently with shot pressure at different angles — a boosted tree model can learn these patterns, while logistic regression applies fixed linear weights.</li>
          <li><strong>Neural networks:</strong> Highly flexible, can learn extremely complex patterns. Requires large training sets to avoid overfitting. Less interpretable — harder to understand why a particular shot received a certain value.</li>
          <li><strong>Bayesian models:</strong> Some researchers use Bayesian approaches that explicitly model uncertainty rather than producing a single point estimate.</li>
        </ul>

        <h3>Reason 4: Different Calibration Decisions</h3>
        <p>All models need to be calibrated — meaning the output probabilities need to align with real-world scoring rates. A model that assigns 0.30 xG to a class of shots should see those shots score about 30% of the time in the data.</p>
        <p>Providers make different calibration decisions, producing different final outputs even from similar underlying models.</p>

        <h3>Reason 5: Different Data Collection Methods</h3>
        <p>Finally, <strong>the raw event data itself can vary between providers</strong>, separate from any modelling decisions.</p>
        <p>Did Collector A record the shot location as the point of contact with the ball, or the position of the player&apos;s feet? Are coordinate systems aligned — does (0,0) represent the same corner of the pitch for both providers?</p>
        <p>When a player takes a shot from &quot;just outside the penalty box,&quot; did both providers record it as inside or outside? Shot location ambiguity in live data collection is real, and small location differences propagate into meaningful xG differences.</p>

        <hr className="my-12 border-border" />

        <h2 id="a-direct-comparison-how-different-are-the-numbers">A Direct Comparison: How Different Are the Numbers?</h2>
        <p>Research comparing provider xG values on the same matches has found:</p>
        <ul>
          <li><strong>On average, across large samples:</strong> Different providers&apos; xG totals correlate strongly with each other. A match that StatsBomb records as having 2.1 xG will likely show up as somewhere between 1.7 and 2.5 on Understat, not wildly outside that range.</li>
          <li><strong>For individual shots:</strong> Disagreement can be substantial. A shot that StatsBomb values at 0.35 xG — because they&apos;ve captured that the goalkeeper was off their line — might be valued at 0.18 by Understat, which doesn&apos;t have that information.</li>
          <li><strong>For set pieces:</strong> This is where disagreement tends to be largest. Corner kicks, free kicks, and complex set-piece situations have many variables that different providers capture differently.</li>
          <li><strong>For open-play central shots:</strong> Disagreement tends to be smaller. The geometry is clear enough that simple and complex models often agree.</li>
        </ul>

        <hr className="my-12 border-border" />

        <h2 id="what-this-means-for-analysis-practical-rules">What This Means for Analysis: Practical Rules</h2>
        <h3>Rule 1: Never Compare Across Providers</h3>
        <p>This cannot be overstated. <strong>A 0.30 xG from StatsBomb is not the same as a 0.30 xG from Understat.</strong> Comparing a player&apos;s xG from two different sources is like comparing weights measured in kilograms versus pounds — the numbers look similar but represent different things. Always pick a single provider and use it consistently for all comparisons within a piece of analysis.</p>

        <h3>Rule 2: The Direction Is More Reliable Than the Magnitude</h3>
        <p>While exact values differ between providers, <strong>directional conclusions tend to hold across sources.</strong> If five major providers all agree that Team A outperformed Team B in xG over a season, that conclusion is robust. If one provider shows it and two others don&apos;t, it&apos;s worth scepticism.</p>

        <h3>Rule 3: Understand What Your Chosen Source Captures</h3>
        <p>Before relying on a provider&apos;s xG data for analysis, understand what they do and don&apos;t include in their model. For understanding chance quality and building analytical intuition, the <strong><Link href="/utility/xg-expected-goals-calculator" className="text-primary hover:underline">free xG calculator at FindBest Tools</Link></strong> uses a transparent educational model — you can see exactly which factors are included and how they&apos;re weighted, making it ideal for learning how the inputs drive the output.</p>

        <h3>Rule 4: Large Samples Reduce Provider Disagreement</h3>
        <p>Individual shot xG values can differ substantially between providers. But over a full season&apos;s worth of shots (400–600 per team), the aggregated xG totals tend to converge more closely. The errors and disagreements partially cancel out.</p>

        <hr className="my-12 border-border" />

        <h2 id="the-fbref-vs-understat-vs-broadcast-graphic-reconciliation">The FBref vs Understat vs Broadcast Graphic Reconciliation</h2>
        <p>The most common practical question is: &quot;Why does the xG on the television not match FBref, and which should I trust?&quot;</p>
        <ul>
          <li><strong>Broadcast graphic (Opta):</strong> Based on Opta&apos;s proprietary model. Does not include goalkeeper positioning (in standard public model). Reliable for general match-level assessment.</li>
          <li><strong>FBref (StatsBomb):</strong> More detailed feature set including goalkeeper position. Excellent for in-depth player and team analysis.</li>
          <li><strong>Understat:</strong> Completely free with historical archives. Good for trend analysis over multiple seasons.</li>
        </ul>
        <p><strong>Which to trust?</strong> None is definitively &quot;correct&quot; — they&apos;re all valid measurements using different rulers. For rigorous analysis, pick the one with the richest data available for your question.</p>

        <hr className="my-12 border-border" />

        <h2 id="how-clubs-handle-multiple-models">How Clubs Handle Multiple Models</h2>
        <p>Professional football clubs often build their own internal xG models or subscribe to multiple data providers simultaneously. Rather than trusting a single source, analysts cross-reference key shots, use ensemble approaches (aggregating multiple models), and build proprietary models using tracking data that can incorporate dozens of factors that event-based models miss.</p>

        <hr className="my-12 border-border" />

        <h2 id="the-academic-perspective-how-significant-is-the-disagreement">The Academic Perspective: How Significant Is the Disagreement?</h2>
        <p>Studies comparing major providers typically find <strong>correlation coefficients of 0.85–0.95</strong> between providers&apos; match-level xG totals. At the individual shot level, correlations are lower — often around 0.70–0.85 — reflecting the genuine differences in what each model captures. The practical conclusion: for big-picture questions choice of provider matters less than consistency.</p>

        <hr className="my-12 border-border" />

        <h2 id="what-this-means-for-the-casual-fan">What This Means for the Casual Fan</h2>
        <p>For almost every question a casual fan wants to answer, <strong>any reputable single source will serve you well</strong>, provided you use it consistently. For building intuition about how xG works across all scenarios, the <strong><Link href="/utility/xg-expected-goals-calculator" className="text-primary hover:underline">free xG calculator at FindBest Tools</Link></strong> is ideal. It uses a transparent model where every input is visible, giving you full control over the methodology as you learn.</p>

        <hr className="my-12 border-border" />

        <h2 id="conclusion">Conclusion: Different Rulers, Same Room</h2>
        <p>The fact that FBref, Understat, and Opta give different xG values for the same shot isn&apos;t a scandal. It&apos;s a natural consequence of different organisations building different tools for slightly different purposes. Understanding why they disagree turns provider disagreement from a source of confusion into a source of insight. Pick a source, understand what it measures, use it consistently, and recognise that the direction of conclusions matters more than the exact decimal.</p>

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
