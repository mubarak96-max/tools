"use client";

import { useState, useMemo } from "react";
import {
  calculateAffordability,
  fmtAUD,
  fmtAUDShort,
  fmtPct,
  STATES,
  type AffordabilityInputs,
  type AustralianState,
} from "@/lib/auAffordability";

// ─── Primitives ────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-500 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-stone-400 mt-1 leading-snug">{hint}</p>}
    </div>
  );
}

function DollarInput({ value, onChange, step = 1000 }: { value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none">$</span>
      <input type="number" value={value} min={0} step={step}
        onChange={e => onChange(Math.max(0, Number(e.target.value)))}
        className="w-full pl-7 pr-3 py-2.5 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-green-500" />
    </div>
  );
}

function PctInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="relative">
      <input type="number" value={value} min={0.1} max={20} step={0.05}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full pl-3 pr-8 py-2.5 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-green-500" />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none">%</span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 mt-6 first:mt-0">{children}</p>;
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <div onClick={() => onChange(!checked)}
        className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${checked ? "bg-green-500" : "bg-stone-200"}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
      </div>
      <span className="text-xs text-stone-600">{label}</span>
    </label>
  );
}

function Metric({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: "green" | "red" | "amber" | "blue" | "stone" }) {
  const bg = { green: "bg-green-50", red: "bg-red-50", amber: "bg-amber-50", blue: "bg-blue-50", stone: "bg-stone-50" }[accent ?? "stone"];
  const txt = { green: "text-green-700", red: "text-red-600", amber: "text-amber-700", blue: "text-blue-700", stone: "text-stone-800" }[accent ?? "stone"];
  return (
    <div className={`${bg} rounded-xl p-3.5`}>
      <p className="text-xs text-stone-400 mb-1">{label}</p>
      <p className={`text-lg font-bold leading-tight ${txt}`}>{value}</p>
      {sub && <p className="text-[11px] text-stone-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────

export default function HouseAffordabilityCalculator() {
  // Income
  const [income,        setIncome]        = useState(120000);
  const [partnerIncome, setPartnerIncome] = useState(0);
  const [otherIncome,   setOtherIncome]   = useState(0);

  // Expenses
  const [expenses,      setExpenses]      = useState(4000);
  const [debts,         setDebts]         = useState(0);

  // Purchase
  const [savings,       setSavings]       = useState(100000);
  const [propValue,     setPropValue]     = useState(750000);
  const [state,         setState]         = useState<AustralianState>("VIC");
  const [isFHB,         setIsFHB]         = useState(false);
  const [isApartment,   setIsApartment]   = useState(false);
  const [extraCosts,    setExtraCosts]    = useState(5000);

  // Mortgage
  const [rate,          setRate]          = useState(6.25);
  const [term,          setTerm]          = useState(30);

  const [tab, setTab] = useState<"summary" | "costs" | "schedule">("summary");

  const inputs: AffordabilityInputs = {
    grossAnnualIncome: income, partnerIncome, otherIncome,
    monthlyLivingExpenses: expenses, existingDebtMonthly: debts,
    savings, propertyValue: propValue, state,
    isFirstHomeBuyer: isFHB, isApartment,
    interestRate: rate, loanTermYears: term,
    additionalUpfrontCosts: extraCosts,
  };

  const r = useMemo(() => calculateAffordability(inputs), [
    income, partnerIncome, otherIncome, expenses, debts,
    savings, propValue, state, isFHB, isApartment, extraCosts, rate, term,
  ]);

  const affordColour = r.canAfford
    ? r.repaymentToIncomeRatio < 30 ? "green" : "amber"
    : "red";

  const bannerBg = r.canAfford
    ? r.repaymentToIncomeRatio < 30 ? "bg-green-50 border-green-100" : "bg-amber-50 border-amber-100"
    : "bg-red-50 border-red-100";

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">

      {/* Banner */}
      <div className={`border-b px-5 py-4 ${bannerBg}`}>
        <div className="flex flex-wrap gap-6 items-center">
          <div>
            <p className="text-xs text-stone-400 mb-0.5">
              {r.canAfford ? "Estimated borrowing capacity" : "Borrowing shortfall"}
            </p>
            <p className={`text-4xl font-bold leading-none ${r.canAfford ? "text-stone-900" : "text-red-600"}`}>
              {r.canAfford ? fmtAUDShort(r.maxBorrowingCapacity) : fmtAUDShort(Math.abs(r.affordabilityGap))}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              {r.canAfford
                ? `You need to borrow ${fmtAUDShort(r.loanAmount)} — within your estimated capacity`
                : `You need ${fmtAUDShort(r.loanAmount)} but estimated capacity is ${fmtAUDShort(r.maxBorrowingCapacity)}`}
            </p>
          </div>
          <div className="h-10 w-px bg-stone-200 hidden sm:block" />
          {[
            { label: "Monthly repayment", value: fmtAUD(r.monthlyRepayment), cls: "text-stone-700" },
            { label: "Deposit",           value: fmtAUDShort(r.depositAmount) + ` (${fmtPct(r.depositPct)})`, cls: "text-stone-700" },
            { label: "LVR",              value: fmtPct(r.lvr),              cls: r.lvr > 80 ? "text-amber-600" : "text-green-700" },
            { label: "Repay-to-income",  value: fmtPct(r.repaymentToIncomeRatio), cls: r.repaymentToIncomeRatio > 35 ? "text-red-600" : "text-stone-700" },
          ].map(m => (
            <div key={m.label}>
              <p className="text-xs text-stone-400 mb-0.5">{m.label}</p>
              <p className={`text-xl font-semibold ${m.cls}`}>{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">

        {/* ── Inputs ──────────────────────────────────────────── */}
        <div className="border-r border-stone-100 p-5 overflow-y-auto max-h-[760px] space-y-1">

          <SectionLabel>Your income</SectionLabel>
          <div className="space-y-3">
            <Field label="Your gross annual income" hint="Before tax">
              <DollarInput value={income} onChange={setIncome} />
            </Field>
            <Field label="Partner's gross annual income" hint="Leave 0 if buying solo">
              <DollarInput value={partnerIncome} onChange={setPartnerIncome} />
            </Field>
            <Field label="Other income (rental, dividends)" hint="Annual total">
              <DollarInput value={otherIncome} onChange={setOtherIncome} />
            </Field>
          </div>

          <SectionLabel>Monthly expenses & debts</SectionLabel>
          <div className="space-y-3">
            <Field label="Monthly living expenses" hint="Food, utilities, transport, subscriptions etc.">
              <DollarInput value={expenses} onChange={setExpenses} step={100} />
            </Field>
            <Field label="Existing debt repayments" hint="Car loan, HECS, credit card minimums per month">
              <DollarInput value={debts} onChange={setDebts} step={100} />
            </Field>
          </div>

          <SectionLabel>Purchase details</SectionLabel>
          <div className="space-y-3">
            <Field label="Property price">
              <DollarInput value={propValue} onChange={setPropValue} step={5000} />
            </Field>
            <Field label="Total savings / deposit available">
              <DollarInput value={savings} onChange={setSavings} step={5000} />
            </Field>
            <Field label="State / Territory">
              <select value={state} onChange={e => setState(e.target.value as AustralianState)}
                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-green-500">
                {Object.values(STATES).map(s => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Additional costs" hint="Legal fees, building inspection, removalists">
              <DollarInput value={extraCosts} onChange={setExtraCosts} step={500} />
            </Field>
            <div className="space-y-2.5 p-3 bg-stone-50 rounded-xl border border-stone-100">
              <Toggle checked={isFHB} onChange={setIsFHB} label="First home buyer" />
              <Toggle checked={isApartment} onChange={setIsApartment} label="Apartment / unit (not house)" />
            </div>
            {isFHB && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-700 leading-relaxed">
                <strong>First Home Buyer ({state})</strong><br />
                FHOG: {r.fhogGrant > 0 ? fmtAUD(r.fhogGrant) : "Not applicable at this price"}<br />
                Stamp duty: {r.stampDutyConcessionApplied ? "Concession applied ✓" : "No concession at this price"}<br />
                {STATES[state].fhbStampDutyExemptionNote}
              </div>
            )}
          </div>

          <SectionLabel>Mortgage details</SectionLabel>
          <div className="space-y-3">
            <Field label="Interest rate (p.a.)" hint="Variable rate ~6.0–6.5% for owner-occupier P&I (2024)">
              <PctInput value={rate} onChange={setRate} />
            </Field>
            <Field label="Loan term">
              <div className="flex gap-2">
                {[20, 25, 30].map(y => (
                  <button key={y} onClick={() => setTerm(y)}
                    className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${term === y ? "bg-green-50 border-green-300 text-green-700 font-medium" : "border-stone-200 text-stone-500 hover:bg-stone-50"}`}>
                    {y} years
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </div>

        {/* ── Results ──────────────────────────────────────────── */}
        <div className="p-5">
          {/* Tabs */}
          <div className="flex gap-1 mb-5 bg-stone-100 rounded-lg p-1">
            {(["summary", "costs", "schedule"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${tab === t ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>
                {t === "costs" ? "Upfront costs" : t === "schedule" ? "Loan schedule" : "Summary"}
              </button>
            ))}
          </div>

          {/* ── Summary ─────────────────── */}
          {tab === "summary" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Metric label="Monthly repayment (actual)" value={fmtAUD(r.monthlyRepayment)} sub={`At ${fmtPct(rate)} p.a.`} accent="stone" />
                <Metric label="Assessment rate repayment" value={fmtAUD(r.monthlyRepaymentAtAssessment)} sub={`At ${fmtPct(r.assessmentRate)} (APRA buffer +3%)`} accent="amber" />
                <Metric label="Loan amount" value={fmtAUDShort(r.loanAmount)} sub={`LVR ${fmtPct(r.lvr)}`} accent={r.lvr > 80 ? "amber" : "stone"} />
                <Metric label="Deposit" value={fmtAUDShort(r.depositAmount)} sub={`${fmtPct(r.depositPct)} of property`} accent="green" />
                <Metric label="Repayment-to-income" value={fmtPct(r.repaymentToIncomeRatio)} sub="< 30% is comfortable" accent={r.repaymentToIncomeRatio > 35 ? "red" : r.repaymentToIncomeRatio > 30 ? "amber" : "green"} />
                <Metric label="Max borrowing (est.)" value={fmtAUDShort(r.maxBorrowingCapacity)} sub="APRA serviceability estimate" accent={r.canAfford ? "green" : "red"} />
              </div>

              {/* Affordability verdict */}
              <div className={`border rounded-xl p-4 ${r.canAfford ? (r.repaymentToIncomeRatio < 30 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200") : "bg-red-50 border-red-200"}`}>
                <p className={`text-sm font-semibold mb-1 ${r.canAfford ? (r.repaymentToIncomeRatio < 30 ? "text-green-800" : "text-amber-800") : "text-red-800"}`}>
                  {r.canAfford
                    ? r.repaymentToIncomeRatio < 30
                      ? "✓ This property looks affordable"
                      : "⚠ Technically affordable but repayments are high"
                    : "✗ Borrowing required exceeds estimated capacity"}
                </p>
                <p className={`text-xs leading-relaxed ${r.canAfford ? (r.repaymentToIncomeRatio < 30 ? "text-green-700" : "text-amber-700") : "text-red-700"}`}>
                  {r.canAfford
                    ? `Your estimated monthly repayment of ${fmtAUD(r.monthlyRepayment)} is ${fmtPct(r.repaymentToIncomeRatio)} of your gross monthly income. Banks typically assess at the APRA rate of ${fmtPct(r.assessmentRate)}, giving a stress-tested repayment of ${fmtAUD(r.monthlyRepaymentAtAssessment)}/month.`
                    : `You need to borrow ${fmtAUDShort(r.loanAmount)} but your estimated capacity is ${fmtAUDShort(r.maxBorrowingCapacity)}. Consider a lower-priced property, larger deposit, reducing debts, or increasing income.`}
                </p>
              </div>

              {/* LMI warning */}
              {r.lmi > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-700 leading-relaxed">
                  <strong>LMI applies ({fmtAUD(r.lmi)}):</strong> With an LVR of {fmtPct(r.lvr)}, Lenders Mortgage Insurance is required. This can be capitalised into the loan (added to borrowing). A 20% deposit ({fmtAUDShort(propValue * 0.2)}) would avoid LMI.
                </div>
              )}

              {/* Savings shortfall */}
              {r.savingsShortfall > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-700 leading-relaxed">
                  <strong>Savings shortfall: {fmtAUD(r.savingsShortfall)}</strong> — your savings don't cover the upfront costs. Estimated {r.yearsToSaveForDeposit.toFixed(1)} additional years of saving may be needed at your current income level.
                </div>
              )}

              {/* Ongoing costs */}
              <div>
                <p className="text-xs font-medium text-stone-400 mb-2">Estimated ongoing costs (annual)</p>
                <div className="rounded-xl border border-stone-200 overflow-hidden">
                  {[
                    { label: "Council rates",     value: r.ongoingCosts.councilRates },
                    { label: isApartment ? "Body corporate fees" : "Maintenance (1% of value)", value: isApartment ? r.ongoingCosts.bodyCorpFees : propValue * r.ongoingCosts.maintenancePct },
                    { label: "Home & contents insurance", value: r.ongoingCosts.homeInsurance },
                    { label: "Water rates",       value: r.ongoingCosts.waterRates },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between px-4 py-2.5 border-b border-stone-100 last:border-0 text-xs hover:bg-stone-50">
                      <span className="text-stone-500">{item.label}</span>
                      <span className="font-medium text-stone-700">{fmtAUD(item.value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between px-4 py-2.5 bg-stone-50 border-t border-stone-200 text-xs font-semibold">
                    <span className="text-stone-700">Total annual ongoing</span>
                    <span className="text-stone-800">{fmtAUD(r.totalAnnualOngoing)} ({fmtAUD(r.totalMonthlyOngoing)}/mo)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Upfront costs ─────────────── */}
          {tab === "costs" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-stone-200 overflow-hidden">
                <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200">
                  <p className="text-xs font-medium text-stone-500">Upfront cost breakdown — {STATES[state].name}</p>
                </div>
                <div className="divide-y divide-stone-100">
                  {[
                    { label: "Property purchase price",  value: propValue, bold: false, cls: "text-stone-800" },
                    { label: `Stamp duty${r.stampDutyConcessionApplied ? " (concession applied)" : ""}`, value: r.stampDuty, bold: false, cls: r.stampDutyConcessionApplied ? "text-green-600" : "text-red-600", hint: r.stampDutyConcessionApplied ? r.stampDutyConcessionNote : "" },
                    { label: "Lenders Mortgage Insurance (LMI)", value: r.lmi, bold: false, cls: r.lmi > 0 ? "text-amber-600" : "text-stone-400" },
                    { label: "Legal / conveyancing / inspections", value: extraCosts, bold: false, cls: "text-stone-600" },
                    { label: "Total upfront costs", value: r.totalUpfrontCosts, bold: true, cls: "text-stone-900" },
                    ...(r.fhogGrant > 0 ? [{ label: "Less: FHOG grant", value: -r.fhogGrant, bold: false, cls: "text-green-600" }] : []),
                    { label: "Your savings",             value: savings, bold: false, cls: "text-green-700" },
                    { label: "Remaining deposit for home", value: r.depositAmount, bold: true, cls: "text-green-700" },
                  ].map((row, i) => (
                    <div key={i} className={`px-4 py-3 flex flex-col gap-0.5 ${(row as any).bold ? "bg-stone-50" : ""}`}>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm ${(row as any).bold ? "font-semibold text-stone-700" : "text-stone-500"}`}>{row.label}</p>
                        <p className={`text-sm font-semibold tabular-nums ${row.cls}`}>
                          {row.value < 0 ? `− ${fmtAUD(-row.value)}` : fmtAUD(row.value)}
                        </p>
                      </div>
                      {(row as any).hint && <p className="text-[11px] text-stone-400">{(row as any).hint}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-stone-50 rounded-xl p-3.5">
                  <p className="text-xs text-stone-400 mb-1">Loan amount</p>
                  <p className="text-xl font-bold text-stone-900">{fmtAUD(r.loanAmount)}</p>
                  <p className="text-xs text-stone-400 mt-0.5">LVR {fmtPct(r.lvr)}</p>
                </div>
                <div className="bg-stone-50 rounded-xl p-3.5">
                  <p className="text-xs text-stone-400 mb-1">Total cost to settle</p>
                  <p className="text-xl font-bold text-stone-900">{fmtAUD(r.totalUpfrontCosts)}</p>
                  <p className="text-xs text-stone-400 mt-0.5">Stamp duty + LMI + costs</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Loan schedule ─────────────── */}
          {tab === "schedule" && (
            <div>
              <p className="text-xs text-stone-400 mb-3">Assumes 4% annual property value growth. Balance and equity in today's dollars.</p>
              <div className="max-h-[540px] overflow-y-auto rounded-xl border border-stone-200">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3 text-left font-medium text-stone-500">Year</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Principal paid</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Interest paid</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Balance</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Equity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.yearlySchedule.map(row => (
                      <tr key={row.year} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                        <td className="py-2 px-3 font-medium text-stone-600">{row.year}</td>
                        <td className="py-2 px-3 text-right text-green-600">{fmtAUD(row.principalPaid)}</td>
                        <td className="py-2 px-3 text-right text-red-500">{fmtAUD(row.interestPaid)}</td>
                        <td className="py-2 px-3 text-right font-medium text-stone-700">{fmtAUD(row.closingBalance)}</td>
                        <td className="py-2 px-3 text-right font-semibold text-emerald-700">{fmtAUD(row.equity)}</td>
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
