import Link from "next/link";
import type { Metadata } from "next";

import FreelancerRateCalculator from "@/app/finance/freelancer-rate-calculator/components/FreelancerRateCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/freelancer-rate-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How is the hourly rate estimated?",
    answer:
      "The calculator first adds target take-home pay and business overhead, then grosses that up for the tax set-aside percentage and divides the result by annual billable hours.",
  },
  {
    question: "Why are billable hours important?",
    answer:
      "Freelancers do not invoice every hour they work. Admin time, sales, proposals, and unpaid revisions reduce billable capacity, so the billable-hour assumption matters a lot.",
  },
  {
    question: "Is this tax advice?",
    answer:
      "No. The tax percentage here is a planning input only. Actual tax treatment depends on location, legal structure, and deductions.",
  },
];

export const metadata: Metadata = {
  title: "Freelancer Rate Calculator | Hourly, Daily, and Revenue Targets",
  description:
    "Estimate freelancer hourly rate, day rate, and annual revenue target from income goals, overhead, taxes, and billable hours.",
  keywords: [
    "freelancer rate calculator",
    "hourly rate calculator freelancer",
    "day rate calculator freelancer",
    "consulting rate calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Freelancer Rate Calculator",
    description:
      "Estimate billable hourly and day rates from income goals, taxes, and overhead.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freelancer Rate Calculator",
    description:
      "Turn annual pay goals and billable capacity into a target freelance rate.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Freelancer Rate Calculator",
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
      "Free freelancer rate calculator for hourly rate, day rate, and annual revenue planning.",
    featureList: [
      "Hourly rate estimate",
      "Day rate estimate",
      "Revenue target from overhead and taxes",
    ],
  };
}

export default function FreelancerRateCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Freelancer Rate Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">Freelancer Rate Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Self-Employed Planning
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Freelancer Rate Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Turn an annual income target, business overhead, tax reserve, and realistic billable capacity into an hourly rate and day rate you can actually price against.
          </p>
        </div>
      </section>

      <FreelancerRateCalculator />

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
