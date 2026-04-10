"use client";

import { useMemo, useState } from "react";

import { CURRENCIES, type Currency } from "@/lib/tools/emi";
import { calculateBudgetPlanner } from "@/lib/tools/budget-planner";

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

export default function BudgetPlanner() {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [salaryIncome, setSalaryIncome] = useState<number | "">(4500);
  const [sideIncome, setSideIncome] = useState<number | "">(400);
  const [otherIncome, setOtherIncome] = useState<number | "">(0);
  const [housing, setHousing] = useState<number | "">(1600);
  const [utilities, setUtilities] = useState<number | "">(220);
  const [groceries, setGroceries] = useState<number | "">(500);
  const [transport, setTransport] = useState<number | "">(280);
  const [insurance, setInsurance] = useState<number | "">(180);
  const [debtPayments, setDebtPayments] = useState<number | "">(250);
  const [savings, setSavings] = useState<number | "">(600);
  const [entertainment, setEntertainment] = useState<number | "">(250);
  const [otherExpenses, setOtherExpenses] = useState<number | "">(150);

  const result = useMemo(
    () =>
      calculateBudgetPlanner({
        salaryIncome: salaryIncome === "" ? 0 : salaryIncome,
        sideIncome: sideIncome === "" ? 0 : sideIncome,
        otherIncome: otherIncome === "" ? 0 : otherIncome,
        housing: housing === "" ? 0 : housing,
        utilities: utilities === "" ? 0 : utilities,
        groceries: groceries === "" ? 0 : groceries,
        transport: transport === "" ? 0 : transport,
        insurance: insurance === "" ? 0 : insurance,
        debtPayments: debtPayments === "" ? 0 : debtPayments,
        savings: savings === "" ? 0 : savings,
        entertainment: entertainment === "" ? 0 : entertainment,
        otherExpenses: otherExpenses === "" ? 0 : otherExpenses,
      }),
    [
      debtPayments,
      entertainment,
      groceries,
      housing,
      insurance,
      otherExpenses,
      otherIncome,
      salaryIncome,
      savings,
      sideIncome,
      transport,
      utilities,
    ],
  );

  const cashFlowTone =
    result.netCashFlow >= 0
      ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
      : "text-red-600 border-red-500/30 bg-red-500/10";
  const incomeFields: Array<{
    label: string;
    value: number | "";
    setter: (value: number | "") => void;
  }> = [
    { label: "Salary income", value: salaryIncome, setter: setSalaryIncome },
    { label: "Side income", value: sideIncome, setter: setSideIncome },
    { label: "Other income", value: otherIncome, setter: setOtherIncome },
  ];
  const expenseFields: Array<{
    label: string;
    value: number | "";
    setter: (value: number | "") => void;
  }> = [
    { label: "Housing", value: housing, setter: setHousing },
    { label: "Utilities", value: utilities, setter: setUtilities },
    { label: "Groceries", value: groceries, setter: setGroceries },
    { label: "Transport", value: transport, setter: setTransport },
    { label: "Insurance", value: insurance, setter: setInsurance },
    { label: "Debt payments", value: debtPayments, setter: setDebtPayments },
    { label: "Savings", value: savings, setter: setSavings },
    { label: "Entertainment", value: entertainment, setter: setEntertainment },
    { label: "Other expenses", value: otherExpenses, setter: setOtherExpenses },
  ];

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-6">
            <label className="block space-y-2 md:max-w-xs">
              <span className="text-sm font-medium text-muted-foreground">Currency</span>
              <select value={currency.code} onChange={(e) => setCurrency(CURRENCIES.find((item) => item.code === e.target.value) ?? CURRENCIES[0])} className={fieldClass}>
                {CURRENCIES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label} ({item.code})
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">Monthly income</h2>
                {incomeFields.map(({ label, value, setter }) => (
                  <label key={label} className="block space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">{label}</span>
                    <input
                      type="number"
                      min={0}
                      value={value}
                      onChange={(e) => setter(optionalNum(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                ))}
              </div>

              <div className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">Monthly spending plan</h2>
                {expenseFields.map(({ label, value, setter }) => (
                  <label key={label} className="block space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">{label}</span>
                    <input
                      type="number"
                      min={0}
                      value={value}
                      onChange={(e) => setter(optionalNum(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Monthly cash flow
            </p>
            <div className={`mt-4 rounded-[1rem] border p-4 ${cashFlowTone}`}>
              <p className="text-3xl font-semibold tracking-tight">
                {formatCurrency(result.netCashFlow, currency)}
              </p>
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Total income</span>
                <span className="font-medium text-foreground">{formatCurrency(result.totalIncome, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Total expenses</span>
                <span className="font-medium text-foreground">{formatCurrency(result.totalExpenses, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Needs share</span>
                <span className="font-medium text-foreground">{result.needsShare.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Wants share</span>
                <span className="font-medium text-foreground">{result.wantsShare.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Savings share</span>
                <span className="font-medium text-foreground">{result.savingsShare.toFixed(1)}%</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["Needs", result.needsTotal],
          ["Wants", result.wantsTotal],
          ["Savings", result.savingsTotal],
        ].map(([label, value]) => (
          <article key={label} className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
            <p className="text-sm font-semibold text-muted-foreground">{label}</p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
              {formatCurrency(value as number, currency)}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
