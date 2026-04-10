"use client";

import React, { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { calculateSleepWakeTimes } from "@/lib/tools/sleep";
import { Moon, Sun } from "lucide-react";

export function SleepCalculator() {
  const [bedTime, setBedTime] = useState<string>("22:00");

  const wakeTimes = useMemo(() => {
    return calculateSleepWakeTimes(bedTime);
  }, [bedTime]);

  return (
    <CalculatorLayout
      title="Sleep Cycle Calculator"
      description="Calculate the best time to wake up based on 90-minute sleep cycles. Waking up between cycles leaves you feeling refreshed."
    >
      <div className="space-y-8">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4 max-w-md mx-auto">
          <label className="text-sm font-medium text-gray-300 block text-center">I plan to go to bed at:</label>
          <div className="relative">
            <input
              type="time"
              value={bedTime}
              onChange={(e) => setBedTime(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-2xl text-center text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              <Moon size={20} />
            </div>
          </div>
          <p className="text-[10px] text-gray-500 text-center uppercase tracking-wider">
            Includes 15 minutes to fall asleep
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest text-center">Suggested Wake-up Times</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wakeTimes.map((cycle, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border flex items-center justify-between transition-all ${
                  cycle.cycleCount >= 5 
                    ? "bg-emerald-500/10 border-emerald-500/20" 
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${cycle.cycleCount >= 5 ? "bg-emerald-400/20 text-emerald-400" : "bg-white/10 text-white"}`}>
                    <Sun size={24} />
                  </div>
                  <div>
                    <p className={`text-2xl font-semibold ${cycle.cycleCount >= 5 ? "text-emerald-400" : "text-white"}`}>
                      {cycle.wakeTime}
                    </p>
                    <p className="text-xs text-gray-500">{cycle.cycleCount} Sleep Cycles</p>
                  </div>
                </div>
                {cycle.cycleCount >= 5 && (
                  <span className="text-[10px] font-bold uppercase tracking-tighter bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Recommended</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-sm text-gray-400 leading-relaxed shadow-inner">
          <h4 className="font-semibold text-white mb-2">Why sleep cycles?</h4>
          A good night's sleep consists of several 90-minute cycles. Waking up mid-cycle can lead to grogginess, while waking at the end of a cycle helps you feel alert and energetic. Standard recommendations suggest getting <span className="text-primary font-medium">5 to 6 cycles</span> of sleep.
        </div>
      </div>
    </CalculatorLayout>
  );
}
