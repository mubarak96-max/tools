import type { Metadata } from "next";
import { BloodPressureCalculator } from "./components/BloodPressureCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/blood-pressure-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a normal blood pressure reading?",
    answer:
      "A normal blood pressure reading is below 120/80 mmHg. The first number (systolic) measures pressure when your heart beats; the second (diastolic) measures pressure between beats. Readings between 120–129 systolic with diastolic below 80 are considered elevated.",
  },
  {
    question: "What do the blood pressure categories mean?",
    answer:
      "Normal is below 120/80. Elevated is 120–129 systolic. Stage 1 hypertension is 130–139 systolic or 80–89 diastolic. Stage 2 hypertension is 140+ systolic or 90+ diastolic. A hypertensive crisis is above 180/120 and requires immediate medical attention.",
  },
  {
    question: "How often should I check my blood pressure?",
    answer:
      "Adults with normal blood pressure should check at least once every two years. Those with elevated readings or hypertension should monitor more frequently — often daily at home — as directed by their doctor. Consistent monitoring helps track trends over time.",
  },
  {
    question: "Can blood pressure vary throughout the day?",
    answer:
      "Yes. Blood pressure naturally fluctuates — it is typically lowest during sleep and rises sharply upon waking. Exercise, stress, caffeine, and even the act of measuring can temporarily raise it. For the most accurate reading, rest for five minutes before measuring and take two or three readings.",
  },
  {
    question: "What lifestyle changes help lower blood pressure?",
    answer:
      "Reducing sodium intake, maintaining a healthy weight, exercising regularly (at least 150 minutes of moderate activity per week), limiting alcohol, quitting smoking, and managing stress through techniques like meditation or deep breathing can all meaningfully lower blood pressure.",
  },
];

export const metadata: Metadata = {
  title: "Blood Pressure Category Checker | Understand Your BP Reading",
  description:
    "Check your blood pressure category instantly. Enter your systolic and diastolic readings to see if you are in the normal, elevated, or hypertension range.",
  keywords: [
    "blood pressure calculator",
    "blood pressure category checker",
    "systolic diastolic calculator",
    "hypertension checker",
    "blood pressure normal range",
    "bp reading checker",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Blood Pressure Category Checker",
    description: "Enter your systolic and diastolic readings to instantly see your blood pressure category.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blood Pressure Category Checker",
    description: "Check if your blood pressure is normal, elevated, or in the hypertension range.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Blood Pressure Category Checker",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free blood pressure category checker using AHA guidelines.",
    featureList: ["Instant category classification", "AHA guideline ranges", "Hypertensive crisis alert"],
  };
}

export default function BloodPressureCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Blood Pressure Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Blood Pressure Category Checker"
        description="Enter your systolic and diastolic readings to instantly see your blood pressure category based on American Heart Association guidelines."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Understanding blood pressure numbers</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Blood pressure is recorded as two numbers written as a ratio — for example, 120/80 mmHg. The top number is the <strong>systolic pressure</strong>, which measures the force your heart exerts on artery walls each time it beats. The bottom number is the <strong>diastolic pressure</strong>, which measures the pressure in your arteries between heartbeats when the heart is resting and refilling.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Both numbers matter. You can have a normal systolic reading but an elevated diastolic, or vice versa. The higher of the two categories determines your overall classification. For example, a reading of 125/85 would be classified as Stage 1 hypertension because the diastolic value of 85 falls in that range even though the systolic of 125 is only elevated.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">The five blood pressure categories</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The American Heart Association defines five categories based on your readings:
            </p>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Normal (below 120/80):</strong> Your heart and arteries are under healthy levels of stress. Continue healthy habits to maintain this range.</li>
              <li><strong className="text-foreground">Elevated (120–129 / below 80):</strong> Not yet hypertension, but a warning sign. Lifestyle changes can prevent progression.</li>
              <li><strong className="text-foreground">Stage 1 Hypertension (130–139 / 80–89):</strong> Your doctor may recommend lifestyle changes and possibly medication depending on your cardiovascular risk.</li>
              <li><strong className="text-foreground">Stage 2 Hypertension (140+ / 90+):</strong> Medication is typically prescribed alongside lifestyle changes at this stage.</li>
              <li><strong className="text-foreground">Hypertensive Crisis (above 180 / above 120):</strong> Seek emergency medical care immediately. This level of pressure can cause stroke, heart attack, or organ damage.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Why hypertension is called the silent killer</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              High blood pressure rarely causes noticeable symptoms until it has already caused significant damage. Most people with hypertension feel completely normal, which is why regular monitoring is so important. Over time, uncontrolled high blood pressure damages artery walls, forces the heart to work harder, and significantly increases the risk of heart disease, stroke, kidney failure, and vision loss.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              According to the CDC, nearly half of adults in the United States have hypertension, yet many are unaware of it. Regular blood pressure checks — whether at a pharmacy, doctor's office, or with a home monitor — are one of the simplest and most effective preventive health measures available.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to get an accurate reading</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The accuracy of a blood pressure reading depends heavily on technique. Follow these steps for the most reliable result:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
              <li>Sit quietly for at least five minutes before measuring.</li>
              <li>Keep your feet flat on the floor and your back supported.</li>
              <li>Rest your arm at heart level on a flat surface.</li>
              <li>Do not talk, eat, or drink caffeine or alcohol in the 30 minutes before measuring.</li>
              <li>Take two or three readings one minute apart and record the average.</li>
              <li>Measure at the same time each day for consistent tracking.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Factors that affect blood pressure</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Blood pressure is dynamic and influenced by dozens of factors. Age is one of the most significant — arteries naturally stiffen over time, raising systolic pressure. Genetics play a role too; if your parents had hypertension, your risk is higher. Other contributing factors include:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Diet:</strong> High sodium intake causes the body to retain water, increasing blood volume and pressure. The DASH diet (rich in fruits, vegetables, and low-fat dairy) is specifically designed to lower blood pressure.</li>
              <li><strong className="text-foreground">Physical activity:</strong> Regular aerobic exercise strengthens the heart, allowing it to pump more blood with less effort, which lowers resting blood pressure.</li>
              <li><strong className="text-foreground">Weight:</strong> Excess body weight requires the heart to work harder. Even a modest weight loss of 5–10 pounds can meaningfully reduce blood pressure.</li>
              <li><strong className="text-foreground">Stress:</strong> Chronic stress activates the sympathetic nervous system, raising heart rate and constricting blood vessels.</li>
              <li><strong className="text-foreground">Sleep:</strong> Poor sleep quality and sleep apnea are strongly linked to elevated blood pressure.</li>
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
        <BloodPressureCalculator />
      </HealthToolPage>
    </>
  );
}
