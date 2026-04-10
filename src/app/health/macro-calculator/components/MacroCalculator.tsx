"use client";

import React, { useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";

export function MacroCalculator() {
  const [result, setResult] = useState<any>(null);

  return (
    <CalculatorLayout
      title="Macro Calculator"
      description="Break down your calories into Protein, Carbs, and Fats based on your goals."
    >
      <div className="space-y-6 text-white">
        <p>Implementation coming soon...</p>
      </div>
    </CalculatorLayout>
  );
}
