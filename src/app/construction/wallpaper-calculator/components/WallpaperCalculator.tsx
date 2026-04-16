"use client";

import React, { useState, useMemo } from "react";
import { 
  type WallpaperInputs, 
  calculateWallpaper 
} from "@/lib/tools/wallpaper-calculator";
import { 
  Plus, Minus, Ruler, Download, Layout, 
  Maximize, Info, ShoppingCart, TrendingUp, Sparkles, Check, Scissors, Layers
} from "lucide-react";

const BATCH_COSTS = {
  primer: 15.00,
  paste: 12.00,
  kit: 19.99
};

export function WallpaperCalculator() {
  const [wallWidth, setWallWidth] = useState(15);
  const [wallHeight, setWallHeight] = useState(8.5);
  const [rollWidth, setRollWidth] = useState(20.5); // Euro Standard
  const [rollLength, setRollLength] = useState(33); // Euro Standard
  const [patternRepeat, setPatternRepeat] = useState(21); // 21 inches
  const [pricePerRoll, setPricePerRoll] = useState(45.00);
  const [waste, setWaste] = useState(10);
  const [useMetric, setUseMetric] = useState(false);

  const inputs: WallpaperInputs = useMemo(() => ({
    wallWidth,
    wallHeight,
    rollWidth,
    rollLength,
    patternRepeat,
    waste,
    pricePerRoll
  }), [wallWidth, wallHeight, rollWidth, rollLength, patternRepeat, waste, pricePerRoll]);

  const result = useMemo(() => calculateWallpaper(inputs), [inputs]);

  const exportPDF = async () => {
    const { jsPDF } = await import("jspdf/dist/jspdf.es.min.js");
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Wallpaper Material Report", 20, 30);
    doc.setFontSize(12);
    doc.text(`Wall: ${wallWidth}ft x ${wallHeight}ft`, 20, 45);
    doc.text(`Roll dimensions: ${rollWidth}in x ${rollLength}ft`, 20, 52);
    doc.text(`Pattern Repeat: ${patternRepeat}in`, 20, 59);
    doc.text(`-------------------------------------------`, 20, 66);
    doc.text(`Total Drops Required: ${result.totalDrops}`, 20, 73);
    doc.text(`Total Rolls Needed: ${result.totalRolls}`, 20, 80);
    doc.text(`Estimated Material Cost: $${result.estimatedCost.toFixed(2)}`, 20, 87);
    doc.save("wallpaper-estimate.pdf");
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw relative overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_400px] gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">
        {/* Input Sidebar */}
        <div className="p-6 sm:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 text-balance">
              <Layout className="w-4 h-4 text-primary" />
              Installation Parameters
            </h3>
            <div className="flex bg-muted/20 border border-border rounded-xl p-1">
               <button onClick={() => setUseMetric(false)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!useMetric ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:text-foreground"}`}>Imperial</button>
               <button onClick={() => setUseMetric(true)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${useMetric ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:text-foreground"}`}>Metric</button>
            </div>
          </div>

          <div className="grid gap-10">
            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-8">
                 <InputLabelValue label="Wall Total Width" value={wallWidth} unit="ft" min={1} max={500} step={0.5} onChange={setWallWidth} />
                 <InputLabelValue label="Wall Height" value={wallHeight} unit="ft" min={1} max={20} step={0.1} onChange={setWallHeight} />
              </div>
              
              <div className="pt-6 border-t border-border">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-6 px-1">Roll Specifications</span>
                <div className="grid sm:grid-cols-2 gap-8">
                   <InputLabelValue label="Roll Width" value={rollWidth} unit="in" min={1} max={60} step={0.5} onChange={setRollWidth} />
                   <InputLabelValue label="Roll Length" value={rollLength} unit="ft" min={5} max={100} step={1} onChange={setRollLength} />
                </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Pattern Repeat (Vertical)</span>
                    <span className="text-sm font-black italic">{patternRepeat} in</span>
                 </div>
                 <input 
                    type="range" min={0} max={48} step={1}
                    value={patternRepeat}
                    onChange={(e) => setPatternRepeat(Number(e.target.value))}
                    className="w-full h-1.5 bg-primary/20 rounded-full appearance-none cursor-pointer accent-primary"
                 />
                 <div className="flex gap-2 justify-between">
                    <button onClick={() => setPatternRepeat(0)} className={`flex-1 py-1 rounded-lg text-[8px] font-black uppercase border border-primary/20 transition-all ${patternRepeat === 0 ? "bg-primary text-primary-foreground" : "bg-transparent text-primary hover:bg-primary/5"}`}>Free Match</button>
                    <button onClick={() => setPatternRepeat(12)} className={`flex-1 py-1 rounded-lg text-[8px] font-black uppercase border border-primary/20 transition-all ${patternRepeat === 12 ? "bg-primary text-primary-foreground" : "bg-transparent text-primary hover:bg-primary/5"}`}>Small (12")</button>
                    <button onClick={() => setPatternRepeat(21)} className={`flex-1 py-1 rounded-lg text-[8px] font-black uppercase border border-primary/20 transition-all ${patternRepeat === 21 ? "bg-primary text-primary-foreground" : "bg-transparent text-primary hover:bg-primary/5"}`}>Med (21")</button>
                 </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <span className="text-[10px] font-black uppercase text-muted-foreground block px-1">Price per Roll</span>
                   <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                      <input 
                        type="number" value={pricePerRoll} onChange={(e) => setPricePerRoll(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-3 rounded-2xl bg-muted/10 border border-border font-black text-sm outline-none focus:border-primary/50"
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <span className="text-[10px] font-black uppercase text-muted-foreground block px-1">Waste Factor</span>
                   <div className="flex items-center gap-2 bg-muted/10 border border-border rounded-2xl p-1 px-3">
                      <input 
                        type="number" value={waste} onChange={(e) => setWaste(Number(e.target.value))}
                        className="w-12 bg-transparent font-black text-sm outline-none no-spinner"
                      />
                      <span className="text-xs font-bold text-muted-foreground font-black italic">%</span>
                   </div>
                </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="p-6 sm:p-10 bg-muted/10 space-y-10 group">
          <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Pattern Breakdown</h3>
                <Scissors className="w-5 h-5 text-primary opacity-50" />
             </div>

             <div className="aspect-[4/3] rounded-[2.5rem] bg-background border border-border shadow-inner relative flex items-center justify-center overflow-hidden">
                <WallpaperVisualizer pattern={patternRepeat} />
                <div className="absolute top-6 left-6 flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Drops required</span>
                  <span className="text-3xl font-black italic tracking-tighter">{result.totalDrops} Vertical Strips</span>
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <div className="grid gap-4">
                <ResultCard 
                  label="Total Material" 
                  value={result.totalRolls} 
                  unit="rolls"
                  icon={<Layers className="w-5 h-5 text-primary" />}
                />
                <ResultCard 
                  label="Waste Projection" 
                  value={Math.round((result.totalRolls * rollLength * (waste / 100)) + (result.totalDrops * (patternRepeat / 12)))} 
                  unit="linear ft"
                  icon={<Scissors className="w-5 h-5 text-destructive" />}
                />
             </div>

             <div className="pt-8 border-t border-border space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Fulfillment Summary</h4>
                <div className="space-y-3">
                   <MaterialRow label="Wallpaper Rolls" qty={result.totalRolls} unit="Rolls" price={pricePerRoll} />
                   <MaterialRow label="Wallpaper Primer (Sizing)" qty={1} unit="Gal" price={BATCH_COSTS.primer} />
                   <MaterialRow label="Universal Paste" qty={2} unit="Kits" price={BATCH_COSTS.paste} />
                </div>
                <div className="p-6 rounded-[2rem] bg-foreground text-background">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase opacity-60 italic">Estimated Total</span>
                      <TrendingUp className="w-4 h-4 opacity-50" />
                   </div>
                   <div className="text-4xl font-black italic tracking-tighter">
                      ${(result.estimatedCost + BATCH_COSTS.primer + (BATCH_COSTS.paste * 2)).toFixed(2)}
                   </div>
                </div>
             </div>

             <button 
                onClick={exportPDF}
                className="w-full py-5 rounded-[2rem] bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
             >
                <Download className="w-5 h-5" /> Export Order List
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputLabelValue({ label, value, unit, min, max, step, onChange }: { label: string, value: number, unit: string, min: number, max: number, step: number, onChange: (v: number) => void }) {
  return (
    <div className="space-y-3 flex-1">
      <div className="flex justify-between items-baseline px-1">
        <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground line-clamp-1">{label}</span>
        <span className="text-[10px] font-black text-primary">{value} {unit}</span>
      </div>
      <input 
        type="number" value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-4 py-3 rounded-2xl bg-muted/10 border border-border font-black text-sm outline-none focus:border-primary/50"
      />
    </div>
  );
}

function ResultCard({ label, value, unit, icon }: { label: string, value: number, unit: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-[3rem] border border-border bg-background shadow-sm flex items-center gap-6">
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
        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest italic">Qty: {qty} {unit} @ ${price.toFixed(2)}</span>
      </div>
      <span className="font-bold text-primary">${(qty * price).toFixed(2)}</span>
    </div>
  );
}

function WallpaperVisualizer({ pattern }: { pattern: number }) {
  const showRepeat = pattern > 0;
  
  return (
    <svg viewBox="0 0 400 300" className="w-[85%] h-[85%] overflow-visible opacity-20">
      <defs>
        <pattern id="motif" x="0" y="0" width="100" height={pattern > 0 ? pattern * 4 : 40} patternUnits="userSpaceOnUse">
           <circle cx="50" cy="20" r="10" fill="currentColor" className="text-primary" />
           {showRepeat && <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="2" />}
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#motif)" className="text-muted-foreground" />
      
      {/* Visual representation of 'Drops' */}
      <g stroke="currentColor" strokeWidth="1" className="text-foreground">
        <line x1="100" y1="0" x2="100" y2="300" strokeDasharray="5,5" />
        <line x1="200" y1="0" x2="200" y2="300" strokeDasharray="5,5" />
        <line x1="300" y1="0" x2="300" y2="300" strokeDasharray="5,5" />
      </g>
    </svg>
  );
}
