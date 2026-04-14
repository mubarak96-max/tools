import Link from "next/link";
import type { Metadata } from "next";

import CarLoanCalculator from "@/app/finance/car-loan-calculator/components/CarLoanCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { FREE_TOOLS } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/finance/car-loan-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Free Car Loan Calculator – Monthly Auto Loan Payment Estimator",
  description:
    "Calculate your monthly car loan payment instantly. Enter vehicle price, down payment, trade-in value, and interest rate. Works for new and used cars in USD, AED, GBP, EUR, and INR.",
  keywords: [
    "car loan calculator",
    "auto loan calculator",
    "car payment calculator",
    "monthly car payment calculator",
    "used car loan calculator",
    "car loan calculator with trade in",
    "car financing calculator",
    "how much will my car payment be",
    "car loan interest calculator",
    "car EMI calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free Car Loan Calculator – Monthly Auto Loan Payment Estimator",
    description:
      "Estimate monthly auto loan payments with down payment and trade-in support across major currencies.",
  },
};

const faq = [
  {
    question: "How do I calculate car loan interest manually?",
    answer:
      "To calculate car loan interest manually, divide your annual interest rate by 12 to get your monthly rate. Multiply this by your remaining loan balance to see your interest cost for that month. However, because car loans are amortized, the ratio of interest to principal changes every month.",
  },
  {
    question: "What is APR on a car loan?",
    answer:
      "Annual Percentage Rate (APR) includes the interest rate plus any lender fees or closing costs associated with the loan. While the interest rate sets your monthly interest cost, the APR reflects the true total cost of borrowing.",
  },
  {
    question: "What credit score do I need for a car loan?",
    answer:
      "Generally, a score of 660 or higher is needed for standard rates. Scores above 720 typically qualify for the best 'prime' rates, while those below 600 may face higher interest 'subprime' loans or require a larger down payment.",
  },
  {
    question: "Can I get a car loan with no down payment?",
    answer:
      "Yes, 'zero-down' financing is possible for buyers with excellent credit. However, this often leads to higher monthly payments and increases the risk of being 'upside-down' (owing more than the car is worth) as the vehicle depreciates.",
  },
  {
    question: "How much car can I afford?",
    answer:
      "A common rule of thumb is the 20/4/10 rule: put down 20%, finance for no more than 4 years, and ensure total monthly vehicle costs (including insurance) don't exceed 10% of your gross monthly income.",
  },
  {
    question: "Is it better to finance through a dealer or a bank?",
    answer:
      "Banks and credit unions often offer lower base rates for pre-approval. Dealers, however, may offer promotional 0% or low-interest financing subsidized by the manufacturer for specific new models.",
  },
  {
    question: "How does a car loan calculator work?",
    answer:
      "It subtracts down payment and trade-in value from the vehicle price, then calculates monthly repayment from the financed amount, interest rate, and loan term using a standard amortization formula.",
  },
  {
    question: "What happens if I miss a car loan payment?",
    answer:
      "Missing a payment typically results in a late fee and can damage your credit score after 30 days. Continued non-payment may lead to vehicle repossession, as the car serves as collateral for the loan.",
  },
];

function buildCarLoanApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Car Loan Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description":
      "Free car loan calculator with down payment and trade-in support for new and used cars. Estimate monthly auto loan payments instantly.",
    "featureList": [
      "New and used car loan calculation",
      "Down payment and trade-in support",
      "Multi-currency support (USD, AED, GBP, EUR, INR)",
      "Total loan cost breakdown",
      "Monthly principal and interest estimation",
    ],
  };
}

