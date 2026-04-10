"use client";

import React, { useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { NumberInput } from "@/components/NumberInput";

export function GravelMulchVolumeCalculator() {
  const [result, setResult] = useState<number | null>(null);

  return (
    <CalculatorLayout
      title="Gravel / Mulch Volume Calculator"
      description="Calculate the volume and weight of gravel, mulch, or dirt needed for landscaping projects."
    >
      <div className="space-y-6">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-medium text-white mb-4">Input</h3>
          {/* Add form here */}
          <div className="text-gray-400 text-sm">Form goes here</div>
        </div>
        {result !== null && (
          <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20">
            <h3 className="text-xl font-medium text-white mb-2">Results</h3>
            <p className="text-3xl font-light text-emerald-400">{result}</p>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
