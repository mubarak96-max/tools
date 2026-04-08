"use client";

import { useState } from "react";
import * as exifr from "exifr";

import { FilePicker, ImageCard, PreviewImage } from "@/components/image/shared";
import { canvasToDataUrl, downloadDataUrl, inferImageExtension, loadImageElement, readFileAsDataUrl } from "@/lib/tools/image-utils";

type MetadataEntry = {
  key: string;
  value: string;
};

export default function ImageExifViewerTool() {
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [filename, setFilename] = useState("clean-image");
  const [error, setError] = useState("");
  const [metadata, setMetadata] = useState<MetadataEntry[]>([]);

  async function handleFile(file: File) {
    setError("");

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const parsed = await exifr.parse(file);
      const image = await loadImageElement(dataUrl);
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Unable to prepare the image canvas.");
      }

      context.drawImage(image, 0, 0);

      const nextMetadata = Object.entries(parsed ?? {})
        .filter(([, value]) => typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value instanceof Date)
        .slice(0, 24)
        .map(([key, value]) => ({
          key,
          value: value instanceof Date ? value.toISOString() : String(value),
        }));

      setSource(dataUrl);
      setResult(canvasToDataUrl(canvas, file.type || "image/png"));
      setFilename(file.name.replace(/\.[^.]+$/, "") || "clean-image");
      setMetadata(nextMetadata);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to read the selected image metadata.");
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload an image to inspect EXIF metadata</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Review readable metadata tags and download a clean export with the original metadata stripped out.
            </p>
          </div>
          <div className="flex gap-3">
            <FilePicker label="Image file" onFile={handleFile} />
            {result ? (
              <button
                type="button"
                onClick={() => downloadDataUrl(result, `${filename}-metadata-removed.${inferImageExtension(result)}`)}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                Download clean image
              </button>
            ) : null}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </ImageCard>

      {source ? (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            <ImageCard>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Original</h2>
              <PreviewImage src={source} alt="Original uploaded image" />
            </ImageCard>
            {result ? (
              <ImageCard>
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Metadata-stripped export</h2>
                <PreviewImage src={result} alt="Metadata-removed image export" />
              </ImageCard>
            ) : null}
          </div>

          <ImageCard>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Readable metadata</h2>
            {metadata.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {metadata.map((entry) => (
                  <article key={entry.key} className="rounded-[1.25rem] border border-border bg-background p-4">
                    <h3 className="text-sm font-semibold text-foreground">{entry.key}</h3>
                    <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{entry.value}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">
                No readable EXIF tags were found in the uploaded file, but you can still download the metadata-stripped export.
              </p>
            )}
          </ImageCard>
        </>
      ) : null}
    </div>
  );
}
