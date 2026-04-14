"use client";

import Link from "next/link";
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

const SQFT_PER_SQM = 10.7639;
const DUBAI_SALE_BENCHMARKS = [
  {
    key: "custom",
    label: "Custom benchmark",
    ratePerSqft: 0,
    note: "Enter your own benchmark manually.",
  },
  {
    key: "jlt-h1-2025",
    label: "Jumeirah Lake Towers",
    ratePerSqft: 1561,
    note: "Bayut H1 2025 average apartment sale price per sq ft.",
  },
  {
    key: "business-bay-h1-2025",
    label: "Business Bay",
    ratePerSqft: 2076,
    note: "Bayut H1 2025 average apartment sale price per sq ft.",
  },
  {
    key: "dubai-marina-h1-2025",
    label: "Dubai Marina",
    ratePerSqft: 2004,
    note: "Bayut H1 2025 average apartment sale price per sq ft.",
  },
  {
    key: "downtown-dubai-h1-2025",
    label: "Downtown Dubai",
    ratePerSqft: 3149,
    note: "Bayut H1 2025 average apartment sale price per sq ft.",
  },
  {
    key: "creek-harbour-h1-2025",
    label: "Dubai Creek Harbour",
    ratePerSqft: 2539,
    note: "Bayut H1 2025 average apartment sale price per sq ft.",
  },
] as const;

type ComparisonProperty = {
  name: string;
  price: string;
  area: string;
};

function getAreaConversions(area: number, unit: "sqft" | "sqm") {
  const areaInSquareFeet = unit === "sqft" ? area : area * SQFT_PER_SQM;
  const areaInSquareMetres = unit === "sqm" ? area : area / SQFT_PER_SQM;

  return {
    areaInSquareFeet,
    areaInSquareMetres,
  };
}

function getRatePerArea(price: number, area: number, unit: "sqft" | "sqm") {
  const safePrice = Math.max(0, price);
  const safeArea = Math.max(0, area);
  const { areaInSquareFeet, areaInSquareMetres } = getAreaConversions(safeArea, unit);

  return {
    perSqft: areaInSquareFeet > 0 ? safePrice / areaInSquareFeet : 0,
    perSqm: areaInSquareMetres > 0 ? safePrice / areaInSquareMetres : 0,
  };
}

function getBenchmarkMessage(deltaPercent: number) {
  if (Math.abs(deltaPercent) < 3) {
    return "Very close to your benchmark. This listing looks roughly in line on a size-adjusted basis.";
  }
  if (deltaPercent < 0) {
    return "Below your benchmark. This may indicate better value, but confirm condition, layout, and service costs before treating it as a deal.";
  }
  return "Above your benchmark. The premium may be justified by location, views, finishing, floor level, or amenities, but it deserves a closer look.";
}

function getDecisionSignal(deltaPercent: number) {
  if (deltaPercent <= -10) {
    return {
      label: "Potential value",
      description: "Well below benchmark. Check whether the discount is a real value opportunity or a quality issue.",
      tone: "border-emerald-400/30 bg-emerald-500/10 text-emerald-700",
    };
  }
  if (deltaPercent < 5) {
    return {
      label: "Near market",
      description: "Close to benchmark. Pricing looks roughly in line on a size-adjusted basis.",
      tone: "border-sky-400/30 bg-sky-500/10 text-sky-700",
    };
  }
  return {
    label: "Premium pricing",
    description: "Above benchmark. Make sure the premium is supported by location, view, quality, or amenities.",
    tone: "border-amber-400/30 bg-amber-500/10 text-amber-700",
  };
}

function comparisonLabel(rateA: number, rateB: number) {
  if (rateA <= 0 || rateB <= 0) return "";
  if (Math.abs(rateA - rateB) < 0.01) return "Both properties are effectively priced the same per unit of area.";
  return rateA < rateB
    ? "Property A is cheaper on a size-adjusted basis."
    : "Property B is cheaper on a size-adjusted basis.";
}

