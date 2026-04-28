"use client";

import { useState, useMemo } from "react";
import { CheckCircle2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormState {
  homePrice: string;
  downPayment: string;
  downType: "dollars" | "percent";
  loanTerm: string;
  interestRate: string;
  creditScore: string;
  loanType: string;
  annualIncome: string;
  propertyTax: string;
  homeInsurance: string;
}

interface PMIResult {
  loanAmount: number;
  downDollars: number;
  downPct: number;
  ltv: number;
  pmiRate: number;
  monthlyPMI: number;
  annualPMI: number;
  monthlyPrincipalInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  totalMonthlyPayment: number;
  pmiRequired: boolean;
  monthsUntilDropOff: number;
  yearsUntilDropOff: number;
  totalPMIPaid: number;
  equityNeeded: number;
  breakEvenMonth: number;
  dtiRatio: number | null;
  pmiTier: string;
  equityNow: number;
  equityPct: number;
  amortSchedule: { month: number; balance: number; equity: number; pmiActive: boolean }[];
}

// ─── 2026 PMI Rate Table ──────────────────────────────────────────────────────
function getPMIRate(ltv: number, creditScore: number, loanType: string): { rate: number; tier: string } {
  if (ltv <= 80) return { rate: 0, tier: "No PMI Required" };

  const scoreTier =
    creditScore >= 760 ? 0 :
    creditScore >= 740 ? 1 :
    creditScore >= 720 ? 2 :
    creditScore >= 700 ? 3 :
    creditScore >= 680 ? 4 :
    creditScore >= 660 ? 5 : 6;

  const scoreTierLabel =
    creditScore >= 760 ? "760+" :
    creditScore >= 740 ? "740–759" :
    creditScore >= 720 ? "720–739" :
    creditScore >= 700 ? "700–719" :
    creditScore >= 680 ? "680–699" :
    creditScore >= 660 ? "660–679" : "<660";

  const rateTable: Record<string, number[]> = {
    "80.01–85.00": [0.19, 0.22, 0.26, 0.31, 0.38, 0.46, 0.58],
    "85.01–90.00": [0.37, 0.43, 0.50, 0.58, 0.68, 0.81, 0.97],
    "90.01–95.00": [0.52, 0.60, 0.69, 0.80, 0.95, 1.13, 1.35],
    "95.01–97.00": [0.68, 0.78, 0.90, 1.04, 1.22, 1.44, 1.71],
  };

  let band = "";
  if (ltv <= 85) band = "80.01–85.00";
  else if (ltv <= 90) band = "85.01–90.00";
  else if (ltv <= 95) band = "90.01–95.00";
  else band = "95.01–97.00";

  let rate = rateTable[band][scoreTier];

  if (loanType === "fha") {
    rate = ltv > 90 ? 0.55 : 0.50;
    return { rate, tier: `FHA MIP — ${scoreTierLabel} FICO` };
  }
  if (loanType === "va") return { rate: 0, tier: "VA Loan — No PMI" };

  return { rate, tier: `Conventional — ${scoreTierLabel} FICO, LTV ${band}` };
}

function monthlyPI(principal: number, annualRate: number, years: number): number {
  if (annualRate === 0) return principal / (years * 12);
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function calculate(f: FormState): PMIResult | null {
  const homePrice = parseFloat(f.homePrice.replace(/,/g, "")) || 0;
  const interestRate = parseFloat(f.interestRate) || 0;
  const loanTerm = parseInt(f.loanTerm) || 30;
  const creditScore = parseInt(f.creditScore) || 740;
  const annualIncome = parseFloat(f.annualIncome.replace(/,/g, "")) || 0;
  const annualPropertyTax = parseFloat(f.propertyTax.replace(/,/g, "")) || 0;
  const annualInsurance = parseFloat(f.homeInsurance.replace(/,/g, "")) || 0;

  if (homePrice <= 0 || interestRate <= 0) return null;

  let downDollars: number;
  if (f.downType === "percent") {
    downDollars = homePrice * (parseFloat(f.downPayment) / 100);
  } else {
    downDollars = parseFloat(f.downPayment.replace(/,/g, "")) || 0;
  }

  const loanAmount = homePrice - downDollars;
  if (loanAmount <= 0) return null;

  const downPct = (downDollars / homePrice) * 100;
  const ltv = (loanAmount / homePrice) * 100;
  const { rate: pmiRate, tier: pmiTier } = getPMIRate(ltv, creditScore, f.loanType);

  const pmiRequired = pmiRate > 0;
  const monthlyPMI = pmiRequired ? (loanAmount * (pmiRate / 100)) / 12 : 0;
  const annualPMI = monthlyPMI * 12;

  const monthlyPI_ = monthlyPI(loanAmount, interestRate, loanTerm);
  const monthlyPropertyTax = annualPropertyTax / 12;
  const monthlyInsurance = annualInsurance / 12;
  const totalMonthlyPayment = monthlyPI_ + monthlyPropertyTax + monthlyInsurance + monthlyPMI;

  const dropOffBalance = homePrice * 0.80;
  const r = interestRate / 100 / 12;
  const n = loanTerm * 12;
  let balance = loanAmount;
  let monthsUntilDropOff = 0;
  let totalPMIPaid = 0;
  const amortSchedule: PMIResult["amortSchedule"] = [];

  for (let m = 1; m <= n; m++) {
    const interestCharge = balance * r;
    const principalCharge = monthlyPI_ - interestCharge;
    balance = Math.max(0, balance - principalCharge);
    const equity = homePrice - balance;
    const pmiActive = balance > dropOffBalance;
    if (pmiActive && pmiRequired) totalPMIPaid += monthlyPMI;
    if (balance <= dropOffBalance && monthsUntilDropOff === 0) monthsUntilDropOff = m;
    if (m <= 360) amortSchedule.push({ month: m, balance: Math.round(balance), equity: Math.round(equity), pmiActive });
    if (balance <= 0.01) break;
  }
  if (monthsUntilDropOff === 0) monthsUntilDropOff = n;

  const yearsUntilDropOff = Math.floor(monthsUntilDropOff / 12);
  const equityNeeded = Math.max(0, loanAmount - dropOffBalance);
  const equityNow = downDollars;
  const equityPct = (equityNow / homePrice) * 100;
  const dtiRatio = annualIncome > 0 ? (totalMonthlyPayment / (annualIncome / 12)) * 100 : null;

  return {
    loanAmount,
    downDollars,
    downPct,
    ltv,
    pmiRate,
    monthlyPMI,
    annualPMI,
    monthlyPrincipalInterest: monthlyPI_,
    monthlyPropertyTax,
    monthlyInsurance,
    totalMonthlyPayment,
    pmiRequired,
    monthsUntilDropOff,
    yearsUntilDropOff,
    totalPMIPaid: Math.round(totalPMIPaid),
    equityNeeded,
    breakEvenMonth: monthsUntilDropOff,
    dtiRatio,
    pmiTier,
    equityNow,
    equityPct,
    amortSchedule,
  };
}

const fmt$ = (n: number, dec = 0) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
const fmtPct = (n: number, dec = 2) => n.toFixed(dec) + "%";

function Field({ label, hint, prefix, suffix, name, value, onChange, min, max, step, placeholder }: any) {
  return (
    <div className="field">
      <label>{label}</label>
      {hint && <p className="hint">{hint}</p>}
      <div className="input-wrap">
        {prefix && <span className="adorn">{prefix}</span>}
        <input type="number" name={name} value={value} min={min} max={max}
          step={step ?? 1} placeholder={placeholder}
          onChange={e => onChange(name, e.target.value)} />
        {suffix && <span className="adorn suf">{suffix}</span>}
      </div>
    </div>
  );
}

function EquityBar({ equityPct }: { equityPct: number; ltv: number }) {
  const eq = Math.min(100, equityPct);
  return (
    <div className="equity-bar-wrap">
      <div className="equity-bar-track">
        <div className="equity-fill" style={{ width: `${eq}%` }} />
        <div className="target-line" style={{ left: "20%" }} title="20% equity — PMI removal threshold" />
      </div>
      <div className="equity-labels">
        <span className="eq-label" style={{ left: `${Math.min(eq, 90)}%` }}>{fmtPct(eq, 1)} equity</span>
        <span className="eq-target">20% goal</span>
      </div>
    </div>
  );
}

function Donut({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  if (total === 0) return null;
  const r = 54, cx = 64, cy = 64, circumference = 2 * Math.PI * r;
  let offset = 0;
  const arcs = segments.map(seg => {
    const pct = seg.value / total;
    const dash = pct * circumference;
    const arc = { ...seg, dash, offset };
    offset += dash;
    return arc;
  });
  return (
    <svg viewBox="0 0 128 128" className="donut-svg">
      {arcs.map((arc, i) => (
        <circle key={i} cx={cx} cy={cy} r={r}
          fill="none" stroke={arc.color}
          strokeWidth={18}
          strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
          strokeDashoffset={-arc.offset}
          style={{ transform: "rotate(-90deg)", transformOrigin: "64px 64px" }} />
      ))}
      <circle cx={cx} cy={cy} r={44} fill="var(--paper)" />
    </svg>
  );
}

export default function PMICalculator() {
  const [form, setForm] = useState<FormState>({
    homePrice: "450000",
    downPayment: "10",
    downType: "percent",
    loanTerm: "30",
    interestRate: "6.75",
    creditScore: "740",
    loanType: "conventional",
    annualIncome: "0",
    propertyTax: "5400",
    homeInsurance: "1800",
  });
  const [showChart, setShowChart] = useState(false);

  const set = (n: string, v: string) => setForm(p => ({ ...p, [n]: v }));
  const result = useMemo(() => calculate(form), [form]);

  const donutSegs = result ? [
    { value: result.monthlyPrincipalInterest, color: "#2d5a27", label: "Principal & Interest" },
    { value: result.monthlyPMI, color: "#c8541a", label: "PMI" },
    { value: result.monthlyPropertyTax, color: "#7a6b3c", label: "Property Tax" },
    { value: result.monthlyInsurance, color: "#4a7c59", label: "Insurance" },
  ] : [];

  return (
    <div className="calc-grid">
      <div className="inputs-panel">
        <div className="panel-head"><span className="dot" />Your Loan Details</div>

        <div className="sec-label">Home & Down Payment</div>
        <Field label="Home Purchase Price" prefix="$" name="homePrice" value={form.homePrice} onChange={set} min={0} step={5000} placeholder="450000" />

        <div className="field">
          <label>Down Payment</label>
          <div className="dp-toggle">
            <button className={`dp-btn ${form.downType === "percent" ? "on" : ""}`} onClick={() => setForm(p => ({ ...p, downType: "percent" }))}>Percent (%)</button>
            <button className={`dp-btn ${form.downType === "dollars" ? "on" : ""}`} onClick={() => setForm(p => ({ ...p, downType: "dollars" }))}>Dollar ($)</button>
          </div>
          <div className="input-wrap">
            {form.downType === "dollars" && <span className="adorn">$</span>}
            <input type="number" value={form.downPayment} min={0} max={form.downType === "percent" ? 100 : undefined} step={form.downType === "percent" ? 0.5 : 1000} placeholder={form.downType === "percent" ? "10" : "45000"} onChange={e => set("downPayment", e.target.value)} />
            {form.downType === "percent" && <span className="adorn suf">%</span>}
          </div>
        </div>

        <div className="sec-label">Loan Terms</div>
        <div className="field">
          <label>Loan Type</label>
          <select value={form.loanType} onChange={e => setForm(p => ({ ...p, loanType: e.target.value }))}>
            <option value="conventional">Conventional (PMI)</option>
            <option value="fha">FHA Loan (MIP)</option>
            <option value="va">VA Loan (No PMI)</option>
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div className="field">
            <label>Loan Term</label>
            <select value={form.loanTerm} onChange={e => setForm(p => ({ ...p, loanTerm: e.target.value }))}>
              <option value="30">30 Years</option>
              <option value="25">25 Years</option>
              <option value="20">20 Years</option>
              <option value="15">15 Years</option>
            </select>
          </div>
          <Field label="Interest Rate" suffix="%" name="interestRate" value={form.interestRate} onChange={set} min={0} max={20} step={0.05} placeholder="6.75" />
        </div>
        <div className="field">
          <label>Credit Score</label>
          <select value={form.creditScore} onChange={e => setForm(p => ({ ...p, creditScore: e.target.value }))}>
            <option value="780">780+ (Excellent)</option>
            <option value="760">760–779 (Excellent)</option>
            <option value="740">740–759 (Very Good)</option>
            <option value="720">720–739 (Good)</option>
            <option value="700">700–719 (Good)</option>
            <option value="680">680–699 (Fair)</option>
            <option value="660">660–679 (Fair)</option>
            <option value="640">Below 660 (Poor)</option>
          </select>
        </div>

        <div className="sec-label">Monthly Cost Breakdown (Optional)</div>
        <Field label="Annual Property Tax" hint="Total yearly amount; we'll divide by 12" prefix="$" name="propertyTax" value={form.propertyTax} onChange={set} min={0} step={100} placeholder="5400" />
        <Field label="Annual Homeowners Insurance" prefix="$" name="homeInsurance" value={form.homeInsurance} onChange={set} min={0} step={100} placeholder="1800" />
        <Field label="Annual Gross Income" hint="Used to calculate debt-to-income ratio (optional)" prefix="$" name="annualIncome" value={form.annualIncome} onChange={set} min={0} step={1000} placeholder="0" />
      </div>

      <div className="results-panel">
        {result ? (
          <>
            {result.pmiRequired ? (
              <div className="pmi-hero">
                <div className="pmi-hero-top">
                  <div className="pmi-main-stat">
                    <div className="label">Monthly PMI Cost</div>
                    <div className="amount">{fmt$(result.monthlyPMI, 2)}</div>
                    <div className="per">{fmt$(result.annualPMI)}/year · {fmtPct(result.pmiRate)} annual rate</div>
                  </div>
                  <div className="pmi-badges">
                    <div className="pmi-badge highlight">
                      <div className="b-label">Total PMI You'll Pay</div>
                      <div className="b-val">{fmt$(result.totalPMIPaid)}</div>
                    </div>
                    <div className="pmi-badge">
                      <div className="b-label">PMI Drops Off</div>
                      <div className="b-val">{result.yearsUntilDropOff}yr {result.monthsUntilDropOff % 12}mo</div>
                    </div>
                  </div>
                </div>
                <div className="pmi-hero-tier">{result.pmiTier}</div>
              </div>
            ) : (
              <div className="no-pmi-banner">
                <div className="no-pmi-icon text-forest2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <div className="no-pmi-title">No PMI Required</div>
                  <div className="no-pmi-sub">{form.loanType === "va" ? "VA loans never require PMI regardless of down payment." : `Your ${fmtPct(result.downPct, 1)} down payment puts your LTV at ${fmtPct(result.ltv, 1)} — below the 80% threshold.`}</div>
                </div>
              </div>
            )}

            <div className="stats-grid">
              <div className="stat">
                <div className="s-label">Loan Amount</div>
                <div className="s-val">{fmt$(result.loanAmount)}</div>
              </div>
              <div className="stat rust">
                <div className="s-label">Loan-to-Value (LTV)</div>
                <div className="s-val">{fmtPct(result.ltv, 1)}</div>
              </div>
              <div className="stat">
                <div className="s-label">Principal & Interest</div>
                <div className="s-val">{fmt$(result.monthlyPrincipalInterest, 0)}/mo</div>
              </div>
              <div className="stat forest">
                <div className="s-label">Total Monthly Payment</div>
                <div className="s-val">{fmt$(result.totalMonthlyPayment, 0)}/mo</div>
              </div>
              {result.pmiRequired && (
                <>
                  <div className="stat gold">
                    <div className="s-label">Equity Needed to Drop PMI</div>
                    <div className="s-val">{fmt$(result.equityNeeded)}</div>
                  </div>
                  <div className="stat">
                    <div className="s-label">Current Equity</div>
                    <div className="s-val">{fmtPct(result.equityPct, 1)}</div>
                  </div>
                </>
              )}
              {result.dtiRatio !== null && (
                <div className={`stat ${result.dtiRatio > 43 ? "rust" : "forest"}`} style={{ gridColumn: "1 / -1" }}>
                  <div className="s-label">Debt-to-Income Ratio (housing only)</div>
                  <div className="s-val">{fmtPct(result.dtiRatio, 1)} {result.dtiRatio > 43 ? "⚠ Above 43% guideline" : "✓ Within guidelines"}</div>
                </div>
              )}
            </div>

            {result.pmiRequired && (
              <div className="equity-card">
                <div className="equity-card-head">
                  <span className="equity-card-title">Equity Progress</span>
                  <span className="equity-card-ltv">LTV: {fmtPct(result.ltv, 1)} → need ≤80%</span>
                </div>
                <EquityBar equityPct={result.equityPct} ltv={result.ltv} />
              </div>
            )}

            <div className="donut-card">
              <Donut segments={donutSegs.filter(s => s.value > 0)} />
              <div className="donut-legend">
                {donutSegs.filter(s => s.value > 0).map((s, i) => (
                  <div className="legend-item" key={i}>
                    <div className="legend-dot" style={{ background: s.color }} />
                    <span className="legend-label">{s.label}</span>
                    <span className="legend-val">{fmt$(s.value, 0)}/mo</span>
                  </div>
                ))}
                <div className="legend-item" style={{ borderTop: "1px solid var(--border)", marginTop: 6, paddingTop: 6 }}>
                  <div className="legend-dot" style={{ background: "var(--ink)" }} />
                  <span className="legend-label" style={{ fontWeight: 600, color: "var(--ink)" }}>Total</span>
                  <span className="legend-val" style={{ color: "var(--forest2)" }}>{fmt$(result.totalMonthlyPayment, 0)}/mo</span>
                </div>
              </div>
            </div>

            {result.pmiRequired && (
              <>
                <button className="timeline-btn" onClick={() => setShowChart(c => !c)}>
                  {showChart ? "Hide" : "Show"} Balance & PMI Timeline
                </button>
                {showChart && (
                  <div className="timeline-wrap">
                    <div className="timeline-title">Loan Balance Over Time (click to show balance)</div>
                    <div className="timeline-chart">
                      {result.amortSchedule
                        .filter((_, i) => i % Math.max(1, Math.floor(result.amortSchedule.length / 80)) === 0)
                        .map((row, i) => {
                          const maxBal = result.loanAmount;
                          const h = Math.max(4, (row.balance / maxBal) * 80);
                          return (
                            <div key={i} className="t-bar"
                              style={{ height: `${h}px`, background: row.pmiActive ? "#c8541a" : "#2d5a27" }}
                              title={`Month ${row.month}: ${fmt$(row.balance)} balance${row.pmiActive ? " (PMI active)" : " (PMI ended)"}`}
                            />
                          );
                        })}
                    </div>
                    <div className="timeline-legend">
                      <div className="tl-item"><div className="tl-dot" style={{ background: "#c8541a" }} /><span>PMI active</span></div>
                      <div className="tl-item"><div className="tl-dot" style={{ background: "#2d5a27" }} /><span>PMI cancelled (80% LTV reached)</span></div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 40, textAlign: "center", color: "var(--muted)", fontSize: 15 }}>
            Enter your home price and interest rate to see your PMI estimate.
          </div>
        )}
      </div>
    </div>
  );
}
