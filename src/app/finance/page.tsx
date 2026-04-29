import Link from "next/link";

import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

const FINANCE_TOOLS = [
  {
    name: "EMI Calculator",
    href: "/finance/emi-calculator",
    description: "Estimate monthly loan EMI, total interest, repayment, affordability, and amortization.",
  },
  {
    name: "Invoice Generator",
    href: "/finance/invoice-generator",
    description: "Create printable invoices with line items, taxes, discounts, business details, and totals.",
  },
  {
    name: "Break Even Point (BEP) Calculator",
    href: "/finance/break-even-calculator",
    description: "Calculate your break even point in units or revenue. Includes chart maker and goal modeling.",
  },
  {
    name: "Amazon FBA Calculator UK",
    href: "/finance/amazon-fba-calculator-uk",
    description: "Accurately model Amazon UK seller fees, referral costs, FBA fulfilment, and net profit.",
  },
  {
    name: "Amazon FBA Calculator Canada",
    href: "/finance/amazon-fba-canada-calculator",
    description: "Calculate Amazon.ca fees in CAD: referral, fulfillment, storage, and profit margins with 2026 rates.",
  },
  {
    name: "Etsy Profit Calculator",
    href: "/finance/etsy-profit-calculator",
    description: "Accurately model Etsy transaction fees, payment processing, ads, and net margins for handmade sellers.",
  },
  {
    name: "US Take-Home Calculator",
    href: "/finance/us-take-home-pay-calculator",
    description: "Calculate 2026 US net pay with federal/state tax, FICA, 401(k), and health benefits.",
  },
  {
    name: "Income Tax Calculator Australia",
    href: "/finance/income-tax-calculator-australia",
    description: "Calculate 2026-26 Australian tax with ATO brackets, Medicare levy, and HECS repayments.",
  },
  {
    name: "Income Tax Calculator Ireland",
    href: "/finance/income-tax-calculator-ireland",
    description: "Calculate 2026 Irish net pay after PAYE, USC, and PRSI with Budget 2026 tax bands.",
  },
  {
    name: "General Liability Insurance Estimator",
    href: "/finance/general-liability-insurance-cost-estimator",
    description: "Estimate small business general liability premiums by industry, revenue, and location.",
  },
  {
    name: "Workers Comp Premium Calculator",
    href: "/finance/workers-comp-premium-calculator",
    description: "Estimate workers compensation insurance costs by industry class code, payroll, and state rates.",
  },
  {
    name: "Business Risk Exposure Score Calculator",
    href: "/finance/business-risk-exposure-score-calculator",
    description: "Assess operational, financial, cyber, legal, market, physical, and reputational risk across 7 critical dimensions.",
  },
  {
    name: "Inheritance Tax Calculator",
    href: "/finance/inheritance-tax-calculator",
    description: "Calculate inheritance tax, estate tax, and succession duty across 10 major global jurisdictions.",
  },
  {
    name: "Equity Dilution Calculator",
    href: "/finance/equity-dilution-calculator",
    description: "Model founder ownership through funding rounds, SAFEs, and option pools.",
  },
  {
    name: "Salary After Tax Calculator",
    href: "/finance/salary-after-tax-calculator",
    description: "Calculate take-home pay with 2026 tax brackets and compare across all 50 states.",
  },
  {
    name: "Bonus Tax Calculator",
    href: "/finance/bonus-tax-calculator",
    description: "Calculate employee bonus tax withholding OR business bonus depreciation (Section 168k).",
  },
  {
    name: "Product Pricing Calculator",
    href: "/finance/product-pricing-calculator",
    description: "Calculate optimal selling prices across Shopify, Etsy, and Amazon with multi-currency support.",
  },
  {
    name: "Dropshipping Break-even Calculator",
    href: "/finance/dropshipping-break-even",
    description: "Calculate break-even ROAS, CPA, and required sales for dropshipping and DTC brands.",
  },
  {
    name: "Halal Mortgage Calculator",
    href: "/finance/halal-mortgage-calculator",
    description: "Compare Islamic home financing models (Murabaha, Musharaka) against traditional interest-based loans.",
  },
  {
    name: "India TDS Calculator",
    href: "/finance/india-tds-calculator",
    description: "Calculate 2026-26 TDS on salary, rent, fees, and more with surcharge & cess logic.",
  },
  {
    name: "India SIP Calculator",
    href: "/finance/india-sip-calculator",
    description: "Calculate mutual fund SIP returns and wealth creation over time in INR.",
  },
  {
    name: "Income Tax Calculator India",
    href: "/finance/income-tax-calculator-india",
    description: "Estimate Indian income tax liability under the old and new tax regime for FY 2026-26.",
  },
  {
    name: "California Sales Tax Calculator",
    href: "/finance/sales-tax-california-calculator",
    description: "Calculate sales tax by city and county in California with the latest 2025 rates.",
  },
  {
    name: "Zakat Calculator 2026",
    href: "/finance/zakat-calculator",
    description: "Calculate zakat on gold, silver, savings, and investments with 2026 Nisab rates.",
  },
  {
    name: "Australia Stamp Duty",
    href: "/finance/australia-stamp-duty-calculator",
    description: "Calculate property transfer duty for all Australian states with 2026 rates & concessions.",
  },
  {
    name: "House Affordability Australia",
    href: "/finance/house-affordability-calculator-australia",
    description: "Calculate borrowing capacity, stamp duty, LMI, and monthly repayments for Australian property.",
  },
  {
    name: "House Affordability Canada",
    href: "/real-estate/house-affordability-calculator-canada",
    description: "Estimate maximum home price in Canada with stress test, CMHC, and provincial tax rules.",
  },
  {
    name: "Mortgage Qualifier Canada",
    href: "/real-estate/mortgage-qualifier-canada",
    description: "Professional GDS/TDS mortgage qualification with the 2024 Canadian stress test.",
  },
  {
    name: "Car Depreciation Calculator",
    href: "/finance/car-depreciation-calculator",
    description: "Model vehicle value decay over 15 years for 120+ models with condition & mileage adjustments.",
  },
  {
    name: "Australia GST Calculator",
    href: "/finance/australia-gst-calculator",
    description: "Calculate GST, add/remove GST, and see total price for Australian business transactions.",
  },
  {
    name: "Canada Sales Tax Calculator (2026)",
    href: "/finance/sales-tax-canada-calculator",
    description: "Calculate sales tax across all Canadian provinces including HST, GST, and PST/QST with 2026 rates.",
  },
  {
    name: "Canada Income Tax Calculator",
    href: "/finance/canada-income-tax-calculator",
    description: "Estimate 2026 Canadian federal and provincial tax, CPP, EI, and exact take-home pay.",
  },
  {
    name: "UK Student Loan Repayment Calculator",
    href: "/finance/uk-student-loan-repayment-calculator",
    description: "Calculate UK student loan repayments, write-off periods, and interest for Plans 1, 2, 4, 5, and Postgrad.",
  },
  {
    name: "Capital Gains Tax Canada Calculator",
    href: "/finance/capital-gains-tax-canada-calculator",
    description: "Calculate exact capital gains tax in Canada on investments, real estate, and more. Includes 2024 inclusion rate changes.",
  },
  {
    name: "CPP & EI Calculator",
    href: "/finance/cpp-ei-calculator",
    description: "Calculate your CPP retirement pension at any age from 60 to 70, your annual CPP and EI contributions, OAS entitlement, and EI benefit amount.",
  },
  {
    name: "401(k) Match Calculator",
    href: "/finance/401k-match-calculator",
    description: "Calculate your 401(k) employer match, annual savings, and projected retirement balance with 2024 IRS limits.",
  },
  {
    name: "PMI Calculator 2026",
    href: "/finance/pmi-calculator",
    description: "Calculate exact monthly PMI cost, drop-off timeline, and total mortgage insurance paid with 2026 rates.",
  },
  {
    name: "Amortization Chart Calculator",
    href: "/finance/amortization-chart-calculator",
    description: "Generate detailed loan amortization tables, visualize payment breakdowns, and download schedules.",
  },
  {
    name: "Dividend Reinvestment Calculator (DRIP)",
    href: "/finance/dividend-reinvestment-calculator",
    description: "Model DRIP compound growth, share accumulation, yield on cost, and portfolio value.",
  },
  {
    name: "CD Ladder Calculator",
    href: "/finance/cd-ladder-calculator",
    description: "Plan multi-rung CD ladders, track maturity dates, and project monthly interest earnings.",
  },
  {
    name: "Rule of 72 Calculator",
    href: "/finance/rule-of-72-calculator",
    description: "Estimate investment doubling time, compare scenarios, and see step-by-step math.",
  },
  {
    name: "Crypto Mining Calculator",
    href: "/finance/crypto-mining-calculator",
    description: "Calculate Bitcoin and GPU mining profitability with real-time network parameters and ROI timelines.",
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

        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Finance tools
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
            className="group flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-5 transition-all hover:border-primary/25 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary">{tool.name}</h2>            </div>
            <p className="text-sm leading-6 text-muted-foreground">{tool.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
