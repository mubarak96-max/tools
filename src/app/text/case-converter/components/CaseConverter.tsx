"use client";

import { useMemo, useState } from "react";

import { convertCase, type CaseMode } from "@/lib/tools/case-converter";

const textareaClass =
  "min-h-[14rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

const buttonClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

const modes: Array<{ value: CaseMode; label: string; sample: string }> = [
  { value: "upper", label: "UPPERCASE", sample: "HELLO WORLD" },
  { value: "lower", label: "lowercase", sample: "hello world" },
  { value: "title", label: "Title Case", sample: "Hello World" },
  { value: "sentence", label: "Sentence case", sample: "Hello world." },
  { value: "camel", label: "camelCase", sample: "helloWorld" },
  { value: "pascal", label: "PascalCase", sample: "HelloWorld" },
  { value: "kebab", label: "kebab-case", sample: "hello-world" },
  { value: "snake", label: "snake_case", sample: "hello_world" },
];

function wordCount(text: string) {
  const normalized = text.trim();
  return normalized ? normalized.split(/\s+/).length : 0;
}

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<CaseMode>("title");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const converted = useMemo(() => convertCase(text, mode), [mode, text]);

  const stats = useMemo(
    () => ({
      inputCharacters: text.length,
      outputCharacters: converted.length,
      inputWords: wordCount(text),
      outputWords: wordCount(converted),
    }),
    [converted, text],
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(converted);
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
                placeholder="Paste text to convert into a different case style."
                className={textareaClass}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Converted output</span>
              <textarea
                value={converted}
                readOnly
                className={`${textareaClass} bg-card`}
                placeholder="Converted text appears here."
              />
            </label>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-foreground">Conversion styles</h2>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleCopy} className={buttonClass}>
                  {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy result"}
                </button>
                <button type="button" onClick={handleClear} className={buttonClass}>
                  Clear text
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
                  <div className="mt-2 text-xs text-muted-foreground">{item.sample}</div>
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
            <h2 className="mt-2 text-lg font-semibold text-foreground">Case conversion snapshot</h2>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Input characters</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{stats.inputCharacters}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Output characters</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{stats.outputCharacters}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[1rem] border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Input words</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{stats.inputWords}</p>
              </div>

              <div className="rounded-[1rem] border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Output words</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{stats.outputWords}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
            <p className="text-sm leading-6 text-primary-soft-foreground">
              Use title or sentence case for readable copy, and use camel, pascal, kebab, or snake for naming conventions and structured text cleanup.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}


