"use client";

import { useMemo, useState } from "react";

import { calculateChurnRate } from "@/lib/tools/churn-rate";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

function optionalNum(value: string) {
  if (value.trim() === "") {
    return "";
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function ChurnRateCalculator() {
  const [customersAtStart, setCustomersAtStart] = useState<number | "">(1000);
  const [customersLost, setCustomersLost] = useState<number | "">(45);
  const [newCustomers, setNewCustomers] = useState<number | "">(60);
  const [monthlyRecurringRevenueAtStart, setMonthlyRecurringRevenueAtStart] = useState<number | "">(50000);
  const [monthlyRecurringRevenueLost, setMonthlyRecurringRevenueLost] = useState<number | "">(2200);

  const result = useMemo(
    () =>
      calculateChurnRate({
        customersAtStart: customersAtStart === "" ? 0 : customersAtStart,
        customersLost: customersLost === "" ? 0 : customersLost,
        newCustomers: newCustomers === "" ? 0 : newCustomers,
        monthlyRecurringRevenueAtStart:
          monthlyRecurringRevenueAtStart === "" ? 0 : monthlyRecurringRevenueAtStart,
        monthlyRecurringRevenueLost:
          monthlyRecurringRevenueLost === "" ? 0 : monthlyRecurringRevenueLost,
      }),
    [
      customersAtStart,
      customersLost,
      monthlyRecurringRevenueAtStart,
      monthlyRecurringRevenueLost,
      newCustomers,
    ],
  );

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Customers at start</span>
            <input type="number" min={0} value={customersAtStart} onChange={(e) => setCustomersAtStart(optionalNum(e.target.value))} className={fieldClass} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Customers lost</span>
            <input type="number" min={0} value={customersLost} onChange={(e) => setCustomersLost(optionalNum(e.target.value))} className={fieldClass} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">New customers</span>
            <input type="number" min={0} value={newCustomers} onChange={(e) => setNewCustomers(optionalNum(e.target.value))} className={fieldClass} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">MRR at start</span>
            <input type="number" min={0} value={monthlyRecurringRevenueAtStart} onChange={(e) => setMonthlyRecurringRevenueAtStart(optionalNum(e.target.value))} className={fieldClass} />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-muted-foreground">MRR lost</span>
            <input type="number" min={0} value={monthlyRecurringRevenueLost} onChange={(e) => setMonthlyRecurringRevenueLost(optionalNum(e.target.value))} className={fieldClass} />
          </label>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Customer churn", `${result.customerChurnRate.toFixed(2)}%`],
          ["Revenue churn", `${result.revenueChurnRate.toFixed(2)}%`],
          ["Ending customers", result.endingCustomers.toLocaleString()],
          ["Net customer change", result.netCustomerChange.toLocaleString()],
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
