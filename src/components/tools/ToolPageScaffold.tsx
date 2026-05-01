import Link from "next/link";
import type { ReactNode } from "react";

const RELATED_BY_CATEGORY: Record<string, Array<{ name: string; href: string; description: string }>> = {
  AI: [
    {
      name: "AI Humanizer",
      href: "/ai/ai-humanizer",
      description: "Rewrite AI-like text into a more natural, human-sounding draft.",
    },
  ],
  Construction: [
    {
      name: "Concrete Volume Calculator",
      href: "/construction/concrete-volume-calculator",
      description: "Estimate concrete volume for slabs, footings, columns, and holes.",
    },
    {
      name: "Paint Coverage Calculator",
      href: "/construction/paint-coverage-calculator",
      description: "Estimate paint, primer, coats, and project coverage for rooms.",
    },
    {
      name: "Flooring Material Calculator",
      href: "/construction/flooring-material-calculator",
      description: "Estimate flooring material, waste, boxes, and project cost.",
    },
    {
      name: "Roofing Material Calculator",
      href: "/construction/roofing-material-calculator",
      description: "Estimate shingles, underlayment, nails, and roofing waste.",
    },
  ],
  Finance: [
    {
      name: "Tip Calculator",
      href: "/finance/tip-calculator",
      description: "Calculate restaurant tips, split bills, and estimate gratuity with a vintage receipt aesthetic.",
    },
    {
      name: "Invoice Generator",
      href: "/finance/invoice-generator",
      description: "Create printable invoices with line items, taxes, discounts, and totals.",
    },
    {
      name: "Net Salary Calculator",
      href: "/finance/net-salary-calculator",
      description: "Calculate your exact take-home pay with our free gross to net salary calculator.",
    },
    {
      name: "US Take-Home Calculator",
      href: "/finance/us-take-home-pay-calculator",
      description: "Calculate US net pay with benefits.",
    },
    {
      name: "EMI Calculator",
      href: "/finance/emi-calculator",
      description: "Estimate monthly loan payment, total interest, and affordability.",
    },
    {
      name: "Salary After Tax Calculator",
      href: "/finance/salary-after-tax-calculator",
      description: "Calculate take-home pay with 2026 tax brackets.",
    },
    {
      name: "Australia Stamp Duty Calculator",
      href: "/finance/australia-stamp-duty-calculator",
      description: "Calculate property transfer duty across all 8 states with 2026 rates and concessions.",
    },
    {
      name: "Australia GST Calculator",
      href: "/finance/australia-gst-calculator",
      description: "Add or remove 10% GST with multi-item invoice and BAS quick-fill helper.",
    },
    {
      name: "India SIP Calculator",
      href: "/finance/india-sip-calculator",
      description: "Mutual fund SIP returns with Step-Up SIP, Lumpsum, and SWP modes.",
    },
    {
      name: "India TDS Calculator",
      href: "/finance/india-tds-calculator",
      description: "Calculate TDS deductions on salary, interest, and professional services.",
    },
    {
      name: "Car Depreciation Calculator",
      href: "/finance/car-depreciation-calculator",
      description: "Resale value and depreciation curves for 500+ makes and models.",
    },
    {
      name: "Canada HST/GST Calculator",
      href: "/finance/canada-hst-gst-calculator",
      description: "Calculate sales tax for all 13 Canadian provinces and territories.",
    },
    {
      name: "US Self-Employment Tax Calculator",
      href: "/finance/us-self-employment-tax-calculator",
      description: "Estimate 2026 IRS self-employment tax for freelancers and contractors.",
    },
    {
      name: "Break Even Point (BEP) Calculator",
      href: "/finance/break-even-calculator",
      description: "Calculate your break even point in units or revenue.",
    },
    {
      name: "Dropshipping Break-even Calculator",
      href: "/finance/dropshipping-break-even",
      description: "Calculate break-even ROAS, CPA, and required sales.",
    },
    {
      name: "Income Tax Calculator Australia",
      href: "/finance/income-tax-calculator-australia",
      description: "Calculate 2026-26 Australian tax with Medicare & HECS.",
    },
    {
      name: "Income Tax Calculator Ireland",
      href: "/finance/income-tax-calculator-ireland",
      description: "Calculate 2026 Irish tax after PAYE, USC, and PRSI.",
    },
    {
      name: "General Liability Insurance Estimator",
      href: "/finance/general-liability-insurance-cost-estimator",
      description: "Estimate small business general liability premiums by industry.",
    },
    {
      name: "Workers Comp Premium Calculator",
      href: "/finance/workers-comp-premium-calculator",
      description: "Estimate workers compensation premiums by class code and state.",
    },
    {
      name: "Business Risk Exposure Score Calculator",
      href: "/finance/business-risk-exposure-score-calculator",
      description: "Assess multi-dimensional business risk and get mitigation strategies.",
    },
    {
      name: "Inheritance Tax Calculator",
      href: "/finance/inheritance-tax-calculator",
      description: "Calculate estate tax and succession duty for UK, USA, Ireland & more.",
    },
    {
      name: "Equity Dilution Calculator",
      href: "/finance/equity-dilution-calculator",
      description: "Model founder ownership through funding rounds and SAFEs.",
    },
    {
      name: "Bonus Tax Calculator",
      href: "/finance/bonus-tax-calculator",
      description: "Employee bonus & business depreciation tool.",
    },
    {
      name: "Product Pricing Calculator",
      href: "/finance/product-pricing-calculator",
      description: "Optimize selling prices across Shopify, Etsy, and Amazon.",
    },
    {
      name: "Etsy Profit Calculator",
      href: "/finance/etsy-profit-calculator",
      description: "Model Etsy fees, ads, and margins for handmade sellers.",
    },
    {
      name: "Amazon FBA Calculator Canada",
      href: "/finance/amazon-fba-canada-calculator",
      description: "Calculate Amazon.ca fees in CAD: referral, fulfillment, and storage.",
    },
    {
      name: "Amazon FBA Calculator UK",
      href: "/finance/amazon-fba-calculator-uk",
      description: "Estimate Amazon UK referral fees, fulfillment, storage, and unit profit.",
    },
  ],
  SEO: [
    {
      name: "Keyword Clustering Tool",
      href: "/seo/keyword-clustering",
      description: "Group keywords into topic clusters with semantic NLP.",
    },
    {
      name: "YouTube Title Checker",
      href: "/seo/youtube-title-checker",
      description: "Analyze video titles for pixel width and SEO score.",
    },
    {
      name: "Meta Description Checker",
      href: "/seo/meta-description-checker",
      description: "Measure title and meta description pixel width.",
    },
    {
      name: "Hreflang Tag Generator",
      href: "/seo/hreflang-generator",
      description: "Generate validated multi-language SEO tags.",
    },
  ],
  Health: [
    {
      name: "BMR Calculator",
      href: "/health/bmr-calculator",
      description: "Calculate basal metabolic rate with the Mifflin-St Jeor equation.",
    },
    {
      name: "Calorie Calculator",
      href: "/health/calorie-calculator",
      description: "Estimate TDEE and calorie targets from activity level.",
    },
    {
      name: "US Navy Body Fat Calculator",
      href: "/health/us-navy-body-fat-calculator",
      description: "Calculate Navy PRT body fat percentage using official tape measurements.",
    },
  ],
  "Real Estate": [
    {
      name: "Singapore Buyer's Stamp Duty Calculator",
      href: "/real-estate/singapore-buyers-stamp-duty-calculator",
      description: "Estimate Singapore BSD and ABSD for residential buyers by profile and property count.",
    },
    {
      name: "Hong Kong Stamp Duty Calculator",
      href: "/real-estate/hong-kong-stamp-duty-calculator",
      description: "Calculate Hong Kong residential ad valorem stamp duty using the current Scale 2 schedule.",
    },
    {
      name: "Wales LTT Calculator",
      href: "/real-estate/wales-ltt-calculator",
      description: "Estimate Welsh Land Transaction Tax with standard and higher residential rates.",
    },
    {
      name: "Scotland LBTT Calculator",
      href: "/real-estate/scotland-lbtt-calculator",
      description: "Calculate Scottish LBTT with first-time buyer relief and Additional Dwelling Supplement.",
    },
    {
      name: "Toronto Land Transfer Tax Calculator",
      href: "/real-estate/land-transfer-tax-calculator-toronto",
      description: "Estimate Ontario LTT, Toronto MLTT, rebates, and NRST for Toronto purchases.",
    },
    {
      name: "NYC Transfer Tax Calculator",
      href: "/real-estate/nyc-transfer-tax-calculator",
      description: "Estimate NYC and NYS transfer taxes for property sales.",
    },
    {
      name: "Price per Square Foot Calculator",
      href: "/real-estate/price-per-square-foot-calculator",
      description: "Compare sale or rent listings on a size-adjusted basis.",
    },
    {
      name: "UK Stamp Duty Calculator",
      href: "/real-estate/uk-stamp-duty-calculator",
      description: "Calculate SDLT for England and Northern Ireland purchases.",
    },
    {
      name: "Rent vs Buy Calculator",
      href: "/real-estate/rent-vs-buy-calculator",
      description: "Compare the long-term cost of renting versus buying a home, including tax benefits and ROI.",
    },
    {
      name: "House Affordability Canada",
      href: "/real-estate/house-affordability-calculator-canada",
      description: "Estimate maximum home price in Canada with stress test, CMHC, and provincial tax rules.",
    },
  ],
  Text: [
    {
      name: "Case Converter",
      href: "/text/case-converter",
      description: "Convert text between uppercase, lowercase, title case, and more.",
    },
    {
      name: "Word Cloud Generator",
      href: "/text/word-cloud-generator",
      description: "Turn pasted text into a frequency-based visual word cloud.",
    },
    {
      name: "Duplicate Word Finder",
      href: "/text/duplicate-word-finder",
      description: "Find repeated words and overused terms in any draft.",
    },
    {
      name: "Word Frequency Counter",
      href: "/text/word-frequency",
      description: "Analyze repeated words, counts, and frequency density.",
    },
  ],
  Utility: [
    {
      name: "DNS Checker",
      href: "/utility/dns-checker",
      description: "Look up DNS records for a domain and verify configuration.",
    },
    {
      name: "QR Code Generator",
      href: "/utility/qr-code-generator",
      description: "Create static QR codes with custom colors and download options.",
    },
    {
      name: "Barcode Generator",
      href: "/utility/barcode-generator",
      description: "Create CODE128, UPC, and EAN barcodes as PNG files.",
    },
    {
      name: "Fuel Cost Calculator",
      href: "/utility/fuel-cost-calculator",
      description: "Calculate exact fuel costs for any trip or commute. Compare vehicles, estimate annual expenses, and optimize your driving budget.",
    },
    {
      name: "Gas Mileage Calculator",
      href: "/utility/gas-mileage-calculator",
      description: "Diagnostic HUD to calculate MPG, trip fuel costs, and annual savings. Supports US and Metric units.",
    },
    {
      name: "GPA Calculator",
      href: "/utility/gpa-calculator",
      description: "Calculate high school and college GPA (weighted & unweighted), convert grades, and find your target GPA.",
    },
    {
      name: "Social Media Image Resizer",
      href: "/utility/social-media-image-resizer",
      description: "Resize images to exact dimensions for Instagram, Twitter, Facebook, LinkedIn, YouTube, and TikTok.",
    },
    {
      name: "Aspect Ratio Calculator",
      href: "/utility/aspect-ratio-calculator",
      description: "Calculate 16:9, 4:3, 1:1, 21:9 and custom aspect ratios. Live preview and image upload detection.",
    },
    {
      name: "What Is My IP Address?",
      href: "/utility/what-is-my-ip",
      description: "Instantly find your public and private IP addresses, geolocation, ISP, and proxy/VPN status.",
    },
    {
      name: "UTM Builder",
      href: "/utility/utm-builder",
      description: "Generate Google Analytics tracking URLs with source, medium, and campaign parameters.",
    },
  ],
};

