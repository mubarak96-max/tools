"use client";

import { useMemo, useState } from "react";

import {
  MarketField,
  NoteCard,
  NumberField,
  ResultCard,
  SelectField,
  formatMoney,
  formatNumber,
  getRealEstateMarket,
} from "@/components/real-estate/shared";
import { calculatePricePerArea } from "@/lib/tools/real-estate";

const SQFT_PER_SQM = 10.7639;

export default function PricePerSquareFootCalculator() {
  const [marketKey, setMarketKey] = useState("US");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [unit, setUnit] = useState("sqft");
  const market = getRealEstateMarket(marketKey);

  const priceValue = Number(price) || 0;
  const areaValue = Number(area) || 0;

  const primaryResult = useMemo(
    () =>
      calculatePricePerArea({
        price: priceValue,
        area: areaValue,
      }),
    [areaValue, priceValue],
  );

  const areaInSquareFeet = unit === "sqft" ? areaValue : areaValue * SQFT_PER_SQM;
  const areaInSquareMetres = unit === "sqm" ? areaValue : areaValue / SQFT_PER_SQM;
  const pricePerSqft = areaInSquareFeet > 0 ? priceValue / areaInSquareFeet : 0;
  const pricePerSqm = areaInSquareMetres > 0 ? priceValue / areaInSquareMetres : 0;

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <MarketField value={marketKey} onChange={setMarketKey} />
          <NumberField
            label="Property price"
            value={price}
            onChange={setPrice}
            placeholder="Enter total price"
          />
          <NumberField
            label="Area"
            value={area}
            onChange={setArea}
            placeholder="Enter property area"
          />
          <SelectField
            label="Area unit"
            value={unit}
            onChange={setUnit}
            options={[
              { label: "Square feet", value: "sqft" },
              { label: "Square metres", value: "sqm" },
            ]}
            helper="The calculator shows the matching rate in both square feet and square metres."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label={`Price per ${unit === "sqft" ? "sq ft" : "sq m"}`}
          value={formatMoney(primaryResult.pricePerArea, market)}
          helper="The direct result from the area unit you entered."
        />
        <ResultCard
          label="Price per sq ft"
          value={formatMoney(pricePerSqft, market)}
          helper="Useful when comparing markets and listings quoted in square feet."
        />
        <ResultCard
          label="Price per sq m"
          value={formatMoney(pricePerSqm, market)}
          helper="Useful when comparing markets and listings quoted in square metres."
        />
        <ResultCard
          label="Converted area"
          value={
            unit === "sqft"
              ? `${formatNumber(areaInSquareMetres)} sq m`
              : `${formatNumber(areaInSquareFeet)} sq ft`
          }
          helper="The same property area expressed in the other unit."
        />
      </section>

      <NoteCard title="When price per square foot is most useful">
        <p>
          Price per square foot or square metre helps you compare listings that have different layouts, sizes, and total
          asking prices. It is one of the quickest ways to see whether a property is priced above or below nearby
          alternatives.
        </p>
        <p className="mt-3">
          It works best as a comparison metric, not a final verdict. Floor plan efficiency, age, finish quality, view,
          parking, and service charges still matter even when the price-per-area number looks attractive.
        </p>
      </NoteCard>
    </div>
  );
}
