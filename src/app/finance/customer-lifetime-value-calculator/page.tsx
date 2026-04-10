import Link from "next/link";
import type { Metadata } from "next";

import CustomerLifetimeValueCalculator from "@/app/finance/customer-lifetime-value-calculator/components/CustomerLifetimeValueCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/customer-lifetime-value-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How is customer lifetime value calculated here?",
    answer:
      "This calculator multiplies average revenue per purchase by purchase frequency to estimate annual revenue per customer, applies gross margin to estimate annual gross profit, and then multiplies that by customer lifespan.",
  },
  {
    question: "Why use gross margin instead of revenue alone?",
    answer:
      "Revenue-only CLV can overstate customer value. Gross margin gives a more realistic view by keeping the estimate tied to profit before fixed operating costs.",
  },
  {
    question: "Does this include discount rate or acquisition cost?",
    answer:
      "No. This version is a clean gross-profit CLV model. Customer acquisition cost and discounted cash-flow assumptions should be modeled separately when needed.",
  },
];

export const metadata: Metadata = {
  title: "Customer Lifetime Value Calculator | CLV from Revenue, Margin, and Lifespan",
  description:
    "Calculate customer lifetime value from average revenue, purchase frequency, gross margin, and customer lifespan.",
  keywords: [
    "customer lifetime value calculator",
    "clv calculator",
    "lifetime value calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Customer Lifetime Value Calculator",
    description:
      "Estimate annual customer gross profit and lifetime value from revenue, margin, and lifespan assumptions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Customer Lifetime Value Calculator",
    description:
      "Calculate CLV using average revenue, margin, purchase frequency, and lifespan.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Customer Lifetime Value Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free customer lifetime value calculator based on revenue, gross margin, purchase frequency, and customer lifespan.",
  };
}

export default function CustomerLifetimeValueCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Customer Lifetime Value Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">Customer Lifetime Value Calculator</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">Business Metrics</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Customer Lifetime Value Calculator</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Estimate annual customer revenue, annual gross profit per customer, and total lifetime value from a simple unit-economics model.
          </p>
        </div>
      </section>
      <CustomerLifetimeValueCalculator />
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
