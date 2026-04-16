"use client";

import React, { useState, useMemo } from "react";
import { 
  Copy, 
  Trash2, 
  Zap, 
  History, 
  RefreshCcw,
  CheckCircle2,
  Table as TableIcon
} from "lucide-react";

export default function Rot13Tool() {
  const [input, setInput] = useState("");
  const [batchMode, setBatchMode] = useState(false);
  const [status, setStatus] = useState("");

  const rot13 = (str: string) => {
    return str.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= "Z" ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
    });
  };

  const result = useMemo(() => {
    if (!input) return "";
    if (batchMode) {
      return input.split("\n").map(line => rot13(line)).join("\n");
    }
    return rot13(input);
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
    if (!text) return <span className="text-muted-foreground/30 italic">Start typing to see the magic...</span>;
    
    return text.split("").map((char, i) => {
      const isLetter = /[a-zA-Z]/.test(char);
      if (isLetter) {
        return <span key={i} className="text-primary font-bold">{char}</span>;
      }
      return <span key={i} className="text-muted-foreground opacity-50">{char}</span>;
    });
  };

  // Alphabet Mapping
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const mapping = alphabet.map(char => ({ from: char, to: rot13(char) }));

  return (
    <div className="space-y-8">
      {/* Main Tool Card */}
      <div className="bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-white/5">
        <div className="p-4 bg-muted/50 border-b border-border flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <RefreshCcw size={18} />
              </div>
              <span className="text-sm font-bold">ROT13 Cipher Runner</span>
           </div>
           <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-10 h-5 rounded-full border border-border relative transition-colors ${batchMode ? "bg-primary border-primary" : "bg-muted"}`}>
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
          {/* Input Panel */}
          <div className="p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Original</h3>
              <div className="text-[10px] font-mono text-muted-foreground">{input.length} Chars</div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={batchMode ? "Enter Multiple lines to rotate..." : "Enter text to encode or decode (ROT13 is symmetric)..."}
              className="w-full h-[300px] p-6 bg-muted/10 rounded-3xl border border-border outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm resize-none"
            />
          </div>

          {/* Output Panel */}
          <div className="p-8 space-y-4 bg-muted/5">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Translated</h3>
              <div className="text-[10px] font-mono text-muted-foreground">{result.length} Chars</div>
            </div>
            <div className="w-full h-[300px] p-6 bg-background rounded-3xl border border-border overflow-y-auto font-mono text-sm leading-relaxed break-all">
              {batchMode ? result : renderHighlightedText(result)}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 border-t border-border flex flex-wrap items-center justify-between gap-4 bg-muted/20">
          <button 
            onClick={handleCopy}
            disabled={!result}
            className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50 disabled:translate-y-0"
          >
            {status === "Copied!" ? <CheckCircle2 size={18} /> : <Copy size={18} />}
            {status || "Copy Result"}
          </button>
          
          <button 
            onClick={clear}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all font-bold"
          >
            <Trash2 size={20} />
            Reset
          </button>
        </div>
      </div>

      {/* Visual Reference Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <TableIcon size={20} />
          </div>
          <h2 className="text-xl font-bold">Alphabet Substitution Mapping</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[repeat(13,minmax(0,1fr))] gap-2">
          {mapping.map((m, i) => (
            <div key={i} className="group relative bg-card border border-border rounded-xl p-3 flex flex-col items-center gap-1 hover:border-primary/40 transition-all hover:shadow-lg">
               <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors">{m.from}</span>
               <div className="w-full h-px bg-border group-hover:bg-primary/20" />
               <span className="text-sm font-black text-foreground group-hover:scale-110 transition-transform">{m.to}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 font-bold mb-2">
            <Zap size={20} />
            <h4>Symmetric Cipher</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            ROT13 is its own inverse. Because there are 26 letters in the alphabet, applying ROT13 twice returns the original text. You don't need separate "encode" and "decode" modes.
          </p>
        </div>
        
        <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
            <History size={20} />
            <h4>Historical Context</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Originally used in Usenet in the 1980s, ROT13 provided a way to hide spoilers, punchlines, and offensive content from casual viewing, while remaining accessible to anyone.
          </p>
        </div>
      </div>
    </div>
  );
}
