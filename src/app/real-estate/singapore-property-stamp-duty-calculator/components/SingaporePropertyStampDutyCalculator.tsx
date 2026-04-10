"use client";

import { useMemo, useState } from "react";

import { NoteCard, NumberField, ResultCard, SelectField, formatMoney } from "@/components/real-estate/shared";
import { calculateSingaporePropertyStampDuty } from "@/lib/tools/real-estate";

const SGD_MARKET = { key: "SG", label: "Singapore", currency: "SGD", locale: "en-SG" } as const;

export default function SingaporePropertyStampDutyCalculator() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [buyerProfile, setBuyerProfile] = useState("sc-first");
  const [ssdRegime, setSsdRegime] = useState("2025-plus");
  const [yearsHeld, setYearsHeld] = useState("5");

  const result = useMemo(
    () =>
      calculateSingaporePropertyStampDuty({
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
        ssdRegime: ssdRegime as "2025-plus" | "2017-2025",
        yearsHeld: Number(yearsHeld) || 0,
      }),
    [buyerProfile, purchasePrice, ssdRegime, yearsHeld],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <NumberField
            label="Purchase price"
            value={purchasePrice}
            onChange={setPurchasePrice}
            placeholder="Enter property value"
          />
          <SelectField
            label="Buyer profile"
            value={buyerProfile}
            onChange={setBuyerProfile}
            options={[
              { label: "SC buying first residential property", value: "sc-first" },
              { label: "SC buying second residential property", value: "sc-second" },
              { label: "SC buying third or later residential property", value: "sc-third-plus" },
              { label: "SPR buying first residential property", value: "spr-first" },
              { label: "SPR buying second residential property", value: "spr-second" },
              { label: "SPR buying third or later residential property", value: "spr-third-plus" },
              { label: "Foreigner buying residential property", value: "foreigner" },
              { label: "Entity buying residential property", value: "entity" },
            ]}
          />
          <SelectField
            label="SSD purchase-date regime"
            value={ssdRegime}
            onChange={setSsdime => setSsdRegime(setSsdime)}
            options={[
              { label: "Purchased on or after 4 Jul 2025", value: "2025-plus" },
              { label: "Purchased between 11 Mar 2017 and 3 Jul 2025", value: "2017-2025" },
            ]}
            helper="This only affects seller's stamp duty for later disposal."
          />
          <NumberField
            label="Years held before sale"
            value={yearsHeld}
            onChange={setYearsHeld}
            placeholder="5"
            step={0.1}
            helper="Used to estimate SSD if you later dispose of the property."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label="BSD"
          value={formatMoney(result.bsd, SGD_MARKET)}
          helper="Buyer's Stamp Duty based on current progressive residential BSD bands."
        />
        <ResultCard
          label="ABSD"
          value={formatMoney(result.absd, SGD_MARKET)}
          helper={`Additional Buyer's Stamp Duty at ${result.absdRate}%.`}
        />
        <ResultCard
          label="SSD on sale"
          value={formatMoney(result.ssd, SGD_MARKET)}
          helper={`Seller's Stamp Duty at ${result.ssdRate}% based on the holding period entered.`}
        />
        <ResultCard
          label="Total buyer stamp duty"
          value={formatMoney(result.totalBuyerStampDuty, SGD_MARKET)}
          helper="BSD plus ABSD at the point of purchase."
        />
      </section>

      <NoteCard title="What this Singapore page covers">
        <p>
          This calculator uses current residential BSD bands together with current ABSD profiles. It also includes SSD
          for the two most relevant recent residential purchase regimes so you can test holding-period outcomes more accurately.
        </p>
      </NoteCard>
    </div>
  );
}
