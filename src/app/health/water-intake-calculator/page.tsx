import { Metadata } from "next";
import { WaterIntakeCalculator } from "./components/WaterIntakeCalculator";

export const metadata: Metadata = {
  title: "Water Intake Calculator | Free Health Tools",
  description: "Calculate how much water you should drink daily based on weight and exercise.",
};

export default function Page() {
  return <WaterIntakeCalculator />;
}
