"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { CURRENCIES, calculateEMI, type Currency } from "@/lib/tools/emi";
import { CAR_LOAN_TENURES, calculateCarLoan, type CarType } from "@/lib/tools/car-loan";

function formatCurrency(value: number, currency: Currency) {
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: 0,
  }).format(value);
}

function findAffordableLoanAmount(targetEmi: number, annualRate: number, tenureMonths: number) {
  const safeTargetEmi = Math.max(0, targetEmi);
  if (safeTargetEmi <= 0 || tenureMonths <= 0) return 0;

  let low = 0;
  let high = safeTargetEmi * tenureMonths * 2;

  for (let index = 0; index < 60; index += 1) {
    const mid = (low + high) / 2;
    const result = calculateEMI(mid, annualRate, tenureMonths);
    if (result.emi > safeTargetEmi) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return low;
}

function getAffordabilityMessage(ratio: number | null) {
  if (ratio === null) return null;
  if (ratio <= 20) {
    return "Comfortable range based on the common rule of keeping the car payment at or below about 20% of gross monthly income.";
  }
  if (ratio <= 25) {
    return "Possible, but getting close to a stretched payment level for many budgets.";
  }
  return "High monthly commitment relative to income. Consider a shorter budget, larger down payment, or different car.";
}

export default function CarLoanCalculator() {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [mode, setMode] = useState<"payment" | "affordability">("payment");
  const [carType, setCarType] = useState<CarType>("new");
  const [vehiclePrice, setVehiclePrice] = useState<number>(currency.carDefaults.vehiclePrice);
  const [downPayment, setDownPayment] = useState<number>(currency.carDefaults.downPayment);
  const [tradeIn, setTradeIn] = useState<number>(currency.carDefaults.tradeIn);
  const [rate, setRate] = useState<number>(currency.carDefaults.newCarRate);
  const [tenureMonths, setTenureMonths] = useState<number>(currency.carDefaults.tenure);
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState<number>(0);
  const [targetMonthlyPayment, setTargetMonthlyPayment] = useState<number>(0);
  const [comparisonTenure, setComparisonTenure] = useState<number>(36);

  const handleCurrencyChange = (code: string) => {
    const selected = CURRENCIES.find((item) => item.code === code) ?? CURRENCIES[0];
    setCurrency(selected);
    setVehiclePrice(selected.carDefaults.vehiclePrice);
    setDownPayment(selected.carDefaults.downPayment);
    setTradeIn(selected.carDefaults.tradeIn);
    setRate(carType === "new" ? selected.carDefaults.newCarRate : selected.carDefaults.usedCarRate);
    setTenureMonths(selected.carDefaults.tenure);
    setComparisonTenure(selected.carDefaults.tenure === 60 ? 36 : 60);
    setGrossMonthlyIncome(0);
    setTargetMonthlyPayment(0);
  };

  const handleCarTypeChange = (type: CarType) => {
    setCarType(type);
    setRate(type === "new" ? currency.carDefaults.newCarRate : currency.carDefaults.usedCarRate);
  };

  const priceRange = {
    USD: { min: 5_000, max: 200_000, step: 500 },
    EUR: { min: 5_000, max: 150_000, step: 500 },
    GBP: { min: 5_000, max: 150_000, step: 500 },
    AED: { min: 20_000, max: 500_000, step: 1_000 },
    INR: { min: 200_000, max: 5_000_000, step: 10_000 },
  }[currency.code];

  const downPaymentExceeds = downPayment + tradeIn > vehiclePrice;

  const result = useMemo(
    () =>
      calculateCarLoan({
        vehiclePrice,
        downPayment,
        tradeIn,
        annualRate: rate,
        tenureMonths,
      }),
    [vehiclePrice, downPayment, tradeIn, rate, tenureMonths],
  );

  const comparisonResult = useMemo(
    () =>
      calculateCarLoan({
        vehiclePrice,
        downPayment,
        tradeIn,
        annualRate: rate,
        tenureMonths: comparisonTenure,
      }),
    [vehiclePrice, downPayment, tradeIn, rate, comparisonTenure],
  );

  const reverseResult = useMemo(() => {
    const affordableLoan = findAffordableLoanAmount(targetMonthlyPayment, rate, tenureMonths);
    const maximumVehicleBudget = affordableLoan + downPayment + tradeIn;
    const emiResult = calculateEMI(affordableLoan, rate, tenureMonths);

    return {
      affordableLoan,
      maximumVehicleBudget,
      totalInterest: emiResult.totalInterest,
      totalRepayment: emiResult.totalPayment,
    };
  }, [targetMonthlyPayment, rate, tenureMonths, downPayment, tradeIn]);

  const affordabilityRatio = grossMonthlyIncome > 0 ? (result.emi / grossMonthlyIncome) * 100 : null;
  const affordabilityMessage = getAffordabilityMessage(affordabilityRatio);
  const recommendedMaxPayment = grossMonthlyIncome > 0 ? grossMonthlyIncome * 0.2 : 0;
  const stretchPayment = grossMonthlyIncome > 0 ? grossMonthlyIncome * 0.25 : 0;
  const interestDifference = comparisonResult.totalInterest - result.totalInterest;

  const netFinanced = Math.max(0, vehiclePrice - downPayment - tradeIn);
  const paymentGuidance =
    currency.code === "AED"
      ? "For UAE buyers, lender rates vary by bank, salary transfer, vehicle age, and credit profile. Use the prefilled rate only as a planning starting point."
      : "Use the rate input as a planning assumption. Your actual lender quote depends on credit profile, vehicle age, market, and lender fees.";

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Currency</span>
                <select
                  value={currency.code}
                  onChange={(event) => handleCurrencyChange(event.target.value)}
                  className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                >
                  {CURRENCIES.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label} ({item.code})
                    </option>
                  ))}
                </select>
              </label>

              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Calculator mode</span>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    ["payment", "Monthly payment"],
                    ["affordability", "What can I afford"],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setMode(value)}
                      className={`rounded-[1rem] border px-4 py-3 text-sm font-medium transition-colors ${
                        mode === value
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border bg-background text-foreground hover:border-primary/20"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Car type</span>
                <div className="grid grid-cols-2 gap-2">
                  {(["new", "used"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleCarTypeChange(type)}
                      className={`rounded-[1rem] border px-4 py-3 text-sm font-medium transition-colors ${
                        carType === type
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border bg-background text-foreground hover:border-primary/20"
                      }`}
                    >
                      {type === "new" ? "New car" : "Used car"}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {carType === "new"
                    ? `Example starting rate: ${currency.carDefaults.newCarRate}%`
                    : `Example starting rate: ${currency.carDefaults.usedCarRate}%`}
                </p>
              </div>

              <div className="rounded-[1.25rem] border border-primary/15 bg-primary-soft p-4">
                <p className="text-sm font-semibold text-primary-soft-foreground">Affordability framing</p>
                <p className="mt-1 text-sm leading-6 text-primary-soft-foreground">
                  EMI is only one part of the decision. Use your monthly income to judge whether the payment is realistic, not just technically possible.
                </p>
              </div>
            </div>

            {mode === "payment" ? (
              <>
                <div className="rounded-[1.5rem] border border-border bg-background p-4">
                  <p className="text-sm font-medium text-muted-foreground">Vehicle price</p>
                  <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                    {formatCurrency(vehiclePrice, currency)}
                  </p>
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    step={priceRange.step}
                    value={vehiclePrice}
                    onChange={(event) => setVehiclePrice(Number(event.target.value))}
                    className="mt-4 w-full accent-primary"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-border bg-background p-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Down payment ({Math.round((downPayment / Math.max(vehiclePrice, 1)) * 100)}%)
                    </p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                      {formatCurrency(downPayment, currency)}
                    </p>
                    <input
                      type="range"
                      min={0}
                      max={vehiclePrice * 0.9}
                      step={priceRange.step}
                      value={downPayment}
                      onChange={(event) => setDownPayment(Number(event.target.value))}
                      className="mt-4 w-full accent-primary"
                    />
                  </div>

                  <div className="rounded-[1.5rem] border border-border bg-background p-4">
                    <p className="text-sm font-medium text-muted-foreground">Trade-in value</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                      {formatCurrency(tradeIn, currency)}
                    </p>
                    <input
                      type="range"
                      min={0}
                      max={vehiclePrice * 0.5}
                      step={priceRange.step}
                      value={tradeIn}
                      onChange={(event) => setTradeIn(Number(event.target.value))}
                      className="mt-4 w-full accent-primary"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-border bg-background p-4">
                  <p className="text-sm font-medium text-muted-foreground">Target monthly payment</p>
                  <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                    {formatCurrency(targetMonthlyPayment, currency)}
                  </p>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(priceRange.min, currency.carDefaults.vehiclePrice / 10)}
                    step={Math.max(50, priceRange.step / 10)}
                    value={targetMonthlyPayment}
                    onChange={(event) => setTargetMonthlyPayment(Number(event.target.value))}
                    className="mt-4 w-full accent-primary"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Set the payment you want to stay within. The tool will estimate the maximum loan and total car budget.
                  </p>
                </div>

                <div className="grid gap-5">
                  <div className="rounded-[1.5rem] border border-border bg-background p-4">
                    <p className="text-sm font-medium text-muted-foreground">Down payment</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                      {formatCurrency(downPayment, currency)}
                    </p>
                    <input
                      type="range"
                      min={0}
                      max={priceRange.max * 0.4}
                      step={priceRange.step}
                      value={downPayment}
                      onChange={(event) => setDownPayment(Number(event.target.value))}
                      className="mt-4 w-full accent-primary"
                    />
                  </div>
                  <div className="rounded-[1.5rem] border border-border bg-background p-4">
                    <p className="text-sm font-medium text-muted-foreground">Trade-in value</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                      {formatCurrency(tradeIn, currency)}
                    </p>
                    <input
                      type="range"
                      min={0}
                      max={priceRange.max * 0.25}
                      step={priceRange.step}
                      value={tradeIn}
                      onChange={(event) => setTradeIn(Number(event.target.value))}
                      className="mt-4 w-full accent-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-border bg-background p-4">
                <p className="text-sm font-medium text-muted-foreground">Annual interest rate</p>
                <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">{rate}%</p>
                <input
                  type="range"
                  min={0.5}
                  max={25}
                  step={0.1}
                  value={rate}
                  onChange={(event) => setRate(Number(event.target.value))}
                  className="mt-4 w-full accent-primary"
                />
                <p className="mt-2 text-xs text-muted-foreground">{paymentGuidance}</p>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Loan tenure</span>
                <select
                  value={tenureMonths}
                  onChange={(event) => setTenureMonths(Number(event.target.value))}
                  className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                >
                  {CAR_LOAN_TENURES.map((option) => (
                    <option key={option.months} value={option.months}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-border bg-background p-4">
                <p className="text-sm font-medium text-muted-foreground">Gross monthly income (optional)</p>
                <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                  {grossMonthlyIncome > 0 ? formatCurrency(grossMonthlyIncome, currency) : "Not set"}
                </p>
                <input
                  type="range"
                  min={0}
                  max={Math.max(priceRange.max / 2, currency.carDefaults.vehiclePrice)}
                  step={Math.max(100, priceRange.step)}
                  value={grossMonthlyIncome}
                  onChange={(event) => setGrossMonthlyIncome(Number(event.target.value))}
                  className="mt-4 w-full accent-primary"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  A common planning guide is to keep the monthly car payment within roughly 20% to 25% of gross monthly income.
                </p>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Compare with another tenure</span>
                <select
                  value={comparisonTenure}
                  onChange={(event) => setComparisonTenure(Number(event.target.value))}
                  className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                >
                  {CAR_LOAN_TENURES.filter((option) => option.months !== tenureMonths).map((option) => (
                    <option key={option.months} value={option.months}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {downPaymentExceeds ? (
              <div className="rounded-[1rem] border border-warning/20 bg-warning-soft p-4 text-sm text-warning-soft-foreground">
                Down payment plus trade-in exceeds the vehicle price. No financing is needed.
              </div>
            ) : null}
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {mode === "payment" ? "Monthly payment" : "Affordable budget"}
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {mode === "payment"
                ? formatCurrency(result.emi, currency)
                : formatCurrency(reverseResult.maximumVehicleBudget, currency)}
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              {mode === "payment" ? (
                <>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Amount financed</span>
                    <span className="font-medium text-foreground">{formatCurrency(result.amountFinanced, currency)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Total interest</span>
                    <span className="font-medium text-foreground">{formatCurrency(result.totalInterest, currency)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Total repayment</span>
                    <span className="font-medium text-foreground">{formatCurrency(result.totalLoanCost, currency)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Loan after deposit</span>
                    <span className="font-medium text-foreground">{formatCurrency(netFinanced, currency)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Affordable loan</span>
                    <span className="font-medium text-foreground">{formatCurrency(reverseResult.affordableLoan, currency)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Max car budget</span>
                    <span className="font-medium text-foreground">{formatCurrency(reverseResult.maximumVehicleBudget, currency)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Total interest</span>
                    <span className="font-medium text-foreground">{formatCurrency(reverseResult.totalInterest, currency)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Total repayment</span>
                    <span className="font-medium text-foreground">{formatCurrency(reverseResult.totalRepayment, currency)}</span>
                  </div>
                </>
              )}

              <div className="rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-soft-foreground">
                  Results are estimates only
                </p>
                <p className="mt-2 text-sm leading-6 text-primary-soft-foreground/85">
                  Lender fees, insurance, dealer promotions, and approval conditions can change the real cost of borrowing.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Affordability check</p>
          <p className="mt-3 text-xl font-semibold text-foreground">
            {affordabilityRatio === null ? "Add income" : `${affordabilityRatio.toFixed(1)}% of income`}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {affordabilityMessage ?? "Add gross monthly income to compare the payment against a simple affordability rule of thumb."}
          </p>
        </article>

        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Recommended range</p>
          <p className="mt-3 text-xl font-semibold text-foreground">
            {grossMonthlyIncome > 0
              ? `${formatCurrency(recommendedMaxPayment, currency)} - ${formatCurrency(stretchPayment, currency)}`
              : "Set income"}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            A common planning guide is keeping EMI around 20% of gross monthly income, with 25% as a stretched upper band for many budgets.
          </p>
        </article>

        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tenure tradeoff</p>
          <p className="mt-3 text-xl font-semibold text-foreground">
            {formatCurrency(Math.abs(interestDifference), currency)}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {interestDifference > 0
              ? `Your selected tenure saves ${formatCurrency(interestDifference, currency)} in interest versus ${comparisonTenure} months.`
              : `Your selected tenure costs ${formatCurrency(Math.abs(interestDifference), currency)} more in interest versus ${comparisonTenure} months.`}
          </p>
        </article>
      </section>

      <section className="tool-frame p-4 sm:p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Loan comparison</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <article className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Selected plan</p>
            <p className="mt-3 text-2xl font-semibold text-foreground">{tenureMonths} months</p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between gap-4">
                <span>Monthly EMI</span>
                <span className="font-medium text-foreground">{formatCurrency(result.emi, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Total interest</span>
                <span className="font-medium text-foreground">{formatCurrency(result.totalInterest, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Total repayment</span>
                <span className="font-medium text-foreground">{formatCurrency(result.totalLoanCost, currency)}</span>
              </div>
            </div>
          </article>

          <article className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Comparison plan</p>
            <p className="mt-3 text-2xl font-semibold text-foreground">{comparisonTenure} months</p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between gap-4">
                <span>Monthly EMI</span>
                <span className="font-medium text-foreground">{formatCurrency(comparisonResult.emi, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Total interest</span>
                <span className="font-medium text-foreground">{formatCurrency(comparisonResult.totalInterest, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Total repayment</span>
                <span className="font-medium text-foreground">{formatCurrency(comparisonResult.totalLoanCost, currency)}</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">What this means</h2>
          <div className="mt-4 space-y-3">
            <p className="rounded-[1rem] border border-border/70 bg-muted/20 p-3 text-sm leading-6 text-muted-foreground">
              Lower EMI often comes from a longer tenure, but longer tenure usually means a higher total interest bill.
            </p>
            <p className="rounded-[1rem] border border-border/70 bg-muted/20 p-3 text-sm leading-6 text-muted-foreground">
              A larger down payment reduces the loan amount immediately, which cuts both EMI and total interest.
            </p>
            <p className="rounded-[1rem] border border-border/70 bg-muted/20 p-3 text-sm leading-6 text-muted-foreground">
              Use reverse mode when the real question is not "what is the EMI?" but "what car budget fits my monthly plan?"
            </p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">Next finance tools</h2>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href="/finance/salary-calculator" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              Salary calculator
            </Link>
            <Link href="/finance/budget-planner" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              Budget planner
            </Link>
            <Link href="/finance/roi-calculator" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              ROI calculator
            </Link>
            <Link href="/finance/loan-payoff-calculator" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              Loan payoff
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
