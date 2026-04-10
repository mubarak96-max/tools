import type { Metadata } from "next";
import { OvulationCalculator } from "./components/OvulationCalculator";
import { HealthToolPage } from "../components/HealthToolPage";

export const metadata: Metadata = {
  title: "Ovulation & Fertility Calculator | Free Health Tools",
  description: "Find your most fertile days and estimated ovulation date based on your cycle.",
};

const PAGE_PATH = "/health/ovulation-calculator";

export default function Page() {
  return (
    <HealthToolPage
      title="Ovulation & Fertility Calculator"
      description="Estimate your most fertile days and ovulation window to help with family planning."
      category="Health"
      path={PAGE_PATH}
      infoSection={
        <>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Understanding your fertile window</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The <strong>fertility window</strong> refers to the days during your menstrual cycle when pregnancy is possible. It typically includes the day of ovulation and the five days leading up to it. Sperm can live inside the female body for up to 5 days, which is why the window is longer than the life of the egg itself (which lasts only 12-24 hours).
          </p>
          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to track ovulation</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            While calculators provide a great estimate, you can also look for these physical signs:
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Cervical Mucus:</strong> Becomes clear, thin, and slippery (like raw egg whites).</li>
            <li><strong className="text-foreground">Basal Body Temperature:</strong> A slight rise in temperature after ovulation.</li>
            <li><strong className="text-foreground">Ovulation Kits (OPKs):</strong> Tests that detect a surge in Luteinizing Hormone (LH).</li>
          </ul>
        </>
      }
    >
      <OvulationCalculator />
    </HealthToolPage>
  );
}
