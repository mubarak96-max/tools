"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { CURRENCIES, buildAmortization, calculateEMI, type Currency } from "@/lib/tools/emi";

function formatCurrency(value: number, currency: Currency) {
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function EMICalculator() {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [principal, setPrincipal] = useState<number>(currency.defaultLoan);
  const [rate, setRate] = useState<number>(currency.defaultRate);
  const [tenure, setTenure] = useState<number>(currency.defaultTenure);
  const [showAmortization, setShowAmortization] = useState(false);

  const result = useMemo(
    () => calculateEMI(principal, rate, tenure),
    [principal, rate, tenure],
  );

  const schedule = useMemo(
    () => (showAmortization ? buildAmortization(principal, rate, tenure) : []),
    [principal, rate, tenure, showAmortization],
  );

  const totalPayment = result.totalPayment || 0;
  const interestPercent = totalPayment > 0 ? Math.round((result.totalInterest / totalPayment) * 100) : 0;

  const handleCurrencyChange = (code: string) => {
    const selected = CURRENCIES.find((item) => item.code === code) ?? CURRENCIES[0];
    setCurrency(selected);
    setPrincipal(selected.defaultLoan);
    setRate(selected.defaultRate);
    setTenure(selected.defaultTenure);
  };

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_20rem]">
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Currency</span>
                <div className="relative">
                  <select
                    value={currency.code}
                    onChange={(event) => handleCurrencyChange(event.target.value)}
                    className="w-full appearance-none rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                  >
                    {CURRENCIES.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.label} ({item.code})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Loan amount</span>
                <input
                  type="number"
                  min={currency.minLoan}
                  max={currency.maxLoan}
                  step={currency.loanStep}
                  value={principal}
                  onChange={(event) => setPrincipal(Number(event.target.value))}
                  className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
            </div>

            <div className="rounded-[1.5rem] border border-border bg-background p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Loan amount</p>
                  <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                    {formatCurrency(principal, currency)}
                  </p>
                </div>
                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {currency.code}
                </span>
              </div>
              <input
                type="range"
                min={currency.minLoan}
                max={currency.maxLoan}
                step={currency.loanStep}
                value={principal}
                onChange={(event) => setPrincipal(Number(event.target.value))}
                className="mt-4 w-full accent-primary"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Annual interest rate</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">{rate}%</p>
                  </div>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={30}
                  step={0.1}
                  value={rate}
                  onChange={(event) => setRate(Number(event.target.value))}
                  className="mt-4 w-full accent-primary"
                />
              </div>

              <div className="rounded-[1.5rem] border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Loan tenure</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                      {tenure} months
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      About {Math.round(tenure / 12)} years
                    </p>
                  </div>
                </div>
                <input
                  type="range"
                  min={6}
                  max={360}
                  step={6}
                  value={tenure}
                  onChange={(event) => setTenure(Number(event.target.value))}
                  className="mt-4 w-full accent-primary"
                />
              </div>
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Monthly EMI
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {formatCurrency(result.emi, currency)}
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Principal</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(principal, currency)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Total interest</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(result.totalInterest, currency)} ({interestPercent}%)
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Total payment</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(result.totalPayment, currency)}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
              <p className="text-sm leading-6 text-primary-soft-foreground">
                Change currency, rate, or tenure to compare repayment scenarios instantly.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="tool-frame p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Amortization schedule
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              See how each monthly EMI splits into principal and interest over the full loan term.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAmortization((current) => !current)}
            className="inline-flex items-center justify-center gap-2 rounded-[1rem] border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
          >
            {showAmortization ? (
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

        {showAmortization ? (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-[1.25rem] border border-border">
              <thead className="bg-muted">
                <tr>
                  {["Month", "EMI", "Principal", "Interest", "Balance"].map((label) => (
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
                {schedule.map((row) => (
                  <tr key={row.month} className="bg-card even:bg-background">
                    <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">
                      {row.month}
                    </td>
                    <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">
                      {formatCurrency(row.emi, currency)}
                    </td>
                    <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">
                      {formatCurrency(row.principalPaid, currency)}
                    </td>
                    <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">
                      {formatCurrency(row.interest, currency)}
                    </td>
                    <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">
                      {formatCurrency(row.balance, currency)}
                    </td>
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


