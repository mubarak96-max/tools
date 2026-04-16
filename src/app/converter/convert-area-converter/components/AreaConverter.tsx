"use client";

import React, { useState, useMemo } from "react";
import { 
  Square, ArrowRightLeft, Download, Info, Link2, Map
} from "lucide-react";

type UnitOption = "sqcm" | "sqm" | "ha" | "sqkm" | "sqin" | "sqft" | "sqyd" | "ac" | "sqmi";

const UNITS: Record<UnitOption, { name: string; symbol: string; toSqM: number; type: "metric" | "imperial" | "land" }> = {
  sqcm: { name: "Square Centimeter", symbol: "sq cm", toSqM: 0.0001, type: "metric" },
  sqm: { name: "Square Meter", symbol: "sq m", toSqM: 1, type: "metric" },
  ha: { name: "Hectare", symbol: "ha", toSqM: 10000, type: "land" },
  sqkm: { name: "Square Kilometer", symbol: "sq km", toSqM: 1000000, type: "land" },
  sqin: { name: "Square Inch", symbol: "sq in", toSqM: 0.00064516, type: "imperial" },
  sqft: { name: "Square Foot", symbol: "sq ft", toSqM: 0.09290304, type: "imperial" },
  sqyd: { name: "Square Yard", symbol: "sq yd", toSqM: 0.83612736, type: "imperial" },
  ac: { name: "Acre", symbol: "ac", toSqM: 4046.8564224, type: "land" },
  sqmi: { name: "Square Mile", symbol: "sq mi", toSqM: 2589988.110336, type: "land" }
};

