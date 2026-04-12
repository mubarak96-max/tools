import Link from "next/link";
import type { Metadata } from "next";

import MortgageCalculator from "@/app/finance/mortgage-calculator/components/MortgageCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { FREE_TOOLS } from "@/lib/tools/registry";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/mortgage-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is PITI in a mortgage?",
    answer: "PITI stands for Principal, Interest, Taxes, and Insurance. It represents the comprehensive monthly housing payment that lenders use to evaluate your affordability.",
  },
  {
    question: "What credit score do I need for a mortgage?",
    answer: "Most lenders require a minimum score of 620 for conventional loans, though FHA loans can accept scores as low as 500-580. Generally, a score of 740+ will unlock the lowest interest rates.",
  },
  {
    question: "What is PMI and when do I need it?",
    answer: "Private Mortgage Insurance (PMI) is usually required if your down payment is less than 20%. It protects the lender in case of default and typically costs between 0.5% and 1.5% of the loan amount annually.",
  },
  {
    question: "What's the difference between a fixed and adjustable rate mortgage?",
    answer: "A fixed-rate mortgage has an interest rate that never changes. An Adjustable-Rate Mortgage (ARM) starts with a lower 'teaser' rate for a few years, after which it adjusts periodically based on market indexes.",
  },
  {
    question: "How much house can I afford?",
    answer: "Lenders often use the '28/36 rule': your mortgage payment shouldn't exceed 28% of your gross monthly income, and total debt payments shouldn't exceed 36%. Use our DTI calculator to check your specific ratio.",
  },
  {
    question: "What is the difference between pre-qualification and pre-approval?",
    answer: "Pre-qualification is an informal estimate of what you might borrow. Pre-approval is a formal commitment from a lender after a credit check and income verification, making you a much stronger buyer.",
  },
  {
    question: "Is it better to pay mortgage points or accept a higher rate?",
    answer: "Points represent interest paid upfront to lower your monthly rate. It's generally worth it if you plan to stay in the home longer than the 'break-even' period, which is typically 5 to 7 years.",
  },
  {
    question: "How does mortgage refinancing work?",
    answer: "Refinancing involves taking out a new loan to pay off your current one, usually to secure a lower interest rate or change the loan term. Keep in mind that refinancing usually incurs closing costs of 2-5% of the loan amount.",
  },
  {
    question: "What costs are not included in a mortgage payment?",
    answer: "Homeowners often overlook maintenance, HOA fees, utilities, and potential special assessments. While PITI covers the loan and taxes, the total cost of ownership is often 20-30% higher.",
  },
  {
    question: "Does this mortgage calculator work for different countries?",
    answer: "Yes. It includes market-specific defaults for USD, EUR, GBP, AED, and INR so you can start with more realistic examples for your region.",
  },
];

export const metadata: Metadata = {
  title: "Free Mortgage Calculator — PITI & Amortization",
  description: "Calculate monthly mortgage payments with PITI (Principal, Interest, Taxes, Insurance) and a full amortization schedule. Supports USD, EUR, GBP, AED, and INR.",
  keywords: [
    "mortgage calculator",
    "home loan calculator",
    "monthly mortgage payment calculator",
    "mortgage calculator UAE",
    "PITI calculator",
    "amortization schedule calculator",
    "fixed vs adjustable rate mortgage",
    "how much house can i afford",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free Mortgage Calculator with PITI & Amortization",
    description: "Instantly estimate mortgage payments, taxes, and insurance across major currencies.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mortgage PITI Calculator",
    description: "Comprehensive home loan tool with full amortization and currency support.",
  },
};

function buildMortgageApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Mortgage Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "Professional mortgage calculator with PITI estimates and full amortization schedule.",
  };
}

