"use client";

import { useState } from "react";

import { PdfCard, PdfField, PdfInput, PdfSelect, PdfTextarea } from "@/components/pdf/shared";

const SAMPLE_HTML = `<article style="font-family: Arial, sans-serif; padding: 24px;">
  <h1>Printable heading</h1>
  <p>Paste your own HTML here and export it as a PDF.</p>
  <ul>
    <li>Use simple markup for the most predictable result.</li>
    <li>Inline styles and embedded CSS work best.</li>
  </ul>
</article>`;

export default function HtmlToPdfTool() {
  const [title, setTitle] = useState("HTML export");
  const [format, setFormat] = useState("A4");
  const [html, setHtml] = useState(SAMPLE_HTML);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConvert() {
    if (!html.trim()) {
      setError("Paste some HTML before exporting.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/html-to-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          html,
          format,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Unable to convert this HTML into a PDF.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${(title || "html-export").replace(/\s+/g, "-").toLowerCase()}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to convert this HTML into a PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Turn HTML markup into a printable PDF</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Paste a full HTML block or a smaller fragment, then export a clean PDF copy.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void handleConvert()}
            disabled={loading}
            className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Rendering..." : "Create PDF"}
          </button>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </PdfCard>

      <PdfCard>
        <div className="grid gap-4 md:grid-cols-2">
          <PdfField label="Document title">
            <PdfInput value={title} onChange={(event) => setTitle(event.target.value)} />
          </PdfField>
          <PdfField label="Page format">
            <PdfSelect value={format} onChange={(event) => setFormat(event.target.value)}>
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
            </PdfSelect>
          </PdfField>
        </div>
        <div className="mt-4">
          <PdfField label="HTML markup">
            <PdfTextarea value={html} onChange={(event) => setHtml(event.target.value)} spellCheck={false} className="min-h-[360px] font-mono" />
          </PdfField>
        </div>
      </PdfCard>
    </div>
  );
}
