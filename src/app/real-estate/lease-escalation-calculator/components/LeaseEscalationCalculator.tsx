"use client";

import { useMemo, useState } from "react";

import {
  MarketField,
  NoteCard,
  NumberField,
  ResultCard,
  formatMoney,
  getRealEstateMarket,
} from "@/components/real-estate/shared";
import { calculateLeaseEscalation } from "@/lib/tools/real-estate";

export default function LeaseEscalationCalculator() {
  const [marketKey, setMarketKey] = useState("US");
  const [baseMonthlyRent, setBaseMonthlyRent] = useState("");
  const [annualIncreasePercent, setAnnualIncreasePercent] = useState("3");
  const [years, setYears] = useState("5");
  const market = getRealEstateMarket(marketKey);

  const result = useMemo(
    () =>
      calculateLeaseEscalation({
        baseMonthlyRent: Number(baseMonthlyRent) || 0,
        annualIncreasePercent: Number(annualIncreasePercent) || 0,
        years: Number(years) || 0,
      }),
    [annualIncreasePercent, baseMonthlyRent, years],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MarketField value={marketKey} onChange={setMarketKey} />
          <NumberField
            label="Starting monthly rent"
            value={baseMonthlyRent}
            onChange={setBaseMonthlyRent}
            placeholder="Enter starting rent"
          />
          <NumberField
            label="Annual escalation (%)"
            value={annualIncreasePercent}
            onChange={setAnnualIncreasePercent}
            placeholder="3"
            step={0.1}
            helper="Use the yearly rent increase percentage written into the lease."
          />
          <NumberField
            label="Lease term (years)"
            value={years}
            onChange={setYears}
            placeholder="5"
            helper="This calculator projects the rent across the full lease term."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ResultCard
          label="Starting monthly rent"
          value={formatMoney(Number(baseMonthlyRent) || 0, market)}
          helper="The rent in year one before escalations begin."
        />
        <ResultCard
          label="Final monthly rent"
          value={formatMoney(result.finalMonthlyRent, market)}
          helper="The estimated monthly rent in the last year of the term."
        />
        <ResultCard
          label="Total rent across term"
          value={formatMoney(result.totalRent, market)}
          helper="The full rent paid over the number of years entered."
        />
      </section>

      {result.schedule.length ? (
        <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-foreground">Year-by-year rent schedule</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Year</th>
                  <th className="pb-3 pr-4 font-medium">Monthly rent</th>
                  <th className="pb-3 font-medium">Annual rent</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr key={row.year} className="border-b border-border/50">
                    <td className="py-3 pr-4 text-foreground">{row.year}</td>
                    <td className="py-3 pr-4 text-foreground">{formatMoney(row.monthlyRent, market)}</td>
                    <td className="py-3 text-foreground">{formatMoney(row.annualRent, market)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <NoteCard title="Why lease escalation changes the long-term rent picture">
        <p>
          A lease can look affordable on the starting monthly rent, then drift upward much faster than expected once the
          annual increase clause kicks in year after year.
        </p>
        <p className="mt-3">
          This page helps you see the full term, not just the first year. That is especially useful when comparing two
          lease offers with different escalation structures.
        </p>
      </NoteCard>
    </div>
  );
}
