"use client";

import { useMemo, useState } from "react";

import { calculateSalary, getCountryMeta } from "@/lib/tools/salary";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

function money(value: number) {
  const country = getCountryMeta("AE");
  return new Intl.NumberFormat(country.locale, {
    style: "currency",
    currency: country.currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function num(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function UAESalaryCalculator() {
  const [basicSalary, setBasicSalary] = useState<number | "">("");
  const [housingAllowance, setHousingAllowance] = useState<number | "">("");
  const [transportAllowance, setTransportAllowance] = useState<number | "">("");
  const [otherAllowances, setOtherAllowances] = useState<number | "">("");
  const [overtimePay, setOvertimePay] = useState<number | "">("");
  const [totalDeductions, setTotalDeductions] = useState<number | "">("");

  const asNumber = (value: number | "") => (value === "" ? 0 : value);
  const asInputValue = (value: number | "") => value;
  const asStateValue = (value: string) => (value.trim() === "" ? "" : num(value));

  const result = useMemo(
    () =>
      calculateSalary({
        countryCode: "AE",
        salaryAmount: 0,
        payPeriod: "monthly",
        uaeBasicSalary: asNumber(basicSalary),
        uaeHousingAllowance: asNumber(housingAllowance),
        uaeTransportAllowance: asNumber(transportAllowance),
        uaeOtherAllowances: asNumber(otherAllowances),
        uaeOvertimePay: asNumber(overtimePay),
        uaeTotalDeductions: asNumber(totalDeductions),
      }),
    [
      basicSalary,
      housingAllowance,
      otherAllowances,
      overtimePay,
      totalDeductions,
      transportAllowance,
    ],
  );

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_20rem]">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Basic salary</span>
              <input type="number" min={0} value={asInputValue(basicSalary)} onChange={(e) => setBasicSalary(asStateValue(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Housing allowance</span>
              <input type="number" min={0} value={asInputValue(housingAllowance)} onChange={(e) => setHousingAllowance(asStateValue(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Transport allowance</span>
              <input type="number" min={0} value={asInputValue(transportAllowance)} onChange={(e) => setTransportAllowance(asStateValue(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Other allowances</span>
              <input type="number" min={0} value={asInputValue(otherAllowances)} onChange={(e) => setOtherAllowances(asStateValue(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Overtime pay</span>
              <input type="number" min={0} value={asInputValue(overtimePay)} onChange={(e) => setOvertimePay(asStateValue(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Total deductions</span>
              <input type="number" min={0} value={asInputValue(totalDeductions)} onChange={(e) => setTotalDeductions(asStateValue(e.target.value))} className={fieldClass} />
            </label>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Monthly net salary
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {money(result.periods.monthly.net)}
            </div>
            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Monthly gross</span>
                <span className="font-medium text-foreground">{money(result.periods.monthly.gross)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Monthly deductions</span>
                <span className="font-medium text-foreground">
                  {money(result.totalDeductions / 12)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Annual gross</span>
                <span className="font-medium text-foreground">{money(result.annualGross)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Annual net</span>
                <span className="font-medium text-foreground">{money(result.annualNet)}</span>
              </div>
            </div>
            <div className="mt-6 rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
              <p className="text-sm leading-6 text-primary-soft-foreground">
                UAE salary packages are usually modeled as basic salary plus allowances, not as an income-tax calculation.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Basic salary", value: asNumber(basicSalary) },
          { label: "Allowances", value: asNumber(housingAllowance) + asNumber(transportAllowance) + asNumber(otherAllowances) },
          { label: "Overtime", value: asNumber(overtimePay) },
          { label: "Deductions", value: asNumber(totalDeductions) },
        ].map((item) => (
          <article key={item.label} className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-lg font-semibold tracking-tight text-foreground">{money(item.value)}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
