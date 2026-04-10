"use client";

import { useMemo, useState } from "react";

import { NoteCard, NumberField, ResultCard, formatMoney, formatNumber } from "@/components/real-estate/shared";
import { calculateDubaiServiceCharge } from "@/lib/tools/real-estate";

const AED_MARKET = { key: "AE", label: "Dubai / UAE", currency: "AED", locale: "en-AE" } as const;

export default function DubaiServiceChargeCalculator() {
  const [titleDeedAreaSqFt, setTitleDeedAreaSqFt] = useState("");
  const [approvedRatePerSqFt, setApprovedRatePerSqFt] = useState("");

  const numericArea = Number(titleDeedAreaSqFt) || 0;
  const numericRate = Number(approvedRatePerSqFt) || 0;

  const result = useMemo(
    () =>
      calculateDubaiServiceCharge({
        titleDeedAreaSqFt: numericArea,
        approvedRatePerSqFt: numericRate,
      }),
    [numericArea, numericRate],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <NumberField
            label="Title deed area (sq ft)"
            value={titleDeedAreaSqFt}
            onChange={setTitleDeedAreaSqFt}
            placeholder="Enter title deed area"
            helper="Use the title deed area figure applied in the approved service-charge schedule."
          />
          <NumberField
            label="Approved rate per sq ft"
            value={approvedRatePerSqFt}
            onChange={setApprovedRatePerSqFt}
            placeholder="Enter approved annual rate"
            step={0.01}
            helper="Enter the annual approved service-charge rate per square foot for the development."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label="Annual service charge"
          value={formatMoney(result.annualServiceCharge, AED_MARKET)}
          helper="Calculated from title deed area multiplied by the approved annual rate per square foot."
        />
        <ResultCard
          label="Monthly equivalent"
          value={formatMoney(result.monthlyEquivalent, AED_MARKET)}
          helper="Useful for comparing ongoing carrying cost against rent or mortgage payments."
        />
        <ResultCard
          label="Title deed area"
          value={`${formatNumber(numericArea)} sq ft`}
          helper="Area used in the service-charge calculation."
        />
        <ResultCard
          label="Approved rate"
          value={`${formatMoney(numericRate, AED_MARKET)} / sq ft`}
          helper="Annual approved service-charge rate entered above."
        />
      </section>

      <NoteCard title="What this Dubai service charge estimate assumes">
        <p>
          This page assumes the annual service charge is calculated directly from the approved rate per square foot and
          the title deed area. It is designed for planning, budgeting, and comparing communities, not for replacing the
          final statement issued for a specific unit or service-charge year.
        </p>
      </NoteCard>
    </div>
  );
}
