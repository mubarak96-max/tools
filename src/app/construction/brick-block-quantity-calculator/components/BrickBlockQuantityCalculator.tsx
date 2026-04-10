"use client";

import React, { useState, useMemo } from "react";
import { type BrickInputs, type UnitSystem, calculateBrickQuantity } from "@/lib/tools/brick-block-quantity";

export function BrickBlockQuantityCalculator() {
  const [inputs, setInputs] = useState<BrickInputs>({
    system: "imperial",
    wallLength: 20,
    wallHeight: 6,
    brickLength: 8, // Standard US Modular Brick Length
    brickHeight: 2.25, // Standard US Modular Brick Height
    mortarThickness: 0.375, // 3/8"
    wastePercent: 5,
  });

  const updateInput = (key: keyof BrickInputs, value: any) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const result = useMemo(() => calculateBrickQuantity(inputs), [inputs]);
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
                Imperial
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
                Metric
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="col-span-full">
                <h3 className="text-base font-semibold text-foreground">Wall Dimensions</h3>
              </div>
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Wall Length</span>
                <div className="flex relative">
                  <input
                    type="number"
                    min="0"
                    value={inputs.wallLength === 0 ? "" : inputs.wallLength}
                    onChange={(e) => updateInput("wallLength", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {inputs.system === "imperial" ? "ft" : "m"}
                  </span>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Wall Height</span>
                <div className="flex relative">
                  <input
                    type="number"
                    min="0"
                    value={inputs.wallHeight === 0 ? "" : inputs.wallHeight}
                    onChange={(e) => updateInput("wallHeight", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {inputs.system === "imperial" ? "ft" : "m"}
                  </span>
                </div>
              </label>

              <div className="col-span-full mt-4">
                <h3 className="text-base font-semibold text-foreground">Brick/Block & Mortar Size</h3>
              </div>
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Unit Length</span>
                <div className="flex relative">
                  <input
                    type="number"
                    min="0"
                    value={inputs.brickLength === 0 ? "" : inputs.brickLength}
                    onChange={(e) => updateInput("brickLength", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {inputs.system === "imperial" ? "in" : "cm"}
                  </span>
                </div>
              </label>
              
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Unit Height</span>
                <div className="flex relative">
                  <input
                    type="number"
                    min="0"
                    value={inputs.brickHeight === 0 ? "" : inputs.brickHeight}
                    onChange={(e) => updateInput("brickHeight", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {inputs.system === "imperial" ? "in" : "cm"}
                  </span>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Mortar Thickness</span>
                <div className="flex relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={inputs.mortarThickness === 0 ? "" : inputs.mortarThickness}
                    onChange={(e) => updateInput("mortarThickness", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {inputs.system === "imperial" ? "in" : "cm"}
                  </span>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Waste Factor: {inputs.wastePercent}%</span>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={inputs.wastePercent}
                  onChange={(e) => updateInput("wastePercent", Number(e.target.value))}
                  className="w-full accent-primary mt-2"
                />
              </label>

            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Total Units Needed
            </p>
            <div className="mt-4 flex flex-col gap-1">
              <span className="text-4xl font-semibold tracking-tight text-foreground">{result.bricksNeeded}</span>
              <span className="text-sm font-medium text-muted-foreground">bricks or blocks</span>
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Wall Area</span>
                <span className="font-semibold text-foreground">
                  {result.wallArea.toFixed(1)} {inputs.system === "imperial" ? "sq ft" : "sq m"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Included Waste</span>
                <span className="font-medium text-foreground">
                  {inputs.wastePercent}%
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
              <p className="text-xs leading-5 text-primary-soft-foreground">
                Calculation adds the mortar joint width/height to the brick unit to find the true effective area per block.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
