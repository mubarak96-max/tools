"use client";

import React, { useState, useMemo } from "react";
import {
  calculateMortgage,
  formatCurrency,
  formatCurrencyShort,
  type MortgageMode,
  type MortgageInputs,
} from "@/lib/tools/halal-mortgage";

const MODES: { id: MortgageMode; label: string; short: string }[] = [
  { id: "musharakah", label: "Diminishing Musharakah", short: "Musharakah" },
  { id: "murabaha", label: "Murabaha", short: "Murabaha" },
  { id: "ijara", label: "Ijara wa Iqtina", short: "Ijara" },
];

const MODE_INFO: Record<MortgageMode, { title: string; description: string; col2: string; col3: string }> = {
  musharakah: {
    title: "Diminishing Musharakah — Co-ownership",
    description:
      "You and the bank jointly own the property. Each month you pay rent on the bank's share, plus a fixed buyout instalment. As your ownership grows, the rental portion decreases. This is the most common halal mortgage structure in the UK and UAE.",
    col2: "Rental portion",
    col3: "Buyout instalment",
  },
  murabaha: {
    title: "Murabaha — Cost-plus sale",
    description:
      "The bank buys the property then sells it to you at a pre-agreed marked-up price, paid in instalments. The profit margin is fixed at signing and never changes — there is no compounding. Common for shorter terms.",
    col2: "Profit portion",
    col3: "Principal portion",
  },
  ijara: {
    title: "Ijara wa Iqtina — Lease to own",
    description:
      "The bank owns the property and leases it to you. Your monthly payment combines rent with a capital contribution. At the end of the term, ownership transfers for a nominal sum. Widely used in the GCC and for buy-to-let.",
    col2: "Rent paid",
    col3: "Capital contribution",
  },
};

const inputClass = "w-full pl-7 pr-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all";
const labelClass = "block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5 ml-1";

