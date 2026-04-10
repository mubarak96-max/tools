"use client";

import { useMemo, useState } from "react";

import { solveQuadratic } from "@/lib/tools/quadratic";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

function optionalNum(value: string) {
  if (value.trim() === "") {
    return "";
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return "--";
  }
  return Number.isInteger(value) ? value.toString() : value.toFixed(6).replace(/\.?0+$/, "");
}

export default function QuadraticEquationSolver() {
  const [a, setA] = useState<number | "">(1);
  const [b, setB] = useState<number | "">(-3);
  const [c, setC] = useState<number | "">(2);

  const result = useMemo(
    () =>
      solveQuadratic({
        a: a === "" ? 0 : a,
        b: b === "" ? 0 : b,
        c: c === "" ? 0 : c,
      }),
    [a, b, c],
  );

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-5 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">a</span>
              <input type="number" value={a} onChange={(e) => setA(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">b</span>
              <input type="number" value={b} onChange={(e) => setB(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">c</span>
              <input type="number" value={c} onChange={(e) => setC(optionalNum(e.target.value))} className={fieldClass} />
            </label>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Roots</p>
            <div className="mt-4 space-y-2 text-lg font-semibold tracking-tight text-foreground">
              {result.roots.map((root) => (
                <p key={root}>{root}</p>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Discriminant", formatNumber(result.discriminant)],
          ["Axis of symmetry", formatNumber(result.axisOfSymmetry)],
          ["Vertex x", formatNumber(result.vertexX)],
          ["Vertex y", formatNumber(result.vertexY)],
        ].map(([label, value]) => (
          <article key={label} className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
            <p className="text-sm font-semibold text-muted-foreground">{label}</p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{value}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
