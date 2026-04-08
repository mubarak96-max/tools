"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

import { PdfCard, PdfField, PdfFilePicker, PdfInput } from "@/components/pdf/shared";
import { downloadPdf, parsePageSelection, readPdfFile } from "@/lib/tools/pdf-utils";

export default function ExtractPagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selection, setSelection] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(fileList: FileList | null) {
    const nextFile = fileList?.[0];
    if (!nextFile) {
      return;
    }

    setError("");

    try {
      const { document } = await readPdfFile(nextFile);
      setFile(nextFile);
      setPageCount(document.getPageCount());
      setSelection("");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to read the selected PDF.");
    }
  }

  async function handleExtract() {
    if (!file) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { document } = await readPdfFile(file);
      const indexes = parsePageSelection(selection, document.getPageCount());
      const output = await PDFDocument.create();
      const copiedPages = await output.copyPages(document, indexes);
      copiedPages.forEach((page) => output.addPage(page));
      const bytes = await output.save();
      downloadPdf(bytes, `${file.name.replace(/\.pdf$/i, "")}-extracted-pages.pdf`);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to extract the selected pages.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload a PDF to extract pages</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Choose the pages you want to keep and export them into a smaller standalone PDF.
            </p>
          </div>
          <div className="flex gap-3">
            <PdfFilePicker label="PDF file" onFiles={handleFiles} />
            {file ? (
              <button
                type="button"
                onClick={() => void handleExtract()}
                disabled={loading}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Extracting..." : "Extract pages"}
              </button>
            ) : null}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </PdfCard>

      {file ? (
        <PdfCard>
          <PdfField label="Pages to extract">
            <PdfInput placeholder="Example: 1-3,5,8" value={selection} onChange={(event) => setSelection(event.target.value)} />
          </PdfField>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {file.name} · {pageCount} pages
          </p>
        </PdfCard>
      ) : null}
    </div>
  );
}
