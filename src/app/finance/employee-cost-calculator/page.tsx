import Link from "next/link";
import type { Metadata } from "next";

import EmployeeCostCalculator from "@/app/finance/employee-cost-calculator/components/EmployeeCostCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/employee-cost-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is included in total employer cost?",
    answer:
      "This page includes annual gross salary, estimated employer federal payroll taxes, annual benefits cost, and employer retirement contribution based on the percentage you enter.",
  },
  {
    question: "Does this include state unemployment tax or workers' compensation?",
    answer:
      "No. Those costs vary widely by state, industry, and insurer, so this page keeps the estimate to federal payroll taxes plus the benefits fields you enter directly.",
  },
  {
    question: "Why is this useful?",
    answer:
      "A salary figure alone understates the real cost of employment. This calculator helps with budgeting, headcount planning, and offer modeling.",
  },
];

export const metadata: Metadata = {
  title: "Employee Cost Calculator | Salary Plus Payroll Taxes and Benefits",
  description:
    "Estimate total U.S. employer cost from annual salary, employer federal payroll taxes, annual benefits cost, and retirement contributions.",
  keywords: [
    "employee cost calculator",
    "cost to employer calculator",
    "fully loaded employee cost calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Employee Cost Calculator",
    description: "Estimate the total employer cost of an employee beyond base salary.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Employee Cost Calculator",
    description: "Estimate salary plus payroll taxes, benefits, and retirement cost.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Employee Cost Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free employee cost calculator for U.S. salary, employer payroll taxes, benefits, and retirement contribution planning.",
  };
}

export default function EmployeeCostCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Employee Cost Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">Employee Cost Calculator</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">Business Finance</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Employee Cost Calculator</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Estimate the real annual employer cost of a U.S. employee by combining salary with employer federal payroll taxes, benefits, and retirement contribution planning.
          </p>
        </div>
      </section>
      <EmployeeCostCalculator />
      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Payroll tax assumptions used</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Verified on April 10, 2026. Employer payroll tax estimates on this page use the same federal 2026 Social Security, Medicare, and FUTA assumptions as the payroll tax calculator.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href="https://www.irs.gov/taxtopics/tc751"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                IRS Topic 751
              </a>
            </li>
            <li>
              <a
                href="https://www.irs.gov/publications/p15"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                IRS Publication 15 (2026)
              </a>
            </li>
            <li>
              <a
                href="https://www.ssa.gov/OACT/COLA/cbb.html"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                SSA contribution and benefit base for 2026
              </a>
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
      <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath={PAGE_PATH} />
    </div>
  );
}
