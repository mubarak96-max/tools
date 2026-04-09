"use client";

import { useMemo, useState } from "react";

import {
  calcMarginFromPrices,
  calcPriceFromMargin,
  calcPriceFromMarkup,
  getMarginHealth,
  type MarginMode,
} from "@/lib/tools/profit-margin";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

function optionalNum(value: string) {
  if (value.trim() === "") {
    return "";
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
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

export default function ProfitMarginCalculator() {
  const [mode, setMode] = useState<MarginMode>("margin-from-prices");
  const [currencySymbol, setCurrencySymbol] = useState("$");

  const [costPrice, setCostPrice] = useState<number | "">("");
  const [sellingPrice, setSellingPrice] = useState<number | "">("");

  const [costPriceB, setCostPriceB] = useState<number | "">("");
  const [targetMargin, setTargetMargin] = useState<number | "">("");

  const [costPriceC, setCostPriceC] = useState<number | "">("");
  const [markupPercent, setMarkupPercent] = useState<number | "">("");

  const marginResult = useMemo(
    () => calcMarginFromPrices(costPrice === "" ? 0 : costPrice, sellingPrice === "" ? 0 : sellingPrice),
    [costPrice, sellingPrice],
  );

  const priceFromMarginResult = useMemo(
    () => calcPriceFromMargin(costPriceB === "" ? 0 : costPriceB, targetMargin === "" ? 0 : targetMargin),
    [costPriceB, targetMargin],
  );

  const priceFromMarkupResult = useMemo(
    () => calcPriceFromMarkup(costPriceC === "" ? 0 : costPriceC, markupPercent === "" ? 0 : markupPercent),
    [costPriceC, markupPercent],
  );

  const activeMargin =
    mode === "margin-from-prices"
      ? marginResult.marginPercent
      : mode === "price-from-margin"
        ? targetMargin === "" ? 0 : targetMargin
        : priceFromMarkupResult.marginPercent;
  const health = getMarginHealth(activeMargin);

  return (
    <div className="space-y-6">
      <section className="tool-frame p-6 sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_9rem]">
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Mode</span>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    { value: "margin-from-prices", label: "Margin" },
                    { value: "price-from-margin", label: "Target Margin" },
                    { value: "price-from-markup", label: "Markup" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setMode(item.value as MarginMode)}
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

            {mode === "margin-from-prices" ? (
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Cost price</span>
                  <input type="number" min={0} value={costPrice} onChange={(e) => setCostPrice(optionalNum(e.target.value))} className={fieldClass} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Selling price</span>
                  <input type="number" min={0} value={sellingPrice} onChange={(e) => setSellingPrice(optionalNum(e.target.value))} className={fieldClass} />
                </label>
              </div>
            ) : null}

            {mode === "price-from-margin" ? (
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Cost price</span>
                  <input type="number" min={0} value={costPriceB} onChange={(e) => setCostPriceB(optionalNum(e.target.value))} className={fieldClass} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Target margin %</span>
                  <input type="number" min={0} max={99.99} value={targetMargin} onChange={(e) => setTargetMargin(optionalNum(e.target.value))} className={fieldClass} />
                </label>
              </div>
            ) : null}

            {mode === "price-from-markup" ? (
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Cost price</span>
                  <input type="number" min={0} value={costPriceC} onChange={(e) => setCostPriceC(optionalNum(e.target.value))} className={fieldClass} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Markup %</span>
                  <input type="number" min={0} value={markupPercent} onChange={(e) => setMarkupPercent(optionalNum(e.target.value))} className={fieldClass} />
                </label>
              </div>
            ) : null}

            <div className="rounded-[1.5rem] border border-border bg-background p-5">
              <h2 className="text-lg font-semibold text-foreground">Margin vs markup</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Margin is profit as a share of selling price. Markup is profit as a share of cost. They are related, but they are not the same number.
              </p>
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {mode === "margin-from-prices" ? "Gross profit" : "Selling price"}
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {mode === "margin-from-prices"
                ? fmt(marginResult.grossProfit, currencySymbol)
                : fmt(
                    mode === "price-from-margin"
                      ? priceFromMarginResult.sellingPrice
                      : priceFromMarkupResult.sellingPrice,
                    currencySymbol,
                  )}
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              {mode === "margin-from-prices" ? (
                <>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Margin</span>
                    <span className="font-medium text-foreground">{fmtPercent(marginResult.marginPercent)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Markup</span>
                    <span className="font-medium text-foreground">{fmtPercent(marginResult.markupPercent)}</span>
                  </div>
                </>
              ) : null}

              {mode === "price-from-margin" ? (
                <>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Gross profit</span>
                    <span className="font-medium text-foreground">{fmt(priceFromMarginResult.grossProfit, currencySymbol)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Equivalent markup</span>
                    <span className="font-medium text-foreground">{fmtPercent(priceFromMarginResult.markupPercent)}</span>
                  </div>
                </>
              ) : null}

              {mode === "price-from-markup" ? (
                <>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Gross profit</span>
                    <span className="font-medium text-foreground">{fmt(priceFromMarkupResult.grossProfit, currencySymbol)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Equivalent margin</span>
                    <span className="font-medium text-foreground">{fmtPercent(priceFromMarkupResult.marginPercent)}</span>
                  </div>
                </>
              ) : null}
            </div>

            <div
              className={`mt-6 rounded-[1rem] border p-4 ${
                health.color === "green"
                  ? "border-success/20 bg-success-soft"
                  : health.color === "amber"
                    ? "border-warning/20 bg-warning-soft"
                    : "border-danger/20 bg-danger-soft"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                {health.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{health.description}</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

