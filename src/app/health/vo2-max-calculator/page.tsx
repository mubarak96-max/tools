import { Metadata } from "next";
import { Vo2MaxCalculator } from "./components/Vo2MaxCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";

export const metadata: Metadata = {
  title: "VO2 Max Estimator | Free Health & Fitness Tools",
  description: "Estimate your maximum oxygen consumption using various fitness tests.",
};

export default function Page() {
  return (
    <HealthToolPage
      title="VO2 Max Estimator"
      description="Estimate your maximum oxygen consumption using various fitness tests."
      category="Health"
      path="/health/vo2-max-calculator"
      infoSection={
        <div className="prose prose-invert">
          <h3>About this calculator</h3>
          <p>Detailed info coming soon.</p>
        </div>
      }
    >
      <Vo2MaxCalculator />
    </HealthToolPage>
  );
}
