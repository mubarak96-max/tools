"use client";

import React, { useState, useMemo } from "react";
import {
  calculateFenceMaterial,
  type FenceInputs,
  type FenceSystem,
} from "@/lib/tools/fence-material";

/* ─── tiny helpers ───────────────────────────────────────────────── */
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
  accent,
}: {
  icon: string;
  label: string;
  value: number | string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.25rem] border p-5 ${
        accent
          ? `border-primary/20 bg-primary/5`
          : "border-border bg-background"
      }`}
    >
      <p className="mb-1 text-xl">{icon}</p>
      <p className="text-2xl font-bold tabular-nums text-foreground">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-muted-foreground">{label}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground/70">{sub}</p>}
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────────── */
export function FenceMaterialCalculator() {
  const [sys, setSys] = useState<FenceSystem>("imperial");

  const [inputs, setInputs] = useState<FenceInputs>({
    fenceLength: 100,
    fenceHeight: 6,
    postSpacing: 8,
    gateCount: 1,
    picketWidth: 3.5,
    picketSpacing: 0.5,
    wastePct: 10,
    system: "imperial",
  });

  const set = (key: keyof FenceInputs, val: number | FenceSystem) =>
    setInputs((p) => ({ ...p, [key]: val }));

  const switchSys = (s: FenceSystem) => {
    setSys(s);
    if (s === "imperial") {
      setInputs({
        fenceLength: 100,
        fenceHeight: 6,
        postSpacing: 8,
        gateCount: 1,
        picketWidth: 3.5,
        picketSpacing: 0.5,
        wastePct: 10,
        system: "imperial",
      });
    } else {
      setInputs({
        fenceLength: 30,
        fenceHeight: 1.8,
        postSpacing: 2.4,
        gateCount: 1,
        picketWidth: 9,
        picketSpacing: 1.5,
        wastePct: 10,
        system: "metric",
      });
    }
  };

  const r = useMemo(() => calculateFenceMaterial(inputs), [inputs]);

  const lenUnit = sys === "imperial" ? "ft" : "m";
  const dimUnit = sys === "imperial" ? "in" : "cm";

  const railLenFormatted =
    sys === "imperial"
      ? `${r.totalRailLength.toFixed(0)} ft`
      : `${r.totalRailLength.toFixed(1)} m`;

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_22rem]">

        {/* ── Left: inputs ── */}
        <div className="space-y-6">

          {/* Unit toggle */}
          <div className="inline-flex rounded-[1rem] border border-border bg-card p-1">
            {(["imperial", "metric"] as FenceSystem[]).map((s) => (
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
                {s === "imperial" ? "Imperial (ft / in)" : "Metric (m / cm)"}
              </button>
            ))}
          </div>

          {/* Input grid */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Total Fence Length"
              unit={lenUnit}
              value={inputs.fenceLength}
              min={1}
              step={sys === "imperial" ? 1 : 0.5}
              onChange={(v) => set("fenceLength", v)}
            />
            <Field
              label="Fence Height"
              unit={lenUnit}
              value={inputs.fenceHeight}
              min={0.5}
              step={sys === "imperial" ? 0.5 : 0.1}
              onChange={(v) => set("fenceHeight", v)}
            />
            <Field
              label="Post Spacing"
              unit={lenUnit}
              value={inputs.postSpacing}
              min={1}
              step={sys === "imperial" ? 1 : 0.5}
              onChange={(v) => set("postSpacing", v)}
            />
            <Field
              label="Gate Openings"
              unit="gates"
              value={inputs.gateCount}
              min={0}
              onChange={(v) => set("gateCount", v)}
            />
            <Field
              label="Picket Width"
              unit={dimUnit}
              value={inputs.picketWidth}
              min={1}
              step={0.25}
              onChange={(v) => set("picketWidth", v)}
            />
            <Field
              label="Gap Between Pickets"
              unit={dimUnit}
              value={inputs.picketSpacing}
              min={0}
              step={0.25}
              onChange={(v) => set("picketSpacing", v)}
            />
          </div>

          {/* Waste slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Waste &amp; Offcut Buffer
              </span>
              <span className="text-sm font-bold text-foreground">
                {inputs.wastePct}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              step={5}
              value={inputs.wastePct}
              onChange={(e) => set("wastePct", Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground/60">
              <span>0%</span>
              <span>5%</span>
              <span>10%</span>
              <span>15%</span>
              <span>20%</span>
              <span>25%</span>
            </div>
          </div>

          {/* How it was calculated */}
          <div className="rounded-[1.25rem] border border-border bg-background p-5 text-sm leading-6 text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground mb-2">Calculation summary</p>
            <p>
              <strong className="text-foreground">{r.sections}</strong> sections
              × <strong className="text-foreground">{r.railsPerSection}</strong> rails
              per section (auto-determined from {inputs.fenceHeight} {lenUnit} height)
            </p>
            <p>
              Base posts: {r.sections} sections + 1 end post
              {inputs.gateCount > 0
                ? ` + ${inputs.gateCount * 2} gate posts (${inputs.gateCount} × 2)`
                : ""}
              {" "}= <strong className="text-foreground">{r.postsBase}</strong>
            </p>
            <p>
              Base pickets: {inputs.fenceLength} {lenUnit} ÷ (
              {inputs.picketWidth} + {inputs.picketSpacing}) {dimUnit} ={" "}
              <strong className="text-foreground">{r.picketsBase}</strong>
            </p>
            <p>
              All quantities rounded up and inflated by{" "}
              <strong className="text-foreground">{inputs.wastePct}%</strong> waste.
            </p>
          </div>
        </div>

        {/* ── Right: results ── */}
        <aside className="space-y-4">
          {/* Primary cards */}
          <div className="grid grid-cols-2 gap-3">
            <ResultCard icon="🪧" label="Posts" value={r.posts} sub="incl. gate posts" accent />
            <ResultCard icon="📏" label="Rails" value={r.rails} sub={`${r.railsPerSection} rails/section`} accent />
            <ResultCard icon="🏗️" label="Pickets" value={r.pickets} sub={`base: ${r.picketsBase}`} accent />
            <ResultCard
              icon="📐"
              label="Rail Lumber"
              value={railLenFormatted}
              sub="total linear length"
              accent
            />
          </div>

          {/* Detailed breakdown */}
          <div className="rounded-[1.5rem] border border-border bg-background p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Breakdown
            </p>
            <div className="space-y-2.5">
              <Row label="Fence sections" value={String(r.sections)} />
              <Row label="Rails per section" value={String(r.railsPerSection)} />
              <Row label="Gate post pairs" value={String(inputs.gateCount)} />
              <div className="!my-3 border-t border-border" />
              <Row label="Posts (base)" value={String(r.postsBase)} />
              <Row label="Rails (base)" value={String(r.railsBase)} />
              <Row label="Pickets (base)" value={String(r.picketsBase)} />
              <div className="!my-3 border-t border-border" />
              <Row
                label={`Posts (+${inputs.wastePct}%)`}
                value={String(r.posts)}
              />
              <Row
                label={`Rails (+${inputs.wastePct}%)`}
                value={String(r.rails)}
              />
              <Row
                label={`Pickets (+${inputs.wastePct}%)`}
                value={String(r.pickets)}
              />
            </div>
          </div>

          {/* Concrete */}
          <div className="rounded-[1.5rem] border border-border bg-background p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Concrete bags for posts
            </p>
            {sys === "imperial" ? (
              <>
                <Row label="80 lb bags" value={String(r.bags80lb)} />
                <Row label="60 lb bags" value={String(r.bags60lb)} />
              </>
            ) : (
              <>
                <Row label="25 kg bags" value={String(r.bags25kg)} />
                <Row label="20 kg bags" value={String(r.bags20kg)} />
              </>
            )}
            <p className="text-xs text-muted-foreground/70 leading-5">
              Based on{" "}
              {sys === "imperial"
                ? `${inputs.fenceHeight <= 6 ? 1 : 2} bag(s) per post for a ${inputs.fenceHeight} ft fence`
                : `${inputs.fenceHeight <= 1.8 ? 1 : 2} bag(s) per post for a ${inputs.fenceHeight} m fence`}
              .
            </p>
          </div>

          {/* Tip */}
          <div className="rounded-[1.25rem] border border-primary/15 bg-primary/5 p-4">
            <p className="text-xs leading-5 text-primary-soft-foreground">
              💡 <strong>Tip:</strong> Always buy an extra 5–10% of pickets for
              future repairs. Lumber dye lots vary — matching stain later can be
              difficult.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
