import { Metadata } from "next";
import { CaloriesBurnedCalculator } from "./components/CaloriesBurnedCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";

export const metadata: Metadata = {
  title: "Calories Burned Calculator | Free Health & Fitness Tools",
  description: "Estimate calories burned during various physical activities and exercises.",
};

export default function Page() {
  return (
    <HealthToolPage
      title="Calories Burned Calculator"
      description="Estimate calories burned during various physical activities and exercises."
      category="Health"
      path="/health/calories-burned-calculator"
      infoSection={
        <div className="prose prose-invert">
          <h3>About this calculator</h3>
          <p>Detailed info coming soon.</p>
        </div>
      }
    >
      <CaloriesBurnedCalculator />
    </HealthToolPage>
  );
}
