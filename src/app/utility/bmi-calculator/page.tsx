import Link from "next/link";
import type { Metadata } from "next";

import BMICalculator from "@/app/utility/bmi-calculator/components/BMICalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/bmi-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Free BMI Calculator – Body Mass Index for Men, Women & Adults (Metric & Imperial)",
  description:
    "Calculate your BMI instantly using metric or imperial units. Find out if you're underweight, normal, overweight, or obese — plus your ideal weight range. Free, no sign-up.",
  keywords: [
    "bmi calculator",
    "bmi calculator for women",
    "bmi calculator for men",
    "bmi chart",
    "healthy bmi",
    "bmi calculator kg",
    "what is a good bmi",
    "overweight bmi",
    "bmi calculator by age",
    "ideal weight calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free BMI Calculator for Men and Women",
    description:
      "Check your Body Mass Index (BMI) and ideal weight range with our free, accuracy-verified calculator.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BMI Calculator Online",
    description:
      "Instantly calculate BMI for adults using both metric and imperial measurements.",
  },
};

const faq = [
  {
    question: "What is a healthy BMI for women?",
    answer:
      "According to the World Health Organization (WHO), a healthy BMI for adult women is between 18.5 and 24.9. While the formula is the same for men and women, women naturally tend to have a higher body fat percentage than men at the same BMI.",
  },
  {
    question: "What is a healthy BMI for men?",
    answer:
      "For adult men, a healthy BMI remains between 18.5 and 24.9. Men with high muscle mass (athletes or bodybuilders) should be aware that BMI may overestimate their body fatness accurately.",
  },
  {
    question: "What is a good BMI for my age?",
    answer:
      "While adult BMI categories don't change with age, some studies suggest that for seniors over 65, a slightly higher BMI (23 to 27) might be associated with better health outcomes and longevity.",
  },
  {
    question: "Is BMI different for Asian populations?",
    answer:
      "Yes. The WHO suggests that for many Asian populations, the risk of type 2 diabetes and cardiovascular disease is higher at lower BMI levels. Some countries use 23.0 as the threshold for overweight and 27.5 for obesity.",
  },
  {
    question: "What is morbidly obese BMI?",
    answer:
      "Morbid obesity, or Class III obesity, is typically defined as a BMI of 40 or higher, or a BMI of 35 or higher with associated health conditions like high blood pressure or diabetes.",
  },
  {
    question: "Can you be 'skinny fat' with a normal BMI?",
    answer:
      "Yes. A normal BMI does not guarantee health. 'Skinny fat' (Normal Weight Obesity) refers to having a healthy BMI but a high percentage of body fat and low muscle mass, which carries similar health risks to being overweight.",
  },
  {
    question: "How quickly can I change my BMI?",
    answer:
      "Healthy weight loss is generally 1-2 pounds per week. Changing your BMI is a slow process that requires consistent changes in nutrition and physical activity rather than 'crash' dieting.",
  },
  {
    question: "Does BMI measure body fat directly?",
    answer:
      "No. BMI is a screening tool based on height and weight. It does not directly measure body fat percentage or distribution (like belly fat vs. hip fat).",
  },
  {
    question: "Can I use this for my child or teenager?",
    answer:
      "No. Children and teens (ages 2–19) use a different scale called 'BMI-for-age' which uses percentiles to account for growth spurts and gender differences. This calculator is for adults aged 20 and older.",
  },
  {
    question: "What is the formula for BMI?",
    answer:
      "In metric: weight (kg) / [height (m)]². In imperial: 703 × weight (lbs) / [height (inches)]².",
  },
  {
    question: "What BMI is considered overweight for a woman?",
    answer:
      "Any BMI between 25.0 and 29.9 is categorized as overweight for both men and women by CDC and WHO standards.",
  },
];

const medicalDisclaimer = "Disclaimer: This calculator is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.";

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "BMI Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free online tool to calculate Body Mass Index (BMI) and determine ideal weight range.",
    featureList: [
      "Metric and Imperial unit support",
      "Instant BMI calculation",
      "Ideal weight range calculation",
      "Color-coded category results",
    ],
  };
}

