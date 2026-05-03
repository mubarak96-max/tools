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
      name: "Car Loan EMI Calculator 2026",
      href: "/finance/car-loan-emi-calculator",
      description: "Calculate exact car EMI, interest by credit score, and 2026 amortization.",
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
    {
      name: "UAE Gratuity Calculator",
      href: "/finance/uae-gratuity-calculator",
      description: "Calculate your UAE end of service benefits (EOSB) with the latest 2026 labor law formula.",
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
      name: "Singapore Property Stamp Duty Calculator",
      href: "/real-estate/singapore-property-stamp-duty-calculator",
      description: "Calculate Singapore residential BSD, ABSD, and SSD using current buyer profiles and 2025 regimes.",
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
      href: "/utility/create-qr-code-online",
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
    {
      name: "UAE Visa Cost Calculator",
      href: "/utility/uae-visa-cost-calculator",
      description: "Calculate exact UAE visa costs for 2026 including hidden fees and government charges.",
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
  relatedGuides,
}: {
  path: string;
  category: string;
  categoryHref: string;
  title: string;
  description: string;
  children: ReactNode;
  learn?: ReactNode;
  faqs?: Array<{ question: string; answer: string }>;
  relatedGuides?: Array<{ title: string; href: string; description?: string }>;
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

      {relatedGuides && relatedGuides.length > 0 ? (
        <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Related Guides</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {relatedGuides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group rounded-[1.25rem] border border-border bg-background p-5 transition-all hover:border-primary/40 hover:shadow-sm flex flex-col"
              >
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary">{guide.title}</h3>
                {guide.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{guide.description}</p>
                )}
                <div className="mt-auto pt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Read guide <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </div>
              </Link>
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
    <section className="mt-16 space-y-8 border-t border-border/40 pt-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Explore more {category.toLowerCase()} tools
          </h2>
          <p className="text-sm text-muted-foreground">
            High-performance tools to help you with {category.toLowerCase()} calculations.
          </p>
        </div>
        <Link 
          href={categoryHref} 
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          View all {category.toLowerCase()} tools
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" height="16" 
            viewBox="0 0 24 24" 
            fill="none" stroke="currentColor" 
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98]"
          >
            {/* Subtle background glow on hover */}
            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
            
            <div className="relative">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-muted-foreground transition-colors group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
              </div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                {tool.description}
              </p>
            </div>

            <div className="relative mt-4 flex items-center justify-between border-t border-border/40 pt-3 opacity-0 transition-all translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Open Tool</span>
              <div className="rounded-full bg-primary/10 p-1 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
