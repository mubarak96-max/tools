import Link from "next/link";
import type { Metadata } from "next";

import MortgageCalculator from "@/app/finance/mortgage-calculator/components/MortgageCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/mortgage-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How is a mortgage payment calculated?",
    answer:
      "The core monthly mortgage payment uses the standard amortization formula based on loan amount, interest rate, and loan term. A realistic housing budget then adds property tax, home insurance, HOA or service charges, and maintenance costs.",
  },
  {
    question: "What is PITI in a mortgage?",
    answer:
      "PITI stands for Principal, Interest, Taxes, and Insurance. It represents the more complete monthly housing payment lenders use when they assess affordability.",
  },
  {
    question: "How much house can I afford?",
    answer:
      "A common rule of thumb is that housing should stay around 25% to 30% of gross monthly income, and total debt should stay within a manageable debt-to-income ratio. The exact number depends on your income stability, other debts, emergency savings, and ongoing ownership costs.",
  },
  {
    question: "Why is the total interest so high on long mortgages?",
    answer:
      "Longer mortgage terms lower the monthly payment, but they keep the loan outstanding for more years. That means more months of interest accrual, which can make the total interest dramatically higher than a shorter term.",
  },
  {
    question: "What costs are not included in a basic mortgage payment?",
    answer:
      "Buyers often miss HOA or service charges, maintenance, repairs, utilities, moving costs, and local buying fees. The calculator includes an ownership-cost layer so you can budget beyond principal and interest.",
  },
  {
    question: "What upfront costs should Dubai buyers budget for?",
    answer:
      "Dubai buyers usually need more than the down payment. Common upfront items include the 4% Dubai Land Department transfer fee, mortgage registration fees, registration trustee or service partner fees, and often broker commission. Bank valuation and processing charges can add more.",
  },
  {
    question: "Does this mortgage calculator work for different countries?",
    answer:
      "Yes. It includes market-specific defaults for USD, EUR, GBP, AED, and INR so you can start with more realistic examples for your region. Always confirm the final rate, fees, taxes, and insurance with your lender.",
  },
];

export const metadata: Metadata = {
  title: "Mortgage Calculator | PITI, Affordability, and Amortization",
  description:
    "Calculate mortgage payments, PITI, total interest, affordability, and amortization. Includes monthly ownership cost and Dubai mortgage buying cost context for AED buyers.",
  keywords: [
    "mortgage calculator",
    "home loan calculator",
    "monthly mortgage payment calculator",
    "mortgage calculator UAE",
    "home loan calculator Dubai",
    "PITI calculator",
    "amortization schedule calculator",
    "mortgage affordability calculator",
    "how much house can i afford",
    "Dubai mortgage calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Mortgage Calculator with PITI and Affordability",
    description:
      "Estimate mortgage payments, total ownership cost, affordability, and Dubai-specific buying costs across major currencies.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mortgage PITI Calculator",
    description:
      "Comprehensive home loan tool with affordability guidance, amortization, and currency support.",
  },
};

function buildMortgageApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
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
    description:
      "Mortgage calculator with principal and interest, PITI, affordability guidance, amortization, and Dubai buyer cost context.",
    featureList: [
      "Monthly mortgage payment and PITI estimate",
      "True monthly ownership cost including HOA and maintenance",
      "Affordability guidance using income and monthly debts",
      "Full amortization schedule",
      "Dubai upfront buying cost estimate for AED users",
      "Multi-currency mortgage defaults",
    ],
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
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Home buying decision tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Mortgage Calculator
          </h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate monthly mortgage payments, PITI, total interest, and amortization, then check whether the home
            still looks affordable once taxes, insurance, HOA or service charges, maintenance, and Dubai buying costs
            are added back in.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Mortgage = loan math plus ownership math. A cheap-looking payment can still be expensive once the full
            cost of owning the property is included.
          </p>
          <p className="mt-4 rounded-[1rem] border border-amber-300/40 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
            Results are estimates only. Rates, taxes, insurance, service charges, lender fees, and local property
            registration costs vary by lender, location, borrower profile, and property type.
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
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">How mortgage payments are calculated</h2>
            <div className="prose prose-slate max-w-none text-muted-foreground leading-7">
              <p>
                The core monthly mortgage payment is calculated from three inputs: the <strong>loan amount</strong>,
                <strong> interest rate</strong>, and <strong>loan term</strong>. That gives you the principal-and-interest
                payment. A more realistic ownership number then adds property tax and insurance, commonly called PITI.
              </p>
              <div className="rounded-[1.25rem] border border-border bg-background p-4 font-mono text-sm text-foreground">
                M = P * r(1+r)^n / ((1+r)^n - 1)
              </div>
              <p>
                In plain language: <strong>P</strong> is the loan amount, <strong>r</strong> is the monthly interest rate,
                and <strong>n</strong> is the number of monthly payments. In the real world, ownership costs often go beyond
                PITI, especially when HOA or service charges and maintenance are material.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">How much house can I afford?</h2>
            <div className="prose prose-slate max-w-none text-muted-foreground leading-7">
              <p>
                A common affordability rule is that housing should stay around <strong>25% to 30%</strong> of gross monthly
                income, while total debt should remain inside a manageable debt-to-income range. That is why the calculator
                now includes income, other debts, and an affordability signal instead of stopping at the monthly payment.
              </p>
              <p>
                The Consumer Financial Protection Bureau makes the same practical point: lenders may tell you what you
                qualify for, but only you can decide what fits your budget comfortably once repairs, reserves, and total
                ownership costs are considered. Pair this with a{" "}
                <Link href="/finance/dti-calculator" className="text-primary font-medium hover:underline">DTI calculator</Link>{" "}
                and your{" "}
                <Link href="/finance/salary-calculator" className="text-primary font-medium hover:underline">income</Link>{" "}
                to stress-test the purchase properly.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Impact of loan terms</h2>
            <p className="text-muted-foreground">
              Shorter mortgages usually have higher monthly payments and lower total interest. Longer mortgages usually
              feel easier month to month, but can dramatically increase the amount of interest paid over time.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-[11px] font-bold uppercase tracking-wider text-foreground">
                  <tr>
                    <th className="px-6 py-4">Loan term</th>
                    <th className="px-6 py-4">Monthly payment</th>
                    <th className="px-6 py-4">Total interest</th>
                    <th className="px-6 py-4">Total paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-muted-foreground">
                  <tr>
                    <td className="px-6 py-4 font-semibold text-foreground">10 years</td>
                    <td className="px-6 py-4">$3,620</td>
                    <td className="px-6 py-4">$114,400</td>
                    <td className="px-6 py-4">$434,400</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-foreground">15 years</td>
                    <td className="px-6 py-4">$2,790</td>
                    <td className="px-6 py-4">$182,200</td>
                    <td className="px-6 py-4">$502,200</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-foreground">20 years</td>
                    <td className="px-6 py-4">$2,390</td>
                    <td className="px-6 py-4">$253,600</td>
                    <td className="px-6 py-4">$573,600</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-foreground">30 years</td>
                    <td className="px-6 py-4">$2,023</td>
                    <td className="px-6 py-4">$408,100</td>
                    <td className="px-6 py-4">$728,100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">What affects your mortgage payment most?</h2>
            <div className="prose prose-slate max-w-none text-muted-foreground leading-7">
              <p>
                Four variables usually matter most: <strong>home price</strong>, <strong>down payment</strong>,
                <strong> interest rate</strong>, and <strong>loan term</strong>. A larger down payment lowers the loan
                amount, reduces total interest, and can improve lender comfort. A lower rate has a similar effect and
                often changes affordability more than buyers expect.
              </p>
              <p>
                What buyers often miss is that a home is not only a mortgage. Taxes, insurance, HOA or service charges,
                repairs, and maintenance all compete with the same monthly budget.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Fixed vs adjustable rates</h2>
            <div className="prose prose-slate max-w-none text-muted-foreground leading-7">
              <p>
                A <strong>fixed-rate mortgage</strong> keeps the same interest rate and base payment for the entire term.
                That makes long-term planning easier. An <strong>adjustable-rate mortgage</strong> often starts with a lower
                introductory rate, then resets later based on market conditions.
              </p>
              <p>
                Fixed rates are easier to model in a planning calculator. Adjustable-rate loans can still be useful, but
                they require scenario testing because the future payment path is less certain.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">What is private mortgage insurance (PMI)?</h2>
            <div className="prose prose-slate max-w-none text-muted-foreground leading-7">
              <p>
                PMI is insurance that lenders often require when the borrower puts down less than 20% of the purchase price.
                It protects the lender, not the borrower. If your equity later rises enough, you may be able to remove it and
                lower the monthly payment.
              </p>
              <p>
                Some markets and lenders handle this differently, so always confirm whether mortgage insurance, life insurance,
                or credit-life protection is mandatory in your exact loan product.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Dubai mortgage and buying costs</h2>
            <div className="prose prose-slate max-w-none text-muted-foreground leading-7">
              <p>
                For Dubai buyers, the monthly mortgage is only one part of the equation. The{" "}
                <a href="https://dubailand.gov.ae/en/eservices/sell-property-overview/sell-property/" className="text-primary font-medium hover:underline" rel="noreferrer" target="_blank">
                  Dubai Land Department
                </a>{" "}
                publishes a <strong>4% transfer fee</strong> on the property price, and mortgage registration is charged at{" "}
                <strong>0.25% of the mortgage amount</strong>. Registration trustee or service partner fees also apply.
              </p>
              <p>
                In practice, many buyers also pay broker commission, valuation fees, and bank processing charges. That is why
                the calculator now shows a Dubai-oriented upfront-cost estimate when you switch to AED.
              </p>
            </div>
          </section>

          <section className="space-y-10">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
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
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Mortgage planning</h3>
            <div className="space-y-4 text-sm leading-relaxed text-slate-600">
              <p>Use the calculator in this order for a better decision:</p>
              <ul className="space-y-3 list-disc pl-4">
                <li>Check the monthly principal-and-interest payment.</li>
                <li>Add taxes, insurance, HOA or service charges, and maintenance.</li>
                <li>Compare the total against your gross monthly income and other debts.</li>
                <li>Review total interest and the amortization schedule before you commit.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">Related calculators</h3>
            <div className="grid gap-2">
              {[
                { name: "DTI Ratio Calculator", href: "/finance/dti-calculator" },
                { name: "Salary Calculator", href: "/finance/salary-calculator" },
                { name: "Rent Affordability", href: "/real-estate/rent-affordability-calculator" },
                { name: "Closing Costs", href: "/real-estate/closing-costs-calculator" },
                { name: "Home Buying Budget", href: "/real-estate/home-buying-budget-calculator" },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-xs font-medium text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
                >
                  {tool.name}
                  <span>{"->"}</span>
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
