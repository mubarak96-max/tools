"use client";

import React, { useState, useMemo } from "react";
import { 
  Copy, 
  Trash2, 
  Binary, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  Table as TableIcon,
  Maximize2
} from "lucide-react";

type Tab = "text-to-octal" | "octal-to-text";

export default function OctalTool() {
  const [tab, setTab] = useState<Tab>("text-to-octal");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [useSpaces, setUseSpaces] = useState(true);

  const textToOctal = (text: string) => {
    return text.split("").map(char => {
      return char.charCodeAt(0).toString(8).padStart(3, "0");
    }).join(useSpaces ? " " : "");
  };

  const octalToText = (octal: string) => {
    const cleaned = octal.replace(/[^0-7]/g, " ").trim().split(/\s+/);
    if (!cleaned[0] && octal.length > 0) return "";
    
    return cleaned.map(part => {
      if (!part) return "";
      const val = parseInt(part, 8);
      if (isNaN(val)) throw new Error(`Invalid octal value: ${part}`);
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
      if (tab === "text-to-octal") {
        return textToOctal(input);
      } else {
        return octalToText(input);
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
    if (tab !== "text-to-octal" || !input) return [];
    return input.split("").slice(0, 50).map((char, i) => {
        const code = char.charCodeAt(0);
        return {
            char: char === " " ? "Space" : char,
            ascii: code,
            octal: code.toString(8).padStart(3, "0")
        };
    });
  }, [input, tab]);

  return (
    <div className="space-y-8">
      {/* Settings Bar */}
      <div className="flex flex-wrap items-center justify-between gap-6 bg-muted/30 p-2 rounded-3xl border border-border">
        <div className="flex bg-background p-1 rounded-2xl border border-border shadow-inner">
          {[
            { id: "text-to-octal", label: "Text to Octal" },
            { id: "octal-to-text", label: "Octal to Text" }
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
           {tab === "text-to-octal" && (
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={useSpaces} onChange={(e) => setUseSpaces(e.target.checked)} className="rounded-lg text-primary focus:ring-primary h-5 w-5 bg-background border-border" />
                <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest">Spacing</span>
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
                 Source
              </h3>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tab === "text-to-octal" ? "Hello..." : "110 145 154 154 157..."}
              className="w-full h-[400px] p-8 bg-muted/10 rounded-[2rem] border border-border outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-base resize-none"
            />
          </div>

          {/* Output Area */}
          <div className="p-10 space-y-6 bg-muted/5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-success" />
                 Result
              </h3>
            </div>

            <div className="w-full h-[400px] p-8 bg-background rounded-[2rem] border border-border shadow-inner-lg overflow-y-auto">
               {error ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-red-500 gap-4">
                     <AlertCircle size={48} className="opacity-20" />
                     <p className="font-bold text-sm tracking-tight">{error}</p>
                  </div>
               ) : (
                  <div className="font-mono text-lg leading-relaxed break-all whitespace-pre-wrap">
                    {result || <span className="text-muted-foreground/30 italic">Output will appear here...</span>}
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
                {status || "COPY"}
              </button>
              <button 
                onClick={clear}
                className="flex items-center gap-2 px-8 py-5 rounded-3xl bg-background border border-border text-muted-foreground hover:text-red-500 transition-all shadow-xl"
              >
                <Trash2 size={20} />
              </button>
           </div>
        </div>
      </div>

      {/* Detail Table */}
      {tab === "text-to-octal" && tableData.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <Maximize2 size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-widest italic text-foreground">Byte Breakdown</h2>
           </div>
           
           <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-xl">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-muted/50 border-b border-border text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                         <th className="px-8 py-5">Character</th>
                         <th className="px-8 py-5">Decimal Code</th>
                         <th className="px-8 py-5 text-primary">Octal Value</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-border font-mono">
                      {tableData.map((row, i) => (
                         <tr key={i} className="hover:bg-muted/30 transition-colors">
                            <td className="px-8 py-4 font-bold flex items-center gap-4">
                               <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-primary">{row.char === "Space" ? " " : row.char}</div>
                               <span className={row.char === "Space" ? "italic opacity-50" : ""}>{row.char}</span>
                            </td>
                            <td className="px-8 py-4 text-sm text-muted-foreground">{row.ascii}</td>
                            <td className="px-8 py-4">
                                <code className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-black text-sm">
                                    \{row.octal}
                                </code>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
