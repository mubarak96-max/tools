"use client";

import { PDFDocument } from "pdf-lib";
import { useState } from "react";

import { PdfCard, PdfFilePicker } from "@/components/pdf/shared";
import { downloadPdf, formatFileSize, readPdfFile, stemFilename } from "@/lib/tools/pdf-utils";

export default function CompressPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultSize, setResultSize] = useState<number | null>(null);

  function handleFiles(fileList: FileList | null) {
    const nextFile = fileList?.[0];
    if (!nextFile) {
      return;
    }

    setFile(nextFile);
    setResultSize(null);
    setError("");
  }

  async function handleCompress() {
    if (!file) {
      return;
    }

    setLoading(true);
    setError("");
    setResultSize(null);

    try {
      const { document } = await readPdfFile(file);
      const output = await PDFDocument.create();
      const copiedPages = await output.copyPages(document, document.getPageIndices());
      copiedPages.forEach((page) => output.addPage(page));
      output.setProducer("FindMyTool PDF compressor");
      output.setCreator("FindMyTool");
      output.setTitle(document.getTitle() ?? stemFilename(file.name));

      const bytes = await output.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      setResultSize(bytes.byteLength);
      downloadPdf(bytes, `${stemFilename(file.name)}-compressed.pdf`);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to compress that PDF.");
    } finally {
      setLoading(false);
    }
  }

  const reduction =
    file && resultSize !== null && file.size > 0 ? Math.max(0, Math.round(((file.size - resultSize) / file.size) * 100)) : null;

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="mb-6 text-center">
          
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Create a lighter PDF copy</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Rebuild the document into a smaller export that is easier to email or upload.
            </p>
          
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <PdfFilePicker label="PDF file" onFiles={handleFiles} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full">
          {file ? (
              <button
                type="button"
                onClick={() => void handleCompress()}
                disabled={loading}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Compressing..." : "Compress PDF"}
              </button>
            ) : null}
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </PdfCard>

      {file ? (
        <PdfCard>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-[1.25rem] border border-border bg-background p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Original file</h3>
              <p className="mt-3 text-lg font-semibold text-foreground">{formatFileSize(file.size)}</p>
            </article>
            <article className="rounded-[1.25rem] border border-border bg-background p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Latest export</h3>
              <p className="mt-3 text-lg font-semibold text-foreground">{resultSize === null ? "Not exported yet" : formatFileSize(resultSize)}</p>
            </article>
          </div>
          {reduction !== null ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Estimated size reduction: {reduction}% compared with the original file.
            </p>
          ) : null}
        </PdfCard>
      ) : null}
    </div>
  );
}
