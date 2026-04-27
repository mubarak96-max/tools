"use client";

import { useState, useMemo } from "react";
import {
  calculateIndiaTax,
  fmtINR,
  fmtINRShort,
  fmtPct,
  AGE_LABELS,
  type IndiaTaxInputs,
  type OldRegimeDeductions,
  type AgeGroup,
  type EmploymentType,
  type RegimeResult,
  type TaxRegime,
} from "@/lib/indiaTax";

// ─── Primitives ────────────────────────────────────────────────────

function Field({ label, hint, children }: {
  label: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-500 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-stone-400 mt-1 leading-snug">{hint}</p>}
    </div>
  );
}

function RupeeInput({ value, onChange, hint }: {
  value: number; onChange: (v: number) => void; hint?: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none">₹</span>
      <input
        type="number" value={value} min={0} step={1000}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full pl-7 pr-3 py-2.5 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-orange-400"
      />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 mt-6 first:mt-0">
      {children}
    </p>
  );
}

// ─── Regime card ───────────────────────────────────────────────────

function RegimeCard({
  result,
  isBetter,
  isActive,
  onClick,
}: {
  result: RegimeResult;
  isBetter: boolean;
  isActive: boolean;
  onClick: () => void;
}) {
  const isNew = result.regime === "new";
  const accent = isNew
    ? isActive ? "border-orange-400 bg-orange-50" : "border-stone-200 hover:border-orange-200"
    : isActive ? "border-blue-400 bg-blue-50"   : "border-stone-200 hover:border-blue-200";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${accent}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${isNew ? "text-orange-700" : "text-blue-700"}`}>
              {isNew ? "New Regime" : "Old Regime"}
            </span>
            {isBetter && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                ✓ Better for you
              </span>
            )}
          </div>
          <p className="text-[10px] text-stone-400 mt-0.5">
            {isNew ? "Section 115BAC — Default" : "Legacy slabs with deductions"}
          </p>
        </div>
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isActive ? (isNew ? "border-orange-500 bg-orange-500" : "border-blue-500 bg-blue-500") : "border-stone-300"}`}>
          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-stone-400">Total tax</p>
          <p className="font-bold text-stone-900 text-base">{fmtINRShort(result.totalTax)}</p>
        </div>
        <div>
          <p className="text-stone-400">Monthly take-home</p>
          <p className="font-bold text-stone-900 text-base">{fmtINRShort(result.monthlyTakeHome)}</p>
        </div>
        <div>
          <p className="text-stone-400">Effective rate</p>
          <p className="font-semibold text-stone-700">{fmtPct(result.effectiveRate)}</p>
        </div>
        <div>
          <p className="text-stone-400">Taxable income</p>
          <p className="font-semibold text-stone-700">{fmtINRShort(result.taxableIncome)}</p>
        </div>
      </div>
    </button>
  );
}

// ─── Main component ────────────────────────────────────────────────

