import { Metadata } from "next";
import { BmrCalculator } from "./components/BmrCalculator";

export const metadata: Metadata = {
  title: "BMR Calculator – Free Basal Metabolic Rate Calculator (2026)",
  description: "Calculate your Basal Metabolic Rate (BMR) instantly. Free online tool using the Mifflin-St Jeor formula. Find out how many calories your body burns at rest.",
};

export default function Page() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a good BMR?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For women, an average BMR is 1,400–1,600 kcal/day. For men, it's typically 1,600–1,800 kcal/day. Your individual BMR depends on age, weight, height, and metabolism. Higher values indicate a faster metabolism."
        }
      },
      {
        "@type": "Question",
        "name": "Does BMR change with age?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, BMR typically decreases by about 2-8% per decade after age 30. This is because we naturally lose muscle mass as we age, and muscle tissue burns more calories at rest than fat tissue. Regular exercise can help maintain muscle and keep BMR higher."
        }
      },
      {
        "@type": "Question",
        "name": "What is a normal BMR for a woman?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A normal BMR for an adult woman ranges from 1,400–1,600 kcal/day, depending on age, weight, height, and fitness level. Women typically have a lower BMR than men due to generally having more body fat and less muscle mass."
        }
      },
      {
        "@type": "Question",
        "name": "How do I use BMR to lose weight?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To lose weight, consume fewer calories than your Total Daily Energy Expenditure (TDEE), which is your BMR multiplied by your activity level. For example, if your BMR is 1,500 and activity multiplier is 1.5, your TDEE is 2,250. A 500-calorie deficit would mean consuming 1,750 calories daily for 1 pound of weight loss per week."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between BMR and TDEE?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "BMR (Basal Metabolic Rate) is calories burned at rest in a neutral environment. TDEE (Total Daily Energy Expenditure) is your BMR multiplied by your activity level, representing total calories burned daily including exercise and daily activities. TDEE is always higher than BMR."
        }
      },
      {
        "@type": "Question",
        "name": "Which BMR formula is most accurate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Mifflin-St Jeor equation is considered the most accurate for modern populations. It was developed in 1990 and is more accurate than the older Harris-Benedict formula from 1919, especially for people with higher body weight."
        }
      }
    ]
  };
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to calculate your BMR",
    "description": "Calculate your Basal Metabolic Rate (BMR) instantly using this browser-based tool.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Select your gender",
        "text": "Choose either Male or Female to help the Mifflin-St Jeor formula accurately estimate your metabolic rate."
      },
      {
        "@type": "HowToStep",
        "name": "Enter your weight and height",
        "text": "Input your current body weight in kilograms and your height in centimeters."
      },
      {
        "@type": "HowToStep",
        "name": "Specify your age",
        "text": "Enter your numeric age as BMR naturally varies with age due to muscle mass changes."
      },
      {
        "@type": "HowToStep",
        "name": "Review your results",
        "text": "See your instant BMR calculation and how it translates to your Total Daily Energy Expenditure (TDEE) based on your activity level."
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <div className="space-y-6">
        <div className="max-w-3xl">
          <p className="success-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Health & Fitness Analytics
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Free BMR Calculator – Find Your Basal Metabolic Rate
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate your Basal Metabolic Rate (BMR) instantly using the Mifflin-St Jeor formula. Everything runs in your browser — discover how many calories your body burns at rest.
          </p>
        </div>
        <BmrCalculator />
      </div>
    </>
  );
}
