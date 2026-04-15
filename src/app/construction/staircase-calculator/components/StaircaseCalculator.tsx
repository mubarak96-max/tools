"use client";

import React, { useState, useMemo } from "react";
import {
  calculateStaircase,
  type StaircaseInputs,
  type StaircaseSystem,
} from "@/lib/tools/staircase";

/* ─── helpers ─────────────────────────────────────────────────────── */
function Field({
  label,
  unit,
  value,
  min = 0,
  step = 1,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  min?: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div className="relative">
        <input
          type="number"
          min={min}
          step={step}
          value={value === 0 ? "" : value}
          placeholder="0"
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 pr-12 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {unit}
        </span>
      </div>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums text-foreground">{value}</span>
    </div>
  );
}

function ResultCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-primary/20 bg-primary/5 p-5">
      <p className="mb-1 text-xl">{icon}</p>
      <p className="text-2xl font-bold tabular-nums text-foreground">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-muted-foreground">{label}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground/70">{sub}</p>}
    </div>
  );
}

/* ─── main component ──────────────────────────────────────────────── */
export function StaircaseCalculator() {
  const [sys, setSys] = useState<StaircaseSystem>("imperial");

  const imperialDefaults: StaircaseInputs = {
    totalRise: 108,
    targetRise: 7.5,
    targetRun: 10,
    nosing: 0.75,
    stairWidth: 36,
    stringerCount: 2,
    system: "imperial",
  };

  const metricDefaults: StaircaseInputs = {
    totalRise: 274,
    targetRise: 19,
    targetRun: 25,
    nosing: 2,
    stairWidth: 92,
    stringerCount: 2,
    system: "metric",
  };

  const [inputs, setInputs] = useState<StaircaseInputs>(imperialDefaults);

  const set = (key: keyof StaircaseInputs, val: number | StaircaseSystem) =>
    setInputs((p) => ({ ...p, [key]: val }));

  const switchSys = (s: StaircaseSystem) => {
    setSys(s);
    setInputs(s === "imperial" ? imperialDefaults : metricDefaults);
  };

  const r = useMemo(() => calculateStaircase(inputs), [inputs]);

  const u = sys === "imperial" ? "in" : "cm";

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_22rem]">

        {/* ── Left: inputs ── */}
        <div className="space-y-6">

          {/* Unit toggle */}
          <div className="inline-flex rounded-[1rem] border border-border bg-card p-1">
            {(["imperial", "metric"] as StaircaseSystem[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => switchSys(s)}
                className={`rounded-[0.75rem] px-5 py-2 text-sm font-semibold transition-colors ${
                  sys === s
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {s === "imperial" ? "Imperial (in)" : "Metric (cm)"}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Total Rise (floor-to-floor)"
              unit={u}
              value={inputs.totalRise}
              min={1}
              step={sys === "imperial" ? 0.5 : 1}
              onChange={(v) => set("totalRise", v)}
            />
            <Field
              label="Target Riser Height"
              unit={u}
              value={inputs.targetRise}
              min={1}
              step={0.25}
              onChange={(v) => set("targetRise", v)}
            />
            <Field
              label="Target Tread Depth (run)"
              unit={u}
              value={inputs.targetRun}
              min={1}
              step={0.25}
              onChange={(v) => set("targetRun", v)}
            />
            <Field
              label="Nosing Overhang"
              unit={u}
              value={inputs.nosing}
              min={0}
              step={0.25}
              onChange={(v) => set("nosing", v)}
            />
            <Field
              label="Stair Width"
              unit={u}
              value={inputs.stairWidth}
              min={1}
              step={1}
              onChange={(v) => set("stairWidth", v)}
            />
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Stringers</span>
              <div className="inline-flex w-full rounded-[1rem] border border-border bg-card p-1">
                {[2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set("stringerCount", n)}
                    className={`flex-1 rounded-[0.75rem] py-2.5 text-sm font-semibold transition-colors ${
                      inputs.stringerCount === n
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {n} stringers
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Comfort score */}
          <div
            className={`rounded-[1.25rem] border p-5 ${
              r.comfortOk
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-amber-500/20 bg-amber-500/5"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">
                Comfort formula: 2 × rise + run
              </p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  r.comfortOk
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                }`}
              >
                {r.comfortOk ? "✓ Comfortable" : "⚠ Outside ideal"}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">
              {r.comfortScore.toFixed(2)}{" "}
              <span className="text-sm font-normal text-muted-foreground">{u}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ideal range:{" "}
              {sys === "imperial" ? "24–25 in" : "61–64 cm"} — based on
              Blondel&apos;s formula (1675)
            </p>
          </div>

          {/* Code compliance */}
          {r.codeChecks.length > 0 && (
            <div className="rounded-[1.25rem] border border-border bg-background p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Code compliance (IRC)</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    r.allCodePass
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-500/15 text-red-600 dark:text-red-400"
                  }`}
                >
                  {r.allCodePass ? "✓ All pass" : "✗ Issues found"}
                </span>
              </div>
              <div className="space-y-2">
                {r.codeChecks.map((c) => (
                  <div
                    key={c.label}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span
                        className={`inline-block h-2 w-2 rounded-full flex-shrink-0 ${
                          c.pass ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                      {c.label}
                    </span>
                    <span className="flex items-center gap-2 text-right">
                      <span className="font-semibold tabular-nums text-foreground">
                        {c.value}
                      </span>
                      <span className="text-xs text-muted-foreground/60">{c.limit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: results ── */}
        <aside className="space-y-4">

          {/* Result cards */}
          <div className="grid grid-cols-2 gap-3">
            <ResultCard
              icon="🪜"
              label="Risers"
              value={r.stepCount}
              sub={`${r.treadCount} treads`}
            />
            <ResultCard
              icon="📐"
              label="Angle"
              value={`${r.angle.toFixed(1)}°`}
              sub="staircase pitch"
            />
            <ResultCard
              icon="↕"
              label="Actual Rise"
              value={`${r.actualRise.toFixed(2)} ${u}`}
              sub="per step"
            />
            <ResultCard
              icon="↔"
              label="Total Run"
              value={`${r.totalRun.toFixed(1)} ${u}`}
              sub="horizontal footprint"
            />
          </div>

          {/* Detailed breakdown */}
          <div className="rounded-[1.5rem] border border-border bg-background p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Dimensions
            </p>
            <div className="space-y-2.5">
              <Row label="Total rise" value={`${inputs.totalRise} ${u}`} />
              <Row label="Step count (risers)" value={String(r.stepCount)} />
              <Row label="Tread count" value={String(r.treadCount)} />
              <Row label="Actual rise / step" value={`${r.actualRise.toFixed(3)} ${u}`} />
              <Row label="Tread depth (run)" value={`${r.actualRun} ${u}`} />
              <Row label="Nosing overhang" value={`${inputs.nosing} ${u}`} />
              <div className="!my-3 border-t border-border" />
              <Row label="Total horizontal run" value={`${r.totalRun.toFixed(2)} ${u}`} />
              <Row
                label="Stringer length"
                value={`${r.stringerLength.toFixed(2)} ${u}`}
              />
              <Row label="Stringer angle" value={`${r.angle.toFixed(2)}°`} />
            </div>
          </div>

          {/* Lumber estimate */}
          <div className="rounded-[1.5rem] border border-border bg-background p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Lumber estimate
            </p>
            <Row
              label={`Stringer boards (×${inputs.stringerCount})`}
              value={`${(r.stringerBoardLength * inputs.stringerCount).toFixed(0)} ${u} total`}
            />
            <Row
              label="Each stringer board"
              value={`${r.stringerBoardLength.toFixed(1)} ${u}`}
            />
            <Row
              label={`Tread boards (${r.treadCount} × ${inputs.stairWidth} ${u})`}
              value={`${r.treadLumberLength.toFixed(0)} ${u} total`}
            />
            <p className="text-xs text-muted-foreground/70 leading-5">
              Stringer length includes a 10% cut/waste margin.
            </p>
          </div>

          {/* Tip */}
          <div className="rounded-[1.25rem] border border-primary/15 bg-primary/5 p-4">
            <p className="text-xs leading-5 text-primary-soft-foreground">
              💡 <strong>Tip:</strong> The ideal staircase angle is
              30°–37°. Below 30° takes too much floor space; above 37° feels
              steep and may fail code.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
