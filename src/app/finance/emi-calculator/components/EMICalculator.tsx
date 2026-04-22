"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { CURRENCIES, buildAmortization, calculateEMI, type Currency } from "@/lib/tools/emi";

const DEFAULT_MONTHLY_INCOME: Record<string, number> = {
  USD: 6_500,
  EUR: 5_000,
  GBP: 4_500,
  AED: 18_000,
  INR: 150_000,
};

function getDefaultMonthlyIncome(code: string) {
  return DEFAULT_MONTHLY_INCOME[code] ?? 5_000;
}

function calculateMaxAffordableLoan(monthlyBudget: number, annualRate: number, tenureMonths: number) {
  if (monthlyBudget <= 0) return 0;

  let low = 0;
  let high = 50_000_000;

  for (let index = 0; index < 50; index += 1) {
    const mid = (low + high) / 2;
    const emi = calculateEMI(mid, annualRate, tenureMonths).emi;

    if (emi > monthlyBudget) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return low;
}

function formatCurrency(value: number, currency: Currency) {
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function EMICalculator() {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [loanPreset, setLoanPreset] = useState<"home" | "car" | "personal">("home");
  const [principal, setPrincipal] = useState<number>(currency.defaultLoan);
  const [rate, setRate] = useState<number>(currency.defaultRate);
  const [tenure, setTenure] = useState<number>(currency.defaultTenure);
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState<number>(getDefaultMonthlyIncome(currency.code));
  const [monthlyDebts, setMonthlyDebts] = useState<number>(0);
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
  const emiToIncomeRatio = grossMonthlyIncome > 0 ? result.emi / grossMonthlyIncome : 0;
  const totalDebtRatio = grossMonthlyIncome > 0 ? (result.emi + monthlyDebts) / grossMonthlyIncome : 0;
  const recommendedEmiBudget = grossMonthlyIncome > 0
    ? Math.max(0, Math.min(grossMonthlyIncome * 0.25, grossMonthlyIncome * 0.4 - monthlyDebts))
    : 0;
  const maxAffordableLoan = useMemo(
    () => calculateMaxAffordableLoan(recommendedEmiBudget, rate, tenure),
    [recommendedEmiBudget, rate, tenure],
  );

  const affordabilityState =
    grossMonthlyIncome <= 0
      ? {
          label: "Add income for affordability",
          className: "border-slate-300/50 bg-slate-50 text-slate-950",
          message: "Enter income and other debts to turn the EMI into a decision signal.",
        }
      : emiToIncomeRatio <= 0.25 && totalDebtRatio <= 0.4
        ? {
            label: "Within a common comfort range",
            className: "border-emerald-300/50 bg-emerald-50 text-emerald-950",
            message: "This EMI looks manageable against a common 20% to 25% payment guideline.",
          }
        : emiToIncomeRatio <= 0.33 && totalDebtRatio <= 0.5
          ? {
              label: "Stretching the budget",
              className: "border-amber-300/50 bg-amber-50 text-amber-950",
              message: "The payment may work, but it leaves less room for savings and unexpected costs.",
            }
          : {
              label: "High repayment risk",
              className: "border-rose-300/50 bg-rose-50 text-rose-950",
              message: "This EMI is high relative to income or existing debts and deserves a closer review.",
            };

  const handlePresetChange = (preset: "home" | "car" | "personal") => {
    setLoanPreset(preset);

    if (preset === "home") {
      setPrincipal(currency.defaultLoan);
      setRate(currency.defaultRate);
      setTenure(currency.defaultTenure);
      return;
    }

    if (preset === "car") {
      const financedAmount = Math.max(
        0,
        currency.carDefaults.vehiclePrice - currency.carDefaults.downPayment - currency.carDefaults.tradeIn,
      );
      setPrincipal(financedAmount);
      setRate(currency.carDefaults.newCarRate);
      setTenure(currency.carDefaults.tenure);
      return;
    }

    setPrincipal(Math.max(currency.minLoan, Math.round(currency.defaultLoan * 0.2)));
    setRate(Math.max(1, currency.defaultRate + 2));
    setTenure(Math.min(84, currency.defaultTenure));
  };

  const handleCurrencyChange = (code: string) => {
    const selected = CURRENCIES.find((item) => item.code === code) ?? CURRENCIES[0];
    setCurrency(selected);
    setGrossMonthlyIncome(getDefaultMonthlyIncome(selected.code));
    setMonthlyDebts(0);
    setLoanPreset("home");
    setPrincipal(selected.defaultLoan);
    setRate(selected.defaultRate);
    setTenure(selected.defaultTenure);
  };

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_20rem]">
          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Loan type preset</span>
              <div className="grid gap-3 sm:grid-cols-3">
                {([
                  ["home", "Home loan"],
                  ["car", "Car loan"],
                  ["personal", "Personal loan"],
                ] as const).map(([preset, label]) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetChange(preset)}
                    className={`rounded-[1rem] border px-4 py-3 text-sm font-medium transition-colors ${
                      loanPreset === preset
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border bg-background text-foreground hover:border-primary/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

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
                    <p className="text-sm font-medium text-muted-foreground">Gross monthly income</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">{formatCurrency(grossMonthlyIncome, currency)}</p>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.max(currency.defaultLoan / 10, grossMonthlyIncome * 2, 20_000)}
                  step={Math.max(currency.loanStep / 10, 100)}
                  value={grossMonthlyIncome}
                  onChange={(event) => setGrossMonthlyIncome(Number(event.target.value))}
                  className="mt-4 w-full accent-primary"
                />
              </div>

              <div className="rounded-[1.5rem] border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Other monthly debts</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">{formatCurrency(monthlyDebts, currency)}</p>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.max(grossMonthlyIncome, 10_000)}
                  step={Math.max(currency.loanStep / 20, 50)}
                  value={monthlyDebts}
                  onChange={(event) => setMonthlyDebts(Number(event.target.value))}
                  className="mt-4 w-full accent-primary"
                />
              </div>
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
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Recommended EMI budget</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(recommendedEmiBudget, currency)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Estimated max loan</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(maxAffordableLoan, currency)}
                </span>
              </div>
            </div>

            <div className={`mt-6 rounded-[1rem] border p-4 ${affordabilityState.className}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em]">Affordability signal</p>
              <p className="mt-2 text-lg font-semibold">{affordabilityState.label}</p>
              <p className="mt-2 text-xs leading-5">{affordabilityState.message}</p>
              <div className="mt-3 space-y-2 text-xs leading-5">
                <div className="flex items-center justify-between gap-4">
                  <span>EMI to income</span>
                  <span>{grossMonthlyIncome > 0 ? `${(emiToIncomeRatio * 100).toFixed(1)}%` : "--"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Total debt to income</span>
                  <span>{grossMonthlyIncome > 0 ? `${(totalDebtRatio * 100).toFixed(1)}%` : "--"}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">What this EMI means</p>
          <p className="mt-3 text-sm font-semibold text-foreground">
            {result.emi > 0
              ? `${formatCurrency(result.emi, currency)} every month for ${tenure} months`
              : "Add loan inputs to estimate your monthly commitment"}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            EMI is the recurring payment, not the full decision. Interest burden and affordability matter just as much.
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Interest burden</p>
          <p className="mt-3 text-sm font-semibold text-foreground">
            {interestPercent}% of the total repayment is interest
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Longer tenures lower EMI but usually push total interest much higher.
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Decision cue</p>
          <p className="mt-3 text-sm font-semibold text-foreground">
            {formatCurrency(maxAffordableLoan, currency)} is the rough loan ceiling at your current assumptions
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Use this as a planning estimate, then confirm the real offer with your lender.
          </p>
        </article>
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
