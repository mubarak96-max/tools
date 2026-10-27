import type { HubContent } from "./types";

export const healthHub: HubContent = {
  path: "/health",
  label: "Health Tools",
  metaTitle: "Free Health Calculators: BMR, TDEE Calories & Navy Body Fat",
  metaDescription:
    "Free health calculators for basal metabolic rate (BMR), daily calorie needs (TDEE) and body fat percentage using the US Navy method, with the formulas explained.",
  h1: "Health calculators for energy needs and body composition",
  lead:
    "Estimate how many calories your body uses, set a calorie target for your goal, and track body fat with the US Navy tape-measure method.",
  notice:
    "These tools are for education, planning and self-tracking. They don't replace diagnosis, treatment or individual medical advice. Talk to a doctor or registered dietitian before making big changes to your diet or exercise.",
  intro: [
    "Calorie and body-composition estimates are a starting point, not a prescription. The BMR and TDEE calculators use the Mifflin-St Jeor equation, which research has found to be the most accurate predictive formula for most adults, then multiply by an activity factor to estimate daily needs. Real needs can differ by 10% or more, so adjust based on how your weight actually changes over a few weeks.",
    "The Navy body fat method estimates body fat percentage from height and neck, waist and (for women) hip measurements. It's a practical way to track trends at home. Measure the same way each time, because consistency matters more than any single reading.",
  ],
  groups: [
    {
      heading: "Energy and calories",
      intro: "Find your resting energy use and the daily calories to maintain, lose or gain weight.",
      hrefs: ["/health/bmr-calculator", "/health/calorie-calculator"],
    },
    {
      heading: "Body composition",
      intro: "Estimate body fat percentage from simple tape measurements.",
      hrefs: ["/health/us-navy-body-fat-calculator"],
    },
  ],
  methodology: {
    heading: "Formulas used",
    points: [
      {
        title: "Mifflin-St Jeor (BMR)",
        body: "Men: 10 × weight (kg) + 6.25 × height (cm) − 5 × age + 5. Women: the same, minus 161 instead of plus 5.",
      },
      {
        title: "Activity multipliers (TDEE)",
        body: "BMR is multiplied by a standard factor, from 1.2 (sedentary) to 1.9 (very active), to estimate total daily energy use.",
      },
      {
        title: "US Navy circumference method",
        body: "Uses the published US Department of Defense equations based on height and neck, waist and hip circumferences.",
      },
      {
        title: "Private",
        body: "Your measurements stay in your browser and aren't stored.",
      },
    ],
  },
  faqs: [
    {
      question: "What's the difference between BMR and TDEE?",
      answer:
        "BMR (basal metabolic rate) is the energy your body uses at complete rest just to stay alive. TDEE (total daily energy expenditure) adds the energy for daily activity and exercise. TDEE is the number to base a calorie target on.",
    },
    {
      question: "How many calories should I cut to lose weight?",
      answer:
        "A common, sustainable approach is a deficit of about 300–500 calories a day below your TDEE, which typically works out to roughly 0.25–0.5 kg (0.5–1 lb) a week. Larger deficits are harder to sustain and should be supervised by a professional.",
    },
    {
      question: "How accurate is the Navy body fat calculator?",
      answer:
        "It usually lands within a few percentage points of lab methods like DEXA for most people, but it can be less accurate for very lean or very muscular builds. It's best used to track change over time.",
    },
  ],
};
