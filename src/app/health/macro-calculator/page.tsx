import type { Metadata } from "next";
import { MacroCalculator } from "./components/MacroCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/macro-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What are macronutrients?",
    answer:
      "Macronutrients are the three main categories of nutrients that provide energy: protein (4 kcal/g), carbohydrates (4 kcal/g), and fat (9 kcal/g). Each plays distinct roles — protein builds and repairs tissue, carbohydrates fuel high-intensity activity, and fat supports hormones, brain function, and fat-soluble vitamin absorption.",
  },
  {
    question: "What macro split should I use for fat loss?",
    answer:
      "A common fat loss split is 40% protein, 35% carbohydrates, 25% fat. High protein preserves muscle during a deficit and increases satiety. However, the most important factor for fat loss is total caloric intake — macro ratios matter less than being in a consistent deficit.",
  },
  {
    question: "How much protein do I actually need?",
    answer:
      "Research consistently supports 1.6–2.2 g of protein per kg of body weight for people who exercise regularly. The upper end (2.2 g/kg) is beneficial during aggressive caloric deficits or for advanced athletes. Sedentary individuals need less — around 0.8 g/kg per day.",
  },
  {
    question: "Should I track net carbs or total carbs?",
    answer:
      "Net carbs (total carbs minus fibre) are used primarily in ketogenic diets because fibre is not digested and does not raise blood sugar. For most people following standard diets, tracking total carbohydrates is simpler and sufficient.",
  },
  {
    question: "Can I build muscle and lose fat at the same time?",
    answer:
      "Body recomposition — simultaneously building muscle and losing fat — is possible but slower than doing each separately. It works best for beginners, people returning after a break, and those with higher body fat percentages. It requires adequate protein (2+ g/kg), resistance training, and a small caloric deficit or maintenance calories.",
  },
];

export const metadata: Metadata = {
  title: "Macro Calculator | Protein, Carbs & Fat for Your Goals",
  description:
    "Calculate your ideal daily macronutrient targets — protein, carbohydrates, and fat — based on your calorie goal and fitness objectives. Supports fat loss, muscle gain, and maintenance.",
  keywords: [
    "macro calculator",
    "macronutrient calculator",
    "protein carbs fat calculator",
    "IIFYM calculator",
    "flexible dieting calculator",
    "macro split calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Macro Calculator — Protein, Carbs & Fat Targets",
    description: "Get your daily macronutrient breakdown for fat loss, muscle gain, or maintenance.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Macro Calculator",
    description: "Calculate your ideal protein, carbohydrate, and fat targets based on your calorie goal.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Macro Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free macronutrient calculator for protein, carbohydrates, and fat based on calorie goals.",
    featureList: ["Goal-based macro splits", "Gram and percentage breakdowns", "Fat loss and muscle gain presets"],
  };
}

export default function MacroCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Macro Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Macro Calculator"
        description="Break down your daily calorie target into protein, carbohydrates, and fat based on your fitness goal. Supports fat loss, muscle gain, and maintenance splits."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Understanding macronutrients</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Every food you eat contains some combination of protein, carbohydrates, and fat — the three macronutrients. Each provides energy (calories) and serves specific physiological functions. Understanding how to balance them for your goal is the foundation of evidence-based nutrition.
            </p>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Protein (4 kcal/g):</strong> The building block of muscle, enzymes, and hormones. Essential for muscle repair and growth. Has the highest thermic effect — your body burns 20–30% of protein calories just digesting it.</li>
              <li><strong className="text-foreground">Carbohydrates (4 kcal/g):</strong> The body's preferred fuel for high-intensity exercise. Stored as glycogen in muscles and liver. Not essential for survival but important for performance and brain function.</li>
              <li><strong className="text-foreground">Fat (9 kcal/g):</strong> Essential for hormone production, brain health, and absorption of fat-soluble vitamins (A, D, E, K). More calorie-dense than protein or carbs, so portion awareness matters.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Recommended macro splits by goal</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              There is no single optimal macro ratio — the best split is one you can sustain consistently. These are evidence-based starting points:
            </p>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Fat loss:</strong> 35–40% protein, 30–35% carbohydrates, 25–30% fat. High protein preserves muscle and increases satiety during a caloric deficit.</li>
              <li><strong className="text-foreground">Muscle gain:</strong> 25–30% protein, 45–55% carbohydrates, 20–25% fat. Higher carbs support training intensity and glycogen replenishment.</li>
              <li><strong className="text-foreground">Maintenance:</strong> 25–30% protein, 40–50% carbohydrates, 25–30% fat. Balanced approach for body composition maintenance.</li>
              <li><strong className="text-foreground">Ketogenic:</strong> 20–25% protein, 5–10% carbohydrates, 65–75% fat. Very low carb forces the body into ketosis, using fat as primary fuel.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to track your macros</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Macro tracking (also called IIFYM — If It Fits Your Macros) involves logging everything you eat and comparing it against your daily targets. Apps like MyFitnessPal, Cronometer, and MacroFactor make this practical by providing a database of food nutritional information.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              For accuracy, weigh food on a kitchen scale rather than using volume measurements. Cooked weights differ significantly from raw weights — 100 g of raw chicken breast becomes approximately 75 g when cooked. Log food in its raw state for consistency, or use the cooked weight with a cooked food entry.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              You do not need to hit your macros exactly every day. Aim to be within 5–10 g of your protein target and within 10–15% of your carb and fat targets. Consistency over weeks matters far more than perfection on any single day.
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
        <MacroCalculator />
      </HealthToolPage>
    </>
  );
}
