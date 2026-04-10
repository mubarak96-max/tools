import Link from "next/link";
import type { Metadata } from "next";

import BudgetPlanner from "@/app/finance/budget-planner/components/BudgetPlanner";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/budget-planner";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How does this budget planner work?",
    answer:
      "It adds up your monthly income streams and subtracts your planned monthly outflows to show cash flow and category shares.",
  },
  {
    question: "What counts as needs, wants, and savings?",
    answer:
      "This planner treats housing, utilities, groceries, transport, insurance, and debt payments as needs; entertainment and other discretionary spending as wants; and the savings field as money intentionally set aside.",
  },
  {
    question: "Is this a fixed budgeting rule?",
    answer:
      "No. The category shares are descriptive, not prescriptive. They help you see your current mix rather than enforcing a single budget method.",
  },
];

export const metadata: Metadata = {
  title: "Budget Planner | Monthly Income, Expenses, and Cash Flow",
  description:
    "Plan monthly income, spending, and savings to see total expenses, category shares, and remaining cash flow.",
  keywords: [
    "budget planner",
    "monthly budget planner",
    "income and expense planner",
    "cash flow planner",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Budget Planner",
    description:
      "See how income, needs, wants, and savings affect your monthly cash flow.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Budget Planner",
    description:
      "Plan income and monthly outflows in one clear budget calculator.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Budget Planner",
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
      "Free monthly budget planner for income, expenses, savings, and cash flow.",
    featureList: [
      "Income versus expenses",
      "Needs, wants, and savings shares",
      "Monthly cash-flow estimate",
    ],
  };
}

export default function BudgetPlannerPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Budget Planner", path: PAGE_PATH },
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
            <li className="text-foreground">Budget Planner</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Monthly Planning
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Budget Planner
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Put your income, core expenses, discretionary spending, and savings into one monthly view so you can see whether your plan leaves room or creates a shortfall.
          </p>
        </div>
      </section>

      <BudgetPlanner />

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
