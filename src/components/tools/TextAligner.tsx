"use client";

import { useMemo, useState } from "react";

import { alignText } from "@/lib/tools/text-aligner";

import { actionClass, inputClass, panelClass, selectClass, textareaClass } from "./shared";

export default function TextAligner() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"center" | "left-pad" | "right-pad" | "justify">("center");
  const [width, setWidth] = useState(40);
  const [padCharacter, setPadCharacter] = useState(" ");
  const result = useMemo(() => alignText(text, mode, width, padCharacter || " "), [text, mode, width, padCharacter]);

  return (
    <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste multiline text to center, justify, or pad each line."
            className={textareaClass}
          />
          <textarea value={result.output} readOnly placeholder="Aligned output appears here." className={textareaClass} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => navigator.clipboard.writeText(result.output)} className={actionClass}>
              Copy result
            </button>
            <button
              type="button"
              onClick={() => {
                setText("");
                setWidth(40);
                setPadCharacter(" ");
                setMode("center");
              }}
              className={actionClass}
            >
              Clear
            </button>
          </div>
        </div>
        <aside className={`space-y-4 ${panelClass}`}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Alignment mode</span>
            <select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)} className={selectClass}>
              <option value="center">Center</option>
              <option value="left-pad">Left pad</option>
              <option value="right-pad">Right pad</option>
              <option value="justify">Justify</option>
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Line width</span>
            <input type="number" min="1" value={width} onChange={(event) => setWidth(Number(event.target.value) || 1)} className={inputClass} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Pad character</span>
            <input value={padCharacter} maxLength={1} onChange={(event) => setPadCharacter(event.target.value.slice(0, 1) || " ")} className={inputClass} />
          </label>
          <div className="rounded-[1rem] border border-border bg-card p-4 text-sm text-muted-foreground">
            <p>
              Lines processed: <strong className="text-foreground">{result.lineCount}</strong>
            </p>
            <p className="mt-1">
              Target width: <strong className="text-foreground">{result.width}</strong>
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
