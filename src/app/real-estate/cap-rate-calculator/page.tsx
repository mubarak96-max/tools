import type { Metadata } from "next";
import CapRateCalculator from "@/components/CapRateCalculator";

export const metadata: Metadata = {
  title: "Cap Rate Calculator 2026 — Real Estate Capitalization Rate & NOI",
  description: "Free cap rate calculator for real estate investors. Calculate Net Operating Income (NOI), capitalization rate, and cash-on-cash return. Includes 2026 market benchmarks.",
  keywords: [
    "cap rate calculator",
    "capitalization rate calculator",
    "real estate cap rate",
    "NOI calculator",
    "net operating income calculator",
    "cash on cash return calculator",
    "rental property calculator",
    "commercial real estate calculator",
    "cap rate by property type 2026"
  ],
};

export default function Page() {
  return <CapRateCalculator />;
}