function PropertyComparisonCard({
  title,
  property,
  onChange,
  marketKey,
  unit,
  modeLabel,
}: {
  title: string;
  property: ComparisonProperty;
  onChange: (next: ComparisonProperty) => void;
  marketKey: string;
  unit: "sqft" | "sqm";
  modeLabel: string;
}) {
  const market = getRealEstateMarket(marketKey);
  const priceValue = Number(property.price) || 0;
  const areaValue = Number(property.area) || 0;
  const rates = getRatePerArea(priceValue, areaValue, unit);

  return (
    <article className="glass-card rounded-[1.5rem] border border-border/80 p-5">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="mt-4 grid gap-3">
        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Label</span>
          <input
            type="text"
            value={property.name}
            onChange={(event) => onChange({ ...property, name: event.target.value })}
            placeholder="Example: Property A"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
          />
        </label>
        <NumberField
          label={modeLabel}
          value={property.price}
          onChange={(value) => onChange({ ...property, price: value })}
          placeholder="Enter total amount"
        />
        <NumberField
          label={`Area (${unit})`}
          value={property.area}
          onChange={(value) => onChange({ ...property, area: value })}
          placeholder="Enter property area"
        />
      </div>

      <div className="mt-4 rounded-2xl border border-border/70 bg-background/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Rate</p>
        <p className="mt-2 text-lg font-semibold text-foreground">
          {rates.perSqft > 0
            ? unit === "sqft"
              ? `${formatMoney(rates.perSqft, market)} / sq ft`
              : `${formatMoney(rates.perSqm, market)} / sq m`
            : "-"}
        </p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {rates.perSqft > 0
            ? `${formatMoney(rates.perSqft, market)} / sq ft and ${formatMoney(rates.perSqm, market)} / sq m`
            : "Add both total amount and area to compare this property."}
        </p>
      </div>
    </article>
  );
}

