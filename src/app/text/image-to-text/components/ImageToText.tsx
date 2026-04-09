"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { extractTextFromImage } from "@/lib/tools/image-to-text";

const buttonClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

const textareaClass =
  "min-h-[14rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

function formatPercent(value: number) {
  return `${Math.max(0, Math.min(100, value)).toFixed(0)}%`;
}

export default function ImageToText() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [output, setOutput] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [words, setWords] = useState(0);
  const [lines, setLines] = useState(0);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const isProcessing = status !== "idle" && status !== "done" && status !== "error";

  const fileMeta = useMemo(
    () => ({
      name: file?.name ?? "No image selected",
      size: file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "0 MB",
    }),
    [file],
  );

  function handleFileChange(nextFile: File | null) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!nextFile) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
    setOutput("");
    setConfidence(0);
    setWords(0);
    setLines(0);
    setStatus("idle");
    setError(null);
    setCopyState("idle");
  }

  async function handleExtract() {
    if (!file) {
      setError("Choose an image first.");
      return;
    }

    setError(null);
    setOutput("");
    setStatus("loading");

    try {
      const result = await extractTextFromImage(file);

      setOutput(result.text);
      setConfidence(result.confidence);
      setWords(result.words);
      setLines(result.lines);
      setStatus("done");
    } catch (ocrError) {
      const message = ocrError instanceof Error ? ocrError.message : "OCR failed.";
      setError(message);
      setStatus("error");
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 1800);
    }
  }

  function handleClear() {
    handleFileChange(null);
    setOutput("");
    setConfidence(0);
    setWords(0);
    setLines(0);
    setStatus("idle");
    setError(null);
  }

  return (
    <section className="tool-frame p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Upload image</span>
              <label className="flex min-h-[14rem] cursor-pointer items-center justify-center rounded-[1.25rem] border border-dashed border-border bg-background p-4 text-center">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/bmp"
                  className="hidden"
                  onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
                />
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="OCR preview"
                    width={1200}
                    height={900}
                    unoptimized
                    className="max-h-[18rem] w-auto rounded-[1rem] object-contain"
                  />
                ) : (
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Choose an image to extract text from an image</p>
                    <p>Supports PNG, JPG, WEBP, and BMP.</p>
                  </div>
                )}
              </label>
              {status === "loading" ? (
                <p className="text-sm text-muted-foreground">Loading OCR...</p>
              ) : null}
              {error ? <p className="text-sm text-danger">{error}</p> : null}
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Extracted text</span>
              <textarea
                value={output}
                readOnly
                className={`${textareaClass} bg-card`}
                placeholder="OCR output appears here after extraction."
              />
            </label>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div className="space-y-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Image details</span>
                  <div className={fieldClass}>
                    <div className="font-semibold text-foreground">{fileMeta.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{fileMeta.size}</div>
                  </div>
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleExtract} disabled={!file || isProcessing} className={buttonClass}>
                  {isProcessing ? "Extracting..." : "Extract text"}
                </button>
                <button type="button" onClick={handleCopy} disabled={!output} className={buttonClass}>
                  {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy text"}
                </button>
                <button type="button" onClick={handleClear} className={buttonClass}>
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              OCR stats
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Image-to-text snapshot</h2>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Confidence</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{formatPercent(confidence)}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Words found</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{words}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Lines found</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{lines}</p>
            </div>
          </div>

          <div className="rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
            <p className="text-sm leading-6 text-primary-soft-foreground">
              OCR works best on high-contrast images with clear printed text. Photos with blur, handwriting, or heavy noise will reduce extraction quality.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

