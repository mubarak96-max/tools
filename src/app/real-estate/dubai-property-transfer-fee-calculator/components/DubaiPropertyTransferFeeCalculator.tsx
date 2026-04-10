"use client";

import { useMemo, useState } from "react";

import { NoteCard, NumberField, ResultCard, formatMoney } from "@/components/real-estate/shared";
import { calculateDubaiTransferFee } from "@/lib/tools/real-estate";

const AED_MARKET = { key: "AE", label: "Dubai / UAE", currency: "AED", locale: "en-AE" } as const;

export default function DubaiPropertyTransferFeeCalculator() {
  const [salePrice, setSalePrice] = useState("");

  const result = useMemo(
    () =>
      calculateDubaiTransferFee({
        salePrice: Number(salePrice) || 0,
      }),
    [salePrice],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <NumberField
            label="Sale price"
            value={salePrice}
            onChange={setSalePrice}
            placeholder="Enter sale price"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ResultCard
          label="DLD transfer fee"
          value={formatMoney(result.dldTransferFee, AED_MARKET)}
          helper="Calculated at 4% of the sale price."
        />
        <ResultCard
          label="Registration trustee fee"
          value={formatMoney(result.trusteeFee, AED_MARKET)}
          helper="AED 2,100 below AED 500,000, otherwise AED 4,200."
        />
        <ResultCard
          label="Total estimated fees"
          value={formatMoney(result.totalFees, AED_MARKET)}
          helper="Transfer fee, trustee fee, title deed fee, knowledge fee, and innovation fee combined."
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard label="Title deed fee" value={formatMoney(result.titleDeedFee, AED_MARKET)} />
        <ResultCard label="Knowledge fee" value={formatMoney(result.knowledgeFee, AED_MARKET)} />
        <ResultCard label="Innovation fee" value={formatMoney(result.innovationFee, AED_MARKET)} />
        <ResultCard label="Sale price" value={formatMoney(Number(salePrice) || 0, AED_MARKET)} />
      </section>

      <NoteCard title="Why Dubai transfer costs should be estimated separately">
        <p>
          Dubai property buyers often focus on the 4% transfer fee first, but the registration trustee fee and title-related
          charges still change the real cash requirement at transfer.
        </p>
      </NoteCard>
    </div>
  );
}
