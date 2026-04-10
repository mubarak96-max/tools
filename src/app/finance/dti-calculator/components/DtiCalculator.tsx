"use client";

import { useMemo, useState } from "react";

import { CURRENCIES, type Currency } from "@/lib/tools/emi";
import { calculateDti } from "@/lib/tools/dti";

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

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export default function DtiCalculator() {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState<number | "">(6_000);
  const [housingPayment, setHousingPayment] = useState<number | "">(1_800);
  const [autoLoans, setAutoLoans] = useState<number | "">(350);
  const [studentLoans, setStudentLoans] = useState<number | "">(250);
  const [creditCards, setCreditCards] = useState<number | "">(150);
  const [personalLoans, setPersonalLoans] = useState<number | "">(0);
  const [otherDebts, setOtherDebts] = useState<number | "">(0);

  const result = useMemo(
    () =>
      calculateDti({
        grossMonthlyIncome: grossMonthlyIncome === "" ? 0 : grossMonthlyIncome,
        housingPayment: housingPayment === "" ? 0 : housingPayment,
        autoLoans: autoLoans === "" ? 0 : autoLoans,
        studentLoans: studentLoans === "" ? 0 : studentLoans,
        creditCards: creditCards === "" ? 0 : creditCards,
        personalLoans: personalLoans === "" ? 0 : personalLoans,
        otherDebts: otherDebts === "" ? 0 : otherDebts,
      }),
    [autoLoans, creditCards, grossMonthlyIncome, housingPayment, otherDebts, personalLoans, studentLoans],
  );

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
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
              <span className="text-sm font-medium text-muted-foreground">Gross monthly income</span>
              <input type="number" min={0} value={grossMonthlyIncome} onChange={(e) => setGrossMonthlyIncome(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Housing payment</span>
              <input type="number" min={0} value={housingPayment} onChange={(e) => setHousingPayment(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Auto loans</span>
              <input type="number" min={0} value={autoLoans} onChange={(e) => setAutoLoans(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Student loans</span>
              <input type="number" min={0} value={studentLoans} onChange={(e) => setStudentLoans(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Credit card minimums</span>
              <input type="number" min={0} value={creditCards} onChange={(e) => setCreditCards(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Personal loans</span>
              <input type="number" min={0} value={personalLoans} onChange={(e) => setPersonalLoans(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Other monthly debts</span>
              <input type="number" min={0} value={otherDebts} onChange={(e) => setOtherDebts(optionalNum(e.target.value))} className={fieldClass} />
            </label>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Debt-to-income ratio
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {formatPercent(result.dtiRatio)}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              CFPB defines DTI as total monthly debt payments divided by gross monthly income.
            </p>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Total monthly debt</span>
                <span className="font-medium text-foreground">{formatCurrency(result.totalMonthlyDebt, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Gross monthly income</span>
                <span className="font-medium text-foreground">{formatCurrency(grossMonthlyIncome === "" ? 0 : grossMonthlyIncome, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Remaining gross income</span>
                <span className="font-medium text-foreground">{formatCurrency(result.remainingGrossIncome, currency)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="tool-frame p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Monthly debt total</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {formatCurrency(result.totalMonthlyDebt, currency)}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Sum of housing and all other monthly debt payments entered above.</p>
        </article>
        <article className="tool-frame p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Gross monthly income</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {formatCurrency(grossMonthlyIncome === "" ? 0 : grossMonthlyIncome, currency)}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Income before taxes and other deductions are taken out.</p>
        </article>
        <article className="tool-frame p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Remaining gross income</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {formatCurrency(result.remainingGrossIncome, currency)}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Gross monthly income left after the monthly debts entered here.</p>
        </article>
        <article className="tool-frame p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Annual gross income</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {formatCurrency(result.annualGrossIncome, currency)}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Monthly gross income multiplied by twelve.</p>
        </article>
      </section>

      <section className="tool-frame p-5">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Scope note</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This page calculates DTI using the CFPB definition only. It does not tell you whether a lender will approve a loan, because different lenders and loan products can apply different DTI limits and underwriting rules.
        </p>
      </section>
    </div>
  );
}
