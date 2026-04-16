"use client";

import React, { useState, useMemo } from "react";
import { 
  Copy, 
  Trash2, 
  Type, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  List as ListIcon
} from "lucide-react";

type Tab = "text-to-decimal" | "decimal-to-text";

export default function DecimalTool() {
  const [tab, setTab] = useState<Tab>("text-to-decimal");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [useSpaces, setUseSpaces] = useState(true);

  const textToDecimal = (text: string) => {
    return text.split("").map(char => {
      return char.charCodeAt(0).toString(10);
    }).join(useSpaces ? " " : "");
  };

  const decimalToText = (decimal: string) => {
    const cleaned = decimal.replace(/[^0-9]/g, " ").trim().split(/\s+/);
    if (!cleaned[0] && decimal.length > 0) return "";
    
    return cleaned.map(part => {
      if (!part) return "";
      const val = parseInt(part, 10);
      if (isNaN(val) || val < 0 || val > 65535) throw new Error(`Invalid decimal character code: ${part}`);
      return String.fromCharCode(val);
    }).join("");
  };

  const result = useMemo(() => {
    if (!input) {
      setError("");
      return "";
    }
    try {
      setError("");
      if (tab === "text-to-decimal") {
        return textToDecimal(input);
      } else {
        return decimalToText(input);
      }
    } catch (e: any) {
      setError(e.message);
      return "";
    }
  }, [input, tab, useSpaces]);

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
    if (tab !== "text-to-decimal" || !input) return [];
    return input.split("").slice(0, 50).map((char, i) => {
        const code = char.charCodeAt(0);
        return {
            char: char === " " ? "Space" : char,
            decimal: code,
        };
    });
  }, [input, tab]);

  return (
    <div className="space-y-8">
      {/* Settings Bar */}
      <div className="flex flex-wrap items-center justify-between gap-6 bg-muted/30 p-2 rounded-3xl border border-border">
        <div className="flex bg-background p-1 rounded-2xl border border-border shadow-inner">
          {[
            { id: "text-to-decimal", label: "Text to Decimal" },
            { id: "decimal-to-text", label: "Decimal to Text" }
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
           {tab === "text-to-decimal" && (
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={useSpaces} onChange={(e) => setUseSpaces(e.target.checked)} className="rounded-lg text-primary focus:ring-primary h-5 w-5 bg-background border-border" />
                <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest">Space Separated</span>
              </label>
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
                 Source Input
              </h3>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tab === "text-to-decimal" ? "Hello..." : "72 101 108 108 111..."}
              className="w-full h-[400px] p-8 bg-muted/10 rounded-[2rem] border border-border outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-base resize-none"
            />
          </div>

          {/* Output Area */}
          <div className="p-10 space-y-6 bg-muted/5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-success" />
                 Decimal Result
              </h3>
            </div>

            <div className="w-full h-[400px] p-8 bg-background rounded-[2rem] border border-border shadow-inner-lg overflow-y-auto">
               {error ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-red-500 gap-4">
                     <AlertCircle size={48} className="opacity-20 translate-y-2" />
                     <p className="font-bold text-sm tracking-tight">{error}</p>
                  </div>
               ) : (
                  <div className="font-mono text-lg leading-relaxed break-all whitespace-pre-wrap">
                    {result || <span className="text-muted-foreground/30 italic">Character codes will materialize here...</span>}
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
                className="flex items-center gap-3 px-10 py-5 rounded-3xl bg-primary text-white font-black shadow-2xl shadow-primary/40 hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50"
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

      {/* Code Legend Table */}
      {tab === "text-to-decimal" && tableData.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <ListIcon size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-widest italic text-foreground">Character Index</h2>
           </div>
           
           <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-xl">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-muted/50 border-b border-border text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                         <th className="px-8 py-5">Input Character</th>
                         <th className="px-8 py-5 text-primary">Base-10 character code</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-border font-mono">
                      {tableData.map((row, i) => (
                         <tr key={i} className="hover:bg-muted/30 transition-colors group">
                            <td className="px-8 py-4 font-bold flex items-center gap-4">
                               <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">{row.char === "Space" ? " " : row.char}</div>
                               <span className={row.char === "Space" ? "italic opacity-50" : ""}>{row.char}</span>
                            </td>
                            <td className="px-8 py-4">
                                <code className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-black text-sm">
                                    {row.decimal}
                                </code>
                            </td>
                         </tr>
                      ))}
                      {tableData.length >= 50 && (
                        <tr>
                            <td colSpan={2} className="px-8 py-4 text-center text-[10px] text-muted-foreground italic uppercase font-black">Table truncated for better performance...</td>
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
