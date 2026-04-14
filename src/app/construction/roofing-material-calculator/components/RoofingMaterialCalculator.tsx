"use client";

import React, { useState, useMemo } from "react";
import { type RoofingInputs, type UnitSystem, calculateRoofing } from "@/lib/tools/roofing-material";

type ShingleProfile = "architectural" | "three-tab" | "wood-shake";

export function RoofingMaterialCalculator() {
  const [inputs, setInputs] = useState<RoofingInputs>({
    system: "imperial",
    baseLength: 40,
    baseWidth: 25,
    pitchRise: 4,
    overhang: 1.5,
    wastePercent: 10,
    bundlesPerSquare: 3,
  });
  const [profile, setProfile] = useState<ShingleProfile>("architectural");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const updateInput = (key: keyof RoofingInputs, value: any) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const result = useMemo(() => calculateRoofing(inputs), [inputs]);
  const toggleSystem = (sys: UnitSystem) => updateInput("system", sys);
  const lengthUnit = inputs.system === "imperial" ? "ft" : "m";
  const areaUnit = inputs.system === "imperial" ? "sq ft" : "sq m";

  function handleProfileChange(next: ShingleProfile) {
    setProfile(next);
    const bundlesPerSquare = next === "wood-shake" ? 4 : 3;
    updateInput("bundlesPerSquare", bundlesPerSquare);
  }

  const summaryText = useMemo(() => {
    return [
      `Roof area (with waste): ${result.roofAreaWithWaste.toFixed(1)} ${areaUnit}`,
      `Roof squares: ${result.squares}`,
      `Bundles needed: ${result.bundles}`,
      `Underlayment rolls: ${result.underlaymentRolls}`,
      `Drip edge: ${result.dripEdgeLength} ${lengthUnit}`,
      `Starter strip: ${result.starterStripLength.toFixed(0)} ${lengthUnit}`,
      `Ridge cap: ${result.ridgeCapLength.toFixed(0)} ${lengthUnit}`,
      `Fastener boxes: ${result.fastenerBoxes}`,
      `Waste factor: ${inputs.wastePercent}%`,
    ].join("\n");
  }, [areaUnit, inputs.wastePercent, lengthUnit, result]);

  async function handleCopyEstimate() {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1500);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 1500);
    }
  }

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_20rem]">
          <div className="space-y-6">
            
            <div className="inline-flex rounded-[1rem] border border-border bg-card p-1">
              <button
                type="button"
                onClick={() => toggleSystem("imperial")}
                className={`rounded-[0.75rem] px-5 py-2 text-sm font-semibold transition-colors ${
                  inputs.system === "imperial"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                Imperial (ft)
              </button>
              <button
                type="button"
                onClick={() => toggleSystem("metric")}
                className={`rounded-[0.75rem] px-5 py-2 text-sm font-semibold transition-colors ${
                  inputs.system === "metric"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                Metric (m)
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">House Base Length</span>
                <div className="flex relative">
                  <input
                    type="number"
                    min="0"
                    value={inputs.baseLength === 0 ? "" : inputs.baseLength}
                    onChange={(e) => updateInput("baseLength", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {inputs.system === "imperial" ? "ft" : "m"}
                  </span>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">House Base Width</span>
                <div className="flex relative">
                  <input
                    type="number"
                    min="0"
                    value={inputs.baseWidth === 0 ? "" : inputs.baseWidth}
                    onChange={(e) => updateInput("baseWidth", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {inputs.system === "imperial" ? "ft" : "m"}
                  </span>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Roof Overhang (Eaves)</span>
                <div className="flex relative">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={inputs.overhang === 0 ? "" : inputs.overhang}
                    onChange={(e) => updateInput("overhang", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {inputs.system === "imperial" ? "ft" : "m"}
                  </span>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Roof Pitch (X / 12)</span>
                <div className="flex relative">
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={inputs.pitchRise === 0 ? "" : inputs.pitchRise}
                    onChange={(e) => updateInput("pitchRise", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground flex items-center">
                    / 12
                  </span>
                </div>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Waste Factor: {inputs.wastePercent}%
                </span>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="5"
                  value={inputs.wastePercent}
                  onChange={(e) => updateInput("wastePercent", Number(e.target.value))}
                  className="mt-2 w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Simple 5%</span>
                  <span>Standard 10%</span>
                  <span>Complex 15%</span>
                  <span>Pattern-heavy 20-25%</span>
                </div>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-muted-foreground">Shingle Profile</span>
                <select
                  value={profile}
                  onChange={(e) => handleProfileChange(e.target.value as ShingleProfile)}
                  className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="architectural">Architectural / dimensional shingles (3 bundles per square)</option>
                  <option value="three-tab">3-tab shingles (3 bundles per square)</option>
                  <option value="wood-shake">Wood shakes (4 bundles per square)</option>
                </select>
              </label>
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Material Needed
            </p>
            <div className="mt-4 flex flex-col gap-1">
              <span className="text-4xl font-semibold tracking-tight text-foreground">{result.bundles} <span className="text-xl tracking-normal text-muted-foreground">bundles</span></span>
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Roof Squares</span>
                <span className="font-semibold text-primary">
                  {result.squares} sqs
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Actual Roof Area</span>
                <span className="font-medium text-foreground">
                  {result.roofArea.toFixed(1)} {areaUnit}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Area with Waste</span>
                <span className="font-medium text-foreground">{result.roofAreaWithWaste.toFixed(1)} {areaUnit}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Underlayment Rolls</span>
                <span className="font-medium text-foreground">{result.underlaymentRolls}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Drip Edge</span>
                <span className="font-medium text-foreground">{result.dripEdgeLength} {lengthUnit}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Starter Strip</span>
                <span className="font-medium text-foreground">{result.starterStripLength.toFixed(0)} {lengthUnit}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Ridge Cap</span>
                <span className="font-medium text-foreground">{result.ridgeCapLength.toFixed(0)} {lengthUnit}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Fastener Boxes</span>
                <span className="font-medium text-foreground">{result.fastenerBoxes}</span>
              </div>
            </div>

            <div className="mt-6 rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
              <p className="text-xs leading-5 text-primary-soft-foreground">
                Estimates include your selected waste margin for ridges, valleys, rakes, starter strips, and installation cuts.
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleCopyEstimate}
                className="rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
              >
                {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy estimate"}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
              >
                Print
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
