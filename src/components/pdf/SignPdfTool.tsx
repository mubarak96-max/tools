"use client";

import { StandardFonts, rgb } from "pdf-lib";
import { useMemo, useState } from "react";

import { PdfCard, PdfField, PdfFilePicker, PdfInput, PdfSelect } from "@/components/pdf/shared";
import { downloadPdf, parsePageSelection, readPdfFile, stemFilename } from "@/lib/tools/pdf-utils";

type Position = "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center";

export default function SignPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [selection, setSelection] = useState("");
  const [signature, setSignature] = useState("");
  const [position, setPosition] = useState<Position>("bottom-right");
  const [fontSize, setFontSize] = useState(18);
  const [includeDate, setIncludeDate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(new Date()),
    [],
  );

  async function handleFiles(fileList: FileList | null) {
    const nextFile = fileList?.[0];
    if (!nextFile) {
      return;
    }

    setError("");

    try {
      await readPdfFile(nextFile);
      setFile(nextFile);
      setSelection("");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to read the selected PDF.");
    }
  }

  async function handleSign() {
    if (!file) {
      return;
    }

    if (!signature.trim()) {
      setError("Enter the signature text you want to place on the PDF.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { document } = await readPdfFile(file);
      const font = await document.embedFont(StandardFonts.HelveticaOblique);
      const text = includeDate ? `${signature} - ${dateLabel}` : signature;
      const indexes = selection.trim() ? parsePageSelection(selection, document.getPageCount()) : document.getPageIndices();

      indexes.forEach((index) => {
        const page = document.getPage(index);
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = fontSize;
        const padding = 36;
        let x = padding;
        let y = padding;

        switch (position) {
          case "bottom-right":
            x = width - padding - textWidth;
            y = padding;
            break;
          case "bottom-left":
            x = padding;
            y = padding;
            break;
          case "top-right":
            x = width - padding - textWidth;
            y = height - padding - textHeight;
            break;
          case "top-left":
            x = padding;
            y = height - padding - textHeight;
            break;
          case "center":
            x = (width - textWidth) / 2;
            y = (height - textHeight) / 2;
            break;
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.1, 0.2, 0.42),
          opacity: 0.9,
        });
      });

      const bytes = await document.save();
      downloadPdf(bytes, `${stemFilename(file.name)}-signed.pdf`);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to sign that PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Place a visible signature on the PDF</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Add a typed signature mark to all pages or only the pages you choose.
            </p>
          </div>
          <div className="flex gap-3">
            <PdfFilePicker label="PDF file" onFiles={handleFiles} />
            {file ? (
              <button
                type="button"
                onClick={() => void handleSign()}
                disabled={loading}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing..." : "Sign PDF"}
              </button>
            ) : null}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </PdfCard>

      {file ? (
        <PdfCard>
          <div className="grid gap-4 md:grid-cols-2">
            <PdfField label="Signature text">
              <PdfInput placeholder="Type the name or approval text to place on the PDF" value={signature} onChange={(event) => setSignature(event.target.value)} />
            </PdfField>
            <PdfField label="Pages to sign">
              <PdfInput placeholder="Leave blank for all pages or use 2,4,7-9" value={selection} onChange={(event) => setSelection(event.target.value)} />
            </PdfField>
            <PdfField label="Position">
              <PdfSelect value={position} onChange={(event) => setPosition(event.target.value as Position)}>
                <option value="bottom-right">Bottom right</option>
                <option value="bottom-left">Bottom left</option>
                <option value="top-right">Top right</option>
                <option value="top-left">Top left</option>
                <option value="center">Center</option>
              </PdfSelect>
            </PdfField>
            <PdfField label="Font size">
              <PdfInput type="number" min={10} max={48} value={fontSize} onChange={(event) => setFontSize(Number(event.target.value) || 18)} />
            </PdfField>
          </div>
          <label className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
            <input type="checkbox" checked={includeDate} onChange={(event) => setIncludeDate(event.target.checked)} />
            Include today&apos;s date next to the signature
          </label>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            This adds a visible signature label, not a certificate-backed digital signature.
          </p>
        </PdfCard>
      ) : null}
    </div>
  );
}
