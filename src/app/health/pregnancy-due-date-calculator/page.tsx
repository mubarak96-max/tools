import type { Metadata } from "next";
import { PregnancyDueDateCalculator } from "./components/PregnancyDueDateCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";

export const metadata: Metadata = {
  title: "Pregnancy Due Date Calculator | Free Health Tools",
  description: "Estimate your baby's due date based on your last menstrual period using Naegele's Rule.",
};

const PAGE_PATH = "/health/pregnancy-due-date-calculator";

export default function Page() {
  return (
    <HealthToolPage
      title="Pregnancy Due Date Calculator"
      description="Estimate your baby's due date based on your last menstrual period using Naegele's Rule."
      category="Health"
      path={PAGE_PATH}
      infoSection={
        <>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How is the due date calculated?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Our calculator uses <strong>Naegele's Rule</strong>, which is the standard clinical method for estimating a pregnancy's duration. It assumes a typical pregnancy lasts exactly <strong>280 days (40 weeks)</strong> from the first day of your last menstrual period (LMP).
          </p>
          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common pregnancy terms to know</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">LMP:</strong> Last Menstrual Period. This date is used because most women don't know the exact date of conception.</li>
            <li><strong className="text-foreground">Trimester:</strong> Pregnancy is divided into three 13-week periods.</li>
            <li><strong className="text-foreground">Full Term:</strong> A baby is considered full term if born between 39 weeks 0 days and 40 weeks 6 days.</li>
          </ul>
        </>
      }
    >
      <PregnancyDueDateCalculator />
    </HealthToolPage>
  );
}
