import Link from "next/link";

import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: "Real Estate Calculators for Property Taxes and Valuation",
  description:
    "Estimate property taxes, stamp duty, transfer fees, and price per square foot across major real estate markets.",
  path: "/real-estate",
});

type RealEstateToolMeta = {
  name: string;
  href: string;
  description: string;
};

const REAL_ESTATE_TOOLS: RealEstateToolMeta[] = [
  {
    name: "NYC Transfer Tax Calculator",
    href: "/real-estate/nyc-transfer-tax-calculator",
    description: "Estimate New York City real property transfer tax from the transfer price and property type.",
  },
  {
    name: "Price per Square Foot Calculator",
    href: "/real-estate/price-per-square-foot-calculator",
    description: "Compare property value or rent using price per square foot or square metre.",
  },
  {
    name: "UK Stamp Duty Calculator",
    href: "/real-estate/uk-stamp-duty-calculator",
    description: "Calculate SDLT for England and Northern Ireland purchases with surcharge options.",
  },
  {
    name: "Singapore Property Stamp Duty Calculator",
    href: "/real-estate/singapore-property-stamp-duty-calculator",
    description: "Estimate Singapore BSD, ABSD, and SSD for private property purchases.",
  },
  {
    name: "Singapore Buyer's Stamp Duty Calculator",
    href: "/real-estate/singapore-buyers-stamp-duty-calculator",
    description: "Calculate Singapore BSD and ABSD for buyers by residency and property count.",
  },
  {
    name: "Singapore Seller's Stamp Duty Calculator",
    href: "/real-estate/singapore-sellers-stamp-duty-calculator",
    description: "Estimate Singapore SSD based on sale price and holding period.",
  },
  {
    name: "Scotland LBTT Calculator",
    href: "/real-estate/scotland-lbtt-calculator",
    description: "Calculate Scotland Land and Buildings Transaction Tax with ADS options.",
  },
  {
    name: "Wales LTT Calculator",
    href: "/real-estate/wales-ltt-calculator",
    description: "Estimate Welsh Land Transaction Tax for residential property purchases.",
  },
  {
    name: "Hong Kong Stamp Duty Calculator",
    href: "/real-estate/hong-kong-stamp-duty-calculator",
    description: "Calculate Hong Kong ad valorem stamp duty for residential property.",
  },
  {
    name: "Rent vs Buy Calculator",
    href: "/real-estate/rent-vs-buy-calculator",
    description: "Compare the long-term costs of renting vs buying a home, including tax savings.",
  },
  {
    name: "Rental Yield Calculator",
    href: "/real-estate/rental-yield-calculator",
    description: "Calculate gross vs net rental yield for UK, US & Australia. Auto-estimates stamp duty and compares against city medians.",
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
    name: "Cap (Capitalization) Rate Calculator 2026",
    href: "/real-estate/cap-rate-calculator",
    description: "Calculate property Net Operating Income (NOI), cap rate, and cash-on-cash return with 2026 US market benchmarks.",
  },
  {
    name: "Cash on Cash Return Calculator",
    href: "/real-estate/cash-on-cash-return-calculator",
    description: "Professional real estate investment analysis. Calculate CoC return, NOI, DSCR, and multi-year cash flow projections.",
  },
  {
    name: "Mortgage Qualifier Canada",
    href: "/real-estate/mortgage-qualifier-canada",
    description: "Professional GDS/TDS mortgage qualification with the 2024 Canadian stress test.",
  },
  {
    name: "Toronto Land Transfer Tax Calculator",
    href: "/real-estate/land-transfer-tax-calculator-toronto",
    description: "Calculate Ontario LTT and Toronto Municipal LTT for property purchases with FTHB rebates.",
  },
  {
    name: "Sydney Stamp Duty Calculator",
    href: "/real-estate/stamp-duty-calculator-nsw",
    description: "Calculate NSW transfer duty (stamp duty) for Sydney properties with FTHB concessions and NRST.",
  },
];

function ToolCard({ tool }: { tool: RealEstateToolMeta }) {
  return (
    <Link
      href={tool.href}
      className="group flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-5 transition-all hover:border-primary/25 hover:shadow-[0_4px_20px_-8px_rgba(79,70,229,0.18)]"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary leading-snug">
          {tool.name}
        </h2>
      </div>
      <p className="text-sm leading-6 text-muted-foreground line-clamp-2">{tool.description}</p>
      <span className="mt-auto text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Open tool →
      </span>
    </Link>
  );
}

export default function RealEstatePage() {
  return (
    <div className="space-y-10 pb-4">
      <section className="rounded-[2rem] border border-border/60 bg-card px-8 py-10 sm:px-10 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Real Estate Tools</li>
          </ol>
        </nav>
        <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
          Real Estate · {REAL_ESTATE_TOOLS.length} calculators
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Real estate calculators for property taxes and valuation.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Estimate transfer taxes, stamp duty, and price-per-area metrics across major real estate markets.
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
          Most-used pages right now:{" "}
          <Link href="/real-estate/singapore-buyers-stamp-duty-calculator" className="font-medium text-primary hover:underline">
            Singapore Buyer's Stamp Duty Calculator
          </Link>
          ,{" "}
          <Link href="/real-estate/hong-kong-stamp-duty-calculator" className="font-medium text-primary hover:underline">
            Hong Kong Stamp Duty Calculator
          </Link>
          ,{" "}
          <Link href="/real-estate/wales-ltt-calculator" className="font-medium text-primary hover:underline">
            Wales LTT Calculator
          </Link>
          ,{" "}
          <Link href="/real-estate/scotland-lbtt-calculator" className="font-medium text-primary hover:underline">
            Scotland LBTT Calculator
          </Link>
          , and{" "}
          <Link href="/real-estate/land-transfer-tax-calculator-toronto" className="font-medium text-primary hover:underline">
            Toronto Land Transfer Tax Calculator
          </Link>
          .
        </p>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            All Real-Estate Calculators
            <span className="ml-2 text-sm font-normal text-muted-foreground">({REAL_ESTATE_TOOLS.length})</span>
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {REAL_ESTATE_TOOLS.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>



      <section className="rounded-[1.75rem] border border-border/80 bg-card p-6 sm:p-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Explore other categories</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Text Tools", href: "/text" },
            { label: "Image Tools", href: "/image" },
            { label: "Health Tools", href: "/health" },
            { label: "Finance Tools", href: "/finance" },
            { label: "Utility Tools", href: "/utility" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
