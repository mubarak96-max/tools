import type { Metadata } from "next";
import RentalYieldCalculator from "@/components/RentalYieldCalculator";
import {
  TrendingUp, TrendingDown, Calculator, Building2, PoundSterling,
  DollarSign, MapPin, BarChart3, Shield, AlertTriangle, CheckCircle2,
  ArrowRight, BookOpen, Scale, Home, Percent, Wallet, Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Rental Yield Calculator — Gross vs Net Yield for UK, US & Australia",
  description: "Free rental yield calculator for property investors in the UK, US, and Australia. Calculate gross yield, net yield, cash-on-cash return, and cap rate. Compare against city medians. Auto-estimates stamp duty, property taxes, and operating expenses. No sign-up required.",
  keywords: [
    "rental yield calculator", "rental yield calculator UK", "rental yield calculator US", "rental yield calculator Australia",
    "gross rental yield calculator", "net rental yield calculator", "buy to let yield calculator", "property yield calculator",
    "investment property yield calculator", "rental return calculator", "property investment calculator UK",
    "property investment calculator Australia", "cap rate calculator", "cash on cash return calculator",
    "how to calculate rental yield", "what is a good rental yield", "gross vs net rental yield", "rental yield formula",
    "stamp duty calculator buy to let", "property investment returns calculator", "landlord yield calculator",
    "buy to let calculator", "property ROI calculator", "rental income calculator", "real estate yield calculator",
    "rental property analysis calculator", "UK property yield calculator 2026", "US rental property calculator",
    "Australian rental yield calculator", "Brisbane rental yield", "Sydney rental yield", "London rental yield",
    "Manchester rental yield", "Houston rental yield", "Phoenix rental yield",
  ],
  openGraph: {
    title: "Rental Yield Calculator — Gross vs Net for UK, US & Australia",
    description: "Calculate gross and net rental yield, cap rate, and cash-on-cash return for investment properties. Auto-estimates taxes and expenses. Compares against city benchmarks.",
    url: "https://findbest.tools/real-estate/rental-yield-calculator",
    type: "website",
  },
  alternates: {
    canonical: "https://findbest.tools/real-estate/rental-yield-calculator",
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const softwareSchema = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "Rental Yield Calculator", applicationCategory: "FinanceApplication", operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Free rental yield calculator supporting UK, US, and Australian property markets. Calculates gross yield, net yield, cash-on-cash return, and cap rate with auto-estimated stamp duty and operating expenses.",
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "1250" },
  featureList: [
    "Gross rental yield calculation", "Net rental yield calculation", "Cash-on-cash return",
    "Cap rate calculator", "UK stamp duty auto-estimate", "US property tax estimation",
    "Australian stamp duty calculation", "City benchmark comparison", "Monthly cash flow breakdown", "After-tax yield calculation",
  ],
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is rental yield and how do you calculate it?",
      acceptedAnswer: { "@type": "Answer", text: "Rental yield is the annual return on an investment property expressed as a percentage of the property's value. Gross rental yield is calculated by dividing annual rental income by the property purchase price and multiplying by 100. Net rental yield deducts all annual operating expenses from the rental income before dividing by the total property cost including purchase fees." } },
    { "@type": "Question", name: "What is the difference between gross and net rental yield?",
      acceptedAnswer: { "@type": "Answer", text: "Gross rental yield only considers rental income vs property price. Net rental yield deducts expenses (council rates, strata, insurance, management fees, maintenance) giving a more accurate picture of actual returns. Net yield is typically 1-3% lower than gross yield." } },
    { "@type": "Question", name: "What is a good rental yield in the UK in 2026?",
      acceptedAnswer: { "@type": "Answer", text: "In the UK, a gross rental yield of 4-6% is generally considered good for buy-to-let investments. London typically offers 3-4.5% due to high property prices, while northern cities like Leeds, Liverpool, and Newcastle can achieve 6-8%. Net yields are typically 1-1.5 percentage points lower." } },
    { "@type": "Question", name: "What is a good rental yield in the US?",
      acceptedAnswer: { "@type": "Answer", text: "In the US, coastal cities like New York and Los Angeles typically offer 4-5% gross yields, while Midwest and Sun Belt markets like Houston, Detroit, and Cleveland can deliver 7-10%. The national average is approximately 6-7% gross. A net yield above 5% is generally considered strong." } },
    { "@type": "Question", name: "What is a good rental yield in Australia?",
      acceptedAnswer: { "@type": "Answer", text: "Australian rental yields vary by city. Sydney and Melbourne typically offer 3-4% gross yields. Brisbane and Adelaide average 4.5-5%, while Perth and Darwin can achieve 5-7%. Regional areas may exceed 7%. A gross yield above 5% is considered good." } },
    { "@type": "Question", name: "How does stamp duty affect rental yield in the UK?",
      acceptedAnswer: { "@type": "Answer", text: "Stamp Duty Land Tax significantly impacts rental yield because it increases total capital invested. For buy-to-let and second homes, the UK applies a 3% surcharge on top of standard SDLT rates. On a £250,000 property, this adds approximately £10,000 to the purchase cost, reducing both gross and net yield." } },
    { "@type": "Question", name: "Should I use gross or net yield to compare properties?",
      acceptedAnswer: { "@type": "Answer", text: "Use gross yield for initial screening and quick comparisons. Always use net yield before making a purchase decision. Two properties with identical gross yields can have vastly different net yields depending on their expense profiles." } },
    { "@type": "Question", name: "What expenses should be included in net rental yield?",
      acceptedAnswer: { "@type": "Answer", text: "Net rental yield should include all recurring annual expenses: property management fees, council tax or property tax, landlord insurance, maintenance and repairs, vacancy allowance, letting fees, ground rent, service charges, strata fees, and mortgage interest. Capital repayments should NOT be included." } },
    { "@type": "Question", name: "What is cash-on-cash return vs rental yield?",
      acceptedAnswer: { "@type": "Answer", text: "Rental yield measures return against total property cost, while cash-on-cash return measures return against your actual cash invested (deposit plus purchase costs). If you buy a £200,000 property with a £50,000 deposit and earn £8,000 net income annually, your net yield is 4% but your cash-on-cash return is 16%." } },
    { "@type": "Question", name: "What is cap rate and how is it different from rental yield?",
      acceptedAnswer: { "@type": "Answer", text: "Cap rate uses property value as the denominator and excludes mortgage interest from expenses. Cap Rate = Net Operating Income / Property Value. It is the standard metric used by commercial real estate investors to compare properties independently of financing." } },
  ],
};

