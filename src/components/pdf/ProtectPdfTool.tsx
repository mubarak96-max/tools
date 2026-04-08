"use client";

import { PDFDocument } from "pdf-lib-with-encrypt";
import { useState } from "react";

import { PdfCard, PdfField, PdfFilePicker, PdfInput } from "@/components/pdf/shared";
import { downloadPdf, stemFilename } from "@/lib/tools/pdf-utils";

export default function ProtectPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [openPassword, setOpenPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
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

  async function handleProtect() {
    if (!file) {
      return;
    }

    if (!openPassword.trim()) {
      setError("Enter a password to protect the PDF.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const document = await PDFDocument.load(bytes);
      await document.encrypt({
        userPassword: openPassword,
        ownerPassword: ownerPassword.trim() || openPassword,
        permissions: {
          printing: "highResolution",
          modifying: true,
          copying: true,
          annotating: true,
          fillingForms: true,
          contentAccessibility: true,
          documentAssembly: true,
        },
      });

      const output = await document.save();
      downloadPdf(output, `${stemFilename(file.name)}-protected.pdf`);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to protect that PDF right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Add a password before you share the file</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Lock the PDF with an opening password, then download the protected copy in one step.
            </p>
          </div>
          <div className="flex gap-3">
            <PdfFilePicker label="PDF file" onFiles={handleFiles} />
            {file ? (
              <button
                type="button"
                onClick={() => void handleProtect()}
                disabled={loading}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Protecting..." : "Protect PDF"}
              </button>
            ) : null}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </PdfCard>

      {file ? (
        <PdfCard>
          <div className="grid gap-4 md:grid-cols-2">
            <PdfField label="Open password">
              <PdfInput
                type="password"
                placeholder="Enter the password required to open this PDF"
                value={openPassword}
                onChange={(event) => setOpenPassword(event.target.value)}
              />
            </PdfField>
            <PdfField label="Owner password (optional)">
              <PdfInput
                type="password"
                placeholder="Leave blank to reuse the open password"
                value={ownerPassword}
                onChange={(event) => setOwnerPassword(event.target.value)}
              />
            </PdfField>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Use a password you can share separately from the file itself.
          </p>
        </PdfCard>
      ) : null}
    </div>
  );
}
