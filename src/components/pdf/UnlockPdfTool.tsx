"use client";

import { PDFDocument } from "pdf-lib-with-encrypt";
import { useState } from "react";

import { PdfCard, PdfField, PdfFilePicker, PdfInput } from "@/components/pdf/shared";
import { downloadPdf, stemFilename } from "@/lib/tools/pdf-utils";

export default function UnlockPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
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

  async function handleUnlock() {
    if (!file) {
      return;
    }

    if (!password.trim()) {
      setError("Enter the current password for this PDF.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const inputBytes = new Uint8Array(await file.arrayBuffer());
      const locked = await PDFDocument.load(inputBytes, { password });
      const plain = await PDFDocument.create();
      const copiedPages = await plain.copyPages(locked, locked.getPageIndices());
      copiedPages.forEach((page) => plain.addPage(page));
      const output = await plain.save();
      downloadPdf(output, `${stemFilename(file.name)}-unlocked.pdf`);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to unlock that PDF with the password provided.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Create an unlocked copy of a protected PDF</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use the current password, then export a version that opens normally.
            </p>
          </div>
          <div className="flex gap-3">
            <PdfFilePicker label="PDF file" onFiles={handleFiles} />
            {file ? (
              <button
                type="button"
                onClick={() => void handleUnlock()}
                disabled={loading}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Unlocking..." : "Unlock PDF"}
              </button>
            ) : null}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </PdfCard>

      {file ? (
        <PdfCard>
          <PdfField label="Current password">
            <PdfInput
              type="password"
              placeholder="Enter the password required to open this PDF"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </PdfField>
        </PdfCard>
      ) : null}
    </div>
  );
}
