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

  const copyResults = async () => {
    const text = `Purchase Price: ${formatMoney(purchasePriceValue, market)}\nEstimated Closing Costs: ${formatMoney(result.estimatedClosingCosts, market)}\nTotal Cash Needed: ${formatMoney(result.totalCashNeeded, market)}`;
    await navigator.clipboard.writeText(text);
    alert("Results copied to clipboard!");
  };

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
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm md:col-span-2 xl:col-span-4 flex flex-col justify-center">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">Market Comparison</h3>
            <p className="text-sm font-medium text-foreground">
              Average Rate Comparison: <strong className="text-primary">{Number(closingCostPercent) > 5 ? "Above Average" : Number(closingCostPercent) < 2 && Number(closingCostPercent) > 0 ? "Below Average" : "Average Market Rates"}</strong>
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Note: Typical closing costs range between 2% to 5% of the purchase price. Most states average around 3%.
            </p>
        </div>
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
