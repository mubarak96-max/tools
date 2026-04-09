"use client";

import { useMemo, useState } from "react";

import { ASCII_ART_FONTS, renderAsciiArt, type AsciiArtFont, type AsciiArtLayout } from "@/lib/tools/ascii-art";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

const textareaClass =
  "min-h-[14rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 font-mono text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

const buttonClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

const layoutOptions: Array<{ value: AsciiArtLayout; label: string }> = [
  { value: "default", label: "Default" },
  { value: "full", label: "Full" },
  { value: "fitted", label: "Fitted" },
];

export default function AsciiArtGenerator() {
  const [text, setText] = useState("ASCII");
  const [font, setFont] = useState<AsciiArtFont>("Standard");
  const [layout, setLayout] = useState<AsciiArtLayout>("default");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const result = useMemo(
    () =>
      renderAsciiArt(text, {
        font,
        horizontalLayout: layout,
        width: 140,
        whitespaceBreak: true,
      }),
    [font, layout, text],
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
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Text to render</span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Type the text you want to turn into ASCII art."
              className={fieldClass}
              rows={3}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Font</span>
              <select
                value={font}
                onChange={(event) => setFont(event.target.value as AsciiArtFont)}
                className={fieldClass}
              >
                {ASCII_ART_FONTS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Layout</span>
              <select
                value={layout}
                onChange={(event) => setLayout(event.target.value as AsciiArtLayout)}
                className={fieldClass}
              >
                {layoutOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
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

          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">ASCII art output</span>
            <textarea
              value={result.output}
              readOnly
              className={textareaClass}
              placeholder="ASCII art appears here."
            />
          </label>
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Render stats
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">ASCII snapshot</h2>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Input characters</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.characters}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Output lines</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.lines}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Widest line</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.widestLine}</p>
            </div>
          </div>


        </aside>
      </div>
    </section>
  );
}


