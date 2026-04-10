"use client";

import React, { useState, useMemo } from "react";
import { type GravelMulchInputs, type UnitSystem, type MaterialType, calculateGravelMulch } from "@/lib/tools/gravel-mulch-volume";
import { ChevronDown } from "lucide-react";

export function GravelMulchVolumeCalculator() {
  const [inputs, setInputs] = useState<GravelMulchInputs>({
    system: "imperial",
    material: "gravel",
    lengthFt: 15,
    lengthIn: 0,
    widthFt: 10,
    widthIn: 0,
    depthIn: 2,
    lengthM: 5,
    widthM: 3,
    depthCm: 5,
  });

  const updateInput = (key: keyof GravelMulchInputs, value: any) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const result = useMemo(() => calculateGravelMulch(inputs), [inputs]);

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
                Imperial (ft/in)
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
                Metric (m/cm)
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 col-span-full md:col-span-1">
                <span className="text-sm font-medium text-muted-foreground">Material Type</span>
                <div className="relative">
                  <select
                    value={inputs.material}
                    onChange={(e) => updateInput("material", e.target.value as MaterialType)}
                    className="w-full appearance-none rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="gravel">Gravel / Crushed Stone</option>
                    <option value="soil">Topsoil / Dirt</option>
                    <option value="mulch">Wood Mulch</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </label>

              <div className="hidden md:block"></div>

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Length</span>
                <div className="flex gap-2">
                  {inputs.system === "imperial" ? (
                    <>
                      <div className="flex-1 relative">
                        <input
                          type="number" min="0"
                          value={inputs.lengthFt === 0 ? "" : inputs.lengthFt}
                          onChange={(e) => updateInput("lengthFt", Number(e.target.value))}
                          className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">ft</span>
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="number" min="0" max="11"
                          value={inputs.lengthIn === 0 ? "" : inputs.lengthIn}
                          onChange={(e) => updateInput("lengthIn", Number(e.target.value))}
                          className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">in</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 relative">
                      <input
                        type="number" min="0" // Allow decimals
                        value={inputs.lengthM === 0 ? "" : inputs.lengthM}
                        onChange={(e) => updateInput("lengthM", Number(e.target.value))}
                        className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">m</span>
                    </div>
                  )}
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Width</span>
                <div className="flex gap-2">
                  {inputs.system === "imperial" ? (
                    <>
                      <div className="flex-1 relative">
                        <input
                          type="number" min="0"
                          value={inputs.widthFt === 0 ? "" : inputs.widthFt}
                          onChange={(e) => updateInput("widthFt", Number(e.target.value))}
                          className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">ft</span>
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="number" min="0" max="11"
                          value={inputs.widthIn === 0 ? "" : inputs.widthIn}
                          onChange={(e) => updateInput("widthIn", Number(e.target.value))}
                          className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">in</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 relative">
                      <input
                        type="number" min="0"
                        value={inputs.widthM === 0 ? "" : inputs.widthM}
                        onChange={(e) => updateInput("widthM", Number(e.target.value))}
                        className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">m</span>
                    </div>
                  )}
                </div>
              </label>

              <label className="space-y-2 col-span-full md:col-span-1">
                <span className="text-sm font-medium text-muted-foreground">Depth / Thickness</span>
                <div className="flex relative">
                  {inputs.system === "imperial" ? (
                    <>
                      <input
                        type="number" min="0"
                        value={inputs.depthIn === 0 ? "" : inputs.depthIn}
                        onChange={(e) => updateInput("depthIn", Number(e.target.value))}
                        className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">in</span>
                    </>
                  ) : (
                    <>
                      <input
                        type="number" min="0"
                        value={inputs.depthCm === 0 ? "" : inputs.depthCm}
                        onChange={(e) => updateInput("depthCm", Number(e.target.value))}
                        className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">cm</span>
                    </>
                  )}
                </div>
              </label>
              
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Total Volume
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {inputs.system === "imperial" 
                ? `${result.cubicYards.toFixed(2)} yd³` 
                : `${result.cubicMeters.toFixed(2)} m³`}
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
                Estimated Delivery Weight
              </p>
              
              {inputs.system === "imperial" ? (
                <>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Tons</span>
                    <span className="font-semibold text-foreground">
                      {result.tons.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Pounds</span>
                    <span className="font-semibold text-foreground">
                      {Math.round(result.pounds).toLocaleString()} lbs
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Kilograms</span>
                  <span className="font-semibold text-foreground">
                    {Math.round(result.kilograms).toLocaleString()} kg
                  </span>
                </div>
              )}
            </div>
            
            <div className="mt-6 space-y-4 border-t border-border pt-5 text-sm/relaxed text-muted-foreground">
              Estimated weight is based on a standard density for <strong>{inputs.material}</strong>. Actual weight varies with moisture content.
            </div>

          </aside>
        </div>
      </section>
    </div>
  );
}
