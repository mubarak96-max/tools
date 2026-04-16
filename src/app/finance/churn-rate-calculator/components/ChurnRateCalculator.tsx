"use client";

import React, { useState, useMemo } from "react";
import { Users, TrendingDown, ArrowRightLeft, Target, Copy, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";

export function ChurnRateCalculator() {
  const [startCustomersStr, setStartCustomersStr] = useState<string>("1000");
  const [endCustomersStr, setEndCustomersStr] = useState<string>("920");
  const [newCustomersStr, setNewCustomersStr] = useState<string>("50");

  const [copied, setCopied] = useState(false);

  const startCustomers = Math.max(0, parseInt(startCustomersStr) || 0);
  const endCustomers = Math.max(0, parseInt(endCustomersStr) || 0);
  const newCustomers = Math.max(0, parseInt(newCustomersStr) || 0);

  const stats = useMemo(() => {
    // Formula: (Customers Start - Customers End + New Customers) = Lost Customers
    // In theory: if start = 1000, new = 50, then theoretical max end = 1050.
    // If actual end is 920, then we lost 1050 - 920 = 130 customers.
    const theoreticalEnd = startCustomers + newCustomers;
    const lostCustomers = Math.max(0, theoreticalEnd - endCustomers);

    // Churn Rate = (Lost Customers / Start Customers) * 100
    // (Note: Some formulas use an average for the denominator, but standard SaaS uses start period relative)
    let churnRate = 0;
    if (startCustomers > 0) {
      churnRate = (lostCustomers / startCustomers) * 100;
    } else if (lostCustomers > 0) {
      churnRate = 100; // Edge case
    }

    const retentionRate = Math.max(0, 100 - churnRate);

    let status = "Critical";
    let statusDesc = "Immediate action required. Product-market fit is failing or a severe breakage occurred.";
    let statusColor = "text-red-500";
    let barColor = "bg-red-500";

    if (churnRate <= 3) {
      status = "Excellent";
      statusDesc = "Highly sustainable growth. Your product is sticky and users find immense value.";
      statusColor = "text-emerald-500";
      barColor = "bg-emerald-500";
    } else if (churnRate <= 7) {
      status = "Good";
      statusDesc = "Healthy churn for most SaaS businesses. Normal baseline attrition.";
      statusColor = "text-emerald-400";
      barColor = "bg-emerald-400";
    } else if (churnRate <= 12) {
      status = "Concerning";
      statusDesc = "Higher than average. Requires investigation into onboarding, support, or pricing features.";
      statusColor = "text-amber-500";
      barColor = "bg-amber-500";
    }

    return {
      lostCustomers,
      churnRate,
      retentionRate,
      status,
      statusDesc,
      statusColor,
      barColor
    };
  }, [startCustomers, endCustomers, newCustomers]);

  const copyToClipboard = () => {
    const text = `Churn Rate: ${stats.churnRate.toFixed(2)}%\nRetention Rate: ${stats.retentionRate.toFixed(2)}%\nCustomers Lost: ${stats.lostCustomers}\nStatus: ${stats.status}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw relative overflow-hidden">
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">
        
        {/* Input Settings Panel */}
        <div className="p-6 sm:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-border bg-white">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Customer Data</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">Customers at Start of Period</label>
              <input 
                type="number" min="0"
                value={startCustomersStr} 
                onChange={(e) => setStartCustomersStr(e.target.value)}
                className="w-full bg-muted/10 border-2 border-border focus:border-primary/50 focus:bg-background rounded-2xl px-6 py-5 text-xl font-bold outline-none transition-all"
                placeholder="1000"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">Customers at End of Period</label>
              <input 
                type="number" min="0"
                value={endCustomersStr} 
                onChange={(e) => setEndCustomersStr(e.target.value)}
                className="w-full bg-muted/10 border-2 border-border focus:border-primary/50 focus:bg-background rounded-2xl px-6 py-5 text-xl font-bold outline-none transition-all"
                placeholder="920"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">New Customers Acquired (During Period)</label>
              <input 
                type="number" min="0"
                value={newCustomersStr} 
                onChange={(e) => setNewCustomersStr(e.target.value)}
                className="w-full bg-emerald-500/5 border-2 border-emerald-500/20 focus:border-emerald-500/50 rounded-2xl px-6 py-5 text-xl font-bold outline-none transition-all text-emerald-700"
                placeholder="50"
              />
              <p className="text-[9px] text-muted-foreground px-2 uppercase font-black tracking-widest opacity-60">New customers offset churn when analyzing total growth.</p>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="p-6 sm:p-10 bg-muted/10 flex flex-col space-y-10 relative group justify-center">
          <div className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground">
            <Target className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Growth Analytics</span>
          </div>

          <div className="space-y-8 w-full max-w-sm mx-auto pt-8">
             
             {/* Primary Metric */}
             <div className="text-center space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Calculated Churn Rate</span>
                <div className="text-6xl sm:text-7xl font-black italic tracking-tighter text-foreground">
                  {stats.churnRate.toFixed(1)}%
                </div>
                <div className={`text-sm font-bold uppercase tracking-widest ${stats.statusColor}`}>
                  {stats.status}
                </div>
             </div>

             {/* Gauge / Bar */}
             <div className="space-y-2 w-full">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                   <span>Healthy</span>
                   <span>Critical</span>
                </div>
                <div className="h-3 w-full bg-muted/50 rounded-full overflow-hidden flex relative border border-border">
                   <div 
                     className={`h-full transition-all duration-1000 ${stats.barColor}`} 
                     style={{ width: `${Math.min(100, stats.churnRate * 4)}%` }} 
                   />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed text-center mt-4">
                  {stats.statusDesc}
                </p>
             </div>

             {/* Secondary Stats */}
             <div className="grid grid-cols-2 gap-4">
               <div className="p-4 rounded-3xl bg-white border border-border shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Customers Lost</span>
                  <div className="flex items-center gap-2">
                     <TrendingDown className="w-4 h-4 text-red-500" />
                     <span className="text-2xl font-black">{stats.lostCustomers}</span>
                  </div>
               </div>
               <div className="p-4 rounded-3xl bg-white border border-border shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Retention Rate</span>
                  <div className="flex items-center gap-2">
                     <TrendingUp className="w-4 h-4 text-emerald-500" />
                     <span className="text-2xl font-black">{stats.retentionRate.toFixed(1)}%</span>
                  </div>
               </div>
             </div>

             <button 
                onClick={copyToClipboard}
                className="w-full py-4 rounded-full bg-foreground text-background font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-xs"
             >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied Report" : "Copy Report"}
             </button>

          </div>
        </div>

      </div>
    </section>
  );
}
