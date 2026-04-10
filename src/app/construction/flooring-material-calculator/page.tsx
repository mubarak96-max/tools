import { Metadata } from "next";
import { FlooringMaterialCalculator } from "./components/FlooringMaterialCalculator";

export const metadata: Metadata = {
  title: "Flooring Material Calculator | Free Construction Tools",
  description: "Calculate total square footage and boxes of flooring material needed, accounting for waste.",
};

export default function Page() {
  return <FlooringMaterialCalculator />;
}
