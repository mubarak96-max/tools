import Link from "next/link";
import type { Metadata } from "next";

import AgeCalculator from "@/app/utility/age-calculator/components/AgeCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/age-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How is age calculated?",
    answer:
      "This calculator measures the calendar difference between the birth date and the comparison date, then breaks it into full years, remaining months, and remaining days.",
  },
  {
    question: "Can I calculate age on a past or future date?",
    answer:
      "Yes. Change the comparison date to find age on any valid date after the birth date.",
  },
  {
    question: "Why do months and days matter?",
    answer:
      "Exact age is often needed for forms, eligibility checks, school records, and planning where a simple year count is not precise enough.",
  },
];

export const metadata: Metadata = {
  title: "Age Calculator | Exact Age in Years, Months, and Days",
  description:
    "Calculate exact age from a birth date to any target date. See the difference in years, months, days, total weeks, and total days.",
  keywords: [
    "age calculator",
    "exact age calculator",
    "date of birth calculator",
    "calculate age in years months days",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Age Calculator",
    description:
      "Calculate exact age in years, months, and days from a birth date.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Age Calculator",
    description:
      "Find exact age and total time difference from a birth date to any target date.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Age Calculator",
    url: PAGE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free online age calculator for exact age in years, months, and days.",
    featureList: [
      "Exact age breakdown",
      "Comparison date support",
      "Total months, weeks, and days",
    ],
  };
}

export default function AgeCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "Age Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">Age Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Date Utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Age Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate exact age from a date of birth to today or any other comparison date. Use it for forms, planning, and fast date math without manual counting.
          </p>
        </div>
      </section>

      <AgeCalculator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How this age calculator works</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The tool measures the exact calendar difference between the birth date and the selected comparison date. It first counts full years, then full months, then the remaining days so the output matches how age is normally expressed in real life.
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
