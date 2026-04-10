"use client";

import React, { useState, useMemo } from "react";
import { type RoomAreaInputs, type UnitSystem, type Rectangle, calculateRoomArea } from "@/lib/tools/room-area";
import { Plus, Trash2 } from "lucide-react";

export function RoomAreaCalculator() {
  const [inputs, setInputs] = useState<RoomAreaInputs>({
    system: "imperial",
    baseLength: 12,
    baseWidth: 10,
    additions: [],
    deductions: [],
  });

  const updateInput = (key: keyof RoomAreaInputs, value: any) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const addAddition = () => {
    const newRect: Rectangle = { id: Date.now().toString(), name: "Alcove / Closet", length: 0, width: 0 };
    updateInput("additions", [...inputs.additions, newRect]);
  };

  const removeAddition = (id: string) => {
    updateInput("additions", inputs.additions.filter((a) => a.id !== id));
  };

  const updateAddition = (id: string, key: keyof Rectangle, value: any) => {
    updateInput("additions", inputs.additions.map((a) => a.id === id ? { ...a, [key]: value } : a));
  };

  const addDeduction = () => {
    const newRect: Rectangle = { id: Date.now().toString(), name: "Island / Stairs", length: 0, width: 0 };
    updateInput("deductions", [...inputs.deductions, newRect]);
  };

  const removeDeduction = (id: string) => {
    updateInput("deductions", inputs.deductions.filter((d) => d.id !== id));
  };

  const updateDeduction = (id: string, key: keyof Rectangle, value: any) => {
    updateInput("deductions", inputs.deductions.map((d) => d.id === id ? { ...d, [key]: value } : d));
  };

  const result = useMemo(() => calculateRoomArea(inputs), [inputs]);
  const toggleSystem = (sys: UnitSystem) => updateInput("system", sys);

  const unitLabel = inputs.system === "imperial" ? "ft" : "m";
  const areaLabel = inputs.system === "imperial" ? "sq ft" : "sq m";

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_20rem]">
          <div className="space-y-6">
            
            <div className="inline-flex rounded-[1rem] border border-border bg-card p-1">
              <button onClick={() => toggleSystem("imperial")} className={`rounded-[0.75rem] px-5 py-2 text-sm font-semibold transition-colors ${inputs.system === "imperial" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>Imperial</button>
              <button onClick={() => toggleSystem("metric")} className={`rounded-[0.75rem] px-5 py-2 text-sm font-semibold transition-colors ${inputs.system === "metric" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>Metric</button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="col-span-full">
                <h3 className="text-base font-semibold text-foreground">Base Room Dimensions</h3>
              </div>
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Length</span>
                <div className="flex relative">
                  <input type="number" min="0" value={inputs.baseLength === 0 ? "" : inputs.baseLength} onChange={(e) => updateInput("baseLength", Number(e.target.value))} className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{unitLabel}</span>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Width</span>
                <div className="flex relative">
                  <input type="number" min="0" value={inputs.baseWidth === 0 ? "" : inputs.baseWidth} onChange={(e) => updateInput("baseWidth", Number(e.target.value))} className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary pr-8" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{unitLabel}</span>
                </div>
              </label>

              <div className="col-span-full mt-4 flex items-center justify-between border-b border-border/50 pb-2">
                <h3 className="text-base font-semibold text-foreground">Add Areas (Closets, Alcoves)</h3>
                <button onClick={addAddition} className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"><Plus className="w-4 h-4"/> Add Area</button>
              </div>
              {inputs.additions.map((rect) => (
                <div key={rect.id} className="col-span-full grid gap-3 sm:grid-cols-3 items-end bg-card/60 p-4 rounded-[1rem] border border-border/50">
                  <input value={rect.name} onChange={(e) => updateAddition(rect.id, "name", e.target.value)} className="w-full rounded-[0.5rem] border border-border bg-background px-3 py-2 text-sm font-medium outline-none focus:ring-1 focus:ring-primary" placeholder="Name" />
                  <div className="flex relative">
                    <input type="number" min="0" value={rect.length===0?"":rect.length} onChange={(e) => updateAddition(rect.id, "length", Number(e.target.value))} className="w-full rounded-[0.5rem] border border-border bg-background px-3 py-2 text-sm font-medium outline-none focus:ring-1 focus:ring-primary pr-6" placeholder="Length" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{unitLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex relative flex-1">
                      <input type="number" min="0" value={rect.width===0?"":rect.width} onChange={(e) => updateAddition(rect.id, "width", Number(e.target.value))} className="w-full rounded-[0.5rem] border border-border bg-background px-3 py-2 text-sm font-medium outline-none focus:ring-1 focus:ring-primary pr-6" placeholder="Width" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{unitLabel}</span>
                    </div>
                    <button onClick={() => removeAddition(rect.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              ))}

              <div className="col-span-full mt-4 flex items-center justify-between border-b border-border/50 pb-2">
                <h3 className="text-base font-semibold text-foreground">Subtract Areas (Islands, Fireplaces)</h3>
                <button onClick={addDeduction} className="text-sm font-medium text-destructive hover:text-destructive/80 flex items-center gap-1"><Plus className="w-4 h-4"/> Add Deduction</button>
              </div>
              {inputs.deductions.map((rect) => (
                <div key={rect.id} className="col-span-full grid gap-3 sm:grid-cols-3 items-end bg-card/60 p-4 rounded-[1rem] border border-destructive/20">
                  <input value={rect.name} onChange={(e) => updateDeduction(rect.id, "name", e.target.value)} className="w-full rounded-[0.5rem] border border-border bg-background px-3 py-2 text-sm font-medium outline-none focus:ring-1 focus:ring-destructive" placeholder="Name" />
                  <div className="flex relative">
                    <input type="number" min="0" value={rect.length===0?"":rect.length} onChange={(e) => updateDeduction(rect.id, "length", Number(e.target.value))} className="w-full rounded-[0.5rem] border border-border bg-background px-3 py-2 text-sm font-medium outline-none focus:ring-1 focus:ring-destructive pr-6" placeholder="Length" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{unitLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex relative flex-1">
                      <input type="number" min="0" value={rect.width===0?"":rect.width} onChange={(e) => updateDeduction(rect.id, "width", Number(e.target.value))} className="w-full rounded-[0.5rem] border border-border bg-background px-3 py-2 text-sm font-medium outline-none focus:ring-1 focus:ring-destructive pr-6" placeholder="Width" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{unitLabel}</span>
                    </div>
                    <button onClick={() => removeDeduction(rect.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              ))}

            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5 h-fit sticky top-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Total Square Area
            </p>
            <div className="mt-4 flex flex-col gap-1">
              <span className="text-4xl font-semibold tracking-tight text-foreground">{result.totalArea.toFixed(2)}</span>
              <span className="text-sm font-medium text-muted-foreground">{areaLabel}</span>
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Base Rectangle</span>
                <span className="font-medium text-foreground">
                  {result.baseArea.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm text-primary">
                <span>Additions</span>
                <span className="font-medium">
                  + {result.addedArea.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm text-destructive">
                <span>Deductions</span>
                <span className="font-medium">
                  - {result.deductedArea.toFixed(2)}
                </span>
              </div>
            </div>

          </aside>
        </div>
      </section>
    </div>
  );
}
