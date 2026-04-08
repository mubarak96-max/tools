import Link from "next/link";
import type { Metadata } from "next";

import UAESalaryCalculator from "@/app/finance/uae-salary-calculator/components/UAESalaryCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/uae-salary-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How is salary usually structured in the UAE?",
    answer:
      "Most UAE salary packages are split into a basic salary plus allowances such as housing, transport, and other fixed benefits. Overtime and deductions are then applied on top.",
  },
  {
    question: "Is there personal income tax in the UAE?",
    answer:
      "In most employee cases, no. UAE salary calculations are usually about package structure and deductions rather than progressive personal income tax.",
  },
  {
    question: "Why separate basic salary from allowances?",
    answer:
      "Basic salary is often used for end-of-service, leave, and contract calculations, while allowances make up the rest of the monthly package.",
  },
  {
    question: "Should deductions be entered monthly or annually?",
    answer:
      "This calculator is designed around the common UAE monthly salary-package format, so deductions should be entered as monthly amounts.",
  },
];

export const metadata: Metadata = {
  title: "UAE Salary Calculator | Monthly Net Salary Calculator for Dubai and UAE Packages",
  description:
    "Calculate UAE monthly net salary from basic salary, housing, transport, other allowances, overtime, and deductions.",
  keywords: [
    "UAE salary calculator",
    "Dubai salary calculator",
    "UAE net salary calculator",
    "Dubai net salary calculator",
    "salary package calculator UAE",
    "basic salary allowance calculator UAE",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "UAE Salary Calculator for Monthly Salary Packages",
    description:
      "Estimate UAE net salary from basic salary, allowances, overtime, and deductions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UAE Salary Calculator",
    description:
      "Calculate monthly UAE net salary from salary package components.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "UAE Salary Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "AED",
    },
    description:
      "Free UAE salary calculator for package-style monthly pay structures with basic salary, allowances, overtime, and deductions.",
    featureList: [
      "Basic salary input",
      "Housing and transport allowances",
      "Overtime and deductions",
      "Monthly gross and net salary",
      "Annualized salary package view",
    ],
  };
}

export default function UAESalaryCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "UAE Salary Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const relatedTools = getRelatedFreeTools(PAGE_PATH);
  const tool = FREE_TOOLS.find((item) => item.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/finance" className="hover:text-primary">Finance</Link></li>
            <li>/</li>
            <li className="text-foreground">UAE Salary Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Finance calculator
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            UAE Salary Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate monthly UAE net salary from the package structure most employers actually use:
            basic salary, housing, transport, other allowances, overtime, and deductions.
          </p>
          {tool ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{tool.description}</p> : null}
        </div>
      </section>

      <UAESalaryCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How UAE salary packages work</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            In the UAE, employee compensation is commonly structured as a basic salary plus allowances.
            Housing and transport are the most common, with additional package items varying by employer.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Because there is generally no personal income tax for employees, the main calculation is usually:
            monthly gross salary package minus deductions, advances, or employee-side contributions.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">What to include</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Basic salary</li>
            <li>Housing allowance</li>
            <li>Transport allowance</li>
            <li>Other fixed allowances</li>
            <li>Overtime or extra pay</li>
            <li>Monthly deductions</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Why this matters</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Basic salary can matter for employment contract terms, leave calculations, and end-of-service
            estimates, while total package value matters for real monthly cash flow. This tool shows both
            the monthly take-home number and the annualized package.
          </p>
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faq.map((item) => (
            <article key={item.question} className="rounded-[1.25rem] border border-border bg-background p-5">
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Related tools</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Link href="/finance/salary-calculator" className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft">
            <h3 className="text-base font-semibold text-foreground">Global Salary Calculator</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Compare take-home pay across multiple countries in one calculator.</p>
          </Link>
          <Link href="/finance" className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft">
            <h3 className="text-base font-semibold text-foreground">Browse finance tools</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Return to the main hub for salary, loan, and finance utilities.</p>
          </Link>
          {relatedTools[0] ? (
            <Link href={relatedTools[0].href} className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft">
              <h3 className="text-base font-semibold text-foreground">{relatedTools[0].name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{relatedTools[0].description}</p>
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}
