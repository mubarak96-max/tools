"use client";

import type { ChangeEvent, DragEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  normalizeBinaryInput,
  translateBinary,
  type BinaryEncoding,
  type BinaryMode,
} from "@/lib/tools/binary-code";

const DEFAULT_BINARY_EXAMPLE = "01001000 01100101 01101100 01101100 01101111";
const DEFAULT_TEXT_EXAMPLE = "Hello";
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

const textExamples: Array<{ label: string; value: string; encoding: BinaryEncoding }> = [
  { label: "Hello", value: "Hello", encoding: "ascii" },
  { label: "OpenAI", value: "OpenAI", encoding: "ascii" },
  { label: "Hello world", value: "Hello world", encoding: "utf-8" },
];

const binaryExamples: Array<{ label: string; value: string; encoding: BinaryEncoding }> = [
  { label: "Hello", value: "01001000 01100101 01101100 01101100 01101111", encoding: "ascii" },
  { label: "Hi", value: "01001000 01101001", encoding: "ascii" },
  {
    label: "OpenAI",
    value: "01001111 01110000 01100101 01101110 01000001 01001001",
    encoding: "ascii",
  },
];

export default function BinaryCodeTranslator() {
  const hasInitializedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [text, setText] = useState(DEFAULT_BINARY_EXAMPLE);
  const [mode, setMode] = useState<BinaryMode>(DEFAULT_MODE);
  const [encoding, setEncoding] = useState<BinaryEncoding>(DEFAULT_ENCODING);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [shareState, setShareState] = useState<"idle" | "copied" | "error">("idle");
  const [loadState, setLoadState] = useState<"idle" | "loaded" | "error">("idle");
  const [loadedFileName, setLoadedFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const result = useMemo(() => translateBinary(text, mode, encoding), [encoding, mode, text]);
  const activeExamples = mode === "text-to-binary" ? textExamples : binaryExamples;
  const normalizedBinaryPreview = mode === "binary-to-text" ? normalizeBinaryInput(text) : "";

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

  function resetTransientStates() {
    setCopyState("idle");
    setShareState("idle");
    setLoadState("idle");
  }

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
    setLoadedFileName("");
    resetTransientStates();
  }

  function handleLoadDefaultExample() {
    const nextMode = mode;
    const nextExample = nextMode === "text-to-binary" ? DEFAULT_TEXT_EXAMPLE : DEFAULT_BINARY_EXAMPLE;

    setText(nextExample);
    setEncoding("ascii");
    setLoadedFileName("");
    resetTransientStates();
  }

  function handleLoadExample(value: string, nextEncoding: BinaryEncoding) {
    setText(value);
    setEncoding(nextEncoding);
    setLoadedFileName("");
    resetTransientStates();
  }

  function handleNormalizeBinary() {
    const normalized = normalizeBinaryInput(text);
    setText(normalized);
    setLoadedFileName("");
    resetTransientStates();
  }

  async function loadInputFile(file: File) {
    try {
      const nextText = await file.text();
      setText(nextText);
      setLoadedFileName(file.name);
      setLoadState("loaded");
      window.setTimeout(() => setLoadState("idle"), 2200);
    } catch {
      setLoadState("error");
      window.setTimeout(() => setLoadState("idle"), 2200);
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    await loadInputFile(file);
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    await loadInputFile(file);
  }

  const modeHelpText =
    mode === "text-to-binary"
      ? "Paste plain text, notes, code, or sample strings here. ASCII skips characters above 127, while UTF-8 and UTF-16 preserve broader character sets."
      : "Paste space-separated 8-bit binary groups such as 01001000 01100101. You can also drop a text file with raw bit output and then normalize it into byte groups if needed.";

  const translatedUnitsLabel =
    mode === "text-to-binary" ? "Output bytes" : "Valid byte groups";

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
                  onClick={() => {
                    setMode(item.value);
                    setLoadedFileName("");
                    resetTransientStates();
                  }}
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

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
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

              <div className="rounded-[1rem] border border-border bg-card px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Current mode
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {mode === "text-to-binary" ? "Encode readable text into bytes" : "Decode bytes into readable text"}
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {encoding === "ascii"
                    ? "ASCII is the strictest option and is ideal for byte-level learning."
                    : encoding === "utf-8"
                      ? "UTF-8 is the best default when the input may contain multilingual text."
                      : "UTF-16 helps when you want to inspect two-byte code units or compare UTF-16 output directly."}
                </p>
              </div>
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
              <button type="button" onClick={handleLoadDefaultExample} className={buttonClass}>
                Load example
              </button>
              {mode === "binary-to-text" ? (
                <button type="button" onClick={handleNormalizeBinary} className={buttonClass}>
                  Format bits into bytes
                </button>
              ) : null}
              <button type="button" onClick={() => fileInputRef.current?.click()} className={buttonClass}>
                Open text file
              </button>
              <button type="button" onClick={handleClear} className={buttonClass}>
                Clear
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.bin,.csv,.log,text/plain"
                className="sr-only"
                onChange={handleFileChange}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Quick examples
              </span>
              {activeExamples.map((example) => (
                <button
                  key={example.label}
                  type="button"
                  onClick={() => handleLoadExample(example.value, example.encoding)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  {mode === "text-to-binary" ? "Input text" : "Input binary"}
                </span>
                {loadedFileName ? (
                  <span className="text-xs text-muted-foreground">Loaded: {loadedFileName}</span>
                ) : null}
              </div>
              <div
                onDrop={handleDrop}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    return;
                  }
                  setDragActive(false);
                }}
                className={`rounded-[1.35rem] border border-dashed p-2 transition-colors ${
                  dragActive ? "border-primary bg-primary-soft/40" : "border-border bg-background"
                }`}
              >
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
                <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-1 pt-3">
                  <p className="text-xs leading-5 text-muted-foreground">{modeHelpText}</p>
                  <p className="text-xs font-medium text-muted-foreground">
                    Drag and drop a local text file here
                  </p>
                </div>
              </div>
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

          {loadState !== "idle" ? (
            <div
              className={`rounded-[1rem] border px-4 py-3 text-sm ${
                loadState === "loaded"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-red-200 bg-red-50 text-red-900"
              }`}
            >
              {loadState === "loaded"
                ? "Input file loaded into the translator."
                : "That file could not be read as text. Try a plain text or exported binary file instead."}
            </div>
          ) : null}

          {result.warning ? (
            <div className="rounded-[1rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {result.warning}
            </div>
          ) : null}

          {mode === "binary-to-text" && text.trim() ? (
            <div className="rounded-[1rem] border border-border bg-background px-4 py-4">
              <h3 className="text-sm font-semibold text-foreground">Binary input review</h3>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Expected input
                  </p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
                    <li>Use only 0 and 1 in each byte.</li>
                    <li>Keep each byte 8 bits long.</li>
                    <li>Separate byte groups with spaces when possible.</li>
                    <li>Use UTF-8 or UTF-16 when the source text is not basic ASCII.</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Normalized preview
                  </p>
                  <p className="mt-2 rounded-[0.9rem] border border-border bg-card px-3 py-3 font-mono text-xs leading-6 text-foreground">
                    {normalizedBinaryPreview || "No binary digits found yet."}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Use "Format bits into bytes" when the source has raw bitstreams without spaces.
                  </p>
                </div>
              </div>
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
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{translatedUnitsLabel}</p>
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

          <div className="rounded-[1rem] border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Why this helps</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This page is useful for quick decoding, byte-level debugging, coursework, capture-the-flag puzzles,
              and checking how text changes under ASCII, UTF-8, and UTF-16 without leaving the browser.
            </p>
          </div>

          <div className="rounded-[1rem] border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Input options</p>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
              <li>Paste text or binary directly.</li>
              <li>Drop a `.txt`, `.bin`, `.csv`, or `.log` file into the input area.</li>
              <li>Open a local text file and load it into the translator.</li>
              <li>Normalize raw bitstreams into 8-bit groups before decoding.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
