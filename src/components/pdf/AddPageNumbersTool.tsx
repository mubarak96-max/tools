"use client";

import { StandardFonts, rgb } from "pdf-lib";
import { useState } from "react";

import { PdfCard, PdfField, PdfFilePicker, PdfInput, PdfSelect } from "@/components/pdf/shared";
import { downloadPdf, parsePageSelection, readPdfFile } from "@/lib/tools/pdf-utils";

type Position = "bottom-center" | "bottom-right" | "top-right";

export default function AddPageNumbersTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selection, setSelection] = useState("");
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(12);
  const [position, setPosition] = useState<Position>("bottom-center");
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

  async function handleNumbering() {
    if (!file) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { document } = await readPdfFile(file);
      const font = await document.embedFont(StandardFonts.Helvetica);
      const indexes = selection.trim() ? parsePageSelection(selection, document.getPageCount()) : document.getPageIndices();

      indexes.forEach((index, order) => {
        const page = document.getPage(index);
        const numberLabel = String(startNumber + order);
        const textWidth = font.widthOfTextAtSize(numberLabel, fontSize);
        const { width, height } = page.getSize();
        let x = 36;
        let y = 24;

        if (position === "bottom-center") {
          x = (width - textWidth) / 2;
          y = 24;
        } else if (position === "bottom-right") {
          x = width - textWidth - 24;
          y = 24;
        } else if (position === "top-right") {
          x = width - textWidth - 24;
          y = height - fontSize - 24;
        }

        page.drawText(numberLabel, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
      });

      const bytes = await document.save();
      downloadPdf(bytes, `${file.name.replace(/\.pdf$/i, "")}-numbered.pdf`);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to add page numbers to the selected PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="mb-6 text-center">
          
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Upload a PDF to add page numbers</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Number the whole document or only selected pages, then export the updated PDF.
            </p>
          
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <PdfFilePicker label="PDF file" onFiles={handleFiles} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full">
          {file ? (
              <button
                type="button"
                onClick={() => void handleNumbering()}
                disabled={loading}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Applying..." : "Add page numbers"}
              </button>
            ) : null}
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </PdfCard>

      {file ? (
        <PdfCard>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <PdfField label="Pages">
              <PdfInput placeholder="Leave blank for all pages" value={selection} onChange={(event) => setSelection(event.target.value)} />
            </PdfField>
            <PdfField label="Start number">
              <PdfInput type="number" min={1} value={startNumber} onChange={(event) => setStartNumber(Number(event.target.value))} />
            </PdfField>
            <PdfField label="Font size">
              <PdfInput type="number" min={8} max={48} value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} />
            </PdfField>
            <PdfField label="Position">
              <PdfSelect value={position} onChange={(event) => setPosition(event.target.value as Position)}>
                <option value="bottom-center">Bottom center</option>
                <option value="bottom-right">Bottom right</option>
                <option value="top-right">Top right</option>
              </PdfSelect>
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