export default function ToolPageScaffold({
  path,
  category,
  categoryHref,
  title,
  description,
  children,
  learn,
  faqs,
}: {
  path: string;
  category: string;
  categoryHref: string;
  title: string;
  description: string;
  children: ReactNode;
  learn?: ReactNode;
  faqs?: Array<{ question: string; answer: string }>;
}) {
  return (
    <div className="space-y-8">
      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href={categoryHref} className="hover:text-primary">{category}</Link></li>
            <li>/</li>
            <li className="text-foreground">{title}</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            {category} Tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </p>
        </div>
      </section>

      {children}

      {learn ? (
        <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
          {learn}
        </section>
      ) : null}

      {faqs && faqs.length > 0 ? (
        <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((item) => (
              <article key={item.question} className="rounded-[1.25rem] border border-border bg-background p-5">
                <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <RelatedToolsSection category={category} categoryHref={categoryHref} currentPath={path} />
    </div>
  );
}

export function RelatedToolsSection({
  category,
  categoryHref,
  currentPath,
}: {
  category: string;
  categoryHref: string;
  currentPath: string;
}) {
  const related = (RELATED_BY_CATEGORY[category] ?? []).filter((tool) => tool.href !== currentPath).slice(0, 6);

  if (related.length === 0) return null;

  return (
    <section className="space-y-5 border-t border-border/60 pt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">More {category.toLowerCase()} tools</h2>
        <Link href={categoryHref} className="text-sm font-medium text-primary hover:underline">
          All {category.toLowerCase()} tools
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-[1.25rem] border border-border bg-card p-4 transition-colors hover:border-primary/30"
          >
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">{tool.name}</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{tool.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
