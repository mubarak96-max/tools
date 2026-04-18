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
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");

  const market = getRealEstateMarket(marketKey);

  const numPrice = Number(homePrice) || 0;
  const result = useMemo(
    () =>
      calculateDownPayment({
        homePrice: numPrice,
        downPaymentPercent: Number(downPaymentPercent) || 0,
      }),
    [downPaymentPercent, numPrice],
  );

  const P = result.loanAmount;
  const r = (Number(interestRate) || 0) / 100 / 12;
  const n = (Number(loanTerm) || 0) * 12;
  const monthlyPayment = P > 0 && r > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : (P > 0 && r === 0 ? P / n : 0);
  const totalInterest = monthlyPayment > 0 ? (monthlyPayment * n) - P : 0;
  
  const totalCost = result.downPaymentAmount + P + totalInterest;

  const copyResults = async () => {
    const text = `Home Price: ${formatMoney(numPrice, market)}\nDown Payment: ${formatMoney(result.downPaymentAmount, market)}\nLoan Amount: ${formatMoney(P, market)}\nMonthly Payment: ${formatMoney(monthlyPayment, market)}\nTotal Interest: ${formatMoney(totalInterest, market)}`;
    await navigator.clipboard.writeText(text);
    alert("Results copied to clipboard!");
  };

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
          <NumberField
            label="Interest rate (%)"
            value={interestRate}
            onChange={setInterestRate}
            placeholder="6.5"
            step={0.1}
            helper="Annual interest rate for the mortgage."
          />
          <NumberField
            label="Loan term (years)"
            value={loanTerm}
            onChange={setLoanTerm}
            placeholder="30"
            helper="Number of years to repay the loan."
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
          label="Down payment amount"
          value={formatMoney(result.downPaymentAmount, market)}
          helper="The amount you would need to pay upfront."
        />
        <ResultCard
          label="Loan amount"
          value={formatMoney(result.loanAmount, market)}
          helper="The principal base you need to borrow."
        />
        <ResultCard
          label="Monthly payment"
          value={formatMoney(monthlyPayment, market)}
          helper="Principal and interest only."
        />
        <ResultCard
          label="Total interest"
          value={formatMoney(totalInterest, market)}
          helper="Lifetime interest over the loan term."
        />
      </section>

      {totalCost > 0 && (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
           <h3 className="text-sm font-bold tracking-tight text-muted-foreground uppercase opacity-80 mb-4">Total Payment Breakdown</h3>
           <div className="flex h-6 w-full overflow-hidden rounded-full mb-4">
              <div style={{ width: `${(result.downPaymentAmount/totalCost)*100}%` }} className="bg-primary/90" title="Down Payment" />
              <div style={{ width: `${(P/totalCost)*100}%` }} className="bg-blue-500/80" title="Principal" />
              <div style={{ width: `${(totalInterest/totalCost)*100}%` }} className="bg-amber-500/80" title="Interest" />
           </div>
           <div className="flex flex-wrap gap-6 text-xs text-muted-foreground font-medium">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary/90"/> Down Payment</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500/80"/> Principal</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500/80"/> Interest</div>
           </div>
        </section>
      )}

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
