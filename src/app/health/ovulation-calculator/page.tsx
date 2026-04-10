import { Metadata } from "next";
import { OvulationCalculator } from "./components/OvulationCalculator";

export const metadata: Metadata = {
  title: "Ovulation / Fertility Window Calculator | Free Health Tools",
  description: "Find your most fertile days and estimated ovulation date based on your cycle.",
};

export default function Page() {
  return <OvulationCalculator />;
}
