"use client";

import { useEffect, useMemo, useState } from "react";

import { FilePicker, ImageCard, PreviewImage } from "@/components/image/shared";
import { IMAGE_FORMAT_LABELS } from "@/lib/tools/image-format-conversion";
import type { ImageTool } from "@/lib/tools/image-catalog";
import { readFileAsDataUrl } from "@/lib/tools/image-utils";

const PREVIEWABLE_FORMATS = new Set(["JPG", "PNG", "WEBP", "GIF", "BMP", "AVIF"]);

export default function ImageFormatConverterTool({ tool }: { tool: ImageTool & { conversion: NonNullable<ImageTool["conversion"]> } }) {
  const [file, setFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
    };
  }, [resultUrl]);

  const sourceLabel = IMAGE_FORMAT_LABELS[tool.conversion.source];
  const targetLabel = IMAGE_FORMAT_LABELS[tool.conversion.target];
  const filename = useMemo(() => file?.name.replace(/\.[^.]+$/u, "") ?? `converted-${tool.slug}`, [file, tool.slug]);
  const canPreviewSource = PREVIEWABLE_FORMATS.has(tool.conversion.source);
  const canPreviewTarget = PREVIEWABLE_FORMATS.has(tool.conversion.target);

  async function handleFile(nextFile: File) {
    setError("");
    setFile(nextFile);
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl("");
    }

    try {
      if (canPreviewSource && nextFile.type.startsWith("image/")) {
        setSourcePreview(await readFileAsDataUrl(nextFile));
      } else {
        setSourcePreview("");
      }
    } catch {
      setSourcePreview("");
    }
  }

  async function handleConvert() {
    if (!file) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.set("kind", tool.kind);
      formData.set("file", file);

      const response = await fetch("/api/image-format-convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? `Unable to convert ${sourceLabel} to ${targetLabel}.`);
      }

      const blob = await response.blob();
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : `Unable to convert ${sourceLabel} to ${targetLabel}.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Convert {sourceLabel} to {targetLabel}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Upload one {sourceLabel} file, convert it in the browser-backed workflow, then download the {targetLabel} result.
            </p>
          </div>
          <div className="flex gap-3">
            <FilePicker label={`${sourceLabel} file`} accept={tool.conversion.accept} onFile={(nextFile) => void handleFile(nextFile)} />
            {file ? (
              <button
                type="button"
                onClick={() => void handleConvert()}
                disabled={loading}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Converting..." : `Convert to ${targetLabel}`}
              </button>
            ) : null}
            {resultUrl ? (
              <a
                href={resultUrl}
                download={`${filename}.${tool.conversion.extension}`}
                className="rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-muted-foreground transition hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
              >
                Download {targetLabel}
              </a>
            ) : null}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </ImageCard>

      {file ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <ImageCard>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Selected {sourceLabel} file</h2>
            {canPreviewSource && sourcePreview ? (
              <PreviewImage src={sourcePreview} alt={`Preview of the uploaded ${sourceLabel} file`} />
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-border bg-background p-6 text-sm leading-6 text-muted-foreground">
                Preview is not available for this source format in the browser, but the uploaded file is ready for conversion.
              </div>
            )}
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{file.name}</p>
          </ImageCard>

          {resultUrl ? (
            <ImageCard>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Converted {targetLabel} result</h2>
              {canPreviewTarget ? (
                <PreviewImage src={resultUrl} alt={`Preview of the converted ${targetLabel} image`} />
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-border bg-background p-6 text-sm leading-6 text-muted-foreground">
                  The converted file is ready to download. Browser preview is not available for {targetLabel} on this page.
                </div>
              )}
            </ImageCard>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
