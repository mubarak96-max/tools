"use client";

import React, { useState, useMemo } from "react";
import { DollarSign, Users, Clock, TrendingUp, Copy, CheckCircle2, Percent } from "lucide-react";

export function ClvCalculator() {
  const [avgOrderStr, setAvgOrderStr] = useState("80");
  const [freqStr, setFreqStr] = useState("4");
  const [lifespanStr, setLifespanStr] = useState("3");
  const [marginStr, setMarginStr] = useState("60");
  const [cacStr, setCacStr] = useState("120");
  const [copied, setCopied] = useState(false);

  const avgOrder = Math.max(0, parseFloat(avgOrderStr) || 0);
  const freq = Math.max(0, parseFloat(freqStr) || 0);
  const lifespan = Math.max(0, parseFloat(lifespanStr) || 0);
  const margin = Math.min(100, Math.max(0, parseFloat(marginStr) || 0));
  const cac = Math.max(0, parseFloat(cacStr) || 0);

  const stats = useMemo(() => {
    const clv = avgOrder * freq * lifespan;
    const profitClv = clv * (margin / 100);
    const annualRevenue = avgOrder * freq;
    const cacRatio = cac > 0 ? profitClv / cac : 0;

    let ratioHealth = "At Risk";
    let ratioColor = "text-red-500";
    let ratioBarColor = "bg-red-500";
    if (cacRatio >= 5) { ratioHealth = "Excellent"; ratioColor = "text-emerald-500"; ratioBarColor = "bg-emerald-500"; }
    else if (cacRatio >= 3) { ratioHealth = "Healthy"; ratioColor = "text-emerald-400"; ratioBarColor = "bg-emerald-400"; }
    else if (cacRatio >= 1) { ratioHealth = "Marginal"; ratioColor = "text-amber-500"; ratioBarColor = "bg-amber-500"; }

    return { clv, profitClv, annualRevenue, cacRatio, ratioHealth, ratioColor, ratioBarColor };
  }, [avgOrder, freq, lifespan, margin, cac]);

  const copyToClipboard = () => {
    const text = `CLV (Revenue): $${stats.clv.toFixed(2)}\nCLV (Profit): $${stats.profitClv.toFixed(2)}\nAnnual Revenue/Customer: $${stats.annualRevenue.toFixed(2)}\nCLV:CAC Ratio: ${stats.cacRatio.toFixed(2)}:1\nRatio Health: ${stats.ratioHealth}`;
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
            <Users className="w-4 h-4 text-primary" /> Customer Economics
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            <InputField label="Average Order Value ($)" icon={<DollarSign className="w-4 h-4" />} value={avgOrderStr} onChange={setAvgOrderStr} prefix="$" />
            <InputField label="Purchase Frequency (per year)" icon={<TrendingUp className="w-4 h-4" />} value={freqStr} onChange={setFreqStr} />
            <InputField label="Customer Lifespan (years)" icon={<Clock className="w-4 h-4" />} value={lifespanStr} onChange={setLifespanStr} />
            <InputField label="Gross Profit Margin (%)" icon={<Percent className="w-4 h-4" />} value={marginStr} onChange={setMarginStr} suffix="%" />
          </div>

          <div className="pt-6 border-t border-border space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">CLV:CAC Ratio Comparison</p>
            <InputField label="Customer Acquisition Cost (CAC)" icon={<DollarSign className="w-4 h-4" />} value={cacStr} onChange={setCacStr} prefix="$" />
          </div>
        </div>

        {/* Results */}
        <div className="p-6 sm:p-10 bg-muted/10 flex flex-col justify-center gap-8">
          
          <div className="space-y-2 text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lifetime Value (Revenue)</span>
            <div className="text-7xl font-black italic tracking-tighter text-foreground">${stats.clv.toFixed(0)}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-border shadow-sm text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Profit CLV</span>
              <span className="text-2xl font-black text-emerald-600">${stats.profitClv.toFixed(0)}</span>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-border shadow-sm text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Annual Value</span>
              <span className="text-2xl font-black">${stats.annualRevenue.toFixed(0)}</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-foreground text-background space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="flex justify-between items-end z-10 relative">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-1">CLV : CAC Ratio</span>
                <span className="text-4xl font-black italic tracking-tighter">{stats.cacRatio.toFixed(1)}x</span>
              </div>
              <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white/10 ${stats.ratioColor}`}>{stats.ratioHealth}</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-700 ${stats.ratioBarColor}`} style={{ width: `${Math.min(100, (stats.cacRatio / 6) * 100)}%` }} />
            </div>
            <p className="text-[10px] opacity-50 font-black uppercase tracking-widest">Target: 3:1 minimum</p>
          </div>

          <button onClick={copyToClipboard} className="w-full py-4 rounded-full bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-xs">
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied Report" : "Copy CLV Report"}
          </button>
        </div>
      </div>
    </section>
  );
}

function InputField({ label, icon, value, onChange, prefix, suffix }: { label: string; icon: React.ReactNode; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">{prefix}</span>}
        <input
          type="number" min="0" step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-muted/10 border-2 border-border focus:border-primary/50 focus:bg-background rounded-2xl ${prefix ? "pl-10" : "pl-5"} ${suffix ? "pr-10" : "pr-5"} py-4 text-lg font-bold outline-none transition-all`}
        />
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">{suffix}</span>}
      </div>
    </div>
  );
}
