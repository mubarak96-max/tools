"use client";

import { StyleOptions } from "@/lib/types";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface StyleControlsProps {
  style: StyleOptions;
  onChange: (style: StyleOptions) => void;
}

const fontOptions = [
  { value: "Cormorant Garamond", label: "Cormorant (Elegant)" },
  { value: "Playfair Display", label: "Playfair (Editorial)" },
  { value: "Libre Baskerville", label: "Baskerville (Classic)" },
  { value: "Bebas Neue", label: "Bebas (Bold)" },
  { value: "Georgia", label: "Georgia (Timeless)" },
  { value: "DM Sans", label: "DM Sans (Modern)" },
];

const overlayColors = [
  { value: "#000000", label: "Black" },
  { value: "#0f0e0c", label: "Ink" },
  { value: "#1a1200", label: "Dark Gold" },
  { value: "#0a0a1a", label: "Midnight" },
  { value: "#0a1a0a", label: "Forest" },
  { value: "#1a0a0a", label: "Crimson" },
];

const textColors = [
  { value: "#ffffff", label: "White" },
  { value: "#f5f0e8", label: "Parchment" },
  { value: "#c9a84c", label: "Gold" },
  { value: "#e8c97a", label: "Light Gold" },
  { value: "#ffd700", label: "Yellow" },
  { value: "#e2e8f0", label: "Silver" },
];

const quoteStyles = [
  { value: "minimal", label: "Minimal" },
  { value: "boxed", label: "Boxed" },
  { value: "underline", label: "Underline" },
  { value: "serif-large", label: "Serif Large" },
] as const;

const positionOptions = [
  { value: "top", label: "Top" },
  { value: "center", label: "Center" },
  { value: "bottom", label: "Bottom" },
] as const;

export default function StyleControls({ style, onChange }: StyleControlsProps) {
  const update = <K extends keyof StyleOptions>(key: K, value: StyleOptions[K]) => {
    onChange({ ...style, [key]: value });
  };

  return (
    <div className="space-y-5">
      {/* Quote Style */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-[var(--ash)] mb-2.5">
          Layout Style
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {quoteStyles.map((s) => (
            <button
              key={s.value}
              onClick={() => update("quoteStyle", s.value)}
              className={`py-2 px-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                style.quoteStyle === s.value
                  ? "bg-[var(--gold)] text-[var(--ink)]"
                  : "bg-white/5 text-[var(--ash)] hover:bg-white/10 hover:text-[var(--parchment)] border border-white/8"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-[var(--ash)] mb-2.5">
          Font
        </label>
        <select
          value={style.fontFamily}
          onChange={(e) => update("fontFamily", e.target.value)}
          className="input-dark w-full px-3 py-2.5 rounded-lg text-sm cursor-pointer"
        >
          {fontOptions.map((f) => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <div className="flex justify-between items-center mb-2.5">
          <label className="text-xs uppercase tracking-widest text-[var(--ash)]">
            Font Size
          </label>
          <span className="text-xs text-[var(--gold)] font-mono">{style.fontSize}px</span>
        </div>
        <input
          type="range"
          min={14}
          max={72}
          value={style.fontSize}
          onChange={(e) => update("fontSize", Number(e.target.value))}
          className="w-full accent-[var(--gold)] cursor-pointer"
        />
      </div>

      {/* Text Align */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-[var(--ash)] mb-2.5">
          Text Alignment
        </label>
        <div className="flex gap-1.5">
          {(["left", "center", "right"] as const).map((align) => {
            const Icon = align === "left" ? AlignLeft : align === "center" ? AlignCenter : AlignRight;
            return (
              <button
                key={align}
                onClick={() => update("textAlign", align)}
                className={`flex-1 py-2.5 rounded-lg flex items-center justify-center transition-all duration-150 ${
                  style.textAlign === align
                    ? "bg-[var(--gold)] text-[var(--ink)]"
                    : "bg-white/5 text-[var(--ash)] hover:bg-white/10 border border-white/8"
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Text Position */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-[var(--ash)] mb-2.5">
          Text Position
        </label>
        <div className="flex gap-1.5">
          {positionOptions.map((p) => (
            <button
              key={p.value}
              onClick={() => update("textPosition", p.value)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                style.textPosition === p.value
                  ? "bg-[var(--gold)] text-[var(--ink)]"
                  : "bg-white/5 text-[var(--ash)] hover:bg-white/10 border border-white/8"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overlay Color */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-[var(--ash)] mb-2.5">
          Overlay Color
        </label>
        <div className="flex gap-2">
          {overlayColors.map((c) => (
            <button
              key={c.value}
              onClick={() => update("overlayColor", c.value)}
              title={c.label}
              className={`w-7 h-7 rounded-full border-2 transition-all duration-150 ${
                style.overlayColor === c.value
                  ? "border-[var(--gold)] scale-110"
                  : "border-white/20 hover:border-white/40"
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </div>

      {/* Overlay Opacity */}
      <div>
        <div className="flex justify-between items-center mb-2.5">
          <label className="text-xs uppercase tracking-widest text-[var(--ash)]">
            Overlay Opacity
          </label>
          <span className="text-xs text-[var(--gold)] font-mono">{Math.round(style.overlayOpacity * 100)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={style.overlayOpacity}
          onChange={(e) => update("overlayOpacity", Number(e.target.value))}
          className="w-full accent-[var(--gold)] cursor-pointer"
        />
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-[var(--ash)] mb-2.5">
          Text Color
        </label>
        <div className="flex gap-2 flex-wrap">
          {textColors.map((c) => (
            <button
              key={c.value}
              onClick={() => update("textColor", c.value)}
              title={c.label}
              className={`w-7 h-7 rounded-full border-2 transition-all duration-150 ${
                style.textColor === c.value
                  ? "border-[var(--gold)] scale-110"
                  : "border-white/20 hover:border-white/40"
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
          <label
            className="w-7 h-7 rounded-full border-2 border-white/20 hover:border-white/40 cursor-pointer overflow-hidden"
            title="Custom color"
          >
            <input
              type="color"
              value={style.textColor}
              onChange={(e) => update("textColor", e.target.value)}
              className="w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className="w-full h-full -mt-7 rounded-full"
              style={{ backgroundColor: style.textColor }}
            />
          </label>
        </div>
      </div>

      {/* Show Author Toggle */}
      <div className="flex items-center justify-between py-1">
        <label className="text-xs uppercase tracking-widest text-[var(--ash)]">
          Show Author
        </label>
        <button
          onClick={() => update("showAuthor", !style.showAuthor)}
          className={`relative w-10 h-5 rounded-full transition-all duration-200 ${
            style.showAuthor ? "bg-[var(--gold)]" : "bg-white/10"
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
              style.showAuthor ? "left-5" : "left-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
