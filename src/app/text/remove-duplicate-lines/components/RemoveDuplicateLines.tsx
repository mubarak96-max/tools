"use client";

import { useMemo, useState } from "react";

import { removeDuplicateLines } from "@/lib/tools/remove-duplicate-lines";

const textareaClass =
  "min-h-[16rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

const buttonClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

export default function RemoveDuplicateLines() {
  const [text, setText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [ignoreBlankLines, setIgnoreBlankLines] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const result = useMemo(
    () =>
      removeDuplicateLines(text, {
        caseSensitive,
        trimWhitespace,
        ignoreBlankLines,
      }),
    [caseSensitive, ignoreBlankLines, text, trimWhitespace],
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.output);
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
    <section className="tool-frame p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Paste lines to clean up</span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Paste a list, dataset, email export, or keyword block with repeated lines."
              className={textareaClass}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex items-center gap-3 rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={() => setCaseSensitive((value) => !value)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              Case-sensitive
            </label>
            <label className="flex items-center gap-3 rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                checked={trimWhitespace}
                onChange={() => setTrimWhitespace((value) => !value)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              Trim whitespace
            </label>
            <label className="flex items-center gap-3 rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                checked={ignoreBlankLines}
                onChange={() => setIgnoreBlankLines((value) => !value)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              Ignore blank lines
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleCopy} className={buttonClass}>
              {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy result"}
            </button>
            <button type="button" onClick={handleClear} className={buttonClass}>
              Clear text
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-border bg-background p-5">
              <h2 className="text-lg font-semibold text-foreground">Original input</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Paste lists, logs, email exports, or copied rows that often include repeated lines.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-background p-5">
              <h2 className="text-lg font-semibold text-foreground">Clean result</h2>
              <textarea
                value={result.output}
                readOnly
                placeholder="Unique lines will appear here."
                className={textareaClass}
              />
            </div>
          </div>
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Line stats
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Deduplication snapshot</h2>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Total lines</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.totalLines}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Unique lines</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.uniqueLines}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Removed</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                {result.duplicateLinesRemoved}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

