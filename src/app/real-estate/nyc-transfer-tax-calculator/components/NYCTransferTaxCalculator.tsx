"use client";

import { useMemo, useState } from "react";

import { NoteCard, NumberField, ResultCard, SelectField, formatMoney, formatPercent } from "@/components/real-estate/shared";
import { calculateNycTransferTax } from "@/lib/tools/real-estate";

const USD_MARKET = { key: "US", label: "United States", currency: "USD", locale: "en-US" } as const;

export default function NYCTransferTaxCalculator() {
  const [transferPrice, setTransferPrice] = useState("");
  const [propertyType, setPropertyType] = useState("residential-1-3-family");

  const result = useMemo(
    () =>
      calculateNycTransferTax({
        transferPrice: Number(transferPrice) || 0,
        propertyType: propertyType as "residential-1-3-family" | "other",
      }),
    [propertyType, transferPrice],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="Transfer price"
            value={transferPrice}
            onChange={setTransferPrice}
            placeholder="Enter transfer price"
          />
          <SelectField
            label="Property type"
            value={propertyType}
            onChange={setPropertyType}
            options={[
              { label: "Residential 1-3 family home", value: "residential-1-3-family" },
              { label: "Other property type", value: "other" },
            ]}
            helper="NYC transfer tax rates differ by property class and transfer-price threshold."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ResultCard
          label="RPTT rate"
          value={formatPercent(result.rate)}
          helper="Current NYC Real Property Transfer Tax rate based on the transfer type entered."
        />
        <ResultCard
          label="Estimated NYC transfer tax"
          value={formatMoney(result.rtt, USD_MARKET)}
          helper="Estimated Real Property Transfer Tax for the transfer price entered."
        />
        <ResultCard
          label="Transfer price"
          value={formatMoney(Number(transferPrice) || 0, USD_MARKET)}
          helper="Shown again so the tax amount can be read against the transaction value."
        />
      </section>

      <NoteCard title="Why NYC transfer tax needs its own page">
        <p>
          New York City transfer tax is not the same as a generic US real-estate fee. The rate changes based on the
          transfer-price threshold and the kind of property being transferred.
        </p>
      </NoteCard>
    </div>
  );
}
