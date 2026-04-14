import type { Metadata } from "next";
import { MarathonPredictorCalculator } from "./components/MarathonPredictorCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/marathon-predictor-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is Riegel's formula for marathon prediction?",
    answer:
      "Riegel's formula is T2 = T1 × (D2 / D1)^1.06, where T1 is your known finish time, D1 is the distance you ran, D2 is the target distance, and T2 is the predicted finish time. The exponent 1.06 captures the fact that performance degrades slightly as distance increases — you can't simply scale your 10K pace linearly to a marathon.",
  },
  {
    question: "How accurate is marathon time prediction from a 5K or 10K?",
    answer:
      "Predictions from a recent, well-paced 10K are generally accurate to within 5–10 minutes for trained runners. A 5K prediction carries more uncertainty because the distance gap is larger. The formula assumes you are equally well-trained for both distances, which is rarely perfectly true. Runners who have done specific marathon training will often outperform the prediction; those who haven't may fall short.",
  },
  {
    question: "Why does the prediction often feel too optimistic?",
    answer:
      "Riegel's formula assumes optimal conditions and equal fitness across distances. In practice, marathon performance is heavily affected by fueling strategy, heat, course elevation, and the cumulative fatigue of miles 18–26. Runners who haven't trained their long runs adequately or practiced race-day nutrition often hit the wall and finish slower than predicted.",
  },
  {
    question: "What training paces should I use based on my predicted marathon time?",
    answer:
      "Common training paces derived from your predicted marathon time include: easy runs at 60–75 seconds per mile slower than marathon pace, tempo runs at roughly half-marathon pace, and long runs at 45–90 seconds per mile slower than marathon pace. VO2 max intervals are typically run at 5K pace. These zones ensure you build aerobic capacity without accumulating excessive fatigue.",
  },
  {
    question: "How should I adjust my prediction for a hilly course?",
    answer:
      "Add roughly 1 minute per 100 feet of net elevation gain for a rough adjustment. A course with 1,000 feet of total climbing might cost you 8–12 minutes compared to a flat course. Heat is even more impactful — for every 5°F above 55°F (13°C), expect to slow by 1–3% depending on humidity. Always check the course profile and race-day forecast before committing to a goal pace.",
  },
];

export const metadata: Metadata = {
  title: "Marathon Predictor Calculator | Predict Finish Time from 5K or 10K",
  description:
    "Predict your marathon finish time from a recent 5K or 10K using Riegel's formula. Get training paces, race strategy tips, and understand the factors that affect prediction accuracy.",
  keywords: [
    "marathon predictor calculator",
    "marathon time prediction",
    "Riegel formula marathon",
    "5K to marathon predictor",
    "10K to marathon time",
    "marathon training paces",
    "race time predictor",
    "marathon finish time calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Marathon Predictor Calculator | Predict Finish Time from 5K or 10K",
    description:
      "Use Riegel's formula to predict your marathon finish time from a recent 5K or 10K and get personalized training paces.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marathon Predictor Calculator | Predict Finish Time from 5K or 10K",
    description:
      "Predict your marathon time from a 5K or 10K using Riegel's formula and get training pace recommendations.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Marathon Predictor Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free marathon finish time predictor using Riegel's formula with training pace recommendations.",
    featureList: [
      "Riegel formula prediction",
      "5K, 10K, half marathon input",
      "Training pace zones",
      "Supports metric and imperial",
    ],
  };
}

