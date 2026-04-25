"use client";

import React, { useState, useMemo } from "react";
import {
  MapPin,
  Home,
  DollarSign,
  Users,
  Globe,
  Calculator,
  TrendingUp,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type StateKey = "nsw" | "vic" | "qld" | "wa" | "sa" | "tas" | "act" | "nt";
type PropertyType = "established" | "new" | "land" | "investment";
type BuyerType = "fhb" | "owner" | "investor" | "foreign";

interface CalculatorState {
  state: StateKey;
  propertyPrice: number;
  propertyType: PropertyType;
  buyerType: BuyerType;
  isFirstHome: boolean;
  isForeign: boolean;
}

const initialState: CalculatorState = {
  state: "nsw",
  propertyPrice: 750000,
  propertyType: "established",
  buyerType: "owner",
  isFirstHome: false,
  isForeign: false,
};

const STATES: Record<StateKey, { label: string; flag: string }> = {
  nsw: { label: "New South Wales", flag: "🇳🇸🇼" },
  vic: { label: "Victoria", flag: "🇻🇮🇨" },
  qld: { label: "Queensland", flag: "🇶🇱🇩" },
  wa: { label: "Western Australia", flag: "🇼🇦" },
  sa: { label: "South Australia", flag: "🇸🇦" },
  tas: { label: "Tasmania", flag: "🇹🇦🇸" },
  act: { label: "Australian Capital Territory", flag: "🇦🇨🇹" },
  nt: { label: "Northern Territory", flag: "🇳🇹" },
};

function calculateStampDuty(state: StateKey, price: number): number {
  switch (state) {
    case "nsw": {
      if (price <= 37000) return price * 0.0125;
      if (price <= 99000) return 512 + (price - 37000) * 0.0175;
      if (price <= 372000) return 1597 + (price - 99000) * 0.035;
      if (price <= 1240000) return 11152 + (price - 372000) * 0.045;
      if (price <= 3400000) return 50212 + (price - 1240000) * 0.055;
      return 170212 + (price - 3400000) * 0.07; // Premium property duty
    }
    case "vic": {
      if (price <= 25000) return price * 0.014;
      if (price <= 130000) return 350 + (price - 25000) * 0.024;
      if (price <= 960000) return 2870 + (price - 130000) * 0.06;
      if (price <= 2000000) return price * 0.055;
      return 110000 + (price - 2000000) * 0.065;
    }
    case "qld": {
      if (price <= 5000) return 0;
      if (price <= 75000) return (price - 5000) * 0.015;
      if (price <= 540000) return 1050 + (price - 75000) * 0.035;
      if (price <= 1000000) return 17325 + (price - 540000) * 0.045;
      return 38025 + (price - 1000000) * 0.0575;
    }
    case "wa": {
      if (price <= 120000) return price * 0.019;
      if (price <= 150000) return 2280 + (price - 120000) * 0.0325;
      if (price <= 360000) return 3255 + (price - 150000) * 0.038;
      if (price <= 725000) return 11235 + (price - 360000) * 0.0475;
      return 28453 + (price - 725000) * 0.0515;
    }
    case "sa": {
      if (price <= 50000) return price * 0.01;
      if (price <= 100000) return 1080 + (price - 50000) * 0.035;
      if (price <= 200000) return 2830 + (price - 100000) * 0.04;
      if (price <= 250000) return 6830 + (price - 200000) * 0.0425;
      if (price <= 300000) return 8955 + (price - 250000) * 0.0475;
      if (price <= 500000) return 11330 + (price - 300000) * 0.05;
      return 21330 + (price - 500000) * 0.055;
    }
    case "tas": {
      if (price <= 3000) return 50;
      if (price <= 25000) return 50 + (price - 3000) * 0.0175;
      if (price <= 75000) return 435 + (price - 25000) * 0.0225;
      if (price <= 200000) return 1560 + (price - 75000) * 0.035;
      if (price <= 375000) return 5935 + (price - 200000) * 0.04;
      if (price <= 725000) return 12935 + (price - 375000) * 0.0425;
      return 27810 + (price - 725000) * 0.045;
    }
    case "act": {
      // Simplified ACT owner-occupier brackets
      if (price <= 260000) return price * 0.006;
      if (price <= 455000) return 1560 + (price - 260000) * 0.022;
      if (price <= 585000) return 5850 + (price - 455000) * 0.034;
      if (price <= 740000) return 10270 + (price - 585000) * 0.0432;
      if (price <= 1455000) return 16966 + (price - 740000) * 0.059;
      return 59151 + (price - 1455000) * 0.055;
    }
    case "nt": {
      if (price <= 525000) {
        const v = price / 1000;
        return 0.06571441 * v * v + 15 * v;
      }
      if (price <= 3000000) return price * 0.0495;
      if (price <= 5000000) return price * 0.0575;
      return price * 0.0595;
    }
  }
}

function calculateFHBConcession(state: StateKey, price: number, propertyType: PropertyType): number {
  const baseDuty = calculateStampDuty(state, price);
  
  switch (state) {
    case "nsw": {
      if (price <= 800000) return baseDuty; // Full exemption
      if (price <= 1000000) {
        const concessionRate = (1000000 - price) / 200000;
        return baseDuty * (1 - concessionRate);
      }
      return 0;
    }
    case "vic": {
      if (price <= 600000) return baseDuty;
      if (price <= 750000) {
        const concessionRate = (750000 - price) / 150000;
        return baseDuty * (1 - concessionRate);
      }
      return 0;
    }
    case "qld": {
      if (propertyType === "new") return baseDuty; // No cap for new builds
      if (price <= 700000) return baseDuty;
      if (price <= 800000) {
        const concessionRate = (800000 - price) / 100000;
        return baseDuty * (1 - concessionRate);
      }
      return 0;
    }
    case "wa": {
      if (price <= 500000) return baseDuty;
      if (price <= 700000) {
        const concessionRate = (700000 - price) / 200000;
        return baseDuty * (1 - concessionRate);
      }
      return 0;
    }
    case "sa": {
      if (propertyType === "new" && price <= 650000) return baseDuty;
      return 0;
    }
    case "tas": {
      if (price <= 750000) return baseDuty;
      return 0;
    }
    case "act": {
      if (price <= 1020000) return baseDuty;
      if (price <= 1455000) {
        const concessionRate = (1455000 - price) / 435000;
        return baseDuty * (1 - concessionRate);
      }
      return 0;
    }
    case "nt": {
      return 0; // No FHB stamp duty concession
    }
  }
}

function getForeignSurcharge(state: StateKey): number {
  switch (state) {
    case "nsw": return 0.08;
    case "vic": return 0.08;
    case "qld": return 0.08;
    case "wa": return 0.07;
    case "sa": return 0.07;
    case "tas": return 0.08;
    case "act": return 0;
    case "nt": return 0;
  }
}

function getFees(state: StateKey): { transfer: number; mortgage: number } {
  switch (state) {
    case "nsw": return { transfer: 137, mortgage: 214 };
    case "vic": return { transfer: 1403, mortgage: 600 };
    case "qld": return { transfer: 1925, mortgage: 100 };
    case "wa": return { transfer: 295, mortgage: 187 };
    case "sa": return { transfer: 3124, mortgage: 176 };
    case "tas": return { transfer: 215, mortgage: 135 };
    case "act": return { transfer: 657, mortgage: 0 };
    case "nt": return { transfer: 149, mortgage: 149 };
  }
}

function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function StampDutyCalculatorClient() {
  const [state, setState] = useState<CalculatorState>(initialState);
  const [showComparison, setShowComparison] = useState(false);

  const results = useMemo(() => {
    const baseDuty = calculateStampDuty(state.state, state.propertyPrice);
    const fhbSaving = state.buyerType === "fhb" ? calculateFHBConcession(state.state, state.propertyPrice, state.propertyType) : 0;
    const dutyAfterFHB = baseDuty - fhbSaving;
    const foreignSurcharge = state.isForeign ? state.propertyPrice * getForeignSurcharge(state.state) : 0;
    const totalDuty = Math.max(0, dutyAfterFHB + foreignSurcharge);
    const fees = getFees(state.state);
    const totalUpfront = totalDuty + fees.transfer + fees.mortgage;
    const effectiveRate = state.propertyPrice > 0 ? (totalDuty / state.propertyPrice) * 100 : 0;

    return { baseDuty, fhbSaving, dutyAfterFHB, foreignSurcharge, totalDuty, fees, totalUpfront, effectiveRate };
  }, [state]);

  const comparisonData = useMemo(() => {
    return (Object.keys(STATES) as StateKey[]).map((s) => {
      const base = calculateStampDuty(s, state.propertyPrice);
      const fhb = state.buyerType === "fhb" ? calculateFHBConcession(s, state.propertyPrice, state.propertyType) : 0;
      const foreign = state.isForeign ? state.propertyPrice * getForeignSurcharge(s) : 0;
      const total = Math.max(0, base - fhb + foreign);
      const f = getFees(s);
      return {
        state: STATES[s].label,
        short: s.toUpperCase(),
        duty: total,
        total: total + f.transfer + f.mortgage,
        isCurrent: s === state.state,
      };
    }).sort((a, b) => a.total - b.total);
  }, [state]);

  const handleChange = <K extends keyof CalculatorState>(field: K, value: CalculatorState[K]) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-premium">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Property Details</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Configuration</p>
              </div>
            </div>

            {/* State */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <MapPin className="h-3 w-3 text-emerald-500" />
                State / Territory
              </label>
              <div className="relative">
                <select
                  value={state.state}
                  onChange={(e) => handleChange("state", e.target.value as StateKey)}
                  className="block w-full appearance-none rounded-2xl border-2 border-slate-100 bg-white px-5 py-4 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:outline-none transition-all cursor-pointer"
                >
                  {Object.entries(STATES).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.flag} {val.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Price */}
            <div className="mt-6 space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <DollarSign className="h-3 w-3 text-emerald-500" />
                Property Price
              </label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-black text-slate-300 group-focus-within:text-emerald-500 transition-colors">$</span>
                <input
                  type="number"
                  value={state.propertyPrice || ""}
                  onChange={(e) => handleChange("propertyPrice", Number(e.target.value))}
                  className="block w-full rounded-2xl border-2 border-slate-100 bg-white pl-10 pr-5 py-4 text-xl font-black text-slate-900 focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-200"
                  placeholder="750000"
                />
              </div>
            </div>

            {/* Property Type */}
            <div className="mt-6 space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <Home className="h-3 w-3 text-emerald-500" />
                Property Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "established", label: "Established" },
                  { value: "new", label: "New Build" },
                  { value: "land", label: "Vacant Land" },
                  { value: "investment", label: "Investment" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleChange("propertyType", opt.value as PropertyType)}
                    className={`rounded-xl border-2 px-4 py-3 text-xs font-black uppercase tracking-tighter transition-all ${
                      state.propertyType === opt.value
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Buyer Type */}
            <div className="mt-6 space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <Users className="h-3 w-3 text-emerald-500" />
                Buyer Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "owner", label: "Owner-Occ" },
                  { value: "fhb", label: "First Home" },
                  { value: "investor", label: "Investor" },
                  { value: "foreign", label: "Foreign" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      handleChange("buyerType", opt.value as BuyerType);
                      handleChange("isFirstHome", opt.value === "fhb");
                      handleChange("isForeign", opt.value === "foreign");
                    }}
                    className={`rounded-xl border-2 px-4 py-3 text-xs font-black uppercase tracking-tighter transition-all ${
                      state.buyerType === opt.value
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Foreign toggle */}
            {(state.buyerType === "owner" || state.buyerType === "investor" || state.buyerType === "fhb") && (
              <label className="mt-6 flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 text-xs font-bold text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={state.isForeign}
                  onChange={(e) => handleChange("isForeign", e.target.checked)}
                  className="h-5 w-5 rounded-lg border-2 border-slate-200 bg-white text-emerald-500 focus:ring-emerald-500 transition-all"
                />
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-emerald-500" />
                  <span>Foreign purchaser surcharge applies</span>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Stamp Duty", value: formatMoney(results.totalDuty), color: "text-rose-600", sub: `${results.effectiveRate.toFixed(2)}% effective` },
              { label: "Govt Fees", value: formatMoney(results.fees.transfer + results.fees.mortgage), color: "text-amber-600", sub: "transfer + mortgage" },
              { label: "Total Upfront", value: formatMoney(results.totalUpfront), color: "text-emerald-600", sub: "duty + fees" },
              { label: "FHB Saving", value: results.fhbSaving > 0 ? formatMoney(results.fhbSaving) : "$0", color: "text-blue-600", sub: results.fhbSaving > 0 ? "You save!" : "Not eligible" },
            ].map((stat, i) => (
              <div key={i} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col items-center text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
                <p className={`text-xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</p>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Breakdown Ledger */}
          <div className="rounded-[2.5rem] border-2 border-slate-900 bg-white overflow-hidden shadow-xl">
            <div className="bg-slate-900 px-8 py-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Detailed Ledger</p>
                <p className="text-sm font-bold text-white italic">{STATES[state.state].label}</p>
              </div>
              <Info className="w-5 h-5 text-white/20" />
            </div>
            <div className="divide-y divide-slate-100">
              <div className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Base Stamp Duty</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5 italic">Standard Transfer Rate</p>
                </div>
                <p className="text-lg font-black text-slate-900 tabular-nums">{formatMoney(results.baseDuty)}</p>
              </div>

              {results.fhbSaving > 0 && (
                <div className="px-8 py-5 flex items-center justify-between bg-emerald-50/30">
                  <div>
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">FHB Concession</p>
                    <p className="text-[10px] font-bold text-emerald-500/60 mt-0.5 italic">First Home Buyer Scheme</p>
                  </div>
                  <p className="text-lg font-black text-emerald-600 tabular-nums">−{formatMoney(results.fhbSaving)}</p>
                </div>
              )}

              {results.foreignSurcharge > 0 && (
                <div className="px-8 py-5 flex items-center justify-between bg-rose-50/30">
                  <div>
                    <p className="text-xs font-black text-rose-600 uppercase tracking-widest">Foreign Surcharge</p>
                    <p className="text-[10px] font-bold text-rose-500/60 mt-0.5 italic">{(getForeignSurcharge(state.state) * 100).toFixed(0)}% Additional Duty</p>
                  </div>
                  <p className="text-lg font-black text-rose-600 tabular-nums">+{formatMoney(results.foreignSurcharge)}</p>
                </div>
              )}

              <div className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Registration Fees</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5 italic">Transfer + Mortgage Lodgement</p>
                </div>
                <p className="text-lg font-black text-slate-900 tabular-nums">{formatMoney(results.fees.transfer + results.fees.mortgage)}</p>
              </div>

              <div className="px-8 py-8 flex items-center justify-between bg-slate-50">
                <div>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Total Upfront Cost</p>
                  <p className="text-xs text-slate-400 font-bold mt-1">Payable at or before settlement</p>
                </div>
                <p className="text-4xl font-black text-emerald-600 italic tracking-tighter">
                  {formatMoney(results.totalUpfront)}
                </p>
              </div>
            </div>
          </div>

          {/* State Comparison */}
          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">State Comparison</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">National Benchmarking</p>
              </div>
              <button
                type="button"
                onClick={() => setShowComparison(!showComparison)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all"
              >
                {showComparison ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showComparison ? "Hide" : "Show Analytics"}
              </button>
            </div>
            
            {showComparison && (
              <div className="animate-in fade-in duration-500">
                <div className="h-72 mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                      <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} stroke="#94a3b8" fontSize={10} fontWeight="900" />
                      <YAxis type="category" dataKey="short" stroke="#64748b" fontSize={10} fontWeight="900" width={40} />
                      <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        formatter={(value: any) => formatMoney(Number(value) || 0)}
                        contentStyle={{ backgroundColor: "#fff", border: "none", borderRadius: "1.5rem", boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', color: "#0f172a", fontSize: '12px', fontWeight: '900' }}
                      />
                      <Bar dataKey="total" radius={[0, 10, 10, 0]}>
                        {comparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.isCurrent ? "#10b981" : "#e2e8f0"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {comparisonData.map((d) => (
                    <div
                      key={d.short}
                      className={`flex items-center justify-between rounded-2xl px-5 py-4 text-xs transition-all ${
                        d.isCurrent ? "bg-emerald-50 border-2 border-emerald-500/20" : "bg-slate-50 border-2 border-transparent"
                      }`}
                    >
                      <span className={`font-black uppercase tracking-tighter italic ${d.isCurrent ? "text-emerald-700" : "text-slate-500"}`}>
                        {d.state}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className={`font-black tabular-nums ${d.isCurrent ? "text-emerald-600" : "text-slate-900"}`}>
                          {formatMoney(d.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Logic Warnings / Eligibility */}
          <div className="grid gap-4">
             {state.buyerType === "fhb" && (
              <div className={`rounded-3xl border-2 p-6 shadow-sm flex items-start gap-4 ${
                results.fhbSaving > 0 ? "border-emerald-100 bg-emerald-50/50" : "border-amber-100 bg-amber-50/50"
              }`}>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black ${
                  results.fhbSaving > 0 ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                }`}>
                  {results.fhbSaving > 0 ? "✓" : "!"}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">FHB Eligibility Result</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                    {results.fhbSaving > 0 
                      ? `Great news! You qualify for a ${formatMoney(results.fhbSaving)} concession in ${STATES[state.state].label}.`
                      : `You may not qualify for exemptions in ${STATES[state.state].label} at this price point.`}
                  </p>
                </div>
              </div>
            )}

            {state.isForeign && getForeignSurcharge(state.state) > 0 && (
              <div className="rounded-3xl border-2 border-rose-100 bg-rose-50/50 p-6 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 font-black">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">Foreign Buyer Alert</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                    An additional {(getForeignSurcharge(state.state) * 100).toFixed(0)}% surcharge has been applied. 
                    This adds {formatMoney(results.foreignSurcharge)} to your total duty.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
