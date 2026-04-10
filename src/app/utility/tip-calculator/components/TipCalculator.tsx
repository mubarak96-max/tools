"use client";

import { useMemo, useState } from "react";

import { calculateTip } from "@/lib/tools/tip";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary";

const quickTips = [10, 12, 15, 18, 20, 25];

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState<number | "">(120);
  const [tipPercent, setTipPercent] = useState<number | "">(15);
  const [splitCount, setSplitCount] = useState<number | "">(2);

  const result = useMemo(
    () =>
      calculateTip({
        billAmount: typeof billAmount === "number" ? billAmount : 0,
        tipPercent: typeof tipPercent === "number" ? tipPercent : 0,
        splitCount: typeof splitCount === "number" ? splitCount : 1,
      }),
    [billAmount, tipPercent, splitCount],
  );

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Bill amount</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={billAmount}
                onChange={(event) => setBillAmount(event.target.value ? Number(event.target.value) : "")}
                className={fieldClass}
              />
            </label>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-muted-foreground">Tip percentage</span>
                <span className="text-sm font-semibold text-foreground">
                  {typeof tipPercent === "number" ? `${tipPercent}%` : "0%"}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                step="1"
                value={typeof tipPercent === "number" ? tipPercent : 0}
                onChange={(event) => setTipPercent(Number(event.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex flex-wrap gap-2">
                {quickTips.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTipPercent(value)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      tipPercent === value
                        ? "border-primary/30 bg-primary-soft text-primary"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Split between</span>
              <input
                type="number"
                min={1}
                step="1"
                value={splitCount}
                onChange={(event) => setSplitCount(event.target.value ? Number(event.target.value) : "")}
                className={fieldClass}
              />
            </label>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Tip summary
            </p>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Tip amount</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                {result.tipAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[1rem] border border-border/70 bg-muted/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Total bill
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {result.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-[1rem] border border-border/70 bg-muted/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Per person
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {result.totalPerPerson.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
          <p className="text-sm font-semibold text-muted-foreground">Tip per person</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {result.tipPerPerson.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
          <p className="text-sm font-semibold text-muted-foreground">Split count</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {typeof splitCount === "number" ? splitCount : 1}
          </p>
        </article>
      </section>
    </div>
  );
}
