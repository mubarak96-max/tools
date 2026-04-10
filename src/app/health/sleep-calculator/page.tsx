import { Metadata } from "next";
import { SleepCalculator } from "./components/SleepCalculator";

export const metadata: Metadata = {
  title: "Sleep Calculator | Free Health Tools",
  description: "Calculate the best time to wake up or go to sleep based on 90-minute sleep cycles.",
};

export default function Page() {
  return <SleepCalculator />;
}
