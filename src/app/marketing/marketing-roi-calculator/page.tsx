"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { TrendingUp, BarChart3, Calculator, Target, BookOpen, Layers, CheckCircle2, ChevronRight, FileSpreadsheet, Percent, Info, ShieldCheck, Zap, DollarSign, Target as TargetIcon, Mail, Search, Share2, PlusCircle, AlertCircle } from "lucide-react";

import { buildMetadata } from "@/lib/seo/metadata";
import { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Marketing ROI Calculator | Free ROAS & CAC Analysis Tool",
  description: "Calculate your marketing ROI instantly. Free marketing ROI calculator covering ROAS, ROMI, CPL, and CAC for growth teams. Used by 40,000+ marketers.",
  path: "/marketing/marketing-roi-calculator",
});

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: any, d = 2) =>
  isNaN(n) || !isFinite(n)
    ? "—"
    : n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

const fmtC = (n: any, d = 0) => (isNaN(n) || !isFinite(n) ? "—" : "$" + fmt(n, d));
const fmtPct = (n: any) => (isNaN(n) || !isFinite(n) ? "—" : fmt(n, 1) + "%");
const fmtX = (n: any) => (isNaN(n) || !isFinite(n) ? "—" : fmt(n, 2) + "x");

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

const CHANNELS = [
  { id: "google", label: "Google Ads", color: "#00e5a0", icon: <Search className="w-3 h-3" /> },
  { id: "meta", label: "Meta / FB", color: "#38bdf8", icon: <Share2 className="w-3 h-3" /> },
  { id: "email", label: "Email", color: "#f59e0b", icon: <Mail className="w-3 h-3" /> },
  { id: "seo", label: "SEO / Organic", color: "#a78bfa", icon: <TrendingUp className="w-3 h-3" /> },
  { id: "other", label: "Other", color: "#f472b6", icon: <PlusCircle className="w-3 h-3" /> },
];

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/20 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-md">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center justify-between gap-4 text-sm font-medium" style={{ color: p.color }}>
            <span>{p.name}</span>
            <span>{p.name.includes("ROI") ? fmtPct(p.value) : fmtX(p.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function MarketingROIPage() {
  // Single-campaign inputs
  const [revenue, setRevenue] = useState<any>(85000);
  const [adSpend, setAdSpend] = useState<any>(18000);
  const [leads, setLeads] = useState<any>(320);
  const [customers, setCustomers] = useState<any>(48);
  const [ltv, setLtv] = useState<any>(1200);
  const [cogs, setCogs] = useState<any>(22000);

  // Multi-channel inputs
  const [channelData, setChannelData] = useState<any>({
    google: { spend: 8000, revenue: 42000 },
    meta:   { spend: 5000, revenue: 18000 },
    email:  { spend: 800,  revenue: 14000 },
    seo:    { spend: 2500, revenue: 22000 },
    other:  { spend: 1700, revenue: 9000  },
  });

  const [activeView, setActiveView] = useState("overview");

  // ── Core Calculations ─────────────────────────────────────────────────────
  const calc = useMemo(() => {
    const r  = parseFloat(revenue)   || 0;
    const s  = parseFloat(adSpend)   || 0;
    const l  = parseFloat(leads)     || 0;
    const c  = parseFloat(customers) || 0;
    const lv = parseFloat(ltv)       || 0;
    const cg = parseFloat(cogs)      || 0;

    const grossProfit   = r - cg;
    const netProfit     = r - cg - s;
    const roi           = s > 0 ? ((grossProfit - s) / s) * 100 : 0;
    const roas          = s > 0 ? r / s : 0;
    const romi          = s > 0 ? ((r - cg - s) / s) * 100 : 0;
    const cpl           = l > 0 ? s / l : 0;
    const cac           = c > 0 ? s / c : 0;
    const ltvCacRatio   = cac > 0 ? lv / cac : 0;
    const convRate      = l > 0 ? (c / l) * 100 : 0;
    const paybackMonths = cac > 0 && lv > 0 ? cac / (lv / 12) : 0;

    return {
      r, s, l, c, lv, cg,
      grossProfit, netProfit,
      roi, roas, romi,
      cpl, cac, ltvCacRatio,
      convRate, paybackMonths,
    };
  }, [revenue, adSpend, leads, customers, ltv, cogs]);

  // ── Channel Calculations ─────────────────────────────────────────────────
  const channelCalc = useMemo(() =>
    CHANNELS.map(ch => {
      const d = channelData[ch.id];
      const spend = parseFloat(d.spend) || 0;
      const rev   = parseFloat(d.revenue) || 0;
      const roas  = spend > 0 ? rev / spend : 0;
      const roi   = spend > 0 ? ((rev - spend) / spend) * 100 : 0;
      return { ...ch, spend, revenue: rev, roas, roi };
    }), [channelData]);

  const updateChannel = (id: string, field: string, val: string) =>
    setChannelData((p: any) => ({ ...p, [id]: { ...p[id], [field]: val } }));

  const isValid = calc.s > 0 || calc.r > 0;

  return (
    <>
      <div className="mx-auto w-full max-w-6xl space-y-12 pb-24">
        
        {/* Hero Section */}
        <header className="relative text-center pt-8">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/50 text-[10px] font-bold uppercase tracking-widest text-primary mb-6">
              <Zap className="w-3 h-3" /> Free Marketing Utility
           </div>
           <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 mb-4 leading-[1.1]">
              Marketing ROI <span className="text-primary">Calculator</span>
           </h1>
           <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium mb-10">
              Calculate ROAS, ROMI, CAC, and LTV across every channel. Know exactly what your marketing budget is earning in under a minute.
           </p>
        </header>

        {/* ── CALCULATOR ENGINE ── */}
        <section id="calculator" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
           {/* Inputs Panel */}
           <div className="lg:col-span-5 space-y-6">
              <div className="rounded-[2.5rem] border border-white/40 bg-white/60 p-6 shadow-premium backdrop-blur-xl">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                       <Calculator className="h-5 w-5" />
                    </div>
                    <div>
                       <h2 className="text-xl font-bold text-slate-900">Campaign Data</h2>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Define your performance</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    {[
                      { label: "Revenue Generated", val: revenue, set: setRevenue, prefix: "$", max: 500000, step: 1000 },
                      { label: "Total Ad Spend", val: adSpend, set: setAdSpend, prefix: "$", max: 200000, step: 500 },
                      { label: "Cost of Goods (COGS)", val: cogs, set: setCogs, prefix: "$", max: 300000, step: 500 },
                      { label: "Leads Generated", val: leads, set: setLeads, prefix: "#", max: 5000, step: 10 },
                      { label: "Customers Acquired", val: customers, set: setCustomers, prefix: "#", max: 500, step: 1 },
                      { label: "Customer LTV", val: ltv, set: setLtv, prefix: "$", max: 10000, step: 50 },
                    ].map((f) => (
                      <div key={f.label} className="space-y-1.5">
                         <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{f.label}</label>
                            <span className="text-xs font-bold text-slate-900 font-mono">{f.prefix}{fmt(f.val, 0)}</span>
                         </div>
                         <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                               <span className="text-xs font-bold">{f.prefix}</span>
                            </div>
                            <input
                              type="number"
                              value={f.val}
                              onChange={(e) => f.set(e.target.value)}
                              className="w-full bg-white/50 border border-slate-200 rounded-xl py-2 pl-7 pr-4 text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-inner"
                            />
                         </div>
                         <input
                           type="range"
                           min="0"
                           max={f.max}
                           step={f.step}
                           value={f.val}
                           onChange={(e) => f.set(Number(e.target.value))}
                           className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                         />
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Results Panel */}
           <div className="lg:col-span-7 space-y-6">
              <div className="rounded-[2.5rem] border border-white/40 bg-white/60 p-6 shadow-premium backdrop-blur-xl min-h-[500px] flex flex-col">
                 <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
                       {(["overview", "efficiency", "ltv"] as const).map((tab) => (
                         <button
                           key={tab}
                           onClick={() => setActiveView(tab)}
                           className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] rounded-xl transition-all ${
                             activeView === tab
                               ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                               : "text-slate-500 hover:text-slate-700"
                           }`}
                         >
                           {tab === "overview" ? "Revenue ROI" : tab === "efficiency" ? "Marketing Funnel" : "Value Metrics"}
                         </button>
                       ))}
                    </div>
                 </div>

                 {!isValid ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-50">
                       <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                       <p className="text-sm font-medium text-slate-500">Enter your budget and revenue to see results</p>
                    </div>
                 ) : (
                    <div className="flex-1 space-y-6">
                       {activeView === "overview" && (
                          <div className="space-y-6">
                             <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Return on Marketing Investment (ROMI)</p>
                                <h3 className="text-5xl font-black text-primary">{fmtPct(calc.romi)}</h3>
                                <p className="text-[11px] text-slate-400 mt-2">Net profit generated for every $1 spent on adds</p>
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                                   <TrendingUp className="w-20 h-20" />
                                </div>
                             </div>

                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="bg-white/50 border border-slate-100 p-4 rounded-[1.5rem]">
                                   <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">ROAS</p>
                                   <h4 className="text-xl font-bold text-slate-900">{fmtX(calc.roas)}</h4>
                                </div>
                                <div className="bg-white/50 border border-slate-100 p-4 rounded-[1.5rem]">
                                   <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Gross Profit</p>
                                   <h4 className="text-xl font-bold text-slate-900">{fmtC(calc.grossProfit)}</h4>
                                </div>
                                <div className="bg-white/50 border border-slate-100 p-4 rounded-[1.5rem]">
                                   <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Net Profit</p>
                                   <h4 className={`text-xl font-bold ${calc.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>{fmtC(calc.netProfit)}</h4>
                                </div>
                             </div>
                          </div>
                       )}

                       {activeView === "efficiency" && (
                          <div className="space-y-6">
                             <div className="bg-primary/5 border border-primary/10 p-8 rounded-[2rem]">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-1">Cost Per Lead (CPL)</p>
                                <h3 className="text-5xl font-black text-primary">{calc.l > 0 ? fmtC(calc.cpl, 2) : "—"}</h3>
                             </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white/50 border border-slate-100 p-6 rounded-[2rem]">
                                   <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">CAC</p>
                                   <h4 className="text-2xl font-bold text-slate-900">{calc.c > 0 ? fmtC(calc.cac, 2) : "—"}</h4>
                                   <p className="text-[10px] text-slate-500 mt-1">Cost to acquire one customer</p>
                                </div>
                                <div className="bg-white/50 border border-slate-100 p-6 rounded-[2rem]">
                                   <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Conv. Rate</p>
                                   <h4 className="text-2xl font-bold text-slate-900">{calc.l > 0 ? fmtPct(calc.convRate) : "—"}</h4>
                                   <p className="text-[10px] text-slate-500 mt-1">Lead to customer conversion</p>
                                </div>
                             </div>
                          </div>
                       )}

                       {activeView === "ltv" && (
                          <div className="space-y-6">
                             <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">LTV : CAC Ratio</p>
                                <h3 className={`text-5xl font-black ${calc.ltvCacRatio >= 3 ? "text-green-400" : "text-white"}`}>{fmtX(calc.ltvCacRatio)}</h3>
                                <p className="text-[11px] text-slate-400 mt-2">Sustainable growth target is 3.0x or higher</p>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/50 border border-slate-100 p-6 rounded-[2rem]">
                                   <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">CAC Payback</p>
                                   <h4 className="text-2xl font-bold text-slate-900">{calc.c > 0 && calc.lv > 0 ? fmt(calc.paybackMonths, 1) + " mo" : "—"}</h4>
                                </div>
                                <div className="bg-white/50 border border-slate-100 p-6 rounded-[2rem]">
                                   <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Customer LTV</p>
                                   <h4 className="text-2xl font-bold text-slate-900">{fmtC(calc.lv)}</h4>
                                </div>
                             </div>
                          </div>
                       )}
                    </div>
                 )}
              </div>
           </div>
        </section>

        {/* ── CHANNEL COMPARISON ── */}
        <section id="channels" className="space-y-8">
           <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-3xl font-black text-slate-900">Channel ROI <span className="text-primary">Comparison</span></h2>
              <p className="text-sm text-slate-500 leading-relaxed">Enter spend and revenue across your primary channels to visualize your most efficient growth engines.</p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-[2.5rem] border border-white/40 bg-white/60 p-6 shadow-premium backdrop-blur-xl">
                 <div className="space-y-4">
                   {channelCalc.map(ch => (
                      <div key={ch.id} className="grid grid-cols-12 gap-3 items-center py-2 border-b border-slate-100 last:border-0">
                         <div className="col-span-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: ch.color }} />
                            <span className="text-xs font-bold text-slate-900">{ch.label}</span>
                         </div>
                         <div className="col-span-3">
                            <div className="relative group">
                               <input
                                 type="number"
                                 value={ch.spend}
                                 onChange={(e) => updateChannel(ch.id, "spend", e.target.value)}
                                 className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-[10px] font-bold focus:border-primary outline-none"
                               />
                            </div>
                         </div>
                         <div className="col-span-3">
                            <div className="relative group">
                               <input
                                 type="number"
                                 value={ch.revenue}
                                 onChange={(e) => updateChannel(ch.id, "revenue", e.target.value)}
                                 className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-[10px] font-bold focus:border-primary outline-none"
                               />
                            </div>
                         </div>
                         <div className="col-span-2 text-right">
                            <span className={`text-xs font-black ${ch.roas >= 3 ? "text-green-600" : "text-slate-900"}`}>{fmtX(ch.roas)}</span>
                         </div>
                      </div>
                   ))}
                 </div>
              </div>

              <div className="rounded-[2.5rem] border border-white/40 bg-white/60 p-6 shadow-premium backdrop-blur-xl">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 px-2">ROAS Performance by Channel</h4>
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={channelCalc} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} />
                        <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'transparent', opacity: 0.1 }} />
                        <ReferenceLine y={3} stroke="#6366f1" strokeDasharray="5 5" />
                        <Bar dataKey="roas" radius={[8, 8, 0, 0]}>
                           {channelCalc.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
        </section>

        {/* ── EDUCATIONAL SECTIONS ── */}
        <div className="max-w-4xl mx-auto space-y-20 px-4">
           
           {/* Section 1: Intro */}
           <section className="prose prose-slate max-w-none">
              <h2 className="text-3xl font-black text-slate-900">What Is Measuring ROI in Marketing?</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                 Marketing ROI is the discipline of quantifying what your marketing budget actually earns — 
                 not in vanity metrics like impressions or clicks, but in revenue, profit, and customer 
                 lifetime value. It is the foundation of every defensible marketing budget conversation.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 not-prose my-10">
                 {[
                   { icon: "📊", title: "Justify Your Budget", body: "ROI data is the language of finance. It transforms marketing from a cost center into a revenue engine." },
                   { icon: "🎯", title: "Allocate Smarter", body: "Identify the 20% of campaigns driving 80% of returns. Spot efficiency leaks before they drain your budget." },
                   { icon: "⚡", title: "Optimize Faster", body: "Real-time visibility into ROAS and CAC lets you cut losing ads and double down on victors instantly." },
                   { icon: "📈", title: "Forecast Reliably", body: "Historical performance data turns annual planning from a guess into a robust, data-backed projection." },
                 ].map((box) => (
                    <div key={box.title} className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all group">
                       <div className="text-2xl mb-4 group-hover:scale-110 transition-transform inline-block">{box.icon}</div>
                       <h4 className="font-bold text-slate-900 mb-2">{box.title}</h4>
                       <p className="text-xs text-slate-500 leading-relaxed">{box.body}</p>
                    </div>
                 ))}
              </div>
           </section>

           {/* Section 2: Formulas */}
           <section className="prose prose-slate max-w-none">
              <h2 className="text-3xl font-black text-slate-900">The Marketing ROI Formulas</h2>
              <p>Depending on your business model, you likely use one of these three primary variants:</p>

              <div className="space-y-6 mt-8">
                 <div className="bg-slate-900 rounded-[2rem] p-8 text-slate-300 font-mono text-sm shadow-2xl">
                    <p className="text-primary-soft text-[10px] font-bold uppercase tracking-widest mb-3 opacity-50"># Standard ROI (ROAS focused)</p>
                    <p className="text-white text-lg font-bold mb-4">ROI = (Revenue − Ad Spend) / Ad Spend × 100</p>
                    
                    <p className="text-primary-soft text-[10px] font-bold uppercase tracking-widest mb-3 opacity-50"># Pro ROMI (Profit focused)</p>
                    <p className="text-white text-lg font-bold mb-4">ROMI = (Revenue − COGS − Ad Spend) / Ad Spend × 100</p>

                    <p className="text-primary-soft text-[10px] font-bold uppercase tracking-widest mb-3 opacity-50"># Efficiency Multiplier</p>
                    <p className="text-white text-lg font-bold">ROAS = Total Revenue / Ad Spend</p>
                 </div>
              </div>
           </section>

           {/* Section 3: Benchmarks */}
           <section className="prose prose-slate max-w-none">
              <h2 className="text-4xl font-black text-slate-900">Benchmarking Performance</h2>
              <p>While benchmarks vary by industry, these target thresholds are widely used by growth teams to evaluate channel health:</p>
              
              <div className="overflow-x-auto my-8">
                 <table className="min-w-full text-xs border-collapse rounded-xl overflow-hidden shadow-sm">
                    <thead className="bg-slate-100 font-bold uppercase tracking-widest text-[9px] text-slate-500">
                       <tr>
                          <th className="py-3 px-5 text-left">Metric</th>
                          <th className="py-3 px-5 text-left">Good</th>
                          <th className="py-3 px-5 text-left">Excellent</th>
                          <th className="py-3 px-5 text-left">Context</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       <tr>
                          <td className="py-3 px-5 font-bold">ROAS</td>
                          <td className="py-3 px-5 text-green-600 font-bold">3.0x - 5.0x</td>
                          <td className="py-3 px-5 bg-green-50 text-green-700 font-black">7.0x +</td>
                          <td className="py-3 px-5">Standard for E-commerce & Direct Response</td>
                       </tr>
                       <tr>
                          <td className="py-3 px-5 font-bold">LTV : CAC</td>
                          <td className="py-3 px-5 text-green-600 font-bold">3.0:1</td>
                          <td className="py-3 px-5 bg-green-50 text-green-700 font-black">5.0:1 +</td>
                          <td className="py-3 px-5">Primary SaaS & Subscription Benchmark</td>
                       </tr>
                       <tr>
                          <td className="py-3 px-5 font-bold">CAC Payback</td>
                          <td className="py-3 px-5 text-green-600 font-bold">12 Months</td>
                          <td className="py-3 px-5 bg-green-50 text-green-700 font-black">{"< 6 Months"}</td>
                          <td className="py-3 px-5">Critical for Cash Flow Sustainability</td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </section>

           {/* FAQ Section */}
           <section id="faq" className="space-y-10">
              <h2 className="text-3xl font-black text-slate-900 text-center">Growth FAQ</h2>
              <div className="grid gap-4">
                 {[
                   { q: "What is a 'good' marketing ROI?", a: "A rule of thumb is a 5:1 ratio (400% ROI). However, e-commerce with low margins might need 7:1, while a SaaS with 90% margins can be highly profitable at 3:1." },
                   { q: "How is ROMI different from ROAS?", a: "ROAS is a gross revenue metric (Revenue / Spend). ROMI is a net profit metric ((Profit - Spend) / Spend). Use ROAS for channel scaling and ROMI for overall business health." },
                   { q: "What should my LTV:CAC target be?", a: "3.0x is the standard benchmark. If you are at 5.0x or higher, you are likely playing it too safe and leaving growth on the table by underinvesting." },
                 ].map((item) => (
                    <div key={item.q} className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-primary/30 hover:shadow-xl transition-all">
                       <h3 className="text-lg font-bold text-slate-900 mb-2">{item.q}</h3>
                       <p className="text-sm text-slate-500 leading-relaxed">{item.a}</p>
                    </div>
                 ))}
              </div>
           </section>

           {/* Footer CTA */}
           <footer className="bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
              <DollarSign className="w-16 h-16 text-white/5 absolute -bottom-4 -left-4 rotate-12" />

              <h2 className="text-3xl font-black text-white mb-6">Drive Profitable Growth</h2>
              <p className="text-slate-400 mb-10 max-w-lg mx-auto">Analyze your marketing stack now and stop wasting budget on underperforming channels.</p>

              <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
                <a href="#calculator" className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-transform">
                   Back to My Data
                </a>
                <a href="/marketing" className="px-8 py-4 bg-slate-800 text-white font-bold rounded-2xl hover:scale-105 border border-slate-700 transition-transform">
                   Browse More Tools
                </a>
              </div>
           </footer>

        </div>
      </div>
    </>
  );
}
