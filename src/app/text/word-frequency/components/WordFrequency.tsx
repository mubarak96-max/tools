"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  countWordFrequencyAdvanced,
  getKeywordDensity,
  getWordFrequencyStats,
} from "@/lib/tools/word-frequency";

type SortMode = "frequency" | "alphabetical" | "density";
type ResultGroup = "top" | "medium" | "rare" | "all";

type RankedWord = {
  word: string;
  count: number;
  density: number;
  signal: "overused" | "dominant" | "normal" | "rare";
};

const textareaClass =
  "min-h-[14rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

const inputClass =
  "w-full rounded-[1rem] border border-border bg-background px-3 py-3 text-sm text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary";

const selectClass =
  "w-full rounded-[1rem] border border-border bg-background px-3 py-3 text-sm text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary";

const actionClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed disabled:opacity-50";

const linkActionClass =
  "inline-flex rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

function getSignal(count: number, density: number): RankedWord["signal"] {
  if (count >= 5 && density >= 4.5) {
    return "overused";
  }

  if (count >= 3 && density >= 2.5) {
    return "dominant";
  }

  if (count === 1) {
    return "rare";
  }

  return "normal";
}

function getSignalClass(signal: RankedWord["signal"]) {
  if (signal === "overused") {
    return "danger-chip";
  }

  if (signal === "dominant") {
    return "warning-chip";
  }

  if (signal === "rare") {
    return "slate-chip";
  }

  return "success-chip";
}

function getSignalLabel(signal: RankedWord["signal"]) {
  if (signal === "overused") {
    return "Overused";
  }

  if (signal === "dominant") {
    return "Dominant";
  }

  if (signal === "rare") {
    return "Rare";
  }

  return "Normal";
}

