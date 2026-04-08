"use client";

import { useMemo, useState } from "react";

import { translateBinary, type BinaryMode } from "@/lib/tools/binary-code";

const textareaClass =
  "min-h-[14rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 font-mono text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

const buttonClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

const modes: Array<{ value: BinaryMode; label: string; hint: string }> = [
  { value: "text-to-binary", label: "Text to Binary", hint: "Converts each character into an 8-bit binary byte" },
  { value: "binary-to-text", label: "Binary to Text", hint: "Reads space-separated 8-bit binary groups back into characters" },
];

export default function BinaryCodeTranslator() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<BinaryMode>("text-to-binary");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const result = useMemo(() => translateBinary(text, mode), [mode, text]);

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
    <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                {mode === "text-to-binary" ? "Input text" : "Input binary"}
              </span>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={
                  mode === "text-to-binary"
                    ? "Type text to convert into 8-bit binary."
                    : "Paste binary groups separated by spaces, for example 01001000 01101001."
                }
                className={textareaClass}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                {mode === "text-to-binary" ? "Binary output" : "Text output"}
              </span>
              <textarea
                value={result.output}
                readOnly
                className={`${textareaClass} bg-card`}
                placeholder="Translated output appears here."
              />
            </label>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-foreground">Translation mode</h2>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleCopy} className={buttonClass}>
                  {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy result"}
                </button>
                <button type="button" onClick={handleClear} className={buttonClass}>
                  Clear text
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {modes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMode(item.value)}
                  className={`rounded-[1rem] border px-4 py-4 text-left transition-colors ${
                    mode === item.value
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/20"
                  }`}
                >
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className="mt-2 text-xs text-muted-foreground">{item.hint}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Translation stats
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Binary snapshot</h2>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Input characters</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.inputCharacters}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Output characters</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.outputCharacters}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Translated units</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.translatedUnits}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Invalid groups</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.invalidGroups}</p>
            </div>
          </div>

          <div className="rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
            <p className="text-sm leading-6 text-primary-soft-foreground">
              Binary-to-text mode expects 8-bit groups like <span className="font-mono">01000001</span>. Invalid groups are skipped and counted.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
