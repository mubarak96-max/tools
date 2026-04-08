"use client";

import Image from "next/image";
import { useRef } from "react";

import { CopyButton, TailwindCard, TailwindField, TailwindInput, TailwindSelect, TailwindTextarea } from "@/components/tailwind/shared";

export { CopyButton, TailwindCard as ImageCard, TailwindField as ImageField, TailwindInput as ImageInput, TailwindSelect as ImageSelect, TailwindTextarea as ImageTextarea };

export function FilePicker({
  label,
  accept = "image/*",
  onFile,
}: {
  label: string;
  accept?: string;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onFile(file);
          }
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
      >
        Choose image
      </button>
    </div>
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