function quoteCsv(value: string | number) {
  const stringValue = String(value);
  return /[",\n]/.test(stringValue) ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
}

function sortRows(rows: RankedWord[], sortMode: SortMode) {
  return [...rows].sort((left, right) => {
    if (sortMode === "alphabetical") {
      return left.word.localeCompare(right.word);
    }

    if (sortMode === "density") {
      return right.density - left.density || right.count - left.count || left.word.localeCompare(right.word);
    }

    return right.count - left.count || right.density - left.density || left.word.localeCompare(right.word);
  });
}

export default function WordFrequency() {
  const [text, setText] = useState("");
  const [ignoreStopWords, setIgnoreStopWords] = useState(true);
  const [minLength, setMinLength] = useState(2);
  const [minFrequency, setMinFrequency] = useState(1);
  const [sortMode, setSortMode] = useState<SortMode>("frequency");
  const [activeGroup, setActiveGroup] = useState<ResultGroup>("top");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    const sharedText = sessionStorage.getItem("shared_tool_text");
    if (sharedText) {
      setText(sharedText);
      sessionStorage.removeItem("shared_tool_text");
    }
  }, []);

  const handleNextStep = () => {
    if (text) {
      sessionStorage.setItem("shared_tool_text", text);
    }
  };

  const options = useMemo(() => ({ ignoreStopWords, minLength }), [ignoreStopWords, minLength]);
  const stats = useMemo(() => getWordFrequencyStats(text, options), [options, text]);
  const rows = useMemo(() => {
    const ranked = countWordFrequencyAdvanced(text, options)
      .map((item) => {
        const density = getKeywordDensity(item.count, stats.analyzedWords);
        return {
          ...item,
          density,
          signal: getSignal(item.count, density),
        };
      })
      .filter((item) => item.count >= minFrequency);

    return sortRows(ranked, sortMode);
  }, [minFrequency, options, sortMode, stats.analyzedWords, text]);

  const groupedRows = useMemo(() => {
    const top = rows.filter((row) => row.signal === "overused" || row.signal === "dominant").slice(0, 30);
    const topWords = new Set(top.map((row) => row.word));

    return {
      top,
      medium: rows.filter((row) => !topWords.has(row.word) && row.count > 1),
      rare: rows.filter((row) => row.count === 1),
      all: rows,
    };
  }, [rows]);

  const visibleRows = groupedRows[activeGroup].slice(0, 100);
  const overusedWord = rows.find((row) => row.signal === "overused");
  const dominantWords = rows.filter((row) => row.signal === "overused" || row.signal === "dominant").slice(0, 3);
  const vocabularyDiversity = stats.analyzedWords > 0 ? stats.uniqueWords / stats.analyzedWords : 0;
  const topChartRows = rows.slice(0, 10);
  const cloudRows = rows.slice(0, 30);

  const csvText = useMemo(
    () =>
      [
        "word,count,density_percent,signal",
        ...rows.map((item) =>
          [item.word, item.count, item.density.toFixed(2), item.signal].map(quoteCsv).join(","),
        ),
      ].join("\n"),
    [rows],
  );

  async function handleCopyResults() {
    try {
      await navigator.clipboard.writeText(csvText);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 1800);
    }
  }

  function handleExportCsv() {
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "word-frequency-results.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Paste text to analyze</span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Paste an article, essay, landing page, transcript, or keyword draft."
              className={textareaClass}
            />
          </label>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Insights</p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">
                  {stats.totalWords ? "What your text repeats" : "Paste text to get word usage recommendations"}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleCopyResults} disabled={!rows.length} className={actionClass}>
                  {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy CSV"}
                </button>
                <button type="button" onClick={handleExportCsv} disabled={!rows.length} className={actionClass}>
                  Export CSV
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-3">
              <div className="rounded-[1rem] border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Overuse warning</p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {overusedWord
                    ? `You may be overusing "${overusedWord.word}" (${overusedWord.count} uses, ${overusedWord.density.toFixed(2)}%).`
                    : stats.totalWords
                      ? "No strong overuse warning with the current filters."
                      : "Repeated terms will appear here."}
                </p>
              </div>
              <div className="rounded-[1rem] border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Dominant terms</p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {dominantWords.length
                    ? dominantWords.map((item) => item.word).join(", ")
                    : stats.totalWords
                      ? "No dominant topic terms stand out yet."
                      : "Top keywords will summarize your topic."}
                </p>
              </div>
              <div className="rounded-[1rem] border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Vocabulary diversity</p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {stats.analyzedWords > 0
                    ? vocabularyDiversity < 0.42 && stats.analyzedWords > 80
                      ? "Low diversity detected. Add variation or remove repeated phrasing."
                      : `${Math.round(vocabularyDiversity * 100)}% unique analyzed words.`
                    : "Diversity score appears after analysis."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Visual layer</p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">Top-word bars</h2>
              </div>
              <p className="text-sm text-muted-foreground">Density is based on analyzed words.</p>
            </div>
            <div className="mt-5 space-y-3">
              {topChartRows.length ? (
                topChartRows.map((item) => (
                  <div key={item.word} className="grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)_4rem] sm:items-center">
                    <span className="truncate text-sm font-medium text-foreground">{item.word}</span>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, item.density * 8)}%` }} />
                    </div>
                    <span className="text-right text-xs font-semibold text-muted-foreground">{item.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-muted-foreground">Top-word bars appear as you type.</p>
              )}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Grouped table</p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">Word frequency results</h2>
              </div>
              <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {rows.length} words ranked
              </span>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-4">
              {[
                ["top", "Most frequent", groupedRows.top.length],
                ["medium", "Medium", groupedRows.medium.length],
                ["rare", "Rare", groupedRows.rare.length],
                ["all", "All words", groupedRows.all.length],
              ].map(([key, label, count]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveGroup(key as ResultGroup)}
                  className={`rounded-[0.9rem] border px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] ${activeGroup === key
                    ? "border-primary/30 bg-primary-soft text-primary-soft-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/20"
                    }`}
                >
                  {label}
                  <span className="mt-1 block text-[11px] normal-case tracking-normal">{count} words</span>
                </button>
              ))}
            </div>

            {visibleRows.length ? (
              <div className="mt-5 overflow-hidden rounded-[1rem] border border-border">
                <div className="grid grid-cols-[minmax(0,1fr)_5rem_6rem_6rem] border-b border-border bg-muted/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <span>Word</span>
                  <span className="text-right">Count</span>
                  <span className="text-right">Density</span>
                  <span className="text-right">Signal</span>
                </div>
                <div className="max-h-[30rem] overflow-y-auto">
                  {visibleRows.map((item, index) => (
                    <div
                      key={item.word}
                      className="grid grid-cols-[minmax(0,1fr)_5rem_6rem_6rem] items-center gap-2 border-b border-border px-4 py-3 text-sm last:border-b-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-border bg-card px-2 text-xs font-semibold text-muted-foreground">
                          {index + 1}
                        </span>
                        <span className="truncate font-medium text-foreground">{item.word}</span>
                      </div>
                      <span className="text-right font-semibold text-foreground">{item.count}</span>
                      <span className="text-right font-medium text-muted-foreground">{item.density.toFixed(2)}%</span>
                      <span className="text-right">
                        <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${getSignalClass(item.signal)}`}>
                          {getSignalLabel(item.signal)}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-[1rem] border border-dashed border-border bg-card px-4 py-8 text-sm leading-6 text-muted-foreground">
                Start typing or relax the filters to see most frequent, medium frequency, and rare words.
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Controls</p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Analysis settings</h2>
          </div>

          <label className="flex items-center gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              checked={ignoreStopWords}
              onChange={(event) => setIgnoreStopWords(event.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            Exclude stop words
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Minimum word length</span>
            <input
              type="number"
              min="1"
              max="20"
              value={minLength}
              onChange={(event) => setMinLength(Math.max(1, Number(event.target.value) || 1))}
              className={inputClass}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Minimum occurrences</span>
            <input
              type="number"
              min="1"
              max="100"
              value={minFrequency}
              onChange={(event) => setMinFrequency(Math.max(1, Number(event.target.value) || 1))}
              className={inputClass}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Sort by</span>
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} className={selectClass}>
              <option value="frequency">Frequency</option>
              <option value="density">Density</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </label>

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
          </div>

          <div className="rounded-[1rem] border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Word cloud</p>
            {cloudRows.length ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {cloudRows.map((item) => (
                  <span
                    key={item.word}
                    className="rounded-full border border-border bg-background px-2 py-1 font-semibold text-foreground"
                    style={{ fontSize: `${Math.min(24, 12 + item.density * 2)}px` }}
                    title={`${item.count} uses, ${item.density.toFixed(2)}%`}
                  >
                    {item.word}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">A quick visual cloud appears after analysis.</p>
            )}
          </div>

          <div className="rounded-[1rem] border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Next steps</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/text/readability-flesch-kincaid-calculator" onClick={handleNextStep} className={linkActionClass}>
                Check readability
              </Link>
              <Link href="/text/phrase-frequency-calculator" onClick={handleNextStep} className={linkActionClass}>
                Phrase frequency
              </Link>
              <Link href="/text/case-converter" onClick={handleNextStep} className={linkActionClass}>
                Convert case
              </Link>
            </div>
          </div>


        </aside>
      </div>
    </section>
  );
}
