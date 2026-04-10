"use client";

import React, { useState, useMemo } from "react";
import { type FlooringInputs, type UnitSystem, calculateFlooring } from "@/lib/tools/flooring-material";

export function FlooringMaterialCalculator() {
  const [inputs, setInputs] = useState<FlooringInputs>({
    system: "imperial",
    length: 12,
    width: 15,
    wastePercent: 10,
    boxCoverage: 24, // Standard 24 sq ft per box of laminate/LVP
  });

  const updateInput = (key: keyof FlooringInputs, value: any) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const result = useMemo(() => calculateFlooring(inputs), [inputs]);
  const toggleSystem = (sys: UnitSystem) => updateInput("system", sys);

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
                <span className="text-sm font-medium text-muted-foreground">Room Length</span>
                <div className="flex relative">
                  <input
                    type="number"
                    min="0"
                    value={inputs.length === 0 ? "" : inputs.length}
                    onChange={(e) => updateInput("length", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {inputs.system === "imperial" ? "ft" : "m"}
                  </span>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Room Width</span>
                <div className="flex relative">
                  <input
                    type="number"
                    min="0"
                    value={inputs.width === 0 ? "" : inputs.width}
                    onChange={(e) => updateInput("width", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {inputs.system === "imperial" ? "ft" : "m"}
                  </span>
                </div>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-muted-foreground">Waste Factor: {inputs.wastePercent}%</span>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="5"
                  value={inputs.wastePercent}
                  onChange={(e) => updateInput("wastePercent", Number(e.target.value))}
                  className="w-full accent-primary mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>No waste</span>
                  <span>Standard 10%</span>
                  <span>Complex 20%+</span>
                </div>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-muted-foreground">Coverage per Box (optional)</span>
                <div className="flex relative items-center">
                  <input
                    type="number"
                    min="1"
                    value={inputs.boxCoverage === 0 ? "" : inputs.boxCoverage}
                    onChange={(e) => updateInput("boxCoverage", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-12"
                  />
                  <span className="absolute right-4 text-sm text-muted-foreground">
                    {inputs.system === "imperial" ? "sq ft" : "sq m"}
                  </span>
                </div>
              </label>

            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Total Area Needed
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {result.grossArea.toFixed(1)} <span className="text-2xl text-muted-foreground tracking-normal">{inputs.system === "imperial" ? "sq ft" : "sq m"}</span>
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Net Room Area</span>
                <span className="font-medium text-foreground">
                  {result.netArea.toFixed(1)} {inputs.system === "imperial" ? "sq ft" : "sq m"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Overage Amount</span>
                <span className="font-medium text-foreground">
                  +( {(result.grossArea - result.netArea).toFixed(1)} )
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Boxes Needed</span>
                <span className="font-semibold text-primary text-lg">
                  {result.boxesNeeded}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
              <p className="text-xs leading-5 text-primary-soft-foreground">
                Always round up to ensure you have enough planks corresponding to the exact dye lot.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
