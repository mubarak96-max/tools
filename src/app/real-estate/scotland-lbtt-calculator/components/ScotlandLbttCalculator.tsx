"use client";

import { useMemo, useState } from "react";

import {
  NoteCard,
  NumberField,
  ResultCard,
  SelectField,
  formatMoney,
} from "@/components/real-estate/shared";
import { calculateScotlandLbtt } from "@/lib/tools/real-estate";

const GBP_MARKET = { key: "UK", label: "United Kingdom", currency: "GBP", locale: "en-GB" } as const;

export default function ScotlandLbttCalculator() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [firstTimeBuyer, setFirstTimeBuyer] = useState("no");
  const [additionalDwelling, setAdditionalDwelling] = useState("no");

  const result = useMemo(
    () =>
      calculateScotlandLbtt({
        purchasePrice: Number(purchasePrice) || 0,
        firstTimeBuyer: firstTimeBuyer === "yes",
        additionalDwelling: additionalDwelling === "yes",
      }),
    [additionalDwelling, firstTimeBuyer, purchasePrice],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="Purchase price"
            value={purchasePrice}
            onChange={setPurchasePrice}
            placeholder="Enter purchase price"
          />
          <SelectField
            label="First-time buyer relief?"
            value={firstTimeBuyer}
            onChange={setFirstTimeBuyer}
            options={[
              { label: "No", value: "no" },
              { label: "Yes", value: "yes" },
            ]}
            helper="This widens the nil-rate band for qualifying first-time buyers in Scotland."
          />
          <SelectField
            label="Additional dwelling?"
            value={additionalDwelling}
            onChange={setAdditionalDwelling}
            options={[
              { label: "No", value: "no" },
              { label: "Yes", value: "yes" },
            ]}
            helper="Additional residential purchases can trigger the Additional Dwelling Supplement."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label="Estimated LBTT"
          value={formatMoney(result.lbtt, GBP_MARKET)}
          helper="Progressive LBTT on the purchase price before any ADS surcharge."
        />
        <ResultCard
          label="Additional Dwelling Supplement"
          value={formatMoney(result.ads, GBP_MARKET)}
          helper="Calculated at 8% of the full purchase price when the purchase is treated as an additional dwelling."
        />
        <ResultCard
          label="Total estimated tax"
          value={formatMoney(result.totalTax, GBP_MARKET)}
          helper="LBTT plus any Additional Dwelling Supplement."
        />
        <ResultCard
          label="Nil-rate band used"
          value={formatMoney(result.firstTimeNilRateBand, GBP_MARKET)}
          helper="Scotland uses a larger nil-rate band for qualifying first-time buyers."
        />
      </section>

      <NoteCard title="What this Scotland LBTT page is built for">
        <p>
          This page is specifically for Scottish residential LBTT. It handles the standard residential bands, the
          separate first-time buyer nil-rate band, and the Additional Dwelling Supplement instead of forcing Scottish
          transactions into an England or Wales stamp-duty model.
        </p>
      </NoteCard>
    </div>
  );
}
