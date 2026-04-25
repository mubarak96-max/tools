"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Wallet,
  PiggyBank,
  ArrowDownUp,
  IndianRupee,
  Calendar,
  Percent,
  ChevronDown,
  ChevronUp,
  Info,
  Target,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type CalcMode = "sip" | "lumpsum" | "swp";

interface CalculatorState {
  mode: CalcMode;
  monthlyInvestment: number;
  lumpsumAmount: number;
  expectedReturn: number;
  years: number;
  stepUpPercent: number;
  inflationRate: number;
  swpMonthly: number;
  swpYears: number;
  currentCorpus: number;
}

const initialState: CalculatorState = {
  mode: "sip",
  monthlyInvestment: 10000,
  lumpsumAmount: 500000,
  expectedReturn: 12,
  years: 10,
  stepUpPercent: 10,
  inflationRate: 6,
  swpMonthly: 30000,
  swpYears: 20,
  currentCorpus: 10000000,
};

const COLORS = ["#3b82f6", "#10b981", "#f97316", "#f59e0b"];

function formatMoney(n: number): string {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatFullMoney(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function IndiaSIPCalculatorClient() {
  const [state, setState] = useState<CalculatorState>(initialState);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const results = useMemo(() => {
    const r = state.expectedReturn / 100 / 12;
    const n = state.years * 12;

    if (state.mode === "sip") {
      let totalInvested = 0;
      let maturityValue = 0;
      const yearlyData: { year: number; invested: number; value: number }[] = [];
      
      if (state.stepUpPercent > 0) {
        let currentMonthly = state.monthlyInvestment;
        let runningValue = 0;
        for (let year = 1; year <= state.years; year++) {
          for (let month = 1; month <= 12; month++) {
            runningValue = (runningValue + currentMonthly) * (1 + r);
            totalInvested += currentMonthly;
          }
          yearlyData.push({ year, invested: totalInvested, value: runningValue });
          currentMonthly = currentMonthly * (1 + state.stepUpPercent / 100);
        }
        maturityValue = runningValue;
      } else {
        totalInvested = state.monthlyInvestment * n;
        maturityValue = state.monthlyInvestment * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
        for (let year = 1; year <= state.years; year++) {
          const months = year * 12;
          const val = state.monthlyInvestment * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
          yearlyData.push({ year, invested: state.monthlyInvestment * months, value: val });
        }
      }

      const wealthGained = maturityValue - totalInvested;
      const inflationAdjusted = maturityValue / Math.pow(1 + state.inflationRate / 100, state.years);
      const ltcgTaxable = Math.max(0, wealthGained - 125000);
      const ltcgTax = ltcgTaxable * 0.125;
      const postTaxValue = maturityValue - ltcgTax;

      return { totalInvested, maturityValue, wealthGained, inflationAdjusted, ltcgTax, postTaxValue, yearlyData };
    }

    if (state.mode === "lumpsum") {
      const maturityValue = state.lumpsumAmount * Math.pow(1 + state.expectedReturn / 100, state.years);
      const wealthGained = maturityValue - state.lumpsumAmount;
      const inflationAdjusted = maturityValue / Math.pow(1 + state.inflationRate / 100, state.years);
      const yearlyData = [];
      for (let year = 1; year <= state.years; year++) {
        yearlyData.push({
          year,
          invested: state.lumpsumAmount,
          value: state.lumpsumAmount * Math.pow(1 + state.expectedReturn / 100, year),
        });
      }
      return {
        totalInvested: state.lumpsumAmount,
        maturityValue,
        wealthGained,
        inflationAdjusted,
        ltcgTax: 0,
        postTaxValue: maturityValue,
        yearlyData,
      };
    }

    const rAnnual = state.expectedReturn / 100;
    const monthlyR = rAnnual / 12;
    const swpMonths = state.swpYears * 12;
    let corpus = state.currentCorpus;
    const yearlyData = [];
    
    for (let year = 1; year <= state.swpYears; year++) {
      for (let month = 1; month <= 12; month++) {
        corpus = corpus * (1 + monthlyR) - state.swpMonthly;
        if (corpus <= 0) {
          corpus = 0;
          break;
        }
      }
      yearlyData.push({ year, invested: state.swpMonthly * (yearlyData.length * 12 + 12), value: corpus });
      if (corpus <= 0) break;
    }
    
    const totalWithdrawn = state.swpMonthly * Math.min(swpMonths, yearlyData.length * 12);
    return {
      totalInvested: state.currentCorpus,
      maturityValue: corpus,
      wealthGained: totalWithdrawn - state.currentCorpus,
      inflationAdjusted: corpus,
      ltcgTax: 0,
      postTaxValue: corpus,
      yearlyData,
    };
  }, [state]);

  const pieData = [
    { name: "Total Invested", value: Math.max(0, results.totalInvested), color: "#3b82f6" },
    { name: "Wealth Gained", value: Math.max(0, results.wealthGained), color: "#10b981" },
  ].filter((d) => d.value > 0);

  const handleChange = <K extends keyof CalculatorState>(field: K, value: CalculatorState[K]) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Mode Toggle */}
      <div className="mb-12 flex justify-center">
        <div className="flex rounded-2xl border-2 border-slate-100 bg-slate-50 p-1.5 shadow-sm">
          {[
            { key: "sip", label: "SIP", icon: PiggyBank },
            { key: "lumpsum", label: "Lumpsum", icon: Wallet },
            { key: "swp", label: "SWP", icon: ArrowDownUp },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => handleChange("mode", tab.key as CalcMode)}
                className={`flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-black uppercase tracking-tight transition-all ${
                  state.mode === tab.key 
                    ? "bg-white text-orange-600 shadow-md ring-1 ring-slate-100" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-premium">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Investment Config</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Custom Parameters</p>
              </div>
            </div>

            {state.mode === "sip" && (
              <>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <IndianRupee className="h-3 w-3 text-orange-500" />
                    Monthly SIP Amount
                  </label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-black text-slate-300 group-focus-within:text-orange-500">₹</span>
                    <input
                      type="number"
                      value={state.monthlyInvestment || ""}
                      onChange={(e) => handleChange("monthlyInvestment", Number(e.target.value))}
                      className="block w-full rounded-2xl border-2 border-slate-100 bg-white pl-10 pr-5 py-4 text-xl font-black text-slate-900 focus:border-orange-500 focus:outline-none transition-all"
                      placeholder="10000"
                    />
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <TrendingUp className="h-3 w-3 text-orange-500" />
                    Expected Return (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={state.expectedReturn}
                    onChange={(e) => handleChange("expectedReturn", Number(e.target.value))}
                    className="block w-full rounded-2xl border-2 border-slate-100 bg-white px-5 py-4 text-xl font-black text-slate-900 focus:border-orange-500 focus:outline-none transition-all"
                  />
                  <div className="flex flex-wrap gap-2">
                    {["7", "9", "12", "15"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleChange("expectedReturn", Number(r))}
                        className={`rounded-lg border-2 px-3 py-1.5 text-[10px] font-black uppercase transition-all ${
                          state.expectedReturn === Number(r) 
                            ? "border-orange-500 bg-orange-50 text-orange-700" 
                            : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-100"
                        }`}
                      >
                        {r}%
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <Calendar className="h-3 w-3 text-orange-500" />
                    Period (Years)
                  </label>
                  <input
                    type="number"
                    value={state.years}
                    onChange={(e) => handleChange("years", Number(e.target.value))}
                    className="block w-full rounded-2xl border-2 border-slate-100 bg-white px-5 py-4 text-xl font-black text-slate-900 focus:border-orange-500 focus:outline-none transition-all"
                  />
                  <div className="flex flex-wrap gap-2">
                    {["5", "10", "15", "20", "25"].map((y) => (
                      <button
                        key={y}
                        type="button"
                        onClick={() => handleChange("years", Number(y))}
                        className={`rounded-lg border-2 px-3 py-1.5 text-[10px] font-black uppercase transition-all ${
                          state.years === Number(y) 
                            ? "border-orange-500 bg-orange-50 text-orange-700" 
                            : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-100"
                        }`}
                      >
                        {y}Y
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {state.mode === "lumpsum" && (
              <>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <IndianRupee className="h-3 w-3 text-orange-500" />
                    Lumpsum Amount
                  </label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-black text-slate-300 group-focus-within:text-orange-500">₹</span>
                    <input
                      type="number"
                      value={state.lumpsumAmount || ""}
                      onChange={(e) => handleChange("lumpsumAmount", Number(e.target.value))}
                      className="block w-full rounded-2xl border-2 border-slate-100 bg-white pl-10 pr-5 py-4 text-xl font-black text-slate-900 focus:border-orange-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Expected Annual Return (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={state.expectedReturn}
                    onChange={(e) => handleChange("expectedReturn", Number(e.target.value))}
                    className="block w-full rounded-2xl border-2 border-slate-100 bg-white px-5 py-4 text-xl font-black text-slate-900 focus:border-orange-500 focus:outline-none transition-all"
                  />
                </div>
                <div className="mt-6 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Duration (Years)</label>
                  <input
                    type="number"
                    value={state.years}
                    onChange={(e) => handleChange("years", Number(e.target.value))}
                    className="block w-full rounded-2xl border-2 border-slate-100 bg-white px-5 py-4 text-xl font-black text-slate-900 focus:border-orange-500 focus:outline-none transition-all"
                  />
                </div>
              </>
            )}

            {state.mode === "swp" && (
              <>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <IndianRupee className="h-3 w-3 text-orange-500" />
                    Initial Corpus
                  </label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-black text-slate-300 group-focus-within:text-orange-500">₹</span>
                    <input
                      type="number"
                      value={state.currentCorpus || ""}
                      onChange={(e) => handleChange("currentCorpus", Number(e.target.value))}
                      className="block w-full rounded-2xl border-2 border-slate-100 bg-white pl-10 pr-5 py-4 text-xl font-black text-slate-900 focus:border-orange-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Monthly Withdrawal</label>
                  <input
                    type="number"
                    value={state.swpMonthly}
                    onChange={(e) => handleChange("swpMonthly", Number(e.target.value))}
                    className="block w-full rounded-2xl border-2 border-slate-100 bg-white px-5 py-4 text-xl font-black text-slate-900 focus:border-orange-500 focus:outline-none transition-all"
                  />
                </div>
                <div className="mt-6 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Expected Return (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={state.expectedReturn}
                    onChange={(e) => handleChange("expectedReturn", Number(e.target.value))}
                    className="block w-full rounded-2xl border-2 border-slate-100 bg-white px-5 py-4 text-xl font-black text-slate-900 focus:border-orange-500 focus:outline-none transition-all"
                  />
                </div>
                <div className="mt-6 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">SWP Duration (Years)</label>
                  <input
                    type="number"
                    value={state.swpYears}
                    onChange={(e) => handleChange("swpYears", Number(e.target.value))}
                    className="block w-full rounded-2xl border-2 border-slate-100 bg-white px-5 py-4 text-xl font-black text-slate-900 focus:border-orange-500 focus:outline-none transition-all"
                  />
                </div>
              </>
            )}

            {/* Advanced Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="mt-8 flex w-full items-center justify-between rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
            >
              <span>Advanced Analytics</span>
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-6 rounded-2xl border-2 border-slate-100 bg-white p-6 animate-in slide-in-from-top-2 duration-300">
                {state.mode !== "swp" && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Annual Step-Up (%)</label>
                    <input
                      type="number"
                      value={state.stepUpPercent}
                      onChange={(e) => handleChange("stepUpPercent", Number(e.target.value))}
                      className="block w-full rounded-xl border-2 border-slate-100 bg-white px-4 py-3 text-lg font-black text-slate-900 focus:border-orange-500 focus:outline-none transition-all"
                      disabled={state.mode === "lumpsum"}
                    />
                    <p className="text-[9px] font-bold text-slate-400 uppercase italic">Increase SIP amount annually</p>
                  </div>
                )}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inflation Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={state.inflationRate}
                    onChange={(e) => handleChange("inflationRate", Number(e.target.value))}
                    className="block w-full rounded-xl border-2 border-slate-100 bg-white px-4 py-3 text-lg font-black text-slate-900 focus:border-orange-500 focus:outline-none transition-all"
                  />
                  <p className="text-[9px] font-bold text-slate-400 uppercase italic">Real-world value adjustment</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: state.mode === "swp" ? "Withdrawn" : "Invested", value: formatMoney(results.totalInvested), color: "text-blue-600", sub: "Principal Amount" },
              { label: state.mode === "swp" ? "Remaining" : "Maturity", value: formatMoney(results.maturityValue), color: "text-emerald-600", sub: "End Balance" },
              { label: state.mode === "swp" ? "Wealth Used" : "Returns", value: formatMoney(Math.abs(results.wealthGained)), color: "text-orange-600", sub: "Est. Yield" },
              { label: "Inflation Adj", value: formatMoney(results.inflationAdjusted), color: "text-violet-600", sub: "Purchasing Power" },
            ].map((stat, i) => (
              <div key={i} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col items-center text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
                <p className={`text-xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</p>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Chart Ledger */}
          <div className="rounded-[2.5rem] border-2 border-slate-900 bg-white overflow-hidden shadow-xl">
             <div className="bg-slate-900 px-8 py-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Growth Projection</p>
                <p className="text-sm font-bold text-white italic">Wealth Accumulation over {state.years} Years</p>
              </div>
              <TrendingUp className="w-5 h-5 text-white/20" />
            </div>
            <div className="p-8">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} fontWeight="900" label={{ value: "Years", position: "insideBottom", offset: -5, fill: "#94a3b8", fontSize: 10, fontWeight: "900" }} />
                    <YAxis stroke="#94a3b8" fontSize={10} fontWeight="900" tickFormatter={(v) => formatMoney(v)} />
                    <Tooltip
                      cursor={{ stroke: '#f97316', strokeWidth: 2 }}
                      formatter={(value: any) => formatFullMoney(Number(value) || 0)}
                      contentStyle={{ backgroundColor: "#fff", border: "none", borderRadius: "1.5rem", boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', color: "#0f172a", fontSize: '12px', fontWeight: '900' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#colorValue)" name="Portfolio Value" />
                    <Area type="monotone" dataKey="invested" stroke="#3b82f6" strokeWidth={3} fill="url(#colorInvested)" name="Amount Invested" />
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.05}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Breakdown & Analysis */}
          <div className="grid gap-6 md:grid-cols-2">
            {state.mode !== "swp" && (
              <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic mb-6">Return Distribution</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        formatter={(v: any) => formatFullMoney(Number(v) || 0)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-black uppercase text-slate-400 italic">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      Invested
                    </div>
                    <span className="font-black text-slate-900">{formatFullMoney(results.totalInvested)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-black uppercase text-slate-400 italic">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      Yield
                    </div>
                    <span className="font-black text-emerald-600">{formatFullMoney(results.wealthGained)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic mb-6">Tax Estimation (LTCG)</h3>
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-100/50">
                   <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Applicable Tax</p>
                   <p className="text-2xl font-black text-amber-700 italic tracking-tighter">{formatFullMoney(results.ltcgTax)}</p>
                   <p className="text-[9px] font-bold text-amber-600/60 mt-1 uppercase leading-tight">12.5% on gains exceeding ₹1.25L annually</p>
                </div>
                <div className="p-5 rounded-2xl bg-violet-50 border-2 border-violet-100/50">
                   <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest mb-1">Estimated Post-Tax</p>
                   <p className="text-2xl font-black text-violet-700 italic tracking-tighter">{formatFullMoney(results.postTaxValue)}</p>
                   <p className="text-[9px] font-bold text-violet-600/60 mt-1 uppercase">Actual value after LTCG</p>
                </div>
              </div>
            </div>
          </div>

          {/* Goal Planning Tool */}
          {state.mode === "sip" && (
            <div className="rounded-[2.5rem] border-2 border-orange-500 bg-white p-8 shadow-xl">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-orange-200 shadow-lg">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">Reverse Goal Planner</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Define Target Corpus</p>
                </div>
              </div>
              <GoalCalculator expectedReturn={state.expectedReturn} years={state.years} stepUp={state.stepUpPercent} />
            </div>
          )}

          {/* Alert */}
          <div className="flex items-start gap-4 rounded-3xl border-2 border-amber-100 bg-amber-50/50 p-6">
            <Info className="h-5 w-5 shrink-0 text-amber-600" />
            <div className="text-xs text-slate-600 font-medium leading-relaxed">
              <p className="font-black text-slate-900 uppercase tracking-tight italic">Regulatory Note</p>
              <p className="mt-1">
                Mutual fund investments are subject to market risks. Returns are illustrative based on current tax laws (12.5% LTCG, 20% STCG). Verified for 2026.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalCalculator({ expectedReturn, years, stepUp }: { expectedReturn: number; years: number; stepUp: number }) {
  const [targetAmount, setTargetAmount] = useState(10000000);
  
  const monthlyNeeded = useMemo(() => {
    const r = expectedReturn / 100 / 12;
    const n = years * 12;
    
    if (stepUp > 0) {
      const avgMultiplier = (1 + Math.pow(1 + stepUp / 100, years - 1)) / 2;
      const flatNeeded = targetAmount / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
      return Math.round(flatNeeded / avgMultiplier);
    }
    
    return Math.round(targetAmount / (((Math.pow(1 + r, n) - 1) / r) * (1 + r)));
  }, [targetAmount, expectedReturn, years, stepUp]);

  return (
    <div className="grid gap-6 md:grid-cols-2 items-end">
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Target Corpus (₹)</label>
        <div className="relative group">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-black text-slate-300">₹</span>
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(Number(e.target.value))}
            className="block w-full rounded-2xl border-2 border-slate-100 bg-slate-50 pl-10 pr-5 py-4 text-xl font-black text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none transition-all"
          />
        </div>
      </div>
      <div className="p-6 rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-100">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2 text-center">Monthly SIP Needed</p>
        <p className="text-3xl font-black text-center italic tracking-tighter">₹{monthlyNeeded.toLocaleString("en-IN")}</p>
        <p className="text-[9px] font-bold text-center mt-2 uppercase opacity-60">to reach {formatMoney(targetAmount)} in {years}Y</p>
      </div>
    </div>
  );
}
