"use client";

import { useMemo, useState } from "react";

import { generateWordCloud } from "@/lib/tools/word-cloud";

const textareaClass =
  "min-h-[14rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

const buttonClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

const toneClasses = [
  "text-primary",
  "text-success",
  "text-warning",
  "text-danger",
  "text-foreground",
];

export default function WordCloudGenerator() {
  const [text, setText] = useState("");
  const [maxWords, setMaxWords] = useState(40);
  const [minLength, setMinLength] = useState(3);
  const [ignoreStopWords, setIgnoreStopWords] = useState(true);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const result = useMemo(
    () =>
      generateWordCloud(text, {
        maxWords,
        minLength,
        ignoreStopWords,
      }),
    [ignoreStopWords, maxWords, minLength, text],
  );

  const exportText = useMemo(
    () => ["word,count", ...result.items.map((item) => `${item.word},${item.count}`)].join("\n"),
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
    <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Paste text for the word cloud</span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Paste an article, essay, transcript, or keyword-rich draft to generate a word cloud."
              className={textareaClass}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Max words</span>
              <input
                type="number"
                min={10}
                max={100}
                value={maxWords}
                onChange={(event) => setMaxWords(Math.max(10, Math.min(100, Number(event.target.value) || 40)))}
                className={fieldClass}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Min length</span>
              <input
                type="number"
                min={1}
                max={12}
                value={minLength}
                onChange={(event) => setMinLength(Math.max(1, Math.min(12, Number(event.target.value) || 3)))}
                className={fieldClass}
              />
            </label>

            <label className="flex items-center gap-3 rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                checked={ignoreStopWords}
                onChange={() => setIgnoreStopWords((value) => !value)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              Ignore common words
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleCopy} className={buttonClass}>
              {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy top words"}
            </button>
            <button type="button" onClick={handleClear} className={buttonClass}>
              Clear text
            </button>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-foreground">Word cloud</h2>
              <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {result.items.length} words shown
              </span>
            </div>

            {result.items.length ? (
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-4 rounded-[1rem] border border-border bg-card p-5">
                {result.items.map((item, index) => (
                  <span
                    key={item.word}
                    className={`font-semibold leading-none ${toneClasses[index % toneClasses.length]}`}
                    style={{
                      fontSize: `${16 + item.weight * 32}px`,
                    }}
                    title={`${item.word}: ${item.count}`}
                  >
                    {item.word}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[1rem] border border-dashed border-border bg-card px-4 py-8 text-sm leading-6 text-muted-foreground">
                Add text above to generate a frequency-based word cloud.
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Cloud stats
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Word cloud snapshot</h2>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Words analyzed</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.totalWords}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Unique words</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.uniqueWords}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Top word</p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">{result.topWord ?? "-"}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.topWord ? `${result.topCount} uses` : "No words yet"}
              </p>
            </div>
          </div>


        </aside>
      </div>
    </section>
  );
}
