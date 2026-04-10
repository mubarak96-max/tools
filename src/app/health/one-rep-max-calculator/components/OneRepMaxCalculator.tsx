"use client";

import React, { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { calculateOneRepMax, type OneRepMaxInputs } from "@/lib/tools/one-rep-max";
import { Dumbbell, Info } from "lucide-react";

export function OneRepMaxCalculator() {
  const [inputs, setInputs] = useState<OneRepMaxInputs>({
    weight: 100,
    reps: 5,
  });

  const results = useMemo(() => {
    return calculateOneRepMax(inputs);
  }, [inputs]);

  return (
    <CalculatorLayout
      title="One Rep Max Calculator"
      description="Estimate your one-rep max (1RM) and see percentage breakdowns for your training cycles."
    >
      <div className="space-y-8">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 text-white">
              <label className="text-sm font-medium text-gray-400">Weight Lifted</label>
              <div className="relative">
                <input
                  type="number"
                  value={inputs.weight}
                  onChange={(e) => setInputs(prev => ({ ...prev, weight: Number(e.target.value) }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-2xl font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <Dumbbell size={20} />
                </div>
              </div>
            </div>

            <div className="space-y-2 text-white">
              <label className="text-sm font-medium text-gray-400">Repetitions</label>
              <input
                type="number"
                min="1"
                max="30"
                value={inputs.reps}
                onChange={(e) => setInputs(prev => ({ ...prev, reps: Number(e.target.value) }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-2xl font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-primary/10 p-8 rounded-2xl border border-primary/20 flex flex-col justify-center text-center">
            <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-widest">Estimated 1RM</h3>
            <p className="text-6xl font-light text-primary tracking-tighter">
              {Math.round(results.oneRepMax).toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-primary/60">Using Brzycki Formula</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 flex items-center gap-2">
              <Info size={14} /> Training Percentages
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {results.percentages.map((p) => (
                <div key={p.percentage} className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 font-bold">{p.percentage}%</span>
                  <span className="text-lg font-medium text-white">{Math.round(p.weight)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
