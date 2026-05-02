import Link from "next/link";

import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 14400;

export const metadata = buildMetadata({
  title: "Sitemap for Utility Tools",
  description: "Browse utility tools from one HTML sitemap.",
  path: "/sitemap",
});

const SITEMAP_TOOLS = [
  {
    category: "AI",
    categoryHref: "/ai",
    categoryDescription: "AI-assisted rewriting and text-polishing tools.",
    tools: [
      {
        name: "AI Humanizer",
        href: "/ai/ai-humanizer",
        description: "Rewrite AI-like text into a more natural draft with tone and complexity controls.",
      },
    ],
  },
  {
    category: "Construction",
    categoryHref: "/construction",
    categoryDescription: "Material calculators for concrete, paint, and roofing projects.",
    tools: [
      {
        name: "Concrete Volume Calculator",
        href: "/construction/concrete-volume-calculator",
        description: "Estimate concrete volume for slabs, footings, columns, holes, and mixed shapes.",
      },
      {
        name: "Paint Coverage Calculator",
        href: "/construction/paint-coverage-calculator",
        description: "Estimate paint, primer, coats, and wall coverage for room projects.",
      },
      {
        name: "Flooring Material Calculator",
        href: "/construction/flooring-material-calculator",
        description: "Estimate flooring area, boxes, waste allowance, underlayment, and project cost.",
      },
      {
        name: "Roofing Material Calculator",
        href: "/construction/roofing-material-calculator",
        description: "Estimate shingles, bundles, underlayment, nails, and waste.",
      },
    ],
  },
  {
    category: "Design",
    categoryHref: "/design",
    categoryDescription: "Browser-based design tools for social media assets and visual content.",
    tools: [
      {
        name: "Free Social Media Carousel Builder",
        href: "/design/free-social-media-carousel-builder",
        description: "Create Instagram, LinkedIn, and TikTok carousel posts with templates and export options.",
      },
    ],
  },
  {
    category: "Finance",
    categoryHref: "/finance",
    categoryDescription: "Finance tools for business paperwork and practical calculations.",
    tools: [
      {
        name: "EMI Calculator",
        href: "/finance/emi-calculator",
        description: "Estimate monthly loan EMI, total interest, repayment, and affordability.",
      },
      {
        name: "Invoice Generator",
        href: "/finance/invoice-generator",
        description: "Create printable invoices with line items, taxes, discounts, and totals.",
      },
      {
        name: "Break Even Calculator",
        href: "/finance/break-even-calculator",
        description: "Find your break even point in units or sales dollars to understand your business viability.",
      },
      {
        name: "US Take-Home Calculator",
        href: "/finance/us-take-home-pay-calculator",
        description: "Calculate 2026 US net pay with federal/state tax, FICA, 401(k), and health benefits.",
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
        name: "Etsy Profit Calculator",
        href: "/finance/etsy-profit-calculator",
        description: "Model Etsy fees, ads, and margins for handmade sellers to ensure every sale is profitable.",
      },
      {
        name: "Amazon FBA Calculator UK",
        href: "/finance/amazon-fba-calculator-uk",
        description: "Specialized fee calculator for UK Amazon sellers including VAT and FBA fees.",
      },
      {
        name: "Amazon FBA Calculator Canada",
        href: "/finance/amazon-fba-canada-calculator",
        description: "Calculate FBA fees, storage costs, and margins for Amazon sellers in Canada.",
      },
      {
        name: "Halal Mortgage Calculator",
        href: "/finance/halal-mortgage-calculator",
        description: "Compare Sharia-compliant home finance: Musharakah, Murabaha, and Ijara structures without interest.",
      },
      {
        name: "Australia GST Calculator",
        href: "/finance/australia-gst-calculator",
        description: "Calculate Australian Goods and Services Tax (GST) for invoices and pricing.",
      },
      {
        name: "Australia Stamp Duty Calculator",
        href: "/finance/australia-stamp-duty-calculator",
        description: "Estimate property stamp duty and transfer fees across all Australian states.",
      },
      {
        name: "Business Risk Exposure Score",
        href: "/finance/business-risk-exposure-score-calculator",
        description: "Evaluate and score your company's operational, financial, and market risks.",
      },
      {
        name: "Canada HST/GST Calculator",
        href: "/finance/canada-hst-gst-calculator",
        description: "Calculate Canadian sales tax (GST, HST, PST) across all provinces.",
      },
      {
        name: "Car Depreciation Calculator",
        href: "/finance/car-depreciation-calculator",
        description: "Calculate vehicle depreciation curves and ownership costs for specific makes and models.",
      },
      {
        name: "Equity Dilution Calculator",
        href: "/finance/equity-dilution-calculator",
        description: "Calculate founder and employee equity dilution across multiple funding rounds.",
      },
      {
        name: "General Liability Insurance Estimator",
        href: "/finance/general-liability-insurance-cost-estimator",
        description: "Estimate business insurance premiums based on industry, revenue, and risk factors.",
      },
      {
        name: "Income Tax Calculator Australia",
        href: "/finance/income-tax-calculator-australia",
        description: "Calculate Australian net pay, income tax, and Medicare levy for the current financial year.",
      },
      {
        name: "Income Tax Calculator Ireland",
        href: "/finance/income-tax-calculator-ireland",
        description: "Calculate Irish net take-home pay, PAYE, PRSI, and USC.",
      },
      {
        name: "India SIP Calculator",
        href: "/finance/india-sip-calculator",
        description: "Calculate mutual fund SIP returns and wealth creation over time in INR.",
      },
      {
        name: "India TDS Calculator",
        href: "/finance/india-tds-calculator",
        description: "Calculate Tax Deducted at Source for professional fees, salary, and contracts.",
      },
      {
        name: "Inheritance Tax Calculator",
        href: "/finance/inheritance-tax-calculator",
        description: "Estimate estate tax and inheritance tax liabilities for different jurisdictions.",
      },
      {
        name: "US Self-Employment Tax Calculator",
        href: "/finance/us-self-employment-tax-calculator",
        description: "Estimate IRS self-employment tax for freelancers, contractors, and sole proprietors.",
      },
      {
        name: "Workers' Comp Premium Calculator",
        href: "/finance/workers-comp-premium-calculator",
        description: "Estimate workers' compensation insurance premiums by industry class code and payroll.",
      },
      {
        name: "Compound Interest Calculator",
        href: "/finance/compound-interest-calculator",
        description: "See how regular deposits grow over time with daily, monthly, or annual compounding.",
      },
      {
        name: "Dividend Reinvestment Calculator (DRIP)",
        href: "/finance/dividend-reinvestment-calculator",
        description: "Model DRIP compound growth, share accumulation, yield on cost, and portfolio value.",
      },
      {
        name: "Saudi End of Service Calculator",
        href: "/finance/saudi-end-of-service-calculator",
        description: "Calculate your Saudi Arabia end of service benefit (EOSB) accurately under Saudi Labor Law.",
      },
      {
        name: "CPP & EI Calculator Canada",
        href: "/finance/cpp-ei-calculator",
        description: "Calculate Canadian Pension Plan contributions and Employment Insurance premiums.",
      },
      {
        name: "Income Tax Calculator India",
        href: "/finance/income-tax-calculator-india",
        description: "Estimate Indian income tax liability under the old and new tax regime for FY 2026-26.",
      },
      {
        name: "California Sales Tax",
        href: "/finance/sales-tax-california-calculator",
        description: "Calculate sales tax by city and county in California with the latest 2026 rates.",
      },
      {
        name: "Canada Sales Tax (2026)",
        href: "/finance/sales-tax-canada-calculator",
        description: "Calculate GST, HST, PST, and QST across all Canadian provinces with 2026 rate updates.",
      },
      {
        name: "Zakat Calculator 2026",
        href: "/finance/zakat-calculator",
        description: "Free online zakat calculator. Calculate zakat on gold, silver, savings, and investments.",
      },
      {
        name: "401k Match Calculator",
        href: "/finance/401k-match-calculator",
        description: "Calculate how much your employer's 401k matching contribution is worth and how it affects your retirement savings.",
      },
      {
        name: "Canada Income Tax Calculator",
        href: "/finance/canada-income-tax-calculator",
        description: "Calculate your net pay after federal and provincial taxes in Canada.",
      },
      {
        name: "Capital Gains Tax Canada Calculator",
        href: "/finance/capital-gains-tax-canada-calculator",
        description: "Estimate your capital gains tax liability for property or stock sales in Canada.",
      },
      {
        name: "PMI Calculator",
        href: "/finance/pmi-calculator",
        description: "Calculate your monthly Private Mortgage Insurance (PMI) based on your down payment and credit score.",
      },
      {
        name: "UK Student Loan Repayment Calculator",
        href: "/finance/uk-student-loan-repayment-calculator",
        description: "Estimate your monthly student loan repayments in the UK based on your plan type.",
      },
      {
        name: "House Affordability Australia",
        href: "/finance/house-affordability-calculator-australia",
        description: "Calculate borrowing capacity, stamp duty, LMI, and monthly repayments for Australian property.",
      },
      {
        name: "Amortization Chart Calculator",
        href: "/finance/amortization-chart-calculator",
        description: "Generate detailed loan amortization tables and visualize payment breakdowns.",
      },
      {
        name: "CD Ladder Calculator",
        href: "/finance/cd-ladder-calculator",
        description: "Plan multi-rung CD ladders, track maturity dates, and project interest earnings.",
      },
      {
        name: "Rule of 72 Calculator",
        href: "/finance/rule-of-72-calculator",
        description: "Estimate investment doubling time and compare scenarios side-by-side.",
      },
      {
        name: "Net Salary Calculator",
        href: "/finance/net-salary-calculator",
        description: "Calculate your exact take-home pay with our free gross to net salary calculator.",
      },
      {
        name: "Crypto Mining Calculator",
        href: "/finance/crypto-mining-calculator",
        description: "Calculate Bitcoin and GPU mining profitability with real-time network parameters and ROI timelines.",
      },
      {
        name: "Tip Calculator",
        href: "/finance/tip-calculator",
        description: "Calculate restaurant tips, split bills, convert amounts to percentages, and estimate gratuity for 16+ service types.",
      },
    ],
  },
  {
    category: "SEO",
    categoryHref: "/seo",
    categoryDescription: "Optimize your content for search engines and social platforms.",
    tools: [
      {
        name: "Keyword Clustering Tool",
        href: "/seo/keyword-clustering",
        description: "Group thousands of keywords into topic clusters using semantic NLP and search intent logic.",
      },
      {
        name: "YouTube Title Checker",
        href: "/seo/youtube-title-checker",
        description: "Analyze video titles for pixel width truncation, character limits, and SEO score with multi-device thumbnail previews.",
      },
      {
        name: "Meta Description Pixel Width Checker",
        href: "/seo/meta-description-checker",
        description: "Check if your meta descriptions are too long for Google SERP on mobile and desktop devices.",
      },
      {
        name: "Hreflang Tag Generator",
        href: "/seo/hreflang-generator",
        description: "Generate correct hreflang tags for multilingual and multi-regional websites to avoid SEO cannibalization.",
      },
    ],
  },
  {
    category: "Health",
    categoryHref: "/health",
    categoryDescription: "Health and nutrition calculators.",
    tools: [
      {
        name: "BMR Calculator",
        href: "/health/bmr-calculator",
        description: "Calculate your Basal Metabolic Rate using the Mifflin-St Jeor Equation.",
      },
      {
        name: "Calorie Calculator",
        href: "/health/calorie-calculator",
        description: "Estimate TDEE and daily calorie targets for weight loss, maintenance, or muscle gain.",
      },
      {
        name: "US Navy Body Fat Calculator",
        href: "/health/us-navy-body-fat-calculator",
        description: "Calculate Navy PRT body fat percentage using official tape measurements.",
      },
    ],
  },
  {
    category: "Image",
    categoryHref: "/image",
    categoryDescription: "Image editing, conversion, and quick browser-based visual utilities.",
    tools: [
      {
        name: "AI Background Remover",
        href: "/image/free-image-background-remover-online",
        description: "Remove the background from any photo instantly using local WebAssembly AI.",
      },
      {
        name: "Convert Image to Base64",
        href: "/image/convert-image-to-base64",
        description: "Convert any image into a Base64 string or data URL directly in your browser.",
      },
      {
        name: "Instagram Photo Resizer",
        href: "/image/resize-photo-instagram-online",
        description: "Quickly resize or crop photos for Instagram (1:1, 4:5, 1.91:1) with high-quality export.",
      },
    ],
  },
  {
    category: "Real Estate",
    categoryHref: "/real-estate",
    categoryDescription: "Property calculators for buying costs and transfer taxes.",
    tools: [
      {
        name: "NYC Transfer Tax Calculator",
        href: "/real-estate/nyc-transfer-tax-calculator",
        description: "Estimate New York City real property transfer tax from the transfer price and property type.",
      },
      {
        name: "Price per Square Foot Calculator",
        href: "/real-estate/price-per-square-foot-calculator",
        description: "Compare sale or rent listings by price per square foot or square metre.",
      },
      {
        name: "UK Stamp Duty Calculator",
        href: "/real-estate/uk-stamp-duty-calculator",
        description: "Calculate SDLT for England and Northern Ireland purchases.",
      },
      {
        name: "Singapore Property Stamp Duty Calculator",
        href: "/real-estate/singapore-property-stamp-duty-calculator",
        description: "Estimate BSD, ABSD, and SSD for Singapore property purchases.",
      },
      {
        name: "Singapore Buyer's Stamp Duty Calculator",
        href: "/real-estate/singapore-buyers-stamp-duty-calculator",
        description: "Calculate Singapore buyer stamp duty by residency and property count.",
      },
      {
        name: "Singapore Seller's Stamp Duty Calculator",
        href: "/real-estate/singapore-sellers-stamp-duty-calculator",
        description: "Estimate Singapore seller stamp duty by sale price and holding period.",
      },
      {
        name: "Scotland LBTT Calculator",
        href: "/real-estate/scotland-lbtt-calculator",
        description: "Calculate Scotland Land and Buildings Transaction Tax.",
      },
      {
        name: "Wales LTT Calculator",
        href: "/real-estate/wales-ltt-calculator",
        description: "Estimate Welsh Land Transaction Tax for residential purchases.",
      },
      {
        name: "Hong Kong Stamp Duty Calculator",
        href: "/real-estate/hong-kong-stamp-duty-calculator",
        description: "Calculate Hong Kong ad valorem stamp duty for residential property.",
      },
      {
        name: "Rent vs Buy Calculator",
        href: "/real-estate/rent-vs-buy-calculator",
        description: "Compare the long-term financial costs of renting versus buying a home.",
      },
      {
        name: "Cap Rate Calculator 2026",
        href: "/real-estate/cap-rate-calculator",
        description: "Professional NOI and property yield analysis with 2026 US market benchmarks.",
      },
      {
        name: "Cash on Cash Return Calculator",
        href: "/real-estate/cash-on-cash-return-calculator",
        description: "Analyze rental property returns including CoC, NOI, and multi-year projections.",
      },
      {

        name: "Mortgage Qualifier Canada",
        href: "/real-estate/mortgage-qualifier-canada",
        description: "Professional GDS/TDS mortgage qualification with the 2024 Canadian stress test.",
      },
      {
        name: "Rental Yield Calculator",
        href: "/real-estate/rental-yield-calculator",
        description: "Calculate gross and net rental yield for UK, US and Australia with stamp duty and city medians.",
      },
      {
        name: "House Affordability Canada",
        href: "/real-estate/house-affordability-calculator-canada",
        description: "Estimate maximum home price in Canada with stress test, CMHC insurance, and provincial tax rules.",
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
    ],
  },
  {
    category: "Marketing",
    categoryHref: "/marketing",
    categoryDescription: "Growth marketing calculators and performance analysis tools.",
    tools: [
      {
        name: "Marketing ROI Calculator",
        href: "/marketing/marketing-roi-calculator",
        description: "Calculate ROAS, ROMI, CAC, and LTV across every channel to know exactly what your budget is earning.",
      },
    ],
  },
  {
    category: "Text",
    categoryHref: "/text",
    categoryDescription: "Text cleanup, transformation, translation, OCR, and analysis tools.",
    tools: [
      {
        name: "Word Frequency Counter",
        href: "/text/word-frequency",
        description: "Analyze repeated words, filter stop words, and surface the most-used terms in any text block.",
      },
      {
        name: "Case Converter",
        href: "/text/case-converter",
        description: "Convert text between uppercase, lowercase, title case, sentence case, and code formats.",
      },
      {
        name: "Word Cloud Generator",
        href: "/text/word-cloud-generator",
        description: "Generate a visual word cloud from pasted text with frequency-based sizing.",
      },
      {
        name: "Duplicate Word Finder",
        href: "/text/duplicate-word-finder",
        description: "Find repeated words and overused terms in drafts and web copy.",
      },
      {
        name: "Morse Code Translator",
        href: "/text/morse-code-translator",
        description: "Translate text to Morse code and Morse code back to text.",
      },
      {
        name: "Binary Code Translator",
        href: "/text/binary-code-translator",
        description: "Translate text to binary and binary back to text with byte validation.",
      },
      {
        name: "Image to Text OCR",
        href: "/text/convert-image-to-text",
        description: "Extract, clean, copy, and download editable text from images with OCR.",
      },
      {
        name: "Readability / Flesch-Kincaid Calculator",
        href: "/text/readability-flesch-kincaid-calculator",
        description: "Score pasted text for reading ease, grade level, and sentence complexity.",
      },
    ],
  },
  {
    category: "Utility",
    categoryHref: "/utility",
    categoryDescription: "Formatting, generation, and scanning tools for quick browser work.",
    tools: [
      {
        name: "Expected Goals (xG) Calculator",
        href: "/utility/xg-expected-goals-calculator",
        description: "Interactive football xG calculator with shot position, pressure, assist type, and match comparison.",
      },
      {
        name: "DNS Checker",
        href: "/utility/dns-checker",
        description: "Look up A, AAAA, MX, TXT, NS, and other DNS records for any domain.",
      },
      {
        name: "Free CV Resume Builder",
        href: "/utility/free-cv-resume-builder",
        description: "Build a resume online for free with editable sections, templates, autosave, and print export.",
      },
      {
        name: "QR Code Generator",
        href: "/utility/create-qr-code-online",
        description: "Create and download static QR codes with custom colors and zero expiry limits.",
      },
      {
        name: "Barcode Generator",
        href: "/utility/barcode-generator",
        description: "Create CODE128, UPC, and EAN barcodes and download high-quality PNGs.",
      },
      {
        name: "QR Code Scanner",
        href: "/utility/qr-code-scanner",
        description: "Scan QR codes using your device camera or upload an image.",
      },
      {
        name: "Barcode Scanner",
        href: "/utility/barcode-scanner",
        description: "Use your webcam or phone to scan 1D retail product barcodes.",
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
        name: "Password Strength Checker",
        href: "/utility/password-strength-checker",
        description: "Analyze password security with entropy calculation, crack time estimation, and pattern detection.",
      },
      {
        name: "Social Media Character Counter",
        href: "/utility/social-media-character-counter",
        description: "Check character limits for Instagram, X, LinkedIn, TikTok, and more in real-time.",
      },
    ],
  },
];

const TOOL_COUNT = SITEMAP_TOOLS.reduce((sum, group) => sum + group.tools.length, 0);

export default async function SitemapPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4 py-2 sm:py-4">

        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Browse tools
        </h1>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              All Tools
            </h2>
          </div>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
            {TOOL_COUNT} tools
          </span>
        </div>

        <div className="mt-6 space-y-6">
          {SITEMAP_TOOLS.map((group) => (
            <section key={group.category} className="rounded-[1.25rem] border border-border bg-background p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{group.category}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{group.categoryDescription}</p>
                </div>
                <Link
                  href={group.categoryHref}
                  className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
                >
                  View {group.category}
                </Link>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {group.tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex flex-col rounded-[1rem] border border-border bg-card px-4 py-4 text-sm transition-colors hover:border-primary/20 hover:bg-primary-soft"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-foreground">{tool.name}</div>
                    </div>
                    <div className="mt-2 line-clamp-2 leading-6 text-muted-foreground">{tool.description}</div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
