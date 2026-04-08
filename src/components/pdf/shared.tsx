"use client";

import { useRef } from "react";

import { CopyButton, TailwindCard, TailwindField, TailwindInput, TailwindSelect, TailwindTextarea } from "@/components/tailwind/shared";

export { CopyButton, TailwindCard as PdfCard, TailwindField as PdfField, TailwindInput as PdfInput, TailwindSelect as PdfSelect, TailwindTextarea as PdfTextarea };

export function PdfFilePicker({
  label,
  multiple = false,
  onFiles,
}: {
  label: string;
  multiple?: boolean;
  onFiles: (files: FileList | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple={multiple}
        className="hidden"
        onChange={(event) => onFiles(event.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
      >
        Choose PDF{multiple ? "s" : ""}
      </button>
    </div>
  );
}
