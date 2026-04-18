"use client";

import React, { useState, useEffect } from "react";
import { 
  Hash, 
  Binary as BinaryIcon, 
  Cpu, 
  RefreshCw,
  Copy,
  Trash2,
  CheckCircle2,
  Table as TableIcon,
  Layers
} from "lucide-react";

export default function NumberSystemConverter() {
  const [values, setValues] = useState({
    binary: "",
    decimal: "",
    hex: "",
    octal: ""
  });
  const [status, setStatus] = useState("");

  const updateAll = (source: keyof typeof values, value: string) => {
    const cleaned = value.trim().replace(/\s/g, "");
    if (!cleaned) {
      setValues({ binary: "", decimal: "", hex: "", octal: "" });
      return;
    }

    try {
      let decimal: bigint;
      if (source === "binary") {
        if (!/^[01]+$/.test(cleaned)) throw new Error();
        decimal = BigInt("0b" + cleaned);
      } else if (source === "decimal") {
        if (!/^-?\d+$/.test(cleaned)) throw new Error();
        decimal = BigInt(cleaned);
      } else if (source === "hex") {
        if (!/^[0-9a-fA-F]+$/.test(cleaned)) throw new Error();
        decimal = BigInt("0x" + cleaned);
      } else if (source === "octal") {
        if (!/^[0-7]+$/.test(cleaned)) throw new Error();
        decimal = BigInt("0o" + cleaned);
      } else {
        return;
      }

      setValues({
        binary: decimal.toString(2),
        decimal: decimal.toString(10),
        hex: decimal.toString(16).toUpperCase(),
        octal: decimal.toString(8)
      });
    } catch (e) {
      setValues(prev => ({ ...prev, [source]: value }));
    }
  };

  const handleCopy = async (val: string) => {
    if (!val) return;
    await navigator.clipboard.writeText(val);
    setStatus("Copied!");
    setTimeout(() => setStatus(""), 2000);
  };

  const clear = () => {
    setValues({ binary: "", decimal: "", hex: "", octal: "" });
  };

  const bitBreakdown = useMemo(() => {
    if (!values.binary) return [];
    return values.binary.padStart(Math.ceil(values.binary.length / 8) * 8, "0").split("").reverse().map((bit, i) => ({
        index: i,
        set: bit === "1",
        value: 2**i
    })).reverse();
  }, [values.binary]);

  return (
    <div className="space-y-10">
      {/* Real-time Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { label: "Decimal", key: "decimal", color: "text-rose-500", border: "border-rose-200", bg: "bg-rose-50/30", icon: Hash },
          { label: "Binary", key: "binary", color: "text-blue-500", border: "border-blue-200", bg: "bg-blue-50/30", icon: BinaryIcon },
          { label: "Hexadecimal", key: "hex", color: "text-emerald-500", border: "border-emerald-200", bg: "bg-emerald-50/30", icon: Cpu },
          { label: "Octal", key: "octal", color: "text-orange-500", border: "border-orange-200", bg: "bg-orange-50/30", icon: RefreshCw },
        ].map((field) => (
          <div key={field.key} className={`p-8 rounded-[2.5rem] border ${field.border} ${field.bg} shadow-md transition-all hover:shadow-lg group relative`}>
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-white border border-inherit ${field.color}`}>
                     <field.icon size={20} />
                  </div>
                  <h3 className={`text-sm font-black uppercase tracking-widest ${field.color}`}>{field.label}</h3>
               </div>
               <button 
                  onClick={() => handleCopy(values[field.key as keyof typeof values])}
                  className="p-2 hover:bg-white rounded-lg transition-colors text-muted-foreground hover:text-foreground"
               >
                  <Copy size={16} />
               </button>
             </div>
             
             <textarea
               value={values[field.key as keyof typeof values]}
               onChange={(e) => updateAll(field.key as any, e.target.value)}
               className="w-full bg-transparent border-none outline-none font-mono text-2xl font-bold tracking-tight resize-none h-24 placeholder:opacity-20"
               placeholder={`Enter ${field.label}...`}
             />

             {status === "Copied!" && (
               <div className="absolute top-4 right-12 px-3 py-1 bg-success text-white text-[10px] font-black rounded-lg animate-in fade-in slide-in-from-right-2">COPIED</div>
             )}
          </div>
        ))}
      </div>

      {/* Bit Inspector for Binary */}
      {values.binary && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                 <Layers size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-widest italic text-foreground">Bit-Level Architecture</h2>
           </div>

           <div className="p-8 rounded-[2.5rem] border border-border bg-card shadow-2xl overflow-hidden">
              <div className="flex flex-wrap gap-2 justify-center">
                 {bitBreakdown.map((bit, i) => (
                    <div key={i} className="space-y-2 group cursor-default">
                       <div className={`w-10 h-14 rounded-xl flex items-center justify-center font-mono text-xl font-black border-2 transition-all ${bit.set ? "bg-blue-500 border-blue-400 text-white translate-y-[-4px]" : "bg-muted border-border text-muted-foreground opacity-50"}`}>
                          {bit.set ? "1" : "0"}
                       </div>
                       <p className="text-[10px] text-center font-black opacity-30 group-hover:opacity-100 transition-opacity">
                          2<sup>{bit.index}</sup>
                       </p>
                    </div>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <div className="p-8 rounded-[2.5rem] border border-border bg-card shadow-lg">
                <h3 className="text-xl font-black uppercase tracking-widest italic text-foreground mb-4">Binary Formats & Two's Complement</h3>
                <div className="space-y-4 font-mono text-sm">
                   {[8, 16, 32, 64].map(bits => {
                      let val = BigInt(values.decimal || "0");
                      if (val < 0n) {
                         let mask = (1n << BigInt(bits)) - 1n;
                         val = val & mask;
                      }
                      let binStr = val.toString(2);
                      if (binStr.length <= bits) binStr = binStr.padStart(bits, BigInt(values.decimal || "0") < 0n ? "1" : "0");
                      else binStr = "Overflow (Value too large)";

                      return (
                         <div key={bits} className="flex flex-col gap-1 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                           <span className="text-xs text-muted-foreground uppercase">{bits}-bit {BigInt(values.decimal || "0") < 0n ? "(Two's Complement)" : ""}</span>
                           <span className="break-all font-bold text-primary">{binStr}</span>
                         </div>
                      );
                   })}
                </div>
              </div>
              <div className="p-8 rounded-[2.5rem] border border-border bg-card shadow-lg flex flex-col justify-center">
                <h3 className="text-xl font-black uppercase tracking-widest italic text-foreground mb-4">Base Place Values</h3>
                <div className="space-y-4">
                   <div className="text-xs text-muted-foreground"><strong className="text-rose-500 block text-sm">Decimal (Base 10)</strong> 10⁰=1, 10¹=10, 10²=100, 10³=1000...</div>
                   <div className="text-xs text-muted-foreground"><strong className="text-emerald-500 block text-sm">Hexadecimal (Base 16)</strong> 16⁰=1, 16¹=16, 16²=256, 16³=4096...</div>
                   <div className="text-xs text-muted-foreground"><strong className="text-orange-500 block text-sm">Octal (Base 8)</strong> 8⁰=1, 8¹=8, 8²=64, 8³=512...</div>
                   <div className="text-xs text-muted-foreground"><strong className="text-blue-500 block text-sm">Binary (Base 2)</strong> 2⁰=1, 2¹=2, 2²=4, 2³=8, 2⁴=16...</div>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* Conversion Table Context */}
      <div className="bg-muted/10 border border-border rounded-[2.5rem] p-10 flex flex-col items-center text-center gap-6">
         <div className="p-4 rounded-3xl bg-background border border-border shadow-sm">
            <Trash2 size={24} className="text-muted-foreground cursor-pointer hover:text-red-500 transition-colors" onClick={clear} />
         </div>
         <div className="max-w-xl space-y-2">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] italic">Pro Tip: 64-bit Ready</h4>
            <p className="text-xs leading-relaxed text-muted-foreground">This tool uses JavaScript BigInt arithmetic to safely handle numbers beyond the standard 53-bit limit, making it ideal for low-level systems engineering and large data analysis.</p>
         </div>
      </div>
    </div>
  );
}

import { useMemo } from "react";
