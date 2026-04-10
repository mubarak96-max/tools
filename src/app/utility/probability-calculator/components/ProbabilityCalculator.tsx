"use client";

import { useMemo, useState } from "react";

import {
  calculateBasicProbability,
  calculateBinomialProbability,
  calculateCombination,
  calculatePermutation,
} from "@/lib/tools/probability";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

function optionalNum(value: string) {
  if (value.trim() === "") {
    return "";
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(4).replace(/\.?0+$/, "")}%`;
}

function formatValue(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(8).replace(/\.?0+$/, "");
}

export default function ProbabilityCalculator() {
  const [favorableOutcomes, setFavorableOutcomes] = useState<number | "">(3);
  const [totalOutcomes, setTotalOutcomes] = useState<number | "">(10);
  const [n, setN] = useState<number | "">(10);
  const [r, setR] = useState<number | "">(3);
  const [trials, setTrials] = useState<number | "">(10);
  const [successes, setSuccesses] = useState<number | "">(4);
  const [successProbabilityPercent, setSuccessProbabilityPercent] = useState<number | "">(50);

  const basic = useMemo(
    () =>
      calculateBasicProbability({
        favorableOutcomes: favorableOutcomes === "" ? 0 : favorableOutcomes,
        totalOutcomes: totalOutcomes === "" ? 0 : totalOutcomes,
      }),
    [favorableOutcomes, totalOutcomes],
  );
  const combinations = useMemo(
    () => calculateCombination({ n: n === "" ? 0 : n, r: r === "" ? 0 : r }),
    [n, r],
  );
  const permutations = useMemo(
    () => calculatePermutation({ n: n === "" ? 0 : n, r: r === "" ? 0 : r }),
    [n, r],
  );
  const binomial = useMemo(
    () =>
      calculateBinomialProbability({
        trials: trials === "" ? 0 : trials,
        successes: successes === "" ? 0 : successes,
        successProbabilityPercent:
          successProbabilityPercent === "" ? 0 : successProbabilityPercent,
      }),
    [successProbabilityPercent, successes, trials],
  );

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Basic probability</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Favorable outcomes</span>
            <input type="number" min={0} value={favorableOutcomes} onChange={(e) => setFavorableOutcomes(optionalNum(e.target.value))} className={fieldClass} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Total outcomes</span>
            <input type="number" min={0} value={totalOutcomes} onChange={(e) => setTotalOutcomes(optionalNum(e.target.value))} className={fieldClass} />
          </label>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <article className="rounded-[1.25rem] border border-border bg-background p-4 text-center">
            <p className="text-sm font-semibold text-muted-foreground">Probability</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{formatPercent(basic.probability)}</p>
          </article>
          <article className="rounded-[1.25rem] border border-border bg-background p-4 text-center">
            <p className="text-sm font-semibold text-muted-foreground">Complement</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{formatPercent(basic.complement)}</p>
          </article>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="tool-frame p-4 sm:p-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Combinations and permutations</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">n</span>
              <input type="number" min={0} value={n} onChange={(e) => setN(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">r</span>
              <input type="number" min={0} value={r} onChange={(e) => setR(optionalNum(e.target.value))} className={fieldClass} />
            </label>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <article className="rounded-[1.25rem] border border-border bg-background p-4 text-center">
              <p className="text-sm font-semibold text-muted-foreground">nCr</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{formatValue(combinations)}</p>
            </article>
            <article className="rounded-[1.25rem] border border-border bg-background p-4 text-center">
              <p className="text-sm font-semibold text-muted-foreground">nPr</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{formatValue(permutations)}</p>
            </article>
          </div>
        </article>

        <article className="tool-frame p-4 sm:p-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Binomial probability</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Trials (n)</span>
              <input type="number" min={0} value={trials} onChange={(e) => setTrials(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Successes (k)</span>
              <input type="number" min={0} value={successes} onChange={(e) => setSuccesses(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Success probability %</span>
              <input type="number" min={0} max={100} step="0.01" value={successProbabilityPercent} onChange={(e) => setSuccessProbabilityPercent(optionalNum(e.target.value))} className={fieldClass} />
            </label>
          </div>
          <article className="mt-5 rounded-[1.25rem] border border-border bg-background p-4 text-center">
            <p className="text-sm font-semibold text-muted-foreground">P(X = k)</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{formatPercent(binomial)}</p>
          </article>
        </article>
      </section>
    </div>
  );
}
