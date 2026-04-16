"use client";

import React, { useState, useEffect } from "react";
import { Copy, Monitor, Droplet, ArrowRightLeft, CheckCircle2 } from "lucide-react";

export function RgbToCmykConverter() {
  const [r, setR] = useState<number>(59);
  const [g, setG] = useState<number>(130);
  const [b, setB] = useState<number>(246);

  const [hex, setHex] = useState<string>("#3b82f6");

  const [c, setC] = useState<number>(0);
  const [m, setM] = useState<number>(0);
  const [y, setY] = useState<number>(0);
  const [k, setK] = useState<number>(0);

  const [copiedCmyk, setCopiedCmyk] = useState(false);

  useEffect(() => {
    let rc = r / 255;
    let gc = g / 255;
    let bc = b / 255;

    let kVal = 1 - Math.max(rc, gc, bc);
    let cVal = 0, mVal = 0, yVal = 0;

    if (kVal < 1) {
      cVal = (1 - rc - kVal) / (1 - kVal);
      mVal = (1 - gc - kVal) / (1 - kVal);
      yVal = (1 - bc - kVal) / (1 - kVal);
    }

    setC(Math.round(cVal * 100));
    setM(Math.round(mVal * 100));
    setY(Math.round(yVal * 100));
    setK(Math.round(kVal * 100));

    const rHex = r.toString(16).padStart(2, "0");
    const gHex = g.toString(16).padStart(2, "0");
    const bHex = b.toString(16).padStart(2, "0");
    setHex(`#${rHex}${gHex}${bHex}`.toUpperCase());
  }, [r, g, b]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`cmyk(${c}%, ${m}%, ${y}%, ${k}%)`);
    setCopiedCmyk(true);
    setTimeout(() => setCopiedCmyk(false), 2000);
  };

  const handleInput = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 0;
    if (val > 255) val = 255;
    if (val < 0) val = 0;
    setter(val);
  };

  const totalInk = c + m + y + k;

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw relative overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">
        
        {/* RGB Input Panel */}
        <div className="p-6 sm:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-border">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">RGB Digital Colors</h3>
          </div>

          <div className="space-y-6">
            <ColorSlider label="Red" value={r} onChange={handleInput(setR)} max={255} color="bg-red-500" />
            <ColorSlider label="Green" value={g} onChange={handleInput(setG)} max={255} color="bg-green-500" />
            <ColorSlider label="Blue" value={b} onChange={handleInput(setB)} max={255} color="bg-blue-500" />
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
             <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Hex Code Equivalent</span>
                <p className="font-mono font-bold text-foreground">{hex}</p>
             </div>
             <div 
               className="w-16 h-16 rounded-2xl shadow-inner border border-border" 
               style={{ backgroundColor: hex }} 
             />
          </div>
        </div>

        {/* CMYK Output Panel */}
        <div className="p-6 sm:p-10 bg-muted/5 flex flex-col items-center justify-center space-y-10 relative group">
          <div className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground opacity-50">
            <Droplet className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">CMYK Print Output</span>
          </div>

          <div className="w-full max-w-sm space-y-8">
            {/* CMYK Approximation Card */}
            <div className="relative overflow-hidden w-full aspect-video rounded-[2.5rem] bg-white border border-border p-6 shadow-xl flex flex-col justify-between group-hover:border-primary/30 transition-all">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
               
               <div className="flex justify-between items-start z-10 w-full mb-6">
                 <div>
                   <p className="text-[10px] font-black uppercase opacity-50 tracking-widest block mb-4">Calculated Target Profile</p>
                   <div className="grid grid-cols-4 gap-4 text-center mt-2">
                     <div className="flex flex-col items-center"><span className="text-xl font-black text-cyan-500">{c}</span><span className="text-[8px] font-black uppercase text-muted-foreground">C</span></div>
                     <div className="flex flex-col items-center"><span className="text-xl font-black text-fuchsia-500">{m}</span><span className="text-[8px] font-black uppercase text-muted-foreground">M</span></div>
                     <div className="flex flex-col items-center"><span className="text-xl font-black text-yellow-500">{y}</span><span className="text-[8px] font-black uppercase text-muted-foreground">Y</span></div>
                     <div className="flex flex-col items-center"><span className="text-xl font-black text-zinc-800">{k}</span><span className="text-[8px] font-black uppercase text-muted-foreground">K</span></div>
                   </div>
                 </div>
               </div>

               <div className="z-10 bg-muted/30 border border-border px-4 py-3 rounded-2xl flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${totalInk > 300 ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} />
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Total Ink Limit: {totalInk}%</span>
                 </div>
                 {totalInk > 300 && <span className="text-[9px] font-bold text-red-500 uppercase">Warning: Exceeds 300%</span>}
               </div>
            </div>

            <button 
              onClick={copyToClipboard}
              className="w-full py-4 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {copiedCmyk ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              {copiedCmyk ? "Copied CMYK String" : "Copy CMYK Format"}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

function ColorSlider({ label, value, onChange, max, color }: { label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, max: number, color: string }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">{label}</span>
        <span className="font-mono font-bold text-foreground">{value}</span>
      </div>
      <div className="flex gap-4 items-center">
        <input 
          type="range" 
          min="0" 
          max={max} 
          value={value} 
          onChange={onChange} 
          className="flex-1 h-3 bg-muted rounded-full appearance-none overflow-hidden [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-border [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[-100vw_0_0_100vw_var(--tw-slider-color)]"
          style={{ '--tw-slider-color': color === 'bg-red-500' ? '#ef4444' : color === 'bg-green-500' ? '#22c55e' : color === 'bg-blue-500' ? '#3b82f6' : '#27272a' } as React.CSSProperties}
        />
        <input 
          type="number"
          min="0"
          max={max}
          value={value}
          onChange={onChange}
          className="w-16 p-2 rounded-xl border border-border text-center font-mono text-sm outline-none focus:border-primary"
        />
      </div>
    </div>
  );
}
