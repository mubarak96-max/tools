"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

import { PdfCard, PdfFilePicker } from "@/components/pdf/shared";
import { downloadPdf, readPdfFile } from "@/lib/tools/pdf-utils";

type Upload = {
  name: string;
  pageCount: number;
  file: File;
};

export default function MergePdfTool() {
  const [files, setFiles] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) {
      return;
    }

    setError("");

    try {
      const uploads = await Promise.all(
        Array.from(fileList).map(async (file) => {
          const { document } = await readPdfFile(file);
          return {
            name: file.name,
            pageCount: document.getPageCount(),
            file,
          };
        }),
      );

      setFiles(uploads);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to read the selected PDF files.");
    }
  }

  async function handleMerge() {
    setLoading(true);
    setError("");

    try {
      const merged = await PDFDocument.create();

      for (const upload of files) {
        const { document } = await readPdfFile(upload.file);
        const copied = await merged.copyPages(document, document.getPageIndices());
        copied.forEach((page) => merged.addPage(page));
      }

      const bytes = await merged.save();
      downloadPdf(bytes, "merged.pdf");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to merge the selected PDFs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="mb-6 text-center">
          
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Upload PDFs to merge</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Add the files in the order you want them to appear, then export one combined PDF.
            </p>
          
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <PdfFilePicker label="PDF files" multiple onFiles={handleFiles} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full">
          {files.length ? (
              <button
                type="button"
                onClick={() => void handleMerge()}
                disabled={loading}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Merging..." : "Merge PDFs"}
              </button>
            ) : null}
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </PdfCard>

      {files.length ? (
        <PdfCard>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Selected files</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {files.map((file, index) => (
              <article key={`${file.name}-${index}`} className="rounded-[1.25rem] border border-border bg-background p-4">
                <h3 className="text-sm font-semibold text-foreground">{index + 1}. {file.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{file.pageCount} pages</p>
              </article>
            ))}
          </div>
        </PdfCard>
      ) : null}
    </div>
  );
}
