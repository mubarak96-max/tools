"use client";

import { useMemo, useState } from "react";

import { NoteCard, NumberField, ResultCard, formatMoney } from "@/components/real-estate/shared";
import { calculateDubaiMortgageRegistration } from "@/lib/tools/real-estate";

const AED_MARKET = { key: "AE", label: "Dubai / UAE", currency: "AED", locale: "en-AE" } as const;

export default function DubaiMortgageRegistrationCalculator() {
  const [propertyPrice, setPropertyPrice] = useState("");
  const [downPaymentPct, setDownPaymentPct] = useState("20");
  const [bankFee, setBankFee] = useState("");

  const numPropertyPrice = Number(propertyPrice) || 0;
  const numDownPaymentPct = Number(downPaymentPct) || 0;
  const calcMortgageValue = numPropertyPrice - (numPropertyPrice * (numDownPaymentPct / 100));

  const result = useMemo(
    () =>
      calculateDubaiMortgageRegistration({
        mortgageValue: calcMortgageValue,
      }),
    [calcMortgageValue],
  );

  const numBankFee = Number(bankFee) || 0;
  const totalUpfront = result.totalFees + numBankFee;

  const copyResults = async () => {
    const text = `Mortgage Amount: ${formatMoney(calcMortgageValue, AED_MARKET)}\nDLD Fees: ${formatMoney(result.totalFees, AED_MARKET)}\nBank Fee: ${formatMoney(numBankFee, AED_MARKET)}\nTotal Upfront Cost: ${formatMoney(totalUpfront, AED_MARKET)}`;
    await navigator.clipboard.writeText(text);
    alert("Results copied to clipboard!");
  };

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <NumberField
            label="Property price"
            value={propertyPrice}
            onChange={setPropertyPrice}
            placeholder="Enter property price"
          />
          <NumberField
            label="Down payment (%)"
            value={downPaymentPct}
            onChange={setDownPaymentPct}
            placeholder="Enter down payment percentage"
          />
          <NumberField
            label="Bank processing fee"
            value={bankFee}
            onChange={setBankFee}
            placeholder="Enter bank processing fee"
            helper="Typically around 1% of the mortgage amount plus VAT."
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
          label="Total upfront costs"
          value={formatMoney(totalUpfront, AED_MARKET)}
          helper="Combined DLD registration fees and bank processing fees."
        />
        <ResultCard
          label="Calculated mortgage amount"
          value={formatMoney(calcMortgageValue, AED_MARKET)}
          helper="Property price minus the down payment."
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
