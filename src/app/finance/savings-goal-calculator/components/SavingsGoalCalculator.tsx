"use client";

import { useMemo, useState } from "react";

import {
  SAVINGS_GOAL_COMPOUNDING_FREQUENCIES,
  calculateSavingsGoal,
} from "@/lib/tools/savings-goal";
import { CURRENCIES, type Currency } from "@/lib/tools/emi";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

function optionalNum(value: string) {
  if (value.trim() === "") {
    return "";
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number, currency: Currency) {
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function SavingsGoalCalculator() {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [goalAmount, setGoalAmount] = useState<number | "">(100_000);
  const [initialSavings, setInitialSavings] = useState<number | "">(currency.savingsDefaults.principal);
  const [annualRate, setAnnualRate] = useState<number | "">(currency.savingsDefaults.rate);
  const [years, setYears] = useState<number | "">(currency.savingsDefaults.years);
  const [compoundingFrequency, setCompoundingFrequency] = useState<number>(
    SAVINGS_GOAL_COMPOUNDING_FREQUENCIES[3].timesPerYear,
  );

  const handleCurrencyChange = (code: string) => {
    const selected = CURRENCIES.find((item) => item.code === code) ?? CURRENCIES[0];
    setCurrency(selected);
    setInitialSavings(selected.savingsDefaults.principal);
    setAnnualRate(selected.savingsDefaults.rate);
    setYears(selected.savingsDefaults.years);
  };

  const result = useMemo(
    () =>
      calculateSavingsGoal({
        goalAmount: goalAmount === "" ? 0 : goalAmount,
        initialSavings: initialSavings === "" ? 0 : initialSavings,
        annualRate: annualRate === "" ? 0 : annualRate,
        years: years === "" ? 0 : years,
        compoundingFrequency,
      }),
    [annualRate, compoundingFrequency, goalAmount, initialSavings, years],
  );

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Currency</span>
              <select value={currency.code} onChange={(e) => handleCurrencyChange(e.target.value)} className={fieldClass}>
                {CURRENCIES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label} ({item.code})
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Savings goal</span>
              <input type="number" min={0} value={goalAmount} onChange={(e) => setGoalAmount(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Initial savings</span>
              <input type="number" min={0} value={initialSavings} onChange={(e) => setInitialSavings(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Years to grow</span>
              <input type="number" min={1} step={1} value={years} onChange={(e) => setYears(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Estimated annual return %</span>
              <input type="number" min={0} step={0.1} value={annualRate} onChange={(e) => setAnnualRate(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Compounding</span>
              <select value={compoundingFrequency} onChange={(e) => setCompoundingFrequency(Number(e.target.value))} className={fieldClass}>
                {SAVINGS_GOAL_COMPOUNDING_FREQUENCIES.map((item) => (
                  <option key={item.label} value={item.timesPerYear}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Required each month
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {formatCurrency(result.requiredMonthlyContribution, currency)}
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Required each year</span>
                <span className="font-medium text-foreground">{formatCurrency(result.requiredAnnualContribution, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Projected ending balance</span>
                <span className="font-medium text-foreground">{formatCurrency(result.projectedBalance, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Plan length</span>
                <span className="font-medium text-foreground">{formatNumber(result.months)} months</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="tool-frame p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Goal amount</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {formatCurrency(goalAmount === "" ? 0 : goalAmount, currency)}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Your target ending balance.</p>
        </article>
        <article className="tool-frame p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Principal-only value</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {formatCurrency(result.principalOnlyFutureValue, currency)}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">What the initial savings could reach without any new monthly contributions.</p>
        </article>
        <article className="tool-frame p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Total contributions</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {formatCurrency(result.totalContributions, currency)}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Initial savings plus the monthly contributions required to reach the target.</p>
        </article>
        <article className="tool-frame p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Estimated growth</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {formatCurrency(result.totalInterest, currency)}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">The share of the target balance coming from estimated returns instead of direct contributions.</p>
        </article>
      </section>

      <section className="tool-frame p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Savings path</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This schedule assumes monthly contributions made at the end of each month, which matches the way Investor.gov frames its savings goal calculator.
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-[1.25rem] border border-border">
            <thead className="bg-muted">
              <tr>
                {["Year", "Balance", "Contributions", "Growth"].map((label) => (
                  <th
                    key={label}
                    className="border-b border-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.schedule.map((row) => (
                <tr key={row.year} className="bg-card even:bg-background">
                  <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">{row.year}</td>
                  <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">{formatCurrency(row.balance, currency)}</td>
                  <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">{formatCurrency(row.totalContributions, currency)}</td>
                  <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">{formatCurrency(row.totalInterest, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="tool-frame p-5">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Scope note</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This page is a savings-planning calculator, not a market forecast. It uses standard compound-growth math with monthly contributions and the annual return assumption you enter. It does not model taxes, fees, or changing rates over time.
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          If your starting balance could already reach the goal on its own, the required monthly contribution will show as zero.
        </p>
      </section>
    </div>
  );
}
