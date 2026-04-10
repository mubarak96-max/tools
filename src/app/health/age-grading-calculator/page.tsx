import { Metadata } from "next";
import { AgeGradingCalculator } from "./components/AgeGradingCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";

export const metadata: Metadata = {
  title: "Race Age Grading Calculator | Free Health & Fitness Tools",
  description: "Compare your race times across different ages and genders.",
};

export default function Page() {
  return (
    <HealthToolPage
      title="Race Age Grading Calculator"
      description="Compare your race times across different ages and genders."
      category="Health"
      path="/health/age-grading-calculator"
      infoSection={
        <div className="prose prose-invert">
          <h3>About this calculator</h3>
          <p>Detailed info coming soon.</p>
        </div>
      }
    >
      <AgeGradingCalculator />
    </HealthToolPage>
  );
}
