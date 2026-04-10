import { Metadata } from "next";
import { CalorieCalculator } from "./components/CalorieCalculator";

export const metadata: Metadata = {
  title: "Calorie Calculator (TDEE) | Free Health Tools",
  description: "Estimate your Total Daily Energy Expenditure based on your activity level.",
};

export default function Page() {
  return <CalorieCalculator />;
}
