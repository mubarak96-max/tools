"use client";

import { useMemo, useState } from "react";

import { NoteCard, NumberField, ResultCard, formatMoney, formatPercent } from "@/components/real-estate/shared";
import { calculateHongKongAvd } from "@/lib/tools/real-estate";

const HKD_MARKET = { key: "HK", label: "Hong Kong", currency: "HKD", locale: "en-HK" } as const;

export default function HongKongStampDutyCalculator() {
  const [propertyValue, setPropertyValue] = useState("");

  const numericValue = Number(propertyValue) || 0;
  const result = useMemo(
    () =>
      calculateHongKongAvd({
        propertyValue: numericValue,
      }),
    [numericValue],
  );

  const effectiveRate = numericValue > 0 ? (result.avd / numericValue) * 100 : 0;

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <NumberField
            label="Property value"
            value={propertyValue}
            onChange={setPropertyValue}
            placeholder="Enter property value"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ResultCard
          label="Estimated ad valorem stamp duty"
          value={formatMoney(result.avd, HKD_MARKET)}
          helper="Calculated using the current Scale 2 residential schedule published on the Hong Kong Government rates page."
        />
        <ResultCard
          label="Effective rate"
          value={formatPercent(effectiveRate)}
          helper="This is the estimated ad valorem duty as a share of the property value entered."
        />
        <ResultCard
          label="Property value"
          value={formatMoney(numericValue, HKD_MARKET)}
          helper="Shown with the duty estimate so you can compare the effective burden more easily."
        />
      </section>

      <NoteCard title="What this Hong Kong page covers">
        <p>
          This calculator is focused on the currently published Scale 2 ad valorem residential duty schedule. It does not
          try to mix in every other Hong Kong stamp-duty edge case, because that would make the page noisier and less
          reliable for the common budgeting question people usually have.
        </p>
      </NoteCard>
    </div>
  );
}
