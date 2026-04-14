import type { Metadata } from "next";
import { WaterIntakeCalculator } from "./components/WaterIntakeCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/water-intake-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Is the 8 glasses a day rule accurate?",
    answer:
      "The '8×8' rule (eight 8-oz glasses per day) is a rough guideline with limited scientific basis. Actual needs vary significantly based on body weight, activity level, climate, and diet. The Institute of Medicine recommends approximately 3.7 litres per day for men and 2.7 litres for women from all sources, including food.",
  },
  {
    question: "How much extra water do I need when exercising?",
    answer:
      "The American College of Sports Medicine recommends drinking 400–600 ml of water 2 hours before exercise, 150–250 ml every 15–20 minutes during exercise, and replacing fluid losses after exercise. For sessions longer than 60 minutes, electrolyte replacement becomes important alongside water.",
  },
  {
    question: "Can you drink too much water?",
    answer:
      "Yes. Hyponatraemia (water intoxication) occurs when excessive water intake dilutes sodium levels in the blood. It is rare in everyday life but can occur during endurance events when athletes drink large amounts of plain water without replacing electrolytes. Symptoms include nausea, headache, confusion, and in severe cases, seizures.",
  },
  {
    question: "Does coffee and tea count toward daily water intake?",
    answer:
      "Yes. Despite their mild diuretic effect, caffeinated beverages like coffee and tea still contribute net fluid to your daily intake. Research shows that moderate caffeine consumption does not cause dehydration in regular consumers. However, alcohol is a stronger diuretic and does not count toward hydration goals.",
  },
  {
    question: "What are the signs of dehydration?",
    answer:
      "Early signs include thirst, dark yellow urine, dry mouth, and reduced urine output. Moderate dehydration causes headaches, fatigue, reduced concentration, and dizziness. Severe dehydration (loss of 5%+ body weight in fluid) causes rapid heartbeat, confusion, and requires medical attention.",
  },
];

export const metadata: Metadata = {
  title: "Water Intake Calculator | Daily Hydration Needs by Weight & Activity",
  description:
    "Calculate how much water you should drink daily based on your body weight, activity level, and climate. Get personalised hydration recommendations.",
  keywords: [
    "water intake calculator",
    "daily water intake",
    "hydration calculator",
    "how much water should I drink",
    "water consumption calculator",
    "daily hydration needs",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Water Intake Calculator — Daily Hydration Needs",
    description: "Find out how much water you should drink daily based on your weight and activity level.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Water Intake Calculator",
    description: "Calculate your personalised daily water intake recommendation based on weight and exercise.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Water Intake Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free daily water intake calculator based on body weight and activity level.",
    featureList: ["Weight-based calculation", "Activity level adjustment", "Metric and imperial units"],
  };
}

export default function WaterIntakeCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Water Intake Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Water Intake Calculator"
        description="Calculate your recommended daily water intake based on your body weight, activity level, and environment. Get a personalised hydration target in litres and glasses."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">How daily water needs are calculated</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              A common evidence-based formula is 35 ml of water per kilogram of body weight per day as a baseline for sedentary adults. This is then adjusted upward for physical activity, hot climates, and other factors that increase fluid loss through sweat and respiration.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              For a 70 kg sedentary adult, this gives approximately 2.45 litres per day. Add 500–750 ml for each hour of moderate exercise. In hot weather, add another 500 ml–1 litre. Pregnant women need an additional 300 ml per day; breastfeeding women need an additional 700 ml.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Why hydration matters for health and performance</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Water makes up approximately 60% of adult body weight and is involved in virtually every physiological process. It regulates body temperature through sweating, transports nutrients and oxygen to cells, lubricates joints, cushions organs, and facilitates kidney function and waste removal.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Even mild dehydration — as little as 1–2% of body weight — measurably impairs cognitive performance, mood, and physical endurance. A 2% deficit in a 70 kg person is just 1.4 litres, which can be reached through a few hours of moderate activity without adequate fluid replacement.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Practical tips for staying hydrated</h2>
            <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Start the day with water:</strong> Drink a large glass of water immediately upon waking. You lose fluid overnight through breathing and sweating.</li>
              <li><strong className="text-foreground">Use urine colour as a guide:</strong> Pale yellow indicates good hydration. Dark yellow or amber means you need more water. Clear urine may indicate overhydration.</li>
              <li><strong className="text-foreground">Eat water-rich foods:</strong> Fruits and vegetables contribute significantly to daily fluid intake. Cucumber, watermelon, and lettuce are over 90% water by weight.</li>
              <li><strong className="text-foreground">Drink before you are thirsty:</strong> Thirst is a late indicator of dehydration. By the time you feel thirsty, you may already be mildly dehydrated.</li>
              <li><strong className="text-foreground">Carry a water bottle:</strong> Having water readily available is the single most effective behaviour change for increasing daily intake.</li>
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
        <WaterIntakeCalculator />
      </HealthToolPage>
    </>
  );
}
