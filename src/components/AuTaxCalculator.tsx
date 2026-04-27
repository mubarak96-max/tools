"use client";

import { useState, useMemo } from "react";
import {
  calculateAuTax,
  fmtAUD,
  fmtAUDShort,
  fmtPct,
  FREQUENCY_LABELS,
  type AuTaxInputs,
  type IncomeFrequency,
  type ResidencyStatus,
} from "@/lib/australiaTax";

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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 mt-6 first:mt-0">
      {children}
    </p>
  );
}

function Toggle({ checked, onChange, label, hint }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <div onClick={() => onChange(!checked)}
          className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${checked ? "bg-yellow-500" : "bg-stone-200"}`}>
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
        </div>
        <span className="text-xs text-stone-600">{label}</span>
      </label>
      {hint && <p className="text-[11px] text-stone-400 mt-1 leading-snug pl-11">{hint}</p>}
    </div>
  );
}

function MetricCard({ label, value, sub, accent }: {
  label: string; value: string; sub?: string;
  accent?: "green" | "amber" | "red" | "blue" | "stone";
}) {
  const bg = {
    green: "bg-green-50", amber: "bg-yellow-50", red: "bg-red-50",
    blue: "bg-blue-50", stone: "bg-stone-50",
  }[accent ?? "stone"];
  const txt = {
    green: "text-green-700", amber: "text-yellow-700", red: "text-red-600",
    blue: "text-blue-700", stone: "text-stone-800",
  }[accent ?? "stone"];
  return (
    <div className={`${bg} rounded-xl p-3.5`}>
      <p className="text-xs text-stone-400 mb-1">{label}</p>
      <p className={`text-lg font-bold leading-tight ${txt}`}>{value}</p>
      {sub && <p className="text-[11px] text-stone-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────

export default function AuTaxCalculator() {
  const [income,         setIncome]         = useState(85000);
  const [frequency,      setFrequency]      = useState<IncomeFrequency>("annual");
  const [residency,      setResidency]      = useState<ResidencyStatus>("resident");
  const [inclHelp,       setInclHelp]       = useState(false);
  const [helpDebt,       setHelpDebt]       = useState(30000);
  const [medicareExempt, setMedicareExempt] = useState(false);
  const [medicareSurch,  setMedicareSurch]  = useState(false);
  const [inclSuper,      setInclSuper]      = useState(true);
  const [tab,            setTab]            = useState<"summary" | "breakdown" | "compare">("summary");

  const inputs: AuTaxInputs = {
    grossIncome: income,
    residencyStatus: residency,
    includeHelp: inclHelp,
    helpDebt,
    hasMedicareExemption: medicareExempt,
    hasMedicareSurcharge: medicareSurch,
    includeSuper: inclSuper,
    frequency,
  };

  const result = useMemo(() => calculateAuTax(inputs), [
    income, frequency, residency, inclHelp, helpDebt,
    medicareExempt, medicareSurch, inclSuper, inputs // <== fixed dependency
  ]);

  // Salary comparison for compare tab
  const salaryPoints = [40000, 60000, 80000, 100000, 120000, 150000, 180000, 200000, 250000];
  const compareData = useMemo(() =>
    salaryPoints.map(s => calculateAuTax({ ...inputs, grossIncome: s, frequency: "annual" })),
  [residency, inclHelp, medicareExempt, medicareSurch, inputs]);

  const takeHomePct = result.grossAnnual > 0
    ? (result.netAnnual / result.grossAnnual) * 100
    : 0;

  const freqLabel = FREQUENCY_LABELS[frequency].toLowerCase();

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">

      {/* Banner */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-100 px-5 py-4">
        <div className="flex flex-wrap gap-6 items-center">
          <div>
            <p className="text-xs text-stone-400 mb-0.5">Take-home pay ({freqLabel})</p>
            <p className="text-4xl font-bold text-stone-900 leading-none">
              {fmtAUD(result.perFrequency.net)}
            </p>
          </div>
          <div className="h-10 w-px bg-yellow-200 hidden sm:block" />
          {[
            { label: "Income tax",       value: fmtAUD(result.perFrequency.incomeTax), cls: "text-red-600" },
            { label: "Medicare levy",    value: fmtAUD(result.perFrequency.medicare),  cls: "text-stone-700" },
            { label: "Effective rate",   value: fmtPct(result.effectiveTaxRate),       cls: "text-stone-700" },
            { label: "Marginal rate",    value: fmtPct(result.marginalRate, 1),        cls: "text-stone-700" },
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
            <div className="bg-green-400 transition-all duration-500" style={{ width: `${takeHomePct}%` }}
              title={`Take home ${fmtPct(takeHomePct, 1)}`} />
            <div className="bg-red-400 transition-all duration-500"
              style={{ width: `${(result.netIncomeTax / result.grossAnnual) * 100}%` }}
              title="Income tax" />
            <div className="bg-orange-300 transition-all duration-500"
              style={{ width: `${((result.medicareLevy + result.medicareSurcharge) / result.grossAnnual) * 100}%` }}
              title="Medicare" />
            {inclHelp && (
              <div className="bg-purple-300 transition-all duration-500"
                style={{ width: `${(result.helpRepayment / result.grossAnnual) * 100}%` }}
                title="HELP repayment" />
            )}
          </div>
          <div className="flex flex-wrap gap-3 mt-1.5 text-[10px] text-stone-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-green-400 inline-block"/>Take home {fmtPct(takeHomePct, 1)}</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block"/>Income tax</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-orange-300 inline-block"/>Medicare</span>
            {inclHelp && <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-purple-300 inline-block"/>HELP</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr]">

        {/* ── Inputs ──────────────────────────────────────────── */}
        <div className="border-r border-stone-100 p-5 overflow-y-auto max-h-[700px]">

          <SectionLabel>Income</SectionLabel>
          <div className="space-y-3">
            <Field label="Gross income">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none">$</span>
                <input type="number" value={income} min={0} step={1000}
                  onChange={e => setIncome(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2.5 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-yellow-400" />
              </div>
            </Field>
            <Field label="Pay frequency">
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.entries(FREQUENCY_LABELS) as [IncomeFrequency, string][]).map(([k, v]) => (
                  <button key={k} onClick={() => setFrequency(k)}
                    className={`py-2 text-xs rounded-lg border transition-colors ${frequency === k ? "bg-yellow-50 border-yellow-300 text-yellow-700 font-medium" : "border-stone-200 text-stone-500 hover:bg-stone-50"}`}>
                    {v}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <SectionLabel>Residency</SectionLabel>
          <div className="space-y-2">
            {([
              { v: "resident" as ResidencyStatus,       l: "Australian resident", note: "Tax-free threshold applies" },
              { v: "non_resident" as ResidencyStatus,   l: "Non-resident",        note: "No tax-free threshold" },
              { v: "working_holiday" as ResidencyStatus,l: "Working holiday maker", note: "15% on first $45,000" },
            ]).map(o => (
              <button key={o.v} onClick={() => setResidency(o.v)}
                className={`w-full py-2.5 px-3 text-left rounded-xl border text-xs transition-colors ${residency === o.v ? "bg-yellow-50 border-yellow-300" : "border-stone-200 hover:bg-stone-50"}`}>
                <span className={`font-medium ${residency === o.v ? "text-yellow-800" : "text-stone-700"}`}>{o.l}</span>
                <p className="text-stone-400 mt-0.5">{o.note}</p>
              </button>
            ))}
          </div>

          <SectionLabel>Offsets & levies</SectionLabel>
          <div className="space-y-3">
            <Toggle checked={medicareExempt} onChange={setMedicareExempt}
              label="Medicare levy exemption"
              hint="Some temporary visa holders and medical conditions" />
            <Toggle checked={medicareSurch} onChange={setMedicareSurch}
              label="Medicare levy surcharge (+1%)"
              hint="No private hospital cover; income > $93,000" />
          </div>

          <SectionLabel>HECS / HELP debt</SectionLabel>
          <div className="space-y-3">
            <Toggle checked={inclHelp} onChange={setInclHelp}
              label="I have a HECS-HELP debt"
              hint="Compulsory repayment through tax if income > $54,435" />
            {inclHelp && (
              <Field label="Total HELP debt (for reference)" hint="Used for context only — doesn't change repayment calculation">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none">$</span>
                  <input type="number" value={helpDebt} min={0} step={1000}
                    onChange={e => setHelpDebt(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2.5 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-yellow-400" />
                </div>
              </Field>
            )}
          </div>

          <SectionLabel>Superannuation</SectionLabel>
          <Toggle checked={inclSuper} onChange={setInclSuper}
            label="Show employer super (11.5% on top)"
            hint="Superannuation Guarantee 2025–26 is 11.5% of OTE" />

          {inclSuper && (
            <div className="mt-3 bg-stone-50 rounded-xl p-3 text-xs text-stone-500 leading-relaxed">
              Employer super of <span className="font-semibold text-stone-700">{fmtAUD(result.superContribution)}</span> per year is paid <em>on top of</em> your salary — it does not reduce your take-home pay.
            </div>
          )}
        </div>

        {/* ── Results ──────────────────────────────────────────── */}
        <div className="p-5">

          {/* Tabs */}
          <div className="flex gap-1 mb-5 bg-stone-100 rounded-lg p-1">
            {(["summary", "breakdown", "compare"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${tab === t ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>
                {t === "compare" ? "Salary comparison" : t}
              </button>
            ))}
          </div>

          {/* ── Summary ───────────────── */}
          {tab === "summary" && (
            <div className="space-y-4">
              {/* Multi-frequency table */}
              <div className="rounded-2xl border border-stone-200 overflow-hidden">
                <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200">
                  <p className="text-xs font-medium text-stone-500">Income breakdown — FY 2025–26</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b border-stone-100">
                      <tr>
                        <th className="py-2 px-4 text-left font-medium text-stone-400">Component</th>
                        {(["annual","monthly","fortnightly","weekly"] as IncomeFrequency[]).map(f => (
                          <th key={f} className={`py-2 px-3 text-right font-medium ${frequency === f ? "text-yellow-600" : "text-stone-400"}`}>
                            {FREQUENCY_LABELS[f]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Gross income",    annual: result.grossAnnual,     cls: "text-stone-800 font-semibold" },
                        { label: "Income tax",      annual: -result.netIncomeTax,   cls: "text-red-500" },
                        ...(result.lito > 0 ? [{ label: "  Less: LITO offset", annual: result.lito, cls: "text-green-600 pl-4" }] : []),
                        { label: "Medicare levy",   annual: -(result.medicareLevy + result.medicareSurcharge), cls: "text-stone-600" },
                        ...(inclHelp && result.helpRepayment > 0 ? [{ label: "HELP repayment", annual: -result.helpRepayment, cls: "text-purple-600" }] : []),
                        { label: "Take-home pay",   annual: result.netAnnual,       cls: "text-green-700 font-bold text-sm" },
                        ...(inclSuper ? [{ label: "Employer super",  annual: result.superContribution, cls: "text-blue-600" }] : []),
                      ].map((row, i) => {
                        const divs: Record<IncomeFrequency, number> = { annual:1, monthly:12, fortnightly:26, weekly:52 };
                        const abs = Math.abs(row.annual);
                        const sign = row.annual < 0 ? "−" : "";
                        return (
                          <tr key={i} className={`border-b border-stone-50 last:border-0 ${i === 0 || row.label === "Take-home pay" ? "bg-stone-50/50" : ""}`}>
                            <td className={`py-2.5 px-4 text-stone-600 ${(row as any).cls?.includes("pl-4") ? "pl-8" : ""}`}>{row.label.replace("  ", "")}</td>
                            {(["annual","monthly","fortnightly","weekly"] as IncomeFrequency[]).map(f => (
                              <td key={f} className={`py-2.5 px-3 text-right tabular-nums ${row.cls} ${frequency === f ? "font-semibold" : ""}`}>
                                {sign}{fmtAUD(abs / divs[f])}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Key metrics grid */}
              <div className="grid grid-cols-3 gap-3">
                <MetricCard label="Effective tax rate" value={fmtPct(result.effectiveTaxRate)} sub="of gross income" accent="amber" />
                <MetricCard label="Marginal rate"      value={fmtPct(result.marginalRate, 1)}  sub="last dollar"    accent="stone" />
                <MetricCard label="Take-home"          value={fmtPct(takeHomePct, 1)}          sub="of gross"       accent="green" />
              </div>

              {/* Super callout */}
              {inclSuper && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-xs text-blue-700 leading-relaxed">
                  <strong>Your employer also contributes</strong> {fmtAUD(result.superContribution)}/year ({fmtAUD(result.perFrequency.super)}/{freqLabel}) to your superannuation fund at the 11.5% Superannuation Guarantee rate. This is separate from your take-home pay.
                </div>
              )}
            </div>
          )}

          {/* ── Breakdown ─────────────── */}
          {tab === "breakdown" && (
            <div className="space-y-4">
              {/* Tax brackets */}
              <div>
                <p className="text-xs font-medium text-stone-400 mb-2">How your income is taxed by bracket</p>
                <div className="rounded-xl border border-stone-200 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200">
                      <tr>
                        <th className="py-2.5 px-4 text-left font-medium text-stone-500">Bracket</th>
                        <th className="py-2.5 px-4 text-right font-medium text-stone-500">Rate</th>
                        <th className="py-2.5 px-4 text-right font-medium text-stone-500">Taxable amount</th>
                        <th className="py-2.5 px-4 text-right font-medium text-stone-500">Tax</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.brackets.map((b, i) => (
                        <tr key={i} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                          <td className="py-2.5 px-4 text-stone-600">{b.label}</td>
                          <td className="py-2.5 px-4 text-right font-medium text-stone-700">{b.rate}</td>
                          <td className="py-2.5 px-4 text-right text-stone-600">{fmtAUD(b.taxableAmount)}</td>
                          <td className="py-2.5 px-4 text-right font-semibold text-red-600">{fmtAUD(b.taxAmount)}</td>
                        </tr>
                      ))}
                      <tr className="bg-stone-50 border-t border-stone-200">
                        <td colSpan={2} className="py-2.5 px-4 font-semibold text-stone-700">Gross income tax</td>
                        <td className="py-2.5 px-4 text-right text-stone-600">{fmtAUD(result.grossAnnual)}</td>
                        <td className="py-2.5 px-4 text-right font-bold text-red-600">{fmtAUD(result.incomeTax)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Offsets and levies breakdown */}
              <div className="rounded-xl border border-stone-200 overflow-hidden">
                <div className="bg-stone-50 border-b border-stone-200 px-4 py-2.5">
                  <p className="text-xs font-medium text-stone-500">Offsets, levies and deductions</p>
                </div>
                <div className="divide-y divide-stone-100">
                  {[
                    { label: "Gross income tax",            value: result.incomeTax,           positive: false },
                    { label: "Less: Low Income Tax Offset", value: result.lito,                positive: true,  green: true },
                    { label: "Net income tax",              value: result.netIncomeTax,         positive: false, bold: true },
                    { label: "Medicare levy (2%)",          value: result.medicareLevy,         positive: false },
                    ...(result.medicareSurcharge > 0 ? [{ label: "Medicare levy surcharge (1%)", value: result.medicareSurcharge, positive: false }] : []),
                    ...(result.helpRepayment > 0 ? [{ label: `HECS-HELP repayment`, value: result.helpRepayment, positive: false, purple: true }] : []),
                    { label: "Total deductions",            value: result.totalDeductions,      positive: false, bold: true },
                    { label: "Take-home pay",               value: result.netAnnual,            positive: true,  bold: true, green: true },
                  ].map((row, i) => (
                    <div key={i} className={`px-4 py-3 flex items-center justify-between ${(row as any).bold ? "bg-stone-50" : ""}`}>
                      <p className={`text-sm ${(row as any).bold ? "font-semibold text-stone-700" : "text-stone-500"}`}>{row.label}</p>
                      <p className={`text-sm font-semibold tabular-nums ${(row as any).green ? "text-green-700" : (row as any).purple ? "text-purple-600" : row.positive ? "text-stone-700" : "text-red-600"}`}>
                        {row.positive ? "" : "−"}{fmtAUD(row.value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Compare ───────────────── */}
          {tab === "compare" && (
            <div className="space-y-3">
              <p className="text-xs text-stone-400">Income tax, Medicare and take-home across salary levels ({residency === "resident" ? "Australian resident" : residency}).</p>
              <div className="rounded-xl border border-stone-200 overflow-hidden max-h-[500px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3 text-left font-medium text-stone-500">Salary</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Income tax</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Medicare</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Effective rate</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Take home</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareData.map((r, i) => (
                      <tr key={i}
                        className={`border-b border-stone-100 last:border-0 ${r.grossAnnual === result.grossAnnual ? "bg-yellow-50/70" : "hover:bg-stone-50"}`}>
                        <td className="py-2.5 px-3 font-medium text-stone-700">
                          {fmtAUDShort(r.grossAnnual)}
                          {r.grossAnnual === result.grossAnnual && <span className="ml-1 text-[10px] text-stone-400">★</span>}
                        </td>
                        <td className="py-2.5 px-3 text-right text-red-600">{fmtAUDShort(r.netIncomeTax)}</td>
                        <td className="py-2.5 px-3 text-right text-stone-600">{fmtAUDShort(r.medicareLevy + r.medicareSurcharge)}</td>
                        <td className="py-2.5 px-3 text-right font-medium text-stone-700">{fmtPct(r.effectiveTaxRate)}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-green-700">{fmtAUDShort(r.netAnnual)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-stone-400">★ = your current salary. All figures annual, FY 2025–26.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
