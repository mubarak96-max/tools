import Link from "next/link";
import type { Metadata } from "next";

import SalaryToHourlyCalculator from "@/app/finance/salary-to-hourly-calculator/components/SalaryToHourlyCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/salary-to-hourly-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How do you calculate salary to hourly pay?",
    answer:
      "To convert an annual salary to an hourly wage, you first divide your total salary by the number of weeks you work in a year (usually 52). Then, divide that weekly number by the number of hours you work each week (usually 40). For example, $50,000 / 52 weeks / 40 hours = $24.04 per hour.",
  },
  {
    question: "Does this calculation include taxes?",
    answer:
      "No. This calculator provides your gross pay breakdown, meaning the raw numbers before any federal, state, or social security taxes are deducted from your paycheck.",
  },
  {
    question: "What if I don't get paid vacation time?",
    answer:
      "By default, the calculator assumes you are paid for 52 weeks out of the year (which includes paid time off). If you take unpaid time off, simply lower the 'Weeks worked / Yr' input to accurately reflect your actual earning potential.",
  },
  {
    question: "Is bi-weekly the same as semi-monthly?",
    answer:
      "No. Bi-weekly means you are paid every 2 weeks (amounting to 26 paychecks a year). Semi-monthly means you are paid twice a month, usually on the 1st and 15th (amounting to 24 paychecks a year).",
  },
];

export const metadata: Metadata = {
  title: "Salary to Hourly Calculator | Wage Converter",
  description:
    "Convert your annual salary to an hourly wage, or convert your hourly pay to a yearly salary. Includes daily, weekly, bi-weekly, and monthly breakdowns.",
  keywords: [
    "salary to hourly",
    "hourly wage calculator",
    "annual salary calculator",
    "paycheck calculator",
    "biweekly salary",
    "convert salary to hourly",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Salary to Hourly Calculator",
    description:
      "Instantly convert your salary into a breakdown of hourly, daily, weekly, and monthly pay.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary to Hourly Calculator",
    description:
      "Convert your annual salary to hourly, daily, and monthly pay intervals.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Salary to Hourly Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "A fast client-side calculator that converts any pay period (annual, monthly, hourly) into all other equivalent gross wage blocks based on customizable work hours.",
    featureList: [
      "Bi-directional wage calculation",
      "Custom hours per week",
      "Custom weeks per year",
      "Instant currency formatting",
    ],
  };
}

export default function SalaryToHourlyCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Salary to Hourly Calculator", path: PAGE_PATH },
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
            <li><Link href="/finance" className="hover:text-primary">Finance</Link></li>
            <li>/</li>
            <li className="text-foreground">Salary to Hourly Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Financial Math
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Salary to Hourly Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Instantly convert your current pay into an hourly, daily, weekly, bi-weekly, monthly, and annual breakdown. You can enter an annual salary or work backwards from an hourly wage.
          </p>
        </div>
      </section>

      <SalaryToHourlyCalculator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why calculate your hourly equivalent?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            When considering a job offer, an annual salary can sometimes mask the reality of the required workload. By converting a rigid salary into an hourly wage based on exactly how many hours your company expects you to work, you can determine if a high-paying job is actually worth the time commitment.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Additionally, if you are transitioning from a full-time salaried position to a freelance or contractor role, it is crucial to know your baseline hourly rate so you don't accidentally undercharge clients for your time.
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

      <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath={PAGE_PATH} />
    </div>
  );
}
