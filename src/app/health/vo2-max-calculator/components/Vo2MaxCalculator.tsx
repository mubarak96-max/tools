"use client";

import React, { useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";

export function Vo2MaxCalculator() {
  const [result, setResult] = useState<any>(null);

  return (
    <CalculatorLayout
      title="VO2 Max Estimator"
      description="Estimate your maximum oxygen consumption using various fitness tests."
    >
      <div className="space-y-6 text-white text-center py-10">
        <p className="text-gray-400">Implementation in progress...</p>
      </div>
    </CalculatorLayout>
  );
}
