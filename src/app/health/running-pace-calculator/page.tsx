import type { Metadata } from "next";
import { RunningPaceCalculator } from "./components/RunningPaceCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/running-pace-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a good running pace for beginners?",
    answer:
      "A good beginner pace is one where you can hold a full conversation — typically somewhere between 8:00 and 12:00 minutes per kilometre (13:00–19:00 min/mile) depending on fitness level. The exact number matters far less than effort: if you cannot speak in short sentences, you are running too fast. Most beginners benefit from slowing down, not speeding up, so they can build aerobic base without injury.",
  },
  {
    question: "What is the difference between pace and speed?",
    answer:
      "Pace is the time it takes to cover one unit of distance — for example, 5:30 per kilometre. Speed is the distance covered per unit of time — for example, 10.9 km/h. They express the same thing from opposite directions. Runners typically use pace because it maps directly onto race distances and training targets, while cyclists and triathletes more often use speed. To convert: speed (km/h) = 60 ÷ pace (min/km).",
  },
  {
    question: "What pace should I run for fat burning?",
    answer:
      "Fat burning is maximised at low to moderate intensity — roughly 60–70% of your maximum heart rate, which for most people corresponds to an easy conversational pace. At this intensity your body relies predominantly on fat as fuel. However, higher-intensity running burns more total calories per minute even if the fat percentage is lower, so overall calorie deficit matters more than staying in any specific 'fat-burning zone'.",
  },
  {
    question: "How do I calculate my race pace?",
    answer:
      "Divide your goal finish time (in seconds) by the race distance in kilometres or miles to get seconds per unit, then convert back to minutes and seconds. For example, a 25-minute 5K equals 25 × 60 = 1,500 seconds ÷ 5 km = 300 seconds per km = 5:00 min/km. A more practical approach is to run a recent time trial or race and use that result to estimate sustainable pace for longer distances using a race predictor formula.",
  },
  {
    question: "What is a negative split and why does it matter?",
    answer:
      "A negative split means running the second half of a race faster than the first half. It is widely considered the most efficient pacing strategy because it prevents early glycogen depletion and lactic acid build-up. Most world records and personal bests are set with even or negative splits. Starting conservatively feels counterintuitive but almost always produces a faster finish time than going out hard and fading.",
  },
];

export const metadata: Metadata = {
  title: "Running Pace Calculator | Min/km, Min/Mile & Race Pace",
  description:
    "Calculate your running pace, speed, and finish time for any distance. Convert between min/km and min/mile and find the right pace for easy runs, tempo runs, and races.",
  keywords: [
    "running pace calculator",
    "pace per km calculator",
    "pace per mile calculator",
    "race pace calculator",
    "min per km converter",
    "running speed calculator",
    "5k pace calculator",
    "marathon pace calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Running Pace Calculator | Min/km, Min/Mile & Race Pace",
    description:
      "Calculate your running pace, speed, and finish time for any distance. Convert between min/km and min/mile.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Running Pace Calculator",
    description:
      "Find your running pace in min/km or min/mile and calculate finish times for 5K, 10K, half marathon, and marathon.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Running Pace Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free running pace calculator. Convert between pace and speed, calculate finish times, and find the right pace for training zones.",
    featureList: [
      "Pace to speed conversion",
      "Min/km and min/mile support",
      "Finish time calculation",
      "Training pace zones",
    ],
  };
}

