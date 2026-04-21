"use client";

import React, { useState, useMemo } from "react";
import { 
  type PaintInputs, 
  type UnitSystem, 
  type SurfaceType, 
  type PaintType, 
  calculatePaintCoverage 
} from "@/lib/tools/paint-coverage";
import { 
  Paintbrush, Layers, Download, Plus, Minus,
  Info, Home, Palette, Ruler, ShoppingCart, Check, Wand2, Sparkles, TrendingUp
} from "lucide-react";

const COLORS = [
  { name: "Cotton White", hex: "#f8fafc" },
  { name: "Slate Grey", hex: "#64748b" },
  { name: "Ocean Blue", hex: "#0ea5e9" },
  { name: "Sage Green", hex: "#10b981" },
  { name: "Terracotta", hex: "#f43f5e" },
  { name: "Modern Greige", hex: "#d1d5db" },
  { name: "Soft Charcoal", hex: "#334155" },
];

export function PaintCoverageCalculator() {
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [lengthFt, setLengthFt] = useState(12);
  const [widthFt, setWidthFt] = useState(12);
  const [heightFt, setHeightFt] = useState(8);
  const [lengthM, setLengthM] = useState(4);
  const [widthM, setWidthM] = useState(4);
  const [heightM, setHeightM] = useState(2.5);
  const [numDoors, setNumDoors] = useState(1);
  const [numWindows, setNumWindows] = useState(1);
  const [includeCeiling, setIncludeCeiling] = useState(false);
  const [needsPrimer, setNeedsPrimer] = useState(false);
  const [wallColor, setWallColor] = useState(COLORS[0].hex);
  const [surfaceType, setSurfaceType] = useState<SurfaceType>("Drywall");
  const [paintType, setPaintType] = useState<PaintType>("Latex");
  const [numCoats, setNumCoats] = useState(2);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");

  const inputs: PaintInputs = useMemo(() => ({
    system: unit,
    length: unit === "imperial" ? lengthFt : lengthM,
    width: unit === "imperial" ? widthFt : widthM,
    height: unit === "imperial" ? heightFt : heightM,
    paintCeiling: includeCeiling,
    doors: numDoors,
    windows: numWindows,
    coats: numCoats,
    surfaceType,
    paintType,
    pricePerUnit: 45, // Default base price
  }), [unit, lengthFt, widthFt, heightFt, lengthM, widthM, heightM, includeCeiling, numDoors, numWindows, numCoats, surfaceType, paintType]);

  const result = useMemo(() => calculatePaintCoverage(inputs), [inputs]);

  const paintableSqFt = result.totalArea;
  const gallonsRequired = result.paintAmount;
  const primerGallons = result.primerAmount;

  const exportPDF = async () => {
    const { jsPDF } = await import("jspdf/dist/jspdf.es.min.js");
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Paint Coverage Report", 20, 30);
    doc.setFontSize(14);
    doc.text(`Project Summary:`, 20, 45);
    doc.setFontSize(11);
    doc.text(`Surface Area: ${Math.round(paintableSqFt)} ${unit === "imperial" ? "sq ft" : "sq m"}`, 20, 55);
    doc.text(`Finish Paint: ${gallonsRequired.toFixed(2)} ${unit === "imperial" ? "Gallons" : "Liters"}`, 20, 62);
    doc.text(`Primer: ${primerGallons.toFixed(2)} ${unit === "imperial" ? "Gallons" : "Liters"}`, 20, 69);
    doc.text(`Total est. Cost: $${result.estimatedCost.toFixed(2)}`, 20, 76);
    doc.save("paint-estimate.pdf");
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw relative overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_400px] gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">
        {/* Input Sidebar */}
        <div className="p-6 sm:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Room Specifications
            </h3>
            <div className="flex bg-muted/20 border border-border rounded-xl p-1">
               <button 
                onClick={() => setUnit("imperial")}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${unit === "imperial" ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:text-foreground"}`}
               >
                 Imperial
               </button>
               <button 
                onClick={() => setUnit("metric")}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${unit === "metric" ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:text-foreground"}`}
               >
                 Metric
               </button>
            </div>
          </div>

          <div className="grid gap-8">
            <div className="space-y-6">
              <InputSlider 
                label="Room Length" 
                value={unit === "imperial" ? lengthFt : lengthM} 
                unit={unit === "imperial" ? "ft" : "m"} 
                min={1} max={50} step={0.5} 
                onChange={(v) => unit === "imperial" ? setLengthFt(v) : setLengthM(v)} 
              />
              <InputSlider 
                label="Room Width" 
                value={unit === "imperial" ? widthFt : widthM} 
                unit={unit === "imperial" ? "ft" : "m"} 
                min={1} max={50} step={0.5} 
                onChange={(v) => unit === "imperial" ? setWidthFt(v) : setWidthM(v)} 
              />
              <InputSlider 
                label="Wall Height" 
                value={unit === "imperial" ? heightFt : heightM} 
                unit={unit === "imperial" ? "ft" : "m"} 
                min={1} max={20} step={0.5} 
                onChange={(v) => unit === "imperial" ? setHeightFt(v) : setHeightM(v)} 
              />
              <InputSlider 
                label="Number of Coats" 
                value={numCoats} 
                unit="coats" 
                min={1} max={4} step={1} 
                onChange={(v) => setNumCoats(v)} 
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Surface Type</label>
                  <select 
                    value={surfaceType} 
                    onChange={(e) => setSurfaceType(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-2xl border border-border bg-muted/10 font-bold text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Drywall">Smooth Drywall</option>
                    <option value="Plaster">Plaster (+15%)</option>
                    <option value="Masonry">Masonry (+30%)</option>
                    <option value="Wood">Wood (+10%)</option>
                  </select>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Paint Type</label>
                  <select 
                    value={paintType} 
                    onChange={(e) => setPaintType(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-2xl border border-border bg-muted/10 font-bold text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Latex">Water-Based Latex</option>
                    <option value="Oil">Oil-Based Enamel</option>
                    <option value="Acrylic">Acrylic Resin</option>
                  </select>
               </div>
            </div>

            <div className="p-6 bg-muted/10 rounded-[2rem] border border-border grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-muted-foreground">Doors</span>
                      <span className="text-xs font-bold">{numDoors}</span>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => setNumDoors(Math.max(0, numDoors - 1))} className="flex-1 p-2 rounded-xl border border-border bg-background hover:bg-muted transition-all"><Minus className="w-4 h-4 mx-auto" /></button>
                      <button onClick={() => setNumDoors(numDoors + 1)} className="flex-1 p-2 rounded-xl border border-border bg-background hover:bg-muted transition-all"><Plus className="w-4 h-4 mx-auto" /></button>
                   </div>
                </div>
                <div className="flex flex-col gap-2">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-muted-foreground">Windows</span>
                      <span className="text-xs font-bold">{numWindows}</span>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => setNumWindows(Math.max(0, numWindows - 1))} className="flex-1 p-2 rounded-xl border border-border bg-background hover:bg-muted transition-all"><Minus className="w-4 h-4 mx-auto" /></button>
                      <button onClick={() => setNumWindows(numWindows + 1)} className="flex-1 p-2 rounded-xl border border-border bg-background hover:bg-muted transition-all"><Plus className="w-4 h-4 mx-auto" /></button>
                   </div>
                </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background cursor-pointer hover:border-primary/30 transition-all group">
                <input type="checkbox" checked={includeCeiling} onChange={() => setIncludeCeiling(!includeCeiling)} className="w-5 h-5 rounded-lg text-primary focus:ring-primary/20 bg-muted/20 border-border" />
                <div className="flex flex-col">
                   <span className="text-sm font-bold text-foreground">Include Ceiling</span>
                   <span className="text-[10px] text-muted-foreground">Calculate separate coverage for fifth wall</span>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background cursor-pointer hover:border-primary/30 transition-all group">
                <input type="checkbox" checked={needsPrimer} onChange={() => setNeedsPrimer(!needsPrimer)} className="w-5 h-5 rounded-lg text-primary focus:ring-primary/20 bg-muted/20 border-border" />
                <div className="flex flex-col">
                   <span className="text-sm font-bold text-foreground">Estimate Primer</span>
                   <span className="text-[10px] text-muted-foreground">Account for sealing base coat</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="p-6 sm:p-10 bg-muted/10 space-y-10">
          <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Room Visualizer</h3>
                <div className="p-1 rounded-full bg-background border border-border">
                   <div className="w-4 h-4 rounded-full" style={{ backgroundColor: wallColor }} />
                </div>
             </div>

             <div className="aspect-square rounded-[2.5rem] bg-background border border-border shadow-inner relative flex items-center justify-center overflow-hidden">
                <RoomVisualizer 
                  l={unit === "imperial" ? lengthFt : lengthM} 
                  w={unit === "imperial" ? widthFt : widthM} 
                  h={unit === "imperial" ? heightFt : heightM}
                  color={wallColor}
                />
                <div className="absolute top-6 left-6 flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Paintable Area</span>
                  <span className="text-3xl font-black italic tracking-tighter">{Math.round(paintableSqFt)} {unit === "imperial" ? "ft²" : "m²"}</span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex justify-center gap-1.5">
                   {COLORS.map(c => (
                     <button 
                      key={c.hex} 
                      onClick={() => setWallColor(c.hex)}
                      className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-125 ${wallColor === c.hex ? "border-foreground scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                     />
                   ))}
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="grid gap-4">
                <ResultCard 
                  label="Finish Paint" 
                  value={gallonsRequired} 
                  unit={unit === "imperial" ? "gal" : "liters"}
                  icon={<Wand2 className="w-5 h-5 text-primary" />}
                />
                {needsPrimer && (
                  <ResultCard 
                    label="Primer" 
                    value={primerGallons} 
                    unit={unit === "imperial" ? "gal" : "liters"}
                    icon={<Sparkles className="w-5 h-5 text-success" />}
                  />
                )}
             </div>

             <div className="pt-8 border-t border-border space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Shopping Summary</h4>
                <div className="space-y-3">
                   <MaterialRow label="Premium Interior Satin" qty={Math.ceil(gallonsRequired)} price={54.99} />
                   {needsPrimer && <MaterialRow label="High-Hide Primer" qty={Math.ceil(primerGallons)} price={29.99} />}
                   <MaterialRow label="Roller & Tray Kit" qty={1} price={14.99} />
                </div>
                <div className="p-6 rounded-[2rem] bg-foreground text-background">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase opacity-60">Estimated Total</span>
                      <TrendingUp className="w-4 h-4 opacity-50" />
                   </div>
                   <div className="text-4xl font-black italic tracking-tighter">
                      ${(Math.ceil(gallonsRequired) * 54.99 + (needsPrimer ? Math.ceil(primerGallons) * 29.99 : 0) + 14.99).toFixed(2)}
                   </div>
                </div>
             </div>

             <button 
                onClick={exportPDF}
                className="w-full py-5 rounded-[2rem] bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
             >
                <Download className="w-5 h-5" /> Export PDF Estimate
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputSlider({ label, value, unit, min, max, step, onChange }: { label: string, value: number, unit: string, min: number, max: number, step: number, onChange: (v: number) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className="text-xs font-mono font-bold text-primary">{value} {unit}</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
      />
    </div>
  );
}

function ResultCard({ label, value, unit, icon }: { label: string, value: number, unit: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-[2rem] border border-border bg-background shadow-sm flex items-center gap-6">
      <div className="w-14 h-14 rounded-3xl bg-muted/30 flex items-center justify-center shrink-0 text-primary">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-2">
           <span className="text-3xl font-black italic tracking-tighter">{value.toFixed(1)}</span>
           <span className="text-sm font-bold text-muted-foreground">{unit}</span>
        </div>
      </div>
    </div>
  );
}

function MaterialRow({ label, qty, price }: { label: string, qty: number, price: number }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-background text-sm">
      <div className="flex flex-col">
        <span className="font-bold text-foreground line-clamp-1">{label}</span>
        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Qty: {qty} @ ${price}</span>
      </div>
      <span className="font-bold text-primary">${(qty * price).toFixed(2)}</span>
    </div>
  );
}

function RoomVisualizer({ l, w, h, color }: { l: number, w: number, h: number, color: string }) {
  return (
    <svg viewBox="0 0 400 300" className="w-[80%] h-[80%] drop-shadow-2xl overflow-visible">
      <defs>
        <linearGradient id="wall-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Floor */}
      <path d="M 60 220 L 200 270 L 340 220 L 200 170 Z" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2" />
      {/* Back Walls */}
      <path d="M 60 220 L 60 80 L 200 130 L 200 270 Z" fill={color} filter="brightness(0.9)" stroke="rgba(0,0,0,0.1)" />
      <path d="M 200 270 L 200 130 L 340 80 L 340 220 Z" fill={color} filter="brightness(0.8)" stroke="rgba(0,0,0,0.1)" />
      {/* Gloss overlay */}
      <path d="M 200 270 L 200 130 L 340 80 L 340 220 Z" fill="url(#wall-grad)" />
      {/* Dimension Lines */}
      <g className="text-muted-foreground text-[10px] font-bold">
        <line x1="60" y1="230" x2="190" y2="280" stroke="currentColor" strokeDasharray="4" />
        <text x="120" y="275" transform="rotate(20 120 275)">{l}ft</text>
        <line x1="210" y1="280" x2="340" y2="230" stroke="currentColor" strokeDasharray="4" />
        <text x="280" y="275" transform="rotate(-20 280 275)">{w}ft</text>
      </g>
    </svg>
  );
}
