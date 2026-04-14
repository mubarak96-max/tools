"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { convertCase, type CaseMode } from "@/lib/tools/case-converter";

const textareaClass =
  "min-h-[14rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

const inputClass =
  "w-full rounded-[1rem] border border-border bg-background px-3 py-3 text-sm text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary";

const buttonClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed disabled:opacity-50";

const linkActionClass =
  "inline-flex rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

const modes: Array<{ value: CaseMode; label: string; sample: string; group: "Writing" | "Developer" | "Advanced" }> = [
  { value: "upper", label: "UPPERCASE", sample: "HELLO WORLD", group: "Writing" },
  { value: "lower", label: "lowercase", sample: "hello world", group: "Writing" },
  { value: "title", label: "Title Case", sample: "Hello World", group: "Writing" },
  { value: "seo-title", label: "SEO Title Case", sample: "Best Tools for Writers", group: "Writing" },
  { value: "apa-title", label: "APA Title Case", sample: "Case Rules for Developers", group: "Writing" },
  { value: "sentence", label: "Sentence case", sample: "Hello world.", group: "Writing" },
  { value: "camel", label: "camelCase", sample: "helloWorld", group: "Developer" },
  { value: "pascal", label: "PascalCase", sample: "HelloWorld", group: "Developer" },
  { value: "kebab", label: "kebab-case", sample: "hello-world", group: "Developer" },
  { value: "snake", label: "snake_case", sample: "hello_world", group: "Developer" },
  { value: "constant", label: "CONSTANT_CASE", sample: "HELLO_WORLD", group: "Developer" },
  { value: "dot", label: "dot.case", sample: "hello.world", group: "Developer" },
  { value: "path", label: "path/case", sample: "hello/world", group: "Developer" },
  { value: "alternating", label: "aLtErNaTiNg", sample: "hElLo WoRlD", group: "Advanced" },
  { value: "inverse", label: "iNVERSE cASE", sample: "hELLO wORLD", group: "Advanced" },
];

const quickOutputModes: CaseMode[] = ["title", "seo-title", "camel", "snake", "kebab", "constant"];

function wordCount(text: string) {
  const normalized = text.trim();
  return normalized ? normalized.split(/\s+/).length : 0;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyFindReplace(text: string, findText: string, replaceText: string) {
  if (!findText) {
    return text;
  }

  return text.replace(new RegExp(escapeRegExp(findText), "g"), replaceText);
}

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<CaseMode>("seo-title");
  const [copyState, setCopyState] = useState<string | null>(null);
  const [preserveFormatting, setPreserveFormatting] = useState(true);
  const [lineByLine, setLineByLine] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");

  useEffect(() => {
    const sharedText = sessionStorage.getItem("shared_tool_text");
    if (sharedText) {
      setText(sharedText);
      sessionStorage.removeItem("shared_tool_text");
    }
  }, []);

  const handleNextStep = () => {
    if (text) {
      sessionStorage.setItem("shared_tool_text", text);
    }
  };

  const preparedText = useMemo(() => applyFindReplace(text, findText, replaceText), [findText, replaceText, text]);
  const converted = useMemo(
    () => convertCase(preparedText, mode, { preserveFormatting, lineByLine }),
    [lineByLine, mode, preserveFormatting, preparedText],
  );

  const quickOutputs = useMemo(
    () =>
      quickOutputModes.map((quickMode) => ({
        mode: quickMode,
        label: modes.find((item) => item.value === quickMode)?.label ?? quickMode,
        output: convertCase(preparedText, quickMode, { preserveFormatting, lineByLine }),
      })),
    [lineByLine, preserveFormatting, preparedText],
  );

  const stats = useMemo(
    () => ({
      inputCharacters: text.length,
      outputCharacters: converted.length,
      inputWords: wordCount(text),
      outputWords: wordCount(converted),
      modeLabel: modes.find((item) => item.value === mode)?.label ?? "Case conversion",
    }),
    [converted, mode, text],
  );

  async function copyValue(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyState(key);
      window.setTimeout(() => setCopyState(null), 1800);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState(null), 1800);
    }
  }

  async function handlePaste() {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch {
      setCopyState("paste-error");
      window.setTimeout(() => setCopyState(null), 1800);
    }
  }

  function handleClear() {
    setText("");
    setCopyState(null);
    setFindText("");
    setReplaceText("");
  }

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Original text</span>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Paste text to instantly convert case formats for writing, SEO, URLs, variables, or code."
                className={textareaClass}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Converted preview</span>
              <textarea value={converted} readOnly className={`${textareaClass} bg-card`} placeholder="Converted text appears here live." />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handlePaste} className={buttonClass}>
              {copyState === "paste-error" ? "Paste blocked" : "Paste text"}
            </button>
            <button type="button" onClick={() => copyValue(converted, "result")} disabled={!converted} className={buttonClass}>
              {copyState === "result" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy result"}
            </button>
            <button type="button" onClick={handleClear} className={buttonClass}>
              Clear text
            </button>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Live conversion</p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">{stats.modeLabel}</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={preserveFormatting} onChange={(event) => setPreserveFormatting(event.target.checked)} className="h-4 w-4 rounded border-border" />
                  Preserve formatting
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={lineByLine} onChange={(event) => setLineByLine(event.target.checked)} className="h-4 w-4 rounded border-border" />
                  Convert line by line
                </label>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Find text first</span>
                <input value={findText} onChange={(event) => setFindText(event.target.value)} placeholder="Optional find text" className={inputClass} />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Replace with</span>
                <input value={replaceText} onChange={(event) => setReplaceText(event.target.value)} placeholder="Optional replacement" className={inputClass} />
              </label>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <h2 className="text-lg font-semibold text-foreground">Conversion styles</h2>
            <div className="mt-5 space-y-5">
              {(["Writing", "Developer", "Advanced"] as const).map((group) => (
                <div key={group}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{group}</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {modes.filter((item) => item.group === group).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setMode(item.value)}
                        className={`rounded-[1rem] border px-4 py-4 text-left transition-colors ${mode === item.value
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
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <h2 className="text-lg font-semibold text-foreground">Copy common formats</h2>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {quickOutputs.map((item) => (
                <div key={item.mode} className="rounded-[1rem] border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <button type="button" onClick={() => copyValue(item.output, item.mode)} disabled={!item.output} className={buttonClass}>
                      {copyState === item.mode ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="mt-3 line-clamp-2 break-all text-xs leading-5 text-muted-foreground">{item.output || "Output appears here."}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Live stats</p>
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
              Use Title Case for headings, SEO Title Case for snippets, camelCase for JavaScript, snake_case for Python and databases, and kebab-case for URLs.
            </p>
          </div>

          <div className="rounded-[1rem] border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Next steps</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/text/character-counter" onClick={handleNextStep} className={linkActionClass}>Count characters</Link>
              <Link href="/text/word-frequency" onClick={handleNextStep} className={linkActionClass}>Analyze words</Link>
              <Link href="/text/readability-flesch-kincaid-calculator" onClick={handleNextStep} className={linkActionClass}>Check readability</Link>
            </div>
          </div>


        </aside>
      </div>
    </section>
  );
}
