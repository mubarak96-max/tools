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
import { calculateCapRate } from "@/lib/tools/real-estate";

export default function CapRateCalculator() {
  const [marketKey, setMarketKey] = useState("US");
  const [propertyValue, setPropertyValue] = useState("");
  const [annualRent, setAnnualRent] = useState("");
  const [annualExpenses, setAnnualExpenses] = useState("");
  const market = getRealEstateMarket(marketKey);

  const result = useMemo(
    () =>
      calculateCapRate({
        propertyValue: Number(propertyValue) || 0,
        annualRent: Number(annualRent) || 0,
        annualExpenses: Number(annualExpenses) || 0,
      }),
    [annualExpenses, annualRent, propertyValue],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <MarketField value={marketKey} onChange={setMarketKey} />
          <NumberField
            label="Property value"
            value={propertyValue}
            onChange={setPropertyValue}
            placeholder="Enter current property value"
            helper="Use purchase price or current market value, depending on how you analyse deals."
          />
          <NumberField
            label="Annual rent"
            value={annualRent}
            onChange={setAnnualRent}
            placeholder="Enter annual rent"
            helper="Use the total rent you expect to collect over one year."
          />
          <NumberField
            label="Annual operating expenses"
            value={annualExpenses}
            onChange={setAnnualExpenses}
            placeholder="Enter annual expenses"
            helper="Exclude mortgage payments. Cap rate is based on NOI before financing."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ResultCard
          label="Cap rate"
          value={formatPercent(result.capRate)}
          helper="NOI divided by property value."
        />
        <ResultCard
          label="Net operating income"
          value={formatMoney(result.noi, market)}
          helper="Annual rent minus annual operating expenses."
        />
        <ResultCard
          label="Monthly NOI"
          value={formatMoney(result.noi / 12, market)}
          helper="A quick monthly view of the property's operating income."
        />
      </section>

      <NoteCard title="What cap rate helps you compare">
        <p>
          Cap rate is useful when you want to compare one income property with another on a financing-neutral basis.
          It strips out the mortgage and looks at the property itself.
        </p>
        <p className="mt-3">
          A higher cap rate can mean stronger income relative to price, but it can also reflect higher risk, weaker
          location quality, or more volatile rent assumptions. Use it as a comparison tool, not the only decision rule.
        </p>
      </NoteCard>
    </div>
  );
}
