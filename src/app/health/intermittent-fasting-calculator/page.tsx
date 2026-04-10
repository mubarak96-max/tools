import type { Metadata } from "next";
import { IntermittentFastingCalculator } from "./components/IntermittentFastingCalculator";
import { HealthToolPage } from "../components/HealthToolPage";

export const metadata: Metadata = {
  title: "Intermittent Fasting Schedule Generator | Free Health Tools",
  description: "Generate a personalized fasting and eating schedule for 16:8, 18:6, or 20:4 methods.",
};

const PAGE_PATH = "/health/intermittent-fasting-calculator";

export default function Page() {
  return (
    <HealthToolPage
      title="Intermittent Fasting Schedule"
      description="Calculate your eating and fasting windows to optimize your health and energy levels using common fasting protocols."
      category="Health"
      path={PAGE_PATH}
      infoSection={
        <>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is Intermittent Fasting (IF)?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Intermittent Fasting is an eating pattern that cycles between periods of fasting and eating. It doesn't specify <em>which</em> foods you should eat, but rather <em>when</em> you should eat them. Common benefits cited by researchers include improved metabolic health, weight loss support, and increased cellular repair (autophagy).
          </p>
          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Popular Fasting Methods</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">16:8 (The Leangains protocol):</strong> You fast for 16 hours and eat during an 8-hour window. For many, this is as simple as skipping breakfast and not eating anything after dinner.</li>
            <li><strong className="text-foreground">18:6 (Advanced):</strong> A more restrictive window that leaves 6 hours for eating.</li>
            <li><strong className="text-foreground">20:4 (The Warrior Diet):</strong> One large meal at night within a 4-hour window and small snacks in the day.</li>
            <li><strong className="text-foreground">12:12 (Beginner):</strong> A balanced approach of equal fasting and eating time.</li>
          </ul>
        </>
      }
    >
      <IntermittentFastingCalculator />
    </HealthToolPage>
  );
}