export default function RunningPaceCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Running Pace Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Running Pace Calculator"
        description="Calculate your running pace, speed, and projected finish time for any distance. Convert between minutes per kilometre and minutes per mile instantly."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Pace, speed, and distance — how they relate</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Running pace and speed describe the same physical quantity from opposite perspectives. <strong>Pace</strong> is the time required to cover one unit of distance — expressed as minutes per kilometre or minutes per mile. <strong>Speed</strong> is the distance covered per unit of time — expressed as kilometres per hour or miles per hour. The relationship is a simple reciprocal: pace (min/km) = 60 ÷ speed (km/h), and speed (km/h) = 60 ÷ pace (min/km).
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Runners overwhelmingly prefer pace because it connects directly to race distances and training targets. Knowing you need to run 5:00 min/km to finish a 10K in 50 minutes is immediately actionable in a way that "12 km/h" is not. GPS watches display pace in real time, making it the natural unit for monitoring effort during a run.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              To calculate finish time from pace, multiply pace (in seconds per km) by the distance in kilometres. A 5:30 min/km pace over a half marathon (21.0975 km) gives 5.5 × 60 × 21.0975 ≈ 6,962 seconds, or about 1 hour 56 minutes. Working backwards, divide your goal time in seconds by the distance to find the required pace per kilometre.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Converting between min/km and min/mile is straightforward because one mile equals 1.60934 km. To convert a pace from min/km to min/mile, multiply by 1.60934. To go the other way, divide by 1.60934. A 5:00 min/km pace is therefore approximately 8:03 min/mile, and a 7:00 min/mile pace is approximately 4:21 min/km.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Training pace zones explained</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Structured training uses distinct pace zones, each targeting a different physiological adaptation. Running every session at the same moderate effort is one of the most common mistakes recreational runners make — it is hard enough to accumulate fatigue but not hard enough to drive meaningful fitness gains.
            </p>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
              <li>
                <strong className="text-foreground">Easy / aerobic (Zone 1–2, ~65–75% max HR):</strong> The foundation of all training. You should be able to hold a full conversation. Easy runs build aerobic base, promote recovery, and should make up 70–80% of weekly mileage. Running too fast on easy days is the single most common training error.
              </li>
              <li>
                <strong className="text-foreground">Tempo / marathon pace (Zone 3, ~80–85% max HR):</strong> A comfortably hard effort — you can speak in short phrases but not full sentences. Tempo runs improve lactate clearance and teach your body to sustain a faster pace for longer. Classic tempo workouts are 20–40 minutes at a steady effort.
              </li>
              <li>
                <strong className="text-foreground">Threshold (Zone 4, ~85–90% max HR):</strong> At or slightly above your lactate threshold — the pace you could sustain for roughly an hour in a race. Threshold intervals (e.g., 4 × 8 minutes) are highly effective for improving 10K and half marathon performance.
              </li>
              <li>
                <strong className="text-foreground">VO2 max intervals (Zone 5, ~90–95% max HR):</strong> Short, hard efforts of 3–8 minutes that push your cardiovascular system to its limit. These sessions are demanding and require full recovery between repetitions. They are the most potent stimulus for improving aerobic capacity.
              </li>
              <li>
                <strong className="text-foreground">Sprint / neuromuscular (above 95% max HR):</strong> Very short maximal efforts of 10–30 seconds that develop speed, running economy, and fast-twitch muscle recruitment. Strides and hill sprints fall into this category.
              </li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Pacing strategy for different race distances</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The optimal pacing strategy varies significantly by distance. In a <strong>5K</strong>, the race is short enough that you can afford to run close to your maximum sustainable effort from the start. Most elite 5K runners run the first kilometre slightly conservatively, build through the middle, and empty the tank in the final kilometre. For recreational runners, even pacing — running each kilometre at the same pace — is a reliable strategy that avoids the common mistake of going out too fast and dying in the final kilometre.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              In a <strong>half marathon</strong>, pacing discipline becomes more important. The distance is long enough that a 10–15 second per kilometre error in the first half will cost you far more than that in the second half as glycogen stores deplete and fatigue compounds. A slight negative split — running the second half 1–2% faster than the first — is the gold standard. This means the first 10 km should feel almost too easy.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The <strong>marathon</strong> is where pacing errors are most punishing. The infamous "wall" — a sudden and severe drop in pace typically around kilometres 30–35 — is almost always caused by running the first half too fast and depleting glycogen stores. Research consistently shows that runners who run the first half 1–3% slower than their goal pace finish faster overall. Fuelling strategy (taking on carbohydrates every 30–45 minutes) works hand in hand with pacing to delay the wall.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Pace also changes with terrain and conditions. Running uphill at the same pace as flat ground requires significantly more effort, so experienced runners use effort-based pacing on hilly courses rather than chasing a fixed number. Heat and humidity increase cardiovascular strain, typically adding 20–30 seconds per kilometre to what would otherwise be a comfortable pace.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How fatigue affects pace over a race</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Even with perfect pacing, physiological fatigue will slow you down over a long race. Glycogen depletion, muscle damage from repeated impact, rising core temperature, and central nervous system fatigue all contribute to pace drift in the later stages. Understanding this helps set realistic expectations and informs training.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              A useful rule of thumb is the <strong>Riegel formula</strong> for predicting race times across distances: T2 = T1 × (D2 / D1)^1.06. This formula accounts for the fact that pace slows as distance increases — you cannot run a marathon at your 5K pace. For example, if you run a 5K in 25 minutes, the formula predicts a half marathon of approximately 1:57 and a marathon of approximately 4:04. These predictions assume comparable training and conditions.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Training specifically for your target distance improves your ability to hold pace late in a race. Long runs build the muscular endurance and fat-burning capacity needed for the final third of a marathon. Tempo runs and threshold work raise the pace you can sustain before lactate accumulates. Speed work improves running economy — the oxygen cost of running at a given pace — so the same pace feels easier.
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
        <RunningPaceCalculator />
      </HealthToolPage>
    </>
  );
}
