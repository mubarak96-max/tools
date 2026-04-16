"use client";

import React, { useState, useMemo } from "react";
import { 
  Ruler, ArrowRightLeft, Settings2, Download, Table2, Info, Check, Link2
} from "lucide-react";

type UnitOption = "mm" | "cm" | "m" | "km" | "in" | "ft" | "yd" | "mi" | "nm";

const UNITS: Record<UnitOption, { name: string; symbol: string; toMeters: number; type: "metric" | "imperial" }> = {
  mm: { name: "Millimeter", symbol: "mm", toMeters: 0.001, type: "metric" },
  cm: { name: "Centimeter", symbol: "cm", toMeters: 0.01, type: "metric" },
  m: { name: "Meter", symbol: "m", toMeters: 1, type: "metric" },
  km: { name: "Kilometer", symbol: "km", toMeters: 1000, type: "metric" },
  in: { name: "Inch", symbol: "in", toMeters: 0.0254, type: "imperial" },
  ft: { name: "Foot", symbol: "ft", toMeters: 0.3048, type: "imperial" },
  yd: { name: "Yard", symbol: "yd", toMeters: 0.9144, type: "imperial" },
  mi: { name: "Mile", symbol: "mi", toMeters: 1609.344, type: "imperial" },
  nm: { name: "Naut. Mile", symbol: "nmi", toMeters: 1852, type: "imperial" }
};

export function LengthConverter() {
  const [inputValue, setInputValue] = useState<string>("1");
  const [inputUnit, setInputUnit] = useState<UnitOption>("m");
  const [precision, setPrecision] = useState<number>(4);

  // Core conversion engine
  const baseValueInMeters = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return 0;
    return val * UNITS[inputUnit].toMeters;
  }, [inputValue, inputUnit]);

  const results = useMemo(() => {
    const res: Record<string, string> = {};
    (Object.keys(UNITS) as UnitOption[]).forEach(unit => {
      const val = baseValueInMeters / UNITS[unit].toMeters;
      // Truncate trailing zeros if it's a clean decimal
      res[unit] = parseFloat(val.toFixed(precision)).toString();
    });
    return res;
  }, [baseValueInMeters, precision]);

  const exportCSV = () => {
    let csv = `Length Unit,Value (${results[inputUnit]} ${UNITS[inputUnit].symbol} Equivalent)\n`;
    (Object.keys(UNITS) as UnitOption[]).forEach(u => {
      csv += `${UNITS[u].name},${results[u]}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `length-conversion-${results[inputUnit]}${UNITS[inputUnit].symbol}.csv`;
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
              <Ruler className="w-4 h-4 text-primary" />
              Source Measurement
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
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3 bg-background border border-border p-2 pr-6 rounded-2xl shadow-lg">
                   <select 
                     value={inputUnit}
                     onChange={(e) => setInputUnit(e.target.value as UnitOption)}
                     className="bg-transparent font-black uppercase tracking-widest text-primary outline-none appearance-none cursor-pointer pl-4"
                   >
                     {(Object.keys(UNITS) as UnitOption[]).map(k => (
                       <option key={k} value={k}>{UNITS[k].symbol} — {UNITS[k].name}</option>
                     ))}
                   </select>
                </div>
             </div>

             {/* Conversion Chain Visual */}
             <div className="flex items-center gap-4 p-5 rounded-2xl border border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-widest text-primary overflow-x-auto whitespace-nowrap hide-scrollbar">
                <Link2 className="w-4 h-4 shrink-0" />
                <span>{currentVal.toFixed(2)} {UNITS[inputUnit].symbol}</span>
                <ArrowRightLeft className="w-3 h-3 opacity-50 shrink-0" />
                <span>{results["m"]} m</span>
                {inputUnit !== "ft" && (
                  <>
                    <ArrowRightLeft className="w-3 h-3 opacity-50 shrink-0" />
                    <span>{results["ft"]} ft</span>
                  </>
                )}
             </div>
          </div>

          <div className="pt-10 border-t border-border">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
             <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-2">Scale Factor</h3>
             
             <div className="p-8 rounded-[2.5rem] bg-foreground text-background shadow-2xl relative overflow-hidden transition-all group-hover:shadow-primary/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <span className="text-[10px] font-black uppercase opacity-60 tracking-widest italic block mb-4">Base Metric Equivalence</span>
                
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between opacity-50 text-sm">
                    <span className="font-bold">1 {UNITS[inputUnit].symbol} =</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black italic tracking-tighter truncate">{UNITS[inputUnit].toMeters}</span>
                    <span className="text-sm font-black uppercase">Meters</span>
                  </div>
                </div>
             </div>

             <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-border bg-background flex items-start gap-4">
                   <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center text-foreground shrink-0 mt-1">
                      <Info className="w-4 h-4" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Architecture Standard</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        To convert strictly between Imperial systems (e.g. Inches to Feet), modern logic still translates through the metric {`(${UNITS["m"].symbol})`} standard defined in 1959.
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
  return (
    <div className="p-4 rounded-2xl border border-border bg-background hover:border-primary/30 hover:shadow-lg transition-all group flex flex-col justify-between min-h-[100px] relative overflow-hidden">
       <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 opacity-20 ${type === "metric" ? "bg-blue-500" : "bg-orange-500"}`} />
       
       <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{label}</span>
       <div className="flex items-baseline gap-1 mt-2">
          <span className="text-lg font-black italic text-foreground tracking-tighter truncate max-w-[85%]" title={value}>{value}</span>
          <span className="text-[10px] font-black text-muted-foreground">{symbol}</span>
       </div>
    </div>
  );
}
