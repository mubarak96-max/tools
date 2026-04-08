"use client";

import { useMemo, useState } from "react";

import { runRegexExtract, runRegexReplace } from "@/lib/tools/regex-tools";

import { actionClass, inputClass, panelClass, selectClass, textareaClass } from "./shared";

export default function RegexTools() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"extract" | "replace">("extract");
  const [pattern, setPattern] = useState("\\w+");
  const [flags, setFlags] = useState("g");
  const [replacement, setReplacement] = useState("");
  const result = useMemo(
    () => (mode === "extract" ? runRegexExtract(text, pattern, flags) : runRegexReplace(text, pattern, flags, replacement)),
    [flags, mode, pattern, replacement, text],
  );

  return (
    <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste text and run a regex extract or replace operation."
            className={textareaClass}
          />
          <textarea value={result.output} readOnly placeholder="Regex output appears here." className={textareaClass} />
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
            <span className="text-sm font-medium text-muted-foreground">Mode</span>
            <select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)} className={selectClass}>
              <option value="extract">Extract matches</option>
              <option value="replace">Replace matches</option>
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Pattern</span>
            <input value={pattern} onChange={(event) => setPattern(event.target.value)} className={inputClass} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Flags</span>
            <input value={flags} onChange={(event) => setFlags(event.target.value)} className={inputClass} />
          </label>
          {mode === "replace" ? (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Replacement</span>
              <input value={replacement} onChange={(event) => setReplacement(event.target.value)} className={inputClass} />
            </label>
          ) : null}
          <div className="rounded-[1rem] border border-border bg-card p-4 text-sm text-muted-foreground">
            <p>
              Matches: <strong className="text-foreground">{result.matches.length}</strong>
            </p>
            {result.error ? <p className="mt-2 text-danger">{result.error}</p> : null}
          </div>
        </aside>
      </div>
    </section>
  );
}
