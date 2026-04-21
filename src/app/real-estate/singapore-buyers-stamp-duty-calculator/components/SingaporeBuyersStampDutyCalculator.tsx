"use client";

import { useMemo, useState } from "react";

import { NoteCard, NumberField, ResultCard, SelectField, formatMoney, formatPercent } from "@/components/real-estate/shared";
import { calculateSingaporeBuyerStampDuty } from "@/lib/tools/real-estate";

const SGD_MARKET = { key: "SG", label: "Singapore", currency: "SGD", locale: "en-SG" } as const;

export default function SingaporeBuyersStampDutyCalculator() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [buyerProfile, setBuyerProfile] = useState("sc-first");

  const result = useMemo(
    () =>
      calculateSingaporeBuyerStampDuty({
        purchasePrice: Number(purchasePrice) || 0,
        buyerProfile: buyerProfile as
          | "sc-first"
          | "sc-second"
          | "sc-third-plus"
          | "spr-first"
          | "spr-second"
          | "spr-third-plus"
          | "foreigner"
          | "entity",
      }),
    [buyerProfile, purchasePrice],
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
            label="Buyer profile"
            value={buyerProfile}
            onChange={setBuyerProfile}
            options={[
              { label: "Singapore citizen, first property", value: "sc-first" },
              { label: "Singapore citizen, second property", value: "sc-second" },
              { label: "Singapore citizen, third or more", value: "sc-third-plus" },
              { label: "Permanent resident, first property", value: "spr-first" },
              { label: "Permanent resident, second property", value: "spr-second" },
              { label: "Permanent resident, third or more", value: "spr-third-plus" },
              { label: "Foreigner", value: "foreigner" },
              { label: "Entity", value: "entity" },
            ]}
            helper="ABSD changes substantially by residency profile and residential property count."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label="BSD"
          value={formatMoney(result.bsd, SGD_MARKET)}
          helper="Progressive Buyer's Stamp Duty on the residential purchase price."
        />
        <ResultCard
          label="ABSD"
          value={formatMoney(result.absd, SGD_MARKET)}
          helper="Additional Buyer's Stamp Duty based on the selected buyer profile."
        />
        <ResultCard
          label="ABSD rate"
          value={formatPercent(result.absdRate)}
          helper="The current residential ABSD rate applied to the purchase price."
        />
        <ResultCard
          label="Total buyer duty"
          value={formatMoney(result.totalBuyerStampDuty, SGD_MARKET)}
          helper="BSD and ABSD combined."
        />
      </section>

      <NoteCard title="Why this page separates buyer duty from seller duty">
        <p>
          Singapore buyer-side stamp duty and seller-side stamp duty answer different planning questions. This page stays
          focused on acquisition costs only, so it is easier to use when you are comparing buyer profiles before purchase.
        </p>
      </NoteCard>
    </div>
  );
}
