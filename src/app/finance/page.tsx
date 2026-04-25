import Link from "next/link";

import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

const FINANCE_TOOLS = [
  {
    name: "EMI Calculator",
    href: "/finance/emi-calculator",
    description: "Estimate monthly loan EMI, total interest, repayment, affordability, and amortization.",
    icon: "EMI",
  },
  {
    name: "Invoice Generator",
    href: "/finance/invoice-generator",
    description: "Create printable invoices with line items, taxes, discounts, business details, and totals.",
    icon: "INV",
  },
  {
    name: "Break Even Point (BEP) Calculator",
    href: "/finance/break-even-calculator",
    description: "Calculate your break even point in units or revenue. Includes chart maker and goal modeling.",
    icon: "BEP",
  },
  {
    name: "Amazon FBA Calculator UK",
    href: "/finance/amazon-fba-calculator-uk",
    description: "Accurately model Amazon UK seller fees, referral costs, FBA fulfilment, and net profit.",
    icon: "FBA",
  },
  {
    name: "Amazon FBA Calculator Canada",
    href: "/finance/amazon-fba-canada-calculator",
    description: "Calculate Amazon.ca fees in CAD: referral, fulfillment, storage, and profit margins with 2026 rates.",
    icon: "CAD",
  },
  {
    name: "Etsy Profit Calculator",
    href: "/finance/etsy-profit-calculator",
    description: "Accurately model Etsy transaction fees, payment processing, ads, and net margins for handmade sellers.",
    icon: "ETS",
  },
  {
    name: "US Take-Home Calculator",
    href: "/finance/us-take-home-pay-calculator",
    description: "Calculate 2026 US net pay with federal/state tax, FICA, 401(k), and health benefits.",
    icon: "SALARY",
  },
  {
    name: "Income Tax Calculator Australia",
    href: "/finance/income-tax-calculator-australia",
    description: "Calculate 2025-26 Australian tax with ATO brackets, Medicare levy, and HECS repayments.",
    icon: "AUS",
  },
  {
    name: "Income Tax Calculator Ireland",
    href: "/finance/income-tax-calculator-ireland",
    description: "Calculate 2026 Irish net pay after PAYE, USC, and PRSI with Budget 2026 tax bands.",
    icon: "IRE",
  },
  {
    name: "General Liability Insurance Estimator",
    href: "/finance/general-liability-insurance-cost-estimator",
    description: "Estimate small business general liability premiums by industry, revenue, and location.",
    icon: "GLI",
  },
  {
    name: "Workers Comp Premium Calculator",
    href: "/finance/workers-comp-premium-calculator",
    description: "Estimate workers compensation insurance costs by industry class code, payroll, and state rates.",
    icon: "WCOMP",
  },
  {
    name: "Salary After Tax Calculator",
    href: "/finance/salary-after-tax-calculator",
    description: "Calculate take-home pay with 2026 tax brackets and compare across all 50 states.",
    icon: "TAX",
  },
  {
    name: "Bonus Tax Calculator",
    href: "/finance/bonus-tax-calculator",
    description: "Calculate employee bonus tax withholding OR business bonus depreciation (Section 168k).",
    icon: "BONUS",
  },
  {
    name: "Product Pricing Calculator",
    href: "/finance/product-pricing-calculator",
    description: "Calculate optimal selling prices across Shopify, Etsy, and Amazon with multi-currency support.",
    icon: "PRC",
  },
  {
    name: "Dropshipping Break-even Calculator",
    href: "/finance/dropshipping-break-even",
    description: "Calculate break-even ROAS, CPA, and required sales for dropshipping and DTC brands.",
    icon: "DRP",
  },
  {
    name: "Halal Mortgage Calculator",
    href: "/finance/halal-mortgage-calculator",
    description: "Compare Islamic home financing models (Murabaha, Musharaka) against traditional interest-based loans.",
    icon: "HLM",
  },
];

export const metadata = buildMetadata({
  title: "Finance Tools for Invoices and Business Calculations",
  description: "Free finance tools for creating invoices and handling practical business calculations.",
  path: "/finance",
});

export default function FinancePage() {
  return (
    <div className="space-y-10 pb-4">
      <section className="rounded-[2rem] border border-border/60 bg-card px-8 py-10 sm:px-10 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li className="font-medium text-foreground">Finance Tools</li>
          </ol>
        </nav>
        <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
          Finance - {FINANCE_TOOLS.length} tool
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Finance tools for business paperwork.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Focused browser tools for creating invoices and handling everyday finance tasks.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {FINANCE_TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-5 transition-all hover:border-primary/25"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary">{tool.name}</h2>
              <span className="shrink-0 rounded-lg border border-border bg-muted p-2 text-[10px] font-black text-primary">
                {tool.icon}
              </span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{tool.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
