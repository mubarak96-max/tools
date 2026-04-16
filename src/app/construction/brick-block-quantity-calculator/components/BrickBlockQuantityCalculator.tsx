"use client";

import React, { useState, useMemo } from "react";
import { 
  type MasonryInputs, 
  type UnitSystem, 
  type BrickType, 
  type BondingPattern,
  calculateMasonry 
} from "@/lib/tools/brick-calculator";
import { 
  Plus, Minus, Ruler, Download, Trash2, 
  Grid, Move, Info, ShoppingCart, TrendingUp, Sparkles, Check, Database, Boxes
} from "lucide-react";

const BRICK_TYPES: { id: BrickType, label: string, l: number, h: number, d: number, cat: "brick" | "block" }[] = [
  { id: "Modular", label: "US Modular Brick", l: 7.625, h: 2.25, d: 3.625, cat: "brick" },
  { id: "Queen", label: "Queen Size Brick", l: 7.625, h: 2.75, d: 3, cat: "brick" },
  { id: "King", label: "King Size Brick", l: 9.625, h: 2.625, d: 3, cat: "brick" },
  { id: "Standard_Block", label: "8x8x16 CMU Block", l: 15.625, h: 7.625, d: 7.625, cat: "block" },
  { id: "Utility_Block", label: "4x8x16 CMU Block", l: 15.625, h: 7.625, d: 3.625, cat: "block" },
];

const PATTERNS: { id: BondingPattern, label: string }[] = [
  { id: "Running", label: "Running Bond" },
  { id: "Stack", label: "Stack Bond" },
  { id: "Flemish", label: "Flemish Bond" },
];

