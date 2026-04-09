"use client";

import { useMemo, useState } from "react";

import { styleText, type TextStyleMode } from "@/lib/tools/strikethrough-text";

const textareaClass =
  "min-h-[14rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

const actionClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

const styles: Array<{ value: TextStyleMode; label: string; sample: string }> = [
  { value: "strike", label: "Strike-through", sample: "sÌ¶tÌ¶rÌ¶iÌ¶kÌ¶eÌ¶" },
  { value: "double-underline", label: "Double underline", sample: "dÍ‡oÍ‡uÍ‡bÍ‡lÍ‡eÍ‡" },
  { value: "underline", label: "Underline", sample: "UÍŸnÍŸdÍŸeÍŸrÍŸlÍŸiÍŸnÍŸeÍŸ" },
  { value: "dotted", label: "Dotted line", sample: "dÌ¤oÌ¤tÌ¤tÌ¤eÌ¤dÌ¤" },
  { value: "wave", label: "Wave line", sample: "wÌ°aÌ°vÌ°eÌ°" },
];

function lineCount(text: string) {
  if (!text) {
    return 0;
  }

  return text.split(/\r?\n/).length;
}

export default function StrikethroughText() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<TextStyleMode>("strike");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const result = useMemo(() => styleText(text, mode), [mode, text]);

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
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Input text</span>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Paste or type text to apply a stylized Unicode line treatment."
                className={textareaClass}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Styled output</span>
              <textarea
                value={result.output}
                readOnly
                className={`${textareaClass} bg-card`}
                placeholder="Styled text appears here."
              />
            </label>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-foreground">Style options</h2>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleCopy} className={actionClass}>
                  {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy result"}
                </button>
                <button type="button" onClick={handleClear} className={actionClass}>
                  Clear text
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {styles.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => setMode(style.value)}
                  className={`rounded-[1rem] border px-4 py-4 text-left transition-colors ${
                    mode === style.value
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/20"
                  }`}
                >
                  <div className="text-sm font-semibold">{style.label}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{style.sample}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Live stats
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Style snapshot</h2>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Styled characters</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.styledCharacters}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Input characters</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.inputCharacters}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Output characters</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.outputCharacters}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Lines</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{lineCount(text)}</p>
            </div>
          </div>

          <div className="rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
            <p className="text-sm leading-6 text-primary-soft-foreground">
              These styles use Unicode combining marks, so results depend on font support in the app or platform where you paste them.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

