"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type OcrResult = {
  text: string;
  confidence: number | null;
};

export default function ImageToText() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState("");
  const [filename, setFilename] = useState("");
  const [result, setResult] = useState<OcrResult>({ text: "", confidence: null });
  const [status, setStatus] = useState("Upload an image to extract editable text.");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  async function runOcr(file: File) {
    setError("");
    setFilename(file.name);
    setPreview(URL.createObjectURL(file));
    setResult({ text: "", confidence: null });
    setIsRunning(true);
    setStatus("Loading OCR engine...");

    try {
      const tesseract = await import("tesseract.js");
      const output = await tesseract.recognize(file, "eng", {
        logger(message) {
          if (message.status) {
            const percent = typeof message.progress === "number" ? ` ${Math.round(message.progress * 100)}%` : "";
            setStatus(`${message.status}${percent}`);
          }
        },
      });
      setResult({
        text: output.data.text.trim(),
        confidence: typeof output.data.confidence === "number" ? output.data.confidence : null,
      });
      setStatus("OCR complete.");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to extract text from this image.");
      setStatus("OCR failed.");
    } finally {
      setIsRunning(false);
    }
  }

  async function copyText() {
    if (!result.text) return;
    await navigator.clipboard.writeText(result.text);
    setStatus("Text copied.");
  }

  return (
    <section className="space-y-6 rounded-[1.75rem] border border-border/80 bg-card p-6 sm:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload an image</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Extract English text from screenshots, labels, receipts, scanned notes, and document photos.
          </p>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/bmp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void runOcr(file);
              }
              event.currentTarget.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isRunning}
            className="rounded-[0.9rem] border border-border bg-card px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Choose image
          </button>
        </div>
      </div>

      {filename ? <p className="text-sm text-muted-foreground">Selected: {filename}</p> : null}
      <p className="text-sm text-muted-foreground">{status}</p>
      {error ? <p className="text-sm text-danger">{error}</p> : null}

      {preview ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[1.5rem] border border-border bg-slate-50 p-4">
            <Image
              src={preview}
              alt="Uploaded image preview"
              width={1200}
              height={800}
              unoptimized
              className="max-h-[420px] w-full rounded-[1rem] object-contain"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-foreground">Extracted text</h3>
              <button
                type="button"
                onClick={copyText}
                disabled={!result.text}
                className="rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Copy
              </button>
            </div>
            {result.confidence !== null ? (
              <p className="text-xs font-medium text-muted-foreground">
                Confidence: {Math.round(result.confidence)}%
              </p>
            ) : null}
            <textarea
              value={result.text}
              onChange={(event) => setResult((current) => ({ ...current, text: event.target.value }))}
              placeholder={isRunning ? "Extracting text..." : "Extracted text will appear here."}
              className="min-h-[320px] w-full rounded-[1.5rem] border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
