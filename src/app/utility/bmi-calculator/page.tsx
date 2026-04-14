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
  title: "BMI Calculator | Check Body Mass Index, Range, and Weight Category",
  description:
    "Calculate BMI with metric or imperial units, see your adult BMI category, healthy range, and next-step guidance. Includes formula, interpretation, and BMI limitations.",
  keywords: [
    "bmi calculator",
    "body mass index calculator",
    "healthy bmi range",
    "bmi chart adults",
    "bmi calculator for men",
    "bmi calculator for women",
    "bmi formula",
    "what is bmi",
    "ideal weight range",
    "body mass index meaning",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "BMI Calculator",
    description:
      "Calculate BMI, interpret the result, and understand the healthy range, formula, and limitations of BMI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BMI Calculator",
    description:
      "Check your adult BMI category, healthy range, and next-step guidance with metric or imperial units.",
  },
};

const faq = [
  {
    question: "What is BMI?",
    answer:
      "BMI stands for Body Mass Index. It is a number calculated from height and weight and is used as a screening tool for adult weight categories that may relate to health risk.",
  },
  {
    question: "What is the BMI formula?",
    answer:
      "In metric units, BMI = weight in kilograms divided by height in metres squared. In imperial units, BMI = 703 x weight in pounds divided by height in inches squared.",
  },
  {
    question: "What is a healthy BMI range for adults?",
    answer:
      "For most adults, the standard healthy BMI range is 18.5 to 24.9. Under 18.5 is underweight, 25.0 to 29.9 is overweight, and 30.0 or more is in the obesity range.",
  },
  {
    question: "Does BMI diagnose health problems?",
    answer:
      "No. BMI is a screening tool, not a diagnosis. Healthcare professionals often use it together with other measures such as waist size, blood pressure, medical history, and lab results.",
  },
  {
    question: "Can BMI be misleading for muscular people?",
    answer:
      "Yes. BMI does not distinguish between fat and muscle. Very muscular adults can have a high BMI without having excess body fat.",
  },
  {
    question: "Can children or teens use this BMI calculator?",
    answer:
      "No. This calculator is intended for adults. Children and teenagers use BMI-for-age percentiles instead of standard adult BMI categories.",
  },
];

const medicalDisclaimer =
  "BMI is a screening tool, not a diagnosis. This page is for informational purposes only and does not replace medical advice, diagnosis, or treatment.";

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
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
      "Free online BMI calculator for adults with metric and imperial units, healthy range interpretation, formula guidance, and BMI limitations.",
    featureList: [
      "Metric and imperial BMI calculator",
      "Adult BMI category interpretation",
      "Healthy BMI range guidance",
      "Ideal weight range estimate for entered height",
      "BMI formula explanation and FAQ",
      "Links to related health tools",
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
            Adult health screening
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            BMI Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate your Body Mass Index using metric or imperial units, then see what the result means for adult
            weight category, healthy range, and practical next steps.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            BMI measures weight relative to height. Example: 70 kg and 1.70 m gives a BMI of 24.2.
          </p>
          <p className="mt-4 rounded-[1rem] border border-amber-300/40 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
            {medicalDisclaimer}
          </p>
        </div>
      </section>

      <BMICalculator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is BMI?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            BMI, or Body Mass Index, is a screening measure based on height and weight. It helps classify adult weight
            into broad categories such as underweight, healthy weight, overweight, and obesity. It is useful because it
            is quick, simple, and widely used in public health and clinical screening.
          </p>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">BMI formula</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The calculation is straightforward:
          </p>
          <div className="mt-4 rounded-[1.25rem] border border-border bg-background p-4 font-mono text-sm text-foreground">
            BMI = weight (kg) / height (m)^2
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-border bg-background p-4 font-mono text-sm text-foreground">
            BMI = 703 x weight (lb) / height (in)^2
          </div>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Example: 70 kg / (1.70 x 1.70) = 24.2 BMI.
          </p>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Adult BMI categories</h2>
          <div className="mt-4 overflow-x-auto rounded-[1rem] border border-border">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">BMI range</th>
                  <th className="px-4 py-3">What it means</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-muted-foreground">
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Underweight</td>
                  <td className="px-4 py-3">Below 18.5</td>
                  <td className="px-4 py-3">Below the usual healthy range for most adults.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Healthy weight</td>
                  <td className="px-4 py-3">18.5 - 24.9</td>
                  <td className="px-4 py-3">Standard healthy screening range.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Overweight</td>
                  <td className="px-4 py-3">25.0 - 29.9</td>
                  <td className="px-4 py-3">Can indicate increased risk depending on other factors.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Obesity</td>
                  <td className="px-4 py-3">30.0 and above</td>
                  <td className="px-4 py-3">Higher risk range that deserves closer attention.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Why BMI matters</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            BMI is often used to screen for weight categories that may relate to increased risk of health problems such
            as high blood pressure, type 2 diabetes, and cardiovascular disease. On its own, BMI does not diagnose any
            condition, but it can signal when a fuller health review may be useful.
          </p>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Limitations of BMI</h2>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">BMI does not directly measure body fat:</strong> two people can have
              the same BMI and very different body composition.
            </li>
            <li>
              <strong className="text-foreground">Muscular adults may be misclassified:</strong> athletes and strength-trained
              people may have a higher BMI without excess body fat.
            </li>
            <li>
              <strong className="text-foreground">It is not the right tool for every group:</strong> children and teens
              use BMI-for-age percentiles, and clinical context matters for pregnancy, illness, and older adults.
            </li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">How to use your result</h2>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Healthy range:</strong> focus on maintaining your habits and monitoring weight changes over time.</li>
            <li><strong className="text-foreground">Above range:</strong> consider calorie intake, activity, sleep, and other risk markers instead of focusing only on the number.</li>
            <li><strong className="text-foreground">Below range:</strong> consider whether low weight is intentional and whether appetite, energy, or illness could be relevant.</li>
            <li><strong className="text-foreground">Any concern:</strong> use BMI as a prompt to speak with a qualified healthcare professional, not as a self-diagnosis.</li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Related health tools</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            BMI is more useful when paired with energy, body composition, and waist-related measures. You can continue with{" "}
            <Link href="/health/calorie-calculator" className="text-primary hover:underline">calorie needs</Link>,{" "}
            <Link href="/health/bmr-calculator" className="text-primary hover:underline">BMR</Link>,{" "}
            <Link href="/health/body-fat-calculator" className="text-primary hover:underline">body fat</Link>, and{" "}
            <Link href="/health/waist-to-hip-calculator" className="text-primary hover:underline">waist-to-hip ratio</Link>.
          </p>
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
