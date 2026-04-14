import Link from "next/link";
import type { Metadata } from "next";

import UAEGratuityCalculator from "@/app/finance/uae-gratuity-calculator/components/UAEGratuityCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { FREE_TOOLS } from "@/lib/tools/registry";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/uae-gratuity-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Is UAE gratuity calculated on total salary or basic salary?",
    answer:
      "For the standard private-sector gratuity formula, the calculation is based on basic salary, not the full package with allowances.",
  },
  {
    question: "Do housing and transport allowances count in gratuity?",
    answer:
      "No. Housing, transport, and other allowances are usually excluded from the traditional gratuity calculation. The key pay figure is the monthly basic salary.",
  },
  {
    question: "What happens if service is less than one year?",
    answer:
      "Under the standard private-sector rule, there is no gratuity entitlement before one full year of continuous service is completed.",
  },
  {
    question: "What happens if I resign?",
    answer:
      "The calculator collects resignation or termination for context and applies the standard current private-sector estimate. Legacy contracts, disputes, or special employer arrangements can change the final settlement.",
  },
  {
    question: "Is this legal advice?",
    answer:
      "No. This is an estimate based on common UAE private-sector gratuity rules. Confirm the final amount with your employer, HR team, MOHRE/free-zone guidance, or qualified legal advice.",
  },
  {
    question: "How does unpaid leave affect UAE gratuity?",
    answer:
      "Unpaid leave days are excluded from the eligible service period before gratuity is calculated, so they reduce the final result.",
  },
  {
    question: "Does this calculator work for part-time work patterns?",
    answer:
      "Yes. It includes a prorated work-pattern option based on contracted annual hours compared with a full-time annual-hours benchmark.",
  },
  {
    question: "Does this calculator cover the UAE savings scheme?",
    answer:
      "No. This page estimates the traditional end-of-service gratuity formula. Employers using the voluntary savings scheme follow a different structure.",
  },
];

export const metadata: Metadata = {
  title: "UAE Gratuity Calculator | End of Service Gratuity Calculator for Dubai and UAE",
  description:
    "Estimate UAE end-of-service gratuity from monthly basic salary, service dates, unpaid leave, and work pattern for private-sector employees.",
  keywords: [
    "uae gratuity calculator",
    "dubai gratuity calculator",
    "end of service calculator uae",
    "uae end of service gratuity calculator",
    "dubai end of service calculator",
    "basic salary gratuity calculator uae",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "UAE Gratuity Calculator for Private-Sector End of Service Estimates",
    description:
      "Calculate UAE end-of-service gratuity using basic salary, service length, unpaid leave, and work pattern.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UAE Gratuity Calculator",
    description:
      "Estimate private-sector UAE end-of-service gratuity from basic salary and service dates.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "UAE Gratuity Calculator",
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
      "Free UAE gratuity calculator for private-sector end-of-service estimates using basic salary, service period, unpaid leave, and work pattern.",
    featureList: [
      "Basic salary gratuity estimate",
      "Service-date calculation",
      "Unpaid leave adjustment",
      "Part-time work-pattern ratio",
      "Traditional end-of-service gratuity estimate",
    ],
  };
}

export default function UAEGratuityCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "UAE Gratuity Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const tool = FREE_TOOLS.find((item) => item.href === PAGE_PATH);

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
            <li className="text-foreground">UAE Gratuity Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Finance calculator
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            UAE Gratuity Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Gratuity is the lump-sum end-of-service money many UAE employees receive when leaving a job.
            Estimate UAE private-sector end-of-service gratuity from monthly basic salary, service dates,
            unpaid leave, and work pattern. This page is built for the traditional gratuity formula rather
            than the newer voluntary savings-scheme model.
          </p>
          {tool ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{tool.description}</p> : null}
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <UAEGratuityCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How UAE gratuity is usually calculated</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            In the UAE private sector, the traditional gratuity estimate is built around monthly basic salary,
            not the full package. The common structure is no gratuity before one full year of continuous service,
            then 21 days of basic salary for each year of the first five years, followed by 30 days of basic salary
            for each year after that.
          </p>

          <div className="mt-5 rounded-[1.25rem] border border-warning/20 bg-warning-soft p-5">
            <h3 className="text-lg font-semibold text-warning-soft-foreground">Important disclaimer</h3>
            <p className="mt-2 text-sm leading-6 text-warning-soft-foreground">
              This calculator provides an estimate, not legal advice. Final settlement can vary by contract wording, employer policy, free-zone rules, court interpretation, pension status, savings-scheme participation, and documented unpaid leave.
            </p>
          </div>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Unpaid leave days are excluded from the eligible service period, and the final gratuity amount is capped
            at two years of wage. That means the key inputs are not just salary and dates, but also the parts of the
            employment record that change eligible service length.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">What to enter in this calculator</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Monthly basic salary in AED</li>
            <li>Service start date and end date</li>
            <li>Any unpaid leave days that should be excluded</li>
            <li>Whether the employee is expatriate or UAE national</li>
            <li>Whether the work pattern is full-time or prorated</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Why basic salary matters more than allowances</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Many UAE packages include housing, transport, and other allowances on top of the basic salary. Those
            allowances matter for monthly cash flow, but the traditional gratuity formula is centered on the basic
            salary figure. That is why two employees with the same package value can still have very different
            gratuity outcomes if their basic salary is different.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Traditional gratuity vs savings scheme</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Some employers in the UAE use the voluntary alternative end-of-service savings scheme instead of the
            traditional gratuity model. This calculator is meant for the classic gratuity structure. If the employer
            has already moved to the savings scheme, the final payout may follow that plan rather than the estimate shown here.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Example UAE gratuity scenarios</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>AED 5,000 basic salary for 3 years: daily salary is AED 166.67, gratuity days are 63, estimated gratuity is about AED 10,500.</li>
            <li>AED 10,000 basic salary for 6 years: first 5 years use 21 days per year, the extra year uses 30 days, estimated gratuity is about AED 45,000 before any cap or adjustments.</li>
            <li>If service is under 1 completed year, the calculator shows not eligible under the standard traditional formula.</li>
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

      <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath={PAGE_PATH} />
    </div>
  );
}
