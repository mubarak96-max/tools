"use client";

import React, { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calculator,
  TrendingUp,
  DollarSign,
  Users,
  Percent,
  AlertTriangle,
  Info,
  Download,
} from "lucide-react";

type RoundType = "priced" | "safe" | "convertible" | "optionPool";

interface FundingRound {
  id: string;
  name: string;
  type: RoundType;
  investment: number;
  preMoney: number;
  optionPoolPercent: number;
  optionPoolTiming: "pre" | "post";
  safeCap?: number;
  safeDiscount?: number;
  noteInterest?: number;
  noteCap?: number;
  noteDiscount?: number;
  antiDilution: "none" | "weighted" | "fullRatchet";
}

interface Shareholder {
  name: string;
  shares: number;
  type: "founder" | "investor" | "optionPool" | "safe" | "convertible";
}

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"];

function formatMoney(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n.toFixed(0)}`;
}

function formatPercent(n: number): string {
  return `${n.toFixed(2)}%`;
}

export function EquityDilutionCalculatorClient() {
  const [initialShares, setInitialShares] = useState(10_000_000);
  const [founderSplit, setFounderSplit] = useState(100);
  const [initialOptionPool, setInitialOptionPool] = useState(10);
  const [rounds, setRounds] = useState<FundingRound[]>([
    {
      id: "1",
      name: "Seed Round",
      type: "priced",
      investment: 2_000_000,
      preMoney: 8_000_000,
      optionPoolPercent: 15,
      optionPoolTiming: "pre",
      antiDilution: "none",
    },
    {
      id: "2",
      name: "Series A",
      type: "priced",
      investment: 10_000_000,
      preMoney: 40_000_000,
      optionPoolPercent: 15,
      optionPoolTiming: "pre",
      antiDilution: "none",
    },
  ]);

  const [expandedRound, setExpandedRound] = useState<string | null>("1");
  const [activeTab, setActiveTab] = useState<"capTable" | "waterfall" | "timeline">("capTable");

  const addRound = () => {
    const newRound: FundingRound = {
      id: Date.now().toString(),
      name: `Round ${rounds.length + 1}`,
      type: "priced",
      investment: 5_000_000,
      preMoney: 20_000_000,
      optionPoolPercent: 10,
      optionPoolTiming: "pre",
      antiDilution: "none",
    };
    setRounds([...rounds, newRound]);
    setExpandedRound(newRound.id);
  };

  const removeRound = (id: string) => {
    setRounds(rounds.filter((r) => r.id !== id));
  };

  const updateRound = (id: string, field: keyof FundingRound, value: any) => {
    setRounds(rounds.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  // Core dilution math
  const capTableHistory = useMemo(() => {
    let shares = initialShares;
    let founderShares = shares * (founderSplit / 100);
    let optionPoolShares = shares * (initialOptionPool / 100);
    let otherShares = shares - founderShares - optionPoolShares;

    const history: {
      round: string;
      totalShares: number;
      founderPct: number;
      optionPoolPct: number;
      otherPct: number;
      postMoney: number;
      newInvestors: { name: string; shares: number; pct: number }[];
    }[] = [];

    const initialEntry = {
      round: "Initial",
      totalShares: shares,
      founderPct: (founderShares / shares) * 100,
      optionPoolPct: (optionPoolShares / shares) * 100,
      otherPct: (otherShares / shares) * 100,
      postMoney: 0,
      newInvestors: [] as { name: string; shares: number; pct: number }[],
    };
    history.push(initialEntry);

    rounds.forEach((round) => {
      const newInvestors: { name: string; shares: number; pct: number }[] = [];

      if (round.type === "priced") {
        // Option pool expansion
        if (round.optionPoolPercent > 0) {
          const targetOptionPool = round.optionPoolPercent / 100;

          if (round.optionPoolTiming === "pre") {
            // Pre-money: dilute existing only
            const additionalOptionShares = (targetOptionPool * shares - optionPoolShares) / (1 - targetOptionPool);
            if (additionalOptionShares > 0) {
              shares += additionalOptionShares;
              optionPoolShares += additionalOptionShares;
              // Simpler: all existing shareholders diluted proportionally
              const dilutionFactor = (shares - additionalOptionShares) / shares;
              founderShares *= dilutionFactor;
              otherShares *= dilutionFactor;
              optionPoolShares = shares * targetOptionPool;
            }
          } else {
            // Post-money: dilute everyone including new investor
            const additionalOptionShares = targetOptionPool * shares - optionPoolShares;
            if (additionalOptionShares > 0) {
              shares += additionalOptionShares;
              optionPoolShares += additionalOptionShares;
              const dilutionFactor = (shares - additionalOptionShares) / shares;
              founderShares *= dilutionFactor;
              otherShares *= dilutionFactor;
            }
          }
        }

        // Investment
        const pricePerShare = round.preMoney / shares;
        const investorShares = round.investment / pricePerShare;
        shares += investorShares;
        newInvestors.push({
          name: round.name,
          shares: investorShares,
          pct: (investorShares / shares) * 100,
        });

        // Founder dilution from investment
        const dilutionFactor = (shares - investorShares) / shares;
        founderShares *= dilutionFactor;
        optionPoolShares *= dilutionFactor;
        otherShares *= dilutionFactor;
      }

      if (round.type === "safe") {
        const cap = round.safeCap || round.preMoney;
        const discount = round.safeDiscount || 0;
        const effectiveValuation = Math.min(cap, round.preMoney * (1 - discount / 100));
        const pricePerShare = effectiveValuation / shares;
        const investorShares = round.investment / pricePerShare;
        shares += investorShares;
        newInvestors.push({
          name: `${round.name} (SAFE)`,
          shares: investorShares,
          pct: (investorShares / shares) * 100,
        });

        const dilutionFactor = (shares - investorShares) / shares;
        founderShares *= dilutionFactor;
        optionPoolShares *= dilutionFactor;
        otherShares *= dilutionFactor;
      }

      if (round.type === "convertible") {
        const interest = round.noteInterest || 0;
        const totalAmount = round.investment * (1 + interest / 100);
        const cap = round.noteCap || round.preMoney;
        const discount = round.noteDiscount || 0;
        const effectiveValuation = Math.min(cap, round.preMoney * (1 - discount / 100));
        const pricePerShare = effectiveValuation / shares;
        const investorShares = totalAmount / pricePerShare;
        shares += investorShares;
        newInvestors.push({
          name: `${round.name} (Note)`,
          shares: investorShares,
          pct: (investorShares / shares) * 100,
        });

        const dilutionFactor = (shares - investorShares) / shares;
        founderShares *= dilutionFactor;
        optionPoolShares *= dilutionFactor;
        otherShares *= dilutionFactor;
      }

      if (round.type === "optionPool") {
        const targetOptionPool = round.optionPoolPercent / 100;
        const additionalShares = (targetOptionPool * shares - optionPoolShares) / (1 - targetOptionPool);
        if (additionalShares > 0) {
          shares += additionalShares;
          optionPoolShares += additionalShares;
          const dilutionFactor = (shares - additionalShares) / shares;
          founderShares *= dilutionFactor;
          otherShares *= dilutionFactor;
        }
      }

      history.push({
        round: round.name,
        totalShares: shares,
        founderPct: (founderShares / shares) * 100,
        optionPoolPct: (optionPoolShares / shares) * 100,
        otherPct: (otherShares / shares) * 100,
        postMoney: round.preMoney + round.investment,
        newInvestors,
      });
    });

    return history;
  }, [initialShares, founderSplit, initialOptionPool, rounds]);

  const finalState = capTableHistory[capTableHistory.length - 1];

  const pieData = [
    { name: "Founders", value: finalState.founderPct, color: "#6366f1" },
    { name: "Option Pool", value: finalState.optionPoolPct, color: "#f59e0b" },
    { name: "Other Investors", value: finalState.otherPct, color: "#10b981" },
  ];

  const timelineData = capTableHistory.map((h) => ({
    round: h.round,
    founders: h.founderPct,
    optionPool: h.optionPoolPct,
    other: h.otherPct,
  }));

  const waterfallData = [
    { name: "Initial", founders: 100, investors: 0, options: initialOptionPool },
    ...rounds.map((r, i) => {
      const h = capTableHistory[i + 1];
      return {
        name: r.name,
        founders: h.founderPct,
        investors: h.newInvestors.reduce((sum, n) => sum + n.pct, 0),
        options: h.optionPoolPct,
      };
    }),
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Initial Setup */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium border border-slate-200">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                <Calculator className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Initial Setup</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Initial Shares Outstanding</label>
                <input
                  type="number"
                  value={initialShares}
                  onChange={(e) => setInitialShares(Number(e.target.value))}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Founder Ownership (%)</label>
                <input
                  type="number"
                  value={founderSplit}
                  onChange={(e) => setFounderSplit(Number(e.target.value))}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none"
                  min={0}
                  max={100}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Initial Option Pool (%)</label>
                <input
                  type="number"
                  value={initialOptionPool}
                  onChange={(e) => setInitialOptionPool(Number(e.target.value))}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none"
                  min={0}
                  max={100}
                />
              </div>
            </div>
          </div>

          {/* Rounds */}
          <div className="space-y-3">
            {rounds.map((round) => (
              <div key={round.id} className="rounded-2xl border border-slate-200 bg-white shadow-xl backdrop-blur overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpandedRound(expandedRound === round.id ? null : round.id)}
                      className="text-slate-500 hover:text-white"
                    >
                      {expandedRound === round.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <input
                      value={round.name}
                      onChange={(e) => updateRound(round.id, "name", e.target.value)}
                      className="bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
                    />
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      round.type === "priced" ? "bg-blue-100 text-blue-700" :
                      round.type === "safe" ? "bg-emerald-100 text-emerald-700" :
                      round.type === "convertible" ? "bg-amber-100 text-amber-700" :
                      "bg-violet-100 text-violet-700"
                    }`}>
                      {round.type === "priced" ? "Priced" : round.type === "safe" ? "SAFE" : round.type === "convertible" ? "Note" : "ESOP"}
                    </span>
                  </div>
                  <button onClick={() => removeRound(round.id)} className="text-slate-500 hover:text-rose-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {expandedRound === round.id && (
                  <div className="space-y-4 border-t border-slate-200 px-5 py-4">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => updateRound(round.id, "type", "priced")}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium ${round.type === "priced" ? "border-blue-500 bg-blue-100 text-blue-700" : "border-slate-200 text-slate-500"}`}
                      >
                        Priced Round
                      </button>
                      <button
                        onClick={() => updateRound(round.id, "type", "safe")}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium ${round.type === "safe" ? "border-emerald-500 bg-emerald-100 text-emerald-700" : "border-slate-200 text-slate-500"}`}
                      >
                        SAFE
                      </button>
                      <button
                        onClick={() => updateRound(round.id, "type", "convertible")}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium ${round.type === "convertible" ? "border-amber-500 bg-amber-100 text-amber-700" : "border-slate-200 text-slate-500"}`}
                      >
                        Convertible Note
                      </button>
                      <button
                        onClick={() => updateRound(round.id, "type", "optionPool")}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium ${round.type === "optionPool" ? "border-violet-500 bg-violet-100 text-violet-700" : "border-slate-200 text-slate-500"}`}
                      >
                        Option Pool Only
                      </button>
                    </div>

                    {(round.type === "priced" || round.type === "safe" || round.type === "convertible") && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600">Investment Amount</label>
                        <input
                          type="number"
                          value={round.investment}
                          onChange={(e) => updateRound(round.id, "investment", Number(e.target.value))}
                          className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    )}

                    {(round.type === "priced" || round.type === "safe" || round.type === "convertible") && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600">Pre-Money Valuation</label>
                        <input
                          type="number"
                          value={round.preMoney}
                          onChange={(e) => updateRound(round.id, "preMoney", Number(e.target.value))}
                          className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    )}

                    {round.type === "safe" && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600">Valuation Cap</label>
                          <input
                            type="number"
                            value={round.safeCap || ""}
                            onChange={(e) => updateRound(round.id, "safeCap", Number(e.target.value))}
                            className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                            placeholder="Same as pre-money"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600">Discount (%)</label>
                          <input
                            type="number"
                            value={round.safeDiscount || ""}
                            onChange={(e) => updateRound(round.id, "safeDiscount", Number(e.target.value))}
                            className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                            placeholder="20"
                          />
                        </div>
                      </>
                    )}

                    {round.type === "convertible" && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600">Interest Rate (%)</label>
                          <input
                            type="number"
                            value={round.noteInterest || ""}
                            onChange={(e) => updateRound(round.id, "noteInterest", Number(e.target.value))}
                            className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                            placeholder="6"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600">Valuation Cap</label>
                          <input
                            type="number"
                            value={round.noteCap || ""}
                            onChange={(e) => updateRound(round.id, "noteCap", Number(e.target.value))}
                            className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600">Discount (%)</label>
                          <input
                            type="number"
                            value={round.noteDiscount || ""}
                            onChange={(e) => updateRound(round.id, "noteDiscount", Number(e.target.value))}
                            className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                            placeholder="20"
                          />
                        </div>
                      </>
                    )}

                    {(round.type === "priced" || round.type === "optionPool") && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600">Target Option Pool (%)</label>
                          <input
                            type="number"
                            value={round.optionPoolPercent}
                            onChange={(e) => updateRound(round.id, "optionPoolPercent", Number(e.target.value))}
                            className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => updateRound(round.id, "optionPoolTiming", "pre")}
                            className={`rounded-lg border px-3 py-2 text-xs font-medium ${round.optionPoolTiming === "pre" ? "border-rose-500 bg-rose-100 text-rose-700" : "border-slate-200 text-slate-500"}`}
                          >
                            Pre-Money (Dilutes Founders)
                          </button>
                          <button
                            onClick={() => updateRound(round.id, "optionPoolTiming", "post")}
                            className={`rounded-lg border px-3 py-2 text-xs font-medium ${round.optionPoolTiming === "post" ? "border-emerald-500 bg-emerald-100 text-emerald-700" : "border-slate-200 text-slate-500"}`}
                          >
                            Post-Money (Shared)
                          </button>
                        </div>
                      </>
                    )}

                    {round.type === "priced" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600">Anti-Dilution Protection</label>
                        <select
                          value={round.antiDilution}
                          onChange={(e) => updateRound(round.id, "antiDilution", e.target.value)}
                          className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="none">None</option>
                          <option value="weighted">Weighted Average</option>
                          <option value="fullRatchet">Full Ratchet</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={addRound}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 py-4 text-sm font-medium text-slate-500 hover:border-indigo-500 hover:text-indigo-600"
            >
              <Plus className="h-4 w-4" />
              Add Funding Round
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 rounded-xl border border-slate-200 bg-white p-1">
            {[
              { key: "capTable", label: "Cap Table", icon: Users },
              { key: "waterfall", label: "Ownership Waterfall", icon: TrendingUp },
              { key: "timeline", label: "Dilution Timeline", icon: Percent },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    activeTab === tab.key
                      ? "bg-indigo-500/10 text-indigo-600"
                      : "text-slate-500 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Final Ownership Card */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xl">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Founders</p>
              <p className="mt-2 text-3xl font-bold text-indigo-600">{formatPercent(finalState.founderPct)}</p>
              <p className="text-xs text-slate-500">{formatMoney(finalState.totalShares * (finalState.founderPct / 100) * (rounds[rounds.length - 1]?.preMoney || 1) / (finalState.totalShares || 1))} value</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xl">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Option Pool</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">{formatPercent(finalState.optionPoolPct)}</p>
              <p className="text-xs text-slate-500">for employees</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xl">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Investors</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">{formatPercent(100 - finalState.founderPct - finalState.optionPoolPct)}</p>
              <p className="text-xs text-slate-500">all rounds combined</p>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "capTable" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium border border-slate-200">
              <h3 className="mb-4 text-lg font-bold text-slate-900">Final Cap Table</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `${value.toFixed(2)}%`}
                      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#0f172a" }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total Shares Outstanding</span>
                  <span className="font-medium text-slate-900">{finalState.totalShares.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Founder Shares</span>
                  <span className="font-medium text-indigo-600">{Math.round(finalState.totalShares * finalState.founderPct / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Option Pool Shares</span>
                  <span className="font-medium text-amber-600">{Math.round(finalState.totalShares * finalState.optionPoolPct / 100).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "waterfall" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium border border-slate-200">
              <h3 className="mb-4 text-lg font-bold text-slate-900">Ownership Waterfall by Round</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterfallData} stackOffset="expand">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                    <Tooltip
                      formatter={(value: number) => `${value.toFixed(2)}%`}
                      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#0f172a" }}
                    />
                    <Bar dataKey="founders" stackId="a" fill="#6366f1" name="Founders" />
                    <Bar dataKey="options" stackId="a" fill="#f59e0b" name="Option Pool" />
                    <Bar dataKey="investors" stackId="a" fill="#10b981" name="Investors" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium border border-slate-200">
              <h3 className="mb-4 text-lg font-bold text-slate-900">Founder Dilution Timeline</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="round" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      formatter={(value: number) => `${value.toFixed(2)}%`}
                      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#0f172a" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="founders" stroke="#6366f1" strokeWidth={3} name="Founders" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="optionPool" stroke="#f59e0b" strokeWidth={2} name="Option Pool" dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="other" stroke="#10b981" strokeWidth={2} name="Other / Investors" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Round-by-Round Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium border border-slate-200">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Round-by-Round Breakdown</h3>
            <div className="space-y-3">
              {capTableHistory.map((h, i) => (
                <div key={i} className={`rounded-lg border p-4 ${i === capTableHistory.length - 1 ? "border-indigo-500/30 bg-indigo-50" : "border-slate-200 bg-slate-50"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{h.round}</span>
                    <span className="text-sm text-slate-500">{h.totalShares.toLocaleString()} shares</span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Founders</span>
                      <p className="font-medium text-indigo-600">{h.founderPct.toFixed(2)}%</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Options</span>
                      <p className="font-medium text-amber-600">{h.optionPoolPct.toFixed(2)}%</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Other</span>
                      <p className="font-medium text-emerald-600">{h.otherPct.toFixed(2)}%</p>
                    </div>
                  </div>
                  {h.newInvestors.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {h.newInvestors.map((inv, j) => (
                        <div key={j} className="flex justify-between text-xs text-slate-500">
                          <span>+ {inv.name}</span>
                          <span>{inv.pct.toFixed(2)}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Exit Calculator */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium border border-slate-200">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Exit Value Calculator</h3>
            <ExitCalculator founderPct={finalState.founderPct} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ExitCalculator({ founderPct }: { founderPct: number }) {
  const [exitValuation, setExitValuation] = useState(100_000_000);
  const [liquidationPref, setLiquidationPref] = useState(1);
  const [totalInvested, setTotalInvested] = useState(20_000_000);

  const founderProceeds = Math.max(0, exitValuation - totalInvested * liquidationPref) * (founderPct / 100);
  const investorProceeds = Math.min(exitValuation, totalInvested * liquidationPref) + Math.max(0, exitValuation - totalInvested * liquidationPref) * ((100 - founderPct - 10) / 100);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600">Exit Valuation</label>
        <input
          type="number"
          value={exitValuation}
          onChange={(e) => setExitValuation(Number(e.target.value))}
          className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Liquidation Preference (×)</label>
          <input
            type="number"
            step="0.5"
            value={liquidationPref}
            onChange={(e) => setLiquidationPref(Number(e.target.value))}
            className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Total Invested</label>
          <input
            type="number"
            value={totalInvested}
            onChange={(e) => setTotalInvested(Number(e.target.value))}
            className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-50 p-4 text-center">
          <p className="text-xs text-slate-500">Founder Proceeds</p>
          <p className="text-2xl font-bold text-indigo-600">{formatMoney(founderProceeds)}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-50 p-4 text-center">
          <p className="text-xs text-slate-500">Investor Proceeds</p>
          <p className="text-2xl font-bold text-emerald-600">{formatMoney(investorProceeds)}</p>
        </div>
      </div>
    </div>
  );
}
