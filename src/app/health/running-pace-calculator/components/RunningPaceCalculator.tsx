"use client";

import React, { useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";

export function RunningPaceCalculator() {
  const [result, setResult] = useState<any>(null);

  return (
    <CalculatorLayout
      title="Running Pace Calculator"
      description="Calculate your pace per mile or kilometer for any distance."
    >
      <div className="space-y-6 text-white text-center py-10">
        <p className="text-gray-400">Implementation in progress...</p>
      </div>
    </CalculatorLayout>
  );
}
