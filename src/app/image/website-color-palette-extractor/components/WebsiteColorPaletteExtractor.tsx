"use client";

import React, { useState } from "react";
import { Search, Loader2, Copy, Download, Link as LinkIcon, CheckCircle2 } from "lucide-react";

interface ExtractedColor {
  color: string;
  count: number;
  percentage: string;
}

function hexToRgb(hex: string) {
  // Try to parse both Hex and RGB strings to return consistent RGB values
  if (hex.startsWith("rgb")) return hex;
  
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.slice(0, 2), 16) || 0;
  const g = parseInt(cleanHex.slice(2, 4), 16) || 0;
  const b = parseInt(cleanHex.slice(4, 6), 16) || 0;
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToHsl(hex: string) {
  if (hex.startsWith("rgb")) return "HSL N/A"; // simplification for this tool

  const cleanHex = hex.replace("#", "");
  let r = parseInt(cleanHex.slice(0, 2), 16) || 0;
  let g = parseInt(cleanHex.slice(2, 4), 16) || 0;
  let b = parseInt(cleanHex.slice(4, 6), 16) || 0;
  r /= 255; g /= 255; b /= 255;
  
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function getTextColor(bgColor: string): string {
  if (bgColor.startsWith("rgb")) return "#000000";
  const cleanHex = bgColor.replace("#", "");
  const r = parseInt(cleanHex.slice(0, 2), 16) || 0;
  const g = parseInt(cleanHex.slice(2, 4), 16) || 0;
  const b = parseInt(cleanHex.slice(4, 6), 16) || 0;
  const luminance = r * 0.299 + g * 0.587 + b * 0.114;
  return luminance > 140 ? "#000000" : "#FFFFFF";
}

export function WebsiteColorPaletteExtractor() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fetchColors = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError(null);
    setColors([]);

    try {
      const formattedUrl = url.trim();
      const res = await fetch(`/api/extract-colors?url=${encodeURIComponent(formattedUrl)}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to fetch colors");
      
      if (data.colors && data.colors.length > 0) {
        setColors(data.colors);
      } else {
        setError(data.message || "No colors were found in the site's HTML.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyColor = (color: string, index: number) => {
    navigator.clipboard.writeText(color.toUpperCase());
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const exportAsCss = () => {
    const css = `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.color.toUpperCase()}; /* ${c.percentage}% usage */`).join("\n")}\n}`;
    const blob = new Blob([css], { type: "text/css" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "palette.css";
    link.click();
  };

  const exportAsJson = () => {
    const json = JSON.stringify(colors, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "palette.json";
    link.click();
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw">
      
      {/* Search Bar */}
      <form onSubmit={fetchColors} className="mb-12 max-w-2xl mx-auto">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-4 mb-2 block">Website URL Component</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <LinkIcon className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input 
            type="url" 
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-muted/10 border-2 border-border focus:border-primary/50 focus:bg-background rounded-full pl-16 pr-32 py-5 text-lg font-medium outline-none transition-all shadow-inner"
          />
          <div className="absolute inset-y-2 right-2">
            <button 
              type="submit" 
              disabled={isLoading || !url}
              className="h-full px-6 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Extract"}
            </button>
          </div>
        </div>
        {error && <p className="mt-4 text-center text-sm font-bold text-red-500">{error}</p>}
      </form>

      {/* Results */}
      {colors.length > 0 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <h3 className="text-2xl font-black italic tracking-tighter text-foreground">Extracted Palette</h3>
              <p className="text-sm text-muted-foreground">Top {colors.length} colors found on the requested webpage.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={exportAsCss} className="px-4 py-2 bg-muted/50 hover:bg-muted text-foreground text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-border">
                Export CSS
              </button>
              <button onClick={exportAsJson} className="px-4 py-2 bg-muted/50 hover:bg-muted text-foreground text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-border">
                Export JSON
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {colors.map((c, i) => {
              const textColor = getTextColor(c.color);
              const rgb = hexToRgb(c.color);
              const hsl = hexToHsl(c.color);
              
              return (
                <div key={i} className="rounded-3xl border border-border overflow-hidden bg-background shadow-lg hover:-translate-y-1 transition-transform group">
                  {/* Swatch */}
                  <div 
                    className="h-32 w-full flex items-center justify-center relative cursor-pointer"
                    style={{ backgroundColor: c.color }}
                    onClick={() => copyColor(c.color, i)}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      {copiedIndex === i ? (
                        <CheckCircle2 className="w-8 h-8 opacity-90 shadow-2xl" style={{ color: textColor }} />
                      ) : (
                        <Copy className="w-8 h-8 opacity-0 group-hover:opacity-60 transition-opacity drop-shadow-lg" style={{ color: textColor }} />
                      )}
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-end border-b border-border/50 pb-3">
                      <span className="font-mono font-bold text-foreground uppercase truncate" title={c.color}>{c.color}</span>
                      <div className="text-right">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground">Usage</span>
                        <span className="text-sm font-black text-primary">{c.percentage}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[9px] font-black uppercase text-muted-foreground">RGB</span>
                        <span className="text-[10px] font-mono font-medium text-foreground opacity-80 truncate ml-2" title={rgb}>{rgb}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[9px] font-black uppercase text-muted-foreground">HSL</span>
                        <span className="text-[10px] font-mono font-medium text-foreground opacity-80 truncate ml-2" title={hsl}>{hsl}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>
      )}

    </section>
  );
}
