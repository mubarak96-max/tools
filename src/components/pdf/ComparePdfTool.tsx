"use client";

import { PDFDocument } from "pdf-lib";
import { useMemo, useRef, useState } from "react";

import { CopyButton, PdfCard } from "@/components/pdf/shared";
import { formatFileSize } from "@/lib/tools/pdf-utils";

type Analysis = {
  name: string;
  size: number;
  pageCount: number;
  title?: string;
  author?: string;
  producer?: string;
  pageSizes: string[];
};

async function analyzePdf(file: File): Promise<Analysis> {
  const document = await PDFDocument.load(await file.arrayBuffer());
  return {
    name: file.name,
    size: file.size,
    pageCount: document.getPageCount(),
    title: document.getTitle(),
    author: document.getAuthor(),
    producer: document.getProducer(),
    pageSizes: document.getPages().map((page) => {
      const { width, height } = page.getSize();
      return `${Math.round(width)} x ${Math.round(height)}`;
    }),
  };
}

export default function ComparePdfTool() {
  const leftInputRef = useRef<HTMLInputElement | null>(null);
  const rightInputRef = useRef<HTMLInputElement | null>(null);
  const [leftFile, setLeftFile] = useState<File | null>(null);
  const [rightFile, setRightFile] = useState<File | null>(null);
  const [left, setLeft] = useState<Analysis | null>(null);
  const [right, setRight] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCompare() {
    if (!leftFile || !rightFile) {
      setError("Choose both PDF files before comparing them.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [leftResult, rightResult] = await Promise.all([analyzePdf(leftFile), analyzePdf(rightFile)]);
      setLeft(leftResult);
      setRight(rightResult);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to compare those PDFs.");
    } finally {
      setLoading(false);
    }
  }

  const pageSizeDifference = useMemo(() => {
    if (!left || !right) {
      return "";
    }

    const longest = Math.max(left.pageSizes.length, right.pageSizes.length);
    const differentPages: string[] = [];

    for (let index = 0; index < longest; index += 1) {
      if (left.pageSizes[index] !== right.pageSizes[index]) {
        differentPages.push(`${index + 1}`);
      }
    }

    return differentPages.length ? `Different page sizes on pages: ${differentPages.join(", ")}` : "Page sizes match page-for-page.";
  }, [left, right]);

  const summary = useMemo(() => {
    if (!left || !right) {
      return "";
    }

    return [
      `Left file: ${left.name}`,
      `Right file: ${right.name}`,
      `Page count: ${left.pageCount} vs ${right.pageCount}`,
      `File size: ${formatFileSize(left.size)} vs ${formatFileSize(right.size)}`,
      `Title: ${left.title || "None"} vs ${right.title || "None"}`,
      `Author: ${left.author || "None"} vs ${right.author || "None"}`,
      `Producer: ${left.producer || "None"} vs ${right.producer || "None"}`,
      pageSizeDifference,
    ].join("\n");
  }, [left, right, pageSizeDifference]);

  return (
    <div className="space-y-6">
      <PdfCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Compare two PDFs side by side</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Check page count, file size, metadata, and page dimensions before you dig into a manual review.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void handleCompare()}
            disabled={loading}
            className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Comparing..." : "Compare PDFs"}
          </button>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </PdfCard>

      <PdfCard>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <span className="text-sm font-medium text-foreground">First PDF</span>
            <input ref={leftInputRef} type="file" accept="application/pdf" className="hidden" onChange={(event) => setLeftFile(event.target.files?.[0] ?? null)} />
            <button
              type="button"
              onClick={() => leftInputRef.current?.click()}
              className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
            >
              Choose first PDF
            </button>
            <p className="text-sm leading-6 text-muted-foreground">{leftFile?.name ?? "No file selected yet."}</p>
          </div>
          <div className="space-y-2">
            <span className="text-sm font-medium text-foreground">Second PDF</span>
            <input ref={rightInputRef} type="file" accept="application/pdf" className="hidden" onChange={(event) => setRightFile(event.target.files?.[0] ?? null)} />
            <button
              type="button"
              onClick={() => rightInputRef.current?.click()}
              className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
            >
              Choose second PDF
            </button>
            <p className="text-sm leading-6 text-muted-foreground">{rightFile?.name ?? "No file selected yet."}</p>
          </div>
        </div>
      </PdfCard>

      {left && right ? (
        <PdfCard>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Comparison summary</h2>
            <CopyButton value={summary} label="Copy summary" />
          </div>
          <div className="overflow-hidden rounded-[1.25rem] border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-background/70">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Field</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">{left.name}</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">{right.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {[
                  ["Page count", `${left.pageCount}`, `${right.pageCount}`],
                  ["File size", formatFileSize(left.size), formatFileSize(right.size)],
                  ["Title", left.title || "None", right.title || "None"],
                  ["Author", left.author || "None", right.author || "None"],
                  ["Producer", left.producer || "None", right.producer || "None"],
                ].map(([label, leftValue, rightValue]) => (
                  <tr key={label}>
                    <td className="px-4 py-3 font-medium text-foreground">{label}</td>
                    <td className="px-4 py-3 text-muted-foreground">{leftValue}</td>
                    <td className="px-4 py-3 text-muted-foreground">{rightValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">{pageSizeDifference}</p>
        </PdfCard>
      ) : null}
    </div>
  );
}
