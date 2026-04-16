"use client";

import React, { useState, useMemo } from "react";
import { 
  Plus, Minus, Ruler, Download, Layout, 
  Trash2, Info, ShoppingCart, TrendingUp, Sparkles, Check, Home, Layers
} from "lucide-react";

interface RoomZone {
  id: string;
  name: string;
  length: number;
  width: number;
  type: "addition" | "deduction";
}

export function RoomAreaCalculator() {
  const [zones, setZones] = useState<RoomZone[]>([
    { id: "1", name: "Main Area", length: 15, width: 20, type: "addition" }
  ]);
  const [useMetric, setUseMetric] = useState(false);
  const [waste, setWaste] = useState(5);

  const totals = useMemo(() => {
    let totalArea = 0;
    zones.forEach(zone => {
      const area = zone.length * zone.width;
      if (zone.type === "addition") {
        totalArea += area;
      } else {
        totalArea -= area;
      }
    });

    const withWaste = totalArea * (1 + waste / 100);

    return {
      netArea: totalArea,
      grossArea: withWaste,
      perimeter: zones.reduce((acc, z) => acc + (z.length * 2 + z.width * 2), 0) // Approximation
    };
  }, [zones, waste]);

  const addZone = (type: "addition" | "deduction") => {
    setZones([...zones, { 
      id: Math.random().toString(36).substr(2, 9), 
      name: type === "addition" ? `Alcove ${zones.length}` : `Obstacle ${zones.length}`, 
      length: 5, 
      width: 5, 
      type 
    }]);
  };

  const updateZone = (id: string, field: keyof RoomZone, value: any) => {
    setZones(zones.map(z => z.id === id ? { ...z, [field]: value } : z));
  };

  const removeZone = (id: string) => {
    if (zones.length > 1) {
      setZones(zones.filter(z => z.id !== id));
    }
  };

  const exportPDF = async () => {
    const { jsPDF } = await import("jspdf/dist/jspdf.es.min.js");
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Room Area Calculation Report", 20, 30);
    doc.setFontSize(12);
    doc.text(`Total Net Area: ${totals.netArea.toFixed(2)} ${useMetric ? "sq m" : "sq ft"}`, 20, 45);
    doc.text(`Total Gross Area (${waste}% waste): ${totals.grossArea.toFixed(2)} ${useMetric ? "sq m" : "sq ft"}`, 20, 52);
    doc.text(`-------------------------------------------`, 20, 59);
    zones.forEach((zone, i) => {
      doc.text(`${i + 1}. ${zone.name}: ${zone.length}x${zone.width} (${zone.type})`, 20, 70 + (i * 7));
    });
    doc.save("room-area-estimate.pdf");
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw relative overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_400px] gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">
        {/* Workspace */}
        <div className="p-6 sm:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <Home className="w-4 h-4 text-primary" />
              Blueprint Layout
            </h3>
            <div className="flex gap-2">
               <button 
                  onClick={() => addZone("addition")}
                  className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center gap-2"
               >
                  <Plus className="w-3 h-3" /> Area
               </button>
               <button 
                  onClick={() => addZone("deduction")}
                  className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-[10px] font-black uppercase tracking-widest hover:bg-destructive/20 transition-all flex items-center gap-2"
               >
                  <Minus className="w-3 h-3" /> Cut-out
               </button>
            </div>
          </div>

          <div className="space-y-6">
            {zones.map((zone, idx) => (
              <div 
                key={zone.id} 
                className={`p-8 rounded-[2.5rem] border group relative transition-all ${zone.type === "addition" ? "bg-muted/5 border-border hover:bg-muted/10" : "bg-destructive/5 border-destructive/20 hover:bg-destructive/10"}`}
              >
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex-1 min-w-[200px] space-y-2">
                    <span className="text-[10px] font-black uppercase text-muted-foreground ml-1">{zone.type === "addition" ? "Addition Name" : "Deduction (e.g. Island)"}</span>
                    <input 
                      value={zone.name} onChange={(e) => updateZone(zone.id, "name", e.target.value)}
                      className="w-full bg-transparent font-black text-xl italic tracking-tighter outline-none text-foreground border-b border-transparent focus:border-primary/30"
                    />
                  </div>
                  <div className="flex items-center gap-8">
                    <AreaInput label="Length" value={zone.length} unit={useMetric ? "m" : "ft"} onChange={(v) => updateZone(zone.id, "length", v)} />
                    <AreaInput label="Width" value={zone.width} unit={useMetric ? "m" : "ft"} onChange={(v) => updateZone(zone.id, "width", v)} />
                  </div>
                  <button 
                    onClick={() => removeZone(zone.id)}
                    className="p-3 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className={`absolute top-4 right-8 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${zone.type === "addition" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                   {zone.type}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-border flex items-center justify-between">
             <div className="space-y-4 w-full max-w-xs">
                <div className="flex justify-between items-baseline px-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground">Material Overage (Waste)</span>
                  <span className="text-sm font-black italic">{waste}%</span>
                </div>
                <input 
                  type="range" min={0} max={25} value={waste} onChange={(e) => setWaste(Number(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                />
             </div>
             <div className="flex bg-muted/20 border border-border rounded-xl p-1 shrink-0">
               <button onClick={() => setUseMetric(false)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!useMetric ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:text-foreground"}`}>Imperial</button>
               <button onClick={() => setUseMetric(true)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${useMetric ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:text-foreground"}`}>Metric</button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="p-6 sm:p-10 bg-muted/10 space-y-10 group">
          <div className="space-y-6">
             <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-2">Area Analysis</h3>
             
             <div className="p-10 rounded-[3rem] bg-foreground text-background shadow-2xl relative overflow-hidden transition-all group-hover:shadow-primary/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <span className="text-[10px] font-black uppercase opacity-60 tracking-widest italic">Net Surface Area</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black italic tracking-tighter">{totals.netArea.toFixed(1)}</span>
                  <span className="text-xl font-bold uppercase opacity-50">{useMetric ? "m²" : "sq ft"}</span>
                </div>
             </div>

             <div className="grid gap-4">
                <ResultItem 
                  label="Total With Waste" 
                  value={totals.grossArea.toFixed(1)} 
                  unit={useMetric ? "m²" : "sq ft"} 
                  icon={<Layers className="w-5 h-5" />}
                  subtext={`Inc. ${waste}% safety margin`}
                />
                <ResultItem 
                  label="Bound Perimeter" 
                  value={totals.perimeter.toFixed(0)} 
                  unit={useMetric ? "m" : "ft"} 
                  icon={<Ruler className="w-5 h-5" />}
                  subtext="Est. baseboard length"
                />
             </div>
          </div>

          <div className="pt-8 border-t border-border space-y-8">
             <div className="p-6 rounded-[2rem] border border-primary/20 bg-primary/5 space-y-2">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase text-primary tracking-widest">Efficiency Rating</span>
                   <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground italic leading-relaxed">
                   Your layout contains {zones.length} distinct zones. We recommend a <strong>{waste}%</strong> waste factor for {zones.length > 3 ? "complex" : "simple"} geometry.
                </div>
             </div>

             <button 
                onClick={exportPDF}
                className="w-full py-5 rounded-3xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
             >
                <Download className="w-5 h-5" /> Export Area Report
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function AreaInput({ label, value, unit, onChange }: { label: string, value: number, unit: string, onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-black uppercase text-muted-foreground block text-center tracking-tighter">{label} ({unit})</span>
      <div className="flex items-center gap-2 bg-background border border-border rounded-xl p-1 px-3 shadow-sm">
         <input 
           type="number" value={value} onChange={(e) => onChange(Number(e.target.value))}
           className="w-12 bg-transparent font-black text-sm text-center outline-none no-spinner"
         />
      </div>
    </div>
  );
}

function ResultItem({ label, value, unit, icon, subtext }: { label: string, value: string | number, unit: string, icon: React.ReactNode, subtext?: string }) {
  return (
    <div className="p-6 rounded-[2.5rem] bg-background border border-border flex items-center gap-6 group hover:shadow-xl transition-all">
       <div className="w-14 h-14 rounded-2xl bg-muted/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/10 transition-all font-black">
          {icon}
       </div>
       <div>
          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{label}</p>
          <div className="flex items-baseline gap-2">
             <span className="text-2xl font-black italic tracking-tighter">{value}</span>
             <span className="text-[10px] font-black uppercase text-muted-foreground">{unit}</span>
          </div>
          {subtext && <p className="text-[10px] text-muted-foreground italic font-semibold">{subtext}</p>}
       </div>
    </div>
  );
}
