import type { Metadata } from "next";
import { Vo2MaxCalculator } from "./components/Vo2MaxCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/vo2-max-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a good VO2 max?",
    answer:
      "For men aged 30–39, average VO2 max is 41–45 ml/kg/min; good is 46–52; excellent is 53+. For women aged 30–39, average is 31–35; good is 36–41; excellent is 42+. Elite male endurance athletes typically exceed 70 ml/kg/min; elite women exceed 60. Values decline approximately 1% per year after age 25 without training.",
  },
  {
    question: "How accurate are estimated VO2 max values?",
    answer:
      "Field test estimates have a margin of error of approximately 10–15% compared to laboratory VO2 max testing. The Cooper 12-minute run test and Rockport walk test are among the more accurate field methods. Heart rate-based estimates from wearables are less accurate but useful for tracking trends over time.",
  },
  {
    question: "Can VO2 max be improved?",
    answer:
      "Yes, significantly. Untrained individuals can improve VO2 max by 15–20% with consistent aerobic training over 3–6 months. High-intensity interval training (HIIT) produces the largest improvements in the shortest time. Even moderate aerobic exercise produces meaningful gains. Genetics set the ceiling, but most people are far below their genetic potential.",
  },
  {
    question: "What is the Cooper 12-minute run test?",
    answer:
      "The Cooper test involves running as far as possible in 12 minutes on a flat surface. The formula is: VO2 max = (distance in metres − 504.9) / 44.73. It was developed by Dr Kenneth Cooper in 1968 for the US Air Force and remains one of the most widely used field tests for aerobic fitness.",
  },
  {
    question: "Why does VO2 max decline with age?",
    answer:
      "VO2 max declines approximately 1% per year after age 25 due to reductions in maximum heart rate, stroke volume, and muscle oxidative capacity. However, trained individuals decline more slowly than sedentary people. A 60-year-old who has trained consistently throughout life may have a higher VO2 max than a sedentary 40-year-old.",
  },
];

export const metadata: Metadata = {
  title: "VO2 Max Calculator | Estimate Maximal Oxygen Uptake",
  description:
    "Estimate your VO2 max from fitness tests including the Cooper 12-minute run, Rockport walk test, and heart rate methods. See your aerobic fitness category by age and gender.",
  keywords: [
    "VO2 max calculator",
    "maximal oxygen uptake calculator",
    "Cooper test calculator",
    "aerobic fitness calculator",
    "VO2 max estimator",
    "cardiorespiratory fitness calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "VO2 Max Calculator — Aerobic Fitness Estimator",
    description: "Estimate your VO2 max from field tests and see your aerobic fitness category.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VO2 Max Calculator",
    description: "Estimate your maximal oxygen uptake from the Cooper test, Rockport walk test, or heart rate.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "VO2 Max Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free VO2 max estimator using multiple field test methods.",
    featureList: ["Cooper test formula", "Rockport walk test", "Age and gender categories"],
  };
}

export default function Vo2MaxCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "VO2 Max Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="VO2 Max Estimator"
        description="Estimate your VO2 max — the gold standard measure of aerobic fitness — using field tests including the Cooper 12-minute run, Rockport walk test, and heart rate methods."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is VO2 max?</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              VO2 max (maximal oxygen uptake) is the maximum rate at which your body can consume oxygen during intense exercise. It is expressed in millilitres of oxygen per kilogram of body weight per minute (ml/kg/min) and is widely considered the best single measure of cardiovascular fitness and aerobic endurance capacity.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              During exercise, your muscles require oxygen to produce energy aerobically. As intensity increases, oxygen demand rises until it reaches a plateau — the point at which your cardiovascular and respiratory systems are working at maximum capacity. This plateau is your VO2 max. Beyond this point, energy production shifts to anaerobic pathways, which are less efficient and produce lactate.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">VO2 max categories by age and gender</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The American Heart Association and various sports science organisations classify VO2 max into fitness categories. These values are for adults aged 30–39 as a reference point:
            </p>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Men — Poor: below 38 | Fair: 38–43 | Good: 44–51 | Excellent: 52–59 | Superior: 60+</strong></li>
              <li><strong className="text-foreground">Women — Poor: below 28 | Fair: 28–33 | Good: 34–40 | Excellent: 41–47 | Superior: 48+</strong></li>
            </ul>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              These thresholds shift downward with age — a 60-year-old man with a VO2 max of 38 ml/kg/min is in the "good" category for his age group, even though the same value would be "poor" for a 30-year-old.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Field test methods for estimating VO2 max</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Laboratory VO2 max testing requires a treadmill or cycle ergometer, metabolic analyser, and medical supervision. Field tests provide practical estimates without specialised equipment:
            </p>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Cooper 12-minute run test:</strong> Run as far as possible in 12 minutes. Formula: VO2 max = (distance in metres − 504.9) / 44.73. Accurate to within 10–15% of lab values for trained individuals.</li>
              <li><strong className="text-foreground">Rockport 1-mile walk test:</strong> Walk 1 mile as fast as possible, record time and heart rate at finish. Uses age, weight, gender, time, and heart rate in a regression equation. Better suited to older or less fit individuals.</li>
              <li><strong className="text-foreground">Heart rate ratio method:</strong> VO2 max ≈ 15 × (HRmax / HRrest). Simple but less accurate. Useful for a rough estimate without a timed test.</li>
              <li><strong className="text-foreground">Wearable device estimates:</strong> Devices like Garmin and Apple Watch estimate VO2 max from heart rate and pace data during runs. Convenient for tracking trends but less accurate than field tests.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to improve your VO2 max</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              VO2 max responds well to training, particularly high-intensity work. The most effective approaches:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">HIIT (High-Intensity Interval Training):</strong> Intervals at 90–100% of VO2 max pace (roughly 3–5 minute efforts) produce the largest improvements. Classic protocols: 4×4 minutes at near-maximum effort with 3-minute recovery.</li>
              <li><strong className="text-foreground">Tempo runs:</strong> Sustained efforts at lactate threshold pace (roughly 80–85% of VO2 max) for 20–40 minutes. Builds the aerobic base that supports VO2 max improvements.</li>
              <li><strong className="text-foreground">Long slow distance:</strong> Easy aerobic running at 60–70% of VO2 max builds mitochondrial density and cardiac stroke volume over time.</li>
            </ul>

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
        <Vo2MaxCalculator />
      </HealthToolPage>
    </>
  );
}
