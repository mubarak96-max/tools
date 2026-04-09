"use client";

import { useState } from "react";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary transition-shadow";

export default function PercentageCalculator() {
  // Calculator 1: What is X% of Y?
  const [calc1X, setCalc1X] = useState<number | "">("");
  const [calc1Y, setCalc1Y] = useState<number | "">("");
  
  const calc1Result = typeof calc1X === "number" && typeof calc1Y === "number" 
    ? (calc1X / 100) * calc1Y 
    : null;

  // Calculator 2: X is what percent of Y?
  const [calc2X, setCalc2X] = useState<number | "">("");
  const [calc2Y, setCalc2Y] = useState<number | "">("");
  
  const calc2Result = typeof calc2X === "number" && typeof calc2Y === "number" && calc2Y !== 0 
    ? (calc2X / calc2Y) * 100 
    : null;

  // Calculator 3: What is the percentage increase/decrease from X to Y?
  const [calc3X, setCalc3X] = useState<number | "">("");
  const [calc3Y, setCalc3Y] = useState<number | "">("");
  
  const calc3Result = typeof calc3X === "number" && typeof calc3Y === "number" && calc3X !== 0 
    ? ((calc3Y - calc3X) / calc3X) * 100 
    : null;

  return (
    <div className="space-y-6">
      
      {/* Calculator 1: What is X% of Y? */}
      <section className="tool-frame p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">1. Find a Percentage of a Number</h2>
        <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <div className="flex items-center gap-3 w-full">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">What is</span>
            <input
              type="number"
              placeholder="15"
              value={calc1X}
              onChange={(e) => setCalc1X(e.target.value ? Number(e.target.value) : "")}
              className={fieldClass}
            />
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">% of</span>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:-ml-4">
            <input
              type="number"
              placeholder="200"
              value={calc1Y}
              onChange={(e) => setCalc1Y(e.target.value ? Number(e.target.value) : "")}
              className={fieldClass}
            />
            <span className="text-sm font-medium text-foreground whitespace-nowrap">?</span>
          </div>

          <div className="h-px bg-border/50 sm:hidden w-full my-2"></div>

          <div className="rounded-[1.25rem] border border-primary/20 bg-primary-soft p-4 col-span-full sm:col-span-1 min-w-[150px] text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-soft-foreground mb-1">Result</p>
            <p className="text-2xl font-bold tracking-tight text-primary">
              {calc1Result !== null ? calc1Result.toLocaleString(undefined, { maximumFractionDigits: 4 }) : "-"}
            </p>
          </div>
        </div>
      </section>

      {/* Calculator 2: X is what percent of Y? */}
      <section className="tool-frame p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">2. Find the Percentage</h2>
        <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <div className="flex items-center gap-3 w-full">
            <input
              type="number"
              placeholder="30"
              value={calc2X}
              onChange={(e) => setCalc2X(e.target.value ? Number(e.target.value) : "")}
              className={fieldClass}
            />
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">is what % of</span>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:-ml-4">
            <input
              type="number"
              placeholder="150"
              value={calc2Y}
              onChange={(e) => setCalc2Y(e.target.value ? Number(e.target.value) : "")}
              className={fieldClass}
            />
            <span className="text-sm font-medium text-foreground whitespace-nowrap">?</span>
          </div>

          <div className="h-px bg-border/50 sm:hidden w-full my-2"></div>

          <div className="rounded-[1.25rem] border border-primary/20 bg-primary-soft p-4 col-span-full sm:col-span-1 min-w-[150px] text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-soft-foreground mb-1">Result</p>
            <p className="text-2xl font-bold tracking-tight text-primary">
              {calc2Result !== null ? `${calc2Result.toLocaleString(undefined, { maximumFractionDigits: 4 })}%` : "-"}
            </p>
          </div>
        </div>
      </section>

      {/* Calculator 3: Percentage Change */}
      <section className="tool-frame p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">3. Percentage Change (Increase / Decrease)</h2>
        <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <div className="flex items-center gap-3 w-full">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">From</span>
            <input
              type="number"
              placeholder="100"
              value={calc3X}
              onChange={(e) => setCalc3X(e.target.value ? Number(e.target.value) : "")}
              className={fieldClass}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full">
             <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">to</span>
            <input
              type="number"
              placeholder="150"
              value={calc3Y}
              onChange={(e) => setCalc3Y(e.target.value ? Number(e.target.value) : "")}
              className={fieldClass}
            />
          </div>

          <div className="h-px bg-border/50 sm:hidden w-full my-2"></div>

          <div className={`rounded-[1.25rem] border p-4 col-span-full sm:col-span-1 min-w-[150px] text-center ${
            calc3Result === null ? 'border-primary/20 bg-primary-soft' : 
            calc3Result > 0 ? 'border-emerald-500/30 bg-emerald-500/10' : 
            calc3Result < 0 ? 'border-red-500/30 bg-red-500/10' : 
            'border-primary/20 bg-primary-soft'
          }`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] mb-1 ${
              calc3Result === null ? 'text-primary-soft-foreground' : 
              calc3Result > 0 ? 'text-emerald-600' : 
              calc3Result < 0 ? 'text-red-600' : 
              'text-primary-soft-foreground'
            }`}>
              {calc3Result === null ? 'Result' : calc3Result > 0 ? 'Increase' : calc3Result < 0 ? 'Decrease' : 'No Change'}
            </p>
            <p className={`text-2xl font-bold tracking-tight ${
              calc3Result === null ? 'text-primary' : 
              calc3Result > 0 ? 'text-emerald-600' : 
              calc3Result < 0 ? 'text-red-600' : 
              'text-primary'
            }`}>
              {calc3Result !== null ? `${Math.abs(calc3Result).toLocaleString(undefined, { maximumFractionDigits: 4 })}%` : "-"}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
