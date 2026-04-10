"use client";

import { useMemo, useState } from "react";

import { CURRENCIES } from "@/lib/tools/emi";
import { calculateClv } from "@/lib/tools/clv";

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
  return new Intl.NumberFormat(CURRENCIES[0].locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function CustomerLifetimeValueCalculator() {
  const [averageRevenuePerCustomer, setAverageRevenuePerCustomer] = useState<number | "">(120);
  const [grossMarginPercent, setGrossMarginPercent] = useState<number | "">(68);
  const [purchaseFrequencyPerYear, setPurchaseFrequencyPerYear] = useState<number | "">(8);
  const [customerLifespanYears, setCustomerLifespanYears] = useState<number | "">(3.5);

  const result = useMemo(
    () =>
      calculateClv({
        averageRevenuePerCustomer:
          averageRevenuePerCustomer === "" ? 0 : averageRevenuePerCustomer,
        grossMarginPercent: grossMarginPercent === "" ? 0 : grossMarginPercent,
        purchaseFrequencyPerYear:
          purchaseFrequencyPerYear === "" ? 0 : purchaseFrequencyPerYear,
        customerLifespanYears: customerLifespanYears === "" ? 0 : customerLifespanYears,
      }),
    [
      averageRevenuePerCustomer,
      customerLifespanYears,
      grossMarginPercent,
      purchaseFrequencyPerYear,
    ],
  );

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">
              Average revenue per purchase
            </span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={averageRevenuePerCustomer}
              onChange={(event) =>
                setAverageRevenuePerCustomer(optionalNum(event.target.value))
              }
              className={fieldClass}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">
              Gross margin (%)
            </span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={grossMarginPercent}
              onChange={(event) => setGrossMarginPercent(optionalNum(event.target.value))}
              className={fieldClass}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">
              Purchases per customer per year
            </span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={purchaseFrequencyPerYear}
              onChange={(event) =>
                setPurchaseFrequencyPerYear(optionalNum(event.target.value))
              }
              className={fieldClass}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">
              Customer lifespan (years)
            </span>
            <input
              type="number"
              min={0}
              step="0.1"
              value={customerLifespanYears}
              onChange={(event) => setCustomerLifespanYears(optionalNum(event.target.value))}
              className={fieldClass}
            />
          </label>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
          <p className="text-sm font-semibold text-muted-foreground">
            Annual revenue per customer
          </p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(result.annualRevenuePerCustomer)}
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
          <p className="text-sm font-semibold text-muted-foreground">
            Annual gross profit per customer
          </p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(result.annualGrossProfitPerCustomer)}
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
          <p className="text-sm font-semibold text-muted-foreground">
            Customer lifetime value
          </p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(result.customerLifetimeValue)}
          </p>
        </article>
      </section>
    </div>
  );
}
