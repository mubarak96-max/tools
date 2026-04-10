"use client";

import React, { useState, useMemo } from "react";
import { type WallpaperInputs, type UnitSystem, calculateWallpaper } from "@/lib/tools/wallpaper";

export function WallpaperCalculator() {
  const [inputs, setInputs] = useState<WallpaperInputs>({
    system: "imperial",
    roomPerimeter: 40, // 10x10 room
    roomHeight: 8,
    rollWidth: 21, // standard 21 inches
    rollLength: 33, // 33 feet
    patternRepeat: 18, 
  });

  const updateInput = (key: keyof WallpaperInputs, value: any) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const result = useMemo(() => calculateWallpaper(inputs), [inputs]);
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
                <h3 className="text-base font-semibold text-foreground">Room Dimensions</h3>
              </div>
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Total Perimeter (sum of all walls)</span>
                <div className="flex relative">
                  <input
                    type="number"
                    min="0"
                    value={inputs.roomPerimeter === 0 ? "" : inputs.roomPerimeter}
                    onChange={(e) => updateInput("roomPerimeter", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {inputs.system === "imperial" ? "ft" : "m"}
                  </span>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Ceiling Height</span>
                <div className="flex relative">
                  <input
                    type="number"
                    min="0"
                    value={inputs.roomHeight === 0 ? "" : inputs.roomHeight}
                    onChange={(e) => updateInput("roomHeight", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {inputs.system === "imperial" ? "ft" : "m"}
                  </span>
                </div>
              </label>

              <div className="col-span-full mt-4">
                <h3 className="text-base font-semibold text-foreground">Wallpaper Roll Spec</h3>
              </div>
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Roll Width</span>
                <div className="flex relative">
                  <input
                    type="number"
                    min="0"
                    value={inputs.rollWidth === 0 ? "" : inputs.rollWidth}
                    onChange={(e) => updateInput("rollWidth", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {inputs.system === "imperial" ? "in" : "cm"}
                  </span>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Roll Length</span>
                <div className="flex relative">
                  <input
                    type="number"
                    min="0"
                    value={inputs.rollLength === 0 ? "" : inputs.rollLength}
                    onChange={(e) => updateInput("rollLength", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {inputs.system === "imperial" ? "ft" : "m"}
                  </span>
                </div>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-muted-foreground">Pattern Repeat Match</span>
                <div className="flex relative">
                  <input
                    type="number"
                    min="0"
                    value={inputs.patternRepeat}
                    onChange={(e) => updateInput("patternRepeat", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {inputs.system === "imperial" ? "in" : "cm"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Leave 0 if solid color or random match.</p>
              </label>

            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Total Rolls Needed
            </p>
            <div className="mt-4 flex flex-col gap-1">
              <span className="text-4xl font-semibold tracking-tight text-foreground">{result.rollsNeeded}</span>
              <span className="text-sm font-medium text-muted-foreground">standard rolls</span>
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Strips you must cut</span>
                <span className="font-semibold text-foreground">
                  {result.totalStripsNeeded}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Usable Strips per roll</span>
                <span className="font-medium text-foreground">
                  {result.stripsPerRoll}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
              <p className="text-xs leading-5 text-primary-soft-foreground">
                We use the strict drop-match professional stripping method, which ensures you have exactly enough contiguous length for wall heights plus pattern alignment.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
