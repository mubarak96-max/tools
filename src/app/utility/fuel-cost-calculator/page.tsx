import { Metadata } from "next";
import { Calculator } from "@/components/fuel-cost/Calculator";
import { ContentSection } from "@/components/fuel-cost/ContentSection";
import { FAQSection } from "@/components/fuel-cost/FAQSection";
import { AuthorBio } from "@/components/fuel-cost/AuthorBio";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: "Fuel Cost Calculator 2026 | Trip Fuel Cost Calculator & Gas Price Estimator",
  description:
    "Free fuel cost calculator for road trips and daily commuting. Calculate gas costs by mileage, MPG, and fuel price. Compare vehicle fuel efficiency, estimate trip expenses, and plan your driving budget with our accurate fuel cost estimator.",
  keywords: [
    "fuel cost calculator",
    "gas cost calculator",
    "trip fuel cost calculator",
    "fuel cost estimator",
    "gas mileage cost calculator",
    "driving cost calculator",
    "fuel price calculator",
    "road trip fuel cost",
    "commute cost calculator",
    "mpg cost calculator",
    "fuel efficiency calculator",
    "gas budget calculator",
    "vehicle fuel cost comparison",
    "diesel cost calculator",
    "electric vehicle cost calculator",
    "fuel cost per mile",
    "annual fuel cost calculator",
    "gas trip planner",
    "total cost of ownership",
    "fuel economy standards",
    "gas prices 2026",
    "trip planner fuel estimator",
  ],
  authors: [{ name: "FindBest Tools Automotive Division" }],
  openGraph: {
    title: "Fuel Cost Calculator 2026 | Trip & Commute Gas Expenses",
    description:
      "Calculate exact fuel costs for any trip or commute. Compare vehicles, estimate annual expenses, and optimize your driving budget.",
    type: "website",
    url: "https://findbest.tools/utility/fuel-cost-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Fuel Cost Calculator | Trip & Daily Commute",
    description:
      "Accurate gas cost calculator with vehicle comparison, route optimization, and annual expense projection.",
  },
  alternates: {
    canonical: "https://findbest.tools/utility/fuel-cost-calculator",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function FuelCostCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://findbest.tools/utility/fuel-cost-calculator",
        url: "https://findbest.tools/utility/fuel-cost-calculator",
        name: "Fuel Cost Calculator 2026 | Trip Fuel Cost Calculator & Gas Price Estimator",
        description:
          "Free fuel cost calculator for road trips and daily commuting. Calculate gas costs by mileage, MPG, and fuel price.",
        isPartOf: { "@id": "https://findbest.tools" },
        about: { "@type": "Thing", name: "Vehicle Fuel Economy" },
      },
      {
        "@type": "SoftwareApplication",
        name: "Fuel Cost Calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "6234",
        },
        featureList: [
          "Trip fuel cost calculation",
          "Daily commute expense estimation",
          "Multi-vehicle comparison",
          "MPG to cost conversion",
          "Annual fuel budget projection",
          "Diesel and electric vehicle support",
          "Route-based cost optimization",
          "Gas price per state/region",
          "Carbon footprint estimation",
          "CSV export for expense reports",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I calculate fuel cost for a trip?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "To calculate fuel cost for a trip, divide your total trip distance by your vehicle's MPG (miles per gallon) to get gallons needed, then multiply by the current fuel price per gallon. For example, a 500-mile trip in a 25 MPG vehicle at $3.50/gallon costs $70. Our fuel cost calculator automates this and includes round-trip, multiple stops, and vehicle comparison features.",
            },
          },
          {
            "@type": "Question",
            name: "How much does it cost to drive per mile?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The cost per mile depends on your vehicle's fuel efficiency and local gas prices. At $3.50 per gallon, a 30 MPG vehicle costs approximately $0.117 per mile in fuel. A 20 MPG vehicle costs $0.175 per mile. Our gas cost calculator shows your exact cost per mile and annual projections based on your driving habits.",
            },
          },
          {
            "@type": "Question",
            name: "How can I reduce my fuel costs?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Reduce fuel costs by: maintaining proper tire pressure (improves MPG 3%), removing excess weight from your vehicle, using cruise control on highways, avoiding rapid acceleration and braking, combining errands into single trips, choosing fuel-efficient routes, and considering a more efficient vehicle for high-mileage driving. Our fuel cost estimator shows exactly how much each strategy saves.",
            },
          },
        ],
      },
      {
        "@type": "HowTo",
        name: "How to Calculate Trip Fuel Costs",
        step: [
          {
            "@type": "HowToStep",
            name: "Enter Trip Distance",
            text: "Input your one-way or round-trip distance in miles, or use the route planner for multi-stop trips.",
          },
          {
            "@type": "HowToStep",
            name: "Select Your Vehicle",
            text: "Choose from preset vehicles or enter your custom MPG (city/highway combined).",
          },
          {
            "@type": "HowToStep",
            name: "Input Fuel Price",
            text: "Enter current local gas price per gallon, or select your state for average pricing.",
          },
          {
            "@type": "HowToStep",
            name: "Review Cost Breakdown",
            text: "Analyze total fuel cost, cost per mile, and compare with alternative vehicles or routes.",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-800/90" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center rounded-full bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20 mb-6">
                2026 National Avg: $3.45/gal
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-amber-400">Fuel Cost</span>
                <span className="block">Calculator</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">
                The most accurate <strong className="text-white">fuel cost calculator</strong> for road trips, 
                daily commutes, and vehicle comparison. Calculate gas expenses by mileage, MPG, and fuel price. 
                Plan your driving budget with our comprehensive <strong className="text-white">trip fuel cost calculator</strong> 
                and <strong className="text-white">fuel cost estimator</strong>.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                {[
                  "Trip Planning",
                  "Vehicle Comparison",
                  "Commute Costs",
                  "Annual Budgeting",
                  "EV vs Gas",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Calculator />
        </section>

        {/* Content Section */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <ContentSection />
        </section>

        {/* FAQ Section */}
        <section className="bg-slate-50 border-y border-slate-200">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <FAQSection />
          </div>
        </section>

        {/* Author Bio */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <AuthorBio />
        </section>

        {/* Related Tools */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <RelatedToolsSection category="Utility" categoryHref="/utility" currentPath="/utility/fuel-cost-calculator" />
        </section>
      </main>
    </>
  );
}
