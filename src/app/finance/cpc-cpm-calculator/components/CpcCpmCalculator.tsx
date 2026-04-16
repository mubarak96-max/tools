"use client";

import React, { useState, useMemo } from "react";
import { CircleDollarSign, CheckCircle2, Copy, BarChart3, Target } from "lucide-react";

export function CpcCpmCalculator() {
  const [spendStr, setSpendStr] = useState<string>("500");
  const [clicksStr, setClicksStr] = useState<string>("850");
  const [impressionsStr, setImpressionsStr] = useState<string>("24000");
  
  const [copied, setCopied] = useState(false);

  const spend = Math.max(0, parseFloat(spendStr) || 0);
  const clicks = Math.max(0, parseInt(clicksStr) || 0);
  const impressions = Math.max(0, parseInt(impressionsStr) || 0);

  const stats = useMemo(() => {
    let cpc = 0;
    if (clicks > 0) {
      cpc = spend / clicks;
    }

    let cpm = 0;
    if (impressions > 0) {
      cpm = (spend / impressions) * 1000;
    }

    let ctr = 0;
    if (impressions > 0) {
      ctr = (clicks / impressions) * 100;
    }

    // Benchmark comparison (arbitrary standard: $1.00 CPC, $5.00 CPM)
    let cpcStatus = "Average";
    let cpcColor = "text-amber-500";
    if (cpc > 0 && cpc < 0.5) { cpcStatus = "Excellent"; cpcColor = "text-emerald-500"; }
    else if (cpc >= 1.5) { cpcStatus = "Expensive"; cpcColor = "text-red-500"; }

    let cpmStatus = "Average";
    let cpmColor = "text-amber-500";
    if (cpm > 0 && cpm < 2.5) { cpmStatus = "Excellent"; cpmColor = "text-emerald-500"; }
    else if (cpm >= 10.0) { cpmStatus = "Expensive"; cpmColor = "text-red-500"; }

    return {
      cpc,
      cpm,
      ctr,
      cpcStatus,
      cpcColor,
      cpmStatus,
      cpmColor
    };
  }, [spend, clicks, impressions]);

  const copyToClipboard = () => {
    const text = `Total Spend: $${spend}\nImpressions: ${impressions}\nClicks: ${clicks}\nCPC: $${stats.cpc.toFixed(2)}\nCPM: $${stats.cpm.toFixed(2)}\nCTR: ${stats.ctr.toFixed(2)}%`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw relative overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">
        
        {/* Input Settings Panel */}
        <div className="p-6 sm:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-border bg-white">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Ad Performance Data</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">Total Ad Spend ($)</label>
              <div className="relative">
                 <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-black text-muted-foreground opacity-50">$</span>
                 <input 
                   type="number" min="0" step="0.01"
                   value={spendStr} 
                   onChange={(e) => setSpendStr(e.target.value)}
                   className="w-full bg-muted/10 border-2 border-border focus:border-primary/50 focus:bg-background rounded-2xl pl-12 pr-6 py-5 text-xl font-bold outline-none transition-all"
                   placeholder="500.00"
                 />
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">Total Impressions</label>
                <div className="relative">
                   <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                   <input 
                     type="number" min="0"
                     value={impressionsStr} 
                     onChange={(e) => setImpressionsStr(e.target.value)}
                     className="w-full bg-muted/10 border-2 border-border focus:border-primary/50 focus:bg-background rounded-2xl pl-12 pr-4 py-4 text-lg font-bold outline-none transition-all"
                     placeholder="24000"
                   />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">Total Clicks</label>
                <div className="relative">
                   <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                   <input 
                     type="number" min="0"
                     value={clicksStr} 
                     onChange={(e) => setClicksStr(e.target.value)}
                     className="w-full bg-muted/10 border-2 border-border focus:border-primary/50 focus:bg-background rounded-2xl pl-12 pr-4 py-4 text-lg font-bold outline-none transition-all"
                     placeholder="850"
                   />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
               <div className="p-4 rounded-3xl bg-primary/5 border border-primary/20 flex flex-col justify-center text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Click-Through Rate (CTR)</span>
                  <div className="flex items-center justify-center gap-2">
                     <span className="text-3xl font-black italic tracking-tighter text-primary">{stats.ctr.toFixed(2)}%</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="p-6 sm:p-10 bg-muted/10 flex flex-col relative group justify-center gap-8">
           
           {/* CPC Block */}
           <div className="p-8 rounded-[2.5rem] bg-white border border-border shadow-xl relative overflow-hidden transition-all group-hover:border-primary/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex justify-between items-start z-10 relative">
                 <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Cost Per Click (CPC)</span>
                    <div className="text-5xl font-black italic tracking-tighter text-foreground">
                      ${stats.cpc.toFixed(2)}
                    </div>
                 </div>
                 <div className={`px-3 py-1.5 rounded-lg border bg-background text-[9px] font-black uppercase tracking-widest ${stats.cpcColor} ${stats.cpcStatus === 'Expensive' ? 'border-red-500/30' : stats.cpcStatus === 'Excellent' ? 'border-emerald-500/30' : 'border-border'}`}>
                    {stats.cpcStatus}
                 </div>
              </div>
           </div>

           {/* CPM Block */}
           <div className="p-8 rounded-[2.5rem] bg-white border border-border shadow-xl relative overflow-hidden transition-all group-hover:border-primary/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex justify-between items-start z-10 relative">
                 <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Cost Per Mille (CPM)</span>
                    <div className="text-5xl font-black italic tracking-tighter text-foreground">
                      ${stats.cpm.toFixed(2)}
                    </div>
                 </div>
                 <div className={`px-3 py-1.5 rounded-lg border bg-background text-[9px] font-black uppercase tracking-widest ${stats.cpmColor} ${stats.cpmStatus === 'Expensive' ? 'border-red-500/30' : stats.cpmStatus === 'Excellent' ? 'border-emerald-500/30' : 'border-border'}`}>
                    {stats.cpmStatus}
                 </div>
              </div>
              <p className="text-[9px] text-muted-foreground opacity-60 font-black uppercase tracking-widest mt-4">Per 1,000 Impressions</p>
           </div>

           <button 
              onClick={copyToClipboard}
              className="w-full py-4 rounded-full bg-foreground text-background font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-xs"
           >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied Metrics" : "Copy Metrics"}
           </button>
        </div>

      </div>
    </section>
  );
}
