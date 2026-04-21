"use client";

import React, { useState, useMemo } from "react";
import { 
  type RoofingInputs, 
  calculateRoofing,
  PITCH_MULTIPLIERS
} from "@/lib/tools/roofing-material";
import { 
  Home, Ruler, Download, Plus, Minus,
  Layers, ChevronRight, Info, ShoppingCart, TrendingUp, Sparkles, Box, Hammer
} from "lucide-react";

const MATERIALS = [
  { id: "Asphalt", label: "Architectural Asphalt", bundlesPerSq: 3, pricePerSq: 120, icon: "🏠" },
  { id: "Metal", label: "Standing Seam Metal", bundlesPerSq: 1, pricePerSq: 450, icon: "🏭" },
  { id: "Tile", label: "Clay / Concrete Tile", bundlesPerSq: 5, pricePerSq: 600, icon: "🧱" },
  { id: "Wood", label: "Cedar Shakes", bundlesPerSq: 4, pricePerSq: 550, icon: "🌲" },
];

export function RoofingMaterialCalculator() {
  const [length, setLength] = useState(40);
  const [width, setWidth] = useState(30);
  const [pitch, setPitch] = useState(6); // 6/12 pitch
  const [waste, setWaste] = useState(10);
  const [materialId, setMaterialId] = useState("Asphalt");
  const [includeUnderlayment, setIncludeUnderlayment] = useState(true);
  const [includeIceWater, setIncludeIceWater] = useState(true);

  const selectedMaterial = MATERIALS.find(m => m.id === materialId)!;

  const inputs: RoofingInputs = useMemo(() => ({
    length,
    width,
    pitch,
    waste,
    materialType: materialId as any,
    bundlesPerSq: selectedMaterial.bundlesPerSq,
    pricePerSq: selectedMaterial.pricePerSq,
  }), [length, width, pitch, waste, materialId, selectedMaterial]);

  const result = useMemo(() => calculateRoofing(inputs), [inputs]);

  const exportPDF = async () => {
    const { jsPDF } = await import("jspdf/dist/jspdf.es.min.js");
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Roofing Material Estimate", 20, 30);
    doc.setFontSize(14);
    doc.text(`Project Specifications:`, 20, 45);
    doc.setFontSize(11);
    doc.text(`Footprint: ${length}ft x ${width}ft`, 20, 55);
    doc.text(`Pitch: ${pitch}/12`, 20, 62);
    doc.text(`Material: ${selectedMaterial.label}`, 20, 69);
    doc.text(`Total Squares Needed: ${result.totalSquares.toFixed(2)}`, 20, 76);
    doc.text(`Material Quantity: ${result.totalBundles} ${materialId === "Asphalt" ? "Bundles" : "Units"}`, 20, 83);
    doc.text(`Est. Material Cost: $${result.estimatedCost.toFixed(2)}`, 20, 90);
    doc.save("roofing-estimate.pdf");
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw relative overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_400px] gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">
        {/* Input Sidebar */}
        <div className="p-6 sm:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <Home className="w-4 h-4 text-primary" />
              Building Footprint
            </h3>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Imperial Units</span>
          </div>

          <div className="grid gap-10">
            <div className="space-y-8">
              <InputSlider label="House Length" value={length} unit="ft" min={10} max={200} step={1} onChange={setLength} />
              <InputSlider label="House Width" value={width} unit="ft" min={10} max={200} step={1} onChange={setWidth} />
              
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Roof Pitch (Rise/12)</span>
                    <span className="text-xs font-mono font-bold text-primary">{pitch}:12</span>
                 </div>
                 <div className="grid grid-cols-6 gap-2">
                    {[2, 4, 6, 8, 10, 12].map(p => (
                      <button 
                        key={p} 
                        onClick={() => setPitch(p)}
                        className={`py-2 rounded-xl border text-[10px] font-bold transition-all ${pitch === p ? "bg-foreground text-background border-foreground shadow-lg" : "bg-muted/10 border-border hover:border-primary/20"}`}
                      >
                        {p}
                      </button>
                    ))}
                 </div>
              </div>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Roofing Material</label>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {MATERIALS.map(m => (
                    <button 
                      key={m.id} 
                      onClick={() => setMaterialId(m.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${materialId === m.id ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-muted/10 border-border hover:border-primary/20"}`}
                    >
                      <span className="text-xl">{m.icon}</span>
                      <span className="text-[8px] font-black uppercase tracking-tighter line-clamp-1">{m.label}</span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="p-6 bg-muted/10 rounded-[2.5rem] border border-border space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase text-muted-foreground">Waste Factor</span>
                   <div className="flex items-center gap-3">
                      <button onClick={() => setWaste(Math.max(0, waste - 5))} className="p-1 rounded-lg border border-border bg-background hover:bg-muted transition-all"><Minus className="w-3 h-3" /></button>
                      <span className="text-sm font-black w-8 text-center">{waste}%</span>
                      <button onClick={() => setWaste(Math.min(50, waste + 5))} className="p-1 rounded-lg border border-border bg-background hover:bg-muted transition-all"><Plus className="w-3 h-3" /></button>
                   </div>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={includeUnderlayment} onChange={() => setIncludeUnderlayment(!includeUnderlayment)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20" />
                      <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase pr-2">Synthetic Underlayment</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={includeIceWater} onChange={() => setIncludeIceWater(!includeIceWater)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20" />
                      <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase font-black text-primary/80">Ice & Water Shield</span>
                   </label>
                </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="p-6 sm:p-10 bg-muted/10 space-y-10">
          <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Roof Schematic</h3>
                <div className="flex gap-2">
                   <span className="px-2 py-0.5 rounded-md bg-background border border-border text-[9px] font-bold text-muted-foreground">Pitch: {pitch}:12</span>
                </div>
             </div>

             <div className="aspect-[4/3] rounded-[2.5rem] bg-background border border-border shadow-inner relative flex items-center justify-center overflow-hidden">
                <RoofVisualizer pitch={pitch} material={materialId as any} />
                <div className="absolute top-6 left-6 flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Calculated surface</span>
                  <span className="text-3xl font-black italic tracking-tighter">{Math.round(result.totalArea)} sq ft</span>
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <div className="grid gap-4">
                <ResultCard 
                  label="Roofing Squares" 
                  value={result.totalSquares} 
                  unit="sq"
                  icon={<Layers className="w-5 h-5 text-primary" />}
                />
                <ResultCard 
                  label="Total Bundles" 
                  value={result.totalBundles} 
                  unit="units"
                  icon={<Box className="w-5 h-5 text-success" />}
                />
             </div>

             <div className="pt-8 border-t border-border space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Component Breakdown</h4>
                <div className="space-y-3">
                   <MaterialRow label={`${selectedMaterial.label}`} qty={result.totalBundles} unit="Bundles" price={selectedMaterial.pricePerSq / selectedMaterial.bundlesPerSq} />
                   {includeUnderlayment && <MaterialRow label="Synthetic Underlayment" qty={Math.ceil(result.totalSquares / 4)} unit="Rolls" price={98.00} />}
                   {includeIceWater && <MaterialRow label="Ice & Water Membrane" qty={2} unit="Rolls" price={125.00} />}
                   <MaterialRow label="Coil Nails (7200ct)" qty={1} unit="Box" price={45.00} />
                </div>
                <div className="p-6 rounded-[2rem] bg-foreground text-background">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase opacity-60">Estimated Material Total</span>
                      <Hammer className="w-4 h-4 opacity-50" />
                   </div>
                   <div className="text-4xl font-black italic tracking-tighter">
                      ${(result.estimatedCost + (includeUnderlayment ? Math.ceil(result.totalSquares / 4) * 98 : 0) + (includeIceWater ? 250 : 0) + 45).toFixed(2)}
                   </div>
                </div>
             </div>

             <button 
                onClick={exportPDF}
                className="w-full py-5 rounded-[2rem] bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
             >
                <Download className="w-5 h-5" /> Download Full Estimate
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

function RoofVisualizer({ pitch, material }: { pitch: number, material: "Asphalt" | "Metal" | "Tile" | "Wood" }) {
  // SVG 2.5D Isometric Roof
  const peakHeight = 100 - (pitch * 5); // Simplistic pitch representation
  const color = material === "Asphalt" ? "#4a5568" : material === "Metal" ? "#1e293b" : material === "Tile" ? "#9a3412" : "#a16207";
  
  return (
    <svg viewBox="0 0 400 300" className="w-[85%] h-[85%] drop-shadow-2xl overflow-visible">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
           <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
           <feOffset dx="0" dy="10" result="offsetblur" />
           <feComponentTransfer><feFuncA type="linear" slope="0.3" /></feComponentTransfer>
           <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      
      {/* Front Roof Panel */}
      <path 
        d={`M 60 220 L 200 ${peakHeight} L 340 220 Z`} 
        fill={color} 
        stroke="rgba(0,0,0,0.2)" 
        strokeWidth="1"
      />
      
      {/* Texture based on material */}
      {material === "Metal" && (
         <g stroke="rgba(255,255,255,0.1)" strokeWidth="1">
            {[...Array(12)].map((_, i) => (
               <line key={i} x1={60 + i*23} y1={220} x2={200} y2={peakHeight} />
            ))}
         </g>
      )}

      {/* Ridge Line */}
      <line x1="200" y1={peakHeight} x2="200" y2={peakHeight + 10} stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      
      <text x="200" y="270" textAnchor="middle" className="fill-muted-foreground text-[10px] font-black uppercase tracking-widest">
        Isometric Projection
      </text>
    </svg>
  );
}
