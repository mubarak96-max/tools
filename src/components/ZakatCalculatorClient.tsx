"use client";

import { useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { 
  Building2, 
  Scale, 
  CalendarDays, 
  Globe, 
  HandHeart, 
  Home, 
  ClipboardList, 
  HeartHandshake, 
  Link, 
  Banknote, 
  ShieldCheck, 
  Plane 
} from "lucide-react";
import { ZAKAT_CSS } from "@/app/finance/zakat-calculator/zakatStyles";

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number, d = 2) =>
  isNaN(n) || !isFinite(n)
    ? "0.00"
    : n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

const fmtC = (n: number, currency = "USD") => {
  if (isNaN(n) || !isFinite(n)) return "$0.00";
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2 }).format(n);
};

// Both weight conventions are held by recognised scholars and zakat bodies
// (20 mithqal / 200 dirham), so the user picks one rather than us choosing.
const NISAB_STANDARDS = {
  "85": { gold: 85, silver: 595, label: "85 g gold / 595 g silver" },
  "87.48": { gold: 87.48, silver: 612.36, label: "87.48 g gold / 612.36 g silver" },
} as const;
type NisabStandard = keyof typeof NISAB_STANDARDS;
const ZAKAT_RATE = 0.025;

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", label: "Saudi Riyal" },
  { code: "PKR", symbol: "₨", label: "Pakistani Rupee" },
  { code: "MYR", symbol: "RM", label: "Malaysian Ringgit" },
  { code: "BDT", symbol: "৳", label: "Bangladeshi Taka" },
];

const ASSET_COLORS = [
  "#c9a84c", "#d4af70", "#8b6914", "#e8c97a",
  "#a67c3d", "#f0d89a", "#6b4f1a",
];

