"use client";

import { useMemo, useState } from "react";

import { convertUnit, type UnitMode } from "@/lib/tools/unit-converter";

import { panelClass, selectClass, textareaClass } from "./shared";

export default function UnitConverter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<UnitMode>("miles-to-km");
  const result = useMemo(() => convertUnit(text, mode), [mode, text]);

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Enter one value, or comma-separated channels for RGB/CMYK conversions."
            className={textareaClass}
          />
          <textarea value={result.output} readOnly placeholder="Converted value appears here." className={textareaClass} />
        </div>
        <aside className={`space-y-4 ${panelClass}`}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Mode</span>
            <select value={mode} onChange={(event) => setMode(event.target.value as UnitMode)} className={selectClass}>
              <option value="miles-to-km">Miles to km</option>
              <option value="km-to-miles">Km to miles</option>
              <option value="c-to-f">Celsius to Fahrenheit</option>
              <option value="f-to-c">Fahrenheit to Celsius</option>
              <option value="deg-to-rad">Degrees to radians</option>
              <option value="rad-to-deg">Radians to degrees</option>
              <option value="lb-to-kg">Pounds to kilograms</option>
              <option value="kg-to-lb">Kilograms to pounds</option>
              <option value="hex-to-rgb">Hex to RGB</option>
              <option value="rgb-to-hex">RGB to hex</option>
              <option value="cmyk-to-rgb">CMYK to RGB</option>
              <option value="rgb-to-cmyk">RGB to CMYK</option>
            </select>
          </label>
          {result.error ? <div className="rounded-[1rem] border border-danger/20 bg-danger-soft p-4 text-sm text-danger">{result.error}</div> : null}
        </aside>
      </div>
    </section>
  );
}


