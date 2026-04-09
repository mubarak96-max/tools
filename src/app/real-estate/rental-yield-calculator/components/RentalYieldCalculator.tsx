"use client";

import { useMemo, useState } from "react";

import {
  MarketField,
  NoteCard,
  NumberField,
  ResultCard,
  formatMoney,
  formatPercent,
  getRealEstateMarket,
} from "@/components/real-estate/shared";
import { calculateRentalYield } from "@/lib/tools/real-estate";

export default function RentalYieldCalculator() {
  const [marketKey, setMarketKey] = useState("US");
  const [propertyPrice, setPropertyPrice] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [annualExpenses, setAnnualExpenses] = useState("");
  const market = getRealEstateMarket(marketKey);

  const propertyPriceValue = Number(propertyPrice) || 0;
  const monthlyRentValue = Number(monthlyRent) || 0;
  const annualExpensesValue = Number(annualExpenses) || 0;
  const annualRent = monthlyRentValue * 12;

  const result = useMemo(
    () =>
      calculateRentalYield({
        propertyPrice: propertyPriceValue,
        annualRent,
        annualExpenses: annualExpensesValue,
      }),
    [annualExpensesValue, annualRent, propertyPriceValue],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <MarketField value={marketKey} onChange={setMarketKey} />
          <NumberField
            label="Property price"
            value={propertyPrice}
            onChange={setPropertyPrice}
            placeholder="Enter total purchase price"
            helper="Use the total amount paid for the property."
          />
          <NumberField
            label="Monthly rent"
            value={monthlyRent}
            onChange={setMonthlyRent}
            placeholder="Enter monthly rent"
            helper="This is multiplied by 12 to estimate annual rent."
          />
          <NumberField
            label="Annual operating costs"
            value={annualExpenses}
            onChange={setAnnualExpenses}
            placeholder="Enter annual costs"
            helper="Include maintenance, service charges, insurance, vacancy, and other yearly costs."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label="Gross yield"
          value={formatPercent(result.grossYield)}
          helper="Rent before annual operating costs are deducted."
        />
        <ResultCard
          label="Net yield"
          value={formatPercent(result.netYield)}
          helper="Yield after subtracting annual operating costs."
        />
        <ResultCard
          label="Annual rent"
          value={formatMoney(annualRent, market)}
          helper="Based on the monthly rent entered above."
        />
        <ResultCard
          label="Net operating income"
          value={formatMoney(result.netOperatingIncome, market)}
          helper="Annual rent minus annual operating costs."
        />
      </section>

      <NoteCard title="How to read the result">
        <p>
          Gross yield is the quick top-line number investors often use to compare listings fast. Net yield is the more
          realistic figure because it removes recurring costs that eat into the rent.
        </p>
        <p className="mt-3">
          If two properties have similar gross yield but very different service charges or maintenance costs, the net
          yield usually tells you which one is stronger as a long-term rental.
        </p>
      </NoteCard>
    </div>
  );
}
