"use client";

import { useState, useMemo } from "react";
import {
  calculateStudentLoan,
  fmtGBP,
  fmtGBPShort,
  PLANS,
  PLAN_COLOUR_CLASSES,
  type StudentLoanInputs,
  type LoanPlan,
} from "@/lib/ukStudentLoan";

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

function NumInput({
  value, onChange, prefix, suffix, min = 0, max, step = 100,
}: {
  value: number; onChange: (v: number) => void;
  prefix?: string; suffix?: string; min?: number; max?: number; step?: number;
}) {
  return (
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-stone-400 text-sm pointer-events-none">{prefix}</span>}
      <input
        type="number" value={value} min={min} max={max} step={step}
        onChange={e => onChange(Number(e.target.value))}
        className={`w-full py-2.5 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-indigo-400 ${prefix ? "pl-7 pr-3" : suffix ? "pl-3 pr-10" : "px-3"}`}
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
        className="w-full accent-indigo-500" />
      <div className="flex justify-between text-[10px] text-stone-300 mt-0.5">
        <span>{min}</span><span>{max}</span>
      </div>
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
      <div onClick={() => onChange(!checked)}
        className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${checked ? "bg-indigo-500" : "bg-stone-200"}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
      </div>
      <span className="text-xs text-stone-600 leading-snug">{label}</span>
    </label>
  );
}

// ─── Main component ────────────────────────────────────────────────

