"use client";

import React, { useState, useMemo } from "react";
import punycode from "punycode/";
import { 
  Copy, 
  Trash2, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  Link,
  Table as TableIcon,
  RefreshCw
} from "lucide-react";

type Tab = "unicode-to-punycode" | "punycode-to-unicode";

export default function PunycodeTool() {
  const [tab, setTab] = useState<Tab>("unicode-to-punycode");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const transformDomain = (domain: string, mode: Tab) => {
    if (!domain.trim()) return "";
    try {
      if (mode === "unicode-to-punycode") {
        return punycode.toASCII(domain);
      } else {
        return punycode.toUnicode(domain);
      }
    } catch (e: any) {
      throw new Error(`Failed to transform "${domain}": ${e.message}`);
    }
  };

  const result = useMemo(() => {
    if (!input) {
      setError("");
      return "";
    }
    const lines = input.split(/\n/);
    try {
      setError("");
      return lines.map(line => transformDomain(line, tab)).join("\n");
    } catch (e: any) {
      setError(e.message);
      return "";
    }
  }, [input, tab]);

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

  const domainBreakdown = useMemo(() => {
    if (!input) return [];
    const lines = input.split(/\n/).filter(l => l.trim());
    return lines.slice(0, 10).map(line => {
        try {
            return {
                original: line,
                transformed: transformDomain(line, tab),
                error: false
            };
        } catch (e) {
            return {
                original: line,
                transformed: "Error",
                error: true
            };
        }
    });
  }, [input, tab]);

  return (
    <div className="space-y-8">
      {/* Tab Switcher */}
      <div className="flex bg-muted/30 p-2 rounded-3xl border border-border max-w-fit shadow-sm">
        {[
          { id: "unicode-to-punycode", label: "Unicode to Punycode", icon: Globe },
          { id: "punycode-to-unicode", label: "Punycode to Unicode", icon: Globe }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => { setTab(item.id as Tab); clear(); }}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black transition-all ${tab === item.id ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Primary Workspace */}
      <div className="bg-card border border-border rounded-[3rem] shadow-2xl overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] divide-y lg:divide-y-0 lg:divide-x divide-border font-medium">
          {/* Input Area */}
          <div className="p-10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3 italic">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 {tab === "unicode-to-punycode" ? "International Domains" : "Punycode (xn--)"}
              </h3>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tab === "unicode-to-punycode" ? "bücher.de\n☕.com\nmañana.com" : "xn--bcher-kva.de\nxn--p5h.com\nxn--maana-pta.com"}
              className="w-full h-[400px] p-8 bg-muted/10 rounded-[2rem] border border-border outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-base resize-none"
            />
          </div>

          {/* Output Area */}
          <div className="p-10 space-y-6 bg-muted/5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3 italic">
                 <div className="w-2 h-2 rounded-full bg-success" />
                 Result
              </h3>
            </div>

            <div className="w-full h-[400px] p-8 bg-background rounded-[2rem] border border-border shadow-inner-lg overflow-y-auto">
               {error ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-red-500 gap-4">
                     <AlertCircle size={48} className="opacity-20" />
                     <p className="font-bold text-sm tracking-tight leading-relaxed">{error}</p>
                     <p className="text-[10px] uppercase font-black opacity-50">Validation Error</p>
                  </div>
               ) : (
                  <div className="font-mono text-lg leading-relaxed break-all whitespace-pre-wrap selection:bg-primary/20">
                    {result || <span className="text-muted-foreground/30 italic">Transformed domains will appear here...</span>}
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
                className="flex items-center gap-3 px-10 py-5 rounded-3xl bg-primary text-white font-black shadow-2xl shadow-primary/40 hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50 hover:scale-[1.02]"
              >
                {status === "Copied!" ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                {status || "COPY DOMAINS"}
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

      {/* Comparison Grid */}
      {domainBreakdown.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <TableIcon size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-widest italic text-foreground">Domain Comparison</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {domainBreakdown.map((item, i) => (
                 <div key={i} className={`p-6 rounded-[2rem] border transition-all hover:scale-[1.01] flex items-center justify-between ${item.error ? "bg-red-50 border-red-200" : "bg-card border-border shadow-sm"}`}>
                    <div className="space-y-1 overflow-hidden">
                       <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Original</p>
                       <p className="font-mono text-sm truncate pr-4">{item.original}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                       <RefreshCw className="text-muted-foreground/30" size={16} />
                       <div className="text-right overflow-hidden">
                          <p className="text-[10px] font-black uppercase text-primary tracking-widest">ASCII / Unicode</p>
                          <p className={`font-mono text-sm font-bold ${item.error ? "text-red-500" : "text-foreground"}`}>{item.transformed}</p>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}