export default function HalalMortgageCalculator() {
  const [mode, setMode] = useState<MortgageMode>("musharakah");
  const [propertyValue, setPropertyValue] = useState(400000);
  const [deposit, setDeposit] = useState(80000);
  const [termYears, setTermYears] = useState(25);
  const [annualRate, setAnnualRate] = useState(5.5);

  const inputs: MortgageInputs = { propertyValue, deposit, termYears, annualRate, mode };
  const result = useMemo(() => calculateMortgage(inputs), [propertyValue, deposit, termYears, annualRate, mode]);

  const ltvPct = Math.round(result.ltvRatio * 100);
  const depPct = propertyValue > 0 ? Math.round((deposit / propertyValue) * 100) : 0;
  const profitPct = propertyValue > 0 ? Math.round((result.totalProfit / propertyValue) * 100) : 0;
  const info = MODE_INFO[mode];

  return (
    <div className="bg-white rounded-[2.5rem] border border-stone-200 overflow-hidden shadow-sm">
      {/* Mode tabs */}
      <div className="grid grid-cols-3 border-b border-stone-200">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`py-4 px-2 text-xs font-bold uppercase tracking-widest transition-all border-r border-stone-200 last:border-r-0 ${
              mode === m.id
                ? "bg-emerald-50 text-emerald-800"
                : "text-stone-400 hover:bg-stone-50 hover:text-stone-600"
            }`}
          >
            <span className="hidden sm:inline">{m.label}</span>
            <span className="sm:hidden">{m.short}</span>
          </button>
        ))}
      </div>

      {/* Info box */}
      <div className="border-b border-stone-100 bg-stone-50/50 px-6 py-5">
        <p className="text-sm font-bold text-stone-900 mb-1.5">{info.title}</p>
        <p className="text-xs text-stone-500 leading-relaxed font-medium">{info.description}</p>
      </div>

      <div className="p-6">
        {/* Inputs grid */}
        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          <div>
            <label className={labelClass}>Property value</label>
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">£</span>
              <input
                type="number"
                value={propertyValue}
                min={10000}
                step={5000}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Deposit amount</label>
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">£</span>
              <input
                type="number"
                value={deposit}
                min={0}
                step={5000}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Finance Term (Years)</label>
            <input
              type="number"
              value={termYears}
              min={1}
              max={35}
              onChange={(e) => setTermYears(Number(e.target.value))}
              className={`${inputClass} !pl-4`}
            />
          </div>
          <div>
            <label className={labelClass}>
              {mode === "murabaha" ? "Profit Markup (%)" : "Rental Rate (%)"}
            </label>
            <input
              type="number"
              value={annualRate}
              min={0.1}
              max={20}
              step={0.1}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className={`${inputClass} !pl-4`}
            />
          </div>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Monthly Payment", value: formatCurrency(result.monthlyPayment), color: "text-emerald-700" },
            { label: "Total Financing Cost", value: formatCurrencyShort(result.totalPaid), color: "text-stone-900" },
            { label: "Total Bank Profit", value: formatCurrencyShort(result.totalProfit), color: "text-amber-600" },
          ].map((m) => (
            <div key={m.label} className="bg-stone-50/50 border border-stone-100 rounded-2xl p-5 transition-colors hover:bg-stone-50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">{m.label}</p>
              <p className={`text-2xl font-black ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Breakdown & Analysis */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-stone-400 mb-5">Finance Breakdown</h4>
            <div className="space-y-4">
              {[
                { label: "Your Equity (Deposit)", pct: depPct, color: "bg-emerald-500" },
                { label: "Initial Bank Share", pct: 100 - depPct, color: "bg-stone-400" },
                { label: "Lifetime Profit Cost", pct: profitPct, color: "bg-amber-400" },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-stone-600">{b.label}</span>
                    <span className="text-stone-900">{b.pct}%</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${b.color} transition-all duration-700 ease-out`}
                      style={{ width: `${Math.min(100, b.pct)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-emerald-600/60 mb-5">Ownership Analysis</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-emerald-900">{ltvPct}%</span>
                <span className="text-xs font-bold text-emerald-600/80 uppercase tracking-wider">LTV Ratio</span>
              </div>
              <div className="h-3 bg-white/50 border border-white rounded-full overflow-hidden mt-4">
                 <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      ltvPct <= 60 ? "bg-emerald-500" : ltvPct <= 75 ? "bg-amber-400" : "bg-orange-500"
                    }`}
                    style={{ width: `${ltvPct}%` }}
                  />
              </div>
              <p className="text-xs font-medium text-emerald-800/70 mt-4 leading-relaxed">
                {ltvPct <= 60
                  ? "✓ Excellent LTV. You likely qualify for the bank's most competitive profit rates."
                  : ltvPct <= 75
                  ? "• Standard LTV ratio. You have access to the majority of halal finance products."
                  : "⚠ High LTV. Products may be limited or carry a higher rental premium."}
              </p>
            </div>
            <div className="mt-8 pt-5 border-t border-emerald-100/30 flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-600/60 uppercase tracking-widest">Finance Amount</span>
              <span className="text-lg font-black text-emerald-900">{formatCurrency(result.financeAmount)}</span>
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-stone-400 ml-1">Yearly Repayment Schedule</h4>
          <div className="rounded-[1.5rem] border border-stone-100 overflow-hidden bg-white shadow-sm">
            <div className="max-h-[350px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-stone-50 border-b border-stone-200/50 z-10">
                  <tr>
                    <th className="py-3 px-4 text-left text-[10px] font-black uppercase tracking-widest text-stone-400">Year</th>
                    <th className="py-3 px-4 text-right text-[10px] font-black uppercase tracking-widest text-stone-400">{info.col2}</th>
                    <th className="py-3 px-4 text-right text-[10px] font-black uppercase tracking-widest text-stone-400">{info.col3}</th>
                    <th className="py-3 px-4 text-right text-[10px] font-black uppercase tracking-widest text-stone-400">End Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {result.schedule.map((row) => (
                    <tr key={row.year} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4 text-[10px] font-black text-stone-400">YEAR {row.year}</td>
                      <td className="py-3 px-4 text-right font-medium text-amber-700">{formatCurrency(row.profitOrRent)}</td>
                      <td className="py-3 px-4 text-right font-medium text-emerald-700">{formatCurrency(row.principal)}</td>
                      <td className="py-3 px-4 text-right font-bold text-stone-900">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-stone-400 mt-6 leading-relaxed text-center px-4">
          * Representative example only. Final payment amounts depend on your specific contract, fees, and Sharia-board approved rate reviews.
        </p>
      </div>
    </div>
  );
}
