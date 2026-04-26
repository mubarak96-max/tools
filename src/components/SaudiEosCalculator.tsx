"use client";

import { useState, useMemo } from "react";
import {
  calculateEos,
  fmtSAR,
  fmtYears,
  DEPARTURE_LABELS,
  type EosInputs,
  type DepartureReason,
  type Nationality,
} from "@/lib/saudiEos";

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

function Toggle({ checked, onChange, label }: {
  checked: boolean; onChange: (v: boolean) => void; label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`w-9 h-5 rounded-full transition-colors relative ${checked ? "bg-green-500" : "bg-stone-200"}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
      </div>
      <span className="text-xs text-stone-600">{label}</span>
    </label>
  );
}

function InfoBox({ children, colour = "amber" }: {
  children: React.ReactNode;
  colour?: "amber" | "blue" | "green" | "red";
}) {
  const cls = {
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    blue:  "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    red:   "bg-red-50 border-red-200 text-red-800",
  }[colour];
  return (
    <div className={`border rounded-xl p-3.5 text-xs leading-relaxed ${cls}`}>
      {children}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────

export default function SaudiEosCalculator() {
  const today = new Date().toISOString().split("T")[0];
  const fiveYearsAgo = new Date(Date.now() - 5 * 365.25 * 24 * 60 * 60 * 1000)
    .toISOString().split("T")[0];

  const [startDate,    setStartDate]    = useState(fiveYearsAgo);
  const [endDate,      setEndDate]      = useState(today);
  const [basicSalary,  setBasicSalary]  = useState(8000);
  const [departure,    setDeparture]    = useState<DepartureReason>("resignation");
  const [nationality,  setNationality]  = useState<Nationality>("non_saudi");

  const [inclHousing,  setInclHousing]  = useState(false);
  const [housing,      setHousing]      = useState(2000);
  const [inclTransport,setInclTransport]= useState(false);
  const [transport,    setTransport]    = useState(500);

  const [womanMarriage,  setWomanMarriage]  = useState(false);
  const [womanChildbirth,setWomanChildbirth]= useState(false);

  const [tab, setTab] = useState<"summary" | "breakdown" | "schedule">("summary");

  const inputs: EosInputs = {
    startDate, endDate, basicSalary, departureReason: departure, nationality,
    includeHousingAllowance: inclHousing, housingAllowance: housing,
    includeTransportAllowance: inclTransport, transportAllowance: transport,
    womanMarriageResignation: womanMarriage,
    womanChildbirthResignation: womanChildbirth,
  };

  const result = useMemo(() => {
    if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) return null;
    return calculateEos(inputs);
  }, [startDate, endDate, basicSalary, departure, nationality,
      inclHousing, housing, inclTransport, transport,
      womanMarriage, womanChildbirth]);

  const b = result?.breakdown;
  const isValid = !!result;

  const benefitColour = !b ? "text-stone-400"
    : b.totalBenefit > 0 ? "text-green-700"
    : "text-red-600";

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">

      {/* Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 px-5 py-4">
        <div className="flex flex-wrap gap-6 items-center">
          <div>
            <p className="text-xs text-stone-400 mb-0.5">End of service benefit</p>
            <p className={`text-4xl font-bold leading-none ${benefitColour}`}>
              {b ? fmtSAR(b.totalBenefit) : "—"}
            </p>
          </div>
          {b && (
            <>
              <div className="h-10 w-px bg-green-200 hidden sm:block" />
              <div>
                <p className="text-xs text-stone-400 mb-0.5">Service period</p>
                <p className="text-xl font-semibold text-stone-700">{fmtYears(b.totalDays)}</p>
              </div>
              <div>
                <p className="text-xs text-stone-400 mb-0.5">Gross benefit</p>
                <p className="text-xl font-semibold text-stone-600">{fmtSAR(b.grossBenefit)}</p>
              </div>
              <div>
                <p className="text-xs text-stone-400 mb-0.5">Entitlement</p>
                <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${b.isFullEntitlement ? "bg-green-100 text-green-700" : b.reductionFactor === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                  {b.reductionFactor === 0 ? "No entitlement" : b.isFullEntitlement ? "Full (100%)" : b.reductionFactor === 1/3 ? "Partial (33%)" : "Partial (67%)"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">

        {/* ── Inputs ──────────────────────────────────────────── */}
        <div className="border-r border-stone-100 p-5 space-y-1 overflow-y-auto max-h-[720px]">

          <SectionLabel>Employment dates</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date">
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-green-400" />
            </Field>
            <Field label="End date">
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                max={today}
                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-green-400" />
            </Field>
          </div>

          <SectionLabel>Salary</SectionLabel>
          <div className="space-y-3">
            <Field label="Monthly basic salary (SAR)" hint="Basic salary only — not total package">
              <div className="relative">
                <input type="number" value={basicSalary} min={0} step={100}
                  onChange={e => setBasicSalary(Number(e.target.value))}
                  className="w-full pl-3 pr-12 py-2.5 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-green-400" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none">SAR</span>
              </div>
            </Field>

            <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-100">
              <p className="text-xs font-medium text-stone-500 mb-2">Include in calculation base?</p>
              <Toggle checked={inclHousing} onChange={setInclHousing} label="Housing allowance" />
              {inclHousing && (
                <div className="relative mt-2">
                  <input type="number" value={housing} min={0} step={100}
                    onChange={e => setHousing(Number(e.target.value))}
                    className="w-full pl-3 pr-12 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-green-400" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none">SAR/mo</span>
                </div>
              )}
              <Toggle checked={inclTransport} onChange={setInclTransport} label="Transport allowance" />
              {inclTransport && (
                <div className="relative mt-2">
                  <input type="number" value={transport} min={0} step={100}
                    onChange={e => setTransport(Number(e.target.value))}
                    className="w-full pl-3 pr-12 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-green-400" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none">SAR/mo</span>
                </div>
              )}
              <p className="text-[10px] text-stone-400 mt-1 leading-relaxed">
                By default, EOSB is calculated on basic salary only. Include allowances only if your employment contract explicitly states they form part of the EOSB base.
              </p>
            </div>
          </div>

          <SectionLabel>Reason for leaving</SectionLabel>
          <Field label="Departure reason">
            <select value={departure} onChange={e => setDeparture(e.target.value as DepartureReason)}
              className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-green-400">
              {Object.entries(DEPARTURE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </Field>

          {(departure === "resignation" || departure === "mutual_agreement") && (
            <div className="space-y-2 p-3 bg-amber-50 rounded-xl border border-amber-100 mt-2">
              <p className="text-xs font-medium text-amber-700 mb-2">Special cases (full entitlement)</p>
              <Toggle checked={womanMarriage} onChange={v => { setWomanMarriage(v); if (v) setWomanChildbirth(false); }}
                label="Woman resigning within 6 months of marriage" />
              <Toggle checked={womanChildbirth} onChange={v => { setWomanChildbirth(v); if (v) setWomanMarriage(false); }}
                label="Woman resigning within 3 months of childbirth" />
            </div>
          )}

          <SectionLabel>Nationality</SectionLabel>
          <div className="flex gap-2">
            {([
              { v: "saudi" as Nationality, l: "Saudi national" },
              { v: "non_saudi" as Nationality, l: "Non-Saudi (expatriate)" },
            ]).map(o => (
              <button key={o.v} onClick={() => setNationality(o.v)}
                className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${nationality === o.v ? "bg-green-50 border-green-300 text-green-700 font-medium" : "border-stone-200 text-stone-500 hover:bg-stone-50"}`}>
                {o.l}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results ──────────────────────────────────────────── */}
        <div className="p-5">

          {!isValid ? (
            <div className="flex items-center justify-center h-40 text-stone-400 text-sm">
              Enter valid start and end dates to calculate your benefit.
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-1 mb-5 bg-stone-100 rounded-lg p-1">
                {(["summary", "breakdown", "schedule"] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${tab === t ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>
                    {t === "schedule" ? "Year by year" : t}
                  </button>
                ))}
              </div>

              {/* ── Summary ───────────────────────── */}
              {tab === "summary" && b && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Service period",      value: fmtYears(b.totalDays),           bg: "bg-stone-50" },
                      { label: "Calculation base",    value: fmtSAR(b.monthlySalaryBase) + "/mo", bg: "bg-stone-50" },
                      { label: "Gross benefit",       value: fmtSAR(b.grossBenefit),          bg: "bg-stone-50" },
                      { label: "Entitlement",         value: b.reductionLabel,                bg: b.isFullEntitlement ? "bg-green-50" : b.reductionFactor === 0 ? "bg-red-50" : "bg-amber-50" },
                      { label: "Net benefit (SAR)",   value: fmtSAR(b.netBenefit),            bg: "bg-emerald-50", bold: true },
                      { label: "Daily salary base",   value: fmtSAR(b.dailySalaryBase),       bg: "bg-stone-50" },
                    ].map(m => (
                      <div key={m.label} className={`${m.bg} rounded-xl p-3.5`}>
                        <p className="text-xs text-stone-400 mb-1">{m.label}</p>
                        <p className={`text-base leading-tight ${(m as any).bold ? "text-lg font-bold text-emerald-700" : "font-semibold text-stone-800"}`}>{m.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Benefit breakdown bar */}
                  {b.totalBenefit > 0 && (
                    <div>
                      <p className="text-xs font-medium text-stone-400 mb-2">Benefit composition</p>
                      <div className="flex rounded-full overflow-hidden h-6">
                        {b.benefitForFirst5Years > 0 && (
                          <div className="bg-green-400 flex items-center justify-center text-white text-[10px] font-medium"
                            style={{ width: `${(b.benefitForFirst5Years / b.grossBenefit) * 100}%` }}>
                            First 5 yrs
                          </div>
                        )}
                        {b.benefitForYearsAfter5 > 0 && (
                          <div className="bg-emerald-600 flex items-center justify-center text-white text-[10px] font-medium flex-1">
                            After yr 5
                          </div>
                        )}
                        {b.partialYearBenefit > 0 && b.benefitForYearsAfter5 === 0 && (
                          <div className="bg-green-200 flex-1 flex items-center justify-center text-green-800 text-[10px]">
                            Partial
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 mt-1.5 text-[10px] text-stone-400">
                        {b.benefitForFirst5Years > 0 && <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-green-400 inline-block"/>½ mo/yr for first 5 yrs: {fmtSAR(b.benefitForFirst5Years)}</span>}
                        {b.benefitForYearsAfter5 > 0 && <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block"/>1 mo/yr for yrs 5+: {fmtSAR(b.benefitForYearsAfter5)}</span>}
                        {b.partialYearBenefit > 0 && <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-green-200 inline-block"/>Partial year: {fmtSAR(b.partialYearBenefit)}</span>}
                      </div>
                    </div>
                  )}

                  {/* GOSI note */}
                  <InfoBox colour={nationality === "saudi" ? "blue" : "green"}>
                    <strong>GOSI / Payment note:</strong> {b.gosiNote}
                  </InfoBox>

                  {b.reductionFactor === 0 && (
                    <InfoBox colour="red">
                      <strong>No entitlement:</strong> Under Saudi Labor Law Article 84, employees who resign voluntarily with less than 2 years of service are not entitled to an end of service benefit.
                    </InfoBox>
                  )}

                  {b.reductionFactor > 0 && b.reductionFactor < 1 && (
                    <InfoBox colour="amber">
                      <strong>Partial entitlement:</strong> {b.reductionLabel}. Under Article 84 of the Saudi Labor Law, voluntary resignation results in a reduced EOSB. Your gross calculated benefit of {fmtSAR(b.grossBenefit)} is reduced to {fmtSAR(b.netBenefit)}.
                    </InfoBox>
                  )}
                </div>
              )}

              {/* ── Breakdown ─────────────────────── */}
              {tab === "breakdown" && b && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-stone-200 overflow-hidden">
                    <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200">
                      <p className="text-xs font-medium text-stone-500">Calculation breakdown — Saudi Labor Law Arts. 84–85</p>
                    </div>
                    <div className="divide-y divide-stone-100">
                      {[
                        { label: "Employment start",          value: new Date(startDate).toLocaleDateString("en-GB", { day:"2-digit", month:"long", year:"numeric" }) },
                        { label: "Employment end",            value: new Date(endDate).toLocaleDateString("en-GB", { day:"2-digit", month:"long", year:"numeric" }) },
                        { label: "Total service",             value: fmtYears(b.totalDays) + ` (${b.totalDays} days)` },
                        { label: "Complete years",            value: `${b.fullYears} year${b.fullYears !== 1 ? "s" : ""}` },
                        { label: "Remaining days",            value: `${b.remainingDays} days` },
                        { label: "Monthly calculation base",  value: fmtSAR(b.monthlySalaryBase) },
                        { label: "Benefit (years 1–5 at ½/yr)", value: fmtSAR(b.benefitForFirst5Years) },
                        { label: "Benefit (years 5+ at 1/yr)", value: fmtSAR(b.benefitForYearsAfter5) },
                        { label: "Partial year benefit",      value: fmtSAR(b.partialYearBenefit) },
                        { label: "Gross benefit total",       value: fmtSAR(b.grossBenefit), bold: true },
                        { label: "Entitlement factor",        value: b.reductionLabel },
                        { label: "Net benefit (payable)",     value: fmtSAR(b.netBenefit), bold: true, green: true },
                      ].map((row, i) => (
                        <div key={i} className={`px-4 py-3 flex items-center justify-between ${row.bold ? "bg-stone-50" : ""}`}>
                          <p className={`text-sm ${row.bold ? "font-semibold text-stone-700" : "text-stone-500"}`}>{row.label}</p>
                          <p className={`text-sm font-semibold tabular-nums ${(row as any).green ? "text-emerald-700" : "text-stone-800"}`}>{row.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <InfoBox colour="blue">
                    <strong>Article 84 — Resignation reduction rules:</strong><br/>
                    &lt; 2 years: No entitlement · 2–5 years: 1/3 · 5–10 years: 2/3 · 10+ years: Full.<br/>
                    Women resigning within 6 months of marriage or 3 months of childbirth receive full benefit.
                  </InfoBox>
                </div>
              )}

              {/* ── Year by year ───────────────────── */}
              {tab === "schedule" && result && (
                <div>
                  <div className="max-h-[520px] overflow-y-auto rounded-xl border border-stone-200">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 bg-stone-50 border-b border-stone-200">
                        <tr>
                          <th className="py-2.5 px-3 text-left font-medium text-stone-500">Year</th>
                          <th className="py-2.5 px-3 text-right font-medium text-stone-500">Rate</th>
                          <th className="py-2.5 px-3 text-right font-medium text-stone-500">Gross (SAR)</th>
                          <th className="py-2.5 px-3 text-right font-medium text-stone-500">Reduction</th>
                          <th className="py-2.5 px-3 text-right font-medium text-stone-500">Net (SAR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.yearlySummary.map((row, i) => {
                          const isPartial = i === result.yearlySummary.length - 1 && b!.remainingDays > 0 && row.year > b!.fullYears;
                          return (
                            <tr key={i} className={`border-b border-stone-100 last:border-0 ${row.year <= 5 ? "hover:bg-green-50/30" : "hover:bg-emerald-50/30"}`}>
                              <td className="py-2 px-3 font-medium text-stone-600">
                                {isPartial ? `Yr ${row.year} (partial — ${b!.remainingDays}d)` : `Year ${row.year}`}
                              </td>
                              <td className="py-2 px-3 text-right text-stone-500">
                                {row.accrualRate === 0.5 ? "½ month" : "1 month"}
                              </td>
                              <td className="py-2 px-3 text-right text-stone-700">{fmtSAR(row.grossForYear)}</td>
                              <td className="py-2 px-3 text-right text-stone-500">
                                {row.reductionFactor === 1 ? "100%" : row.reductionFactor === 2/3 ? "67%" : row.reductionFactor === 1/3 ? "33%" : "0%"}
                              </td>
                              <td className="py-2 px-3 text-right font-semibold text-emerald-700">{fmtSAR(row.netForYear)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="sticky bottom-0 bg-stone-50 border-t border-stone-200">
                        <tr>
                          <td colSpan={2} className="py-2.5 px-3 font-semibold text-stone-700">Total</td>
                          <td className="py-2.5 px-3 text-right font-semibold text-stone-700">{fmtSAR(b!.grossBenefit)}</td>
                          <td />
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-700">{fmtSAR(b!.totalBenefit)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <p className="text-xs text-stone-400 mt-2">Years 1–5 accrue at ½ month salary per year. Years after 5 accrue at 1 month salary per year.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
