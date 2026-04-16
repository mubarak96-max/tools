"use client";

import React, { useState, useMemo } from "react";
import { Copy, CheckCircle2, ArrowRightLeft } from "lucide-react";

export function MarkupMarginCalculator() {
  const [mode, setMode] = useState<"cost-price" | "cost-markup" | "price-margin">("cost-price");
  const [costStr, setCostStr] = useState("20");
  const [priceStr, setPriceStr] = useState("30");
  const [markupStr, setMarkupStr] = useState("50");
  const [marginStr, setMarginStr] = useState("33.33");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    let cost = 0, price = 0, profit = 0, markup = 0, margin = 0;

    if (mode === "cost-price") {
      cost = parseFloat(costStr) || 0;
      price = parseFloat(priceStr) || 0;
      profit = price - cost;
      markup = cost > 0 ? (profit / cost) * 100 : 0;
      margin = price > 0 ? (profit / price) * 100 : 0;
    } else if (mode === "cost-markup") {
      cost = parseFloat(costStr) || 0;
      markup = parseFloat(markupStr) || 0;
      profit = cost * (markup / 100);
      price = cost + profit;
      margin = price > 0 ? (profit / price) * 100 : 0;
    } else {
      price = parseFloat(priceStr) || 0;
      margin = parseFloat(marginStr) || 0;
      profit = price * (margin / 100);
      cost = price - profit;
      markup = cost > 0 ? (profit / cost) * 100 : 0;
    }

    return { cost, price, profit, markup, margin };
  }, [mode, costStr, priceStr, markupStr, marginStr]);

  const copyToClipboard = () => {
    const text = `Cost: $${stats.cost.toFixed(2)}\nSelling Price: $${stats.price.toFixed(2)}\nProfit: $${stats.profit.toFixed(2)}\nMarkup: ${stats.markup.toFixed(2)}%\nMargin: ${stats.margin.toFixed(2)}%`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const markupBarPct = Math.min(100, (stats.markup / 200) * 100);
  const marginBarPct = Math.min(100, stats.margin);

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw">
      <div className="grid lg:grid-cols-2 gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">

        {/* Calculate From… switcher + Inputs */}
        <div className="p-6 sm:p-10 space-y-8 border-b lg:border-b-0 lg:border-r border-border">
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Calculate from:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "cost-price", label: "Cost + Price" },
                { id: "cost-markup", label: "Cost + Markup" },
                { id: "price-margin", label: "Price + Margin" },
              ].map((opt) => (
                <button key={opt.id} onClick={() => setMode(opt.id as typeof mode)}
                  className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${mode === opt.id ? "bg-foreground text-background border-foreground shadow-lg" : "bg-muted/20 border-border text-muted-foreground hover:border-primary/30"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {(mode === "cost-price" || mode === "cost-markup") && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Cost Price ($)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                  <input type="number" min="0" value={costStr} onChange={(e) => setCostStr(e.target.value)}
                    className="w-full bg-muted/10 border-2 border-border focus:border-primary/50 rounded-2xl pl-10 pr-5 py-5 text-xl font-bold outline-none transition-all" />
                </div>
              </div>
            )}

            {(mode === "cost-price" || mode === "price-margin") && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Selling Price ($)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                  <input type="number" min="0" value={priceStr} onChange={(e) => setPriceStr(e.target.value)}
                    className="w-full bg-muted/10 border-2 border-border focus:border-primary/50 rounded-2xl pl-10 pr-5 py-5 text-xl font-bold outline-none transition-all" />
                </div>
              </div>
            )}

            {mode === "cost-markup" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Markup (%)</label>
                <div className="relative">
                  <input type="number" min="0" value={markupStr} onChange={(e) => setMarkupStr(e.target.value)}
                    className="w-full bg-muted/10 border-2 border-border focus:border-primary/50 rounded-2xl px-5 pr-12 py-5 text-xl font-bold outline-none transition-all" />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">%</span>
                </div>
              </div>
            )}

            {mode === "price-margin" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Gross Margin (%)</label>
                <div className="relative">
                  <input type="number" min="0" max="100" value={marginStr} onChange={(e) => setMarginStr(e.target.value)}
                    className="w-full bg-muted/10 border-2 border-border focus:border-primary/50 rounded-2xl px-5 pr-12 py-5 text-xl font-bold outline-none transition-all" />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="p-6 sm:p-10 bg-muted/10 flex flex-col justify-center gap-6">
          {/* The two key outputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 block">Markup</span>
              <span className="text-5xl font-black italic tracking-tighter text-foreground">{stats.markup.toFixed(1)}%</span>
              <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${markupBarPct}%` }} />
              </div>
              <span className="text-[9px] font-black uppercase text-muted-foreground">of Cost</span>
            </div>
            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block">Margin</span>
              <span className="text-5xl font-black italic tracking-tighter text-foreground">{stats.margin.toFixed(1)}%</span>
              <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${marginBarPct}%` }} />
              </div>
              <span className="text-[9px] font-black uppercase text-muted-foreground">of Revenue</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Cost", value: `$${stats.cost.toFixed(2)}` },
              { label: "Selling Price", value: `$${stats.price.toFixed(2)}` },
              { label: "Profit", value: `$${stats.profit.toFixed(2)}`, color: stats.profit >= 0 ? "text-emerald-600" : "text-red-500" },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-4 rounded-2xl bg-white border border-border shadow-sm text-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">{label}</span>
                <span className={`text-lg font-black ${color || "text-foreground"}`}>{value}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3">
            <ArrowRightLeft className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-black text-foreground">Markup → Margin:</span> Margin = Markup / (100 + Markup) × 100. A {stats.markup.toFixed(0)}% markup equals a {stats.margin.toFixed(1)}% margin.
            </p>
          </div>

          <button onClick={copyToClipboard} className="w-full py-4 rounded-full bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-xs">
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied Report" : "Copy Report"}
          </button>
        </div>
      </div>
    </section>
  );
}
