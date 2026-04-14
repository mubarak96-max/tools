"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { calculateCharacterCounts } from "@/lib/tools/character-counter";

const textareaClass =
  "min-h-[16rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

const actionClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed disabled:opacity-50";

const inputClass =
  "w-full rounded-[1rem] border border-border bg-background px-3 py-3 text-sm text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary";

const selectClass =
  "w-full rounded-[1rem] border border-border bg-background px-3 py-3 text-sm text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary";

const linkActionClass =
  "inline-flex rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

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
  targetCharacterCount?: number;
};

type LimitPreset = {
  key: string;
  label: string;
  helper: string;
  min: number;
  max: number;
};

const LIMIT_PRESETS: LimitPreset[] = [
  {
    key: "custom",
    label: "Custom character target",
    helper: "Use this for forms, ads, bios, or any field with its own limit.",
    min: 0,
    max: 160,
  },
  {
    key: "google-title",
    label: "Google title tag",
    helper: "Useful for SEO page titles that should avoid search-result truncation.",
    min: 30,
    max: 60,
  },
  {
    key: "meta-description",
    label: "Meta description",
    helper: "A practical range for SEO snippets that need enough context without truncation.",
    min: 120,
    max: 160,
  },
  {
    key: "x-post",
    label: "X / Twitter post",
    helper: "Quick check for short social posts and announcements.",
    min: 1,
    max: 280,
  },
  {
    key: "instagram-caption",
    label: "Instagram caption",
    helper: "Longer captions fit, but shorter openings usually perform better.",
    min: 1,
    max: 2200,
  },
  {
    key: "linkedin-post",
    label: "LinkedIn post",
    helper: "Useful for professional updates, launch posts, and thought-leadership drafts.",
    min: 1,
    max: 3000,
  },
];

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "has",
  "have",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "this",
  "to",
  "was",
  "with",
  "you",
  "your",
]);

const DEFAULT_PROPS: Required<
  Pick<CharacterCounterProps, "placeholder" | "guideTitle" | "guideBody">
> = {
  placeholder: "Type a draft, bio, social caption, paragraph, or headline to count characters instantly.",
  guideTitle: "Length optimizer",
  guideBody:
    "Use the target selector to check SEO titles, meta descriptions, social posts, bios, and custom form limits. The counter shows overflow, progress, and simple writing signals as you type.",
};

