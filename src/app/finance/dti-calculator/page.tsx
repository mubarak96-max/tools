import Link from "next/link";
import type { Metadata } from "next";

import DtiCalculator from "@/app/finance/dti-calculator/components/DtiCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/dti-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a debt-to-income ratio?",
    answer:
      "The CFPB defines debt-to-income ratio as all your monthly debt payments divided by your gross monthly income. It is one way lenders measure your ability to manage monthly borrowing payments.",
  },
  {
    question: "What does gross monthly income mean here?",
    answer:
      "Gross monthly income is generally the amount you earn before taxes and other deductions are taken out. This page follows that CFPB framing.",
  },
  {
    question: "Does this calculator tell me whether a lender will approve me?",
    answer:
      "No. Different lenders and different loan products can use different DTI limits, and many of them consider more than DTI alone.",
  },
  {
    question: "Should housing payment be included in DTI?",
    answer:
      "Yes, if it is part of your monthly debt obligation. This page includes a housing payment field so the full monthly debt total can be used in the ratio.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "DTI Calculator | Debt-to-Income Ratio Calculator",
    description:
      "Calculate debt-to-income ratio from gross monthly income and monthly debt payments using the CFPB definition.",
    path: PAGE_PATH,
  }),
  keywords: [
    "dti calculator",
    "debt to income ratio calculator",
    "mortgage dti calculator",
    "monthly debt to income calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DTI Calculator",
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
      "Free debt-to-income ratio calculator using gross monthly income and monthly debt payments.",
    featureList: [
      "Debt-to-income ratio",
      "Monthly debt total",
      "Remaining gross income view",
    ],
  };
}

export default function DtiCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "DTI Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">DTI Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Finance calculator
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            DTI Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate debt-to-income ratio from gross monthly income and recurring monthly debt payments using the CFPB definition.
          </p>
        </div>
      </section>

      <DtiCalculator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What this page is based on</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The Consumer Financial Protection Bureau defines DTI as all your monthly debt payments divided by your gross monthly income. This page uses that definition directly rather than layering in lender-specific assumptions.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Official reference checked on April 10, 2026: <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/" target="_blank" rel="noopener noreferrer">CFPB debt-to-income ratio definition</a>.
          </p>
          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">What this calculator does not do</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            It does not decide whether your ratio is acceptable for a mortgage, refinance, or personal loan. Different loan products and lenders can use different DTI thresholds, and they may consider assets, credit profile, reserves, and housing context as well.
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
