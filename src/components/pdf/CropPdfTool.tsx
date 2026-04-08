"use client";

import { useState } from "react";

import { PdfCard, PdfField, PdfFilePicker, PdfInput } from "@/components/pdf/shared";
import { downloadPdf, parsePageSelection, readPdfFile, stemFilename } from "@/lib/tools/pdf-utils";

export default function CropPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selection, setSelection] = useState("");
  const [top, setTop] = useState(0);
  const [right, setRight] = useState(0);
  const [bottom, setBottom] = useState(0);
  const [left, setLeft] = useState(0);
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

  async function handleCrop() {
    if (!file) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { document } = await readPdfFile(file);
      const indexes = selection.trim() ? parsePageSelection(selection, document.getPageCount()) : document.getPageIndices();

      indexes.forEach((index) => {
        const page = document.getPage(index);
        const { width, height } = page.getSize();
        if (left + right >= width || top + bottom >= height) {
          throw new Error(`Crop values are too large for page ${index + 1}.`);
        }

        page.setCropBox(left, bottom, width - left - right, height - top - bottom);
      });

      const bytes = await document.save();
      downloadPdf(bytes, `${stemFilename(file.name)}-cropped.pdf`);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to crop that PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Trim extra page edges from the PDF</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Remove unwanted margins by setting crop values in PDF points.
            </p>
          </div>
          <div className="flex gap-3">
            <PdfFilePicker label="PDF file" onFiles={handleFiles} />
            {file ? (
              <button
                type="button"
                onClick={() => void handleCrop()}
                disabled={loading}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Cropping..." : "Crop PDF"}
              </button>
            ) : null}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </PdfCard>

      {file ? (
        <PdfCard>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <PdfField label="Top crop">
              <PdfInput type="number" min={0} value={top} onChange={(event) => setTop(Number(event.target.value) || 0)} />
            </PdfField>
            <PdfField label="Right crop">
              <PdfInput type="number" min={0} value={right} onChange={(event) => setRight(Number(event.target.value) || 0)} />
            </PdfField>
            <PdfField label="Bottom crop">
              <PdfInput type="number" min={0} value={bottom} onChange={(event) => setBottom(Number(event.target.value) || 0)} />
            </PdfField>
            <PdfField label="Left crop">
              <PdfInput type="number" min={0} value={left} onChange={(event) => setLeft(Number(event.target.value) || 0)} />
            </PdfField>
          </div>
          <div className="mt-4">
            <PdfField label="Pages to crop">
              <PdfInput placeholder="Leave blank for all pages or use 2,4,7-9" value={selection} onChange={(event) => setSelection(event.target.value)} />
            </PdfField>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {file.name} - {pageCount} pages. One point is roughly 1/72 of an inch.
          </p>
        </PdfCard>
      ) : null}
    </div>
  );
}
