import { Metadata } from "next";
import { PregnancyDueDateCalculator } from "./components/PregnancyDueDateCalculator";

export const metadata: Metadata = {
  title: "Pregnancy Due Date Calculator | Free Health Tools",
  description: "Estimate your baby due date based on your last menstrual period or conception date.",
};

export default function Page() {
  return <PregnancyDueDateCalculator />;
}
