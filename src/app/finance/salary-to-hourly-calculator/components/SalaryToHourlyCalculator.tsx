"use client";

import { useState } from "react";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary transition-shadow";

export default function SalaryToHourlyCalculator() {
  const [baseAmount, setBaseAmount] = useState<number>(60000);
  const [basePeriod, setBasePeriod] = useState<"hourly" | "daily" | "weekly" | "biweekly" | "monthly" | "annually">("annually");
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);
  const [weeksPerYear, setWeeksPerYear] = useState<number>(52);

  // Math conversions
  const getAnnualSalary = () => {
    switch (basePeriod) {
      case "hourly":
        return baseAmount * hoursPerWeek * weeksPerYear;
      case "daily":
        return baseAmount * daysPerWeek * weeksPerYear;
      case "weekly":
        return baseAmount * weeksPerYear;
      case "biweekly":
        return baseAmount * (weeksPerYear / 2);
      case "monthly":
        return baseAmount * 12;
      case "annually":
        return baseAmount;
      default:
        return baseAmount;
    }
  };

  const annual = getAnnualSalary();
  const monthly = annual / 12;
  const biweekly = annual / (weeksPerYear / 2);
  const weekly = annual / weeksPerYear;
  const daily = weekly / daysPerWeek;
  const hourly = weekly / hoursPerWeek;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(isNaN(val) ? 0 : val);
  };

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_24rem]">
          {/* Inputs */}
          <div className="space-y-8">
            
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Your Earnings</h3>
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-foreground">Pay Amount</span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="number"
                      min={0}
                      value={baseAmount || ""}
                      onChange={(e) => setBaseAmount(Number(e.target.value))}
                      className={`${fieldClass} pl-10`}
                    />
                  </div>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-foreground">Pay Period</span>
                  <select
                    value={basePeriod}
                    onChange={(e) => setBasePeriod(e.target.value as any)}
                    className={`${fieldClass} appearance-none cursor-pointer`}
                  >
                    <option value="hourly">Per Hour</option>
                    <option value="daily">Per Day</option>
                    <option value="weekly">Per Week</option>
                    <option value="biweekly">Every 2 Weeks</option>
                    <option value="monthly">Per Month</option>
                    <option value="annually">Per Year</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Work Schedule Assumptions</h3>
              <div className="grid sm:grid-cols-3 gap-5">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-foreground">Hours per Week</span>
                  <input
                    type="number"
                    min={1}
                    max={168}
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className={fieldClass}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-foreground">Days per Week</span>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                    className={fieldClass}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-foreground">Weeks worked / Yr</span>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={weeksPerYear}
                    onChange={(e) => setWeeksPerYear(Number(e.target.value))}
                    className={fieldClass}
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">Default 52 assumes paid time off.</p>
                </label>
              </div>
            </div>

          </div>

          {/* Results Sidebar */}
          <aside className="rounded-[1.5rem] border border-border bg-card p-6 xl:sticky xl:top-6 h-fit shadow-sm">
            <h3 className="text-base font-semibold text-foreground tracking-tight mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Converted Wage Breakdown
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-border/50 pb-3">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hourly</span>
                  <span className="text-[10px] text-muted-foreground">({hoursPerWeek} hrs/wk)</span>
                </div>
                <span className="text-xl font-bold text-foreground tabular-nums">{formatCurrency(hourly)}</span>
              </div>
              
              <div className="flex justify-between items-end border-b border-border/50 pb-3">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Daily</span>
                  <span className="text-[10px] text-muted-foreground">({hoursPerWeek / daysPerWeek} hrs/day)</span>
                </div>
                <span className="text-xl font-bold text-foreground tabular-nums">{formatCurrency(daily)}</span>
              </div>

              <div className="flex justify-between items-end border-b border-border/50 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Weekly</span>
                <span className="text-xl font-bold text-foreground tabular-nums">{formatCurrency(weekly)}</span>
              </div>

              <div className="flex justify-between items-end border-b border-border/50 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bi-Weekly</span>
                <span className="text-xl font-bold text-foreground tabular-nums">{formatCurrency(biweekly)}</span>
              </div>

              <div className="flex justify-between items-end border-b border-border/50 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monthly</span>
                <span className="text-xl font-bold text-foreground tabular-nums">{formatCurrency(monthly)}</span>
              </div>

              <div className="flex justify-between items-end pt-2 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                <span className="text-sm font-bold uppercase tracking-wider text-emerald-800">Annual</span>
                <span className="text-2xl font-black text-emerald-600 tabular-nums">{formatCurrency(annual)}</span>
              </div>
            </div>

            <p className="text-center mt-6 text-xs text-muted-foreground">
              This calculation represents gross pay before any tax deductions or income tax bracket applications.
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
