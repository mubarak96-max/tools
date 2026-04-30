import { Metadata } from "next";
import TipCalculatorClient from "./TipCalculatorClient";

export const metadata: Metadata = {
  title: "Tip Calculator — Restaurant Tip Calculator, Tip Percentage & Bill Splitter",
  description:
    "Free tip calculator for restaurants, bars, hotels and more. Calculate tip by percentage, split the bill between any number of people, use our tip converter to flip between amount and percentage, and see tip estimator presets for every service type. No sign-up, works instantly.",
  keywords: [
    "tip calculator",
    "restaurant tip calculator",
    "tip percentage calculator",
    "tip calculator formula",
    "simple tip calculator",
    "free tip calculator",
    "tip converter",
    "easy tip calculator",
    "tip estimator",
    "how much to tip",
    "bill splitter",
    "tip split calculator",
    "tip calculator with split",
    "how to calculate tip",
    "tip calculator for groups",
    "gratuity calculator",
    "tip calculator percentage",
    "how much tip at restaurant",
    "tip calculator delivery",
    "tip amount calculator",
  ].join(", "),
  openGraph: {
    title: "Tip Calculator — Restaurant Tip, Bill Splitter & Tip Percentage Calculator",
    description:
      "Calculate restaurant tips by percentage or amount, split any bill between any number of people, convert tip amounts to percentages, and see what to tip for every service type.",
    url: "https://findbest.tools/finance/tip-calculator",
    siteName: "FindBest Tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tip Calculator | Free Restaurant Tip & Bill Splitter",
    description:
      "Free, easy tip calculator. Enter bill amount, choose tip %, split between people. Includes tip estimator for restaurants, delivery, hotels and more.",
  },
  alternates: {
    canonical: "https://findbest.tools/finance/tip-calculator",
  },
};

export default function TipCalculatorPage() {
  return <TipCalculatorClient />;
}