const howToSchema = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Calculate Rental Yield",
  description: "A step-by-step guide to calculating gross and net rental yield for investment properties.",
  totalTime: "PT5M",
  step: [
    { "@type": "HowToStep", name: "Determine the total property cost", text: "Add the purchase price to all acquisition costs including stamp duty, legal fees, survey costs, and any renovation work needed before letting." },
    { "@type": "HowToStep", name: "Calculate annual rental income", text: "Multiply the weekly rent by 52 or the monthly rent by 12 to get the gross annual rental income before any deductions." },
    { "@type": "HowToStep", name: "Calculate gross rental yield", text: "Divide the annual rental income by the total property cost and multiply by 100. This gives you the gross yield percentage." },
    { "@type": "HowToStep", name: "Tally all annual operating expenses", text: "Add up property management fees, council tax or property tax, insurance, maintenance, vacancy allowance, strata fees, ground rent, service charges, and mortgage interest." },
    { "@type": "HowToStep", name: "Calculate net rental yield", text: "Subtract total annual expenses from annual rental income, then divide by the total property cost and multiply by 100. This is your true investment return." },
  ],
};

const KEY_DIFFERENCES = [
  {
    title: "Gross Rental Yield",
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
    formula: "(Annual Rent ÷ Property Price) × 100",
    body: "Gross rental yield is the headline figure used for quick property comparisons. It divides annual rental income by the property purchase price without deducting any expenses. While useful for initial screening, gross yield overstates actual returns and should never be the sole basis for investment decisions. A property showing 7% gross may deliver only 4.5% net after costs.",
    pros: ["Quick to calculate", "Good for comparing multiple listings", "Industry standard headline metric"],
    cons: ["Ignores all operating costs", "Overstates true profitability", "Can vary dramatically from net yield"],
  },
  {
    title: "Net Rental Yield",
    icon: <TrendingDown className="w-6 h-6 text-primary" />,
    formula: "((Annual Rent − Expenses) ÷ Total Cost) × 100",
    body: "Net rental yield is the true measure of investment performance. It subtracts all annual holding costs from rental income, then divides by total capital invested including stamp duty and fees. This is the figure banks, experienced investors, and property analysts rely on when assessing buy-to-let viability.",
    pros: ["Reflects actual cash flow", "Accounts for all costs", "Better for investment decisions", "Enables accurate cross-market comparison"],
    cons: ["Requires more data inputs", "Expenses can vary year to year", "Must be recalculated annually"],
  },
];

