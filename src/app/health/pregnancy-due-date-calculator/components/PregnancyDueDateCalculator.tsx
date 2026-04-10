"use client";

import React, { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { calculatePregnancyDueDate } from "@/lib/tools/ovulation";

export function PregnancyDueDateCalculator() {
  const [lmpDate, setLmpDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const dueDate = useMemo(() => {
    return calculatePregnancyDueDate(new Date(lmpDate));
  }, [lmpDate]);

  return (
    <CalculatorLayout
      title="Pregnancy Due Date Calculator"
      description="Estimate your baby's due date based on the first day of your last menstrual period."
    >
      <div className="space-y-6">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="space-y-2 text-white">
            <label className="text-sm font-medium text-gray-300">Last Menstrual Period (LMP) Start Date</label>
            <input
              type="date"
              value={lmpDate}
              onChange={(e) => setLmpDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="bg-pink-500/10 p-8 rounded-2xl border border-pink-500/20 text-center">
          <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Estimated Due Date</h3>
          <p className="text-4xl font-light text-pink-400">
            {dueDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-6 pt-6 border-t border-pink-500/10 text-white">
            <div>
              <p className="text-xs text-gray-400 mb-1">Current Progress</p>
              <p className="text-lg font-medium">Coming Soon...</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Days to Go</p>
              <p className="text-lg font-medium">{Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} Days</p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
