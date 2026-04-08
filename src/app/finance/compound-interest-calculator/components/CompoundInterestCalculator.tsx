"use client";

import { useMemo, useState } from "react";

import { CONTRIBUTION_FREQUENCIES, COMPOUNDING_FREQUENCIES, calculateCompoundInterest } from "@/lib/tools/compound-interest";
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

export default function CompoundInterestCalculator() {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [principal, setPrincipal] = useState<number | "">(currency.savingsDefaults.principal);
  const [contribution, setContribution] = useState<number | "">(currency.savingsDefaults.monthlyContribution);
  const [rate, setRate] = useState<number | "">(currency.savingsDefaults.rate);
  const [years, setYears] = useState<number | "">(currency.savingsDefaults.years);
  const [inflationRate, setInflationRate] = useState<number | "">("");
  const [compoundingFrequency, setCompoundingFrequency] = useState<number>(COMPOUNDING_FREQUENCIES[3].timesPerYear);
  const [contributionFrequency, setContributionFrequency] = useState<number>(CONTRIBUTION_FREQUENCIES[0].paymentsPerYear);

  const handleCurrencyChange = (code: string) => {
    const selected = CURRENCIES.find((item) => item.code === code) ?? CURRENCIES[0];
    setCurrency(selected);
    setPrincipal(selected.savingsDefaults.principal);
    setContribution(selected.savingsDefaults.monthlyContribution);
    setRate(selected.savingsDefaults.rate);
    setYears(selected.savingsDefaults.years);
  };

  const result = useMemo(
    () =>
      calculateCompoundInterest({
        principal: principal === "" ? 0 : principal,
        annualRate: rate === "" ? 0 : rate,
        years: years === "" ? 0 : years,
        contribution: contribution === "" ? 0 : contribution,
        contributionFrequency,
        compoundingFrequency,
        inflationRate: inflationRate === "" ? undefined : inflationRate,
      }),
    [compoundingFrequency, contribution, contributionFrequency, inflationRate, principal, rate, years],
  );

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
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
              <span className="text-sm font-medium text-muted-foreground">Initial deposit</span>
              <input type="number" min={0} value={principal} onChange={(e) => setPrincipal(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Regular contribution</span>
              <input type="number" min={0} value={contribution} onChange={(e) => setContribution(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Annual return rate %</span>
              <input type="number" min={0} value={rate} onChange={(e) => setRate(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Years</span>
              <input type="number" min={0} value={years} onChange={(e) => setYears(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Inflation rate %</span>
              <input type="number" min={0} value={inflationRate} onChange={(e) => setInflationRate(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Compounding</span>
              <select value={compoundingFrequency} onChange={(e) => setCompoundingFrequency(Number(e.target.value))} className={fieldClass}>
                {COMPOUNDING_FREQUENCIES.map((item) => (
                  <option key={item.label} value={item.timesPerYear}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Contribution frequency</span>
              <select value={contributionFrequency} onChange={(e) => setContributionFrequency(Number(e.target.value))} className={fieldClass}>
                {CONTRIBUTION_FREQUENCIES.map((item) => (
                  <option key={item.label} value={item.paymentsPerYear}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Future value
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {formatCurrency(result.futureValue, currency)}
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Total contributions</span>
                <span className="font-medium text-foreground">{formatCurrency(result.totalContributions, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Interest earned</span>
                <span className="font-medium text-foreground">{formatCurrency(result.totalInterest, currency)}</span>
              </div>
              {result.realFutureValue !== undefined ? (
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Real future value</span>
                  <span className="font-medium text-foreground">{formatCurrency(result.realFutureValue, currency)}</span>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Growth table</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Review how contributions and compound growth build balance year by year.
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-[1.25rem] border border-border">
            <thead className="bg-muted">
              <tr>
                {["Year", "Balance", "Contributions", "Interest", "Real Balance"].map((label) => (
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
                  <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">
                    {row.realBalance !== undefined ? formatCurrency(row.realBalance, currency) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
