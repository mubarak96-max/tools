"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  translateBinary,
  type BinaryEncoding,
  type BinaryMode,
} from "@/lib/tools/binary-code";

const DEFAULT_EXAMPLE = "01001000 01100101 01101100 01101100 01101111";
const DEFAULT_MODE: BinaryMode = "binary-to-text";
const DEFAULT_ENCODING: BinaryEncoding = "ascii";

const textareaClass =
  "min-h-[14rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 font-mono text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

const buttonClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

const modes: Array<{ value: BinaryMode; label: string; hint: string }> = [
  { value: "text-to-binary", label: "Text to Binary", hint: "Convert readable text into binary bytes" },
  { value: "binary-to-text", label: "Binary to Text", hint: "Decode space-separated 8-bit binary groups" },
];

const encodings: Array<{ value: BinaryEncoding; label: string; hint: string }> = [
  { value: "ascii", label: "ASCII", hint: "Best for basic English letters, digits, and punctuation" },
  { value: "utf-8", label: "UTF-8", hint: "Modern web encoding for most languages" },
  { value: "utf-16", label: "UTF-16", hint: "Two-byte code units, decoded here as UTF-16LE" },
];

export default function BinaryCodeTranslator() {
  const hasInitializedRef = useRef(false);
  const [text, setText] = useState(DEFAULT_EXAMPLE);
  const [mode, setMode] = useState<BinaryMode>(DEFAULT_MODE);
  const [encoding, setEncoding] = useState<BinaryEncoding>(DEFAULT_ENCODING);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [shareState, setShareState] = useState<"idle" | "copied" | "error">("idle");

  const result = useMemo(() => translateBinary(text, mode, encoding), [encoding, mode, text]);

  useEffect(() => {
    if (hasInitializedRef.current || typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const nextMode = params.get("mode");
    const nextEncoding = params.get("encoding");
    const nextInput = params.get("input");

    if (nextMode === "text-to-binary" || nextMode === "binary-to-text") {
      setMode(nextMode);
    }

    if (nextEncoding === "ascii" || nextEncoding === "utf-8" || nextEncoding === "utf-16") {
      setEncoding(nextEncoding);
    }

    if (typeof nextInput === "string" && nextInput.length > 0) {
      setText(nextInput);
    }

    hasInitializedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hasInitializedRef.current || typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams();
    params.set("mode", mode);
    params.set("encoding", encoding);
    params.set("input", text);

    const nextUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", nextUrl);
  }, [encoding, mode, text]);

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

  async function handleShareLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareState("copied");
      window.setTimeout(() => setShareState("idle"), 1800);
    } catch {
      setShareState("error");
      window.setTimeout(() => setShareState("idle"), 1800);
    }
  }

  function handleDownload() {
    const blob = new Blob([result.output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const extension = mode === "text-to-binary" ? "binary.txt" : "text.txt";

    anchor.href = url;
    anchor.download = `binary-translator-output-${encoding}.${extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function handleClear() {
    setText("");
    setCopyState("idle");
    setShareState("idle");
  }

  function handleLoadExample() {
    setMode("binary-to-text");
    setEncoding("ascii");
    setText(DEFAULT_EXAMPLE);
    setCopyState("idle");
    setShareState("idle");
  }

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="grid gap-3 md:grid-cols-2">
              {modes.map((item) => (
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
                  <div className="mt-2 text-xs text-muted-foreground">{item.hint}</div>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Encoding</span>
                <select
                  value={encoding}
                  onChange={(event) => setEncoding(event.target.value as BinaryEncoding)}
                  className="w-full rounded-[1rem] border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                >
                  {encodings.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label} - {item.hint}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={handleCopy} className={buttonClass}>
                {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy result"}
              </button>
              <button type="button" onClick={handleDownload} className={buttonClass}>
                Download output
              </button>
              <button type="button" onClick={handleShareLink} className={buttonClass}>
                {shareState === "copied" ? "Link copied" : shareState === "error" ? "Share failed" : "Copy share link"}
              </button>
              <button type="button" onClick={handleLoadExample} className={buttonClass}>
                Load example
              </button>
              <button type="button" onClick={handleClear} className={buttonClass}>
                Clear
              </button>
            </div>
          </div>

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
                    ? "Type text to convert into binary."
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

          {result.warning ? (
            <div className="rounded-[1rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {result.warning}
            </div>
          ) : null}
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

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Skipped units</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.skippedUnits}</p>
            </div>
          </div>


        </aside>
      </div>
    </section>
  );
}
