"use client";

import React, { useState, useMemo } from "react";
import { 
  Copy, 
  Trash2, 
  Hash, 
  CheckCircle2, 
  AlertCircle,
  Palette,
  Droplets,
  Sun,
  Activity
} from "lucide-react";

export default function ColorConverterTool() {
  const [hexInput, setHexInput] = useState("#3B82F6");
  const [status, setStatus] = useState("");

  const colorData = useMemo(() => {
    let cleanHex = hexInput.replace(/^#/, "").trim();
    
    // Support 3-digit hex
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split("").map(s => s + s).join("");
    }

    if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
      return null;
    }

    const rHex = cleanHex.substring(0, 2);
    const gHex = cleanHex.substring(2, 4);
    const bHex = cleanHex.substring(4, 6);

    const r = parseInt(rHex, 16);
    const g = parseInt(gHex, 16);
    const b = parseInt(bHex, 16);

    // HSL Conversion
    const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h = (bNorm - rNorm) / d + 2; break;
        case bNorm: h = (rNorm - gNorm) / d + 4; break;
      }
      h /= 6;
    }

    return {
      hex: "#" + cleanHex.toUpperCase(),
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
      r, g, b,
      rHex, gHex, bHex,
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }, [hexInput]);

  const handleCopy = async (val: string) => {
    await navigator.clipboard.writeText(val);
    setStatus(val);
    setTimeout(() => setStatus(""), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Search & Preview Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="glass-card p-10 rounded-[3rem] border border-border/80 space-y-8">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Hex Color Code</label>
              <div className="relative group">
                 <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary">
                    <Hash size={24} />
                 </div>
                 <input 
                    type="text"
                    value={hexInput}
                    onChange={(e) => setHexInput(e.target.value)}
                    className="w-full bg-muted/10 border border-border rounded-3xl py-6 pl-16 pr-8 text-2xl font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:opacity-20 uppercase"
                    placeholder="e.g. #FF0000"
                 />
              </div>
           </div>

           {colorData ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {[
                   { label: "HEX", value: colorData.hex, icon: Palette },
                   { label: "RGB", value: colorData.rgb, icon: Droplets },
                   { label: "HSL", value: colorData.hsl, icon: Sun },
                 ].map((item) => (
                    <button 
                       key={item.label}
                       onClick={() => handleCopy(item.value)}
                       className="p-4 rounded-2xl border border-border bg-background hover:bg-muted/50 transition-all flex flex-col gap-1 items-start group relative"
                    >
                       <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</span>
                       <span className="text-xs font-bold truncate w-full text-left">{item.value}</span>
                       <Copy size={12} className="absolute top-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                       {status === item.value && (
                          <div className="absolute inset-0 bg-primary/90 rounded-2xl flex items-center justify-center text-white font-black text-[10px] animate-in fade-in">COPIED</div>
                       )}
                    </button>
                 ))}
              </div>
           ) : (
              <div className="p-10 rounded-3xl border border-danger/20 bg-danger-soft text-danger flex items-center gap-4">
                 <AlertCircle size={24} />
                 <p className="font-bold text-sm">Please enter a valid 3 or 6 digit hex code.</p>
              </div>
           )}
        </div>

        {/* Big Preview Swatch */}
        <div className="flex flex-col items-center gap-6">
           <div 
              className="w-full max-w-[400px] aspect-square rounded-[3rem] shadow-2xl border-8 border-white dark:border-zinc-800 transition-colors duration-300"
              style={{ backgroundColor: colorData?.hex || "#CCCCCC" }}
           />
           <div className="grid grid-cols-2 gap-4 w-full max-w-[400px]">
              <div className="p-6 rounded-3xl bg-card border border-border shadow-md">
                 <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Contrast Check</h4>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold" style={{ color: colorData?.hex }}>Abc Text</span>
                       <span className="text-[10px] font-black uppercase text-muted-foreground">On Light</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900">
                       <span className="text-xs font-bold" style={{ color: colorData?.hex }}>Abc Text</span>
                       <span className="text-[10px] font-black uppercase text-zinc-500">On Dark</span>
                    </div>
                 </div>
              </div>
              <div className="p-6 rounded-3xl bg-card border border-border shadow-md flex flex-col justify-center items-center gap-2">
                  <Activity size={24} className="text-primary/40" />
                  <p className="text-[10px] text-center font-black text-muted-foreground uppercase leading-tight">Live Color Spectrum Analysis</p>
              </div>
           </div>
        </div>
      </div>

      {/* Breakdown Section */}
      {colorData && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* RGB Split */}
              <div className="glass-card p-8 rounded-[2.5rem] border border-border/80">
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-500" /> Channels
                 </h3>
                 <div className="space-y-6">
                    {[
                      { l: "Red", v: colorData.r, h: colorData.rHex, c: "bg-rose-500" },
                      { l: "Green", v: colorData.g, h: colorData.gHex, c: "bg-emerald-500" },
                      { l: "Blue", v: colorData.b, h: colorData.bHex, c: "bg-blue-500" }
                    ].map(chan => (
                       <div key={chan.l} className="space-y-3">
                          <div className="flex justify-between items-end text-xs font-bold">
                             <span>{chan.l}</span>
                             <span className="font-mono text-muted-foreground">0x{chan.h} = {chan.v}</span>
                          </div>
                          <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                             <div className={`h-full ${chan.c} transition-all duration-500`} style={{ width: `${(chan.v / 255) * 100}%` }} />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Composition */}
              <div className="glass-card p-8 rounded-[2.5rem] border border-border/80 md:col-span-2">
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    <Droplets size={16} className="text-primary" /> Technical Description
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <p className="text-xs leading-relaxed text-muted-foreground font-medium italic">
                          This color has a luminance of <span className="text-foreground font-bold">{colorData.l}%</span> and a saturation level of <span className="text-foreground font-bold">{colorData.s}%</span>. It is positioned at <span className="text-foreground font-bold">{colorData.h}°</span> on the standard 360° color wheel.
                       </p>
                       <div className="p-4 rounded-2xl bg-muted/20 border border-border flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">CSS Color Rule</span>
                          <code className="text-xs font-bold text-primary">color: {colorData.hex};</code>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hex to Decimal Pairings</h4>
                       <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                          <div className="bg-background p-2 rounded-lg border border-border flex justify-between">
                             <span className="text-muted-foreground">#{colorData.rHex}</span>
                             <span className="font-bold">{colorData.r}</span>
                          </div>
                          <div className="bg-background p-2 rounded-lg border border-border flex justify-between text-muted-foreground">
                             <span>(Red)</span>
                          </div>
                          <div className="bg-background p-2 rounded-lg border border-border flex justify-between">
                             <span className="text-muted-foreground">#{colorData.gHex}</span>
                             <span className="font-bold">{colorData.g}</span>
                          </div>
                          <div className="bg-background p-2 rounded-lg border border-border flex justify-between text-muted-foreground">
                             <span>(Green)</span>
                          </div>
                          <div className="bg-background p-2 rounded-lg border border-border flex justify-between">
                             <span className="text-muted-foreground">#{colorData.bHex}</span>
                             <span className="font-bold">{colorData.b}</span>
                          </div>
                          <div className="bg-background p-2 rounded-lg border border-border flex justify-between text-muted-foreground">
                             <span>(Blue)</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
