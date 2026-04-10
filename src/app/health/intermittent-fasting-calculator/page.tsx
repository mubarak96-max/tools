import { Metadata } from "next";
import { IntermittentFastingCalculator } from "./components/IntermittentFastingCalculator";

export const metadata: Metadata = {
  title: "Intermittent Fasting Schedule Generator | Free Health Tools",
  description: "Generate a personalized fasting and eating schedule for 16:8, 18:6, or 20:4 methods.",
};

export default function Page() {
  return <IntermittentFastingCalculator />;
}
