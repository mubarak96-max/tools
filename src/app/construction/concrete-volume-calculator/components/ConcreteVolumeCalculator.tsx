"use client";

import React, { useState, useMemo } from "react";
import { 
  type ConcreteInputs, 
  type UnitSystem, 
  type ConcreteShape, 
  calculateConcrete 
} from "@/lib/tools/concrete-volume";

export function ConcreteVolumeCalculator() {
  const [inputs, setInputs] = useState<ConcreteInputs>({
    shape: "slab",
    system: "imperial",
    lengthFt: 10,
    lengthIn: 0,
    widthFt: 10,
    widthIn: 0,
    depthIn: 4,
    diameterIn: 12,
    lengthM: 3,
    widthM: 3,
    depthCm: 10,
    diameterCm: 30,
    quantity: 1,
  });

  const updateInput = (key: keyof ConcreteInputs, value: any) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const result = useMemo(() => calculateConcrete(inputs), [inputs]);

  const toggleSystem = (sys: UnitSystem) => updateInput("system", sys);
  const toggleShape = (sh: ConcreteShape) => updateInput("shape", sh);

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_20rem]">
          <div className="space-y-6">
            
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex rounded-[1rem] border border-border bg-card p-1">
                <button
                  type="button"
                  onClick={() => toggleShape("slab")}
                  className={`rounded-[0.75rem] px-5 py-2 text-sm font-semibold transition-colors ${
                    inputs.shape === "slab"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Slab / Square
                </button>
                <button
                  type="button"
                  onClick={() => toggleShape("column")}
                  className={`rounded-[0.75rem] px-5 py-2 text-sm font-semibold transition-colors ${
                    inputs.shape === "column"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Column / Hole
                </button>
              </div>

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
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {inputs.shape === "slab" ? (
                <>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Length</span>
                    <div className="flex gap-2">
                      {inputs.system === "imperial" ? (
                        <>
                          <div className="flex-1 relative">
                            <input
                              type="number"
                              min="0"
                              value={inputs.lengthFt === 0 ? "" : inputs.lengthFt}
                              onChange={(e) => updateInput("lengthFt", Number(e.target.value))}
                              className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                              placeholder="0"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">ft</span>
                          </div>
                          <div className="flex-1 relative">
                            <input
                              type="number"
                              min="0" max="11"
                              value={inputs.lengthIn === 0 ? "" : inputs.lengthIn}
                              onChange={(e) => updateInput("lengthIn", Number(e.target.value))}
                              className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                              placeholder="0"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">in</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 relative">
                          <input
                            type="number"
                            min="0"
                            value={inputs.lengthM === 0 ? "" : inputs.lengthM}
                            onChange={(e) => updateInput("lengthM", Number(e.target.value))}
                            className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                            placeholder="0"
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
                              type="number"
                              min="0"
                              value={inputs.widthFt === 0 ? "" : inputs.widthFt}
                              onChange={(e) => updateInput("widthFt", Number(e.target.value))}
                              className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                              placeholder="0"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">ft</span>
                          </div>
                          <div className="flex-1 relative">
                            <input
                              type="number"
                              min="0" max="11"
                              value={inputs.widthIn === 0 ? "" : inputs.widthIn}
                              onChange={(e) => updateInput("widthIn", Number(e.target.value))}
                              className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                              placeholder="0"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">in</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 relative">
                          <input
                            type="number"
                            min="0"
                            value={inputs.widthM === 0 ? "" : inputs.widthM}
                            onChange={(e) => updateInput("widthM", Number(e.target.value))}
                            className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                            placeholder="0"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">m</span>
                        </div>
                      )}
                    </div>
                  </label>
                </>
              ) : (
                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Diameter</span>
                  <div className="flex relative">
                    {inputs.system === "imperial" ? (
                      <>
                        <input
                          type="number"
                          min="0"
                          value={inputs.diameterIn === 0 ? "" : inputs.diameterIn}
                          onChange={(e) => updateInput("diameterIn", Number(e.target.value))}
                          className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                          placeholder="0"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">in</span>
                      </>
                    ) : (
                      <>
                        <input
                          type="number"
                          min="0"
                          value={inputs.diameterCm === 0 ? "" : inputs.diameterCm}
                          onChange={(e) => updateInput("diameterCm", Number(e.target.value))}
                          className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                          placeholder="0"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">cm</span>
                      </>
                    )}
                  </div>
                </label>
              )}

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Depth / Thickness</span>
                <div className="flex relative">
                  {inputs.system === "imperial" ? (
                    <>
                      <input
                        type="number"
                        min="0"
                        value={inputs.depthIn === 0 ? "" : inputs.depthIn}
                        onChange={(e) => updateInput("depthIn", Number(e.target.value))}
                        className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">in</span>
                    </>
                  ) : (
                    <>
                      <input
                        type="number"
                        min="0"
                        value={inputs.depthCm === 0 ? "" : inputs.depthCm}
                        onChange={(e) => updateInput("depthCm", Number(e.target.value))}
                        className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">cm</span>
                    </>
                  )}
                </div>
              </label>
              
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Quantity</span>
                <div className="flex relative items-center">
                  <input
                    type="number"
                    min="1"
                    value={inputs.quantity === 0 ? "" : inputs.quantity}
                    onChange={(e) => updateInput("quantity", Number(e.target.value))}
                    className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">items</span>
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
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Cubic Feet</span>
                <span className="font-medium text-foreground">
                  {result.cubicFeet.toFixed(2)} cf
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Cubic Meters</span>
                <span className="font-medium text-foreground">
                  {result.cubicMeters.toFixed(2)} m³
                </span>
              </div>
            </div>
            
            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
                Premixed Bags Needed *
              </p>
              {inputs.system === "imperial" ? (
                <>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">80 lb bags</span>
                    <span className="font-medium text-foreground">{result.bags80lb}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">60 lb bags</span>
                    <span className="font-medium text-foreground">{result.bags60lb}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">40 lb bags</span>
                    <span className="font-medium text-foreground">{result.bags40lb}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">25 kg bags</span>
                    <span className="font-medium text-foreground">{result.bags25kg}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">20 kg bags</span>
                    <span className="font-medium text-foreground">{result.bags20kg}</span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
              <p className="text-xs leading-5 text-primary-soft-foreground">
                * Bag estimates include an industry-standard 5% waste factor for spills and uneven surfaces.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
