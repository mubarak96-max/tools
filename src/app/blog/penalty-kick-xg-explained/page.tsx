import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { AuthorSection } from "@/components/blog/AuthorSection";

const PAGE_PATH = "/blog/penalty-kick-xg-explained";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Penalty Kick xG: Why It's ~0.79 and Not 1.0",
  description: "Learn why professional expected goals (xG) models value a penalty at 0.79. Explore the data, psychology, and biomechanics behind football's most dramatic shot.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Penalty Kick xG Explained — Why 0.79 is the Magic Number",
    description: "Mathematics meets drama. Understand exactly why penalties aren't certain goals and how they shape xG analysis.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Why do some sources show penalty xG as 0.76 while others show 0.79?",
    answer: "Different training datasets, league coverage, and modelling approaches produce slightly different values. Both are correct within their respective models. The important thing is using a single source consistently.",
  },
  {
    question: "Do shootout penalties have lower xG?",
    answer: "Most evidence suggests slightly lower conversion rates in shootouts (approximately 72–76%) versus regular play, attributed to elevated pressure and fatigue. Most standard match xG models don't distinguish between the two.",
  },
  {
    question: "What's higher xG: a penalty or a six-yard tap-in?",
    answer: "A genuine tap-in from close range after a cutback or saved effort can exceed penalty xG, sometimes reaching 0.90+. Not all tap-ins are equal though — distance, position, and goalkeeper state all matter.",
  },
  {
    question: "Should I trust a player's penalty conversion rate to predict future performance?",
    answer: "Over small samples (under 20–25 penalties), conversion rate is heavily influenced by randomness. Over larger samples, individual skill differences do appear, but population-level ~0.79 is the best single estimate for a generic professional.",
  },
  {
    question: "Does taking penalties affect a player's npxG ranking?",
    answer: "No — npxG removes penalty contributions entirely. A player can be a high-volume penalty taker and their npxG ranking will still reflect only their open-play and non-penalty set-piece contributions.",
  },
];

