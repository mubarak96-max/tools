"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { 
  Calculator, 
  RotateCcw, 
  Scale, 
  List, 
  BookOpen, 
  TreePalm, 
  X, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  ArrowRight
} from "lucide-react";

// ─── Tax Data ─────────────────────────────────────────────────────────────────
// State base: 6% state + 1.25% mandatory local = 7.25% minimum statewide
// Source: CDTFA Publication 95, effective 2025

const CA_CITIES: Record<string, number> = {
  // A
  "Alameda": 10.75, "Albany": 10.75, "Alhambra": 10.25, "Anaheim": 7.75, "Antioch": 9.25,
  "Apple Valley": 7.75, "Arcadia": 10.25, "Arcata": 8.5, "Atwater": 8.25, "Azusa": 10.25,
  // B
  "Bakersfield": 8.25, "Baldwin Park": 10.25, "Barstow": 8.75, "Bell": 10.25,
  "Bell Gardens": 10.25, "Bellflower": 10.25, "Belmont": 9.75, "Berkeley": 10.25,
  "Beverly Hills": 10.25, "Brea": 7.75, "Brisbane": 9.25, "Buena Park": 8.75,
  "Burbank": 10.25, "Burlingame": 9.5,
  // C
  "Calexico": 8.25, "Camarillo": 7.25, "Campbell": 9.25, "Carlsbad": 7.75,
  "Carson": 10.25, "Cathedral City": 8.75, "Cerritos": 10.25, "Chico": 7.25,
  "Chino": 7.75, "Chino Hills": 7.75, "Chula Vista": 8.75, "Citrus Heights": 7.75,
  "Claremont": 10.25, "Clovis": 8.975, "Coachella": 8.75, "Compton": 10.25,
  "Concord": 9.75, "Corona": 8.75, "Coronado": 8.25, "Costa Mesa": 7.75,
  "Covina": 10.25, "Culver City": 10.25, "Cupertino": 9.125,
  // D
  "Daly City": 9.25, "Davis": 8.25, "Delano": 8.25, "Desert Hot Springs": 9.25,
  "Diamond Bar": 10.25, "Downey": 10.25, "Dublin": 10.25,
  // E
  "El Cajon": 8.25, "El Centro": 7.75, "El Monte": 10.25, "El Segundo": 10.25,
  "Elk Grove": 8.25, "Emeryville": 10.5, "Encinitas": 7.75, "Escondido": 8.75,
  "Eureka": 8.75,
  // F
  "Fairfield": 8.375, "Folsom": 7.75, "Fontana": 8.75, "Foster City": 9.75,
  "Fremont": 10.25, "Fresno": 8.35, "Fullerton": 7.75,
  // G
  "Garden Grove": 8.75, "Gardena": 10.25, "Gilroy": 9.125, "Glendale": 10.25,
  "Glendora": 10.25, "Grass Valley": 7.25,
  // H
  "Hawthorne": 10.25, "Hayward": 10.75, "Hemet": 8.75, "Hesperia": 7.75,
  "Highland": 7.75, "Huntington Beach": 7.75, "Huntington Park": 10.25,
  // I
  "Indio": 8.75, "Inglewood": 10.25, "Irvine": 7.75,
  // J
  "Jurupa Valley": 8.75,
  // L
  "La Mesa": 8.25, "La Mirada": 10.25, "La Puente": 10.25, "La Quinta": 8.75,
  "Laguna Beach": 7.75, "Laguna Niguel": 7.75, "Lake Elsinore": 8.75,
  "Lake Forest": 7.75, "Lakewood": 10.25, "Lancaster": 11.25, "Lodi": 8.25,
  "Lompoc": 7.75, "Long Beach": 10.25, "Los Angeles": 10.25, "Los Gatos": 9.25,
  // M
  "Madera": 8.25, "Manteca": 8.25, "Martinez": 9.75, "Menifee": 7.75,
  "Merced": 8.75, "Milpitas": 9.375, "Mission Viejo": 7.75, "Modesto": 7.875,
  "Montclair": 9.0, "Montebello": 10.25, "Monterey": 9.25, "Monterey Park": 10.25,
  "Moorpark": 7.25, "Moreno Valley": 8.75, "Morgan Hill": 9.125, "Mountain View": 9.125,
  // N
  "Napa": 8.5, "National City": 9.25, "Newbury Park": 7.25, "Newport Beach": 7.75,
  "Norwalk": 10.25, "Novato": 8.25,
  // O
  "Oakland": 10.25, "Oceanside": 7.75, "Ontario": 8.75, "Orange": 7.75,
  "Oxnard": 8.25,
  // P
  "Palmdale": 11.25, "Palo Alto": 9.125, "Paramount": 10.25, "Pasadena": 10.25,
  "Perris": 8.75, "Petaluma": 9.25, "Pico Rivera": 10.25, "Pittsburg": 9.25,
  "Placentia": 7.75, "Pleasanton": 10.25, "Pomona": 10.25,
  // R
  "Rancho Cordova": 8.75, "Rancho Cucamonga": 7.75, "Redding": 7.25,
  "Redlands": 8.75, "Redondo Beach": 10.25, "Redwood City": 9.75, "Rialto": 8.75,
  "Richmond": 9.25, "Riverside": 8.75, "Rocklin": 7.25, "Rosemead": 10.25,
  "Roseville": 7.75,
  // S
  "Sacramento": 8.75, "Salinas": 9.25, "San Bernardino": 8.75,
  "San Bruno": 9.25, "San Buenaventura (Ventura)": 7.25, "San Diego": 7.75,
  "San Francisco": 8.625, "San Jose": 9.375, "San Leandro": 10.75,
  "San Marcos": 8.75, "San Mateo": 9.625, "San Ramon": 9.25,
  "Santa Ana": 8.75, "Santa Barbara": 8.75, "Santa Clara": 9.375,
  "Santa Clarita": 10.25, "Santa Cruz": 9.75, "Santa Maria": 8.75,
  "Santa Monica": 10.25, "Santa Rosa": 9.25, "Simi Valley": 7.25,
  "South Gate": 10.25, "Stockton": 9.0, "Sunnyvale": 9.125,
  // T
  "Temecula": 8.75, "Thousand Oaks": 7.25, "Torrance": 10.25, "Tracy": 8.25,
  "Tulare": 8.75, "Turlock": 8.625,
  // U
  "Upland": 8.75,
  // V
  "Vacaville": 7.75, "Vallejo": 8.375, "Victorville": 8.75, "Visalia": 7.975,
  "Vista": 7.75,
  // W
  "Walnut Creek": 9.25, "West Covina": 10.25, "West Hollywood": 10.25,
  "Westminster": 8.75, "Whittier": 10.25, "Woodland": 8.25,
  // Y
  "Yorba Linda": 7.75,
};

const CA_COUNTIES: Record<string, number> = {
  "Alameda County": 10.25, "Alpine County": 7.25, "Amador County": 7.75,
  "Butte County": 7.25, "Calaveras County": 7.25, "Colusa County": 7.25,
  "Contra Costa County": 9.25, "Del Norte County": 7.25, "El Dorado County": 7.25,
  "Fresno County": 7.975, "Glenn County": 7.25, "Humboldt County": 7.75,
  "Imperial County": 7.75, "Inyo County": 7.75, "Kern County": 7.25,
  "Kings County": 7.25, "Lake County": 7.875, "Lassen County": 7.25,
  "Los Angeles County": 10.25, "Madera County": 7.75, "Marin County": 8.25,
  "Mariposa County": 7.75, "Mendocino County": 7.875, "Merced County": 7.75,
  "Modoc County": 7.25, "Mono County": 7.75, "Monterey County": 9.25,
  "Napa County": 7.75, "Nevada County": 7.5, "Orange County": 7.75,
  "Placer County": 7.25, "Plumas County": 7.25, "Riverside County": 7.75,
  "Sacramento County": 7.75, "San Benito County": 8.75, "San Bernardino County": 7.75,
  "San Diego County": 7.75, "San Francisco County": 8.625, "San Joaquin County": 7.75,
  "San Luis Obispo County": 7.25, "San Mateo County": 9.375, "Santa Barbara County": 7.75,
  "Santa Clara County": 9.125, "Santa Cruz County": 9.0, "Shasta County": 7.25,
  "Sierra County": 7.25, "Siskiyou County": 7.25, "Solano County": 7.375,
  "Sonoma County": 9.25, "Stanislaus County": 7.875, "Sutter County": 7.25,
  "Tehama County": 7.25, "Trinity County": 7.25, "Tulare County": 7.75,
  "Tuolumne County": 7.25, "Ventura County": 7.25, "Yolo County": 7.25,
  "Yuba County": 8.25,
};

