"use client";

import React, { useState, useEffect } from "react";
import { Copy, Droplet, Monitor, ArrowRightLeft, CheckCircle2 } from "lucide-react";

export function CmykToRgbConverter() {
  const [c, setC] = useState<number>(100);
  const [m, setM] = useState<number>(50);
  const [y, setY] = useState<number>(0);
  const [k, setK] = useState<number>(0);

  const [r, setR] = useState<number>(0);
  const [g, setG] = useState<number>(0);
  const [b, setB] = useState<number>(0);
  
  const [hex, setHex] = useState<string>("#000000");

  const [copiedRgb, setCopiedRgb] = useState(false);
  const [copiedHex, setCopiedHex] = useState(false);

  useEffect(() => {
    // Math: r = 255 * (1-C) * (1-K)
    const red = Math.round(255 * (1 - c / 100) * (1 - k / 100));
    const green = Math.round(255 * (1 - m / 100) * (1 - k / 100));
    const blue = Math.round(255 * (1 - y / 100) * (1 - k / 100));

    setR(red);
    setG(green);
    setB(blue);

    const rHex = red.toString(16).padStart(2, "0");
    const gHex = green.toString(16).padStart(2, "0");
    const bHex = blue.toString(16).padStart(2, "0");
    setHex(`#${rHex}${gHex}${bHex}`.toUpperCase());
  }, [c, m, y, k]);

  const copyToClipboard = (text: string, type: "rgb" | "hex") => {
    navigator.clipboard.writeText(text);
    if (type === "rgb") {
      setCopiedRgb(true);
      setTimeout(() => setCopiedRgb(false), 2000);
    } else {
      setCopiedHex(true);
      setTimeout(() => setCopiedHex(false), 2000);
    }
  };

  const handleInput = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 0;
    if (val > 100) val = 100;
    if (val < 0) val = 0;
    setter(val);
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw relative overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">
        
        {/* CMYK Input Panel */}
        <div className="p-6 sm:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-border">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">CMYK Ink Levels</h3>
          </div>

          <div className="space-y-6">
            <ColorSlider label="Cyan" value={c} onChange={handleInput(setC)} color="bg-cyan-500" />
            <ColorSlider label="Magenta" value={m} onChange={handleInput(setM)} color="bg-fuchsia-500" />
            <ColorSlider label="Yellow" value={y} onChange={handleInput(setY)} color="bg-yellow-400" />
            <ColorSlider label="Key (Black)" value={k} onChange={handleInput(setK)} color="bg-zinc-800" />
          </div>

          <div className="p-4 rounded-2xl bg-muted/20 border border-border flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background shrink-0 mt-1">
              <span className="font-bold text-xs">%</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Ink Limit</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {(c + m + y + k)}% Total Ink Coverage (TIL). Professional printers usually require a maximum TIL of 300% to prevent ink bleed and paper saturation.
              </p>
            </div>
          </div>
        </div>

        {/* RGB Output Panel */}
        <div className="p-6 sm:p-10 bg-muted/5 flex flex-col items-center justify-center space-y-10 relative group">
          <div className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground opacity-50">
            <Monitor className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Digital Output</span>
          </div>

          <div className="w-full max-w-sm space-y-8">
            <div 
              className="w-full aspect-square rounded-[3rem] shadow-xl border-4 border-white transition-colors duration-300 relative overflow-hidden" 
              style={{ backgroundColor: hex }}
            >
               <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[3rem]" />
            </div>

            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-border shadow-sm">
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">RGB Value</p>
                   <p className="font-mono font-bold">{r}, {g}, {b}</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(`rgb(${r}, ${g}, ${b})`, "rgb")}
                  className="p-3 rounded-xl bg-muted/30 text-foreground hover:bg-primary hover:text-white transition-all group/btn"
                  title="Copy RGB"
                >
                  {copiedRgb ? <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover/btn:text-white" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-border shadow-sm">
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Hex Code</p>
                   <p className="font-mono font-bold text-primary">{hex}</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(hex, "hex")}
                  className="p-3 rounded-xl bg-muted/30 text-foreground hover:bg-primary hover:text-white transition-all group/btn"
                  title="Copy Hex"
                >
                  {copiedHex ? <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover/btn:text-white" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function ColorSlider({ label, value, onChange, color }: { label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, color: string }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">{label}</span>
        <span className="font-mono font-bold text-foreground">{value}%</span>
      </div>
      <div className="flex gap-4 items-center">
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={value} 
          onChange={onChange} 
          className="flex-1 h-3 bg-muted rounded-full appearance-none overflow-hidden [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-border [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[-100vw_0_0_100vw_var(--tw-slider-color)]"
          style={{ '--tw-slider-color': color === 'bg-cyan-500' ? '#06b6d4' : color === 'bg-fuchsia-500' ? '#d946ef' : color === 'bg-yellow-400' ? '#facc15' : '#27272a' } as React.CSSProperties}
        />
        <input 
          type="number"
          min="0"
          max="100"
          value={value}
          onChange={onChange}
          className="w-16 p-2 rounded-xl border border-border text-center font-mono text-sm outline-none focus:border-primary"
        />
      </div>
    </div>
  );
}
