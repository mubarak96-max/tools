"use client";

import React, { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { calculateTDEE, type TDEEInputs, type ActivityLevel } from "@/lib/tools/bmr";

export function CalorieCalculator() {
  const [inputs, setInputs] = useState<TDEEInputs>({
    gender: "male",
    weight: 70,
    height: 170,
    age: 30,
    activityLevel: "moderate",
  });

  const tdee = useMemo(() => calculateTDEE(inputs), [inputs]);

  const updateInput = (key: keyof TDEEInputs, value: any) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const activityLevels: { label: string; value: ActivityLevel; desc: string }[] = [
    { value: "sedentary", label: "Sedentary", desc: "Office job, little to no exercise" },
    { value: "light", label: "Lightly Active", desc: "Exercise 1-3 days / week" },
    { value: "moderate", label: "Moderately Active", desc: "Exercise 3-5 days / week" },
    { value: "active", label: "Active", desc: "Exercise 6-7 days / week" },
    { value: "very-active", label: "Very Active", desc: "Physical job or intense daily training" },
  ];

  return (
    <CalculatorLayout
      title="Calorie Calculator (TDEE)"
      description="Calculate your Total Daily Energy Expenditure (TDEE) to understand how many calories you burn per day."
    >
      <div className="space-y-6">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex gap-4">
            {["male", "female"].map((g) => (
              <button
                key={g}
                onClick={() => updateInput("gender", g)}
                className={`flex-1 py-3 rounded-xl border capitalize transition-all ${inputs.gender === g ? "bg-primary text-white border-primary" : "bg-white/5 text-gray-400 border-white/10"}`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 text-white">
              <label className="text-sm font-medium text-gray-300">Weight (kg)</label>
              <input type="number" value={inputs.weight} onChange={(e) => updateInput("weight", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="space-y-2 text-white">
              <label className="text-sm font-medium text-gray-300">Height (cm)</label>
              <input type="number" value={inputs.height} onChange={(e) => updateInput("height", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="space-y-2 text-white">
              <label className="text-sm font-medium text-gray-300">Age</label>
              <input type="number" value={inputs.age} onChange={(e) => updateInput("age", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Activity Level</label>
            <div className="grid grid-cols-1 gap-2">
              {activityLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => updateInput("activityLevel", level.value)}
                  className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${inputs.activityLevel === level.value ? "bg-primary/10 border-primary text-white" : "bg-white/5 border-white/10 text-gray-400"}`}
                >
                  <div>
                    <p className="font-medium">{level.label}</p>
                    <p className="text-xs text-gray-400">{level.desc}</p>
                  </div>
                  {inputs.activityLevel === level.value && <div className="h-2 w-2 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-primary/10 p-8 rounded-2xl border border-primary/20 text-center">
          <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Estimated Maintenance Calories</h3>
          <p className="text-5xl font-light text-primary">
            {Math.round(tdee).toLocaleString()} <span className="text-xl text-primary/60 font-normal">kcal/day</span>
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-primary/10 text-white">
            <div>
              <p className="text-xs text-gray-400 mb-1">Weight Loss (0.5kg/week)</p>
              <p className="text-lg font-medium">{Math.round(tdee - 500).toLocaleString()} kcal</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Weight Gain (0.5kg/week)</p>
              <p className="text-lg font-medium">{Math.round(tdee + 500).toLocaleString()} kcal</p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
