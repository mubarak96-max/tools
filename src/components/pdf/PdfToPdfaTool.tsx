"use client";

import { PDFDocument } from "pdf-lib";
import { useState } from "react";

import { PdfCard, PdfFilePicker } from "@/components/pdf/shared";
import { downloadPdf, readPdfFile, stemFilename } from "@/lib/tools/pdf-utils";

export default function PdfToPdfaTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(fileList: FileList | null) {
    const nextFile = fileList?.[0];
    if (!nextFile) {
      return;
    }

    setFile(nextFile);
    setError("");
  }

  async function handleConvert() {
    if (!file) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { document } = await readPdfFile(file);
      const output = await PDFDocument.create();
      const copiedPages = await output.copyPages(document, document.getPageIndices());
      copiedPages.forEach((page) => output.addPage(page));

      output.setTitle(document.getTitle() ?? stemFilename(file.name), { showInWindowTitleBar: true });
      if (document.getAuthor()) {
        output.setAuthor(document.getAuthor() as string);
      }
      if (document.getSubject()) {
        output.setSubject(document.getSubject() as string);
      }
      output.setCreator("FindMyTool PDF to PDF/A");
      output.setProducer("FindMyTool");
      output.setLanguage("en-us");

      const bytes = await output.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      downloadPdf(bytes, `${stemFilename(file.name)}-pdfa-style.pdf`);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to create that archival-style PDF copy.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="mb-6 text-center">
          
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Create a best-effort archival-style PDF copy</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Rebuild the document with cleaner metadata for practical long-term storage workflows.
            </p>
          
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <PdfFilePicker label="PDF file" onFiles={handleFiles} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full">
          {file ? (
              <button
                type="button"
                onClick={() => void handleConvert()}
                disabled={loading}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Converting..." : "Create archival copy"}
              </button>
            ) : null}
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </PdfCard>

      {file ? (
        <PdfCard>
          <p className="text-sm leading-6 text-muted-foreground">
            This export is a best-effort archival copy. For strict formal PDF/A compliance, run a validator after download.
          </p>
        </PdfCard>
      ) : null}
    </div>
  );
}
