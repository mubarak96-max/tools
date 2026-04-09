"use client";

import { useMemo, useState } from "react";

import { MarketField, NoteCard, NumberField, ResultCard, formatMoney, getRealEstateMarket } from "@/components/real-estate/shared";
import { calculateMortgageRefinance } from "@/lib/tools/real-estate";

export default function MortgageRefinanceCalculator() {
  const [marketKey, setMarketKey] = useState("US");
  const [currentBalance, setCurrentBalance] = useState("");
  const [currentRate, setCurrentRate] = useState("7");
  const [currentTermMonths, setCurrentTermMonths] = useState("240");
  const [newRate, setNewRate] = useState("6");
  const [newTermMonths, setNewTermMonths] = useState("240");
  const [refinanceCosts, setRefinanceCosts] = useState("");
  const market = getRealEstateMarket(marketKey);

  const result = useMemo(
    () =>
      calculateMortgageRefinance({
        currentBalance: Number(currentBalance) || 0,
        currentRate: Number(currentRate) || 0,
        currentTermMonths: Number(currentTermMonths) || 0,
        newRate: Number(newRate) || 0,
        newTermMonths: Number(newTermMonths) || 0,
        refinanceCosts: Number(refinanceCosts) || 0,
      }),
    [currentBalance, currentRate, currentTermMonths, newRate, newTermMonths, refinanceCosts],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <MarketField value={marketKey} onChange={setMarketKey} />
          <NumberField
            label="Current loan balance"
            value={currentBalance}
            onChange={setCurrentBalance}
            placeholder="Enter remaining balance"
          />
          <NumberField
            label="Current rate (%)"
            value={currentRate}
            onChange={setCurrentRate}
            placeholder="7"
            step={0.1}
          />
          <NumberField
            label="Months remaining"
            value={currentTermMonths}
            onChange={setCurrentTermMonths}
            placeholder="240"
          />
          <NumberField
            label="New rate (%)"
            value={newRate}
            onChange={setNewRate}
            placeholder="6"
            step={0.1}
          />
          <NumberField
            label="New term (months)"
            value={newTermMonths}
            onChange={setNewTermMonths}
            placeholder="240"
          />
          <NumberField
            label="Refinance costs"
            value={refinanceCosts}
            onChange={setRefinanceCosts}
            placeholder="Enter refinance fees"
            helper="Include lender fees, legal work, appraisal, and similar costs."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label="Current monthly payment"
          value={formatMoney(result.currentMonthlyPayment, market)}
          helper="Estimated from the current balance, rate, and term remaining."
        />
        <ResultCard
          label="New monthly payment"
          value={formatMoney(result.newMonthlyPayment, market)}
          helper="Estimated from the refinanced balance, new rate, and new term."
        />
        <ResultCard
          label="Monthly savings"
          value={formatMoney(result.monthlySavings, market)}
          helper="Positive means the refinance lowers the monthly payment."
        />
        <ResultCard
          label="Break-even"
          value={result.monthlySavings > 0 ? `${result.breakEvenMonths.toFixed(1)} months` : "No break-even"}
          helper="How long monthly savings need to cover the refinance costs."
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <ResultCard
          label="Current total remaining cost"
          value={formatMoney(result.currentTotalRemaining, market)}
          helper="Estimated payment total if you keep the current loan as entered."
        />
        <ResultCard
          label="Refinanced total remaining cost"
          value={formatMoney(result.newTotalRemaining, market)}
          helper="Estimated payment total after refinance, including the refinance costs."
        />
      </section>

      <NoteCard title="What refinance calculators help you test">
        <p>
          Refinancing is usually sold on the lower monthly payment, but the real question is whether the savings are
          large enough, soon enough, to justify the fees and the new term.
        </p>
        <p className="mt-3">
          This page helps you see both sides: the monthly relief and the total remaining cost. A lower payment can still
          cost more overall if the term resets for too long or the fees are high.
        </p>
      </NoteCard>
    </div>
  );
}
