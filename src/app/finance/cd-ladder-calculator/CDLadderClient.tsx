"use client";

import { useState, useMemo, useCallback } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Landmark, 
  Calendar, 
  Zap, 
  Layers, 
  BookOpen, 
  Plus, 
  X, 
  ClipboardList,
  Check,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CDRung {
  id: string;
  label: string;
  principal: number;
  termMonths: number;
  apy: number;
  startDate: string; // YYYY-MM-DD
  compounding: "daily" | "monthly" | "quarterly" | "annually";
}

interface CDResult {
  rung: CDRung;
  maturityDate: Date;
  maturityDateStr: string;
  daysToMaturity: number;
  totalInterest: number;
  totalValue: number;
  monthlyInterest: number;
  effectiveApy: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(value: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function formatPct(value: number): string {
  return value.toFixed(3) + "%";
}

function compoundInterest(
  principal: number,
  apyDecimal: number,
  termMonths: number,
  compounding: CDRung["compounding"]
): number {
  const n =
    compounding === "daily"
      ? 365
      : compounding === "monthly"
      ? 12
      : compounding === "quarterly"
      ? 4
      : 1;
  const t = termMonths / 12;
  const r = apyDecimal / n;
  return principal * Math.pow(1 + r, n * t) - principal;
}

function calculateRung(rung: CDRung): CDResult {
  const start = new Date(rung.startDate);
  const maturityDate = addMonths(start, rung.termMonths);
  const today = new Date();
  const daysToMaturity = Math.max(
    0,
    Math.ceil((maturityDate.getTime() - today.getTime()) / 86400000)
  );

  const apyDecimal = rung.apy / 100;
  const totalInterest = compoundInterest(
    rung.principal,
    apyDecimal,
    rung.termMonths,
    rung.compounding
  );
  const totalValue = rung.principal + totalInterest;
  const monthlyInterest = totalInterest / rung.termMonths;

  // Effective APY (for display, already is APY but confirm)
  const effectiveApy = rung.apy;

  return {
    rung,
    maturityDate,
    maturityDateStr: formatDate(maturityDate),
    daysToMaturity,
    totalInterest,
    totalValue,
    monthlyInterest,
    effectiveApy,
  };
}

// ─── Preset Ladders ───────────────────────────────────────────────────────────

const PRESET_LADDERS: { label: string; rungs: Omit<CDRung, "id">[] }[] = [
  {
    label: "Classic 5-Year",
    rungs: [
      { label: "Rung 1 – 1 Year", principal: 10000, termMonths: 12, apy: 4.75, startDate: new Date().toISOString().slice(0, 10), compounding: "daily" },
      { label: "Rung 2 – 2 Year", principal: 10000, termMonths: 24, apy: 4.60, startDate: new Date().toISOString().slice(0, 10), compounding: "daily" },
      { label: "Rung 3 – 3 Year", principal: 10000, termMonths: 36, apy: 4.50, startDate: new Date().toISOString().slice(0, 10), compounding: "daily" },
      { label: "Rung 4 – 4 Year", principal: 10000, termMonths: 48, apy: 4.40, startDate: new Date().toISOString().slice(0, 10), compounding: "daily" },
      { label: "Rung 5 – 5 Year", principal: 10000, termMonths: 60, apy: 4.30, startDate: new Date().toISOString().slice(0, 10), compounding: "daily" },
    ],
  },
  {
    label: "Short-Term 3-Rung",
    rungs: [
      { label: "Rung 1 – 3 Month", principal: 5000, termMonths: 3, apy: 5.00, startDate: new Date().toISOString().slice(0, 10), compounding: "daily" },
      { label: "Rung 2 – 6 Month", principal: 5000, termMonths: 6, apy: 4.90, startDate: new Date().toISOString().slice(0, 10), compounding: "daily" },
      { label: "Rung 3 – 12 Month", principal: 5000, termMonths: 12, apy: 4.75, startDate: new Date().toISOString().slice(0, 10), compounding: "daily" },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().slice(0, 10);

function makeDefaultRung(index: number): CDRung {
  const terms = [12, 24, 36, 48, 60];
  const apys = [4.75, 4.60, 4.50, 4.40, 4.30];
  return {
    id: crypto.randomUUID(),
    label: `Rung ${index + 1} – ${terms[index] / 12 === 1 ? "1 Year" : terms[index] / 12 + " Year"}`,
    principal: 10000,
    termMonths: terms[index] ?? 12,
    apy: apys[index] ?? 4.50,
    startDate: TODAY,
    compounding: "daily",
  };
}

export default function CDLadderClient() {
  const [rungs, setRungs] = useState<CDRung[]>([0, 1, 2, 3, 4].map(makeDefaultRung));
  const [activeTab, setActiveTab] = useState<"builder" | "schedule" | "guide">("builder");
  const [presetOpen, setPresetOpen] = useState(false);

  const results = useMemo(() => rungs.map(calculateRung), [rungs]);

  const totalPrincipal = useMemo(() => results.reduce((s, r) => s + r.rung.principal, 0), [results]);
  const totalInterest = useMemo(() => results.reduce((s, r) => s + r.totalInterest, 0), [results]);
  const totalValue = useMemo(() => results.reduce((s, r) => s + r.totalValue, 0), [results]);
  const totalMonthlyIncome = useMemo(() => results.reduce((s, r) => s + r.monthlyInterest, 0), [results]);
  const blendedApy = useMemo(
    () => (totalPrincipal > 0 ? (totalInterest / totalPrincipal / (results.reduce((s, r) => s + r.rung.termMonths, 0) / results.length / 12)) * 100 : 0),
    [results, totalPrincipal, totalInterest]
  );

  const updateRung = useCallback((id: string, field: keyof CDRung, value: string | number) => {
    setRungs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  }, []);

  const addRung = useCallback(() => {
    setRungs((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        label: `Rung ${prev.length + 1}`,
        principal: 10000,
        termMonths: 12,
        apy: 4.50,
        startDate: TODAY,
        compounding: "daily" as const,
      },
    ]);
  }, []);

  const removeRung = useCallback((id: string) => {
    setRungs((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const applyPreset = useCallback((preset: typeof PRESET_LADDERS[0]) => {
    setRungs(preset.rungs.map((r) => ({ ...r, id: crypto.randomUUID() })));
    setPresetOpen(false);
  }, []);

  // Monthly interest schedule across all rungs
  const schedule = useMemo(() => {
    const months: { month: string; date: Date; entries: { rung: CDRung; interest: number; balance: number; matured: boolean }[]; totalInterest: number }[] = [];
    if (results.length === 0) return months;
    const maxMonths = Math.max(...results.map((r) => r.rung.termMonths));
    const startDate = new Date(results[0]?.rung.startDate ?? TODAY);

    for (let m = 1; m <= maxMonths; m++) {
      const d = addMonths(startDate, m);
      const entries = results.map((r) => {
        const active = m <= r.rung.termMonths;
        const monthlyRate = r.rung.apy / 100 / 12;
        const interest = active ? r.rung.principal * monthlyRate : 0;
        const balance = active ? r.rung.principal * Math.pow(1 + monthlyRate, m) : r.totalValue;
        const matured = m === r.rung.termMonths;
        return { rung: r.rung, interest, balance, matured };
      });
      months.push({
        month: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        date: d,
        entries,
        totalInterest: entries.reduce((s, e) => s + e.interest, 0),
      });
    }
    return months;
  }, [results]);

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "CD Ladder Calculator",
            url: "https://findbest.tools/finance/cd-ladder-calculator",
            description:
              "Free CD ladder calculator with cd maturity calculator and monthly cd interest calculator. Build multi-rung CD ladders, track maturity dates, and project interest income.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            featureList: [
              "Multi-rung CD ladder builder",
              "CD maturity date calculator",
              "Monthly CD interest calculator",
              "Compound interest with daily/monthly/quarterly/annual compounding",
              "Blended APY calculation",
              "Amortization-style monthly schedule",
            ],
          }),
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is a CD ladder?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A CD ladder is an investment strategy where you split a lump sum across multiple certificates of deposit with staggered maturity dates. As each CD matures, you reinvest it into the longest rung, maintaining continuous liquidity while capturing higher long-term rates.",
                },
              },
              {
                "@type": "Question",
                name: "How do I calculate CD maturity date?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Add the CD term (in months) to your start date. A 12-month CD opened on January 1, 2026 matures on January 1, 2026. Our cd maturity calculator does this automatically for every rung.",
                },
              },
              {
                "@type": "Question",
                name: "How do I calculate monthly CD interest?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Divide the annual APY by 12 and multiply by your principal: Monthly Interest ≈ Principal × (APY / 12). For compound interest, the formula compounds periodically. Our monthly cd interest calculator handles all compounding frequencies.",
                },
              },
              {
                "@type": "Question",
                name: "What is the best CD ladder strategy?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The classic 5-rung, 5-year CD ladder splits funds equally into 1, 2, 3, 4, and 5-year CDs. Each year, the maturing CD is reinvested into a new 5-year CD, providing annual liquidity windows while always holding the higher long-term rate.",
                },
              },
              {
                "@type": "Question",
                name: "Is a CD ladder better than a high-yield savings account?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "CD ladders typically offer higher APYs than HYSAs, especially for longer terms. However, CDs lock funds until maturity (with early withdrawal penalties). A CD ladder balances both — annual liquidity windows through staggered maturities, with competitive rates on longer rungs.",
                },
              },
            ],
          }),
        }}
      />

      <div className="cd-page">
        {/* ── Header ── */}
        <header className="cd-hero">
          <div className="cd-container">
            <div className="cd-badge">Finance · Certificate of Deposit</div>
            <h1 className="cd-title">
              CD Ladder Calculator
            </h1>
            <p className="cd-subtitle">
              Build a multi-rung CD ladder, use our built-in{" "}
              <strong>cd maturity calculator</strong> to track every maturity
              date, and project exact earnings with our{" "}
              <strong>monthly cd interest calculator</strong>.
            </p>
            {/* Breadcrumb */}
            <nav className="cd-breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span>/</span>
              <a href="/finance">Finance</a>
              <span>/</span>
              <span>CD Ladder Calculator</span>
            </nav>
          </div>
        </header>

        {/* ── Main Tool ── */}
        <main className="cd-container cd-main">
          {/* ── Summary Cards ── */}
          <div className="cd-summary-grid">
            {[
              { label: "Total Principal", value: formatCurrency(totalPrincipal), icon: <DollarSign size={20} /> },
              { label: "Total Interest Earned", value: formatCurrency(totalInterest), icon: <TrendingUp size={20} /> },
              { label: "Total Portfolio Value", value: formatCurrency(totalValue), icon: <Landmark size={20} /> },
              { label: "Monthly Income", value: formatCurrency(totalMonthlyIncome), icon: <Calendar size={20} /> },
              { label: "Blended APY", value: formatPct(blendedApy), icon: <Zap size={20} /> },
              { label: "Active Rungs", value: String(rungs.length), icon: <Layers size={20} /> },
            ].map((c) => (
              <div key={c.label} className="cd-card">
                <span className="cd-card-icon">{c.icon}</span>
                <span className="cd-card-value">{c.value}</span>
                <span className="cd-card-label">{c.label}</span>
              </div>
            ))}
          </div>

          {/* ── Tabs ── */}
          <div className="cd-tabs">
            <button
              className={`cd-tab${activeTab === "builder" ? " cd-tab--active" : ""}`}
              onClick={() => setActiveTab("builder")}
            >
              <Layers size={16} className="inline mr-2" /> Ladder Builder
            </button>
            <button
              className={`cd-tab${activeTab === "schedule" ? " cd-tab--active" : ""}`}
              onClick={() => setActiveTab("schedule")}
            >
              <Calendar size={16} className="inline mr-2" /> Monthly Schedule
            </button>
            <button
              className={`cd-tab${activeTab === "guide" ? " cd-tab--active" : ""}`}
              onClick={() => setActiveTab("guide")}
            >
              <BookOpen size={16} className="inline mr-2" /> Strategy Guide
            </button>
          </div>

          {/* ── Builder Tab ── */}
          {activeTab === "builder" && (
            <section className="cd-builder">
              <div className="cd-builder-toolbar">
                <h2 className="cd-section-title">Your CD Ladder Rungs</h2>
                <div className="cd-toolbar-actions">
                  <div className="cd-preset-wrapper">
                    <button className="cd-btn cd-btn--outline" onClick={() => setPresetOpen(!presetOpen)}>
                      <ClipboardList size={16} /> Load Preset
                    </button>
                    {presetOpen && (
                      <div className="cd-preset-menu">
                        {PRESET_LADDERS.map((p) => (
                          <button key={p.label} className="cd-preset-item" onClick={() => applyPreset(p)}>
                            {p.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="cd-btn cd-btn--primary" onClick={addRung}>
                    <Plus size={16} /> Add Rung
                  </button>
                </div>
              </div>

              <div className="cd-rungs">
                {rungs.map((rung, idx) => {
                  const res = results[idx];
                  return (
                    <div key={rung.id} className="cd-rung">
                      <div className="cd-rung-header">
                        <div className="cd-rung-number">{idx + 1}</div>
                        <input
                          className="cd-rung-label-input"
                          value={rung.label}
                          onChange={(e) => updateRung(rung.id, "label", e.target.value)}
                          placeholder="Rung label"
                        />
                        <button
                          className="cd-rung-remove"
                          onClick={() => removeRung(rung.id)}
                          aria-label="Remove rung"
                          disabled={rungs.length <= 1}
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="cd-rung-fields">
                        <label className="cd-field">
                          <span>Principal ($)</span>
                          <input
                            type="number"
                            min={100}
                            step={100}
                            value={rung.principal}
                            onChange={(e) => updateRung(rung.id, "principal", Number(e.target.value))}
                          />
                        </label>
                        <label className="cd-field">
                          <span>APY (%)</span>
                          <input
                            type="number"
                            min={0.01}
                            max={20}
                            step={0.01}
                            value={rung.apy}
                            onChange={(e) => updateRung(rung.id, "apy", Number(e.target.value))}
                          />
                        </label>
                        <label className="cd-field">
                          <span>Term (months)</span>
                          <input
                            type="number"
                            min={1}
                            max={120}
                            step={1}
                            value={rung.termMonths}
                            onChange={(e) => updateRung(rung.id, "termMonths", Number(e.target.value))}
                          />
                        </label>
                        <label className="cd-field">
                          <span>Start Date</span>
                          <input
                            type="date"
                            value={rung.startDate}
                            onChange={(e) => updateRung(rung.id, "startDate", e.target.value)}
                          />
                        </label>
                        <label className="cd-field">
                          <span>Compounding</span>
                          <select
                            value={rung.compounding}
                            onChange={(e) => updateRung(rung.id, "compounding", e.target.value as CDRung["compounding"])}
                          >
                            <option value="daily">Daily (365x/yr)</option>
                            <option value="monthly">Monthly (12x/yr)</option>
                            <option value="quarterly">Quarterly (4x/yr)</option>
                            <option value="annually">Annually (1x/yr)</option>
                          </select>
                        </label>
                      </div>

                      {res && (
                        <div className="cd-rung-results">
                          <div className="cd-rung-result-item">
                            <span className="cd-rung-result-label">Matures</span>
                            <span className="cd-rung-result-value cd-rung-result-value--date">
                              {res.maturityDateStr}
                              {res.daysToMaturity > 0 && (
                                <span className="cd-days-badge">{res.daysToMaturity}d left</span>
                              )}
                              {res.daysToMaturity === 0 && (
                                <span className="cd-days-badge cd-days-badge--mature">Matured</span>
                              )}
                            </span>
                          </div>
                          <div className="cd-rung-result-item">
                            <span className="cd-rung-result-label">Monthly Interest</span>
                            <span className="cd-rung-result-value">{formatCurrency(res.monthlyInterest)}</span>
                          </div>
                          <div className="cd-rung-result-item">
                            <span className="cd-rung-result-label">Total Interest</span>
                            <span className="cd-rung-result-value cd-green">{formatCurrency(res.totalInterest)}</span>
                          </div>
                          <div className="cd-rung-result-item">
                            <span className="cd-rung-result-label">Maturity Value</span>
                            <span className="cd-rung-result-value cd-bold">{formatCurrency(res.totalValue)}</span>
                          </div>
                        </div>
                      )}

                      {/* Mini progress bar */}
                      {res && (
                        <div className="cd-progress-wrap">
                          <div
                            className="cd-progress-bar"
                            style={{
                              width: `${Math.max(5, Math.min(100, ((rung.termMonths - res.daysToMaturity / 30) / rung.termMonths) * 100))}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Maturity Timeline */}
              <div className="cd-timeline-section">
                <h3 className="cd-section-subtitle">Maturity Timeline</h3>
                <div className="cd-timeline">
                  {results
                    .slice()
                    .sort((a, b) => a.maturityDate.getTime() - b.maturityDate.getTime())
                    .map((r, i) => (
                      <div key={r.rung.id} className="cd-timeline-item">
                        <div className="cd-timeline-dot" />
                        <div className="cd-timeline-content">
                          <span className="cd-timeline-label">{r.rung.label}</span>
                          <span className="cd-timeline-date">{r.maturityDateStr}</span>
                          <span className="cd-timeline-value">{formatCurrency(r.totalValue)}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Schedule Tab ── */}
          {activeTab === "schedule" && (
            <section className="cd-schedule">
              <h2 className="cd-section-title">Monthly Interest Schedule</h2>
              <p className="cd-schedule-intro">
                This is your <strong>monthly cd interest calculator</strong> view — showing
                estimated interest earned each month across all rungs. Maturity
                months are highlighted in green.
              </p>
              <div className="cd-table-wrap">
                <table className="cd-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      {results.map((r, i) => (
                        <th key={r.rung.id}>{r.rung.label}</th>
                      ))}
                      <th>Total Monthly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((row) => (
                      <tr
                        key={row.month}
                        className={row.entries.some((e) => e.matured) ? "cd-table-row--mature" : ""}
                      >
                        <td className="cd-table-month">{row.month}</td>
                        {row.entries.map((e, i) => (
                          <td key={i} className={e.matured ? "cd-cell-mature" : e.interest === 0 ? "cd-cell-inactive" : ""}>
                            {e.interest > 0
                              ? formatCurrency(e.interest)
                              : e.matured
                              ? <div className="flex items-center justify-end gap-1"><Check size={12} /> {formatCurrency(e.balance)}</div>
                              : "—"}
                          </td>
                        ))}
                        <td className="cd-table-total">{formatCurrency(row.totalInterest)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="cd-disclaimer">
                * Monthly interest shown uses simple monthly rate (APY ÷ 12) for readability. Actual compounded balance shown at maturity.
              </p>
            </section>
          )}

          {/* ── Guide Tab ── */}
          {activeTab === "guide" && (
            <section className="cd-guide">
              <div className="cd-guide-content">
                {/* The extensive SEO content lives here */}
                <GuideContent />
              </div>
            </section>
          )}
        </main>

        {/* ── Full SEO Article (always rendered for crawlers) ── */}
        <article className="cd-article cd-container">
          <SEOArticle />
        </article>

        {/* ── FAQ ── */}
        <section className="cd-faq cd-container">
          <FAQSection />
        </section>

        {/* ── Disclaimer ── */}
        <div className="cd-container">
          <div className="cd-disclaimer-box">
            <strong>Disclaimer:</strong> This CD ladder calculator is an educational tool for modelling
            certificate of deposit earnings. It does not constitute financial advice. APY assumptions are
            illustrative; actual rates vary by institution and change over time. Always verify terms with
            your bank or credit union. FDIC insurance applies per depositor, per institution, per ownership
            category up to $250,000.
          </div>
        </div>

        <style>{CSS}</style>
      </div>
    </>
  );
}

// ─── Guide Content (SEO long-form) ────────────────────────────────────────────

function GuideContent() {
  return (
    <div className="cd-prose">
      <h2>What Is a CD Ladder? A Complete Strategy Guide</h2>
      <p>
        A <strong>CD ladder</strong> (certificate of deposit ladder) is one of the safest and most
        predictable wealth-building strategies available to individual savers. Instead of locking all
        your money into a single long-term CD — forfeiting liquidity — or keeping it all in a
        low-yield savings account, a CD ladder splits your funds across multiple CDs with different
        maturity dates.
      </p>
      <p>
        Our <strong>CD ladder calculator</strong> above makes building and tracking your ladder
        effortless. You enter each rung&apos;s principal, APY, term, and compounding frequency.
        The built-in <strong>cd maturity calculator</strong> instantly shows when each CD matures,
        and the <strong>monthly cd interest calculator</strong> tab breaks down income month by month.
      </p>

      <h3>How a CD Ladder Works — Step by Step</h3>
      <ol>
        <li>
          <strong>Divide your capital.</strong> Split your total savings into equal portions — one
          per rung. A 5-rung ladder with $50,000 puts $10,000 in each CD.
        </li>
        <li>
          <strong>Buy CDs at staggered terms.</strong> Classic rungs: 1-year, 2-year, 3-year,
          4-year, and 5-year CDs opened simultaneously.
        </li>
        <li>
          <strong>Wait for the first maturity.</strong> After year one, your 1-year CD matures and
          returns principal + interest.
        </li>
        <li>
          <strong>Reinvest into the longest rung.</strong> Roll the proceeds into a new 5-year CD.
          Now your ladder looks like: 1yr, 2yr, 3yr, 4yr, 5yr — but with all positions one year
          closer to maturity.
        </li>
        <li>
          <strong>Repeat annually.</strong> Each year you have a CD maturing — your liquidity
          window — while always earning the highest available long-term rate on the newest rung.
        </li>
      </ol>
    </div>
  );
}

// ─── SEO Article ─────────────────────────────────────────────────────────────

function SEOArticle() {
  return (
    <div className="cd-prose">
      <h2>CD Ladder Calculator: The Definitive Guide to Certificate of Deposit Laddering</h2>

      <p>
        Whether you are a first-time saver looking to earn more than a basic savings account, or a
        seasoned investor seeking a low-risk component for your fixed-income portfolio, the{" "}
        <strong>CD ladder strategy</strong> deserves serious consideration. This comprehensive guide
        explains exactly how a CD ladder works, how to use our <strong>cd maturity calculator</strong>{" "}
        and <strong>monthly cd interest calculator</strong>, what rates to target in 2026, and how to
        decide between CD laddering and alternative strategies like Treasury bills, high-yield savings
        accounts (HYSAs), and bond funds.
      </p>

      <h3>Understanding Certificate of Deposit Basics</h3>
      <p>
        A certificate of deposit is a savings product offered by banks and credit unions. When you
        open a CD, you agree to leave your money on deposit for a fixed term — typically ranging from
        3 months to 5 years — in exchange for a fixed interest rate that is almost always higher
        than a standard savings account. At the end of the term (the <em>maturity date</em>), the
        bank returns your original principal plus all accrued interest.
      </p>
      <p>
        CDs are insured by the Federal Deposit Insurance Corporation (FDIC) at banks and the
        National Credit Union Administration (NCUA) at credit unions, up to $250,000 per depositor
        per institution per ownership category. This makes them among the safest savings vehicles
        available to US consumers — zero credit risk as long as you stay within insurance limits.
      </p>
      <p>
        The main drawback of CDs is <strong>illiquidity</strong>. Withdrawing money before the
        maturity date typically triggers an early withdrawal penalty, often equal to 60–180 days of
        interest depending on the CD term and institution. This is where the CD ladder strategy
        elegantly solves the problem.
      </p>

      <h3>The CD Maturity Calculator: How to Calculate Your Maturity Date</h3>
      <p>
        Our <strong>cd maturity calculator</strong> embedded in the builder above calculates the
        exact maturity date for every rung of your ladder. The formula is simple:
      </p>
      <p className="cd-formula">
        Maturity Date = Start Date + Term (months)
      </p>
      <p>
        For example, if you open a 24-month CD on March 15, 2026, our cd maturity calculator returns
        a maturity date of March 15, 2027. The tool also shows you the number of calendar days
        remaining until maturity — a critical metric if you are deciding whether to break a CD early
        or wait it out.
      </p>
      <p>
        Some banks use a &quot;360-day year&quot; convention for interest calculations. Our
        calculator uses the more common 365-day basis for daily compounding, but the impact on
        maturity dates is none — the date is always Start Date + Term in months regardless of
        interest convention.
      </p>

      <h3>Monthly CD Interest Calculator: How CD Interest Is Calculated</h3>
      <p>
        Banks quote CD rates as Annual Percentage Yield (APY), which already accounts for
        compounding frequency. This makes APY the correct number to use when comparing CDs across
        different institutions. Our <strong>monthly cd interest calculator</strong> uses the
        following logic:
      </p>
      <p className="cd-formula">
        {`Compound Interest = P × (1 + r/n)^(n×t) − P`}
      </p>
      <p>
        Where <em>P</em> is principal, <em>r</em> is the annual interest rate (as a decimal),{" "}
        <em>n</em> is the number of compounding periods per year (365 for daily, 12 for monthly, 4
        for quarterly, 1 for annually), and <em>t</em> is the term in years.
      </p>
      <p>
        For a quick estimate of <strong>monthly CD interest</strong>, you can use the simple
        approximation: Monthly Interest ≈ Principal × (APY ÷ 12). On a $10,000 CD at 4.75% APY,
        this yields approximately $39.58 per month. The Schedule tab in our tool shows this
        broken down month-by-month across every rung, making it easy to plan for the income stream
        your ladder will generate.
      </p>

      <h3>The 5 Core Benefits of a CD Ladder Strategy</h3>
      <ol>
        <li>
          <strong>Liquidity every year (or quarter).</strong> With staggered maturities, you always
          have a CD coming due soon. If an emergency arises, you may only need to wait weeks, not
          years, to access funds penalty-free.
        </li>
        <li>
          <strong>Rate diversification.</strong> Interest rates change over time. A ladder means
          you&apos;re not locked into today&apos;s rates for five years — you reinvest each maturing
          rung at whatever rates prevail at that point, averaging out over the rate cycle.
        </li>
        <li>
          <strong>Higher rates than savings accounts.</strong> Longer-term CDs typically offer
          meaningfully higher APYs than HYSAs, especially during periods of inverted yield curves.
          Locking in competitive long-term rates before rate cuts is a key advantage of laddering.
        </li>
        <li>
          <strong>FDIC-insured capital preservation.</strong> Unlike bond funds or bond ETFs, which
          fluctuate in market value, CDs return principal + interest at maturity — no market risk,
          no duration risk, no credit risk (within FDIC limits).
        </li>
        <li>
          <strong>Behavioral guardrails.</strong> CDs impose a discipline that savings accounts
          don&apos;t — you can&apos;t impulsively spend money locked in a CD without a penalty
          reminder. Many savers find this helpful for long-term goal-setting.
        </li>
      </ol>

      <h3>Types of CD Ladders</h3>
      <h4>Classic 5-Year CD Ladder</h4>
      <p>
        The most common structure. Divide your savings into five equal portions and open CDs with
        1, 2, 3, 4, and 5-year terms simultaneously. Each year, the maturing CD is rolled into a
        new 5-year CD. After the initial 5-year setup period, you have one 5-year CD maturing every
        12 months, permanently.
      </p>
      <h4>Short-Term CD Ladder (Monthly/Quarterly)</h4>
      <p>
        For savers who want more frequent liquidity, a short-term ladder uses 3-month, 6-month, and
        12-month CDs. Every three months, a CD matures and can be reinvested or accessed. This works
        well for emergency fund portions or capital that may be needed within the year.
      </p>
      <h4>Barbell CD Strategy</h4>
      <p>
        A barbell concentrates funds at two extremes — short-term (3–6 months) and long-term (4–5
        years) — with nothing in the middle. This captures maximum liquidity on the short end and
        maximum rates on the long end, but forgoes the smooth income distribution of a classic
        ladder.
      </p>
      <h4>Mini-Ladder for Specific Goals</h4>
      <p>
        Planning for a known future expense like a down payment, a car purchase, or college tuition?
        You can build a mini-ladder timed to your goal date. Example: opening a 6-month, 12-month,
        and 18-month CD so funds arrive in installments as your needs unfold.
      </p>
      <h4>Jumbo CD Ladder</h4>
      <p>
        Jumbo CDs (typically $100,000 minimum) often carry slightly higher rates. If you have over
        $250,000 to invest, use multiple institutions to maintain full FDIC coverage while building
        a high-denomination ladder.
      </p>

      <h3>CD Ladder vs. High-Yield Savings Account (HYSA)</h3>
      <p>
        Many savers wonder whether to use a CD ladder or simply keep funds in a high-yield savings
        account. The honest answer: it depends on your time horizon and your view on interest rates.
      </p>
      <ul>
        <li>
          <strong>HYSAs offer flexibility.</strong> You can withdraw anytime without penalty. If
          rates rise, your HYSA rate typically rises too (though not always immediately). But if
          rates fall, your HYSA rate falls with them.
        </li>
        <li>
          <strong>CD ladders lock in rates.</strong> If you open a 5-year CD today at 4.50%, that
          rate is guaranteed for five years even if the Fed cuts rates aggressively. In a
          rate-decline environment, this is a powerful advantage.
        </li>
        <li>
          <strong>Rate environment matters.</strong> In rising-rate environments, HYSAs win because
          your rate climbs with the market. In stable or falling-rate environments, CDs win because
          you&apos;ve locked in the peak.
        </li>
      </ul>
      <p>
        Many financial advisors recommend holding a hybrid: keep 3–6 months of emergency funds in a
        HYSA for instant access, and ladder the remainder into CDs for higher guaranteed returns.
      </p>

      <h3>CD Ladder vs. Treasury Bills and I-Bonds</h3>
      <p>
        Treasury bills (T-bills) are short-term US government debt instruments issued at a discount
        and maturing in 4, 8, 13, 17, 26, or 52 weeks. They are exempt from state and local income
        tax — an advantage for high-income earners in high-tax states. T-bills can be purchased
        directly through TreasuryDirect.gov or through a brokerage.
      </p>
      <p>
        I-Bonds are inflation-indexed savings bonds with a composite rate tied to CPI-U. They offer
        strong inflation protection but have strict purchase limits ($10,000 per person per year in
        electronic form) and a 12-month lock-up period before any withdrawal is allowed.
      </p>
      <p>
        For most savers, a CD ladder offers a middle ground: FDIC insurance without Treasury account
        complexity, higher rates than most Treasury bills in normal yield environments, and terms
        that can be customized precisely to your goals.
      </p>

      <h3>How to Open a CD Ladder: Practical Steps</h3>
      <ol>
        <li>
          <strong>Determine your total capital.</strong> Decide how much of your savings to ladder.
          Keep your emergency fund accessible in a HYSA first.
        </li>
        <li>
          <strong>Choose your number of rungs.</strong> 3–5 rungs is typical. More rungs create
          more frequent liquidity windows; fewer rungs are simpler to manage.
        </li>
        <li>
          <strong>Shop for the best CD rates.</strong> Compare rates at online banks (Ally, Marcus,
          Discover, CIT), credit unions, and traditional banks. Online banks and credit unions
          consistently offer rates 0.50–1.50% higher than traditional bank branches.
        </li>
        <li>
          <strong>Verify FDIC/NCUA coverage.</strong> If your ladder exceeds $250,000, spread
          across multiple institutions or ownership categories to maintain full insurance coverage.
        </li>
        <li>
          <strong>Open each CD.</strong> Most online CD openings take 10–15 minutes. Link your
          external bank account, transfer funds, and confirm the terms in writing.
        </li>
        <li>
          <strong>Set maturity reminders.</strong> Our cd maturity calculator shows you exact dates.
          Set calendar reminders 30 days before each maturity so you have time to shop rates and
          reinvest without the CD auto-renewing at a potentially worse rate.
        </li>
        <li>
          <strong>Reinvest at maturity.</strong> Roll proceeds into the longest rung of your ladder,
          or redirect to a higher-priority goal if your circumstances have changed.
        </li>
      </ol>

      <h3>Early Withdrawal Penalties: What You Need to Know</h3>
      <p>
        Withdrawing a CD before maturity typically costs you a portion of the interest you&apos;ve
        earned. Common penalties by term:
      </p>
      <ul>
        <li>3-month CDs: 90 days of interest</li>
        <li>6-month CDs: 90–180 days of interest</li>
        <li>1-year CDs: 150–180 days of interest</li>
        <li>2–5 year CDs: 180–365 days of interest</li>
      </ul>
      <p>
        Some institutions (notably Ally Bank with their "11-month No-Penalty CD") offer
        no-penalty CDs. These are excellent for the shortest rungs of your ladder if you want
        zero early-withdrawal risk on the most liquid portion.
      </p>
      <p>
        Note: If a CD is broken very early (within the first few months), the penalty may actually
        reduce your principal — you could receive back less than you deposited. Always calculate
        the penalty amount before breaking a CD early.
      </p>

      <h3>Tax Treatment of CD Interest</h3>
      <p>
        CD interest is taxed as ordinary income in the year it is credited, even if the CD has not
        matured. For multi-year CDs, the IRS requires you to report and pay tax on interest accrued
        annually (called <em>original issue discount</em> reporting on Form 1099-OID for CDs with
        terms over one year). Your bank or credit union will issue a Form 1099-INT (or 1099-OID)
        each January reporting your taxable CD interest.
      </p>
      <p>
        Strategies to manage CD tax liability include holding CDs inside a Roth IRA or Traditional
        IRA (where interest grows tax-deferred or tax-free), using CDs for funds not needed
        immediately, and timing CD openings to align with lower-income years.
      </p>

      <h3>Best Practices for CD Laddering in 2026</h3>
      <ul>
        <li>
          <strong>Avoid auto-renewal traps.</strong> Most banks auto-renew CDs at maturity into the
          same term at the prevailing rate — which may be higher or lower. Always take deliberate
          action at maturity rather than letting the bank roll you over.
        </li>
        <li>
          <strong>Monitor the yield curve.</strong> When the yield curve is inverted (short-term
          rates higher than long-term), shorter-rung CDs may offer better rates than 5-year CDs.
          Adjust your ladder structure accordingly — there&apos;s no law saying every rung must be
          the same length.
        </li>
        <li>
          <strong>Consider brokered CDs.</strong> Brokered CDs, purchased through a brokerage
          account rather than directly from a bank, can be sold on the secondary market before
          maturity without an early withdrawal penalty. They offer additional liquidity at the cost
          of market value fluctuation.
        </li>
        <li>
          <strong>Keep it simple.</strong> A 3-rung or 5-rung ladder is manageable. A 12-rung
          monthly ladder can become difficult to track. Use our calculator to model any structure
          before committing.
        </li>
        <li>
          <strong>Ladder inside an IRA.</strong> CDs held inside a Traditional or Roth IRA grow
          tax-deferred or tax-free. Many banks offer IRA CDs with the same rates as standard CDs.
        </li>
      </ul>

      <h3>Real-World Example: $50,000 CD Ladder</h3>
      <p>
        Suppose you have $50,000 to invest in a classic 5-rung CD ladder in early 2026, with
        assumed APYs based on competitive online bank rates:
      </p>
      <ul>
        <li>$10,000 in a 1-year CD at 4.75% APY → Matures: ~$10,475</li>
        <li>$10,000 in a 2-year CD at 4.60% APY → Matures: ~$10,941</li>
        <li>$10,000 in a 3-year CD at 4.50% APY → Matures: ~$11,412</li>
        <li>$10,000 in a 4-year CD at 4.40% APY → Matures: ~$11,893</li>
        <li>$10,000 in a 5-year CD at 4.30% APY → Matures: ~$12,355</li>
      </ul>
      <p>
        Total maturity value: approximately $57,076 — representing $7,076 in guaranteed interest
        over the life of the ladder. Average monthly interest income across all rungs: approximately
        $196/month. All principal is FDIC-insured. Use our calculator above to input your exact
        numbers and get precise projections.
      </p>

      <h3>Frequently Asked Questions About CD Ladders</h3>
      <p>
        See the FAQ section below for detailed answers to the most common CD ladder questions,
        including how to build a CD ladder with $5,000, whether CD laddering still makes sense when
        rates are falling, and how the FDIC limit affects large ladders.
      </p>
    </div>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "What is a CD ladder and how does it work?",
    a: "A CD ladder splits your savings across multiple CDs with different maturity dates (e.g., 1, 2, 3, 4, and 5 years). As each CD matures, you reinvest proceeds into the longest rung. This gives you annual liquidity windows while capturing higher long-term rates — the best of both worlds between a savings account and a long-term CD.",
  },
  {
    q: "How does the cd maturity calculator work?",
    a: "The cd maturity calculator adds your CD term (in months) to your start date to return the exact maturity date. It also shows days remaining until maturity for active CDs. Simply enter your start date and term in the builder above.",
  },
  {
    q: "How do I calculate monthly CD interest?",
    a: "Use our monthly cd interest calculator tab above for exact figures. The quick estimate formula is: Monthly Interest ≈ Principal × (APY ÷ 12). For a $10,000 CD at 4.75% APY, that's about $39.58/month. The tab shows this across every rung of your ladder for every month of the term.",
  },
  {
    q: "What is the best CD ladder strategy for rising rates?",
    a: "In a rising-rate environment, favor shorter rungs (3–12 months) so you can reinvest sooner at higher rates. Avoid locking into long-term CDs just before rates peak. A barbell strategy (very short + very long) can also work — capturing rate upside on short rungs while holding a long-term position.",
  },
  {
    q: "What is the best CD ladder strategy for falling rates?",
    a: "In a falling-rate environment, lock in as much as possible in longer-term CDs before rates drop further. Extend your longest rung to 5 or even 7 years if available. This 'rate lock' strategy is one of the primary advantages of CDs over high-yield savings accounts, which reprice with the market.",
  },
  {
    q: "Can I build a CD ladder with $5,000?",
    a: "Yes. Many banks have minimum CD deposits of $500–$1,000. With $5,000 and a 5-rung ladder, each rung would hold $1,000. Check minimum deposit requirements before opening — some online banks have no minimum at all.",
  },
  {
    q: "How does FDIC insurance affect my CD ladder?",
    a: "FDIC insurance covers up to $250,000 per depositor, per institution, per ownership category. If your ladder exceeds $250,000, spread CDs across multiple FDIC-insured banks or use joint account ownership (which doubles the insured limit to $500,000 at a single institution).",
  },
  {
    q: "Should I put my emergency fund in a CD ladder?",
    a: "Partially, yes. Keep 1–3 months of expenses in a liquid HYSA for true emergencies. The remaining 3–6 months of your emergency fund can go in a short-term CD ladder (3-month, 6-month, 9-month, 12-month) with no-penalty CDs or very short terms. This earns more than a savings account while maintaining reasonable access.",
  },
  {
    q: "What happens when a CD matures?",
    a: "At maturity, you typically have a grace period (often 7–10 calendar days) to decide: withdraw the funds, roll into the same term CD, or transfer to a different term. If you do nothing, most banks auto-renew at the current rate for the same term. Always take deliberate action — never let a CD auto-renew without comparing current rates first.",
  },
  {
    q: "Are CD ladders worth it compared to bond ETFs?",
    a: "CD ladders offer principal guarantee (within FDIC limits) and zero market value fluctuation — your maturity value is locked in. Bond ETFs can lose value when interest rates rise. However, bond ETFs offer higher liquidity and may offer higher yields (with more risk). CDs are better for capital preservation; bond ETFs for total return investors comfortable with volatility.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="cd-faq-inner">
      <h2 className="cd-section-title">Frequently Asked Questions</h2>
      <div className="cd-faq-list">
        {FAQS.map((faq, i) => (
          <div key={i} className={`cd-faq-item${open === i ? " cd-faq-item--open" : ""}`}>
            <button className="cd-faq-q" onClick={() => setOpen(open === i ? null : i)}>
              <span>{faq.q}</span>
              <span className="cd-faq-chevron">
                {open === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>
            {open === i && <p className="cd-faq-a">{faq.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
  /* ── Base ── */
  .cd-page {
    font-family: 'Georgia', 'Times New Roman', serif;
    background: #f9f7f4;
    color: #1a1208;
    min-height: 100vh;
  }
  .cd-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.25rem;
  }

  /* ── Hero ── */
  .cd-hero {
    background: linear-gradient(135deg, #1a3a2a 0%, #0e2018 50%, #1c2e1a 100%);
    color: #f0ede6;
    padding: 3.5rem 0 2.5rem;
    position: relative;
    overflow: hidden;
  }
  .cd-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 80% at 70% 40%, rgba(82,196,120,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .cd-badge {
    display: inline-block;
    background: rgba(82,196,120,0.2);
    border: 1px solid rgba(82,196,120,0.4);
    color: #7ee8a2;
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.3rem 0.9rem;
    border-radius: 2px;
    margin-bottom: 1.25rem;
  }
  .cd-title {
    font-size: clamp(2rem, 5vw, 3.25rem);
    font-weight: 700;
    line-height: 1.15;
    margin: 0 0 1rem;
    letter-spacing: -0.02em;
  }
  .cd-subtitle {
    font-size: 1.1rem;
    color: #c8d8c0;
    max-width: 640px;
    line-height: 1.6;
    margin: 0 0 1.5rem;
  }
  .cd-subtitle strong { color: #7ee8a2; font-style: normal; }
  .cd-breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.82rem;
    color: #8aad94;
  }
  .cd-breadcrumb a { color: #7ee8a2; text-decoration: none; }
  .cd-breadcrumb a:hover { text-decoration: underline; }

  /* ── Main ── */
  .cd-main { padding: 2.5rem 1.25rem; }

  /* ── Summary Cards ── */
  .cd-summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(155px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .cd-card {
    background: #fff;
    border: 1px solid #e2ddd5;
    border-radius: 8px;
    padding: 1.25rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.35rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    transition: box-shadow 0.2s;
  }
  .cd-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
  .cd-card-icon { font-size: 1.5rem; }
  .cd-card-value { font-size: 1.3rem; font-weight: 700; color: #1a3a2a; font-family: 'Courier New', monospace; }
  .cd-card-label { font-size: 0.75rem; color: #7a7265; letter-spacing: 0.04em; }

  /* ── Tabs ── */
  .cd-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    border-bottom: 2px solid #e2ddd5;
    flex-wrap: wrap;
  }
  .cd-tab {
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
    cursor: pointer;
    color: #7a7265;
    font-family: inherit;
    transition: color 0.15s, border-color 0.15s;
  }
  .cd-tab:hover { color: #1a3a2a; }
  .cd-tab--active { color: #1a3a2a; border-bottom-color: #2e7d4f; font-weight: 600; }

  /* ── Builder ── */
  .cd-builder-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .cd-toolbar-actions { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }
  .cd-preset-wrapper { position: relative; }
  .cd-preset-menu {
    position: absolute;
    right: 0;
    top: calc(100% + 4px);
    background: #fff;
    border: 1px solid #e2ddd5;
    border-radius: 6px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    z-index: 50;
    min-width: 180px;
  }
  .cd-preset-item {
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.65rem 1rem;
    font-size: 0.875rem;
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    color: #1a1208;
  }
  .cd-preset-item:hover { background: #f0ede6; }
  .cd-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 1.1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
  }
  .cd-btn--primary {
    background: #2e7d4f;
    color: #fff;
    border: none;
  }
  .cd-btn--primary:hover { background: #235f3c; }
  .cd-btn--outline {
    background: #fff;
    color: #2e7d4f;
    border: 1px solid #2e7d4f;
  }
  .cd-btn--outline:hover { background: #f0faf4; }

  /* ── Rungs ── */
  .cd-rungs { display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 2.5rem; }
  .cd-rung {
    background: #fff;
    border: 1px solid #e2ddd5;
    border-radius: 10px;
    padding: 1.25rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .cd-rung-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  .cd-rung-number {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: #1a3a2a;
    color: #7ee8a2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
    flex-shrink: 0;
    font-family: 'Courier New', monospace;
  }
  .cd-rung-label-input {
    flex: 1;
    border: 1px solid #e2ddd5;
    border-radius: 5px;
    padding: 0.4rem 0.75rem;
    font-size: 0.9rem;
    font-family: inherit;
    background: #f9f7f4;
  }
  .cd-rung-label-input:focus { outline: 2px solid #2e7d4f; outline-offset: 1px; }
  .cd-rung-remove {
    background: none;
    border: 1px solid #e2ddd5;
    border-radius: 4px;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #b0a898;
    font-size: 0.85rem;
    flex-shrink: 0;
  }
  .cd-rung-remove:hover:not(:disabled) { border-color: #e05252; color: #e05252; }
  .cd-rung-remove:disabled { opacity: 0.3; cursor: not-allowed; }

  .cd-rung-fields {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
    gap: 0.875rem;
    margin-bottom: 1rem;
  }
  .cd-field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.8rem;
    color: #6a6055;
  }
  .cd-field input, .cd-field select {
    border: 1px solid #d8d3ca;
    border-radius: 5px;
    padding: 0.45rem 0.65rem;
    font-size: 0.9rem;
    font-family: inherit;
    background: #fff;
  }
  .cd-field input:focus, .cd-field select:focus { outline: 2px solid #2e7d4f; }

  .cd-rung-results {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
    gap: 0.5rem;
    background: #f4f9f6;
    border-radius: 6px;
    padding: 0.875rem;
    margin-bottom: 0.75rem;
  }
  .cd-rung-result-item { display: flex; flex-direction: column; gap: 0.15rem; }
  .cd-rung-result-label { font-size: 0.7rem; color: #8a8070; letter-spacing: 0.04em; text-transform: uppercase; }
  .cd-rung-result-value { font-size: 0.95rem; font-weight: 600; font-family: 'Courier New', monospace; color: #1a3a2a; }
  .cd-rung-result-value--date { font-family: inherit; font-size: 0.875rem; display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
  .cd-days-badge { font-size: 0.65rem; background: #e8f5ee; color: #2e7d4f; border-radius: 99px; padding: 0.15rem 0.5rem; font-family: 'Courier New', monospace; font-weight: 600; }
  .cd-days-badge--mature { background: #f0ffc4; color: #556b00; }
  .cd-green { color: #2e7d4f !important; }
  .cd-bold { font-weight: 700; }

  .cd-progress-wrap { height: 4px; background: #e2ddd5; border-radius: 99px; overflow: hidden; }
  .cd-progress-bar { height: 100%; background: linear-gradient(90deg, #2e7d4f, #7ee8a2); border-radius: 99px; transition: width 0.5s; }

  /* ── Timeline ── */
  .cd-timeline-section { margin-top: 2rem; }
  .cd-section-subtitle { font-size: 1.05rem; font-weight: 600; color: #1a3a2a; margin-bottom: 1rem; }
  .cd-timeline { display: flex; flex-direction: column; gap: 0; position: relative; padding-left: 2rem; }
  .cd-timeline::before { content: ''; position: absolute; left: 0.5rem; top: 0; bottom: 0; width: 2px; background: #d0e8da; }
  .cd-timeline-item { display: flex; align-items: flex-start; gap: 1rem; position: relative; padding-bottom: 1.25rem; }
  .cd-timeline-dot { width: 14px; height: 14px; border-radius: 50%; background: #2e7d4f; border: 2px solid #fff; box-shadow: 0 0 0 2px #2e7d4f; flex-shrink: 0; margin-left: -1.6rem; margin-top: 0.15rem; }
  .cd-timeline-content { display: flex; gap: 1rem; flex-wrap: wrap; align-items: baseline; }
  .cd-timeline-label { font-weight: 600; font-size: 0.875rem; color: #1a3a2a; }
  .cd-timeline-date { font-size: 0.8rem; color: #6a6055; font-family: 'Courier New', monospace; }
  .cd-timeline-value { font-size: 0.875rem; color: #2e7d4f; font-weight: 600; font-family: 'Courier New', monospace; margin-left: auto; }

  /* ── Schedule ── */
  .cd-schedule { }
  .cd-schedule-intro { color: #5a5248; margin-bottom: 1.5rem; line-height: 1.6; }
  .cd-table-wrap { overflow-x: auto; }
  .cd-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
  .cd-table th {
    background: #1a3a2a;
    color: #7ee8a2;
    padding: 0.6rem 0.75rem;
    text-align: right;
    font-family: 'Courier New', monospace;
    font-size: 0.72rem;
    white-space: nowrap;
    position: sticky;
    top: 0;
  }
  .cd-table th:first-child { text-align: left; }
  .cd-table td { padding: 0.45rem 0.75rem; text-align: right; border-bottom: 1px solid #f0ede6; font-family: 'Courier New', monospace; }
  .cd-table td:first-child { text-align: left; font-family: inherit; }
  .cd-table-month { color: #6a6055; font-size: 0.8rem; }
  .cd-table-total { font-weight: 700; color: #1a3a2a; }
  .cd-table-row--mature { background: #f0faf4; }
  .cd-cell-mature { color: #2e7d4f; font-weight: 700; }
  .cd-cell-inactive { color: #ccc; }
  .cd-disclaimer { font-size: 0.78rem; color: #9a9288; margin-top: 1rem; font-style: italic; }

  /* ── Guide ── */
  .cd-guide { }
  .cd-guide-content { max-width: 760px; }

  /* ── Article ── */
  .cd-article { padding: 3rem 1.25rem; border-top: 1px solid #e2ddd5; }

  /* ── FAQ ── */
  .cd-faq { padding: 2.5rem 1.25rem 3rem; border-top: 1px solid #e2ddd5; }
  .cd-faq-inner { max-width: 760px; }
  .cd-faq-list { display: flex; flex-direction: column; gap: 0; }
  .cd-faq-item { border-bottom: 1px solid #e2ddd5; }
  .cd-faq-q {
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 1rem 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: #1a1208;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    font-family: inherit;
  }
  .cd-faq-chevron { font-size: 1.25rem; color: #2e7d4f; flex-shrink: 0; }
  .cd-faq-a { padding: 0 0 1rem; line-height: 1.7; color: #4a4338; font-size: 0.92rem; }

  /* ── Prose ── */
  .cd-prose h2 { font-size: 1.5rem; color: #1a3a2a; margin: 2rem 0 0.75rem; }
  .cd-prose h3 { font-size: 1.15rem; color: #1a3a2a; margin: 1.5rem 0 0.5rem; }
  .cd-prose h4 { font-size: 1rem; color: #2e7d4f; margin: 1.25rem 0 0.4rem; }
  .cd-prose p { line-height: 1.75; color: #3a3028; margin-bottom: 1rem; font-size: 0.95rem; }
  .cd-prose ul, .cd-prose ol { padding-left: 1.5rem; margin-bottom: 1rem; }
  .cd-prose li { line-height: 1.7; color: #3a3028; margin-bottom: 0.4rem; font-size: 0.95rem; }
  .cd-prose strong { color: #1a3a2a; }
  .cd-formula {
    background: #f0faf4;
    border-left: 3px solid #2e7d4f;
    padding: 0.75rem 1rem;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    border-radius: 0 4px 4px 0;
    margin: 1rem 0;
    color: #1a3a2a;
  }

  /* ── Disclaimer box ── */
  .cd-disclaimer-box {
    background: #fffaf0;
    border: 1px solid #f0e0a0;
    border-radius: 6px;
    padding: 1rem 1.25rem;
    font-size: 0.82rem;
    color: #6a5a30;
    line-height: 1.6;
    margin: 2rem 0 3rem;
  }

  /* ── Section title ── */
  .cd-section-title { font-size: 1.3rem; color: #1a3a2a; margin-bottom: 1rem; font-weight: 700; }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .cd-summary-grid { grid-template-columns: repeat(2, 1fr); }
    .cd-rung-fields { grid-template-columns: 1fr 1fr; }
    .cd-rung-results { grid-template-columns: 1fr 1fr; }
    .cd-tabs { gap: 0; }
    .cd-tab { padding: 0.6rem 0.75rem; font-size: 0.8rem; }
  }
`;