export default function MarathonPredictorCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Marathon Predictor Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Marathon Predictor Calculator"
        description="Predict your marathon finish time from a recent 5K, 10K, or half marathon using Riegel's formula. Get training paces and understand what affects prediction accuracy."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Riegel's formula: the math behind marathon prediction</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              In 1977, researcher Peter Riegel published a formula in <em>American Scientist</em> that has become the standard tool for predicting race times across distances. The formula is:
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground font-mono bg-muted/50 rounded-lg px-4 py-3">
              T2 = T1 × (D2 / D1)^1.06
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Where T1 is your known finish time for distance D1, and T2 is the predicted time for distance D2. The exponent 1.06 is the critical element — it's greater than 1.0, which means performance degrades as distance increases. If the exponent were exactly 1.0, you could simply scale your pace linearly, but that would predict unrealistically fast marathon times. The 1.06 exponent captures the physiological reality that fatigue accumulates non-linearly over longer distances.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              To use the formula practically: if you run a 5K in 25:00 (1,500 seconds) and want to predict your marathon time (42,195 meters vs. 5,000 meters), the calculation is 1500 × (42195 / 5000)^1.06 = 1500 × 8.439^1.06 = 1500 × 9.47 ≈ 14,205 seconds ≈ 3:56:45. The same runner using a 10K time of 52:30 would get a slightly different (and generally more reliable) prediction.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Which input distance gives the best prediction?</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The closer your input distance is to the marathon, the more accurate the prediction tends to be. A half marathon time is the gold standard input — it's long enough to test your aerobic endurance and fueling, and the distance gap to the full marathon is small enough that the formula's assumptions hold reasonably well. Most elite marathon coaches use a recent half marathon as the primary predictor.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              A 10K time is the next best option. It's long enough to reflect your aerobic capacity rather than pure speed, and the prediction is usually accurate to within 5–8 minutes for well-trained runners. A 5K time introduces more uncertainty because the 5K relies more heavily on VO2 max and anaerobic capacity — qualities that don't translate as directly to marathon performance as pure aerobic endurance does.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              One important caveat: the input race must be a genuine race effort, not a training run. The formula assumes you ran the shorter distance at maximum effort. A comfortable 10K training run will produce a wildly optimistic marathon prediction. Similarly, the input race should be recent — ideally within 8–12 weeks of your marathon — because fitness changes significantly over longer periods.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Training paces derived from your predicted marathon time</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Once you have a predicted marathon time, you can derive a full set of training paces. These zones are designed to develop different physiological systems without accumulating excessive fatigue:
            </p>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Easy / recovery pace:</strong> 60–90 seconds per mile slower than your marathon goal pace. This is where most of your weekly mileage should be run — it builds aerobic base while allowing recovery.</li>
              <li><strong className="text-foreground">Long run pace:</strong> 45–75 seconds per mile slower than marathon pace. Long runs build the muscular endurance and fat-burning capacity essential for the final miles of a marathon.</li>
              <li><strong className="text-foreground">Marathon pace:</strong> Your goal race pace. Practice this in the middle miles of long runs and in marathon-pace workouts to build confidence and economy at race effort.</li>
              <li><strong className="text-foreground">Tempo / threshold pace:</strong> Approximately your half marathon race pace, or about 25–30 seconds per mile faster than marathon pace. Tempo runs improve your lactate threshold — the pace you can sustain before lactic acid accumulates rapidly.</li>
              <li><strong className="text-foreground">VO2 max intervals:</strong> Approximately your 5K race pace. Short intervals (800m–1600m) at this pace improve your maximum oxygen uptake and running economy.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common prediction errors and how to avoid them</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The most common reason runners underperform their predicted marathon time is inadequate long run training. Riegel's formula assumes equal fitness across distances, but marathon-specific fitness — the ability to run efficiently for 3–5+ hours, manage glycogen depletion, and maintain form when fatigued — requires specific preparation. If your longest training run was 16 miles, you may not be ready to execute the pace the formula predicts.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Fueling is the second major variable. The marathon is the only common race distance where glycogen depletion (hitting the wall) is a realistic risk for most runners. Practicing your race-day nutrition strategy in training — taking gels or sports drink at the same intervals you plan to use on race day — is essential. A runner who hasn't practiced fueling may slow dramatically after mile 18 regardless of what the formula predicted.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Environmental conditions also matter enormously. Riegel's formula assumes neutral conditions. Heat above 60°F (15°C) slows most runners by 1–3% per 5°F increase. Humidity compounds this effect. A runner predicted to run 3:30 in ideal conditions might run 3:45 on a warm, humid day. Always build a conservative buffer into your goal pace for races in warm climates or late-season events.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Finally, tapering affects the prediction. Most runners feel sluggish during the 2–3 week taper before a marathon as training volume drops. This is normal and doesn't mean fitness has declined — the body is consolidating adaptations. Trust your training and the prediction, and resist the urge to run extra miles during taper week.
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
        <MarathonPredictorCalculator />
      </HealthToolPage>
    </>
  );
}
