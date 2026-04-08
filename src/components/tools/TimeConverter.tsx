"use client";

import { useMemo, useState } from "react";

import { convertTime, type TimeMode } from "@/lib/tools/time-converter";

import { panelClass, selectClass, textareaClass } from "./shared";

export default function TimeConverter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<TimeMode>("unix-to-utc");
  const result = useMemo(() => convertTime(text, mode), [mode, text]);

  return (
    <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Enter a UNIX timestamp, UTC date, seconds, or H:M:S value to convert it."
            className={textareaClass}
          />
          <textarea value={result.output} readOnly placeholder="Converted time output appears here." className={textareaClass} />
        </div>
        <aside className={`space-y-4 ${panelClass}`}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Mode</span>
            <select value={mode} onChange={(event) => setMode(event.target.value as TimeMode)} className={selectClass}>
              <option value="unix-to-utc">UNIX to UTC</option>
              <option value="utc-to-unix">UTC to UNIX</option>
              <option value="seconds-to-hms">Seconds to H:M:S</option>
              <option value="hms-to-seconds">H:M:S to seconds</option>
              <option value="seconds-to-human">Seconds to human</option>
            </select>
          </label>
          {result.error ? <div className="rounded-[1rem] border border-danger/20 bg-danger-soft p-4 text-sm text-danger">{result.error}</div> : null}
        </aside>
      </div>
    </section>
  );
}
