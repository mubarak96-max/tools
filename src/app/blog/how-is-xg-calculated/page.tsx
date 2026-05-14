import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { AuthorSection } from "@/components/blog/AuthorSection";

const PAGE_PATH = "/blog/how-is-xg-calculated";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "How is xG Calculated? The Factors Behind Every Shot",
  description: "Ever wondered how expected goals (xG) is actually calculated? This guide explains every input, from distance and angle to body part and assist type.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "How is xG Calculated? — Methodology and Factors",
    description: "Open the black box of football analytics. Understand every factor that determines the xG value of a shot.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Can I calculate xG by hand?",
    answer: "Simple versions are possible with distance and angle inputs using logistic regression coefficients. Professional models are too complex for manual calculation. The interactive calculator at FindBest Tools automates the process clearly.",
  },
  {
    question: "What's the most important factor in xG?",
    answer: "Distance to goal, followed closely by angle. These two geometric factors account for the majority of the variance in shot outcomes.",
  },
  {
    question: "Why does xGOT differ from xG?",
    answer: "xG is calculated before the shot based on position and context. xGOT is calculated after seeing where the shot was placed within the goal frame. They measure different things.",
  },
  {
    question: "Is a higher xG model necessarily better?",
    answer: "Not necessarily. A well-calibrated model that accurately reflects average scoring rates is more useful than a complex model that overfits to specific scenarios. Simplicity and calibration often matter more than complexity.",
  },
  {
    question: "Can xG be negative?",
    answer: "No. xG is a probability, and probabilities are always between 0 and 1. A very difficult chance might have xG of 0.01, but never negative.",
  },
];

