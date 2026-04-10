"use client";

import React, { useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";

export function BloodPressureCalculator() {
  const [result, setResult] = useState<any>(null);

  return (
    <CalculatorLayout
      title="Blood Pressure Category Checker"
      description="Check your blood pressure category and understand what the numbers mean."
    >
      <div className="space-y-6 text-white">
        <p>Implementation coming soon...</p>
      </div>
    </CalculatorLayout>
  );
}