export default function CarLoanCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Car Loan Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const carTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildCarLoanApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/finance" className="hover:text-primary">
                Finance
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">Car Loan Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Finance calculator
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Car Loan Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            This free **auto loan calculator** lets you estimate monthly payments for new and used vehicles with down payment and trade-in value built in.
            See how financing changes your real total car cost and explore different loan tenures before you sign a contract.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <CarLoanCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How a car loan works</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A car loan is a legally binding installment agreement used to purchase a vehicle.
            The **financed amount** is calculated as the vehicle sticker price minus your cash down payment and any credit given for a trade-in vehicle.
            This principal balance is then repaid over a set number of months, with interest added based on the Annual Percentage Rate (APR).
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The secret to low monthly payments often lies in the balance between the interest rate and the loan term. While a longer term (like 72 or 84 months) makes the car seem more affordable today, it significantly increases the total interest you will pay over the life of the loan.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Car loan amortization explained</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Most car loans use simple interest amortization. This means that in the early months of your loan, a larger portion of your monthly payment goes toward interest. As you pay down the principal balance, the interest charge decreases, and more of your money goes toward ownership.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            By using an **amortization schedule**, you can see exactly how your debt decreases over time. If you decide to make extra payments toward the principal, you can "shorten" the amortization curve, saving hundreds or even thousands in interest charges.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Choosing the right loan tenure</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Shorter tenures (36-48 months) increase the monthly payment but reduce total interest. Longer tenures (72-84 months) lower the monthly bill while increasing the final amount paid.
            This comparison table shows the dramatic difference interest makes on a standard loan:
          </p>

          <table className="mt-6 w-full border-collapse overflow-hidden rounded-[1rem] border border-border text-sm">
            <caption className="mb-3 text-left text-sm text-muted-foreground">
              Example impact of tenure on a $25,000 loan at 7% APR
            </caption>
            <thead className="bg-muted">
              <tr>
                <th className="border border-border px-3 py-2 text-left">Tenure</th>
                <th className="border border-border px-3 py-2 text-left">Monthly Payment</th>
                <th className="border border-border px-3 py-2 text-left">Total Interest</th>
                <th className="border border-border px-3 py-2 text-left">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border px-3 py-2">36 months</td><td className="border border-border px-3 py-2">$772</td><td className="border border-border px-3 py-2">$2,791</td><td className="border border-border px-3 py-2">$27,791</td></tr>
              <tr><td className="border border-border px-3 py-2">48 months</td><td className="border border-border px-3 py-2">$598</td><td className="border border-border px-3 py-2">$3,706</td><td className="border border-border px-3 py-2">$28,706</td></tr>
              <tr><td className="border border-border px-3 py-2">60 months</td><td className="border border-border px-3 py-2">$495</td><td className="border border-border px-3 py-2">$4,752</td><td className="border border-border px-3 py-2">$29,752</td></tr>
              <tr><td className="border border-border px-3 py-2">72 months</td><td className="border border-border px-3 py-2">$427</td><td className="border border-border px-3 py-2">$5,731</td><td className="border border-border px-3 py-2">$30,731</td></tr>
              <tr><td className="border border-border px-3 py-2">84 months</td><td className="border border-border px-3 py-2">$378</td><td className="border border-border px-3 py-2">$6,762</td><td className="border border-border px-3 py-2">$31,762</td></tr>
            </tbody>
          </table>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Tips to get a better car loan rate</h2>
          <ul className="mt-4 space-y-4 text-base leading-7 text-muted-foreground">
            <li>
              <strong>Boost Your Credit Score:</strong> Lenders tier their interest rates based on score bands. A score jump from 650 to 700 can often save you 2-3% on your interest rate, which translates to thousands of dollars over a 5-year loan.
            </li>
            <li>
              <strong>Get Pre-Approved:</strong> Visit your local bank or credit union before going to the dealership. Having a pre-approved offer gives you significant leverage during negotiations and prevents the dealer from padding the interest rate.
            </li>
            <li>
              <strong>Maximize Your Down Payment:</strong> Aim for at least 20% down on new cars and 10% on used ones. This reduces the lender's risk and prevents you from having "negative equity" (owing more than the car is worth) the moment you drive off the lot.
            </li>
            <li>
              <strong>Keep the Term Reasonable:</strong> Avoid 84-month (7-year) loans if possible. While the payments are low, the vehicle's value will likely drop faster than the loan balance, making it very difficult to sell or trade the car later.
            </li>
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


