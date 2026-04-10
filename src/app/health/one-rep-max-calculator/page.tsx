import type { Metadata } from "next";
import { OneRepMaxCalculator } from "./components/OneRepMaxCalculator";
import { HealthToolPage } from "../../components/HealthToolPage";

export const metadata: Metadata = {
  title: "One Rep Max Calculator | Free Fitness Tools",
  description: "Estimate your one-rep max (1RM) and see percentage breakdowns for your training cycles.",
};

const PAGE_PATH = "/health/one-rep-max-calculator";

export default function Page() {
  return (
    <HealthToolPage
      title="One Rep Max Calculator"
      description="Estimate your one-rep max (1RM) for any lift based on weight and reps. Essential for powerlifting, bodybuilding, and strength training."
      category="Health"
      path={PAGE_PATH}
      infoSection={
        <>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How 1RM is calculated</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A <strong>One Rep Max (1RM)</strong> is the maximum amount of weight you can lift for a single repetition of a given exercise. Since testing your absolute maximum can be dangerous and taxing, we use predictive formulas.
          </p>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Our calculator uses the <strong>Brzycki Formula</strong>, developed by Matt Brzycki:
            <br />
            <code>Weight / (1.0278 - (0.0278 * Reps))</code>
          </p>
          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Using training percentages</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Most strength programs (like 5/3/1 or Starting Strength) rely on percentages of your 1RM rather than the max itself.
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">90-100%:</strong> Absolute strength and power development.</li>
            <li><strong className="text-foreground">75-85%:</strong> Ideal for hypertrophy (muscle building) and strength.</li>
            <li><strong className="text-foreground">60-70%:</strong> Muscular endurance and technique work.</li>
          </ul>
        </>
      }
    >
      <OneRepMaxCalculator />
    </HealthToolPage>
  );
}
