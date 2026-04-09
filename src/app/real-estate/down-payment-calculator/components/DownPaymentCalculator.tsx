"use client";

import { useMemo, useState } from "react";

import {
  MarketField,
  NoteCard,
  NumberField,
  ResultCard,
  formatMoney,
  formatPercent,
  getRealEstateMarket,
} from "@/components/real-estate/shared";
import { calculateDownPayment } from "@/lib/tools/real-estate";

export default function DownPaymentCalculator() {
  const [marketKey, setMarketKey] = useState("US");
  const [homePrice, setHomePrice] = useState("");
  const [downPaymentPercent, setDownPaymentPercent] = useState("20");
  const market = getRealEstateMarket(marketKey);

  const result = useMemo(
    () =>
      calculateDownPayment({
        homePrice: Number(homePrice) || 0,
        downPaymentPercent: Number(downPaymentPercent) || 0,
      }),
    [downPaymentPercent, homePrice],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <MarketField value={marketKey} onChange={setMarketKey} />
          <NumberField
            label="Home price"
            value={homePrice}
            onChange={setHomePrice}
            placeholder="Enter purchase price"
          />
          <NumberField
            label="Down payment (%)"
            value={downPaymentPercent}
            onChange={setDownPaymentPercent}
            placeholder="20"
            step={0.5}
            helper="Use the percentage of the home price you want to pay upfront."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label="Down payment amount"
          value={formatMoney(result.downPaymentAmount, market)}
          helper="The amount you would need to pay upfront."
        />
        <ResultCard
          label="Loan amount"
          value={formatMoney(result.loanAmount, market)}
          helper="The amount likely left to finance."
        />
        <ResultCard
          label="Loan-to-value"
          value={formatPercent(result.loanToValue)}
          helper="A lower LTV usually means less lender risk."
        />
        <ResultCard
          label="Financed share"
          value={formatPercent(result.financedShare)}
          helper="The share of the purchase price funded by the loan."
        />
      </section>

      <NoteCard title="Why the down payment matters beyond the upfront cash">
        <p>
          A larger down payment does more than reduce the loan amount. It can improve loan-to-value, reduce lender risk,
          and make the monthly mortgage payment easier to carry.
        </p>
        <p className="mt-3">
          Buyers often focus on the percentage because that is how lenders and listings talk about it, but the cash
          amount is what matters for your planning. That is why this page shows both sides of the decision.
        </p>
      </NoteCard>
    </div>
  );
}