const CustomPieTooltip = ({ active, payload, currency }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#1a2e1a", border: "1px solid #c9a84c44",
        borderRadius: 8, padding: "10px 14px",
        fontSize: 12, color: "#e8d5a0",
      }}>
        <p style={{ fontWeight: 700, color: "#c9a84c", marginBottom: 3 }}>{payload[0].name}</p>
        <p>Value: {fmtC(payload[0].payload.value, currency)}</p>
        <p>Zakat: {fmtC(payload[0].payload.zakat, currency)}</p>
      </div>
    );
  }
  return null;
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function ZakatCalculatorClient() {
  const [nisabBasis, setNisabBasis] = useState("gold"); // "gold" | "silver"
  const [currency, setCurrency] = useState("USD");
  const [nisabStandard, setNisabStandard] = useState<NisabStandard>("85");
  const [goldPriceG, setGoldPriceG] = useState("");
  const [silverPriceG, setSilverPriceG] = useState("");
  const [activeTab, setActiveTab] = useState("summary");

  // Asset inputs
  const [assets, setAssets] = useState<Record<string, any>>({
    cash: { label: "Cash & Bank Balance", value: 5000, zakatable: true },
    savings: { label: "Savings Accounts", value: 12000, zakatable: true },
    gold: { label: "Gold (market value)", value: 3200, zakatable: true },
    silver: { label: "Silver (market value)", value: 400, zakatable: true },
    investments: { label: "Stocks & Investments", value: 8000, zakatable: true },
    business: { label: "Business Inventory", value: 0, zakatable: true },
    receivables: { label: "Money Owed to You", value: 1500, zakatable: true },
    other: { label: "Other Zakatable Assets", value: 0, zakatable: true },
  });

  // Liability inputs
  const [liabilities, setLiabilities] = useState<Record<string, any>>({
    debts: { label: "Short-term Debts Due", value: 2000 },
    bills: { label: "Bills & Expenses Due", value: 500 },
    other: { label: "Other Liabilities", value: 0 },
  });

  const updateAsset = (key: string, field: string, val: string) =>
    setAssets(p => ({ ...p, [key]: { ...p[key], [field]: val } }));
  const updateLiability = (key: string, val: string) =>
    setLiabilities(p => ({ ...p, [key]: { ...p[key], value: val } }));

  // ── Calculations ─────────────────────────────────────────────────────────
  const calc = useMemo(() => {
    const gp = parseFloat(goldPriceG) || 0;
    const sp = parseFloat(silverPriceG) || 0;
    const std = NISAB_STANDARDS[nisabStandard];

    const nisabGold = std.gold * gp;
    const nisabSilver = std.silver * sp;
    const nisabValue = nisabBasis === "gold" ? nisabGold : nisabSilver;
    const priceEntered = nisabValue > 0;

    const totalAssets = Object.values(assets)
      .filter(a => a.zakatable)
      .reduce((s, a) => s + (parseFloat(a.value) || 0), 0);

    const totalLiabilities = Object.values(liabilities)
      .reduce((s, l) => s + (parseFloat(l.value) || 0), 0);

    const netZakatableWealth = Math.max(0, totalAssets - totalLiabilities);
    const aboveNisab = priceEntered && netZakatableWealth >= nisabValue;
    const zakatDue = aboveNisab ? netZakatableWealth * ZAKAT_RATE : 0;
    const zakatIfDue = netZakatableWealth * ZAKAT_RATE;

    const assetBreakdown = Object.entries(assets).map(([key, a]) => ({
      key, name: a.label,
      value: parseFloat(a.value) || 0,
      zakat: aboveNisab || !priceEntered ? (parseFloat(a.value) || 0) * ZAKAT_RATE : 0,
    })).filter(a => a.value > 0);

    return {
      nisabGold, nisabSilver, nisabValue, priceEntered,
      totalAssets, totalLiabilities, netZakatableWealth,
      aboveNisab, zakatDue, zakatIfDue, assetBreakdown,
    };
  }, [assets, liabilities, nisabBasis, nisabStandard, goldPriceG, silverPriceG]);

  const std = NISAB_STANDARDS[nisabStandard];

  const sym = CURRENCIES.find(c => c.code === currency)?.symbol || "$";

  return (
    <>
      <style>{ZAKAT_CSS}</style>

      <div className="zakat-wrapper">
        <div className="zwrap">

          {/* ── HERO ── */}
          <header className="zhero zanim">
            <p className="zbismillah">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>

            <h1>Zakat Calculator<br /><em>Purify Your Wealth</em></h1>
            <p className="zhero-sub">
              Calculate your zakat al-mal accurately — on gold, silver, cash, savings, investments,
              business inventory, and more. Enter today&apos;s gold or silver price and the nisab is
              worked out for you in your own currency.
            </p>
            <div className="zhero-stats">
              {[
                { num: "2.5%", label: "Zakat Rate (Mal)" },
                { num: "85g", label: "Gold Nisab (or 87.48g)" },
                { num: "595g", label: "Silver Nisab (or 612.36g)" },
              ].map(s => (
                <div className="zhstat" key={s.label}>
                  <span className="zhstat-num">{s.num}</span>
                  <span className="zhstat-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          </header>

          {/* ── CALCULATOR ── */}
          <section className="zsection" id="calculator" style={{ borderTop: "none", paddingTop: 48 }}>

            {/* Settings bar */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5, fontWeight: 600 }}>Currency</div>
                <div className="ziw">
                  <select value={currency} onChange={e => setCurrency(e.target.value)}>
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5, fontWeight: 600 }}>Today&apos;s Gold Price (per gram, 24k)</div>
                <div className="ziw">
                  <span className="zipfx">{sym}</span>
                  <input type="number" min="0" step="0.1" placeholder="Enter price" value={goldPriceG} onChange={e => setGoldPriceG(e.target.value)} />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5, fontWeight: 600 }}>Today&apos;s Silver Price (per gram)</div>
                <div className="ziw">
                  <span className="zipfx">{sym}</span>
                  <input type="number" min="0" step="0.01" placeholder="Enter price" value={silverPriceG} onChange={e => setSilverPriceG(e.target.value)} />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8, fontWeight: 600 }}>Nisab Weight Standard</div>
              <div className="znisab-toggle" style={{ marginBottom: 8 }}>
                {(Object.keys(NISAB_STANDARDS) as NisabStandard[]).map(k => (
                  <button key={k} className={`znisab-btn ${nisabStandard === k ? "zactive" : ""}`} onClick={() => setNisabStandard(k)}>
                    {NISAB_STANDARDS[k].label}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.6 }}>
                Gold and silver prices change daily, so this calculator does not store a nisab amount. Enter today&apos;s price per gram in your currency
                (for example from your local bullion dealer or a zakat body that publishes daily nisab values).
              </div>
            </div>

            {/* Nisab basis */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8, fontWeight: 600 }}>Nisab Basis</div>
              <div className="znisab-toggle">
                <button className={`znisab-btn ${nisabBasis === "gold" ? "zactive" : ""}`} onClick={() => setNisabBasis("gold")}>
                  ◆ Gold Nisab — {calc.nisabGold > 0 ? `${sym}${fmt(calc.nisabGold, 0)}` : "enter gold price"}
                </button>
                <button className={`znisab-btn ${nisabBasis === "silver" ? "zactive" : ""}`} onClick={() => setNisabBasis("silver")}>
                  ◇ Silver Nisab — {calc.nisabSilver > 0 ? `${sym}${fmt(calc.nisabSilver, 0)}` : "enter silver price"}
                </button>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.6 }}>
                Gold nisab = {std.gold}g × gold price. Silver nisab = {std.silver}g × silver price.
                Many scholars and zakat bodies recommend the silver nisab when you hold a mix of assets, as it is lower and benefits more recipients.
                Consult your local scholar for guidance.
              </div>
            </div>

            <div className="ztwo-col">

              {/* LEFT: Asset & Liability inputs */}
              <div>
                <div className="zcard zanim zd1" style={{ marginBottom: 16 }}>
                  <div className="zcard-title">
                    Zakatable Assets
                    <span className="zcard-title-line" />
                  </div>
                  <div className="zdisclaimer">
                    <strong>Note:</strong> Enter current market values. Include all assets held for one lunar year (hawl). Update gold and silver prices above to reflect current spot prices.
                  </div>
                  {Object.entries(assets).map(([key, a]) => (
                    <div key={key} className="zasset-row">
                      <div>
                        <div className="zasset-label">{a.label}</div>
                        {key === "gold" && <div className="zasset-hint">Jewelry worn regularly may be exempt — consult your scholar</div>}
                        {key === "investments" && <div className="zasset-hint">Shares held for trading: full market value. Long-term holdings: see the investments guide below</div>}
                        {key === "business" && <div className="zasset-hint">Stock/inventory held for sale, not fixed assets</div>}
                        {key === "receivables" && <div className="zasset-hint">Include only debts you expect to recover</div>}
                      </div>
                      <div className="ziw">
                        <span className="zipfx">{sym}</span>
                        <input
                          type="number" min="0"
                          value={a.value}
                          onChange={e => updateAsset(key, "value", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="zcard zanim zd2">
                  <div className="zcard-title">
                    Liabilities (Deductible Debts)
                    <span className="zcard-title-line" />
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 14, lineHeight: 1.65 }}>
                    Only deduct short-term debts due within the year. Long-term mortgage balances are generally not fully deductible — consult a scholar.
                  </div>
                  {Object.entries(liabilities).map(([key, l]) => (
                    <div key={key} className="zasset-row">
                      <div className="zasset-label">{l.label}</div>
                      <div className="ziw">
                        <span className="zipfx">{sym}</span>
                        <input
                          type="number" min="0"
                          value={l.value}
                          onChange={e => updateLiability(key, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: Results */}
              <div className="zcard zanim zd3">
                <div className="zcard-title">
                  Your Zakat
                  <span className="zcard-title-line" />
                </div>

                <div className="ztabs">
                  {[["summary", "Summary"], ["breakdown", "Breakdown"], ["chart", "Chart"]].map(([v, l]) => (
                    <button key={v} className={`ztab ${activeTab === v ? "zactive" : ""}`} onClick={() => setActiveTab(v)}>{l}</button>
                  ))}
                </div>

                {activeTab === "summary" && (
                  <>
                    <div className={`znisab-status ${!calc.priceEntered ? "zpending" : calc.aboveNisab ? "zabove" : "zbelow"}`}>
                      <span style={{ fontSize: "1.1rem" }}>{!calc.priceEntered ? "!" : calc.aboveNisab ? "✓" : "✗"}</span>
                      <span>
                        {!calc.priceEntered
                          ? `Enter today's ${nisabBasis} price per gram above to check your net wealth of ${sym}${fmt(calc.netZakatableWealth)} against the nisab.`
                          : calc.aboveNisab
                          ? `Your net wealth of ${sym}${fmt(calc.netZakatableWealth)} exceeds the nisab threshold of ${sym}${fmt(calc.nisabValue)}. Zakat is obligatory.`
                          : `Your net wealth of ${sym}${fmt(calc.netZakatableWealth)} is below the nisab threshold of ${sym}${fmt(calc.nisabValue)}. No zakat is due.`}
                      </span>
                    </div>
                    <div className="zresult-hero">
                      <div className="zresult-lbl">{calc.priceEntered ? "Total Zakat Due (2.5%)" : "Zakat if Above Nisab (2.5%)"}</div>
                      <div className="zresult-amt">{sym}{fmt(calc.priceEntered ? calc.zakatDue : calc.zakatIfDue)}</div>
                      <div className="zresult-sub">
                        {!calc.priceEntered
                          ? "Enter a gold or silver price to confirm whether zakat is due"
                          : calc.aboveNisab
                          ? `On ${sym}${fmt(calc.netZakatableWealth)} net zakatable wealth`
                          : "Below nisab — no zakat due this year"}
                      </div>
                    </div>
                    <div className="zmetric-grid">
                      <div className="zmetric">
                        <div className="zmetric-lbl">Total Assets</div>
                        <div className="zmetric-val" style={{ fontSize: "1.1rem" }}>{sym}{fmt(calc.totalAssets)}</div>
                      </div>
                      <div className="zmetric">
                        <div className="zmetric-lbl">Total Liabilities</div>
                        <div className="zmetric-val" style={{ fontSize: "1.1rem" }}>{sym}{fmt(calc.totalLiabilities)}</div>
                      </div>
                      <div className="zmetric">
                        <div className="zmetric-lbl">Net Zakatable</div>
                        <div className="zmetric-val" style={{ fontSize: "1.1rem" }}>{sym}{fmt(calc.netZakatableWealth)}</div>
                      </div>
                      <div className="zmetric">
                        <div className="zmetric-lbl">Nisab ({nisabBasis})</div>
                        <div className="zmetric-val" style={{ fontSize: "1.1rem" }}>{calc.priceEntered ? `${sym}${fmt(calc.nisabValue)}` : "—"}</div>
                      </div>
                    </div>
                    <div className="zdisclaimer" style={{ marginBottom: 0 }}>
                      <strong>Always verify</strong> your calculation with a qualified Islamic scholar, especially for complex assets like business equity, pensions, or jointly-owned property.
                    </div>
                  </>
                )}

                {activeTab === "breakdown" && (
                  <div>
                    {calc.assetBreakdown.length === 0 ? (
                      <p style={{ color: "var(--muted)", fontSize: "0.87rem", textAlign: "center", padding: "40px 0" }}>Enter asset values to see breakdown.</p>
                    ) : (
                      <div>
                        {calc.assetBreakdown.map((a, i) => (
                          <div key={a.key} style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "12px 0", borderBottom: "1px solid var(--border)",
                            fontSize: "0.87rem",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: ASSET_COLORS[i % ASSET_COLORS.length], flexShrink: 0, display: "inline-block" }} />
                              <span style={{ color: "var(--text)" }}>{a.name}</span>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ color: "var(--muted2)", fontFamily: "var(--font-m)" }}>{sym}{fmt(a.value)}</div>
                              <div style={{ color: "var(--gold)", fontSize: "0.78rem", fontFamily: "var(--font-m)" }}>
                                Zakat: {sym}{fmt(a.zakat)}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", fontWeight: 700 }}>
                          <span style={{ color: "var(--white)", fontFamily: "var(--font-d)", fontSize: "1.05rem" }}>Total Zakat Due</span>
                          <span style={{ color: "var(--gold)", fontFamily: "var(--font-m)", fontSize: "1.05rem" }}>{sym}{fmt(calc.priceEntered ? calc.zakatDue : calc.zakatIfDue)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "chart" && (
                  <div>
                    {calc.assetBreakdown.length === 0 ? (
                      <p style={{ color: "var(--muted)", fontSize: "0.87rem", textAlign: "center", padding: "40px 0" }}>Enter asset values to see chart.</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                          <Pie
                            data={calc.assetBreakdown}
                            dataKey="value"
                            nameKey="name"
                            cx="50%" cy="50%"
                            outerRadius={100}
                            innerRadius={55}
                            paddingAngle={2}
                          >
                            {calc.assetBreakdown.map((_, i) => (
                              <Cell key={i} fill={ASSET_COLORS[i % ASSET_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomPieTooltip currency={currency} />} />
                          <Legend
                            iconType="circle" iconSize={8}
                            wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-b)", color: "var(--muted2)" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── WHAT IS ZAKAT ── */}
          <section className="zsection" id="what-is">
            <div className="zsec-badge">The Foundation</div>
            <h2 className="zsec-title">What Is Zakat &amp; <em>Who Must Pay It?</em></h2>
            <div className="zornament"><div className="zornament-line" /><div className="zornament-diamond" /><div className="zornament-line" /></div>
            <div className="ztwo-col">
              <div className="zcbody">
                <p>
                  Zakat (زكاة) is one of the Five Pillars of Islam — an obligatory act of worship and a precise financial obligation incumbent upon every Muslim who possesses wealth above the nisab threshold for a complete lunar year. The word itself means both "purification" and "growth": purification of the soul from attachment to worldly wealth, and growth through the blessing that comes from giving.
                </p>
                <p>
                  Unlike voluntary charity (sadaqah), <strong>zakat al-mal</strong> — zakat on wealth — is not optional. It is a fixed right that the poor have upon the wealthy, ordained in the Quran and elaborated in the Sunnah. Scholars throughout Islamic history have developed detailed jurisprudence around exactly which assets are zakatable, at what valuation, and when payment is due.
                </p>
                <p>
                  For Muslims today — whether salaried professionals, business owners, investors, or landlords — understanding <strong>how to calculate zakat</strong> accurately is both a religious obligation and a practical challenge. Wealth takes many modern forms: stock portfolios, savings accounts, business inventory, cryptocurrency, pension funds, and rental income — none of which have a neat analog in classical fiqh texts. This is why a reliable <strong>zakat calculator online</strong> grounded in scholarly consensus is so important for everyday Muslims trying to fulfill this pillar correctly.
                </p>
                <h3>The Conditions for Zakat to Be Obligatory</h3>
                <p>
                  Four conditions must all be met before zakat becomes obligatory on a specific asset or person:
                </p>
                <p>
                  <strong>1. Muslim ownership.</strong> Zakat applies only to Muslims. Non-Muslims have no zakat obligation.
                </p>
                <p>
                  <strong>2. Nisab.</strong> The total zakatable wealth must reach or exceed the nisab threshold — the minimum amount of wealth above which zakat becomes due. The nisab is defined as the value of 20 mithqal of gold or 200 dirhams of silver — 85 grams of gold or 595 grams of silver in a common conversion (some bodies use 87.48 g and 612.36 g). Because gold and silver prices fluctuate, the <strong>zakat nisab</strong> changes daily — which is why this calculator asks you for today&apos;s price instead of storing a fixed amount.
                </p>
                <p>
                  <strong>3. Hawl (one lunar year).</strong> The wealth must have been in the owner's possession for a complete Islamic lunar year (approximately 354 days). Wealth acquired mid-year is included in the calculation if it exists at the end of the hawl, but the hawl date is determined by when the wealth first reached nisab.
                </p>
                <p>
                  <strong>4. Growth potential (nama).</strong> Classical scholars required that zakatable assets have the potential for growth — either actual productive assets or liquid assets capable of being invested. Fixed assets used personally, such as a family home, a personal vehicle, or household furniture, are not zakatable.
                </p>
              </div>
              <div>
                <div className="zthree-col" style={{ gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 0 }}>
                  {[
                    { icon: <Building2 className="w-6 h-6 text-[#c9a84c]" />, title: "Fifth Pillar of Faith", body: "Zakat is not a tax or charitable donation — it is a pillar of Islamic worship, as fundamental as Salah and Sawm." },
                    { icon: <Scale className="w-6 h-6 text-[#c9a84c]" />, title: "Precise Rate: 2.5%", body: "The zakat percentage rate on most forms of wealth (gold, silver, cash, trade goods) is fixed at 2.5% — one-fortieth of net zakatable wealth." },
                    { icon: <CalendarDays className="w-6 h-6 text-[#c9a84c]" />, title: "Annual Obligation", body: "Zakat is due once per lunar year on wealth that has been held above nisab for the full hawl period." },
                    { icon: <Globe className="w-6 h-6 text-[#c9a84c]" />, title: "Eight Categories of Recipients", body: "The Quran specifies eight categories of valid zakat recipients (asnaf), from the poor and destitute to those burdened by debt." },
                  ].map(c => (
                    <div className="zicard" key={c.title}>
                      <span className="zicard-icon">{c.icon}</span>
                      <h4>{c.title}</h4>
                      <p>{c.body}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: "var(--gold-faint)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 12, padding: "20px", marginTop: 14 }}>
                  <p style={{ fontFamily: "var(--font-d)", fontSize: "1.15rem", fontStyle: "italic", color: "var(--gold2)", lineHeight: 1.6, marginBottom: 8 }}>
                    "Take from their wealth a charity by which you purify them and cause them increase."
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "var(--font-b)" }}>— Quran, At-Tawbah 9:103</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── NISAB SECTION ── */}
          <section className="zsection" id="nisab">
            <div className="zsec-badge">Nisab Threshold</div>
            <h2 className="zsec-title">Understanding the <em>Zakat Nisab Today</em></h2>
            <p className="zsec-lead">
              The nisab is the minimum wealth threshold above which zakat becomes obligatory. It was defined by the Prophet ﷺ in weight of gold and silver — and must be recalculated regularly as spot prices change.
            </p>
            <div className="ztwo-col">
              <div className="zcbody">
                <p>
                  The Prophet Muhammad ﷺ established two parallel nisab thresholds: 20 mithqal of gold and 200 dirhams of silver. Converted to modern weights these are usually given as <strong>85 grams of gold</strong> and <strong>595 grams of silver</strong>; some institutions, such as the UK&apos;s National Zakat Foundation, use a slightly different conversion of 87.48 g and 612.36 g. The calculator lets you choose either standard — the difference is about 3%.
                </p>
                <p>
                  Historically, both thresholds produced roughly similar monetary values because the gold-to-silver exchange ratio was relatively stable. In modern times, gold has appreciated dramatically relative to silver, meaning the <strong>gold nisab threshold</strong> is many times higher than the <strong>silver nisab threshold</strong>. For example, using round illustrative prices (not today&apos;s prices) of $100/gram for gold and $1.25/gram for silver with the 85 g / 595 g standard:
                </p>
                <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 10, padding: "16px 18px", fontFamily: "var(--font-m)", fontSize: "0.83rem", color: "var(--muted2)", lineHeight: 2, margin: "16px 0" }}>
                  <span style={{ color: "var(--gold)" }}>Gold Nisab</span>  = 85g × $100 = <span style={{ color: "var(--white)", fontWeight: 700 }}>$8,500.00</span><br />
                  <span style={{ color: "var(--muted)" }}>Silver Nisab</span> = 595g × $1.25 = <span style={{ color: "var(--white)", fontWeight: 700 }}>$743.75</span>
                </div>
                <p>
                  This gap means that using the silver nisab standard makes many more people eligible to pay zakat — and eligible to pay a larger amount. Scholars differ on which to use. Many contemporary scholars and zakat organizations recommend the silver nisab when your wealth is a mix of cash and other assets, precisely because it extends the obligation to a broader population and benefits more recipients; if your only zakatable asset is gold, the gold nisab applies. Others use the gold nisab for all wealth. Consult your local imam or zakat institution for the ruling in your community.
                </p>
                <h3>Does the Nisab Have to Be Held for a Full Year?</h3>
                <p>
                  Yes — the hawl (lunar year) requirement means that wealth must consistently meet or exceed the nisab throughout the year for zakat to be due. If your wealth dips below nisab during the year and then rises again, the hawl clock resets from the point it returned to nisab. However, many scholars hold that fluctuations in asset value within the year do not invalidate the hawl, provided nisab was met at the beginning and end of the hawl period.
                </p>
              </div>
              <div className="zcbody">
                <h3>Gold Nisab vs. Silver Nisab — Which Should You Use?</h3>
                <p>
                  The difference in practical outcomes is significant. Because the gold nisab is many times the silver nisab, many middle-income Muslims fall below the gold threshold but above the silver one. With the silver nisab, almost any Muslim with regular savings will be above nisab. Enter today&apos;s prices in the calculator to see both thresholds in your currency.
                </p>
                <p>
                  The scholarly reasoning for each position is well-developed. Proponents of the gold nisab argue that gold is the more enduring store of value and was the primary monetary standard in Islamic history, and that applying the silver nisab today produces a threshold far lower than the Prophet ﷺ intended in real-wealth terms. Proponents of the silver nisab counter that the silver standard ensures a wider net of zakat payers, which aligns with the social redistribution function of zakat, and that choosing gold nisab primarily to reduce one's obligation is a problematic motivation.
                </p>
                <p>
                  Our <strong>zakat calculator online</strong> allows you to switch between both bases instantly so you can see the difference and make an informed decision in consultation with your scholar.
                </p>
                <h3>When Is Zakat Due?</h3>
                <p>
                  <strong>When is zakat due?</strong> Zakat becomes due when your wealth has been above nisab for one complete lunar year (hawl). The hawl date is personal — it is one year from the date your wealth first reached nisab, not necessarily the beginning of Ramadan (though many Muslims choose to pay in Ramadan for the increased reward). You can pay zakat early (before the hawl is complete) as a precaution, but you cannot delay it beyond the hawl date without sin. Many Muslims set a fixed annual date — often the first of Ramadan or a date corresponding to when they first became liable — and calculate their zakat from that point each year.
                </p>
              </div>
            </div>
          </section>

          {/* ── ZAKATABLE ASSETS TABLE ── */}
          <section className="zsection" id="assets">
            <div className="zsec-badge">Asset Guide</div>
            <h2 className="zsec-title">What Is <em>Zakatable?</em> — Complete Asset Reference</h2>
            <p className="zsec-lead">
              A comprehensive reference for common asset types, whether they are zakatable, and at what value — covering everything from how to calculate zakat on gold to zakat on salary, business inventory, and investments.
            </p>
            <div className="ztbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Asset Type</th>
                    <th>Zakatable?</th>
                    <th>Rate</th>
                    <th>Valuation Basis</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Cash (wallet, home)", "Yes", "2.5%", "Face value", "Include all physical cash held"],
                    ["Bank savings accounts", "Yes", "2.5%", "Full balance on hawl date", "Zakat on cash and bank balance includes savings and current accounts"],
                    ["Gold jewelry (unworn)", "Yes", "2.5%", "Current market value", "How to calculate zakat on gold: weight × spot price × 2.5%"],
                    ["Gold jewelry (regularly worn)", "Disputed", "—", "Consult scholar", "Hanafi: zakatable. Shafi'i/Hanbali/Maliki: generally exempt"],
                    ["Silver", "Yes", "2.5%", "Current market value", "Same nisab-setting role as gold; zakatable at market value"],
                    ["Stocks & shares", "Yes (net)", "2.5%", "Zakatable assets of company × ownership %", "Zakat on investments: use fund-level zakatable assets where possible"],
                    ["Business inventory", "Yes", "2.5%", "Market value at hawl", "Zakat on business inventory: goods held for sale, not fixed assets or equipment"],
                    ["Money owed to you", "Yes (recoverable)", "2.5%", "Amount you expect to receive", "Doubtful debts may be deferred until received"],
                    ["Salary / income", "Yes (saved portion)", "2.5%", "Amount remaining on hawl date", "Zakat on salary calculator: zakat is on savings, not gross income"],
                    ["Rental income", "Yes (saved portion)", "2.5%", "Saved balance on hawl date", "The rental property itself is not zakatable — only the income saved"],
                    ["Pension / 401k", "Yes (accessible funds)", "2.5%", "Accessible value", "Inaccessible locked-in pension may be deferred; consult scholar"],
                    ["Cryptocurrency", "Yes (majority view)", "2.5%", "Market value on hawl date", "Treated similarly to trade goods; volatile — price on hawl date applies"],
                    ["Primary residence", "No", "—", "—", "Personal-use property is not zakatable"],
                    ["Personal vehicle", "No", "—", "—", "Vehicles used personally are not trade goods"],
                    ["Business equipment", "No", "—", "—", "Fixed assets used in production are not zakatable"],
                    ["Agricultural produce", "Varies", "5–10%", "Value of produce", "Zakat al-zuru': separate rules based on irrigation method"],
                    ["Livestock", "Yes (if above nisab)", "Varies", "Head count", "Specific rules in classical fiqh by animal type and count"],
                  ].map(([asset, z, r, v, n]) => (
                    <tr key={asset}>
                      <td>{asset}</td>
                      <td className={z === "Yes" ? "ztd-yes" : z === "No" ? "ztd-no" : "ztd-cond"}>{z}</td>
                      <td className="ztd-gold">{r}</td>
                      <td>{v}</td>
                      <td style={{ fontSize: "0.81rem" }}>{n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── CALCULATION METHOD ── */}
          <section className="zsection" id="method">
            <div className="zsec-badge">Zakat Calculation Method</div>
            <h2 className="zsec-title">How to Calculate Zakat <em>Step by Step</em></h2>
            <p className="zsec-lead">
              The standard zakat calculation method used by most scholars and zakat institutions follows a straightforward six-step process. Here is how to do it — whether manually or using this zakat al-mal calculator.
            </p>
            <div className="ztwo-col">
              <div>
                <ol className="zsteps">
                  {[
                    { title: "Set Your Hawl Date", body: "Identify when your wealth first reached or exceeded the nisab threshold. This is your personal annual zakat date. All assets are valued as of this date each year." },
                    { title: "List All Zakatable Assets", body: "Include cash, bank balances (savings and current), gold and silver at market value, trade inventory, receivables, and investments. Use the asset table above and our zakat calculator for working professionals for detailed guidance on each category." },
                    { title: "Deduct Zakatable Liabilities", body: "Subtract short-term debts due within the year: personal loans, credit card balances, bills due, or money owed to others. Most scholars agree that only debts currently due (not long-term mortgages in full) are deductible." },
                    { title: "Check Against the Nisab Threshold", body: "Calculate your net zakatable wealth (assets minus deductible liabilities). Compare this to the current nisab — either gold or silver basis, per your school of thought. If below nisab, no zakat is due. If at or above nisab, proceed." },
                    { title: "Apply the Zakat Percentage Rate", body: "The zakat percentage rate for zakat al-mal is 2.5% (one-fortieth). Multiply your net zakatable wealth by 0.025. This is the amount of zakat you owe. Our zakat on savings calculator does this automatically." },
                    { title: "Pay Promptly to Eligible Recipients", body: "Distribute to one or more of the eight categories of zakat recipients (asnaf) specified in At-Tawbah 9:60, either directly or through a trusted zakat institution. Payment should ideally be made at the hawl date or as soon as possible afterward." },
                  ].map((s, i) => (
                    <li key={i} className="zstep">
                      <span className="zstep-num">{i + 1}</span>
                      <div><h4>{s.title}</h4><p>{s.body}</p></div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="zcbody">
                <h3>Zakat on Salary — A Practical Example for Working Professionals</h3>
                <p>
                  <strong>Zakat on salary</strong> is one of the most common questions for zakat for working professionals. The key principle: zakat is levied on wealth, not income. Your salary is not directly zakatable — what matters is how much of it you have saved and held above nisab for a complete hawl.
                </p>
                <p>
                  Here is a practical example. Say you earn $6,000/month and your hawl date is 1 Ramadan. On 1 Ramadan, you check your total savings and cash balance — say it is $18,000. You also have $5,000 in stocks. Your gold jewelry (unworn) is worth $2,000. Total assets: $25,000. You have a credit card balance due of $1,200.
                </p>
                <p>
                  Net zakatable wealth: $25,000 − $1,200 = $23,800. If this exceeds your nisab threshold (it does at either gold or silver basis in most currencies), zakat is due: $23,800 × 2.5% = <strong>$595</strong>.
                </p>
                <p>
                  Notice that you do not calculate zakat on your monthly income — you calculate it on what you have saved. A <strong>zakat on salary calculator</strong> is essentially a net worth calculation on a specific date, not an income tax.
                </p>
                <h3>Zakat on Business Inventory</h3>
                <p>
                  <strong>Zakat on business inventory</strong> applies to goods held for sale — physical stock, raw materials intended for resale, and work-in-progress. The value used is the market value of the inventory at the hawl date. Fixed assets — machinery, office equipment, the business premises — are not zakatable. Receivables (money owed to the business) are zakatable if recoverable.
                </p>
                <p>
                  For a small business owner, the zakatable asset calculation is: Trade inventory at market value + Cash in business accounts + Business receivables − Business debts due = Net zakatable business wealth. Add this to your personal zakatable assets before applying the 2.5% rate.
                </p>
                <h3>Zakat on Investments and Stocks</h3>
                <p>
                  <strong>Zakat on investments</strong> in stocks and funds is calculated based on the underlying zakatable assets of the company, not simply the market price of the share. The purist method is to determine what percentage of the company's assets are zakatable (cash, receivables, inventory) and apply your ownership percentage. Shares bought to trade in the short term are treated like trade goods, so zakat is due on their full market value. For long-term holdings, some zakat institutions accept a simplified proxy percentage of market value when company accounts are not practical to analyse — follow the method of the scholar or zakat institution you rely on.
                </p>
                <p>
                  For pension funds and 401(k) accounts, scholars differ on whether inaccessible locked-in funds are zakatable. Many contemporary scholars hold that you should pay zakat on accessible pension balances and defer on genuinely inaccessible funds until withdrawal, at which point zakat becomes due.
                </p>
                <h3>How Much Zakat to Pay — Common Scenarios</h3>
                <p>
                  <strong>How much zakat to pay</strong> is determined entirely by your net zakatable wealth on your hawl date. There is no minimum payment, no sliding scale, and no maximum cap. The calculation is always 2.5% of net zakatable wealth above nisab — whether your zakatable wealth is $10,000 or $10,000,000. This flat-rate structure is part of what makes the zakat calculation method so elegant and universally applicable.
                </p>
              </div>
            </div>
          </section>

          {/* ── RECIPIENTS ── */}
          <section className="zsection" id="recipients">
            <div className="zsec-badge">The Eight Asnaf</div>
            <h2 className="zsec-title">Who Can <em>Receive Zakat?</em></h2>
            <p className="zsec-lead">
              The Quran specifies eight categories of eligible zakat recipients in Surah At-Tawbah (9:60). Zakat must go to at least one of these categories to be valid.
            </p>
            <div className="zthree-col">
              {[
                { icon: <HandHeart className="w-6 h-6 text-[#c9a84c]" />, title: "Al-Fuqara (The Poor)", body: "Those who have no or very little wealth and cannot meet their basic needs — below subsistence level." },
                { icon: <Home className="w-6 h-6 text-[#c9a84c]" />, title: "Al-Masakin (The Needy)", body: "Those who have some income or resources but insufficient to cover their essential needs." },
                { icon: <ClipboardList className="w-6 h-6 text-[#c9a84c]" />, title: "Amil Al-Zakat (Zakat Administrators)", body: "Those appointed to collect, manage, and distribute zakat. Zakat institutions qualify under this category." },
                { icon: <HeartHandshake className="w-6 h-6 text-[#c9a84c]" />, title: "Al-Mu'allafatu Qulubuhum (New Muslims)", body: "Those whose hearts are being reconciled to Islam, including recent converts who may need support." },
                { icon: <Link className="w-6 h-6 text-[#c9a84c]" />, title: "Fi Al-Riqab (Freeing Captives)", body: "Historically: freeing slaves. Contemporary scholars extend this to helping free those in modern forms of bondage or exploitation." },
                { icon: <Banknote className="w-6 h-6 text-[#c9a84c]" />, title: "Al-Gharimun (Those in Debt)", body: "Muslims burdened by debt incurred for legitimate needs and unable to repay — not debts from sin or excess." },
                { icon: <ShieldCheck className="w-6 h-6 text-[#c9a84c]" />, title: "Fi Sabilillah (For Allah's Cause)", body: "Efforts in the way of Allah — historically defense of the Muslim community. Many scholars extend to Islamic education and da'wah." },
                { icon: <Plane className="w-6 h-6 text-[#c9a84c]" />, title: "Ibn Al-Sabil (Wayfarers)", body: "Travelers who are stranded and without resources, even if they are wealthy in their home country." },
              ].map(c => (
                <div className="zicard" key={c.title}>
                  <span className="zicard-icon">{c.icon}</span>
                  <h4>{c.title}</h4>
                  <p>{c.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="zsection" id="faq">
            <div className="zsec-badge">FAQ</div>
            <h2 className="zsec-title">Frequently Asked <em>Questions</em></h2>
            <div className="zornament" style={{ marginBottom: 24 }}><div className="zornament-line" /><div className="zornament-diamond" /><div className="zornament-line" /></div>
            <div style={{ maxWidth: 800 }}>
              {[
                {
                  q: "How do I calculate zakat on gold?",
                  a: "To calculate zakat on gold, multiply the total weight of your gold (in grams) by the current market price per gram to get the market value. Then multiply that value by 2.5%. For example, with an illustrative price of $100/g: 100g of gold × $100/g = $10,000 value. Zakat = $10,000 × 2.5% = $250. Use today's price for your own calculation. Note that some scholars exempt gold jewelry that is regularly worn — consult your scholar on this point. Our zakat calculator handles this automatically once you enter the market value of your gold."
                },
                {
                  q: "What is the zakat nisab today?",
                  a: "The nisab is the value of 85 grams of gold or 595 grams of silver (87.48 g and 612.36 g under another common conversion), so its cash amount changes every day with metal prices. Multiply today's price per gram in your currency by the weight: gold nisab = 85 × gold price; silver nisab = 595 × silver price. Some zakat bodies, such as the UK's National Zakat Foundation, publish nisab values updated daily. Enter today's prices in the calculator above to get the nisab in your currency."
                },
                {
                  q: "Do I pay zakat on my salary every month?",
                  a: "No — zakat is not a monthly deduction on your salary. Zakat on salary is calculated on your total savings and zakatable assets once per year on your hawl date. Your salary is income; what matters for zakat is what you have saved and held above nisab for a complete lunar year. Use the zakat on savings calculator to enter your total bank and cash balance on your hawl date as part of your total zakatable assets."
                },
                {
                  q: "Can I deduct my mortgage from my zakat calculation?",
                  a: "The majority scholarly opinion is that you cannot deduct the full outstanding mortgage balance from your zakatable wealth. You may only deduct debts that are currently due — typically monthly installments rather than the total remaining balance. Some scholars allow deducting one year's worth of mortgage payments. Consult a qualified Islamic finance scholar for guidance specific to your situation, as this is an area of ongoing scholarly discussion."
                },
                {
                  q: "Is zakat due on cryptocurrency?",
                  a: "The majority contemporary view is that cryptocurrency is zakatable as a form of wealth with monetary value, similar to trade goods. Zakat is calculated at 2.5% of the market value of your cryptocurrency holdings on your hawl date. The volatile nature of crypto means the value on your specific hawl date applies, not an average. Some scholars advise caution given the speculative nature and potential for illicit transactions in some crypto assets — verify the permissibility of your specific holdings with a scholar."
                },
                {
                  q: "What is the difference between zakat al-mal and zakat al-fitr?",
                  a: "Zakat al-mal is the annual wealth zakat calculated by this calculator — 2.5% of net zakatable wealth above nisab. Zakat al-fitr (or sadaqah al-fitr) is a separate obligation due at the end of Ramadan, before Eid al-Fitr prayer. It is a fixed per-person amount (approximately the value of 2–3 kg of staple food per family member), mandatory for every Muslim who has food in excess of their daily needs. It is not calculated as a percentage of wealth and is entirely separate from zakat al-mal."
                },
                {
                  q: "How do I calculate zakat on business inventory?",
                  a: "Zakat on business inventory is calculated on the market value of goods held for sale at your hawl date — not cost price, not projected future value. Add: (1) trade stock at market value, (2) cash in business accounts, (3) recoverable receivables. Deduct: (4) business debts currently due. Multiply the net by 2.5%. Fixed assets like machinery, vehicles, and equipment used in the business are not zakatable."
                },
                {
                  q: "Can I pay zakat to my own family members?",
                  a: "You cannot pay zakat to those you are legally obligated to support — your spouse, children, or parents (in most scholarly views). However, you may give zakat to other relatives who qualify: siblings, aunts, uncles, cousins, or extended family who are among the eligible asnaf. Giving to deserving relatives who you are not legally required to maintain is actually considered particularly praiseworthy as it combines the reward of zakat with the reward of maintaining family ties."
                },
              ].map(item => (
                <div key={item.q} className="zfaq-item">
                  <p className="zfaq-q">{item.q}</p>
                  <p className="zfaq-a">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <div className="zcta">
            <h2>May Allah Accept Your Zakat</h2>
            <p>Scroll up, enter your assets and liabilities — your calculation is ready instantly.</p>
            <a href="#calculator" className="zbtn zbtn-gold">Calculate My Zakat ↑</a>
          </div>

          <footer className="zfooter">
            <p style={{ marginBottom: 6 }}>
              This zakat calculator is provided for educational guidance. Always verify your calculation with a qualified Islamic scholar or certified zakat institution. Nisab values are calculated from the gold and silver prices you enter — use today&apos;s prices for accuracy.
            </p>
            <p>
              <a href="#calculator">Calculator</a> · <a href="#nisab">Nisab</a> · <a href="#assets">Asset Guide</a> · <a href="#method">Method</a> · <a href="#recipients">Recipients</a> · <a href="#faq">FAQ</a>
            </p>
          </footer>

        </div>
      </div>
    </>
  );
}
