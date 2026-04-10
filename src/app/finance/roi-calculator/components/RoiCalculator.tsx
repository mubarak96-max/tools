"use client";

import { useMemo, useState } from "react";

import { calculateRoi } from "@/lib/tools/roi";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary";

export default function RoiCalculator() {
  const [initialInvestment, setInitialInvestment] = useState<number | "">(10000);
  const [finalValue, setFinalValue] = useState<number | "">(13500);
  const [additionalCosts, setAdditionalCosts] = useState<number | "">(500);
  const [yearsHeld, setYearsHeld] = useState<number | "">(3);

  const result = useMemo(
    () =>
      calculateRoi({
        initialInvestment: typeof initialInvestment === "number" ? initialInvestment : 0,
        finalValue: typeof finalValue === "number" ? finalValue : 0,
        additionalCosts: typeof additionalCosts === "number" ? additionalCosts : 0,
        yearsHeld: typeof yearsHeld === "number" ? yearsHeld : 0,
      }),
    [initialInvestment, finalValue, additionalCosts, yearsHeld],
  );

  const profitTone =
    result.netProfit > 0
      ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
      : result.netProfit < 0
        ? "text-red-600 border-red-500/30 bg-red-500/10"
        : "text-primary border-primary/20 bg-primary-soft";
  const safeFinalValue = typeof finalValue === "number" ? finalValue : 0;

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Initial investment</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={initialInvestment}
                onChange={(event) => setInitialInvestment(event.target.value ? Number(event.target.value) : "")}
                className={fieldClass}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Final value</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={finalValue}
                onChange={(event) => setFinalValue(event.target.value ? Number(event.target.value) : "")}
                className={fieldClass}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Additional costs</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={additionalCosts}
                onChange={(event) => setAdditionalCosts(event.target.value ? Number(event.target.value) : "")}
                className={fieldClass}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Years held</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={yearsHeld}
                onChange={(event) => setYearsHeld(event.target.value ? Number(event.target.value) : "")}
                className={fieldClass}
              />
            </label>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              ROI
            </p>
            <div className="mt-4 text-4xl font-bold tracking-tight text-foreground">
              {result.roiPercent.toLocaleString(undefined, { maximumFractionDigits: 2 })}%
            </div>
            <div className={`mt-6 rounded-[1rem] border p-4 ${profitTone}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">Net profit</p>
              <p className="mt-2 text-2xl font-bold tracking-tight">
                {result.netProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total cost basis",
            value: result.totalCostBasis.toLocaleString(undefined, { maximumFractionDigits: 2 }),
          },
          {
            label: "Return multiple",
            value: `${result.totalReturnMultiple.toLocaleString(undefined, { maximumFractionDigits: 3 })}x`,
          },
          {
            label: "Annualized return",
            value:
              result.annualizedReturnPercent !== null
                ? `${result.annualizedReturnPercent.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
                : "--",
          },
          {
            label: "Final value",
            value: safeFinalValue.toLocaleString(undefined, { maximumFractionDigits: 2 }),
          },
        ].map((item) => (
          <article key={item.label} className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
            <p className="text-sm font-semibold text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{item.value}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
