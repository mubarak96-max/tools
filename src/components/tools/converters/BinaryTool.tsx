"use client";

import React, { useState, useMemo } from "react";
import { 
  Copy, 
  Trash2, 
  Binary as BinaryIcon, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  Type,
  ArrowRightLeft
} from "lucide-react";

type Tab = "text-to-binary" | "binary-to-text";

export default function BinaryTool() {
  const [tab, setTab] = useState<Tab>("text-to-binary");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [useSpaces, setUseSpaces] = useState(true);

  const textToBinary = (text: string) => {
    return text.split("").map(char => {
      const binary = char.charCodeAt(0).toString(2).padStart(8, "0");
      return binary;
    }).join(useSpaces ? " " : "");
  };

  const binaryToText = (bin: string) => {
    const cleaned = bin.replace(/\s+/g, "");
    if (!/^[01]+$/.test(cleaned)) {
      throw new Error("Invalid binary sequence: Only 0s and 1s are allowed.");
    }
    
    const bytes = cleaned.match(/.{1,8}/g) || [];
    return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join("");
  };

  const result = useMemo(() => {
    if (!input) {
        setError("");
        return "";
    }
    try {
      setError("");
      if (tab === "text-to-binary") {
        return textToBinary(input);
      } else {
        return binaryToText(input);
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
    if (tab !== "text-to-binary" || !input) return [];
    return input.split("").slice(0, 100).map((char, i) => ({
      char: char === " " ? "Space" : char,
      code: char.charCodeAt(0),
      binary: char.charCodeAt(0).toString(2).padStart(8, "0")
    }));
  }, [input, tab]);

  return (
    <div className="space-y-8">
      {/* Tab Switcher */}
      <div className="flex bg-muted/30 p-1 rounded-2xl border border-border w-fit mx-auto">
        {[
          { id: "text-to-binary", label: "Text to Binary" },
          { id: "binary-to-text", label: "Binary to Text" }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => { setTab(item.id as Tab); clear(); }}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${tab === item.id ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Tool Card */}
      <div className="bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-white/5">
        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Input Area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                 {tab === "text-to-binary" ? <Type size={16} /> : <BinaryIcon size={16} />}
                 Input {tab === "text-to-binary" ? "Text" : "Binary"}
              </h3>
              <div className="text-[10px] font-mono text-muted-foreground">{input.length} Chars</div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tab === "text-to-binary" ? "Hello World..." : "01001000 01100101..."}
              className="w-full h-[300px] p-6 bg-muted/10 rounded-3xl border border-border outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm resize-none"
            />
          </div>

          {/* Result Area */}
          <div className="pt-8 lg:pt-0 lg:pl-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                 {tab === "text-to-binary" ? <BinaryIcon size={16} /> : <Type size={16} />}
                 Output
              </h3>
              <div className="flex items-center gap-4">
                 {tab === "text-to-binary" && (
                    <label className="flex items-center gap-2 cursor-pointer">
                       <input type="checkbox" checked={useSpaces} onChange={(e) => setUseSpaces(e.target.checked)} className="rounded text-primary" />
                       <span className="text-[10px] font-bold text-muted-foreground">Spaces</span>
                    </label>
                 )}
                 <div className="text-[10px] font-mono text-muted-foreground">{result.length} Chars</div>
              </div>
            </div>
            
            <div className="relative w-full h-[300px] rounded-3xl border border-border bg-muted/5 overflow-hidden">
               {error ? (
                  <div className="p-6 text-red-500 font-bold text-sm flex gap-3">
                     <AlertCircle size={20} className="shrink-0" />
                     {error}
                  </div>
               ) : (
                  <div className="w-full h-full p-6 font-mono text-sm leading-relaxed break-all overflow-y-auto whitespace-pre-wrap">
                    {tab === "text-to-binary" ? (
                      result.split(" ").map((byte, i) => (
                        <span key={i} className={i % 2 === 0 ? "text-primary font-bold" : "text-indigo-500 font-bold"}>
                          {byte}{useSpaces ? " " : ""}
                        </span>
                      ))
                    ) : (
                      result || <span className="text-muted-foreground/30 italic">Binary translation will appear here...</span>
                    )}
                  </div>
               )}
            </div>
          </div>
        </div>

        {/* Action Table Overlay / Side Panel */}
        {tab === "text-to-binary" && tableData.length > 0 && (
          <div className="px-8 pb-8">
             <div className="rounded-[1.5rem] border border-border bg-background/50 overflow-hidden">
                <table className="w-full text-left text-xs">
                   <thead className="bg-muted/50 border-b border-border">
                      <tr>
                         <th className="px-4 py-2 font-black uppercase text-[10px]">Char</th>
                         <th className="px-4 py-2 font-black uppercase text-[10px]">ASCII Code</th>
                         <th className="px-4 py-2 font-black uppercase text-[10px]">Binary (8-bit)</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-border/50 font-mono">
                      {tableData.slice(0, 10).map((row, i) => (
                         <tr key={i} className="hover:bg-primary/5 transition-colors">
                            <td className="px-4 py-2 font-bold text-primary">{row.char}</td>
                            <td className="px-4 py-2 text-muted-foreground">{row.code}</td>
                            <td className="px-4 py-2 text-indigo-500 font-bold">{row.binary}</td>
                         </tr>
                      ))}
                      {tableData.length > 10 && (
                        <tr>
                           <td colSpan={3} className="px-4 py-2 text-center text-[10px] text-muted-foreground bg-muted/20 italic">
                             Showing first 10 characters...
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        <div className="p-6 border-t border-border flex flex-wrap items-center justify-between gap-4 bg-muted/20">
          <div className="flex gap-2 w-full lg:w-auto">
            <button 
              onClick={handleCopy}
              disabled={!result || !!error}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50"
            >
              {status === "Copied!" ? <CheckCircle2 size={18} /> : <Copy size={18} />}
              {status || "Copy Result"}
            </button>
          </div>
          
          <button 
            onClick={clear}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all font-bold"
          >
            <Trash2 size={20} />
            Reset Tool
          </button>
        </div>
      </div>

      {/* Logic Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-gradient-to-br from-primary/5 to-indigo-500/5 border border-primary/10 rounded-[2rem] p-8 flex gap-6">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-primary shrink-0">
               <Hash size={24} />
            </div>
            <div className="space-y-2">
               <h4 className="font-bold">ASCII Character Mapping</h4>
               <p className="text-xs text-muted-foreground leading-relaxed">
                  Every character has a unique 0-255 decimal code in the ASCII table. We convert this decimal number into a base-2 binary sequence. For example, 'A' is 65 in decimal, which is <code>01000001</code> in binary.
               </p>
            </div>
         </div>
         <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/10 rounded-[2rem] p-8 flex gap-6">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-amber-600 shrink-0">
               <ArrowRightLeft size={24} />
            </div>
            <div className="space-y-2">
               <h4 className="font-bold">Reversible Translation</h4>
               <p className="text-xs text-muted-foreground leading-relaxed">
                  Since each byte represents exactly one character, binary-to-text is a deterministic process. As long as you have the correct 8-bit groups, the original message can be perfectly reconstructed without loss.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
