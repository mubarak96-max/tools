"use client";

import React, { useState, useEffect } from "react";
import { 
  CloudSnow, Sun, Flame,
  RefreshCcw, Info, ArrowRightLeft, InfoIcon, AlertCircle 
} from "lucide-react";

type TempScale = "celsius" | "fahrenheit" | "kelvin";

export function TemperatureConverter() {
  const [celsius, setCelsius] = useState<string>("20");
  const [fahrenheit, setFahrenheit] = useState<string>("68");
  const [kelvin, setKelvin] = useState<string>("293.15");

  const convertFromCelsius = (c: number) => {
    setFahrenheit(((c * 9) / 5 + 32).toFixed(2).replace(/\.00$/, ""));
    setKelvin((c + 273.15).toFixed(2).replace(/\.00$/, ""));
  };

  const convertFromFahrenheit = (f: number) => {
    const c = ((f - 32) * 5) / 9;
    setCelsius(c.toFixed(2).replace(/\.00$/, ""));
    setKelvin((c + 273.15).toFixed(2).replace(/\.00$/, ""));
  };

  const convertFromKelvin = (k: number) => {
    const c = k - 273.15;
    setCelsius(c.toFixed(2).replace(/\.00$/, ""));
    setFahrenheit(((c * 9) / 5 + 32).toFixed(2).replace(/\.00$/, ""));
  };

  const handleInput = (val: string, scale: TempScale) => {
    if (val === "" || val === "-") {
      setCelsius(scale === "celsius" ? val : celsius);
      setFahrenheit(scale === "fahrenheit" ? val : fahrenheit);
      setKelvin(scale === "kelvin" ? val : kelvin);
      return;
    }

    const num = parseFloat(val);
    if (isNaN(num)) return;

    if (scale === "celsius") {
      setCelsius(val);
      convertFromCelsius(num);
    } else if (scale === "fahrenheit") {
      setFahrenheit(val);
      convertFromFahrenheit(num);
    } else if (scale === "kelvin") {
      setKelvin(val);
      convertFromKelvin(num);
    }
  };

  const getTemperatureColor = (c: number) => {
    if (c <= 0) return "text-blue-500 bg-blue-500/5 border-blue-500/20";
    if (c <= 30) return "text-emerald-500 bg-emerald-500/5 border-emerald-500/20";
    if (c <= 60) return "text-orange-500 bg-orange-500/5 border-orange-500/20";
    return "text-rose-500 bg-rose-500/5 border-rose-500/20";
  };

  const getTemperatureIcon = (c: number) => {
    if (c <= 0) return <CloudSnow className="w-5 h-5 text-blue-500" />;
    if (c <= 30) return <Sun className="w-5 h-5 text-emerald-500" />;
    if (c <= 60) return <Sun className="w-5 h-5 text-orange-500" />;
    return <Flame className="w-5 h-5 text-rose-500" />;
  };

  const cVal = parseFloat(celsius) || 0;
  const isBelowAbsoluteZero = parseFloat(kelvin) < 0;

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Input Grid */}
        <div className="grid md:grid-cols-3 gap-6 relative">
          <TempInput 
            label="Celsius" 
            symbol="°C" 
            value={celsius} 
            onChange={(v) => handleInput(v, "celsius")} 
            theme={getTemperatureColor(cVal)}
            icon={getTemperatureIcon(cVal)}
          />
          <div className="hidden md:flex items-center justify-center pt-8">
            <ArrowRightLeft className="w-6 h-6 text-muted-foreground opacity-20" />
          </div>
          <TempInput 
            label="Fahrenheit" 
            symbol="°F" 
            value={fahrenheit} 
            onChange={(v) => handleInput(v, "fahrenheit")} 
            theme={getTemperatureColor(cVal)}
            icon={getTemperatureIcon(cVal)}
          />
          <div className="hidden md:flex items-center justify-center pt-8">
             <ArrowRightLeft className="w-6 h-6 text-muted-foreground opacity-20" />
          </div>
          <TempInput 
            label="Kelvin" 
            symbol="K" 
            value={kelvin} 
            onChange={(v) => handleInput(v, "kelvin")} 
            theme={getTemperatureColor(cVal)}
            icon={getTemperatureIcon(cVal)}
          />
        </div>

        {/* Absolute Zero Alert */}
        {isBelowAbsoluteZero && (
          <div className="p-6 rounded-3xl bg-destructive/10 border border-destructive/20 flex items-center gap-4 text-destructive animate-pulse">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p className="text-sm font-black uppercase tracking-widest">
              Error: Temperature is below Absolute Zero (0 K). This is physically impossible.
            </p>
          </div>
        )}

        {/* Formula & Reference Grid */}
        <div className="grid lg:grid-cols-2 gap-8 pt-8 border-t border-border">
          <div className="space-y-6">
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <RefreshCcw className="w-3 h-3 text-primary" /> Active Formulas
             </h4>
             <div className="grid gap-3">
                <FormulaRow label="C to F" formula="(°C × 9/5) + 32" value={fahrenheit} />
                <FormulaRow label="F to C" formula="(°F − 32) × 5/9" value={celsius} />
                <FormulaRow label="C to K" formula="°C + 273.15" value={kelvin} />
             </div>
          </div>

          <div className="space-y-6">
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <InfoIcon className="w-3 h-3 text-primary" /> Reference Landmarks
             </h4>
             <div className="grid grid-cols-2 gap-4">
                <LandmarkCard label="Absolute Zero" c="-273.15" f="-459.67" k="0" />
                <LandmarkCard label="Water Freezes" c="0" f="32" k="273.15" />
                <LandmarkCard label="Body Temp" c="37" f="98.6" k="310.15" />
                <LandmarkCard label="Water Boils" c="100" f="212" k="373.15" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TempInput({ label, symbol, value, onChange, theme, icon }: { label: string, symbol: string, value: string, onChange: (v: string) => void, theme: string, icon: React.ReactNode }) {
  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all space-y-4 group ${theme} shadow-lg ring-1 ring-inset ring-foreground/5`}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</span>
        {icon}
      </div>
      <div className="relative">
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-5xl font-black italic tracking-tighter outline-none text-foreground placeholder-foreground/20"
          placeholder="0"
        />
        <span className="absolute right-0 bottom-1 text-xl font-black opacity-30 italic">{symbol}</span>
      </div>
    </div>
  );
}

function FormulaRow({ label, formula, value }: { label: string, formula: string, value: string }) {
  return (
    <div className="p-4 rounded-2xl border border-border bg-muted/5 flex items-center justify-between text-xs group hover:bg-background transition-all">
       <div className="space-y-1">
          <span className="font-black uppercase tracking-tighter opacity-40 text-[8px]">{label}</span>
          <p className="font-mono text-muted-foreground group-hover:text-foreground transition-colors">{formula}</p>
       </div>
       <div className="text-right">
          <span className="text-[8px] font-black uppercase opacity-40">Result</span>
          <p className="font-black italic text-primary">{value}</p>
       </div>
    </div>
  );
}

function LandmarkCard({ label, c, f, k }: { label: string, c: string, f: string, k: string }) {
  return (
    <div className="p-5 rounded-[2rem] border border-border bg-background hover:shadow-xl transition-all space-y-3 cursor-default group">
       <span className="text-[10px] font-black uppercase text-muted-foreground group-hover:text-primary transition-colors">{label}</span>
       <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold">
            <span className="opacity-40 uppercase">C</span>
            <span className="text-foreground">{c}°</span>
          </div>
          <div className="flex justify-between text-[10px] font-bold">
            <span className="opacity-40 uppercase">F</span>
            <span className="text-foreground">{f}°</span>
          </div>
          <div className="flex justify-between text-[10px] font-bold">
            <span className="opacity-40 uppercase">K</span>
            <span className="text-foreground">{k}</span>
          </div>
       </div>
    </div>
  );
}
