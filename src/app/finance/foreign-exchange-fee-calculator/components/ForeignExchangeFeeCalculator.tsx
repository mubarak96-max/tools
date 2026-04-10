"use client";

import { useEffect, useMemo, useState } from "react";

import {
  FX_CURRENCIES,
  calculateForeignExchangeFee,
  type FxCurrency,
} from "@/lib/tools/foreign-exchange-fee";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary";

function optionalNum(value: string) {
  if (value.trim() === "") {
    return "";
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number, currency: FxCurrency) {
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: currency.code === "JPY" ? 0 : 2,
  }).format(value);
}

export default function ForeignExchangeFeeCalculator() {
  const [fromCurrency, setFromCurrency] = useState<FxCurrency>(FX_CURRENCIES[0]);
  const [toCurrency, setToCurrency] = useState<FxCurrency>(FX_CURRENCIES[1]);
  const [amount, setAmount] = useState<number | "">(1000);
  const [bankChargePercent, setBankChargePercent] = useState<number | "">(2.5);
  const [rate, setRate] = useState(0);
  const [rateDate, setRateDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadRate() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/fx-quote?from=${fromCurrency.code}&to=${toCurrency.code}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          },
        );
        const payload = (await response.json()) as {
          rate?: number;
          date?: string;
          error?: string;
        };

        if (!response.ok || !Number.isFinite(payload.rate)) {
          throw new Error(payload.error || "Unable to load exchange rates right now.");
        }

        setRate(payload.rate ?? 0);
        setRateDate(payload.date ?? "");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unable to load exchange rates right now.";
        setError(message);
        setRate(0);
        setRateDate("");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadRate();

    return () => controller.abort();
  }, [fromCurrency.code, toCurrency.code]);

  const result = useMemo(
    () =>
      calculateForeignExchangeFee({
        amount: typeof amount === "number" ? amount : 0,
        rate,
        bankChargePercent: typeof bankChargePercent === "number" ? bankChargePercent : 0,
      }),
    [amount, bankChargePercent, rate],
  );

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Amount to convert</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(optionalNum(event.target.value))}
                className={fieldClass}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Bank charge (%)</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={bankChargePercent}
                onChange={(event) => setBankChargePercent(optionalNum(event.target.value))}
                className={fieldClass}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">From currency</span>
              <select
                value={fromCurrency.code}
                onChange={(event) =>
                  setFromCurrency(
                    FX_CURRENCIES.find((currency) => currency.code === event.target.value) ??
                      FX_CURRENCIES[0],
                  )
                }
                className={fieldClass}
              >
                {FX_CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.label} ({currency.code})
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">To currency</span>
              <select
                value={toCurrency.code}
                onChange={(event) =>
                  setToCurrency(
                    FX_CURRENCIES.find((currency) => currency.code === event.target.value) ??
                      FX_CURRENCIES[1],
                  )
                }
                className={fieldClass}
              >
                {FX_CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.label} ({currency.code})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Effective amount received
            </p>
            <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              {formatCurrency(result.finalAmountReceived, toCurrency)}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {loading
                ? "Loading live reference rate..."
                : error
                  ? error
                  : `Rate date: ${rateDate || "n/a"}`}
            </p>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Reference rate</span>
                <span className="font-medium text-foreground">
                  {rate > 0 ? `${rate.toFixed(6)} ${toCurrency.code}` : "--"} / {fromCurrency.code}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Bank fee</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(result.bankFeeAmount, toCurrency)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Effective rate</span>
                <span className="font-medium text-foreground">
                  {result.effectiveRate.toFixed(6)} {toCurrency.code} / {fromCurrency.code}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
          <p className="text-sm font-semibold text-muted-foreground">Mid-market conversion</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(result.convertedAmount, toCurrency)}
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
          <p className="text-sm font-semibold text-muted-foreground">Bank charge</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {typeof bankChargePercent === "number" ? `${bankChargePercent.toFixed(2)}%` : "0.00%"}
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
          <p className="text-sm font-semibold text-muted-foreground">Source amount</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(typeof amount === "number" ? amount : 0, fromCurrency)}
          </p>
        </article>
      </section>
    </div>
  );
}
