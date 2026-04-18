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

  const copyResults = async () => {
    const text = `Annual Service Charge: ${formatMoney(result.annualServiceCharge, AED_MARKET)}\nMonthly Equivalent: ${formatMoney(result.monthlyEquivalent, AED_MARKET)}\nTitle Deed Area: ${formatNumber(numericArea)} sq ft\nApproved Rate: ${formatMoney(numericRate, AED_MARKET)} / sq ft`;
    await navigator.clipboard.writeText(text);
    alert("Results copied to clipboard!");
  };

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
          <div className="flex items-end md:col-span-2">
             <button
                onClick={copyResults}
                className="flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-secondary px-8 py-3 text-sm font-medium transition-all hover:bg-secondary/80"
             >
                Copy Results
             </button>
          </div>
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
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm md:col-span-2 xl:col-span-4 flex flex-col justify-center">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">Market Comparison</h3>
            <p className="text-sm font-medium text-foreground">
              Average Rate Comparison: <strong className="text-primary">{numericRate > 20 ? "Above average (Premium/Luxury typical)" : numericRate < 12 && numericRate > 0 ? "Below average (Affordable typical)" : "Average Dubai rate range"}</strong>
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Note: The standard average in Dubai ranges between 12 to 20 AED/sqft based on amenities and location.
            </p>
        </div>
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