function tokenizeWords(text: string) {
  return text.match(/\b[\p{L}\p{N}'-]+\b/gu) ?? [];
}

function getRepeatedWords(text: string) {
  const counts = new Map<string, number>();

  tokenizeWords(text).forEach((word) => {
    const normalized = word.toLowerCase();

    if (normalized.length < 3 || STOP_WORDS.has(normalized)) {
      return;
    }

    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([word, count]) => ({ word, count }))
    .filter((item) => item.count > 1)
    .sort((left, right) => right.count - left.count || left.word.localeCompare(right.word))
    .slice(0, 6);
}

function getLongSentenceCount(text: string) {
  return text
    .split(/[.!?]+/)
    .map((sentence) => tokenizeWords(sentence).length)
    .filter((count) => count >= 25).length;
}

function getLimitState(characters: number, preset: LimitPreset) {
  const limit = preset.max;
  const percent = limit > 0 ? Math.min(140, (characters / limit) * 100) : 0;
  const remaining = limit - characters;

  if (characters === 0) {
    return {
      label: "Waiting for text",
      detail: "Start typing or paste text to see counts instantly.",
      barClass: "bg-muted-foreground",
      chipClass: "slate-chip",
      percent,
      remaining,
    };
  }

  if (characters > limit) {
    return {
      label: "Too long",
      detail: `${Math.abs(remaining)} characters over the ${limit}-character limit. Text may truncate.`,
      barClass: "bg-destructive",
      chipClass: "danger-chip",
      percent,
      remaining,
    };
  }

  if (preset.min > 0 && characters < preset.min) {
    return {
      label: "Too short",
      detail: `${remaining} characters remaining. Add context or front-load important words.`,
      barClass: "bg-warning",
      chipClass: "warning-chip",
      percent,
      remaining,
    };
  }

  if (limit > 0 && characters >= limit * 0.9) {
    return {
      label: "Borderline",
      detail: `${remaining} characters remaining. Trim filler before publishing.`,
      barClass: "bg-warning",
      chipClass: "warning-chip",
      percent,
      remaining,
    };
  }

  return {
    label: "Within range",
    detail: `${remaining} characters remaining. This length fits the selected target.`,
    barClass: "bg-success",
    chipClass: "success-chip",
    percent,
    remaining,
  };
}

export default function CharacterCounter(props: CharacterCounterProps = {}) {
  const { emphasizeMetric, targetWordCount, targetCharacterCount, ...rest } = props;
  const placeholder = rest.placeholder ?? DEFAULT_PROPS.placeholder;
  const guideTitle = rest.guideTitle ?? DEFAULT_PROPS.guideTitle;
  const guideBody = rest.guideBody ?? DEFAULT_PROPS.guideBody;

  const [text, setText] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [pasteState, setPasteState] = useState<"idle" | "error">("idle");
  const [presetKey, setPresetKey] = useState(targetCharacterCount ? "custom" : "meta-description");
  const [customLimit, setCustomLimit] = useState(targetCharacterCount ?? 160);

  const counts = useMemo(() => calculateCharacterCounts(text), [text]);
  const repeatedWords = useMemo(() => getRepeatedWords(text), [text]);
  const longSentenceCount = useMemo(() => getLongSentenceCount(text), [text]);
  const activePresetBase = LIMIT_PRESETS.find((preset) => preset.key === presetKey) ?? LIMIT_PRESETS[0];
  const activePreset = activePresetBase.key === "custom" ? { ...activePresetBase, max: customLimit } : activePresetBase;
  const limitState = getLimitState(counts.characters, activePreset);
  const overflowText = counts.characters > activePreset.max ? text.slice(activePreset.max) : "";
  const safeText = overflowText ? text.slice(0, activePreset.max) : text;
  const averageWordsPerSentence = counts.sentences > 0 ? counts.words / counts.sentences : 0;

  const summaryText = useMemo(
    () =>
      [
        `Characters: ${counts.characters}`,
        `Characters (no spaces): ${counts.charactersNoSpaces}`,
        `Words: ${counts.words}`,
        `Sentences: ${counts.sentences}`,
        `Paragraphs: ${counts.paragraphs}`,
        `Reading time: ${counts.readingLabel}`,
        `Target: ${activePreset.label} (${activePreset.max} characters)`,
        `Status: ${limitState.label}`,
      ].join("\n"),
    [activePreset.label, activePreset.max, counts, limitState.label],
  );

  const wordProgressPercent =
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

  async function handlePasteText() {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      setPasteState("idle");
    } catch {
      setPasteState("error");
      window.setTimeout(() => setPasteState("idle"), 1800);
    }
  }

  function handleClear() {
    setText("");
    setCopyState("idle");
    setPasteState("idle");
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

    const primary = tiles.find((tile) => tile.key === emphasizeMetric);
    const restTiles = tiles.filter((tile) => tile.key !== emphasizeMetric);
    return primary ? [primary, ...restTiles] : tiles;
  }, [counts, emphasizeMetric]);

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_23rem]">
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
            <button type="button" onClick={handlePasteText} className={actionClass}>
              {pasteState === "error" ? "Paste blocked" : "Paste text"}
            </button>
            <button type="button" onClick={handleCopySummary} className={actionClass}>
              {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy summary"}
            </button>
            <button type="button" onClick={handleClear} className={actionClass}>
              Clear text
            </button>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Target check</p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">{activePreset.label}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{activePreset.helper}</p>
              </div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${limitState.chipClass}`}>
                {limitState.label}
              </span>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all ${limitState.barClass}`}
                style={{ width: `${Math.min(100, limitState.percent)}%` }}
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{limitState.detail}</p>
          </div>

          {overflowText ? (
            <div className="rounded-[1.5rem] border border-danger-soft bg-danger-soft/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-danger-soft-foreground">
                Overflow preview
              </p>
              <div className="mt-3 max-h-56 overflow-y-auto whitespace-pre-wrap rounded-[1rem] border border-border bg-background p-4 text-sm leading-6 text-foreground">
                <span>{safeText}</span>
                <mark className="rounded bg-danger-soft px-1 text-danger-soft-foreground">{overflowText}</mark>
              </div>
            </div>
          ) : null}

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <h2 className="text-lg font-semibold text-foreground">{guideTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{guideBody}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/text/readability-flesch-kincaid-calculator" className={linkActionClass}>
                Check readability
              </Link>
              <Link href="/text/word-frequency" className={linkActionClass}>
                Check word frequency
              </Link>
              <Link href="/text/duplicate-word-finder" className={linkActionClass}>
                Find duplicates
              </Link>
            </div>
          </div>
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Live stats</p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Text overview</h2>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Optimize for</span>
            <select value={presetKey} onChange={(event) => setPresetKey(event.target.value)} className={selectClass}>
              {LIMIT_PRESETS.map((preset) => (
                <option key={preset.key} value={preset.key}>
                  {preset.label}
                </option>
              ))}
            </select>
          </label>

          {presetKey === "custom" ? (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Custom character limit</span>
              <input
                type="number"
                min="1"
                max="10000"
                value={customLimit}
                onChange={(event) => setCustomLimit(Math.max(1, Number(event.target.value) || 1))}
                className={inputClass}
              />
            </label>
          ) : null}

          {targetWordCount != null && targetWordCount > 0 ? (
            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Target words</p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {counts.words} / {targetWordCount} words
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary transition-[width] duration-300"
                  style={{ width: `${wordProgressPercent}%` }}
                />
              </div>
            </div>
          ) : null}

          <div className="grid gap-3">
            {metricTiles.map((tile) => (
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

          <div className="rounded-[1rem] border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Writing signals</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              <li>
                {longSentenceCount > 0
                  ? `${longSentenceCount} long sentence${longSentenceCount === 1 ? "" : "s"} may need trimming.`
                  : "No long-sentence warning yet."}
              </li>
              <li>
                {averageWordsPerSentence > 22
                  ? "Average sentence length is high. Try shorter phrases."
                  : counts.words > 0
                    ? "Average sentence length looks manageable."
                    : "Sentence feedback appears as you type."}
              </li>
            </ul>
          </div>

          <div className="rounded-[1rem] border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Repeated words</p>
            {repeatedWords.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {repeatedWords.map((item) => (
                  <span key={item.word} className="slate-chip rounded-full px-2.5 py-1 text-xs font-semibold">
                    {item.word} x{item.count}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Overused terms will appear here once a word repeats.
              </p>
            )}
          </div>

          <div className="rounded-[1rem] border border-success/20 bg-success-soft p-4 text-sm leading-6 text-success-soft-foreground">
            Text is counted locally in your browser. It is not uploaded or stored by this tool.
          </div>
        </aside>
      </div>
    </section>
  );
}
