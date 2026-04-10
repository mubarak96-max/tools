"use client";

import React, { useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";

export function CaffeineCalculator() {
  const [result, setResult] = useState<any>(null);

  return (
    <CalculatorLayout
      title="Coffee Caffeine Intake Tracker"
      description="Track your total caffeine consumption from coffee, tea, and sodas."
    >
      <div className="space-y-6 text-white">
        <p>Implementation coming soon...</p>
      </div>
    </CalculatorLayout>
  );
}
