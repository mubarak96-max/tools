import { Metadata } from "next";
import { BloodPressureCalculator } from "./components/BloodPressureCalculator";

export const metadata: Metadata = {
  title: "Blood Pressure Category Checker | Free Health Tools",
  description: "Check your blood pressure category and understand what the numbers mean.",
};

export default function Page() {
  return <BloodPressureCalculator />;
}
