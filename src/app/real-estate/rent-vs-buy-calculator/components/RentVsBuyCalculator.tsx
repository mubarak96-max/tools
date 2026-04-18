"use client";

import { useMemo, useState } from "react";

import { MarketField, NoteCard, NumberField, ResultCard, formatMoney, getRealEstateMarket } from "@/components/real-estate/shared";
import { calculateRentVsBuy } from "@/lib/tools/real-estate";

export default function RentVsBuyCalculator() {
  const [marketKey, setMarketKey] = useState("US");
  const [homePrice, setHomePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [monthlyMortgage, setMonthlyMortgage] = useState("");
  const [monthlyOwnershipCosts, setMonthlyOwnershipCosts] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [yearsPlanned, setYearsPlanned] = useState("5");
  const market = getRealEstateMarket(marketKey);

  const result = useMemo(
    () =>
      calculateRentVsBuy({
        homePrice: Number(homePrice) || 0,
        downPayment: Number(downPayment) || 0,
        monthlyMortgage: Number(monthlyMortgage) || 0,
        monthlyOwnershipCosts: Number(monthlyOwnershipCosts) || 0,
        monthlyRent: Number(monthlyRent) || 0,
        yearsPlanned: Number(yearsPlanned) || 0,
      }),
    [downPayment, homePrice, monthlyMortgage, monthlyOwnershipCosts, monthlyRent, yearsPlanned],
  );

  const decisionLabel =
    result.cheaperOption === "buy"
      ? "Buying looks cheaper"
      : result.cheaperOption === "rent"
        ? "Renting looks cheaper"
        : "Costs are the same";

  const copyResults = async () => {
    const text = `Home Price: ${formatMoney(Number(homePrice)||0, market)}\nRent Cost: ${formatMoney(result.rentCost, market)}\nBuy Cost: ${formatMoney(result.buyCost, market)}\nDifference: ${formatMoney(Math.abs(result.difference), market)}\nRecommendation: ${decisionLabel}`;
    await navigator.clipboard.writeText(text);
    alert("Results copied to clipboard!");
  };

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <MarketField value={marketKey} onChange={setMarketKey} />
          <NumberField
            label="Home price"
            value={homePrice}
            onChange={setHomePrice}
            placeholder="Enter home price"
          />
          <NumberField
            label="Down payment"
            value={downPayment}
            onChange={setDownPayment}
            placeholder="Enter down payment"
          />
          <NumberField
            label="Monthly mortgage payment"
            value={monthlyMortgage}
            onChange={setMonthlyMortgage}
            placeholder="Enter monthly mortgage"
          />
          <NumberField
            label="Monthly ownership costs"
            value={monthlyOwnershipCosts}
            onChange={setMonthlyOwnershipCosts}
            placeholder="Enter taxes, insurance, HOA, maintenance"
            helper="Use the non-mortgage monthly costs of owning the property."
          />
          <NumberField
            label="Monthly rent"
            value={monthlyRent}
            onChange={setMonthlyRent}
            placeholder="Enter monthly rent"
          />
          <NumberField
            label="Years you expect to stay"
            value={yearsPlanned}
            onChange={setYearsPlanned}
            placeholder="5"
            step={1}
            helper="This calculator compares your total cost over that time horizon."
          />
          <div className="flex items-end">
             <button
                onClick={copyResults}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-medium transition-all hover:bg-secondary/80"
             >
                Copy Results
             </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label={decisionLabel}
          value={formatMoney(Math.abs(result.difference), market)}
          helper="This is the cost gap over the full time period entered."
        />
        <ResultCard
          label="Total rent cost"
          value={formatMoney(result.rentCost, market)}
          helper="Monthly rent multiplied by the number of months you plan to stay."
        />
        <ResultCard
          label="Total buy cost"
          value={formatMoney(result.buyCost, market)}
          helper="Down payment plus mortgage and ownership costs over the same period."
        />
        <ResultCard
          label="Home price reference"
          value={formatMoney(result.homePrice, market)}
          helper="Included so you can compare the buying cost against the property value."
        />
        <ResultCard
          label="Recommendation"
          value={decisionLabel}
          helper="Based on raw cost comparison over the period."
        />
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm md:col-span-2 xl:col-span-4 flex flex-col justify-center">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-4">Cost Comparison Over Time</h3>
            <div className="flex h-6 w-full overflow-hidden rounded-full mb-4">
              <div style={{ width: `${(result.rentCost/(result.buyCost+result.rentCost))*100}%` }} className="bg-amber-500/80" title="Total Rent" />
              <div style={{ width: `${(result.buyCost/(result.buyCost+result.rentCost))*100}%` }} className="bg-blue-500/80" title="Total Buy" />
            </div>
            <div className="flex flex-wrap gap-6 text-xs text-muted-foreground font-medium">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500/80"/> Total Rent</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500/80"/> Total Buy</div>
           </div>
        </div>
      </section>

      <NoteCard title="What this simplified comparison includes">
        <p>
          This calculator is meant for a fast first-pass comparison. It includes the down payment, monthly mortgage,
          monthly ownership costs, and rent across the years you expect to stay in the property.
        </p>
        <p className="mt-3">
          It does not model home appreciation, rent increases, resale proceeds, tax benefits, or investment returns on
          the down payment. Those factors can change the outcome, so use this page as a starting point rather than a
          final buy-or-rent verdict.
        </p>
      </NoteCard>
    </div>
  );
}
