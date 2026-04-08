"use client";

import JSZip from "jszip";
import { useRef, useState } from "react";

import { PdfCard } from "@/components/pdf/shared";
import { createTextPdf, decodeXmlText, downloadPdf, stemFilename } from "@/lib/tools/pdf-utils";

function extractSlideTexts(xml: string) {
  return Array.from(xml.matchAll(/<a:t>([\s\S]*?)<\/a:t>/gu))
    .map((match) => decodeXmlText(match[1]).trim())
    .filter(Boolean);
}

export default function PowerpointToPdfTool() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConvert() {
    if (!file) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const zip = await JSZip.loadAsync(await file.arrayBuffer());
      const slideNames = Object.keys(zip.files)
        .filter((name) => /^ppt\/slides\/slide\d+\.xml$/u.test(name))
        .sort((left, right) => {
          const leftNumber = Number(left.match(/slide(\d+)\.xml/u)?.[1] ?? 0);
          const rightNumber = Number(right.match(/slide(\d+)\.xml/u)?.[1] ?? 0);
          return leftNumber - rightNumber;
        });

      if (!slideNames.length) {
        throw new Error("No slides were found in this PPTX file.");
      }

      const sections = [];
      for (const [index, slideName] of slideNames.entries()) {
        const xml = await zip.files[slideName].async("string");
        const lines = extractSlideTexts(xml);
        sections.push({
          heading: `Slide ${index + 1}`,
          lines: lines.length ? lines : ["No text found on this slide."],
        });
      }

      const bytes = await createTextPdf({
        title: stemFilename(file.name),
        sections,
      });
      downloadPdf(bytes, `${stemFilename(file.name)}.pdf`);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to convert that PowerPoint file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Turn a PPTX deck into a PDF handout</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Extract the slide text, preserve the slide order, and export a readable PDF copy.
            </p>
          </div>
          <div className="flex gap-3">
            <input ref={inputRef} type="file" accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation" className="hidden" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
            >
              Choose PPTX file
            </button>
            {file ? (
              <button
                type="button"
                onClick={() => void handleConvert()}
                disabled={loading}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Converting..." : "Create PDF"}
              </button>
            ) : null}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </PdfCard>

      {file ? (
        <PdfCard>
          <p className="text-sm leading-6 text-muted-foreground">
            Selected file: <span className="font-medium text-foreground">{file.name}</span>
          </p>
        </PdfCard>
      ) : null}
    </div>
  );
}
