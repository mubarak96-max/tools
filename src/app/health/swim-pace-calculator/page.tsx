import { Metadata } from "next";
import { SwimPaceCalculator } from "./components/SwimPaceCalculator";
import { HealthToolPage } from "../../components/HealthToolPage";

export const metadata: Metadata = {
  title: "Swim Pace Calculator | Free Health & Fitness Tools",
  description: "Determine your swimming pace per 100m or 100 yards.",
};

export default function Page() {
  return (
    <HealthToolPage
      title="Swim Pace Calculator"
      description="Determine your swimming pace per 100m or 100 yards."
      category="Health"
      path="/health/swim-pace-calculator"
      infoSection={
        <div className="prose prose-invert">
          <h3>About this calculator</h3>
          <p>Detailed info coming soon.</p>
        </div>
      }
    >
      <SwimPaceCalculator />
    </HealthToolPage>
  );
}