export default function BMICalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "BMI Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/utility" className="hover:text-primary">Utility</Link></li>
            <li>/</li>
            <li className="text-foreground">BMI Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Ideal Weight Tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            BMI Calculator for Men & Women
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate your Body Mass Index (BMI) using metric or imperial units to find your ideal weight range. Our tool aligns with World Health Organization (WHO) and CDC standards for adult health screening.
          </p>
          <p className="mt-4 text-xs italic text-muted-foreground">
            {medicalDisclaimer}
          </p>
        </div>
      </section>

      <BMICalculator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Official BMI Categories for Adults</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The World Health Organization (WHO) classifies adult weight status based on the following BMI thresholds. Falling outside the "Healthy" range can increase the risk of chronic health conditions.
          </p>
          <ul className="mt-4 space-y-4 text-base leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">Underweight (Below 18.5):</strong> Being underweight can indicate malnutrition, a high metabolism, or underlying health issues. It is often associated with a weakened immune system and bone density loss.
            </li>
            <li>
              <strong className="text-foreground">Healthy Weight (18.5 – 24.9):</strong> This range is associated with the lowest risk of weight-related diseases and suggests a healthy balance between height and weight for most adults.
            </li>
            <li>
              <strong className="text-foreground">Overweight (25.0 – 29.9):</strong> Carrying excess weight in this range increases the clinical risk for hypertension (high blood pressure), type 2 diabetes, and cardiovascular strain.
            </li>
            <li>
              <strong className="text-foreground">Obese (30.0 and above):</strong> Obesity is categorized into Class I (30-34.9), Class II (35-39.9), and Class III (40+). Each tier represents an escalating risk for severe medical complications like sleep apnea and stroke.
            </li>
          </ul>

          <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">BMI Chart for Adults</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Use this standard BMI chart to quickly find your category based on your height and weight. Note that these ranges are for adults aged 20 and over.
          </p>
          <div className="mt-6 overflow-x-auto rounded-[1rem] border border-border">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Height</th>
                  <th className="px-4 py-3">Healthy (18.5-24.9)</th>
                  <th className="px-4 py-3">Overweight (25-29.9)</th>
                  <th className="px-4 py-3">Obese (30+)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {["5' 2\" (157cm)", "78 - 110 lbs", "111 - 131 lbs", "132+ lbs"].map((_, i, arr) => (
                  <tr key={i} className="text-muted-foreground">
                    <td className="px-4 py-3 font-medium text-foreground">5' 2" (157cm)</td>
                    <td className="px-4 py-3">101 - 136 lbs</td>
                    <td className="px-4 py-3">137 - 163 lbs</td>
                    <td className="px-4 py-3">164+ lbs</td>
                  </tr>
                ))}
                <tr><td className="px-4 py-3 font-medium text-foreground">5' 6" (167cm)</td><td className="px-4 py-3">115 - 154 lbs</td><td className="px-4 py-3">155 - 185 lbs</td><td className="px-4 py-3">186+ lbs</td></tr>
                <tr><td className="px-4 py-3 font-medium text-foreground">5' 10" (178cm)</td><td className="px-4 py-3">129 - 174 lbs</td><td className="px-4 py-3">175 - 208 lbs</td><td className="px-4 py-3">209+ lbs</td></tr>
                <tr><td className="px-4 py-3 font-medium text-foreground">6' 2" (188cm)</td><td className="px-4 py-3">144 - 194 lbs</td><td className="px-4 py-3">195 - 232 lbs</td><td className="px-4 py-3">233+ lbs</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">BMI for Men vs. Women</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Does BMI differ between genders? Technically, the formula for BMI is identical for men and women. However, their body compositions vary significantly. Women naturally carry a higher percentage of body fat for biological reasons (typically 6-11% more than men). 
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A man and a woman with the same BMI may have very different health profiles. Therefore, while the BMI categories remain 'fixed', clinicians often use additional metrics like waist-to-hip ratio to get a more accurate picture of a woman's or man's specific health risks.
          </p>

          <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">Critical Limitations of BMI</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            While BMI is a great population-level screening tool, it has three primary blind spots you should be aware of:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-7 text-muted-foreground">
            <li><strong>Muscle Mass:</strong> Muscle is much denser than fat. Elite athletes and bodybuilders often fall into the "Obese" category despite having very low body fat.</li>
            <li><strong>Fat Distribution:</strong> BMI cannot tell if your fat is subcutaneous (under the skin) or visceral (surrounding internal organs). Visceral fat is significantly more dangerous but isn't signaled by BMI alone.</li>
            <li><strong>Ethnicity:</strong> Research shows that healthy BMI thresholds may vary for different ethnic groups, particularly Asian and South Asian populations, who may face higher risks at lower BMI scores.</li>
          </ul>

          <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">How to Lower Your BMI Safely</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            If your BMI is in the overweight or obese range, small, sustainable changes are more effective than drastic diets. Focus on these three pillars:
          </p>
          <ul className="mt-4 list-decimal space-y-2 pl-6 text-base leading-7 text-muted-foreground">
            <li><strong>Caloric Balance:</strong> Use a <Link href="/health/calorie-calculator" className="text-primary hover:underline">Calorie Calculator</Link> to determine your maintenance levels and aim for a modest 250-500 calorie daily deficit.</li>
            <li><strong>Strength Training:</strong> Building muscle increases your Resting Metabolic Rate (BMR), helping you burn more calories even when you aren't moving.</li>
            <li><strong>Consistent Movement:</strong> Aim for 150 minutes of moderate aerobic activity per week, as recommended by the CDC.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6 border-t border-border/60 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faq.map((item, index) => (
            <article key={item.question} className={`py-4 ${index === 0 ? "" : "border-t border-border/50"}`}>
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <RelatedToolsSection category="Utility" categoryHref="/utility" currentPath={PAGE_PATH} />
    </div>
  );
}