export default function PenaltyXGPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Penalty xG Guide", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Penalty Analysis</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Penalty Kick xG: Why It&apos;s ~0.79 and Not 1.0
          </h1>
          <div className="pt-2">
            <AuthorSection />
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium mt-3">
              <span>10 min read</span>
              <span>•</span>
              <span>Published February 2026</span>
            </div>
          </div>
        </div>
      </header>

      <div className="[&_p]:mb-12 [&_h2]:mt-24 [&_h2]:mb-12 [&_h3]:mt-20 [&_h3]:mb-10 [&_ul]:mb-12 [&_li]:mb-6 [&_ol]:mb-12 [&_hr]:my-16 prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-0 prose-li:my-0 prose-li:leading-relaxed">
        <p className="italic text-lg text-muted-foreground">Ask any football fan whether a penalty is a good chance and they&apos;ll say yes. Ask them exactly how good, and they&apos;ll struggle to answer. The xG value for a penalty — around 0.76 to 0.79 in most professional models — tells a precise, fascinating story about risk, skill, and the mathematics of football&apos;s most dramatic single moment.</p>

        <hr className="my-12 border-border" />

        <h2 id="introduction-the-most-scrutinised-shot-in-football">Introduction: The Most Scrutinised Shot in Football</h2>
        <p>No shot in football carries more weight than a penalty kick. The stadium goes quiet. The goalkeeper dances on their line. The crowd holds its breath. It&apos;s eleven metres. It&apos;s the shooter versus the keeper. It should be a goal every time.</p>
        <p>But it isn&apos;t. And that&apos;s exactly what makes the penalty xG value so interesting.</p>
        <p>In most professional expected goals models, a standard penalty kick is valued at approximately <strong>0.76 to 0.79 xG</strong>. That means if a hundred similar penalties were taken under normal conditions, roughly 76 to 79 of them would result in goals. About 21 to 24 of them would be saved, hit the woodwork, or miss the target entirely.</p>
        <p>This guide explains exactly why that number isn&apos;t 1.0, and what it tells us about the broader metric of xG.</p>

        <hr className="my-12 border-border" />

        <h2 id="where-does-the-number-come-from">Where Does the 0.79 Number Come From?</h2>
        <p>Unlike other shot types where a computer has to look at complex factors like defender positioning and ball velocity, the penalty xG value is derived from one of the cleanest datasets in football. Because the starting position is always the same (the penalty spot), analysts can simply look at every penalty taken in history and calculate the conversion rate.</p>
        <p>Data from the Premier League, La Liga, and the Champions League consistently shows conversion rates settling in this 76–79% range over large samples. While individual seasons might fluctuate (some years might see 82%, others 74%), the &quot;true&quot; probability remains remarkably stable.</p>

        <hr className="my-12 border-border" />

        <h2 id="why-isnt-it-10-the-four-factors-of-failure">Why Isn&apos;t It 1.0? The Four Factors of Failure</h2>
        <p>If you gave a professional player a ball and an empty net from 12 yards, they would score 100 times out of 100. The reason penalty xG isn&apos;t 1.0 is because of four intervening factors:</p>
        <ol>
          <li><strong>Goalkeeper Ability:</strong> Even though the keeper starts at a massive disadvantage, they are elite athletes with wingspans of over two metres. A well-timed dive or a correctly guessed direction results in a save.</li>
          <li><strong>Psychological Pressure:</strong> The &quot;sitter&quot; paradox. Because everyone expects a goal, the pressure on the taker is immense. This manifests in physical tension, leading to scuffed contacts or panicked placements.</li>
          <li><strong>Technical Variability:</strong> Football is played on grass with a spherical ball. Small slips, bobbles, or slight miscalculations in foot placement can send the ball inches wide or over the bar.</li>
          <li><strong>The Woodwork:</strong> Roughly 2–4% of penalties hit the post or crossbar. In the pursuit of &quot;unsavable&quot; power or placement, shooters often aim for the extreme corners, where the margin for error is millimetres.</li>
        </ol>

        <hr className="my-12 border-border" />

        <h2 id="penalty-xg-and-player-statistics">Penalty xG and Player Statistics</h2>
        <p>Understanding the ~0.79 value is critical for evaluating individual players. Because penalties are such high-quality chances, they can heavily &quot;inflate&quot; a player&apos;s total xG.</p>
        <p>If a striker finishes a season with 20 xG, but 8 of those came from penalties, their <strong>npxG (non-penalty expected goals)</strong> is only 12. This tells a very different story about their ability to find space and create chances in open play compared to a striker who generated 18 xG with zero penalties.</p>

        <hr className="my-12 border-border" />

        <h2 id="shootout-penalties">Penalty xG in Shootouts</h2>
        <p>Interestingly, some research suggests that conversion rates in penalty shootouts are slightly lower than in regular-time play — often dipping into the <strong>72–76% range</strong>. Analysts attribute this to the added fatigue of 120 minutes of play and the unique, compounding pressure of a knockout scenario.</p>

        <hr className="my-12 border-border" />

        <h2 id="practice-interactive">Practice: Compare the Penalty</h2>
        <p>To see how a penalty compares to other &quot;big chances&quot; in football, use our <strong><Link href="/utility/xg-expected-goals-calculator" className="text-primary hover:underline">interactive xG calculator</Link></strong>. Place a shot on the penalty spot, then try placing one from 6 yards out but at a very narrow angle. You&apos;ll be surprised at how quickly the xG drops compared to the standard 0.79 of a penalty.</p>

        <hr className="my-12 border-border" />

        <h2 id="conclusion">Conclusion: The Benchmark of Chance Quality</h2>
        <p>The penalty xG of ~0.79 serves as the ultimate benchmark in football analytics. It is the most reliable, data-backed probability we have. By understanding why it isn&apos;t 1.0, we gain a deeper appreciation for the difficulty of scoring even &quot;easy&quot; chances, and why the metric of expected goals is such a powerful tool for measuring performance.</p>

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
