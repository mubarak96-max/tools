"use client";

import { useMemo, useState } from "react";

import { calculateClicksForTargetCtr, calculateCtr } from "@/lib/tools/ctr";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary";

export default function ClickThroughRateCalculator() {
  const [impressions, setImpressions] = useState<number | "">(10000);
  const [clicks, setClicks] = useState<number | "">(245);
  const [targetCtr, setTargetCtr] = useState<number | "">(3);

  const result = useMemo(
    () =>
      calculateCtr({
        impressions: typeof impressions === "number" ? impressions : 0,
        clicks: typeof clicks === "number" ? clicks : 0,
      }),
    [impressions, clicks],
  );

  const requiredClicks = useMemo(
    () =>
      calculateClicksForTargetCtr(
        typeof impressions === "number" ? impressions : 0,
        typeof targetCtr === "number" ? targetCtr : 0,
      ),
    [impressions, targetCtr],
  );

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Impressions</span>
              <input
                type="number"
                min={0}
                step="1"
                value={impressions}
                onChange={(event) => setImpressions(event.target.value ? Number(event.target.value) : "")}
                className={fieldClass}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Clicks</span>
              <input
                type="number"
                min={0}
                step="1"
                value={clicks}
                onChange={(event) => setClicks(event.target.value ? Number(event.target.value) : "")}
                className={fieldClass}
              />
            </label>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              CTR
            </p>
            <div className="mt-4 text-4xl font-bold tracking-tight text-foreground">
              {result.ctrPercent.toLocaleString(undefined, { maximumFractionDigits: 4 })}%
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {result.clicksPerThousandImpressions.toLocaleString(undefined, { maximumFractionDigits: 2 })} clicks per 1,000 impressions
            </p>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">Clicks needed for a target CTR</h2>
          <div className="mt-4 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Target CTR (%)</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={targetCtr}
                onChange={(event) => setTargetCtr(event.target.value ? Number(event.target.value) : "")}
                className={fieldClass}
              />
            </label>
            <div className="rounded-[1rem] border border-primary/20 bg-primary-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-soft-foreground">
                Required clicks
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-primary">
                {requiredClicks.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">Formula</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Click-through rate is calculated as <code>clicks / impressions x 100</code>. If you know your impression volume and target CTR, multiply impressions by the target percentage to estimate the clicks required.
          </p>
        </article>
      </section>
    </div>
  );
}
