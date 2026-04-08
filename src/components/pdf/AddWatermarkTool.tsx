"use client";

import { degrees, StandardFonts, rgb } from "pdf-lib";
import { useState } from "react";

import { PdfCard, PdfField, PdfFilePicker, PdfInput, PdfSelect } from "@/components/pdf/shared";
import { downloadPdf, parsePageSelection, readPdfFile } from "@/lib/tools/pdf-utils";

type Position = "center" | "diagonal" | "bottom-right";

export default function AddWatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selection, setSelection] = useState("");
  const [text, setText] = useState("Draft");
  const [fontSize, setFontSize] = useState(42);
  const [opacity, setOpacity] = useState(0.2);
  const [position, setPosition] = useState<Position>("diagonal");
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

  async function handleWatermark() {
    if (!file) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { document } = await readPdfFile(file);
      const font = await document.embedFont(StandardFonts.HelveticaBold);
      const indexes = selection.trim() ? parsePageSelection(selection, document.getPageCount()) : document.getPageIndices();

      indexes.forEach((index) => {
        const page = document.getPage(index);
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        let x = (width - textWidth) / 2;
        let y = (height - fontSize) / 2;
        let rotation = degrees(0);

        if (position === "diagonal") {
          rotation = degrees(-32);
        } else if (position === "bottom-right") {
          x = width - textWidth - 28;
          y = 28;
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          rotate: rotation,
          color: rgb(0.7, 0.1, 0.1),
          opacity,
        });
      });

      const bytes = await document.save();
      downloadPdf(bytes, `${file.name.replace(/\.pdf$/i, "")}-watermarked.pdf`);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to add the watermark to the selected PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload a PDF to add a watermark</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Add a visible text watermark across the whole document or only selected pages.
            </p>
          </div>
          <div className="flex gap-3">
            <PdfFilePicker label="PDF file" onFiles={handleFiles} />
            {file ? (
              <button
                type="button"
                onClick={() => void handleWatermark()}
                disabled={loading}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Applying..." : "Add watermark"}
              </button>
            ) : null}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </PdfCard>

      {file ? (
        <PdfCard>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <PdfField label="Watermark text">
              <PdfInput value={text} onChange={(event) => setText(event.target.value)} />
            </PdfField>
            <PdfField label="Pages">
              <PdfInput placeholder="Leave blank for all pages" value={selection} onChange={(event) => setSelection(event.target.value)} />
            </PdfField>
            <PdfField label="Font size">
              <PdfInput type="number" min={12} max={120} value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} />
            </PdfField>
            <PdfField label="Opacity">
              <PdfInput type="number" min={0.05} max={0.9} step={0.05} value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} />
            </PdfField>
            <PdfField label="Position">
              <PdfSelect value={position} onChange={(event) => setPosition(event.target.value as Position)}>
                <option value="center">Center</option>
                <option value="diagonal">Diagonal</option>
                <option value="bottom-right">Bottom right</option>
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
