import Link from "next/link";
import { AuthorSection } from "@/components/blog/AuthorSection";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/what-is-xg-in-football";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "What is xG in Football? A Complete Beginner's Guide",
  description: "Football analytics has transformed the way we understand the beautiful game. At the centre of that transformation sits xG, or expected goals.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "What is xG in Football? — Complete Beginner's Guide",
    description: "Everything you need to know about xG: how it works, what the numbers tell you, and how to use an xG calculator.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Is xG the same in football and soccer?",
    answer: "Yes. Football and soccer are the same sport. xG means exactly the same thing regardless of which word you use.",
  },
  {
    question: "Who invented xG?",
    answer: "No single person invented it. It evolved from academic probability research in the 1990s and football analytics blogging in the 2000s–2010s, with contributors like Howard Hamilton and Sander Ijtsma playing key roles in making it accessible.",
  },
  {
    question: "Where can I find xG data for free?",
    answer: "FBref.com, Understat.com, and FotMob all provide free xG data for major European leagues. For exploring how xG is calculated, the interactive calculator at FindBest Tools is an excellent free resource.",
  },
  {
    question: "Does xG work for lower leagues?",
    answer: "In principle yes, but data quality decreases in lower divisions. Models trained on top-flight data may be less accurate when applied to leagues with fewer data points.",
  },
  {
    question: "Can a team consistently outperform their xG?",
    answer: "Over small samples, yes — frequently. Over a full season, most teams and players regress toward their xG totals. Some elite finishers do appear to sustainably outperform xG, but the effect is smaller than most assume.",
  },
];

