"use client";

import Image from "next/image";
import { useRef, useState } from "react";

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });
}

function dataUrlToBase64(dataUrl: string) {
  return dataUrl.split(",")[1] ?? "";
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={copy}
      disabled={!value}
      className="rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

function ImageCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-[1.75rem] border border-border/80 bg-card p-6 sm:p-8">
      {children}
    </section>
  );
}

export default function ImageToBase64Tool() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState("");
  const [base64, setBase64] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");
  const [filename, setFilename] = useState("");

  async function handleFile(file: File) {
    setError("");
    setFilename(file.name);
    try {
      const nextDataUrl = await readFileAsDataUrl(file);
      setPreview(nextDataUrl);
      setDataUrl(nextDataUrl);
      setBase64(dataUrlToBase64(nextDataUrl));
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to convert the selected image.");
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload an image</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Convert a local image into a raw Base64 string or a full data URL without sending it to a server.
            </p>
          </div>
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleFile(file);
                }
                event.currentTarget.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-[0.9rem] border border-border bg-card px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
            >
              Choose image
            </button>
          </div>
        </div>
        {filename ? <p className="mt-4 text-sm text-muted-foreground">Selected: {filename}</p> : null}
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </ImageCard>

      {preview ? (
        <>
          <ImageCard>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Preview</h2>
            <div className="overflow-hidden rounded-[1.5rem] border border-border bg-slate-50 p-4">
              <Image
                src={preview}
                alt="Uploaded source preview"
                width={1400}
                height={900}
                unoptimized
                className="max-h-[360px] w-full rounded-[1rem] object-contain"
              />
            </div>
          </ImageCard>

          <ImageCard>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Base64 output</h2>
              <CopyButton value={base64} label="Copy Base64" />
            </div>
            <textarea
              readOnly
              value={base64}
              className="min-h-[220px] w-full rounded-[1.5rem] border border-border bg-background px-4 py-3 font-mono text-sm text-foreground"
            />
          </ImageCard>

          <ImageCard>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Data URL</h2>
              <CopyButton value={dataUrl} label="Copy data URL" />
            </div>
            <textarea
              readOnly
              value={dataUrl}
              className="min-h-[220px] w-full rounded-[1.5rem] border border-border bg-background px-4 py-3 font-mono text-sm text-foreground"
            />
          </ImageCard>
        </>
      ) : null}
    </div>
  );
}
