"use client";

import { useMemo, useState } from "react";

import { calculateTextStatistics } from "@/lib/tools/text-statistics";

import { inputClass, panelClass, textareaClass } from "./shared";

export default function TextStatistics() {
  const [text, setText] = useState("");
  const [phraseLength, setPhraseLength] = useState(2);
  const stats = useMemo(() => calculateTextStatistics(text, phraseLength), [phraseLength, text]);

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste text to inspect phrase frequency, longest and shortest lines, and overall structure."
            className={textareaClass}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className={panelClass}>
              <h2 className="text-lg font-semibold text-foreground">Core counts</h2>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p>
                  Characters: <strong className="text-foreground">{stats.characters}</strong>
                </p>
                <p>
                  Words: <strong className="text-foreground">{stats.words}</strong>
                </p>
                <p>
                  Lines: <strong className="text-foreground">{stats.lines}</strong>
                </p>
                <p>
                  Paragraphs: <strong className="text-foreground">{stats.paragraphs}</strong>
                </p>
              </div>
            </div>
            <div className={panelClass}>
              <h2 className="text-lg font-semibold text-foreground">Line extremes</h2>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Longest line</p>
              <p className="mt-2 text-sm leading-6 text-foreground">{stats.longestLine || "None"}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Shortest line</p>
              <p className="mt-2 text-sm leading-6 text-foreground">{stats.shortestLine || "None"}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className={panelClass}>
              <h2 className="text-lg font-semibold text-foreground">Top letters</h2>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                {stats.letterFrequency.map((item) => (
                  <p key={item.value}>
                    <strong className="text-foreground">{item.value}</strong>: {item.count}
                  </p>
                ))}
              </div>
            </div>
            <div className={panelClass}>
              <h2 className="text-lg font-semibold text-foreground">Repeated phrases</h2>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                {stats.phraseFrequency.length ? (
                  stats.phraseFrequency.map((item) => (
                    <p key={item.value}>
                      <strong className="text-foreground">{item.value}</strong>: {item.count}
                    </p>
                  ))
                ) : (
                  <p>No repeated phrases found yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <aside className={`space-y-4 ${panelClass}`}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Phrase length</span>
            <input type="number" min="2" max="5" value={phraseLength} onChange={(event) => setPhraseLength(Number(event.target.value) || 2)} className={inputClass} />
          </label>
        </aside>
      </div>
    </section>
  );
}


