"use client";

import Image from "next/image";
import { ImageIcon, Images } from "lucide-react";
import { useRef, useState } from "react";

import { CopyButton, TailwindCard, TailwindField, TailwindInput, TailwindSelect, TailwindTextarea } from "@/components/tailwind/shared";

export { CopyButton, TailwindCard as ImageCard, TailwindField as ImageField, TailwindInput as ImageInput, TailwindSelect as ImageSelect, TailwindTextarea as ImageTextarea };

type UploadPickerProps = {
  label: string;
  accept: string;
  multiple: boolean;
  onSelect: (files: FileList) => void;
  emptyTitle: string;
  emptyHint: string;
  filledHint: string;
};

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${bytes} B`;
}

function summarizeAccept(accept: string) {
  if (accept === "image/*") {
    return "PNG, JPG, WEBP, GIF and more";
  }

  const parts = accept
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith(".")) {
        return part.slice(1).toUpperCase();
      }

      if (part.includes("/")) {
        return part.split("/")[1]?.toUpperCase() ?? part.toUpperCase();
      }

      return part.toUpperCase();
    });

  if (parts.length <= 3) {
    return parts.join(", ");
  }

  return `${parts.slice(0, 3).join(", ")} +${parts.length - 3} more`;
}

function buildSelectionSummary(fileList: FileList, multiple: boolean) {
  const files = Array.from(fileList);

  if (!files.length) {
    return null;
  }

  if (!multiple || files.length === 1) {
    const [file] = files;

    if (!file) {
      return null;
    }

    return {
      title: file.name,
      detail: formatBytes(file.size),
    };
  }

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);

  return {
    title: `${files.length} images selected`,
    detail: `${files[0]?.name ?? "First file"} and ${files.length - 1} more - ${formatBytes(totalBytes)}`,
  };
}

function UploadPicker({
  label,
  accept,
  multiple,
  onSelect,
  emptyTitle,
  emptyHint,
  filledHint,
}: UploadPickerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selection, setSelection] = useState<{ title: string; detail: string } | null>(null);

  function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) {
      return;
    }

    setSelection(buildSelectionSummary(fileList, multiple));
    onSelect(fileList);
  }

  return (
    <div className="min-w-[260px]">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.currentTarget.value = "";
        }}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={`rounded-[1.35rem] border border-dashed bg-background/80 p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-primary ${
          isDragging
            ? "border-primary bg-primary-soft/60 shadow-[0_18px_36px_-28px_rgba(79,70,229,0.35)]"
            : "border-border hover:border-primary/25 hover:bg-primary-soft/30"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] border border-primary/10 bg-primary-soft text-primary">
            {multiple ? <Images className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
            <p className="mt-1 truncate text-sm font-semibold text-foreground">
              {selection?.title ?? emptyTitle}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {selection ? `${selection.detail} - ${filledHint}` : `${emptyHint} - ${summarizeAccept(accept)}`}
            </p>
          </div>

          <span className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {selection ? (multiple ? "Replace" : "Change") : "Browse"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function FilePicker({
  label,
  accept = "image/*",
  onFile,
}: {
  label: string;
  accept?: string;
  onFile: (file: File) => void;
}) {
  return (
    <UploadPicker
      label={label}
      accept={accept}
      multiple={false}
      emptyTitle="Drop an image here or browse"
      emptyHint="Single file upload"
      filledHint="Click or drop to replace it"
      onSelect={(files) => {
        const file = files[0];

        if (file) {
          onFile(file);
        }
      }}
    />
  );
}

export function FilesPicker({
  label,
  accept = "image/*",
  onFiles,
}: {
  label: string;
  accept?: string;
  onFiles: (files: FileList) => void;
}) {
  return (
    <UploadPicker
      label={label}
      accept={accept}
      multiple
      emptyTitle="Drop images here or browse"
      emptyHint="Multiple file upload"
      filledHint="Click or drop to replace the set"
      onSelect={onFiles}
    />
  );
}

export function PreviewImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-border bg-slate-50 p-4">
      <Image
        src={src}
        alt={alt}
        width={1400}
        height={900}
        unoptimized
        className="max-h-[360px] w-full rounded-[1rem] object-contain"
      />
    </div>
  );
}
