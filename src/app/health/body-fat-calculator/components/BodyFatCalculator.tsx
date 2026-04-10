"use client";

import React, { useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";

export function BodyFatCalculator() {
  const [result, setResult] = useState<any>(null);

  return (
    <CalculatorLayout
      title="Body Fat Percentage Estimator"
      description="Estimate your body fat percentage using US Navy circumference method."
    >
      <div className="space-y-6 text-white">
        <p>Implementation coming soon...</p>
      </div>
    </CalculatorLayout>
  );
}
