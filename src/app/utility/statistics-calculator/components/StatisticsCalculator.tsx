"use client";

import { useMemo, useState } from "react";

import { calculateStatistics, parseStatisticsValues } from "@/lib/tools/statistics";

const textareaClass =
  "min-h-[12rem] w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none focus:ring-2 focus:ring-primary";

function formatValue(value: number | null) {
  if (value === null) {
    return "--";
  }
  return Number.isInteger(value) ? value.toString() : value.toFixed(8).replace(/\.?0+$/, "");
}

export default function StatisticsCalculator() {
  const [input, setInput] = useState("12, 15, 18, 18, 21, 24, 30");

  const result = useMemo(() => {
    const values = parseStatisticsValues(input);
    return calculateStatistics(values);
  }, [input]);

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-muted-foreground">Numbers (comma, space, or newline separated)</span>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className={textareaClass} />
        </label>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Count", result ? result.count : null],
          ["Sum", result ? result.sum : null],
          ["Mean", result ? result.mean : null],
          ["Median", result ? result.median : null],
          ["Min", result ? result.min : null],
          ["Max", result ? result.max : null],
          ["Range", result ? result.range : null],
          ["Population std dev", result ? result.stdDevPopulation : null],
        ].map(([label, value]) => (
          <article key={label} className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
            <p className="text-sm font-semibold text-muted-foreground">{label}</p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{formatValue(value as number | null)}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="tool-frame p-5">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Mode</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {result
              ? result.modes.length
                ? result.modes.map((value) => formatValue(value)).join(", ")
                : "No repeated values, so this set has no mode."
              : "Enter numbers to calculate modes."}
          </p>
        </article>
        <article className="tool-frame p-5">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Variance</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Population variance: {result ? formatValue(result.variancePopulation) : "--"}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Sample variance: {result ? formatValue(result.varianceSample) : "--"}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Sample standard deviation: {result ? formatValue(result.stdDevSample) : "--"}
          </p>
        </article>
      </section>
    </div>
  );
}
