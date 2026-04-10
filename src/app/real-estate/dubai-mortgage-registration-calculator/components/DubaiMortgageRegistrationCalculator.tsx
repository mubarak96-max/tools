"use client";

import { useMemo, useState } from "react";

import { NoteCard, NumberField, ResultCard, formatMoney } from "@/components/real-estate/shared";
import { calculateDubaiMortgageRegistration } from "@/lib/tools/real-estate";

const AED_MARKET = { key: "AE", label: "Dubai / UAE", currency: "AED", locale: "en-AE" } as const;

export default function DubaiMortgageRegistrationCalculator() {
  const [mortgageValue, setMortgageValue] = useState("");

  const result = useMemo(
    () =>
      calculateDubaiMortgageRegistration({
        mortgageValue: Number(mortgageValue) || 0,
      }),
    [mortgageValue],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <NumberField
            label="Mortgage amount"
            value={mortgageValue}
            onChange={setMortgageValue}
            placeholder="Enter mortgage amount"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ResultCard
          label="Mortgage registration fee"
          value={formatMoney(result.mortgageFee, AED_MARKET)}
          helper="Calculated at 0.25% of the registered mortgage value."
        />
        <ResultCard
          label="Total estimated DLD charges"
          value={formatMoney(result.totalFees, AED_MARKET)}
          helper="Mortgage registration fee plus title deed, knowledge, and innovation fees."
        />
        <ResultCard
          label="Mortgage amount"
          value={formatMoney(Number(mortgageValue) || 0, AED_MARKET)}
          helper="Shown with the fee total so the registration cost is easier to benchmark."
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ResultCard label="Title deed fee" value={formatMoney(result.titleDeedFee, AED_MARKET)} />
        <ResultCard label="Knowledge fee" value={formatMoney(result.knowledgeFee, AED_MARKET)} />
        <ResultCard label="Innovation fee" value={formatMoney(result.innovationFee, AED_MARKET)} />
      </section>

      <NoteCard title="Important scope note for Dubai mortgage registration">
        <p>
          This page estimates the published DLD mortgage registration charges. Some transactions can also involve service
          partner or trustee-channel costs outside the core DLD fee items, so treat this as the statutory baseline rather
          than a substitute for the final fee advice on the live transaction.
        </p>
      </NoteCard>
    </div>
  );
}
