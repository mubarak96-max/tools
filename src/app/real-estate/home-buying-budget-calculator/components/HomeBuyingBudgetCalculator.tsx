"use client";

import { useMemo, useState } from "react";

import { MarketField, NoteCard, NumberField, ResultCard, formatMoney, getRealEstateMarket } from "@/components/real-estate/shared";
import { calculateHomeBuyingBudget } from "@/lib/tools/real-estate";

export default function HomeBuyingBudgetCalculator() {
  const [marketKey, setMarketKey] = useState("US");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyDebt, setMonthlyDebt] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [annualRate, setAnnualRate] = useState("6.5");
  const [loanTermYears, setLoanTermYears] = useState("30");
  const [housingRatioPercent, setHousingRatioPercent] = useState("30");
  const [monthlyOwnershipCosts, setMonthlyOwnershipCosts] = useState("");
  const market = getRealEstateMarket(marketKey);

  const result = useMemo(
    () =>
      calculateHomeBuyingBudget({
        monthlyIncome: Number(monthlyIncome) || 0,
        monthlyDebt: Number(monthlyDebt) || 0,
        downPayment: Number(downPayment) || 0,
        annualRate: Number(annualRate) || 0,
        loanTermYears: Number(loanTermYears) || 0,
        housingRatioPercent: Number(housingRatioPercent) || 0,
        monthlyOwnershipCosts: Number(monthlyOwnershipCosts) || 0,
      }),
    [annualRate, downPayment, housingRatioPercent, loanTermYears, monthlyDebt, monthlyIncome, monthlyOwnershipCosts],
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MarketField value={marketKey} onChange={setMarketKey} />
          <NumberField
            label="Monthly income"
            value={monthlyIncome}
            onChange={setMonthlyIncome}
            placeholder="Enter monthly income"
          />
          <NumberField
            label="Monthly debt"
            value={monthlyDebt}
            onChange={setMonthlyDebt}
            placeholder="Enter debt payments"
          />
          <NumberField
            label="Down payment"
            value={downPayment}
            onChange={setDownPayment}
            placeholder="Enter available down payment"
          />
          <NumberField
            label="Mortgage rate (%)"
            value={annualRate}
            onChange={setAnnualRate}
            placeholder="6.5"
            step={0.1}
          />
          <NumberField
            label="Loan term (years)"
            value={loanTermYears}
            onChange={setLoanTermYears}
            placeholder="30"
          />
          <NumberField
            label="Housing ratio (%)"
            value={housingRatioPercent}
            onChange={setHousingRatioPercent}
            placeholder="30"
            step={0.5}
          />
          <NumberField
            label="Monthly ownership costs"
            value={monthlyOwnershipCosts}
            onChange={setMonthlyOwnershipCosts}
            placeholder="Enter taxes, insurance, HOA"
            helper="Use the non-mortgage monthly costs you expect to carry as an owner."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label="Estimated home budget"
          value={formatMoney(result.estimatedHomeBudget, market)}
          helper="The combined home price implied by the affordable loan plus the down payment."
        />
        <ResultCard
          label="Affordable mortgage payment"
          value={formatMoney(result.maxMortgagePayment, market)}
          helper="The mortgage payment left after debt and ownership costs are accounted for."
        />
        <ResultCard
          label="Maximum loan amount"
          value={formatMoney(result.maxLoanAmount, market)}
          helper="The loan size supported by the payment, rate, and term entered."
        />
        <ResultCard
          label="Housing budget"
          value={formatMoney(result.targetHousingBudget, market)}
          helper="The housing budget before debt and ownership costs are deducted."
        />
      </section>

      <NoteCard title="Why a home budget calculator is more useful than a price guess">
        <p>
          Buyers often start by browsing asking prices, then work backwards into financing stress. This page does the
          opposite. It starts from your monthly budget and then estimates the home price that budget can support.
        </p>
        <p className="mt-3">
          That keeps the number tied to affordability instead of excitement. It is a planning tool, not a lender
          approval, but it gives you a more grounded range before you start shopping.
        </p>
      </NoteCard>
    </div>
  );
}
