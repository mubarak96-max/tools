"use client";

import React, { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { calculateFenceMaterial, type FenceInputs } from "@/lib/tools/fence-material";

export function FenceMaterialCalculator() {
  const [inputs, setInputs] = useState<FenceInputs>({
    fenceLength: 50,
    postSpacing: 8,
    railCount: 2,
    picketWidth: 5.5,
    picketSpacing: 0,
    system: "imperial",
  });

  const result = useMemo(() => calculateFenceMaterial(inputs), [inputs]);

  const handleChange = (key: keyof FenceInputs, value: string | number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <CalculatorLayout
      title="Fence Material Calculator"
      description="Calculate the number of posts, rails, and pickets needed for your fencing project."
    >
      <div className="space-y-6">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => handleChange("system", "imperial")}
              className={`flex-1 py-2 rounded-xl border transition-all ${inputs.system === "imperial" ? "bg-primary text-white border-primary" : "bg-white/5 text-gray-400 border-white/10"}`}
            >
              Imperial (ft/in)
            </button>
            <button
              onClick={() => handleChange("system", "metric")}
              className={`flex-1 py-2 rounded-xl border transition-all ${inputs.system === "metric" ? "bg-primary text-white border-primary" : "bg-white/5 text-gray-400 border-white/10"}`}
            >
              Metric (m/cm)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Total Fence Length ({inputs.system === "imperial" ? "ft" : "m"})</label>
              <input
                type="number"
                value={inputs.fenceLength}
                onChange={(e) => handleChange("fenceLength", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Post Spacing ({inputs.system === "imperial" ? "ft" : "m"})</label>
              <input
                type="number"
                value={inputs.postSpacing}
                onChange={(e) => handleChange("postSpacing", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Rails per Section</label>
              <input
                type="number"
                value={inputs.railCount}
                onChange={(e) => handleChange("railCount", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Picket Width ({inputs.system === "imperial" ? "in" : "cm"})</label>
              <input
                type="number"
                value={inputs.picketWidth}
                onChange={(e) => handleChange("picketWidth", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Picket Spacing ({inputs.system === "imperial" ? "in" : "cm"})</label>
              <input
                type="number"
                value={inputs.picketSpacing}
                onChange={(e) => handleChange("picketSpacing", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Posts needed</h3>
            <p className="text-3xl font-light text-emerald-400">{result.posts}</p>
          </div>
          <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Rails needed</h3>
            <p className="text-3xl font-light text-emerald-400">{result.rails}</p>
          </div>
          <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Pickets needed</h3>
            <p className="text-3xl font-light text-emerald-400">{result.pickets}</p>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
