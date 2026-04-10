"use client";

import React, { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { calculateStaircase, type StaircaseInputs } from "@/lib/tools/staircase";

export function StaircaseCalculator() {
  const [inputs, setInputs] = useState<StaircaseInputs>({
    totalRise: 100,
    targetRise: 7.5,
    targetRun: 10,
    system: "imperial",
  });

  const result = useMemo(() => calculateStaircase(inputs), [inputs]);

  const handleChange = (key: keyof StaircaseInputs, value: string | number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const unit = inputs.system === "imperial" ? "in" : "cm";

  return (
    <CalculatorLayout
      title="Staircase Calculator"
      description="Calculate step dimensions, stringer length, and angle for your staircase."
    >
      <div className="space-y-6">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => handleChange("system", "imperial")}
              className={`flex-1 py-2 rounded-xl border transition-all ${inputs.system === "imperial" ? "bg-primary text-white border-primary" : "bg-white/5 text-gray-400 border-white/10"}`}
            >
              Imperial (in)
            </button>
            <button
              onClick={() => handleChange("system", "metric")}
              className={`flex-1 py-2 rounded-xl border transition-all ${inputs.system === "metric" ? "bg-primary text-white border-primary" : "bg-white/5 text-gray-400 border-white/10"}`}
            >
              Metric (cm)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Total Rise ({unit})</label>
              <input
                type="number"
                value={inputs.totalRise}
                onChange={(e) => handleChange("totalRise", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Target Step Rise ({unit})</label>
              <input
                type="number"
                value={inputs.targetRise}
                onChange={(e) => handleChange("targetRise", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Target Step Run ({unit})</label>
              <input
                type="number"
                value={inputs.targetRun}
                onChange={(e) => handleChange("targetRun", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
            <h3 className="text-xs font-medium text-gray-400 mb-1 leading-tight">Step Count</h3>
            <p className="text-2xl font-light text-emerald-400 leading-tight">{result.stepCount}</p>
          </div>
          <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
            <h3 className="text-xs font-medium text-gray-400 mb-1 leading-tight">Actual Rise</h3>
            <p className="text-2xl font-light text-emerald-400 leading-tight">{result.actualRise.toFixed(2)} {unit}</p>
          </div>
          <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
            <h3 className="text-xs font-medium text-gray-400 mb-1 leading-tight">Actual Run</h3>
            <p className="text-2xl font-light text-emerald-400 leading-tight">{result.actualRun.toFixed(2)} {unit}</p>
          </div>
          <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
            <h3 className="text-xs font-medium text-gray-400 mb-1 leading-tight">Total Run</h3>
            <p className="text-2xl font-light text-emerald-400 leading-tight">{result.totalRun.toFixed(2)} {unit}</p>
          </div>
          <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
            <h3 className="text-xs font-medium text-gray-400 mb-1 leading-tight">Stringer Length</h3>
            <p className="text-2xl font-light text-emerald-400 leading-tight">{result.stringerLength.toFixed(2)} {unit}</p>
          </div>
          <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
            <h3 className="text-xs font-medium text-gray-400 mb-1 leading-tight">Angle</h3>
            <p className="text-2xl font-light text-emerald-400 leading-tight">{result.angle.toFixed(1)}°</p>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
