"use client";

import React, { useState, useMemo, useRef } from "react";
import { 
  type ConcreteInputs, 
  type UnitSystem, 
  type ConcreteShape, 
  calculateConcrete,
  type ConcreteResult
} from "@/lib/tools/concrete-volume";
import { 
  Calculator, Info, Download, Trash2, Plus, 
  Layers, Ruler, MoreVertical, FileText, TrendingUp, AlertTriangle, ChevronDown, ChevronUp
} from "lucide-react";

interface Section {
  id: string;
  name: string;
  inputs: ConcreteInputs;
  isOpen: boolean;
}

const DEFAULT_INPUTS: ConcreteInputs = {
  shape: "slab",
  system: "imperial",
  lengthFt: 10,
  lengthIn: 0,
  widthFt: 10,
  widthIn: 0,
  depthIn: 4,
  diameterIn: 12,
  numSteps: 3,
  stepRiseIn: 7,
  stepRunIn: 11,
  stepWidthFt: 3,
  lengthM: 3,
  widthM: 3,
  depthCm: 10,
  diameterCm: 30,
  stepRiseCm: 18,
  stepRunCm: 28,
  stepWidthM: 1,
  quantity: 1,
  wasteFactor: 10,
  pricePerUnit: 150, // per cubic yard
};

