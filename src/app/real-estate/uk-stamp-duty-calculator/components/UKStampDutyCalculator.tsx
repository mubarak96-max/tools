"use client";

import { useMemo, useState } from "react";

import { NoteCard, NumberField, ResultCard, SelectField, formatMoney, formatPercent } from "@/components/real-estate/shared";
import { calculateUkSdlt } from "@/lib/tools/real-estate";

export default function UKStampDutyCalculator() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [buyerType, setBuyerType] = useState("standard");
  const [additionalProperty, setAdditionalProperty] = useState("no");
  const [nonUkResident, setNonUkResident] = useState("no");

  const result = useMemo(
    () =>
      calculateUkSdlt({
        purchasePrice: Number(purchasePrice) || 0,
        buyerType: buyerType as "standard" | "first-time",
        additionalProperty: additionalProperty === "yes",
        nonUkResident: nonUkResident === "yes",
      }),
    [additionalProperty, buyerType, nonUkResident, purchasePrice],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <NumberField
            label="Purchase price"
            value={purchasePrice}
            onChange={setPurchasePrice}
            placeholder="Enter purchase price"
          />
          <SelectField
            label="Buyer type"
            value={buyerType}
            onChange={setBuyerType}
            options={[
              { label: "Standard buyer", value: "standard" },
              { label: "First-time buyer", value: "first-time" },
            ]}
          />
          <SelectField
            label="Additional dwelling?"
            value={additionalProperty}
            onChange={setAdditionalProperty}
            options={[
              { label: "No", value: "no" },
              { label: "Yes", value: "yes" },
            ]}
            helper="Additional residential property purchases usually attract the higher-rate surcharge."
          />
          <SelectField
            label="Non-UK resident surcharge?"
            value={nonUkResident}
            onChange={setNonUkResident}
            options={[
              { label: "No", value: "no" },
              { label: "Yes", value: "yes" },
            ]}
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label="Estimated SDLT"
          value={formatMoney(result.sdlt, { key: "UK", label: "United Kingdom", currency: "GBP", locale: "en-GB" })}
          helper="Based on England and Northern Ireland residential SDLT bands."
        />
        <ResultCard
          label="Effective rate"
          value={formatPercent(result.effectiveRate)}
          helper="The total SDLT as a share of the purchase price."
        />
        <ResultCard
          label="Surcharge added"
          value={formatPercent(result.surchargeRate)}
          helper="Additional dwelling surcharge and non-UK resident surcharge combined."
        />
        <ResultCard
          label="First-time relief"
          value={result.usesFirstTimeRelief ? "Applied" : "Not applied"}
          helper="First-time buyer relief only applies within the qualifying purchase-price limit."
        />
      </section>

      <NoteCard title="What this UK SDLT page covers">
        <p>
          This calculator is built around current residential SDLT rules for England and Northern Ireland. Scotland and
          Wales use different transaction taxes, so they need separate calculators rather than being mixed into this page.
        </p>
      </NoteCard>
    </div>
  );
}
