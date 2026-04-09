"use client";

import { useMemo, useState } from "react";

import { calculateCharacterCounts } from "@/lib/tools/character-counter";

const textareaClass =
  "min-h-[16rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

const actionClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

export default function CharacterCounter() {
  const [text, setText] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const counts = useMemo(() => calculateCharacterCounts(text), [text]);

  const summaryText = useMemo(
    () =>
      [
        `Characters: ${counts.characters}`,
        `Characters (no spaces): ${counts.charactersNoSpaces}`,
        `Words: ${counts.words}`,
        `Sentences: ${counts.sentences}`,
        `Paragraphs: ${counts.paragraphs}`,
        `Reading time: ${counts.readingLabel}`,
      ].join("\n"),
    [counts],
  );

  async function handleCopySummary() {
    try {
      await navigator.clipboard.writeText(summaryText);
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
            <span className="text-sm font-medium text-muted-foreground">Paste or type text</span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Type a draft, bio, social caption, paragraph, or headline to count characters instantly."
              className={textareaClass}
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleCopySummary} className={actionClass}>
              {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy summary"}
            </button>
            <button type="button" onClick={handleClear} className={actionClass}>
              Clear text
            </button>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <h2 className="text-lg font-semibold text-foreground">How to use the count</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use total characters when you are checking headline, caption, or form-field limits. Use the no-spaces count for stricter platform rules and use the word or reading-time totals to estimate draft length.
            </p>
          </div>
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Live stats
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Character overview</h2>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Characters</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{counts.characters}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Without spaces</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{counts.charactersNoSpaces}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[1rem] border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Words</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{counts.words}</p>
              </div>

              <div className="rounded-[1rem] border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Sentences</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{counts.sentences}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[1rem] border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Paragraphs</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{counts.paragraphs}</p>
              </div>

              <div className="rounded-[1rem] border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Reading time</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{counts.readingLabel}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

