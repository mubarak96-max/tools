"use client";

import { useMemo, useState } from "react";
import { ClipboardPaste, ClipboardCopy, Trash2, Hash, Type, Check, AlertCircle, Info, FileText } from "lucide-react";
import { removeEmDashes, type EmDashReplacementMode } from "@/lib/tools/em-dash-remover";

const textareaClass =
  "min-h-[16rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary/50";

const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[0.9rem] border border-border bg-card px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-foreground transition-all hover:border-primary/20 hover:bg-primary-soft hover:text-primary active:scale-[0.98]";

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[0.9rem] bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]";

const selectClass =
  "h-11 w-full rounded-[0.9rem] border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition-all focus:ring-2 focus:ring-primary focus:border-primary/50 cursor-pointer hover:border-primary/30";

const replacementOptions: Array<{ value: EmDashReplacementMode; label: string }> = [
  { value: "comma", label: "Replace with Comma (,)" },
  { value: "hyphen", label: "Replace with Hyphen (-)" },
  { value: "space", label: "Replace with Space ( )" },
  { value: "nothing", label: "Remove Completely" },
];

export default function EmDashRemover() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<EmDashReplacementMode>("hyphen");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const result = useMemo(() => removeEmDashes(text, mode), [mode, text]);

  const stats = useMemo(() => {
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const charCount = text.length;
    return { wordCount, charCount };
  }, [text]);

  const outputStats = useMemo(() => {
    const wordCount = result.output.trim() ? result.output.trim().split(/\s+/).length : 0;
    const charCount = result.output.length;
    return { wordCount, charCount };
  }, [result.output]);

  async function handleCopy() {
    if (!result.output) return;
    try {
      await navigator.clipboard.writeText(result.output);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2000);
    }
  }

  async function handlePaste() {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) setText(clipboardText);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  }

  function handleClear() {
    setText("");
    setCopyState("idle");
  }

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="glass-card flex flex-col items-center justify-between gap-6 rounded-[1.75rem] border border-border/80 p-5 lg:flex-row">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center lg:w-auto">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Type className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Cleanup Mode</p>
              <p className="text-sm font-semibold text-foreground">Select replacement style</p>
            </div>
          </div>
          
          <div className="w-full sm:w-64">
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value as EmDashReplacementMode)}
              className={selectClass}
            >
              {replacementOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center justify-center gap-3 lg:w-auto lg:grow lg:justify-end">
          {result.totalReplacements > 0 && (
            <div className="flex animate-in fade-in zoom-in duration-300 items-center gap-2 rounded-full bg-primary/10 px-4 py-2 border border-primary/20">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {result.totalReplacements}
              </span>
              <span className="text-sm font-medium text-primary">Dashes Replaced</span>
            </div>
          )}
          
          <button type="button" onClick={handleClear} className={secondaryButtonClass} disabled={!text}>
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
          
          <button type="button" onClick={handleCopy} className={primaryButtonClass} disabled={!result.output}>
            {copyState === "copied" ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied!
              </>
            ) : copyState === "error" ? (
              <>
                <AlertCircle className="h-3.5 w-3.5" />
                Error
              </>
            ) : (
              <>
                <ClipboardCopy className="h-3.5 w-3.5" />
                Copy Result
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Translation Area */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Input Draft</span>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">Original</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><Hash className="h-3 w-3" /> {stats.charCount} chars</span>
              <span className="flex items-center gap-1.5"><FileText className="h-3 w-3" /> {stats.wordCount} words</span>
            </div>
          </div>
          
          <div className="relative group">
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Paste your text here (AI drafts, articles, or notes)..."
              className={textareaClass}
            />
            {!text && (
              <button
                onClick={handlePaste}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-xl border border-dashed border-border/60 bg-background/50 px-6 py-3 text-sm font-medium text-muted-foreground hover:bg-background hover:text-primary hover:border-primary/40 transition-all active:scale-95"
              >
                <ClipboardPaste className="h-4 w-4" />
                Paste from Clipboard
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Cleaned Text</span>
              {result.totalReplacements > 0 ? (
                <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-emerald-600 animate-pulse">
                  <Check className="h-2.5 w-2.5" /> Cleaned
                </span>
              ) : (
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">Output</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><Hash className="h-3 w-3" /> {outputStats.charCount} chars</span>
              <span className="flex items-center gap-1.5"><FileText className="h-3 w-3" /> {outputStats.wordCount} words</span>
            </div>
          </div>
          
          <div className="relative">
            <textarea
              value={result.output}
              readOnly
              className={`${textareaClass} bg-muted/30 focus:ring-emerald-500/20`}
              placeholder="Cleaned content will appear here automatically."
            />
            {result.totalReplacements > 0 && (
              <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none">
                {result.emDashCount > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border px-3 py-1.5 shadow-sm">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Em Dashes</span>
                    <span className="text-sm font-bold text-foreground">{result.emDashCount}</span>
                  </div>
                )}
                {result.enDashCount > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border px-3 py-1.5 shadow-sm">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">En Dashes</span>
                    <span className="text-sm font-bold text-foreground">{result.enDashCount}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Usage Tip */}
      <div className="flex items-start gap-3 rounded-2xl bg-primary-soft p-4 border border-primary/10">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-primary">Pro Tip for AI Content</p>
          <p className="text-xs leading-relaxed text-primary/80">
            Replacing em dashes with commas or hyphens is one of the easiest ways to make ChatGPT-written text look more human. 
            Try the "Comma" mode for a softer flow or "Hyphen" for standard online publishing.
          </p>
        </div>
      </div>
    </div>
  );
}


