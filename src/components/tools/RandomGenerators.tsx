"use client";

import { useMemo, useState } from "react";

import { generateRandom, type RandomMode } from "@/lib/tools/random-generators";

import { inputClass, panelClass, selectClass, textareaClass } from "./shared";

export default function RandomGenerators() {
  const [mode, setMode] = useState<RandomMode>("password");
  const [length, setLength] = useState(16);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [items, setItems] = useState("");
  const output = useMemo(() => generateRandom(mode, { length, min, max, items }), [items, length, max, min, mode]);

  return (
    <section className="tool-frame p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          {mode === "pick-item" ? (
            <textarea
              value={items}
              onChange={(event) => setItems(event.target.value)}
              placeholder="Enter one item per line and the tool will pick one at random."
              className={textareaClass}
            />
          ) : null}
          <textarea value={output} readOnly placeholder="Generated output appears here." className={textareaClass} />
        </div>
        <aside className={`space-y-4 ${panelClass}`}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Generator</span>
            <select value={mode} onChange={(event) => setMode(event.target.value as RandomMode)} className={selectClass}>
              <option value="password">Password</option>
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="uuid">UUID</option>
              <option value="date">Date</option>
              <option value="time">Time</option>
              <option value="pick-item">Pick an item</option>
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Length</span>
            <input type="number" min="1" value={length} onChange={(event) => setLength(Number(event.target.value) || 1)} className={inputClass} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Min number</span>
            <input type="number" value={min} onChange={(event) => setMin(Number(event.target.value) || 0)} className={inputClass} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Max number</span>
            <input type="number" value={max} onChange={(event) => setMax(Number(event.target.value) || 0)} className={inputClass} />
          </label>
        </aside>
      </div>
    </section>
  );
}

