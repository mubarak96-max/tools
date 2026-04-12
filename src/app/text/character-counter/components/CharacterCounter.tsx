"use client";

import { useMemo, useState } from "react";

import { calculateCharacterCounts } from "@/lib/tools/character-counter";

const textareaClass =
  "min-h-[16rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

const actionClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

export type CharacterCounterMetric =
  | "characters"
  | "charactersNoSpaces"
  | "words"
  | "sentences"
  | "paragraphs"
  | "reading";

export type CharacterCounterProps = {
  placeholder?: string;
  guideTitle?: string;
  guideBody?: string;
  emphasizeMetric?: CharacterCounterMetric;
  targetWordCount?: number;
};

const DEFAULT_PROPS: Required<
  Pick<CharacterCounterProps, "placeholder" | "guideTitle" | "guideBody">
> = {
  placeholder: "Type a draft, bio, social caption, paragraph, or headline to count characters instantly.",
  guideTitle: "How to use the count",
  guideBody:
    "Use total characters when you are checking headline, caption, or form-field limits. Use the no-spaces count for stricter platform rules and use the word or reading-time totals to estimate draft length.",
};

export default function CharacterCounter(props: CharacterCounterProps = {}) {
  const { emphasizeMetric, targetWordCount, ...rest } = props;
  const placeholder = rest.placeholder ?? DEFAULT_PROPS.placeholder;
  const guideTitle = rest.guideTitle ?? DEFAULT_PROPS.guideTitle;
  const guideBody = rest.guideBody ?? DEFAULT_PROPS.guideBody;

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

  const progressPercent =
    targetWordCount && targetWordCount > 0
      ? Math.min(100, Math.round((counts.words / targetWordCount) * 100))
      : 0;

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

  const metricTiles = useMemo(() => {
    const tiles: { key: CharacterCounterMetric; label: string; value: string | number }[] = [
      { key: "characters", label: "Characters", value: counts.characters },
      { key: "charactersNoSpaces", label: "Without spaces", value: counts.charactersNoSpaces },
      { key: "words", label: "Words", value: counts.words },
      { key: "sentences", label: "Sentences", value: counts.sentences },
      { key: "paragraphs", label: "Paragraphs", value: counts.paragraphs },
      { key: "reading", label: "Reading time", value: counts.readingLabel },
    ];

    if (!emphasizeMetric) {
      return tiles;
    }

    const primary = tiles.find((t) => t.key === emphasizeMetric);
    const restTiles = tiles.filter((t) => t.key !== emphasizeMetric);
    return primary ? [primary, ...restTiles] : tiles;
  }, [counts, emphasizeMetric]);

  const [firstTile, ...otherTiles] = metricTiles;
  const secondTile = otherTiles[0];
  const pairA = otherTiles.slice(1, 3);
  const pairB = otherTiles.slice(3);

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Paste or type text</span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={placeholder}
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
            <h2 className="text-lg font-semibold text-foreground">{guideTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{guideBody}</p>
          </div>
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Live stats</p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Text overview</h2>
          </div>

          {targetWordCount != null && targetWordCount > 0 ? (
            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Target words</p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {counts.words} / {targetWordCount} words
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary transition-[width] duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : null}

          <div className="grid gap-3">
            {firstTile ? (
              <div
                className={`rounded-[1rem] border bg-card p-4 ${
                  emphasizeMetric === firstTile.key ? "border-primary/40 ring-1 ring-primary/15" : "border-border"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {firstTile.label}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{firstTile.value}</p>
              </div>
            ) : null}

            {secondTile ? (
              <div
                className={`rounded-[1rem] border bg-card p-4 ${
                  emphasizeMetric === secondTile.key ? "border-primary/40 ring-1 ring-primary/15" : "border-border"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {secondTile.label}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{secondTile.value}</p>
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {pairA.map((tile) => (
                <div
                  key={tile.key}
                  className={`rounded-[1rem] border bg-card p-4 ${
                    emphasizeMetric === tile.key ? "border-primary/40 ring-1 ring-primary/15" : "border-border"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{tile.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{tile.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {pairB.map((tile) => (
                <div
                  key={tile.key}
                  className={`rounded-[1rem] border bg-card p-4 ${
                    emphasizeMetric === tile.key ? "border-primary/40 ring-1 ring-primary/15" : "border-border"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{tile.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{tile.value}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
