"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary";

const bmiBands = [
  {
    key: "underweight",
    label: "Underweight",
    range: "Below 18.5",
    min: 0,
    max: 18.5,
    risk: "Weight below the usual healthy range can be associated with nutritional or other health concerns.",
    action: "Discuss unintentional weight loss, appetite issues, or nutrition concerns with a clinician if relevant.",
    chipClass: "border-sky-400/30 bg-sky-500/10 text-sky-700",
  },
  {
    key: "healthy",
    label: "Healthy weight",
    range: "18.5 - 24.9",
    min: 18.5,
    max: 25,
    risk: "This is the standard healthy BMI range for most adults.",
    action: "Focus on maintaining weight, activity, sleep, and a sustainable eating pattern.",
    chipClass: "border-emerald-400/30 bg-emerald-500/10 text-emerald-700",
  },
  {
    key: "overweight",
    label: "Overweight",
    range: "25.0 - 29.9",
    min: 25,
    max: 30,
    risk: "A BMI in this range can be associated with increased health risk, especially alongside other risk factors.",
    action: "A modest reduction in weight, routine activity, and nutrition changes may improve risk markers.",
    chipClass: "border-amber-400/30 bg-amber-500/10 text-amber-700",
  },
  {
    key: "obesity-1",
    label: "Obesity class I",
    range: "30.0 - 34.9",
    min: 30,
    max: 35,
    risk: "This range is associated with a higher likelihood of weight-related health problems.",
    action: "Consider structured weight-management support and medical guidance, especially if you have other risk factors.",
    chipClass: "border-orange-400/30 bg-orange-500/10 text-orange-700",
  },
  {
    key: "obesity-2",
    label: "Obesity class II",
    range: "35.0 - 39.9",
    min: 35,
    max: 40,
    risk: "Health risk is typically higher in this range and deserves closer medical attention.",
    action: "Professional support can help with safe planning, screening, and treatment options.",
    chipClass: "border-rose-400/30 bg-rose-500/10 text-rose-700",
  },
  {
    key: "obesity-3",
    label: "Obesity class III",
    range: "40.0 and above",
    min: 40,
    max: Number.POSITIVE_INFINITY,
    risk: "This range is associated with substantially higher health risk and should not be self-managed casually.",
    action: "Seek clinician-led support for individualized next steps.",
    chipClass: "border-red-400/30 bg-red-500/10 text-red-700",
  },
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatNumber(value: number, digits = 1) {
  return Number.isFinite(value) ? value.toFixed(digits) : "0.0";
}

export default function BMICalculator() {
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(7);
  const [weightLb, setWeightLb] = useState(154);
  const [age, setAge] = useState(30);
  const [sex, setSex] = useState<"female" | "male" | "prefer-not">("prefer-not");

  const bmi = useMemo(() => {
    if (unitSystem === "metric") {
      if (heightCm <= 0 || weightKg <= 0) return 0;
      const heightM = heightCm / 100;
      return weightKg / (heightM * heightM);
    }

    const totalInches = heightFt * 12 + heightIn;
    if (totalInches <= 0 || weightLb <= 0) return 0;
    return (703 * weightLb) / (totalInches * totalInches);
  }, [unitSystem, heightCm, weightKg, heightFt, heightIn, weightLb]);

  const activeBand = useMemo(() => {
    if (bmi <= 0) return null;
    return bmiBands.find((band) => bmi >= band.min && bmi < band.max) ?? bmiBands[bmiBands.length - 1];
  }, [bmi]);

  const idealWeightRange = useMemo(() => {
    if (unitSystem === "metric") {
      if (heightCm <= 0) return { min: 0, max: 0 };
      const heightM = heightCm / 100;
      return {
        min: 18.5 * heightM * heightM,
        max: 24.9 * heightM * heightM,
      };
    }

    const totalInches = heightFt * 12 + heightIn;
    if (totalInches <= 0) return { min: 0, max: 0 };
    return {
      min: (18.5 * totalInches * totalInches) / 703,
      max: (24.9 * totalInches * totalInches) / 703,
    };
  }, [unitSystem, heightCm, heightFt, heightIn]);

  const healthyTargetMessage = useMemo(() => {
    if (bmi <= 0) return "";

    if (unitSystem === "metric") {
      if (bmi < 18.5) {
        return `To reach BMI 18.5, you would need about ${formatNumber(idealWeightRange.min - weightKg)} kg more.`;
      }
      if (bmi > 24.9) {
        return `To reach BMI 24.9, you would need about ${formatNumber(weightKg - idealWeightRange.max)} kg less.`;
      }
      return "You are already within the standard healthy BMI range for adults.";
    }

    if (bmi < 18.5) {
      return `To reach BMI 18.5, you would need about ${formatNumber(idealWeightRange.min - weightLb)} lb more.`;
    }
    if (bmi > 24.9) {
      return `To reach BMI 24.9, you would need about ${formatNumber(weightLb - idealWeightRange.max)} lb less.`;
    }
    return "You are already within the standard healthy BMI range for adults.";
  }, [bmi, unitSystem, idealWeightRange, weightKg, weightLb]);

  const example = useMemo(() => {
    if (unitSystem === "metric") {
      return "Example: 70 kg and 170 cm = BMI 24.2";
    }
    return "Example: 154 lb and 5 ft 7 in = BMI 24.1";
  }, [unitSystem]);

  const markerPosition = `${((clamp(bmi || 0, 10, 40) - 10) / 30) * 100}%`;
  const useAgeNote = age < 20
    ? "Adult BMI categories are intended for ages 20 and older. Children and teens should use BMI-for-age percentiles."
    : sex === "prefer-not"
      ? "BMI uses height and weight only. Sex and age do not change the adult formula, but they can affect interpretation."
      : `BMI still uses the same formula for ${sex === "female" ? "women" : "men"}, but body composition can differ at the same BMI.`;

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_24rem]">
          <div className="space-y-6">
            <div className="rounded-[1.25rem] border border-primary/15 bg-primary-soft p-4">
              <p className="text-sm font-semibold text-primary-soft-foreground">BMI = weight relative to height.</p>
              <p className="mt-1 text-sm leading-6 text-primary-soft-foreground">
                In metric units, BMI = weight (kg) / height (m)^2. {example}
              </p>
            </div>

            <div className="flex w-full items-center rounded-[1rem] border border-border bg-muted/30 p-1">
              <button
                type="button"
                onClick={() => setUnitSystem("metric")}
                className={`flex-1 rounded-[0.75rem] py-2 text-sm font-medium transition-colors ${
                  unitSystem === "metric" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Metric (kg, cm)
              </button>
              <button
                type="button"
                onClick={() => setUnitSystem("imperial")}
                className={`flex-1 rounded-[0.75rem] py-2 text-sm font-medium transition-colors ${
                  unitSystem === "imperial" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Imperial (lb, ft/in)
              </button>
            </div>

            {unitSystem === "metric" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Height (cm)</span>
                  <input
                    type="number"
                    min={0}
                    value={heightCm}
                    onChange={(event) => setHeightCm(Number(event.target.value))}
                    className={fieldClass}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Weight (kg)</span>
                  <input
                    type="number"
                    min={0}
                    value={weightKg}
                    onChange={(event) => setWeightKg(Number(event.target.value))}
                    className={fieldClass}
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Height (ft)</span>
                    <input
                      type="number"
                      min={0}
                      value={heightFt}
                      onChange={(event) => setHeightFt(Number(event.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Height (in)</span>
                    <input
                      type="number"
                      min={0}
                      max={11}
                      value={heightIn}
                      onChange={(event) => setHeightIn(Number(event.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Weight (lb)</span>
                    <input
                      type="number"
                      min={0}
                      value={weightLb}
                      onChange={(event) => setWeightLb(Number(event.target.value))}
                      className={fieldClass}
                    />
                  </label>
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Age (optional)</span>
                <input
                  type="number"
                  min={0}
                  value={age}
                  onChange={(event) => setAge(Number(event.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Sex (optional)</span>
                <select
                  value={sex}
                  onChange={(event) => setSex(event.target.value as "female" | "male" | "prefer-not")}
                  className={fieldClass}
                >
                  <option value="prefer-not">Prefer not to say</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </label>
            </div>

            <div className="rounded-[1.25rem] border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">Healthy BMI range for adults</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                The standard adult BMI range is 18.5 to 24.9. BMI is a screening tool, not a diagnosis.
              </p>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">{useAgeNote}</p>
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Your BMI</p>
            <div className="mt-3 text-5xl font-semibold tracking-tight text-foreground">
              {bmi > 0 ? formatNumber(bmi) : "0.0"}
            </div>

            {activeBand ? (
              <>
                <div className={`mt-4 inline-flex rounded-full border px-4 py-1.5 text-sm font-semibold ${activeBand.chipClass}`}>
                  {activeBand.label}
                </div>

                <div className="mt-6">
                  <div className="relative h-3 rounded-full bg-[linear-gradient(90deg,#60a5fa_0%,#60a5fa_20%,#34d399_20%,#34d399_50%,#fbbf24_50%,#fbbf24_66%,#fb7185_66%,#ef4444_100%)]">
                    <div
                      className="absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-background bg-foreground shadow"
                      style={{ left: markerPosition }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                    <span>18.5</span>
                    <span>24.9</span>
                    <span>30</span>
                    <span>40+</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3 border-t border-border pt-5">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Interpretation</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{activeBand.risk}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">What you can do next</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{activeBand.action}</p>
                  </div>
                </div>
              </>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Healthy range</p>
          <p className="mt-3 text-xl font-semibold text-foreground">18.5 - 24.9</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Standard adult BMI classification range used for screening.</p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Weight range for your height</p>
          <p className="mt-3 text-xl font-semibold text-foreground">
            {unitSystem === "metric"
              ? `${formatNumber(idealWeightRange.min)} - ${formatNumber(idealWeightRange.max)} kg`
              : `${formatNumber(idealWeightRange.min)} - ${formatNumber(idealWeightRange.max)} lb`}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Estimated from BMI 18.5 to 24.9 for your entered height.</p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Personalized note</p>
          <p className="mt-3 text-sm font-semibold text-foreground">{healthyTargetMessage}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Use this as a planning cue, not a diagnosis or treatment goal.</p>
        </article>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {bmiBands.slice(0, 4).map((band) => (
          <article key={band.key} className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-sm font-semibold text-foreground">{band.label}</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{band.range}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{band.risk}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">What BMI does and does not tell you</h2>
          <div className="mt-4 space-y-3">
            <p className="rounded-[1rem] border border-border/70 bg-muted/20 p-3 text-sm leading-6 text-muted-foreground">
              BMI helps screen for weight categories that may relate to health risk.
            </p>
            <p className="rounded-[1rem] border border-border/70 bg-muted/20 p-3 text-sm leading-6 text-muted-foreground">
              BMI does not directly measure body fat, muscle mass, or where fat is carried on the body.
            </p>
            <p className="rounded-[1rem] border border-border/70 bg-muted/20 p-3 text-sm leading-6 text-muted-foreground">
              Children, teens, pregnant people, and very muscular adults often need different context than BMI alone.
            </p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">Next health tools</h2>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href="/health/calorie-calculator" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              Calorie calculator
            </Link>
            <Link href="/health/bmr-calculator" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              BMR calculator
            </Link>
            <Link href="/health/body-fat-calculator" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              Body fat estimator
            </Link>
            <Link href="/health/waist-to-hip-calculator" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              Waist-to-hip ratio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