export default function StudentLoanCalculator() {
  const [plan,            setPlan]            = useState<LoanPlan>("plan2");
  const [balance,         setBalance]         = useState(45000);
  const [salary,          setSalary]          = useState(30000);
  const [salaryGrowth,    setSalaryGrowth]     = useState(3);
  const [interestRate,    setInterestRate]     = useState(7.3);
  const [yearsGrace,      setYearsGrace]       = useState(0);

  const [inclPostgrad,    setInclPostgrad]     = useState(false);
  const [pgBalance,       setPgBalance]        = useState(12000);
  const [pgInterestRate,  setPgInterestRate]   = useState(7.3);

  const [tab, setTab] = useState<"summary" | "schedule" | "compare">("summary");

  const colours = PLAN_COLOUR_CLASSES[plan];
  const planDef = PLANS[plan];

  const inputs: StudentLoanInputs = {
    loanPlan: plan,
    currentBalance: balance,
    annualSalary: salary,
    annualSalaryGrowthPct: salaryGrowth,
    interestRatePct: interestRate,
    includePostgrad: inclPostgrad,
    postgradBalance: pgBalance,
    postgradInterestRatePct: pgInterestRate,
    yearsUntilRepaymentStarts: yearsGrace,
  };

  const result = useMemo(() => calculateStudentLoan(inputs), [
    plan, balance, salary, salaryGrowth, interestRate, yearsGrace,
    inclPostgrad, pgBalance, pgInterestRate,
  ]);

  const outcomeColour = result.outcome === "paid_off"
    ? "text-green-700"
    : result.outcome === "written_off"
    ? "text-orange-600"
    : "text-stone-600";

  const outcomeLabel = result.outcome === "paid_off"
    ? `Paid off in year ${result.paidOffYear}`
    : result.outcome === "written_off"
    ? `Written off after ${result.writeOffYear} years`
    : "Still repaying at write-off";

  // For compare tab — all plans at same inputs
  const allPlanResults = useMemo(() =>
    Object.keys(PLANS).filter(p => p !== "postgrad").map(p =>
      calculateStudentLoan({ ...inputs, loanPlan: p as LoanPlan, includePostgrad: false })
    ),
  [balance, salary, salaryGrowth, interestRate, yearsGrace]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">

      {/* Banner */}
      <div className={`border-b px-5 py-4 ${colours.light} ${colours.border}`}>
        <div className="flex flex-wrap gap-6 items-center">
          <div>
            <p className="text-xs text-stone-400 mb-0.5">Total you'll repay</p>
            <p className={`text-4xl font-bold leading-none ${outcomeColour}`}>
              {fmtGBPShort(result.totalRepaid)}
            </p>
          </div>
          <div className="h-10 w-px bg-stone-200 hidden sm:block" />
          {[
            { label: "Outcome",             value: outcomeLabel                                        },
            { label: "Monthly (now)",       value: fmtGBP(result.firstMonthlyRepayment, 2) + "/mo"    },
            { label: "Written off",         value: result.amountWrittenOff > 0 ? fmtGBPShort(result.amountWrittenOff) : "—" },
            { label: "Effective interest",  value: result.effectiveCost > 0 ? fmtGBPShort(result.effectiveCost) : "Underpaid" },
          ].map(m => (
            <div key={m.label}>
              <p className="text-xs text-stone-400 mb-0.5">{m.label}</p>
              <p className="text-xl font-semibold text-stone-700">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Outcome progress bar */}
        <div className="mt-3">
          {result.outcome === "written_off" ? (
            <>
              <div className="flex rounded-full overflow-hidden h-3">
                <div className="bg-indigo-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (result.totalRepaid / balance) * 100)}%` }} />
                <div className="bg-orange-300 flex-1" />
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>Repaid {fmtGBPShort(result.totalRepaid)}</span>
                <span>Written off {fmtGBPShort(result.amountWrittenOff)}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex rounded-full overflow-hidden h-3 bg-stone-200">
                <div className="bg-indigo-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (result.totalRepaid / (result.totalRepaid + result.totalInterestPaid)) * 100)}%` }} />
                <div className="bg-rose-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (result.totalInterestPaid / (result.totalRepaid + result.totalInterestPaid)) * 100)}%` }} />
              </div>
              <div className="flex gap-4 text-[10px] text-stone-400 mt-1">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-400 inline-block"/>Principal repaid</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rose-400 inline-block"/>Interest paid</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">

        {/* ── Inputs ──────────────────────────────────────────── */}
        <div className="border-r border-stone-100 p-5 overflow-y-auto max-h-[720px]">

          <SectionLabel>Loan plan</SectionLabel>
          <div className="grid grid-cols-2 gap-2 mb-1">
            {(Object.entries(PLANS) as [LoanPlan, typeof PLANS[LoanPlan]][])
              .filter(([k]) => k !== "postgrad")
              .map(([k, v]) => {
                const c = PLAN_COLOUR_CLASSES[k];
                return (
                  <button key={k} onClick={() => setPlan(k)}
                    className={`py-2.5 px-3 text-xs rounded-xl border text-left transition-colors ${plan === k ? `${c.light} ${c.border} font-semibold` : "border-stone-200 text-stone-500 hover:bg-stone-50"}`}>
                    <span className={`text-xs font-bold ${plan === k ? "" : "text-stone-700"}`}>{v.name}</span>
                    <p className={`text-[10px] mt-0.5 leading-tight ${plan === k ? "text-stone-600" : "text-stone-400"}`}>{v.who.split("·")[0].trim()}</p>
                  </button>
                );
              })}
          </div>
          <p className="text-[11px] text-stone-400 mb-1 leading-snug">{planDef.who}</p>
          <div className={`text-[11px] leading-relaxed px-3 py-2 rounded-lg ${colours.light} ${colours.border} border mt-2 mb-1`}>
            <span className="font-semibold">Threshold:</span> {fmtGBP(planDef.threshold2024)}/yr ·{" "}
            <span className="font-semibold">Rate:</span> {planDef.repaymentRate * 100}% above threshold ·{" "}
            <span className="font-semibold">Write-off:</span> {planDef.writeOffNote}
          </div>

          <SectionLabel>Loan details</SectionLabel>
          <div className="space-y-3">
            <Field label="Current loan balance">
              <NumInput value={balance} onChange={setBalance} prefix="£" step={500} />
            </Field>
            <Field label="Years until repayment starts" hint="Usually 0 if already graduated and earning">
              <NumInput value={yearsGrace} onChange={setYearsGrace} step={1} min={0} max={6} />
            </Field>
          </div>

          <SectionLabel>Income & growth</SectionLabel>
          <div className="space-y-4">
            <Field label="Current gross annual salary">
              <NumInput value={salary} onChange={setSalary} prefix="£" step={500} />
            </Field>
            <SliderInput
              label="Annual salary growth" display={`${salaryGrowth}%`}
              value={salaryGrowth} onChange={setSalaryGrowth} min={0} max={10} step={0.5}
            />
          </div>

          <SectionLabel>Interest rate</SectionLabel>
          <Field label="Annual interest rate" hint="Current Plan 2/5 rate is ~7.3% (RPI-linked, changes Sept each year)">
            <NumInput value={interestRate} onChange={setInterestRate} suffix="%" step={0.1} min={0} max={15} />
          </Field>
          <div className="mt-2 text-[11px] text-stone-400 leading-relaxed">
            Interest is set annually each September based on RPI inflation. {planDef.baseInterestNote}.
          </div>

          <SectionLabel>Postgraduate loan</SectionLabel>
          <div className="space-y-3">
            <Toggle checked={inclPostgrad} onChange={setInclPostgrad}
              label="I also have a Postgraduate Loan (Master's / Doctoral)" />
            {inclPostgrad && (
              <>
                <Field label="Postgraduate loan balance">
                  <NumInput value={pgBalance} onChange={setPgBalance} prefix="£" step={500} />
                </Field>
                <Field label="Postgrad interest rate" hint="PGL rate is RPI + 3% — currently ~7.3%">
                  <NumInput value={pgInterestRate} onChange={setPgInterestRate} suffix="%" step={0.1} min={0} max={15} />
                </Field>
                <div className="text-[11px] text-stone-400 p-2.5 bg-stone-50 rounded-lg leading-relaxed">
                  Both loans are repaid simultaneously. Plan loan: 9% above {fmtGBP(planDef.threshold2024)}. Postgrad: 6% above £21,000/yr.
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Results ──────────────────────────────────────────── */}
        <div className="p-5">
          {/* Tabs */}
          <div className="flex gap-1 mb-5 bg-stone-100 rounded-lg p-1">
            {(["summary", "schedule", "compare"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${tab === t ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>
                {t === "compare" ? "Plan comparison" : t === "schedule" ? "Year by year" : "Summary"}
              </button>
            ))}
          </div>

          {/* ── Summary ───────────────── */}
          {tab === "summary" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Opening balance",       value: fmtGBP(balance),                          bg: "bg-stone-50" },
                  { label: "Repayment threshold",   value: `${fmtGBP(planDef.threshold2024)}/yr`,    bg: "bg-stone-50" },
                  { label: "First monthly payment", value: fmtGBP(result.firstMonthlyRepayment, 2),  bg: colours.light },
                  { label: "Peak monthly payment",  value: fmtGBP(result.peakMonthlyRepayment, 2),   bg: "bg-stone-50" },
                  { label: "Total repaid",          value: fmtGBP(result.totalRepaid),               bg: colours.light, bold: true },
                  { label: "Written off",           value: result.amountWrittenOff > 0 ? fmtGBP(result.amountWrittenOff) : "£0 (paid off)", bg: result.amountWrittenOff > 0 ? "bg-orange-50" : "bg-stone-50" },
                ].map(m => (
                  <div key={m.label} className={`${m.bg} rounded-xl p-3`}>
                    <p className="text-xs text-stone-400 mb-1">{m.label}</p>
                    <p className={`${(m as any).bold ? "text-lg font-bold text-indigo-700" : "text-base font-semibold text-stone-800"} leading-tight`}>{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Outcome callout */}
              <div className={`border rounded-xl p-4 ${result.outcome === "paid_off" ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}>
                <p className={`text-sm font-semibold mb-1 ${result.outcome === "paid_off" ? "text-green-800" : "text-orange-800"}`}>
                  {result.outcome === "paid_off"
                    ? `✓ Loan fully repaid after ~${result.paidOffYear} repayment years`
                    : `Loan written off after ${result.writeOffYear} years — ${fmtGBP(result.amountWrittenOff)} cancelled`}
                </p>
                <p className={`text-xs leading-relaxed ${result.outcome === "paid_off" ? "text-green-700" : "text-orange-700"}`}>
                  {result.outcome === "paid_off"
                    ? `You will repay the full balance plus ${fmtGBP(result.totalInterestPaid)} in interest. Total cost: ${fmtGBP(result.totalRepaid)}.`
                    : `After ${result.writeOffYear} years of repayments totalling ${fmtGBP(result.totalRepaid)}, the remaining ${fmtGBP(result.amountWrittenOff)} balance is cancelled by the Student Loans Company. This is the norm for many graduates — the system is designed this way.`}
                </p>
              </div>

              {/* Postgrad summary */}
              {inclPostgrad && result.pgOutcome && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-rose-800 mb-1">Postgraduate Loan</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-rose-700">
                    <span>Balance: {fmtGBP(pgBalance)}</span>
                    <span>Repaid: {fmtGBP(result.pgTotalRepaid ?? 0)}</span>
                    <span>Threshold: £21,000/yr at 6%</span>
                    <span>Written off: {fmtGBP(result.pgAmountWrittenOff ?? 0)}</span>
                  </div>
                </div>
              )}

              {/* Balance over time chart */}
              <div>
                <p className="text-xs font-medium text-stone-400 mb-2">Balance over time</p>
                <div className="space-y-1">
                  {result.schedule
                    .filter((_, i) => i === 0 || (i + 1) % 5 === 0 || i === result.schedule.length - 1)
                    .map(row => {
                      const maxBal = balance * 1.3;
                      const w = Math.max(0, (row.closingBalance / maxBal) * 100);
                      return (
                        <div key={row.year} className="flex items-center gap-2">
                          <span className="text-[10px] text-stone-400 w-10 text-right shrink-0">Yr {row.year}</span>
                          <div className="flex-1 bg-stone-100 rounded-full h-3 overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-300 ${row.isWrittenOff ? "bg-orange-400" : row.isPaidOff ? "bg-green-400" : "bg-indigo-400"}`}
                              style={{ width: `${w}%` }} />
                          </div>
                          <span className="text-[10px] text-stone-500 w-16 text-right tabular-nums shrink-0">
                            {row.isPaidOff ? "Paid off" : row.isWrittenOff ? "Written off" : fmtGBPShort(row.closingBalance)}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ── Schedule ──────────────── */}
          {tab === "schedule" && (
            <div>
              <div className="max-h-[560px] overflow-y-auto rounded-xl border border-stone-200">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3 text-left font-medium text-stone-500">Year</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Salary</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Monthly</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Annual repaid</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Interest</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map(row => (
                      <tr key={row.year}
                        className={`border-b border-stone-100 last:border-0 ${row.isPaidOff ? "bg-green-50/40" : row.isWrittenOff ? "bg-orange-50/60" : "hover:bg-stone-50"}`}>
                        <td className="py-2 px-3 font-medium text-stone-600">
                          {row.year}
                          {row.isWrittenOff && <span className="ml-1 text-[10px] text-orange-600 font-semibold">WRITE-OFF</span>}
                          {row.isPaidOff && row.annualRepayment > 0 && <span className="ml-1 text-[10px] text-green-600 font-semibold">PAID OFF</span>}
                          {row.year <= yearsGrace && <span className="ml-1 text-[10px] text-stone-400">(pre-repay)</span>}
                        </td>
                        <td className="py-2 px-3 text-right text-stone-600">{row.annualSalary > 0 ? fmtGBP(row.annualSalary) : "—"}</td>
                        <td className="py-2 px-3 text-right text-indigo-600 font-medium">{row.monthlyRepayment > 0 ? fmtGBP(row.monthlyRepayment, 2) : "—"}</td>
                        <td className="py-2 px-3 text-right text-stone-700">{row.annualRepayment > 0 ? fmtGBP(row.annualRepayment) : "—"}</td>
                        <td className="py-2 px-3 text-right text-rose-500">{fmtGBP(row.interestCharged)}</td>
                        <td className="py-2 px-3 text-right font-semibold text-stone-800">
                          {row.isPaidOff && row.annualRepayment === 0 ? "£0" : fmtGBP(row.closingBalance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-stone-400 mt-2">Interest shown is accrued each year. Repayment taken as 9% of income above the {fmtGBP(planDef.threshold2024)} threshold.</p>
            </div>
          )}

          {/* ── Compare plans ─────────── */}
          {tab === "compare" && (
            <div className="space-y-4">
              <p className="text-xs text-stone-400">Same balance, salary, and growth rate across all plans.</p>
              <div className="rounded-xl border border-stone-200 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3 text-left font-medium text-stone-500">Plan</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Threshold</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Write-off</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Total repaid</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPlanResults.map(r => {
                      const c = PLAN_COLOUR_CLASSES[r.plan.id];
                      return (
                        <tr key={r.plan.id}
                          className={`border-b border-stone-100 last:border-0 ${r.plan.id === plan ? `${c.light}` : "hover:bg-stone-50"}`}>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.badge}`}>
                              {r.plan.name}
                            </span>
                            {r.plan.id === plan && <span className="ml-1 text-[10px] text-stone-400">★ yours</span>}
                          </td>
                          <td className="py-2.5 px-3 text-right text-stone-600">{fmtGBP(r.plan.threshold2024)}</td>
                          <td className="py-2.5 px-3 text-right text-stone-600">{r.plan.writeOffYears} yrs</td>
                          <td className="py-2.5 px-3 text-right font-semibold text-stone-800">{fmtGBPShort(r.totalRepaid)}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className={`text-[10px] font-medium ${r.outcome === "paid_off" ? "text-green-600" : "text-orange-600"}`}>
                              {r.outcome === "paid_off" ? `Paid off yr ${r.paidOffYear}` : `Written off yr ${r.writeOffYear}`}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 leading-relaxed">
                <strong>Important:</strong> Your loan plan is fixed based on when and where you studied — you cannot choose which plan applies to you. This comparison is for informational purposes only.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
