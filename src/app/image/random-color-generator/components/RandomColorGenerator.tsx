"use client";

import React, { useState, useCallback } from "react";
import { RefreshCw, Lock, Unlock, Copy, CheckCircle2, Shuffle } from "lucide-react";

interface ColorSlot {
  id: number;
  hex: string;
  locked: boolean;
  copiedField: string | null;
}

function randomHex(): string {
  const h = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, "0").toUpperCase();
  return `#${h}`;
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function hexToHsl(hex: string) {
  let { r, g, b } = hexToRgb(hex);
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
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
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function getTextColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const luminance = r * 0.299 + g * 0.587 + b * 0.114;
  return luminance > 140 ? "#000000" : "#FFFFFF";
}

const INITIAL_COLORS = [
  "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"
].map((hex, i) => ({ id: i, hex, locked: false, copiedField: null }));

export function RandomColorGenerator() {
  const [colors, setColors] = useState<ColorSlot[]>(INITIAL_COLORS);
  const [copiedSingle, setCopiedSingle] = useState<{ id: number; field: string } | null>(null);

  const generateColors = useCallback(() => {
    setColors(prev => prev.map(c => c.locked ? c : { ...c, hex: randomHex() }));
  }, []);

  const toggleLock = (id: number) => {
    setColors(prev => prev.map(c => c.id === id ? { ...c, locked: !c.locked } : c));
  };

  const copyField = (id: number, field: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedSingle({ id, field });
    setTimeout(() => setCopiedSingle(null), 1500);
  };

  const isCopied = (id: number, field: string) =>
    copiedSingle?.id === id && copiedSingle?.field === field;

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw">
      {/* Generate Button */}
      <div className="flex justify-center mb-8">
        <button onClick={generateColors}
          className="flex items-center gap-3 px-10 py-4 rounded-full bg-foreground text-background font-black uppercase tracking-widest shadow-2xl hover:scale-[1.03] active:scale-95 transition-all text-sm">
          <Shuffle className="w-5 h-5" /> Generate Palette
        </button>
      </div>

      {/* Color swatches */}
      <div className="flex flex-col sm:flex-row gap-4 h-auto sm:h-[360px] rounded-[3rem] overflow-hidden border border-border shadow-xl">
        {colors.map((c) => {
          const rgb = hexToRgb(c.hex);
          const hsl = hexToHsl(c.hex);
          const textColor = getTextColor(c.hex);
          return (
            <div key={c.id}
              className="flex-1 relative flex flex-col justify-between p-5 transition-all duration-500 min-h-[120px] sm:min-h-0 group"
              style={{ backgroundColor: c.hex, color: textColor }}>

              {/* Top controls */}
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">{c.locked ? "Locked" : "Free"}</span>
                <button onClick={() => toggleLock(c.id)}
                  className="p-2 rounded-xl hover:scale-110 transition-all"
                  style={{ backgroundColor: `${textColor}20` }}
                  title={c.locked ? "Unlock color" : "Lock color"}>
                  {c.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Color codes */}
              <div className="space-y-2">
                {[
                  { label: "HEX", value: c.hex },
                  { label: "RGB", value: `${rgb.r}, ${rgb.g}, ${rgb.b}` },
                  { label: "HSL", value: `${hsl.h}°, ${hsl.s}%, ${hsl.l}%` },
                ].map(({ label, value }) => (
                  <button key={label} onClick={() => copyField(c.id, label, value)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: `${textColor}10` }}>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-70">{label}</span>
                    <div className="flex items-center gap-1.5 flex-1 justify-end">
                      <span className="font-mono text-[11px] font-bold opacity-90 truncate">{value}</span>
                      {isCopied(c.id, label)
                        ? <CheckCircle2 className="w-3 h-3 shrink-0 opacity-80" />
                        : <Copy className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-60" />
                      }
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Keyboard hint */}
      <p className="text-center mt-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
        Click any color value to copy it • Click the lock icon to keep a color while regenerating
      </p>
    </section>
  );
}