export default function PricePerSquareFootCalculator() {
  const [marketKey, setMarketKey] = useState("AE");
  const [transactionType, setTransactionType] = useState<"buy" | "rent">("buy");
  const [calculationMode, setCalculationMode] = useState<"rate" | "reverse">("rate");
  const [amount, setAmount] = useState("");
  const [area, setArea] = useState("");
  const [unit, setUnit] = useState<"sqft" | "sqm">("sqft");
  const [targetRate, setTargetRate] = useState("");
  const [benchmarkRate, setBenchmarkRate] = useState("");
  const [dubaiBenchmarkKey, setDubaiBenchmarkKey] = useState<string>("custom");
  const [comparisonA, setComparisonA] = useState<ComparisonProperty>({
    name: "Property A",
    price: "",
    area: "",
  });
  const [comparisonB, setComparisonB] = useState<ComparisonProperty>({
    name: "Property B",
    price: "",
    area: "",
  });

  const market = getRealEstateMarket(marketKey);
  const amountValue = Number(amount) || 0;
  const areaValue = Number(area) || 0;
  const targetRateValue = Number(targetRate) || 0;
  const benchmarkRateValue = Number(benchmarkRate) || 0;

  const mainResult = useMemo(() => {
    const totalAmount = calculationMode === "rate" ? amountValue : targetRateValue * areaValue;
    const rates = getRatePerArea(totalAmount, areaValue, unit);
    const { areaInSquareFeet, areaInSquareMetres } = getAreaConversions(areaValue, unit);

    return {
      totalAmount,
      ratePerSqft: rates.perSqft,
      ratePerSqm: rates.perSqm,
      areaInSquareFeet,
      areaInSquareMetres,
    };
  }, [amountValue, areaValue, calculationMode, targetRateValue, unit]);

  const benchmarkDelta = useMemo(() => {
    const activeRate = unit === "sqft" ? mainResult.ratePerSqft : mainResult.ratePerSqm;
    if (benchmarkRateValue <= 0 || activeRate <= 0) return null;
    const delta = ((activeRate - benchmarkRateValue) / benchmarkRateValue) * 100;
    return {
      activeRate,
      delta,
      message: getBenchmarkMessage(delta),
      signal: getDecisionSignal(delta),
    };
  }, [benchmarkRateValue, mainResult.ratePerSqft, mainResult.ratePerSqm, unit]);

  const activeDubaiBenchmark = DUBAI_SALE_BENCHMARKS.find((item) => item.key === dubaiBenchmarkKey) ?? DUBAI_SALE_BENCHMARKS[0];

  const comparisonSummary = useMemo(() => {
    const propertyARates = getRatePerArea(Number(comparisonA.price) || 0, Number(comparisonA.area) || 0, unit);
    const propertyBRates = getRatePerArea(Number(comparisonB.price) || 0, Number(comparisonB.area) || 0, unit);
    const rateA = unit === "sqft" ? propertyARates.perSqft : propertyARates.perSqm;
    const rateB = unit === "sqft" ? propertyBRates.perSqft : propertyBRates.perSqm;

    if (rateA <= 0 || rateB <= 0) return null;

    const cheaper = rateA < rateB ? comparisonA.name || "Property A" : comparisonB.name || "Property B";
    const expensiveRate = Math.max(rateA, rateB);
    const cheaperRate = Math.min(rateA, rateB);
    const savingPercent = expensiveRate > 0 ? ((expensiveRate - cheaperRate) / expensiveRate) * 100 : 0;

    return {
      rateA,
      rateB,
      cheaper,
      text: comparisonLabel(rateA, rateB),
      savingPercent,
    };
  }, [comparisonA, comparisonB, unit]);

  const modeLabel = transactionType === "buy" ? "Property price" : "Monthly rent";
  const benchmarkLabel =
    transactionType === "buy"
      ? `Local sale benchmark (${unit === "sqft" ? "per sq ft" : "per sq m"})`
      : `Local rent benchmark (${unit === "sqft" ? "per sq ft" : "per sq m"})`;
  const benchmarkHelper =
    transactionType === "buy"
      ? "Use your own market average if you have it. This lets the tool tell you whether the listing looks cheaper or more expensive on a size-adjusted basis."
      : "Add a local rent benchmark to judge whether the asking rent looks low, typical, or expensive for the size.";

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <MarketField value={marketKey} onChange={setMarketKey} />
          <SelectField
            label="Mode"
            value={transactionType}
            onChange={(value) => setTransactionType(value as "buy" | "rent")}
            options={[
              { label: "Buy / sale", value: "buy" },
              { label: "Rent / lease", value: "rent" },
            ]}
            helper="Use sale price for purchases or monthly rent for lease comparison."
          />
          <SelectField
            label="Calculation type"
            value={calculationMode}
            onChange={(value) => setCalculationMode(value as "rate" | "reverse")}
            options={[
              { label: "Calculate price per area", value: "rate" },
              { label: "Reverse: calculate total amount", value: "reverse" },
            ]}
            helper="Reverse mode is useful when you already know a target rate per square foot or square metre."
          />
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {calculationMode === "rate" ? (
            <NumberField
              label={modeLabel}
              value={amount}
              onChange={setAmount}
              placeholder={transactionType === "buy" ? "Enter total property price" : "Enter monthly rent"}
            />
          ) : (
            <NumberField
              label={`Target rate (${unit === "sqft" ? "per sq ft" : "per sq m"})`}
              value={targetRate}
              onChange={setTargetRate}
              placeholder="Enter target rate"
            />
          )}

          <NumberField
            label="Area"
            value={area}
            onChange={setArea}
            placeholder="Enter property area"
          />
          <SelectField
            label="Area unit"
            value={unit}
            onChange={(value) => setUnit(value as "sqft" | "sqm")}
            options={[
              { label: "Square feet", value: "sqft" },
              { label: "Square metres", value: "sqm" },
            ]}
            helper="The calculator will show both square-foot and square-metre rates."
          />
          <NumberField
            label={benchmarkLabel}
            value={benchmarkRate}
            onChange={(value) => {
              setBenchmarkRate(value);
              setDubaiBenchmarkKey("custom");
            }}
            placeholder="Optional benchmark"
            helper={benchmarkHelper}
          />
        </div>

        {marketKey === "AE" && transactionType === "buy" && unit === "sqft" ? (
          <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,18rem)_1fr]">
            <SelectField
              label="Dubai area benchmark"
              value={dubaiBenchmarkKey}
              onChange={(value) => {
                setDubaiBenchmarkKey(value);
                const selected = DUBAI_SALE_BENCHMARKS.find((item) => item.key === value);
                if (selected && selected.ratePerSqft > 0) {
                  setBenchmarkRate(String(selected.ratePerSqft));
                }
              }}
              options={DUBAI_SALE_BENCHMARKS.map((item) => ({
                label: item.label,
                value: item.key,
              }))}
              helper="Quick-fill with Dubai apartment sale benchmarks from Bayut's H1 2025 market report."
            />
            <div className="rounded-[1.25rem] border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">
                {activeDubaiBenchmark.key === "custom"
                  ? "Use a custom benchmark"
                  : `${activeDubaiBenchmark.label}: ${formatMoney(activeDubaiBenchmark.ratePerSqft, market)} / sq ft`}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {activeDubaiBenchmark.note} These are directional examples, not live valuation feeds, and are best used for quick comparison rather than exact pricing.
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-6 rounded-[1.25rem] border border-primary/15 bg-primary-soft p-4">
          <p className="text-sm font-semibold text-primary-soft-foreground">
            Price per square foot shows how much you pay for each unit of space.
          </p>
          <p className="mt-1 text-sm leading-6 text-primary-soft-foreground">
            Example: AED 1,000,000 divided by 1,000 sq ft = AED 1,000 per sq ft.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label={calculationMode === "rate" ? `${transactionType === "buy" ? "Price" : "Rent"} per ${unit === "sqft" ? "sq ft" : "sq m"}` : `Total ${transactionType === "buy" ? "price" : "rent"}`}
          value={
            calculationMode === "rate"
              ? formatMoney(unit === "sqft" ? mainResult.ratePerSqft : mainResult.ratePerSqm, market)
              : formatMoney(mainResult.totalAmount, market)
          }
          helper={
            calculationMode === "rate"
              ? "Primary result from the area unit you entered."
              : `Calculated from area x target ${unit === "sqft" ? "sq ft" : "sq m"} rate.`
          }
        />
        <ResultCard
          label={transactionType === "buy" ? "Sale price per sq ft" : "Rent per sq ft"}
          value={formatMoney(mainResult.ratePerSqft, market)}
          helper="Useful when comparing listings quoted in square feet."
        />
        <ResultCard
          label={transactionType === "buy" ? "Sale price per sq m" : "Rent per sq m"}
          value={formatMoney(mainResult.ratePerSqm, market)}
          helper="Useful when comparing listings quoted in square metres."
        />
        <ResultCard
          label="Converted area"
          value={unit === "sqft" ? `${formatNumber(mainResult.areaInSquareMetres)} sq m` : `${formatNumber(mainResult.areaInSquareFeet)} sq ft`}
          helper="The same property area expressed in the other unit."
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="glass-card rounded-[1.5rem] border border-border/80 p-5">
          <h2 className="text-lg font-semibold text-foreground">Interpretation</h2>
          <div className="mt-4 space-y-3">
            {benchmarkDelta ? (
              <>
                <div className={`inline-flex rounded-full border px-4 py-1.5 text-sm font-semibold ${benchmarkDelta.signal.tone}`}>
                  {benchmarkDelta.signal.label}
                </div>
                <p className="rounded-[1rem] border border-border/70 bg-background/80 p-3 text-sm leading-6 text-muted-foreground">
                  Your listing is{" "}
                  <span className="font-semibold text-foreground">
                    {benchmarkDelta.delta > 0 ? `${formatNumber(Math.abs(benchmarkDelta.delta))}% above` : `${formatNumber(Math.abs(benchmarkDelta.delta))}% below`}
                  </span>{" "}
                  your benchmark.
                </p>
                <p className="rounded-[1rem] border border-border/70 bg-background/80 p-3 text-sm leading-6 text-muted-foreground">
                  {benchmarkDelta.signal.description}
                </p>
                <p className="rounded-[1rem] border border-border/70 bg-background/80 p-3 text-sm leading-6 text-muted-foreground">
                  {benchmarkDelta.message}
                </p>
              </>
            ) : (
              <p className="rounded-[1rem] border border-border/70 bg-background/80 p-3 text-sm leading-6 text-muted-foreground">
                Add a local benchmark if you want the tool to tell you whether the listing looks below market, near market, or above market. Without a benchmark, the rate is still useful for comparing properties side by side.
              </p>
            )}
            <p className="rounded-[1rem] border border-border/70 bg-background/80 p-3 text-sm leading-6 text-muted-foreground">
              Use price per area as a starting point, not a full valuation. Layout, floor level, views, amenities, condition, parking, service charge, and tenant quality can all justify a premium or discount.
            </p>
          </div>
        </div>

        <div className="glass-card rounded-[1.5rem] border border-border/80 p-5">
          <h2 className="text-lg font-semibold text-foreground">Next steps</h2>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href="/real-estate/rental-yield-calculator" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              Rental yield
            </Link>
            <Link href="/finance/mortgage-calculator" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              Mortgage payment
            </Link>
            <Link href="/finance/roi-calculator" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              ROI calculator
            </Link>
            <Link href="/real-estate/cap-rate-calculator" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              Cap rate
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Compare two properties</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Use the same unit and the same buy or rent context to compare listings on a size-adjusted basis.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <PropertyComparisonCard
            title="Comparison property A"
            property={comparisonA}
            onChange={setComparisonA}
            marketKey={marketKey}
            unit={unit}
            modeLabel={modeLabel}
          />
          <PropertyComparisonCard
            title="Comparison property B"
            property={comparisonB}
            onChange={setComparisonB}
            marketKey={marketKey}
            unit={unit}
            modeLabel={modeLabel}
          />
        </div>

        {comparisonSummary ? (
          <div className="glass-card rounded-[1.5rem] border border-border/80 p-5">
            <p className="text-sm font-semibold text-foreground">{comparisonSummary.text}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {comparisonSummary.cheaper} is cheaper by about {formatNumber(comparisonSummary.savingPercent)}% on a per-area basis.
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Property A: {formatMoney(comparisonSummary.rateA, market)} / {unit === "sqft" ? "sq ft" : "sq m"} vs Property B: {formatMoney(comparisonSummary.rateB, market)} / {unit === "sqft" ? "sq ft" : "sq m"}.
            </p>
          </div>
        ) : null}
      </section>

      <NoteCard title="How to use price per square foot well">
        <p>
          Price per square foot or square metre is most useful when you compare similar properties in the same area,
          building type, and transaction context. It standardizes listings that have different total prices and sizes.
        </p>
        <p className="mt-3">
          The number becomes much more useful once you bring in a benchmark or a second property. That is what turns a
          simple formula into a decision tool.
        </p>
      </NoteCard>
    </div>
  );
}
