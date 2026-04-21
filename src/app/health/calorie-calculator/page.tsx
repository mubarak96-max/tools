import type { Metadata } from "next";
import { CalorieCalculator } from "./components/CalorieCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/calorie-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is TDEE and why does it matter?",
    answer:
      "TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns in a day, including your basal metabolic rate plus all physical activity. It is the most important number for managing weight — eating below your TDEE creates a deficit for fat loss, eating above it leads to weight gain.",
  },
  {
    question: "How accurate are TDEE calculators?",
    answer:
      "TDEE calculators provide an estimate with a margin of error of roughly 10–15%. Individual variation in metabolism, non-exercise activity thermogenesis (NEAT), and gut microbiome all affect actual caloric needs. Use the result as a starting point and adjust based on real-world results over 2–3 weeks.",
  },
  {
    question: "How many calories should I eat to lose weight?",
    answer:
      "A deficit of 500 calories per day below your TDEE produces approximately 0.5 kg (1 lb) of fat loss per week. Larger deficits accelerate loss but increase muscle loss and metabolic adaptation. Most experts recommend a deficit of 300–500 calories for sustainable fat loss.",
  },
  {
    question: "What activity level should I select?",
    answer:
      "Most people overestimate their activity level. Sedentary means a desk job with little exercise. Lightly active means 1–3 days of exercise per week. Moderately active means 3–5 days. Very active means hard exercise 6–7 days per week. Extra active is for physical jobs or twice-daily training.",
  },
  {
    question: "Should I eat back calories burned during exercise?",
    answer:
      "If you selected an accurate activity level, exercise calories are already factored into your TDEE. Eating back exercise calories is only relevant if you used a sedentary multiplier and are tracking workouts separately. Avoid double-counting.",
  },
];

export const metadata: Metadata = {
  title: "Calorie Calculator (TDEE) | Total Daily Energy Expenditure",
  description:
    "Calculate your Total Daily Energy Expenditure (TDEE) and daily calorie needs based on your age, weight, height, and activity level using the Mifflin-St Jeor formula.",
  keywords: [
    "calorie calculator",
    "TDEE calculator",
    "total daily energy expenditure",
    "daily calorie needs",
    "calorie intake calculator",
    "Mifflin St Jeor calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Calorie Calculator — Find Your TDEE",
    description: "Calculate your daily calorie needs for weight loss, maintenance, or muscle gain.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calorie Calculator (TDEE)",
    description: "Find your Total Daily Energy Expenditure and set the right calorie target for your goals.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Calorie Calculator (TDEE)",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free TDEE calculator using the Mifflin-St Jeor formula with activity level multipliers.",
    featureList: ["Mifflin-St Jeor formula", "Activity level multipliers", "Weight loss and gain targets"],
  };
}

export default function CalorieCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Calorie Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Calorie Calculator (TDEE)"
        description="Estimate your Total Daily Energy Expenditure based on your age, weight, height, and activity level. Use the result to set calorie targets for weight loss, maintenance, or muscle gain."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is TDEE and how is it calculated?</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Your Total Daily Energy Expenditure (TDEE) is the total number of calories your body burns in a 24-hour period. It has four components: Basal Metabolic Rate (BMR), the Thermic Effect of Food (TEF), Non-Exercise Activity Thermogenesis (NEAT), and Exercise Activity Thermogenesis (EAT).
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              BMR accounts for roughly 60–70% of TDEE and represents the energy needed to keep your body alive at rest — breathing, circulation, cell repair, and temperature regulation. This calculator uses the Mifflin-St Jeor equation, which is considered the most accurate predictive formula for modern populations:
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              <strong>Men:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5<br />
              <strong>Women:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The BMR is then multiplied by an activity factor (1.2 to 1.9) to account for your daily movement and exercise, producing your TDEE.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Setting calorie targets for your goal</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Once you know your TDEE, setting a calorie target is straightforward:
            </p>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Fat loss:</strong> Eat 300–500 calories below your TDEE. This creates a deficit that forces the body to use stored fat for energy. Avoid deficits larger than 1,000 calories as they accelerate muscle loss and metabolic adaptation.</li>
              <li><strong className="text-foreground">Maintenance:</strong> Eat at your TDEE. Your weight should remain stable over time.</li>
              <li><strong className="text-foreground">Muscle gain:</strong> Eat 200–300 calories above your TDEE (a lean bulk). Larger surpluses lead to more fat gain without proportionally more muscle growth.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Why calorie counting is not always precise</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Food labels in many countries are allowed to be inaccurate by up to 20%. Restaurant meals can vary by hundreds of calories from stated values. Cooking methods affect caloric availability — cooked food is generally more digestible than raw. And individual gut microbiome differences mean two people can extract different amounts of energy from identical meals.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              This does not mean calorie tracking is useless — it is still the most evidence-based approach to weight management. But it does mean you should treat your TDEE as an estimate and adjust based on actual results. If you are not losing weight after two weeks at a calculated deficit, reduce intake by another 100–150 calories rather than assuming the formula is wrong.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">The role of protein in calorie management</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Protein has the highest thermic effect of any macronutrient — your body burns approximately 20–30% of protein calories just digesting it, compared to 5–10% for carbohydrates and 0–3% for fat. High protein intake also preserves muscle mass during a caloric deficit and increases satiety, making it easier to stick to a lower calorie target.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Most research supports a protein intake of 1.6–2.2 g per kg of body weight for people who exercise regularly. For a 75 kg person, that is 120–165 g of protein per day.
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
        <CalorieCalculator />
      </HealthToolPage>
    </>
  );
}
