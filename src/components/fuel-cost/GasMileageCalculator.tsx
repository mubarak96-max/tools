"use client";

import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, ReferenceLine, AreaChart, Area,
} from "recharts";
import { 
  Car, 
  Truck, 
  Bus, 
  Zap, 
  BatteryCharging, 
  Fuel, 
  Map as MapIcon, 
  ArrowLeftRight, 
  Coins, 
  Wind, 
  Gauge, 
  Snowflake, 
  Scale, 
  Wrench, 
  Activity,
  ArrowUp,
  Circle
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const AVG_MPG_US     = 28.2;   // Average new car MPG (EPA 2024)
const AVG_GAS_PRICE  = 3.45;   // USD per gallon (US avg 2024)
const AVG_KM_PER_L   = 12.0;   // Avg L/100km equivalent

const VEHICLE_PRESETS = [
  { label: "Compact Car",        mpg: 32, icon: <Car className="w-4 h-4" /> },
  { label: "Midsize Sedan",      mpg: 28, icon: <Car className="w-4 h-4" /> },
  { label: "SUV / Crossover",    mpg: 24, icon: <Truck className="w-4 h-4" /> },
  { label: "Pickup Truck",       mpg: 19, icon: <Truck className="w-4 h-4" /> },
  { label: "Minivan",            mpg: 22, icon: <Bus className="w-4 h-4" /> },
  { label: "Hybrid",             mpg: 48, icon: <Zap className="w-4 h-4" /> },
  { label: "Plug-in Hybrid",     mpg: 55, icon: <BatteryCharging className="w-4 h-4" /> },
  { label: "Large SUV / Truck",  mpg: 16, icon: <Truck className="w-4 h-4" /> },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const f2 = (n: any) => (isNaN(n) || !isFinite(n)) ? "—" : n.toFixed(2);
const f1 = (n: any) => (isNaN(n) || !isFinite(n)) ? "—" : n.toFixed(1);
const f0 = (n: any) => (isNaN(n) || !isFinite(n)) ? "—" : Math.round(n).toLocaleString();
const fc = (n: any, d = 2) => (isNaN(n) || !isFinite(n)) ? "—" : "$" + n.toFixed(d);

// Conversions
const mpgToL100km   = (mpg: number) => 235.214 / mpg;
const l100kmToMpg   = (l: number)   => 235.214 / l;
const milesToKm     = (mi: number)  => mi * 1.60934;
const kmToMiles     = (km: number)  => km / 1.60934;
const gallonsToL    = (gal: number) => gal * 3.78541;
const lToGallons    = (l: number)   => l / 3.78541;

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#475569", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
      <p style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{label} {label.includes("$") ? "" : "MPG"}</p>
      {payload.map((p: any) => <p key={p.name} style={{ color: p.stroke || "#16a34a" }}>{p.name}: {p.value?.toFixed ? "$" + p.value.toFixed(2) : p.value}</p>)}
    </div>
  );
};

