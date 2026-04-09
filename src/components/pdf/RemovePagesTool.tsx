"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

import { PdfCard, PdfField, PdfFilePicker, PdfInput } from "@/components/pdf/shared";
import { buildRemainingPages, downloadPdf, parsePageSelection, readPdfFile } from "@/lib/tools/pdf-utils";

export default function RemovePagesTool() {
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

  async function handleRemove() {
    if (!file) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { document } = await readPdfFile(file);
      const removedIndexes = parsePageSelection(selection, document.getPageCount());
      const remaining = buildRemainingPages(document.getPageCount(), removedIndexes);
      const output = await PDFDocument.create();
      const copiedPages = await output.copyPages(document, remaining);
      copiedPages.forEach((page) => output.addPage(page));
      const bytes = await output.save();
      downloadPdf(bytes, `${file.name.replace(/\.pdf$/i, "")}-pages-removed.pdf`);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to remove the selected pages.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="mb-6 text-center">
          
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Upload a PDF to remove pages</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Enter the pages you want to drop and export a cleaned PDF without them.
            </p>
          
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <PdfFilePicker label="PDF file" onFiles={handleFiles} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full">
          {file ? (
              <button
                type="button"
                onClick={() => void handleRemove()}
                disabled={loading}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Removing..." : "Remove pages"}
              </button>
            ) : null}
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </PdfCard>

      {file ? (
        <PdfCard>
          <PdfField label="Pages to remove">
            <PdfInput placeholder="Example: 2,4,7-9" value={selection} onChange={(event) => setSelection(event.target.value)} />
          </PdfField>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {file.name} · {pageCount} pages
          </p>
        </PdfCard>
      ) : null}
    </div>
  );
}
