"use client";

import { PDFDocument } from "pdf-lib";
import { useRef, useState } from "react";

import { PdfCard } from "@/components/pdf/shared";
import { downloadPdf } from "@/lib/tools/pdf-utils";

type Upload = {
  name: string;
  file: File;
  type: string;
};

export default function JpgToPdfTool() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) {
      return;
    }

    setError("");
    setFiles(
      Array.from(fileList).map((file) => ({
        name: file.name,
        file,
        type: file.type,
      })),
    );
  }

  async function handleConvert() {
    setLoading(true);
    setError("");

    try {
      const document = await PDFDocument.create();

      for (const upload of files) {
        const bytes = await upload.file.arrayBuffer();
        const image = upload.type.includes("png")
          ? await document.embedPng(bytes)
          : await document.embedJpg(bytes);

        const page = document.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const bytes = await document.save();
      downloadPdf(bytes, "images-to-pdf.pdf");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to convert the selected images into a PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload JPG or PNG files to make a PDF</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Add one or more images in order, then export them into a single multi-page PDF.
            </p>
          </div>
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png"
              multiple
              className="hidden"
              onChange={(event) => handleFiles(event.target.files)}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
            >
              Choose images
            </button>
            {files.length ? (
              <button
                type="button"
                onClick={() => void handleConvert()}
                disabled={loading}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Converting..." : "Create PDF"}
              </button>
            ) : null}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </PdfCard>

      {files.length ? (
        <PdfCard>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Selected images</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {files.map((file, index) => (
              <article key={`${file.name}-${index}`} className="rounded-[1.25rem] border border-border bg-background p-4">
                <h3 className="text-sm font-semibold text-foreground">{index + 1}. {file.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {file.type.includes("png") ? "PNG" : "JPG"} image
                </p>
              </article>
            ))}
          </div>
        </PdfCard>
      ) : null}
    </div>
  );
}
