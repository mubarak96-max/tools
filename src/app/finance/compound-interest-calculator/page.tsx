import Link from "next/link";
import type { Metadata } from "next";

import CompoundInterestCalculator from "@/app/finance/compound-interest-calculator/components/CompoundInterestCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { FREE_TOOLS, getRelatedFreeTools } from "@/lib/tools/registry";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/compound-interest-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is compound interest?",
    answer:
      "Compound interest means your money earns returns, and then those returns earn returns as well. Over time that snowball effect can materially increase the final balance.",
  },
  {
    question: "What is the difference between principal and contributions?",
    answer:
      "Principal is the starting amount already invested. Contributions are the extra amounts you add regularly over time.",
  },
  {
    question: "Why does compounding frequency matter?",
    answer:
      "More frequent compounding applies returns to the balance more often, which slightly increases growth compared with less frequent compounding at the same annual rate.",
  },
  {
    question: "What does inflation-adjusted value mean?",
    answer:
      "It is the estimated future balance expressed in today’s purchasing power. It helps show the real value of your money after inflation.",
  },
];

export const metadata: Metadata = {
  title: "Compound Interest Calculator | Future Value and Investment Growth Calculator",
  description:
    "Calculate compound interest, future value, regular contributions, and inflation-adjusted growth with a year-by-year projection table.",
  keywords: [
    "compound interest calculator",
    "future value calculator",
    "investment growth calculator",
    "compound interest with contributions",
    "savings growth calculator",
    "investment return calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Compound Interest Calculator for Savings and Investments",
    description:
      "Estimate future value, total contributions, and interest earned with compound growth and optional inflation adjustment.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compound Interest Calculator",
    description:
      "Project savings and investment growth with contributions, compounding frequency, and inflation adjustment.",
  },
};

function buildCompoundApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Compound Interest Calculator",
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
      "Free compound interest calculator with regular contributions, compounding frequency controls, inflation adjustment, and a year-by-year growth table.",
    featureList: [
      "Future value projection",
      "Regular contributions",
      "Compounding frequency options",
      "Inflation-adjusted value",
      "Year-by-year growth schedule",
    ],
  };
}

export default function CompoundInterestCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Compound Interest Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const relatedTools = getRelatedFreeTools(PAGE_PATH);
  const tool = FREE_TOOLS.find((item) => item.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildCompoundApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="glass-card rounded-[2rem] border border-border/80 p-8 sm:p-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/finance" className="hover:text-primary">Finance</Link></li>
            <li>/</li>
            <li className="text-foreground">Compound Interest Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Finance calculator
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Compound Interest Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Project how savings and investments can grow over time with compound returns, regular contributions, and optional inflation adjustment.
          </p>
          {tool ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{tool.description}</p> : null}
        </div>
      </section>

      <CompoundInterestCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How compound growth works</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Compound growth happens when returns are added to the balance and start generating additional returns themselves. The longer the time horizon, the more powerful that effect becomes.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Regular contributions strengthen the result even more because new capital keeps entering the portfolio and benefiting from future compounding periods.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Why inflation matters</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A future balance can look large in nominal terms but still lose purchasing power if inflation stays high. That is why the inflation-adjusted figure is useful when planning long-term savings goals.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">What to compare</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Higher contribution amounts versus longer time horizons</li>
            <li>Monthly compounding versus annual compounding</li>
            <li>Nominal growth versus inflation-adjusted real value</li>
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
              Return to the calculator hub for savings, loans, salary, and pricing tools.
            </p>
          </Link>
          <Link
            href="/finance/emi-calculator"
            className="rounded-[1.25rem] border border-border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft"
          >
            <h3 className="text-base font-semibold text-foreground">EMI Calculator</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Switch from growth planning to repayment planning when you need to compare borrowing and saving tradeoffs.
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
