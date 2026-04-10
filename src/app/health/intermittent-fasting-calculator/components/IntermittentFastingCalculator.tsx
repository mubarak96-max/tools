"use client";

import React, { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { generateFastingSchedule, type FastingMethod } from "@/lib/tools/intermittent-fasting";
import { Clock, Utensils, Zap } from "lucide-react";

export function IntermittentFastingCalculator() {
  const [method, setMethod] = useState<FastingMethod>("16:8");
  const [firstMealTime, setFirstMealTime] = useState<string>("12:00");

  const schedule = useMemo(() => {
    return generateFastingSchedule(method, firstMealTime);
  }, [method, firstMealTime]);

  const methods: { value: FastingMethod; label: string; level: string }[] = [
    { value: "12:12", label: "12:12 (Balanced)", level: "Beginner" },
    { value: "16:8", label: "16:8 (Leangains)", level: "Popular" },
    { value: "18:6", label: "18:6 (Advanced)", level: "Intermediate" },
    { value: "20:4", label: "20:4 (Warrior)", level: "Intense" },
  ];

  return (
    <CalculatorLayout
      title="Intermittent Fasting Schedule"
      description="Create a custom fasting and eating window based on your lifestyle and preferred fasting method."
    >
      <div className="space-y-8">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Choose your method:</label>
              <div className="grid grid-cols-1 gap-2">
                {methods.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMethod(m.value)}
                    className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                      method === m.value 
                        ? "bg-primary/10 border-primary text-white" 
                        : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <div>
                      <p className="font-medium">{m.label}</p>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{m.level}</p>
                    </div>
                    {method === m.value && <div className="h-2 w-2 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Time of first meal:</label>
                <input
                  type="time"
                  value={firstMealTime}
                  onChange={(e) => setFirstMealTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-2xl text-center text-primary focus:outline-none focus:ring-2 focus:ring-primary h-24"
                />
              </div>
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex gap-3 items-center">
                <Zap className="text-primary shrink-0" size={20} />
                <p className="text-xs text-gray-300 leading-relaxed">
                  Tip: Adjust the first meal time to fit your work and sleep schedule. Consistency is key.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-500/10 p-8 rounded-2xl border border-emerald-500/20 relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors">
              <Utensils size={40} />
            </div>
            <h3 className="text-sm font-medium text-emerald-400 mb-4 uppercase tracking-widest">Eating Window</h3>
            <div className="space-y-1">
              <p className="text-3xl font-light text-white leading-none">
                {schedule.eatingStart} - {schedule.eatingEnd}
              </p>
              <p className="text-sm text-gray-400">{schedule.eatDuration} hours total</p>
            </div>
          </div>

          <div className="bg-amber-500/10 p-8 rounded-2xl border border-amber-500/20 relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-amber-500/20 group-hover:text-amber-500/40 transition-colors">
              <Clock size={40} />
            </div>
            <h3 className="text-sm font-medium text-amber-400 mb-4 uppercase tracking-widest">Fasting Window</h3>
            <div className="space-y-1">
              <p className="text-3xl font-light text-white leading-none">
                {schedule.fastingStart} - {schedule.fastingEnd}
              </p>
              <p className="text-sm text-gray-400">{schedule.fastDuration} hours total</p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
