import type { Metadata } from "next";
import { IntermittentFastingCalculator } from "./components/IntermittentFastingCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/intermittent-fasting-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What can I consume during a fasting window?",
    answer:
      "During a fasting window, you should stick to zero-calorie drinks: water, plain black coffee, and plain tea (without milk, sugar, or sweeteners that contain calories). These do not trigger an insulin response and will not break your fast. Sparkling water is also fine. Bone broth is sometimes consumed during fasting but does contain calories and will technically break a strict fast, though some practitioners allow it for extended fasts.",
  },
  {
    question: "Will intermittent fasting cause muscle loss?",
    answer:
      "Short-term intermittent fasting (16–24 hours) does not cause significant muscle loss in most people, especially when combined with adequate protein intake and resistance training. Growth hormone levels actually rise during fasting, which helps preserve lean mass. The risk of muscle loss increases with very prolonged fasts (48+ hours) or when total calorie intake is severely restricted over time. Eating sufficient protein within your eating window and continuing to train are the most effective ways to protect muscle while fasting.",
  },
  {
    question: "How long does it take to see results from intermittent fasting?",
    answer:
      "Most people notice changes in energy levels and hunger patterns within 1–2 weeks as the body adapts to the new eating schedule. Weight loss results, if that is the goal, typically become visible after 3–4 weeks of consistent practice. Metabolic benefits like improved insulin sensitivity and reduced inflammation develop over months of consistent practice. Results vary significantly based on what you eat during your eating window — intermittent fasting is not a licence to eat unlimited calories.",
  },
  {
    question: "Is it normal to feel hungry during the fasting window?",
    answer:
      "Yes, especially in the first 1–2 weeks. Hunger is partly driven by habit and the hormone ghrelin, which rises at times when you normally eat. As your body adapts to your new eating schedule, ghrelin patterns shift and hunger during the fasting window typically diminishes significantly. Staying well hydrated, keeping busy, and gradually extending your fasting window (rather than jumping straight to 16+ hours) can make the adaptation period more manageable.",
  },
  {
    question: "Who should not try intermittent fasting?",
    answer:
      "Intermittent fasting is not appropriate for everyone. It is not recommended for pregnant or breastfeeding women, children and teenagers, people with a history of eating disorders, those who are underweight, or people with type 1 diabetes or those on insulin or other glucose-lowering medications (due to hypoglycaemia risk). People with certain medical conditions or those taking medications that must be taken with food should consult their doctor before starting. If you feel unwell, dizzy, or experience heart palpitations while fasting, stop and seek medical advice.",
  },
];

export const metadata: Metadata = {
  title: "Intermittent Fasting Calculator | 16:8, 18:6 & 20:4 Schedules",
  description:
    "Generate your personalised intermittent fasting schedule. Calculate eating and fasting windows for 16:8, 18:6, 20:4, and 12:12 protocols based on your preferred start time.",
  keywords: [
    "intermittent fasting calculator",
    "16:8 fasting schedule",
    "fasting window calculator",
    "eating window calculator",
    "intermittent fasting schedule",
    "18:6 fasting calculator",
    "20:4 warrior diet calculator",
    "IF schedule generator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Intermittent Fasting Calculator | 16:8, 18:6 & 20:4 Schedules",
    description:
      "Generate your personalised intermittent fasting schedule for 16:8, 18:6, 20:4, and 12:12 protocols.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Intermittent Fasting Calculator",
    description:
      "Calculate your eating and fasting windows for popular IF protocols including 16:8, 18:6, and 20:4.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Intermittent Fasting Schedule Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free intermittent fasting calculator that generates personalised eating and fasting windows for 16:8, 18:6, 20:4, and 12:12 protocols.",
    featureList: [
      "Multiple fasting protocol support",
      "Custom start time input",
      "Eating window calculation",
      "Fasting window end time",
    ],
  };
}

