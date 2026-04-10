"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { CURRENCIES, type Currency } from "@/lib/tools/emi";
import { calculateCreditCardPayoff } from "@/lib/tools/credit-card-payoff";

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

function formatPayoffTime(months: number | null) {
  if (months === null) {
    return "Not payable";
  }

  if (months === 0) {
    return "Paid off";
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${remainingMonths} months`;
  }

  if (remainingMonths === 0) {
    return `${years} years`;
  }

  return `${years} years ${remainingMonths} months`;
}

export default function CreditCardPayoffCalculator() {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [balance, setBalance] = useState<number | "">(8_000);
  const [annualRate, setAnnualRate] = useState<number | "">(22.9);
  const [monthlyPayment, setMonthlyPayment] = useState<number | "">(250);
  const [extraPayment, setExtraPayment] = useState<number | "">(0);
  const [showSchedule, setShowSchedule] = useState(false);

  const result = useMemo(
    () =>
      calculateCreditCardPayoff({
        balance: balance === "" ? 0 : balance,
        annualRate: annualRate === "" ? 0 : annualRate,
        monthlyPayment: monthlyPayment === "" ? 0 : monthlyPayment,
        extraPayment: extraPayment === "" ? 0 : extraPayment,
      }),
    [annualRate, balance, extraPayment, monthlyPayment],
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
              <span className="text-sm font-medium text-muted-foreground">Current balance</span>
              <input type="number" min={0} value={balance} onChange={(e) => setBalance(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">APR %</span>
              <input type="number" min={0} step={0.01} value={annualRate} onChange={(e) => setAnnualRate(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Monthly payment</span>
              <input type="number" min={0} value={monthlyPayment} onChange={(e) => setMonthlyPayment(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-muted-foreground">Extra payment each month</span>
              <input type="number" min={0} value={extraPayment} onChange={(e) => setExtraPayment(optionalNum(e.target.value))} className={fieldClass} />
            </label>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Estimated payoff time
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {formatPayoffTime(result.monthsToPayoff)}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Based on no new purchases and the same payment every month.
            </p>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Payment used</span>
                <span className="font-medium text-foreground">{formatCurrency(result.paymentUsed, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Total interest</span>
                <span className="font-medium text-foreground">{formatCurrency(result.totalInterest, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Total paid</span>
                <span className="font-medium text-foreground">{formatCurrency(result.totalPaid, currency)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="tool-frame p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">36-month payment</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {formatCurrency(result.paymentForTargetMonths, currency)}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The fixed monthly payment needed to repay the current balance in three years with no new purchases.
          </p>
        </article>
        <article className="tool-frame p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">36-month total cost</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {formatCurrency(result.totalCostForTargetMonths, currency)}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Total amount paid over thirty-six months under the same fixed-APR assumption.
          </p>
        </article>
        <article className="tool-frame p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Current balance</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {formatCurrency(balance === "" ? 0 : balance, currency)}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Starting balance used for the payoff schedule.
          </p>
        </article>
        <article className="tool-frame p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">APR</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {annualRate === "" ? "0.00%" : `${Number(annualRate).toFixed(2)}%`}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Enter the annual percentage rate shown on the balance you want to model.
          </p>
        </article>
      </section>

      {!result.payoffPossible ? (
        <section className="tool-frame border-warning/30 bg-warning-soft p-5">
          <h2 className="text-xl font-semibold tracking-tight text-warning-soft-foreground">Payment too low to pay off the balance</h2>
          <p className="mt-3 text-sm leading-6 text-warning-soft-foreground">
            Under the fixed-APR assumptions used here, the payment entered does not reduce principal. CFPB rules require card issuers to warn consumers when a payment is less than the interest charged each month or would never amortize the balance.
          </p>
        </section>
      ) : null}

      <section className="tool-frame p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Payoff schedule</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Review the month-by-month payoff path under the same APR and payment assumptions shown above.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowSchedule((current) => !current)}
            className="inline-flex items-center justify-center gap-2 rounded-[1rem] border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
          >
            {showSchedule ? (
              <>
                Hide schedule
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show schedule
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {showSchedule ? (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-[1.25rem] border border-border">
              <thead className="bg-muted">
                <tr>
                  {["Month", "Payment", "Principal", "Interest", "Balance"].map((label) => (
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
                  <tr key={row.month} className="bg-card even:bg-background">
                    <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">{row.month}</td>
                    <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">{formatCurrency(row.payment, currency)}</td>
                    <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">{formatCurrency(row.principalPaid, currency)}</td>
                    <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">{formatCurrency(row.interest, currency)}</td>
                    <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">{formatCurrency(row.balance, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <section className="tool-frame p-5">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Scope note</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This calculator assumes a single fixed APR, no new purchases, and the same payment every month. CFPB explains that many card issuers actually calculate interest daily using an average daily balance, so your statement balance can move a little differently from this simplified schedule.
        </p>
      </section>
    </div>
  );
}
