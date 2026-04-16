"use client";

import React, { useState, useMemo } from "react";
import punycode from "punycode/";
import { 
  Copy, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert,
  CheckCircle2, 
  AlertCircle,
  Globe,
  Share2,
  RefreshCw,
  Search
} from "lucide-react";

type Tab = "idn-to-ascii" | "ascii-to-idn";

export default function IdnTool() {
  const [tab, setTab] = useState<Tab>("idn-to-ascii");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const isHomographCandidate = (str: string) => {
    // Basic check for mixed scripts or zero-width chars (simplified for example)
    const hasCyrillic = /[\u0400-\u04FF]/.test(str);
    const hasLatin = /[a-zA-Z]/.test(str);
    return hasCyrillic && hasLatin;
  };

  const transformUrl = (url: string, mode: Tab) => {
    if (!url.trim()) return "";
    try {
      if (mode === "idn-to-ascii") {
        return punycode.toASCII(url);
      } else {
        return punycode.toUnicode(url);
      }
    } catch (e: any) {
      throw new Error(`Invalid IDN sequence in "${url}": ${e.message}`);
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
      return lines.map(line => transformUrl(line, tab)).join("\n");
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

  const domainAnalysis = useMemo(() => {
    if (!input) return [];
    const lines = input.split(/\n/).filter(l => l.trim());
    return lines.slice(0, 10).map(line => {
        try {
            const transformed = transformUrl(line, tab);
            const homograph = isHomographCandidate(line) || isHomographCandidate(transformed);
            return {
                original: line,
                transformed,
                homograph,
                error: false
            };
        } catch (e) {
            return {
                original: line,
                transformed: "Error",
                homograph: false,
                error: true
            };
        }
    });
  }, [input, tab]);

  return (
    <div className="space-y-8">
      {/* Mode Switcher */}
      <div className="flex bg-muted/30 p-2 rounded-3xl border border-border max-w-fit shadow-inner">
        {[
          { id: "idn-to-ascii", label: "International → ASCII", icon: ShieldCheck },
          { id: "ascii-to-idn", label: "ASCII → International", icon: Globe }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => { setTab(item.id as Tab); clear(); }}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black transition-all ${tab === item.id ? "bg-primary text-white shadow-xl" : "text-muted-foreground hover:text-foreground"}`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Primary Workspace */}
      <div className="bg-card border border-border rounded-[3rem] shadow-2xl overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Input Area */}
          <div className="p-10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3 italic">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 {tab === "idn-to-ascii" ? "Source URL / Domain" : "ASCII (xn--) Source"}
              </h3>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tab === "idn-to-ascii" ? "https://bücher.de\nsub.mañana.com" : "https://xn--bcher-kva.de\nsub.xn--maana-pta.com"}
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
                  </div>
               ) : (
                  <div className="font-mono text-lg leading-relaxed break-all whitespace-pre-wrap">
                    {result || <span className="text-muted-foreground/30 italic">IDN result will appear here...</span>}
                  </div>
               )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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
                className="flex items-center gap-2 px-8 py-5 rounded-3xl bg-background border border-border text-muted-foreground hover:text-red-500 transition-all shadow-xl font-black"
              >
                <Trash2 size={20} />
              </button>
           </div>
        </div>
      </div>

      {/* Security Analysis Analysis Analysis */}
      {domainAnalysis.length > 0 && (
         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
                 <Search size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-widest italic text-foreground">Security Audit & Breakdown</h2>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              {domainAnalysis.map((item, i) => (
                 <div key={i} className={`p-6 rounded-[2.5rem] border transition-all flex flex-col md:flex-row items-center justify-between gap-6 ${item.homograph ? "bg-amber-50 border-amber-200" : "bg-card border-border shadow-md"}`}>
                    <div className="flex gap-6 items-center flex-1 overflow-hidden w-full">
                       <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${item.homograph ? "bg-amber-100 text-amber-600" : "bg-primary/10 text-primary"}`}>
                          {item.homograph ? <ShieldAlert size={24} /> : <Globe size={24} />}
                       </div>
                       <div className="space-y-1 overflow-hidden">
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Input String</p>
                          <p className="font-mono text-sm truncate">{item.original}</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-6 px-6 py-2 rounded-2xl bg-muted/30 border border-border shrink-0 max-w-full overflow-hidden">
                       <RefreshCw className="text-muted-foreground/30 shrink-0" size={16} />
                       <div className="text-right overflow-hidden">
                          <p className="text-[10px] font-black uppercase text-primary tracking-widest">Converted Payload</p>
                          <p className={`font-mono text-sm font-bold truncate ${item.error ? "text-red-500" : "text-foreground"}`}>{item.transformed}</p>
                       </div>
                    </div>

                    <div className="shrink-0">
                       {item.homograph ? (
                          <div className="px-4 py-2 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-tighter flex items-center gap-2 animate-pulse shadow-lg ring-4 ring-amber-500/20">
                             <ShieldAlert size={14} />
                             Potential Homograph Attack
                          </div>
                       ) : (
                          <div className="px-4 py-2 rounded-full bg-success text-white text-[10px] font-black uppercase tracking-tighter flex items-center gap-2 shadow-lg ring-4 ring-success/20">
                             <ShieldCheck size={14} />
                             Safe IDN Syntax
                          </div>
                       )}
                    </div>
                 </div>
              ))}
           </div>
           
           {domainAnalysis.some(d => d.homograph) && (
              <div className="mt-6 p-6 rounded-[2rem] bg-amber-950 text-amber-100 border border-white/10 flex gap-6 items-center">
                 <ShieldAlert size={48} className="shrink-0 text-amber-400 opacity-50" />
                 <div className="space-y-1">
                    <p className="font-black italic uppercase text-[10px] tracking-widest text-amber-400">Homograph Warning</p>
                    <p className="text-sm leading-relaxed">Mixed-script domains detected. This can be used for "spoofing" attacks where look-alike characters from DIFFERENT alphabets (like Cyrillic 'а' and Latin 'a') are used to trick users. Always verify the xn-- Punycode for sensitive registrations.</p>
                 </div>
              </div>
           )}
        </div>
      )}
    </div>
  );
}
