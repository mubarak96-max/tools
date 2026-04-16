"use client";

import React, { useState, useEffect } from "react";
import { Copy, Hash, Paintbrush, ArrowRightLeft, CheckCircle2 } from "lucide-react";

function hexToRgb(h: string) {
  let r = 0, g = 0, b = 0;
  if (h.length === 4) {
    r = parseInt("0x" + h[1] + h[1]);
    g = parseInt("0x" + h[2] + h[2]);
    b = parseInt("0x" + h[3] + h[3]);
  } else if (h.length === 7) {
    r = parseInt("0x" + h[1] + h[2]);
    g = parseInt("0x" + h[3] + h[4]);
    b = parseInt("0x" + h[5] + h[6]);
  }
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHex(r: number, g: number, b: number) {
  const rHex = Math.max(0, Math.min(255, r)).toString(16).padStart(2, "0");
  const gHex = Math.max(0, Math.min(255, g)).toString(16).padStart(2, "0");
  const bHex = Math.max(0, Math.min(255, b)).toString(16).padStart(2, "0");
  return `#${rHex}${gHex}${bHex}`.toUpperCase();
}

export function HexToRgbConverter() {
  const [mode, setMode] = useState<"hex" | "rgb">("hex");

  const [hexInput, setHexInput] = useState<string>("#3B82F6");
  
  const [rInput, setRInput] = useState<string>("59");
  const [gInput, setGInput] = useState<string>("130");
  const [bInput, setBInput] = useState<string>("246");
  
  const [realHex, setRealHex] = useState<string>("#3B82F6");
  const [realRgb, setRealRgb] = useState<{r:number, g:number, b:number}>({r:59, g:130, b:246});
  const [realHsl, setRealHsl] = useState<{h:number, s:number, l:number}>({h:217, s:91, l:60});

  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Sync logic
  useEffect(() => {
    if (mode === "hex") {
      let val = hexInput.trim();
      if (!val.startsWith("#")) val = "#" + val;
      const isValid = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val);
      if (isValid) {
        setRealHex(val.toUpperCase());
        const rgb = hexToRgb(val);
        setRealRgb(rgb);
        setRealHsl(rgbToHsl(rgb.r, rgb.g, rgb.b));
        setRInput(rgb.r.toString());
        setGInput(rgb.g.toString());
        setBInput(rgb.b.toString());
      }
    } else {
      const rv = parseInt(rInput) || 0;
      const gv = parseInt(gInput) || 0;
      const bv = parseInt(bInput) || 0;
      setRealRgb({ r: rv, g: gv, b: bv });
      const hex = rgbToHex(rv, gv, bv);
      setRealHex(hex);
      setHexInput(hex);
      setRealHsl(rgbToHsl(rv, gv, bv));
    }
  }, [hexInput, rInput, gInput, bInput, mode]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const getInverseColor = () => {
    if (realRgb.r * 0.299 + realRgb.g * 0.587 + realRgb.b * 0.114 > 186) {
      return "#000000";
    }
    return "#FFFFFF";
  };

  const handleRgbChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val !== "") {
      const num = parseInt(val);
      if (num > 255) val = "255";
      if (num < 0) val = "0";
    }
    setter(val);
    setMode("rgb");
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw relative flex flex-col lg:flex-row gap-8">
       {/* Preview Panel */}
       <div className="flex-1 min-h-[400px] rounded-[3rem] shadow-2xl overflow-hidden relative flex flex-col justify-end p-8 transition-colors duration-500" style={{ backgroundColor: realHex, color: getInverseColor() }}>
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[3rem]" />
          
          <div className="relative z-10 space-y-4 max-w-sm">
             <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/10 shadow-lg border border-white/20">
                <span className="text-xs font-black uppercase tracking-widest opacity-80 mb-2 block">Hex Code</span>
                <div className="flex items-center justify-between">
                   <span className="text-4xl font-black italic tracking-tighter">{realHex}</span>
                   <button onClick={() => copyToClipboard(realHex, "hex")} className="p-3 rounded-full hover:bg-white/20 transition-all opacity-80 hover:opacity-100">
                     {copiedItem === "hex" ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div className="p-5 rounded-3xl backdrop-blur-md bg-white/10 shadow-lg border border-white/20 flex flex-col justify-between group">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-4">RGB Value</span>
                  <div className="flex items-end justify-between">
                    <span className="text-sm font-bold opacity-90 leading-none">rgb({realRgb.r}, {realRgb.g}, {realRgb.b})</span>
                    <button onClick={() => copyToClipboard(`rgb(${realRgb.r}, ${realRgb.g}, ${realRgb.b})`, "rgb")} className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all">
                      {copiedItem === "rgb" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
               </div>
               <div className="p-5 rounded-3xl backdrop-blur-md bg-white/10 shadow-lg border border-white/20 flex flex-col justify-between group">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-4">HSL Value</span>
                  <div className="flex items-end justify-between">
                    <span className="text-sm font-bold opacity-90 leading-none">hsl({realHsl.h}, {realHsl.s}%, {realHsl.l}%)</span>
                    <button onClick={() => copyToClipboard(`hsl(${realHsl.h}, ${realHsl.s}%, ${realHsl.l}%)`, "hsl")} className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all">
                      {copiedItem === "hsl" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
               </div>
             </div>
          </div>
       </div>

       {/* Controls Panel */}
       <div className="flex-1 space-y-10 py-6 pr-4 lg:pr-8">
          <div className="space-y-6">
             <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
               <Hash className="w-4 h-4 text-primary" /> Hex Input
             </h3>
             <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-muted-foreground">#</span>
                <input 
                  type="text" 
                  value={hexInput.replace("#", "")}
                  onChange={(e) => {
                    setHexInput(e.target.value);
                    setMode("hex");
                  }}
                  placeholder="3B82F6"
                  maxLength={6}
                  className="w-full bg-muted/5 border-2 border-border focus:border-primary/50 focus:bg-background rounded-3xl pl-16 pr-6 py-6 text-4xl font-black italic tracking-widest uppercase outline-none transition-all placeholder-foreground/20 text-foreground"
                />
             </div>
          </div>

          <div className="flex items-center justify-center">
             <button 
               onClick={() => setMode(mode === "hex" ? "rgb" : "hex")}
               className="p-4 rounded-full bg-muted/30 border border-border text-muted-foreground hover:bg-primary border-transparent hover:text-white transition-all shadow-sm"
               title="Toggle input mode"
             >
                <ArrowRightLeft className="w-5 h-5 rotate-90 lg:rotate-0" />
             </button>
          </div>

          <div className="space-y-6">
             <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
               <Paintbrush className="w-4 h-4 text-primary" /> RGB Input
             </h3>
             <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#ef4444] px-2">Red (0-255)</label>
                   <input 
                     type="number" min="0" max="255"
                     value={rInput} onChange={handleRgbChange(setRInput)}
                     className="w-full bg-muted/10 border-2 border-border focus:border-[#ef4444] rounded-2xl px-6 py-5 text-xl font-bold text-center outline-none transition-all"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#22c55e] px-2">Green (0-255)</label>
                   <input 
                     type="number" min="0" max="255"
                     value={gInput} onChange={handleRgbChange(setGInput)}
                     className="w-full bg-muted/10 border-2 border-border focus:border-[#22c55e] rounded-2xl px-6 py-5 text-xl font-bold text-center outline-none transition-all"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#3b82f6] px-2">Blue (0-255)</label>
                   <input 
                     type="number" min="0" max="255"
                     value={bInput} onChange={handleRgbChange(setBInput)}
                     className="w-full bg-muted/10 border-2 border-border focus:border-[#3b82f6] rounded-2xl px-6 py-5 text-xl font-bold text-center outline-none transition-all"
                   />
                </div>
             </div>
          </div>
       </div>
    </section>
  );
}
