import { Metadata } from "next";
import { MacroCalculator } from "./components/MacroCalculator";

export const metadata: Metadata = {
  title: "Macro Calculator | Free Health Tools",
  description: "Break down your calories into Protein, Carbs, and Fats based on your goals.",
};

export default function Page() {
  return <MacroCalculator />;
}
