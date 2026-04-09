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

const faq = [
  {
    question: "What is BMI?",
    answer:
      "Body Mass Index (BMI) is a simple measurement using your height and weight to work out if your weight is healthy. It is widely used by doctors and health professionals as a basic screening tool.",
  },
  {
    question: "How is BMI calculated?",
    answer:
      "For metric calculations, BMI is your weight in kilograms divided by your height in meters squared. For imperial calculations, the weight in pounds is divided by the height in inches squared, and then multiplied by a conversion factor of 703.",
  },
  {
    question: "Is BMI an accurate measure of health?",
    answer:
      "While BMI is a useful indicator of healthy weight for most people, it has limitations. It does not distinguish between fat and muscle mass. Therefore, athletes with high muscle mass may have a high BMI without having high body fat.",
  },
  {
    question: "What is the healthy BMI range?",
    answer:
      "A BMI between 18.5 and 24.9 is considered the healthy weight range for adults. A BMI below 18.5 is considered underweight, 25 to 29.9 is overweight, and 30 or higher is considered obese.",
  },
];

export const metadata: Metadata = {
  title: "BMI Calculator | Calculate Body Mass Index",
  description:
    "Free online BMI calculator to check your Body Mass Index and find your ideal weight range. Supports both metric (kg/cm) and imperial (lbs/ft) units.",
  keywords: [
    "BMI calculator",
    "Body Mass Index",
    "calculate BMI",
    "ideal weight calculator",
    "healthy weight range",
    "BMI metric imperial",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "BMI Calculator",
    description:
      "Calculate your Body Mass Index (BMI) instantly using metric or imperial units.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BMI Calculator",
    description:
      "Free online BMI calculator to check your Body Mass Index.",
  },
};

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
            Utility Math
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            BMI Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate your Body Mass Index (BMI) to understand your healthy weight range. Easily switch between metric (cm/kg) and imperial (ft/lbs) measurements.
          </p>
        </div>
      </section>

      <BMICalculator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Understanding your BMI result</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Your Body Mass Index (BMI) is a simplified health metric that provides a general idea of whether your weight is in a healthy proportion to your height. It is used internationally by health organizations.
          </p>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">BMI Categories</h2>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">Underweight (Under 18.5)</strong> — Being underweight could be a sign you are not eating enough or you may be ill. If you are underweight, a GP can help.
            </li>
            <li>
              <strong className="text-foreground">Normal / Healthy Weight (18.5 to 24.9)</strong> — Keep up the good work! For adults, falling into this range means your weight is generally healthy for your height.
            </li>
            <li>
              <strong className="text-foreground">Overweight (25.0 to 29.9)</strong> — Being overweight can increase your risk of heart disease, stroke, and type 2 diabetes. 
            </li>
            <li>
              <strong className="text-foreground">Obese (30.0 and above)</strong> — People with obesity are at a higher risk of several severe medical conditions. Losing even a small amount of weight can improve your overall health.
            </li>
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
