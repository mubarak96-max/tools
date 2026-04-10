import { Metadata } from "next";
import { BodyFatCalculator } from "./components/BodyFatCalculator";

export const metadata: Metadata = {
  title: "Body Fat Percentage Estimator | Free Health Tools",
  description: "Estimate your body fat percentage using US Navy circumference method.",
};

export default function Page() {
  return <BodyFatCalculator />;
}
