"use client";

import { useState } from "react";

import { FilePicker, ImageCard, ImageField, ImageInput, ImageSelect, PreviewImage } from "@/components/image/shared";
import { canvasToDataUrl, downloadDataUrl, inferImageExtension, loadImageElement, readFileAsDataUrl } from "@/lib/tools/image-utils";

export default function ImageCompressorTool() {
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [filename, setFilename] = useState("compressed-image");
  const [error, setError] = useState("");
  const [quality, setQuality] = useState(0.72);
  const [format, setFormat] = useState("image/jpeg");

  async function handleFile(file: File) {
    setError("");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSource(dataUrl);
      setFilename(file.name.replace(/\.[^.]+$/, "") || "compressed-image");
      setResult("");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to load the selected image.");
    }
  }

  async function compress() {
    if (!source) {
      return;
    }

    try {
      const image = await loadImageElement(source);
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Unable to prepare the image canvas.");
      }

      context.drawImage(image, 0, 0);
      setResult(canvasToDataUrl(canvas, format, quality));
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to compress the selected image.");
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload an image to compress</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Lower the quality, switch the output format, preview the result, and download a lighter image file.
            </p>
          </div>
          <div className="flex gap-3">
            <FilePicker label="Image file" onFile={handleFile} />
            {result ? (
              <button
                type="button"
                onClick={() => downloadDataUrl(result, `${filename}-compressed.${inferImageExtension(result)}`)}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                Download image
              </button>
            ) : null}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </ImageCard>

      {source ? (
        <>
          <ImageCard>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <ImageField label="Output format">
                <ImageSelect value={format} onChange={(event) => setFormat(event.target.value)}>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/webp">WebP</option>
                  <option value="image/png">PNG</option>
                </ImageSelect>
              </ImageField>
              <ImageField label="Quality">
                <ImageInput type="number" min={0.1} max={1} step={0.01} value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
              </ImageField>
            </div>
            <button
              type="button"
              onClick={() => void compress()}
              className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              Compress image
            </button>
          </ImageCard>

          <div className="grid gap-6 xl:grid-cols-2">
            <ImageCard>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Original</h2>
              <PreviewImage src={source} alt="Original uploaded image" />
            </ImageCard>
            {result ? (
              <ImageCard>
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Compressed result</h2>
                <PreviewImage src={result} alt="Compressed image result" />
              </ImageCard>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
