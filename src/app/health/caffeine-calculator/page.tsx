import type { Metadata } from "next";
import { CaffeineCalculator } from "./components/CaffeineCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/caffeine-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How much caffeine is safe per day?",
    answer:
      "The FDA considers 400 mg of caffeine per day safe for healthy adults — roughly four 8-oz cups of brewed coffee. Pregnant women are advised to stay below 200 mg. Sensitivity varies widely; some people experience anxiety or disrupted sleep at much lower doses.",
  },
  {
    question: "How long does caffeine stay in your system?",
    answer:
      "Caffeine has a half-life of approximately 5–6 hours in most adults, meaning half the caffeine from a cup of coffee is still in your system 5–6 hours later. Factors like age, liver function, pregnancy, and certain medications can extend this significantly.",
  },
  {
    question: "What are the signs of too much caffeine?",
    answer:
      "Symptoms of excessive caffeine intake include rapid heartbeat, anxiety, jitteriness, insomnia, headaches, dizziness, and digestive upset. Very high doses (above 1,200 mg) can cause seizures and are potentially fatal, though this is rare from beverages alone.",
  },
  {
    question: "Does caffeine tolerance develop over time?",
    answer:
      "Yes. Regular caffeine consumption leads to tolerance, meaning you need more to achieve the same effect. Tolerance develops within days of consistent use. Taking periodic breaks — even just 1–2 days — can reset sensitivity and reduce dependence.",
  },
  {
    question: "What is the best time to have caffeine?",
    answer:
      "Cortisol levels are naturally highest in the first 1–2 hours after waking, so delaying your first caffeine intake until 90–120 minutes after waking may be more effective. Avoid caffeine within 6 hours of bedtime to protect sleep quality.",
  },
];

export const metadata: Metadata = {
  title: "Caffeine Intake Calculator | Track Daily Coffee & Tea Consumption",
  description:
    "Track your total daily caffeine intake from coffee, tea, energy drinks, and sodas. See if you are within safe limits and understand how caffeine affects your body.",
  keywords: [
    "caffeine calculator",
    "daily caffeine intake",
    "coffee caffeine tracker",
    "caffeine limit calculator",
    "how much caffeine is safe",
    "caffeine consumption tracker",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Caffeine Intake Calculator — Track Your Daily Consumption",
    description: "Add your drinks and see your total caffeine intake against the recommended daily limit.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Caffeine Intake Calculator",
    description: "Track caffeine from coffee, tea, and energy drinks. See if you are within safe daily limits.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Caffeine Intake Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free caffeine tracker for coffee, tea, energy drinks, and sodas with daily limit comparison.",
    featureList: ["Multiple drink types", "Daily limit comparison", "Caffeine half-life info"],
  };
}

export default function CaffeineCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Caffeine Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Caffeine Intake Calculator"
        description="Track your total daily caffeine consumption from coffee, tea, energy drinks, and sodas. Compare against the recommended 400 mg daily limit for healthy adults."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Caffeine content in common drinks</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Caffeine content varies enormously between drink types and even between brands. An 8 oz cup of brewed coffee typically contains 80–100 mg, but a double espresso shot contains around 120–140 mg in just 2 oz. Energy drinks range from 80 mg (Red Bull 250 ml) to over 300 mg in larger cans. Black tea averages 40–70 mg per cup, while green tea contains 20–45 mg.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Cold brew coffee is particularly high — the extended steeping process extracts more caffeine, often resulting in 150–200 mg per 8 oz serving. Decaf coffee is not caffeine-free; it typically contains 2–15 mg per cup, which can add up for heavy decaf drinkers.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How caffeine works in the body</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Caffeine is a central nervous system stimulant that works primarily by blocking adenosine receptors. Adenosine is a neurotransmitter that promotes sleepiness — it accumulates throughout the day, making you progressively more tired. Caffeine molecules are structurally similar to adenosine and bind to the same receptors without activating them, effectively blocking the sleep signal.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              This blockade also triggers the release of dopamine and norepinephrine, which increase alertness, improve mood, and enhance cognitive performance. The effects typically begin within 15–45 minutes of consumption and peak around 30–60 minutes after ingestion.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Caffeine and sleep quality</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              One of the most significant and underappreciated effects of caffeine is its impact on sleep. With a half-life of 5–6 hours, a 200 mg coffee at 3 pm still leaves 100 mg active in your system at 9 pm. This can delay sleep onset, reduce total sleep time, and suppress deep slow-wave sleep — even if you feel like you fall asleep normally.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Research by Matthew Walker and others suggests that caffeine consumed even 6 hours before bedtime can reduce total sleep time by over an hour. The practical recommendation is to cut off caffeine by early afternoon — typically no later than 2–3 pm for most people.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Special populations and caffeine limits</h2>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Pregnant women:</strong> The NHS and WHO recommend limiting caffeine to 200 mg per day during pregnancy. High caffeine intake is associated with increased risk of miscarriage and low birth weight.</li>
              <li><strong className="text-foreground">Children and adolescents:</strong> No safe level has been established for children. The American Academy of Pediatrics recommends that adolescents consume no more than 100 mg per day.</li>
              <li><strong className="text-foreground">People with anxiety disorders:</strong> Caffeine can exacerbate anxiety symptoms and panic attacks. Those with anxiety disorders may benefit from significantly reducing or eliminating caffeine.</li>
              <li><strong className="text-foreground">People with heart conditions:</strong> Caffeine raises heart rate and blood pressure temporarily. Those with arrhythmias or hypertension should consult their doctor about appropriate limits.</li>
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
        <CaffeineCalculator />
      </HealthToolPage>
    </>
  );
}
