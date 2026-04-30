"use client";

import { useState, useMemo, useCallback } from "react";
import { 
  Calculator, 
  Users, 
  RefreshCcw, 
  BarChart3, 
  BookOpen, 
  Plus, 
  X, 
  Minus,
  Utensils,
  Wine,
  Salad,
  Coffee,
  Bike,
  Pizza,
  Smartphone,
  Hotel,
  Briefcase,
  Car,
  Scissors,
  Sparkles,
  Palette,
  Package,
  Map,
  ChevronDown,
  ChevronUp,
  Star,
  Receipt
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = "calculator" | "split" | "converter" | "estimator" | "guide";

interface LineItem {
  id: string;
  name: string;
  price: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const QUICK_PCTS = [10, 15, 18, 20, 22, 25];

const TIP_PRESETS = [
  { service: "Fine Dining", icon: <Wine className="w-5 h-5" />, min: 18, typical: 20, great: 25, note: "For exceptional service, 25%+ is appreciated" },
  { service: "Casual Restaurant", icon: <Utensils className="w-5 h-5" />, min: 15, typical: 18, great: 20, note: "Standard for sit-down service" },
  { service: "Buffet", icon: <Salad className="w-5 h-5" />, min: 5, typical: 10, great: 15, note: "For drink refills and clearing plates" },
  { service: "Bar / Cocktails", icon: <Wine className="w-5 h-5" />, min: 15, typical: 18, great: 20, note: "$1–2 per drink is also common" },
  { service: "Coffee Shop", icon: <Coffee className="w-5 h-5" />, min: 0, typical: 10, great: 15, note: "Optional for counter service" },
  { service: "Food Delivery", icon: <Bike className="w-5 h-5" />, min: 10, typical: 15, great: 20, note: "15–20% for long distances or bad weather" },
  { service: "Pizza Delivery", icon: <Pizza className="w-5 h-5" />, min: 3, typical: 5, great: 10, note: "$3–5 minimum regardless of order size" },
  { service: "Uber Eats / DoorDash", icon: <Smartphone className="w-5 h-5" />, min: 10, typical: 15, great: 20, note: "Driver keeps 100% of tip" },
  { service: "Hotel Housekeeping", icon: <Hotel className="w-5 h-5" />, min: 2, typical: 5, great: 10, note: "$2–5 per night, daily is preferred" },
  { service: "Hotel Bellhop", icon: <Briefcase className="w-5 h-5" />, min: 2, typical: 3, great: 5, note: "$1–2 per bag carried" },
  { service: "Taxi / Rideshare", icon: <Car className="w-5 h-5" />, min: 10, typical: 15, great: 20, note: "Round up for short rides" },
  { service: "Hair Salon", icon: <Scissors className="w-5 h-5" />, min: 15, typical: 18, great: 20, note: "Also tip shampoo assistant $3–5" },
  { service: "Spa / Massage", icon: <Sparkles className="w-5 h-5" />, min: 15, typical: 18, great: 20, note: "At upscale spas, 20% is standard" },
  { service: "Tattoo Artist", icon: <Palette className="w-5 h-5" />, min: 15, typical: 20, great: 25, note: "For custom work, tip generously" },
  { service: "Movers", icon: <Package className="w-5 h-5" />, min: 5, typical: 10, great: 20, note: "$20–50 per mover for a full-day move" },
  { service: "Tour Guide", icon: <Map className="w-5 h-5" />, min: 10, typical: 15, great: 20, note: "For private tours, 20%+ is gracious" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(v: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(v);
}

function fmtPct(v: number): string {
  return v % 1 === 0 ? v + "%" : v.toFixed(1) + "%";
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TipCalculatorClient() {
  const [tab, setTab] = useState<TabId>("calculator");

  // ── Calculator state ──
  const [billAmt, setBillAmt] = useState("85.00");
  const [tipPct, setTipPct] = useState(18);
  const [customPct, setCustomPct] = useState("");
  const [people, setPeople] = useState(1);
  const [roundMode, setRoundMode] = useState<"none" | "tip" | "total" | "person">("none");

  // ── Split state ──
  const [splitBill, setSplitBill] = useState("200.00");
  const [splitTipPct, setSplitTipPct] = useState(18);
  const [splitPeople, setSplitPeople] = useState(4);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", name: "Alice", price: "42.50" },
    { id: "2", name: "Bob", price: "38.00" },
    { id: "3", name: "Carol", price: "55.00" },
    { id: "4", name: "David", price: "64.50" },
  ]);
  const [splitMode, setSplitMode] = useState<"equal" | "itemized">("equal");

  // ── Converter state ──
  const [convBill, setConvBill] = useState("100.00");
  const [convInput, setConvInput] = useState("18.00");
  const [convType, setConvType] = useState<"pctToAmt" | "amtToPct">("pctToAmt");

  // ── Calculator logic ──
  const activePct = customPct !== "" ? parseFloat(customPct) || 0 : tipPct;
  const bill = parseFloat(billAmt) || 0;
  const tipAmt = bill * (activePct / 100);
  const total = bill + tipAmt;
  const perPerson = people > 0 ? total / people : total;
  const tipPerPerson = people > 0 ? tipAmt / people : tipAmt;

  const roundedResults = useMemo(() => {
    if (roundMode === "none") return null;
    if (roundMode === "tip") {
      const roundedTip = Math.ceil(tipAmt);
      const roundedTotal = bill + roundedTip;
      return { tip: roundedTip, total: roundedTotal, perPerson: roundedTotal / people, tipPerPerson: roundedTip / people };
    }
    if (roundMode === "total") {
      const roundedTotal = Math.ceil(total);
      const roundedTip = roundedTotal - bill;
      return { tip: roundedTip, total: roundedTotal, perPerson: roundedTotal / people, tipPerPerson: roundedTip / people };
    }
    if (roundMode === "person") {
      const roundedPP = Math.ceil(perPerson);
      const roundedTotal = roundedPP * people;
      const roundedTip = roundedTotal - bill;
      return { tip: roundedTip, total: roundedTotal, perPerson: roundedPP, tipPerPerson: roundedTip / people };
    }
    return null;
  }, [roundMode, tipAmt, bill, total, people, perPerson]);

  const displayTip = roundedResults?.tip ?? tipAmt;
  const displayTotal = roundedResults?.total ?? total;
  const displayPerPerson = roundedResults?.perPerson ?? perPerson;
  const displayTipPerPerson = roundedResults?.tipPerPerson ?? tipPerPerson;
  const effectivePct = bill > 0 ? (displayTip / bill) * 100 : activePct;

  // ── Split logic ──
  const splitBillNum = parseFloat(splitBill) || 0;
  const splitTipAmt = splitBillNum * (splitTipPct / 100);
  const splitTotal = splitBillNum + splitTipAmt;
  const perPersonSplit = splitPeople > 0 ? splitTotal / splitPeople : splitTotal;
  const tipPerPersonSplit = splitPeople > 0 ? splitTipAmt / splitPeople : splitTipAmt;

  const lineItemsTotal = lineItems.reduce((s, i) => s + (parseFloat(i.price) || 0), 0);
  const itemizedResults = lineItems.map(item => {
    const itemPrice = parseFloat(item.price) || 0;
    const share = lineItemsTotal > 0 ? itemPrice / lineItemsTotal : 0;
    const itemTip = splitTipAmt * share;
    return { ...item, price: itemPrice, tip: itemTip, total: itemPrice + itemTip };
  });

  // ── Converter logic ──
  const convBillNum = parseFloat(convBill) || 0;
  const convInputNum = parseFloat(convInput) || 0;
  const convResult = convType === "pctToAmt"
    ? { label: "Tip Amount", value: convBillNum * (convInputNum / 100), secondary: `Effective: ${fmtPct(convInputNum)}` }
    : { label: "Tip Percentage", value: convBillNum > 0 ? (convInputNum / convBillNum) * 100 : 0, secondary: `Tip: ${fmt(convInputNum)}`, isPct: true };

  const addLineItem = useCallback(() => {
    setLineItems(p => [...p, { id: crypto.randomUUID(), name: `Person ${p.length + 1}`, price: "0.00" }]);
  }, []);

  const removeLineItem = useCallback((id: string) => {
    setLineItems(p => p.filter(i => i.id !== id));
  }, []);

  const updateLineItem = useCallback((id: string, field: "name" | "price", val: string) => {
    setLineItems(p => p.map(i => i.id === id ? { ...i, [field]: val } : i));
  }, []);

  return (
    <>
      {/* JSON-LD Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Tip Calculator",
        url: "https://findbest.tools/finance/tip-calculator",
        description: "Free restaurant tip calculator with tip percentage calculator, bill splitter, tip converter, and tip estimator for every service type.",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "Restaurant tip calculator",
          "Tip percentage calculator",
          "Bill splitter for groups",
          "Tip converter (amount to percent and back)",
          "Tip estimator for 16 service types",
          "Rounding modes (round tip, total, or per person)",
          "Itemized bill split",
        ],
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "How do I calculate a tip?", acceptedAnswer: { "@type": "Answer", text: "The tip calculator formula is: Tip = Bill Amount × (Tip Percentage ÷ 100). For a $85 bill at 20%: $85 × 0.20 = $17 tip. Total = $85 + $17 = $102. Our calculator does this instantly for any amount and percentage." } },
          { "@type": "Question", name: "How much should I tip at a restaurant?", acceptedAnswer: { "@type": "Answer", text: "Standard restaurant tip percentages in the US: 15% for average service, 18% for good service, 20% for great service, 25%+ for exceptional service. For fine dining, 20% is now considered the floor. For buffets, 10% is standard." } },
          { "@type": "Question", name: "How do I split a bill with tip?", acceptedAnswer: { "@type": "Answer", text: "To split a bill with tip: Add the tip to the total bill first, then divide by the number of people. Example: $200 bill + 18% tip ($36) = $236 total ÷ 4 people = $59 per person. Use our bill splitter tab to calculate this automatically." } },
          { "@type": "Question", name: "What is the tip calculator formula?", acceptedAnswer: { "@type": "Answer", text: "Tip Amount = Bill × (Percentage ÷ 100). Total = Bill + Tip. Per Person = Total ÷ Number of People. Tip Percentage from Amount = (Tip Amount ÷ Bill) × 100." } },
          { "@type": "Question", name: "How do I convert a tip amount to a percentage?", acceptedAnswer: { "@type": "Answer", text: "Tip Percentage = (Tip Amount ÷ Pre-tax Bill) × 100. Example: $18 tip on a $90 bill = ($18 ÷ $90) × 100 = 20%. Use the Tip Converter tab above to convert between tip amounts and percentages instantly." } },
        ],
      })}} />

      <div className="tip-page">

        {/* ── Hero: receipt-style header ── */}
        <header className="tip-hero">
          <div className="tip-container">
            <nav className="tip-breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a><span>/</span>
              <a href="/finance">Finance</a><span>/</span>
              <span>Tip Calculator</span>
            </nav>

            <div className="tip-receipt-header">
              <div className="tip-receipt-top">
                <div className="tip-receipt-logo"><Star className="w-6 h-6 fill-amber-600 text-amber-600" /></div>
                <h1 className="tip-h1">Tip Calculator</h1>
                <p className="tip-h1-sub">Free · Easy · Instant</p>
              </div>
              <div className="tip-divider tip-divider--dash" />
              <div className="tip-hero-cols">
                <div className="tip-hero-tagline">
                  <p>The <strong>easiest tip calculator</strong> for restaurants, delivery, hotels and more. Calculate tip by percentage, split any bill, convert tip amounts — all free, no sign-up.</p>
                </div>
                <div className="tip-hero-facts">
                  <div className="tip-fact"><span className="tip-fact-n">15–20%</span><span className="tip-fact-l">Restaurant Tip</span></div>
                  <div className="tip-fact"><span className="tip-fact-n">18%</span><span className="tip-fact-l">US Average</span></div>
                  <div className="tip-fact"><span className="tip-fact-n">16+</span><span className="tip-fact-l">Service Types</span></div>
                </div>
              </div>
              <div className="tip-divider tip-divider--dash" />
            </div>
          </div>
        </header>

        <main className="tip-container tip-main">

          {/* ── Tabs ── */}
          <div className="tip-tabs" role="tablist">
            {([
              { id: "calculator", icon: <Receipt className="w-4 h-4" />, label: "Calculator" },
              { id: "split", icon: <Users className="w-4 h-4" />, label: "Bill Splitter" },
              { id: "converter", icon: <RefreshCcw className="w-4 h-4" />, label: "Tip Converter" },
              { id: "estimator", icon: <BarChart3 className="w-4 h-4" />, label: "Tip Estimator" },
              { id: "guide", icon: <BookOpen className="w-4 h-4" />, label: "Guide" },
            ] as { id: TabId; icon: React.ReactNode; label: string }[]).map(t => (
              <button key={t.id} role="tab" aria-selected={tab === t.id}
                className={`tip-tab${tab === t.id ? " tip-tab--active" : ""}`}
                onClick={() => setTab(t.id)}>
                <span className="tip-tab-icon">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* ══ MAIN CALCULATOR ══ */}
          {tab === "calculator" && (
            <section className="tip-section">
              <div className="tip-calc-layout">

                {/* ── Input Column ── */}
                <div className="tip-input-col">
                  <div className="tip-receipt-card">
                    <div className="tip-receipt-card-title">Your Bill</div>

                    {/* Bill Amount */}
                    <label className="tip-field">
                      <span className="tip-label">Bill Amount</span>
                      <div className="tip-money-input">
                        <span className="tip-currency">$</span>
                        <input
                          type="number" min={0} step={0.01}
                          value={billAmt}
                          onChange={e => setBillAmt(e.target.value)}
                          className="tip-input tip-input--large"
                          placeholder="0.00"
                        />
                      </div>
                    </label>

                    {/* Tip % buttons */}
                    <label className="tip-field">
                      <span className="tip-label">Tip Percentage</span>
                      <div className="tip-pct-grid">
                        {QUICK_PCTS.map(p => (
                          <button key={p}
                            className={`tip-pct-btn${activePct === p && customPct === "" ? " tip-pct-btn--active" : ""}`}
                            onClick={() => { setTipPct(p); setCustomPct(""); }}>
                            {p}%
                          </button>
                        ))}
                      </div>
                    </label>

                    {/* Custom % + slider */}
                    <div className="tip-field">
                      <span className="tip-label">Custom Percentage</span>
                      <div className="tip-custom-row">
                        <input type="range" min={0} max={50} step={0.5}
                          value={customPct !== "" ? parseFloat(customPct) || 0 : tipPct}
                          onChange={e => setCustomPct(e.target.value)}
                          className="tip-slider" />
                        <div className="tip-custom-input-wrap">
                          <input type="number" min={0} max={100} step={0.5}
                            value={customPct}
                            onChange={e => setCustomPct(e.target.value)}
                            className="tip-input tip-input--pct"
                            placeholder={String(tipPct)} />
                          <span className="tip-pct-suffix">%</span>
                        </div>
                      </div>
                    </div>

                    {/* People */}
                    <div className="tip-field">
                      <span className="tip-label">Number of People</span>
                      <div className="tip-people-row">
                        <button className="tip-people-btn" onClick={() => setPeople(p => Math.max(1, p - 1))}><Minus className="w-4 h-4" /></button>
                        <span className="tip-people-display">{people}</span>
                        <button className="tip-people-btn" onClick={() => setPeople(p => p + 1)}><Plus className="w-4 h-4" /></button>
                        <span className="tip-people-label">{people === 1 ? "person" : "people"}</span>
                      </div>
                    </div>

                    {/* Rounding */}
                    <div className="tip-field">
                      <span className="tip-label">Rounding</span>
                      <div className="tip-round-grid">
                        {([
                          { val: "none", label: "None" },
                          { val: "tip", label: "Round Tip ↑" },
                          { val: "total", label: "Round Total ↑" },
                          { val: "person", label: "Round/Person ↑" },
                        ] as { val: typeof roundMode; label: string }[]).map(r => (
                          <button key={r.val}
                            className={`tip-round-btn${roundMode === r.val ? " tip-round-btn--active" : ""}`}
                            onClick={() => setRoundMode(r.val)}>
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Receipt Output Column ── */}
                <div className="tip-output-col">
                  <div className="tip-receipt-output">
                    {/* Receipt top decoration */}
                    <div className="tip-receipt-top-bar">
                      <span>★ RECEIPT ★</span>
                    </div>
                    <div className="tip-divider tip-divider--dash" />

                    {/* Line items */}
                    <div className="tip-receipt-lines">
                      <div className="tip-receipt-line">
                        <span>Bill Subtotal</span>
                        <span>{fmt(bill)}</span>
                      </div>
                      <div className="tip-receipt-line tip-receipt-line--tip">
                        <span>Tip ({fmtPct(effectivePct)}){roundedResults ? " ↑" : ""}</span>
                        <span className="tip-amt-highlight">{fmt(displayTip)}</span>
                      </div>
                      <div className="tip-divider tip-divider--solid" />
                      <div className="tip-receipt-line tip-receipt-line--total">
                        <span>TOTAL</span>
                        <span>{fmt(displayTotal)}</span>
                      </div>
                    </div>

                    {/* Per person split */}
                    {people > 1 && (
                      <>
                        <div className="tip-divider tip-divider--dash" />
                        <div className="tip-receipt-split-header">÷ {people} PEOPLE</div>
                        <div className="tip-receipt-lines">
                          <div className="tip-receipt-line">
                            <span>Tip per person</span>
                            <span>{fmt(displayTipPerPerson)}</span>
                          </div>
                          <div className="tip-receipt-line tip-receipt-line--perperson">
                            <span>Each person pays</span>
                            <span className="tip-amt-highlight">{fmt(displayPerPerson)}</span>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="tip-divider tip-divider--dash" />
                    <div className="tip-receipt-footer">THANK YOU · COME AGAIN ♥</div>

                    {/* Formula breakdown */}
                    <div className="tip-formula-box">
                      <div className="tip-formula-title">Tip Calculator Formula</div>
                      <code>{fmt(bill)} × {fmtPct(activePct)} = {fmt(tipAmt)} tip</code>
                      <code>{fmt(bill)} + {fmt(displayTip)} = {fmt(displayTotal)} total</code>
                      {people > 1 && <code>{fmt(displayTotal)} ÷ {people} = {fmt(displayPerPerson)} / person</code>}
                    </div>

                    {/* Tip scale visual */}
                    <div className="tip-scale">
                      <div className="tip-scale-title">Tip Scale</div>
                      <div className="tip-scale-track">
                        {[10, 15, 18, 20, 25].map(p => (
                          <div key={p} className="tip-scale-mark" style={{ left: `${(p / 30) * 100}%` }}>
                            <div className="tip-scale-dot" />
                            <span className="tip-scale-label">{p}%</span>
                          </div>
                        ))}
                        <div className="tip-scale-needle"
                          style={{ left: `${Math.min(100, (effectivePct / 30) * 100)}%` }}>
                          <div className="tip-scale-needle-line" />
                          <div className="tip-scale-needle-val">{fmtPct(effectivePct)}</div>
                        </div>
                      </div>
                      <div className="tip-scale-labels-row">
                        <span>Minimal</span><span>Standard</span><span>Generous</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ══ BILL SPLITTER ══ */}
          {tab === "split" && (
            <section className="tip-section">
              <div className="tip-split-layout">
                <div className="tip-input-col">
                  <div className="tip-receipt-card">
                    <div className="tip-receipt-card-title">Split the Bill</div>

                    <div className="tip-split-mode-toggle">
                      <button className={`tip-mode-btn${splitMode === "equal" ? " tip-mode-btn--active" : ""}`}
                        onClick={() => setSplitMode("equal")}>Equal Split</button>
                      <button className={`tip-mode-btn${splitMode === "itemized" ? " tip-mode-btn--active" : ""}`}
                        onClick={() => setSplitMode("itemized")}>Itemized</button>
                    </div>

                    {splitMode === "equal" ? (
                      <>
                        <label className="tip-field">
                          <span className="tip-label">Total Bill</span>
                          <div className="tip-money-input">
                            <span className="tip-currency">$</span>
                            <input type="number" min={0} step={0.01} value={splitBill}
                              onChange={e => setSplitBill(e.target.value)}
                              className="tip-input tip-input--large" placeholder="0.00" />
                          </div>
                        </label>

                        <div className="tip-field">
                          <span className="tip-label">Tip Percentage</span>
                          <div className="tip-pct-grid">
                            {QUICK_PCTS.map(p => (
                              <button key={p}
                                className={`tip-pct-btn${splitTipPct === p ? " tip-pct-btn--active" : ""}`}
                                onClick={() => setSplitTipPct(p)}>{p}%</button>
                            ))}
                          </div>
                        </div>

                        <div className="tip-field">
                          <span className="tip-label">Number of People</span>
                          <div className="tip-people-row">
                            <button className="tip-people-btn" onClick={() => setSplitPeople(p => Math.max(1, p - 1))}><Minus className="w-4 h-4" /></button>
                            <span className="tip-people-display">{splitPeople}</span>
                            <button className="tip-people-btn" onClick={() => setSplitPeople(p => Math.min(50, p + 1))}><Plus className="w-4 h-4" /></button>
                            <span className="tip-people-label">{splitPeople === 1 ? "person" : "people"}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="tip-field">
                          <span className="tip-label">Individual Amounts</span>
                          <div className="tip-line-items">
                            {lineItems.map((item, idx) => (
                              <div key={item.id} className="tip-line-item-row">
                                <span className="tip-li-num">{idx + 1}</span>
                                <input type="text" value={item.name}
                                  onChange={e => updateLineItem(item.id, "name", e.target.value)}
                                  className="tip-li-name" placeholder="Name" />
                                <div className="tip-li-money">
                                  <span>$</span>
                                  <input type="number" min={0} step={0.01} value={item.price}
                                    onChange={e => updateLineItem(item.id, "price", e.target.value)}
                                    className="tip-li-price" placeholder="0.00" />
                                </div>
                                <button className="tip-li-remove" onClick={() => removeLineItem(item.id)} disabled={lineItems.length <= 1}><X className="w-3 h-3" /></button>
                              </div>
                            ))}
                          </div>
                          <button className="tip-add-person-btn" onClick={addLineItem}><Plus className="w-4 h-4 inline mr-1" /> Add Person</button>
                        </div>

                        <div className="tip-field">
                          <span className="tip-label">Tip Percentage (shared)</span>
                          <div className="tip-pct-grid">
                            {QUICK_PCTS.map(p => (
                              <button key={p}
                                className={`tip-pct-btn${splitTipPct === p ? " tip-pct-btn--active" : ""}`}
                                onClick={() => setSplitTipPct(p)}>{p}%</button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="tip-output-col">
                  <div className="tip-receipt-output">
                    <div className="tip-receipt-top-bar"><span>★ SPLIT RECEIPT ★</span></div>
                    <div className="tip-divider tip-divider--dash" />

                    {splitMode === "equal" ? (
                      <>
                        <div className="tip-receipt-lines">
                          <div className="tip-receipt-line">
                            <span>Bill Amount</span>
                            <span>{fmt(splitBillNum)}</span>
                          </div>
                          <div className="tip-receipt-line tip-receipt-line--tip">
                            <span>Tip ({fmtPct(splitTipPct)})</span>
                            <span className="tip-amt-highlight">{fmt(splitTipAmt)}</span>
                          </div>
                          <div className="tip-divider tip-divider--solid" />
                          <div className="tip-receipt-line tip-receipt-line--total">
                            <span>TOTAL</span>
                            <span>{fmt(splitTotal)}</span>
                          </div>
                        </div>
                        <div className="tip-divider tip-divider--dash" />
                        <div className="tip-receipt-split-header">÷ {splitPeople} PEOPLE</div>
                        <div className="tip-receipt-lines">
                          <div className="tip-receipt-line">
                            <span>Food per person</span>
                            <span>{fmt(splitBillNum / splitPeople)}</span>
                          </div>
                          <div className="tip-receipt-line">
                            <span>Tip per person</span>
                            <span>{fmt(tipPerPersonSplit)}</span>
                          </div>
                          <div className="tip-receipt-line tip-receipt-line--perperson">
                            <span>EACH PERSON PAYS</span>
                            <span className="tip-amt-highlight">{fmt(perPersonSplit)}</span>
                          </div>
                        </div>

                        {/* Visual people breakdown */}
                        <div className="tip-divider tip-divider--dash" />
                        <div className="tip-people-vis">
                          {Array.from({ length: Math.min(splitPeople, 12) }).map((_, i) => (
                            <div key={i} className="tip-person-card">
                              <span className="tip-person-icon"><Users className="w-5 h-5 text-amber-800 opacity-60" /></span>
                              <span className="tip-person-amt">{fmt(perPersonSplit)}</span>
                            </div>
                          ))}
                          {splitPeople > 12 && <div className="tip-person-more">+{splitPeople - 12} more</div>}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="tip-receipt-lines">
                          <div className="tip-receipt-line" style={{ fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.5 }}>
                            <span>Person</span><span>With Tip</span>
                          </div>
                          {itemizedResults.map(item => (
                            <div key={item.id} className="tip-receipt-line">
                              <span>{item.name}</span>
                              <div style={{ textAlign: "right" }}>
                                <div className="tip-amt-highlight">{fmt(item.total)}</div>
                                <div style={{ fontSize: "0.72rem", opacity: 0.55 }}>${item.price.toFixed(2)} + {fmt(item.tip)} tip</div>
                              </div>
                            </div>
                          ))}
                          <div className="tip-divider tip-divider--solid" />
                          <div className="tip-receipt-line tip-receipt-line--total">
                            <span>TOTAL</span>
                            <span>{fmt(lineItemsTotal + splitTipAmt)}</span>
                          </div>
                          <div className="tip-receipt-line tip-receipt-line--tip">
                            <span>Total Tip ({fmtPct(splitTipPct)})</span>
                            <span>{fmt(splitTipAmt)}</span>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="tip-divider tip-divider--dash" />
                    <div className="tip-receipt-footer">THANK YOU · COME AGAIN ♥</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ══ TIP CONVERTER ══ */}
          {tab === "converter" && (
            <section className="tip-section">
              <div className="tip-calc-layout">
                <div className="tip-input-col">
                  <div className="tip-receipt-card">
                    <div className="tip-receipt-card-title">Tip Converter</div>
                    <p className="tip-card-desc">Convert between tip <strong>amounts</strong> and tip <strong>percentages</strong> — works both ways.</p>

                    <div className="tip-conv-toggle">
                      <button className={`tip-mode-btn${convType === "pctToAmt" ? " tip-mode-btn--active" : ""}`}
                        onClick={() => setConvType("pctToAmt")}>% → Amount</button>
                      <button className={`tip-mode-btn${convType === "amtToPct" ? " tip-mode-btn--active" : ""}`}
                        onClick={() => setConvType("amtToPct")}>Amount → %</button>
                    </div>

                    <label className="tip-field">
                      <span className="tip-label">Bill Amount</span>
                      <div className="tip-money-input">
                        <span className="tip-currency">$</span>
                        <input type="number" min={0} step={0.01} value={convBill}
                          onChange={e => setConvBill(e.target.value)}
                          className="tip-input tip-input--large" placeholder="0.00" />
                      </div>
                    </label>

                    <label className="tip-field">
                      <span className="tip-label">{convType === "pctToAmt" ? "Tip Percentage (%)" : "Tip Amount ($)"}</span>
                      <div className="tip-money-input">
                        <span className="tip-currency">{convType === "pctToAmt" ? "%" : "$"}</span>
                        <input type="number" min={0} step={convType === "pctToAmt" ? 0.5 : 0.01} value={convInput}
                          onChange={e => setConvInput(e.target.value)}
                          className="tip-input tip-input--large" placeholder={convType === "pctToAmt" ? "18" : "18.00"} />
                      </div>
                    </label>

                    {/* Common tip amounts quick reference */}
                    <div className="tip-field">
                      <span className="tip-label">Quick reference for ${convBillNum.toFixed(2)}</span>
                      <div className="tip-conv-table">
                        {[10, 15, 18, 20, 22, 25].map(p => (
                          <div key={p} className="tip-conv-row"
                            onClick={() => { setConvInput(String(p)); setConvType("pctToAmt"); }}>
                            <span className="tip-conv-pct">{p}%</span>
                            <span className="tip-conv-amt">{fmt(convBillNum * (p / 100))}</span>
                            <span className="tip-conv-total">Total: {fmt(convBillNum * (1 + p / 100))}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tip-output-col">
                  <div className="tip-receipt-output">
                    <div className="tip-receipt-top-bar"><span>★ CONVERSION ★</span></div>
                    <div className="tip-divider tip-divider--dash" />
                    <div className="tip-conv-result">
                      <div className="tip-conv-result-label">{convResult.label}</div>
                      <div className="tip-conv-result-value">
                        {convResult.isPct ? fmtPct(convResult.value) : fmt(convResult.value)}
                      </div>
                      <div className="tip-conv-result-sub">{convResult.secondary}</div>
                    </div>
                    <div className="tip-divider tip-divider--dash" />

                    <div className="tip-receipt-lines">
                      <div className="tip-receipt-line">
                        <span>Bill</span><span>{fmt(convBillNum)}</span>
                      </div>
                      <div className="tip-receipt-line tip-receipt-line--tip">
                        <span>Tip</span>
                        <span className="tip-amt-highlight">
                          {convResult.isPct ? fmt(convInputNum) : fmt(convResult.value)}
                        </span>
                      </div>
                      <div className="tip-divider tip-divider--solid" />
                      <div className="tip-receipt-line tip-receipt-line--total">
                        <span>TOTAL</span>
                        <span>{convResult.isPct ? fmt(convBillNum + convInputNum) : fmt(convBillNum + convResult.value)}</span>
                      </div>
                    </div>

                    <div className="tip-divider tip-divider--dash" />
                    <div className="tip-formula-box">
                      <div className="tip-formula-title">Formula Used</div>
                      {convType === "pctToAmt"
                        ? <><code>Tip = ${convBillNum.toFixed(2)} × {fmtPct(convInputNum)}</code><code>Tip = {fmt(convResult.value)}</code></>
                        : <><code>% = (${convInputNum.toFixed(2)} ÷ ${convBillNum.toFixed(2)}) × 100</code><code>% = {fmtPct(convResult.value)}</code></>
                      }
                    </div>
                    <div className="tip-divider tip-divider--dash" />
                    <div className="tip-receipt-footer">THANK YOU · COME AGAIN ♥</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ══ TIP ESTIMATOR ══ */}
          {tab === "estimator" && (
            <section className="tip-section">
              <h2 className="tip-estimator-title">Tip Estimator — How Much to Tip for Every Service</h2>
              <p className="tip-estimator-desc">
                Not sure how much to tip? Use this <strong>tip estimator</strong> as your reference guide for every common tipping situation in the US.
                Click any row to open in the calculator.
              </p>

              <label className="tip-field tip-field--inline">
                <span className="tip-label">Bill / Service Amount</span>
                <div className="tip-money-input" style={{ maxWidth: 200 }}>
                  <span className="tip-currency">$</span>
                  <input type="number" min={0} step={1} value={billAmt}
                    onChange={e => setBillAmt(e.target.value)}
                    className="tip-input tip-input--large" />
                </div>
              </label>

              <div className="tip-estimator-grid">
                {TIP_PRESETS.map(preset => {
                  const bill2 = parseFloat(billAmt) || 0;
                  return (
                    <div key={preset.service} className="tip-preset-card"
                      onClick={() => { setTipPct(preset.typical); setCustomPct(""); setBillAmt(billAmt); setTab("calculator"); }}>
                      <div className="tip-preset-header">
                        <span className="tip-preset-emoji">{preset.icon}</span>
                        <span className="tip-preset-service">{preset.service}</span>
                      </div>
                      <div className="tip-preset-tiers">
                        <div className="tip-preset-tier tip-preset-tier--min">
                          <span className="tip-tier-label">Min</span>
                          <span className="tip-tier-pct">{preset.min}%</span>
                          <span className="tip-tier-amt">{fmt(bill2 * (preset.min / 100))}</span>
                        </div>
                        <div className="tip-preset-tier tip-preset-tier--typical">
                          <span className="tip-tier-label">Typical</span>
                          <span className="tip-tier-pct">{preset.typical}%</span>
                          <span className="tip-tier-amt">{fmt(bill2 * (preset.typical / 100))}</span>
                        </div>
                        <div className="tip-preset-tier tip-preset-tier--great">
                          <span className="tip-tier-label">Great</span>
                          <span className="tip-tier-pct">{preset.great}%</span>
                          <span className="tip-tier-amt">{fmt(bill2 * (preset.great / 100))}</span>
                        </div>
                      </div>
                      <div className="tip-preset-note">{preset.note}</div>
                      <div className="tip-preset-cta">Use {preset.typical}% →</div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ══ GUIDE TAB ══ */}
          {tab === "guide" && (
            <section className="tip-section tip-guide-prose">
              <h2>Tip Calculator Guide: How Much to Tip, When, and Why</h2>
              <p>Tipping in the United States has become more complex — and more expected — than ever before. Whether you are calculating a restaurant tip, estimating delivery gratuity, or figuring out how much to leave at a hotel, this guide explains the <strong>tip calculator formula</strong>, standard percentages, and the etiquette behind every situation.</p>
              <h3>The Tip Calculator Formula</h3>
              <p><strong>Tip Amount = Bill × (Tip Percentage ÷ 100).</strong> For a $85 restaurant bill at 18%: $85 × 0.18 = $15.30 tip. Total = $85 + $15.30 = $100.30. If splitting between 4 people: $100.30 ÷ 4 = $25.08 each.</p>
              <p>To find the tip percentage from an amount: <strong>Tip % = (Tip Amount ÷ Bill) × 100</strong>. A $20 tip on a $95 bill: ($20 ÷ $95) × 100 = 21.05%.</p>
              <h3>Restaurant Tip Standards in 2025</h3>
              <p>US restaurant tip expectations have risen substantially since 2020. The current consensus: <strong>15% for average service, 18% for good service, 20% for great service</strong>. At upscale restaurants, 20% is now the de facto floor. Many diners tip 25% or more for truly exceptional experiences.</p>
              <p>Important: calculate your tip on the <strong>pre-tax subtotal</strong>, not the total with tax. Some people tip on the tax-inclusive total — that is generous but not required by convention.</p>
              <h3>Should You Tip on Tax?</h3>
              <p>Etiquette is divided. The traditional practice is to tip only on the pre-tax subtotal. In practice, many people tip on the full total because it simplifies the math. The difference is small — on a $100 meal with 10% tax, tipping 20% on pre-tax ($100) = $20, vs. tipping 20% on post-tax ($110) = $22. Either is perfectly acceptable.</p>
              <h3>Easy Tip Calculation Without a Calculator</h3>
              <p><strong>The 10% trick:</strong> To calculate 10%, simply move the decimal point one place left. $85 → $8.50 is 10%. Double that for 20%: $17. Half of 10% = 5%, so 15% = $8.50 + $4.25 = $12.75.</p>
              <p><strong>The double-tax trick:</strong> In many US cities, sales tax is around 8–9%. Simply double the tax line on your receipt to get approximately an 18% tip.</p>
            </section>
          )}
        </main>

        {/* ── SEO Article ── */}
        <article className="tip-article tip-container">
          <SEOArticle />
        </article>

        {/* ── FAQ ── */}
        <section className="tip-faq-section tip-container">
          <FAQSection />
        </section>

        <div className="tip-container">
          <div className="tip-disclaimer">
            <strong>Note:</strong> Tipping is voluntary in the United States and varies by culture, region, and establishment. This tip calculator is for estimation purposes. Gratuity amounts shown are suggestions based on US customs and do not constitute financial advice.
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
    <div className="tip-prose">
      <h2>Tip Calculator: The Complete Guide to Restaurant Tips, Bill Splitting &amp; Gratuity</h2>

      <p>Whether you are at a restaurant trying to quickly calculate 20% on a $73.50 bill, splitting a group dinner, or converting a tip amount to see what percentage you actually left, our <strong>free tip calculator</strong> handles everything in one place. If you are a business owner or freelancer, you might also find our <a href="/finance/invoice-generator">Invoice Generator</a> helpful for professional billing. This guide covers the <strong>tip calculator formula</strong>, how to use every feature, tipping standards by service type, and answers to every common question about gratuity in the United States.</p>

      <h3>What Is the Tip Calculator Formula?</h3>
      <p>The core <strong>tip calculator formula</strong> is simple:</p>
      <p><strong>Tip Amount = Bill × (Percentage ÷ 100)</strong></p>
      <p><strong>Total = Bill + Tip</strong></p>
      <p><strong>Per Person = Total ÷ Number of People</strong></p>
      <p>For example: a $92.00 restaurant bill with 20% tip: $92.00 × 0.20 = $18.40 tip. Total = $110.40. Split between 3 people: $36.80 each. Our <strong>easy tip calculator</strong> above handles this instantly — just type in your bill amount, choose a tip percentage, and set the number of people. If you are curious about how your income affects your budget, check our <a href="/finance/salary-after-tax-calculator">Salary After Tax Calculator</a>.</p>

      <h3>Restaurant Tip Calculator: How Much to Tip at a Restaurant</h3>
      <p>The <strong>restaurant tip calculator</strong> tab above is designed specifically for dining out. Here are the current US tipping norms for restaurants:</p>
      <ul>
        <li><strong>10–12%:</strong> Below average; generally perceived as a signal of dissatisfaction. Use only if service was genuinely poor.</li>
        <li><strong>15%:</strong> Historically the standard. Now considered the minimum for adequate service in most US markets.</li>
        <li><strong>18%:</strong> The new informal "standard" at sit-down restaurants in most American cities. Pre-loaded as the default on many restaurant payment terminals.</li>
        <li><strong>20%:</strong> For good to great service. The easiest percentage to calculate mentally (double the first digit, or move decimal and double).</li>
        <li><strong>22–25%:</strong> For outstanding service, special occasions, or when you want to show extra appreciation.</li>
        <li><strong>25%+:</strong> For exceptional experiences, regulars who want to build relationships with servers, or celebrating servers during the holiday season.</li>
      </ul>

      <h3>Tip Percentage Calculator: Understanding Percentages</h3>
      <p>A <strong>tip percentage calculator</strong> is the most common way to figure out gratuity because percentages scale automatically with bill size. Unlike leaving a flat dollar amount, a percentage-based tip ensures the gratuity reflects the size of the order and the amount of service provided.</p>
      <p>The <strong>tip percentage calculator</strong> in our tool works two ways: enter a percentage to get a dollar amount, or enter a dollar amount to see what percentage it represents. The second mode — our <strong>tip converter</strong> — is useful when you want to leave a round total (e.g., exactly $100) and want to know what tip percentage that represents.</p>
      <p><strong>Mental math shortcuts for common percentages:</strong></p>
      <ul>
        <li><strong>10%:</strong> Move the decimal one place left. $78.40 → $7.84</li>
        <li><strong>15%:</strong> Find 10% then add half. $78.40 → $7.84 + $3.92 = $11.76</li>
        <li><strong>20%:</strong> Find 10% then double. $78.40 → $7.84 × 2 = $15.68</li>
        <li><strong>18%:</strong> Find 20% then subtract 10% of that. $78.40 → $15.68 − $1.57 ≈ $14.11</li>
        <li><strong>25%:</strong> Find 10%, double it, then add half the original 10%. Or just divide by 4.</li>
      </ul>

      <h3>Tip Converter: Converting Between Amounts and Percentages</h3>
      <p>The <strong>tip converter</strong> tab solves two problems that the basic calculator does not: first, converting a percentage into a dollar amount when you want to see exactly how much cash to leave; second, converting a dollar amount you already decided on into a percentage to verify it is appropriate.</p>
      <p>Common use cases for the tip converter: You decide to leave a $20 tip on a $94 bill — is that reasonable? ($20 ÷ $94) × 100 = 21.3% — yes, very generous. Or you want to leave a round total of $110 on an $89 bill: ($110 − $89) ÷ $89 × 100 = 23.6% tip.</p>

      <h3>Bill Splitter with Tip: How to Split a Check Fairly</h3>
      <p>Splitting a restaurant check is where most group dining friction occurs. Our bill splitter handles two scenarios: equal splitting (everyone pays the same) and itemized splitting (each person pays for what they ordered plus a proportional share of the tip).</p>
      <p><strong>Equal split:</strong> Add tip to total, divide by number of people. $200 bill + 18% tip ($36) = $236 ÷ 4 people = $59 each. Simple and fair when everyone ordered roughly similarly.</p>
      <p><strong>Itemized split:</strong> Enter each person's individual subtotal. The calculator assigns each person a proportional share of the tip based on their order size. Someone who ordered $70 in a group where the total is $200 pays 35% of the tip. This is fairer when orders vary significantly in price.</p>
      <p>A third approach — not handled by most apps — is to have each person calculate their own tip separately and pay independently. This works fine for parties of 2–3 but becomes unwieldy for larger groups.</p>

      <h3>Tip Estimator: How Much to Tip for Every Service Type</h3>
      <p>The <strong>tip estimator</strong> tab covers 16 different service categories with minimum, typical, and generous tipping ranges. Here is a summary of the most important ones:</p>
      <ul>
        <li><strong>Fine Dining (18–25%):</strong> Higher expectations, more specialized staff, larger teams sharing gratuity. 20% is the floor, 25%+ for premium experiences.</li>
        <li><strong>Casual Restaurant (15–20%):</strong> Standard for most sit-down meals. 18% is appropriate for good service.</li>
        <li><strong>Food Delivery (15–20%):</strong> Drivers bear the cost of vehicle wear, gas, and their time. 15% minimum, more in bad weather or for long distances.</li>
        <li><strong>Hair Salon (15–20%):</strong> Tip your stylist based on the service cost (not including product purchases). Also tip the shampoo assistant $3–5 separately.</li>
        <li><strong>Hotel Housekeeping ($2–5/night):</strong> Often forgotten. Leave cash daily (not at checkout) because different staff may clean your room each day. Leave a note saying the cash is for housekeeping.</li>
        <li><strong>Tattoo Artist (15–25%):</strong> Custom work deserves generous tips. Tipping your tattoo artist is a way to show appreciation for their art and time.</li>
        <li><strong>Rideshare/Taxi (10–20%):</strong> App-based tipping is standard. Round up for short rides; tip 15–20% for longer trips or exceptional service.</li>
      </ul>

      <h3>Simple Tip Calculator Tips for Everyday Use</h3>
      <p>The fastest <strong>simple tip calculator</strong> technique for a restaurant: look at your bill, find the tax line (usually around 8–10%), and double it. That gives you approximately 16–20% tip. For a $100 bill with $9.50 tax, double the tax = $19 tip (19%). Fast, easy, fair.</p>
      <p>Another <strong>easy tip calculator</strong> trick: round your bill to the nearest $10 or $5, calculate the tip on the rounded amount, then round the tip to the nearest dollar. Paying with cash? Round the total up to the nearest $5 for simplicity.</p>

      <h3>Why Tip Percentages Have Increased Over Time</h3>
      <p>Restaurant tip expectations in the US have risen significantly over the past two decades. In the 1980s and 1990s, 15% was the standard. By the 2010s, 18% became common. Today, 20% is widely considered the baseline for good service, and payment terminals typically default to 18%, 20%, and 22% or 25% options.</p>
      <p>Several factors drive this inflation: the federal tipped minimum wage has been frozen at $2.13/hour since 1991, meaning servers depend on tips for almost all of their income; higher menu prices mean the same percentage buys less relative to a server's time; and the social norm enforcement of digital tip prompts has raised baseline expectations.</p>
      <p>Tipping culture has also expanded beyond restaurants to counter service, coffee shops, food trucks, and delivery apps — categories where tipping was historically uncommon. Our <strong>tip estimator</strong> helps navigate all of these situations with current norms.</p>

      <h3>Tipping Outside the US</h3>
      <p>Tipping norms vary dramatically by country. In Japan, tipping is considered rude. In many European countries, a small tip (5–10%) is appreciated but not expected. In Canada, tipping norms are similar to the US (15–20%). In Australia, tipping is optional and not expected for counter service. Our calculator can be used for any currency — just substitute your local currency symbol for the dollar sign.</p>

      <h3>How to Use This Free Tip Calculator</h3>
      <p>The <strong>free tip calculator</strong> has five tabs. The <strong>Calculator</strong> tab is for standard restaurant tip calculations — enter bill, choose percentage, set party size, and optionally round. The <strong>Bill Splitter</strong> handles equal and itemized splits for groups. The <strong>Tip Converter</strong> converts between amounts and percentages. The <strong>Tip Estimator</strong> shows minimum, typical, and generous ranges for 16 service types. The <strong>Guide</strong> tab explains all the concepts.</p>
    </div>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────────────────────

const FAQS = [
  { q: "How do I calculate a tip?", a: "The tip calculator formula is: Tip = Bill × (Percentage ÷ 100). For a $90 bill at 18%: $90 × 0.18 = $16.20 tip. Total = $106.20. Mental shortcut: find 10% (move decimal left) then add to get your target — for 20%, just double the 10% amount." },
  { q: "How much should I tip at a restaurant?", a: "Current US norms: 15% for average service, 18% for good service, 20% for great service, 25%+ for exceptional. For fine dining, 20% is now considered the floor. For buffets, 10% for drink and plate service." },
  { q: "How do I split a restaurant bill with tip?", a: "Add tip to the total first, then divide: ($200 bill + $36 tip at 18%) ÷ 4 people = $59/person. Our Bill Splitter tab handles both equal splits and itemized splits where each person pays for what they ordered." },
  { q: "What is a fair tip for food delivery?", a: "For restaurant delivery drivers (DoorDash, Uber Eats, Grubhub): 15–20% of the order value, with a $3–5 minimum. Drivers pay for their own gas, vehicle wear, and time. Increase tips for bad weather, long distances, or large orders." },
  { q: "How do I convert a tip amount to a percentage?", a: "Tip Percentage = (Tip Amount ÷ Pre-tax Bill) × 100. Example: $20 tip on an $85 bill = ($20 ÷ $85) × 100 = 23.5%. Use the Tip Converter tab for instant calculations." },
  { q: "Should I calculate tip on the pre-tax or post-tax amount?", a: "Traditional etiquette says to tip on the pre-tax subtotal. In practice, most people tip on the total including tax because it is easier. The difference is small — on a $100 meal with 10% tax, the difference between tipping 20% pre-tax ($20) vs. post-tax ($22) is just $2." },
  { q: "How much do you tip for pizza delivery?", a: "A minimum of $3–5 regardless of order size, or 10–15% for larger orders. For orders over $50, 10–15% is appropriate. Increase for difficult delivery conditions (stairs, long distance, bad weather)." },
  { q: "How much should I tip for a haircut?", a: "Tip 15–20% of the service cost for your stylist. If a shampoo assistant helped, tip them $3–5 separately. For a $60 haircut: $10–12 tip for the stylist plus $3–5 for the assistant." },
  { q: "What is a 20% tip on $50?", a: "$10. Formula: $50 × 0.20 = $10. Total with tip: $60. Easy mental math: move the decimal to get $5 (10%), then double it to get $10 (20%)." },
  { q: "Is it rude not to tip?", a: "In the United States, not tipping at a sit-down restaurant is considered rude because servers earn a sub-minimum tipped wage and rely on tips for most of their income. For counter service and delivery, tipping is expected but not legally or socially obligatory to the same degree." },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="tip-faq-inner">
      <h2 className="tip-faq-title">Frequently Asked Questions</h2>
      <div className="tip-faq-list">
        {FAQS.map((f, i) => (
          <div key={i} className={`tip-faq-item${open === i ? " tip-faq-item--open" : ""}`}>
            <button className="tip-faq-q" onClick={() => setOpen(open === i ? null : i)}>
              <span>{f.q}</span>
              <span className="tip-faq-chevron">{open === i ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</span>
            </button>
            {open === i && <p className="tip-faq-a">{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&display=swap');

  /* ── Tokens ── */
  :root {
    --ink:        #1c1208;
    --ink-mid:    #4a3820;
    --ink-light:  #8a7258;
    --cream:      #faf6ef;
    --paper:      #fff9f0;
    --paper-dark: #f5ede0;
    --red:        #c0392b;
    --red-light:  #e8c4bf;
    --stamp:      #d4470e;
    --border:     #e0d4c0;
    --shadow:     rgba(28, 18, 8, 0.08);
  }

  /* ── Base ── */
  .tip-page {
    font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
    background: var(--cream);
    color: var(--ink);
    min-height: 100vh;
  }
  .tip-container { max-width: 1100px; margin: 0 auto; padding: 0 1.25rem; }

  /* ── Breadcrumb ── */
  .tip-breadcrumb {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.78rem; color: var(--ink-light);
    margin-bottom: 1.5rem;
    font-family: 'Trebuchet MS', sans-serif;
  }
  .tip-breadcrumb a { color: var(--stamp); text-decoration: none; }
  .tip-breadcrumb a:hover { text-decoration: underline; }

  /* ── Hero ── */
  .tip-hero {
    background: var(--paper);
    border-bottom: 1px solid var(--border);
    padding: 2.5rem 0 0;
    position: relative;
    overflow: hidden;
  }
  .tip-hero::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: repeating-linear-gradient(90deg, var(--stamp) 0px, var(--stamp) 12px, transparent 12px, transparent 18px);
  }

  /* ── Receipt header ── */
  .tip-receipt-header {
    max-width: 700px;
    margin: 0 auto;
    text-align: center;
    padding-bottom: 0;
  }
  .tip-receipt-top {
    display: flex; flex-direction: column; align-items: center;
    gap: 0.25rem; padding-bottom: 1.25rem;
  }
  .tip-receipt-logo {
    font-size: 1.5rem;
    color: var(--stamp);
    letter-spacing: 0.1em;
  }
  .tip-h1 {
    font-family: 'Playfair Display', 'Georgia', serif;
    font-size: clamp(2rem, 6vw, 3.5rem);
    font-weight: 900;
    color: var(--ink);
    letter-spacing: -0.025em;
    line-height: 1.1;
    margin: 0;
  }
  .tip-h1-sub {
    font-family: 'Trebuchet MS', sans-serif;
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-light);
    margin-top: 0.2rem;
  }

  /* ── Dividers ── */
  .tip-divider {
    width: 100%; margin: 0.75rem 0;
    border: none;
  }
  .tip-divider--dash {
    border-top: 1px dashed var(--border);
  }
  .tip-divider--solid {
    border-top: 2px solid var(--ink);
    margin: 0.5rem 0;
  }

  /* ── Hero cols ── */
  .tip-hero-cols {
    display: flex; gap: 2rem; justify-content: space-between;
    align-items: center; padding: 0.75rem 0 1.5rem;
    flex-wrap: wrap; text-align: left;
  }
  .tip-hero-tagline { flex: 1; min-width: 240px; }
  .tip-hero-tagline p { font-size: 0.92rem; color: var(--ink-mid); line-height: 1.65; margin: 0; }
  .tip-hero-tagline strong { color: var(--ink); }
  .tip-hero-facts { display: flex; gap: 1.5rem; flex-shrink: 0; }
  .tip-fact { display: flex; flex-direction: column; align-items: center; gap: 0.1rem; }
  .tip-fact-n {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; font-weight: 900;
    color: var(--stamp);
    letter-spacing: -0.03em;
  }
  .tip-fact-l { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-light); font-family: 'Trebuchet MS', sans-serif; }

  /* ── Main ── */
  .tip-main { padding: 2rem 1.25rem; }

  /* ── Tabs ── */
  .tip-tabs {
    display: flex; gap: 0;
    border-bottom: 2px solid var(--border);
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }
  .tip-tab {
    display: flex; align-items: center; gap: 0.4rem;
    background: none; border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    cursor: pointer;
    color: var(--ink-light);
    font-family: 'Trebuchet MS', sans-serif;
    font-weight: 600;
    transition: color 0.15s, border-color 0.15s;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }
  .tip-tab:hover { color: var(--ink); }
  .tip-tab--active { color: var(--stamp); border-bottom-color: var(--stamp); }
  .tip-tab-icon { font-size: 0.95rem; }

  /* ── Section ── */
  .tip-section { }
  .tip-calc-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1.75rem; align-items: start; }
  .tip-split-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1.75rem; align-items: start; }

  /* ── Receipt Card (inputs) ── */
  .tip-receipt-card {
    background: var(--paper);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 1.5rem;
    box-shadow: 4px 4px 0 var(--border);
    position: relative;
  }
  .tip-receipt-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--stamp);
    border-radius: 3px 3px 0 0;
  }
  .tip-receipt-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px dashed var(--border);
  }
  .tip-card-desc {
    font-size: 0.85rem;
    color: var(--ink-mid);
    line-height: 1.55;
    margin-bottom: 1.25rem;
  }
  .tip-card-desc strong { color: var(--ink); }

  /* ── Fields ── */
  .tip-field { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem; }
  .tip-field--inline { flex-direction: row; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
  .tip-label {
    font-family: 'Trebuchet MS', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--ink-light);
  }

  /* ── Money input ── */
  .tip-money-input {
    display: flex; align-items: center;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    background: #fff;
    overflow: hidden;
    transition: border-color 0.15s;
  }
  .tip-money-input:focus-within { border-color: var(--stamp); }
  .tip-currency {
    padding: 0.65rem 0.75rem;
    background: var(--paper-dark);
    color: var(--ink-light);
    font-family: 'Courier New', monospace;
    font-size: 1rem;
    border-right: 1px solid var(--border);
    flex-shrink: 0;
  }
  .tip-input {
    border: 1.5px solid var(--border);
    border-radius: 3px;
    padding: 0.65rem 0.875rem;
    font-family: 'Courier New', monospace;
    font-size: 1rem;
    color: var(--ink);
    background: #fff;
    width: 100%;
    outline: none;
    transition: border-color 0.15s;
  }
  .tip-input--large { font-size: 1.2rem; font-weight: 700; }
  .tip-input--pre { border: none; border-radius: 0; }
  .tip-input--pct { width: 70px; text-align: center; }
  .tip-input:focus { border-color: var(--stamp); }

  /* ── % grid ── */
  .tip-pct-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.4rem; }
  .tip-pct-btn {
    background: var(--paper-dark);
    border: 1.5px solid var(--border);
    border-radius: 3px;
    padding: 0.55rem 0.2rem;
    font-family: 'Trebuchet MS', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    color: var(--ink-mid);
    transition: all 0.12s;
    text-align: center;
  }
  .tip-pct-btn:hover { background: var(--red-light); color: var(--stamp); border-color: var(--stamp); }
  .tip-pct-btn--active { background: var(--stamp); color: #fff; border-color: var(--stamp); }

  /* ── Slider ── */
  .tip-custom-row { display: flex; align-items: center; gap: 0.875rem; }
  .tip-slider {
    flex: 1;
    -webkit-appearance: none;
    height: 3px;
    background: var(--border);
    border-radius: 99px;
    outline: none;
  }
  .tip-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: var(--stamp);
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 0 0 1px var(--stamp), 0 2px 6px rgba(212,71,14,0.3);
  }
  .tip-custom-input-wrap { display: flex; align-items: center; gap: 0.2rem; }
  .tip-pct-suffix { font-family: 'Courier New', monospace; font-size: 1rem; color: var(--ink-light); }

  /* ── People row ── */
  .tip-people-row { display: flex; align-items: center; gap: 0.75rem; }
  .tip-people-btn {
    width: 2.25rem; height: 2.25rem;
    border-radius: 50%;
    background: var(--paper-dark);
    border: 1.5px solid var(--border);
    font-size: 1.1rem;
    cursor: pointer;
    color: var(--ink);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.12s;
    font-family: 'Trebuchet MS', sans-serif;
  }
  .tip-people-btn:hover { background: var(--stamp); color: #fff; border-color: var(--stamp); }
  .tip-people-display {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem;
    font-weight: 900;
    color: var(--stamp);
    min-width: 2rem;
    text-align: center;
    line-height: 1;
  }
  .tip-people-label { font-size: 0.82rem; color: var(--ink-light); }

  /* ── Round grid ── */
  .tip-round-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.4rem; }
  .tip-round-btn {
    background: var(--paper-dark);
    border: 1.5px solid var(--border);
    border-radius: 3px;
    padding: 0.45rem 0.5rem;
    font-size: 0.75rem;
    font-family: 'Trebuchet MS', sans-serif;
    cursor: pointer;
    color: var(--ink-mid);
    transition: all 0.12s;
    text-align: center;
    font-weight: 600;
  }
  .tip-round-btn:hover { border-color: var(--stamp); color: var(--stamp); }
  .tip-round-btn--active { background: var(--stamp); color: #fff; border-color: var(--stamp); }

  /* ── Receipt Output ── */
  .tip-receipt-output {
    background: var(--paper);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 1.5rem;
    box-shadow: 4px 4px 0 var(--border);
    font-family: 'Courier New', monospace;
  }
  .tip-receipt-top-bar {
    text-align: center;
    font-family: 'Trebuchet MS', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--stamp);
    font-weight: 700;
    padding-bottom: 0.5rem;
  }

  /* ── Receipt lines ── */
  .tip-receipt-lines { display: flex; flex-direction: column; gap: 0; }
  .tip-receipt-line {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.45rem 0;
    font-size: 0.9rem;
    color: var(--ink-mid);
    border-bottom: 1px dotted rgba(0,0,0,0.06);
    gap: 1rem;
  }
  .tip-receipt-line:last-child { border-bottom: none; }
  .tip-receipt-line--tip { color: var(--stamp); font-weight: 700; }
  .tip-receipt-line--total { font-size: 1.1rem; font-weight: 700; color: var(--ink); padding-top: 0.65rem; }
  .tip-receipt-line--perperson { font-size: 1rem; font-weight: 700; color: var(--ink); }
  .tip-amt-highlight {
    font-size: 1.1rem;
    font-weight: 900;
    color: var(--stamp);
    letter-spacing: -0.02em;
  }
  .tip-receipt-split-header {
    text-align: center;
    font-family: 'Trebuchet MS', sans-serif;
    font-size: 0.72rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--ink-light);
    padding: 0.5rem 0;
    font-weight: 700;
  }
  .tip-receipt-footer {
    text-align: center;
    font-family: 'Trebuchet MS', sans-serif;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-light);
    padding-top: 0.5rem;
  }

  /* ── Formula box ── */
  .tip-formula-box {
    background: var(--paper-dark);
    border: 1px dashed var(--border);
    border-radius: 3px;
    padding: 0.75rem 1rem;
    margin-top: 0.75rem;
    display: flex; flex-direction: column; gap: 0.3rem;
  }
  .tip-formula-title {
    font-family: 'Trebuchet MS', sans-serif;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--ink-light);
    font-weight: 700;
    margin-bottom: 0.2rem;
  }
  .tip-formula-box code { font-size: 0.82rem; color: var(--ink-mid); }

  /* ── Tip scale ── */
  .tip-scale { margin-top: 1rem; padding-top: 0.75rem; border-top: 1px dashed var(--border); }
  .tip-scale-title {
    font-family: 'Trebuchet MS', sans-serif;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--ink-light);
    font-weight: 700;
    margin-bottom: 1rem;
  }
  .tip-scale-track {
    position: relative;
    height: 24px;
    background: linear-gradient(90deg, #e8f5e9 0%, #fff9c4 40%, #fce4ec 100%);
    border-radius: 99px;
    border: 1px solid var(--border);
    margin-bottom: 0.4rem;
  }
  .tip-scale-mark { position: absolute; transform: translateX(-50%); bottom: 0; }
  .tip-scale-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ink-light); margin: 0 auto 2px; }
  .tip-scale-label { font-size: 0.6rem; color: var(--ink-light); white-space: nowrap; display: block; text-align: center; }
  .tip-scale-needle { position: absolute; top: -4px; transform: translateX(-50%); transition: left 0.3s; }
  .tip-scale-needle-line { width: 2px; height: 32px; background: var(--stamp); margin: 0 auto; border-radius: 99px; }
  .tip-scale-needle-val { font-size: 0.72rem; font-weight: 700; color: var(--stamp); white-space: nowrap; text-align: center; font-family: 'Trebuchet MS', sans-serif; margin-top: 2px; }
  .tip-scale-labels-row { display: flex; justify-content: space-between; font-size: 0.62rem; color: var(--ink-light); font-family: 'Trebuchet MS', sans-serif; }

  /* ── Split mode toggle ── */
  .tip-split-mode-toggle, .tip-conv-toggle {
    display: flex; gap: 0;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 1.25rem;
  }
  .tip-mode-btn {
    flex: 1;
    background: var(--paper-dark);
    border: none;
    padding: 0.6rem 0.5rem;
    font-family: 'Trebuchet MS', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    color: var(--ink-light);
    transition: all 0.12s;
    border-right: 1px solid var(--border);
  }
  .tip-mode-btn:last-child { border-right: none; }
  .tip-mode-btn:hover { color: var(--stamp); }
  .tip-mode-btn--active { background: var(--stamp); color: #fff; }

  /* ── Line items ── */
  .tip-line-items { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 0.75rem; }
  .tip-line-item-row { display: flex; align-items: center; gap: 0.4rem; }
  .tip-li-num { width: 1.25rem; text-align: center; font-size: 0.75rem; color: var(--ink-light); font-family: 'Courier New', monospace; flex-shrink: 0; }
  .tip-li-name { flex: 1; border: 1.5px solid var(--border); border-radius: 3px; padding: 0.4rem 0.6rem; font-family: inherit; font-size: 0.85rem; color: var(--ink); background: #fff; }
  .tip-li-money { display: flex; align-items: center; border: 1.5px solid var(--border); border-radius: 3px; overflow: hidden; background: #fff; }
  .tip-li-money span { padding: 0.4rem 0.5rem; background: var(--paper-dark); font-family: 'Courier New', monospace; font-size: 0.85rem; color: var(--ink-light); border-right: 1px solid var(--border); }
  .tip-li-price { width: 80px; border: none; padding: 0.4rem 0.5rem; font-family: 'Courier New', monospace; font-size: 0.875rem; color: var(--ink); background: transparent; outline: none; }
  .tip-li-remove { background: none; border: 1.5px solid var(--border); border-radius: 3px; width: 1.75rem; height: 1.75rem; cursor: pointer; color: var(--ink-light); font-size: 0.75rem; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .tip-li-remove:hover:not(:disabled) { border-color: var(--stamp); color: var(--stamp); }
  .tip-li-remove:disabled { opacity: 0.3; cursor: not-allowed; }
  .tip-add-person-btn {
    background: none;
    border: 1.5px dashed var(--border);
    border-radius: 3px;
    padding: 0.45rem 1rem;
    font-family: 'Trebuchet MS', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    color: var(--ink-light);
    transition: all 0.12s;
    width: 100%;
    margin-top: 0.25rem;
  }
  .tip-add-person-btn:hover { border-color: var(--stamp); color: var(--stamp); }

  /* ── People vis ── */
  .tip-people-vis { display: flex; flex-wrap: wrap; gap: 0.5rem; padding: 0.5rem 0; }
  .tip-person-card { display: flex; flex-direction: column; align-items: center; gap: 0.15rem; }
  .tip-person-icon { font-size: 1.1rem; }
  .tip-person-amt { font-size: 0.65rem; font-family: 'Courier New', monospace; color: var(--stamp); font-weight: 700; }
  .tip-person-more { font-size: 0.75rem; color: var(--ink-light); align-self: center; }

  /* ── Converter ── */
  .tip-conv-table { display: flex; flex-direction: column; gap: 0; border: 1.5px solid var(--border); border-radius: 3px; overflow: hidden; }
  .tip-conv-row {
    display: flex; align-items: center; gap: 0.875rem;
    padding: 0.5rem 0.875rem;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.1s;
  }
  .tip-conv-row:last-child { border-bottom: none; }
  .tip-conv-row:hover { background: var(--paper-dark); }
  .tip-conv-pct { font-weight: 700; color: var(--stamp); width: 36px; font-family: 'Trebuchet MS', sans-serif; font-size: 0.85rem; }
  .tip-conv-amt { font-family: 'Courier New', monospace; font-weight: 700; color: var(--ink); flex: 1; }
  .tip-conv-total { font-size: 0.75rem; color: var(--ink-light); font-family: 'Courier New', monospace; }
  .tip-conv-result { text-align: center; padding: 1.25rem 0; }
  .tip-conv-result-label { font-family: 'Trebuchet MS', sans-serif; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ink-light); font-weight: 700; }
  .tip-conv-result-value { font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 900; color: var(--stamp); line-height: 1.1; margin: 0.25rem 0; }
  .tip-conv-result-sub { font-size: 0.82rem; color: var(--ink-light); font-family: 'Courier New', monospace; }

  /* ── Estimator ── */
  .tip-estimator-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 0.5rem;
  }
  .tip-estimator-desc { font-size: 0.9rem; color: var(--ink-mid); margin-bottom: 1.5rem; line-height: 1.55; }
  .tip-estimator-desc strong { color: var(--ink); }
  .tip-estimator-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.875rem; margin-top: 1.5rem; }
  .tip-preset-card {
    background: var(--paper);
    border: 1.5px solid var(--border);
    border-radius: 3px;
    padding: 1rem;
    cursor: pointer;
    transition: box-shadow 0.15s, border-color 0.15s;
    box-shadow: 2px 2px 0 var(--border);
    display: flex; flex-direction: column; gap: 0.6rem;
  }
  .tip-preset-card:hover { border-color: var(--stamp); box-shadow: 3px 3px 0 var(--red-light); }
  .tip-preset-header { display: flex; align-items: center; gap: 0.6rem; }
  .tip-preset-emoji { font-size: 1.25rem; }
  .tip-preset-service { font-weight: 700; font-size: 0.9rem; color: var(--ink); }
  .tip-preset-tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.3rem; }
  .tip-preset-tier { background: var(--paper-dark); border-radius: 3px; padding: 0.45rem 0.35rem; text-align: center; display: flex; flex-direction: column; gap: 0.1rem; }
  .tip-preset-tier--typical { background: var(--red-light); }
  .tip-tier-label { font-family: 'Trebuchet MS', sans-serif; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-light); }
  .tip-tier-pct { font-family: 'Trebuchet MS', sans-serif; font-size: 0.875rem; font-weight: 800; color: var(--ink); }
  .tip-preset-tier--typical .tip-tier-pct { color: var(--stamp); }
  .tip-tier-amt { font-family: 'Courier New', monospace; font-size: 0.72rem; color: var(--ink-mid); }
  .tip-preset-note { font-size: 0.72rem; color: var(--ink-light); line-height: 1.45; }
  .tip-preset-cta { font-family: 'Trebuchet MS', sans-serif; font-size: 0.72rem; font-weight: 700; color: var(--stamp); text-align: right; }

  /* ── Guide prose ── */
  .tip-guide-prose h2 { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--ink); margin-bottom: 0.75rem; }
  .tip-guide-prose h3 { font-family: 'Trebuchet MS', sans-serif; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--stamp); margin: 1.5rem 0 0.5rem; font-weight: 700; }
  .tip-guide-prose p { line-height: 1.75; color: var(--ink-mid); font-size: 0.92rem; margin-bottom: 0.875rem; }
  .tip-guide-prose strong { color: var(--ink); }
  .tip-guide-prose ul { padding-left: 1.5rem; margin-bottom: 1rem; }
  .tip-guide-prose li { line-height: 1.7; color: var(--ink-mid); font-size: 0.9rem; margin-bottom: 0.35rem; }

  /* ── Article ── */
  .tip-article { padding: 3rem 1.25rem; border-top: 1.5px solid var(--border); background: var(--paper); }
  .tip-prose h2 { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--ink); margin: 0 0 0.875rem; }
  .tip-prose h3 { font-family: 'Trebuchet MS', sans-serif; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--stamp); margin: 1.5rem 0 0.4rem; font-weight: 700; }
  .tip-prose p { line-height: 1.75; color: var(--ink-mid); font-size: 0.92rem; margin-bottom: 0.875rem; }
  .tip-prose ul { padding-left: 1.5rem; margin-bottom: 1rem; }
  .tip-prose li { line-height: 1.7; color: var(--ink-mid); font-size: 0.9rem; margin-bottom: 0.35rem; }
  .tip-prose strong { color: var(--ink); }

  /* ── FAQ ── */
  .tip-faq-section { padding: 2.5rem 1.25rem 3rem; border-top: 1.5px solid var(--border); background: var(--paper); }
  .tip-faq-inner { max-width: 760px; }
  .tip-faq-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: var(--ink); margin-bottom: 1.25rem; }
  .tip-faq-list { display: flex; flex-direction: column; }
  .tip-faq-item { border-bottom: 1px dashed var(--border); }
  .tip-faq-q { width: 100%; text-align: left; background: none; border: none; padding: 0.875rem 0; font-size: 0.9rem; font-weight: 700; color: var(--ink); cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 1rem; font-family: inherit; }
  .tip-faq-q:hover { color: var(--stamp); }
  .tip-faq-chevron { font-size: 1.25rem; color: var(--stamp); flex-shrink: 0; font-weight: 900; }
  .tip-faq-a { padding: 0 0 0.875rem; line-height: 1.7; color: var(--ink-mid); font-size: 0.87rem; }

  /* ── Disclaimer ── */
  .tip-disclaimer {
    background: var(--paper-dark);
    border: 1px dashed var(--border);
    border-radius: 3px;
    padding: 0.875rem 1.25rem;
    font-size: 0.78rem;
    color: var(--ink-light);
    line-height: 1.6;
    margin: 1.5rem 0 3rem;
    font-family: 'Trebuchet MS', sans-serif;
  }
  .tip-disclaimer strong { color: var(--ink-mid); }

  /* ── Responsive ── */
  @media (max-width: 760px) {
    .tip-calc-layout, .tip-split-layout { grid-template-columns: 1fr; }
    .tip-hero-facts { gap: 1rem; }
    .tip-pct-grid { grid-template-columns: repeat(3, 1fr); }
    .tip-estimator-grid { grid-template-columns: 1fr 1fr; }
    .tip-tabs { overflow-x: auto; gap: 0; }
    .tip-tab { padding: 0.6rem 0.7rem; font-size: 0.78rem; }
  }
  @media (max-width: 480px) {
    .tip-hero-facts { display: none; }
    .tip-estimator-grid { grid-template-columns: 1fr; }
    .tip-round-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;
