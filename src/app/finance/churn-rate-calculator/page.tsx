import Link from "next/link";
import type { Metadata } from "next";

import ChurnRateCalculator from "@/app/finance/churn-rate-calculator/components/ChurnRateCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/churn-rate-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How is customer churn rate calculated?",
    answer:
      "Customer churn rate is customers lost divided by customers at the start of the period, multiplied by 100.",
  },
  {
    question: "What is revenue churn?",
    answer:
      "Revenue churn measures lost recurring revenue relative to the recurring revenue base at the start of the period.",
  },
  {
    question: "Should new customers reduce churn?",
    answer:
      "No. New customers affect ending customer count and net growth, but churn itself still measures loss from the starting base.",
  },
];

export const metadata: Metadata = {
  title: "Churn Rate Calculator | Customer and Revenue Churn",
  description:
    "Calculate customer churn rate, revenue churn rate, ending customers, and net customer change from a single reporting period.",
  keywords: ["churn rate calculator", "customer churn calculator", "revenue churn calculator"],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Churn Rate Calculator",
    description: "Measure customer churn, revenue churn, and net customer change.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Churn Rate Calculator",
    description: "Calculate churn and ending customer count from a reporting period.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Churn Rate Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free churn rate calculator for customer and revenue churn metrics.",
  };
}

export default function ChurnRateCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Churn Rate Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">Churn Rate Calculator</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">Business Metrics</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Churn Rate Calculator</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Measure customer churn, revenue churn, ending customers, and net movement across a reporting period without mixing growth into the churn formula.
          </p>
        </div>
      </section>
      <ChurnRateCalculator />
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
