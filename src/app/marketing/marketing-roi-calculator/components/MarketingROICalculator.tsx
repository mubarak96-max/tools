"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { TrendingUp, Calculator, Zap, DollarSign, Search, Share2, Mail, PlusCircle, AlertCircle, Target } from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: any, d = 2) =>
  isNaN(n) || !isFinite(n)
    ? "—"
    : n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

const fmtC = (n: any, d = 0) => (isNaN(n) || !isFinite(n) ? "—" : "$" + fmt(n, d));
const fmtPct = (n: any) => (isNaN(n) || !isFinite(n) ? "—" : fmt(n, 1) + "%");
const fmtX = (n: any) => (isNaN(n) || !isFinite(n) ? "—" : fmt(n, 2) + "x");

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

interface ChannelState {
  spend: number | string;
  revenue: number | string;
}

interface ChannelData extends ChannelState {
  id: string;
  label: string;
  color: string;
  icon: React.ReactNode;
  roas: number;
  roi: number;
}

export default function MarketingROICalculator() {
  // Single-campaign inputs
  const [revenue, setRevenue] = useState<string | number>(85000);
  const [adSpend, setAdSpend] = useState<string | number>(18000);
  const [leads, setLeads] = useState<string | number>(320);
  const [customers, setCustomers] = useState<string | number>(48);
  const [ltv, setLtv] = useState<string | number>(1200);
  const [cogs, setCogs] = useState<string | number>(22000);

  // Multi-channel inputs
  const [channelData, setChannelData] = useState<Record<string, ChannelState>>({
    google: { spend: 8000, revenue: 42000 },
    meta: { spend: 5000, revenue: 18000 },
    email: { spend: 800, revenue: 14000 },
    seo: { spend: 2500, revenue: 22000 },
    other: { spend: 1700, revenue: 9000 },
  });

  const [activeView, setActiveView] = useState("overview");

  // ── Core Calculations ─────────────────────────────────────────────────────
  const calc = useMemo(() => {
    const r = parseFloat(revenue.toString()) || 0;
    const s = parseFloat(adSpend.toString()) || 0;
    const l = parseFloat(leads.toString()) || 0;
    const c = parseFloat(customers.toString()) || 0;
    const lv = parseFloat(ltv.toString()) || 0;
    const cg = parseFloat(cogs.toString()) || 0;

    const grossProfit = r - cg;
    const netProfit = r - cg - s;
    const roi = s > 0 ? ((grossProfit - s) / s) * 100 : 0;
    const roas = s > 0 ? r / s : 0;
    const romi = s > 0 ? ((r - cg - s) / s) * 100 : 0;
    const cpl = l > 0 ? s / l : 0;
    const cac = c > 0 ? s / c : 0;
    const ltvCacRatio = cac > 0 ? lv / cac : 0;
    const convRate = l > 0 ? (c / l) * 100 : 0;
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
  const channelCalc: ChannelData[] = useMemo(() =>
    CHANNELS.map(ch => {
      const d = channelData[ch.id];
      const spend = parseFloat(d.spend.toString()) || 0;
      const rev = parseFloat(d.revenue.toString()) || 0;
      const roas = spend > 0 ? rev / spend : 0;
      const roi = spend > 0 ? ((rev - spend) / spend) * 100 : 0;
      return { ...ch, spend, revenue: rev, roas, roi };
    }), [channelData]);

  const updateChannel = (id: string, field: keyof ChannelState, val: string) =>
    setChannelData((p) => ({ ...p, [id]: { ...p[id], [field]: val } }));

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
                      className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] rounded-xl transition-all ${activeView === tab
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
              <div className="grid grid-cols-12 gap-3 mb-4 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <div className="col-span-4">Channel</div>
                <div className="col-span-3">Ad Spend ($)</div>
                <div className="col-span-3">Revenue ($)</div>
                <div className="col-span-2 text-right">ROAS</div>
              </div>
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
        <div className="max-w-4xl mx-auto space-y-24 px-4">

          {/* Section 1: Intro & The Philosophy of ROI */}
          <article className="prose prose-slate max-w-none">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">The Marketer's Guide to Profitability and Growth</h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              In the modern growth landscape, "vanity metrics" like reach, impressions, and even click-through rates (CTR) are no longer enough to justify a marketing budget. As data privacy laws tighten and platform algorithms become "black boxes," the ability to calculate and prove <strong>Marketing ROI</strong> has become the most critical skill for growth leaders.
            </p>
            <p className="text-slate-600 leading-relaxed">
              ROI isn't just a number; it's a strategic feedback loop. If your ROI is too low, you're burning cash. If it's too high (e.g., 20:1), you're likely under-investing and leaving market share on the table for competitors. This calculator is designed to help you find the "Goldilocks Zone" of profitable scaling.
            </p>

            <div className="grid sm:grid-cols-2 gap-8 not-prose my-16">
              {[
                { icon: "💹", title: "Economic Truth", body: "Stop guessing if a campaign worked. Transition from reporting on 'engagement' to reporting on 'contribution margin' and 'incremental EBITDA'." },
                { icon: "🚀", title: "Scaling Velocity", body: "Identify the exact moment a channel becomes inefficient. Shift budget from diminishing-return platforms to untapped growth engines." },
                { icon: "🛡️", title: "Budget Defense", body: "When CFOs look to cut costs, marketing is the first target. Guard your budget with cold, hard LTV and CAC payback data." },
                { icon: "📈", title: "Forecasting Precision", body: "Turn historical performance into predictive models. Know exactly how much revenue an extra $50,000 in spend will generate." },
              ].map((box) => (
                <div key={box.title} className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-primary/30 hover:shadow-2xl transition-all group">
                  <div className="text-3xl mb-6 group-hover:scale-110 transition-transform inline-block">{box.icon}</div>
                  <h4 className="text-lg font-black text-slate-900 mb-3">{box.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{box.body}</p>
                </div>
              ))}
            </div>
          </article>

          {/* Section 2: ROAS vs ROMI vs ROI - The Technical Difference */}
          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-black text-slate-900">Understanding the Lexicon: ROAS vs. ROMI vs. ROI</h2>
            <p className="text-slate-600">
              One of the most common mistakes in performance meetings is using these three terms interchangeably. While they are related, they tell different stories about your business health.
            </p>

            <div className="space-y-8 mt-10">
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 transition-all hover:bg-white hover:shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mt-0 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs">A</div>
                  ROAS (Return on Ad Spend)
                </h3>
                <p className="text-sm font-bold text-primary mb-3">Formula: Total Revenue / Ad Spend</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <strong>Best for:</strong> Tactical campaign optimization. ROAS tells you how much top-line revenue a specific ad platform generates. However, it is a "dangerously optimistic" metric because it ignores COGS, shipping, and labor. A 4x ROAS might look good, but if your product margins are 20%, you are actually losing money.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 transition-all hover:bg-white hover:shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mt-0 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs">B</div>
                  ROMI (Return on Marketing Investment)
                </h3>
                <p className="text-sm font-bold text-primary mb-3">Formula: (Gross Profit - Ad Spend) / Ad Spend</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <strong>Best for:</strong> Marketing Directors. ROMI factors in the Cost of Goods Sold (COGS). It answers the question: "After making the product and paying for the ads, did we have money left over?" This is a much purer reflection of marketing efficiency.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 transition-all hover:bg-white hover:shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mt-0 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs">C</div>
                  Contribution-Model ROI
                </h3>
                <p className="text-sm font-bold text-primary mb-3">Formula: (Net Profit / Total Expense) × 100</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <strong>Best for:</strong> CEOs and CFOs. This takes every expense into account — not just the ad spend and COGS, but also the overhead of the marketing team, software subscriptions (SaaS), and agency fees. This is the ultimate "truth" metric for the department.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: The Attribution Challenge */}
          <section className="bg-slate-900 rounded-[3rem] p-10 sm:p-16 text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
               <Target className="w-64 h-64" />
            </div>
            
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-3xl font-black mb-6">The Attribution Problem: Why Calculators Can Be Wrong</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Calculators are precise, but the data flowing into them is often flawed. <strong>Attribution</strong> is the science of assigning credit to different touchpoints in a customer journey. Most platforms default to "Last-Click," which heavily favors Search and Retargeting while ignoring the "top-of-funnel" awareness work done by Social or Display ads.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <h4 className="font-bold text-primary mb-2">Multi-Touch Attribution (MTA)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Recognizes that a user might see 5 ads before buying. Linear attribution gives 20% credit to each, while Time-Decay gives more credit to the final clicks.</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <h4 className="font-bold text-primary mb-2">Incrementality & Lift</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Testing if the sale would have happened anyway. Brand search often has a high ROAS, but low incrementality (people were already looking for you).</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Deep Dive into Unit Economics (CAC & LTV) */}
          <article className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-black text-slate-900">Unit Economics: The Soul of Scaling</h2>
            <p className="text-slate-600">
              If your goal is sustainable growth, you must understand the relationship between <strong>Customer Acquisition Cost (CAC)</strong> and <strong>Lifetime Value (LTV)</strong>.
            </p>

            <div className="my-12 p-8 bg-indigo-600 rounded-[2.5rem] shadow-2xl shadow-indigo-200 text-white">
              <h3 className="text-xl font-bold mt-0 text-white mb-4 italic">"The LTV : CAC Trap"</h3>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Many startups fail because they focus on a 3:1 LTV:CAC ratio while ignoring <strong>CAC Payback Period</strong>. If it takes 24 months to recoup your acquisition cost but you only have 12 months of cash in the bank, you will go out of business while being "theoretically" profitable. Always prioritize a payback period of under 12 months in the early stages of a business.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-slate-900">How to Calculate LTV Properly</h3>
            <p className="text-slate-600">
              Don't just look at total revenue. Use this formula for a more accurate LTV:
              <br />
              <code className="bg-slate-100 px-2 py-1 rounded text-primary font-bold">LTV = (Average Order Value × Purchase Frequency × Customer Lifespan) × Profit Margin</code>
            </p>
            <p className="text-slate-600">
              Using your gross revenue as LTV is a common reporting error that leads to over-spending on acquisition. By including your profit margin, you ensure that every customer acquired is truly contributing to the bottom line.
            </p>
          </article>

          {/* Section 5: Optimization Framework - The "Rule of 5" */}
          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-black text-slate-900">The Growth Framework: Optimizing Your ROI</h2>
            <p className="text-slate-600">Once you have your numbers, how do you improve them? We recommend the <strong>Rule of 5 Optimization Stack</strong>:</p>

            <div className="space-y-6 mt-8">
              {[
                { step: "01", name: "Conversion Rate Optimization (CRO)", txt: "The fastest way to double your ROI is not to double your traffic, but to double your conversion rate. A 2% CR vs a 4% CR effectively halves your CAC." },
                { step: "02", name: "Offer Engineering", txt: "Does your offer solve a high-intent pain point? Bundling products or adding 'risk reversal' (guarantees) can drastically increase AOV and ROAS." },
                { step: "03", name: "Creative Iteration", txt: "On platforms like Meta or YouTube, the 'creative is the targeting.' Testing 10 distinct hooks per week is the baseline for high-performance teams." },
                { step: "04", name: "Funnel Friction Removal", txt: "Every step in your checkout or lead form is a potential leak. Use tools like Heatmaps to find where users drop off and remove unnecessary fields." },
                { step: "05", name: "Retention & LTV Expansion", txt: "The cost of selling to an existing customer is 5-7x cheaper than acquiring a new one. Implement robust email automation and up-sell logic." },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 items-start group">
                  <div className="text-2xl font-black text-primary/20 group-hover:text-primary transition-colors">{item.step}</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{item.name}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.txt}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Data Hygiene & Tracking Accuracy */}
          <section className="prose prose-slate max-w-none border-t border-slate-100 pt-16">
            <h2 className="text-3xl font-black text-slate-900">Garbage In, Garbage Out: Data Hygiene</h2>
            <p className="text-slate-600">
              A calculator is only as good as the tracking behind it. With the death of third-party cookies (ITP) and the rise of ad-blockers, standard pixel tracking often loses 20-40% of conversion data. To get an accurate ROI, consider:
            </p>
            <ul className="text-slate-600 space-y-4">
              <li><strong>Server-Side Tracking (CAPI):</strong> Sending conversion tokens directly from your server to the platform (Meta, Google) to bypass browser-based ad blockers.</li>
              <li><strong>UTM Standardization:</strong> Ensuring every link has accurate `utm_source`, `utm_medium`, and `utm_campaign` tags so your Google Analytics matches your ad manager.</li>
              <li><strong>Post-Purchase Surveys:</strong> Ask customers "How did you hear about us?" to capture that "dark social" traffic that pixels can't see (Word of Mouth, Podcasts, etc.).</li>
            </ul>
          </section>

          {/* Section 7: Benchmarking Performance */}
          <section className="prose prose-slate max-w-none group">
            <h2 className="text-4xl font-black text-slate-900">Marketing ROI Benchmarks (2025/2026)</h2>
            <p className="text-slate-600">Benchmarks are targets, not rules. However, they provide excellent grounding for goal-setting across common industries:</p>
            
            <div className="overflow-x-auto my-8 rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                 <table className="min-w-full text-xs border-collapse">
                    <thead className="bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px]">
                       <tr>
                          <th className="py-5 px-6 text-left">Metric</th>
                          <th className="py-5 px-6 text-left">SaaS</th>
                          <th className="py-5 px-6 text-left">E-commerce</th>
                          <th className="py-5 px-6 text-left">Service/B2B</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                       <tr className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900 border-r border-slate-50">Target ROAS</td>
                          <td className="py-4 px-6 font-medium">350% - 500%</td>
                          <td className="py-4 px-6 font-medium">400% - 800%</td>
                          <td className="py-4 px-6 font-medium">250% - 400%</td>
                       </tr>
                       <tr className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900 border-r border-slate-50">LTV : CAC</td>
                          <td className="py-4 px-6 font-black text-primary">3.0x+</td>
                          <td className="py-4 px-6 font-medium">2.5x+</td>
                          <td className="py-4 px-6 font-black text-primary">4.0x+</td>
                       </tr>
                       <tr className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900 border-r border-slate-50">CAC Payback</td>
                          <td className="py-4 px-6 font-medium">12 Mo</td>
                          <td className="py-4 px-6 font-black text-primary">1st Order</td>
                          <td className="py-4 px-6 font-medium">3-6 Mo</td>
                       </tr>
                       <tr className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900 border-r border-slate-50">Lead-to-Sale</td>
                          <td className="py-4 px-6 font-medium">5% - 15%</td>
                          <td className="py-4 px-6 font-medium">N/A</td>
                          <td className="py-4 px-6 font-medium">15% - 30%</td>
                       </tr>
                    </tbody>
                 </table>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-black text-slate-900 mb-2">Growth & Strategy FAQ</h2>
              <p className="text-slate-500 font-medium">Expert answers for performance marketing and unit economics.</p>
            </div>
            
            <div className="grid gap-6">
               {[
                 { q: "Is a high ROAS always good?", a: "Not necessarily. If your ROAS is 10x but your total volume is $5,000, and your overhead is $10k, you're going backwards. Sometimes it's better to accept a 4x ROAS at $100k volume to achieve economies of scale and dominate market share." },
                 { q: "Should I include branding spend in my ROI?", a: "Yes, eventually. While brand spend (like billboards or high-level video) doesn't drive direct 'clicks', it significantly improves the efficiency of your direct response ads. We recommend applying a 'Blended ROAS' metric to the whole department." },
                 { q: "How do I calculate 'Incremental' ROI?", a: "This is the return on the last dollar spent. To find it, compare your results from two different spend levels (e.g., $10k vs $15k per month). Subtract the base revenue from the new revenue, then divide by the difference in spend." },
                 { q: "What is 'Churn Rate' and why does it kill ROI?", a: "Churn is the percentage of customers who leave. Since ROI is tied to Lifetime Value, a high churn rate collapses your LTV, forcing you to acquire new customers just to stay flat. Retention is the silent engine of ROI." },
               ].map((item) => (
                  <div key={item.q} className="p-8 rounded-[2.5rem] border border-slate-100 bg-white hover:border-primary/40 hover:shadow-2xl transition-all group">
                     <h3 className="text-lg font-black text-slate-900 mb-4 group-hover:text-primary transition-colors">{item.q}</h3>
                     <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.a}</p>
                  </div>
               ))}
            </div>
          </section>

          {/* Footer CTA */}
          <footer className="bg-white border border-slate-100 rounded-[3rem] p-12 text-center relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />

            <h2 className="text-2xl font-black text-slate-900 mb-2">Master Your Unit Economics</h2>
            <p className="text-sm text-slate-500 mb-10 max-w-lg mx-auto">Precision tracking and analysis turn marketing into a predictable revenue machine.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
              <Link href="/finance/emi-calculator" className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all group">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-primary group-hover:scale-110 transition-transform shadow-sm font-bold text-xs">EMI</div>
                <span className="font-bold text-slate-900">EMI Calculator</span>
              </Link>
              <Link href="/finance/invoice-generator" className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all group">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-primary group-hover:scale-110 transition-transform shadow-sm font-bold text-xs">INV</div>
                <span className="font-bold text-slate-900">Invoice Generator</span>
              </Link>
              <Link href="/finance/break-even-calculator" className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all group">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-primary group-hover:scale-110 transition-transform shadow-sm font-bold text-xs">BEP</div>
                <span className="font-bold text-slate-900">Break Even Calc</span>
              </Link>
            </div>
          </footer>

        </div>
      </div>
    </>
  );
}
