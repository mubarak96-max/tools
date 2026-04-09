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
import { calculateStampDuty } from "@/lib/tools/real-estate";

export default function StampDutyCalculator() {
  const [marketKey, setMarketKey] = useState("US");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [dutyPercent, setDutyPercent] = useState("3");
  const [legalFees, setLegalFees] = useState("");
  const [registrationFees, setRegistrationFees] = useState("");
  const market = getRealEstateMarket(marketKey);

  const result = useMemo(
    () =>
      calculateStampDuty({
        purchasePrice: Number(purchasePrice) || 0,
        dutyPercent: Number(dutyPercent) || 0,
        legalFees: Number(legalFees) || 0,
        registrationFees: Number(registrationFees) || 0,
      }),
    [dutyPercent, legalFees, purchasePrice, registrationFees],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MarketField value={marketKey} onChange={setMarketKey} />
          <NumberField
            label="Purchase price"
            value={purchasePrice}
            onChange={setPurchasePrice}
            placeholder="Enter purchase price"
          />
          <NumberField
            label="Duty or transfer tax (%)"
            value={dutyPercent}
            onChange={setDutyPercent}
            placeholder="3"
            step={0.1}
            helper="Enter the rate that applies in your market or for your property type."
          />
          <NumberField
            label="Legal fees"
            value={legalFees}
            onChange={setLegalFees}
            placeholder="Enter legal fees"
          />
          <NumberField
            label="Registration fees"
            value={registrationFees}
            onChange={setRegistrationFees}
            placeholder="Enter registration fees"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ResultCard
          label="Duty amount"
          value={formatMoney(result.dutyAmount, market)}
          helper="The charge based on the purchase price and duty rate entered."
        />
        <ResultCard
          label="Total transaction fees"
          value={formatMoney(result.totalTransactionFees, market)}
          helper="Duty, legal fees, and registration fees combined."
        />
        <ResultCard
          label="Total cash including property"
          value={formatMoney(result.totalCashNeeded, market)}
          helper="The purchase price plus the estimated duty-related transaction costs."
        />
      </section>

      <NoteCard title="Why this stamp duty calculator uses a custom rate">
        <p>
          Stamp duty, transfer tax, and registration charges vary widely across countries, cities, property values, and
          even buyer profiles. This page is built as a flexible estimate instead of pretending one global rate fits every market.
        </p>
        <p className="mt-3">
          Use the market selector for the currency and then enter the rate and fees that apply to your specific
          transaction. That makes the result more honest than hardcoding one rule for every region.
        </p>
      </NoteCard>
    </div>
  );
}
