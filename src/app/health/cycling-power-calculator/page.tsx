import { Metadata } from "next";
import { CyclingPowerCalculator } from "./components/CyclingPowerCalculator";
import { HealthToolPage } from "../../components/HealthToolPage";

export const metadata: Metadata = {
  title: "Cycling Power to Weight Ratio | Free Health & Fitness Tools",
  description: "Calculate your Watts per Kilogram (W/kg) to measure cycling performance.",
};

export default function Page() {
  return (
    <HealthToolPage
      title="Cycling Power to Weight Ratio"
      description="Calculate your Watts per Kilogram (W/kg) to measure cycling performance."
      category="Health"
      path="/health/cycling-power-calculator"
      infoSection={
        <div className="prose prose-invert">
          <h3>About this calculator</h3>
          <p>Detailed info coming soon.</p>
        </div>
      }
    >
      <CyclingPowerCalculator />
    </HealthToolPage>
  );
}
