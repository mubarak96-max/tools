import { Metadata } from "next";
import { WaistToHipCalculator } from "./components/WaistToHipCalculator";

export const metadata: Metadata = {
  title: "Waist-to-Hip Ratio Calculator | Free Health Tools",
  description: "Assess your health risk factor based on your waist and hip measurements.",
};

export default function Page() {
  return <WaistToHipCalculator />;
}
