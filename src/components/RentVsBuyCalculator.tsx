"use client";

import { useState, useMemo } from "react";
import {
  calculateRentVsBuy,
  formatUSD,
  formatShort,
  type RentVsBuyInputs,
  type TaxRegime,
  type FilingStatus,
} from "@/lib/rentVsBuy";
import { LayoutDashboard, CalendarDays, Receipt } from "lucide-react";

// ── Reusable input components ──────────────────────────────────────

function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min,
  max,
  step,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-stone-500 mb-1.5">{label}</label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-stone-400 text-sm pointer-events-none">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step ?? 1}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white ${
            prefix ? "pl-7 pr-3" : suffix ? "pl-3 pr-8" : "px-3"
          }`}
        />
        {suffix && (
          <span className="absolute right-3 text-stone-400 text-sm pointer-events-none">{suffix}</span>
        )}
      </div>
      {hint && <p className="text-xs text-stone-400 mt-1">{hint}</p>}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3 mt-6">
      {children}
    </p>
  );
}

function MetricCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "green" | "blue" | "amber" | "red";
}) {
  const colors = {
    green: "bg-emerald-50",
    blue: "bg-blue-50",
    amber: "bg-amber-50",
    red: "bg-red-50",
  };
  return (
    <div className={`rounded-xl p-3.5 ${accent ? colors[accent] : "bg-stone-50"}`}>
      <p className="text-xs text-stone-400 mb-1">{label}</p>
      <p className="text-xl font-semibold text-stone-900 leading-none">{value}</p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────

export default function RentVsBuyCalculator() {
  // Property inputs
  const [homePrice, setHomePrice] = useState(450000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [mortgageRatePct, setMortgageRatePct] = useState(6.5);
  const [mortgageTermYears, setMortgageTermYears] = useState(30);
  const [propertyTaxRatePct, setPropertyTaxRatePct] = useState(1.2);
  const [homeInsuranceAnnual, setHomeInsuranceAnnual] = useState(1800);
  const [maintenancePct, setMaintenancePct] = useState(1.0);
  const [hoaMonthly, setHoaMonthly] = useState(0);
  const [homeAppreciationPct, setHomeAppreciationPct] = useState(3.5);
  const [sellingCostPct, setSellingCostPct] = useState(6.0);

  // Rent inputs
  const [monthlyRent, setMonthlyRent] = useState(2200);
  const [rentIncreaseAnnualPct, setRentIncreaseAnnualPct] = useState(3.0);
  const [rentersInsuranceMonthly, setRentersInsuranceMonthly] = useState(20);

  // Financial
  const [investmentReturnPct, setInvestmentReturnPct] = useState(7.0);
  const [marginalTaxRatePct, setMarginalTaxRatePct] = useState(24);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [taxRegime, setTaxRegime] = useState<TaxRegime>("us_standard");
  const [yearsToAnalyse, setYearsToAnalyse] = useState(10);

  const [activeTab, setActiveTab] = useState<"summary" | "schedule" | "tax">("summary");

  const inputs: RentVsBuyInputs = {
    homePrice, downPaymentPct, mortgageRatePct, mortgageTermYears,
    propertyTaxRatePct, homeInsuranceAnnual, maintenancePct, hoaMonthly,
    homeAppreciationPct, sellingCostPct, monthlyRent, rentIncreaseAnnualPct,
    rentersInsuranceMonthly, investmentReturnPct, marginalTaxRatePct,
    filingStatus, taxRegime, yearsToAnalyse,
  };

  const result = useMemo(() => calculateRentVsBuy(inputs), [
    homePrice, downPaymentPct, mortgageRatePct, mortgageTermYears,
    propertyTaxRatePct, homeInsuranceAnnual, maintenancePct, hoaMonthly,
    homeAppreciationPct, sellingCostPct, monthlyRent, rentIncreaseAnnualPct,
    rentersInsuranceMonthly, investmentReturnPct, marginalTaxRatePct,
    filingStatus, taxRegime, yearsToAnalyse,
  ]);

  const winnerColor = result.winner === "buy" ? "text-emerald-700" : result.winner === "rent" ? "text-blue-700" : "text-stone-700";
  const winnerBg = result.winner === "buy" ? "bg-emerald-50 border-emerald-200" : result.winner === "rent" ? "bg-blue-50 border-blue-200" : "bg-stone-50 border-stone-200";

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">

      {/* Winner banner */}
      <div className={`border-b px-5 py-4 ${winnerBg}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-stone-400 mb-0.5">Over {yearsToAnalyse} years</p>
            <p className={`text-xl font-bold ${winnerColor}`}>
              {result.winner === "buy"
                ? "Buying comes out ahead"
                : result.winner === "rent"
                ? "Renting comes out ahead"
                : "It's roughly even"}
            </p>
            <p className="text-sm text-stone-500 mt-0.5">
              Net worth difference:{" "}
              <span className="font-medium text-stone-700">{formatShort(result.winnerMargin)}</span>
              {result.breakEvenYear
                ? ` · Buying breaks even at year ${result.breakEvenYear}`
                : result.winner === "rent"
                ? " · Buying never breaks even in this period"
                : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-stone-400">Tax savings</p>
            <p className="text-lg font-semibold text-emerald-700">{formatShort(result.totalTaxSavings)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr]">

        {/* ── LEFT: Inputs ──────────────────────────────────────── */}
        <div className="border-r border-stone-100 p-5 space-y-1">

          <SectionLabel>Property</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Home price" value={homePrice} onChange={setHomePrice} prefix="$" min={50000} step={5000} />
            <InputField label="Down payment" value={downPaymentPct} onChange={setDownPaymentPct} suffix="%" min={3} max={100} step={1} hint={`= ${formatShort(result.downPaymentAmount)}`} />
            <InputField label="Mortgage rate" value={mortgageRatePct} onChange={setMortgageRatePct} suffix="%" min={1} max={20} step={0.1} />
            <div>
              <label className="block text-xs text-stone-500 mb-1.5">Term</label>
              <select
                value={mortgageTermYears}
                onChange={(e) => setMortgageTermYears(Number(e.target.value))}
                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value={10}>10 years</option>
                <option value={15}>15 years</option>
                <option value={20}>20 years</option>
                <option value={25}>25 years</option>
                <option value={30}>30 years</option>
              </select>
            </div>
            <InputField label="Property tax rate" value={propertyTaxRatePct} onChange={setPropertyTaxRatePct} suffix="%" min={0} max={5} step={0.1} hint="Annual % of home value" />
            <InputField label="Home insurance" value={homeInsuranceAnnual} onChange={setHomeInsuranceAnnual} prefix="$" min={0} step={100} hint="Annual premium" />
            <InputField label="Maintenance" value={maintenancePct} onChange={setMaintenancePct} suffix="%" min={0} max={5} step={0.1} hint="Annual % of home value" />
            <InputField label="HOA (monthly)" value={hoaMonthly} onChange={setHoaMonthly} prefix="$" min={0} step={50} />
            <InputField label="Home appreciation" value={homeAppreciationPct} onChange={setHomeAppreciationPct} suffix="%" min={0} max={15} step={0.1} hint="Annual % growth" />
            <InputField label="Selling costs" value={sellingCostPct} onChange={setSellingCostPct} suffix="%" min={0} max={15} step={0.5} hint="Agent + closing fees" />
          </div>

          <SectionLabel>Renting</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Monthly rent" value={monthlyRent} onChange={setMonthlyRent} prefix="$" min={100} step={50} />
            <InputField label="Rent increases" value={rentIncreaseAnnualPct} onChange={setRentIncreaseAnnualPct} suffix="%" min={0} max={15} step={0.5} hint="Annual %" />
            <InputField label="Renter's insurance" value={rentersInsuranceMonthly} onChange={setRentersInsuranceMonthly} prefix="$" min={0} step={5} hint="Monthly" />
          </div>

          <SectionLabel>Finances & Tax</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Investment return" value={investmentReturnPct} onChange={setInvestmentReturnPct} suffix="%" min={0} max={20} step={0.5} hint="If down payment invested" />
            <InputField label="Marginal tax rate" value={marginalTaxRatePct} onChange={setMarginalTaxRatePct} suffix="%" min={0} max={60} step={1} hint="Fed + state combined" />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs text-stone-500 mb-1.5">Filing status</label>
              <select
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value="single">Single</option>
                <option value="married">Married filing jointly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1.5">Tax deduction</label>
              <select
                value={taxRegime}
                onChange={(e) => setTaxRegime(e.target.value as TaxRegime)}
                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value="us_standard">US — Standard deduction</option>
                <option value="us_itemise">US — Always itemise</option>
                <option value="uk">UK — No relief</option>
                <option value="none">No tax relief</option>
              </select>
            </div>
          </div>

          <SectionLabel>Analysis period</SectionLabel>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={yearsToAnalyse}
              onChange={(e) => setYearsToAnalyse(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium text-stone-700 min-w-[56px]">{yearsToAnalyse} yrs</span>
          </div>
        </div>

        {/* ── RIGHT: Results ────────────────────────────────────── */}
        <div className="p-5">

          <div className="flex gap-1 mb-5 bg-stone-100 rounded-lg p-1">
            {[
              { id: "summary", label: "Summary", icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
              { id: "schedule", label: "Schedule", icon: <CalendarDays className="w-3.5 h-3.5" /> },
              { id: "tax", label: "Tax savings", icon: <Receipt className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-1.5 flex items-center justify-center gap-2 text-xs font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-stone-800 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Summary tab */}
          {activeTab === "summary" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 grid grid-cols-3 gap-3">
                  <MetricCard label="Monthly mortgage" value={formatShort(result.monthlyMortgagePayment)} sub="P + I only" />
                  <MetricCard label="Down payment" value={formatShort(result.downPaymentAmount)} sub={`${downPaymentPct}% of price`} />
                  <MetricCard label="Loan amount" value={formatShort(result.financeAmount)} sub={`${100 - downPaymentPct}% LTV`} />
                </div>
              </div>

              <div className="border border-stone-100 rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-stone-100">
                  <div className="p-4">
                    <p className="text-xs font-semibold text-emerald-600 mb-3">Buying after {yearsToAnalyse} years</p>
                    <div className="space-y-2">
                      {[
                        ["Home value", formatShort(result.finalHomeValue)],
                        ["Remaining balance", `–${formatShort(result.finalMortgageBalance)}`],
                        ["Equity", formatShort(result.finalEquity)],
                        ["Total costs (net)", `–${formatShort(result.totalBuyCost)}`],
                        ["Tax savings", `+${formatShort(result.totalTaxSavings)}`],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm">
                          <span className="text-stone-500">{k}</span>
                          <span className="font-medium text-stone-800">{v}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-stone-100 flex justify-between text-sm">
                        <span className="font-medium text-stone-700">Net worth</span>
                        <span className="font-bold text-emerald-700">{formatShort(result.buyNetWorthFinal)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-blue-600 mb-3">Renting after {yearsToAnalyse} years</p>
                    <div className="space-y-2">
                      {[
                        ["Investment value", formatShort(result.rentInvestmentFinal)],
                        ["Total rent paid", `–${formatShort(result.totalRentCost)}`],
                        ["Assumed return", `${investmentReturnPct}% p.a.`],
                        ["Final monthly rent", formatShort(result.schedule[result.schedule.length - 1]?.rentMonthly ?? 0)],
                        ["", ""],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm">
                          <span className="text-stone-500">{k}</span>
                          <span className="font-medium text-stone-800">{v}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-stone-100 flex justify-between text-sm">
                        <span className="font-medium text-stone-700">Net worth</span>
                        <span className="font-bold text-blue-700">{formatShort(result.rentNetWorthFinal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net worth chart */}
              <div>
                <p className="text-xs font-medium text-stone-400 mb-2">Net worth over time</p>
                <div className="space-y-1">
                  {result.schedule.map((row) => {
                    const maxVal = Math.max(
                      ...result.schedule.map((r) => Math.max(Math.abs(r.buyNetWorth), Math.abs(r.rentNetWorth))),
                      1
                    );
                    const buyW = Math.max(0, (row.buyNetWorth / maxVal) * 100);
                    const rentW = Math.max(0, (row.rentNetWorth / maxVal) * 100);
                    return (
                      <div key={row.year} className="flex items-center gap-2 text-xs">
                        <span className="text-stone-400 w-8 text-right shrink-0">Yr {row.year}</span>
                        <div className="flex-1 flex flex-col gap-0.5">
                          <div className="flex items-center gap-1">
                            <div className="h-2 rounded-sm bg-emerald-400 transition-all duration-300" style={{ width: `${buyW}%` }} />
                            <span className="text-stone-500 text-[10px] whitespace-nowrap">{formatShort(row.buyNetWorth)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-2 rounded-sm bg-blue-400 transition-all duration-300" style={{ width: `${rentW}%` }} />
                            <span className="text-stone-500 text-[10px] whitespace-nowrap">{formatShort(row.rentNetWorth)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-stone-400"><span className="w-3 h-2 rounded-sm bg-emerald-400 inline-block" />Buy</span>
                  <span className="flex items-center gap-1.5 text-xs text-stone-400"><span className="w-3 h-2 rounded-sm bg-blue-400 inline-block" />Rent</span>
                </div>
              </div>
            </div>
          )}

          {/* Schedule tab */}
          {activeTab === "schedule" && (
            <div>
              <div className="max-h-[520px] overflow-y-auto rounded-xl border border-stone-200">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="py-2 px-3 text-left text-stone-500 font-medium">Yr</th>
                      <th className="py-2 px-3 text-right text-stone-500 font-medium">Interest</th>
                      <th className="py-2 px-3 text-right text-stone-500 font-medium">Prop tax</th>
                      <th className="py-2 px-3 text-right text-emerald-600 font-medium">Tax save</th>
                      <th className="py-2 px-3 text-right text-stone-500 font-medium">Net cost</th>
                      <th className="py-2 px-3 text-right text-stone-500 font-medium">Equity</th>
                      <th className="py-2 px-3 text-right text-stone-500 font-medium">Rent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((row) => (
                      <tr key={row.year} className={`border-b border-stone-100 last:border-0 ${row.buyAhead ? "bg-emerald-50/30" : ""}`}>
                        <td className="py-2 px-3 text-stone-400">{row.year}</td>
                        <td className="py-2 px-3 text-right text-stone-700">{formatShort(row.buyInterestPaid)}</td>
                        <td className="py-2 px-3 text-right text-stone-700">{formatShort(row.buyPropertyTax)}</td>
                        <td className="py-2 px-3 text-right text-emerald-700 font-medium">{formatShort(row.buyTaxSaving)}</td>
                        <td className="py-2 px-3 text-right text-stone-700">{formatShort(row.buyNetAnnualCost)}</td>
                        <td className="py-2 px-3 text-right text-stone-700">{formatShort(row.buyEquity)}</td>
                        <td className="py-2 px-3 text-right text-blue-700">{formatShort(row.rentAnnual)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-stone-400 mt-2">Green rows = buying has higher net worth that year.</p>
            </div>
          )}

          {/* Tax tab */}
          {activeTab === "tax" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <MetricCard label="Total tax savings" value={formatShort(result.totalTaxSavings)} sub={`Over ${yearsToAnalyse} years`} accent="green" />
                <MetricCard label="Avg annual saving" value={formatShort(result.totalTaxSavings / yearsToAnalyse)} sub="Per year" accent="green" />
                <MetricCard label="Your tax regime" value={taxRegime === "us_itemise" ? "US Itemised" : taxRegime === "us_standard" ? "US Standard" : taxRegime === "uk" ? "UK (no relief)" : "No relief"} sub={`${marginalTaxRatePct}% marginal rate`} />
                <MetricCard label="Standard deduction" value={formatUSD(result.standardDeduction)} sub={`${filingStatus === "married" ? "Married filing jointly" : "Single"} 2024`} />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-800 mb-1">How the mortgage interest deduction works</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  US taxpayers who itemise deductions can deduct mortgage interest paid on up to{" "}
                  <strong>$750,000</strong> of qualified home loans. Property taxes are deductible
                  up to the $10,000 SALT cap. You only benefit from itemising if your total itemised
                  deductions exceed your standard deduction (
                  {filingStatus === "married" ? "$29,200" : "$14,600"} in 2024).
                  The "US — Standard deduction" mode shows only the <em>marginal</em> tax benefit
                  above the standard deduction threshold.
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-stone-400 mb-2">Annual tax savings breakdown</p>
                <div className="max-h-60 overflow-y-auto rounded-xl border border-stone-200">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-stone-50 border-b border-stone-200">
                      <tr>
                        <th className="py-2 px-3 text-left text-stone-500 font-medium">Year</th>
                        <th className="py-2 px-3 text-right text-stone-500 font-medium">Interest paid</th>
                        <th className="py-2 px-3 text-right text-stone-500 font-medium">Prop tax</th>
                        <th className="py-2 px-3 text-right text-emerald-600 font-medium">Tax saving</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.map((row) => (
                        <tr key={row.year} className="border-b border-stone-100 last:border-0">
                          <td className="py-2 px-3 text-stone-400">{row.year}</td>
                          <td className="py-2 px-3 text-right text-stone-700">{formatUSD(row.buyInterestPaid)}</td>
                          <td className="py-2 px-3 text-right text-stone-700">{formatUSD(row.buyPropertyTax)}</td>
                          <td className="py-2 px-3 text-right font-medium text-emerald-700">{formatUSD(row.buyTaxSaving)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-stone-50 rounded-xl p-4 text-xs text-stone-500 leading-relaxed">
                <strong className="text-stone-700">UK users:</strong> Select "UK — No relief" above.
                Mortgage interest relief for primary residences was abolished in the UK in 1999.
                Buy-to-let landlords receive a 20% tax credit on mortgage interest under Section 24,
                but this does not apply to a home purchase for personal use.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
