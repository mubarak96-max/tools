"use client";

import { useMemo, useState } from "react";

import { extractValues } from "@/lib/tools/text-extractors";

import { actionClass, panelClass, selectClass, textareaClass } from "./shared";

export default function TextExtractors() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"email" | "url" | "number">("email");
  const [uniqueOnly, setUniqueOnly] = useState(true);
  const result = useMemo(() => extractValues(text, mode, uniqueOnly), [text, mode, uniqueOnly]);

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste text to pull out emails, URLs, or numbers."
            className={textareaClass}
          />
          <textarea value={result.output} readOnly placeholder="Extracted matches appear here." className={textareaClass} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => navigator.clipboard.writeText(result.output)} className={actionClass}>
              Copy result
            </button>
            <button type="button" onClick={() => setText("")} className={actionClass}>
              Clear
            </button>
          </div>
        </div>
        <aside className={`space-y-4 ${panelClass}`}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Extractor</span>
            <select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)} className={selectClass}>
              <option value="email">Emails</option>
              <option value="url">URLs</option>
              <option value="number">Numbers</option>
            </select>
          </label>
          <label className="flex items-center gap-3 text-sm text-foreground">
            <input type="checkbox" checked={uniqueOnly} onChange={(event) => setUniqueOnly(event.target.checked)} />
            <span>Keep unique only</span>
          </label>
          <div className="rounded-[1rem] border border-border bg-card p-4 text-sm text-muted-foreground">
            <p>
              Total matches: <strong className="text-foreground">{result.totalMatches}</strong>
            </p>
            <p className="mt-1">
              Unique matches: <strong className="text-foreground">{result.uniqueMatches}</strong>
            </p>
            <p className="mt-1">
              Output lines: <strong className="text-foreground">{result.values.length}</strong>
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}


