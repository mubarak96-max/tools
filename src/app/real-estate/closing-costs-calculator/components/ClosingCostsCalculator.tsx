"use client";

import { useMemo, useState } from "react";

import { MarketField, NoteCard, NumberField, ResultCard, formatMoney, getRealEstateMarket } from "@/components/real-estate/shared";
import { calculateClosingCosts } from "@/lib/tools/real-estate";

export default function ClosingCostsCalculator() {
  const [marketKey, setMarketKey] = useState("US");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [closingCostPercent, setClosingCostPercent] = useState("3");
  const [fixedClosingCosts, setFixedClosingCosts] = useState("");

  const purchasePriceValue = Number(purchasePrice) || 0;
  const downPaymentValue = Number(downPayment) || 0;
  const fixedClosingCostsValue = Number(fixedClosingCosts) || 0;
  const market = getRealEstateMarket(marketKey);

  const result = useMemo(
    () =>
      calculateClosingCosts({
        purchasePrice: purchasePriceValue,
        downPayment: downPaymentValue,
        closingCostPercent: Number(closingCostPercent) || 0,
        fixedClosingCosts: fixedClosingCostsValue,
      }),
    [closingCostPercent, downPaymentValue, fixedClosingCostsValue, purchasePriceValue],
  );

  const estimatedLoanAmount = Math.max(0, purchasePriceValue - downPaymentValue);

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
            label="Down payment"
            value={downPayment}
            onChange={setDownPayment}
            placeholder="Enter down payment"
            helper="Use the amount you plan to pay upfront toward the purchase."
          />
          <NumberField
            label="Closing costs (%)"
            value={closingCostPercent}
            onChange={setClosingCostPercent}
            placeholder="3"
            step={0.1}
            helper="A percentage estimate for taxes, legal work, lender fees, and similar costs."
          />
          <NumberField
            label="Fixed closing fees"
            value={fixedClosingCosts}
            onChange={setFixedClosingCosts}
            placeholder="Enter fixed fees"
            helper="Use this for inspections, appraisals, filing fees, or other flat costs."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label="Estimated closing costs"
          value={formatMoney(result.estimatedClosingCosts, market)}
          helper="Percent-based and fixed costs combined."
        />
        <ResultCard
          label="Total cash needed"
          value={formatMoney(result.totalCashNeeded, market)}
          helper="Down payment plus estimated closing costs."
        />
        <ResultCard
          label="Estimated loan amount"
          value={formatMoney(estimatedLoanAmount, market)}
          helper="Purchase price minus down payment."
        />
        <ResultCard
          label="Cash as % of price"
          value={`${purchasePriceValue > 0 ? ((result.totalCashNeeded / purchasePriceValue) * 100).toFixed(2) : "0.00"}%`}
          helper="A quick sense of how much cash you need before financing starts."
        />
      </section>

      <NoteCard title="Why buyers underestimate closing costs">
        <p>
          Many buyers budget for the down payment but forget that closing day also brings lender fees, transfer charges,
          legal work, inspections, insurance, and filing costs. That gap is why a purchase can feel affordable on paper
          but still strain cash reserves.
        </p>
        <p className="mt-3">
          Use this calculator as a planning range, then replace the broad estimate with the specific fees from your
          lender, broker, or conveyancing team once you have a property under offer.
        </p>
      </NoteCard>
    </div>
  );
}
