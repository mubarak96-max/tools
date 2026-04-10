import { Metadata } from "next";
import { GravelMulchVolumeCalculator } from "./components/GravelMulchVolumeCalculator";

export const metadata: Metadata = {
  title: "Gravel / Mulch Volume Calculator | Free Construction Tools",
  description: "Calculate the volume and weight of gravel, mulch, or dirt needed for landscaping projects.",
};

export default function Page() {
  return <GravelMulchVolumeCalculator />;
}
