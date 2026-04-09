"use client";

import { useMemo, useState } from "react";

import { MarketField, NoteCard, NumberField, ResultCard, formatMoney, getRealEstateMarket } from "@/components/real-estate/shared";
import { calculateRentAffordability } from "@/lib/tools/real-estate";

export default function RentAffordabilityCalculator() {
  const [marketKey, setMarketKey] = useState("US");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyDebt, setMonthlyDebt] = useState("");
  const [monthlyUtilities, setMonthlyUtilities] = useState("");
  const [housingRatioPercent, setHousingRatioPercent] = useState("30");
  const market = getRealEstateMarket(marketKey);

  const result = useMemo(
    () =>
      calculateRentAffordability({
        monthlyIncome: Number(monthlyIncome) || 0,
        monthlyDebt: Number(monthlyDebt) || 0,
        monthlyUtilities: Number(monthlyUtilities) || 0,
        housingRatioPercent: Number(housingRatioPercent) || 0,
      }),
    [housingRatioPercent, monthlyDebt, monthlyIncome, monthlyUtilities],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MarketField value={marketKey} onChange={setMarketKey} />
          <NumberField
            label="Monthly income"
            value={monthlyIncome}
            onChange={setMonthlyIncome}
            placeholder="Enter take-home or gross income"
            helper="Use the income figure you budget from each month."
          />
          <NumberField
            label="Monthly debt payments"
            value={monthlyDebt}
            onChange={setMonthlyDebt}
            placeholder="Enter debt payments"
            helper="Include loans, minimum card payments, and other fixed debt obligations."
          />
          <NumberField
            label="Monthly utilities"
            value={monthlyUtilities}
            onChange={setMonthlyUtilities}
            placeholder="Enter utility estimate"
            helper="Use the recurring amount you expect to pay outside the rent."
          />
          <NumberField
            label="Target housing ratio (%)"
            value={housingRatioPercent}
            onChange={setHousingRatioPercent}
            placeholder="30"
            step={0.5}
            helper="30% is a common budgeting rule, but you can adjust it to match your own standard."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label="Affordable rent"
          value={formatMoney(result.affordableRent, market)}
          helper="Your estimated monthly rent budget after debt and utilities."
        />
        <ResultCard
          label="Target housing budget"
          value={formatMoney(result.targetHousingBudget, market)}
          helper="The housing budget before subtracting debt and utilities."
        />
        <ResultCard
          label="Conservative range"
          value={formatMoney(result.conservativeRent, market)}
          helper="A more cautious monthly rent level."
        />
        <ResultCard
          label="Stretch range"
          value={formatMoney(result.stretchRent, market)}
          helper="A higher monthly rent level if the rest of your budget can support it."
        />
      </section>

      <NoteCard title="How to use the affordability range">
        <p>
          The main affordable-rent number is a budgeting guide, not an approval guarantee from a landlord or bank. It
          helps you work backwards from your income and fixed monthly obligations before you start viewing units.
        </p>
        <p className="mt-3">
          If you want a safer buffer for savings, travel, childcare, or variable expenses, stay closer to the
          conservative range. If your debt is temporary or your income is very stable, you may be comfortable closer to
          the stretch range.
        </p>
      </NoteCard>
    </div>
  );
}
