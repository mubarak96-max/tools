"use client";

import { useMemo, useState } from "react";

import {
  countWordFrequencyAdvanced,
  getKeywordDensity,
  getWordFrequencyStats,
} from "@/lib/tools/word-frequency";

const textareaClass =
  "min-h-[14rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

export default function WordFrequency() {
  const [text, setText] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const results = useMemo(() => countWordFrequencyAdvanced(text), [text]);

  const stats = useMemo(() => getWordFrequencyStats(text), [text]);

  const topResults = results.slice(0, 100);

  const activeResultsText = useMemo(() => {
    const rows = [
      "word,count,density",
      ...results.map((item) =>
        [
          item.word,
          item.count,
          getKeywordDensity(item.count, stats.analyzedWords).toFixed(2),
        ].join(","),
      ),
    ];

    return rows.join("\n");
  }, [results, stats.analyzedWords]);

  async function handleCopyResults() {
    try {
      await navigator.clipboard.writeText(activeResultsText);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 1800);
    }
  }

  function handleExportCsv() {
    const blob = new Blob([activeResultsText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "word-frequency-results.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="tool-frame p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Paste text to analyze</span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Paste an article, essay, product copy, or any block of text."
              className={textareaClass}
            />
          </label>



          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">Frequency results</h2>
                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {results.length} words ranked
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopyResults}
                  className="rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
                >
                  {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy results"}
                </button>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
                >
                  CSV export
                </button>
              </div>
            </div>

            {topResults.length ? (
              <div className="mt-5 overflow-hidden rounded-[1rem] border border-border">
                <div className="grid grid-cols-[minmax(0,1fr)_6rem_6rem] border-b border-border bg-muted/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <span>Word</span>
                  <span className="text-right">Count</span>
                  <span className="text-right">Density</span>
                </div>
                <div className="max-h-[28rem] overflow-y-auto">
                  {topResults.map((item, index) => (
                    <div
                      key={item.word}
                      className="grid grid-cols-[minmax(0,1fr)_6rem_6rem] items-center border-b border-border px-4 py-3 text-sm last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-border bg-card px-2 text-xs font-semibold text-muted-foreground">
                          {index + 1}
                        </span>
                        <span className="font-medium text-foreground">{item.word}</span>
                      </div>
                      <span className="text-right font-semibold text-foreground">{item.count}</span>
                      <span className="text-right font-medium text-muted-foreground">
                        {getKeywordDensity(item.count, stats.analyzedWords).toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-[1rem] border border-dashed border-border bg-card px-4 py-8 text-sm leading-6 text-muted-foreground">
                Add text above to see repeated words, filtered counts, and top terms.
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Text snapshot
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Quick stats</h2>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Total words</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{stats.totalWords}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Analyzed words</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{stats.analyzedWords}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Unique words</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{stats.uniqueWords}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Most frequent</p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                {stats.mostFrequentWord ?? "-"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stats.mostFrequentWord ? `${stats.mostFrequentCount} uses` : "No repeated words yet"}
              </p>
            </div>
          </div>


        </aside>
      </div>
    </section>
  );
}