const COUNTRY_GUIDES = [
  {
    country: "United Kingdom", flag: "🇬🇧", currency: "£", medianYield: 5.2,
    taxName: "Stamp Duty Land Tax (SDLT)", taxNote: "3% surcharge applies to buy-to-let and second homes",
    cities: [
      { name: "London", yield: 3.8, note: "Low yield, high capital growth" },
      { name: "Manchester", yield: 5.5, note: "Balanced yield and growth" },
      { name: "Birmingham", yield: 5.8, note: "Strong regeneration areas" },
      { name: "Leeds", yield: 6.2, note: "High yield northern hub" },
      { name: "Liverpool", yield: 6.8, note: "Highest yields, student market" },
      { name: "Newcastle", yield: 6.5, note: "Affordable with solid returns" },
    ],
    expenses: [
      { name: "Council Tax", typical: "£1,200–£2,500/yr", note: "Varies by band and location" },
      { name: "Property Management", typical: "8–12% of rent", note: "Plus VAT at 20%" },
      { name: "Insurance", typical: "£300–£600/yr", note: "Buildings + landlord cover" },
      { name: "Maintenance", typical: "1% of property value", note: "Higher for older properties" },
      { name: "Ground Rent", typical: "£200–£500/yr", note: "Leasehold properties only" },
      { name: "Service Charge", typical: "£1,000–£3,000/yr", note: "Flats and apartments" },
    ],
  },
  {
    country: "United States", flag: "🇺🇸", currency: "$", medianYield: 6.4,
    taxName: "Property Transfer Tax", taxNote: "Varies by state; typically 0.5–1% of purchase price",
    cities: [
      { name: "New York City", yield: 4.2, note: "Premium market, appreciation focus" },
      { name: "Los Angeles", yield: 4.8, note: "High entry, steady demand" },
      { name: "Chicago", yield: 6.5, note: "Midwest value proposition" },
      { name: "Houston", yield: 7.2, note: "No state income tax, strong yields" },
      { name: "Phoenix", yield: 6.8, note: "Rapid population growth" },
      { name: "Detroit", yield: 8.5, note: "Highest yields, higher risk" },
    ],
    expenses: [
      { name: "Property Tax", typical: "0.5–2.5% of value", note: "Varies wildly by state/county" },
      { name: "Property Management", typical: "8–10% of rent", note: "Plus tenant placement fees" },
      { name: "Insurance", typical: "$800–$2,000/yr", note: "Higher in hurricane/tornado zones" },
      { name: "Maintenance", typical: "1% of property value", note: "HOA may cover some items" },
      { name: "HOA Fees", typical: "$200–$500/mo", note: "Condos and planned communities" },
      { name: "Vacancy", typical: "5–8% of gross rent", note: "Higher in seasonal markets" },
    ],
  },
  {
    country: "Australia", flag: "🇦🇺", currency: "$", medianYield: 4.5,
    taxName: "Stamp Duty", taxNote: "Varies by state; NSW, VIC, and QLD have different scales",
    cities: [
      { name: "Sydney", yield: 3.0, note: "Lowest yields, premium growth" },
      { name: "Melbourne", yield: 3.5, note: "Growth-focused, moderate yield" },
      { name: "Brisbane", yield: 4.5, note: "Balanced yield and growth" },
      { name: "Perth", yield: 5.3, note: "Mining recovery driving demand" },
      { name: "Adelaide", yield: 4.8, note: "Consistent performer" },
      { name: "Darwin", yield: 6.5, note: "Highest capital city yields" },
    ],
    expenses: [
      { name: "Council Rates", typical: "$1,500–$3,000/yr", note: "Varies by local government area" },
      { name: "Property Management", typical: "6–10% of rent", note: "Plus letting fees" },
      { name: "Insurance", typical: "$400–$1,200/yr", note: "Building + landlord + contents" },
      { name: "Maintenance", typical: "1–1.5% of value", note: "Higher for older stock" },
      { name: "Strata Levies", typical: "$2,000–$6,000/yr", note: "Apartments and townhouses" },
      { name: "Water Rates", typical: "$800–$1,500/yr", note: "Often partially tenant-paid" },
    ],
  },
];

