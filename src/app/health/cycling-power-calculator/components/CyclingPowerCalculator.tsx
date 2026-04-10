"use client";

import React, { useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";

export function CyclingPowerCalculator() {
  const [result, setResult] = useState<any>(null);

  return (
    <CalculatorLayout
      title="Cycling Power to Weight Ratio"
      description="Calculate your Watts per Kilogram (W/kg) to measure cycling performance."
    >
      <div className="space-y-6 text-white text-center py-10">
        <p className="text-gray-400">Implementation in progress...</p>
      </div>
    </CalculatorLayout>
  );
}
