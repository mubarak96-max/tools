"use client";

import { useMemo, useState } from "react";

import {
  calculateDiscountPercent,
  calculateFinalPrice,
  type CalculatorMode,
} from "@/lib/tools/discount";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

function num(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function optionalNum(value: string) {
  if (value.trim() === "") {
    return "";
  }

  return num(value);
}

function fmt(value: number, currencySymbol: string) {
  return `${currencySymbol}${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function fmtPercent(value: number) {
  return `${value.toFixed(2).replace(/\.00$/, "")}%`;
}

export default function DiscountCalculator() {
  const [mode, setMode] = useState<CalculatorMode>("percent-to-price");
  const [currencySymbol, setCurrencySymbol] = useState("$");

  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [discountPercent, setDiscountPercent] = useState<number | "">("");

  const [originalPriceB, setOriginalPriceB] = useState<number | "">("");
  const [salePrice, setSalePrice] = useState<number | "">("");

  const resultA = useMemo(
    () => calculateFinalPrice(originalPrice === "" ? 0 : originalPrice, discountPercent === "" ? 0 : discountPercent),
    [discountPercent, originalPrice],
  );

  const resultB = useMemo(
    () => calculateDiscountPercent(originalPriceB === "" ? 0 : originalPriceB, salePrice === "" ? 0 : salePrice),
    [originalPriceB, salePrice],
  );

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_9rem]">
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Calculation mode</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "percent-to-price", label: "Final Price" },
                    { value: "price-to-percent", label: "% Off" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setMode(item.value as CalculatorMode)}
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
                <span className="text-sm font-medium text-muted-foreground">Currency</span>
                <input
                  type="text"
                  maxLength={3}
                  value={currencySymbol}
                  onChange={(event) => setCurrencySymbol(event.target.value || "$")}
                  className={fieldClass}
                />
              </label>
            </div>

            {mode === "percent-to-price" ? (
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Original price</span>
                  <input
                    type="number"
                    min={0}
                    value={originalPrice}
                    onChange={(event) => setOriginalPrice(optionalNum(event.target.value))}
                    className={fieldClass}
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Discount percent</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={discountPercent}
                    onChange={(event) => setDiscountPercent(optionalNum(event.target.value))}
                    className={fieldClass}
                  />
                </label>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Original price</span>
                  <input
                    type="number"
                    min={0}
                    value={originalPriceB}
                    onChange={(event) => setOriginalPriceB(optionalNum(event.target.value))}
                    className={fieldClass}
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Sale price</span>
                  <input
                    type="number"
                    min={0}
                    value={salePrice}
                    onChange={(event) => setSalePrice(optionalNum(event.target.value))}
                    className={fieldClass}
                  />
                </label>
              </div>
            )}

            <div className="rounded-[1.5rem] border border-border bg-background p-5">
              <h2 className="text-lg font-semibold text-foreground">
                {mode === "percent-to-price" ? "How to read the result" : "How to read the discount"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {mode === "percent-to-price"
                  ? "Enter the original price and discount percentage to see how much money is saved and what the final checkout price becomes."
                  : "Enter the original price and sale price to reverse-calculate the discount percentage and total amount saved."}
              </p>
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            {mode === "percent-to-price" ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Final price
                </p>
                <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
                  {fmt(resultA.finalPrice, currencySymbol)}
                </div>
                <div className="mt-6 space-y-4 border-t border-border pt-5">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Amount saved</span>
                    <span className="font-medium text-foreground">{fmt(resultA.discountAmount, currencySymbol)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Effective saving</span>
                    <span className="font-medium text-foreground">{fmtPercent(resultA.savingPercent)}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Discount percent
                </p>
                <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
                  {fmtPercent(resultB.discountPercent)}
                </div>
                <div className="mt-6 space-y-4 border-t border-border pt-5">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Amount saved</span>
                    <span className="font-medium text-foreground">{fmt(resultB.amountSaved, currencySymbol)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Deal signal</span>
                    <span className={resultB.isGoodDeal ? "font-medium text-success" : "font-medium text-warning"}>
                      {resultB.isGoodDeal ? "Good deal" : "Small discount"}
                    </span>
                  </div>
                </div>
              </>
            )}

            <div className="mt-6 rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
              <p className="text-sm leading-6 text-primary-soft-foreground">
                The calculator updates instantly as you type, so you can compare pricing scenarios without a submit step.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}


