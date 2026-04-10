"use client";

import React, { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { calculateFertilityWindow } from "@/lib/tools/ovulation";

export function OvulationCalculator() {
  const [lmpDate, setLmpDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [cycleLength, setCycleLength] = useState<number>(28);

  const results = useMemo(() => {
    return calculateFertilityWindow(new Date(lmpDate), cycleLength);
  }, [lmpDate, cycleLength]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <CalculatorLayout
      title="Ovulation & Fertility Calculator"
      description="Calculate your most fertile days and estimated ovulation date based on your last menstrual period and cycle length."
    >
      <div className="space-y-6">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="space-y-2 text-white">
            <label className="text-sm font-medium text-gray-300">Last Period Start Date</label>
            <input
              type="date"
              value={lmpDate}
              onChange={(e) => setLmpDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2 text-white">
            <label className="text-sm font-medium text-gray-300 flex justify-between">
              <span>Average Cycle Length</span>
              <span className="text-primary">{cycleLength} days</span>
            </label>
            <input
              type="range"
              min="20"
              max="45"
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-tighter pt-1">
              <span>20 Days</span>
              <span>28 Days (Avg)</span>
              <span>45 Days</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-500/10 p-6 rounded-2xl border border-purple-500/20 text-center">
            <h3 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Estimated Ovulation</h3>
            <p className="text-2xl font-medium text-purple-400">
              {formatDate(results.ovulationDate)}
            </p>
          </div>
          <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20 text-center">
            <h3 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Fertility Window</h3>
            <p className="text-2xl font-medium text-emerald-400">
              {formatDate(results.windowStart)} - {formatDate(results.windowEnd)}
            </p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <p className="text-xs text-gray-400 leading-relaxed italic text-center">
            Note: This tool provides estimates only. Menstrual cycles vary, and clinical consultation is recommended for family planning.
          </p>
        </div>
      </div>
    </CalculatorLayout>
  );
}
