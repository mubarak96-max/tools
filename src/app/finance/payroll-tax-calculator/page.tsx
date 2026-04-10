import Link from "next/link";
import type { Metadata } from "next";

import PayrollTaxCalculator from "@/app/finance/payroll-tax-calculator/components/PayrollTaxCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/payroll-tax-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What taxes are included here?",
    answer:
      "This page covers U.S. federal payroll taxes only: Social Security, Medicare, Additional Medicare withholding above the employer threshold, and FUTA under the maximum standard credit assumption.",
  },
  {
    question: "What is the 2026 Social Security wage base?",
    answer:
      "The 2026 Social Security wage base used here is 184,500 dollars, based on current IRS and SSA guidance.",
  },
  {
    question: "Does this include federal income tax withholding or state payroll taxes?",
    answer:
      "No. Federal income tax withholding depends on W-4 details and payroll setup, and state and local payroll taxes vary by jurisdiction.",
  },
];

export const metadata: Metadata = {
  title: "Payroll Tax Calculator | U.S. Federal FICA and FUTA for 2026",
  description:
    "Calculate U.S. federal payroll taxes for 2026, including Social Security, Medicare, Additional Medicare, and FUTA assumptions.",
  keywords: [
    "payroll tax calculator",
    "fica calculator",
    "social security medicare calculator",
    "futa calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Payroll Tax Calculator",
    description: "Estimate U.S. federal payroll taxes for 2026 wages.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Payroll Tax Calculator",
    description: "Estimate employee and employer U.S. federal payroll taxes for 2026.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Payroll Tax Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free U.S. federal payroll tax calculator for 2026 Social Security, Medicare, Additional Medicare, and FUTA.",
  };
}

export default function PayrollTaxCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Payroll Tax Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">Payroll Tax Calculator</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">Business Finance</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Payroll Tax Calculator</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Estimate U.S. federal payroll taxes on annual wages using current 2026 FICA and FUTA figures. This is scoped to federal payroll taxes only and does not guess at state or W-4 withholding rules.
          </p>
        </div>
      </section>
      <PayrollTaxCalculator />
      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Sources and scope</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Verified on April 10, 2026 against IRS Topic 751, IRS Publication 15 for 2026, and SSA wage-base guidance. This page uses the published federal rates and wage bases directly rather than a custom assumption.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href="https://www.irs.gov/taxtopics/tc751"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                IRS Topic 751: Social Security and Medicare withholding rates
              </a>
            </li>
            <li>
              <a
                href="https://www.irs.gov/publications/p15"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                IRS Publication 15 (2026), Employer&apos;s Tax Guide
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
