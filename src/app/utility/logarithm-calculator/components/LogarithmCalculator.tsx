"use client";

import { useMemo, useState } from "react";

import { calculateLogarithms } from "@/lib/tools/logarithm";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

function optionalNum(value: string) {
  if (value.trim() === "") {
    return "";
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatValue(value: number | null) {
  if (value === null) {
    return "--";
  }
  return Number.isInteger(value) ? value.toString() : value.toFixed(8).replace(/\.?0+$/, "");
}

export default function LogarithmCalculator() {
  const [value, setValue] = useState<number | "">(100);
  const [base, setBase] = useState<number | "">(10);

  const result = useMemo(
    () =>
      calculateLogarithms({
        value: value === "" ? 0 : value,
        base: base === "" ? 10 : base,
      }),
    [base, value],
  );

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Value</span>
            <input type="number" step="any" value={value} onChange={(e) => setValue(optionalNum(e.target.value))} className={fieldClass} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Base</span>
            <input type="number" step="any" value={base} onChange={(e) => setBase(optionalNum(e.target.value))} className={fieldClass} />
          </label>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["log base b", formatValue(result.logBaseValue)],
          ["Natural log (ln)", formatValue(result.naturalLog)],
          ["Common log (log10)", formatValue(result.commonLog)],
        ].map(([label, output]) => (
          <article key={label} className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
            <p className="text-sm font-semibold text-muted-foreground">{label}</p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{output}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
