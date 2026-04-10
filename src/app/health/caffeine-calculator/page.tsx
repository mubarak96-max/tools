import { Metadata } from "next";
import { CaffeineCalculator } from "./components/CaffeineCalculator";

export const metadata: Metadata = {
  title: "Coffee Caffeine Intake Tracker | Free Health Tools",
  description: "Track your total caffeine consumption from coffee, tea, and sodas.",
};

export default function Page() {
  return <CaffeineCalculator />;
}
