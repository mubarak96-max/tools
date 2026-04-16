"use client";

import React, { useState, useMemo } from "react";
import { DollarSign, TrendingUp, Percent, Copy, CheckCircle2, Target } from "lucide-react";

export function RoasCalculator() {
  const [revenueStr, setRevenueStr] = useState("4000");
  const [spendStr, setSpendStr] = useState("1000");
  const [marginStr, setMarginStr] = useState("50");
  const [copied, setCopied] = useState(false);

  const revenue = Math.max(0, parseFloat(revenueStr) || 0);
  const spend = Math.max(0, parseFloat(spendStr) || 0);
  const margin = Math.min(100, Math.max(0, parseFloat(marginStr) || 0));

  const stats = useMemo(() => {
    const roas = spend > 0 ? revenue / spend : 0;
    const revenuePerDollar = roas;
    const grossProfit = revenue * (margin / 100);
    const netProfit = grossProfit - spend;
    const breakEvenRoas = margin > 0 ? 100 / margin : 0;
    const isBelowBreakEven = roas < breakEvenRoas;

    let status = "Unprofitable";
    let statusColor = "text-red-500";
    let barColor = "bg-red-500";

    if (roas >= 5) { status = "Excellent"; statusColor = "text-emerald-500"; barColor = "bg-emerald-500"; }
    else if (roas >= 3) { status = "Profitable"; statusColor = "text-emerald-400"; barColor = "bg-emerald-400"; }
    else if (roas >= breakEvenRoas) { status = "Break-Even"; statusColor = "text-amber-500"; barColor = "bg-amber-500"; }

    return { roas, revenuePerDollar, grossProfit, netProfit, breakEvenRoas, isBelowBreakEven, status, statusColor, barColor };
  }, [revenue, spend, margin]);

  const copyToClipboard = () => {
    const text = `Revenue: $${revenue}\nAd Spend: $${spend}\nROAS: ${stats.roas.toFixed(2)}x\nNet Profit: $${stats.netProfit.toFixed(2)}\nStatus: ${stats.status}\nBreak-Even ROAS: ${stats.breakEvenRoas.toFixed(2)}x`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw">
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">

        {/* Inputs */}
        <div className="p-6 sm:p-10 space-y-8 border-b lg:border-b-0 lg:border-r border-border">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> Campaign Data
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Revenue from Ads ($)</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                <input type="number" min="0" value={revenueStr} onChange={(e) => setRevenueStr(e.target.value)}
                  className="w-full bg-muted/10 border-2 border-border focus:border-primary/50 rounded-2xl pl-10 pr-5 py-5 text-xl font-bold outline-none transition-all" placeholder="4000" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Total Ad Spend ($)</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                <input type="number" min="0" value={spendStr} onChange={(e) => setSpendStr(e.target.value)}
                  className="w-full bg-muted/10 border-2 border-border focus:border-primary/50 rounded-2xl pl-10 pr-5 py-5 text-xl font-bold outline-none transition-all" placeholder="1000" />
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t border-border">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Gross Profit Margin (%) — for break-even calc</label>
              <div className="relative">
                <input type="number" min="0" max="100" value={marginStr} onChange={(e) => setMarginStr(e.target.value)}
                  className="w-full bg-muted/10 border-2 border-border focus:border-primary/50 rounded-2xl pl-5 pr-14 py-5 text-xl font-bold outline-none transition-all" placeholder="50" />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-6 sm:p-10 bg-muted/10 flex flex-col justify-center gap-6">
          {/* Primary metric */}
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Return on Ad Spend</span>
            <div className="text-7xl font-black italic tracking-tighter text-foreground">{stats.roas.toFixed(2)}x</div>
            <span className={`text-sm font-bold uppercase tracking-widest ${stats.statusColor}`}>{stats.status}</span>
          </div>

          {/* Bar */}
          <div className="space-y-1">
            <div className="h-3 w-full bg-muted/50 rounded-full overflow-hidden border border-border">
              <div className={`h-full transition-all duration-700 ${stats.barColor}`} style={{ width: `${Math.min(100, (stats.roas / 8) * 100)}%` }} />
            </div>
            <div className="flex justify-between text-[9px] font-black uppercase text-muted-foreground opacity-60 px-1">
              <span>0x</span><span>4x Target</span><span>8x+</span>
            </div>
          </div>

          {/* Secondary metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl bg-white border border-border shadow-sm text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Net Profit</span>
              <span className={`text-xl font-black ${stats.netProfit >= 0 ? "text-emerald-600" : "text-red-500"}`}>${stats.netProfit.toFixed(0)}</span>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-border shadow-sm text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Break-Even ROAS</span>
              <span className="text-xl font-black">{stats.breakEvenRoas.toFixed(2)}x</span>
            </div>
          </div>

          {stats.isBelowBreakEven && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs font-bold text-red-600">
              Your current ROAS ({stats.roas.toFixed(2)}x) is below the break-even ROAS ({stats.breakEvenRoas.toFixed(2)}x). This campaign is losing money.
            </div>
          )}

          <button onClick={copyToClipboard} className="w-full py-4 rounded-full bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-xs">
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied Report" : "Copy ROAS Report"}
          </button>
        </div>
      </div>
    </section>
  );
}