export default function IndiaTaxCalculator() {
  // Core inputs
  const [grossIncome,     setGrossIncome]     = useState(1200000);
  const [employmentType,  setEmploymentType]  = useState<EmploymentType>("salaried");
  const [age,             setAge]             = useState<AgeGroup>("below60");
  const [activeRegime,    setActiveRegime]    = useState<TaxRegime>("new");

  // Old regime deductions
  const [sec80C,          setSec80C]          = useState(150000);
  const [sec80D,          setSec80D]          = useState(25000);
  const [hra,             setHra]             = useState(120000);
  const [lta,             setLta]             = useState(20000);
  const [nps,             setNps]             = useState(50000);
  const [homeLoan,        setHomeLoan]        = useState(0);
  const [otherDed,        setOtherDed]        = useState(0);
  const [showDeductions,  setShowDeductions]  = useState(true);

  const [tab, setTab] = useState<"overview" | "breakdown" | "compare">("overview");

  const deductions: OldRegimeDeductions = {
    section80C: sec80C, section80D: sec80D, hra, lta,
    nps80CCD: nps, homeLoanInterest: homeLoan, otherDeductions: otherDed,
  };

  const inputs: IndiaTaxInputs = {
    grossIncome, employmentType, age, deductions, showComparison: true,
  };

  const result = useMemo(() => calculateIndiaTax(inputs), [
    grossIncome, employmentType, age,
    sec80C, sec80D, hra, lta, nps, homeLoan, otherDed,
  ]);

  const active = activeRegime === "new" ? result.newRegime : result.oldRegime;
  const savings = result.savingsAmount;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">

      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 px-5 py-4">
        <div className="flex flex-wrap gap-6 items-center">
          <div>
            <p className="text-xs text-stone-400 mb-0.5">
              Better regime: {result.betterRegime === "new" ? "New Regime" : "Old Regime"}
            </p>
            <p className="text-4xl font-bold text-stone-900 leading-none">
              {fmtINRShort(result.betterRegime === "new" ? result.newRegime.totalTax : result.oldRegime.totalTax)}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Save <span className="font-semibold text-green-700">{fmtINRShort(savings)}</span> by choosing the {result.betterRegime === "new" ? "New" : "Old"} Regime
            </p>
          </div>
          <div className="h-10 w-px bg-orange-200 hidden sm:block" />
          {[
            { label: "New Regime tax",   value: fmtINRShort(result.newRegime.totalTax),   cls: "text-orange-600" },
            { label: "Old Regime tax",   value: fmtINRShort(result.oldRegime.totalTax),   cls: "text-blue-600"   },
            { label: "Monthly (better)", value: fmtINRShort(result.betterRegime === "new" ? result.newRegime.monthlyTakeHome : result.oldRegime.monthlyTakeHome), cls: "text-green-700" },
          ].map(m => (
            <div key={m.label}>
              <p className="text-xs text-stone-400 mb-0.5">{m.label}</p>
              <p className={`text-xl font-semibold ${m.cls}`}>{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr]">

        {/* ── Inputs ──────────────────────────────────────────── */}
        <div className="border-r border-stone-100 p-5 overflow-y-auto max-h-[760px]">

          <SectionLabel>Income details</SectionLabel>
          <div className="space-y-3">
            <Field label="Annual gross income (₹)" hint="Total CTC or gross annual income before tax">
              <RupeeInput value={grossIncome} onChange={setGrossIncome} />
            </Field>

            <Field label="Employment type">
              <div className="flex gap-2">
                {([
                  { v: "salaried" as EmploymentType, l: "Salaried" },
                  { v: "self_employed" as EmploymentType, l: "Self-employed / Business" },
                ]).map(o => (
                  <button key={o.v} onClick={() => setEmploymentType(o.v)}
                    className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${employmentType === o.v ? "bg-orange-50 border-orange-300 text-orange-700 font-medium" : "border-stone-200 text-stone-500 hover:bg-stone-50"}`}>
                    {o.l}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Age group">
              <select value={age} onChange={e => setAge(e.target.value as AgeGroup)}
                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-orange-400">
                {Object.entries(AGE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <p className="text-[11px] text-stone-400 mt-1">Age affects old regime tax-free threshold only.</p>
            </Field>
          </div>

          <SectionLabel>Old regime deductions</SectionLabel>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-3 text-[11px] text-blue-700 leading-relaxed">
            Enter your deductions to see if the Old Regime saves you more tax. Not applicable under the New Regime.
          </div>

          <button onClick={() => setShowDeductions(v => !v)}
            className="w-full py-2 text-xs text-stone-400 border border-dashed border-stone-200 rounded-lg hover:border-stone-300 mb-3 transition-colors">
            {showDeductions ? "Hide" : "Show"} deduction inputs
          </button>

          {showDeductions && (
            <div className="space-y-3">
              <Field label="Section 80C — PPF, ELSS, LIC, EPF" hint="Max ₹1,50,000">
                <RupeeInput value={sec80C} onChange={setSec80C} />
              </Field>
              <Field label="Section 80D — Health insurance" hint="₹25,000 self; ₹50,000 if parents are senior citizens">
                <RupeeInput value={sec80D} onChange={setSec80D} />
              </Field>
              <Field label="HRA exemption" hint="Exempt portion of House Rent Allowance">
                <RupeeInput value={hra} onChange={setHra} />
              </Field>
              <Field label="Leave Travel Allowance (LTA)">
                <RupeeInput value={lta} onChange={setLta} />
              </Field>
              <Field label="NPS — Section 80CCD(2)" hint="Employer NPS contribution — no upper limit">
                <RupeeInput value={nps} onChange={setNps} />
              </Field>
              <Field label="Home loan interest — Sec 24(b)" hint="Max ₹2,00,000 for self-occupied property">
                <RupeeInput value={homeLoan} onChange={setHomeLoan} />
              </Field>
              <Field label="Other deductions" hint="Section 80E, 80G, 80TTA, etc.">
                <RupeeInput value={otherDed} onChange={setOtherDed} />
              </Field>
            </div>
          )}
        </div>

        {/* ── Results ──────────────────────────────────────────── */}
        <div className="p-5">

          {/* Regime selector cards */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <RegimeCard
              result={result.newRegime}
              isBetter={result.betterRegime === "new"}
              isActive={activeRegime === "new"}
              onClick={() => setActiveRegime("new")}
            />
            <RegimeCard
              result={result.oldRegime}
              isBetter={result.betterRegime === "old"}
              isActive={activeRegime === "old"}
              onClick={() => setActiveRegime("old")}
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-5 bg-stone-100 rounded-lg p-1">
            {(["overview", "breakdown", "compare"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${tab === t ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>
                {t === "compare" ? "Side by side" : t}
              </button>
            ))}
          </div>

          {/* ── Overview ─────────────────── */}
          {tab === "overview" && (
            <div className="space-y-4">
              <p className="text-xs text-stone-400">
                Showing: <span className="font-semibold text-stone-600">{activeRegime === "new" ? "New Regime (Section 115BAC)" : "Old Regime"}</span>
              </p>

              {/* Income → Tax waterfall */}
              <div className="rounded-2xl border border-stone-200 overflow-hidden">
                <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200">
                  <p className="text-xs font-medium text-stone-500">Tax calculation — FY 2025–26 (AY 2026–27)</p>
                </div>
                <div className="divide-y divide-stone-100">
                  {[
                    { label: "Gross income",             value: active.grossIncome,         sign: "",  cls: "text-stone-800 font-semibold" },
                    { label: "Standard deduction",        value: active.standardDeduction,   sign: "−", cls: "text-stone-500" },
                    ...(activeRegime === "old" && active.totalDeductions > active.standardDeduction
                      ? [{ label: "Other deductions", value: active.totalDeductions - active.standardDeduction, sign: "−", cls: "text-stone-500" }]
                      : []),
                    { label: "Taxable income",            value: active.taxableIncome,       sign: "=", cls: "text-stone-800 font-semibold", divider: true },
                    { label: "Income tax (gross)",        value: active.grossIncomeTax,      sign: "",  cls: "text-red-600" },
                    ...(active.rebate87A > 0
                      ? [{ label: "Less: Rebate u/s 87A", value: active.rebate87A,           sign: "−", cls: "text-green-600" }]
                      : []),
                    { label: "Net income tax",            value: active.netIncomeTax,        sign: "=", cls: "text-red-600 font-semibold", divider: true },
                    ...(active.surcharge > 0
                      ? [{ label: "Surcharge",            value: active.surcharge,           sign: "+", cls: "text-red-500" }]
                      : []),
                    { label: "Health & Education Cess (4%)", value: active.cess,             sign: "+", cls: "text-stone-500" },
                    { label: "Total tax liability",       value: active.totalTax,            sign: "=", cls: "text-red-700 font-bold text-base", divider: true },
                    { label: "Annual take-home",          value: active.takeHomePay,         sign: "",  cls: "text-green-700 font-bold text-base" },
                  ].map((row, i) => (
                    <div key={i} className={`px-4 py-3 flex items-center justify-between ${(row as any).divider ? "bg-stone-50" : ""}`}>
                      <p className={`text-sm text-stone-500 ${(row as any).divider ? "font-medium text-stone-700" : ""}`}>{row.label}</p>
                      <p className={`text-sm tabular-nums ${row.cls}`}>
                        {row.sign && row.value > 0 ? `${row.sign} ` : ""}{fmtINR(row.value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Effective rate",    value: fmtPct(active.effectiveRate),   accent: "amber" as const },
                  { label: "Marginal rate",     value: fmtPct(active.marginalRate, 0), accent: "stone" as const },
                  { label: "Monthly take-home", value: fmtINRShort(active.monthlyTakeHome), accent: "green" as const },
                ].map(m => (
                  <div key={m.label} className={`rounded-xl p-3 ${m.accent === "amber" ? "bg-amber-50" : m.accent === "green" ? "bg-green-50" : "bg-stone-50"}`}>
                    <p className="text-xs text-stone-400 mb-1">{m.label}</p>
                    <p className={`text-base font-bold ${m.accent === "amber" ? "text-amber-700" : m.accent === "green" ? "text-green-700" : "text-stone-800"}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Deductions used (old regime) */}
              {activeRegime === "old" && active.deductionBreakdown && active.deductionBreakdown.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-stone-400 mb-2">Deductions claimed</p>
                  <div className="rounded-xl border border-stone-200 overflow-hidden">
                    {active.deductionBreakdown.map((d, i) => (
                      <div key={i} className="flex justify-between px-4 py-2.5 border-b border-stone-100 last:border-0 text-xs hover:bg-stone-50">
                        <span className="text-stone-600">{d.label}</span>
                        <span className="font-medium text-blue-700">{fmtINR(d.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between px-4 py-2.5 bg-stone-50 text-xs font-semibold border-t border-stone-200">
                      <span className="text-stone-700">Total deductions</span>
                      <span className="text-blue-700">{fmtINR(active.totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Breakdown ─────────────────── */}
          {tab === "breakdown" && (
            <div className="space-y-4">
              <p className="text-xs text-stone-400">
                Tax brackets applied to taxable income of{" "}
                <span className="font-semibold text-stone-700">{fmtINR(active.taxableIncome)}</span>
              </p>

              <div className="rounded-xl border border-stone-200 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-4 text-left font-medium text-stone-500">Income slab</th>
                      <th className="py-2.5 px-4 text-right font-medium text-stone-500">Rate</th>
                      <th className="py-2.5 px-4 text-right font-medium text-stone-500">Income in slab</th>
                      <th className="py-2.5 px-4 text-right font-medium text-stone-500">Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {active.brackets.map((b, i) => (
                      <tr key={i} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                        <td className="py-2.5 px-4 text-stone-600">{b.range}</td>
                        <td className="py-2.5 px-4 text-right">
                          <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                            b.rate === "0%" ? "bg-green-100 text-green-700" :
                            b.rate === "5%" ? "bg-blue-100 text-blue-700" :
                            b.rate === "10%" ? "bg-yellow-100 text-yellow-700" :
                            b.rate === "15%" ? "bg-amber-100 text-amber-700" :
                            b.rate === "20%" ? "bg-orange-100 text-orange-700" :
                            "bg-red-100 text-red-700"
                          }`}>{b.rate}</span>
                        </td>
                        <td className="py-2.5 px-4 text-right text-stone-600">{fmtINR(b.taxableSlice)}</td>
                        <td className="py-2.5 px-4 text-right font-semibold text-red-600">{fmtINR(b.tax)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tax components summary */}
              <div className="rounded-xl border border-stone-200 overflow-hidden">
                <div className="bg-stone-50 border-b border-stone-200 px-4 py-2.5">
                  <p className="text-xs font-medium text-stone-500">Tax component summary</p>
                </div>
                {[
                  { label: "Gross income tax",           value: active.grossIncomeTax,  cls: "text-stone-700" },
                  { label: "Less: Section 87A rebate",   value: -active.rebate87A,      cls: "text-green-600",  skip: active.rebate87A === 0 },
                  { label: "Net income tax",             value: active.netIncomeTax,    cls: "text-stone-800 font-semibold" },
                  { label: "Surcharge",                  value: active.surcharge,       cls: "text-stone-600",  skip: active.surcharge === 0 },
                  { label: "Health & Education Cess (4%)", value: active.cess,          cls: "text-stone-600" },
                  { label: "Total tax payable",          value: active.totalTax,        cls: "text-red-700 font-bold", bold: true },
                ].filter(r => !(r as any).skip).map((row, i) => (
                  <div key={i} className={`px-4 py-3 flex justify-between text-sm border-b border-stone-100 last:border-0 ${(row as any).bold ? "bg-stone-50" : ""}`}>
                    <span className={`${(row as any).bold ? "font-semibold text-stone-700" : "text-stone-500"}`}>{row.label}</span>
                    <span className={`tabular-nums ${row.cls}`}>{row.value < 0 ? `− ${fmtINR(-row.value)}` : fmtINR(row.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Side by side ─────────────── */}
          {tab === "compare" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-stone-200 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-4 text-left font-medium text-stone-500">Item</th>
                      <th className="py-2.5 px-4 text-right font-medium text-orange-600">New Regime</th>
                      <th className="py-2.5 px-4 text-right font-medium text-blue-600">Old Regime</th>
                      <th className="py-2.5 px-4 text-right font-medium text-stone-400">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Gross income",        n: result.newRegime.grossIncome,        o: result.oldRegime.grossIncome },
                      { label: "Total deductions",    n: result.newRegime.totalDeductions,    o: result.oldRegime.totalDeductions },
                      { label: "Taxable income",      n: result.newRegime.taxableIncome,      o: result.oldRegime.taxableIncome },
                      { label: "Gross income tax",    n: result.newRegime.grossIncomeTax,     o: result.oldRegime.grossIncomeTax },
                      { label: "Section 87A rebate",  n: result.newRegime.rebate87A,          o: result.oldRegime.rebate87A },
                      { label: "Net income tax",      n: result.newRegime.netIncomeTax,       o: result.oldRegime.netIncomeTax },
                      { label: "Surcharge",           n: result.newRegime.surcharge,          o: result.oldRegime.surcharge },
                      { label: "Cess (4%)",           n: result.newRegime.cess,               o: result.oldRegime.cess },
                      { label: "Total tax",           n: result.newRegime.totalTax,           o: result.oldRegime.totalTax, bold: true },
                      { label: "Effective rate",      n: result.newRegime.effectiveRate,      o: result.oldRegime.effectiveRate, isPct: true },
                      { label: "Annual take-home",    n: result.newRegime.takeHomePay,        o: result.oldRegime.takeHomePay, bold: true },
                      { label: "Monthly take-home",   n: result.newRegime.monthlyTakeHome,    o: result.oldRegime.monthlyTakeHome },
                    ].map((row, i) => {
                      const diff = row.n - row.o;
                      const diffLabel = (row as any).isPct
                        ? `${diff >= 0 ? "+" : ""}${fmtPct(diff)}`
                        : `${diff >= 0 ? "+" : "−"}${fmtINRShort(Math.abs(diff))}`;
                      const diffCls = diff < 0 ? "text-green-600" : diff > 0 ? "text-red-600" : "text-stone-400";
                      return (
                        <tr key={i} className={`border-b border-stone-100 last:border-0 ${(row as any).bold ? "bg-stone-50 font-semibold" : "hover:bg-stone-50"}`}>
                          <td className="py-2.5 px-4 text-stone-600">{row.label}</td>
                          <td className={`py-2.5 px-4 text-right text-orange-700 ${result.betterRegime === "new" && (row as any).bold ? "font-bold" : ""}`}>
                            {(row as any).isPct ? fmtPct(row.n) : fmtINR(row.n)}
                          </td>
                          <td className={`py-2.5 px-4 text-right text-blue-700 ${result.betterRegime === "old" && (row as any).bold ? "font-bold" : ""}`}>
                            {(row as any).isPct ? fmtPct(row.o) : fmtINR(row.o)}
                          </td>
                          <td className={`py-2.5 px-4 text-right ${diffCls}`}>{diffLabel}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className={`border rounded-xl p-4 ${result.betterRegime === "new" ? "bg-orange-50 border-orange-200" : "bg-blue-50 border-blue-200"}`}>
                <p className={`text-sm font-semibold mb-1 ${result.betterRegime === "new" ? "text-orange-800" : "text-blue-800"}`}>
                  {result.betterRegime === "new" ? "New Regime saves you more" : "Old Regime saves you more"}
                </p>
                <p className={`text-xs leading-relaxed ${result.betterRegime === "new" ? "text-orange-700" : "text-blue-700"}`}>
                  You save <strong>{fmtINR(result.savingsAmount)}</strong> per year ({fmtINRShort(result.savingsAmount / 12)}/month) by choosing the{" "}
                  {result.betterRegime === "new" ? "New" : "Old"} Regime.
                  {result.betterRegime === "old"
                    ? ` This is because your deductions of ${fmtINR(result.oldRegime.totalDeductions)} reduce your taxable income significantly under the Old Regime.`
                    : ` Your deductions of ${fmtINR(result.oldRegime.totalDeductions)} are not enough to offset the lower slab rates in the New Regime.`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