export default function MortgageCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Mortgage Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-12">
      <JsonLd data={serializeJsonLd(buildMortgageApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/finance" className="hover:text-primary">Finance</Link></li>
            <li>/</li>
            <li className="text-foreground">Mortgage Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">Finance calculator</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">Mortgage Calculator</h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
            Plan your home purchase with confidence. Calculate monthly mortgage payments including principal, interest, property taxes, and insurance (PITI) for any loan amount.
          </p>
        </div>
      
        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <MortgageCalculator />

      <div className="grid gap-12 lg:grid-cols-[1fr_350px]">
        <div className="space-y-12">
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">How much house can I afford?</h2>
            <div className="prose prose-slate max-w-none text-muted-foreground leading-7">
              <p>
                A standard rule for affordability is the <strong>28/36 rule</strong>. This suggests that your monthly mortgage payment (including taxes and insurance) should not exceed 28% of your gross monthly income, and your total debt payments (including the mortgage) should stay below 36%.
              </p>
              <p>
                To get a more precise estimate, you should first calculate your <Link href="/finance/salary-calculator" className="text-primary font-medium hover:underline">net take-home pay</Link> and then use a <Link href="/finance/dti-calculator" className="text-primary font-medium hover:underline">DTI calculator</Link> to see how much room you have for a new loan.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Impact of Loan Terms</h2>
            <p className="text-muted-foreground">A 15-year mortgage usually has a lower interest rate than a 30-year one, but higher monthly payments. Here is how different terms affect a $320,000 loan at a 6.5% interest rate:</p>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-foreground uppercase font-bold text-[11px] tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Loan Term</th>
                    <th className="px-6 py-4">Monthly Payment</th>
                    <th className="px-6 py-4">Total Interest</th>
                    <th className="px-6 py-4">Total Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-muted-foreground">
                  <tr>
                    <td className="px-6 py-4 font-semibold text-foreground">10 Years</td>
                    <td className="px-6 py-4">$3,620</td>
                    <td className="px-6 py-4">$114,400</td>
                    <td className="px-6 py-4">$434,400</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-foreground">15 Years</td>
                    <td className="px-6 py-4">$2,790</td>
                    <td className="px-6 py-4">$182,200</td>
                    <td className="px-6 py-4">$502,200</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-foreground">20 Years</td>
                    <td className="px-6 py-4">$2,390</td>
                    <td className="px-6 py-4">$253,600</td>
                    <td className="px-6 py-4">$573,600</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-foreground">30 Years</td>
                    <td className="px-6 py-4">$2,023</td>
                    <td className="px-6 py-4">$408,100</td>
                    <td className="px-6 py-4">$728,100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Understanding Fixed vs. Adjustable Rates</h2>
            <div className="prose prose-slate max-w-none text-muted-foreground leading-7">
              <p>
                A <strong>Fixed-Rate Mortgage</strong> gives you the peace of mind that your interest rate and monthly payment will never change over the life of the loan. This is ideal if you plan to stay in your home long-term and rates are currently low.
              </p>
              <p>
                An <strong>Adjustable-Rate Mortgage (ARM)</strong> typically offers a lower initial "teaser" interest rate for the first 5 or 10 years. After that, the rate can adjust based on market conditions. ARMs can be a smart choice if you plan to sell or refinance before the rate adjustment period begins.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">What is Private Mortgage Insurance (PMI)?</h2>
            <div className="prose prose-slate max-w-none text-muted-foreground leading-7">
              <p>
                PMI is a type of insurance that lenders require from borrowers who put down less than 20% of the home's purchase price. It doesn't protect you—it protects the lender if you stop making payments. 
              </p>
              <p>
                Once your home equity reaches 20% (either through payments or home value appreciation), you can usually request to have PMI removed, which can save you hundreds of dollars per month.
              </p>
            </div>
          </section>

          <section className="space-y-10">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground text-center">Frequently asked questions</h2>
            <div className="grid gap-4">
              {faq.map((item) => (
                <article key={item.question} className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <div className="rounded-2xl border border-border bg-primary/5 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">UAE Mortgages</h3>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>If you are buying property in Dubai or Abu Dhabi, keep these regional rules in mind:</p>
              <ul className="space-y-3 list-disc pl-4">
                <li>LTV is capped at <strong>80% for expats</strong> (85% for nationals) on first properties.</li>
                <li>Maximum loan term is <strong>25 years</strong>.</li>
                <li>Banks often require a minimum salary of <strong>AED 10,000 to 15,000</strong>.</li>
                <li>Life insurance linked to the mortgage is mandatory in most cases.</li>
              </ul>
              <p className="text-[11px] italic">Switch to the AED currency option in our calculator for Dubai-relevant defaults.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Related Calculators</h3>
            <div className="grid gap-2">
                 {[
                    { name: "DTI Ratio Calculator", href: "/finance/dti-calculator" },
                    { name: "Salary Calculator", href: "/finance/salary-calculator" },
                    { name: "Rent affordability", href: "/real-estate/rent-affordability-calculator" },
                    { name: "Closing Costs", href: "/real-estate/closing-costs-calculator" },
                 ].map(tool => (
                    <Link key={tool.href} href={tool.href} className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-primary transition-all">
                        {tool.name}
                        <span>→</span>
                    </Link>
                 ))}
            </div>
          </div>
        </aside>
      </div>

      <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath={PAGE_PATH} />
    </div>
  );
}