export function BrickBlockQuantityCalculator() {
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [wallLength, setWallLength] = useState(20);
  const [wallHeight, setWallHeight] = useState(8);
  const [brickTypeId, setBrickTypeId] = useState<BrickType>("Modular");
  const [jointSize, setJointSize] = useState(0.375); // 3/8 inch
  const [pattern, setPattern] = useState<BondingPattern>("Running");
  const [waste, setWaste] = useState(10);
  const [pricePerUnit, setPricePerUnit] = useState(0.85);

  const selectedBrick = BRICK_TYPES.find(b => b.id === brickTypeId)!;

  const inputs: MasonryInputs = useMemo(() => ({
    system: unit,
    wallLength,
    wallHeight,
    brickType: brickTypeId,
    jointSize,
    pattern,
    waste,
    pricePerUnit,
  }), [unit, wallLength, wallHeight, brickTypeId, jointSize, pattern, waste, pricePerUnit]);

  const result = useMemo(() => calculateMasonry(inputs), [inputs]);

  const exportPDF = async () => {
    const { jsPDF } = await import("jspdf/dist/jspdf.es.min.js");
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Masonry Project Estimate", 20, 30);
    doc.setFontSize(14);
    doc.text(`Wall Specifications:`, 20, 45);
    doc.setFontSize(11);
    doc.text(`Dimensions: ${wallLength}ft x ${wallHeight}ft`, 20, 55);
    doc.text(`Unit Type: ${selectedBrick.label}`, 20, 62);
    doc.text(`Pattern: ${pattern}`, 20, 69);
    doc.text(`Total Units Required: ${result.totalBricks}`, 20, 76);
    doc.text(`Mortar Needed: ${result.mortarBags} Bags (80lb)`, 20, 83);
    doc.text(`Est. Cost: $${result.estimatedCost.toFixed(2)}`, 20, 90);
    doc.save("masonry-estimate.pdf");
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw relative overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_400px] gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">
        {/* Input Sidebar */}
        <div className="p-6 sm:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <Boxes className="w-4 h-4 text-primary" />
              Wall Dimensions
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

          <div className="grid gap-10">
            <div className="space-y-8">
              <InputSlider label="Wall Length" value={wallLength} unit={unit === "imperial" ? "ft" : "m"} min={1} max={500} step={1} onChange={setWallLength} />
              <InputSlider label="Wall Height" value={wallHeight} unit={unit === "imperial" ? "ft" : "m"} min={1} max={50} step={0.5} onChange={setWallHeight} />
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Unit Type</label>
               <div className="grid grid-cols-2 gap-2">
                  {BRICK_TYPES.map(b => (
                    <button 
                      key={b.id} 
                      onClick={() => setBrickTypeId(b.id)}
                      className={`flex flex-col items-start gap-1 p-4 rounded-2xl border transition-all ${brickTypeId === b.id ? "bg-foreground text-background border-foreground shadow-lg" : "bg-muted/10 border-border hover:border-primary/20"}`}
                    >
                      <span className="text-xs font-black uppercase tracking-tighter">{b.label}</span>
                      <span className="text-[9px] opacity-60 font-bold">{b.l}" x {b.h}" x {b.d}"</span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mortar Joint</label>
                  <select 
                    value={jointSize} 
                    onChange={(e) => setJointSize(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-border bg-muted/10 font-bold text-sm outline-none cursor-pointer"
                  >
                    <option value={0.25}>1/4" (Tight)</option>
                    <option value={0.375}>3/8" (Standard)</option>
                    <option value={0.5}>1/2" (Wide)</option>
                  </select>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bonding Pattern</label>
                  <select 
                    value={pattern} 
                    onChange={(e) => setPattern(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-2xl border border-border bg-muted/10 font-bold text-sm outline-none cursor-pointer"
                  >
                    {PATTERNS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
               </div>
            </div>

            <div className="p-6 bg-muted/10 rounded-[2.5rem] border border-border flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-muted-foreground">Waste Factor</span>
                <div className="flex items-center gap-4">
                   <button onClick={() => setWaste(Math.max(0, waste - 5))} className="p-2 rounded-xl border border-border bg-background hover:bg-muted transition-all"><Minus className="w-4 h-4" /></button>
                   <span className="text-lg font-black w-10 text-center">{waste}%</span>
                   <button onClick={() => setWaste(Math.min(50, waste + 5))} className="p-2 rounded-xl border border-border bg-background hover:bg-muted transition-all"><Plus className="w-4 h-4" /></button>
                </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="p-6 sm:p-10 bg-muted/10 space-y-10">
          <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Wall Visualizer</h3>
                <Grid className="w-5 h-5 text-primary opacity-50" />
             </div>

             <div className="aspect-[16/9] rounded-[2.5rem] bg-background border border-border shadow-inner relative flex items-center justify-center overflow-hidden p-6">
                <WallVisualizer pattern={pattern} cat={selectedBrick.cat} />
                <div className="absolute top-6 left-6 flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Face Area</span>
                  <span className="text-3xl font-black italic tracking-tighter">{Math.round(wallLength * wallHeight)} {unit === "imperial" ? "ft²" : "m²"}</span>
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <div className="grid gap-4">
                <ResultCard 
                  label="Total Units" 
                  value={result.totalBricks} 
                  unit={selectedBrick.cat === "brick" ? "bricks" : "blocks"}
                  icon={<Database className="w-5 h-5 text-primary" />}
                />
                <ResultCard 
                  label="Mortar Required" 
                  value={result.mortarBags} 
                  unit="bags (80lb)"
                  icon={<Sparkles className="w-5 h-5 text-success" />}
                />
             </div>

             <div className="pt-8 border-t border-border space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Material Checklist</h4>
                <div className="space-y-3">
                   <MaterialRow label={`${selectedBrick.label}`} qty={result.totalBricks} unit="Units" price={pricePerUnit} />
                   <MaterialRow label="Quikrete Type S Mortar" qty={result.mortarBags} unit="Bags" price={12.50} />
                   <MaterialRow label="Masonry Rebar (Optional)" qty={4} unit="Pieces" price={8.25} />
                </div>
                <div className="p-6 rounded-[2rem] bg-foreground text-background">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase opacity-60">Estimated Project Cost</span>
                      <TrendingUp className="w-4 h-4 opacity-50" />
                   </div>
                   <div className="text-4xl font-black italic tracking-tighter">
                      ${(result.estimatedCost + (result.mortarBags * 12.50) + 33).toFixed(2)}
                   </div>
                </div>
             </div>

             <button 
                onClick={exportPDF}
                className="w-full py-5 rounded-[2rem] bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
             >
                <Download className="w-5 h-5" /> Export Supply List
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
           <span className="text-3xl font-black italic tracking-tighter">{value}</span>
           <span className="text-sm font-bold text-muted-foreground uppercase">{unit}</span>
        </div>
      </div>
    </div>
  );
}

function MaterialRow({ label, qty, unit, price }: { label: string, qty: number, unit: string, price: number }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-background text-sm">
      <div className="flex flex-col">
        <span className="font-bold text-foreground line-clamp-1">{label}</span>
        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Qty: {qty} {unit} @ ${price.toFixed(2)}</span>
      </div>
      <span className="font-bold text-primary">${(qty * price).toFixed(2)}</span>
    </div>
  );
}

function WallVisualizer({ pattern, cat }: { pattern: BondingPattern, cat: "brick" | "block" }) {
  const brickW = cat === "brick" ? 40 : 80;
  const brickH = cat === "brick" ? 15 : 30;
  const color = cat === "brick" ? "#991b1b" : "#94a3b8";
  
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full opacity-30">
      <defs>
        <pattern id="running" x="0" y="0" width={brickW} height={brickH} patternUnits="userSpaceOnUse">
           <rect width={brickW - 2} height={brickH - 2} fill={color} />
        </pattern>
        <pattern id="running-offset" x={brickW/2} y={brickH} width={brickW} height={brickH*2} patternUnits="userSpaceOnUse">
           <rect width={brickW - 2} height={brickH - 2} fill={color} />
        </pattern>
      </defs>
      
      {pattern === "Running" ? (
         <g>
            <rect width="400" height="200" fill="url(#running)" />
            <rect width="400" height="200" fill="url(#running-offset)" x={brickW/2} />
         </g>
      ) : (
         <rect width="400" height="200" fill="url(#running)" />
      )}
    </svg>
  );
}
