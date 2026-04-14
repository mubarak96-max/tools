import Link from "next/link";
import type { Metadata } from "next";

import GlucoseConverter from "@/app/health/glucose-converter/components/GlucoseConverter";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/glucose-converter";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How do you convert glucose from mg/dL to mmol/L?",
    answer:
      "To convert blood glucose from mg/dL to mmol/L, divide the mg/dL value by 18.0182. A quick everyday shortcut is to divide by 18. For example, 180 mg/dL is about 10.0 mmol/L.",
  },
  {
    question: "How do you convert glucose from mmol/L to mg/dL?",
    answer:
      "To convert blood glucose from mmol/L to mg/dL, multiply the mmol/L value by 18.0182. For example, 7.0 mmol/L is about 126 mg/dL.",
  },
  {
    question: "Why do some countries use mg/dL and others use mmol/L?",
    answer:
      "The difference is just the reporting unit. The United States commonly uses mg/dL, while many other countries report glucose in mmol/L. The glucose reading itself is the same once converted correctly.",
  },
  {
    question: "What is considered low blood glucose?",
    answer:
      "ADA and CDC guidance commonly treat blood glucose below 70 mg/dL, or 3.9 mmol/L, as low blood glucose. People with diabetes may have individualized thresholds from their clinician.",
  },
  {
    question: "What are common glucose targets before and after meals?",
    answer:
      "For many non-pregnant adults with diabetes, common targets are 80 to 130 mg/dL before meals and below 180 mg/dL 1 to 2 hours after meals. Personal targets can differ by age, pregnancy status, medication use, and health conditions.",
  },
  {
    question: "Can this glucose converter diagnose diabetes?",
    answer:
      "No. This tool converts units and gives general interpretation only. Diabetes diagnosis uses formal lab criteria and clinical review, not a single converted reading from an online tool.",
  },
];

export const metadata: Metadata = {
  title: "Glucose Converter | Blood Sugar mg/dL to mmol/L Calculator",
  description:
    "Convert blood glucose and blood sugar readings between mg/dL and mmol/L instantly. Includes formula, common targets, low-glucose threshold, and health-safe interpretation.",
  keywords: [
    "glucose converter",
    "blood sugar converter",
    "blood glucose converter",
    "mg/dL to mmol/L glucose",
    "mmol/L to mg/dL glucose",
    "blood sugar unit converter",
    "glucose calculator mg dl mmol l",
    "diabetes glucose converter",
    "70 mg dL to mmol L",
    "180 mg dL to mmol L",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Glucose Converter",
    description:
      "Convert blood glucose readings between mg/dL and mmol/L with formula guidance, common targets, and clear health disclaimers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glucose Converter",
    description:
      "Convert blood sugar readings between mg/dL and mmol/L and understand common reference ranges.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Glucose Converter",
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
      "Free blood glucose converter for mg/dL to mmol/L and mmol/L to mg/dL with common blood sugar reference points, low-glucose threshold guidance, and medical safety notes.",
    featureList: [
      "Convert blood glucose between mg/dL and mmol/L",
      "Context-aware interpretation for general, before-meal, and after-meal readings",
      "Quick reference values for low threshold and common targets",
      "Formula explanation and unit comparison",
      "FAQ and medical safety disclaimer",
      "Links to related health tools",
    ],
  };
}

