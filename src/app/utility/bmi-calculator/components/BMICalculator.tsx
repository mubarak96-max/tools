"use client";

import { useMemo, useState } from "react";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary transition-shadow";

const selectClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer";

export default function BMICalculator() {
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  
  // Metric
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(70);
  
  // Imperial
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);
  const [weightLb, setWeightLb] = useState<number>(154);

  const bmi = useMemo(() => {
    if (unitSystem === "metric") {
      if (heightCm <= 0 || weightKg <= 0) return 0;
      const heightM = heightCm / 100;
      return weightKg / (heightM * heightM);
    } else {
      const totalInches = heightFt * 12 + heightIn;
      if (totalInches <= 0 || weightLb <= 0) return 0;
      return (weightLb / (totalInches * totalInches)) * 703;
    }
  }, [unitSystem, heightCm, weightKg, heightFt, heightIn, weightLb]);

  const category = useMemo(() => {
    if (bmi === 0) return "Invalid input";
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 25) return "Normal weight";
    if (bmi >= 25 && bmi < 30) return "Overweight";
    if (bmi >= 30 && bmi < 35) return "Obesity (Class 1)";
    if (bmi >= 35 && bmi < 40) return "Obesity (Class 2)";
    return "Severe Obesity (Class 3)";
  }, [bmi]);

  const categoryColor = useMemo(() => {
    if (bmi === 0) return "text-muted-foreground border-border";
    if (bmi < 18.5) return "text-blue-500 border-blue-500/30 bg-blue-500/10";
    if (bmi >= 18.5 && bmi < 25) return "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
    if (bmi >= 25 && bmi < 30) return "text-yellow-500 border-yellow-500/30 bg-yellow-500/10";
    if (bmi >= 30 && bmi < 35) return "text-orange-500 border-orange-500/30 bg-orange-500/10";
    return "text-red-500 border-red-500/30 bg-red-500/10";
  }, [bmi]);

  const idealWeightRange = useMemo(() => {
    if (unitSystem === "metric") {
      if (heightCm <= 0) return { min: 0, max: 0 };
      const heightM = heightCm / 100;
      return {
        min: 18.5 * heightM * heightM,
        max: 24.9 * heightM * heightM,
      };
    } else {
      const totalInches = heightFt * 12 + heightIn;
      if (totalInches <= 0) return { min: 0, max: 0 };
      return {
        min: (18.5 * totalInches * totalInches) / 703,
        max: (24.9 * totalInches * totalInches) / 703,
      };
    }
  }, [unitSystem, heightCm, heightFt, heightIn]);

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_22rem]">
          {/* Inputs */}
          <div className="space-y-6">
            {/* Unit Toggle */}
            <div className="flex w-full items-center rounded-[1rem] border border-border bg-muted/30 p-1">
              <button
                onClick={() => setUnitSystem("metric")}
                className={`flex-1 rounded-[0.75rem] py-2 text-sm font-medium transition-colors ${
                  unitSystem === "metric" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Metric (kg, cm)
              </button>
              <button
                onClick={() => setUnitSystem("imperial")}
                className={`flex-1 rounded-[0.75rem] py-2 text-sm font-medium transition-colors ${
                  unitSystem === "imperial" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Imperial (lb, ft)
              </button>
            </div>

            {unitSystem === "metric" ? (
              <div className="space-y-5">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Height (cm)</span>
                  <input
                    type="number"
                    min={0}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className={fieldClass}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Weight (kg)</span>
                  <input
                    type="number"
                    min={0}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className={fieldClass}
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Height (feet)</span>
                    <input
                      type="number"
                      min={0}
                      value={heightFt}
                      onChange={(e) => setHeightFt(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Height (inches)</span>
                    <input
                      type="number"
                      min={0}
                      max={11}
                      value={heightIn}
                      onChange={(e) => setHeightIn(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                </div>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Weight (lbs)</span>
                  <input
                    type="number"
                    min={0}
                    value={weightLb}
                    onChange={(e) => setWeightLb(Number(e.target.value))}
                    className={fieldClass}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Results aside */}
          <aside className="rounded-[1.5rem] border border-border bg-background p-5 flex flex-col justify-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Your BMI
            </p>
            <div className="mt-4 text-6xl font-bold tracking-tight text-foreground">
              {bmi > 0 ? bmi.toFixed(1) : "0.0"}
            </div>
            
            {bmi > 0 && (
              <div className={`mt-6 inline-flex mx-auto items-center justify-center rounded-full border px-4 py-1.5 text-sm font-medium ${categoryColor}`}>
                {category}
              </div>
            )}

            {bmi > 0 && (
              <div className="mt-8 space-y-3 border-t border-border pt-6">
                <p className="text-sm text-muted-foreground">Ideal weight range for your height:</p>
                <p className="text-lg font-medium text-foreground">
                  {unitSystem === "metric" 
                    ? `${idealWeightRange.min.toFixed(1)} - ${idealWeightRange.max.toFixed(1)} kg`
                    : `${idealWeightRange.min.toFixed(1)} - ${idealWeightRange.max.toFixed(1)} lbs`
                  }
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* Guide Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Underweight", value: "Below 18.5", color: "text-blue-500" },
          { label: "Normal weight", value: "18.5 – 24.9", color: "text-emerald-500" },
          { label: "Overweight", value: "25.0 – 29.9", color: "text-yellow-500" },
          { label: "Obese", value: "30.0 and above", color: "text-red-500" },
        ].map((item) => (
          <article key={item.label} className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
            <p className={`text-sm font-semibold ${item.color}`}>{item.label}</p>
            <p className="mt-2 text-lg font-bold tracking-tight text-foreground">{item.value}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
