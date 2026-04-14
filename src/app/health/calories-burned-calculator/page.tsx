import type { Metadata } from "next";
import { CaloriesBurnedCalculator } from "./components/CaloriesBurnedCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/calories-burned-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How are calories burned during exercise calculated?",
    answer:
      "This calculator uses MET (Metabolic Equivalent of Task) values. MET represents the ratio of energy expended during an activity to energy expended at rest. Calories burned = MET × body weight in kg × duration in hours. A MET of 1 equals resting metabolism; running at 8 km/h has a MET of approximately 8.",
  },
  {
    question: "Why do heavier people burn more calories doing the same exercise?",
    answer:
      "Because the MET formula multiplies by body weight, a heavier person requires more energy to move their body through the same activity. A 90 kg person burns roughly 50% more calories running than a 60 kg person at the same pace and duration.",
  },
  {
    question: "Does exercise burn fat directly?",
    answer:
      "Exercise burns a mix of carbohydrates and fat depending on intensity. Low-intensity exercise burns a higher proportion of fat, but high-intensity exercise burns more total calories. The total caloric deficit over time — not the fuel source during exercise — determines fat loss.",
  },
  {
    question: "How accurate are fitness trackers for calorie burn?",
    answer:
      "Consumer fitness trackers typically overestimate calorie burn by 20–40% for most activities. They are most accurate for walking and running, and least accurate for cycling, swimming, and strength training. Use them for relative comparisons rather than absolute values.",
  },
  {
    question: "What is afterburn (EPOC) and does it matter?",
    answer:
      "EPOC (Excess Post-exercise Oxygen Consumption) is the elevated calorie burn that continues after exercise as your body recovers. High-intensity interval training (HIIT) produces the most significant EPOC effect, potentially adding 6–15% to the calories burned during the session itself.",
  },
];

export const metadata: Metadata = {
  title: "Calories Burned Calculator | Exercise & Activity Energy Expenditure",
  description:
    "Estimate calories burned during exercise and physical activities using MET values. Enter your weight, activity type, and duration for an instant result.",
  keywords: [
    "calories burned calculator",
    "exercise calorie calculator",
    "MET calculator",
    "activity calorie burn",
    "workout calories burned",
    "physical activity energy expenditure",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Calories Burned Calculator — Exercise & Activity",
    description: "Calculate calories burned for any physical activity using MET values and your body weight.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calories Burned Calculator",
    description: "Estimate energy expenditure for running, cycling, swimming, and dozens of other activities.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Calories Burned Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free calories burned calculator using MET values for dozens of physical activities.",
    featureList: ["MET-based calculation", "Multiple activity types", "Weight and duration inputs"],
  };
}

export default function CaloriesBurnedCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Calories Burned Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Calories Burned Calculator"
        description="Estimate calories burned during physical activities using MET (Metabolic Equivalent of Task) values. Enter your weight, choose an activity, and set the duration."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">How MET values work</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              MET (Metabolic Equivalent of Task) is a standardised way to express the energy cost of physical activities. A MET of 1 represents the energy expended at rest (approximately 1 kcal per kg per hour). An activity with a MET of 6 burns six times as many calories as sitting still.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The Compendium of Physical Activities, maintained by researchers at Arizona State University, catalogues MET values for over 800 activities. Common examples: walking at 5 km/h (MET 3.5), cycling at moderate pace (MET 6), running at 10 km/h (MET 10), swimming laps (MET 8), and strength training (MET 3–6 depending on intensity).
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The formula: <strong>Calories = MET × weight (kg) × time (hours)</strong>
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Comparing calorie burn across activities</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              For a 70 kg person exercising for 30 minutes, approximate calorie burns are: walking briskly (140 kcal), cycling moderately (210 kcal), running at 10 km/h (350 kcal), swimming laps (280 kcal), HIIT training (300–400 kcal), and yoga (100–120 kcal).
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Running and HIIT consistently rank among the highest calorie-burning activities per unit of time. However, lower-intensity activities like walking are more sustainable for longer durations and may produce comparable total calorie burns over a full session.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Exercise and weight management</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Exercise contributes to weight management primarily through caloric expenditure, but its role is often overestimated. A 30-minute run burns roughly 300–400 calories — equivalent to a single snack. Diet is generally more powerful than exercise for creating a caloric deficit.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Where exercise excels is in preserving muscle mass during weight loss, improving metabolic health, and increasing NEAT (non-exercise activity thermogenesis) — the calories burned through everyday movement. People who exercise regularly tend to move more throughout the day, amplifying the total caloric effect beyond the workout itself.
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
        <CaloriesBurnedCalculator />
      </HealthToolPage>
    </>
  );
}
