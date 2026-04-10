"use client";

import { useMemo, useState } from "react";

import { evaluateScientificExpression, type AngleMode } from "@/lib/tools/scientific";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

const keypad = ["7", "8", "9", "/", "sin(", "4", "5", "6", "*", "cos(", "1", "2", "3", "-", "tan(", "0", ".", "(", ")", "+", "^", "sqrt(", "log(", "ln(", "pi", "e", "!", "%", "abs(", "C"];

function formatValue(value: number) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  return Number.isInteger(value)
    ? value.toString()
    : value.toPrecision(12).replace(/\.?0+$/, "");
}

export default function ScientificCalculator() {
  const [expression, setExpression] = useState("sin(30)+sqrt(16)");
  const [angleMode, setAngleMode] = useState<AngleMode>("deg");

  const result = useMemo(() => {
    try {
      return {
        value: evaluateScientificExpression(expression, angleMode),
        error: "",
      };
    } catch (error) {
      return {
        value: null,
        error: error instanceof Error ? error.message : "Unable to evaluate expression.",
      };
    }
  }, [angleMode, expression]);

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-5">
            <div className="flex w-full items-center rounded-[1rem] border border-border bg-muted/30 p-1">
              {(["deg", "rad"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAngleMode(mode)}
                  className={`flex-1 rounded-[0.75rem] py-2 text-sm font-medium transition-colors ${
                    angleMode === mode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Expression</span>
              <input value={expression} onChange={(e) => setExpression(e.target.value)} className={fieldClass} />
            </label>

            <div className="grid grid-cols-5 gap-2">
              {keypad.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setExpression((current) => (key === "C" ? "" : `${current}${key}`))}
                  className="rounded-[0.9rem] border border-border bg-background px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Result</p>
            <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              {result.value !== null ? formatValue(result.value) : "--"}
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {result.error || "Supports +, -, *, /, %, ^, factorial, parentheses, pi, e, and trig/log functions."}
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
