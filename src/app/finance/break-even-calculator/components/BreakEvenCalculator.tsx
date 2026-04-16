"use client";

import React, { useState, useMemo } from "react";
import { Copy, CheckCircle2, TrendingUp, DollarSign, Package } from "lucide-react";

export function BreakEvenCalculator() {
  const [fixedCostsStr, setFixedCostsStr] = useState("15000");
  const [variableCostStr, setVariableCostStr] = useState("20");
  const [sellingPriceStr, setSellingPriceStr] = useState("50");
  const [currentUnitsStr, setCurrentUnitsStr] = useState("700");
  const [copied, setCopied] = useState(false);

  const fixedCosts = Math.max(0, parseFloat(fixedCostsStr) || 0);
  const variableCost = Math.max(0, parseFloat(variableCostStr) || 0);
  const sellingPrice = Math.max(0, parseFloat(sellingPriceStr) || 0);
  const currentUnits = Math.max(0, parseFloat(currentUnitsStr) || 0);

  const stats = useMemo(() => {
    const contributionMargin = sellingPrice - variableCost;
    const contributionMarginPct = sellingPrice > 0 ? (contributionMargin / sellingPrice) * 100 : 0;
    const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0;
    const breakEvenRevenue = breakEvenUnits * sellingPrice;
    const currentRevenue = currentUnits * sellingPrice;
    const marginOfSafetyUnits = Math.max(0, currentUnits - breakEvenUnits);
    const marginOfSafetyPct = currentRevenue > 0 ? ((currentRevenue - breakEvenRevenue) / currentRevenue) * 100 : 0;
    const netProfit = (currentUnits - breakEvenUnits) * contributionMargin;

    return { contributionMargin, contributionMarginPct, breakEvenUnits, breakEvenRevenue, currentRevenue, marginOfSafetyUnits, marginOfSafetyPct, netProfit };
  }, [fixedCosts, variableCost, sellingPrice, currentUnits]);

  const copyToClipboard = () => {
    const text = `Break-Even Units: ${stats.breakEvenUnits}\nBreak-Even Revenue: $${stats.breakEvenRevenue.toFixed(2)}\nContribution Margin: $${stats.contributionMargin.toFixed(2)}\nMargin of Safety: ${stats.marginOfSafetyPct.toFixed(1)}%\nNet Profit (at ${currentUnits} units): $${stats.netProfit.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPct = stats.breakEvenUnits > 0 ? Math.min(100, (currentUnits / (stats.breakEvenUnits * 1.5)) * 100) : 0;
  const breakEvenBarPct = stats.breakEvenUnits > 0 ? Math.min(100, (stats.breakEvenUnits / (stats.breakEvenUnits * 1.5)) * 100) : 0;

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw">
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">

        {/* Inputs */}
        <div className="p-6 sm:p-10 space-y-8 border-b lg:border-b-0 lg:border-r border-border">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" /> Cost & Pricing Inputs
          </h3>
          <div className="space-y-5">
            {[
              { label: "Fixed Costs (Monthly $)", value: fixedCostsStr, onChange: setFixedCostsStr, prefix: "$" },
              { label: "Variable Cost per Unit ($)", value: variableCostStr, onChange: setVariableCostStr, prefix: "$" },
              { label: "Selling Price per Unit ($)", value: sellingPriceStr, onChange: setSellingPriceStr, prefix: "$" },
            ].map(({ label, value, onChange, prefix }) => (
              <div key={label} className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">{label}</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground text-sm">{prefix}</span>
                  <input type="number" min="0" value={value} onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-muted/10 border-2 border-border focus:border-primary/50 rounded-2xl pl-10 pr-5 py-4 text-xl font-bold outline-none transition-all" />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-border space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Margin of Safety Analysis</p>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Current Sales Volume (Units)</label>
              <div className="relative">
                <input type="number" min="0" value={currentUnitsStr} onChange={(e) => setCurrentUnitsStr(e.target.value)}
                  className="w-full bg-emerald-500/5 border-2 border-emerald-500/20 focus:border-emerald-500/40 rounded-2xl px-5 py-4 text-xl font-bold outline-none transition-all text-emerald-700" />
              </div>
            </div>

            {/* Contribution margin pill */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Contribution Margin</span>
              <div className="flex items-center gap-2">
                <span className="font-black text-foreground">${stats.contributionMargin.toFixed(2)}</span>
                <span className="text-[10px] font-black text-muted-foreground">({stats.contributionMarginPct.toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-6 sm:p-10 bg-muted/10 flex flex-col justify-center gap-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Break-Even Point</span>
            <div className="text-7xl font-black italic tracking-tighter text-foreground">{stats.breakEvenUnits}</div>
            <span className="text-base font-bold text-muted-foreground">units to sell</span>
          </div>

          {/* Visual bar */}
          <div className="space-y-2">
            <div className="relative h-4 bg-muted/30 rounded-full overflow-hidden border border-border">
              <div className="absolute h-full bg-emerald-500/30 rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
              <div className="absolute top-0 h-full w-0.5 bg-red-500" style={{ left: `${breakEvenBarPct}%` }} />
            </div>
            <div className="flex justify-between text-[9px] font-black uppercase text-muted-foreground px-1">
              <span>0</span>
              <span className="text-red-500">Break-Even: {stats.breakEvenUnits}</span>
              <span className="text-emerald-600">Current: {currentUnits}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl bg-white border border-border shadow-sm text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Break-Even Revenue</span>
              <span className="text-xl font-black">${stats.breakEvenRevenue.toLocaleString()}</span>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-border shadow-sm text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Margin of Safety</span>
              <span className={`text-xl font-black ${stats.marginOfSafetyPct >= 0 ? "text-emerald-600" : "text-red-500"}`}>{stats.marginOfSafetyPct.toFixed(1)}%</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-foreground text-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-1 z-10 relative">Net Profit at {currentUnits} units</span>
            <span className={`text-3xl font-black italic tracking-tighter z-10 relative ${stats.netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {stats.netProfit >= 0 ? "+" : ""}${stats.netProfit.toFixed(0)}
            </span>
          </div>

          <button onClick={copyToClipboard} className="w-full py-4 rounded-full bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-xs">
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied Report" : "Copy Analysis"}
          </button>
        </div>
      </div>
    </section>
  );
}
