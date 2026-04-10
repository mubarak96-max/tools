import Link from "next/link";
import type { Metadata } from "next";

import SavingsGoalCalculator from "@/app/finance/savings-goal-calculator/components/SavingsGoalCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/savings-goal-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What does this savings goal calculator solve for?",
    answer:
      "It solves for the monthly contribution needed to reach a target balance from your current savings, time horizon, expected annual return, and compounding frequency.",
  },
  {
    question: "Why does the result use monthly contributions?",
    answer:
      "Investor.gov currently describes its savings goal calculator as finding how much you need to contribute each month to reach a specific savings goal. This page follows that same monthly-contribution framing.",
  },
  {
    question: "Does this page guarantee an investment outcome?",
    answer:
      "No. The result is only as accurate as the return assumption you enter. Real markets, savings products, fees, and taxes can all move the actual outcome away from the estimate.",
  },
  {
    question: "What if my current savings could already reach the goal?",
    answer:
      "Then the required monthly contribution will show as zero. In that case, the starting balance and estimated growth are already enough to hit the target over the selected period.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Savings Goal Calculator | Monthly Contribution Calculator",
    description:
      "Calculate the monthly contribution needed to reach a savings target from your starting balance, timeline, annual return assumption, and compounding frequency.",
    path: PAGE_PATH,
  }),
  keywords: [
    "savings goal calculator",
    "monthly savings calculator",
    "how much should i save each month",
    "goal savings calculator",
    "target savings calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Savings Goal Calculator",
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
      "Free savings goal calculator that estimates the monthly contribution needed to reach a target balance using a starting amount, timeline, annual return assumption, and compounding frequency.",
    featureList: [
      "Monthly contribution estimate",
      "Target-balance planning",
      "Compounding frequency options",
      "Year-by-year savings schedule",
    ],
  };
}

export default function SavingsGoalCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Savings Goal Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">Savings Goal Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Finance calculator
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Savings Goal Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Work out how much you need to save each month to reach a target balance using your starting amount, time horizon, annual return assumption, and compounding frequency.
          </p>
        </div>
      </section>

      <SavingsGoalCalculator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why this calculator is structured around monthly saving</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Investor.gov currently presents its savings goal calculator as a way to find the monthly amount needed to reach a specific target. This page follows that same framing instead of blending together irregular deposits, withdrawals, and shifting contribution patterns.
          </p>
          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">What is accurate here and what is not</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The math is exact for the assumptions entered: monthly end-of-period contributions, a fixed annual return assumption, and the compounding frequency selected. What is uncertain is the return assumption itself, because real savings products and markets do not move in a perfectly fixed line.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Official reference checked on April 10, 2026: <a href="https://www.investor.gov/savings-goal-calculator" target="_blank" rel="noopener noreferrer">Investor.gov Savings Goal Calculator</a>.
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
