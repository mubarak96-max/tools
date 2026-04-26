"use client";

import { useState, useMemo } from "react";
import {
  calculateCompoundInterest,
  fmtUSD,
  fmtShort,
  fmtPct,
  COMPOUND_FREQUENCIES,
  CONTRIBUTION_FREQUENCIES,
  type CompoundInputs,
  type CompoundFrequency,
  type ContributionFrequency,
  type ContributionTiming,
} from "@/lib/compoundInterest";

// ─── Primitives ────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-500 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-stone-400 mt-1">{hint}</p>}
    </div>
  );
}

function NumInput({
  value, onChange, prefix, suffix, min = 0, max, step = 1,
}: {
  value: number; onChange: (v: number) => void;
  prefix?: string; suffix?: string; min?: number; max?: number; step?: number;
}) {
  return (
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-stone-400 text-sm pointer-events-none">{prefix}</span>}
      <input
        type="number" value={value} min={min} max={max} step={step}
        onChange={e => onChange(Math.max(min ?? 0, Number(e.target.value)))}
        className={`w-full py-2.5 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-green-400 ${prefix ? "pl-7 pr-3" : suffix ? "pl-3 pr-8" : "px-3"}`}
      />
      {suffix && <span className="absolute right-3 text-stone-400 text-sm pointer-events-none">{suffix}</span>}
    </div>
  );
}

