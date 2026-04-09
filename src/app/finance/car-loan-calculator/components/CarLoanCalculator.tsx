"use client";

import { useMemo, useState } from "react";

import { CURRENCIES, type Currency } from "@/lib/tools/emi";
import { CAR_LOAN_TENURES, calculateCarLoan, type CarType } from "@/lib/tools/car-loan";

function formatCurrency(value: number, currency: Currency) {
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CarLoanCalculator() {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [carType, setCarType] = useState<CarType>("new");
  const [vehiclePrice, setVehiclePrice] = useState<number>(currency.carDefaults.vehiclePrice);
  const [downPayment, setDownPayment] = useState<number>(currency.carDefaults.downPayment);
  const [tradeIn, setTradeIn] = useState<number>(currency.carDefaults.tradeIn);
  const [rate, setRate] = useState<number>(currency.carDefaults.newCarRate);
  const [tenureMonths, setTenureMonths] = useState<number>(currency.carDefaults.tenure);

  const handleCurrencyChange = (code: string) => {
    const selected = CURRENCIES.find((item) => item.code === code) ?? CURRENCIES[0];
    setCurrency(selected);
    setVehiclePrice(selected.carDefaults.vehiclePrice);
    setDownPayment(selected.carDefaults.downPayment);
    setTradeIn(selected.carDefaults.tradeIn);
    setRate(carType === "new" ? selected.carDefaults.newCarRate : selected.carDefaults.usedCarRate);
    setTenureMonths(selected.carDefaults.tenure);
  };

  const handleCarTypeChange = (type: CarType) => {
    setCarType(type);
    setRate(type === "new" ? currency.carDefaults.newCarRate : currency.carDefaults.usedCarRate);
  };

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

  const downPaymentExceeds = downPayment + tradeIn > vehiclePrice;
  const netFinanced = Math.max(0, vehiclePrice - downPayment - tradeIn);

  const priceRange = {
    USD: { min: 5_000, max: 200_000, step: 500 },
    EUR: { min: 5_000, max: 150_000, step: 500 },
    GBP: { min: 5_000, max: 150_000, step: 500 },
    AED: { min: 20_000, max: 500_000, step: 1_000 },
    INR: { min: 200_000, max: 5_000_000, step: 10_000 },
  }[currency.code];

  return (
    <div className="space-y-6">
      <section className="tool-frame p-6 sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
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
                      {type === "new" ? "New Car" : "Used Car"}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {carType === "new"
                    ? `Typical rate: ${currency.carDefaults.newCarRate}%`
                    : `Typical rate: ${currency.carDefaults.usedCarRate}%`}
                </p>
              </div>
            </div>

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

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-border bg-background p-4">
                <p className="text-sm font-medium text-muted-foreground">Amount financed</p>
                <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                  {formatCurrency(netFinanced, currency)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Vehicle price minus down payment and trade-in
                </p>
              </div>

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
              </div>
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

            {downPaymentExceeds ? (
              <div className="rounded-[1rem] border border-warning/20 bg-warning-soft p-4 text-sm text-warning-soft-foreground">
                Down payment plus trade-in exceeds the vehicle price. No financing is needed.
              </div>
            ) : null}
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Monthly payment
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {formatCurrency(result.emi, currency)}
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Amount financed</span>
                <span className="font-medium text-foreground">{formatCurrency(result.amountFinanced, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Total interest</span>
                <span className="font-medium text-foreground">{formatCurrency(result.totalInterest, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Total loan cost</span>
                <span className="font-medium text-foreground">{formatCurrency(result.totalLoanCost, currency)}</span>
              </div>
              <div className="rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-soft-foreground">
                  Total car cost
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-primary-soft-foreground">
                  {formatCurrency(result.totalCarCost, currency)}
                </p>
                <p className="mt-2 text-xs text-primary-soft-foreground/80">
                  Includes {formatCurrency(downPayment + tradeIn, currency)} paid upfront.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {!downPaymentExceeds && netFinanced > 0 ? (
        <section className="tool-frame p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Financing insight</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Financing this vehicle adds <strong className="text-foreground">{formatCurrency(result.totalInterest, currency)}</strong> in
            interest on top of the sticker price compared with paying cash.
          </p>
        </section>
      ) : null}
    </div>
  );
}