export default function IntermittentFastingCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Intermittent Fasting Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Intermittent Fasting Schedule"
        description="Calculate your eating and fasting windows for popular IF protocols. Choose from 16:8, 18:6, 20:4, or 12:12 and set your preferred eating start time."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is intermittent fasting?</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Intermittent fasting (IF) is an eating pattern that cycles between defined periods of fasting and eating. Unlike conventional diets, it does not prescribe which foods to eat — it focuses entirely on <em>when</em> you eat them. The most common approach is time-restricted eating, where all food consumption is confined to a specific window each day and the remaining hours are spent fasting.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The four most widely practised protocols are the <strong>12:12</strong> (12 hours fasting, 12 hours eating — a gentle entry point), the <strong>16:8</strong> (16 hours fasting, 8 hours eating — the most popular method), the <strong>18:6</strong> (18 hours fasting, 6 hours eating — a more advanced approach), and the <strong>20:4 Warrior Diet</strong> (20 hours fasting with one large meal in a 4-hour window). There are also alternate-day fasting and 5:2 protocols (eating normally five days a week and restricting to 500–600 calories on two non-consecutive days), though these are less common for daily scheduling.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              For most people, the 16:8 protocol is the most sustainable starting point. Skipping breakfast and eating between noon and 8 pm, for example, requires no special preparation and fits naturally around work and social schedules. The 16-hour fast includes 7–8 hours of sleep, meaning the actual conscious fasting period is only 8 hours.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">The science behind fasting</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Intermittent fasting produces several well-documented physiological changes that explain its health benefits. Understanding the mechanisms helps set realistic expectations and motivates consistent practice.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              <strong>Insulin sensitivity</strong> is one of the most significant effects. When you eat, blood glucose rises and the pancreas releases insulin to shuttle glucose into cells. Frequent eating keeps insulin levels chronically elevated, which over time can lead to insulin resistance — a precursor to type 2 diabetes. During a fasting period, insulin levels fall, allowing cells to become more responsive to insulin again. Studies show that 16:8 fasting can reduce fasting insulin levels by 20–31% and improve insulin sensitivity meaningfully within weeks.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              <strong>Autophagy</strong> is a cellular housekeeping process that accelerates during fasting. The word comes from the Greek for "self-eating" — cells break down and recycle damaged proteins, dysfunctional organelles, and other cellular debris. This process is thought to play a role in longevity, cancer prevention, and protection against neurodegenerative diseases. Autophagy begins to increase meaningfully after about 14–16 hours of fasting and peaks around 24–48 hours. The 2016 Nobel Prize in Physiology or Medicine was awarded to Yoshinori Ohsumi for his work on autophagy mechanisms.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              <strong>Human growth hormone (HGH)</strong> levels rise dramatically during fasting — some studies report increases of 300–500% after a 24-hour fast. HGH promotes fat burning, muscle preservation, and cellular repair. This hormonal shift is one reason why short-term fasting does not cause the muscle loss that chronic calorie restriction can produce.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              <strong>Metabolic switching</strong> — the transition from burning glucose to burning fat as the primary fuel source — occurs after glycogen stores are depleted, typically after 12–16 hours of fasting. The liver converts fatty acids into ketone bodies, which serve as an efficient alternative fuel for the brain and muscles. This metabolic flexibility is associated with improved cognitive function, reduced inflammation, and more stable energy levels throughout the day.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Who should not fast</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Intermittent fasting is not appropriate for everyone, and certain groups should avoid it or seek medical guidance before starting. <strong>Pregnant and breastfeeding women</strong> have increased nutritional needs and should not restrict eating windows. <strong>Children and teenagers</strong> are still growing and require consistent nutrient intake throughout the day. <strong>People with a history of eating disorders</strong> — including anorexia, bulimia, or orthorexia — may find that structured fasting triggers disordered thinking around food.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              People with <strong>type 1 diabetes</strong> or those taking <strong>insulin or sulphonylureas</strong> face a risk of hypoglycaemia (dangerously low blood sugar) during fasting and must not attempt IF without close medical supervision and medication adjustment. Those who are <strong>underweight</strong> or have conditions that require regular medication with food should also consult their doctor first. If you experience dizziness, heart palpitations, extreme weakness, or fainting while fasting, stop immediately and seek medical advice.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to break a fast properly</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              For standard 16–18 hour fasts, there is no need for a special "breaking the fast" protocol — you can eat a normal, balanced meal. However, after longer fasts (24+ hours), reintroducing food gradually is advisable to avoid digestive discomfort. Start with something easily digestible: a small portion of fruit, a light soup, or a handful of nuts. Wait 20–30 minutes before eating a larger meal.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The quality of your first meal matters more than the timing. Prioritise <strong>protein</strong> (to support muscle protein synthesis), <strong>healthy fats</strong> (to support satiety and hormone production), and <strong>complex carbohydrates</strong> (to replenish glycogen stores). Avoid breaking a fast with highly processed foods, large amounts of refined sugar, or alcohol — these can cause a rapid blood sugar spike followed by a crash, undermining the metabolic benefits of the fast.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common beginner mistakes and how to avoid them</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The most common mistake beginners make is <strong>overeating during the eating window</strong>. Intermittent fasting creates a natural calorie deficit for many people, but this effect disappears if you compensate by eating significantly more than usual. The goal is to eat normally — not to restrict calories aggressively, but also not to treat the eating window as a licence to binge.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Another frequent error is <strong>starting too aggressively</strong>. Jumping straight from three meals a day to a 20:4 protocol is a recipe for misery and failure. A better approach is to start with 12:12, spend a week or two adapting, then gradually extend the fasting window by an hour every few days until you reach your target protocol. This gives your hunger hormones time to adjust.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              <strong>Not drinking enough water</strong> is also common. Thirst is often mistaken for hunger, and dehydration makes fasting feel much harder. Aim for at least 2–3 litres of water per day, spread throughout both the fasting and eating windows. Black coffee and plain tea can help manage hunger and provide a mild energy boost during the fasting window without breaking the fast.
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
        <IntermittentFastingCalculator />
      </HealthToolPage>
    </>
  );
}