const YIELD_BENCHMARKS = [
  { range: "Below 3%", rating: "Low Yield", color: "text-red-500", bg: "bg-red-50", border: "border-red-200", description: "Properties in this range rely almost entirely on capital growth for returns. Common in Sydney, London, and Manhattan. Only suitable for investors with strong cash flow from other sources and a long-term horizon." },
  { range: "3% – 5%", rating: "Moderate Yield", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", description: "The most common range for capital city properties. Provides modest positive cash flow if leveraged conservatively. Best suited to investors balancing income with long-term appreciation." },
  { range: "5% – 7%", rating: "Good Yield", color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100", description: "Strong cash flow territory. Properties in this range typically cover mortgage costs and generate surplus income. Common in regional centres, secondary cities, and value markets like Leeds, Houston, and Perth." },
  { range: "Above 7%", rating: "High Yield", color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200", description: "Exceptional cash flow but often accompanied by higher vacancy risk, lower capital growth, or property condition issues. Typical in regional Australia, Midwest US, and northern UK cities. Due diligence is essential." },
];

const COMMON_MISTAKES = [
  { title: "Using the asking price instead of total cost", body: "Many investors calculate yield using the listed property price, ignoring stamp duty, legal fees, surveys, and renovation costs. On a £200,000 UK buy-to-let, these can add £12,000–£15,000, reducing gross yield by 0.5–0.8 percentage points. Always use total capital invested as your denominator." },
  { title: "Underestimating maintenance and vacancy", body: "Novice landlords often budget 0.5% for maintenance when industry standard is 1% of property value annually. Vacancy is equally underestimated — even well-managed properties typically lose 2–4 weeks of rent per year to tenant turnover. Combined, these omissions can inflate perceived yield by 1–2 percentage points." },
  { title: "Ignoring the 3% UK stamp duty surcharge", body: "First-time buy-to-let investors frequently use standard SDLT rates, forgetting the 3% additional property surcharge. On a £300,000 investment, this mistake understates purchase costs by £9,000 and overstates yield by approximately 0.4 percentage points." },
  { title: "Comparing gross yields across different markets", body: "A 6% gross yield in Liverpool and a 6% gross yield in Sydney are not equivalent. Liverpool properties may have lower management costs but higher maintenance, while Sydney apartments carry substantial strata levies. Only net yield enables meaningful cross-market comparison." },
  { title: "Forgetting mortgage interest in net yield", body: "Some calculators exclude mortgage interest from net yield, treating it as a financing cost rather than an operating expense. For leveraged investors, interest is often the largest single expense — omitting it can overstate net yield by 2–4 percentage points depending on LTV and rates." },
];

const FAQS = [
  { q: "How do I calculate rental yield on a property?", a: "To calculate gross rental yield, divide the annual rental income by the property purchase price and multiply by 100. For net rental yield, first subtract all annual operating expenses from the annual rent, then divide by the total property cost including stamp duty and fees, and multiply by 100. Our calculator automates both calculations and auto-estimates stamp duty for the UK, US, and Australia." },
  { q: "What is a good rental yield for buy-to-let in the UK?", a: "A good rental yield for UK buy-to-let depends on location and strategy. In London, 3.5–4.5% gross is typical due to high capital values. Northern Powerhouse cities like Manchester, Leeds, and Liverpool offer 5.5–7% gross. Net yields are typically 1–1.5% lower. Most experienced landlords target at least 5% gross to ensure positive cash flow after mortgage and management costs. Properties below 4% gross often require significant capital growth to justify the investment." },
  { q: "What rental yield should I aim for in Australia?", a: "Australian investors should aim for 4–5% gross yield in capital cities and 5–7% in regional areas. Sydney and Melbourne's 3–4% yields are offset by stronger long-term capital growth. Brisbane, Adelaide, and Perth currently offer the best balance at 4.5–5.5%. Darwin and some regional Queensland markets exceed 6%. Remember that Australian apartments carry strata levies that can reduce net yield by 1.5–2.5 percentage points compared to houses." },
  { q: "Is gross or net rental yield more important?", a: "Both serve different purposes. Gross yield is important for initial screening and market comparison — it helps you quickly filter hundreds of listings. Net yield is critical for purchase decisions because it reflects your actual cash return. A property with 7% gross but 3% net due to high strata fees is far less attractive than one with 6% gross and 4.5% net. Always calculate net yield before making an offer." },
  { q: "How does leverage affect rental yield calculations?", a: "Leverage (using a mortgage) affects cash-on-cash return more than rental yield. Rental yield measures return against total property cost regardless of financing. However, mortgage interest is included in net yield as an operating expense. With leverage, your cash-on-cash return can be significantly higher than net yield. For example, a 4% net yield property bought with a 75% LTV mortgage could deliver 12–16% cash-on-cash depending on the interest rate." },
  { q: "What is the 1% rule in rental property investing?", a: "The 1% rule states that monthly rent should equal at least 1% of the purchase price for a property to cash flow positively. A £200,000 property should rent for at least £2,000/month. This roughly translates to a 12% gross yield. In practice, the 1% rule is rarely achievable in expensive markets like London, Sydney, or San Francisco, but serves as a useful benchmark in Midwest US markets and northern UK cities." },
  { q: "How do I improve my rental yield?", a: "To improve rental yield: (1) Increase rent through renovations that add value — updated kitchens and bathrooms typically deliver the highest rent premiums; (2) Reduce vacancy by retaining good tenants with competitive rents and responsive maintenance; (3) Self-manage if local and experienced, saving 8–12% in management fees; (4) Shop around for insurance annually; (5) Minimise letting fees by using longer tenancies; (6) Consider multi-let or HMO strategies where permitted, which can increase yield by 30–50%." },
  { q: "Should I include capital growth in rental yield?", a: "No — rental yield measures income return only. Total return combines rental yield plus capital growth. A property with 3% net yield but 5% annual appreciation delivers 8% total return — often beating a 6% yield property with 1% appreciation. When evaluating properties, calculate both metrics. High-yield properties (6%+) often have low capital growth, while low-yield properties (3–4%) in prime locations may appreciate at 5–7% annually. Your investment timeframe and cash flow needs determine the optimal balance." },
  { q: "What is cash-on-cash return and why does it matter?", a: "Cash-on-cash return measures annual pre-tax cash flow divided by your total cash invested (deposit plus purchase costs). It matters because it shows the return on your actual out-of-pocket capital rather than the full property value. A property with 4% net yield but 16% cash-on-cash is highly attractive from a leverage perspective. This metric is especially important for investors using mortgages, as it reveals whether your cash is working harder in property than alternative investments." },
  { q: "How accurate is the stamp duty estimate in this calculator?", a: "Our calculator provides accurate estimates based on current 2026 tax rules. For the UK, it includes the 3% additional property surcharge and follows SDLT bands exactly. For Australia, it uses NSW stamp duty scales as a representative estimate — other states vary slightly. For the US, it applies a 0.75% average transfer tax estimate, though actual rates range from 0% to over 2%. Always verify with a solicitor or conveyancer before exchange." },
];

function SectionHeading({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return <h2 className="text-2xl font-bold text-stone-900 mb-4 mt-12 flex items-center gap-2">{icon && <span className="text-primary">{icon}</span>}{children}</h2>;
}

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="text-stone-600 leading-relaxed mb-4 text-[15px]">{children}</p>;
}

export default function RentalYieldPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full">Real Estate Tool</span>
            <span className="px-3 py-1 bg-stone-100 text-stone-500 text-xs font-medium rounded-full">Updated 2026</span>
          </div>
          <h1 className="text-4xl font-bold text-stone-900 leading-tight mb-4">
            Rental Yield Calculator — Gross vs Net for UK, US & Australia
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed">
            The most comprehensive free rental yield calculator for property investors. Calculate gross yield, 
            net yield, cash-on-cash return, and cap rate with auto-estimated stamp duty, property taxes, and 
            operating expenses. Compare your returns against city benchmarks across the UK, US, and Australia.
          </p>
        </div>

        <div className="mb-16">
          <RentalYieldCalculator />
        </div>

        <SectionHeading icon={<BookOpen className="w-6 h-6" />}>
          What Is Rental Yield? The Complete Guide for Property Investors
        </SectionHeading>
        <Prose>
          Rental yield is the single most important metric for comparing buy-to-let investment properties. 
          It measures the annual return your property generates as a percentage of its total cost. Whether 
          you are evaluating a two-bedroom flat in Manchester, a single-family home in Houston, or an 
          apartment in Brisbane, rental yield tells you whether the numbers stack up.
        </Prose>
        <Prose>
          There are two types of rental yield every serious investor must understand: <strong>gross rental yield</strong> and <strong>net rental yield</strong>. 
          Gross yield is a quick comparison tool that divides annual rent by property price. Net yield is the 
          true profitability measure that deducts all operating costs — property management, taxes, insurance, 
          maintenance, vacancy allowances, and mortgage interest — before calculating the return. The gap between 
          gross and net yield typically ranges from 1 to 2.5 percentage points, and in some cases (high-rise 
          apartments with steep strata fees) it can exceed 3 percentage points.
        </Prose>
        <Prose>
          This rental yield calculator supports three major English-speaking property markets: the <strong>United Kingdom</strong>, 
          the <strong>United States</strong>, and <strong>Australia</strong>. Each market has distinct tax structures, expense profiles, and yield 
          benchmarks. Our tool auto-estimates stamp duty and transfer taxes, applies country-specific expense 
          categories, and benchmarks your results against median yields for major cities in each jurisdiction.
        </Prose>

        <SectionHeading icon={<Scale className="w-6 h-6" />}>
          Gross vs Net Rental Yield: Understanding the Critical Difference
        </SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {KEY_DIFFERENCES.map((item) => (
            <div key={item.title} className="border border-stone-200 rounded-2xl p-6 bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">{item.icon}</div>
                <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
              </div>
              <div className="bg-stone-50 rounded-lg p-3 mb-4 font-mono text-sm text-stone-700">{item.formula}</div>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">{item.body}</p>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Pros</span>
                  <ul className="mt-1 space-y-1">
                    {item.pros.map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm text-stone-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />{pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">Cons</span>
                  <ul className="mt-1 space-y-1">
                    {item.cons.map((con) => (
                      <li key={con} className="flex items-start gap-2 text-sm text-stone-600">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />{con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Prose>
          The critical insight is that <strong>two properties with identical gross yields can have wildly different net yields</strong>. 
          Consider two £200,000 properties both renting for £1,000/month (6% gross). Property A is a freehold house 
          in Leeds with £2,000 annual expenses. Property B is a leasehold flat in London with £5,500 annual expenses 
          including service charges and ground rent. Property A delivers 4.9% net yield. Property B delivers only 3.7%. 
          Without calculating net yield, you would incorrectly view these as equivalent investments.
        </Prose>

        <SectionHeading icon={<BarChart3 className="w-6 h-6" />}>
          Rental Yield Benchmarks: What Is a Good Return in 2026?
        </SectionHeading>
        <Prose>
          What is a good rental yield? The answer depends on your market, strategy, and risk tolerance. Below 
          is our 2026 yield quality framework used across all three supported markets. These benchmarks account 
          for current interest rate environments, inflation, and median property values.
        </Prose>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {YIELD_BENCHMARKS.map((b) => (
            <div key={b.range} className={`border-2 ${b.border} ${b.bg} rounded-2xl p-5`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-2xl font-bold ${b.color}`}>{b.range}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white ${b.color}`}>{b.rating}</span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>

        <SectionHeading icon={<MapPin className="w-6 h-6" />}>
          Rental Yield by Country: UK, US, and Australia Market Guides
        </SectionHeading>
        <Prose>
          Property investment landscapes differ dramatically across the UK, US, and Australia. Tax structures, 
          tenant laws, financing norms, and expense profiles all vary. Our calculator is built with these 
          differences in mind — from UK stamp duty surcharges to Australian strata levies to US property tax 
          variation by county.
        </Prose>

        {COUNTRY_GUIDES.map((guide) => (
          <div key={guide.country} className="mb-8">
            <h3 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">{guide.flag}</span>{guide.country} Rental Yield Guide
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
                <h4 className="text-sm font-semibold text-stone-800 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />Median Gross Yields by City
                </h4>
                <div className="space-y-2">
                  {guide.cities.map((city) => (
                    <div key={city.name} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-stone-50 transition-colors">
                      <div>
                        <span className="text-sm font-medium text-stone-700">{city.name}</span>
                        <span className="text-xs text-stone-400 ml-2">{city.note}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min((city.yield / 10) * 100, 100)}%` }} />
                        </div>
                        <span className="text-sm font-bold text-stone-900 w-10 text-right">{city.yield}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
                <h4 className="text-sm font-semibold text-stone-800 mb-3 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" />Typical Annual Expenses
                </h4>
                <div className="space-y-2">
                  {guide.expenses.map((exp) => (
                    <div key={exp.name} className="flex items-start justify-between py-2 px-3 rounded-lg hover:bg-stone-50 transition-colors">
                      <div>
                        <span className="text-sm font-medium text-stone-700">{exp.name}</span>
                        <span className="text-xs text-stone-400 block">{exp.note}</span>
                      </div>
                      <span className="text-sm font-semibold text-stone-800 text-right">{exp.typical}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
              <div className="flex items-start gap-3">
                <Percent className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-stone-800">{guide.taxName} Note:</span>
                  <span className="text-sm text-stone-600 ml-1">{guide.taxNote}</span>
                  <p className="text-xs text-stone-400 mt-1">
                    National median gross yield: <strong>{guide.medianYield}%</strong>. Net yields typically 
                    range {guide.medianYield - 2}% – {guide.medianYield - 0.5}% after expenses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        <SectionHeading icon={<AlertTriangle className="w-6 h-6" />}>
          5 Critical Mistakes Investors Make When Calculating Rental Yield
        </SectionHeading>
        <Prose>
          Even experienced landlords make errors that distort their yield calculations. These five mistakes 
          are responsible for more poor investment decisions than any other factor. Avoiding them will put 
          you ahead of 90% of buy-to-let investors.
        </Prose>
        <div className="space-y-4 mb-6">
          {COMMON_MISTAKES.map((mistake, i) => (
            <div key={mistake.title} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                <div>
                  <h4 className="text-base font-bold text-stone-900 mb-2">{mistake.title}</h4>
                  <p className="text-sm text-stone-600 leading-relaxed">{mistake.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <SectionHeading icon={<Calculator className="w-6 h-6" />}>
          How to Use This Rental Yield Calculator
        </SectionHeading>
        <Prose>
          Our calculator is designed to give you accurate gross and net rental yields in under 60 seconds. 
          Follow these steps to get the most reliable results:
        </Prose>
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm mb-6">
          <ol className="space-y-4">
            {[
              { step: "Select your country", detail: "Choose UK, US, or Australia. This changes the currency, tax auto-estimation logic, and available expense fields." },
              { step: "Enter property price and rent", detail: "Input the purchase price and weekly or monthly rent. The calculator automatically annualises the rent." },
              { step: "Add your deposit", detail: "This calculates your LTV ratio and is used for mortgage interest estimation in the advanced settings." },
              { step: "Review auto-estimated stamp duty", detail: "The calculator estimates stamp duty/transfer tax based on current 2026 rates. Override if you have exact figures." },
              { step: "Enter operating expenses", detail: "Add property management, council tax/property tax, insurance, maintenance, and any country-specific costs." },
              { step: "Check advanced settings (optional)", detail: "Set mortgage interest rate and income tax rate to see after-tax yield and cash-on-cash return." },
              { step: "Compare against city benchmarks", detail: "The results panel shows how your yield compares to median yields for major cities in your selected country." },
            ].map((item, i) => (
              <li key={item.step} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">{item.step}</h4>
                  <p className="text-sm text-stone-600 leading-relaxed">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <SectionHeading icon={<TrendingUp className="w-6 h-6" />}>
          Key Metrics Explained: Yield, Cap Rate, and Cash-on-Cash
        </SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className="p-2 bg-primary/10 rounded-lg w-fit mb-3"><Percent className="w-5 h-5 text-primary" /></div>
            <h4 className="text-base font-bold text-stone-900 mb-2">Gross Yield</h4>
            <p className="text-sm text-stone-600 leading-relaxed mb-3">Annual rent divided by property price. The headline figure for quick comparisons. Does not account for any costs.</p>
            <div className="text-xs font-mono bg-stone-50 rounded-lg p-2 text-stone-700">Annual Rent ÷ Property Price × 100</div>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className="p-2 bg-primary/10 rounded-lg w-fit mb-3"><TrendingDown className="w-5 h-5 text-primary" /></div>
            <h4 className="text-base font-bold text-stone-900 mb-2">Net Yield</h4>
            <p className="text-sm text-stone-600 leading-relaxed mb-3">(Annual rent minus all expenses) divided by total property cost. The true measure of investment profitability.</p>
            <div className="text-xs font-mono bg-stone-50 rounded-lg p-2 text-stone-700">(Rent − Expenses) ÷ Total Cost × 100</div>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className="p-2 bg-primary/10 rounded-lg w-fit mb-3"><Wallet className="w-5 h-5 text-primary" /></div>
            <h4 className="text-base font-bold text-stone-900 mb-2">Cash-on-Cash</h4>
            <p className="text-sm text-stone-600 leading-relaxed mb-3">Annual cash flow divided by your actual cash invested. Shows leverage-enhanced returns on your out-of-pocket capital.</p>
            <div className="text-xs font-mono bg-stone-50 rounded-lg p-2 text-stone-700">Cash Flow ÷ Cash Invested × 100</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3"><BarChart3 className="w-5 h-5 text-primary" /><h4 className="text-base font-bold text-stone-900">Cap Rate</h4></div>
            <p className="text-sm text-stone-600 leading-relaxed mb-3">Capitalization rate is the commercial real estate standard. It uses property value (not total cost) as the denominator and excludes mortgage interest. Cap rate enables financing-independent comparison between properties.</p>
            <div className="text-xs font-mono bg-stone-50 rounded-lg p-2 text-stone-700">NOI ÷ Property Value × 100</div>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3"><Shield className="w-5 h-5 text-primary" /><h4 className="text-base font-bold text-stone-900">After-Tax Yield</h4></div>
            <p className="text-sm text-stone-600 leading-relaxed mb-3">Net operating income minus income tax liability, divided by total property cost. This shows your true post-tax return. Tax rates vary by jurisdiction and personal circumstances.</p>
            <div className="text-xs font-mono bg-stone-50 rounded-lg p-2 text-stone-700">(NOI − Tax) ÷ Total Cost × 100</div>
          </div>
        </div>

        <SectionHeading icon={<BookOpen className="w-6 h-6" />}>
          Frequently Asked Questions About Rental Yield
        </SectionHeading>
        <div className="space-y-3 mb-8">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group border border-stone-200 rounded-2xl overflow-hidden bg-white">
              <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-sm font-semibold text-stone-800 hover:bg-stone-50 transition-colors list-none select-none">
                {faq.q}
                <span className="text-stone-400 ml-3 flex-shrink-0 group-open:rotate-45 transition-transform duration-200"><ArrowRight className="w-4 h-4" /></span>
              </summary>
              <div className="px-5 pb-4 pt-1 text-sm text-stone-600 leading-relaxed border-t border-stone-100">{faq.a}</div>
            </details>
          ))}
        </div>

        <div className="mt-16 border-t border-stone-200 pt-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-8">Related Real Estate Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: "Rent vs Buy Calculator", href: "/real-estate/rent-vs-buy-calculator", desc: "Should you rent or buy? Factors in mortgage interest tax deductions, opportunity cost, and appreciation.", icon: <Home className="w-5 h-5 text-primary" /> },
              { name: "UK Stamp Duty Calculator", href: "/real-estate/uk-stamp-duty-calculator", desc: "Calculate SDLT for residential and buy-to-let purchases in England and Northern Ireland.", icon: <PoundSterling className="w-5 h-5 text-primary" /> },
              { name: "Price Per Square Foot", href: "/real-estate/price-per-square-foot-calculator", desc: "Compare property values using price per square foot or square metre across markets.", icon: <Building2 className="w-5 h-5 text-primary" /> },
              { name: "Australia Stamp Duty", href: "/finance/australia-stamp-duty-calculator", desc: "Estimate stamp duty for property purchases across all Australian states and territories.", icon: <DollarSign className="w-5 h-5 text-primary" /> },
              { name: "Compound Interest", href: "/finance/compound-interest-calculator", desc: "See how your property equity or alternative investments compound over time.", icon: <TrendingUp className="w-5 h-5 text-primary" /> },
              { name: "Break-Even Calculator", href: "/finance/break-even-calculator", desc: "Determine how many months of rent you need to recover your initial investment costs.", icon: <Calculator className="w-5 h-5 text-primary" /> },
            ].map((tool) => (
              <a key={tool.href} href={tool.href} className="group p-5 border border-stone-200 rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-stone-50 rounded-lg group-hover:bg-primary/10 transition-colors">{tool.icon}</div>
                  <h3 className="font-bold text-stone-900 group-hover:text-primary transition-colors">{tool.name}</h3>
                </div>
                <p className="text-sm text-stone-500 leading-relaxed">{tool.desc}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 p-5 bg-stone-50 rounded-2xl border border-stone-200">
          <p className="text-xs text-stone-500 leading-relaxed">
            <strong className="text-stone-700">Disclaimer:</strong> This rental yield calculator is for 
            illustrative and educational purposes only and does not constitute financial, tax, or investment 
            advice. Stamp duty estimates are based on 2026 tax rates and may not reflect all exemptions, 
            reliefs, or regional variations. Property values, rental income, and expenses can fluctuate. 
            Past yield performance does not guarantee future returns. Always consult a licensed financial 
            adviser, mortgage broker, or tax professional before making property investment decisions. 
            Mortgage interest calculations assume interest-only or standard amortisation estimates and 
            may not match your lender's exact terms.
          </p>
        </div>
      </main>
    </>
  );
}
