"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Calculator, 
  RotateCcw, 
  Scale, 
  BookOpen, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  ArrowRight,
  Info,
  Leaf,
  TreePine,
  Wheat,
  Anchor,
  Ship,
  Fish,
  Mountain,
  Snowflake,
  MapPin,
  Building2,
  Star
} from "lucide-react";

// ─── Province Data (verified 2025 rates) ─────────────────────────────────────
// Source: CRA, CDTFA, TaxTips.ca — effective April 1, 2025

type TaxType = "HST" | "GST+PST" | "GST+QST" | "GST";

interface Province {
  code: string;
  name: string;
  abbr: string;
  type: TaxType;
  gst: number;
  pst: number; // also QST for Quebec
  hst: number;
  total: number;
  pstLabel: string; // "PST" | "QST" | "RST" | ""
  note?: string;
  flag: React.ReactNode;
  capital: string;
  pop: string;
}

const PROVINCES: Province[] = [
  {
    code: "ON", name: "Ontario", abbr: "ON", type: "HST",
    gst: 0, pst: 0, hst: 13, total: 13, pstLabel: "",
    flag: <Leaf size={16} />, capital: "Toronto", pop: "14.2M",
  },
  {
    code: "QC", name: "Quebec", abbr: "QC", type: "GST+QST",
    gst: 5, pst: 9.975, hst: 0, total: 14.975, pstLabel: "QST",
    flag: <Building2 size={16} />, capital: "Québec City", pop: "8.6M",
    note: "QST applied on top of GST-inclusive price",
  },
  {
    code: "BC", name: "British Columbia", abbr: "BC", type: "GST+PST",
    gst: 5, pst: 7, hst: 0, total: 12, pstLabel: "PST",
    flag: <TreePine size={16} />, capital: "Victoria", pop: "5.2M",
  },
  {
    code: "AB", name: "Alberta", abbr: "AB", type: "GST",
    gst: 5, pst: 0, hst: 0, total: 5, pstLabel: "",
    flag: <Wheat size={16} />, capital: "Edmonton", pop: "4.5M",
    note: "No provincial sales tax — lowest rate in Canada",
  },
  {
    code: "SK", name: "Saskatchewan", abbr: "SK", type: "GST+PST",
    gst: 5, pst: 6, hst: 0, total: 11, pstLabel: "PST",
    flag: <Wheat size={16} />, capital: "Regina", pop: "1.2M",
  },
  {
    code: "MB", name: "Manitoba", abbr: "MB", type: "GST+PST",
    gst: 5, pst: 7, hst: 0, total: 12, pstLabel: "RST",
    flag: <MapPin size={16} />, capital: "Winnipeg", pop: "1.4M",
    note: "Provincial tax called Retail Sales Tax (RST)",
  },
  {
    code: "NB", name: "New Brunswick", abbr: "NB", type: "HST",
    gst: 0, pst: 0, hst: 15, total: 15, pstLabel: "",
    flag: <Ship size={16} />, capital: "Fredericton", pop: "825K",
  },
  {
    code: "NS", name: "Nova Scotia", abbr: "NS", type: "HST",
    gst: 0, pst: 0, hst: 14, total: 14, pstLabel: "",
    flag: <Anchor size={16} />, capital: "Halifax", pop: "1.0M",
    note: "HST reduced from 15% to 14% on April 1, 2025",
  },
  {
    code: "PE", name: "Prince Edward Island", abbr: "PEI", type: "HST",
    gst: 0, pst: 0, hst: 15, total: 15, pstLabel: "",
    flag: <Anchor size={16} />, capital: "Charlottetown", pop: "170K",
  },
  {
    code: "NL", name: "Newfoundland & Labrador", abbr: "NL", type: "HST",
    gst: 0, pst: 0, hst: 15, total: 15, pstLabel: "",
    flag: <Fish size={16} />, capital: "St. John's", pop: "535K",
  },
  {
    code: "YT", name: "Yukon", abbr: "YT", type: "GST",
    gst: 5, pst: 0, hst: 0, total: 5, pstLabel: "",
    flag: <Mountain size={16} />, capital: "Whitehorse", pop: "43K",
    note: "No territorial sales tax",
  },
  {
    code: "NT", name: "Northwest Territories", abbr: "NT", type: "GST",
    gst: 5, pst: 0, hst: 0, total: 5, pstLabel: "",
    flag: <Mountain size={16} />, capital: "Yellowknife", pop: "45K",
    note: "No territorial sales tax",
  },
  {
    code: "NU", name: "Nunavut", abbr: "NU", type: "GST",
    gst: 5, pst: 0, hst: 0, total: 5, pstLabel: "",
    flag: <Snowflake size={16} />, capital: "Iqaluit", pop: "40K",
    note: "No territorial sales tax",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtCAD(v: number, d = 2): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency", currency: "CAD",
    minimumFractionDigits: d, maximumFractionDigits: d,
  }).format(v);
}
function fmtPct(v: number): string {
  return v % 1 === 0 ? v + "%" : v.toFixed(3).replace(/0+$/, "") + "%";
}

