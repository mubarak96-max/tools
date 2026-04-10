import { Metadata } from "next";
import { BmrCalculator } from "./components/BmrCalculator";

export const metadata: Metadata = {
  title: "BMR Calculator | Free Health Tools",
  description: "Calculate your Basal Metabolic Rate using the Mifflin-St Jeor Equation.",
};

export default function Page() {
  return <BmrCalculator />;
}