export default function GlucoseConverterPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Glucose Converter", path: PAGE_PATH },
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
            <li><Link href="/health" className="hover:text-primary">Health</Link></li>
            <li>/</li>
            <li className="text-foreground">Glucose Converter</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Blood glucose units
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Glucose Converter
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Convert blood glucose readings between mg/dL and mmol/L instantly, then check the result against common
            low, before-meal, and after-meal reference points used in diabetes care.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            This page is for education and tracking only. It does not diagnose diabetes or replace clinician advice.
          </p>
          <p className="mt-4 rounded-[1rem] border border-amber-300/40 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
            Blood glucose targets are individualized. Pregnancy, insulin use, frequent lows, illness, age, and other
            health conditions can change what a safe or useful target looks like for you.
          </p>
        </div>
      </section>

      <GlucoseConverter />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is a glucose converter?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A glucose converter changes the reporting unit of the same blood sugar reading. In the United States,
            glucose is usually shown in milligrams per deciliter (mg/dL). In many other countries it is shown in
            millimoles per liter (mmol/L). The number changes because the unit changes, but the underlying glucose
            concentration stays the same.
          </p>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Glucose conversion formula</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The American Diabetes Association explains the conversion in simple terms:
          </p>
          <div className="mt-4 rounded-[1.25rem] border border-border bg-background p-4 font-mono text-sm text-foreground">
            mmol/L = mg/dL / 18.0182
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-border bg-background p-4 font-mono text-sm text-foreground">
            mg/dL = mmol/L x 18.0182
          </div>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Quick examples: 70 mg/dL is about 3.9 mmol/L, 126 mg/dL is about 7.0 mmol/L, and 180 mg/dL is about 10.0 mmol/L.
          </p>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">mg/dL vs mmol/L</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Both units report the same glucose level in different ways. mg/dL reports mass concentration, while mmol/L
            reports molar concentration. The ADA notes that blood glucose in the United States is typically reported
            in mg/dL, while many other countries use mmol/L instead.
          </p>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Common blood glucose reference points</h2>
          <div className="mt-4 overflow-x-auto rounded-[1rem] border border-border">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">mg/dL</th>
                  <th className="px-4 py-3">mmol/L</th>
                  <th className="px-4 py-3">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-muted-foreground">
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Low threshold</td>
                  <td className="px-4 py-3">Below 70</td>
                  <td className="px-4 py-3">Below 3.9</td>
                  <td className="px-4 py-3">Common low-blood-glucose threshold used by ADA and CDC guidance.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Before meals</td>
                  <td className="px-4 py-3">80 to 130</td>
                  <td className="px-4 py-3">4.4 to 7.2</td>
                  <td className="px-4 py-3">Common target range for many non-pregnant adults with diabetes.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">1 to 2 hours after meals</td>
                  <td className="px-4 py-3">Below 180</td>
                  <td className="px-4 py-3">Below 10.0</td>
                  <td className="px-4 py-3">Common post-meal target used in CDC and ADA guidance.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">High reading while sick</td>
                  <td className="px-4 py-3">240 or above</td>
                  <td className="px-4 py-3">13.3 or above</td>
                  <td className="px-4 py-3">CDC notes ketone testing may be needed for some people with diabetes who are sick.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">What this tool can and cannot tell you</h2>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">It can convert units correctly:</strong> useful when switching between lab reports,
              meters, apps, or articles that use different glucose units.
            </li>
            <li>
              <strong className="text-foreground">It can add basic context:</strong> low thresholds and common targets help you understand
              the number faster.
            </li>
            <li>
              <strong className="text-foreground">It cannot diagnose diabetes:</strong> diagnosis relies on formal tests such as fasting plasma
              glucose, oral glucose tolerance testing, A1C, and clinician review.
            </li>
            <li>
              <strong className="text-foreground">It cannot replace your personal target:</strong> pregnancy, insulin use, frequent lows,
              age, and other health conditions can justify different goals.
            </li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Why people search for a blood sugar converter</h2>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Travel or international care:</strong> one country may report glucose in mmol/L while another uses mg/dL.</li>
            <li><strong className="text-foreground">Comparing apps and devices:</strong> a CGM app, meter, and article may not all use the same unit.</li>
            <li><strong className="text-foreground">Learning diabetes targets:</strong> common target ranges are easier to understand when they are shown in your familiar unit.</li>
            <li><strong className="text-foreground">Checking reference values fast:</strong> many people want quick answers such as 70 mg/dL to mmol/L or 180 mg/dL to mmol/L.</li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Related health tools</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Blood sugar is only one part of the bigger health picture. Continue with{" "}
            <Link href="/health/blood-pressure-calculator" className="text-primary hover:underline">blood pressure</Link>,{" "}
            <Link href="/utility/bmi-calculator" className="text-primary hover:underline">BMI</Link>,{" "}
            <Link href="/health/calorie-calculator" className="text-primary hover:underline">calorie needs</Link>, and{" "}
            <Link href="/health/water-intake-calculator" className="text-primary hover:underline">water intake</Link>.
          </p>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Authority and sources</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This page is aligned to public guidance from the{" "}
            <a href="https://diabetes.org/about-diabetes/common-terms" className="text-primary hover:underline" rel="noreferrer" target="_blank">
              American Diabetes Association
            </a>{" "}
            for glucose units and the{" "}
            <a href="https://www.cdc.gov/diabetes/diabetes-testing/monitoring-blood-sugar.html" className="text-primary hover:underline" rel="noreferrer" target="_blank">
              CDC
            </a>{" "}
            for common blood sugar target ranges. It is still not a substitute for professional medical advice.
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

      <RelatedToolsSection category="Health" categoryHref="/health" currentPath={PAGE_PATH} />
    </div>
  );
}
