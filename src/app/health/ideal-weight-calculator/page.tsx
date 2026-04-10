import { Metadata } from "next";
import { IdealWeightCalculator } from "./components/IdealWeightCalculator";

export const metadata: Metadata = {
  title: "Ideal Body Weight Calculator | Free Health Tools",
  description: "Find your target weight range using the Devine, Robinson, Miller, and Hamwi formulas.",
};

export default function Page() {
  return <IdealWeightCalculator />;
}
