"use client";

import { useMemo, useState } from "react";

import {
  calculateCpc,
  calculateCpm,
  estimateSpendFromCpc,
  estimateSpendFromCpm,
} from "@/lib/tools/cpc-cpm";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary";

export default function CpcCpmCalculator() {
  const [cpcSpend, setCpcSpend] = useState<number | "">(500);
  const [cpcClicks, setCpcClicks] = useState<number | "">(250);
  const [targetCpc, setTargetCpc] = useState<number | "">(2);
  const [targetClicks, setTargetClicks] = useState<number | "">(600);

  const [cpmSpend, setCpmSpend] = useState<number | "">(750);
  const [cpmImpressions, setCpmImpressions] = useState<number | "">(150000);
  const [targetCpm, setTargetCpm] = useState<number | "">(5);
  const [targetImpressions, setTargetImpressions] = useState<number | "">(250000);

  const cpc = useMemo(
    () =>
      calculateCpc({
        spend: typeof cpcSpend === "number" ? cpcSpend : 0,
        clicks: typeof cpcClicks === "number" ? cpcClicks : 0,
      }),
    [cpcSpend, cpcClicks],
  );

  const cpm = useMemo(
    () =>
      calculateCpm({
        spend: typeof cpmSpend === "number" ? cpmSpend : 0,
        impressions: typeof cpmImpressions === "number" ? cpmImpressions : 0,
      }),
    [cpmSpend, cpmImpressions],
  );

  const estimatedCpcSpend = useMemo(
    () =>
      estimateSpendFromCpc(
        typeof targetCpc === "number" ? targetCpc : 0,
        typeof targetClicks === "number" ? targetClicks : 0,
      ),
    [targetCpc, targetClicks],
  );

  const estimatedCpmSpend = useMemo(
    () =>
      estimateSpendFromCpm(
        typeof targetCpm === "number" ? targetCpm : 0,
        typeof targetImpressions === "number" ? targetImpressions : 0,
      ),
    [targetCpm, targetImpressions],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="tool-frame p-4 sm:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">CPC calculator</h2>
        <div className="mt-5 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Ad spend</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={cpcSpend}
              onChange={(event) => setCpcSpend(event.target.value ? Number(event.target.value) : "")}
              className={fieldClass}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Clicks</span>
            <input
              type="number"
              min={0}
              step="1"
              value={cpcClicks}
              onChange={(event) => setCpcClicks(event.target.value ? Number(event.target.value) : "")}
              className={fieldClass}
            />
          </label>
          <div className="rounded-[1rem] border border-primary/20 bg-primary-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-soft-foreground">
              Cost per click
            </p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-primary">
              {cpc.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </p>
          </div>

          <div className="grid gap-4 border-t border-border/60 pt-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Target CPC</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={targetCpc}
                onChange={(event) => setTargetCpc(event.target.value ? Number(event.target.value) : "")}
                className={fieldClass}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Target clicks</span>
              <input
                type="number"
                min={0}
                step="1"
                value={targetClicks}
                onChange={(event) => setTargetClicks(event.target.value ? Number(event.target.value) : "")}
                className={fieldClass}
              />
            </label>
          </div>
          <p className="text-sm text-muted-foreground">
            Estimated spend:{" "}
            <span className="font-semibold text-foreground">
              {estimatedCpcSpend.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </p>
        </div>
      </section>

      <section className="tool-frame p-4 sm:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">CPM calculator</h2>
        <div className="mt-5 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Ad spend</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={cpmSpend}
              onChange={(event) => setCpmSpend(event.target.value ? Number(event.target.value) : "")}
              className={fieldClass}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Impressions</span>
            <input
              type="number"
              min={0}
              step="1"
              value={cpmImpressions}
              onChange={(event) => setCpmImpressions(event.target.value ? Number(event.target.value) : "")}
              className={fieldClass}
            />
          </label>
          <div className="rounded-[1rem] border border-primary/20 bg-primary-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-soft-foreground">
              Cost per 1,000 impressions
            </p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-primary">
              {cpm.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </p>
          </div>

          <div className="grid gap-4 border-t border-border/60 pt-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Target CPM</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={targetCpm}
                onChange={(event) => setTargetCpm(event.target.value ? Number(event.target.value) : "")}
                className={fieldClass}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Target impressions</span>
              <input
                type="number"
                min={0}
                step="1"
                value={targetImpressions}
                onChange={(event) => setTargetImpressions(event.target.value ? Number(event.target.value) : "")}
                className={fieldClass}
              />
            </label>
          </div>
          <p className="text-sm text-muted-foreground">
            Estimated spend:{" "}
            <span className="font-semibold text-foreground">
              {estimatedCpmSpend.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
