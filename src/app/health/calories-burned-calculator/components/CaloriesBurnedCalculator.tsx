"use client";

import React, { useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";

export function CaloriesBurnedCalculator() {
  const [result, setResult] = useState<any>(null);

  return (
    <CalculatorLayout
      title="Calories Burned Calculator"
      description="Estimate calories burned during various physical activities and exercises."
    >
      <div className="space-y-6 text-white text-center py-10">
        <p className="text-gray-400">Implementation in progress...</p>
      </div>
    </CalculatorLayout>
  );
}
