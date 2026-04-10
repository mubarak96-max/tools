"use client";

import React, { useState, useMemo } from "react";
import { type PaintInputs, type UnitSystem, calculatePaintCoverage } from "@/lib/tools/paint-coverage";

export function PaintCoverageCalculator() {
  const [inputs, setInputs] = useState<PaintInputs>({
    system: "imperial",
    length: 12,
    width: 12,
    height: 8,
    paintCeiling: false,
    doors: 1,
    windows: 1,
    coats: 2,
  });

  const updateInput = (key: keyof PaintInputs, value: any) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const result = useMemo(() => calculatePaintCoverage(inputs), [inputs]);

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
                Imperial (Feet/Gallons)
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
                Metric (Meters/Liters)
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
                    placeholder="0"
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
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {inputs.system === "imperial" ? "ft" : "m"}
                  </span>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Room Height</span>
                <div className="flex relative">
                  <input
                    type="number"
                    min="0"
                    value={inputs.height === 0 ? "" : inputs.height}
                    onChange={(e) => updateInput("height", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {inputs.system === "imperial" ? "ft" : "m"}
                  </span>
                </div>
              </label>
              
              <label className="space-y-2 flex flex-col justify-end">
                <div className="flex items-center gap-3 py-3 px-4 rounded-[1rem] border border-border bg-background">
                  <input
                    type="checkbox"
                    id="paintCeiling"
                    checked={inputs.paintCeiling}
                    onChange={(e) => updateInput("paintCeiling", e.target.checked)}
                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-foreground">Paint the ceiling too?</span>
                </div>
              </label>
              
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Number of Doors</span>
                <input
                  type="number"
                  min="0"
                  value={inputs.doors === 0 ? "" : inputs.doors}
                  onChange={(e) => updateInput("doors", Number(e.target.value))}
                  className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </label>
              
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Number of Windows</span>
                <input
                  type="number"
                  min="0"
                  value={inputs.windows === 0 ? "" : inputs.windows}
                  onChange={(e) => updateInput("windows", Number(e.target.value))}
                  className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-muted-foreground">Number of Coats</span>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={inputs.coats}
                  onChange={(e) => updateInput("coats", Number(e.target.value))}
                  className="w-full accent-primary mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 Coat</span>
                  <span>2 Coats (Recommended)</span>
                  <span>3 Coats</span>
                  <span>4 Coats</span>
                </div>
              </label>
              
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Paint Required
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {inputs.system === "imperial" 
                ? `${result.paintAmount.toFixed(2)} gal` 
                : `${result.paintAmount.toFixed(2)} liters`}
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Total Paintable Area</span>
                <span className="font-medium text-foreground">
                  {result.totalArea.toFixed(1)} {inputs.system === "imperial" ? "sq ft" : "sq m"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Expected Coats</span>
                <span className="font-medium text-foreground">
                  {inputs.coats}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
              <p className="text-xs leading-5 text-primary-soft-foreground">
                Assuming standard coverage ({inputs.system === "imperial" ? "350 sq ft / gallon" : "10 sq m / liter"}). Buy an extra 10% to account for spills, deep textures, or future touch-ups.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