export function ConcreteVolumeCalculator() {
  const [sections, setSections] = useState<Section[]>([
    { id: "1", name: "Main Slab", inputs: { ...DEFAULT_INPUTS }, isOpen: true }
  ]);
  const [activeTab, setActiveTab] = useState<UnitSystem>("imperial");

  const results = useMemo(() => {
    return sections.map(s => ({
      id: s.id,
      name: s.name,
      result: calculateConcrete({ ...s.inputs, system: activeTab })
    }));
  }, [sections, activeTab]);

  const totals = useMemo(() => {
    return results.reduce((acc, curr) => ({
      cubicYards: acc.cubicYards + curr.result.cubicYards,
      cubicMeters: acc.cubicMeters + curr.result.cubicMeters,
      cubicFeet: acc.cubicFeet + curr.result.cubicFeet,
      bags80lb: acc.bags80lb + curr.result.bags80lb,
      bags60lb: acc.bags60lb + curr.result.bags60lb,
      bags40lb: acc.bags40lb + curr.result.bags40lb,
      bags25kg: acc.bags25kg + curr.result.bags25kg,
      bags20kg: acc.bags20kg + curr.result.bags20kg,
      estimatedCost: acc.estimatedCost + curr.result.estimatedCost,
    }), {
      cubicYards: 0, cubicMeters: 0, cubicFeet: 0, 
      bags80lb: 0, bags60lb: 0, bags40lb: 0,
      bags25kg: 0, bags20kg: 0, estimatedCost: 0
    });
  }, [results]);

  const addSection = () => {
    setSections(prev => [
      ...prev, 
      { 
        id: Math.random().toString(36).substr(2, 9), 
        name: `Section ${prev.length + 1}`, 
        inputs: { ...DEFAULT_INPUTS },
        isOpen: true 
      }
    ]);
  };

  const removeSection = (id: string) => {
    if (sections.length > 1) {
      setSections(prev => prev.filter(s => s.id !== id));
    }
  };

  const updateSection = (id: string, updates: Partial<ConcreteInputs>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, inputs: { ...s.inputs, ...updates } } : s));
  };

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, isOpen: !s.isOpen } : s));
  };

  const exportPDF = async () => {
    const { jsPDF } = await import("jspdf/dist/jspdf.es.min.js");
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    doc.setFontSize(22);
    doc.text("Concrete Estimate Report", 20, 30);
    doc.setFontSize(12);
    doc.text(`Generated on: ${date}`, 20, 40);
    
    let y = 60;
    results.forEach((r, i) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${i + 1}. ${r.name}`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(`Volume: ${r.result.cubicYards.toFixed(2)} yd³ / ${r.result.cubicMeters.toFixed(2)} m³`, 30, y + 7);
      y += 20;
      if (y > 270) { doc.addPage(); y = 20; }
    });

    doc.setDrawColor(0);
    doc.line(20, y, 190, y);
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Project Totals", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Volume: ${totals.cubicYards.toFixed(2)} yd³`, 20, y + 7);
    doc.text(`Total Bags (80lb): ${totals.bags80lb}`, 20, y + 14);
    doc.text(`Estimated Cost: $${totals.estimatedCost.toFixed(2)}`, 20, y + 21);

    doc.save("concrete-estimate.pdf");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
      <div className="space-y-6">
        {/* Unit Selector */}
        <div className="inline-flex rounded-2xl border border-border bg-card p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("imperial")}
            className={`rounded-xl px-6 py-2.5 text-sm font-bold uppercase tracking-widest transition-all ${
              activeTab === "imperial" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Imperial
          </button>
          <button
            onClick={() => setActiveTab("metric")}
            className={`rounded-xl px-6 py-2.5 text-sm font-bold uppercase tracking-widest transition-all ${
              activeTab === "metric" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Metric
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="glass-card rounded-[2rem] border border-border bg-background overflow-hidden transition-all hover:shadow-xl">
              <div 
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/30"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {sections.indexOf(section) + 1}
                  </div>
                  <input 
                    className="bg-transparent border-none font-bold text-lg outline-none focus:ring-2 focus:ring-primary/20 rounded-md px-2"
                    value={section.name}
                    onChange={(e) => {
                      e.stopPropagation();
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, name: e.target.value } : s));
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-primary">
                    {calculateConcrete({ ...section.inputs, system: activeTab }).cubicYards.toFixed(2)} yd³
                  </span>
                  {section.isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                    className="p-2 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-full transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {section.isOpen && (
                <div className="p-8 pt-0 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                  {/* Shape Selector */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "slab", label: "Slab", icon: "🍱" },
                      { id: "column", label: "Column", icon: "🧪" },
                      { id: "stairs", label: "Stairs", icon: "🪜" }
                    ].map((sh) => (
                      <button
                        key={sh.id}
                        onClick={() => updateSection(section.id, { shape: sh.id as ConcreteShape })}
                        className={`py-4 rounded-3xl border flex flex-col items-center gap-1 transition-all ${
                          section.inputs.shape === sh.id 
                            ? "bg-foreground text-background border-foreground shadow-lg scale-[1.02]" 
                            : "bg-muted/10 border-border hover:border-primary/30"
                        }`}
                      >
                        <span className="text-xl">{sh.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-tighter">{sh.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Input Grid */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <SectionInputs 
                      section={section} 
                      activeTab={activeTab} 
                      onUpdate={(upd) => updateSection(section.id, upd)} 
                    />
                  </div>

                  {/* Visualizer Placeholder */}
                  <div className="relative aspect-video rounded-3xl bg-muted/20 border border-border border-dashed flex items-center justify-center p-8">
                     <ConcreteVisualizer shape={section.inputs.shape} inputs={section.inputs} system={activeTab} />
                     <div className="absolute top-4 left-4 p-2 bg-background/80 backdrop-blur-md border border-border rounded-lg text-[10px] uppercase font-bold text-muted-foreground">
                        3D Schematic
                     </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <button 
            onClick={addSection}
            className="w-full py-6 rounded-[2rem] border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary-soft/30 transition-all flex items-center justify-center gap-3 text-muted-foreground hover:text-primary font-bold"
          >
            <Plus className="w-5 h-5" /> Add Project Section
          </button>
        </div>
      </div>

      {/* Summary Sidebar */}
      <aside className="space-y-6">
        <div className="glass-card rounded-[2.5rem] border border-border bg-background p-8 sticky top-6 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold tracking-tight">Project Totals</h2>
            <Layers className="w-5 h-5 text-primary" />
          </div>

          <div className="space-y-6">
             <div className="p-6 rounded-3xl bg-foreground text-background">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Cubic Yards</p>
                <div className="text-5xl font-black italic tracking-tighter">
                  {totals.cubicYards.toFixed(2)}
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Cubic Meters</p>
                  <p className="text-lg font-black">{totals.cubicMeters.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Cubic Feet</p>
                  <p className="text-lg font-black">{totals.cubicFeet.toFixed(1)}</p>
                </div>
             </div>

             <div className="space-y-3 pt-6 border-t border-border">
               <label className="block space-y-2">
                 <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                   <span>Waste Factor</span>
                   <span className="text-primary">{sections[0].inputs.wasteFactor}%</span>
                 </div>
                 <input 
                   type="range" min="0" max="30" step="1"
                   value={sections[0].inputs.wasteFactor}
                   onChange={(e) => {
                     const val = Number(e.target.value);
                     setSections(prev => prev.map(s => ({ ...s, inputs: { ...s.inputs, wasteFactor: val } })));
                   }}
                   className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                 />
               </label>
               
               <label className="block space-y-2">
                 <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                   <span>Price per Yard</span>
                   <span className="text-primary">${sections[0].inputs.pricePerUnit}</span>
                 </div>
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                    <input 
                      type="number"
                      value={sections[0].inputs.pricePerUnit}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSections(prev => prev.map(s => ({ ...s, inputs: { ...s.inputs, pricePerUnit: val } })));
                      }}
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-muted/20 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    />
                 </div>
               </label>
             </div>

             <div className="pt-6 border-t border-border space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Shopping List</h3>
                  <button className="text-[10px] font-bold text-primary hover:underline">View on Home Depot</button>
               </div>
               <div className="space-y-2">
                  <MaterialRow label="80lb SAKRETE High Strength" count={totals.bags80lb} price={5.48} />
                  <MaterialRow label="Rebar #4 (1/2 in. x 20 ft.)" count={Math.ceil(totals.cubicYards * 3.5)} price={12.98} />
                  <MaterialRow label="Concrete Form Tube (12 in.)" count={sections.filter(s => s.inputs.shape === "column").reduce((a, b) => a + b.inputs.quantity, 0)} price={18.47} />
               </div>
             </div>

             <div className="pt-6 border-t border-border space-y-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Mix Ratio Guide (By Volume)</h3>
               <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-muted-foreground">Standard (3000 PSI)</span>
                    <span className="text-primary">1 : 2 : 4</span>
                  </div>
                  <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-500 w-[14%]" title="Cement" />
                    <div className="h-full bg-amber-200 w-[28%]" title="Sand" />
                    <div className="h-full bg-slate-300 w-[58%]" title="Gravel" />
                  </div>
                  <p className="text-[9px] text-muted-foreground leading-tight italic">
                    1 part Cement, 2 parts Sand, 4 parts Gravel. Approx. 6 gallons of water per bag.
                  </p>
               </div>
             </div>

             <button 
               onClick={exportPDF}
               className="w-full py-5 rounded-3xl bg-primary text-primary-foreground font-black uppercase tracking-[0.15em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
             >
               <Download className="w-5 h-5" /> Export Detailed PDF
             </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function MaterialRow({ label, count, price }: { label: string, count: number, price: number }) {
  if (count <= 0) return null;
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/50 text-[11px]">
      <div className="flex flex-col">
        <span className="font-bold text-foreground line-clamp-1">{label}</span>
        <span className="text-muted-foreground">Qty: {count} @ ${price}</span>
      </div>
      <span className="font-bold text-primary">${(count * price).toFixed(2)}</span>
    </div>
  );
}

function SectionInputs({ section, activeTab, onUpdate }: { section: Section, activeTab: UnitSystem, onUpdate: (upd: Partial<ConcreteInputs>) => void }) {
  const i = section.inputs;
  
  if (i.shape === "slab") {
    return (
      <>
        <InputControl label="Length" val={activeTab === "imperial" ? i.lengthFt : i.lengthM} unit={activeTab === "imperial" ? "ft" : "m"} onChange={(v) => onUpdate(activeTab === "imperial" ? { lengthFt: v } : { lengthM: v })} />
        {activeTab === "imperial" && <InputControl label="Length (in)" val={i.lengthIn} unit="in" onChange={(v) => onUpdate({ lengthIn: v })} />}
        <InputControl label="Width" val={activeTab === "imperial" ? i.widthFt : i.widthM} unit={activeTab === "imperial" ? "ft" : "m"} onChange={(v) => onUpdate(activeTab === "imperial" ? { widthFt: v } : { widthM: v })} />
        <InputControl label="Thickness" val={activeTab === "imperial" ? i.depthIn : i.depthCm} unit={activeTab === "imperial" ? "in" : "cm"} onChange={(v) => onUpdate(activeTab === "imperial" ? { depthIn: v } : { depthCm: v })} />
      </>
    );
  }

  if (i.shape === "column") {
    return (
      <>
        <InputControl label="Diameter" val={activeTab === "imperial" ? i.diameterIn : i.diameterCm} unit={activeTab === "imperial" ? "in" : "cm"} onChange={(v) => onUpdate(activeTab === "imperial" ? { diameterIn: v } : { diameterCm: v })} />
        <InputControl label="Depth" val={activeTab === "imperial" ? i.depthIn : i.depthCm} unit={activeTab === "imperial" ? "in" : "cm"} onChange={(v) => onUpdate(activeTab === "imperial" ? { depthIn: v } : { depthCm: v })} />
        <InputControl label="Quantity" val={i.quantity} unit="pcs" onChange={(v) => onUpdate({ quantity: v })} />
      </>
    );
  }

  return (
    <>
      <InputControl label="Number of Steps" val={i.numSteps || 3} unit="steps" onChange={(v) => onUpdate({ numSteps: v })} />
      <InputControl label="Step Rise" val={activeTab === "imperial" ? (i.stepRiseIn || 7) : (i.stepRiseCm || 18)} unit={activeTab === "imperial" ? "in" : "cm"} onChange={(v) => onUpdate(activeTab === "imperial" ? { stepRiseIn: v } : { stepRiseCm: v })} />
      <InputControl label="Step Run" val={activeTab === "imperial" ? (i.stepRunIn || 11) : (i.stepRunCm || 28)} unit={activeTab === "imperial" ? "in" : "cm"} onChange={(v) => onUpdate(activeTab === "imperial" ? { stepRunIn: v } : { stepRunCm: v })} />
      <InputControl label="Step Width" val={activeTab === "imperial" ? (i.stepWidthFt || 3) : (i.stepWidthM || 1)} unit={activeTab === "imperial" ? "ft" : "m"} onChange={(v) => onUpdate(activeTab === "imperial" ? { stepWidthFt: v } : { stepWidthM: v })} />
    </>
  );
}

function InputControl({ label, val, unit, onChange, max = 100 }: { label: string, val: number, unit: string, onChange: (v: number) => void, max?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className="text-xs font-mono font-bold text-primary">{val} {unit}</span>
      </div>
      <div className="space-y-3">
         <input 
          type="range" min="0" max={max} step={unit === "in" || unit === "cm" ? 0.5 : unit === "ft" || unit === "m" ? 0.1 : 1}
          value={val || 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
        />
        <div className="relative">
          <input 
            type="number" 
            value={val || ""} 
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder="0"
            className="w-full px-5 py-3 rounded-2xl border border-border bg-muted/10 font-bold text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none pr-12"
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">{unit}</span>
        </div>
      </div>
    </div>
  );
}

function MaterialTile({ label, value, color }: { label: string, value: string | number, color: "primary" | "muted" | "foreground" }) {
  const styles = {
    primary: "bg-primary text-primary-foreground",
    muted: "bg-muted/50 text-foreground border border-border",
    foreground: "bg-foreground text-background"
  };

  return (
    <div className={`p-4 rounded-2xl ${styles[color]}`}>
      <p className="text-[8px] font-black uppercase tracking-wider opacity-60 mb-0.5">{label}</p>
      <p className="text-sm font-black">{value}</p>
    </div>
  );
}

function ConcreteVisualizer({ shape, inputs, system }: { shape: ConcreteShape, inputs: ConcreteInputs, system: UnitSystem }) {
  // Simple 2D SVG schematics
  if (shape === "slab") {
    return (
      <svg viewBox="0 0 200 120" className="w-full h-full text-foreground/20">
        <rect x="40" y="40" width="120" height="40" fill="currentColor" stroke="black" strokeWidth="1" strokeDasharray="2" />
        <rect x="50" y="30" width="120" height="40" fill="currentColor" fillOpacity="0.4" stroke="black" strokeWidth="1" />
        <line x1="40" y1="40" x2="50" y2="30" stroke="black" strokeWidth="1" />
        <line x1="160" y1="40" x2="170" y2="30" stroke="black" strokeWidth="1" />
        <line x1="160" y1="80" x2="170" y2="70" stroke="black" strokeWidth="1" />
        {/* Dimensions */}
        <text x="110" y="25" textAnchor="middle" fontSize="10" className="fill-foreground font-bold">L: {system === "imperial" ? inputs.lengthFt : inputs.lengthM}{system === "imperial" ? 'ft' : 'm'}</text>
        <text x="175" y="55" fontSize="10" className="fill-foreground font-bold">W: {system === "imperial" ? inputs.widthFt : inputs.widthM}{system === "imperial" ? 'ft' : 'm'}</text>
      </svg>
    );
  }

  if (shape === "column") {
    return (
      <svg viewBox="0 0 200 120" className="w-full h-full text-foreground/20">
        <ellipse cx="100" cy="30" rx="30" ry="10" fill="currentColor" fillOpacity="0.4" stroke="black" />
        <line x1="70" y1="30" x2="70" y2="90" stroke="black" />
        <line x1="130" y1="30" x2="130" y2="90" stroke="black" />
        <ellipse cx="100" cy="90" rx="30" ry="10" fill="currentColor" fillOpacity="0.4" stroke="black" />
        <text x="100" y="20" textAnchor="middle" fontSize="10" className="fill-foreground font-bold">D: {system === "imperial" ? inputs.diameterIn : inputs.diameterCm}{system === "imperial" ? 'in' : 'cm'}</text>
        <text x="145" y="65" fontSize="10" className="fill-foreground font-bold">H: {system === "imperial" ? inputs.depthIn : inputs.depthCm}{system === "imperial" ? 'in' : 'cm'}</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 120" className="w-full h-full text-foreground/20">
      <path d="M40 90 L70 90 L70 70 L100 70 L100 50 L130 50 L130 30 L160 30" fill="none" stroke="black" strokeWidth="2" />
      <path d="M40 100 L160 100 L160 30 L130 30 L130 50 L100 50 L100 70 L70 70 L70 90 L40 90 Z" fill="currentColor" fillOpacity="0.4" stroke="black" />
      <text x="100" y="115" textAnchor="middle" fontSize="10" className="fill-foreground font-bold">{inputs.numSteps} Steps</text>
    </svg>
  );
}
