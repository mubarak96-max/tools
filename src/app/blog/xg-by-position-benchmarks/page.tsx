
import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/xg-by-position-benchmarks";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "xG by Position: Comparing Strikers, Midfielders & Defenders",
  description: "Expected goals means something very different depending on position. This guide breaks down what good xG looks like for every role on the pitch.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "xG by Position Benchmarks — What's Good for a Striker vs Defender?",
    description: "Master the contextual analysis of xG. Learn the benchmarks for every major position in football.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Why does a striker have higher xG per 90 than a winger from the same team?",
    answer: "Strikers receive the ball in more central, closer-range positions and take more shots per 90. The structural difference in role produces systematically higher xG accumulation.",
  },
  {
    question: "Can a midfielder legitimately have higher xG per 90 than a striker?",
    answer: "Yes, if the midfielder plays in an advanced role with significant shooting responsibility, or if the 'striker' is playing in a possession-holding, link-up role rather than a finishing role. Role labels don't always match positional reality.",
  },
  {
    question: "Is xA more important than xG for full-backs?",
    answer: "For most full-backs, yes. Their attacking contribution comes primarily through chance creation, and xA captures this better than xG. Always use xG + xA combined for full-back evaluation.",
  },
  {
    question: "How do I compare a striker across different leagues?",
    answer: "Use npxG per 90 and adjust for league-level difficulty. A 0.28 npxG per 90 in the Premier League represents higher quality than the same figure in a lower-tier league. League-adjustment factors are available through some advanced analytics platforms.",
  },
];

