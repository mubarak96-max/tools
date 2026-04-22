"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import { Download, Calculator, Target, Info, TrendingUp, DollarSign, Package, PieChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fmt = (n: number, decimals = 2) =>
  isNaN(n) || !isFinite(n)
    ? "—"
    : n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

const fmtCurrency = (n: number) =>
  isNaN(n) || !isFinite(n)
    ? "—"
    : "$" + fmt(n);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/20 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-md">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">{label} units</p>
        <div className="space-y-1">
          {payload.map((p: any) => (
            <div key={p.name} className="flex items-center justify-between gap-4 text-sm font-medium" style={{ color: p.color }}>
              <span>{p.name}</span>
              <span>{fmtCurrency(p.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState(10000);
  const [variableCost, setVariableCost] = useState(25);
  const [sellingPrice, setSellingPrice] = useState(75);
  const [targetProfit, setTargetProfit] = useState(5000);
  const [activeTab, setActiveTab] = useState<"units" | "sales" | "formula">("units");

  const calc = useMemo(() => {
    const fc = parseFloat(fixedCosts as any) || 0;
    const vc = parseFloat(variableCost as any) || 0;
    const sp = parseFloat(sellingPrice as any) || 0;
    const tp = parseFloat(targetProfit as any) || 0;

    const contributionMargin = sp - vc;
    const contributionMarginRatio = sp > 0 ? contributionMargin / sp : 0;
    const bepUnits = contributionMargin > 0 ? fc / contributionMargin : Infinity;
    const bepSales = bepUnits * sp;
    const targetUnits = contributionMargin > 0 ? (fc + tp) / contributionMargin : Infinity;
    const targetSales = targetUnits * sp;

    return {
      fc,
      vc,
      sp,
      tp,
      contributionMargin,
      contributionMarginRatio: contributionMarginRatio * 100,
      bepUnits,
      bepSales,
      targetUnits,
      targetSales,
    };
  }, [fixedCosts, variableCost, sellingPrice, targetProfit]);

  const chartData = useMemo(() => {
    const { fc, vc, sp, bepUnits } = calc;
    if (!isFinite(bepUnits) || bepUnits <= 0) return [];
    
    const maxUnits = Math.ceil(bepUnits * 2);
    const step = Math.max(1, Math.ceil(maxUnits / 15));
    const points = [];
    
    for (let u = 0; u <= maxUnits; u += step) {
      points.push({
        units: u,
        Revenue: +(u * sp).toFixed(2),
        "Total Costs": +(fc + (u * vc)).toFixed(2),
        "Fixed Costs": +fc.toFixed(2),
      });
    }
    return points;
  }, [calc]);

  const isValid = calc.contributionMargin > 0 && isFinite(calc.bepUnits);

  const handleExportCSV = () => {
    const headers = ["Units", "Revenue", "Total Costs", "Fixed Costs"];
    const rows = chartData.map((r) =>
      [r.units, r.Revenue, r["Total Costs"], r["Fixed Costs"]].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "break-even-analysis.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[2.5rem] border border-white/40 bg-white/60 p-6 shadow-premium backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Financial Inputs</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Step 1: Define your costs</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <PieChart className="w-3 h-3" /> Total Fixed Costs
                  </label>
                  <span className="text-sm font-bold text-slate-900 font-mono">{fmtCurrency(calc.fc)}</span>
                </div>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                     <span className="text-sm font-bold">$</span>
                   </div>
                   <input
                    type="number"
                    value={fixedCosts}
                    onChange={(e) => setFixedCosts(Number(e.target.value))}
                    className="w-full bg-white/50 border border-slate-200 rounded-2xl py-3 pl-8 pr-4 text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-inner"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="500"
                  value={fixedCosts}
                  onChange={(e) => setFixedCosts(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <Package className="w-3 h-3" /> Variable Cost Per Unit
                  </label>
                  <span className="text-sm font-bold text-slate-900 font-mono">{fmtCurrency(calc.vc)}</span>
                </div>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                     <span className="text-sm font-bold">$</span>
                   </div>
                   <input
                    type="number"
                    value={variableCost}
                    onChange={(e) => setVariableCost(Number(e.target.value))}
                    className="w-full bg-white/50 border border-slate-200 rounded-2xl py-3 pl-8 pr-4 text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-inner"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="1"
                  value={variableCost}
                  onChange={(e) => setVariableCost(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3" /> Selling Price Per Unit
                  </label>
                  <span className="text-sm font-bold text-slate-900 font-mono">{fmtCurrency(calc.sp)}</span>
                </div>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                     <span className="text-sm font-bold">$</span>
                   </div>
                   <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full bg-white/50 border border-slate-200 rounded-2xl py-3 pl-8 pr-4 text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-inner"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="1"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 mt-4">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5 px-1">
                  <Target className="w-3 h-3" /> Desired Net Profit
                </label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                     <span className="text-sm font-bold">$</span>
                   </div>
                   <input
                    type="number"
                    value={targetProfit}
                    onChange={(e) => setTargetProfit(Number(e.target.value))}
                    className="w-full bg-white/50 border border-slate-200 rounded-2xl py-3 pl-8 pr-4 text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-inner"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-[2.5rem] border border-white/40 bg-white/60 p-6 shadow-premium backdrop-blur-xl min-h-[500px] flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
                {(["units", "sales", "formula"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] rounded-xl transition-all ${
                      activeTab === tab
                        ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab === "units" ? "Units View" : tab === "sales" ? "Sales View" : "The Formula"}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
              >
                <Download className="w-3 h-3" /> Export CSV
              </button>
            </div>

            <div className="flex-1">
              {!isValid ? (
                <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 animate-pulse">
                    <Info className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Impossible Calculation</h3>
                  <p className="text-sm text-slate-500 max-w-xs">
                    Your selling price must be higher than your variable cost for your business to break even.
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {activeTab === "units" && (
                    <motion.div 
                      key="units"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
                           <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Break Even Units</p>
                           <h3 className="text-4xl font-black">{fmt(calc.bepUnits, 0)}</h3>
                           <p className="text-[11px] text-slate-400 mt-2">Required units to cover all costs</p>
                        </div>
                        <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem] group hover:bg-primary/10 transition-all">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-1">Target Profit Units</p>
                           <h3 className="text-4xl font-black text-primary">{fmt(calc.targetUnits, 0)}</h3>
                           <p className="text-[11px] text-slate-500 mt-2">Units to reach {fmtCurrency(calc.tp)} profit</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/50 border border-slate-100 p-4 rounded-[1.5rem]">
                           <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Unit Contribution</p>
                           <h4 className="text-lg font-bold text-slate-900">{fmtCurrency(calc.contributionMargin)}</h4>
                        </div>
                        <div className="bg-white/50 border border-slate-100 p-4 rounded-[1.5rem]">
                           <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">CM Ratio</p>
                           <h4 className="text-lg font-bold text-slate-900">{fmt(calc.contributionMarginRatio, 1)}%</h4>
                        </div>
                      </div>

                      <div className="relative h-64 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="units" hide />
                            <YAxis hide />
                            <Tooltip content={<CustomTooltip />} />
                            <ReferenceLine x={Math.round(calc.bepUnits)} stroke="#6366f1" strokeDasharray="5 5" label={{ value: 'BEP', position: 'top', fill: '#6366f1', fontSize: 10, fontWeight: 700 }} />
                            <Area type="monotone" dataKey="Revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            <Area type="monotone" dataKey="Total Costs" stroke="#f43f5e" strokeWidth={2} fill="transparent" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "sales" && (
                    <motion.div 
                      key="sales"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-2xl">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 text-center">Break Even Sales</p>
                           <h3 className="text-center text-4xl font-black truncate">{fmtCurrency(calc.bepSales)}</h3>
                           <p className="text-[11px] text-slate-400 mt-2 text-center">Minimum gross revenue threshold</p>
                         </div>
                         <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem]">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-1 text-center">Target Profit Sales</p>
                           <h3 className="text-center text-4xl font-black text-primary truncate">{fmtCurrency(calc.targetSales)}</h3>
                           <p className="text-[11px] text-slate-500 mt-2 text-center">Revenue to reach {fmtCurrency(calc.tp)}</p>
                         </div>
                      </div>

                      <div className="bg-white/40 border border-slate-100 p-6 rounded-[2rem] space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500 font-medium">Total Fixed Costs</span>
                          <span className="font-bold text-slate-900">{fmtCurrency(calc.fc)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500 font-medium">Variable Costs (at BEP)</span>
                          <span className="font-bold text-slate-900">{fmtCurrency(calc.bepUnits * calc.vc)}</span>
                        </div>
                        <div className="h-px bg-slate-100 w-full" />
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Operational Cost</span>
                          <span className="text-lg font-black text-slate-900">{fmtCurrency(calc.fc + (calc.bepUnits * calc.vc))}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "formula" && (
                     <motion.div 
                      key="formula"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="bg-slate-900 rounded-[2rem] p-8 text-slate-300 font-mono text-sm leading-relaxed relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                            <Info className="w-12 h-12" />
                         </div>
                         <div className="space-y-4">
                            <div>
                               <p className="text-primary-soft text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">// 1. Unit Contribution</p>
                               <p>CM = Price ({fmtCurrency(calc.sp)}) - Cost ({fmtCurrency(calc.vc)}) = <span className="text-white font-bold">{fmtCurrency(calc.contributionMargin)}</span></p>
                            </div>
                            <div>
                               <p className="text-primary-soft text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">// 2. Break Even Calculation</p>
                               <p>Units = Fixed Costs ({fmtCurrency(calc.fc)}) / CM ({fmtCurrency(calc.contributionMargin)})</p>
                               <p className="mt-1 text-white text-lg font-bold">{fmt(calc.bepUnits, 1)} units</p>
                            </div>
                            <div>
                               <p className="text-primary-soft text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">// 3. Target Profit Extension</p>
                               <p>Goal = (Fixed Costs + Target Profit) / CM</p>
                               <p>Goal = ({fmtCurrency(calc.fc)} + {fmtCurrency(calc.tp)}) / {fmtCurrency(calc.contributionMargin)}</p>
                               <p className="mt-1 text-white text-lg font-bold">{fmt(calc.targetUnits, 1)} units</p>
                            </div>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            <div className="mt-auto pt-6">
               <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-50 border border-indigo-100/50">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary flex-shrink-0 shadow-sm ring-1 ring-black/5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Profit Recognition</p>
                    <p className="text-[10px] text-slate-600 leading-relaxed mt-0.5">
                      Beyond <strong>{fmt(calc.bepUnits, 0)} units</strong>, every additional sale contributes <strong>{fmtCurrency(calc.contributionMargin)}</strong> directly to your net profit.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