export default function XGCalculationPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "How is xG Calculated?", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Methodology</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            How is xG Calculated? The Factors Behind Every Shot
          </h1>
          <div className="pt-2">
            <AuthorSection />
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium mt-3">
              <span>18 min read</span>
              <span>•</span>
              <span>Published January 2026</span>
            </div>
          </div>
        </div>
      </header>

      <div className="[&_p]:mb-12 [&_h2]:mt-24 [&_h2]:mb-12 [&_h3]:mt-20 [&_h3]:mb-10 [&_ul]:mb-12 [&_li]:mb-6 [&_ol]:mb-12 [&_hr]:my-16 prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-0 prose-li:my-0 prose-li:leading-relaxed">
        <p className="italic text-lg text-muted-foreground">Expected goals (xG) is football&apos;s most talked-about advanced statistic — but for many fans, it remains a black box. A number appears on the screen, and nobody explains where it came from. This guide opens that black box completely. You&apos;ll understand every input that shapes an xG value, how models are built, and why two providers can give the same shot different numbers.</p>

        <hr className="my-12 border-border" />

        <h2 id="introduction-why-understanding-the-calculation-matters">Introduction: Why Understanding the Calculation Matters</h2>
        <p>When you understand <em>how</em> xG is calculated, the numbers stop feeling arbitrary and start carrying real meaning. You&apos;ll know why a 0.05 long-range shot is valued the way it is. You&apos;ll understand why a cutback from the byline dramatically raises xG compared to a floated cross from the same position. You&apos;ll be able to watch a match and develop near-instant intuition for what kind of chance each shot represents — before the broadcast graphic even appears.</p>
        <p>More practically, understanding the methodology helps you know when to trust xG data and when to be sceptical of it.</p>

        <hr className="my-12 border-border" />

        <h2 id="the-foundation-historical-pattern-recognition">The Foundation: Historical Pattern Recognition</h2>
        <p>At its most fundamental level, <strong>xG is a probability model.</strong> It doesn&apos;t decide a shot&apos;s value based on a person&apos;s opinion. Instead, it asks a computer: <em>&quot;Given a dataset of 300,000 historical shots, how many times did a shot with these exact characteristics result in a goal?&quot;</em></p>
        <p>If the computer finds 10,000 similar shots in its database and sees that 1,200 of them were goals, it assigns that shot an xG value of <strong>0.12</strong>.</p>

        <hr className="my-12 border-border" />

        <h2 id="the-critical-input-factors">The Critical Input Factors</h2>
        <p>While different data providers (like Opta, StatsBomb, or Understat) use slightly different models, they all rely on several &quot;core&quot; factors to determine the probability of a goal.</p>

        <h3>1. Shot Location: Distance and Angle</h3>
        <p>These are the two most influential variables in any xG model.</p>
        <ul>
          <li><strong>Distance:</strong> The closer a shot is to the goal, the higher the xG. A shot from 2 yards has a massive xG value; a shot from 30 yards is rarely a goal.</li>
          <li><strong>Angle:</strong> The angle is a trigonometric calculation of how much of the goal net the attacker can actually see. A central position directly in front of the posts has a higher xG than a narrow angle near the byline, even if the distance is the same.</li>
        </ul>

        <h3>2. Body Part: Foot vs. Head</h3>
        <p>Not all body parts are equal in football. Statistically, it is much harder to score a header than a shot with the foot from the same location. Most models apply a &quot;reduction factor&quot; to headers and volleys, meaning a header from 6 yards will have a lower xG than a standard foot shot from the same spot.</p>

        <h3>3. Assist Type: How the Ball Arrived</h3>
        <p>The situation leading up to the shot dramatically changes its probability.</p>
        <ul>
          <li><strong>Through balls and cutbacks</strong> typically produce high xG because the attacker is often facing an open net or moving toward the goal.</li>
          <li><strong>Crosses and corner kicks</strong> have lower xG because the ball is arriving with high velocity or height, making it much harder to control and direct.</li>
          <li><strong>Rebounds</strong> often have very high xG because the goalkeeper is frequently out of position after the initial save.</li>
        </ul>

        <h3>4. Defensive Pressure and Goalkeeper Position</h3>
        <p>The most advanced models (like StatsBomb&apos;s 360 model) include information about where defenders and the goalkeeper are positioned.</p>
        <ul>
          <li>A shot with no defenders between the ball and the goal will have a much higher xG than one where three defenders are lunging to block it.</li>
          <li>If the goalkeeper has been drawn out of position (an &quot;open net&quot; scenario), the xG value sky-rockets.</li>
        </ul>

        <h3>5. Game Situation: Fast Breaks and Counter-Attacks</h3>
        <p>A shot taken during a counter-attack, where the defensive team is still retreating and out of shape, is statistically more likely to score than a shot taken against a &quot;set&quot; defence. Models identify these situations using event data and increase the xG accordingly.</p>

        <hr className="my-12 border-border" />

        <h2 id="how-models-built">How the Models Are Built: The Statistical Machinery</h2>
        <p>Data scientists typically use <strong>Logistic Regression</strong> or <strong>Machine Learning (Gradient Boosting)</strong> to build xG models.</p>
        <ul>
          <li><strong>Logistic Regression:</strong> A traditional statistical method that maps a set of input variables to a probability between 0 and 1. It is highly transparent and allows analysts to see exactly how much each factor (like distance) is &quot;weighting&quot; the final number.</li>
          <li><strong>Machine Learning:</strong> More modern models use &quot;Random Forests&quot; or &quot;XGBoost&quot; algorithms. These are better at capturing &quot;interactions&quot; — for example, knowing that the impact of distance might be different for a header than for a foot shot.</li>
        </ul>

        <hr className="my-12 border-border" />

        <h2 id="why-providers-disagree">Why Do Different Providers Show Different Numbers?</h2>
        <p>If you check a match on FBref and then on Understat, the xG totals will likely differ. This is not because one is &quot;wrong,&quot; but because they are using different rulers to measure the same thing.</p>
        <ul>
          <li><strong>Different Features:</strong> One provider might include goalkeeper position data while another doesn&apos;t.</li>
          <li><strong>Different Training Data:</strong> One model might be trained on 10 years of Premier League data, while another is trained on 3 years of data from 5 different European leagues.</li>
          <li><strong>Different Definitions:</strong> What one provider codes as a &quot;Big Chance&quot; or a &quot;Volley,&quot; another might code differently.</li>
        </ul>

        <hr className="my-12 border-border" />

        <h2 id="summary">Summary: The Methodology Matters</h2>
        <p>Understanding xG calculation turns the metric from a &quot;black box&quot; into a useful lens for viewing the game. It reminds us that football is a game of probabilities, and that every decision a player makes — where to shoot from, which foot to use, how to arrive in the box — is an attempt to maximise those probabilities.</p>
        <p>To see these factors in action yourself, experiment with our <strong><Link href="/utility/xg-expected-goals-calculator" className="text-primary hover:underline">interactive xG calculator</Link></strong>, where you can adjust every variable and watch the underlying calculation react in real-time.</p>

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
