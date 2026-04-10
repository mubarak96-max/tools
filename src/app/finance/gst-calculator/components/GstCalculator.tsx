"use client";

import { useMemo, useState } from "react";

import {
  addSingaporeGst,
  getSingaporeGstRate,
  removeSingaporeGst,
  type GstMode,
  type SingaporeSupplyType,
} from "@/lib/tools/gst";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

function optionalNum(value: string) {
  if (value.trim() === "") {
    return "";
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    maximumFractionDigits: 2,
  }).format(value);
}

const SUPPLY_TYPE_OPTIONS: Array<{
  value: SingaporeSupplyType;
  label: string;
  helper: string;
}> = [
  {
    value: "standard-rated",
    label: "Standard-rated supply",
    helper: "GST is charged at 9% for standard-rated supplies made in Singapore.",
  },
  {
    value: "zero-rated",
    label: "Zero-rated supply",
    helper: "GST is charged at 0% for qualifying exports of goods and qualifying international services.",
  },
  {
    value: "exempt",
    label: "Exempt supply",
    helper: "GST is not charged on exempt supplies such as qualifying financial services and sale or lease of residential properties.",
  },
];

export default function GstCalculator() {
  const [mode, setMode] = useState<GstMode>("add");
  const [supplyType, setSupplyType] = useState<SingaporeSupplyType>("standard-rated");
  const [netAmount, setNetAmount] = useState<number | "">("");
  const [grossAmount, setGrossAmount] = useState<number | "">("");

  const activeRate = getSingaporeGstRate(supplyType);
  const activeSupplyType = SUPPLY_TYPE_OPTIONS.find((item) => item.value === supplyType) ?? SUPPLY_TYPE_OPTIONS[0];

  const result = useMemo(
    () =>
      mode === "add"
        ? addSingaporeGst(netAmount === "" ? 0 : netAmount, supplyType)
        : removeSingaporeGst(grossAmount === "" ? 0 : grossAmount, supplyType),
    [grossAmount, mode, netAmount, supplyType],
  );

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_12rem]">
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Mode</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "add", label: "Add GST" },
                    { value: "remove", label: "Remove GST" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setMode(item.value as GstMode)}
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
                <span className="text-sm font-medium text-muted-foreground">GST rate</span>
                <input type="text" value={`${activeRate}%`} disabled className={`${fieldClass} cursor-not-allowed opacity-80`} />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Supply type</span>
              <select
                value={supplyType}
                onChange={(event) => setSupplyType(event.target.value as SingaporeSupplyType)}
                className={fieldClass}
              >
                {SUPPLY_TYPE_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
              <p className="text-sm leading-6 text-primary-soft-foreground">{activeSupplyType.helper}</p>
            </div>

            {mode === "add" ? (
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Net amount (before GST)</span>
                <input
                  type="number"
                  min={0}
                  value={netAmount}
                  onChange={(event) => setNetAmount(optionalNum(event.target.value))}
                  className={fieldClass}
                />
              </label>
            ) : (
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Gross amount (inclusive of GST)</span>
                <input
                  type="number"
                  min={0}
                  value={grossAmount}
                  onChange={(event) => setGrossAmount(optionalNum(event.target.value))}
                  className={fieldClass}
                />
              </label>
            )}
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {mode === "add" ? "Gross amount" : "Net amount"}
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {formatCurrency(mode === "add" ? result.grossAmount : result.netAmount)}
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">GST amount</span>
                <span className="font-medium text-foreground">{formatCurrency(result.gstAmount)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">GST rate</span>
                <span className="font-medium text-foreground">{result.gstRate}%</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">{mode === "add" ? "Net amount" : "Gross amount"}</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(mode === "add" ? result.netAmount : result.grossAmount)}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-[1rem] border border-border bg-muted p-4">
              <p className="text-sm leading-6 text-muted-foreground">
                For standard-rated supplies, removing GST uses the correct inclusive-tax fraction method.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
