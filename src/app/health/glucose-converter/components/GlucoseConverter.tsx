"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary";

const GLUCOSE_FACTOR = 18.0182;

type ContextMode = "general" | "before-meal" | "after-meal";

const CONTEXT_OPTIONS: Array<{
  key: ContextMode;
  label: string;
  description: string;
}> = [
  {
    key: "general",
    label: "General reading",
    description: "Useful when you want a quick low, in-range, or high signal without tying it to a meal.",
  },
  {
    key: "before-meal",
    label: "Before meal",
    description: "Compares your reading to the common 80 to 130 mg/dL target used for many non-pregnant adults with diabetes.",
  },
  {
    key: "after-meal",
    label: "1 to 2 hours after meal",
    description: "Compares your reading to the common below-180 mg/dL after-meal target.",
  },
] as const;

const QUICK_REFERENCES = [
  {
    label: "Low threshold",
    mgdl: 70,
    note: "Below 70 mg/dL is commonly treated as low blood glucose.",
  },
  {
    label: "Before-meal target starts",
    mgdl: 80,
    note: "Common premeal target floor for many non-pregnant adults with diabetes.",
  },
  {
    label: "Before-meal target ceiling",
    mgdl: 130,
    note: "Common premeal target ceiling for many non-pregnant adults with diabetes.",
  },
  {
    label: "After-meal target ceiling",
    mgdl: 180,
    note: "Common 1 to 2 hour after-meal target ceiling for many non-pregnant adults with diabetes.",
  },
] as const;

function toMmol(mgdl: number) {
  return mgdl / GLUCOSE_FACTOR;
}

function toMgdl(mmol: number) {
  return mmol * GLUCOSE_FACTOR;
}

function formatMgdl(value: number) {
  return Number.isFinite(value) ? Math.round(value).toString() : "0";
}

function formatMmol(value: number) {
  return Number.isFinite(value) ? value.toFixed(1) : "0.0";
}

function formatPreset(valueMgdl: number, unit: "mgdl" | "mmol") {
  if (unit === "mgdl") return `${formatMgdl(valueMgdl)} mg/dL`;
  return `${formatMmol(toMmol(valueMgdl))} mmol/L`;
}

function getReadingInsight(mgdl: number, context: ContextMode) {
  if (mgdl <= 0 || !Number.isFinite(mgdl)) {
    return null;
  }

  if (mgdl < 70) {
    return {
      title: "Below low-glucose threshold",
      summary: "This reading is below 70 mg/dL (3.9 mmol/L), which is commonly treated as low blood glucose.",
      action: "If you use glucose-lowering medication or have diabetes, follow the plan your clinician gave you for low readings.",
      tone: "border-rose-300/50 bg-rose-50 text-rose-950",
    };
  }

  if (context === "before-meal") {
    if (mgdl < 80) {
      return {
        title: "Below common premeal target",
        summary: "This is above the low threshold but below the common 80 to 130 mg/dL premeal target used for many adults with diabetes.",
        action: "One reading is not a diagnosis. Check patterns and follow your care team's targets if they differ.",
        tone: "border-amber-300/50 bg-amber-50 text-amber-950",
      };
    }

    if (mgdl <= 130) {
      return {
        title: "Within common premeal target",
        summary: "This reading is inside the common 80 to 130 mg/dL premeal target range for many non-pregnant adults with diabetes.",
        action: "Keep using your own clinician-set target if you have one, because personal goals can differ.",
        tone: "border-emerald-300/50 bg-emerald-50 text-emerald-950",
      };
    }

    return {
      title: "Above common premeal target",
      summary: "This reading is above the common 130 mg/dL premeal target ceiling used for many non-pregnant adults with diabetes.",
      action: "A single result does not diagnose diabetes or poor control. Trends, meal timing, medication, and illness all matter.",
      tone: "border-amber-300/50 bg-amber-50 text-amber-950",
    };
  }

  if (context === "after-meal") {
    if (mgdl < 180) {
      return {
        title: "Within common after-meal target",
        summary: "This reading is below the common 180 mg/dL threshold used for many 1 to 2 hour after-meal checks.",
        action: "After-meal goals can be individualized, so compare against your own care plan when you have one.",
        tone: "border-emerald-300/50 bg-emerald-50 text-emerald-950",
      };
    }

    if (mgdl < 240) {
      return {
        title: "Above common after-meal target",
        summary: "This reading is above the common 180 mg/dL after-meal target used for many adults with diabetes.",
        action: "Look at timing, meal size, medication, and repeated patterns rather than treating one reading as the full story.",
        tone: "border-amber-300/50 bg-amber-50 text-amber-950",
      };
    }

    return {
      title: "High reading",
      summary: "This is a high reading. CDC guidance notes that people with diabetes who are sick and have readings of 240 mg/dL or above may need ketone testing.",
      action: "Follow your clinician's plan for persistent high readings or illness-related glucose spikes.",
      tone: "border-rose-300/50 bg-rose-50 text-rose-950",
    };
  }

  if (mgdl <= 180) {
    return {
      title: "Within a common daily target band",
      summary: "This reading sits within the 70 to 180 mg/dL range often used as a broad time-in-range reference.",
      action: "Use meal timing and your own care plan to decide whether this number is where you want it.",
      tone: "border-sky-300/50 bg-sky-50 text-sky-950",
    };
  }

  return {
    title: "Above a common daily target band",
    summary: "This reading is above the 70 to 180 mg/dL range often used as a broad daily target reference.",
    action: "Repeated highs matter more than one isolated number. Review patterns and clinician-set goals.",
    tone: "border-amber-300/50 bg-amber-50 text-amber-950",
  };
}

