"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

import { PdfCard, PdfField, PdfFilePicker, PdfInput, PdfSelect } from "@/components/pdf/shared";
import { downloadPdf, parsePageSelection, readPdfFile } from "@/lib/tools/pdf-utils";

export default function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<"single-pages" | "page-range">("single-pages");
  const [range, setRange] = useState("");
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
      setRange("");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to read the selected PDF.");
    }
  }

  async function handleSplit() {
    if (!file) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { document } = await readPdfFile(file);

      if (mode === "single-pages") {
        for (let index = 0; index < document.getPageCount(); index += 1) {
          const output = await PDFDocument.create();
          const [copiedPage] = await output.copyPages(document, [index]);
          output.addPage(copiedPage);
          const bytes = await output.save();
          downloadPdf(bytes, `${file.name.replace(/\.pdf$/i, "")}-page-${index + 1}.pdf`);
        }
      } else {
        const indexes = parsePageSelection(range, document.getPageCount());
        const output = await PDFDocument.create();
        const copiedPages = await output.copyPages(document, indexes);
        copiedPages.forEach((page) => output.addPage(page));
        const bytes = await output.save();
        downloadPdf(bytes, `${file.name.replace(/\.pdf$/i, "")}-split.pdf`);
      }
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to split the selected PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload a PDF to split</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Export every page as its own PDF or create a smaller PDF from a page selection.
            </p>
          </div>
          <div className="flex gap-3">
            <PdfFilePicker label="PDF file" onFiles={handleFiles} />
            {file ? (
              <button
                type="button"
                onClick={() => void handleSplit()}
                disabled={loading}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Splitting..." : "Split PDF"}
              </button>
            ) : null}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </PdfCard>

      {file ? (
        <PdfCard>
          <div className="grid gap-4 md:grid-cols-2">
            <PdfField label="Split mode">
              <PdfSelect value={mode} onChange={(event) => setMode(event.target.value as "single-pages" | "page-range")}>
                <option value="single-pages">One PDF per page</option>
                <option value="page-range">Export page range</option>
              </PdfSelect>
            </PdfField>
            <PdfField label="Pages">
              <PdfInput
                placeholder={mode === "single-pages" ? "Not needed for one-page split" : "Example: 1-3,5,8"}
                value={range}
                disabled={mode === "single-pages"}
                onChange={(event) => setRange(event.target.value)}
              />
            </PdfField>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {file.name} · {pageCount} pages
          </p>
        </PdfCard>
      ) : null}
    </div>
  );
}
