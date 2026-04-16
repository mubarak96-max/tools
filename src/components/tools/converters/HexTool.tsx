"use client";

import React, { useState, useMemo } from "react";
import { 
  Copy, 
  Trash2, 
  Hash, 
  CheckCircle2, 
  AlertCircle,
  Type,
  Maximize2,
  Minimize2
} from "lucide-react";

type Tab = "text-to-hex" | "hex-to-text";

export default function HexTool() {
  const [tab, setTab] = useState<Tab>("text-to-hex");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [useSpaces, setUseSpaces] = useState(true);
  const [uppercase, setUppercase] = useState(true);

  const textToHex = (text: string) => {
    return text.split("").map(char => {
      let hex = char.charCodeAt(0).toString(16).padStart(2, "0");
      return uppercase ? hex.toUpperCase() : hex.toLowerCase();
    }).join(useSpaces ? " " : "");
  };

  const hexToText = (hex: string) => {
    const cleaned = hex.replace(/[^0-9A-Fa-f]/g, "");
    if (cleaned.length % 2 !== 0) {
      throw new Error("Invalid hexadecimal sequence: Length must be even.");
    }
    
    const pairs = cleaned.match(/.{1,2}/g) || [];
    return pairs.map(pair => String.fromCharCode(parseInt(pair, 16))).join("");
  };

  const result = useMemo(() => {
    if (!input) {
        setError("");
        return "";
    }
    try {
      setError("");
      if (tab === "text-to-hex") {
        return textToHex(input);
      } else {
        return hexToText(input);
      }
    } catch (e: any) {
      setError(e.message);
      return "";
    }
  }, [input, tab, useSpaces, uppercase]);

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setStatus("Copied!");
    setTimeout(() => setStatus(""), 2000);
  };

  const clear = () => {
    setInput("");
    setStatus("");
    setError("");
  };

  const tableData = useMemo(() => {
    if (tab !== "text-to-hex" || !input) return [];
    return input.split("").slice(0, 50).map((char, i) => {
        const code = char.charCodeAt(0);
        let hex = code.toString(16).padStart(2, "0");
        return {
            char: char === " " ? "Space" : char,
            ascii: code,
            hex: uppercase ? hex.toUpperCase() : hex.toLowerCase()
        };
    });
  }, [input, tab, uppercase]);

  return (
    <div className="space-y-8">
      {/* Settings Bar */}
      <div className="flex flex-wrap items-center justify-between gap-6 bg-muted/30 p-2 rounded-3xl border border-border">
        <div className="flex bg-background p-1 rounded-2xl border border-border shadow-inner">
          {[
            { id: "text-to-hex", label: "Text to Hex" },
            { id: "hex-to-text", label: "Hex to Text" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id as Tab); clear(); }}
              className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${tab === item.id ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6 px-4">
           {tab === "text-to-hex" && (
              <>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={useSpaces} onChange={(e) => setUseSpaces(e.target.checked)} className="rounded-lg text-primary focus:ring-primary h-5 w-5 bg-background border-border" />
                  <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest">Spacing</span>
                </label>
                <div className="w-px h-6 bg-border" />
                <div className="flex items-center gap-2">
                   <button onClick={() => setUppercase(false)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all ${!uppercase ? "bg-primary text-white" : "bg-background text-muted-foreground hover:bg-muted"}`}>aa</button>
                   <button onClick={() => setUppercase(true)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all ${uppercase ? "bg-primary text-white" : "bg-background text-muted-foreground hover:bg-muted"}`}>AA</button>
                </div>
              </>
           )}
        </div>
      </div>

      {/* Primary Workspace */}
      <div className="bg-card border border-border rounded-[3rem] shadow-2xl overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Input Area */}
          <div className="p-10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 {tab === "text-to-hex" ? "Source Content" : "Hexadecimal Payload"}
              </h3>
              <div className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded border border-border">{input.length} Chars</div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tab === "text-to-hex" ? "Hello..." : "48 65 6C 6C 6F..."}
              className="w-full h-[400px] p-8 bg-muted/10 rounded-[2rem] border border-border outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-base resize-none"
            />
          </div>

          {/* Output Area */}
          <div className="p-10 space-y-6 bg-muted/5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-success" />
                 Translation
              </h3>
              <div className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded border border-border">{result.length} Chars</div>
            </div>

            <div className="w-full h-[400px] p-8 bg-background rounded-[2rem] border border-border shadow-inner-lg overflow-y-auto">
               {error ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-red-500 gap-4">
                     <AlertCircle size={48} className="opacity-20 translate-y-2" />
                     <p className="font-bold text-sm tracking-tight">{error}</p>
                     <p className="text-[10px] text-muted-foreground uppercase font-black">Decoding Failed</p>
                  </div>
               ) : (
                  <div className="font-mono text-base leading-relaxed break-all whitespace-pre-wrap selection:bg-primary selection:text-white">
                    {tab === "text-to-hex" ? (
                      result.split(" ").map((byte, i) => (
                        <span key={i} className={i % 2 === 0 ? "text-primary font-bold" : "text-indigo-500 font-bold"}>
                          {byte}{useSpaces ? " " : ""}
                        </span>
                      ))
                    ) : (
                      result || <span className="text-muted-foreground/30 italic">Encoded result will materialize here...</span>
                    )}
                  </div>
               )}
            </div>
          </div>
        </div>

        {/* Floating Actions */}
        <div className="absolute bottom-10 left-10 right-10 flex gap-4 pointer-events-none">
           <div className="flex-1" />
           <div className="flex gap-2 pointer-events-auto">
              <button 
                onClick={handleCopy}
                disabled={!result || !!error}
                className="flex items-center gap-3 px-10 py-5 rounded-3xl bg-primary text-white font-black shadow-2xl shadow-primary/40 hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 hover:scale-[1.02]"
              >
                {status === "Copied!" ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                {status || "COPY SELECTION"}
              </button>
              <button 
                onClick={clear}
                className="flex items-center gap-2 px-8 py-5 rounded-3xl bg-background border border-border text-muted-foreground hover:text-red-500 hover:bg-muted font-black transition-all shadow-xl"
              >
                <Trash2 size={20} />
              </button>
           </div>
        </div>
      </div>

      {/* Character Breakdown Table */}
      {tab === "text-to-hex" && tableData.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <Maximize2 size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-widest italic">Byte-Level Inspection</h2>
           </div>
           
           <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-xl">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-muted/50 border-b border-border">
                         <th className="px-8 py-5 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Original Character</th>
                         <th className="px-8 py-5 font-black uppercase text-[10px] tracking-widest text-muted-foreground">ASCII Decimal</th>
                         <th className="px-8 py-5 font-black uppercase text-[10px] tracking-widest text-primary">Hex Representation</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-border font-mono">
                      {tableData.map((row, i) => (
                         <tr key={i} className="hover:bg-muted/30 transition-colors group">
                            <td className="px-8 py-4 text-sm font-bold flex items-center gap-4">
                               <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">{row.char === "Space" ? " " : row.char}</div>
                               <span className={row.char === "Space" ? "italic opacity-50" : ""}>{row.char}</span>
                            </td>
                            <td className="px-8 py-4 text-xs text-muted-foreground">{row.ascii}</td>
                            <td className="px-8 py-4">
                                <code className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-black text-sm">
                                    0x{row.hex}
                                </code>
                            </td>
                         </tr>
                      ))}
                      {tableData.length >= 50 && (
                        <tr>
                            <td colSpan={3} className="px-8 py-4 text-center text-[10px] text-muted-foreground italic uppercase font-black">Table truncated for better performance...</td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
