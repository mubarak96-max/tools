import { Metadata } from "next";
import { StaircaseCalculator } from "./components/StaircaseCalculator";

export const metadata: Metadata = {
  title: "Staircase Rise and Run Calculator | Free Construction Tools",
  description: "Calculate stringer length, number of steps, rise, and run for building a continuous staircase.",
};

export default function Page() {
  return <StaircaseCalculator />;
}
