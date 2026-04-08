"use client";

import mammoth from "mammoth";
import { useRef, useState } from "react";

import { PdfCard } from "@/components/pdf/shared";
import { createTextPdf, downloadPdf, stemFilename } from "@/lib/tools/pdf-utils";

export default function WordToPdfTool() {
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
      const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
      const lines = result.value.split(/\r?\n/u).map((line) => line.trimEnd());
      const pdfBytes = await createTextPdf({
        title: stemFilename(file.name),
        sections: [
          {
            heading: "Document text",
            lines: lines.filter((line, index, values) => line.length || values[index - 1]?.length),
          },
        ],
      });
      downloadPdf(pdfBytes, `${stemFilename(file.name)}.pdf`);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to convert that DOCX file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Convert a DOCX file into PDF</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Extract the document text, lay it out into a clean PDF, and download the result.
            </p>
          </div>
          <div className="flex gap-3">
            <input ref={inputRef} type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
            >
              Choose DOCX file
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
