"use client";

import { useMemo, useState } from "react";

import {
  NoteCard,
  NumberField,
  ResultCard,
  SelectField,
  formatMoney,
  formatPercent,
} from "@/components/real-estate/shared";
import { calculateWalesLtt } from "@/lib/tools/real-estate";

const GBP_MARKET = { key: "UK", label: "United Kingdom", currency: "GBP", locale: "en-GB" } as const;

export default function WalesLttCalculator() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [higherRates, setHigherRates] = useState("no");

  const result = useMemo(
    () =>
      calculateWalesLtt({
        purchasePrice: Number(purchasePrice) || 0,
        higherRates: higherRates === "yes",
      }),
    [higherRates, purchasePrice],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <NumberField
            label="Purchase price"
            value={purchasePrice}
            onChange={setPurchasePrice}
            placeholder="Enter purchase price"
          />
          <SelectField
            label="Use higher residential rates?"
            value={higherRates}
            onChange={setHigherRates}
            options={[
              { label: "No", value: "no" },
              { label: "Yes", value: "yes" },
            ]}
            helper="Use this when the purchase falls into the higher residential rate rules rather than the standard main-residence bands."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ResultCard
          label="Estimated LTT"
          value={formatMoney(result.ltt, GBP_MARKET)}
          helper="Calculated using the current Welsh residential rate schedule selected above."
        />
        <ResultCard
          label="Effective rate"
          value={formatPercent(result.effectiveRate)}
          helper="The estimated LTT amount as a share of the purchase price."
        />
        <ResultCard
          label="Purchase price"
          value={formatMoney(Number(purchasePrice) || 0, GBP_MARKET)}
          helper="Shown alongside the estimate so the tax burden is easier to judge at a glance."
        />
      </section>

      <NoteCard title="Why Wales LTT should not be mixed into a UK-wide stamp duty page">
        <p>
          Wales uses Land Transaction Tax rather than SDLT or LBTT. Keeping it separate lets this page stay aligned with
          the actual Welsh bands instead of flattening everything into a single UK average that would be wrong for real
          budgeting.
        </p>
      </NoteCard>
    </div>
  );
}
