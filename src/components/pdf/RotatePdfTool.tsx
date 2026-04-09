"use client";

import { degrees } from "pdf-lib";
import { useState } from "react";

import { PdfCard, PdfField, PdfFilePicker, PdfInput, PdfSelect } from "@/components/pdf/shared";
import { downloadPdf, parsePageSelection, readPdfFile } from "@/lib/tools/pdf-utils";

export default function RotatePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selection, setSelection] = useState("");
  const [rotation, setRotation] = useState(90);
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

  async function handleRotate() {
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
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + rotation + 360) % 360));
      });

      const bytes = await document.save();
      downloadPdf(bytes, `${file.name.replace(/\.pdf$/i, "")}-rotated.pdf`);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to rotate the selected PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="mb-6 text-center">
          
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Upload a PDF to rotate pages</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Rotate every page or only a page selection, then download the corrected document.
            </p>
          
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <PdfFilePicker label="PDF file" onFiles={handleFiles} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full">
          {file ? (
              <button
                type="button"
                onClick={() => void handleRotate()}
                disabled={loading}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Rotating..." : "Rotate PDF"}
              </button>
            ) : null}
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </PdfCard>

      {file ? (
        <PdfCard>
          <div className="grid gap-4 md:grid-cols-2">
            <PdfField label="Rotate by">
              <PdfSelect value={rotation} onChange={(event) => setRotation(Number(event.target.value))}>
                <option value={90}>90° clockwise</option>
                <option value={180}>180°</option>
                <option value={270}>270° clockwise</option>
              </PdfSelect>
            </PdfField>
            <PdfField label="Pages to rotate">
              <PdfInput placeholder="Leave blank for all pages or use 2,4,7-9" value={selection} onChange={(event) => setSelection(event.target.value)} />
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
