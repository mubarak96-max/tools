"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { CURRENCIES, type Currency } from "@/lib/tools/emi";
import { calculateLoanPayoff } from "@/lib/tools/loan-payoff";

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

function formatMonths(months: number) {
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

export default function LoanPayoffCalculator() {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [principal, setPrincipal] = useState<number | "">(25_000);
  const [annualRate, setAnnualRate] = useState<number | "">(7.25);
  const [remainingMonths, setRemainingMonths] = useState<number | "">(60);
  const [extraPayment, setExtraPayment] = useState<number | "">(100);
  const [showSchedule, setShowSchedule] = useState(false);

  const result = useMemo(
    () =>
      calculateLoanPayoff({
        principal: principal === "" ? 0 : principal,
        annualRate: annualRate === "" ? 0 : annualRate,
        remainingMonths: remainingMonths === "" ? 1 : remainingMonths,
        extraPayment: extraPayment === "" ? 0 : extraPayment,
      }),
    [annualRate, extraPayment, principal, remainingMonths],
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
              <span className="text-sm font-medium text-muted-foreground">Current loan balance</span>
              <input type="number" min={0} value={principal} onChange={(e) => setPrincipal(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">APR %</span>
              <input type="number" min={0} step={0.01} value={annualRate} onChange={(e) => setAnnualRate(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Months remaining</span>
              <input type="number" min={1} step={1} value={remainingMonths} onChange={(e) => setRemainingMonths(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-muted-foreground">Extra payment each month</span>
              <input type="number" min={0} step={0.01} value={extraPayment} onChange={(e) => setExtraPayment(optionalNum(e.target.value))} className={fieldClass} />
            </label>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Accelerated payoff time
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {formatMonths(result.acceleratedMonths)}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.monthsSaved > 0
                ? `${result.monthsSaved} months faster than the standard schedule.`
                : "No time saved without extra payment."}
            </p>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Scheduled payment</span>
                <span className="font-medium text-foreground">{formatCurrency(result.scheduledPayment, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Interest saved</span>
                <span className="font-medium text-foreground">{formatCurrency(result.interestSaved, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Extra payment</span>
                <span className="font-medium text-foreground">{formatCurrency(extraPayment === "" ? 0 : extraPayment, currency)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="tool-frame p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Standard payoff</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{formatMonths(result.standardMonths)}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Time to payoff with the scheduled amortizing payment and no extra principal.
          </p>
        </article>
        <article className="tool-frame p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Accelerated interest</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{formatCurrency(result.acceleratedTotalInterest, currency)}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Total interest paid when the extra monthly amount is added each period.
          </p>
        </article>
        <article className="tool-frame p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Standard interest</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{formatCurrency(result.standardTotalInterest, currency)}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Interest paid if the loan stays on the original remaining schedule.
          </p>
        </article>
        <article className="tool-frame p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Total paid with extra</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{formatCurrency(result.acceleratedTotalPaid, currency)}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Principal and interest combined under the accelerated payoff plan.
          </p>
        </article>
      </section>

      <section className="tool-frame p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Accelerated payoff schedule</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This table uses the fixed APR and extra-payment assumptions entered above.
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
    </div>
  );
}
