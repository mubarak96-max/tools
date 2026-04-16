"use client";

import React, { useState, useMemo } from "react";
import { MousePointerClick, Copy, CheckCircle2, AlertCircle, Eye, Lightbulb } from "lucide-react";

export function CtrCalculator() {
  const [impressionsStr, setImpressionsStr] = useState<string>("10000");
  const [clicksStr, setClicksStr] = useState<string>("250");
  const [campaignType, setCampaignType] = useState<string>("search");

  const [copied, setCopied] = useState(false);

  const impressions = Math.max(0, parseInt(impressionsStr) || 0);
  const clicks = Math.max(0, parseInt(clicksStr) || 0);

  const stats = useMemo(() => {
    let ctr = 0;
    if (impressions > 0) {
      ctr = (clicks / impressions) * 100;
      // Prevent CTR > 100% technically, though 100% is max valid unless malformed logic
      if (ctr > 100) ctr = 100; 
    }

    let benchmark = 0;
    let label = "";
    
    switch(campaignType) {
      case "search": benchmark = 5.0; label = "Search Ads"; break;
      case "display": benchmark = 0.5; label = "Display Ads"; break;
      case "social": benchmark = 1.2; label = "Social Media"; break;
      case "email": benchmark = 2.5; label = "Email Mktg"; break;
      case "organic": benchmark = 3.0; label = "Organic SEO"; break;
      default: benchmark = 2.0; label = "Average";
    }

    const difference = ctr - benchmark;
    let performance = "Average";
    let performanceColor = "text-amber-500";
    
    if (difference >= benchmark * 0.5) {
      performance = "Excellent";
      performanceColor = "text-emerald-500";
    } else if (difference > 0) {
      performance = "Good";
      performanceColor = "text-emerald-400";
    } else if (difference < -benchmark * 0.5) {
      performance = "Underperforming";
      performanceColor = "text-red-500";
    }

    const suggestions = [];
    if (difference <= 0) {
      if (campaignType === "search" || campaignType === "organic") {
         suggestions.push("Rewrite headlines to include numbers, power words, or exactly match the user's search intent.");
         suggestions.push("Ensure your meta description/ad copy includes a strong Call to Action (CTA).");
      } else if (campaignType === "email") {
         suggestions.push("A/B test a dramatic redesign of the primary button to make it visually pop.");
         suggestions.push("Personalize the subject line and ensure the email copy is succinct.");
      } else {
         suggestions.push("Test new creative imagery with contrasting colors to disrupt 'banner blindness'.");
         suggestions.push("Refine your audience targeting. The ad might be showing to irrelevant users.");
      }
    } else {
      suggestions.push("Your CTR is healthy! Focus on optimizing landing page conversion rate (CVR) next.");
    }

    return {
      ctr,
      benchmark,
      label,
      difference,
      performance,
      performanceColor,
      suggestions
    };
  }, [impressions, clicks, campaignType]);

  const copyToClipboard = () => {
    const text = `Campaign: ${stats.label}\nImpressions: ${impressions}\nClicks: ${clicks}\nCTR: ${stats.ctr.toFixed(2)}%\nBenchmark: ${stats.benchmark}%\nPerformance: ${stats.performance}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw relative overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">
        
        {/* Input Panel */}
        <div className="p-6 sm:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-border bg-white">
          <div className="flex items-center gap-2">
            <MousePointerClick className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Campaign Metrics</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">Total Impressions / Views</label>
              <div className="relative">
                 <Eye className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-50" />
                 <input 
                   type="number" min="0"
                   value={impressionsStr} 
                   onChange={(e) => setImpressionsStr(e.target.value)}
                   className="w-full bg-muted/10 border-2 border-border focus:border-primary/50 focus:bg-background rounded-2xl pl-16 pr-6 py-5 text-xl font-bold outline-none transition-all"
                   placeholder="10000"
                 />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">Total Clicks</label>
              <div className="relative">
                 <MousePointerClick className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-50" />
                 <input 
                   type="number" min="0"
                   value={clicksStr} 
                   onChange={(e) => setClicksStr(e.target.value)}
                   className="w-full bg-muted/10 border-2 border-border focus:border-primary/50 focus:bg-background rounded-2xl pl-16 pr-6 py-5 text-xl font-bold outline-none transition-all"
                   placeholder="250"
                 />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-border">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">Campaign Channel</label>
               <select
                 value={campaignType}
                 onChange={(e) => setCampaignType(e.target.value)}
                 className="w-full bg-transparent border-2 border-border focus:border-primary/50 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all cursor-pointer appearance-none"
               >
                 <option value="search">Search Ads (Google, Bing)</option>
                 <option value="organic">Organic SEO Search</option>
                 <option value="social">Social Media Ads (Facebook, IG, LinkedIn)</option>
                 <option value="display">Display Network Banners</option>
                 <option value="email">Email Newsletters / Campaigns</option>
               </select>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="p-6 sm:p-10 bg-muted/10 flex flex-col space-y-10 relative group justify-between">
           <div className="space-y-8 w-full">
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Click-Through Rate (CTR)</span>
                     <div className="flex items-baseline gap-2">
                        <span className="text-6xl sm:text-7xl font-black italic tracking-tighter text-foreground">{stats.ctr.toFixed(2)}%</span>
                     </div>
                  </div>
                  <div className={`px-4 py-2 bg-white rounded-xl shadow-sm border border-border text-xs font-black uppercase tracking-widest ${stats.performanceColor}`}>
                     {stats.performance}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-3xl bg-white border border-border shadow-sm">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Industry Benchmark</p>
                     <p className="text-xl font-black">~{stats.benchmark.toFixed(1)}%</p>
                     <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mt-1 opacity-60">{stats.label}</p>
                  </div>
                  <div className="p-4 rounded-3xl bg-white border border-border shadow-sm">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Delta to Avg</p>
                     <p className={`text-xl font-black ${stats.difference > 0 ? "text-emerald-500" : stats.difference < 0 ? "text-red-500" : ""}`}>
                        {stats.difference > 0 ? "+" : ""}{stats.difference.toFixed(2)}%
                     </p>
                     <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mt-1 opacity-60">Performance Gap</p>
                  </div>
               </div>

               <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                     <Lightbulb className="w-5 h-5" />
                     <h4 className="text-xs font-black uppercase tracking-widest">Diagnostic Suggestions</h4>
                  </div>
                  <ul className="space-y-3">
                     {stats.suggestions.map((sug, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed">
                           <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5 opacity-60" />
                           {sug}
                        </li>
                     ))}
                  </ul>
               </div>
           </div>

           <button 
              onClick={copyToClipboard}
              className="w-full py-4 rounded-full bg-foreground text-background font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-xs mt-8"
           >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied Report" : "Copy CTR Report"}
           </button>
        </div>

      </div>
    </section>
  );
}
