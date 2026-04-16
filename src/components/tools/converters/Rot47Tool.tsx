"use client";

import React, { useState, useMemo } from "react";
import { 
  Copy, 
  Trash2, 
  Zap, 
  Binary,
  ShieldCheck,
  CheckCircle2,
  ListOrdered
} from "lucide-react";

export default function Rot47Tool() {
  const [input, setInput] = useState("");
  const [batchMode, setBatchMode] = useState(false);
  const [status, setStatus] = useState("");

  const rot47 = (str: string) => {
    return str.split("").map(char => {
      const code = char.charCodeAt(0);
      if (code >= 33 && code <= 126) {
        return String.fromCharCode(((code - 33 + 47) % 94) + 33);
      }
      return char;
    }).join("");
  };

  const result = useMemo(() => {
    if (!input) return "";
    if (batchMode) {
      return input.split("\n").map(line => rot47(line)).join("\n");
    }
    return rot47(input);
  }, [input, batchMode]);

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setStatus("Copied!");
    setTimeout(() => setStatus(""), 2000);
  };

  const clear = () => {
    setInput("");
    setStatus("");
  };

  const renderHighlightedText = (text: string) => {
    if (!text) return <span className="text-muted-foreground/30 italic">Enter characters (! to ~) to rotate...</span>;
    
    return text.split("").map((char, i) => {
      const code = char.charCodeAt(0);
      const isRotated = code >= 33 && code <= 126;
      if (isRotated) {
        return <span key={i} className="text-indigo-500 font-bold">{char}</span>;
      }
      return <span key={i} className="text-muted-foreground opacity-50">{char}</span>;
    });
  };

  // Generate a sample of the mapping (first 20 chars)
  const sampleMapping = useMemo(() => {
    const samples = [];
    for (let i = 33; i < 33 + 15; i++) {
        const char = String.fromCharCode(i);
        samples.push({ from: char, to: rot47(char) });
    }
    return samples;
  }, []);

  return (
    <div className="space-y-8">
      {/* Main Tool Card */}
      <div className="bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-white/5">
        <div className="p-4 bg-muted/50 border-b border-border flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                <ShieldCheck size={18} />
              </div>
              <span className="text-sm font-bold">ROT47 Extended Cipher</span>
           </div>
           
           <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-10 h-5 rounded-full border border-border relative transition-colors ${batchMode ? "bg-indigo-600 border-indigo-600" : "bg-muted"}`}>
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={batchMode} 
                  onChange={() => setBatchMode(!batchMode)} 
                />
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${batchMode ? "translate-x-5" : ""}`} />
              </div>
              <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">Batch Mode</span>
            </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
          <div className="p-8 space-y-4">
            <div className="flex items-center justify-between font-black uppercase text-[10px] tracking-widest text-muted-foreground">
               <span>Input Text</span>
               <span>{input.length} Chars</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text, numbers, and symbols..."
              className="w-full h-[300px] p-6 bg-muted/10 rounded-3xl border border-border outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono text-sm resize-none"
            />
          </div>

          <div className="p-8 space-y-4 bg-muted/5">
            <div className="flex items-center justify-between font-black uppercase text-[10px] tracking-widest text-muted-foreground">
               <span>ROT47 Result</span>
               <span>{result.length} Chars</span>
            </div>
            <div className="w-full h-[300px] p-6 bg-background rounded-3xl border border-border overflow-y-auto font-mono text-sm leading-relaxed break-all">
              {batchMode ? result : renderHighlightedText(result)}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border flex flex-wrap items-center justify-between gap-4 bg-muted/20">
          <button 
            onClick={handleCopy}
            disabled={!result}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-12 py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20 hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50 disabled:translate-y-0"
          >
            {status === "Copied!" ? <CheckCircle2 size={18} /> : <Copy size={18} />}
            {status || "Copy Result"}
          </button>
          
          <button 
            onClick={clear}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all font-bold"
          >
            <Trash2 size={20} />
            Clear
          </button>
        </div>
      </div>

      {/* ASCII Range Map */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                    <ListOrdered size={20} />
                </div>
                <h2 className="text-xl font-bold">ASCII Rotation Map (Partial)</h2>
            </div>
            <div className="px-3 py-1 rounded-full bg-indigo-600/10 text-indigo-600 text-[10px] font-black uppercase">
                94 Character Range (! to ~)
            </div>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-[repeat(15,minmax(0,1fr))] gap-2">
          {sampleMapping.map((m, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-3 flex flex-col items-center gap-1 hover:border-indigo-400 group transition-all">
               <span className="text-[10px] font-bold text-muted-foreground group-hover:text-indigo-600">{m.from}</span>
               <div className="w-full h-px bg-border group-hover:bg-indigo-600/20" />
               <span className="text-sm font-black text-foreground">{m.to}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-[2rem] bg-indigo-600/5 border border-indigo-600/10 space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 font-bold mb-2">
            <Zap size={20} />
            <h4>Extended ASCII Rotation</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Unlike ROT13 which only affects letters, ROT47 rotates <strong>all</strong> printable ASCII characters between decimal index 33 and 126. This includes numbers, symbols, and punctuation.
          </p>
        </div>
        
        <div className="p-8 rounded-[2rem] bg-indigo-600/5 border border-indigo-600/10 space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 font-bold mb-2">
            <Binary size={20} />
            <h4>Technical Precision</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The rotation uses a ring of 94 characters. Shifting by 47 (exactly half) makes the algorithm its own inverse. Whitespace (ASCII 32) is intentionally excluded to preserve text structure.
          </p>
        </div>
      </div>
    </div>
  );
}
