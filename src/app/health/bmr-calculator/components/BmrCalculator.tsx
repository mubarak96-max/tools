"use client";

import React, { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { calculateBMR, type BMRInputs, type Gender } from "@/lib/tools/bmr";

export function BmrCalculator() {
  const [inputs, setInputs] = useState<BMRInputs>({
    gender: "male",
    weight: 70,
    height: 170,
    age: 30,
  });

  const bmr = useMemo(() => calculateBMR(inputs), [inputs]);

  const updateInput = (key: keyof BMRInputs, value: string | number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <CalculatorLayout
      title="BMR Calculator"
      description="Basal Metabolic Rate (BMR) is the amount of energy expended while at rest in a neutrally temperate environment."
    >
      <div className="space-y-6">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => updateInput("gender", "male")}
              className={`flex-1 py-3 rounded-xl border transition-all ${inputs.gender === "male" ? "bg-primary text-white border-primary" : "bg-white/5 text-gray-400 border-white/10"}`}
            >
              Male
            </button>
            <button
              onClick={() => updateInput("gender", "female")}
              className={`flex-1 py-3 rounded-xl border transition-all ${inputs.gender === "female" ? "bg-primary text-white border-primary" : "bg-white/5 text-gray-400 border-white/10"}`}
            >
              Female
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Weight (kg)</label>
              <input
                type="number"
                value={inputs.weight}
                onChange={(e) => updateInput("weight", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Height (cm)</label>
              <input
                type="number"
                value={inputs.height}
                onChange={(e) => updateInput("height", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Age</label>
              <input
                type="number"
                value={inputs.age}
                onChange={(e) => updateInput("age", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="bg-emerald-500/10 p-8 rounded-2xl border border-emerald-500/20 text-center">
          <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Your Basal Metabolic Rate</h3>
          <p className="text-5xl font-light text-emerald-400">
            {Math.round(bmr).toLocaleString()} <span className="text-xl text-emerald-400/60 font-normal">kcal/day</span>
          </p>
          <p className="mt-4 text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
            This is the calories your body burns just to stay alive (heart beating, lungs breathing, etc.) without any activity.
          </p>
        </div>
      </div>
    </CalculatorLayout>
  );
}
