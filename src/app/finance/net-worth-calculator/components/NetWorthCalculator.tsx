"use client";

import { useMemo, useState } from "react";

import { CURRENCIES, type Currency } from "@/lib/tools/emi";
import { calculateNetWorth } from "@/lib/tools/net-worth";

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

export default function NetWorthCalculator() {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [cash, setCash] = useState<number | "">(15_000);
  const [investments, setInvestments] = useState<number | "">(40_000);
  const [retirementAccounts, setRetirementAccounts] = useState<number | "">(65_000);
  const [property, setProperty] = useState<number | "">(250_000);
  const [vehicles, setVehicles] = useState<number | "">(18_000);
  const [otherAssets, setOtherAssets] = useState<number | "">(5_000);
  const [mortgage, setMortgage] = useState<number | "">(180_000);
  const [creditCards, setCreditCards] = useState<number | "">(3_000);
  const [studentLoans, setStudentLoans] = useState<number | "">(12_000);
  const [autoLoans, setAutoLoans] = useState<number | "">(8_000);
  const [otherLiabilities, setOtherLiabilities] = useState<number | "">(0);

  const result = useMemo(
    () =>
      calculateNetWorth({
        cash: cash === "" ? 0 : cash,
        investments: investments === "" ? 0 : investments,
        retirementAccounts: retirementAccounts === "" ? 0 : retirementAccounts,
        property: property === "" ? 0 : property,
        vehicles: vehicles === "" ? 0 : vehicles,
        otherAssets: otherAssets === "" ? 0 : otherAssets,
        mortgage: mortgage === "" ? 0 : mortgage,
        creditCards: creditCards === "" ? 0 : creditCards,
        studentLoans: studentLoans === "" ? 0 : studentLoans,
        autoLoans: autoLoans === "" ? 0 : autoLoans,
        otherLiabilities: otherLiabilities === "" ? 0 : otherLiabilities,
      }),
    [
      autoLoans,
      cash,
      creditCards,
      investments,
      mortgage,
      otherAssets,
      otherLiabilities,
      property,
      retirementAccounts,
      studentLoans,
      vehicles,
    ],
  );

  const netWorthTone =
    result.netWorth >= 0
      ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
      : "text-red-600 border-red-500/30 bg-red-500/10";
  const assetFields: Array<{
    label: string;
    value: number | "";
    setter: (value: number | "") => void;
  }> = [
    { label: "Cash", value: cash, setter: setCash },
    { label: "Investments", value: investments, setter: setInvestments },
    { label: "Retirement accounts", value: retirementAccounts, setter: setRetirementAccounts },
    { label: "Property equity value", value: property, setter: setProperty },
    { label: "Vehicles", value: vehicles, setter: setVehicles },
    { label: "Other assets", value: otherAssets, setter: setOtherAssets },
  ];
  const liabilityFields: Array<{
    label: string;
    value: number | "";
    setter: (value: number | "") => void;
  }> = [
    { label: "Mortgage balance", value: mortgage, setter: setMortgage },
    { label: "Credit card debt", value: creditCards, setter: setCreditCards },
    { label: "Student loans", value: studentLoans, setter: setStudentLoans },
    { label: "Auto loans", value: autoLoans, setter: setAutoLoans },
    { label: "Other liabilities", value: otherLiabilities, setter: setOtherLiabilities },
  ];

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-6">
            <label className="block space-y-2 md:max-w-xs">
              <span className="text-sm font-medium text-muted-foreground">Currency</span>
              <select value={currency.code} onChange={(e) => setCurrency(CURRENCIES.find((item) => item.code === e.target.value) ?? CURRENCIES[0])} className={fieldClass}>
                {CURRENCIES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label} ({item.code})
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">Assets</h2>
                {assetFields.map(({ label, value, setter }) => (
                  <label key={label} className="block space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">{label}</span>
                    <input
                      type="number"
                      min={0}
                      value={value}
                      onChange={(e) => setter(optionalNum(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                ))}
              </div>

              <div className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">Liabilities</h2>
                {liabilityFields.map(({ label, value, setter }) => (
                  <label key={label} className="block space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">{label}</span>
                    <input
                      type="number"
                      min={0}
                      value={value}
                      onChange={(e) => setter(optionalNum(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Net worth
            </p>
            <div className={`mt-4 rounded-[1rem] border p-4 ${netWorthTone}`}>
              <p className="text-3xl font-semibold tracking-tight">
                {formatCurrency(result.netWorth, currency)}
              </p>
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Total assets</span>
                <span className="font-medium text-foreground">{formatCurrency(result.totalAssets, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Total liabilities</span>
                <span className="font-medium text-foreground">{formatCurrency(result.totalLiabilities, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Liquid assets</span>
                <span className="font-medium text-foreground">{formatCurrency(result.liquidAssets, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Debt / assets ratio</span>
                <span className="font-medium text-foreground">{result.debtToAssetsRatio.toFixed(2)}%</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