function SliderInput({
  value, onChange, min, max, step, label, display,
}: {
  value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; label: string; display: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-xs font-medium text-stone-500">{label}</label>
        <span className="text-sm font-semibold text-stone-800">{display}</span>
      </div>
      <input type="range" value={value} min={min} max={max} step={step}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-green-500" />
      <div className="flex justify-between text-[10px] text-stone-300 mt-0.5">
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 mt-6 first:mt-0">{children}</p>;
}

// ─── Bar chart ─────────────────────────────────────────────────────

function GrowthChart({ schedule, years }: {
  schedule: ReturnType<typeof calculateCompoundInterest>["yearlySchedule"];
  years: number;
}) {
  if (schedule.length === 0) return null;
  const maxVal = Math.max(...schedule.map(r => r.endBalance), 1);
  // Show every year if <= 20, else show every 5 years
  const step  = years <= 20 ? 1 : years <= 40 ? 2 : 5;
  const rows  = schedule.filter(r => r.year % step === 0 || r.year === years);

  return (
    <div className="space-y-1">
      {rows.map(row => {
        const principalW  = (row.totalContributions / maxVal) * 100;
        const interestW   = (row.totalInterest / maxVal) * 100;
        return (
          <div key={row.year} className="flex items-center gap-2 group">
            <span className="text-[10px] text-stone-400 w-10 text-right shrink-0">Yr {row.year}</span>
            <div className="flex-1 flex h-5 rounded overflow-hidden bg-stone-100">
              <div className="bg-green-400 h-full transition-all duration-300" style={{ width: `${principalW}%` }} title={`Deposits: ${fmtUSD(row.totalContributions)}`} />
              <div className="bg-emerald-600 h-full transition-all duration-300" style={{ width: `${interestW}%` }} title={`Interest: ${fmtUSD(row.totalInterest)}`} />
            </div>
            <span className="text-[10px] text-stone-500 w-16 text-right tabular-nums shrink-0">{fmtShort(row.endBalance)}</span>
          </div>
        );
      })}
      <div className="flex gap-4 mt-2">
        <span className="flex items-center gap-1.5 text-[10px] text-stone-400"><span className="w-3 h-3 rounded-sm bg-green-400 inline-block"/>Deposits</span>
        <span className="flex items-center gap-1.5 text-[10px] text-stone-400"><span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block"/>Interest earned</span>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────

export default function CompoundInterestCalculator() {
  // Core inputs
  const [principal,          setPrincipal]     = useState(10000);
  const [annualRate,         setAnnualRate]     = useState(7);
  const [years,              setYears]          = useState(20);
  const [compoundFreq,       setCompoundFreq]   = useState<CompoundFrequency>("monthly");

  // Contributions
  const [contribution,       setContribution]   = useState(200);
  const [contribFreq,        setContribFreq]    = useState<ContributionFrequency>("monthly");
  const [contribTiming,      setContribTiming]  = useState<ContributionTiming>("end");

  // Advanced
  const [inflationRate,      setInflationRate]  = useState(2.5);
  const [showAdvanced,       setShowAdvanced]   = useState(false);

  const [tab, setTab] = useState<"summary" | "schedule" | "monthly">("summary");

  const inputs: CompoundInputs = {
    principal,
    annualRatePercent: annualRate,
    years,
    compoundFrequency: compoundFreq,
    contributionAmount: contribution,
    contributionFrequency: contribFreq,
    contributionTiming: contribTiming,
    inflationRatePercent: inflationRate,
  };

  const result = useMemo(() => calculateCompoundInterest(inputs), [
    principal, annualRate, years, compoundFreq,
    contribution, contribFreq, contribTiming, inflationRate,
  ]);

  const interestPct = result.totalDeposited > 0
    ? (result.totalInterestEarned / (result.totalDeposited + result.totalInterestEarned)) * 100
    : 0;
  const depositPct = 100 - interestPct;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">

      {/* Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 px-5 py-4">
        <div className="flex flex-wrap gap-6 items-center">
          <div>
            <p className="text-xs text-stone-400 mb-0.5">Final balance after {years} years</p>
            <p className="text-4xl font-bold text-stone-900 leading-none">{fmtUSD(result.finalBalance)}</p>
          </div>
          <div className="h-10 w-px bg-green-200 hidden sm:block" />
          {[
            { label: "Total deposited",    value: fmtUSD(result.totalDeposited),       cls: "text-stone-700" },
            { label: "Interest earned",    value: fmtUSD(result.totalInterestEarned),  cls: "text-emerald-600" },
            { label: "Real value (adj.)",  value: fmtUSD(result.realFinalBalance),     cls: "text-stone-500" },
          ].map(m => (
            <div key={m.label}>
              <p className="text-xs text-stone-400 mb-0.5">{m.label}</p>
              <p className={`text-xl font-semibold ${m.cls}`}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Split bar */}
        <div className="mt-3">
          <div className="flex rounded-full overflow-hidden h-3">
            <div className="bg-green-400 transition-all duration-500" style={{ width: `${depositPct}%` }} title={`Deposits ${fmtPct(depositPct)}`} />
            <div className="bg-emerald-600 flex-1 transition-all duration-500" title={`Interest ${fmtPct(interestPct)}`} />
          </div>
          <div className="flex justify-between text-[10px] text-stone-400 mt-1">
            <span>Deposits {fmtPct(depositPct, 1)}</span>
            <span>Interest {fmtPct(interestPct, 1)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">

        {/* ── Inputs ──────────────────────────────────────────── */}
        <div className="border-r border-stone-100 p-5 overflow-y-auto max-h-[700px]">

          <SectionLabel>Initial investment</SectionLabel>
          <Field label="Starting amount">
            <NumInput value={principal} onChange={setPrincipal} prefix="$" step={500} />
          </Field>

          <SectionLabel>Growth settings</SectionLabel>
          <div className="space-y-4">
            <SliderInput
              label="Annual interest rate" display={`${annualRate}%`}
              value={annualRate} onChange={setAnnualRate} min={0.1} max={30} step={0.1}
            />
            <SliderInput
              label="Time period" display={`${years} years`}
              value={years} onChange={setYears} min={1} max={50} step={1}
            />
            <Field label="Compounding frequency">
              <select value={compoundFreq} onChange={e => setCompoundFreq(e.target.value as CompoundFrequency)}
                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-green-400">
                {Object.entries(COMPOUND_FREQUENCIES).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </Field>
          </div>

          <SectionLabel>Regular contributions</SectionLabel>
          <div className="space-y-3">
            <Field label="Contribution amount">
              <NumInput value={contribution} onChange={setContribution} prefix="$" step={50} />
            </Field>
            <Field label="Frequency">
              <select value={contribFreq} onChange={e => setContribFreq(e.target.value as ContributionFrequency)}
                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-green-400">
                {Object.entries(CONTRIBUTION_FREQUENCIES).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Contribution timing">
              <div className="flex gap-2">
                {([
                  { v: "end"   as ContributionTiming, l: "End of period" },
                  { v: "start" as ContributionTiming, l: "Start of period" },
                ]).map(o => (
                  <button key={o.v} onClick={() => setContribTiming(o.v)}
                    className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${contribTiming === o.v ? "bg-green-50 border-green-300 text-green-700 font-medium" : "border-stone-200 text-stone-500 hover:bg-stone-50"}`}>
                    {o.l}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {/* Advanced toggle */}
          <button onClick={() => setShowAdvanced(v => !v)}
            className="mt-5 w-full py-2 text-xs text-stone-400 border border-dashed border-stone-200 rounded-lg hover:border-stone-300 hover:text-stone-500 transition-colors">
            {showAdvanced ? "Hide" : "Show"} advanced settings
          </button>

          {showAdvanced && (
            <div className="mt-3 space-y-4">
              <SectionLabel>Advanced</SectionLabel>
              <SliderInput
                label="Inflation rate" display={`${inflationRate}%`}
                value={inflationRate} onChange={setInflationRate} min={0} max={15} step={0.1}
              />
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700 leading-relaxed">
                The real value shows your final balance in today's purchasing power, adjusted for inflation using the Fisher equation.
              </div>
            </div>
          )}

          {/* Key stats */}
          <div className="mt-5 space-y-2 border-t border-stone-100 pt-4">
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">Rule of 72 (doubling time)</span>
              <span className="font-medium text-stone-700">{result.doublingYears === Infinity ? "—" : `~${result.doublingYears.toFixed(1)} yrs`}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">Interest / deposit ratio</span>
              <span className="font-medium text-emerald-600">{fmtPct(result.interestToDepositRatio * 100, 1)}×</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">Monthly contrib. total</span>
              <span className="font-medium text-stone-700">{fmtUSD(result.totalContributions)}</span>
            </div>
          </div>
        </div>

        {/* ── Results ──────────────────────────────────────────── */}
        <div className="p-5">
          {/* Tabs */}
          <div className="flex gap-1 mb-5 bg-stone-100 rounded-lg p-1">
            {(["summary", "schedule", "monthly"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${tab === t ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>
                {t === "monthly" ? "First 24 months" : t === "schedule" ? "Yearly table" : "Summary"}
              </button>
            ))}
          </div>

          {/* ── Summary ───────────────────── */}
          {tab === "summary" && (
            <div className="space-y-5">
              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Final balance",      value: fmtUSD(result.finalBalance),          bg: "bg-emerald-50",  cls: "text-emerald-700" },
                  { label: "Total interest",     value: fmtUSD(result.totalInterestEarned),   bg: "bg-green-50",    cls: "text-green-700"   },
                  { label: "Initial deposit",    value: fmtUSD(result.totalPrincipal),         bg: "bg-stone-50",    cls: "text-stone-800"   },
                  { label: "All contributions",  value: fmtUSD(result.totalContributions),     bg: "bg-stone-50",    cls: "text-stone-800"   },
                  { label: "Total deposited",    value: fmtUSD(result.totalDeposited),         bg: "bg-stone-50",    cls: "text-stone-800"   },
                  { label: "Real value today",   value: fmtUSD(result.realFinalBalance),       bg: "bg-amber-50",    cls: "text-amber-700"   },
                ].map(m => (
                  <div key={m.label} className={`${m.bg} rounded-xl p-3`}>
                    <p className="text-xs text-stone-400 mb-1">{m.label}</p>
                    <p className={`text-lg font-bold ${m.cls}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Growth chart */}
              <div>
                <p className="text-xs font-medium text-stone-400 mb-3">Balance growth over {years} years</p>
                <GrowthChart schedule={result.yearlySchedule} years={years} />
              </div>

              {/* Rate comparison */}
              <div>
                <p className="text-xs font-medium text-stone-400 mb-2">What if your rate was different?</p>
                <div className="rounded-xl border border-stone-200 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200">
                      <tr>
                        <th className="py-2 px-3 text-left font-medium text-stone-500">Rate</th>
                        <th className="py-2 px-3 text-right font-medium text-stone-500">Final balance</th>
                        <th className="py-2 px-3 text-right font-medium text-stone-500">Interest earned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[2, 4, 6, 7, 8, 10, 12].map(rate => {
                        const r = calculateCompoundInterest({ ...inputs, annualRatePercent: rate });
                        return (
                          <tr key={rate} className={`border-b border-stone-100 last:border-0 ${rate === annualRate ? "bg-green-50/70" : "hover:bg-stone-50"}`}>
                            <td className="py-2 px-3 font-medium text-stone-600">{rate}%{rate === annualRate ? " ★" : ""}</td>
                            <td className="py-2 px-3 text-right font-semibold text-stone-800">{fmtUSD(r.finalBalance)}</td>
                            <td className="py-2 px-3 text-right text-emerald-600">{fmtUSD(r.totalInterestEarned)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-stone-400 mt-1.5">★ = your current rate</p>
              </div>
            </div>
          )}

          {/* ── Yearly schedule ───────────── */}
          {tab === "schedule" && (
            <div>
              <div className="max-h-[560px] overflow-y-auto rounded-xl border border-stone-200">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3 text-left font-medium text-stone-500">Year</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Contributions</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Interest</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Total deposited</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearlySchedule.map(row => (
                      <tr key={row.year} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                        <td className="py-2 px-3 font-medium text-stone-600">{row.year}</td>
                        <td className="py-2 px-3 text-right text-stone-600">{fmtUSD(row.contributions)}</td>
                        <td className="py-2 px-3 text-right text-emerald-600 font-medium">{fmtUSD(row.interestEarned)}</td>
                        <td className="py-2 px-3 text-right text-stone-500">{fmtUSD(row.totalContributions)}</td>
                        <td className="py-2 px-3 text-right font-semibold text-stone-900">{fmtUSD(row.endBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="sticky bottom-0 bg-stone-50 border-t border-stone-200">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-stone-700">Total</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-stone-700">{fmtUSD(result.totalContributions)}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-emerald-700">{fmtUSD(result.totalInterestEarned)}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-stone-700">{fmtUSD(result.totalDeposited)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-stone-900">{fmtUSD(result.finalBalance)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* ── Monthly (first 24) ────────── */}
          {tab === "monthly" && (
            <div>
              <p className="text-xs text-stone-400 mb-3">Detailed month-by-month breakdown for the first 24 months.</p>
              <div className="max-h-[560px] overflow-y-auto rounded-xl border border-stone-200">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3 text-left font-medium text-stone-500">Month</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Contribution</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Interest</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.monthlySchedule.map(row => (
                      <tr key={row.month} className={`border-b border-stone-100 last:border-0 hover:bg-stone-50 ${row.month % 12 === 0 ? "bg-green-50/40" : ""}`}>
                        <td className="py-2 px-3 text-stone-500">
                          Mo {row.month}
                          {row.month % 12 === 0 && <span className="ml-1 text-[10px] text-green-600 font-medium">Yr {row.year}</span>}
                        </td>
                        <td className="py-2 px-3 text-right text-stone-600">{fmtUSD(row.contribution)}</td>
                        <td className="py-2 px-3 text-right text-emerald-600 font-medium">{fmtUSD(row.interestEarned)}</td>
                        <td className="py-2 px-3 text-right font-semibold text-stone-900">{fmtUSD(row.endBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
