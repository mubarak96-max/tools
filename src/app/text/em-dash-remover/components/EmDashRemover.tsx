"use client";

import { useMemo, useState } from "react";

import { removeEmDashes, type EmDashReplacementMode } from "@/lib/tools/em-dash-remover";

const textareaClass =
  "min-h-[14rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

const buttonClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

const replacementOptions: Array<{ value: EmDashReplacementMode; label: string }> = [
  { value: "comma", label: "Comma" },
  { value: "hyphen", label: "Hyphen" },
  { value: "space", label: "Space" },
  { value: "nothing", label: "Nothing" },
];

export default function EmDashRemover() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<EmDashReplacementMode>("hyphen");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const result = useMemo(() => removeEmDashes(text, mode), [mode, text]);

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
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Input text</span>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Paste text containing em dashes or en dashes to clean it up."
                className={textareaClass}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Cleaned output</span>
              <textarea
                value={result.output}
                readOnly
                className={`${textareaClass} bg-card`}
                placeholder="Cleaned text appears here."
              />
            </label>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="grid gap-4 md:grid-cols-[14rem_minmax(0,1fr)] md:items-end">
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Replace dash with</span>
                <select
                  value={mode}
                  onChange={(event) => setMode(event.target.value as EmDashReplacementMode)}
                  className={fieldClass}
                >
                  {replacementOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleCopy} className={buttonClass}>
                  {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy result"}
                </button>
                <button type="button" onClick={handleClear} className={buttonClass}>
                  Clear text
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Cleanup stats
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Dash replacement summary</h2>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Em dashes</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.emDashCount}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">En dashes</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.enDashCount}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Total replacements</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.totalReplacements}</p>
            </div>
          </div>

          <div className="rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
            <p className="text-sm leading-6 text-primary-soft-foreground">
              Choose a comma, hyphen, space, or nothing based on the tone and punctuation style you want in the cleaned result.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}


