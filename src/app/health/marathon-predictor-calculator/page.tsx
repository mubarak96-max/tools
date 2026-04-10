import { Metadata } from "next";
import { MarathonPredictorCalculator } from "./components/MarathonPredictorCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";

export const metadata: Metadata = {
  title: "Marathon Finish Time Predictor | Free Health & Fitness Tools",
  description: "Predict your marathon finish time based on your current performance.",
};

export default function Page() {
  return (
    <HealthToolPage
      title="Marathon Finish Time Predictor"
      description="Predict your marathon finish time based on your current performance."
      category="Health"
      path="/health/marathon-predictor-calculator"
      infoSection={
        <div className="prose prose-invert">
          <h3>About this calculator</h3>
          <p>Detailed info coming soon.</p>
        </div>
      }
    >
      <MarathonPredictorCalculator />
    </HealthToolPage>
  );
}
