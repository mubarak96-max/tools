import { Metadata } from "next";
import { GolfHandicapCalculator } from "./components/GolfHandicapCalculator";
import { HealthToolPage } from "../../components/HealthToolPage";

export const metadata: Metadata = {
  title: "Handicap Calculator (Golf) | Free Health & Fitness Tools",
  description: "Estimate your golf handicap index based on your recent scores.",
};

export default function Page() {
  return (
    <HealthToolPage
      title="Handicap Calculator (Golf)"
      description="Estimate your golf handicap index based on your recent scores."
      category="Health"
      path="/health/golf-handicap-calculator"
      infoSection={
        <div className="prose prose-invert">
          <h3>About this calculator</h3>
          <p>Detailed info coming soon.</p>
        </div>
      }
    >
      <GolfHandicapCalculator />
    </HealthToolPage>
  );
}
