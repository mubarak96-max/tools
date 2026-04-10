import type { Metadata } from "next";
import { SleepCalculator } from "./components/SleepCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";

export const metadata: Metadata = {
  title: "Sleep Cycle Calculator | Wake Up Refreshed",
  description: "Calculate the best time to wake up based on 90-minute sleep cycles to avoid grogginess.",
};

const PAGE_PATH = "/health/sleep-calculator";

export default function Page() {
  return (
    <HealthToolPage
      title="Sleep Cycle Calculator"
      description="Find the perfect time to wake up or go to bed by aligning with your body's natural 90-minute sleep cycles."
      category="Health"
      path={PAGE_PATH}
      infoSection={
        <>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">The science of 90-minute sleep cycles</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A typical human sleep cycle lasts approximately <strong>90 minutes</strong>. During this time, the brain moves through different stages: light sleep, deep sleep, and REM (Rapid Eye Movement) sleep. 
          </p>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            If you wake up in the middle of a sleep cycle (especially during deep sleep), you might experience <strong>"sleep inertia,"</strong> which is that feeling of grogginess and disorientation. Waking up at the end of a cycle allows you to feel more alert and refreshed even if you got less total hours of sleep!
          </p>
          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Good sleep hygiene tips</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Consistency:</strong> Try to go to bed and wake up at the same time every day.</li>
            <li><strong className="text-foreground">Downtime:</strong> Avoid blue light (phones/laptops) at least 30 minutes before sleep.</li>
            <li><strong className="text-foreground">Environment:</strong> Keep your bedroom cool, dark, and quiet.</li>
          </ul>
        </>
      }
    >
      <SleepCalculator />
    </HealthToolPage>
  );
}
