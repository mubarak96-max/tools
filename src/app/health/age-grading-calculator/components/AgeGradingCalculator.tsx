"use client";

import React, { useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";

export function AgeGradingCalculator() {
  const [result, setResult] = useState<any>(null);

  return (
    <CalculatorLayout
      title="Race Age Grading Calculator"
      description="Compare your race times across different ages and genders."
    >
      <div className="space-y-6 text-white text-center py-10">
        <p className="text-gray-400">Implementation in progress...</p>
      </div>
    </CalculatorLayout>
  );
}