export default function XGBlogPositionPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "xG by Position Guide", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Position Benchmarks</li>
          </ol>
        </nav>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            xG by Position: Comparing Strikers, Midfielders & Defenders
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>20 min read</span>
            <span>•</span>
            <span>Updated May 2026</span>
          </div>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="italic">Expected goals means something very different depending on where a player operates on the pitch. A striker with 0.12 xG per 90 is underperforming. A centre-back with the same figure is exceptional. This guide breaks down what good xG looks like at every position — and how to use those benchmarks to evaluate players fairly.</p>

        <hr className="my-8 border-border" />

        <h2 id="introduction-why-position-changes-everything">Introduction: Why Position Changes Everything</h2>
        <p>One of the most common mistakes in football analytics is comparing xG numbers across positions without context. A defensive midfielder accumulating 0.06 xG per 90 is doing something genuinely interesting — getting into shooting positions that most players in that role never reach. A striker with the same figure is having a deeply concerning season.</p>
        <p>Position shapes xG in two fundamental ways:</p>
        <p><strong>Opportunity volume:</strong> Strikers take more shots than midfielders, who take more shots than defenders. This creates an automatic gradient in raw xG accumulation — positions closer to goal simply see more attempts.</p>
        <p><strong>Chance quality:</strong> Different roles produce different types of chances. A striker receives through balls into the box, cutbacks, and rebounds — structurally high-quality opportunities. A full-back occasionally arrives into the box late, generating lower-quality chances from wider positions. These systematic quality differences are baked into the xG values themselves.</p>
        <p>Understanding position-specific xG benchmarks transforms the metric from an absolute number into a contextual tool. This guide gives you those benchmarks — for every major position — alongside the deeper picture of what xG can and cannot tell you about each role.</p>
        <p>Use the <strong><Link href="/utility/xg-expected-goals-calculator" className="text-primary hover:underline">free xG calculator at FindBest Tools</Link></strong> throughout this guide to explore specific shot types typical of each position.</p>

        <hr className="my-8 border-border" />

        <h2 id="how-to-read-position-xg-benchmarks">How to Read Position xG Benchmarks</h2>
        <p>All benchmarks in this guide are expressed as <strong>xG per 90 minutes</strong> (per 90) — the standard normalisation that accounts for different playing times.</p>
        <p>Two further distinctions matter:</p>
        <p><strong>Total xG per 90 vs npxG per 90:</strong> For attacking positions, non-penalty xG (npxG) is often more informative than total xG because it removes the inflation of penalty kicks. For defensive and midfield positions, the difference is usually minimal as these players rarely take penalties.</p>
        <p><strong>Team context:</strong> A striker in a dominant, high-possession team will generally accumulate higher xG per 90 than an equally skilled striker in a counter-attacking, defensive team, simply because they receive more and better service. Always consider team xG context when evaluating individual positional contributions.</p>

        <hr className="my-8 border-border" />

        <h2 id="strikers-and-centre-forwards">Strikers and Centre-Forwards</h2>
        <h3>The Role in xG Terms</h3>
        <p>Strikers are the primary consumers of high-quality chances. Their xG accumulates through a combination of:</p>
        <ul>
          <li>Central shots from inside the penalty box</li>
          <li>Tap-ins and rebounds after saves or blocks</li>
          <li>One-on-one situations after through balls</li>
          <li>Headed chances from crosses and set pieces</li>
          <li>Penalty kicks (captured in total xG but removed in npxG)</li>
        </ul>

        <h3>Benchmarks</h3>
        <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card max-w-md">
          <table className="w-full text-sm text-left border-collapse m-0">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">xG per 90 (Striker)</th>
                <th className="px-6 py-4 font-bold">Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-6 py-4">Under 0.10</td><td className="px-6 py-4">Poor — not getting into dangerous positions</td></tr>
              <tr><td className="px-6 py-4">0.10 – 0.18</td><td className="px-6 py-4">Below average</td></tr>
              <tr><td className="px-6 py-4">0.18 – 0.28</td><td className="px-6 py-4">Average top-flight striker</td></tr>
              <tr><td className="px-6 py-4">0.28 – 0.40</td><td className="px-6 py-4">Good — a consistent goal threat</td></tr>
              <tr><td className="px-6 py-4">0.40 – 0.55</td><td className="px-6 py-4">Elite — among the best in the league</td></tr>
              <tr><td className="px-6 py-4">Above 0.55</td><td className="px-6 py-4">Exceptional — typically includes significant penalty contribution</td></tr>
            </tbody>
          </table>
        </div>
        <p>For <strong>npxG per 90</strong> (removing penalties), the scale shifts down by approximately 0.03–0.08 for regular penalty takers. An elite striker averaging 0.40+ total xG per 90 with no penalty contribution is genuinely world-class.</p>

        <h3>What to Look For</h3>
        <p><strong>Chance quality vs quantity:</strong> Some strikers accumulate xG through volume — taking many shots of moderate quality. Others accumulate through fewer, higher-quality chances. Compare average xG per shot alongside total xG per 90 to distinguish the two profiles.</p>
        <p><strong>xG vs goals gap:</strong> A striker consistently scoring below their xG over a significant sample (200+ shots) may have a finishing problem. A striker consistently exceeding their xG may have genuine elite finishing skill.</p>
        <p><strong>Shot position heat map:</strong> Where are the shots coming from? A striker generating most of their xG from central positions 6–16 yards from goal is in excellent structural positions.</p>

        <h3>Exploring With the Calculator</h3>
        <p>In the <strong><Link href="/utility/xg-expected-goals-calculator" className="text-primary hover:underline">FindBest Tools xG calculator</Link></strong>, place shots typical of a striker&apos;s working area: central 10 yards, central 14 yards cutback, header from cross. Compare these to long-range shots to see how quickly xG drops outside the central box.</p>

        <hr className="my-8 border-border" />

        <h2 id="attacking-midfielders">Second Strikers and Attacking Midfielders (No. 10 Role)</h2>
        <h3>The Role in xG Terms</h3>
        <p>The classic number 10 or second striker operates between the lines, contributing both to chance creation (captured in xA — expected assists) and to finishing. Their xG per 90 is lower than a centre-forward but should still represent a genuine goal threat.</p>

        <h3>Benchmarks</h3>
        <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card max-w-md">
          <table className="w-full text-sm text-left border-collapse m-0">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">xG per 90 (AM / No. 10)</th>
                <th className="px-6 py-4 font-bold">Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-6 py-4">Under 0.07</td><td className="px-6 py-4">Low — operating primarily as a creator</td></tr>
              <tr><td className="px-6 py-4">0.07 – 0.13</td><td className="px-6 py-4">Average for an attacking midfielder</td></tr>
              <tr><td className="px-6 py-4">0.13 – 0.22</td><td className="px-6 py-4">Good — meaningful goal contribution</td></tr>
              <tr><td className="px-6 py-4">0.22 – 0.32</td><td className="px-6 py-4">Excellent — elite attacking midfielder</td></tr>
              <tr><td className="px-6 py-4">Above 0.32</td><td className="px-6 py-4">Exceptional — striker-level contribution from midfield</td></tr>
            </tbody>
          </table>
        </div>

        <h3>The xG + xA Combination</h3>
        <p>For attacking midfielders, xG alone is a misleading measure of contribution. Always evaluate the <strong>xG + xA per 90</strong> combined figure:</p>
        <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card max-w-md">
          <table className="w-full text-sm text-left border-collapse m-0">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">xG + xA per 90 (AM)</th>
                <th className="px-6 py-4 font-bold">Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-6 py-4">Under 0.30</td><td className="px-6 py-4">Below average combined contribution</td></tr>
              <tr><td className="px-6 py-4">0.30 – 0.50</td><td className="px-6 py-4">Average</td></tr>
              <tr><td className="px-6 py-4">0.50 – 0.70</td><td className="px-6 py-4">Good</td></tr>
              <tr><td className="px-6 py-4">0.70 – 0.90</td><td className="px-6 py-4">Excellent</td></tr>
              <tr><td className="px-6 py-4">Above 0.90</td><td className="px-6 py-4">Elite (top 5% in European football)</td></tr>
            </tbody>
          </table>
        </div>
        <p>Players like Kevin De Bruyne and Martin Ødegaard consistently produce combined xG + xA per 90 above 0.80 in strong seasons.</p>

        <hr className="my-8 border-border" />

        <h2 id="wingers">Wide Forwards and Wingers</h2>
        <h3>The Role in xG Terms</h3>
        <p><strong>Inverted wingers</strong> cut inside to shoot; their xG per 90 can approach striker levels. <strong>Traditional wide players</strong> primarily cross; their individual xG per 90 is lower because their shots come from wider, less central positions.</p>

        <h3>Benchmarks</h3>
        <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card max-w-md">
          <table className="w-full text-sm text-left border-collapse m-0">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">xG per 90 (Wide Forward)</th>
                <th className="px-6 py-4 font-bold">Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-6 py-4">Under 0.06</td><td className="px-6 py-4">Below average</td></tr>
              <tr><td className="px-6 py-4">0.06 – 0.12</td><td className="px-6 py-4">Average</td></tr>
              <tr><td className="px-6 py-4">0.12 – 0.20</td><td className="px-6 py-4">Good — contributing as a finisher</td></tr>
              <tr><td className="px-6 py-4">0.20 – 0.30</td><td className="px-6 py-4">Excellent — inverted winger role</td></tr>
              <tr><td className="px-6 py-4">Above 0.30</td><td className="px-6 py-4">Elite (Salah, Saka, Mbappe profile)</td></tr>
            </tbody>
          </table>
        </div>

        <hr className="my-8 border-border" />

        <h2 id="midfielders">Box-to-Box Midfielders</h2>
        <h3>The Role in xG Terms</h3>
        <p>Box-to-box midfielders contribute modest individual xG — mostly from outside the box or from late runs into the area.</p>

        <h3>Benchmarks</h3>
        <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card max-w-md">
          <table className="w-full text-sm text-left border-collapse m-0">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">xG per 90 (Box-to-Box CM)</th>
                <th className="px-6 py-4 font-bold">Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-6 py-4">Under 0.04</td><td className="px-6 py-4">Normal — midfield-focused role</td></tr>
              <tr><td className="px-6 py-4">0.04 – 0.08</td><td className="px-6 py-4">Average — occasionally shooting</td></tr>
              <tr><td className="px-6 py-4">0.08 – 0.15</td><td className="px-6 py-4">Good — meaningful goal threat</td></tr>
              <tr><td className="px-6 py-4">Above 0.15</td><td className="px-6 py-4">Exceptional — extra attacker remit</td></tr>
            </tbody>
          </table>
        </div>

        <hr className="my-8 border-border" />

        <h2 id="defensive-midfielders">Deep-Lying Midfielders and Defensive Midfielders (DM / Pivot)</h2>
        <h3>The Role in xG Terms</h3>
        <p>The holding midfielder or pivot has the lowest expected individual xG of any outfield position. Their job is ball retention and protection.</p>

        <h3>Benchmarks</h3>
        <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card max-w-md">
          <table className="w-full text-sm text-left border-collapse m-0">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">xG per 90 (DM / Holding)</th>
                <th className="px-6 py-4 font-bold">Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-6 py-4">Under 0.03</td><td className="px-6 py-4">Normal for a pure defensive role</td></tr>
              <tr><td className="px-6 py-4">0.03 – 0.06</td><td className="px-6 py-4">Average</td></tr>
              <tr><td className="px-6 py-4">0.06 – 0.10</td><td className="px-6 py-4">Good — getting into productive positions</td></tr>
              <tr><td className="px-6 py-4">Above 0.10</td><td className="px-6 py-4">Exceptional attacking remit</td></tr>
            </tbody>
          </table>
        </div>

        <hr className="my-8 border-border" />

        <h2 id="full-backs">Full-Backs and Wing-Backs</h2>
        <h3>The Role in xG Terms</h3>
        <p>Modern full-backs vary enormously. Traditional defensive full-backs take very few shots; advanced wing-backs in a 3-4-3 function almost like wide midfielders.</p>

        <h3>Benchmarks</h3>
        <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card max-w-md">
          <table className="w-full text-sm text-left border-collapse m-0">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">xG per 90 (Full-Back)</th>
                <th className="px-6 py-4 font-bold">Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-6 py-4">Under 0.02</td><td className="px-6 py-4">Traditional defensive full-back</td></tr>
              <tr><td className="px-6 py-4">0.02 – 0.05</td><td className="px-6 py-4">Average modern attacking full-back</td></tr>
              <tr><td className="px-6 py-4">0.05 – 0.10</td><td className="px-6 py-4">Good — meaningful shooting contribution</td></tr>
              <tr><td className="px-6 py-4">Above 0.10</td><td className="px-6 py-4">Exceptional or wing-back role</td></tr>
            </tbody>
          </table>
        </div>
        <p>Always use <strong>xG + xA combined</strong> for full-back evaluation. The best attacking full-backs produce combined xG + xA figures of 0.40–0.60 per 90.</p>

        <hr className="my-8 border-border" />

        <h2 id="centre-backs">Centre-Backs</h2>
        <h3>The Role in xG Terms</h3>
        <p>Almost all centre-back xG comes from set pieces. Evaluate them on <strong>xGA</strong> — their team&apos;s defensive performance in matches they play.</p>

        <h3>Benchmarks</h3>
        <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card max-w-md">
          <table className="w-full text-sm text-left border-collapse m-0">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">xG per 90 (Centre-Back)</th>
                <th className="px-6 py-4 font-bold">Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-6 py-4">Under 0.02</td><td className="px-6 py-4">Normal for standard role</td></tr>
              <tr><td className="px-6 py-4">0.02 – 0.04</td><td className="px-6 py-4">Average</td></tr>
              <tr><td className="px-6 py-4">0.04 – 0.07</td><td className="px-6 py-4">Good set-piece aerial threat</td></tr>
              <tr><td className="px-6 py-4">Above 0.07</td><td className="px-6 py-4">Exceptional goal threat from dead balls</td></tr>
            </tbody>
          </table>
        </div>

        <hr className="my-8 border-border" />

        <h2 id="goalkeepers">Goalkeepers: The xG Inverse</h2>
        <p>The relevant metric for goalkeepers is **Goals Saved Above Expected (GSaE)** or **PSxG minus Goals Allowed**:</p>
        <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card max-w-md">
          <table className="w-full text-sm text-left border-collapse m-0">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">GSaE per season</th>
                <th className="px-6 py-4 font-bold">Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-6 py-4">Below -5</td><td className="px-6 py-4">Poor — conceding more than expected</td></tr>
              <tr><td className="px-6 py-4">-5 to 0</td><td className="px-6 py-4">Average to below average</td></tr>
              <tr><td className="px-6 py-4">0 to +5</td><td className="px-6 py-4">Good — saving what should be saved</td></tr>
              <tr><td className="px-6 py-4">+5 to +10</td><td className="px-6 py-4">Elite — adding goals-prevented value</td></tr>
              <tr><td className="px-6 py-4">Above +10</td><td className="px-6 py-4">Exceptional — best keepers in the world</td></tr>
            </tbody>
          </table>
        </div>

        <hr className="my-8 border-border" />

        <h2 id="squad-analysis">Using All Positions Together: Reading a Full Squad</h2>
        <p>Apply position-specific xG benchmarks across a full squad to get a comprehensive attacking picture. A well-balanced team generates xG from multiple positions; a striker-dependent team relies heavily on a single focal point.</p>

        <hr className="my-8 border-border" />

        <h2 id="practical-apps">Practical Applications</h2>
        <p><strong>Recruitment:</strong> Compare players fairly within roles. <strong>Fantasy Football:</strong> Identify value picks with functional attacker profiles. <strong>Match Analysis:</strong> Interpret chance quality through positional context.</p>

        <hr className="my-8 border-border" />

        <h2 id="conclusion">Conclusion</h2>
        <p>xG by position is a family of position-specific benchmarks that only make sense in context. Using the right benchmark for each position turns xG from a raw number into a genuine evaluation tool.</p>
        <p>Build your positional intuition with the <strong><Link href="/utility/xg-expected-goals-calculator" className="text-primary hover:underline">free xG calculator at FindBest Tools</Link></strong> — model the specific chance types each position generates and see the hierarchy for yourself.</p>

        <hr className="my-8 border-border" />

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
