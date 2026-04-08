"use client";

import { PDFDocument } from "pdf-lib";
import { useState } from "react";

import { PdfCard, PdfField, PdfFilePicker, PdfInput } from "@/components/pdf/shared";
import { downloadPdf, ensureEveryPageSelected, parseOrderedPageSelection, readPdfFile, stemFilename } from "@/lib/tools/pdf-utils";

function buildDefaultOrder(pageCount: number) {
  return Array.from({ length: pageCount }, (_, index) => index + 1).join(",");
}

export default function OrganizePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [order, setOrder] = useState("");
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
      const count = document.getPageCount();
      setFile(nextFile);
      setPageCount(count);
      setOrder(buildDefaultOrder(count));
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to read the selected PDF.");
    }
  }

  async function handleOrganize() {
    if (!file) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { document } = await readPdfFile(file);
      const orderedIndexes = parseOrderedPageSelection(order, document.getPageCount());
      ensureEveryPageSelected(document.getPageCount(), orderedIndexes);

      const output = await PDFDocument.create();
      const copiedPages = await output.copyPages(document, orderedIndexes);
      copiedPages.forEach((page) => output.addPage(page));

      const bytes = await output.save();
      downloadPdf(bytes, `${stemFilename(file.name)}-organized.pdf`);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to organize that PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Reorder the pages into a cleaner sequence</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Enter the page order you want, then export the PDF again in that exact sequence.
            </p>
          </div>
          <div className="flex gap-3">
            <PdfFilePicker label="PDF file" onFiles={handleFiles} />
            {file ? (
              <button
                type="button"
                onClick={() => void handleOrganize()}
                disabled={loading}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Organizing..." : "Organize PDF"}
              </button>
            ) : null}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </PdfCard>

      {file ? (
        <PdfCard>
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <PdfField label="New page order">
              <PdfInput value={order} onChange={(event) => setOrder(event.target.value)} />
            </PdfField>
            <div className="flex flex-wrap items-end gap-3">
              <button
                type="button"
                onClick={() => setOrder(buildDefaultOrder(pageCount))}
                className="rounded-full border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground transition hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
              >
                Reset order
              </button>
              <button
                type="button"
                onClick={() => setOrder(Array.from({ length: pageCount }, (_, index) => pageCount - index).join(","))}
                className="rounded-full border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground transition hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
              >
                Reverse pages
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Include all {pageCount} pages once. Example: 3,1,2,4-6
          </p>
        </PdfCard>
      ) : null}
    </div>
  );
}
