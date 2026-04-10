import { Metadata } from "next";
import { RoofingMaterialCalculator } from "./components/RoofingMaterialCalculator";

export const metadata: Metadata = {
  title: "Roofing Material Calculator | Free Construction Tools",
  description: "Calculate squares of shingles and bundles needed for your roof based on base area and pitch.",
};

export default function Page() {
  return <RoofingMaterialCalculator />;
}
