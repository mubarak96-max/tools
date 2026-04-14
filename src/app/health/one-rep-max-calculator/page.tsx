import type { Metadata } from "next";
import { OneRepMaxCalculator } from "./components/OneRepMaxCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/one-rep-max-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Which 1RM formula is most accurate?",
    answer:
      "The Brzycki formula is most accurate for sets of 1–10 reps. The Epley formula performs similarly. Both become less accurate above 10 reps as fatigue and technique factors increase. For the most accurate estimate, use a weight you can lift for 3–5 reps rather than 10–15.",
  },
  {
    question: "Is it safe to test my actual 1RM?",
    answer:
      "Testing a true 1RM carries injury risk, particularly for beginners and for exercises like the squat and deadlift. It requires a thorough warm-up, a spotter, and good technique. Most coaches recommend using predictive formulas from submaximal sets rather than testing true 1RM, especially for beginners.",
  },
  {
    question: "How often should I retest my 1RM?",
    answer:
      "For most lifters, retesting every 8–12 weeks aligns with typical training cycles. More frequent testing is unnecessary and adds fatigue. A better approach is to track your working weights and reps over time — if you are lifting more weight for the same reps, your 1RM has increased.",
  },
  {
    question: "What percentage of 1RM should I use for hypertrophy?",
    answer:
      "Research shows muscle hypertrophy occurs across a wide rep range (6–30 reps) as long as sets are taken close to failure. The traditional 70–85% of 1RM (roughly 6–12 reps) remains effective, but higher rep sets with lighter weight (50–60% of 1RM) produce similar hypertrophy when taken to failure.",
  },
  {
    question: "What are good 1RM benchmarks for the main lifts?",
    answer:
      "For men, a 1× bodyweight bench press, 1.5× bodyweight squat, and 2× bodyweight deadlift are considered intermediate milestones. For women, 0.75× bodyweight bench, 1.25× squat, and 1.5× deadlift are comparable benchmarks. These vary significantly by training age and body weight.",
  },
];

export const metadata: Metadata = {
  title: "One Rep Max Calculator | 1RM Estimator for Strength Training",
  description:
    "Estimate your one-rep max (1RM) for any lift using the Brzycki, Epley, and other formulas. Get training percentages for strength, hypertrophy, and endurance work.",
  keywords: [
    "one rep max calculator",
    "1RM calculator",
    "Brzycki formula calculator",
    "strength training calculator",
    "max lift calculator",
    "powerlifting calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "One Rep Max Calculator — 1RM Estimator",
    description: "Estimate your 1RM and get training percentages for strength, hypertrophy, and endurance.",
  },
  twitter: {
    card: "summary_large_image",
    title: "One Rep Max Calculator",
    description: "Calculate your 1RM from any weight and rep count using multiple predictive formulas.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "One Rep Max Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free 1RM calculator using Brzycki, Epley, and other strength formulas.",
    featureList: ["Multiple 1RM formulas", "Training percentage breakdown", "Strength and hypertrophy zones"],
  };
}

export default function OneRepMaxCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "One Rep Max Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="One Rep Max Calculator"
        description="Estimate your one-rep max (1RM) for any lift from a submaximal set. Get a full training percentage breakdown for strength, hypertrophy, and endurance work."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is a one-rep max and why does it matter?</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              A one-rep max (1RM) is the maximum weight you can lift for a single complete repetition of an exercise with proper form. It is the universal benchmark for strength in powerlifting, weightlifting, and strength training. Knowing your 1RM allows you to prescribe training loads as percentages, which is the foundation of virtually every evidence-based strength programme.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Rather than testing your true maximum — which carries injury risk and requires significant recovery — predictive formulas estimate your 1RM from a submaximal set. Enter the weight you lifted and the number of reps completed, and the calculator returns an estimated 1RM along with training weights for different rep ranges.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">The main 1RM prediction formulas</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Several formulas exist, each with slightly different accuracy profiles:
            </p>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Brzycki (1993):</strong> 1RM = Weight / (1.0278 − 0.0278 × Reps). Most accurate for 1–10 reps. Widely used in research and practice.</li>
              <li><strong className="text-foreground">Epley (1985):</strong> 1RM = Weight × (1 + 0.0333 × Reps). Slightly overestimates at higher rep counts but performs well for 1–10 reps.</li>
              <li><strong className="text-foreground">Lander (1985):</strong> 1RM = (100 × Weight) / (101.3 − 2.67123 × Reps). Good accuracy across a wider rep range.</li>
              <li><strong className="text-foreground">O'Conner (1989):</strong> 1RM = Weight × (1 + 0.025 × Reps). Conservative estimate, useful as a lower bound.</li>
            </ul>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              All formulas become less accurate above 10 reps because fatigue, cardiovascular fitness, and mental factors increasingly influence performance. For the most accurate estimate, use a weight you can lift for 3–6 reps.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Training percentages and their applications</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Once you have your 1RM, you can prescribe training loads for specific goals:
            </p>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">90–100% (1–3 reps) — Maximal strength:</strong> Develops neural adaptations and absolute strength. Used in peaking phases before competition.</li>
              <li><strong className="text-foreground">80–90% (3–5 reps) — Strength:</strong> The primary zone for building strength. Used in programmes like 5/3/1, Starting Strength, and Texas Method.</li>
              <li><strong className="text-foreground">70–80% (6–8 reps) — Strength-hypertrophy:</strong> Builds both strength and muscle size. The most common zone for intermediate lifters.</li>
              <li><strong className="text-foreground">60–70% (8–12 reps) — Hypertrophy:</strong> Traditional bodybuilding range. Maximises time under tension for muscle growth.</li>
              <li><strong className="text-foreground">50–60% (12–20 reps) — Muscular endurance:</strong> Builds work capacity and metabolic conditioning. Also effective for hypertrophy when taken to failure.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Strength standards for the main lifts</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              These bodyweight multipliers are commonly used milestones for the three main powerlifting movements:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Squat:</strong> Beginner 0.75×BW | Intermediate 1.5×BW | Advanced 2.0×BW | Elite 2.5×BW</li>
              <li><strong className="text-foreground">Bench press:</strong> Beginner 0.5×BW | Intermediate 1.0×BW | Advanced 1.5×BW | Elite 2.0×BW</li>
              <li><strong className="text-foreground">Deadlift:</strong> Beginner 1.0×BW | Intermediate 1.75×BW | Advanced 2.5×BW | Elite 3.0×BW</li>
            </ul>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Women's standards are approximately 20–30% lower due to differences in muscle mass distribution. These are general guidelines — individual variation is significant.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-6 space-y-4">
              {faq.map((item) => (
                <article key={item.question} className="rounded-[1.25rem] border border-border bg-background p-5">
                  <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
                </article>
              ))}
            </div>
          </>
        }
      >
        <OneRepMaxCalculator />
      </HealthToolPage>
    </>
  );
}
