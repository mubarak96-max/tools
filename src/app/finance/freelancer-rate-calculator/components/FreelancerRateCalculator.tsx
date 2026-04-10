"use client";

import { useMemo, useState } from "react";

import { CURRENCIES, type Currency } from "@/lib/tools/emi";
import { calculateFreelancerRate } from "@/lib/tools/freelancer-rate";

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

export default function FreelancerRateCalculator() {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [targetAnnualPay, setTargetAnnualPay] = useState<number | "">(90_000);
  const [annualBusinessOverhead, setAnnualBusinessOverhead] = useState<number | "">(12_000);
  const [taxSetAsidePercent, setTaxSetAsidePercent] = useState<number | "">(25);
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState<number | "">(25);
  const [workingWeeksPerYear, setWorkingWeeksPerYear] = useState<number | "">(46);

  const result = useMemo(
    () =>
      calculateFreelancerRate({
        targetAnnualPay: targetAnnualPay === "" ? 0 : targetAnnualPay,
        annualBusinessOverhead: annualBusinessOverhead === "" ? 0 : annualBusinessOverhead,
        taxSetAsidePercent: taxSetAsidePercent === "" ? 0 : taxSetAsidePercent,
        billableHoursPerWeek: billableHoursPerWeek === "" ? 0 : billableHoursPerWeek,
        workingWeeksPerYear: workingWeeksPerYear === "" ? 0 : workingWeeksPerYear,
      }),
    [
      annualBusinessOverhead,
      billableHoursPerWeek,
      targetAnnualPay,
      taxSetAsidePercent,
      workingWeeksPerYear,
    ],
  );

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Currency</span>
              <select value={currency.code} onChange={(e) => setCurrency(CURRENCIES.find((item) => item.code === e.target.value) ?? CURRENCIES[0])} className={fieldClass}>
                {CURRENCIES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label} ({item.code})
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Target annual personal pay</span>
              <input type="number" min={0} value={targetAnnualPay} onChange={(e) => setTargetAnnualPay(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Annual business overhead</span>
              <input type="number" min={0} value={annualBusinessOverhead} onChange={(e) => setAnnualBusinessOverhead(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Tax set-aside %</span>
              <input type="number" min={0} max={95} step={0.1} value={taxSetAsidePercent} onChange={(e) => setTaxSetAsidePercent(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Billable hours per week</span>
              <input type="number" min={0} step={0.1} value={billableHoursPerWeek} onChange={(e) => setBillableHoursPerWeek(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Working weeks per year</span>
              <input type="number" min={1} step={1} value={workingWeeksPerYear} onChange={(e) => setWorkingWeeksPerYear(optionalNum(e.target.value))} className={fieldClass} />
            </label>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Target hourly rate
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {formatCurrency(result.hourlyRate, currency)}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Based on target pay, business overhead, tax set-aside, and billable hours.
            </p>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Day rate</span>
                <span className="font-medium text-foreground">{formatCurrency(result.dayRate, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Annual revenue target</span>
                <span className="font-medium text-foreground">{formatCurrency(result.requiredAnnualRevenue, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Billable hours / year</span>
                <span className="font-medium text-foreground">{result.billableHoursPerYear.toFixed(0)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
          <p className="text-sm font-semibold text-muted-foreground">Weekly revenue target</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(result.weeklyRevenueTarget, currency)}
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
          <p className="text-sm font-semibold text-muted-foreground">Tax set-aside</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {typeof taxSetAsidePercent === "number" ? `${taxSetAsidePercent.toFixed(1)}%` : "0.0%"}
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
          <p className="text-sm font-semibold text-muted-foreground">Working weeks</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {typeof workingWeeksPerYear === "number" ? workingWeeksPerYear : 0}
          </p>
        </article>
      </section>
    </div>
  );
}
