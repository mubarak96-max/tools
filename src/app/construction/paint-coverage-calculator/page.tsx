import { Metadata } from "next";
import { PaintCoverageCalculator } from "./components/PaintCoverageCalculator";

export const metadata: Metadata = {
  title: "Paint Coverage Calculator | Free Construction Tools",
  description: "Calculate the number of paint gallons needed to cover walls and ceilings based on dimensions and coats.",
};

export default function Page() {
  return <PaintCoverageCalculator />;
}
