"use client";

import React, { useState, useMemo } from "react";
import { 
  Plus, Minus, Ruler, Download, Layout, 
  Trash2, Info, ShoppingCart, TrendingUp, Sparkles, Check, Home, Layers,
  Box, Shield, GripVertical, AlertTriangle
} from "lucide-react";

export function StaircaseCalculator() {
  const [totalRise, setTotalRise] = useState(108); // 9ft
  const [targetRise, setTargetRise] = useState(7.5);
  const [treadDepth, setTreadDepth] = useState(11);
  const [treadThickness, setTreadThickness] = useState(1);
  const [stairWidth, setStairWidth] = useState(36);
  const [nosing, setNosing] = useState(1);

  const results = useMemo(() => {
    const numRisers = Math.round(totalRise / targetRise);
    const actualRise = totalRise / numRisers;
    const numTreads = numRisers - 1;
    const totalRun = numTreads * treadDepth;
    const stairAngle = (Math.atan(actualRise / treadDepth) * 180) / Math.PI;
    const stringerLength = Math.sqrt(Math.pow(totalRise, 2) + Math.pow(totalRun, 2));
    
    // Safety Checks (IRC)
    const isRiseSafe = actualRise <= 7.75;
    const isTreadSafe = treadDepth >= 10;
    const isAngleSafe = stairAngle >= 30 && stairAngle <= 37;
    const isRuleOf25Safe = (2 * actualRise) + treadDepth >= 24 && (2 * actualRise) + treadDepth <= 25;

    return {
      numRisers,
      actualRise,
      numTreads,
      totalRun,
      stairAngle,
      stringerLength,
      isRiseSafe,
      isTreadSafe,
      isAngleSafe,
      isRuleOf25Safe,
      blondel: (2 * actualRise) + treadDepth
    };
  }, [totalRise, targetRise, treadDepth]);

  const exportPDF = async () => {
    const { jsPDF } = await import("jspdf/dist/jspdf.es.min.js");
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Staircase Engineering Report", 20, 30);
    doc.setFontSize(12);
    doc.text(`Total Rise: ${totalRise} in`, 20, 45);
    doc.text(`Total Run: ${results.totalRun.toFixed(2)} in`, 20, 52);
    doc.text(`Step Count: ${results.numRisers} Risers, ${results.numTreads} Treads`, 20, 59);
    doc.text(`Individual Rise: ${results.actualRise.toFixed(3)} in`, 20, 66);
    doc.text(`Individual Run: ${treadDepth} in`, 20, 73);
    doc.text(`Stringer Length: ${results.stringerLength.toFixed(2)} in`, 20, 80);
    doc.text(`-------------------------------------------`, 20, 87);
    doc.text(`Code Compliance: ${results.isRiseSafe ? "PASS" : "FAIL (Rise too high)"}`, 20, 94);
    doc.save("stair-calculation.pdf");
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw relative overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_400px] gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">
        {/* Workspace */}
        <div className="p-6 sm:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <Ruler className="w-4 h-4 text-primary" />
              Rise & Run Parameters
            </h3>
          </div>

          <div className="grid gap-12">
            <div className="grid sm:grid-cols-2 gap-10">
               <InputBlock label="Total Rise (Floor to Floor)" value={totalRise} unit="in" onChange={setTotalRise} />
               <InputBlock label="Target Vertical Rise" value={targetRise} unit="in" onChange={setTargetRise} />
            </div>

            <div className="pt-10 border-t border-border">
               <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <InputBlock label="Tread Depth (Run)" value={treadDepth} unit="in" onChange={setTreadDepth} />
                  <InputBlock label="Tread Thickness" value={treadThickness} unit="in" onChange={setTreadThickness} />
                  <InputBlock label="Nosing Overhang" value={nosing} unit="in" onChange={setNosing} />
               </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-muted/5 border border-border space-y-6">
               <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 text-balance">
                    <Shield className="w-4 h-4 text-primary" /> IBC/IRC Compliance Guard
                  </h4>
                  <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${results.isRiseSafe && results.isTreadSafe ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"}`}>
                     {results.isRiseSafe && results.isTreadSafe ? "Compliant" : "Issue Detected"}
                  </div>
               </div>
               <div className="grid sm:grid-cols-2 gap-4">
                  <ComplianceCard label="Riser Height" status={results.isRiseSafe} value={`${results.actualRise.toFixed(2)}"`} info="Max 7.75\" />
                  <ComplianceCard label="Tread Depth" status={results.isTreadSafe} value={`${treadDepth}"`} info="Min 10\" />
                  <ComplianceCard label="Stair Angle" status={results.isAngleSafe} value={`${results.stairAngle.toFixed(1)}°`} info="30°-37° ideal" />
                  <ComplianceCard label="Rule of 25" status={results.isRuleOf25Safe} value={results.blondel.toFixed(1)} info="2R + 1T (24-25)" />
               </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="p-6 sm:p-10 bg-muted/10 space-y-10 group">
          <div className="space-y-6">
             <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-2">Blueprint Analysis</h3>
             
             <div className="aspect-square p-8 rounded-[3rem] bg-background border border-border shadow-inner relative flex flex-col justify-end overflow-hidden group-hover:shadow-xl transition-all">
                <div className="absolute top-6 left-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
                  Visual Projection
                </div>
                <StairVisualizer risers={results.numRisers} rise={results.actualRise} run={treadDepth} />
                <div className="mt-8 flex justify-between items-end border-t border-border pt-4">
                   <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-muted-foreground">Steps</span>
                      <p className="text-2xl font-black italic tracking-tighter text-foreground">{results.numRisers} Risers</p>
                   </div>
                   <div className="text-right space-y-1">
                      <span className="text-[10px] font-black uppercase text-muted-foreground">Stringer</span>
                      <p className="text-2xl font-black italic tracking-tighter text-primary">{Math.ceil(results.stringerLength / 12)}' Board</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <ResultRow label="Total Stair Run" value={results.totalRun.toFixed(1)} unit="inches" />
             <ResultRow label="Stringer Length" value={results.stringerLength.toFixed(1)} unit="inches" />
             <ResultRow label="Angle of Incline" value={results.stairAngle.toFixed(1)} unit="degrees" />
          </div>

          <div className="pt-4 border-t border-border space-y-6">
             <button 
                onClick={exportPDF}
                className="w-full py-5 rounded-3xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
             >
                <Download className="w-5 h-5" /> Download Blueprint
             </button>
             <p className="text-[10px] text-muted-foreground text-center italic leading-relaxed opacity-60">
               *Calculations based on stringer points. Verify with local building codes before cutting material.
             </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputBlock({ label, value, unit, onChange }: { label: string, value: number, unit: string, onChange: (v: number) => void }) {
  return (
    <div className="space-y-3">
      <span className="text-[10px] font-black uppercase text-muted-foreground px-1 tracking-tight">{label}</span>
      <div className="relative group">
         <input 
           type="number" value={value} step={0.1} onChange={(e) => onChange(Number(e.target.value))}
           className="w-full bg-muted/10 border border-border rounded-2xl px-5 py-3.5 font-black text-sm outline-none focus:border-primary/40 focus:bg-background transition-all"
         />
         <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-muted-foreground opacity-30">{unit}</span>
      </div>
    </div>
  );
}

function ComplianceCard({ label, status, value, info }: { label: string, status: boolean, value: string | number, info: string }) {
  return (
    <div className={`p-4 rounded-2xl border transition-all ${status ? "bg-background border-border" : "bg-destructive/5 border-destructive/20"}`}>
       <div className="flex items-center justify-between mb-1">
          <span className="text-[8px] font-black uppercase text-muted-foreground">{label}</span>
          {!status && <AlertTriangle className="w-3 h-3 text-destructive" />}
       </div>
       <div className="flex items-baseline gap-2">
          <span className={`text-sm font-black ${status ? "text-foreground" : "text-destructive"}`}>{value}</span>
          <span className="text-[8px] font-bold text-muted-foreground opacity-50">{info}</span>
       </div>
    </div>
  );
}

function ResultRow({ label, value, unit }: { label: string, value: string | number, unit: string }) {
  return (
    <div className="flex items-center justify-between px-2">
       <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{label}</span>
       <div className="flex items-baseline gap-1">
          <span className="font-black italic text-foreground">{value}</span>
          <span className="text-[8px] font-black uppercase text-muted-foreground">{unit}</span>
       </div>
    </div>
  );
}

function StairVisualizer({ risers, rise, run }: { risers: number, rise: number, run: number }) {
  // SVG drawing of the steps
  const scale = 150 / (risers * Math.max(rise, run / 2));
  
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full opacity-80">
       <g fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
          {Array.from({ length: Math.min(risers, 10) }).map((_, i) => (
            <path 
              key={i}
              d={`M ${10 + i * (run * scale)} ${190 - i * (rise * scale)} 
                 L ${10 + (i + 1) * (run * scale)} ${190 - i * (rise * scale)} 
                 L ${10 + (i + 1) * (run * scale)} ${190 - (i + 1) * (rise * scale)}`}
              className="drop-shadow-sm"
            />
          ))}
          {/* Floor indications */}
          <line x1="0" y1="190" x2="200" y2="190" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-muted-foreground/30" />
          <text x="10" y="185" className="text-[8px] font-black uppercase fill-muted-foreground/50">Lower Floor</text>
       </g>
    </svg>
  );
}