type CalcMode = "calculator" | "reverse" | "compare" | "guide";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SalesTaxCANClient() {
  const [mode, setMode] = useState<CalcMode>("calculator");
  const [selectedCode, setSelectedCode] = useState("ON");
  const [amount, setAmount] = useState("100");
  const [revTotal, setRevTotal] = useState("113");
  const [revCode, setRevCode] = useState("ON");
  const [compareAmt, setCompareAmt] = useState("500");

  const province = PROVINCES.find(p => p.code === selectedCode)!;
  const revProvince = PROVINCES.find(p => p.code === revCode)!;

  // Main calc
  const pre = parseFloat(amount) || 0;
  const taxCalc = useMemo(() => {
    const p = province;
    if (p.type === "HST") {
      const tax = pre * (p.hst / 100);
      return { gstAmt: 0, pstAmt: 0, hstAmt: tax, totalTax: tax, total: pre + tax };
    } else if (p.type === "GST+QST") {
      const gstAmt = pre * (p.gst / 100);
      // QST applied on price + GST
      const qstAmt = (pre + gstAmt) * (p.pst / 100);
      const totalTax = gstAmt + qstAmt;
      return { gstAmt, pstAmt: qstAmt, hstAmt: 0, totalTax, total: pre + totalTax };
    } else if (p.type === "GST+PST") {
      const gstAmt = pre * (p.gst / 100);
      const pstAmt = pre * (p.pst / 100);
      const totalTax = gstAmt + pstAmt;
      return { gstAmt, pstAmt, hstAmt: 0, totalTax, total: pre + totalTax };
    } else {
      // GST only
      const gstAmt = pre * (p.gst / 100);
      return { gstAmt, pstAmt: 0, hstAmt: 0, totalTax: gstAmt, total: pre + gstAmt };
    }
  }, [pre, province]);

  // Reverse calc
  const revCalc = useMemo(() => {
    const p = revProvince;
    const totalNum = parseFloat(revTotal) || 0;
    if (p.type === "HST") {
      const preTax = totalNum / (1 + p.hst / 100);
      const tax = totalNum - preTax;
      return { preTax, tax, gst: 0, pst: 0, hst: tax };
    } else if (p.type === "GST+QST") {
      // total = pre * (1 + 0.05) * (1 + 0.09975)
      const factor = (1 + p.gst / 100) * (1 + p.pst / 100);
      const preTax = totalNum / factor;
      const gst = preTax * (p.gst / 100);
      const qst = (preTax + gst) * (p.pst / 100);
      return { preTax, tax: gst + qst, gst, pst: qst, hst: 0 };
    } else if (p.type === "GST+PST") {
      const factor = 1 + (p.gst + p.pst) / 100;
      const preTax = totalNum / factor;
      const gst = preTax * (p.gst / 100);
      const pst = preTax * (p.pst / 100);
      return { preTax, tax: gst + pst, gst, pst, hst: 0 };
    } else {
      const preTax = totalNum / (1 + p.gst / 100);
      const gst = totalNum - preTax;
      return { preTax, tax: gst, gst, pst: 0, hst: 0 };
    }
  }, [revTotal, revProvince]);

  const compareNum = parseFloat(compareAmt) || 0;

  const TYPE_COLOR: Record<TaxType, string> = {
    "HST": "#CC0000",
    "GST+PST": "#1a6bbf",
    "GST+QST": "#2e7d32",
    "GST": "#8a6a00",
  };

  return (
    <>
      <div className="can-page">

        {/* ── Hero ── */}
        <header className="can-hero">
          <div className="can-container">
            <nav className="can-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link><span>/</span>
              <Link href="/finance">Finance</Link><span>/</span>
              <span>Canada Sales Tax Calculator</span>
            </nav>

            <div className="can-hero-layout">
              <div className="can-hero-text">
                <div className="can-maple"><Leaf size={48} /></div>
                <h1 className="can-h1">Canada Sales Tax<br /><span className="can-h1-sub">Calculator 2026</span></h1>
                <p className="can-hero-desc">
                  Calculate <strong>GST, HST, PST</strong> and <strong>QST</strong> for all 13 Canadian
                  provinces &amp; territories. Updated for April 2025 including Nova Scotia's HST reduction.
                </p>
              </div>

              {/* Province rate tiles */}
              <div className="can-hero-tiles">
                {[
                  { label: "Alberta", rate: "5%", sub: "GST only", color: "#8a6a00" },
                  { label: "Ontario", rate: "13%", sub: "HST", color: "#CC0000" },
                  { label: "Quebec", rate: "14.975%", sub: "GST + QST", color: "#2e7d32" },
                  { label: "Atlantic", rate: "15%", sub: "HST", color: "#CC0000" },
                ].map(t => (
                  <div key={t.label} className="can-hero-tile" style={{ borderTopColor: t.color }}>
                    <span className="can-tile-rate" style={{ color: t.color }}>{t.rate}</span>
                    <span className="can-tile-label">{t.label}</span>
                    <span className="can-tile-sub">{t.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="can-container can-main">

          {/* ── Tabs ── */}
          <div className="can-tabs" role="tablist">
            {([
              { id: "calculator", label: "Calculator", icon: <Calculator size={18} /> },
              { id: "reverse", label: "Reverse", icon: <RotateCcw size={18} /> },
              { id: "compare", label: "All Provinces", icon: <Scale size={18} /> },
              { id: "guide", label: "Guide", icon: <BookOpen size={18} /> },
            ] as { id: CalcMode; label: string; icon: React.ReactNode }[]).map(t => (
              <button key={t.id} role="tab" aria-selected={mode === t.id}
                className={`can-tab${mode === t.id ? " can-tab--active" : ""}`}
                onClick={() => setMode(t.id)}>
                <span className="can-tab-icon">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* ══ CALCULATOR ══ */}
          {mode === "calculator" && (
            <section className="can-section">
              <div className="can-calc-grid">

                {/* Left: Province picker + amount */}
                <div className="can-left-col">
                  <div className="can-panel">
                    <h2 className="can-panel-title">Select Province &amp; Amount</h2>

                    <label className="can-field">
                      <span className="can-label">Amount (CAD $)</span>
                      <div className="can-input-wrap">
                        <span className="can-input-pre">$</span>
                        <input type="number" min={0} step={0.01} value={amount}
                          onChange={e => setAmount(e.target.value)}
                          className="can-input can-input--pre" placeholder="100.00" />
                      </div>
                    </label>

                    {/* Quick amounts */}
                    <div className="can-quick-row">
                      {[50, 100, 250, 500, 1000, 2500, 5000, 10000].map(a => (
                        <button key={a} className="can-quick" onClick={() => setAmount(String(a))}>
                          ${a.toLocaleString("en-CA")}
                        </button>
                      ))}
                    </div>

                    <span className="can-label" style={{ marginTop: "1.25rem", display: "block" }}>Province / Territory</span>
                    <div className="can-province-grid">
                      {PROVINCES.map(p => (
                        <button
                          key={p.code}
                          className={`can-prov-btn${selectedCode === p.code ? " can-prov-btn--active" : ""}`}
                          onClick={() => setSelectedCode(p.code)}
                          title={`${p.name} — ${fmtPct(p.total)}`}
                        >
                          <span className="can-prov-abbr">{p.abbr}</span>
                          <span className="can-prov-rate">{fmtPct(p.total)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Results */}
                <div className="can-right-col">
                  {/* Province info bar */}
                  <div className="can-prov-info" style={{ borderLeftColor: TYPE_COLOR[province.type] }}>
                    <div className="can-prov-flag">{province.flag}</div>
                    <div className="can-prov-details">
                      <span className="can-prov-name">{province.name}</span>
                      <span className="can-prov-type" style={{ color: TYPE_COLOR[province.type] }}>{province.type}</span>
                    </div>
                    {province.note && <div className="can-prov-note"><Info size={12} style={{ display: 'inline', marginRight: 4 }} /> {province.note}</div>}
                  </div>

                  {/* Result cards */}
                  <div className="can-result-hero">
                    <div className="can-result-row can-result-row--tax">
                      <span>Tax Amount</span>
                      <span className="can-result-big">{fmtCAD(taxCalc.totalTax)}</span>
                    </div>
                    <div className="can-result-row can-result-row--total">
                      <span>Total (incl. tax)</span>
                      <span>{fmtCAD(taxCalc.total)}</span>
                    </div>
                    <div className="can-result-row">
                      <span>Pre-tax price</span>
                      <span>{fmtCAD(pre)}</span>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="can-breakdown">
                    <div className="can-breakdown-title">Tax Breakdown</div>

                    {province.type === "HST" && (
                      <div className="can-bd-row">
                        <div className="can-bd-meta">
                          <div className="can-bd-dot" style={{ background: "#CC0000" }} />
                          <span className="can-bd-label">HST ({fmtPct(province.hst)})</span>
                          <span className="can-bd-amt">{fmtCAD(taxCalc.hstAmt)}</span>
                        </div>
                        <div className="can-bd-inner">
                          <div className="can-bd-sub-row">
                            <span>Federal component (5%)</span>
                            <span>{fmtCAD(pre * 0.05)}</span>
                          </div>
                          <div className="can-bd-sub-row">
                            <span>Provincial component ({fmtPct(province.hst - 5)})</span>
                            <span>{fmtCAD(pre * ((province.hst - 5) / 100))}</span>
                          </div>
                        </div>
                        <div className="can-bd-bar-track">
                          <div className="can-bd-bar" style={{ width: "100%", background: "#CC0000" }} />
                        </div>
                      </div>
                    )}

                    {(province.type === "GST+PST" || province.type === "GST") && (
                      <>
                        <div className="can-bd-row">
                          <div className="can-bd-meta">
                            <div className="can-bd-dot" style={{ background: "#CC0000" }} />
                            <span className="can-bd-label">GST (5%)</span>
                            <span className="can-bd-amt">{fmtCAD(taxCalc.gstAmt)}</span>
                          </div>
                          <div className="can-bd-bar-track">
                            <div className="can-bd-bar" style={{ width: province.total > 0 ? `${(5 / province.total) * 100}%` : "100%", background: "#CC0000" }} />
                          </div>
                        </div>
                        {province.type === "GST+PST" && (
                          <div className="can-bd-row">
                            <div className="can-bd-meta">
                              <div className="can-bd-dot" style={{ background: "#1a6bbf" }} />
                              <span className="can-bd-label">{province.pstLabel} ({fmtPct(province.pst)})</span>
                              <span className="can-bd-amt">{fmtCAD(taxCalc.pstAmt)}</span>
                            </div>
                            <div className="can-bd-bar-track">
                              <div className="can-bd-bar" style={{ width: `${(province.pst / province.total) * 100}%`, background: "#1a6bbf" }} />
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {province.type === "GST+QST" && (
                      <>
                        <div className="can-bd-row">
                          <div className="can-bd-meta">
                            <div className="can-bd-dot" style={{ background: "#CC0000" }} />
                            <span className="can-bd-label">GST (5%)</span>
                            <span className="can-bd-amt">{fmtCAD(taxCalc.gstAmt)}</span>
                          </div>
                          <div className="can-bd-bar-track">
                            <div className="can-bd-bar" style={{ width: `${(taxCalc.gstAmt / taxCalc.totalTax) * 100}%`, background: "#CC0000" }} />
                          </div>
                        </div>
                        <div className="can-bd-row">
                          <div className="can-bd-meta">
                            <div className="can-bd-dot" style={{ background: "#2e7d32" }} />
                            <span className="can-bd-label">QST (9.975% on price+GST)</span>
                            <span className="can-bd-amt">{fmtCAD(taxCalc.pstAmt)}</span>
                          </div>
                          <div className="can-bd-bar-track">
                            <div className="can-bd-bar" style={{ width: `${(taxCalc.pstAmt / taxCalc.totalTax) * 100}%`, background: "#2e7d32" }} />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="can-formula-box">
                      {province.type === "HST" && (
                        <code>{fmtCAD(pre)} × {fmtPct(province.hst)} = {fmtCAD(taxCalc.hstAmt)}</code>
                      )}
                      {province.type === "GST+PST" && (
                        <>
                          <code>GST: {fmtCAD(pre)} × 5% = {fmtCAD(taxCalc.gstAmt)}</code>
                          <code>{province.pstLabel}: {fmtCAD(pre)} × {fmtPct(province.pst)} = {fmtCAD(taxCalc.pstAmt)}</code>
                        </>
                      )}
                      {province.type === "GST+QST" && (
                        <>
                          <code>GST: {fmtCAD(pre)} × 5% = {fmtCAD(taxCalc.gstAmt)}</code>
                          <code>QST: {fmtCAD(pre + taxCalc.gstAmt)} × 9.975% = {fmtCAD(taxCalc.pstAmt)}</code>
                        </>
                      )}
                      {province.type === "GST" && (
                        <code>GST: {fmtCAD(pre)} × 5% = {fmtCAD(taxCalc.gstAmt)}</code>
                      )}
                    </div>
                  </div>

                  {/* Effective rate display */}
                  <div className="can-effective">
                    <span>Effective tax rate on {fmtCAD(pre)}</span>
                    <span className="can-effective-rate">{pre > 0 ? fmtPct((taxCalc.totalTax / pre) * 100) : "—"}</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ══ REVERSE ══ */}
          {mode === "reverse" && (
            <section className="can-section">
              <div className="can-calc-grid">
                <div className="can-left-col">
                  <div className="can-panel">
                    <h2 className="can-panel-title">Reverse GST / HST Calculator</h2>
                    <p className="can-panel-desc">Enter the <strong>total amount paid</strong> (tax included) and province to find the pre-tax price and exact tax paid.</p>

                    <label className="can-field">
                      <span className="can-label">Total Paid — Tax Included (CAD $)</span>
                      <div className="can-input-wrap">
                        <span className="can-input-pre">$</span>
                        <input type="number" min={0} step={0.01} value={revTotal}
                          onChange={e => setRevTotal(e.target.value)}
                          className="can-input can-input--pre" placeholder="113.00" />
                      </div>
                    </label>

                    <div className="can-quick-row">
                      {[56.50, 113, 141.25, 169.75, 500, 1000].map(a => (
                        <button key={a} className="can-quick" onClick={() => setRevTotal(String(a))}>
                          ${a.toLocaleString("en-CA")}
                        </button>
                      ))}
                    </div>

                    <span className="can-label" style={{ marginTop: "1.25rem", display: "block" }}>Province / Territory</span>
                    <div className="can-province-grid">
                      {PROVINCES.map(p => (
                        <button key={p.code}
                          className={`can-prov-btn${revCode === p.code ? " can-prov-btn--active" : ""}`}
                          onClick={() => setRevCode(p.code)} title={`${p.name} — ${fmtPct(p.total)}`}>
                          <span className="can-prov-abbr">{p.abbr}</span>
                          <span className="can-prov-rate">{fmtPct(p.total)}</span>
                        </button>
                      ))}
                    </div>

                    <div className="can-info-box">
                      <strong>Formula ({revProvince.name}):</strong><br />
                      {revProvince.type === "GST+QST"
                        ? `Pre-tax = Total ÷ (1.05 × 1.09975) = Total ÷ 1.14975`
                        : `Pre-tax = Total ÷ (1 + ${fmtPct(revProvince.total)}) = Total ÷ ${(1 + revProvince.total / 100).toFixed(5)}`
                      }
                    </div>
                  </div>
                </div>

                <div className="can-right-col">
                  <div className="can-prov-info" style={{ borderLeftColor: TYPE_COLOR[revProvince.type] }}>
                    <div className="can-prov-flag">{revProvince.flag}</div>
                    <div className="can-prov-details">
                      <span className="can-prov-name">{revProvince.name}</span>
                      <span className="can-prov-type" style={{ color: TYPE_COLOR[revProvince.type] }}>{revProvince.type}</span>
                    </div>
                  </div>

                  <div className="can-result-hero">
                    <div className="can-result-row can-result-row--tax">
                      <span>Pre-tax Price</span>
                      <span className="can-result-big">{fmtCAD(revCalc.preTax)}</span>
                    </div>
                    <div className="can-result-row can-result-row--total">
                      <span>Tax Paid</span>
                      <span>{fmtCAD(revCalc.tax)}</span>
                    </div>
                    <div className="can-result-row">
                      <span>Total Paid</span>
                      <span>{fmtCAD(parseFloat(revTotal) || 0)}</span>
                    </div>
                  </div>

                  <div className="can-breakdown">
                    <div className="can-breakdown-title">Tax Recovered</div>
                    {revCalc.hst > 0 && (
                      <div className="can-bd-row">
                        <div className="can-bd-meta">
                          <div className="can-bd-dot" style={{ background: "#CC0000" }} />
                          <span className="can-bd-label">HST ({fmtPct(revProvince.hst)})</span>
                          <span className="can-bd-amt">{fmtCAD(revCalc.hst)}</span>
                        </div>
                      </div>
                    )}
                    {revCalc.gst > 0 && (
                      <div className="can-bd-row">
                        <div className="can-bd-meta">
                          <div className="can-bd-dot" style={{ background: "#CC0000" }} />
                          <span className="can-bd-label">GST (5%)</span>
                          <span className="can-bd-amt">{fmtCAD(revCalc.gst)}</span>
                        </div>
                      </div>
                    )}
                    {revCalc.pst > 0 && (
                      <div className="can-bd-row">
                        <div className="can-bd-meta">
                          <div className="can-bd-dot" style={{ background: "#1a6bbf" }} />
                          <span className="can-bd-label">{revProvince.pstLabel} ({fmtPct(revProvince.pst)})</span>
                          <span className="can-bd-amt">{fmtCAD(revCalc.pst)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ══ COMPARE ALL PROVINCES ══ */}
          {mode === "compare" && (
            <section className="can-section">
              <div className="can-compare-header">
                <h2 className="can-panel-title">Compare All Provinces — 2026 Rates</h2>
                <div className="can-compare-amount">
                  <span className="can-label">Amount: </span>
                  <div className="can-input-wrap" style={{ maxWidth: 160 }}>
                    <span className="can-input-pre">$</span>
                    <input type="number" min={0} step={10} value={compareAmt}
                      onChange={e => setCompareAmt(e.target.value)}
                      className="can-input can-input--pre" />
                  </div>
                </div>
              </div>

              <div className="can-compare-table-wrap">
                <table className="can-compare-table">
                  <thead>
                    <tr>
                      <th>Province / Territory</th>
                      <th>Tax Type</th>
                      <th>GST</th>
                      <th>PST / QST / RST</th>
                      <th>Total Rate</th>
                      <th>Tax on {fmtCAD(compareNum, 0)}</th>
                      <th>Total Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROVINCES.slice().sort((a, b) => a.total - b.total).map(p => {
                      let taxAmt = 0;
                      if (p.type === "HST") taxAmt = compareNum * (p.hst / 100);
                      else if (p.type === "GST+QST") {
                        const g = compareNum * 0.05;
                        taxAmt = g + (compareNum + g) * (p.pst / 100);
                      } else taxAmt = compareNum * ((p.gst + p.pst) / 100);
                      const typeColor = TYPE_COLOR[p.type];
                      return (
                        <tr key={p.code} className={selectedCode === p.code ? "can-tr-selected" : ""}
                          onClick={() => { setSelectedCode(p.code); setMode("calculator"); }}
                          style={{ cursor: "pointer" }}>
                          <td style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <span className="can-td-flag">{p.flag}</span>
                            <span className="can-td-name">{p.name}</span>
                            {p.note && <span className="can-td-note"><Star size={10} style={{ display: 'inline', marginRight: 2, marginBottom: 1 }} /> 2026 update</span>}
                          </td>
                          <td>
                            <span className="can-type-badge" style={{ color: typeColor, borderColor: typeColor }}>
                              {p.type}
                            </span>
                          </td>
                          <td className="can-td-num">{p.gst > 0 || p.hst === 0 ? fmtPct(p.gst || 5) : "—"}</td>
                          <td className="can-td-num">
                            {p.pstLabel ? <><span style={{ color: "#1a6bbf", fontWeight: 700 }}>{fmtPct(p.pst)}</span> <span className="can-td-note">{p.pstLabel}</span></> : "—"}
                            {p.hst > 0 ? <span style={{ color: "#CC0000", fontWeight: 700 }}>{fmtPct(p.hst)}</span> : null}
                          </td>
                          <td className="can-td-num">
                            <div className="can-rate-cell">
                              <div className="can-rate-bar" style={{ width: `${(p.total / 16) * 100}%`, background: typeColor }} />
                              <strong style={{ color: typeColor }}>{fmtPct(p.total)}</strong>
                            </div>
                          </td>
                          <td className="can-td-num can-td-tax">{fmtCAD(taxAmt)}</td>
                          <td className="can-td-num can-td-total">{fmtCAD(compareNum + taxAmt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="can-table-note"><Star size={12} style={{ display: 'inline', marginRight: 4 }} /> Click any row to open in the calculator. Nova Scotia HST reduced from 15% → 14% effective April 1, 2025.</p>

              {/* Legend */}
              <div className="can-legend">
                {Object.entries(TYPE_COLOR).map(([type, color]) => (
                  <div key={type} className="can-legend-item">
                    <span className="can-legend-dot" style={{ background: color }} />
                    <span>{type}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ══ GUIDE ══ */}
          {mode === "guide" && (
            <section className="can-section can-guide-prose">
              <h2>Canadian Sales Tax: Complete Guide for 2026</h2>
              <p>Canada's sales tax system is one of the most complex in the world for such a large economy — combining a national federal tax with a patchwork of provincial systems that each operate under different rules, rates, and exemptions. Here is everything you need to know.</p>
              <h3>The Three Types of Canadian Sales Tax</h3>
              <p><strong>GST (Goods and Services Tax)</strong> is a 5% federal value-added tax that applies nationwide to most goods and services. It is administered by the Canada Revenue Agency (CRA). Every province has GST — either separately or folded into an HST.</p>
              <p><strong>HST (Harmonized Sales Tax)</strong> is a single blended tax that combines the federal GST and the provincial sales tax into one rate, collected together by the CRA. Ontario (13%), New Brunswick (15%), Newfoundland and Labrador (15%), Nova Scotia (14% as of April 2025), and Prince Edward Island (15%) all use HST.</p>
              <p><strong>PST (Provincial Sales Tax)</strong> is a retail sales tax collected separately from GST by each province's own tax authority. British Columbia charges 7% PST, Manitoba 7% RST (Retail Sales Tax), and Saskatchewan 6% PST. Quebec's equivalent is the QST (Quebec Sales Tax) at 9.975%.</p>
              <h3>Province-by-Province Overview</h3>
              <p><strong>Ontario (13% HST):</strong> Canada's most populous province. The 13% HST combines 5% federal and 8% provincial. Most goods and services are taxable; groceries, prescription drugs, and certain medical devices are exempt.</p>
              <p><strong>Quebec (14.975% GST+QST):</strong> Quebec uniquely applies QST on the GST-inclusive price. The effective combined rate of 14.975% is the highest in Canada. QST is a VAT administered by Revenu Québec, not the CRA.</p>
              <p><strong>British Columbia (12% GST+PST):</strong> BC charges 5% GST and 7% PST separately. PST does not apply to groceries, prescription drugs, children's clothing, or basic veterinary services.</p>
              <p><strong>Alberta (5% GST only):</strong> The only province with no provincial sales tax. This makes Alberta — and particularly Calgary and Edmonton — popular cross-border shopping destinations for Saskatchewanians and BC residents buying large-ticket items.</p>
              <p><strong>Saskatchewan (11% GST+PST):</strong> 5% GST plus 6% PST. Saskatchewan PST applies broadly, including to some services and digital products.</p>
              <p><strong>Manitoba (12% GST+RST):</strong> Manitoba's Retail Sales Tax (RST) is 7%, combined with 5% GST for a total of 12%.</p>
              <p><strong>Nova Scotia (14% HST — reduced April 2025):</strong> Nova Scotia cut its HST from 15% to 14% on April 1, 2025, by reducing the provincial component from 10% to 9%.</p>
              <p><strong>Territories (5% GST):</strong> Yukon, Northwest Territories, and Nunavut have no territorial sales tax — only the 5% federal GST applies.</p>
            </section>
          )}

          {/* ── Related Tools ── */}
          <section className="can-related-section">
            <h2 className="can-section-title">Related Financial Tools</h2>
            <div className="can-related-grid">
              {[
                { name: "California Sales Tax", href: "/finance/sales-tax-california-calculator", desc: "Calculate sales tax for any city or county in California." },
                { name: "Canada Income Tax", href: "/finance/canada-income-tax-calculator", desc: "Calculate federal and provincial income tax and take-home pay." },
                { name: "House Affordability Canada", href: "/real-estate/house-affordability-calculator-canada", desc: "How much home can you afford with the 2024 stress test?" },
                { name: "Capital Gains Tax Canada", href: "/finance/capital-gains-tax-canada-calculator", desc: "Estimate tax on investments and property sales." }
              ].map(tool => (
                <Link key={tool.href} href={tool.href} className="can-related-card">
                  <h3 className="can-related-name">{tool.name}</h3>
                  <p className="can-related-desc">{tool.desc}</p>
                  <span className="can-related-link">Use calculator <ArrowRight size={14} /></span>
                </Link>
              ))}
            </div>
          </section>
        </main>

        {/* ── SEO Article ── */}
        <article className="can-article can-container">
          <SEOArticle />
        </article>

        {/* ── FAQ ── */}
        <section className="can-faq-section can-container">
          <FAQSection />
        </section>

        {/* Disclaimer */}
        <div className="can-container">
          <div className="can-disclaimer">
            <strong>Disclaimer:</strong> Rates are based on CRA and provincial government sources, effective 2025. Tax rates are subject to change. This tool is for estimation only and does not constitute tax advice. Always confirm rates with the <a href="https://www.canada.ca/en/revenue-agency.html" target="_blank" rel="noopener noreferrer">Canada Revenue Agency</a> or your provincial tax authority. Quebec QST effective rate reflects the tax-on-tax compounding method per Revenu Québec rules.
          </div>
        </div>

        <style>{CSS}</style>
      </div>
    </>
  );
}

// ─── SEO Article ─────────────────────────────────────────────────────────────

function SEOArticle() {
  return (
    <div className="can-prose">
      <h2>Canada Sales Tax Calculator: The Complete 2025 Guide to GST, HST, PST &amp; QST</h2>

      <p>Understanding <strong>Canada's sales tax system</strong> is essential for consumers, business owners, and anyone crossing provincial borders to shop. Unlike the United States, where sales tax is almost always a simple percentage added to the sticker price, Canada operates three distinct tax systems simultaneously — the federal GST, provincial HST, and separate PST/QST regimes — each with their own rates, rules, and exemptions.</p>

      <p>Our <strong>Canada sales tax calculator</strong> covers all 13 provinces and territories with 2025 rates, including Nova Scotia's April 2025 HST reduction from 15% to 14%. Use it to instantly calculate GST, HST, PST, QST, or RST for any purchase amount, run a reverse calculation to back out the pre-tax price from a total, and compare tax burdens across provinces side by side.</p>

      <h3>What Is the GST Rate in Canada?</h3>
      <p>The federal <strong>Goods and Services Tax (GST)</strong> rate is <strong>5%</strong>, effective since January 1, 2008, when it was reduced from 6%. GST applies nationally to most goods and services sold in Canada. It is a value-added tax (VAT), meaning businesses collect it from customers and remit it to the Canada Revenue Agency (CRA), while registered businesses can claim input tax credits (ITCs) for GST paid on business expenses.</p>
      <p>Businesses with annual taxable revenues under CAD $30,000 are considered small suppliers and are not required to register for or collect GST. Once that threshold is exceeded, registration is mandatory. Most online retailers and digital services providers selling to Canadian customers are now required to collect GST/HST regardless of physical presence, following rules introduced in 2021.</p>

      <h3>HST Provinces: Ontario, Atlantic Canada, and Nova Scotia's 2025 Change</h3>
      <p>Five provinces have harmonized their provincial sales tax with the federal GST to create a single <strong>Harmonized Sales Tax (HST)</strong>, administered by the CRA. Businesses in HST provinces file a single return for both the federal and provincial components:</p>
      <ul>
        <li><strong>Ontario:</strong> 13% HST (5% federal + 8% provincial)</li>
        <li><strong>New Brunswick:</strong> 15% HST (5% federal + 10% provincial)</li>
        <li><strong>Newfoundland and Labrador:</strong> 15% HST (5% federal + 10% provincial)</li>
        <li><strong>Prince Edward Island:</strong> 15% HST (5% federal + 10% provincial)</li>
        <li><strong>Nova Scotia:</strong> <strong>14% HST</strong> as of April 1, 2025 (reduced from 15%) — the provincial component decreased from 10% to 9%</li>
      </ul>
      <p>Nova Scotia's HST reduction was announced in the 2024 provincial budget and represents a meaningful cost reduction for Nova Scotian consumers — approximately $100 in annual savings on $10,000 of taxable spending.</p>

      <h3>PST Provinces: BC, Manitoba, and Saskatchewan</h3>
      <p>British Columbia, Manitoba, and Saskatchewan collect a <strong>Provincial Sales Tax (PST)</strong> separately from the federal GST. Unlike GST, PST is not a VAT — there are no input tax credits for PST paid on business purchases, making it a true cost embedded in the supply chain for businesses.</p>
      <ul>
        <li><strong>British Columbia:</strong> 7% PST + 5% GST = 12% total. BC PST exempts most groceries, prescription drugs, and children's clothing. Administered by the BC Ministry of Finance.</li>
        <li><strong>Manitoba:</strong> 7% RST (Retail Sales Tax) + 5% GST = 12% total. Manitoba's PST is called the Retail Sales Tax and is administered by the Manitoba Tax Division.</li>
        <li><strong>Saskatchewan:</strong> 6% PST + 5% GST = 11% total. Saskatchewan applies PST broadly, including to some digital services and software supplied to Saskatchewan customers by out-of-province vendors.</li>
      </ul>

      <h3>Quebec's Unique Tax System: GST + QST</h3>
      <p>Quebec operates the most complex provincial tax system in Canada. The <strong>Quebec Sales Tax (QST)</strong> rate is 9.975%, applied on top of the 5% GST — but critically, the QST is calculated on the <em>GST-inclusive price</em>, not the pre-tax price. This compounding means the effective combined rate is slightly higher than simply adding 5% + 9.975%.</p>
      <p>For a $100 pre-tax purchase in Quebec: GST = $5.00 (on $100). QST = $10.49 (9.975% × $105). Total tax = $15.49. Total = $115.49. The combined effective rate is 15.49% on the pre-tax price, despite the nominal combined rate being 14.975%.</p>
      <p>The QST is a value-added tax, like the GST, allowing registered businesses to claim input tax refunds (ITRs) for QST paid on business expenses. However, QST is administered by <em>Revenu Québec</em>, not the CRA, requiring Quebec-based businesses to file separate returns with both authorities — or with Revenu Québec alone if they are resident in Quebec (Revenu Québec administers both GST and QST for Quebec residents).</p>

      <h3>Alberta: Canada's Tax Advantage Province</h3>
      <p>Alberta is unique as the only province with no provincial sales tax of any kind. Albertans pay only the 5% federal GST on most purchases — the lowest sales tax rate in Canada. This creates a significant cost advantage that drives cross-border shopping from neighbouring provinces. Many Saskatchewanians and British Columbians make deliberate trips to Alberta for large purchases like appliances, electronics, vehicles, and furniture.</p>
      <p>The three territories — Yukon, Northwest Territories, and Nunavut — similarly have no territorial sales taxes, paying only 5% GST. However, their small populations and geographic remoteness limit the practical cross-border shopping effect.</p>

      <h3>What Is Exempt from Canadian Sales Tax?</h3>
      <p>GST/HST exemptions are consistent across all participating provinces (though PST exemptions vary by province):</p>
      <ul>
        <li><strong>Groceries:</strong> Most basic groceries — fresh produce, meats, dairy, bread, cereal — are zero-rated for GST/HST purposes, meaning they are taxable at 0%. Note: "zero-rated" is different from "exempt" in VAT terminology; zero-rated supplies still allow businesses to claim input tax credits.</li>
        <li><strong>Prescription drugs:</strong> Prescription medications are zero-rated nationwide.</li>
        <li><strong>Medical devices:</strong> Prescribed medical devices are zero-rated.</li>
        <li><strong>Health and dental services:</strong> Most health, dental, and optometry services are exempt from GST/HST.</li>
        <li><strong>Financial services:</strong> Most banking, insurance, and investment services are exempt.</li>
        <li><strong>Residential rent:</strong> Long-term residential rents are exempt.</li>
        <li><strong>Educational services:</strong> Most tuition fees for educational programs are exempt.</li>
        <li><strong>Childcare services:</strong> Most daycare and childcare services are exempt.</li>
      </ul>
      <p>Restaurant meals, snack foods, soft drinks, candy, and alcohol are fully taxable even though they are "food." The CRA has detailed rules about what constitutes a basic grocery versus a taxable food product — for example, a bag of potato chips is taxable while a bag of plain rice is zero-rated.</p>

      <h3>Canadian Sales Tax for Businesses</h3>
      <p>Businesses registered for GST/HST collect the tax from customers and periodically remit it to the CRA (monthly, quarterly, or annually, depending on revenue). Registered businesses can also claim input tax credits (ITCs) for GST/HST paid on business-related purchases, effectively making the tax a wash at each step of the supply chain until it reaches the final consumer.</p>
      <p>PST (in BC, Manitoba, and Saskatchewan) does not offer input tax credits — it is a retail-level tax that becomes a permanent cost for businesses. This is a significant structural difference that affects pricing decisions, especially for businesses with complex supply chains.</p>
      <p>Non-resident businesses selling digital services, goods, or software to Canadian consumers may be required to register for and collect GST/HST even without a physical presence in Canada, under the digital economy rules effective July 1, 2021.</p>

      <h3>Cross-Border Shopping and Provincial Rate Arbitrage</h3>
      <p>The variation in sales tax rates across Canadian provinces creates legal opportunities for rate arbitrage. The place-of-supply rules determine which province's rate applies — generally the province where the sale takes place (for goods) or where the service is delivered or the customer is located (for services). For tangible goods purchased in person, the rate is the province where the purchase occurs, not where the buyer lives. This is why shopping in Alberta (5% GST only) can save BC or Manitoba residents up to 7% on large purchases.</p>

      <h3>How to Use This Canada Sales Tax Calculator</h3>
      <p>Enter your purchase amount and select your province or territory from the grid. The calculator instantly shows total tax, the total with tax included, and a breakdown of each tax component (GST vs. provincial). For Quebec, it correctly applies the tax-on-tax QST compounding. Use the Reverse tab to find the pre-tax price from a total you've already paid. Use the Compare tab to see all 13 provinces ranked by rate and compare tax on any purchase amount side by side.</p>
    </div>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────────────────────

const FAQS = [
  { q: "What is the sales tax in Canada?", a: "Canada has three types of sales tax. GST (5%) is a federal tax applying nationwide. HST (13–15%) is a harmonized federal+provincial tax used in Ontario and the Atlantic provinces. PST/QST/RST is a separate provincial tax in BC (7%), Manitoba (7%), Saskatchewan (6%), and Quebec (9.975% QST). Alberta and the three territories pay only 5% GST." },
  { q: "How much is HST in Ontario?", a: "Ontario's HST is 13% in 2025 — composed of 5% federal GST and 8% provincial component, collected together by the CRA. On a $1,000 purchase, Ontario HST is $130." },
  { q: "What is the tax rate in Quebec?", a: "Quebec charges 5% GST plus 9.975% QST for a combined nominal rate of 14.975%. Because QST is applied on the GST-inclusive price, the effective combined rate on a pre-tax price is approximately 15.49%. On $100 before tax, you pay $5.00 GST + $10.49 QST = $15.49 total tax." },
  { q: "Does Alberta have provincial sales tax?", a: "No — Alberta is the only Canadian province with no provincial sales tax. Only the 5% federal GST applies, making Alberta's total sales tax rate the lowest in Canada and a popular shopping destination for residents of neighbouring provinces." },
  { q: "What changed with Nova Scotia's HST in 2025?", a: "Nova Scotia reduced its HST from 15% to 14% on April 1, 2025. The provincial component was cut from 10% to 9%, as announced in the 2024 Nova Scotia provincial budget. This is the most recent HST rate change in Canada." },
  { q: "How do I calculate GST in Canada?", a: "GST = Pre-tax Price × 5%. For example: $200 × 5% = $10 GST, total = $210. In HST provinces, replace 5% with the HST rate (e.g., 13% in Ontario: $200 × 13% = $26, total = $226). Use our calculator for any province instantly." },
  { q: "How do I remove GST from a price in Canada?", a: "Pre-tax Price = Total Price ÷ (1 + Tax Rate). For Ontario HST (13%): $226 ÷ 1.13 = $200 pre-tax. For Quebec (GST+QST compounding): divide by 1.05 × 1.09975 = 1.14975. Use the Reverse tab above." },
  { q: "What province has the highest sales tax in Canada?", a: "New Brunswick, Newfoundland and Labrador, and Prince Edward Island all charge 15% HST — the highest combined rate in Canada. Quebec's effective rate (≈15.49% after QST compounding) can exceed these, depending on the calculation method used." },
  { q: "Is food taxable in Canada?", a: "Most basic groceries are zero-rated for GST/HST in Canada — meaning they're taxed at 0%. However, restaurant meals, takeout food, snacks, candy, soft drinks, and alcohol are fully taxable at the applicable rate. PST exemptions for food vary by province." },
  { q: "Do I pay sales tax on online purchases in Canada?", a: "Yes — major online retailers collect GST/HST (and PST where applicable) based on your delivery address. Since July 2021, foreign digital services providers and online platforms selling to Canadian consumers are also required to register for and collect GST/HST, regardless of where they are based." },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="can-faq-inner">
      <h2 className="can-section-title">Frequently Asked Questions</h2>
      <div className="can-faq-list">
        {FAQS.map((f, i) => (
          <div key={i} className={`can-faq-item${open === i ? " can-faq-item--open" : ""}`}>
            <button className="can-faq-q" onClick={() => setOpen(open === i ? null : i)}>
              <span>{f.q}</span>
              <span className="can-faq-chevron">{open === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
            </button>
            {open === i && <p className="can-faq-a">{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
  /* ── Base ── */
  .can-page {
    font-family: 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans', sans-serif;
    background: #f5f6f8;
    color: #1a1f2e;
    min-height: 100vh;
  }
  .can-container { max-width: 1140px; margin: 0 auto; padding: 0 1.25rem; }

  /* ── Hero ── */
  .can-hero {
    background: #ffffff;
    border-bottom: 3px solid #CC0000;
    padding: 2.5rem 0 2rem;
    position: relative;
  }
  .can-hero::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 5px;
    background: linear-gradient(90deg, #CC0000 0%, #ff4444 50%, #CC0000 100%);
  }
  .can-breadcrumb { display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem; color: #8a96a8; margin-bottom: 1.5rem; }
  .can-breadcrumb a { color: #CC0000; text-decoration: none; }
  .can-breadcrumb a:hover { text-decoration: underline; }
  .can-hero-layout { display: grid; grid-template-columns: 1fr auto; gap: 2.5rem; align-items: center; }
  .can-maple { font-size: 2.5rem; margin-bottom: 0.5rem; line-height: 1; }
  .can-h1 {
    font-size: clamp(1.8rem, 4.5vw, 3rem);
    font-weight: 800;
    line-height: 1.15;
    color: #1a1f2e;
    margin: 0 0 0.875rem;
    letter-spacing: -0.03em;
  }
  .can-h1-sub { color: #CC0000; }
  .can-hero-desc { font-size: 0.95rem; color: #5a6478; max-width: 520px; line-height: 1.6; margin: 0; }
  .can-hero-desc strong { color: #1a1f2e; }
  .can-hero-tiles { display: grid; grid-template-columns: repeat(2, 130px); gap: 0.75rem; }
  .can-hero-tile {
    background: #f5f6f8;
    border: 1px solid #e2e6ed;
    border-top-width: 3px;
    border-radius: 8px;
    padding: 0.875rem 0.75rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .can-tile-rate { font-size: 1.25rem; font-weight: 800; font-family: 'Courier New', monospace; letter-spacing: -0.03em; }
  .can-tile-label { font-size: 0.75rem; font-weight: 700; color: #1a1f2e; }
  .can-tile-sub { font-size: 0.65rem; color: #8a96a8; text-transform: uppercase; letter-spacing: 0.05em; }

  /* ── Main ── */
  .can-main { padding: 2rem 1.25rem; }

  /* ── Tabs ── */
  .can-tabs { display: flex; gap: 0; margin-bottom: 1.75rem; border-bottom: 2px solid #e2e6ed; flex-wrap: wrap; }
  .can-tab { background: none; border: none; border-bottom: 2px solid transparent; margin-bottom: -2px; padding: 0.7rem 1.1rem; font-size: 0.875rem; cursor: pointer; color: #8a96a8; font-family: inherit; font-weight: 600; transition: color 0.15s, border-color 0.15s; white-space: nowrap; display: flex; align-items: center; }
  .can-tab:hover { color: #1a1f2e; }
  .can-tab--active { color: #CC0000; border-bottom-color: #CC0000; }
  .can-tab-icon { margin-right: 0.5rem; display: flex; align-items: center; }

  /* ── Calc grid ── */
  .can-calc-grid { display: grid; grid-template-columns: 380px 1fr; gap: 1.5rem; align-items: start; }
  .can-left-col { }
  .can-right-col { display: flex; flex-direction: column; gap: 1rem; }

  /* ── Panel ── */
  .can-panel { background: #fff; border: 1px solid #e2e6ed; border-radius: 10px; padding: 1.5rem; box-shadow: 0 1px 6px rgba(26,31,46,0.05); }
  .can-panel-title { font-size: 1rem; font-weight: 800; color: #1a1f2e; margin-bottom: 0.25rem; }
  .can-panel-desc { font-size: 0.82rem; color: #5a6478; line-height: 1.55; margin-bottom: 1.25rem; }

  /* ── Fields ── */
  .can-field { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1rem; }
  .can-label { font-size: 0.72rem; font-weight: 700; color: #8a96a8; text-transform: uppercase; letter-spacing: 0.08em; }
  .can-input-wrap { display: flex; align-items: center; border: 2px solid #e2e6ed; border-radius: 7px; overflow: hidden; background: #fff; transition: border-color 0.15s; }
  .can-input-wrap:focus-within { border-color: #CC0000; }
  .can-input-pre { padding: 0.6rem 0.75rem; background: #f5f6f8; color: #8a96a8; font-size: 1rem; font-family: 'Courier New', monospace; border-right: 1px solid #e2e6ed; flex-shrink: 0; }
  .can-input { width: 100%; padding: 0.65rem 0.875rem; border: 2px solid #e2e6ed; border-radius: 7px; font-size: 1rem; font-family: 'Courier New', monospace; color: #1a1f2e; background: #fff; transition: border-color 0.15s; outline: none; }
  .can-input--pre { border: none; border-radius: 0; }
  .can-input:focus { border-color: #CC0000; }

  /* ── Quick amounts ── */
  .can-quick-row { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.75rem; }
  .can-quick { background: #f5f6f8; border: 1px solid #e2e6ed; border-radius: 4px; padding: 0.28rem 0.55rem; font-size: 0.75rem; cursor: pointer; font-family: 'Courier New', monospace; color: #3a4458; transition: all 0.12s; }
  .can-quick:hover { background: #CC0000; color: #fff; border-color: #CC0000; }

  /* ── Province grid ── */
  .can-province-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.4rem; margin-top: 0.5rem; }
  .can-prov-btn {
    background: #f5f6f8;
    border: 1px solid #e2e6ed;
    border-radius: 6px;
    padding: 0.5rem 0.3rem;
    cursor: pointer;
    font-family: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
    transition: all 0.12s;
  }
  .can-prov-btn:hover { border-color: #CC0000; background: #fff5f5; }
  .can-prov-btn--active { background: #CC0000; border-color: #CC0000; }
  .can-prov-btn--active .can-prov-abbr,
  .can-prov-btn--active .can-prov-rate { color: #fff !important; }
  .can-prov-abbr { font-size: 0.75rem; font-weight: 800; color: #1a1f2e; }
  .can-prov-rate { font-size: 0.6rem; color: #8a96a8; font-family: 'Courier New', monospace; }

  /* ── Province info bar ── */
  .can-prov-info {
    background: #fff;
    border: 1px solid #e2e6ed;
    border-left-width: 4px;
    border-radius: 8px;
    padding: 0.875rem 1rem;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    flex-wrap: wrap;
    box-shadow: 0 1px 4px rgba(26,31,46,0.04);
  }
  .can-prov-flag { font-size: 1.5rem; line-height: 1; display: inline-flex; align-items: center; }
  .can-prov-details { display: flex; flex-direction: column; gap: 0.15rem; flex: 1; }
  .can-prov-name { font-size: 1rem; font-weight: 800; color: #1a1f2e; }
  .can-prov-type { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
  .can-prov-note { font-size: 0.75rem; color: #8a96a8; width: 100%; padding-top: 0.4rem; border-top: 1px dashed #e2e6ed; margin-top: 0.4rem; display: flex; align-items: center; }

  /* ── Results ── */
  .can-result-hero { background: #fff; border: 1px solid #e2e6ed; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 6px rgba(26,31,46,0.05); }
  .can-result-row { display: flex; justify-content: space-between; align-items: center; padding: 0.875rem 1.25rem; font-size: 0.9rem; color: #5a6478; border-bottom: 1px solid #f0f2f5; }
  .can-result-row:last-child { border-bottom: none; }
  .can-result-row--tax { font-weight: 700; font-size: 1rem; background: #fff8f8; }
  .can-result-row--total { background: #CC0000; color: #fff; font-size: 1.1rem; font-weight: 800; }
  .can-result-big { font-size: 1.75rem; font-weight: 900; color: #CC0000; font-family: 'Courier New', monospace; letter-spacing: -0.03em; }
  .can-result-row--total .can-result-big { color: #fff; }

  /* ── Breakdown ── */
  .can-breakdown { background: #fff; border: 1px solid #e2e6ed; border-radius: 10px; padding: 1.25rem; box-shadow: 0 1px 4px rgba(26,31,46,0.04); }
  .can-breakdown-title { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #8a96a8; margin-bottom: 0.875rem; }
  .can-bd-row { margin-bottom: 0.875rem; }
  .can-bd-row:last-of-type { margin-bottom: 0; }
  .can-bd-meta { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem; }
  .can-bd-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
  .can-bd-label { flex: 1; font-size: 0.82rem; color: #3a4458; font-weight: 600; }
  .can-bd-amt { font-size: 0.875rem; font-weight: 800; font-family: 'Courier New', monospace; color: #1a1f2e; }
  .can-bd-bar-track { height: 5px; background: #f0f2f5; border-radius: 99px; overflow: hidden; }
  .can-bd-bar { height: 100%; border-radius: 99px; transition: width 0.5s; }
  .can-bd-inner { background: #f8f9fb; border-radius: 5px; padding: 0.5rem 0.75rem; margin: 0.3rem 0; }
  .can-bd-sub-row { display: flex; justify-content: space-between; font-size: 0.75rem; color: #8a96a8; padding: 0.15rem 0; }
  .can-formula-box { background: #f5f6f8; border-radius: 6px; padding: 0.75rem; margin-top: 0.875rem; display: flex; flex-direction: column; gap: 0.3rem; border-left: 3px solid #CC0000; }
  .can-formula-box code { font-family: 'Courier New', monospace; font-size: 0.8rem; color: #3a4458; }

  /* ── Effective ── */
  .can-effective { background: #fff; border: 1px solid #e2e6ed; border-radius: 8px; padding: 0.875rem 1rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; color: #5a6478; box-shadow: 0 1px 4px rgba(26,31,46,0.04); }
  .can-effective-rate { font-size: 1.1rem; font-weight: 800; color: #CC0000; font-family: 'Courier New', monospace; }

  /* ── Info box ── */
  .can-info-box { background: #f5f6f8; border: 1px solid #e2e6ed; border-radius: 7px; padding: 0.875rem; font-size: 0.8rem; color: #5a6478; line-height: 1.55; margin-top: 1rem; }
  .can-info-box strong { color: #1a1f2e; }

  /* ── Compare ── */
  .can-compare-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
  .can-compare-amount { display: flex; align-items: center; gap: 0.75rem; }
  .can-compare-table-wrap { overflow-x: auto; border-radius: 10px; border: 1px solid #e2e6ed; box-shadow: 0 1px 6px rgba(26,31,46,0.05); }
  .can-compare-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; background: #fff; }
  .can-compare-table th { background: #1a1f2e; color: #f0f4ff; padding: 0.75rem 1rem; text-align: left; font-size: 0.7rem; letter-spacing: 0.07em; text-transform: uppercase; white-space: nowrap; }
  .can-compare-table td { padding: 0.7rem 1rem; border-bottom: 1px solid #f0f2f5; color: #3a4458; vertical-align: middle; }
  .can-compare-table tr:last-child td { border-bottom: none; }
  .can-compare-table tr:hover td { background: #f8f9fb; }
  .can-tr-selected td { background: #fff5f5 !important; }
  .can-td-flag { font-size: 1.1rem; display: inline-flex; align-items: center; justify-content: center; color: #5a6478; }
  .can-td-name { font-weight: 700; color: #1a1f2e; }
  .can-td-note { font-size: 0.65rem; color: #CC0000; margin-left: 0.4rem; font-weight: 600; }
  .can-type-badge { font-size: 0.7rem; font-weight: 700; border: 1px solid; border-radius: 3px; padding: 0.15rem 0.45rem; font-family: 'Courier New', monospace; white-space: nowrap; }
  .can-td-num { text-align: right; font-family: 'Courier New', monospace; }
  .can-td-tax { color: #CC0000; font-weight: 700; }
  .can-td-total { font-weight: 700; color: #1a1f2e; }
  .can-rate-cell { display: flex; align-items: center; gap: 0.5rem; justify-content: flex-end; }
  .can-rate-bar { height: 8px; border-radius: 99px; min-width: 2px; }
  .can-table-note { font-size: 0.75rem; color: #8a96a8; margin-top: 0.75rem; font-style: italic; }
  .can-legend { display: flex; gap: 1.25rem; margin-top: 1rem; flex-wrap: wrap; }
  .can-legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; color: #5a6478; font-weight: 600; }
  .can-legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

  /* ── Guide prose ── */
  .can-guide-prose h2 { font-size: 1.4rem; color: #1a1f2e; margin-bottom: 0.75rem; font-weight: 800; }
  .can-guide-prose h3 { font-size: 1rem; color: #CC0000; margin: 1.5rem 0 0.5rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
  .can-guide-prose p { line-height: 1.75; color: #3a4458; font-size: 0.9rem; margin-bottom: 0.875rem; }
  .can-guide-prose strong { color: #1a1f2e; }
  .can-guide-prose ul { padding-left: 1.5rem; margin-bottom: 1rem; }
  .can-guide-prose li { line-height: 1.7; color: #3a4458; font-size: 0.9rem; margin-bottom: 0.35rem; }

  /* ── Article ── */
  .can-article { padding: 3rem 1.25rem; border-top: 2px solid #e2e6ed; background: #fff; }
  .can-prose h2 { font-size: 1.4rem; color: #1a1f2e; margin: 0 0 0.875rem; font-weight: 800; }
  .can-prose h3 { font-size: 0.95rem; color: #CC0000; margin: 1.5rem 0 0.4rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
  .can-prose p { line-height: 1.75; color: #3a4458; font-size: 0.9rem; margin-bottom: 0.875rem; }
  .can-prose ul { padding-left: 1.5rem; margin-bottom: 1rem; }
  .can-prose li { line-height: 1.7; color: #3a4458; font-size: 0.9rem; margin-bottom: 0.35rem; }
  .can-prose strong { color: #1a1f2e; }
  .can-prose em { font-style: italic; }

  /* ── FAQ ── */
  .can-faq-section { padding: 2.5rem 1.25rem 3rem; background: #fff; border-top: 2px solid #e2e6ed; }
  .can-faq-inner { max-width: 760px; }
  .can-section-title { font-size: 1.2rem; font-weight: 800; color: #1a1f2e; margin-bottom: 1.25rem; }
  .can-faq-list { display: flex; flex-direction: column; }
  .can-faq-item { border-bottom: 1px solid #e2e6ed; }
  .can-faq-q { width: 100%; text-align: left; background: none; border: none; padding: 1rem 0; font-size: 0.9rem; font-weight: 700; color: #1a1f2e; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 1rem; font-family: inherit; }
  .can-faq-q:hover { color: #CC0000; }
  .can-faq-chevron { font-size: 1.25rem; color: #CC0000; flex-shrink: 0; font-weight: 900; display: flex; align-items: center; }
  .can-faq-a { padding: 0 0 1rem; line-height: 1.7; color: #3a4458; font-size: 0.87rem; }

  /* ── Related Tools ── */
  .can-related-section { margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid #e2e6ed; }
  .can-related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem; margin-top: 1.5rem; }
  .can-related-card { background: #fff; border: 1px solid #e2e6ed; border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: all 0.2s; display: flex; flex-direction: column; gap: 0.5rem; }
  .can-related-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(26,31,46,0.08); border-color: #CC0000; }
  .can-related-name { font-size: 1rem; font-weight: 800; color: #1a1f2e; margin: 0; }
  .can-related-desc { font-size: 0.82rem; color: #5a6478; line-height: 1.5; margin: 0; flex: 1; }
  .can-related-link { font-size: 0.8rem; font-weight: 700; color: #CC0000; display: flex; align-items: center; gap: 0.4rem; }

  /* ── Disclaimer ── */
  .can-disclaimer { background: #f5f6f8; border: 1px solid #e2e6ed; border-radius: 8px; padding: 1rem 1.25rem; font-size: 0.78rem; color: #8a96a8; line-height: 1.6; margin: 2rem 0 3rem; }
  .can-disclaimer strong { color: #3a4458; }
  .can-disclaimer a { color: #CC0000; }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .can-calc-grid { grid-template-columns: 1fr; }
    .can-hero-layout { grid-template-columns: 1fr; }
    .can-hero-tiles { grid-template-columns: repeat(4, 1fr); }
  }
  @media (max-width: 580px) {
    .can-hero-tiles { grid-template-columns: repeat(2, 1fr); }
    .can-province-grid { grid-template-columns: repeat(4, 1fr); }
    .can-tabs { overflow-x: auto; }
    .can-tab { padding: 0.6rem 0.7rem; font-size: 0.78rem; }
  }
  @media (max-width: 400px) {
    .can-province-grid { grid-template-columns: repeat(3, 1fr); }
  }
`;