export function AreaConverter() {
  const [inputValue, setInputValue] = useState<string>("1");
  const [inputUnit, setInputUnit] = useState<UnitOption>("sqm");
  const [precision, setPrecision] = useState<number>(4);

  const baseValueInSqM = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return 0;
    return val * UNITS[inputUnit].toSqM;
  }, [inputValue, inputUnit]);

  const results = useMemo(() => {
    const res: Record<string, string> = {};
    (Object.keys(UNITS) as UnitOption[]).forEach(unit => {
      const val = baseValueInSqM / UNITS[unit].toSqM;
      res[unit] = parseFloat(val.toFixed(precision)).toString();
    });
    return res;
  }, [baseValueInSqM, precision]);

  const exportCSV = () => {
    let csv = `Area Unit,Value (${results[inputUnit]} ${UNITS[inputUnit].symbol} Equivalent)\n`;
    (Object.keys(UNITS) as UnitOption[]).forEach(u => {
      csv += `${UNITS[u].name},${results[u]}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `area-conversion-${results[inputUnit]}${UNITS[inputUnit].symbol}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const currentVal = parseFloat(inputValue) || 0;

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw relative overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_350px] gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">
        {/* Workspace */}
        <div className="p-6 sm:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <Square className="w-4 h-4 text-primary" />
              Surface Area Input
            </h3>
            <div className="flex bg-muted/20 border border-border rounded-xl p-1 shrink-0">
               <button onClick={() => setPrecision(2)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${precision === 2 ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:text-foreground"}`}>.00</button>
               <button onClick={() => setPrecision(4)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${precision === 4 ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:text-foreground"}`}>.0000</button>
               <button onClick={() => setPrecision(6)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${precision === 6 ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:text-foreground"}`}>.000000</button>
            </div>
          </div>

          <div className="space-y-6">
             {/* Primary Input */}
             <div className="relative group">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="0"
                  className="w-full bg-muted/5 border-2 border-border focus:border-primary/50 focus:bg-background rounded-3xl px-8 py-10 text-6xl font-black italic tracking-tighter outline-none transition-all placeholder-foreground/20 text-foreground"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3 bg-background border border-border p-2 pr-6 rounded-2xl shadow-lg w-[200px]">
                   <select 
                     value={inputUnit}
                     onChange={(e) => setInputUnit(e.target.value as UnitOption)}
                     className="bg-transparent font-black uppercase tracking-widest text-primary outline-none appearance-none cursor-pointer pl-4 w-full text-xs"
                   >
                     <optgroup label="Metric / SI">
                       <option value="sqcm">sq cm — Sq Centimeter</option>
                       <option value="sqm">sq m — Sq Meter</option>
                     </optgroup>
                     <optgroup label="Imperial (US/UK)">
                       <option value="sqin">sq in — Sq Inch</option>
                       <option value="sqft">sq ft — Sq Foot</option>
                       <option value="sqyd">sq yd — Sq Yard</option>
                     </optgroup>
                     <optgroup label="Land / Maps">
                       <option value="ha">ha — Hectare</option>
                       <option value="ac">ac — Acre</option>
                       <option value="sqkm">sq km — Sq Kilometer</option>
                       <option value="sqmi">sq mi — Sq Mile</option>
                     </optgroup>
                   </select>
                </div>
             </div>

             {/* Conversion Chain Visual */}
             <div className="flex items-center gap-4 p-5 rounded-2xl border border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-widest text-primary overflow-x-auto whitespace-nowrap hide-scrollbar">
                <Link2 className="w-4 h-4 shrink-0" />
                <span>{currentVal.toFixed(2)} {UNITS[inputUnit].symbol}</span>
                <ArrowRightLeft className="w-3 h-3 opacity-50 shrink-0" />
                <span>{results["sqm"]} sq m</span>
                {inputUnit !== "sqft" && (
                  <>
                    <ArrowRightLeft className="w-3 h-3 opacity-50 shrink-0" />
                    <span>{results["sqft"]} sq ft</span>
                  </>
                )}
             </div>
          </div>

          <div className="pt-10 border-t border-border">
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
               {(Object.keys(UNITS) as UnitOption[]).map(unit => {
                 if (unit === inputUnit) return null;
                 return (
                   <ResultCard 
                     key={unit} 
                     label={UNITS[unit].name} 
                     symbol={UNITS[unit].symbol} 
                     value={results[unit]} 
                     type={UNITS[unit].type}
                   />
                 )
               })}
             </div>
          </div>
        </div>

        {/* Results Analysis Panel */}
        <div className="p-6 sm:p-10 bg-muted/10 space-y-10 group flex flex-col">
          <div className="space-y-6 flex-1">
             <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-2">Geometric Scaling</h3>
             
             <div className="p-8 rounded-[2.5rem] bg-foreground text-background shadow-2xl relative overflow-hidden transition-all group-hover:shadow-primary/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <span className="text-[10px] font-black uppercase opacity-60 tracking-widest italic block mb-4">Base Metric (SI) Equivalence</span>
                
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between opacity-50 text-sm">
                    <span className="font-bold">1 {UNITS[inputUnit].symbol} =</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-4xl font-black italic tracking-tighter truncate" title={UNITS[inputUnit].toSqM.toString()}>{UNITS[inputUnit].toSqM}</span>
                    <span className="text-sm font-black uppercase mt-1">Square Meters (m²)</span>
                  </div>
                </div>
             </div>

             <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-border bg-background flex items-start gap-4">
                   <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center text-foreground shrink-0 mt-1">
                      <Map className="w-4 h-4" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Area Squaring Rule</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Converting area involves squaring the linear ratio. 1 Meter = 100 cm. Therefore, 1 Square Meter = 10,000 Square Centimeters (100² = 10,000).
                      </p>
                   </div>
                </div>
             </div>
          </div>

          <div className="pt-8 border-t border-border space-y-4">
             <button 
                onClick={exportCSV}
                className="w-full py-5 rounded-3xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
             >
                <Download className="w-5 h-5" /> Export CSV Table
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultCard({ label, symbol, value, type }: { label: string, symbol: string, value: string, type: string }) {
  let themeColor = "bg-blue-500";
  if (type === "imperial") themeColor = "bg-rose-500";
  if (type === "land") themeColor = "bg-emerald-500";

  return (
    <div className="p-4 rounded-2xl border border-border bg-background hover:border-primary/30 hover:shadow-lg transition-all group flex flex-col justify-between min-h-[100px] relative overflow-hidden">
       <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 opacity-20 ${themeColor}`} />
       
       <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest truncate" title={label}>{label}</span>
       <div className="flex flex-col mt-2">
          <span className="text-lg font-black italic text-foreground tracking-tighter truncate max-w-[95%]" title={value}>{value}</span>
          <span className="text-[10px] font-black text-muted-foreground">{symbol}</span>
       </div>
    </div>
  );
}
