"use client";

import { useMemo, useState } from "react";

import { NoteCard, NumberField, ResultCard, formatMoney, formatPercent } from "@/components/real-estate/shared";
import { calculateHongKongAvd } from "@/lib/tools/real-estate";

const HKD_MARKET = { key: "HK", label: "Hong Kong", currency: "HKD", locale: "en-HK" } as const;

export default function HongKongStampDutyCalculator() {
  const [propertyValue, setPropertyValue] = useState("");
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(true);

  const numericValue = Number(propertyValue) || 0;
  const result = useMemo(
    () =>
      calculateHongKongAvd({
        propertyValue: numericValue,
      }),
    [numericValue, isFirstTimeBuyer],
  );

  const effectiveRate = numericValue > 0 ? (result.avd / numericValue) * 100 : 0;

  const copyResults = async () => {
    const text = `Property Value: ${formatMoney(numericValue, HKD_MARKET)}\nStamp Duty (AVD): ${formatMoney(result.avd, HKD_MARKET)}\nEffective Rate: ${formatPercent(effectiveRate)}\nBuyer Status: ${isFirstTimeBuyer ? "First-Time / Resident" : "Standard Scale"}`;
    await navigator.clipboard.writeText(text);
    alert("Results copied to clipboard!");
  };

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 items-end">
          <NumberField
            label="Property value"
            value={propertyValue}
            onChange={setPropertyValue}
            placeholder="Enter property value"
          />
          <div className="space-y-2">
             <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center justify-between">
                <span>First-Time Buyer</span>
                <span className="text-primary font-mono">{isFirstTimeBuyer ? "YES" : "NO"}</span>
             </label>
             <button 
                onClick={() => setIsFirstTimeBuyer(!isFirstTimeBuyer)}
                className={`w-full py-3 px-4 rounded-xl text-sm font-bold border transition-all ${isFirstTimeBuyer ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/10 text-foreground border-border'}`}
             >
                {isFirstTimeBuyer ? "HK Permanent Resident (Scale 2)" : "Non-PR / Subsequent (Scale 1)"}
             </button>
          </div>
          <button
             onClick={copyResults}
             className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-medium transition-all hover:bg-secondary/80"
          >
             Copy Results
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ResultCard
          label="Estimated ad valorem stamp duty"
          value={formatMoney(result.avd, HKD_MARKET)}
          helper="Calculated using the current residential schedule published on the Hong Kong Government rates page."
        />
        <ResultCard
          label="Effective rate"
          value={formatPercent(effectiveRate)}
          helper="This is the estimated ad valorem duty as a share of the property value entered."
        />
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm flex flex-col justify-center">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">Tax Banding Analysis</h3>
            <p className="text-sm font-medium text-foreground">
              Applied Scale: <strong className="text-primary">{isFirstTimeBuyer ? "Scale 2 Rates" : "Scale 1 Part 1 Rates"}</strong>
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Note: Current estimate utilizes baseline scale bands. Ensure you confirm the final tax tier with your solicitor.
            </p>
        </div>
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
