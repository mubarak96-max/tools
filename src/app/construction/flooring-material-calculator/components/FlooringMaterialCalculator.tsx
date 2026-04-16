"use client";

import React, { useState, useMemo } from "react";
import { 
  type FlooringInputs, 
  type UnitSystem, 
  type FloorType, 
  type LayoutPattern,
  calculateFlooring 
} from "@/lib/tools/flooring-material";
import { 
  Layers, Ruler, Download, Trash2, Plus, Minus,
  Grid, Move, Info, ShoppingCart, TrendingUp, Sparkles, Check, Package
} from "lucide-react";

const MATERIALS: { id: FloorType, label: string, icon: string, waste: number, price: number, boxSize: number }[] = [
  { id: "Hardwood", label: "Hardwood", icon: "🌳", waste: 10, price: 8.50, boxSize: 22 },
  { id: "Laminate", label: "Laminate", icon: "🪵", waste: 7, price: 3.25, boxSize: 24 },
  { id: "Vinyl", label: "Vinyl (LVP)", icon: "💧", waste: 5, price: 4.50, boxSize: 20 },
  { id: "Tile", label: "Ceramic Tile", icon: "🧱", waste: 15, price: 5.75, boxSize: 15 },
  { id: "Carpet", label: "Standard Carpet", icon: "🧶", waste: 10, price: 3.50, boxSize: 1 },
];

const PATTERNS: { id: LayoutPattern, label: string, addedWaste: number }[] = [
  { id: "Straight", label: "Straight / Offset", addedWaste: 0 },
  { id: "Diagonal", label: "Diagonal (45°)", addedWaste: 10 },
  { id: "Herringbone", label: "Herringbone", addedWaste: 15 },
];