export default function GlucoseConverter() {
  const [inputUnit, setInputUnit] = useState<"mgdl" | "mmol">("mgdl");
  const [inputValue, setInputValue] = useState("100");
  const [context, setContext] = useState<ContextMode>("before-meal");

  const numericValue = Number(inputValue);
  const sanitizedValue = Number.isFinite(numericValue) && numericValue >= 0 ? numericValue : 0;

  const glucose = useMemo(() => {
    const mgdl = inputUnit === "mgdl" ? sanitizedValue : toMgdl(sanitizedValue);
    const mmol = inputUnit === "mmol" ? sanitizedValue : toMmol(sanitizedValue);

    return {
      mgdl,
      mmol,
    };
  }, [inputUnit, sanitizedValue]);

  const insight = useMemo(() => getReadingInsight(glucose.mgdl, context), [glucose.mgdl, context]);
  const markerPosition = `${Math.min(100, Math.max(0, (glucose.mgdl / 240) * 100))}%`;

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_24rem]">
          <div className="space-y-6">
            <div className="rounded-[1.25rem] border border-primary/15 bg-primary-soft p-4">
              <p className="text-sm font-semibold text-primary-soft-foreground">Convert blood glucose between mg/dL and mmol/L instantly.</p>
              <p className="mt-1 text-sm leading-6 text-primary-soft-foreground">
                In the United States, glucose is usually reported in mg/dL. Many other countries use mmol/L.
              </p>
            </div>

            <div className="flex w-full items-center rounded-[1rem] border border-border bg-muted/30 p-1">
              <button
                type="button"
                onClick={() => setInputUnit("mgdl")}
                className={`flex-1 rounded-[0.75rem] py-2 text-sm font-medium transition-colors ${
                  inputUnit === "mgdl" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Convert from mg/dL
              </button>
              <button
                type="button"
                onClick={() => setInputUnit("mmol")}
                className={`flex-1 rounded-[0.75rem] py-2 text-sm font-medium transition-colors ${
                  inputUnit === "mmol" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Convert from mmol/L
              </button>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                {inputUnit === "mgdl" ? "Blood glucose (mg/dL)" : "Blood glucose (mmol/L)"}
              </span>
              <input
                type="number"
                min={0}
                step={inputUnit === "mgdl" ? "1" : "0.1"}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                className={fieldClass}
              />
            </label>

            <div className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Interpret this reading as</span>
              <div className="grid gap-3 lg:grid-cols-3">
                {CONTEXT_OPTIONS.map((option) => (
                  <label
                    key={option.key}
                    className={`cursor-pointer rounded-[1.25rem] border p-4 transition-colors ${
                      context === option.key
                        ? "border-primary bg-primary-soft text-primary-soft-foreground"
                        : "border-border bg-background text-foreground hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="context-mode"
                      value={option.key}
                      checked={context === option.key}
                      onChange={() => setContext(option.key)}
                      className="sr-only"
                    />
                    <span className="text-sm font-semibold">{option.label}</span>
                    <span className="mt-1 block text-xs leading-5 opacity-80">{option.description}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">Quick reference values</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_REFERENCES.map((item) => {
                  const value =
                    inputUnit === "mgdl" ? formatMgdl(item.mgdl) : formatMmol(toMmol(item.mgdl));

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setInputValue(value)}
                      className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/25 hover:text-primary"
                    >
                      {item.label}: {formatPreset(item.mgdl, inputUnit)}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                These are reference points, not personal treatment targets. Your clinician may set different goals.
              </p>
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Converted result</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-[1.25rem] border border-border bg-muted/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">mg/dL</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{formatMgdl(glucose.mgdl)}</p>
              </div>
              <div className="rounded-[1.25rem] border border-border bg-muted/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">mmol/L</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{formatMmol(glucose.mmol)}</p>
              </div>
            </div>

            <div className="mt-6 rounded-[1rem] border border-border p-4">
              <p className="text-sm font-semibold text-foreground">Conversion formula</p>
              <p className="mt-2 font-mono text-sm text-foreground">mmol/L = mg/dL / 18.0182</p>
              <p className="mt-1 font-mono text-sm text-foreground">mg/dL = mmol/L x 18.0182</p>
            </div>

            <div className="mt-6">
              <div className="relative h-3 rounded-full bg-[linear-gradient(90deg,#fb7185_0%,#fb7185_29%,#34d399_29%,#34d399_54%,#fbbf24_54%,#fbbf24_75%,#f97316_75%,#ef4444_100%)]">
                <div
                  className="absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-background bg-foreground shadow"
                  style={{ left: markerPosition }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                <span>70</span>
                <span>130</span>
                <span>180</span>
                <span>240+</span>
              </div>
            </div>

            {insight ? (
              <div className={`mt-6 rounded-[1.25rem] border p-4 ${insight.tone}`}>
                <p className="text-sm font-semibold">{insight.title}</p>
                <p className="mt-2 text-xs leading-5">{insight.summary}</p>
                <p className="mt-2 text-xs leading-5">{insight.action}</p>
              </div>
            ) : null}

            <div className="mt-6 rounded-[1.25rem] border border-amber-300/40 bg-amber-50 p-4 text-amber-950">
              <p className="text-sm font-semibold">Medical note</p>
              <p className="mt-1 text-xs leading-5">
                This converter is for education and tracking only. Do not diagnose diabetes or change treatment from one reading without clinician guidance.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Low threshold</p>
          <p className="mt-3 text-xl font-semibold text-foreground">70 mg/dL = 3.9 mmol/L</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Common low-glucose threshold used by ADA and CDC guidance.</p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Before meals</p>
          <p className="mt-3 text-xl font-semibold text-foreground">80 to 130 mg/dL</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">About 4.4 to 7.2 mmol/L for many non-pregnant adults with diabetes.</p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">After meals</p>
          <p className="mt-3 text-xl font-semibold text-foreground">Below 180 mg/dL</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Below 10.0 mmol/L is a common 1 to 2 hour after-meal target.</p>
        </article>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_REFERENCES.map((item) => (
          <article key={item.label} className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-sm font-semibold text-foreground">{item.label}</p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {formatMgdl(item.mgdl)} mg/dL = {formatMmol(toMmol(item.mgdl))} mmol/L
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">How to use this result safely</h2>
          <div className="mt-4 space-y-3">
            <p className="rounded-[1rem] border border-border/70 bg-muted/20 p-3 text-sm leading-6 text-muted-foreground">
              Use the converter to translate the same reading between mg/dL and mmol/L. It does not change the underlying glucose value.
            </p>
            <p className="rounded-[1rem] border border-border/70 bg-muted/20 p-3 text-sm leading-6 text-muted-foreground">
              Home glucose checks, CGM values, and laboratory fasting plasma glucose tests are related, but not interchangeable for diagnosis.
            </p>
            <p className="rounded-[1rem] border border-border/70 bg-muted/20 p-3 text-sm leading-6 text-muted-foreground">
              If your clinician has given you personal targets for pregnancy, insulin use, illness, or frequent lows, follow those targets instead of generic ranges.
            </p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">Related health tools</h2>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href="/health/blood-pressure-calculator" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              Blood pressure checker
            </Link>
            <Link href="/utility/bmi-calculator" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              BMI calculator
            </Link>
            <Link href="/health/calorie-calculator" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              Calorie calculator
            </Link>
            <Link href="/health/water-intake-calculator" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              Water intake calculator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
