"use client";

import { useMemo, useState } from "react";

import { NoteCard, NumberField, ResultCard, formatMoney, formatPercent } from "@/components/real-estate/shared";
import { calculateSingaporeSellerStampDuty } from "@/lib/tools/real-estate";

const SGD_MARKET = { key: "SG", label: "Singapore", currency: "SGD", locale: "en-SG" } as const;

export default function SingaporeSellersStampDutyCalculator() {
  const [salePrice, setSalePrice] = useState("");
  const [acquisitionDate, setAcquisitionDate] = useState("");
  const [disposalDate, setDisposalDate] = useState("");

  const result = useMemo(
    () =>
      calculateSingaporeSellerStampDuty({
        salePrice: Number(salePrice) || 0,
        acquisitionDate,
        disposalDate,
      }),
    [acquisitionDate, disposalDate, salePrice],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="Sale price or market value"
            value={salePrice}
            onChange={setSalePrice}
            placeholder="Enter sale price"
            helper="SSD is charged on the higher of the selling price or market value."
          />
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Acquisition date</span>
            <input
              type="date"
              value={acquisitionDate}
              onChange={(event) => setAcquisitionDate(event.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Disposal date</span>
            <input
              type="date"
              value={disposalDate}
              onChange={(event) => setDisposalDate(event.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </label>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label="Estimated SSD"
          value={formatMoney(result.ssd, SGD_MARKET)}
          helper="Calculated from the applicable SSD regime and holding period."
        />
        <ResultCard
          label="SSD rate"
          value={formatPercent(result.ssdRate)}
          helper="The current seller-duty rate triggered by the holding period."
        />
        <ResultCard
          label="Holding period"
          value={`${result.holdingPeriodYears.toFixed(2)} years`}
          helper="Computed from the acquisition date to the disposal date entered."
        />
        <ResultCard
          label="Regime used"
          value={result.regime === "2025-plus" ? "On/after 4 Jul 2025" : "11 Mar 2017 to 3 Jul 2025"}
          helper="Singapore SSD changed again for acquisitions on or after 4 July 2025."
        />
      </section>

      <NoteCard title="Why acquisition date matters for Singapore SSD">
        <p>
          Singapore seller duty depends on when the property was acquired as well as how long it is held. This page uses
          those two dates together so you can see which published regime applies before you assume a flat seller tax rate.
        </p>
      </NoteCard>
    </div>
  );
}
