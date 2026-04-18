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

  const copyResults = async () => {
    const text = `Cap Rate: ${formatPercent(result.capRate)}\nNet Operating Income: ${formatMoney(result.noi, market)}\nProperty Value: ${formatMoney(Number(propertyValue) || 0, market)}`;
    await navigator.clipboard.writeText(text);
    alert("Results copied to clipboard!");
  };

  const getInvestmentQuality = (rate: number) => {
    if (rate <= 0) return { label: "No Return", description: "Negative or zero NOI.", color: "text-muted-foreground" };
    if (rate < 4) return { label: "Low Yield / Low Risk", description: "Typical in high-demand or premium markets.", color: "text-amber-500" };
    if (rate <= 8) return { label: "Average Market Yield", description: "Standard risk/reward profile.", color: "text-emerald-500" };
    return { label: "High Yield / High Risk", description: "Could indicate higher returns or potential property issues.", color: "text-blue-500" };
  };

  const quality = getInvestmentQuality(result.capRate);

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
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:col-span-2 xl:col-span-3">
          <h3 className="text-sm font-bold tracking-tight text-muted-foreground uppercase opacity-80 mb-2">Market Comparison & Quality</h3>
          <p className={`text-xl font-black ${quality.color} mb-1`}>{quality.label}</p>
          <p className="text-sm text-muted-foreground">{quality.description}</p>
        </div>
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
