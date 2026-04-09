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
import { calculatePropertyManagementFee } from "@/lib/tools/real-estate";

export default function PropertyManagementFeeCalculator() {
  const [marketKey, setMarketKey] = useState("US");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [managementFeePercent, setManagementFeePercent] = useState("8");
  const [leasingFeePercent, setLeasingFeePercent] = useState("5");
  const [annualRepairs, setAnnualRepairs] = useState("");
  const market = getRealEstateMarket(marketKey);

  const result = useMemo(
    () =>
      calculatePropertyManagementFee({
        monthlyRent: Number(monthlyRent) || 0,
        managementFeePercent: Number(managementFeePercent) || 0,
        leasingFeePercent: Number(leasingFeePercent) || 0,
        annualRepairs: Number(annualRepairs) || 0,
      }),
    [annualRepairs, leasingFeePercent, managementFeePercent, monthlyRent],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MarketField value={marketKey} onChange={setMarketKey} />
          <NumberField
            label="Monthly rent"
            value={monthlyRent}
            onChange={setMonthlyRent}
            placeholder="Enter monthly rent"
          />
          <NumberField
            label="Management fee (%)"
            value={managementFeePercent}
            onChange={setManagementFeePercent}
            placeholder="8"
            step={0.1}
          />
          <NumberField
            label="Leasing fee (%)"
            value={leasingFeePercent}
            onChange={setLeasingFeePercent}
            placeholder="5"
            step={0.1}
            helper="Use the extra fee charged for placing or renewing a tenant, if applicable."
          />
          <NumberField
            label="Annual repairs"
            value={annualRepairs}
            onChange={setAnnualRepairs}
            placeholder="Enter annual repairs"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label="Annual rent"
          value={formatMoney(result.annualRent, market)}
          helper="The property's gross rent before management and repair costs."
        />
        <ResultCard
          label="Management fee"
          value={formatMoney(result.annualManagementFee, market)}
          helper="The ongoing management charge based on annual rent."
        />
        <ResultCard
          label="Leasing fee"
          value={formatMoney(result.leasingFee, market)}
          helper="The placement or leasing charge based on annual rent."
        />
        <ResultCard
          label="Owner net"
          value={formatMoney(result.annualOwnerNet, market)}
          helper="Annual rent left after management, leasing, and repair costs."
        />
      </section>

      <NoteCard title="Why management fees change the owner's net more than expected">
        <p>
          Management fees look small as a percentage, but once they are applied to a full year of rent and paired with
          leasing fees and repair spending, they can cut into owner income faster than expected.
        </p>
        <p className="mt-3">
          This page helps landlords compare self-management with outsourced management or compare one fee structure with
          another before signing a management agreement.
        </p>
      </NoteCard>
    </div>
  );
}