export default function XGBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "What is xG in Football?", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">xG Guide</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            What is xG in Football? A Complete Beginner&apos;s Guide
          </h1>
          <div className="pt-2">
            <AuthorSection />
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium mt-3">
              <span>12 min read</span>
              <span>•</span>
              <span>Published November 2025</span>
            </div>
          </div>
        </div>
      </header>

      <div className="[&_p]:mb-12 [&_h2]:mt-24 [&_h2]:mb-12 [&_h3]:mt-20 [&_h3]:mb-10 [&_ul]:mb-12 [&_li]:mb-6 [&_ol]:mb-12 [&_hr]:my-16 prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-0 prose-li:my-0 prose-li:leading-relaxed">
        <p className="italic text-lg text-muted-foreground">Football analytics has transformed the way we understand the beautiful game. At the centre of that transformation sits one metric above all others: xG, or expected goals. If you&apos;ve ever wondered what the number next to a team&apos;s name means on a match graphic, or why your favourite pundit keeps saying &quot;the xG tells a different story,&quot; this guide is for you.</p>

        <hr className="my-12 border-border" />

        <h2 id="introduction-why-xg-matters">Introduction: Why xG Matters</h2>
        <p>Picture this: your team hits the post three times, dominates possession, and creates chance after chance — yet loses 1–0 to a breakaway goal. The scoreline says you lost. But did you really play badly?</p>
        <p>Expected goals (xG) gives you a way to answer that question honestly. It strips away luck, goalkeeping heroics, and freak deflections to tell you something more fundamental: <strong>how good were the chances each team created?</strong></p>
        <p>Since breaking into mainstream football coverage around 2017–2018, xG has gone from an analytics niche to a standard broadcast graphic on Sky Sports, BT Sport, and ESPN. Understanding it doesn&apos;t require a statistics degree — it just requires an appreciation for the fact that not all shots are created equal.</p>

        <hr className="my-12 border-border" />

        <h2 id="what-does-xg-stand-for">What Does xG Stand For?</h2>
        <p><strong>xG stands for Expected Goals.</strong> The &quot;x&quot; follows a common convention in statistics and mathematics where &quot;x&quot; denotes an expected or unknown value. You&apos;ll see the same convention in related metrics like xA (expected assists), xGA (expected goals against), and xGOT (expected goals on target).</p>
        <p>Every shot in a football match is assigned a probability value between 0 and 1.</p>
        <ul>
          <li>A <strong>0 value</strong> means the shot has virtually no chance of scoring.</li>
          <li>A <strong>1 value</strong> means the shot is virtually certain to result in a goal.</li>
        </ul>
        <p>If a shot is assigned a value of <strong>0.30 xG</strong>, it means that if you took that exact shot 100 times under similar conditions, it would result in a goal roughly 30 times.</p>

        <hr className="my-12 border-border" />

        <h2 id="a-simple-analogy">A Simple Analogy: The Penalty vs. The Long Range Shot</h2>
        <p>Most people intuitively understand xG without knowing the technical name. Consider two scenarios:</p>
        <ol>
          <li><strong>The Penalty Kick:</strong> 12 yards from goal, only the keeper to beat, no defensive pressure. Real-world data shows that in the Premier League, roughly 76–79% of penalties result in goals. Therefore, in most professional models, <strong>a penalty is worth ~0.79 xG.</strong></li>
          <li><strong>The 30-Yard Screamer:</strong> A player shoots from 30 yards out, with three defenders in the way and a narrow angle. Statistically, this shot scores roughly 3 times out of 100. In an xG model, <strong>this shot is worth 0.03 xG.</strong></li>
        </ol>
        <p>xG simply formalises this intuition using thousands of matches worth of data.</p>

        <hr className="my-12 border-border" />

        <h2 id="how-did-xg-come-about">How Did xG Come About?</h2>
        <p>While xG feels like a modern invention, its roots go back decades:</p>
        <ul>
          <li><strong>1993:</strong> Academic statisticians Vic Barnett and Sarah Hilditch published early research examining the factors that influence shot success.</li>
          <li><strong>Late 2000s:</strong> Football bloggers and analysts (like Howard Hamilton and Sander Ijtsma) began developing open, transparent models for the public.</li>
          <li><strong>2012–2017:</strong> Data companies like Opta and StatsBomb refined these models using increasingly granular data.</li>
          <li><strong>2017:</strong> xG broke into the mainstream when BBC&apos;s Match of the Day began including it in match summaries.</li>
        </ul>

        <hr className="my-12 border-border" />

        <h2 id="factors-in-xg-model">What Factors Go Into an xG Model?</h2>
        <p>Modern expected goals models are sophisticated machine learning algorithms that consider dozens of variables for every shot. The most critical factors include:</p>
        <ul>
          <li><strong>Distance to Goal:</strong> The closer the shot, the higher the xG.</li>
          <li><strong>Angle to Goal:</strong> Shots from directly in front of goal have higher xG than those from wide, tight angles.</li>
          <li><strong>Body Part:</strong> Shots taken with the feet have higher xG than headers or volleys from the same position.</li>
          <li><strong>Assist Type:</strong> Shots from through-balls or cutbacks have higher xG than shots from high, hanging crosses.</li>
          <li><strong>Defensive Pressure:</strong> Was the attacker in space, or were three defenders lunging to block the shot?</li>
          <li><strong>Goalkeeper Position:</strong> Was the keeper set, or were they caught out of position? (Used in the most advanced models).</li>
        </ul>

        <hr className="my-12 border-border" />

        <h2 id="what-xg-value-tells-you">What Does an xG Value Actually Tell You?</h2>
        <p>When you see a single xG number (like 0.15), it describes the <strong>quality</strong> of that specific chance. When you see a team&apos;s total xG for a match (like 2.4), it describes the <strong>total quality of all chances</strong> they created during those 90 minutes.</p>
        <p>As a general rule of thumb:</p>
        <ul>
          <li><strong>Under 0.05 xG:</strong> A speculative, low-quality chance.</li>
          <li><strong>0.10 – 0.20 xG:</strong> A moderate quality chance.</li>
          <li><strong>0.40 – 0.60 xG:</strong> A high-quality chance (often called a &quot;Big Chance&quot;).</li>
          <li><strong>0.90+ xG:</strong> A &quot;sitter&quot; that is nearly impossible to miss.</li>
        </ul>

        <hr className="my-12 border-border" />

        <h2 id="the-limitations">The Limitations: What xG is Not</h2>
        <p>xG is a powerful tool, but it is not a perfect simulation of reality. It has two main limitations:</p>
        <ol>
          <li><strong>It assumes an &quot;average&quot; finisher:</strong> A shot taken by Erling Haaland or Lionel Messi has the same xG as the same shot taken by a League Two defender. xG tells you how good the <em>chance</em> was, not how good the <em>finisher</em> was.</li>
          <li><strong>It doesn&apos;t account for what happened after the shot:</strong> xG measures the probability at the moment the ball is struck. It doesn&apos;t care if the ball flew into the top corner or went out for a throw-in. (To measure that, you use a different metric called xGOT).</li>
        </ol>

        <hr className="my-12 border-border" />

        <h2 id="how-to-use-calculator">How to Use the xG Calculator</h2>
        <p>The best way to understand xG is to experiment with it. Our <strong><Link href="/utility/xg-expected-goals-calculator" className="text-primary hover:underline">interactive xG calculator</Link></strong> allows you to place a ball anywhere on the pitch, choose the situation, and see the probability value change in real-time.</p>
        <p>Try placing a shot from the penalty spot, then move it five yards to the left. Watch how the angle change impacts the xG. This hands-on experience is the fastest way to build &quot;xG intuition.&quot;</p>

        <hr className="my-12 border-border" />

        <h2 id="conclusion">Conclusion: A Better Way to Watch Football</h2>
        <p>Expected goals is the most important innovation in football analytics of the past two decades. It transforms vague impressions (&quot;they were the better team&quot;) into a rigorous, quantifiable measure of chance quality. xG doesn&apos;t replace watching football. It enhances it.</p>

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
