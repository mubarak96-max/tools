"use client";

import { useMemo, useState } from "react";

import { VAT_COUNTRIES, addVAT, removeVAT, type VATMode } from "@/lib/tools/vat";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

function optionalNum(value: string) {
  if (value.trim() === "") {
    return "";
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatValue(value: number, symbol: string) {
  return `${symbol}${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function VATCalculator() {
  const featuredCountries = VAT_COUNTRIES.filter((country) => country.featured);
  const [mode, setMode] = useState<VATMode>("add");
  const [countryCode, setCountryCode] = useState("GB");
  const [rate, setRate] = useState<number | "">(20);
  const [netPrice, setNetPrice] = useState<number | "">("");
  const [grossPrice, setGrossPrice] = useState<number | "">("");

  const country = VAT_COUNTRIES.find((item) => item.code === countryCode) ?? VAT_COUNTRIES[0];
  const activeRate = rate === "" ? 0 : rate;

  const result = useMemo(
    () =>
      mode === "add"
        ? addVAT(netPrice === "" ? 0 : netPrice, activeRate)
        : removeVAT(grossPrice === "" ? 0 : grossPrice, activeRate),
    [activeRate, grossPrice, mode, netPrice],
  );

  const handleCountryChange = (nextCode: string) => {
    setCountryCode(nextCode);
    const next = VAT_COUNTRIES.find((item) => item.code === nextCode);
    if (next) {
      setRate(next.standardRate);
    }
  };

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_10rem]">
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Mode</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "add", label: "Add VAT" },
                    { value: "remove", label: "Remove VAT" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setMode(item.value as VATMode)}
                      className={`rounded-[1rem] border px-4 py-3 text-sm font-medium transition-colors ${
                        mode === item.value
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border bg-background text-foreground hover:border-primary/20"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">VAT rate</span>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={rate}
                  onChange={(event) => setRate(optionalNum(event.target.value))}
                  className={fieldClass}
                />
              </label>
            </div>

            <div className="space-y-3">
              <span className="text-sm font-medium text-muted-foreground">Featured countries</span>
              <div className="flex flex-wrap gap-2">
                {featuredCountries.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleCountryChange(item.code)}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                      countryCode === item.code
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-primary/20"
                    }`}
                  >
                    {item.flag} {item.name}
                  </button>
                ))}
              </div>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Country or system</span>
              <select
                value={countryCode}
                onChange={(event) => handleCountryChange(event.target.value)}
                className={fieldClass}
              >
                {VAT_COUNTRIES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name} ({item.taxName})
                  </option>
                ))}
              </select>
            </label>

            {country.reducedRates.length > 0 ? (
              <div className="space-y-3">
                <span className="text-sm font-medium text-muted-foreground">Quick rates</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setRate(country.standardRate)}
                    className="rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-primary/20 hover:text-primary"
                  >
                    Standard {country.standardRate}%
                  </button>
                  {country.reducedRates.map((item) => (
                    <button
                      key={`${country.code}-${item.rate}`}
                      type="button"
                      onClick={() => setRate(item.rate)}
                      className="rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-primary/20 hover:text-primary"
                    >
                      {item.rate}% {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {mode === "add" ? (
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Net price (ex-VAT)</span>
                <input
                  type="number"
                  min={0}
                  value={netPrice}
                  onChange={(event) => setNetPrice(optionalNum(event.target.value))}
                  className={fieldClass}
                />
              </label>
            ) : (
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Gross price (inc-VAT)</span>
                <input
                  type="number"
                  min={0}
                  value={grossPrice}
                  onChange={(event) => setGrossPrice(optionalNum(event.target.value))}
                  className={fieldClass}
                />
              </label>
            )}
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {mode === "add" ? "Gross price" : "Net price"}
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {formatValue(mode === "add" ? result.grossPrice : result.netPrice, country.currencySymbol)}
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">VAT amount</span>
                <span className="font-medium text-foreground">{formatValue(result.vatAmount, country.currencySymbol)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">VAT rate</span>
                <span className="font-medium text-foreground">{result.vatRate}%</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">{mode === "add" ? "Net price" : "Gross price"}</span>
                <span className="font-medium text-foreground">
                  {formatValue(mode === "add" ? result.netPrice : result.grossPrice, country.currencySymbol)}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
              <p className="text-sm leading-6 text-primary-soft-foreground">
                Removing VAT uses the correct VAT fraction method: gross × rate / (100 + rate).
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
