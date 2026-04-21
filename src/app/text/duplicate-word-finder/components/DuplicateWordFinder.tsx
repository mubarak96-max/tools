"use client";

import { useEffect, useMemo, useState } from "react";

import { findDuplicateWords } from "@/lib/tools/duplicate-word-finder";

const textareaClass =
  "min-h-[16rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

const buttonClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

export default function DuplicateWordFinder() {
  const [text, setText] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    const sharedText = sessionStorage.getItem("shared_tool_text");
    if (sharedText) {
      setText(sharedText);
      sessionStorage.removeItem("shared_tool_text");
    }
  }, []);

  const result = useMemo(() => findDuplicateWords(text), [text]);
  const topItems = result.items.slice(0, 100);

  const exportText = useMemo(
    () =>
      [
        "word,count,duplicate_occurrences",
        ...result.items.map((item) => [item.word, item.count, item.duplicateCount].join(",")),
      ].join("\n"),
    [result.items],
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 1800);
    }
  }

  function handleClear() {
    setText("");
    setCopyState("idle");
  }

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Paste text to scan for repeats</span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Paste a draft, article, or caption to find repeated words quickly."
              className={textareaClass}
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleCopy} className={buttonClass}>
              {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy results"}
            </button>
            <button type="button" onClick={handleClear} className={buttonClass}>
              Clear text
            </button>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">Duplicate words</h2>
                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {result.duplicateWords} found
                </span>
              </div>
            </div>

            {topItems.length ? (
              <div className="mt-5 overflow-hidden rounded-[1rem] border border-border">
                <div className="grid grid-cols-[minmax(0,1fr)_6rem_8rem] border-b border-border bg-muted/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <span>Word</span>
                  <span className="text-right">Count</span>
                  <span className="text-right">Repeats</span>
                </div>
                <div className="max-h-[28rem] overflow-y-auto">
                  {topItems.map((item, index) => (
                    <div
                      key={item.word}
                      className="grid grid-cols-[minmax(0,1fr)_6rem_8rem] items-center border-b border-border px-4 py-3 text-sm last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-border bg-card px-2 text-xs font-semibold text-muted-foreground">
                          {index + 1}
                        </span>
                        <span className="font-medium text-foreground">{item.word}</span>
                      </div>
                      <span className="text-right font-semibold text-foreground">{item.count}</span>
                      <span className="text-right font-medium text-muted-foreground">{item.duplicateCount}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-[1rem] border border-dashed border-border bg-card px-4 py-8 text-sm leading-6 text-muted-foreground">
                Add text above to surface repeated words and duplicate counts.
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Live stats
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Repeat snapshot</h2>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Total words</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.totalWords}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Unique words</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.uniqueWords}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Duplicate words</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.duplicateWords}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Repeated occurrences</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                {result.totalDuplicateOccurrences}
              </p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Most repeated</p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                {result.mostRepeatedWord ?? "-"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.mostRepeatedWord ? `${result.mostRepeatedCount} total uses` : "No duplicate words yet"}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}


