import Link from "next/link";
import type { Metadata } from "next";

import SalaryCalculator from "@/app/finance/salary-calculator/components/SalaryCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";
import { COUNTRIES } from "@/lib/tools/salary";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/salary-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What does salary after tax mean?",
    answer:
      "Salary after tax is the take-home pay left after income tax, payroll contributions, and other salary-linked deductions are taken from gross pay.",
  },
  {
    question: "Why does the calculator ask for country-specific options?",
    answer:
      "Salary tax systems differ by country. Filing status, tax class, province, pension contributions, and social insurance rules can all materially change net pay.",
  },
  {
    question: "Can I compare annual, monthly, weekly, and hourly pay?",
    answer:
      "Yes. Enter your salary in one pay period and the calculator estimates gross and net pay across annual, monthly, weekly, and hourly views.",
  },
  {
    question: "Is employer cost included?",
    answer:
      "Yes. The results show estimated employer-side contributions so you can compare what the company spends with what the employee actually receives.",
  },
  {
    question: "Are these salary numbers exact payroll results?",
    answer:
      "No. This tool is designed for fast planning and benchmarking. Actual payroll results depend on local rules, benefits, exemptions, and payroll software configuration.",
  },
];

export const metadata: Metadata = {
  title: "Salary Calculator | Salary After Tax Calculator for US, UK, Canada, Europe, UAE, Singapore, India, Japan",
  description:
    "Estimate salary after tax across major countries with country-specific tax settings, employer cost, bracket breakdowns, and annual to hourly conversions.",
  keywords: [
    "salary calculator",
    "salary after tax calculator",
    "take home pay calculator",
    "salary tax calculator",
    "net salary calculator",
    "US salary calculator",
    "UK salary calculator",
    "Canada salary calculator",
    "salary calculator Germany",
    "salary calculator UAE",
    "salary calculator India",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Salary After Tax Calculator for Global Salary Benchmarks",
    description:
      "Calculate net pay, effective tax rate, marginal rate, and employer cost across 12 countries.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary Calculator",
    description:
      "Estimate take-home salary, payroll deductions, and employer cost across major countries.",
  },
};

function buildSalaryApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Salary Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free salary after tax calculator with country-specific options, employer cost estimates, bracket visualization, and annual to hourly pay conversions.",
    featureList: [
      "Salary after tax calculation",
      "Country-specific payroll settings",
      "Employer cost estimate",
      "Bracket breakdown visualizer",
      "Annual, monthly, weekly, and hourly views",
    ],
  };
}

export default function SalaryCalculatorPage() {
  const relatedTools = getRelatedFreeTools(PAGE_PATH);
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Salary Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const salaryTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildSalaryApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/finance" className="hover:text-primary">Finance</Link></li>
            <li>/</li>
            <li className="text-foreground">Salary Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Finance calculator
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Salary After Tax Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Estimate take-home pay across major countries with country-specific tax settings,
            payroll contributions, bracket-level tax views, and employer cost.
          </p>
          {salaryTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{salaryTool.description}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-2">
            {COUNTRIES.slice(0, 6).map((country) => (
              <span
                key={country.code}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground"
              >
                {country.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <SalaryCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How salary after tax works</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Gross salary is only the starting point. What you actually receive depends on the
            country&apos;s income tax system, employee payroll contributions, and sometimes optional
            deductions such as pension contributions, RRSPs, or pre-tax salary sacrifice.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This calculator normalizes those moving parts into one flow: choose a country, enter
            a salary, adjust any country-specific fields, and review take-home pay plus employer cost.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">What the calculator shows</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Net pay across annual, monthly, weekly, and hourly views</li>
            <li>Income tax, payroll contributions, and other deductions</li>
            <li>Effective tax rate versus marginal tax rate</li>
            <li>Employer-side contribution estimate</li>
            <li>Bracket-level visualization where progressive tax applies</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Supported countries</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The current version covers the United States, Canada, the United Kingdom, Germany,
            France, the Netherlands, Spain, Italy, the United Arab Emirates, Singapore, India,
            and Japan. Each country uses a tailored estimate rather than a one-size-fits-all flat tax.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">When to use this tool</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Comparing job offers across different countries</li>
            <li>Checking how pension or pre-tax contributions change take-home pay</li>
            <li>Benchmarking contractor versus payroll employment in new markets</li>
            <li>Planning relocations and compensation discussions</li>
          </ul>
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
          <Link
            href="/finance"
            className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
          >
            <h3 className="text-base font-semibold text-foreground">Browse finance tools</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Move across calculators, loan tools, and upcoming utility pages from the central hub.
            </p>
          </Link>
          <Link
            href="/tools"
            className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
          >
            <h3 className="text-base font-semibold text-foreground">Explore software tools</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Return to the main software directory for structured product comparisons.
            </p>
          </Link>
          {relatedTools[0] ? (
            <Link
              href={relatedTools[0].href}
              className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
            >
              <h3 className="text-base font-semibold text-foreground">{relatedTools[0].name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{relatedTools[0].description}</p>
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}