const ALL_LOCATIONS = { ...CA_CITIES, ...CA_COUNTIES };
const LOCATION_NAMES = Object.keys(ALL_LOCATIONS).sort();

// Exempt categories
const EXEMPTIONS = [
  { category: "Groceries (unprepared food)", status: "Exempt", detail: "Most grocery items including raw produce, meats, dairy, bread" },
  { category: "Prescription drugs", status: "Exempt", detail: "FDA-approved prescription medications" },
  { category: "Medical devices (Rx)", status: "Exempt", detail: "Prescription medical devices and equipment" },
  { category: "Restaurant / prepared food", status: "Taxable", detail: "Hot food, dine-in meals, takeout, and food sold to eat immediately" },
  { category: "Clothing", status: "Taxable", detail: "All clothing and footwear (unlike some states, CA taxes clothing)" },
  { category: "Motor vehicles", status: "Taxable", detail: "Cars, trucks, motorcycles — taxed at the rate where registered" },
  { category: "Electronics", status: "Taxable", detail: "Phones, computers, TVs, and consumer electronics" },
  { category: "Alcohol & tobacco", status: "Taxable", detail: "All beer, wine, spirits, and tobacco products" },
  { category: "Over-the-counter drugs", status: "Taxable", detail: "Non-prescription medications" },
  { category: "Services", status: "Generally Exempt", detail: "Most professional services; some exceptions apply" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(v: number, d = 2) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
}
function fmtPct(v: number) { return v.toFixed(3).replace(/\.?0+$/, "") + "%"; }

// ─── Component ───────────────────────────────────────────────────────────────

type CalcMode = "calculator" | "reverse" | "compare" | "rates" | "guide";

export default function SalesTaxCAClient() {
  const [mode, setMode] = useState<CalcMode>("calculator");

  // Main calculator
  const [amount, setAmount] = useState<string>("100");
  const [location, setLocation] = useState<string>("Los Angeles");
  const [search, setSearch] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Reverse calculator
  const [totalPaid, setTotalPaid] = useState<string>("108.25");
  const [revLocation, setRevLocation] = useState<string>("Los Angeles");
  const [revSearch, setRevSearch] = useState<string>("");
  const [showRevDropdown, setShowRevDropdown] = useState(false);

  // Compare
  const [compareAmount, setCompareAmount] = useState<string>("1000");
  const [compareLocations, setCompareLocations] = useState<string[]>(
    ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Anaheim"]
  );

  const filteredLocations = useMemo(() =>
    search.length < 1 ? LOCATION_NAMES.slice(0, 80) :
    LOCATION_NAMES.filter(n => n.toLowerCase().includes(search.toLowerCase())).slice(0, 40),
    [search]
  );

  const filteredRevLocations = useMemo(() =>
    revSearch.length < 1 ? LOCATION_NAMES.slice(0, 80) :
    LOCATION_NAMES.filter(n => n.toLowerCase().includes(revSearch.toLowerCase())).slice(0, 40),
    [revSearch]
  );

  // Main calc
  const rate = ALL_LOCATIONS[location] ?? 7.25;
  const pre = parseFloat(amount) || 0;
  const taxAmt = pre * (rate / 100);
  const total = pre + taxAmt;
  const statePortion = pre * (6 / 100);
  const mandatoryLocal = pre * (1.25 / 100);
  const districtTax = pre * ((rate - 7.25) / 100);

  // Reverse calc
  const revRate = ALL_LOCATIONS[revLocation] ?? 7.25;
  const totalNum = parseFloat(totalPaid) || 0;
  const revPre = totalNum / (1 + revRate / 100);
  const revTax = totalNum - revPre;

  const selectLocation = useCallback((name: string) => {
    setLocation(name);
    setSearch(name);
    setShowDropdown(false);
  }, []);

  const selectRevLocation = useCallback((name: string) => {
    setRevLocation(name);
    setRevSearch(name);
    setShowRevDropdown(false);
  }, []);

  const toggleCompareLocation = useCallback((name: string) => {
    setCompareLocations(prev =>
      prev.includes(name) ? prev.filter(l => l !== name) : prev.length < 8 ? [...prev, name] : prev
    );
  }, []);

  const compareAmt = parseFloat(compareAmount) || 0;
  const compareResults = compareLocations.map(loc => ({
    loc,
    rate: ALL_LOCATIONS[loc] ?? 7.25,
    tax: compareAmt * ((ALL_LOCATIONS[loc] ?? 7.25) / 100),
    total: compareAmt * (1 + (ALL_LOCATIONS[loc] ?? 7.25) / 100),
  })).sort((a, b) => b.rate - a.rate);

  return (
    <>
      <div className="ctx-page">

        {/* ── Hero ── */}
        <header className="ctx-hero">
          <div className="ctx-container">
            <nav className="ctx-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link><span aria-hidden="true">/</span>
              <Link href="/finance">Finance</Link><span aria-hidden="true">/</span>
              <span>California Sales Tax Calculator</span>
            </nav>
            <div className="ctx-hero-body">
              <div className="ctx-hero-left">
                <div className="ctx-badge"><TreePalm size={14} /> California · 2026 Rates · 500+ Cities</div>
                <h1 className="ctx-h1">
                  California<br />
                  <span className="ctx-h1-accent">Sales Tax Calculator</span>
                </h1>
                <p className="ctx-subtitle">
                  Calculate CA sales tax for any city or county. Includes reverse calculator,
                  city comparison, and the complete <strong>2025 California sales tax rate</strong> guide.
                </p>
              </div>
              <div className="ctx-hero-stats">
                <div className="ctx-stat">
                  <span className="ctx-stat-n">7.25%</span>
                  <span className="ctx-stat-l">Statewide Minimum</span>
                </div>
                <div className="ctx-stat">
                  <span className="ctx-stat-n">8.85%</span>
                  <span className="ctx-stat-l">Average Combined</span>
                </div>
                <div className="ctx-stat">
                  <span className="ctx-stat-n">11.25%</span>
                  <span className="ctx-stat-l">Highest (Lancaster)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="ctx-hero-wave" aria-hidden="true">
            <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
              <path d="M0 48 C360 0 1080 48 1440 16 L1440 48 Z" fill="#faf8f5"/>
            </svg>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="ctx-container ctx-main">

          {/* Tabs */}
          <div className="ctx-tabs" role="tablist">
            {([
              { id: "calculator", label: "Calculator", icon: <Calculator size={18} /> },
              { id: "reverse", label: "Reverse", icon: <RotateCcw size={18} /> },
              { id: "compare", label: "Compare Cities", icon: <Scale size={18} /> },
              { id: "rates", label: "All Rates", icon: <List size={18} /> },
              { id: "guide", label: "Guide", icon: <BookOpen size={18} /> },
            ] as { id: CalcMode; label: string; icon: React.ReactNode }[]).map(t => (
              <button key={t.id} role="tab" aria-selected={mode === t.id}
                className={`ctx-tab${mode === t.id ? " ctx-tab--active" : ""}`}
                onClick={() => setMode(t.id)}>
                <span className="ctx-tab-icon">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* ══ CALCULATOR ══ */}
          {mode === "calculator" && (
            <section className="ctx-section">
              <div className="ctx-calc-grid">

                {/* Input panel */}
                <div className="ctx-panel">
                  <h2 className="ctx-panel-title">Enter Details</h2>

                  <label className="ctx-field">
                    <span className="ctx-label">Purchase Amount (before tax)</span>
                    <div className="ctx-input-pre-wrap">
                      <span className="ctx-input-pre">$</span>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="ctx-input ctx-input--prefixed"
                        placeholder="100.00"
                      />
                    </div>
                  </label>

                  <label className="ctx-field">
                    <span className="ctx-label">City or County</span>
                    <div className="ctx-autocomplete">
                      <input
                        type="text"
                        className="ctx-input"
                        value={search || location}
                        onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                        placeholder="Type a city or county…"
                        autoComplete="off"
                      />
                      {showDropdown && (
                        <div className="ctx-dropdown">
                          {filteredLocations.length === 0 && (
                            <div className="ctx-dropdown-empty">No results found</div>
                          )}
                          {filteredLocations.map(name => (
                            <button key={name} className={`ctx-dropdown-item${name === location ? " ctx-dropdown-item--selected" : ""}`}
                              onMouseDown={() => selectLocation(name)}>
                              {name}
                              <span className="ctx-dropdown-rate">{fmtPct(ALL_LOCATIONS[name])}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </label>

                  <div className="ctx-rate-display">
                    <span className="ctx-rate-label">Tax rate for {location}</span>
                    <span className="ctx-rate-value">{fmtPct(rate)}</span>
                  </div>

                  {/* Quick amounts */}
                  <div className="ctx-quick-amounts">
                    <span className="ctx-quick-label">Quick amounts:</span>
                    {[10, 25, 50, 100, 250, 500, 1000, 5000].map(a => (
                      <button key={a} className="ctx-quick-btn" onClick={() => setAmount(String(a))}>
                        ${a.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results panel */}
                <div className="ctx-results">
                  <div className="ctx-result-hero">
                    <div className="ctx-result-row ctx-result-row--big">
                      <span>Sales Tax</span>
                      <span className="ctx-result-tax">{fmt(taxAmt)}</span>
                    </div>
                    <div className="ctx-result-row ctx-result-row--total">
                      <span>Total (tax included)</span>
                      <span>{fmt(total)}</span>
                    </div>
                    <div className="ctx-result-row">
                      <span>Pre-tax price</span>
                      <span>{fmt(pre)}</span>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="ctx-breakdown">
                    <h3 className="ctx-breakdown-title">Tax Breakdown</h3>
                    <div className="ctx-breakdown-bar-wrap">
                      {[
                        { label: "State (6%)", amt: statePortion, color: "#d97559", pct: 6 },
                        { label: "Mandatory Local (1.25%)", amt: mandatoryLocal, color: "#e8a87c", pct: 1.25 },
                        { label: `District Tax (${fmtPct(rate - 7.25)})`, amt: districtTax, color: "#f3c99b", pct: rate - 7.25 },
                      ].map((b, i) => (
                        <div key={i} className="ctx-breakdown-row">
                          <div className="ctx-bd-meta">
                            <span className="ctx-bd-dot" style={{ background: b.color }} />
                            <span className="ctx-bd-label">{b.label}</span>
                            <span className="ctx-bd-amt">{fmt(b.amt)}</span>
                          </div>
                          <div className="ctx-bd-bar-track">
                            <div className="ctx-bd-bar" style={{ width: `${(b.pct / rate) * 100}%`, background: b.color }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="ctx-breakdown-formula">
                      <code>{fmt(pre)} × {fmtPct(rate)} = {fmt(taxAmt)}</code>
                      <code>{fmt(pre)} + {fmt(taxAmt)} = {fmt(total)}</code>
                    </div>
                  </div>

                  {/* Effective cost per dollar */}
                  <div className="ctx-cost-note">
                    Every <strong>$1.00</strong> you spend in {location} costs <strong>{(1 + rate / 100).toFixed(4)}</strong> with tax included.
                  </div>
                </div>
              </div>

              {/* Exemptions quick ref */}
              <div className="ctx-exemptions">
                <h3 className="ctx-exemptions-title">California Sales Tax — What's Taxable vs. Exempt?</h3>
                <div className="ctx-exemptions-grid">
                  {EXEMPTIONS.map(e => (
                    <div key={e.category} className={`ctx-ex-card ctx-ex-card--${e.status === "Exempt" ? "exempt" : e.status === "Taxable" ? "taxable" : "partial"}`}>
                      <div className="ctx-ex-header">
                        <span className="ctx-ex-badge">{e.status}</span>
                        <span className="ctx-ex-cat">{e.category}</span>
                      </div>
                      <p className="ctx-ex-detail">{e.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══ REVERSE CALCULATOR ══ */}
          {mode === "reverse" && (
            <section className="ctx-section">
              <div className="ctx-calc-grid">
                <div className="ctx-panel">
                  <h2 className="ctx-panel-title">Reverse Tax Calculator</h2>
                  <p className="ctx-panel-desc">
                    Already paid? Enter the <strong>total amount</strong> (tax included) and your city to find the pre-tax price and exact tax paid.
                  </p>

                  <label className="ctx-field">
                    <span className="ctx-label">Total Amount Paid (tax included)</span>
                    <div className="ctx-input-pre-wrap">
                      <span className="ctx-input-pre">$</span>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={totalPaid}
                        onChange={e => setTotalPaid(e.target.value)}
                        className="ctx-input ctx-input--prefixed"
                        placeholder="108.25"
                      />
                    </div>
                  </label>

                  <label className="ctx-field">
                    <span className="ctx-label">City or County</span>
                    <div className="ctx-autocomplete">
                      <input
                        type="text"
                        className="ctx-input"
                        value={revSearch || revLocation}
                        onChange={e => { setRevSearch(e.target.value); setShowRevDropdown(true); }}
                        onFocus={() => setShowRevDropdown(true)}
                        onBlur={() => setTimeout(() => setShowRevDropdown(false), 150)}
                        placeholder="Type a city or county…"
                        autoComplete="off"
                      />
                      {showRevDropdown && (
                        <div className="ctx-dropdown">
                          {filteredRevLocations.map(name => (
                            <button key={name} className={`ctx-dropdown-item${name === revLocation ? " ctx-dropdown-item--selected" : ""}`}
                              onMouseDown={() => selectRevLocation(name)}>
                              {name}
                              <span className="ctx-dropdown-rate">{fmtPct(ALL_LOCATIONS[name])}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </label>

                  <div className="ctx-rate-display">
                    <span className="ctx-rate-label">Tax rate for {revLocation}</span>
                    <span className="ctx-rate-value">{fmtPct(revRate)}</span>
                  </div>

                  <div className="ctx-info-box">
                    <strong>Formula:</strong> Pre-tax = Total ÷ (1 + Rate)<br />
                    Pre-tax = {fmt(totalNum)} ÷ {(1 + revRate / 100).toFixed(5)} = {fmt(revPre)}
                  </div>
                </div>

                <div className="ctx-results">
                  <div className="ctx-result-hero">
                    <div className="ctx-result-row ctx-result-row--big">
                      <span>Pre-tax Price</span>
                      <span className="ctx-result-tax">{fmt(revPre)}</span>
                    </div>
                    <div className="ctx-result-row ctx-result-row--total">
                      <span>Tax Paid</span>
                      <span>{fmt(revTax)}</span>
                    </div>
                    <div className="ctx-result-row">
                      <span>Total Paid</span>
                      <span>{fmt(totalNum)}</span>
                    </div>
                  </div>

                  <div className="ctx-breakdown">
                    <h3 className="ctx-breakdown-title">What you paid in tax</h3>
                    <div className="ctx-breakdown-row">
                      <div className="ctx-bd-meta">
                        <span className="ctx-bd-dot" style={{ background: "#d97559" }} />
                        <span className="ctx-bd-label">Tax portion</span>
                        <span className="ctx-bd-amt">{fmt(revTax)}</span>
                      </div>
                      <div className="ctx-bd-bar-track">
                        <div className="ctx-bd-bar" style={{ width: `${(revRate / (100 + revRate)) * 100}%`, background: "#d97559" }} />
                      </div>
                    </div>
                    <div className="ctx-breakdown-row">
                      <div className="ctx-bd-meta">
                        <span className="ctx-bd-dot" style={{ background: "#c5d5b0" }} />
                        <span className="ctx-bd-label">Pre-tax portion</span>
                        <span className="ctx-bd-amt">{fmt(revPre)}</span>
                      </div>
                      <div className="ctx-bd-bar-track">
                        <div className="ctx-bd-bar" style={{ width: `${(100 / (100 + revRate)) * 100}%`, background: "#c5d5b0" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ══ COMPARE CITIES ══ */}
          {mode === "compare" && (
            <section className="ctx-section">
              <h2 className="ctx-panel-title">Compare Sales Tax Across California Cities</h2>

              <label className="ctx-field ctx-field--inline">
                <span className="ctx-label">Purchase Amount ($)</span>
                <div className="ctx-input-pre-wrap" style={{ maxWidth: 220 }}>
                  <span className="ctx-input-pre">$</span>
                  <input type="number" min={0} step={1} value={compareAmount}
                    onChange={e => setCompareAmount(e.target.value)}
                    className="ctx-input ctx-input--prefixed" />
                </div>
              </label>

              <div className="ctx-compare-table-wrap">
                <table className="ctx-compare-table">
                  <thead>
                    <tr>
                      <th>City / County</th>
                      <th>Tax Rate</th>
                      <th>Tax on {fmt(compareAmt, 0)}</th>
                      <th>Total</th>
                      <th>vs. Min Rate</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareResults.map((r, i) => {
                      const extraVsMin = r.tax - compareAmt * (7.25 / 100);
                      return (
                        <tr key={r.loc} className={i === 0 ? "ctx-tr-highest" : ""}>
                          <td className="ctx-td-city">{r.loc}</td>
                          <td className="ctx-td-rate">
                            <div className="ctx-rate-cell">
                              <div className="ctx-rate-bar" style={{ width: `${(r.rate / 12) * 100}%` }} />
                              <span>{fmtPct(r.rate)}</span>
                            </div>
                          </td>
                          <td className="ctx-td-tax">{fmt(r.tax)}</td>
                          <td className="ctx-td-total">{fmt(r.total)}</td>
                          <td className={`ctx-td-extra ${extraVsMin > 0 ? "ctx-td-extra--high" : ""}`}>
                            {extraVsMin > 0 ? `+${fmt(extraVsMin)}` : "—"}
                          </td>
                          <td>
                            <button className="ctx-remove-btn" onClick={() => toggleCompareLocation(r.loc)} aria-label={`Remove ${r.loc}`}><X size={14} /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="ctx-compare-add">
                <span className="ctx-label">Add a city:</span>
                <div className="ctx-compare-chips">
                  {["Sacramento", "Fresno", "Oakland", "Long Beach", "Burbank", "Palmdale", "Lancaster", "Pasadena", "Santa Monica", "Irvine", "Riverside", "Bakersfield"].map(city => (
                    <button key={city}
                      className={`ctx-chip${compareLocations.includes(city) ? " ctx-chip--active" : ""}`}
                      onClick={() => toggleCompareLocation(city)}
                      disabled={!compareLocations.includes(city) && compareLocations.length >= 8}>
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══ ALL RATES ══ */}
          {mode === "rates" && (
            <section className="ctx-section">
              <h2 className="ctx-panel-title">2025 California Sales Tax Rates — Cities & Counties</h2>
              <p className="ctx-panel-desc">Sorted by rate (highest first). Rates effective 2025 per CDTFA Publication 95.</p>
              <div className="ctx-rates-table-wrap">
                <table className="ctx-rates-table">
                  <thead>
                    <tr><th>Location</th><th>Type</th><th>Combined Rate</th><th>Tax on $100</th></tr>
                  </thead>
                  <tbody>
                    {Object.entries(ALL_LOCATIONS)
                      .sort((a, b) => b[1] - a[1])
                      .map(([name, r]) => (
                        <tr key={name}>
                          <td>{name}</td>
                          <td className="ctx-td-type">{name.includes("County") ? "County" : "City"}</td>
                          <td className="ctx-td-rate-cell">
                            <div className="ctx-rate-cell">
                              <div className="ctx-rate-bar" style={{ width: `${(r / 12) * 100}%` }} />
                              <span>{fmtPct(r)}</span>
                            </div>
                          </td>
                          <td className="ctx-td-tax">{fmt(r)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ══ GUIDE ══ */}
          {mode === "guide" && (
            <section className="ctx-section ctx-guide-prose">
              <h2>California Sales Tax: Complete Guide for 2026</h2>
              <p>California has the highest <strong>state-level sales tax rate</strong> in the United States at 6%, but the total combined rate you pay as a consumer is significantly higher once local and district taxes are added. Here is everything you need to know about California sales tax in 2026.</p>
              <h3>How California Sales Tax Works</h3>
              <p>California sales tax is composed of three layers. The state collects a 6% base rate. Every county adds a mandatory 1.00% local tax and a mandatory 0.25% county tax (totaling 1.25%). Together, these create the 7.25% statewide minimum. On top of this, individual cities and counties may add optional district taxes approved by voters, which typically range from 0.125% to 4%.</p>
              <h3>Why Rates Differ Between Cities</h3>
              <p>A city like Los Angeles charges 10.25% while nearby Anaheim charges only 7.75%. The difference — 3% — represents voter-approved district taxes in LA for transportation (Measure R, Measure M), homelessness (Measure H), and other purposes. When California voters approve local ballot measures, they are directly increasing the sales tax in their city or county.</p>
              <h3>What Is and Isn't Taxable in California</h3>
              <p><strong>Exempt from sales tax:</strong> Most unprepared groceries (raw produce, meat, dairy, bread), prescription drugs, and prescription medical devices.</p>
              <p><strong>Taxable:</strong> Prepared food and restaurant meals, clothing and footwear (unlike some states), electronics, motor vehicles, alcohol, tobacco, and over-the-counter medications.</p>
              <p><strong>Services:</strong> Most services are not subject to California sales tax. However, some services that result in a tangible product (like printing, fabrication, or repair) may be taxable.</p>
              <h3>California Sales Tax on Cars</h3>
              <p>Motor vehicles in California are taxed at the rate of the county where the vehicle is registered — not where it was purchased. This is important if you buy a car in a low-tax county but register it in a high-tax county. The tax is paid to the DMV at registration time.</p>
              <h3>Use Tax</h3>
              <p>If you purchase a taxable item outside California (including online) and bring it into California without paying sales tax, you owe California <strong>use tax</strong> at the same rate as your local sales tax rate. Online retailers with nexus in California (effectively all major retailers) collect sales tax automatically. For smaller out-of-state purchases, consumers are technically required to self-report use tax on their California income tax return.</p>
              <h3>California Sales Tax for Businesses</h3>
              <p>Businesses must register with the California Department of Tax and Fee Administration (CDTFA) and obtain a seller's permit before making taxable sales. Retailers collect sales tax from customers and remit it to the CDTFA on a regular filing schedule (monthly, quarterly, or annually depending on revenue). Penalties apply for late filing.</p>
            </section>
          )}

          {/* ── Related Tools ── */}
          <section className="ctx-related-section">
            <h2 className="ctx-section-title">Related Financial Tools</h2>
            <div className="ctx-related-grid">
              {[
                { name: "Canada Sales Tax Calculator", href: "/finance/sales-tax-canada-calculator", desc: "GST, HST, and PST rates for all 13 provinces." },
                { name: "Salary After Tax Calculator", href: "/finance/salary-after-tax-calculator", desc: "Calculate take-home pay for all 50 states." },
                { name: "Bonus Tax Calculator", href: "/finance/bonus-tax-calculator", desc: "Calculate taxes on your annual or performance bonuses." },
                { name: "US Take-Home Pay Calculator", href: "/finance/us-take-home-pay-calculator", desc: "Detailed breakdown of federal and state tax withholdings." }
              ].map(tool => (
                <Link key={tool.href} href={tool.href} className="ctx-related-card">
                  <h3 className="ctx-related-name">{tool.name}</h3>
                  <p className="ctx-related-desc">{tool.desc}</p>
                  <span className="ctx-related-link">Use calculator <ArrowRight size={14} /></span>
                </Link>
              ))}
            </div>
          </section>

        </main>

        {/* ── SEO Article ── */}
        <article className="ctx-article ctx-container">
          <SEOArticle />
        </article>

        {/* ── FAQ ── */}
        <section className="ctx-faq-section ctx-container">
          <FAQSection />
        </section>

        {/* Disclaimer */}
        <div className="ctx-container">
          <div className="ctx-disclaimer">
            <strong>Disclaimer:</strong> Tax rates are sourced from the California Department of Tax and Fee Administration (CDTFA) and are updated periodically. Rates are subject to change. For exact rates, use the CDTFA's official address-based lookup at <a href="https://maps.cdtfa.ca.gov/" target="_blank" rel="noopener noreferrer">maps.cdtfa.ca.gov <ExternalLink size={12} style={{ display: 'inline' }} /></a>. This tool does not constitute tax advice.
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
    <div className="ctx-prose">
      <h2>California Sales Tax Calculator: The Complete 2025 Guide</h2>

      <p>California imposes the highest state-level sales tax in the United States, and when local and district taxes are added on top of the state base, the combined rate in some cities can reach over 11%. Whether you are a consumer trying to budget for a purchase, a business owner collecting and remitting sales tax, or a researcher comparing tax burdens across California cities, this guide — and the <strong>California sales tax calculator</strong> above — gives you everything you need.</p>

      <h3>What Is the Sales Tax Rate in California in 2025?</h3>
      <p>The <strong>California state sales tax rate</strong> is 6.00%. Every sale of tangible personal property in California is subject to this base rate. On top of the state tax, a mandatory 1.25% local tax (1.00% to the county and 0.25% to the county transit fund) is added statewide, bringing the floor to <strong>7.25%</strong>. This 7.25% minimum applies in low-tax areas such as Camarillo, Moorpark, Thousand Oaks, and many rural counties including Alpine, Lassen, and Modoc.</p>
      <p>However, most Californians pay more than 7.25% because their city or county has passed voter-approved district taxes. The statewide average combined rate in 2025 is approximately <strong>8.85%</strong>. The highest rates — 11.25% — are found in Lancaster and Palmdale in Los Angeles County. Burbank charges 10.25%. San Francisco's combined rate is 8.625%.</p>

      <h3>How to Calculate California Sales Tax — Step by Step</h3>
      <p>Calculating California sales tax is straightforward:</p>
      <ol>
        <li>Determine the local combined sales tax rate for the city or county where the purchase occurs.</li>
        <li>Multiply the pre-tax purchase price by the decimal form of the rate. Example: $250 × 0.1025 (Los Angeles at 10.25%) = $25.63 in tax.</li>
        <li>Add the tax to the pre-tax price to get the total: $250 + $25.63 = $275.63.</li>
      </ol>
      <p>For the reverse calculation (finding the pre-tax price from a total that includes tax), divide the total by (1 + rate). A $275.63 total in Los Angeles: $275.63 ÷ 1.1025 = $250.00 pre-tax.</p>

      <h3>California Sales Tax by Major City</h3>
      <p><strong>Los Angeles:</strong> 10.25%. Composed of 6% state, 1% county, 0.25% transit, and 3% in voter-approved district taxes (Measure R 0.5%, Measure M 0.5%, and others). On a $1,000 purchase, tax is $102.50.</p>
      <p><strong>San Francisco:</strong> 8.625%. The city and county charges 1.375% above the 7.25% floor. On a $1,000 purchase, tax is $86.25.</p>
      <p><strong>San Diego:</strong> 7.75%. A relatively low rate — just 0.50% above the statewide minimum. Popular for large purchases among LA and Riverside residents.</p>
      <p><strong>San Jose:</strong> 9.375%. Santa Clara County adds district taxes for transportation and other purposes. On $1,000: $93.75 in tax.</p>
      <p><strong>Sacramento:</strong> 8.75%. The state capital charges 1.5% in district taxes above the 7.25% base.</p>
      <p><strong>Anaheim:</strong> 7.75%. One of the lower rates in Southern California, despite being home to Disneyland and significant tourism revenue.</p>
      <p><strong>Fresno:</strong> 8.35%. Includes a 1.1% district tax above the statewide floor.</p>

      <h3>California Sales Tax on Food</h3>
      <p>One of the most common questions our California sales tax calculator users ask is whether food is taxable. The answer depends on the type of food:</p>
      <p><strong>Exempt (not taxable):</strong> Most unprepared food sold from a grocery store — raw produce, fresh meat and seafood, dairy products, bread, pasta, rice, canned goods, and similar items intended to be prepared and consumed at home. This exemption applies across all California cities and counties.</p>
      <p><strong>Taxable:</strong> Food that is sold hot, sold in a combination meal, sold to be consumed at the location, or considered a luxury/snack food. Restaurant meals, fast food, takeout food, hot deli items, and vending machine food are all taxable at the local combined rate. Candy, certain carbonated drinks, and alcoholic beverages are also taxable even if purchased at a grocery store.</p>
      <p>The line between taxable and exempt food can be surprisingly nuanced. A cold sandwich from a deli is generally exempt; the same sandwich heated in a microwave at the store is taxable. A bag of potato chips is taxable; a bag of pretzels in some contexts is not.</p>

      <h3>California Sales Tax on Cars and Motor Vehicles</h3>
      <p>Motor vehicle purchases are subject to California sales tax, but the rate that applies is the rate of the <strong>county where the vehicle will be registered</strong> — not where it is purchased. If you buy a car from a dealer in San Diego County (7.75%) but register it in Los Angeles County (10.25%), you pay the 10.25% rate.</p>
      <p>The sales tax on a vehicle is typically collected at the point of sale by the dealer, who remits it to the state. For private-party vehicle sales, the tax is paid to the DMV when the vehicle is registered. Certain vehicle transactions may qualify for exemptions, such as transfers between family members.</p>

      <h3>California Sales Tax on Online Purchases</h3>
      <p>Since the US Supreme Court's <em>South Dakota v. Wayfair</em> decision in 2018, online retailers with significant sales into California are required to collect and remit California sales tax, even without a physical presence. California enacted its economic nexus law requiring out-of-state sellers with more than $500,000 in annual California sales to collect tax. In practice, all major online retailers — Amazon, eBay, Walmart.com, and thousands of smaller merchants — now collect California sales tax at checkout based on your delivery address.</p>
      <p>For purchases from very small out-of-state sellers who do not collect California tax, consumers owe use tax at their local rate. Use tax is technically self-reported on the California income tax return (Form 540, line 91).</p>

      <h3>California Use Tax</h3>
      <p>California use tax applies when you purchase a taxable item outside California (or from an out-of-state seller who does not collect CA tax) and use it in California. The use tax rate is identical to the local sales tax rate where you live. Use tax prevents a tax advantage for purchasing out of state or online from non-collecting sellers versus buying locally.</p>
      <p>Common use tax situations: buying a car in Nevada and bringing it to California; purchasing furniture from a small online retailer that does not collect CA tax; acquiring business equipment at an out-of-state trade show.</p>

      <h3>California Sales Tax Exemptions and Exclusions</h3>
      <p>California provides several important sales tax exemptions. Most food for home preparation is exempt. Prescription drugs and prescription medical devices are exempt. Manufacturing equipment purchased for use in the manufacturing process may qualify for a partial exemption. Agricultural equipment used directly in farming operations is exempt. Utilities such as gas and electricity sold for residential use are exempt in California.</p>
      <p>Sales to the United States government are generally exempt. Sales for resale — where the buyer presents a valid resale certificate — are exempt because the eventual consumer will pay tax at the time of the retail sale.</p>

      <h3>How District Taxes Work in California</h3>
      <p>California's district tax system is unique among US states. Any city, county, or special district can place a sales tax measure on a local ballot. If approved by a simple majority vote (or two-thirds for dedicated-purpose taxes), the district tax is added on top of the statewide 7.25% floor. District taxes are collected by the CDTFA on behalf of the local jurisdiction and are commonly used for transportation infrastructure, public safety, homelessness programs, and general city/county operations.</p>
      <p>This is why you can drive 20 miles in Southern California and see the sales tax rate change from 7.75% in one city to 10.25% in the next. Each city's rate reflects its voters' decisions about local taxation.</p>

      <h3>Tips for Minimizing California Sales Tax</h3>
      <p>While you cannot legally avoid paying the correct sales tax on taxable purchases, there are lawful strategies to minimize your sales tax burden. Buying large-ticket items — cars, furniture, electronics — in lower-tax cities can produce meaningful savings. Registering a business and purchasing inventory for resale eliminates sales tax on wholesale purchases. Understanding what is exempt — particularly food and prescription drugs — helps with household budgeting. And for businesses, properly claiming manufacturing or agricultural equipment exemptions can significantly reduce operating costs.</p>
    </div>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────────────────────

const FAQS = [
  { q: "What is the sales tax rate in California 2025?", a: "The California state sales tax rate is 6.00%. With the mandatory 1.25% local addition, the floor is 7.25% — the highest state minimum rate in the US. Most cities add district taxes, pushing the average combined rate to approximately 8.85%. The highest combined rate in 2025 is 11.25% in Lancaster and Palmdale." },
  { q: "How do I calculate sales tax in California?", a: "Multiply the pre-tax price by the local combined rate: Tax = Price × Rate. For example, in San Jose (9.375%): $500 × 0.09375 = $46.88 in tax, for a total of $546.88. Use the calculator above for any California city." },
  { q: "What is the sales tax in Los Angeles?", a: "The Los Angeles sales tax rate is 10.25% in 2025. This includes 6% California state tax, 1.25% mandatory local tax, and 3% in voter-approved district taxes including Measure R (transportation), Measure M (Metro), and Measure H (homelessness)." },
  { q: "What is the sales tax in San Francisco?", a: "San Francisco's combined sales tax rate is 8.625% in 2025 — composed of the 7.25% California base plus 1.375% in city/county district taxes." },
  { q: "Is food taxable in California?", a: "Most grocery store food (raw produce, meats, dairy, bread) is exempt from California sales tax. Prepared food, restaurant meals, hot food, and food sold to eat immediately are taxable at the full local rate." },
  { q: "What is the reverse sales tax formula for California?", a: "Pre-tax Price = Total Price ÷ (1 + Rate). In San Diego (7.75%): $107.75 total ÷ 1.0775 = $100.00 pre-tax. Use the Reverse Calculator tab above for any city." },
  { q: "How does California sales tax work for online purchases?", a: "All major online retailers collect California sales tax based on your delivery address. Small out-of-state sellers may not collect tax — in that case, you owe California use tax at your local rate, technically self-reported on your state income tax return." },
  { q: "What city in California has the highest sales tax?", a: "As of 2025, Lancaster and Palmdale in Los Angeles County have the highest California sales tax rate at 11.25%. Burbank and many other LA cities charge 10.25%." },
  { q: "What city in California has the lowest sales tax?", a: "Many rural and suburban California cities and counties have the minimum rate of 7.25%, including Camarillo, Moorpark, Thousand Oaks, Auburn, Redding, and all of Alpine County." },
  { q: "Do I pay sales tax on a used car in California?", a: "Yes. Used car purchases in California are subject to sales tax at the rate of the county where the vehicle will be registered. For a private-party sale, tax is paid to the DMV at the time of registration transfer." },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="ctx-faq-inner">
      <h2 className="ctx-section-title">Frequently Asked Questions</h2>
      <div className="ctx-faq-list">
        {FAQS.map((f, i) => (
          <div key={i} className={`ctx-faq-item${open === i ? " ctx-faq-item--open" : ""}`}>
            <button className="ctx-faq-q" onClick={() => setOpen(open === i ? null : i)}>
              <span>{f.q}</span>
              <span className="ctx-faq-chevron">{open === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
            </button>
            {open === i && <p className="ctx-faq-a">{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
  /* ── Base ── */
  .ctx-page {
    font-family: 'Georgia', 'Times New Roman', serif;
    background: #faf8f5;
    color: #2c1f14;
    min-height: 100vh;
  }
  .ctx-container { max-width: 1120px; margin: 0 auto; padding: 0 1.25rem; }

  /* ── Hero ── */
  .ctx-hero {
    background: linear-gradient(160deg, #d97559 0%, #c45e3e 40%, #a8432a 100%);
    color: #fff;
    padding: 2.75rem 0 0;
    position: relative;
    overflow: hidden;
  }
  .ctx-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }
  .ctx-breadcrumb { display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem; color: rgba(255,255,255,0.65); margin-bottom: 2rem; }
  .ctx-breadcrumb a { color: rgba(255,255,255,0.85); text-decoration: none; }
  .ctx-breadcrumb a:hover { color: #fff; }
  .ctx-hero-body { display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; flex-wrap: wrap; padding-bottom: 3rem; }
  .ctx-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    backdrop-filter: blur(4px);
    color: #fff;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    padding: 0.3rem 0.85rem;
    border-radius: 2px;
    margin-bottom: 1rem;
    font-family: 'Courier New', monospace;
  }
  .ctx-h1 {
    font-size: clamp(2rem, 5.5vw, 3.5rem);
    font-weight: 700;
    line-height: 1.1;
    margin: 0 0 1rem;
    letter-spacing: -0.02em;
    color: #fff;
  }
  .ctx-h1-accent { color: #ffe8c8; }
  .ctx-subtitle { font-size: 1rem; color: rgba(255,255,255,0.82); max-width: 500px; line-height: 1.6; margin: 0; }
  .ctx-subtitle strong { color: #fff; }

  .ctx-hero-stats { display: flex; gap: 1.5rem; flex-shrink: 0; }
  .ctx-stat { text-align: center; }
  .ctx-stat-n { display: block; font-size: 1.6rem; font-weight: 800; color: #fff; font-family: 'Courier New', monospace; letter-spacing: -0.03em; }
  .ctx-stat-l { display: block; font-size: 0.68rem; color: rgba(255,255,255,0.65); letter-spacing: 0.06em; text-transform: uppercase; margin-top: 0.2rem; }

  .ctx-hero-wave { display: block; width: 100%; line-height: 0; }
  .ctx-hero-wave svg { width: 100%; height: 48px; display: block; }

  /* ── Main ── */
  .ctx-main { padding: 2rem 1.25rem; }

  /* ── Tabs ── */
  .ctx-tabs { display: flex; gap: 0; margin-bottom: 2rem; border-bottom: 2px solid #e8e0d6; flex-wrap: wrap; }
  .ctx-tab {
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    padding: 0.75rem 1.1rem;
    font-size: 0.875rem;
    cursor: pointer;
    color: #8a7060;
    font-family: inherit;
    transition: color 0.15s, border-color 0.15s;
    white-space: nowrap;
    display: flex;
    align-items: center;
  }
  .ctx-tab:hover { color: #2c1f14; }
  .ctx-tab--active { color: #d97559; border-bottom-color: #d97559; font-weight: 600; }
  .ctx-tab-icon { display: inline-flex; align-items: center; margin-right: 0.5rem; opacity: 0.7; }
  .ctx-tab--active .ctx-tab-icon { opacity: 1; }
  .ctx-badge { display: flex; align-items: center; gap: 0.5rem; }

  /* ── Section ── */
  .ctx-section { }
  .ctx-calc-grid { display: grid; grid-template-columns: 360px 1fr; gap: 1.5rem; align-items: start; margin-bottom: 2rem; }

  /* ── Panel ── */
  .ctx-panel {
    background: #fff;
    border: 1px solid #e8e0d6;
    border-radius: 12px;
    padding: 1.75rem;
    box-shadow: 0 2px 12px rgba(44,31,20,0.06);
  }
  .ctx-panel-title { font-size: 1.05rem; font-weight: 700; color: #2c1f14; margin-bottom: 0.35rem; }
  .ctx-panel-desc { font-size: 0.875rem; color: #7a6555; line-height: 1.55; margin-bottom: 1.25rem; }

  /* ── Fields ── */
  .ctx-field { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem; }
  .ctx-field--inline { flex-direction: row; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
  .ctx-label { font-size: 0.78rem; font-weight: 600; color: #6a5545; text-transform: uppercase; letter-spacing: 0.05em; }
  .ctx-input-pre-wrap { display: flex; align-items: center; border: 2px solid #e8e0d6; border-radius: 8px; overflow: hidden; transition: border-color 0.15s; background: #fff; }
  .ctx-input-pre-wrap:focus-within { border-color: #d97559; }
  .ctx-input-pre { padding: 0.6rem 0.75rem; background: #faf4ee; color: #8a7060; font-size: 1rem; font-family: 'Courier New', monospace; border-right: 1px solid #e8e0d6; }
  .ctx-input {
    width: 100%;
    padding: 0.65rem 0.875rem;
    border: 2px solid #e8e0d6;
    border-radius: 8px;
    font-size: 1rem;
    font-family: 'Courier New', monospace;
    color: #2c1f14;
    background: #fff;
    transition: border-color 0.15s;
    outline: none;
  }
  .ctx-input--prefixed { border: none; border-radius: 0; flex: 1; }
  .ctx-input:focus { border-color: #d97559; }

  /* ── Autocomplete ── */
  .ctx-autocomplete { position: relative; }
  .ctx-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0; right: 0;
    background: #fff;
    border: 1px solid #e8e0d6;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(44,31,20,0.15);
    z-index: 100;
    max-height: 280px;
    overflow-y: auto;
  }
  .ctx-dropdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    text-align: left;
    padding: 0.55rem 0.875rem;
    font-size: 0.875rem;
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    color: #2c1f14;
    transition: background 0.1s;
  }
  .ctx-dropdown-item:hover, .ctx-dropdown-item--selected { background: #faf4ee; }
  .ctx-dropdown-rate { font-size: 0.75rem; color: #d97559; font-family: 'Courier New', monospace; font-weight: 700; }
  .ctx-dropdown-empty { padding: 1rem; font-size: 0.875rem; color: #8a7060; text-align: center; }

  .ctx-rate-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #faf4ee;
    border: 1px solid #f0e4d4;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    margin-bottom: 1.25rem;
  }
  .ctx-rate-label { font-size: 0.82rem; color: #7a6555; }
  .ctx-rate-value { font-size: 1.35rem; font-weight: 800; color: #d97559; font-family: 'Courier New', monospace; }

  /* ── Quick amounts ── */
  .ctx-quick-amounts { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; }
  .ctx-quick-label { font-size: 0.72rem; color: #8a7060; text-transform: uppercase; letter-spacing: 0.05em; margin-right: 0.25rem; }
  .ctx-quick-btn {
    background: #faf4ee;
    border: 1px solid #e8d8c8;
    border-radius: 5px;
    padding: 0.3rem 0.6rem;
    font-size: 0.78rem;
    cursor: pointer;
    font-family: 'Courier New', monospace;
    color: #5a3a25;
    transition: all 0.12s;
  }
  .ctx-quick-btn:hover { background: #d97559; color: #fff; border-color: #d97559; }

  /* ── Results ── */
  .ctx-results { display: flex; flex-direction: column; gap: 1rem; }
  .ctx-result-hero {
    background: #fff;
    border: 1px solid #e8e0d6;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(44,31,20,0.06);
  }
  .ctx-result-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.875rem 1.25rem;
    font-size: 0.95rem;
    color: #5a4535;
    border-bottom: 1px solid #f0ebe4;
  }
  .ctx-result-row:last-child { border-bottom: none; }
  .ctx-result-row--big { font-size: 1.1rem; font-weight: 600; background: #fdf7f2; }
  .ctx-result-row--total { font-size: 1.25rem; font-weight: 700; background: #d97559; color: #fff; }
  .ctx-result-tax { font-size: 1.6rem; font-weight: 900; color: #d97559; font-family: 'Courier New', monospace; }
  .ctx-result-row--total .ctx-result-tax { color: #fff; }

  /* ── Breakdown ── */
  .ctx-breakdown {
    background: #fff;
    border: 1px solid #e8e0d6;
    border-radius: 12px;
    padding: 1.25rem;
    box-shadow: 0 2px 8px rgba(44,31,20,0.04);
  }
  .ctx-breakdown-title { font-size: 0.82rem; font-weight: 700; color: #6a5545; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 1rem; }
  .ctx-breakdown-row { margin-bottom: 0.875rem; }
  .ctx-breakdown-row:last-of-type { margin-bottom: 0; }
  .ctx-bd-meta { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem; }
  .ctx-bd-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .ctx-bd-label { flex: 1; font-size: 0.82rem; color: #5a4535; }
  .ctx-bd-amt { font-size: 0.875rem; font-weight: 700; color: #2c1f14; font-family: 'Courier New', monospace; }
  .ctx-bd-bar-track { height: 6px; background: #f0ebe4; border-radius: 99px; overflow: hidden; }
  .ctx-bd-bar { height: 100%; border-radius: 99px; transition: width 0.5s; }
  .ctx-breakdown-formula {
    background: #faf4ee;
    border-radius: 6px;
    padding: 0.75rem;
    margin-top: 0.875rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .ctx-breakdown-formula code { font-family: 'Courier New', monospace; font-size: 0.82rem; color: #5a3a25; }
  .ctx-cost-note { font-size: 0.82rem; color: #7a6555; background: #fff; border: 1px solid #e8e0d6; border-radius: 8px; padding: 0.75rem 1rem; text-align: center; }
  .ctx-cost-note strong { color: #d97559; }

  /* ── Exemptions ── */
  .ctx-exemptions { margin-top: 2rem; }
  .ctx-exemptions-title { font-size: 1rem; font-weight: 700; color: #2c1f14; margin-bottom: 1rem; }
  .ctx-exemptions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem; }
  .ctx-ex-card { background: #fff; border: 1px solid #e8e0d6; border-radius: 8px; padding: 0.875rem 1rem; border-left-width: 4px; }
  .ctx-ex-card--exempt { border-left-color: #6aaf72; }
  .ctx-ex-card--taxable { border-left-color: #d97559; }
  .ctx-ex-card--partial { border-left-color: #e8b84d; }
  .ctx-ex-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; flex-wrap: wrap; }
  .ctx-ex-badge { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 0.15rem 0.5rem; border-radius: 3px; }
  .ctx-ex-card--exempt .ctx-ex-badge { background: #e8f5e9; color: #2e7d32; }
  .ctx-ex-card--taxable .ctx-ex-badge { background: #fdeee8; color: #c45e3e; }
  .ctx-ex-card--partial .ctx-ex-badge { background: #fff8e1; color: #a07020; }
  .ctx-ex-cat { font-size: 0.82rem; font-weight: 600; color: #2c1f14; }
  .ctx-ex-detail { font-size: 0.75rem; color: #7a6555; margin: 0; line-height: 1.45; }

  /* ── Related Section ── */
  .ctx-related-section { margin-top: 4rem; padding-top: 3rem; border-top: 1px solid #e8e0d6; }
  .ctx-related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; }
  .ctx-related-card {
    background: #fff;
    border: 1px solid #e8e0d6;
    border-radius: 12px;
    padding: 1.5rem;
    text-decoration: none;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .ctx-related-card:hover {
    border-color: #d97559;
    box-shadow: 0 4px 20px rgba(217,117,89,0.12);
    transform: translateY(-2px);
  }
  .ctx-related-name { font-size: 1.1rem; font-weight: 700; color: #2c1f14; margin: 0; }
  .ctx-related-desc { font-size: 0.875rem; color: #7a6555; line-height: 1.5; margin: 0; flex: 1; }
  .ctx-related-link { font-size: 0.82rem; font-weight: 600; color: #d97559; }

  /* ── Info box ── */
  .ctx-info-box {
    background: #faf4ee;
    border: 1px solid #f0e4d4;
    border-radius: 8px;
    padding: 0.875rem 1rem;
    font-size: 0.82rem;
    color: #5a4535;
    line-height: 1.55;
    margin-top: 1rem;
  }
  .ctx-info-box strong { color: #2c1f14; }

  /* ── Compare table ── */
  .ctx-compare-table-wrap { overflow-x: auto; margin-bottom: 1.5rem; }
  .ctx-compare-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(44,31,20,0.06); }
  .ctx-compare-table th { background: #2c1f14; color: #f0e8d8; padding: 0.75rem 1rem; text-align: left; font-size: 0.72rem; letter-spacing: 0.07em; text-transform: uppercase; font-family: 'Courier New', monospace; }
  .ctx-compare-table td { padding: 0.7rem 1rem; border-bottom: 1px solid #f0ebe4; color: #5a4535; }
  .ctx-compare-table tr:last-child td { border-bottom: none; }
  .ctx-compare-table tr:hover td { background: #fdf7f2; }
  .ctx-tr-highest td { background: #fdeee8; }
  .ctx-td-city { font-weight: 600; color: #2c1f14; }
  .ctx-td-rate { min-width: 120px; }
  .ctx-rate-cell { display: flex; align-items: center; gap: 0.5rem; }
  .ctx-rate-bar { height: 8px; background: #d97559; border-radius: 99px; min-width: 2px; }
  .ctx-td-tax { font-family: 'Courier New', monospace; font-weight: 700; color: #d97559; }
  .ctx-td-total { font-family: 'Courier New', monospace; font-weight: 600; color: #2c1f14; }
  .ctx-td-extra { font-family: 'Courier New', monospace; font-size: 0.82rem; color: #aaa; }
  .ctx-td-extra--high { color: #c45e3e; font-weight: 600; }
  .ctx-remove-btn { background: none; border: 1px solid #e8e0d6; border-radius: 4px; width: 1.75rem; height: 1.75rem; cursor: pointer; color: #aaa; font-size: 0.75rem; }
  .ctx-remove-btn:hover { border-color: #d97559; color: #d97559; }
  .ctx-compare-add { margin-top: 1rem; }
  .ctx-compare-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
  .ctx-chip {
    background: #faf4ee;
    border: 1px solid #e8d8c8;
    border-radius: 99px;
    padding: 0.3rem 0.875rem;
    font-size: 0.8rem;
    cursor: pointer;
    font-family: inherit;
    color: #5a3a25;
    transition: all 0.12s;
  }
  .ctx-chip:hover:not(:disabled) { background: #d97559; color: #fff; border-color: #d97559; }
  .ctx-chip--active { background: #d97559; color: #fff; border-color: #d97559; }
  .ctx-chip:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Rates table ── */
  .ctx-rates-table-wrap { overflow-x: auto; max-height: 600px; overflow-y: auto; }
  .ctx-rates-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; background: #fff; }
  .ctx-rates-table th { background: #2c1f14; color: #f0e8d8; padding: 0.65rem 0.875rem; text-align: left; font-size: 0.7rem; letter-spacing: 0.07em; text-transform: uppercase; position: sticky; top: 0; z-index: 1; }
  .ctx-rates-table td { padding: 0.5rem 0.875rem; border-bottom: 1px solid #f5f0ea; color: #5a4535; }
  .ctx-rates-table tr:hover td { background: #fdf7f2; }
  .ctx-td-type { font-size: 0.72rem; color: #aaa; text-transform: uppercase; letter-spacing: 0.05em; }
  .ctx-td-rate-cell { min-width: 140px; }
  .ctx-td-tax { font-family: 'Courier New', monospace; font-weight: 600; color: #d97559; }

  /* ── Guide prose ── */
  .ctx-guide-prose h2 { font-size: 1.5rem; color: #2c1f14; margin-bottom: 0.75rem; }
  .ctx-guide-prose h3 { font-size: 1.05rem; color: #d97559; margin: 1.5rem 0 0.5rem; font-weight: 700; }
  .ctx-guide-prose p { line-height: 1.75; color: #5a4535; font-size: 0.92rem; margin-bottom: 0.875rem; }
  .ctx-guide-prose strong { color: #2c1f14; }

  /* ── Article ── */
  .ctx-article { padding: 3rem 1.25rem; border-top: 2px solid #e8e0d6; }
  .ctx-prose h2 { font-size: 1.5rem; color: #2c1f14; margin: 0 0 0.875rem; }
  .ctx-prose h3 { font-size: 1.05rem; color: #d97559; margin: 1.5rem 0 0.5rem; font-weight: 700; }
  .ctx-prose p { line-height: 1.75; color: #5a4535; font-size: 0.92rem; margin-bottom: 0.875rem; }
  .ctx-prose ol { padding-left: 1.5rem; margin-bottom: 1rem; }
  .ctx-prose li { line-height: 1.7; color: #5a4535; font-size: 0.92rem; margin-bottom: 0.35rem; }
  .ctx-prose strong { color: #2c1f14; }
  .ctx-prose em { color: #5a4535; }

  /* ── FAQ ── */
  .ctx-faq-section { padding: 2.5rem 1.25rem 3rem; border-top: 2px solid #e8e0d6; }
  .ctx-faq-inner { max-width: 760px; }
  .ctx-section-title { font-size: 1.3rem; font-weight: 700; color: #2c1f14; margin-bottom: 1.25rem; }
  .ctx-faq-list { display: flex; flex-direction: column; }
  .ctx-faq-item { border-bottom: 1px solid #e8e0d6; }
  .ctx-faq-item--open .ctx-faq-a { display: block; }
  .ctx-faq-q { width: 100%; text-align: left; background: none; border: none; padding: 1rem 0; font-size: 0.92rem; font-weight: 600; color: #2c1f14; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 1rem; font-family: inherit; }
  .ctx-faq-q:hover { color: #d97559; }
  .ctx-faq-chevron { font-size: 1.25rem; color: #d97559; flex-shrink: 0; font-weight: 700; }
  .ctx-faq-a { display: none; padding: 0 0 1rem; line-height: 1.7; color: #5a4535; font-size: 0.9rem; }

  /* ── Disclaimer ── */
  .ctx-disclaimer {
    background: #fff8f0;
    border: 1px solid #f0e4d4;
    border-radius: 8px;
    padding: 1rem 1.25rem;
    font-size: 0.8rem;
    color: #7a6555;
    line-height: 1.6;
    margin: 2rem 0 3rem;
  }
  .ctx-disclaimer strong { color: #2c1f14; }
  .ctx-disclaimer a { color: #d97559; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .ctx-calc-grid { grid-template-columns: 1fr; }
    .ctx-hero-stats { gap: 1rem; }
    .ctx-stat-n { font-size: 1.25rem; }
    .ctx-exemptions-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 520px) {
    .ctx-hero-stats { none; }
    .ctx-tabs { overflow-x: auto; }
    .ctx-tab { padding: 0.6rem 0.7rem; font-size: 0.78rem; }
    .ctx-exemptions-grid { grid-template-columns: 1fr; }
  }
`;
