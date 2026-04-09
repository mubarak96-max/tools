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
import { calculateSecurityDeposit } from "@/lib/tools/real-estate";

export default function SecurityDepositCalculator() {
  const [marketKey, setMarketKey] = useState("US");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [depositMonths, setDepositMonths] = useState("1");
  const [advanceRentMonths, setAdvanceRentMonths] = useState("1");
  const [adminFees, setAdminFees] = useState("");
  const market = getRealEstateMarket(marketKey);

  const result = useMemo(
    () =>
      calculateSecurityDeposit({
        monthlyRent: Number(monthlyRent) || 0,
        depositMonths: Number(depositMonths) || 0,
        advanceRentMonths: Number(advanceRentMonths) || 0,
        adminFees: Number(adminFees) || 0,
      }),
    [adminFees, advanceRentMonths, depositMonths, monthlyRent],
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
            label="Deposit (months of rent)"
            value={depositMonths}
            onChange={setDepositMonths}
            placeholder="1"
            step={0.5}
          />
          <NumberField
            label="Advance rent (months)"
            value={advanceRentMonths}
            onChange={setAdvanceRentMonths}
            placeholder="1"
            step={0.5}
            helper="Use the rent collected before move-in or at lease signing."
          />
          <NumberField
            label="Admin or move-in fees"
            value={adminFees}
            onChange={setAdminFees}
            placeholder="Enter extra fees"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ResultCard
          label="Security deposit"
          value={formatMoney(result.depositAmount, market)}
          helper="The deposit amount based on the number of rent months entered."
        />
        <ResultCard
          label="Advance rent"
          value={formatMoney(result.advanceRentAmount, market)}
          helper="The rent collected upfront before or at move-in."
        />
        <ResultCard
          label="Total move-in cash"
          value={formatMoney(result.totalMoveInCost, market)}
          helper="Deposit, advance rent, and admin fees combined."
        />
      </section>

      <NoteCard title="Why security deposit planning matters">
        <p>
          Rent is only part of the move-in equation. The upfront cash often includes the deposit, rent in advance, and
          extra fees that make the first payment much larger than the regular monthly rent.
        </p>
        <p className="mt-3">
          This calculator is useful when you want to see the real cash needed at move-in instead of treating the deposit
          as a separate afterthought.
        </p>
      </NoteCard>
    </div>
  );
}
