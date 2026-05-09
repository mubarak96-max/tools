import { Metadata } from "next";
import GasMileageCalculator from "@/components/fuel-cost/GasMileageCalculator";
import { AuthorBio } from "@/components/fuel-cost/AuthorBio";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: "Gas Mileage Calculator | Calculate MPG, Trip Cost & Fuel Savings",
  description:
    "Free gas mileage calculator to calculate MPG, trip fuel costs, and annual gas savings. High-tech HUD diagnostic interface for vehicle efficiency tracking and comparison.",
  keywords: [
    "gas mileage calculator",
    "mpg calculator",
    "calculate mpg",
    "fuel economy calculator",
    "gas consumption calculator",
    "l/100km calculator",
    "trip gas estimator",
    "vehicle efficiency calculator",
    "gas savings calculator",
    "fuel diagnostic tool",
  ],
  authors: [{ name: "Mubarak Mutesasira" }],
  openGraph: {
    title: "Gas Mileage Calculator | MPG & Trip Cost Diagnostic",
    description:
      "Diagnostic HUD for calculating gas mileage, trip costs, and fuel savings. Professional-grade vehicle efficiency tools.",
    type: "website",
    url: "https://findbest.tools/utility/gas-mileage-calculator",
  },
  alternates: {
    canonical: "https://findbest.tools/utility/gas-mileage-calculator",
  },
};

export default function GasMileageCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Gas Mileage Calculator",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "Calculate gas mileage (MPG/L/100km), trip fuel costs, and annual savings with a professional HUD interface.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="bg-slate-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <GasMileageCalculator />

          <div className="mt-20 border-t border-slate-200 pt-20">
            <AuthorBio />
          </div>

          <div className="mt-20 border-t border-slate-200 py-20 pb-32">
            <RelatedToolsSection
              category="Utility"
              categoryHref="/utility"
              currentPath="/utility/gas-mileage-calculator"
            />
          </div>
        </div>
      </main>
    </>
  );
}
