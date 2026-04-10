"use client";

import React, { useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";

export function WaterIntakeCalculator() {
  const [result, setResult] = useState<any>(null);

  return (
    <CalculatorLayout
      title="Water Intake Calculator"
      description="Calculate how much water you should drink daily based on weight and exercise."
    >
      <div className="space-y-6 text-white">
        <p>Implementation coming soon...</p>
      </div>
    </CalculatorLayout>
  );
}