export function FlooringMaterialCalculator() {
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [lengthFt, setLengthFt] = useState(15);
  const [widthFt, setWidthFt] = useState(12);
  const [lengthM, setLengthM] = useState(4.5);
  const [widthM, setWidthM] = useState(3.6);
  const [materialType, setMaterialType] = useState<FloorType>("Vinyl");
  const [pattern, setPattern] = useState<LayoutPattern>("Straight");
  const [customBoxSize, setCustomBoxSize] = useState(20);
  const [customWaste, setCustomWaste] = useState(10);
  const [pricePerSqFt, setPricePerSqFt] = useState(4.50);

  const selectedMaterial = MATERIALS.find(m => m.id === materialType)!;
  const patternWaste = PATTERNS.find(p => p.id === pattern)!.addedWaste;

  const inputs: FlooringInputs = useMemo(() => ({
    system: unit,
    length: unit === "imperial" ? lengthFt : lengthM,
    width: unit === "imperial" ? widthFt : widthM,
    materialType,
    pattern,
    customWaste: selectedMaterial.waste + patternWaste,
    boxSize: selectedMaterial.boxSize === 1 ? 1 : selectedMaterial.boxSize,
    pricePerUnit: pricePerSqFt,
  }), [unit, lengthFt, widthFt, lengthM, widthM, materialType, pattern, selectedMaterial, patternWaste, pricePerSqFt]);

  const result = useMemo(() => calculateFlooring(inputs), [inputs]);

  const exportPDF = async () => {
    const { jsPDF } = await import("jspdf/dist/jspdf.es.min.js");
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Flooring Material Estimate", 20, 30);
    doc.setFontSize(14);
    doc.text(`Project Details:`, 20, 45);
    doc.setFontSize(11);
    doc.text(`Material: ${materialType}`, 20, 55);
    doc.text(`Layout: ${pattern}`, 20, 62);
    doc.text(`Area: ${result.netArea.toFixed(1)} ${unit === "imperial" ? "sq ft" : "sq m"}`, 20, 69);
    doc.text(`Total Material (inc. ${inputs.customWaste}% waste): ${result.totalArea.toFixed(1)}`, 20, 76);
    doc.text(`Boxes Needed: ${result.boxesRequired}`, 20, 83);
    doc.text(`Est. Cost: $${result.estimatedCost.toFixed(2)}`, 20, 90);
    doc.save("flooring-estimate.pdf");
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw relative overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_400px] gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">
        {/* Input Sidebar */}
        <div className="p-6 sm:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <Move className="w-4 h-4 text-primary" />
              Floor Dimensions
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
              <InputSlider 
                label="Room Length" 
                value={unit === "imperial" ? lengthFt : lengthM} 
                unit={unit === "imperial" ? "ft" : "m"} 
                min={1} max={100} step={0.5} 
                onChange={(v) => unit === "imperial" ? setLengthFt(v) : setLengthM(v)} 
              />
              <InputSlider 
                label="Room Width" 
                value={unit === "imperial" ? widthFt : widthM} 
                unit={unit === "imperial" ? "ft" : "m"} 
                min={1} max={100} step={0.5} 
                onChange={(v) => unit === "imperial" ? setWidthFt(v) : setWidthM(v)} 
              />
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Material</label>
               <div className="grid grid-cols-5 gap-2">
                  {MATERIALS.map(m => (
                    <button 
                      key={m.id} 
                      onClick={() => {
                        setMaterialType(m.id);
                        setPricePerSqFt(m.price);
                      }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${materialType === m.id ? "bg-foreground text-background border-foreground shadow-lg" : "bg-muted/10 border-border hover:border-primary/20"}`}
                    >
                      <span className="text-xl">{m.icon}</span>
                      <span className="text-[8px] font-black uppercase tracking-tighter line-clamp-1">{m.label}</span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Layout Pattern</label>
               <div className="grid grid-cols-3 gap-3">
                  {PATTERNS.map(p => (
                    <button 
                      key={p.id} 
                      onClick={() => setPattern(p.id)}
                      className={`py-3 rounded-2xl border text-[10px] font-bold uppercase transition-all ${pattern === p.id ? "bg-primary text-primary-foreground border-primary" : "bg-muted/10 border-border hover:border-primary/30"}`}
                    >
                      {p.label}
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 p-6 bg-muted/10 rounded-[2.5rem] border border-border">
                <div className="space-y-2">
                   <span className="text-[9px] font-black uppercase text-muted-foreground">Waste Factor</span>
                   <div className="flex items-center gap-2">
                      <span className="text-lg font-black">{inputs.customWaste}%</span>
                      <span className="text-[10px] text-primary font-bold italic">Auto-Updated</span>
                   </div>
                </div>
                <div className="space-y-2">
                   <span className="text-[9px] font-black uppercase text-muted-foreground">Coverage per Box</span>
                   <div className="flex items-center gap-2">
                      <span className="text-lg font-black">{selectedMaterial.boxSize}</span>
                      <span className="text-[10px] text-muted-foreground font-bold">{unit === "imperial" ? "sq ft" : "sq m"}</span>
                   </div>
                </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="p-6 sm:p-10 bg-muted/10 space-y-10">
          <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Floor Schematic</h3>
                <Grid className="w-5 h-5 text-primary opacity-50" />
             </div>

             <div className="aspect-square rounded-[2.5rem] bg-background border border-border shadow-inner relative flex items-center justify-center overflow-hidden">
                <FloorVisualizer pattern={pattern} color={materialType === "Hardwood" ? "#78350f" : materialType === "Tile" ? "#cbd5e1" : "#4a5568"} />
                <div className="absolute top-6 left-6 flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Net Area</span>
                  <span className="text-3xl font-black italic tracking-tighter">{Math.round(result.netArea)} {unit === "imperial" ? "ft²" : "m²"}</span>
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <div className="grid gap-4">
                <ResultCard 
                  label="Total Material" 
                  value={result.totalArea} 
                  unit={unit === "imperial" ? "sq ft" : "sq m"}
                  icon={<Package className="w-5 h-5 text-primary" />}
                />
                <ResultCard 
                  label="Full Boxes" 
                  value={result.boxesRequired} 
                  unit="cartons"
                  icon={<Layers className="w-5 h-5 text-success" />}
                />
             </div>

             <div className="pt-8 border-t border-border space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Project Summary</h4>
                <div className="space-y-3">
                   <MaterialRow label={`${materialType} Flooring`} qty={result.boxesRequired} unit="Boxes" price={pricePerSqFt * selectedMaterial.boxSize} />
                   <MaterialRow label="Underlayment / Pad" qty={1} unit="Roll" price={45.00} />
                   <MaterialRow label="Spacer & Install Kit" qty={1} unit="Set" price={19.99} />
                </div>
                <div className="p-6 rounded-[2rem] bg-foreground text-background">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase opacity-60">Estimated Total</span>
                      <TrendingUp className="w-4 h-4 opacity-50" />
                   </div>
                   <div className="text-4xl font-black italic tracking-tighter">
                      ${(result.estimatedCost + 45.00 + 19.99).toFixed(2)}
                   </div>
                </div>
             </div>

             <button 
                onClick={exportPDF}
                className="w-full py-5 rounded-[2rem] bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
             >
                <Download className="w-5 h-5" /> Export Material List
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
           <span className="text-3xl font-black italic tracking-tighter">{value.toFixed(0)}</span>
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

function FloorVisualizer({ pattern, color }: { pattern: LayoutPattern, color: string }) {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full opacity-20">
      <defs>
        <pattern id="plank" x="0" y="0" width="80" height="20" patternUnits="userSpaceOnUse">
          <rect width="78" height="18" fill={color} />
        </pattern>
        <pattern id="diagonal" x="0" y="0" width="80" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="78" height="18" fill={color} />
        </pattern>
        <pattern id="tile" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="38" height="38" fill={color} />
        </pattern>
      </defs>
      
      <rect 
        x="0" y="0" width="400" height="300" 
        fill={pattern === "Straight" ? "url(#plank)" : pattern === "Diagonal" ? "url(#diagonal)" : "url(#tile)"} 
      />
    </svg>
  );
}
