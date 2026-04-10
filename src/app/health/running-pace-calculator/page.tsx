import { Metadata } from "next";
import { RunningPaceCalculator } from "./components/RunningPaceCalculator";
import { HealthToolPage } from "../../components/HealthToolPage";

export const metadata: Metadata = {
  title: "Running Pace Calculator | Free Health & Fitness Tools",
  description: "Calculate your pace per mile or kilometer for any distance.",
};

export default function Page() {
  return (
    <HealthToolPage
      title="Running Pace Calculator"
      description="Calculate your pace per mile or kilometer for any distance."
      category="Health"
      path="/health/running-pace-calculator"
      infoSection={
        <div className="prose prose-invert">
          <h3>About this calculator</h3>
          <p>Detailed info coming soon.</p>
        </div>
      }
    >
      <RunningPaceCalculator />
    </HealthToolPage>
  );
}