// ─── Fuel Gauge SVG ───────────────────────────────────────────────────────────
function FuelGauge({ mpg, units }: { mpg: number; units: string }) {
  const display = units === "metric" ? mpgToL100km(mpg) : mpg;
  const avg     = units === "metric" ? mpgToL100km(AVG_MPG_US) : AVG_MPG_US;
  // For L/100km lower is better, so invert
  const ratio   = units === "metric"
    ? Math.min(2, Math.max(0, (avg * 2 - display) / (avg * 2))) // inverted
    : Math.min(1, Math.max(0, display / (avg * 2)));
  const angle   = -90 + ratio * 180; // -90 (empty) to +90 (full)
  const rad     = (angle * Math.PI) / 180;
  const cx = 100, cy = 95, r = 72;
  const nx = cx + r * Math.cos(rad);
  const ny = cy + r * Math.sin(rad);
  const color = ratio < 0.33 ? "#e05555" : ratio < 0.6 ? "#e8b84b" : "#a8e63d";

  return (
    <svg viewBox="0 0 200 110" width="200" height="110" style={{ overflow: "visible" }}>
      {/* Track arc */}
      <path d="M 28 95 A 72 72 0 0 1 172 95" fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
      {/* Colored fill arc */}
      <path d="M 28 95 A 72 72 0 0 1 172 95" fill="none"
        stroke={color} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={`${ratio * 226} 226`}
        style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.4,0,0.2,1), stroke 0.3s" }}
      />
      {/* Needle */}
      <line x1={cx} y1={cy}
        x2={nx} y2={ny}
        stroke={color} strokeWidth="3" strokeLinecap="round"
        style={{ transition: "x2 0.6s cubic-bezier(0.4,0,0.2,1), y2 0.6s cubic-bezier(0.4,0,0.2,1), stroke 0.3s" }}
      />
      <circle cx={cx} cy={cy} r="5" fill={color} style={{ transition: "fill 0.3s" }} />
      {/* Labels */}
      <text x="22" y="108" fontSize="8" fill="#94a3b8" textAnchor="middle">LOW</text>
      <text x="178" y="108" fontSize="8" fill="#94a3b8" textAnchor="middle">HIGH</text>
      <text x="100" y="76" fontSize="9" fill="#94a3b8" textAnchor="middle">AVG</text>
      {/* Avg tick */}
      <line x1="100" y1="79" x2="100" y2="87" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Value */}
      <text x={cx} y={cy - 10} fontSize="20" fill={color} textAnchor="middle" fontFamily="'Barlow Condensed', sans-serif" fontWeight="700"
        style={{ transition: "fill 0.3s" }}>
        {f1(display)}
      </text>
      <text x={cx} y={cy + 6} fontSize="8" fill="#5a6570" textAnchor="middle">
        {units === "metric" ? "L/100km" : "MPG"}
      </text>
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GasMileageCalculator() {
  const [units,      setUnits]      = useState("us");     // "us" | "metric"
  const [mode,       setMode]       = useState("mpg");    // "mpg" | "trip" | "compare"
  
  // MPG calculator
  const [distance,   setDistance]   = useState<number | string>(300);   // miles/km
  const [fuel,       setFuel]       = useState<number | string>(10);    // gallons/litres
  const [gasPrice,   setGasPrice]   = useState<number | string>(3.45);  // $/gal or $/L
  const [preset,     setPreset]     = useState<number | null>(null);

  // Trip calculator
  const [tripDist,   setTripDist]   = useState<number | string>(500);   // miles/km
  const [tripMpg,    setTripMpg]    = useState<number | string>(28);    // mpg or L/100km
  const [tripPrice,  setTripPrice]  = useState<number | string>(3.45);

  // Comparison
  const [car1mpg,    setCar1mpg]    = useState<number | string>(24);
  const [car2mpg,    setCar2mpg]    = useState<number | string>(38);
  const [cmpDist,    setCmpDist]    = useState<number | string>(15000); // annual miles
  const [cmpPrice,   setCmpPrice]   = useState<number | string>(3.45);
  const [car1label,  setCar1label]  = useState("Current Car");
  const [car2label,  setCar2label]  = useState("New Car");

  // ── MPG Calculations ───────────────────────────────────────────────────
  const mpgCalc = useMemo(() => {
    const d  = parseFloat(distance as string) || 0;
    const f  = parseFloat(fuel as string)     || 0;
    const gp = parseFloat(gasPrice as string) || 3.45;
    if (d <= 0 || f <= 0) return null;

    let mpg, costPerMile, costPer100;
    if (units === "us") {
      mpg          = d / f;
      costPerMile  = (gp / mpg);
      costPer100   = costPerMile * 100;
    } else {
      // distance in km, fuel in litres, price in $/L
      const l100km = (f / d) * 100;
      mpg          = l100kmToMpg(l100km);
      costPerMile  = (gp * l100km / 100) / 0.621371; // per km
      costPer100   = gp * l100km; // per 100km
    }
    const l100km     = mpgToL100km(mpg);
    const vsAvg      = ((mpg - AVG_MPG_US) / AVG_MPG_US) * 100;
    const annualCost = costPerMile * (units === "us" ? 15000 : kmToMiles(15000));
    const tankRange  = units === "us" ? mpg * 13 : (100 / l100km) * 50; // 13gal / 50L tank

    return { mpg, l100km, vsAvg, costPerMile, costPer100, annualCost, tankRange };
  }, [distance, fuel, gasPrice, units]);

  // ── Trip Calculations ──────────────────────────────────────────────────
  const tripCalc = useMemo(() => {
    const d   = parseFloat(tripDist as string)  || 0;
    const mpg = parseFloat(tripMpg as string)   || 1;
    const gp  = parseFloat(tripPrice as string) || 3.45;
    if (d <= 0) return null;

    let fuelNeeded, totalCost, costPerMile;
    if (units === "us") {
      fuelNeeded   = d / mpg;
      totalCost    = fuelNeeded * gp;
      costPerMile  = gp / mpg;
    } else {
      // d in km, mpg as L/100km, gp as $/L
      fuelNeeded   = (mpg / 100) * d;
      totalCost    = fuelNeeded * gp;
      costPerMile  = (gp * mpg) / 100; // per km
    }
    const stops     = units === "us" ? Math.ceil(fuelNeeded / 13) : Math.ceil(fuelNeeded / 50);

    return { fuelNeeded, totalCost, costPerMile, stops };
  }, [tripDist, tripMpg, tripPrice, units]);

  // ── Comparison Calculations ────────────────────────────────────────────
  const cmpCalc = useMemo(() => {
    const m1  = parseFloat(car1mpg as string)  || 1;
    const m2  = parseFloat(car2mpg as string)  || 1;
    const mi  = parseFloat(cmpDist as string)  || 0;
    const gp  = parseFloat(cmpPrice as string) || 3.45;

    const annual1  = (mi / m1) * gp;
    const annual2  = (mi / m2) * gp;
    const saving   = annual1 - annual2;
    const saving5  = saving * 5;
    const saving10 = saving * 10;

    // Chart: cost at various annual mileages
    const chartData: any[] = [];
    const stepSize = units === "us" ? 2500 : 4000;
    const maxDist = units === "us" ? 30000 : 50000;
    
    for (let dist = stepSize; dist <= maxDist; dist += stepSize) {
      chartData.push({
        miles: dist.toLocaleString(),
        [car1label]: parseFloat(((dist / m1) * gp).toFixed(0)),
        [car2label]: parseFloat(((dist / m2) * gp).toFixed(0)),
      });
    }

    return { annual1, annual2, saving, saving5, saving10, chartData };
  }, [car1mpg, car2mpg, cmpDist, cmpPrice, car1label, car2label, units]);

  const distLabel  = units === "us" ? "miles"   : "km";
  const fuelLabel  = units === "us" ? "gallons" : "litres";
  const mpgLabel   = units === "us" ? "MPG"     : "L/100km";
  const priceLabel = units === "us" ? "$/gal"   : "$/L";

  const displayMpgValue = mode === "mpg"
    ? mpgCalc?.mpg || 0
    : tripCalc
      ? (units === "us" ? parseFloat(tripMpg as string) : l100kmToMpg(parseFloat(tripMpg as string)))
      : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root {
          --bg:        #ffffff;
          --bg2:       #f8fafc;
          --bg3:       #f1f5f9;
          --surface:   #ffffff;
          --surface2:  #f1f5f9;
          --border:    #e2e8f0;
          --border2:   #cbd5e1;
          --green:     #16a34a;
          --green2:    #15803d;
          --green-dim: #f0fdf4;
          --green-faint:rgba(22,163,74,0.04);
          --text:      #0f172a;
          --muted:     #64748b;
          --muted2:    #475569;
          --red:       #dc2626;
          --amber:     #d97706;
          --blue:      #2563eb;
          --font-d:    'Barlow Condensed', 'Arial Narrow', sans-serif;
          --font-b:    'IBM Plex Sans', sans-serif;
          --font-m:    'IBM Plex Mono', monospace;
          --r:         12px;
          --glow:      0 10px 15px -3px rgba(0, 0, 0, 0.1);
          --glow-sm:   0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .fuel-calc-hud {
          font-family: var(--font-b);
          background: var(--bg);
          color: var(--text);
          -webkit-font-smoothing: antialiased;
          line-height: 1.6;
          position: relative;
          z-index: 1;
          padding: 32px;
          border-radius: var(--r);
          border: 1px solid var(--border);
          box-shadow: var(--glow);
        }

        /* ── Hero HUD ── */
        .hero-hud {
          padding-bottom: 40px;
          border-bottom: 1px solid var(--border);
          display: grid; grid-template-columns: 1fr auto;
          gap: 32px; align-items: center;
        }
        @media(max-width:700px){ .hero-hud { grid-template-columns: 1fr; } }

        .hud-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--green-dim); color: var(--green);
          border: 1px solid rgba(22,163,74,0.2);
          font-size: 0.66rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 4px 11px; border-radius: 4px;
          margin-bottom: 16px; font-family: var(--font-b);
        }
        .hero-hud h2 {
          font-family: var(--font-d);
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          font-weight: 800; line-height: 1.0;
          color: var(--text); text-transform: uppercase;
          letter-spacing: -0.01em; margin-bottom: 14px;
        }
        .hero-hud h2 em { color: var(--green); font-style: normal; }
        .hero-sub { font-size: 0.9rem; color: var(--muted2); max-width: 500px; line-height: 1.7; }

        /* Mode buttons */
        .mode-bar {
          display: flex; gap: 0; border: 1px solid var(--border2);
          border-radius: var(--r); overflow: hidden; margin-top: 24px;
          width: fit-content;
        }
        .mode-btn {
          padding: 9px 20px; font-size: 0.78rem; font-weight: 600;
          border: none; background: transparent; color: var(--muted2);
          cursor: pointer; transition: all 0.15s;
          font-family: var(--font-b); letter-spacing: 0.04em;
          text-transform: uppercase; border-right: 1px solid var(--border2);
          display: flex; align-items: center; gap: 8px;
        }
        .mode-btn:last-child { border-right: none; }
        .mode-btn.active { background: var(--green); color: #0d0e0f; font-weight: 700; }

        /* Units toggle */
        .units-toggle {
          display: flex; gap: 0; border: 1px solid var(--border2);
          border-radius: 6px; overflow: hidden;
        }
        .unit-btn {
          padding: 7px 14px; font-size: 0.74rem; font-weight: 700;
          border: none; background: transparent; color: var(--muted);
          cursor: pointer; transition: all 0.13s;
          font-family: var(--font-b); letter-spacing: 0.06em;
          text-transform: uppercase; border-right: 1px solid var(--border2);
        }
        .unit-btn:last-child { border-right: none; }
        .unit-btn.active { background: var(--surface2); color: var(--green); }

        /* ── Layout ── */
        .calc-grid {
          display: grid; grid-template-columns: 320px 1fr;
          gap: 22px; padding: 28px 0; align-items: start;
        }
        @media(max-width:900px){ .calc-grid { grid-template-columns: 1fr; } }

        /* ── Input card ── */
        .input-card {
          background: var(--surface); border: 1px solid var(--border2);
          border-radius: var(--r); overflow: hidden;
          position: sticky; top: 20px;
          box-shadow: var(--glow-sm);
        }
        @media(max-width:900px){ .input-card { position: static; } }

        .card-cap {
          background: var(--surface2); padding: 14px 20px;
          border-bottom: 1px solid var(--border2);
          display: flex; align-items: center; justify-content: space-between;
        }
        .cap-title {
          font-family: var(--font-d); font-size: 0.82rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em; color: var(--green);
        }

        .card-body { padding: 18px 20px; }

        /* Vehicle presets */
        .preset-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 5px; margin-bottom: 16px;
        }
        .preset-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 9px; border-radius: 6px;
          border: 1px solid var(--border2); background: transparent;
          color: var(--muted2); cursor: pointer; transition: all 0.12s;
          font-family: var(--font-b); font-size: 0.73rem; font-weight: 500;
          text-align: left;
        }
        .preset-btn:hover  { border-color: var(--green); color: var(--text); }
        .preset-btn.active { border-color: var(--green); background: var(--green-dim); color: var(--green); }
        .preset-icon { font-size: 0.95rem; }

        .slabel {
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--green);
          margin: 14px 0 9px; display: flex; align-items: center; gap: 8px;
          font-family: var(--font-b);
        }
        .slabel:first-child { margin-top: 0; }
        .slabel::after { content: ''; flex: 1; height: 1px; background: var(--border); }

        .field { margin-bottom: 12px; }
        .field label {
          display: flex; justify-content: space-between; align-items: baseline;
          font-size: 0.68rem; font-weight: 600; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 5px;
        }
        .f-hint { color: var(--muted); font-weight: 400; text-transform: none; font-size: 0.65rem; }
        .iw {
          display: flex; align-items: center;
          background: var(--bg2); border: 1px solid var(--border2);
          border-radius: 7px; overflow: hidden; transition: border-color 0.13s;
        }
        .iw:focus-within { border-color: var(--green); box-shadow: 0 0 0 2px rgba(168,230,61,0.1); }
        .ipfx {
          padding: 0 10px; height: 36px; font-size: 0.78rem; color: var(--muted);
          background: var(--surface2); border-right: 1px solid var(--border2);
          display: flex; align-items: center; font-family: var(--font-m);
          user-select: none; min-width: 44px; justify-content: center; flex-shrink: 0;
        }
        .iw input, .iw select {
          flex: 1; border: none; background: transparent;
          padding: 0 11px; height: 36px;
          font-family: var(--font-m); font-size: 0.88rem;
          color: var(--text); outline: none;
          width: 100%;
        }
        .iw select { cursor: pointer; }
        .iw select option { background: var(--bg2); }

        /* ── Result panel ── */
        .result-panel { display: flex; flex-direction: column; gap: 18px; }

        /* Big result card */
        .hero-result {
          background: var(--surface); border: 1px solid var(--border2);
          border-radius: var(--r); padding: 24px; box-shadow: var(--glow);
          display: grid; grid-template-columns: auto 1fr; gap: 28px; align-items: center;
        }
        @media(max-width:640px){ .hero-result { grid-template-columns: 1fr; } }

        .result-right { display: flex; flex-direction: column; gap: 12px; }
        .result-big {
          font-family: var(--font-d); font-size: 4.5rem; font-weight: 800;
          color: var(--green); line-height: 1; letter-spacing: -0.02em;
          transition: color 0.3s;
          text-shadow: 0 0 40px rgba(168,230,61,0.3);
        }
        .result-unit {
          font-family: var(--font-d); font-size: 1.2rem; font-weight: 600;
          color: var(--muted2); text-transform: uppercase; letter-spacing: 0.08em;
          margin-left: 6px;
        }
        .result-sub { font-size: 0.8rem; color: var(--muted2); line-height: 1.6; }
        .vs-avg {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.78rem; font-weight: 700; padding: 4px 10px;
          border-radius: 20px; font-family: var(--font-b);
        }
        .vs-avg.good { background: var(--green-dim); color: var(--green); border: 1px solid rgba(168,230,61,0.25); }
        .vs-avg.avg  { background: rgba(232,184,75,0.1); color: var(--amber); border: 1px solid rgba(232,184,75,0.25); }
        .vs-avg.poor { background: rgba(224,85,85,0.1); color: var(--red); border: 1px solid rgba(224,85,85,0.25); }

        /* Stats row */
        .stats-row {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 10px;
          margin-top: 0;
        }
        @media(max-width:700px){ .stats-row { grid-template-columns: 1fr 1fr; } }

        .stat {
          background: var(--bg2); border: 1px solid var(--border);
          border-radius: 8px; padding: 12px 13px;
          transition: border-color 0.15s;
        }
        .stat:hover { border-color: var(--border2); }
        .stat-lbl { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; color: var(--muted); margin-bottom: 5px; }
        .stat-val { font-family: var(--font-d); font-size: 1.5rem; font-weight: 700; color: var(--text); line-height: 1; }
        .stat-sub { font-size: 0.65rem; color: var(--muted); margin-top: 3px; }

        /* Chart card */
        .chart-card {
          background: var(--surface); border: 1px solid var(--border2);
          border-radius: var(--r); padding: 22px;
        }
        .cc-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px; flex-wrap: wrap; gap: 10px;
        }
        .cc-title { font-family: var(--font-d); font-size: 0.9rem; font-weight: 700; color: var(--text); text-transform: uppercase; letter-spacing: 0.06em; }

        /* Comparison card */
        .cmp-card { background: var(--surface); border: 1px solid var(--border2); border-radius: var(--r); padding: 22px; }
        .cmp-car-label {
          background: var(--bg2); border: 1px solid var(--border2); border-radius: 6px;
          padding: 8px 12px; font-family: var(--font-b); font-size: 0.85rem;
          font-weight: 600; color: var(--text); outline: none; width: 100%;
          margin-bottom: 8px;
        }
        .cmp-car-label:focus { border-color: var(--green); }
        .saving-banner {
          background: var(--green-dim); border: 1px solid rgba(168,230,61,0.2);
          border-radius: 8px; padding: 14px 18px; margin-top: 14px;
          display: flex; align-items: center; gap: 12px;
          font-size: 0.88rem; color: var(--green);
        }
        .saving-icon { color: var(--green); flex-shrink: 0; }

        .cbody p { margin-bottom: 14px; }
        .cbody h3 { font-family: var(--font-d); font-size: 1.2rem; font-weight: 700; color: var(--text); margin: 22px 0 9px; text-transform: uppercase; letter-spacing: 0.04em; }
        .cbody strong { color: var(--text); font-weight: 600; }
        .cbody .pill {
          display: inline-block; background: var(--green-dim); color: var(--green);
          font-family: var(--font-m); font-size: 0.78rem; padding: 1px 8px;
          border-radius: 4px; border: 1px solid rgba(168,230,61,0.2); vertical-align: middle;
        }

        .icard {
          background: var(--surface); border: 1px solid var(--border2);
          border-radius: var(--r); padding: 20px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .icard:hover { border-color: var(--green); transform: translateY(-2px); }
        .icard-icon { color: var(--green); margin-bottom: 12px; display: block; }
        .icard h4 { font-family: var(--font-d); font-size: 1rem; font-weight: 700; color: var(--green); margin-bottom: 7px; text-transform: uppercase; letter-spacing: 0.04em; }
        .icard p  { font-size: 0.82rem; color: var(--muted2); line-height: 1.65; }

        .cta-box {
          background: var(--surface); border: 1px solid rgba(168,230,61,0.2);
          border-radius: var(--r); padding: 44px 36px;
          text-align: center; margin: 36px 0 52px;
          position: relative; overflow: hidden;
          box-shadow: var(--glow);
        }
        .cta-box h2 { font-family: var(--font-d); font-size: 2.2rem; color: #fff; margin-bottom: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.01em; }
        .cta-box h2 em { color: var(--green); }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 28px; border-radius: 6px;
          background: var(--green); color: #0d0e0f;
          font-weight: 800; font-size: 0.87rem; font-family: var(--font-b);
          border: none; cursor: pointer; transition: all 0.15s;
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .cta-btn:hover { background: var(--green2); }

        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .anim { animation: fadeUp 0.4s ease both; }
        .d1 { animation-delay: 0.05s; } .d2 { animation-delay: 0.12s; } .d3 { animation-delay: 0.2s; }

        input[type=range] {
          -webkit-appearance: none; width: 100%; height: 3px;
          background: var(--border2); border-radius: 2px;
          outline: none; margin-top: 12px; cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px;
          border-radius: 50%; background: var(--green);
          cursor: pointer; border: 2px solid var(--surface);
          transition: transform 0.12s;
        }
      `}</style>

      <div className="fuel-calc-hud">
        {/* ── HERO HUD ── */}
        <header className="hero-hud anim">
          <div>
            <div className="hud-badge"><Fuel className="w-3 h-3" /> HUD Calculator · US & Metric</div>
            <h2>Gas Mileage<br /><em>Calculator</em></h2>
            <p className="hero-sub">
              Calculate MPG, fuel cost for any trip, and compare fuel economy between vehicles.
              Instant results in US or metric units.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap", alignItems: "center" }}>
              <div className="mode-bar">
                {[
                  { id: "mpg",     label: "MPG Calc", icon: <Fuel className="w-4 h-4" /> },
                  { id: "trip",    label: "Trip Cost", icon: <MapIcon className="w-4 h-4" /> },
                  { id: "compare", label: "Compare",  icon: <ArrowLeftRight className="w-4 h-4" /> }
                ].map((m) => (
                  <button key={m.id} className={`mode-btn ${mode===m.id?"active":""}`} onClick={() => setMode(m.id)}>
                    {m.icon} {m.label}
                  </button>
                ))}
              </div>
              <div className="units-toggle">
                <button className={`unit-btn ${units==="us"?"active":""}`} onClick={() => setUnits("us")}>US</button>
                <button className={`unit-btn ${units==="metric"?"active":""}`} onClick={() => setUnits("metric")}>Metric</button>
              </div>
            </div>
          </div>
          {/* Live mini gauge in hero */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <FuelGauge mpg={displayMpgValue || AVG_MPG_US} units={units} />
            <div style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 4 }}>
              <Activity className="w-3 h-3" /> Efficiency Gauge
            </div>
          </div>
        </header>

        {/* ── CALCULATOR ── */}
        <div className="calc-grid" id="calculator">

          {/* LEFT: Inputs */}
          <div className="input-card anim d1">
            <div className="card-cap">
              <span className="cap-title">
                {mode === "mpg" ? "Calculate MPG" : mode === "trip" ? "Trip Cost" : "Compare Vehicles"}
              </span>
              <span style={{ fontSize: "0.68rem", color: "var(--muted)" }}>
                {units === "us" ? "Imperial" : "Metric"}
              </span>
            </div>
            <div className="card-body">

              {/* ── MPG MODE ── */}
              {mode === "mpg" && (
                <>
                  <div className="slabel" style={{ marginTop: 0 }}>Vehicle Type (Quick Fill)</div>
                  <div className="preset-grid">
                    {VEHICLE_PRESETS.map((p, i) => (
                      <button key={i}
                        className={`preset-btn ${preset === i ? "active" : ""}`}
                        onClick={() => {
                          setPreset(i);
                          if (units === "us") {
                            setDistance(300);
                            setFuel(parseFloat((300 / p.mpg).toFixed(2)));
                          } else {
                            setDistance(483);
                            const l100 = mpgToL100km(p.mpg);
                            setFuel(parseFloat((l100 * 4.83).toFixed(2)));
                          }
                        }}>
                        <span className="preset-icon">{p.icon}</span>
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="slabel">Your Fill-Up Data</div>
                  <div className="field">
                    <label>Distance Travelled <span className="f-hint">Since last fill-up</span></label>
                    <div className="iw"><span className="ipfx">{distLabel}</span>
                      <input type="number" min="0" value={distance} onChange={e => { setDistance(e.target.value); setPreset(null); }} />
                    </div>
                    <input type="range" min="1" max={units==="us"?800:1300} step="1"
                      value={Math.min(parseFloat(distance as string)||0, units==="us"?800:1300)}
                      onChange={e => { setDistance(e.target.value); setPreset(null); }} />
                  </div>
                  <div className="field">
                    <label>Fuel Used <span className="f-hint">To fill tank</span></label>
                    <div className="iw"><span className="ipfx">{fuelLabel}</span>
                      <input type="number" min="0.1" step="0.1" value={fuel} onChange={e => { setFuel(e.target.value); setPreset(null); }} />
                    </div>
                    <input type="range" min="1" max={units==="us"?30:120} step="0.5"
                      value={Math.min(parseFloat(fuel as string)||0, units==="us"?30:120)}
                      onChange={e => { setFuel(e.target.value); setPreset(null); }} />
                  </div>
                  <div className="field">
                    <label>Gas Price <span className="f-hint">{priceLabel}</span></label>
                    <div className="iw"><span className="ipfx">$</span>
                      <input type="number" min="0.01" step="0.01" value={gasPrice} onChange={e => setGasPrice(e.target.value)} />
                    </div>
                    <input type="range" min="1" max={units==="us"?7:3} step="0.01"
                      value={Math.min(parseFloat(gasPrice as string)||0, units==="us"?7:3)}
                      onChange={e => setGasPrice(e.target.value)} />
                  </div>
                </>
              )}

              {/* ── TRIP MODE ── */}
              {mode === "trip" && (
                <>
                  <div className="slabel" style={{ marginTop: 0 }}>Trip Details</div>
                  <div className="field">
                    <label>Trip Distance</label>
                    <div className="iw"><span className="ipfx">{distLabel}</span>
                      <input type="number" min="0" value={tripDist} onChange={e => setTripDist(e.target.value)} />
                    </div>
                    <input type="range" min="10" max={units==="us"?3000:5000} step="10"
                      value={Math.min(parseFloat(tripDist as string)||0, units==="us"?3000:5000)}
                      onChange={e => setTripDist(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Fuel Economy <span className="f-hint">{mpgLabel}</span></label>
                    <div className="iw"><span className="ipfx">{units==="us"?"MPG":"L/100"}</span>
                      <input type="number" min="1" step="0.1" value={tripMpg} onChange={e => setTripMpg(e.target.value)} />
                    </div>
                    <input type="range" min={units==="us"?5:3} max={units==="us"?80:30} step="0.5"
                      value={Math.min(parseFloat(tripMpg as string)||0, units==="us"?80:30)}
                      onChange={e => setTripMpg(e.target.value)} />
                    <div style={{ display: "flex", gap: 5, marginTop: 12, flexWrap: "wrap" }}>
                      {VEHICLE_PRESETS.slice(0,4).map((p,i) => (
                        <button key={i} onClick={() => setTripMpg(units==="us" ? p.mpg : parseFloat(mpgToL100km(p.mpg).toFixed(1)))}
                          style={{ padding: "5px 10px", border: "1px solid var(--border2)", borderRadius: 6, background: "transparent", color: "var(--muted2)", fontSize: "0.72rem", cursor: "pointer", fontFamily: "var(--font-b)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                          {p.icon} {units==="us" ? p.mpg : mpgToL100km(p.mpg).toFixed(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <label>Gas Price <span className="f-hint">{priceLabel}</span></label>
                    <div className="iw"><span className="ipfx">$</span>
                      <input type="number" min="0.01" step="0.01" value={tripPrice} onChange={e => setTripPrice(e.target.value)} />
                    </div>
                  </div>
                </>
              )}

              {/* ── COMPARE MODE ── */}
              {mode === "compare" && (
                <>
                  <div className="slabel" style={{ marginTop: 0 }}>Annual Driving</div>
                  <div className="field">
                    <label>Annual Distance</label>
                    <div className="iw"><span className="ipfx">{distLabel}</span>
                      <input type="number" min="0" value={cmpDist} onChange={e => setCmpDist(e.target.value)} />
                    </div>
                    <input type="range" min="1000" max={units==="us"?30000:50000} step="500"
                      value={Math.min(parseFloat(cmpDist as string)||0, units==="us"?30000:50000)}
                      onChange={e => setCmpDist(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Gas Price <span className="f-hint">{priceLabel}</span></label>
                    <div className="iw"><span className="ipfx">$</span>
                      <input type="number" min="0.01" step="0.01" value={cmpPrice} onChange={e => setCmpPrice(e.target.value)} />
                    </div>
                  </div>

                  <div className="slabel">Vehicle 1</div>
                  <input className="cmp-car-label" value={car1label} onChange={e => setCar1label(e.target.value)} placeholder="Vehicle 1 name" />
                  <div className="field">
                    <label>{mpgLabel}</label>
                    <div className="iw"><span className="ipfx">{units==="us"?"MPG":"L/100"}</span>
                      <input type="number" min="1" step="0.5" value={car1mpg} onChange={e => setCar1mpg(e.target.value)} />
                    </div>
                    <input type="range" min={units==="us"?5:3} max={units==="us"?80:30} step="0.5"
                      value={Math.min(parseFloat(car1mpg as string)||0, units==="us"?80:30)}
                      onChange={e => setCar1mpg(e.target.value)} />
                  </div>

                  <div className="slabel">Vehicle 2</div>
                  <input className="cmp-car-label" value={car2label} onChange={e => setCar2label(e.target.value)} placeholder="Vehicle 2 name" />
                  <div className="field">
                    <label>{mpgLabel}</label>
                    <div className="iw"><span className="ipfx">{units==="us"?"MPG":"L/100"}</span>
                      <input type="number" min="1" step="0.5" value={car2mpg} onChange={e => setCar2mpg(e.target.value)} />
                    </div>
                    <input type="range" min={units==="us"?5:3} max={units==="us"?80:30} step="0.5"
                      value={Math.min(parseFloat(car2mpg as string)||0, units==="us"?80:30)}
                      onChange={e => setCar2mpg(e.target.value)} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="result-panel">

            {/* MPG Results */}
            {mode === "mpg" && (
              <>
                <div className="hero-result anim d2">
                  <FuelGauge mpg={mpgCalc?.mpg || 0} units={units} />
                  <div className="result-right">
                    {mpgCalc ? (
                      <>
                        <div>
                          <span className="result-big">{units === "us" ? f1(mpgCalc.mpg) : f1(mpgCalc.l100km)}</span>
                          <span className="result-unit">{mpgLabel}</span>
                        </div>
                        <div className="result-sub">
                          {units === "us"
                            ? `${f1(mpgCalc.l100km)} L/100km equivalent`
                            : `${f1(mpgCalc.mpg)} MPG equivalent`}
                        </div>
                        <div>
                          <span className={`vs-avg ${mpgCalc.vsAvg >= 10 ? "good" : mpgCalc.vsAvg >= -10 ? "avg" : "poor"}`}>
                            {mpgCalc.vsAvg >= 0 ? "+" : ""}{f1(mpgCalc.vsAvg)}% vs. national avg ({AVG_MPG_US} MPG)
                          </span>
                        </div>
                      </>
                    ) : (
                      <div style={{ color: "var(--muted)", fontSize: "0.88rem" }}>Enter distance and fuel used to calculate MPG.</div>
                    )}
                  </div>
                </div>
                <div className="stats-row anim d2">
                  <div className="stat" style={{ borderColor: "var(--green)" }}>
                    <div className="stat-lbl">Cost per {units==="us"?"Mile":"100km"}</div>
                    <div className="stat-val" style={{ color: "var(--green)" }}>{mpgCalc ? (units==="us" ? fc(mpgCalc.costPerMile) : fc(mpgCalc.costPer100)) : "—"}</div>
                    <div className="stat-sub">At {fc(parseFloat(gasPrice as string)||0)}/{fuelLabel.slice(0,-1)}</div>
                  </div>
                  <div className="stat" style={{ borderColor: "var(--amber)" }}>
                    <div className="stat-lbl">Est. Annual Cost</div>
                    <div className="stat-val" style={{ color: "var(--amber)" }}>{mpgCalc ? fc(mpgCalc.annualCost, 0) : "—"}</div>
                    <div className="stat-sub">At {units==="us"?"15,000 mi":"24,000 km"}/yr</div>
                  </div>
                  <div className="stat">
                    <div className="stat-lbl">Tank Range</div>
                    <div className="stat-val">{mpgCalc ? f0(mpgCalc.tankRange) : "—"}</div>
                    <div className="stat-sub">{units==="us"?"13 gal tank":"50L tank"} est.</div>
                  </div>
                  <div className="stat">
                    <div className="stat-lbl">vs. Average</div>
                    <div className="stat-val" style={{ color: (mpgCalc?.vsAvg ?? 0) >= 0 ? "var(--green)" : "var(--red)", fontSize: "1.3rem" }}>
                      {mpgCalc ? (mpgCalc.vsAvg >= 0 ? "+" : "") + f1(mpgCalc.vsAvg) + "%" : "—"}
                    </div>
                    <div className="stat-sub">Above/below avg</div>
                  </div>
                </div>
              </>
            )}

            {/* Trip Results */}
            {mode === "trip" && (
              <>
                <div className="hero-result anim d2">
                  <FuelGauge
                    mpg={units === "us" ? parseFloat(tripMpg as string)||0 : l100kmToMpg(parseFloat(tripMpg as string)||1)}
                    units={units}
                  />
                  <div className="result-right">
                    {tripCalc ? (
                      <>
                        <div>
                          <span className="result-big">{fc(tripCalc.totalCost)}</span>
                        </div>
                        <div className="result-sub">
                          Total fuel cost for your {parseFloat(tripDist as string).toLocaleString()} {distLabel} trip
                        </div>
                        <div>
                          <span className={`vs-avg avg`}>
                            {tripCalc.stops} fuel stop{tripCalc.stops !== 1 ? "s" : ""} needed
                          </span>
                        </div>
                      </>
                    ) : (
                      <div style={{ color: "var(--muted)", fontSize: "0.88rem" }}>Enter trip distance to calculate cost.</div>
                    )}
                  </div>
                </div>
                <div className="stats-row anim d2">
                  <div className="stat" style={{ borderColor: "var(--green)" }}>
                    <div className="stat-lbl">Total Fuel</div>
                    <div className="stat-val" style={{ color: "var(--green)" }}>{tripCalc ? f1(tripCalc.fuelNeeded) : "—"}</div>
                    <div className="stat-sub">{fuelLabel} needed</div>
                  </div>
                  <div className="stat" style={{ borderColor: "var(--amber)" }}>
                    <div className="stat-lbl">Cost per {units==="us"?"Mile":"km"}</div>
                    <div className="stat-val" style={{ color: "var(--amber)" }}>{tripCalc ? fc(tripCalc.costPerMile) : "—"}</div>
                    <div className="stat-sub">Fuel cost only</div>
                  </div>
                  <div className="stat">
                    <div className="stat-lbl">Gas Price</div>
                    <div className="stat-val">{fc(parseFloat(tripPrice as string)||0)}</div>
                    <div className="stat-sub">per {fuelLabel.slice(0,-1)}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-lbl">Fuel Economy</div>
                    <div className="stat-val">{parseFloat(tripMpg as string)}</div>
                    <div className="stat-sub">{mpgLabel}</div>
                  </div>
                </div>
                {/* Price sensitivity */}
                <div className="chart-card anim d3">
                  <div className="cc-head">
                    <span className="cc-title">Trip Cost vs. Gas Price</span>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart
                      data={Array.from({length:13},(_,i)=>{
                        const gp = 2 + i * 0.25;
                        const tdist = parseFloat(tripDist as string)||0;
                        const tmpg = parseFloat(tripMpg as string)||1;
                        const cost = units==="us" ? (tdist/tmpg)*gp : (tmpg/100)*tdist*gp;
                        return { price: "$" + gp.toFixed(2), "Trip Cost": parseFloat(cost.toFixed(2)) };
                      })}
                      margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#a8e63d" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#a8e63d" stopOpacity={0.02}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="price" tick={{ fontSize:10, fontFamily:"var(--font-m)", fill:"var(--muted)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:10, fontFamily:"var(--font-m)", fill:"var(--muted)" }} axisLine={false} tickLine={false} tickFormatter={v => "$"+v} />
                      <RechartsTooltip content={<ChartTooltip />} />
                      <ReferenceLine x={"$"+parseFloat(tripPrice as string).toFixed(2)} stroke="var(--green)" strokeDasharray="5 3" label={{ value:"Current", fill:"var(--green)", fontSize:10 }} />
                      <Area type="monotone" dataKey="Trip Cost" stroke="var(--green)" fill="url(#tg)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {/* Compare Results */}
            {mode === "compare" && (
              <>
                <div className="cmp-card anim d2">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center", marginBottom: 18 }}>
                    <div style={{ textAlign: "center", padding: "16px", background: "var(--bg2)", borderRadius: 8, border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 6, fontWeight: 700 }}>{car1label}</div>
                      <div style={{ fontFamily: "var(--font-d)", fontSize: "2.5rem", fontWeight: 800, color: "var(--amber)", lineHeight: 1 }}>{parseFloat(car1mpg as string)}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 3 }}>{mpgLabel}</div>
                      <div style={{ fontFamily: "var(--font-m)", fontSize: "0.9rem", color: "var(--text)", marginTop: 8 }}>{fc(cmpCalc.annual1, 0)}/yr</div>
                    </div>
                    <div style={{ textAlign: "center", fontFamily: "var(--font-d)", fontWeight: 800, color: "var(--muted)", fontSize: "1rem", textTransform: "uppercase" }}>VS</div>
                    <div style={{ textAlign: "center", padding: "16px", background: "var(--green-dim)", borderRadius: 8, border: "1px solid rgba(168,230,61,0.25)" }}>
                      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--green)", marginBottom: 6, fontWeight: 700 }}>{car2label}</div>
                      <div style={{ fontFamily: "var(--font-d)", fontSize: "2.5rem", fontWeight: 800, color: "var(--green)", lineHeight: 1 }}>{parseFloat(car2mpg as string)}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--green)", marginTop: 3, opacity: 0.7 }}>{mpgLabel}</div>
                      <div style={{ fontFamily: "var(--font-m)", fontSize: "0.9rem", color: "var(--text)", marginTop: 8 }}>{fc(cmpCalc.annual2, 0)}/yr</div>
                    </div>
                  </div>

                  {cmpCalc.saving > 0 && (
                    <div className="saving-banner">
                      <Coins className="saving-icon w-6 h-6" />
                      <div>
                        <strong>{car2label} saves {fc(cmpCalc.saving, 0)}/year</strong>
                        <div style={{ fontSize: "0.78rem", marginTop: 2, opacity: 0.8 }}>
                          {fc(cmpCalc.saving5, 0)} over 5 years · {fc(cmpCalc.saving10, 0)} over 10 years
                        </div>
                      </div>
                    </div>
                  )}
                  {cmpCalc.saving <= 0 && (
                    <div style={{ background: "rgba(232,184,75,0.08)", border: "1px solid rgba(232,184,75,0.2)", borderRadius: 8, padding: "13px 16px", color: "var(--amber)", fontSize: "0.84rem" }}>
                      {car1label} has similar or better fuel economy. Fuel cost difference is minimal.
                    </div>
                  )}
                </div>
                <div className="chart-card anim d3">
                  <div className="cc-head">
                    <span className="cc-title">Annual Fuel Cost vs. Mileage</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={cmpCalc.chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="miles" tick={{ fontSize:10, fontFamily:"var(--font-m)", fill:"var(--muted)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:10, fontFamily:"var(--font-m)", fill:"var(--muted)" }} axisLine={false} tickLine={false} tickFormatter={v => "$"+v.toLocaleString()} />
                      <RechartsTooltip content={<ChartTooltip />} />
                      <Line type="monotone" dataKey={car1label} stroke="var(--amber)" strokeWidth={2.5} dot={false} />
                      <Line type="monotone" dataKey={car2label} stroke="var(--green)" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ════════ CONTENT SECTIONS ════════ */}

        {/* How to calculate MPG */}
        <section className="csection" style={{ padding: "52px 0", borderTop: "1px solid var(--border2)" }}>
          <div className="hud-badge">The Formula</div>
          <h2 className="hud-title" style={{ fontFamily: "var(--font-d)", fontSize: "2.8rem", fontWeight: 800, color: "#fff", marginBottom: 10, textTransform: "uppercase" }}>How to <em>Calculate MPG</em></h2>
          <p className="hero-sub" style={{ maxWidth: 680, marginBottom: 24 }}>
            Calculating gas mileage is straightforward once you know the formula. Here is everything you need to know — in both US and metric units — including how to get accurate readings from your own vehicle.
          </p>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div className="cbody">
              <h3>The MPG Formula</h3>
              <p>
                Miles per gallon is the simplest measure of fuel efficiency. The formula is:
              </p>
              <p style={{ textAlign: "center", margin: "16px 0" }}>
                <span className="pill">MPG = Miles Driven ÷ Gallons Used</span>
              </p>
              <p>
                To get an accurate reading, fill your tank completely, reset your trip odometer, drive normally until the tank is near empty, then fill up again. Record the number of miles on the odometer and the gallons pumped. Divide miles by gallons — that is your real-world MPG.
              </p>
              <p>
                <strong>Example:</strong> You drove 320 miles and used 11.4 gallons of gas. MPG = 320 ÷ 11.4 = 28.1 MPG. This is your actual observed fuel economy — not the EPA estimate, which is tested in controlled conditions that rarely match real-world driving.
              </p>
            </div>
            <div className="cbody">
              <h3>Why Your Real MPG Differs</h3>
              <p>
                EPA window sticker MPG ratings are tested in a laboratory under specific conditions — controlled temperature, no air conditioning, no cargo, smooth surfaces, predictable acceleration. Real-world driving differs dramatically.
              </p>
              <p>
                <strong>Highway vs. city driving</strong> has the biggest impact. City driving with frequent stops and starts burns far more fuel per mile than steady highway cruising. A car rated 28 MPG combined might achieve 22 MPG in urban stop-and-go and 34 MPG on a long highway trip.
              </p>
            </div>
          </div>
        </section>

        {/* Gas mileage tips */}
        <section className="csection" style={{ padding: "52px 0", borderTop: "1px solid var(--border2)" }}>
          <div className="hud-badge">Fuel Savings</div>
          <h2 style={{ fontFamily: "var(--font-d)", fontSize: "2.8rem", fontWeight: 800, color: "#fff", marginBottom: 10, textTransform: "uppercase" }}>How to <em>Improve MPG</em></h2>
          <p className="hero-sub" style={{ maxWidth: 680, marginBottom: 32 }}>
            Small changes to driving habits and vehicle maintenance can add up to hundreds of dollars in annual fuel savings.
          </p>
          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {[
              {
                icon: <Activity className="w-6 h-6" />,
                title: "Drive Smoothly",
                body: "Aggressive acceleration and hard braking can reduce fuel economy by 15–30% in city driving. Anticipate traffic flow and accelerate gradually."
              },
              {
                icon: <Wind className="w-6 h-6" />,
                title: "Reduce Speed",
                body: "Aerodynamic drag increases with speed. Every 5 mph above 50 mph costs 7–14% in efficiency. Driving 70 mph uses 17% more fuel than 55 mph."
              },
              {
                icon: <Gauge className="w-6 h-6" />,
                title: "Tire Pressure",
                body: "Under-inflated tires by just 10 PSI can reduce fuel economy by up to 3.3%. Check your tire pressure monthly against spec."
              },
              {
                icon: <Snowflake className="w-6 h-6" />,
                title: "AC Usage",
                body: "AC can reduce fuel economy by 5–25%. At highway speeds, AC is better than rolling down windows due to drag, but in city, windows are better."
              },
              {
                icon: <Scale className="w-6 h-6" />,
                title: "Reduce Weight",
                body: "Every 100 lbs of extra cargo reduces MPG by about 1%. Remove unnecessary items and roof racks when not in use to reduce drag."
              },
              {
                icon: <Wrench className="w-6 h-6" />,
                title: "Maintenance",
                body: "A clogged air filter or worn spark plugs can reduce MPG by up to 10%. Regular tune-ups keep all systems operating at peak efficiency."
              },
            ].map(c => (
              <div className="icard" key={c.title}>
                <span className="icard-icon">{c.icon}</span>
                <h4>{c.title}</h4>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="cta-box">
          <h2>Calculate Your <em>Gas Mileage</em></h2>
          <p>Enter your miles and gallons above — get your MPG, fuel cost, and annual savings in seconds.</p>
          <button className="cta-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <ArrowUp className="w-4 h-4" /> Calculate MPG
          </button>
        </div>

        <footer style={{ borderTop: "1px solid var(--border)", padding: "24px 0", textAlign: "center", fontSize: "0.74rem", color: "var(--muted)" }}>
          <p>Gas Mileage Calculator · MPG · Fuel Cost · Trip Calculator · US & Metric Units</p>
          <p style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 12, color: "var(--muted2)" }}>
            <span>HUD Diagnostic Interface v2.0</span>
            <Circle className="w-2 h-2 fill-green-500" />
            <span>Real-time Efficiency Metrics</span>
          </p>
        </footer>
      </div>
    </>
  );
}
