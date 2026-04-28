"use client";

import { useState, useMemo, useCallback } from "react";
import { 
  Zap, 
  BarChart3, 
  Scale, 
  BookOpen, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  X,
  Plus,
  Calculator as CalcIcon
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type CompoundFreq = "annually" | "quarterly" | "monthly" | "daily";
type CalcMode = "basic" | "advanced" | "compare" | "guide";

interface Scenario {
  id: string;
  label: string;
  rate: number;
  principal: number;
  contribution: number;
  contribFreq: "monthly" | "annually";
  freq: CompoundFreq;
  color: string;
}

interface BasicResult {
  rule72Years: number;
  rule72Months: number;
  exactYears: number;
  exactMonths: number;
  rule69Years: number;
  rule70Years: number;
  error: number; // % diff between rule72 and exact
  doublings: { year: number; value: number }[];
  steps: string[];
}

interface AdvancedResult {
  yearsToDouble: number;
  monthsToDouble: number;
  finalValue: number;
  totalContributions: number;
  totalInterest: number;
  schedule: { period: number; label: string; balance: number; contributions: number; interest: number }[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const FREQ_N: Record<CompoundFreq, number> = {
  annually: 1, quarterly: 4, monthly: 12, daily: 365,
};

const COLORS = ["#f5a623", "#4fc3f7", "#81c784", "#f06292", "#ce93d8", "#ffb74d"];

function fmtCurrency(v: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
}
function fmtYears(y: number) {
  const yrs = Math.floor(y);
  const mos = Math.round((y - yrs) * 12);
  if (yrs === 0) return `${mos}mo`;
  if (mos === 0) return `${yrs}yr`;
  return `${yrs}yr ${mos}mo`;
}
function fmtNum(v: number, d = 2) { return v.toFixed(d); }

function calcBasic(rate: number, principal: number): BasicResult {
  const r = rate / 100;
  const rule72Years = 72 / rate;
  const rule72Months = rule72Years * 12;
  const rule69Years = 69.3 / rate;
  const rule70Years = 70 / rate;

  // Exact continuous: ln(2) / ln(1+r) for annual compounding
  const exactYears = Math.log(2) / Math.log(1 + r);
  const exactMonths = exactYears * 12;
  const error = Math.abs((rule72Years - exactYears) / exactYears) * 100;

  // Steps
  const steps = [
    `Step 1: Identify the annual rate of return → ${rate}%`,
    `Step 2: Apply the Rule of 72 formula: 72 ÷ Rate = Years to double`,
    `Step 3: 72 ÷ ${rate} = ${fmtNum(rule72Years, 2)} years`,
    `Step 4: Convert to months: ${fmtNum(rule72Years, 2)} × 12 = ${fmtNum(rule72Months, 1)} months`,
    `Step 5: Verify with exact formula: ln(2) ÷ ln(1 + ${rate / 100}) = ${fmtNum(exactYears, 4)} years`,
    `Step 6: Rule of 72 error vs. exact: ${fmtNum(error, 2)}% — acceptable for quick mental math`,
  ];

  // Future doublings
  const doublings: { year: number; value: number }[] = [];
  for (let i = 1; i <= 6; i++) {
    const yr = rule72Years * i;
    const val = principal * Math.pow(2, i);
    doublings.push({ year: yr, value: val });
  }

  return { rule72Years, rule72Months, exactYears, exactMonths, rule69Years, rule70Years, error, doublings, steps };
}

function calcAdvanced(
  rate: number,
  principal: number,
  contribution: number,
  contribFreq: "monthly" | "annually",
  freq: CompoundFreq
): AdvancedResult {
  const n = FREQ_N[freq];
  const r = rate / 100 / n;
  const monthlyContrib = contribFreq === "monthly" ? contribution : contribution / 12;
  const periodsPerMonth = n / 12;

  const target = principal * 2;
  let balance = principal;
  let totalContributions = principal;
  let period = 0;
  const schedule: AdvancedResult["schedule"] = [];
  const maxPeriods = n * 100;

  while (balance < target && period < maxPeriods) {
    period++;
    const prevBalance = balance;
    const interest = balance * r;
    const contrib = monthlyContrib / periodsPerMonth;
    balance = balance + interest + contrib;
    totalContributions += contrib;

    // Record monthly snapshots (every n/12 periods)
    if (period % Math.max(1, Math.round(n / 12)) === 0) {
      const monthNum = Math.round(period / (n / 12));
      if (monthNum % 6 === 0 || balance >= target) {
        schedule.push({
          period: monthNum,
          label: monthNum >= 12
            ? `${Math.floor(monthNum / 12)}yr ${monthNum % 12 > 0 ? (monthNum % 12) + "mo" : ""}`
            : `${monthNum}mo`,
          balance,
          contributions: totalContributions,
          interest: balance - totalContributions,
        });
      }
    }
  }

  const yearsToDouble = period / n;
  const monthsToDouble = yearsToDouble * 12;

  return {
    yearsToDouble,
    monthsToDouble,
    finalValue: balance,
    totalContributions,
    totalInterest: balance - totalContributions,
    schedule,
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RuleOf72Client() {
  // Basic inputs
  const [rate, setRate] = useState(8);
  const [principal, setPrincipal] = useState(10000);

  // Advanced inputs
  const [contribution, setContribution] = useState(200);
  const [contribFreq, setContribFreq] = useState<"monthly" | "annually">("monthly");
  const [freq, setFreq] = useState<CompoundFreq>("annually");

  // Compare scenarios
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: "1", label: "Conservative", rate: 4, principal: 10000, contribution: 0, contribFreq: "monthly", freq: "annually", color: COLORS[1] },
    { id: "2", label: "Moderate", rate: 8, principal: 10000, contribution: 0, contribFreq: "monthly", freq: "annually", color: COLORS[0] },
    { id: "3", label: "Aggressive", rate: 12, principal: 10000, contribution: 0, contribFreq: "monthly", freq: "annually", color: COLORS[2] },
  ]);

  const [mode, setMode] = useState<CalcMode>("basic");
  const [stepsOpen, setStepsOpen] = useState(false);

  const basic = useMemo(() => calcBasic(Math.max(0.01, rate), principal), [rate, principal]);
  const advanced = useMemo(
    () => calcAdvanced(Math.max(0.01, rate), principal, contribution, contribFreq, freq),
    [rate, principal, contribution, contribFreq, freq]
  );

  const scenarioResults = useMemo(
    () => scenarios.map((s) => ({ ...s, result: calcBasic(Math.max(0.01, s.rate), s.principal) })),
    [scenarios]
  );

  const updateScenario = useCallback((id: string, field: keyof Scenario, value: string | number) => {
    setScenarios((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s));
  }, []);

  const addScenario = useCallback(() => {
    if (scenarios.length >= 6) return;
    setScenarios((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: `Scenario ${prev.length + 1}`, rate: 7, principal: 10000, contribution: 0, contribFreq: "monthly", freq: "annually", color: COLORS[prev.length % COLORS.length] },
    ]);
  }, [scenarios.length]);

  const removeScenario = useCallback((id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // Progress arc for visual
  const arcProgress = Math.min(1, (rate / 20));
  const arcDeg = arcProgress * 180;

  return (
    <>
      {/* JSON-LD Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Rule of 72 Calculator",
        url: "https://findbest.tools/finance/rule-of-72-calculator",
        description: "Rule of 72 calculator with step-by-step working, monthly compounding, contributions mode, and scenario comparison for 72 rule investing.",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "Rule of 72 with step-by-step working",
          "Rule of 72 monthly compounding mode",
          "Rule of 72 calculator with contributions",
          "Comparison with Rule of 69 and Rule of 70",
          "Multi-scenario comparison table",
          "Doubling schedule projection",
          "Exact vs approximation error display",
        ],
      })}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What is the Rule of 72?", acceptedAnswer: { "@type": "Answer", text: "The Rule of 72 is a simple mental math formula in finance: divide 72 by your annual rate of return to estimate how many years it will take to double your money. For example, at 8% return, 72 ÷ 8 = 9 years to double." } },
          { "@type": "Question", name: "What is the Rule of 72 formula?", acceptedAnswer: { "@type": "Answer", text: "The Rule of 72 formula is: Years to Double = 72 ÷ Annual Rate of Return (%). The exact formula using continuous compounding is: Years = ln(2) ÷ ln(1 + r), which equals approximately 0.693 ÷ r for small rates." } },
          { "@type": "Question", name: "How does the Rule of 72 apply to investing?", acceptedAnswer: { "@type": "Answer", text: "In 72 rule investing, you can quickly estimate doubling time for any investment: a stock portfolio returning 10%/year doubles in 7.2 years; a bond fund at 4% doubles in 18 years; real estate at 6% doubles in 12 years. It also works in reverse — divide 72 by your target doubling time to find the required rate." } },
          { "@type": "Question", name: "What is the Rule of 72 in finance for monthly compounding?", acceptedAnswer: { "@type": "Answer", text: "For monthly compounding, use the Rule of 72 with the monthly rate: divide 72 by the monthly interest rate (annual rate ÷ 12). Alternatively, use our Rule of 72 calculator monthly mode, which applies the exact formula for the selected compounding frequency." } },
          { "@type": "Question", name: "What is the difference between Rule of 72, Rule of 70, and Rule of 69?", acceptedAnswer: { "@type": "Answer", text: "All three estimate investment doubling time. Rule of 72 (72 ÷ r) is most accurate for rates between 6–10% and is easiest for mental math since 72 has many factors. Rule of 70 (70 ÷ r) is better for continuous compounding. Rule of 69.3 (69.3 ÷ r) is mathematically exact for continuous compounding (ln(2) = 0.6931)." } },
          { "@type": "Question", name: "How accurate is the Rule of 72?", acceptedAnswer: { "@type": "Answer", text: "The Rule of 72 is most accurate between 6–10% annual returns, with less than 1% error. At 2% it overestimates by ~3.5%; at 20% it overestimates by ~4%. For precise calculations, use our exact compound interest formula mode." } },
        ],
      })}} />

      <div className="r72-page">

        {/* ── Header ── */}
        <header className="r72-hero">
          <div className="r72-container">
            <nav className="r72-breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a><span>/</span><a href="/finance">Finance</a><span>/</span><span>Rule of 72 Calculator</span>
            </nav>
            <div className="r72-hero-inner">
              <div className="r72-hero-text">
                <div className="r72-badge">72 Rule · Finance · Investing</div>
                <h1 className="r72-title">Rule of 72<br /><span className="r72-title-accent">Calculator</span></h1>
                <p className="r72-subtitle">
                  Estimate how fast your money doubles using the <strong>rule of 72 formula</strong>.
                  Includes step-by-step working, <strong>monthly compounding</strong>,{" "}
                  <strong>contributions mode</strong>, and scenario comparison.
                </p>
              </div>

              {/* Hero Visual — the big "72" dial */}
              <div className="r72-dial-wrap" aria-hidden="true">
                <div className="r72-dial">
                  <div className="r72-dial-number">72</div>
                  <div className="r72-dial-sub">÷ {rate}% = {fmtNum(basic.rule72Years, 1)}yr</div>
                  <svg className="r72-dial-arc" viewBox="0 0 120 65" fill="none">
                    <path d="M10 60 A50 50 0 0 1 110 60" stroke="#1e293b" strokeWidth="6" fill="none" />
                    <path
                      d="M10 60 A50 50 0 0 1 110 60"
                      stroke="#f5a623"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${arcDeg * 1.745} 999`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="r72-dial-labels">
                  <span>0%</span><span>10%</span><span>20%</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="r72-container r72-main">

          {/* ── Tabs ── */}
          <div className="r72-tabs" role="tablist">
            <button role="tab" aria-selected={mode === "basic"}
              className={`r72-tab${mode === "basic" ? " r72-tab--active" : ""}`}
              onClick={() => setMode("basic")}>
              <Zap size={16} className="inline mr-1" /> Basic Calculator
            </button>
            <button role="tab" aria-selected={mode === "advanced"}
              className={`r72-tab${mode === "advanced" ? " r72-tab--active" : ""}`}
              onClick={() => setMode("advanced")}>
              <BarChart3 size={16} className="inline mr-1" /> With Contributions
            </button>
            <button role="tab" aria-selected={mode === "compare"}
              className={`r72-tab${mode === "compare" ? " r72-tab--active" : ""}`}
              onClick={() => setMode("compare")}>
              <Scale size={16} className="inline mr-1" /> Compare Scenarios
            </button>
            <button role="tab" aria-selected={mode === "guide"}
              className={`r72-tab${mode === "guide" ? " r72-tab--active" : ""}`}
              onClick={() => setMode("guide")}>
              <BookOpen size={16} className="inline mr-1" /> Full Guide
            </button>
          </div>

          {/* ══ BASIC MODE ══ */}
          {mode === "basic" && (
            <section className="r72-section">
              <div className="r72-basic-grid">

                {/* Inputs */}
                <div className="r72-inputs-card">
                  <h2 className="r72-card-title">Inputs</h2>

                  <label className="r72-field">
                    <span className="r72-field-label">Annual Rate of Return (%)</span>
                    <div className="r72-slider-row">
                      <input type="range" min={0.5} max={30} step={0.5} value={rate}
                        onChange={(e) => setRate(Number(e.target.value))} className="r72-slider" />
                      <input type="number" min={0.01} max={100} step={0.01} value={rate}
                        onChange={(e) => setRate(Number(e.target.value))} className="r72-num-input" />
                    </div>
                  </label>

                  <label className="r72-field">
                    <span className="r72-field-label">Starting Principal ($)</span>
                    <div className="r72-slider-row">
                      <input type="range" min={1000} max={500000} step={1000} value={principal}
                        onChange={(e) => setPrincipal(Number(e.target.value))} className="r72-slider" />
                      <input type="number" min={1} step={1000} value={principal}
                        onChange={(e) => setPrincipal(Number(e.target.value))} className="r72-num-input" />
                    </div>
                  </label>

                  {/* Compounding context for basic */}
                  <div className="r72-info-box">
                    <Info size={14} className="r72-info-icon" />
                    The Rule of 72 assumes <strong>annual compounding</strong>. Switch to the Advanced tab
                    to change compounding frequency or add contributions.
                  </div>
                </div>

                {/* Results */}
                <div className="r72-results-stack">
                  {/* Primary result */}
                  <div className="r72-result-hero">
                    <span className="r72-result-tag">Rule of 72 Estimate</span>
                    <div className="r72-result-big">{fmtNum(basic.rule72Years, 2)}</div>
                    <div className="r72-result-unit">years to double</div>
                    <div className="r72-result-sub">{fmtNum(basic.rule72Months, 1)} months &nbsp;·&nbsp; {fmtNum(basic.rule72Years / 12, 2)} decades</div>
                  </div>

                  {/* Comparison row */}
                  <div className="r72-comparison-grid">
                    {[
                      { label: "Rule of 72", value: fmtNum(basic.rule72Years, 2) + " yr", highlight: true },
                      { label: "Rule of 70", value: fmtNum(basic.rule70Years, 2) + " yr" },
                      { label: "Rule of 69.3", value: fmtNum(basic.rule69Years, 2) + " yr" },
                      { label: "Exact (annual)", value: fmtNum(basic.exactYears, 4) + " yr" },
                      { label: "Error vs Exact", value: fmtNum(basic.error, 2) + "%" },
                      { label: "Doubled Value", value: fmtCurrency(principal * 2) },
                    ].map((c) => (
                      <div key={c.label} className={`r72-cmp-card${c.highlight ? " r72-cmp-card--hl" : ""}`}>
                        <span className="r72-cmp-label">{c.label}</span>
                        <span className="r72-cmp-value">{c.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step-by-step */}
              <div className="r72-steps-panel">
                <button className="r72-steps-toggle" onClick={() => setStepsOpen(!stepsOpen)}>
                  <span><CalcIcon size={16} className="inline mr-2" /> Show Step-by-Step Working</span>
                  <span>{stepsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
                </button>
                {stepsOpen && (
                  <div className="r72-steps-body">
                    {basic.steps.map((s, i) => (
                      <div key={i} className="r72-step">
                        <div className="r72-step-num">{i + 1}</div>
                        <div className="r72-step-text">{s}</div>
                      </div>
                    ))}
                    <div className="r72-formula-block">
                      <span className="r72-formula-label">Rule of 72 Formula</span>
                      <code>Years to Double = 72 ÷ Annual Rate (%)</code>
                      <code>{`Years to Double = 72 ÷ ${rate} = ${fmtNum(basic.rule72Years, 4)}`}</code>
                    </div>
                    <div className="r72-formula-block">
                      <span className="r72-formula-label">Exact Formula (Annual Compounding)</span>
                      <code>{"Years = ln(2) ÷ ln(1 + r)"}</code>
                      <code>{`Years = ln(2) ÷ ln(1 + ${rate / 100}) = ${fmtNum(basic.exactYears, 6)}`}</code>
                    </div>
                  </div>
                )}
              </div>

              {/* Doubling schedule */}
              <div className="r72-doublings">
                <h3 className="r72-section-subtitle">Doubling Schedule — Starting with {fmtCurrency(principal)}</h3>
                <div className="r72-doubling-grid">
                  {basic.doublings.map((d, i) => (
                    <div key={i} className="r72-doubling-card">
                      <div className="r72-doubling-x">×{Math.pow(2, i + 1)}</div>
                      <div className="r72-doubling-year">Year {fmtNum(d.year, 1)}</div>
                      <div className="r72-doubling-value">{fmtCurrency(d.value)}</div>
                      <div className="r72-doubling-bar-wrap">
                        <div className="r72-doubling-bar" style={{ width: `${Math.min(100, (i + 1) * 15)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common rates quick reference */}
              <div className="r72-quick-ref">
                <h3 className="r72-section-subtitle">Quick Reference — Common Investment Returns</h3>
                <div className="r72-ref-table-wrap">
                  <table className="r72-ref-table">
                    <thead>
                      <tr>
                        <th>Asset / Scenario</th>
                        <th>Typical Rate</th>
                        <th>Rule of 72 (years)</th>
                        <th>Exact (years)</th>
                        <th>Doubles {fmtCurrency(principal)} to</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Savings Account", rate: 0.5 },
                        { label: "HYSA / Money Market", rate: 4.5 },
                        { label: "5-Year CD", rate: 4.75 },
                        { label: "Government Bonds", rate: 4.0 },
                        { label: "Corporate Bonds", rate: 5.5 },
                        { label: "S&P 500 (hist. avg)", rate: 10.0 },
                        { label: "Real Estate (avg)", rate: 6.5 },
                        { label: "Inflation (target)", rate: 2.0 },
                        { label: "Aggressive Stock Portfolio", rate: 12.0 },
                        { label: "Venture / Private Equity", rate: 20.0 },
                      ].map((row) => {
                        const r72 = 72 / row.rate;
                        const exact = Math.log(2) / Math.log(1 + row.rate / 100);
                        return (
                          <tr key={row.label}>
                            <td>{row.label}</td>
                            <td className="r72-td-num">{fmtNum(row.rate, 2)}%</td>
                            <td className="r72-td-num r72-td-hl">{fmtNum(r72, 1)}</td>
                            <td className="r72-td-num">{fmtNum(exact, 2)}</td>
                            <td className="r72-td-num">{fmtCurrency(principal * 2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ══ ADVANCED / CONTRIBUTIONS MODE ══ */}
          {mode === "advanced" && (
            <section className="r72-section">
              <div className="r72-basic-grid">
                <div className="r72-inputs-card">
                  <h2 className="r72-card-title">Rule of 72 with Contributions</h2>

                  {[
                    { label: "Annual Rate of Return (%)", val: rate, set: setRate, min: 0.01, max: 50, step: 0.01 },
                    { label: "Starting Principal ($)", val: principal, set: setPrincipal, min: 0, max: 1000000, step: 500 },
                    { label: `Contribution (${contribFreq === "monthly" ? "$/month" : "$/year"})`, val: contribution, set: setContribution, min: 0, max: 10000, step: 50 },
                  ].map((f) => (
                    <label key={f.label} className="r72-field">
                      <span className="r72-field-label">{f.label}</span>
                      <div className="r72-slider-row">
                        <input type="range" min={f.min} max={f.max} step={f.step} value={f.val}
                          onChange={(e) => f.set(Number(e.target.value))} className="r72-slider" />
                        <input type="number" min={f.min} step={f.step} value={f.val}
                          onChange={(e) => f.set(Number(e.target.value))} className="r72-num-input" />
                      </div>
                    </label>
                  ))}

                  <div className="r72-inline-fields">
                    <label className="r72-field r72-field--half">
                      <span className="r72-field-label">Contribution Frequency</span>
                      <select value={contribFreq} onChange={(e) => setContribFreq(e.target.value as "monthly" | "annually")} className="r72-select">
                        <option value="monthly">Monthly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </label>
                    <label className="r72-field r72-field--half">
                      <span className="r72-field-label">Compounding Frequency</span>
                      <select value={freq} onChange={(e) => setFreq(e.target.value as CompoundFreq)} className="r72-select">
                        <option value="annually">Annual</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="monthly">Monthly</option>
                        <option value="daily">Daily</option>
                      </select>
                    </label>
                  </div>

                  <div className="r72-info-box">
                    <Zap size={14} className="r72-info-icon" />
                    With contributions, doubling is measured from your <strong>starting principal</strong>.
                    The calculator uses exact compound interest — not the Rule of 72 approximation — because
                    contributions change the doubling dynamics.
                  </div>
                </div>

                <div className="r72-results-stack">
                  <div className="r72-result-hero">
                    <span className="r72-result-tag">Years to Double Principal</span>
                    <div className="r72-result-big">{fmtNum(advanced.yearsToDouble, 2)}</div>
                    <div className="r72-result-unit">years</div>
                    <div className="r72-result-sub">{fmtNum(advanced.monthsToDouble, 1)} months</div>
                  </div>
                  <div className="r72-comparison-grid">
                    {[
                      { label: "Target Value", value: fmtCurrency(principal * 2) },
                      { label: "Final Balance", value: fmtCurrency(advanced.finalValue) },
                      { label: "Total Contributions", value: fmtCurrency(advanced.totalContributions) },
                      { label: "Interest Earned", value: fmtCurrency(advanced.totalInterest) },
                      { label: "Rule of 72 (no contrib)", value: fmtNum(basic.rule72Years, 2) + " yr" },
                      { label: "Time Saved (vs no contrib)", value: fmtYears(Math.max(0, basic.rule72Years - advanced.yearsToDouble)) },
                    ].map((c) => (
                      <div key={c.label} className="r72-cmp-card">
                        <span className="r72-cmp-label">{c.label}</span>
                        <span className="r72-cmp-value">{c.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Growth schedule */}
              {advanced.schedule.length > 0 && (
                <div className="r72-schedule-section">
                  <h3 className="r72-section-subtitle">Growth Schedule</h3>
                  <div className="r72-table-wrap">
                    <table className="r72-table">
                      <thead>
                        <tr>
                          <th>Period</th>
                          <th>Balance</th>
                          <th>Total Contributed</th>
                          <th>Interest Earned</th>
                          <th>% of Target</th>
                        </tr>
                      </thead>
                      <tbody>
                        {advanced.schedule.map((row, i) => {
                          const pct = (row.balance / (principal * 2)) * 100;
                          const doubled = row.balance >= principal * 2;
                          return (
                            <tr key={i} className={doubled ? "r72-tr-doubled" : ""}>
                              <td>{row.label}</td>
                              <td className="r72-td-num r72-td-hl">{fmtCurrency(row.balance)}</td>
                              <td className="r72-td-num">{fmtCurrency(row.contributions)}</td>
                              <td className="r72-td-num">{fmtCurrency(Math.max(0, row.interest))}</td>
                              <td className="r72-td-num">
                                <div className="r72-pct-wrap">
                                  <div className="r72-pct-bar" style={{ width: `${Math.min(100, pct)}%` }} />
                                  <span>{fmtNum(Math.min(100, pct), 1)}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ══ COMPARE SCENARIOS ══ */}
          {mode === "compare" && (
            <section className="r72-section">
              <div className="r72-compare-header">
                <h2 className="r72-card-title">Compare Scenarios</h2>
                <button className="r72-btn r72-btn--amber" onClick={addScenario} disabled={scenarios.length >= 6}>
                  <Plus size={16} className="mr-1" /> Add Scenario
                </button>
              </div>

              <div className="r72-scenarios">
                {scenarios.map((s) => (
                  <div key={s.id} className="r72-scenario" style={{ borderTopColor: s.color }}>
                    <div className="r72-scenario-header">
                      <div className="r72-scenario-dot" style={{ background: s.color }} />
                      <input
                        className="r72-scenario-label-input"
                        value={s.label}
                        onChange={(e) => updateScenario(s.id, "label", e.target.value)}
                      />
                      <button className="r72-scenario-remove" onClick={() => removeScenario(s.id)} disabled={scenarios.length <= 2}>
                        <X size={14} />
                      </button>
                    </div>
                    <div className="r72-scenario-fields">
                      <label className="r72-field">
                        <span className="r72-field-label">Rate (%)</span>
                        <input type="number" min={0.01} max={100} step={0.01} value={s.rate}
                          onChange={(e) => updateScenario(s.id, "rate", Number(e.target.value))} className="r72-num-input r72-num-input--full" />
                      </label>
                      <label className="r72-field">
                        <span className="r72-field-label">Principal ($)</span>
                        <input type="number" min={0} step={1000} value={s.principal}
                          onChange={(e) => updateScenario(s.id, "principal", Number(e.target.value))} className="r72-num-input r72-num-input--full" />
                      </label>
                    </div>
                    <div className="r72-scenario-result">
                      <div>
                        <span className="r72-cmp-label">Doubles in</span>
                        <span className="r72-scenario-years" style={{ color: s.color }}>
                          {fmtNum(72 / Math.max(0.01, s.rate), 1)} yr
                        </span>
                      </div>
                      <div>
                        <span className="r72-cmp-label">To</span>
                        <span className="r72-scenario-val">{fmtCurrency(s.principal * 2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison table */}
              <div className="r72-table-wrap" style={{ marginTop: "2rem" }}>
                <table className="r72-table">
                  <thead>
                    <tr>
                      <th>Scenario</th>
                      <th>Rate</th>
                      <th>Rule of 72</th>
                      <th>Exact Years</th>
                      <th>Months</th>
                      <th>Doubled Value</th>
                      <th>After 20yr</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarioResults.map((s) => {
                      const after20 = s.principal * Math.pow(1 + s.rate / 100, 20);
                      return (
                        <tr key={s.id}>
                          <td>
                            <span className="r72-scenario-dot r72-scenario-dot--sm" style={{ background: s.color }} />
                            {s.label}
                          </td>
                          <td className="r72-td-num">{fmtNum(s.rate, 2)}%</td>
                          <td className="r72-td-num r72-td-hl">{fmtNum(s.result.rule72Years, 2)} yr</td>
                          <td className="r72-td-num">{fmtNum(s.result.exactYears, 3)} yr</td>
                          <td className="r72-td-num">{fmtNum(s.result.rule72Months, 1)}</td>
                          <td className="r72-td-num">{fmtCurrency(s.principal * 2)}</td>
                          <td className="r72-td-num">{fmtCurrency(after20)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Visual bar chart */}
              <div className="r72-bar-chart">
                <h3 className="r72-section-subtitle">Years to Double — Visual Comparison</h3>
                {scenarioResults.map((s) => {
                  const maxYears = Math.max(...scenarioResults.map((x) => x.result.rule72Years));
                  const pct = (s.result.rule72Years / maxYears) * 100;
                  return (
                    <div key={s.id} className="r72-bar-row">
                      <span className="r72-bar-label">{s.label}</span>
                      <div className="r72-bar-track">
                        <div className="r72-bar-fill" style={{ width: `${pct}%`, background: s.color }} />
                      </div>
                      <span className="r72-bar-value">{fmtNum(s.result.rule72Years, 1)} yr</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ══ GUIDE TAB ══ */}
          {mode === "guide" && (
            <section className="r72-section">
              <div className="r72-guide-prose">
                <GuideContent rate={rate} principal={principal} basic={basic} />
              </div>
            </section>
          )}
        </main>

        {/* ── Full SEO Article (server-rendered for crawlers) ── */}
        <article className="r72-article r72-container">
          <SEOArticle rate={rate} principal={principal} basic={basic} />
        </article>

        {/* ── FAQ ── */}
        <section className="r72-faq-section r72-container">
          <FAQSection />
        </section>

        {/* ── Disclaimer ── */}
        <div className="r72-container">
          <div className="r72-disclaimer">
            <strong>Disclaimer:</strong> This Rule of 72 calculator is an educational tool. The Rule of 72 is an approximation; actual investment returns vary and are not guaranteed. This tool does not constitute financial advice. Always consult a qualified financial advisor before making investment decisions.
          </div>
        </div>

        <style>{CSS}</style>
      </div>
    </>
  );
}

// ─── Guide Content ────────────────────────────────────────────────────────────

function GuideContent({ rate, principal, basic }: { rate: number; principal: number; basic: BasicResult }) {
  return (
    <div>
      <h2>The Rule of 72 Explained — With Examples</h2>
      <p>The <strong>Rule of 72</strong> is the most powerful mental math shortcut in personal finance. With a single division — 72 ÷ your rate of return — you get a surprisingly accurate estimate of how long it takes to double any sum of money.</p>
      <p>At your current input of <strong>{rate}%</strong>, your {fmtCurrency(principal)} doubles in approximately <strong>{fmtNum(basic.rule72Years, 2)} years</strong>. The exact answer (using the precise compound interest formula) is {fmtNum(basic.exactYears, 4)} years — a difference of just {fmtNum(basic.error, 2)}%.</p>
      <h3>Why 72? The Math Behind the Formula</h3>
      <p>The mathematically exact doubling time for continuously compounded interest is <code>ln(2) ÷ r ≈ 0.6931 ÷ r</code>. Multiplying both sides by 100 gives us <code>69.3 ÷ Rate%</code> — the theoretically perfect constant. So why do we use 72 instead of 69.3?</p>
      <p>Because 72 has far more integer factors (1, 2, 3, 4, 6, 8, 9, 12) than 69, making mental arithmetic effortless. At rates between 6–10% — the most common range for long-term investing — the extra error from using 72 instead of 69.3 is under 1%, a perfectly acceptable trade-off for a rule designed for back-of-napkin calculation.</p>
    </div>
  );
}

// ─── SEO Article ─────────────────────────────────────────────────────────────

function SEOArticle({ rate, principal, basic }: { rate: number; principal: number; basic: BasicResult }) {
  return (
    <div className="r72-prose">
      <h2>Rule of 72 Calculator: The Complete Guide to Doubling Your Money</h2>

      <p>
        The <strong>Rule of 72</strong> is arguably the single most useful shortcut in all of personal finance. It answers
        the question every investor eventually asks: <em>how long will it take to double my money?</em> Whether you are
        evaluating a stock portfolio, a savings account, a real estate investment, or even the erosive effects of inflation,
        the Rule of 72 delivers a fast, reliable estimate with nothing more than a single division.
      </p>
      <p>
        Our <strong>Rule of 72 calculator</strong> goes far beyond the basic formula. It shows the step-by-step working
        so you can understand exactly how the answer is derived, compares the Rule of 72 against the Rule of 70 and Rule of 69.3
        for accuracy, provides a <strong>monthly compounding mode</strong> for precise projections, and includes a full{" "}
        <strong>Rule of 72 calculator with contributions</strong> for savers who add to their investment over time.
      </p>

      <h3>What Is the Rule of 72?</h3>
      <p>
        The Rule of 72 is a mathematical shortcut used in finance and investing to estimate the doubling time of an
        investment at a fixed annual rate of return:
      </p>
      <p className="r72-formula-block">
        Years to Double = 72 ÷ Annual Rate of Return (%)
      </p>
      <p>
        Example: If your investment returns 8% per year, it will double in approximately 72 ÷ 8 = <strong>9 years</strong>.
        At 6%, it doubles in 12 years. At 12%, in just 6 years. The simplicity is the point — no calculator required
        for mental arithmetic.
      </p>
      <p>
        The Rule of 72 also works in reverse: divide 72 by your target doubling time to find the required rate of return.
        Want to double your money in 10 years? You need 72 ÷ 10 = <strong>7.2% annual return</strong>.
      </p>

      <h3>The Rule of 72 Formula — Mathematical Foundation</h3>
      <p>
        The mathematically exact formula for investment doubling time (under annual compounding) is derived from the
        compound interest equation:
      </p>
      <p className="r72-formula-block">
        {`FV = PV × (1 + r)^t`}<br />
        {`2 = (1 + r)^t`}<br />
        {`t = ln(2) ÷ ln(1 + r)`}
      </p>
      <p>
        For small values of r, <code>ln(1 + r) ≈ r</code>, so the formula simplifies to{" "}
        <code>t ≈ ln(2) ÷ r ≈ 0.6931 ÷ r</code>. Multiplying numerator and denominator by 100 to work with
        percentage rates gives <code>t ≈ 69.3 ÷ Rate%</code>. The Rule of 72 substitutes 72 for 69.3 because
        72 has more divisors — making mental arithmetic far easier — while introducing minimal error within the
        most common investing rate range of 6–10%.
      </p>

      <h3>Rule of 72 vs Rule of 70 vs Rule of 69.3 — Which Is Most Accurate?</h3>
      <p>
        Finance textbooks reference three related rules. They differ only in the numerator used:
      </p>
      <ul>
        <li>
          <strong>Rule of 72:</strong> 72 ÷ Rate. Most accurate between 6–10%; the standard for mental math due to 72&apos;s
          high number of factors. Slightly overestimates doubling time at low rates, slightly underestimates at very high rates.
        </li>
        <li>
          <strong>Rule of 70:</strong> 70 ÷ Rate. More accurate for continuous compounding (as used in economics and
          population growth models). Slightly underestimates for standard annual compound interest but is preferred for
          inflation and economic growth calculations.
        </li>
        <li>
          <strong>Rule of 69.3:</strong> 69.3 ÷ Rate. Mathematically exact for continuous compounding (since ln(2) = 0.6931).
          Rarely used in practice because 69.3 is not divisible cleanly by common rates.
        </li>
      </ul>
      <p>
        For practical <strong>72 rule investing</strong> calculations, always use the Rule of 72. For continuous
        compounding or economic models, Rule of 70 or 69.3 is more appropriate.
      </p>

      <h3>72 Rule Investing: Real-World Applications</h3>
      <p>
        The Rule of 72 has enormous practical value in personal investing and financial planning. Here are the most
        important applications:
      </p>

      <h4>Stock Market Investing</h4>
      <p>
        The S&P 500 has returned approximately 10% annually on average (before inflation) over long periods. Applying
        the Rule of 72: 72 ÷ 10 = <strong>7.2 years</strong> to double. An investor who put $10,000 into a low-cost
        S&P 500 index fund would see it grow to $20,000 in roughly 7.2 years, $40,000 in 14.4 years, $80,000 in
        21.6 years, and $160,000 in 28.8 years — all without adding a single dollar.
      </p>

      <h4>The Inflation Destroyer</h4>
      <p>
        The Rule of 72 is equally powerful when applied to <strong>negative</strong> rates — like inflation. At a 3%
        inflation rate: 72 ÷ 3 = 24 years for prices to double. This means the purchasing power of cash sitting in
        a 0% savings account is cut in half every 24 years. At 6% inflation (seen in 2022): 72 ÷ 6 = 12 years. This
        framing makes the urgency of investing over saving immediately tangible.
      </p>

      <h4>Evaluating Debt</h4>
      <p>
        The Rule of 72 applies to debt just as it does to investments. A credit card charging 24% APR: 72 ÷ 24 = 3 years
        for your balance to double if unpaid. A student loan at 6%: 72 ÷ 6 = 12 years to double. This perspective can
        motivate accelerated debt repayment — especially on high-interest credit cards.
      </p>

      <h4>Real Estate Returns</h4>
      <p>
        US home prices have appreciated at roughly 3–5% annually above inflation. At 5%: 72 ÷ 5 = 14.4 years for a
        property&apos;s value to double. When you factor in leverage (a typical 20% down payment), the return on equity
        is dramatically amplified — making the effective doubling time on the down payment much shorter.
      </p>

      <h4>Rule of 72 for Business Growth</h4>
      <p>
        Entrepreneurs use the Rule of 72 to assess revenue growth rates. A business growing at 25% annually: 72 ÷ 25 =
        2.88 years to double revenue. This helps set realistic growth targets and evaluate whether a business is
        compounding at a venture-worthy rate.
      </p>

      <h3>Rule of 72 in Finance: Monthly Compounding</h3>
      <p>
        Most formal financial products — mortgages, credit cards, savings accounts, and many investment accounts —
        compound interest more frequently than once per year. The Rule of 72 is designed for annual compounding, but
        it can be adapted.
      </p>
      <p>
        For <strong>Rule of 72 monthly compounding</strong>, convert the annual rate to a monthly rate and apply the formula:
      </p>
      <p className="r72-formula-block">
        Monthly Rate = Annual APY ÷ 12<br />
        Months to Double = 72 ÷ Monthly Rate<br />
        Years to Double = Months to Double ÷ 12
      </p>
      <p>
        However, for anything other than a quick estimate, the exact compound interest formula is far more reliable. Our
        Advanced tab above handles all compounding frequencies — daily, monthly, quarterly, and annual — using the
        precise formula rather than the 72 approximation.
      </p>
      <p>
        The impact of compounding frequency is real but often overstated in marketing. Moving from annual to daily
        compounding on a $10,000 investment at 6% for 10 years adds approximately $19 in additional interest — the
        APY already captures most of this.
      </p>

      <h3>Rule of 72 Calculator with Contributions: How Regular Saving Accelerates Doubling</h3>
      <p>
        The classic Rule of 72 assumes a lump sum with no additional contributions. But most real investors also
        contribute regularly — monthly 401(k) contributions, automatic transfers to a brokerage account, or
        systematic investment plans (SIPs). Adding regular contributions dramatically accelerates the time to double
        the original principal.
      </p>
      <p>
        Consider an investor with $10,000 invested at 8% annually. Without contributions, the Rule of 72 predicts
        doubling in 9 years. If the same investor adds $200/month:
      </p>
      <ul>
        <li>After 3 years: balance ≈ $20,200 — original $10,000 already doubled</li>
        <li>After 9 years (the Rule of 72 period): balance ≈ $43,600 — more than quadrupled</li>
      </ul>
      <p>
        This is why financial planners often combine the Rule of 72 with a contribution-based projection — the Rule
        of 72 sets the baseline, contributions determine how much faster you can reach it. Our{" "}
        <strong>Rule of 72 calculator with contributions</strong> tab handles this calculation exactly, showing
        the month-by-month growth schedule and how much of the final balance comes from contributions vs. compound growth.
      </p>

      <h3>Common Mistakes When Using the Rule of 72</h3>
      <ul>
        <li>
          <strong>Confusing APR and APY.</strong> Savings accounts and CDs quote APY; loans often quote APR.
          Use APY for investment calculations. APY already incorporates compounding; APR does not.
        </li>
        <li>
          <strong>Ignoring taxes.</strong> Investment returns are often subject to capital gains tax and income tax.
          A 10% pre-tax return becomes roughly 7–8% after federal capital gains tax for many investors — doubling
          time increases from 7.2 years to 9–10 years. Always calculate on after-tax returns for personal financial planning.
        </li>
        <li>
          <strong>Forgetting inflation.</strong> If your investment earns 8% but inflation runs at 3%, your real
          (inflation-adjusted) return is approximately 5%. Real doubling time: 72 ÷ 5 = 14.4 years — not 9 years.
        </li>
        <li>
          <strong>Applying it to variable-rate investments.</strong> The Rule of 72 assumes a fixed rate. Stock
          market returns vary dramatically year-to-year. The 10% long-run average includes years of −30% and +30%.
          The Rule of 72 gives a long-run estimate, not a guarantee.
        </li>
        <li>
          <strong>Using it at extreme rates.</strong> At very low rates (below 3%) or very high rates (above 20%),
          the Rule of 72 error grows. At 1%, Rule of 72 says 72 years; exact is 69.7 years (3.3% error). Always
          cross-check with the exact formula for outlier rates.
        </li>
      </ul>

      <h3>The Rule of 72 and Compound Interest: Einstein&apos;s "Eighth Wonder"</h3>
      <p>
        Albert Einstein is often (perhaps apocryphally) credited with calling compound interest the &quot;eighth wonder
        of the world.&quot; Whether or not he said it, the sentiment is mathematically sound. The Rule of 72 makes
        the power of compounding viscerally real.
      </p>
      <p>
        Consider two investors. Investor A starts with $10,000 at age 25 and never adds another dollar, earning 8%/year.
        Investor B waits until age 35 to start, also with $10,000, also at 8%. By age 65:
      </p>
      <ul>
        <li>Investor A: $10,000 × 2^(40/9) ≈ <strong>$217,000</strong> (roughly 5 doublings)</li>
        <li>Investor B: $10,000 × 2^(30/9) ≈ <strong>$103,000</strong> (roughly 3.3 doublings)</li>
      </ul>
      <p>
        A 10-year head start roughly doubles the final outcome — even with zero additional contributions. This is the
        compounding effect captured by the Rule of 72, and it is the strongest argument for starting to invest as
        early as possible.
      </p>

      <h3>Rule of 72 for Different Asset Classes (2026 Reference)</h3>
      <p>
        Using recent market data and historical averages, here is how the Rule of 72 applies to the most common
        asset classes an investor might consider in 2026:
      </p>
      <ul>
        <li><strong>US High-Yield Savings (4.5–5.0% APY):</strong> Doubles in 14.4–16 years</li>
        <li><strong>Short-Term Treasuries (4.2–4.7%):</strong> Doubles in 15.3–17.1 years</li>
        <li><strong>Investment-Grade Corporate Bonds (5.0–6.0%):</strong> Doubles in 12–14.4 years</li>
        <li><strong>S&P 500 Index Fund (historical 10%):</strong> Doubles in 7.2 years</li>
        <li><strong>Global Equity (historical 7–9%):</strong> Doubles in 8–10.3 years</li>
        <li><strong>US Real Estate (total return ~6–8%):</strong> Doubles in 9–12 years</li>
        <li><strong>Bitcoin (10-year historical avg ~50%+):</strong> Extremely high volatility — Rule of 72 not meaningful at this range</li>
        <li><strong>Inflation at 3.0% CPI:</strong> Purchasing power halved in 24 years</li>
        <li><strong>Credit Card Debt (20–28% APR):</strong> Balance doubles in 2.6–3.6 years if unpaid</li>
      </ul>

      <h3>How to Use This Rule of 72 Calculator</h3>
      <ol>
        <li>
          <strong>Basic Calculator:</strong> Enter your annual rate of return and principal. Instantly see
          Rule of 72 years, exact years, Rule of 70, Rule of 69.3, error percentage, doubling schedule, and
          a quick-reference table for common asset classes.
        </li>
        <li>
          <strong>Step-by-Step Working:</strong> Expand the &quot;Show Step-by-Step Working&quot; section to see
          exactly how the answer is derived — ideal for students or anyone wanting to understand the formula.
        </li>
        <li>
          <strong>With Contributions:</strong> Switch to the &quot;With Contributions&quot; tab. Enter your regular
          contribution amount and frequency, choose your compounding frequency, and see how much faster you
          reach your doubling target.
        </li>
        <li>
          <strong>Compare Scenarios:</strong> Add up to 6 scenarios with different rates and principals.
          Compare doubling times side-by-side in a table and a visual bar chart.
        </li>
      </ol>
    </div>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────────────────────

const FAQS = [
  { q: "What is the Rule of 72?", a: "The Rule of 72 is a mental math shortcut in finance: divide 72 by your annual rate of return to estimate the years it will take your investment to double. At 9%: 72 ÷ 9 = 8 years. It works for any fixed-rate compounding scenario." },
  { q: "What is the Rule of 72 formula?", a: "Years to Double = 72 ÷ Annual Rate of Return (%). The exact mathematical formula is: t = ln(2) ÷ ln(1 + r), where r is the decimal rate. The Rule of 72 approximates this with minimal error between 6–10% rates." },
  { q: "How does the Rule of 72 apply to investing (72 rule investing)?", a: "In investing, the Rule of 72 helps you instantly evaluate any opportunity: at the S&P 500's historical 10% average, money doubles every 7.2 years. At a 5% bond, every 14.4 years. It also works in reverse: need to double in 8 years? You need 9% annual return." },
  { q: "Can the Rule of 72 be used for monthly compounding?", a: "For a rough estimate with monthly compounding, use the monthly rate: Monthly Rate = Annual Rate ÷ 12, then Months to Double = 72 ÷ Monthly Rate. For precise calculations, our Advanced tab uses the exact compound interest formula for any compounding frequency." },
  { q: "How does the Rule of 72 calculator with contributions work?", a: "When you add regular contributions (monthly or annual), the doubling time for your original principal is reduced because contributions add to your balance faster. Our calculator uses the exact compound interest formula with contributions to calculate a precise schedule, which will always be faster than the Rule of 72 baseline." },
  { q: "What is the difference between Rule of 72, Rule of 70, and Rule of 69.3?", a: "Rule of 72 (÷ by 72) is best for mental math and most accurate between 6–10%. Rule of 70 (÷ by 70) is used in economics for continuous compounding. Rule of 69.3 (÷ by 69.3) is the mathematically exact continuous compounding constant (ln(2) = 0.6931). All three estimate doubling time; 72 is preferred for everyday investing calculations." },
  { q: "How accurate is the Rule of 72 vs the exact formula?", a: "At 8% APR: Rule of 72 gives 9.0 years; exact formula gives 9.006 years — essentially identical. At 2%: Rule of 72 gives 36 years vs. exact 35.0 years (2.9% error). At 20%: 3.6 vs 3.80 years (5.1% error). The rule is most accurate between 6–10%, which covers most long-term investment scenarios." },
  { q: "Can the Rule of 72 be applied to inflation?", a: "Yes — and it's one of the most powerful uses. At 3% inflation: 72 ÷ 3 = 24 years for prices to double (and your purchasing power to halve). At 6% inflation: just 12 years. This makes the case for keeping money invested rather than holding cash." },
  { q: "Does the Rule of 72 work for debt?", a: "Absolutely. Credit card at 24% APR: 72 ÷ 24 = 3 years for an unpaid balance to double. Student loan at 6.5%: 72 ÷ 6.5 = 11.1 years. The Rule of 72 makes the compounding cost of debt immediately concrete — a powerful motivator for repayment." },
  { q: "What is the Rule of 72 example for a $10,000 investment?", a: "At 8% annual return: $10,000 doubles to $20,000 in ~9 years (72 ÷ 8). It doubles again to $40,000 in 18 years, $80,000 in 27 years, and $160,000 in 36 years — all without adding a single dollar. The doubling schedule grows exponentially, illustrating the 'hockey stick' of compound interest." },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="r72-faq-inner">
      <h2 className="r72-section-title">Frequently Asked Questions</h2>
      <div className="r72-faq-list">
        {FAQS.map((f, i) => (
          <div key={i} className={`r72-faq-item${open === i ? " r72-faq-item--open" : ""}`}>
            <button className="r72-faq-q" onClick={() => setOpen(open === i ? null : i)}>
              <span>{f.q}</span>
              <span className="r72-faq-chevron">{open === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
            </button>
            {open === i && <p className="r72-faq-a">{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
  /* ── Base ── */
  .r72-page {
    font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
    background: #f9fbfd;
    color: #1a202c;
    min-height: 100vh;
  }
  .r72-container { max-width: 1120px; margin: 0 auto; padding: 0 1.25rem; }

  /* ── Hero ── */
  .r72-hero {
    background: linear-gradient(135deg, #1a365d 0%, #1e3a8a 100%);
    color: #ffffff;
    padding: 3.5rem 0 3rem;
    position: relative;
    overflow: hidden;
  }
  .r72-hero::after {
    content: '';
    position: absolute;
    top: -20%;
    right: -10%;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%);
    pointer-events: none;
  }
  .r72-breadcrumb { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #a5b4fc; margin-bottom: 2rem; }
  .r72-breadcrumb a { color: #f5a623; text-decoration: none; font-weight: 500; }
  .r72-breadcrumb a:hover { text-decoration: underline; }
  .r72-hero-inner { display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: center; }
  .r72-badge {
    display: inline-block;
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #f5a623;
    border: 1px solid rgba(245,166,35,0.4);
    padding: 0.3rem 0.9rem;
    border-radius: 4px;
    margin-bottom: 1.25rem;
    background: rgba(245,166,35,0.1);
    font-weight: 700;
  }
  .r72-title {
    font-size: clamp(2.5rem, 7vw, 4rem);
    font-weight: 800;
    line-height: 1.1;
    margin: 0 0 1.25rem;
    color: #ffffff;
    letter-spacing: -0.03em;
  }
  .r72-title-accent { color: #f5a623; }
  .r72-subtitle { font-size: 1.1rem; color: #e0e7ff; max-width: 580px; line-height: 1.6; margin: 0; }
  .r72-subtitle strong { color: #ffffff; border-bottom: 1px dashed #f5a623; }

  /* ── Dial ── */
  .r72-dial-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
  .r72-dial {
    width: 180px; height: 100px;
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    position: relative;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }
  .r72-dial-number {
    font-size: 3rem;
    font-weight: 900;
    color: #f5a623;
    line-height: 1;
    font-family: 'Courier New', monospace;
  }
  .r72-dial-sub { font-size: 0.75rem; color: #cbd5e1; font-family: 'Courier New', monospace; margin-top: 0.25rem; font-weight: 600; }
  .r72-dial-arc { width: 140px; position: absolute; bottom: 0; }
  .r72-dial-labels { display: flex; justify-content: space-between; width: 140px; font-size: 0.65rem; color: #94a3b8; font-family: 'Courier New', monospace; }

  /* ── Main ── */
  .r72-main { padding: 3rem 1.25rem; }

  /* ── Tabs ── */
  .r72-tabs { display: flex; gap: 0.5rem; margin-bottom: 2.5rem; border-bottom: 2px solid #e5e7eb; flex-wrap: wrap; }
  .r72-tab {
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    margin-bottom: -2px;
    padding: 0.875rem 1.25rem;
    font-size: 0.95rem;
    cursor: pointer;
    color: #64748b;
    font-family: inherit;
    transition: all 0.2s;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .r72-tab:hover { color: #1e3a8a; background: #f1f5f9; border-radius: 8px 8px 0 0; }
  .r72-tab--active { color: #1e3a8a; border-bottom-color: #f5a623; font-weight: 700; }

  /* ── Section ── */
  .r72-section { }
  .r72-basic-grid { display: grid; grid-template-columns: 380px 1fr; gap: 2rem; align-items: start; margin-bottom: 3rem; }

  /* ── Inputs card ── */
  .r72-inputs-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  .r72-card-title { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 1.5rem; }
  .r72-field { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem; }
  .r72-field:last-child { margin-bottom: 0; }
  .r72-field-label { font-size: 0.8rem; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em; }
  .r72-slider-row { display: flex; align-items: center; gap: 1rem; }
  .r72-slider {
    flex: 1;
    -webkit-appearance: none;
    height: 6px;
    border-radius: 99px;
    background: #e2e8f0;
    outline: none;
  }
  .r72-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px; height: 20px;
    border-radius: 50%;
    background: #f5a623;
    cursor: pointer;
    border: 3px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .r72-num-input {
    width: 100px;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    color: #1e293b;
    font-size: 1rem;
    font-family: 'Courier New', monospace;
    font-weight: 700;
    text-align: right;
  }
  .r72-num-input--full { width: 100%; text-align: left; }
  .r72-num-input:focus { outline: 2px solid #f5a623; border-color: transparent; }
  .r72-select {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    color: #1e293b;
    font-family: inherit;
    font-size: 0.95rem;
    width: 100%;
  }
  .r72-inline-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

  .r72-info-box {
    display: flex;
    gap: 0.75rem;
    background: #fdfaf3;
    border: 1px solid #f9ebc8;
    border-radius: 8px;
    padding: 1rem;
    font-size: 0.875rem;
    color: #713f12;
    line-height: 1.6;
    margin-top: 1.5rem;
  }
  .r72-info-icon { color: #f5a623; flex-shrink: 0; }

  /* ── Results ── */
  .r72-results-stack { display: flex; flex-direction: column; gap: 1.25rem; }
  .r72-result-hero {
    background: #ffffff;
    border: 2px solid #f5a623;
    border-radius: 16px;
    padding: 2.5rem 2rem;
    text-align: center;
    position: relative;
    box-shadow: 0 10px 25px -5px rgba(245,166,35,0.1);
  }
  .r72-result-tag { font-size: 0.8rem; font-weight: 700; color: #f5a623; text-transform: uppercase; letter-spacing: 0.1em; }
  .r72-result-big {
    font-size: clamp(4rem, 10vw, 6rem);
    font-weight: 900;
    font-family: 'Courier New', monospace;
    color: #1e293b;
    line-height: 1;
    margin: 0.5rem 0;
    letter-spacing: -0.05em;
  }
  .r72-result-unit { font-size: 1.25rem; font-weight: 600; color: #64748b; }
  .r72-result-sub { font-size: 0.9rem; color: #94a3b8; margin-top: 0.75rem; font-family: 'Courier New', monospace; }

  .r72-comparison-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
  .r72-cmp-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .r72-cmp-card--hl { border-color: #f5a623; background: #fffdf5; }
  .r72-cmp-label { font-size: 0.75rem; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; }
  .r72-cmp-value { font-size: 1.05rem; font-weight: 700; color: #1e293b; font-family: 'Courier New', monospace; }
  .r72-cmp-card--hl .r72-cmp-value { color: #f5a623; }

  /* ── Steps ── */
  .r72-steps-panel {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 3rem;
  }
  .r72-steps-toggle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    background: none;
    border: none;
    color: #1e293b;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
  }
  .r72-steps-toggle:hover { background: #f8fafc; }
  .r72-steps-body { padding: 0 1.5rem 1.5rem; border-top: 1px solid #f1f5f9; }
  .r72-step { display: flex; gap: 1rem; align-items: flex-start; padding: 1rem 0; border-bottom: 1px solid #f1f5f9; }
  .r72-step:last-child { border-bottom: none; }
  .r72-step-num {
    width: 1.75rem; height: 1.75rem;
    border-radius: 50%;
    background: #fef3c7;
    color: #d97706;
    font-size: 0.8rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .r72-step-text { font-size: 0.95rem; color: #475569; line-height: 1.6; }
  .r72-formula-block {
    background: #f8fafc;
    border-left: 4px solid #f5a623;
    padding: 1.25rem 1.5rem;
    margin-top: 1.5rem;
    border-radius: 0 8px 8px 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .r72-formula-label { font-size: 0.75rem; font-weight: 800; color: #f5a623; text-transform: uppercase; letter-spacing: 0.1em; }
  .r72-formula-block code { font-family: 'Courier New', monospace; font-size: 1rem; color: #1e293b; font-weight: 700; }

  /* ── Doublings ── */
  .r72-doublings { margin-bottom: 3rem; }
  .r72-section-subtitle { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 1.5rem; }
  .r72-doubling-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 1rem; }
  .r72-doubling-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .r72-doubling-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
  .r72-doubling-x { font-size: 0.8rem; color: #f5a623; font-weight: 800; }
  .r72-doubling-year { font-size: 0.85rem; color: #64748b; font-weight: 500; }
  .r72-doubling-value { font-size: 1.15rem; font-weight: 800; color: #1e293b; font-family: 'Courier New', monospace; }
  .r72-doubling-bar-wrap { height: 5px; background: #f1f5f9; border-radius: 99px; overflow: hidden; margin-top: 0.5rem; }
  .r72-doubling-bar { height: 100%; background: linear-gradient(90deg, #f5a623, #fbbf24); border-radius: 99px; }

  /* ── Reference table ── */
  .r72-quick-ref { margin-bottom: 3rem; }
  .r72-ref-table-wrap { overflow-x: auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; }
  .r72-ref-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
  .r72-ref-table th {
    background: #f8fafc;
    color: #475569;
    padding: 1rem 1.25rem;
    text-align: left;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #e2e8f0;
  }
  .r72-ref-table td { padding: 0.875rem 1.25rem; border-bottom: 1px solid #f1f5f9; color: #1e293b; }
  .r72-ref-table tr:hover td { background: #fdfaf3; }
  .r72-td-num { text-align: right; font-family: 'Courier New', monospace; font-weight: 600; }
  .r72-td-hl { color: #f5a623; font-weight: 800; }

  /* ── Compare ── */
  .r72-compare-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; }
  .r72-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 0.95rem; cursor: pointer; font-family: inherit; transition: all 0.2s; border: none; }
  .r72-btn--amber { background: #f5a623; color: #ffffff; font-weight: 700; box-shadow: 0 4px 14px 0 rgba(245,166,35,0.3); }
  .r72-btn--amber:hover { background: #d97706; transform: scale(1.02); }
  .r72-btn--amber:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
  .r72-scenarios { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 2rem; }
  .r72-scenario { background: #ffffff; border: 1px solid #e2e8f0; border-top-width: 5px; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
  .r72-scenario-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; }
  .r72-scenario-dot { width: 12px; height: 12px; border-radius: 50%; }
  .r72-scenario-dot--sm { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 0.5rem; }
  .r72-scenario-label-input { flex: 1; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 0.4rem 0.75rem; color: #1e293b; font-size: 0.95rem; font-weight: 700; }
  .r72-scenario-remove { background: #fef2f2; border: 1px solid #fee2e2; border-radius: 6px; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #ef4444; }
  .r72-scenario-remove:hover { background: #fee2e2; }
  .r72-scenario-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem; }
  .r72-scenario-result { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 1rem; border-top: 1px solid #f1f5f9; }
  .r72-scenario-years { font-size: 1.75rem; font-weight: 900; font-family: 'Courier New', monospace; line-height: 1; }
  .r72-scenario-val { font-size: 1rem; font-weight: 800; color: #1e293b; font-family: 'Courier New', monospace; }

  /* ── Bar chart ── */
  .r72-bar-chart { margin-top: 3rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2rem; }
  .r72-bar-row { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1rem; }
  .r72-bar-label { width: 150px; font-size: 0.9rem; color: #475569; font-weight: 600; text-align: right; }
  .r72-bar-track { flex: 1; height: 28px; background: #f1f5f9; border-radius: 6px; overflow: hidden; position: relative; }
  .r72-bar-fill { height: 100%; border-radius: 6px; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
  .r72-bar-value { width: 80px; font-size: 0.9rem; color: #1e293b; font-weight: 700; font-family: 'Courier New', monospace; }

  /* ── Article ── */
  .r72-article { padding: 4rem 1.25rem; border-top: 1px solid #e5e7eb; }
  .r72-prose h2 { font-size: 1.75rem; color: #1e293b; margin: 2.5rem 0 1rem; font-weight: 800; }
  .r72-prose h3 { font-size: 1.3rem; color: #1e3a8a; margin: 2rem 0 0.75rem; font-weight: 700; }
  .r72-prose p { line-height: 1.8; color: #475569; margin-bottom: 1.25rem; font-size: 1rem; }
  .r72-prose ul, .r72-prose ol { padding-left: 1.5rem; margin-bottom: 1.5rem; }
  .r72-prose li { line-height: 1.8; color: #475569; margin-bottom: 0.6rem; font-size: 1rem; }
  .r72-prose strong { color: #1e293b; font-weight: 700; }
  .r72-prose code { font-family: 'Courier New', monospace; color: #d97706; background: #fef3c7; padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.9em; }

  /* ── FAQ ── */
  .r72-faq-section { padding: 3rem 1.25rem 4rem; border-top: 1px solid #e5e7eb; }
  .r72-faq-inner { max-width: 800px; margin: 0 auto; }
  .r72-faq-q { width: 100%; text-align: left; background: none; border: none; padding: 1.25rem 0; font-size: 1.05rem; font-weight: 700; color: #1e293b; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 1rem; font-family: inherit; }
  .r72-faq-chevron { color: #f5a623; }
  .r72-faq-a { padding: 0 0 1.25rem; line-height: 1.8; color: #475569; font-size: 1rem; }

  /* ── Disclaimer ── */
  .r72-disclaimer {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.25rem 1.5rem;
    font-size: 0.875rem;
    color: #64748b;
    line-height: 1.7;
    margin: 3rem 0 4rem;
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .r72-basic-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .r72-hero-inner { grid-template-columns: 1fr; text-align: center; }
    .r72-hero-text { display: flex; flex-direction: column; align-items: center; }
    .r72-dial-wrap { margin-top: 2rem; }
    .r72-comparison-grid { grid-template-columns: repeat(2, 1fr); }
    .r72-tab { padding: 0.75rem 1rem; font-size: 0.85rem; }
  }
`;
