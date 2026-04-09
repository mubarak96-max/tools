"use client";

import { useMemo, useState } from "react";

import { MarketField, NoteCard, NumberField, ResultCard, formatMoney, getRealEstateMarket } from "@/components/real-estate/shared";
import { calculateRentalCashFlow } from "@/lib/tools/real-estate";

export default function RentalCashFlowCalculator() {
  const [marketKey, setMarketKey] = useState("US");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [vacancyPercent, setVacancyPercent] = useState("5");
  const [monthlyMortgage, setMonthlyMortgage] = useState("");
  const [monthlyOperatingCosts, setMonthlyOperatingCosts] = useState("");
  const [annualReserveCosts, setAnnualReserveCosts] = useState("");
  const market = getRealEstateMarket(marketKey);

  const result = useMemo(
    () =>
      calculateRentalCashFlow({
        monthlyRent: Number(monthlyRent) || 0,
        vacancyPercent: Number(vacancyPercent) || 0,
        monthlyMortgage: Number(monthlyMortgage) || 0,
        monthlyOperatingCosts: Number(monthlyOperatingCosts) || 0,
        annualReserveCosts: Number(annualReserveCosts) || 0,
      }),
    [annualReserveCosts, monthlyMortgage, monthlyOperatingCosts, monthlyRent, vacancyPercent],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <MarketField value={marketKey} onChange={setMarketKey} />
          <NumberField
            label="Monthly rent"
            value={monthlyRent}
            onChange={setMonthlyRent}
            placeholder="Enter monthly rent"
          />
          <NumberField
            label="Vacancy allowance (%)"
            value={vacancyPercent}
            onChange={setVacancyPercent}
            placeholder="5"
            step={0.5}
            helper="Use a vacancy buffer instead of assuming the property is occupied every single month."
          />
          <NumberField
            label="Monthly mortgage"
            value={monthlyMortgage}
            onChange={setMonthlyMortgage}
            placeholder="Enter mortgage payment"
          />
          <NumberField
            label="Monthly operating costs"
            value={monthlyOperatingCosts}
            onChange={setMonthlyOperatingCosts}
            placeholder="Enter recurring costs"
            helper="Use management, service charge, maintenance, insurance, and similar monthly costs."
          />
          <NumberField
            label="Annual reserve costs"
            value={annualReserveCosts}
            onChange={setAnnualReserveCosts}
            placeholder="Enter annual reserve"
            helper="Use this for larger irregular costs you still want to budget for."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label="Monthly cash flow"
          value={formatMoney(result.monthlyCashFlow, market)}
          helper="Positive means the property is left with cash each month after the costs entered."
        />
        <ResultCard
          label="Annual cash flow"
          value={formatMoney(result.annualCashFlow, market)}
          helper="The yearly version of the same cash flow result."
        />
        <ResultCard
          label="Effective annual rent"
          value={formatMoney(result.effectiveAnnualRent, market)}
          helper="Rent after applying the vacancy allowance."
        />
        <ResultCard
          label="Annual costs"
          value={formatMoney(result.annualMortgage + result.annualOperatingCosts, market)}
          helper="Mortgage, monthly operating costs, and annual reserve combined."
        />
      </section>

      <NoteCard title="Why cash flow usually feels tighter than rent minus mortgage">
        <p>
          Rental cash flow gets overestimated when people assume rent arrives every month without interruption and forget
          the ongoing operating costs that sit outside the mortgage.
        </p>
        <p className="mt-3">
          This calculator uses a vacancy allowance and a reserve line because both help you test whether the property is
          still comfortable when real-world friction shows up.
        </p>
      </NoteCard>
    </div>
  );
}
