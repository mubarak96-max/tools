"use client";

import { useState } from "react";

import { FilePicker, ImageCard, PreviewImage } from "@/components/image/shared";
import { canvasToDataUrl, downloadDataUrl, inferImageExtension, loadImageElement, readFileAsDataUrl } from "@/lib/tools/image-utils";

export default function TrimTransparentPixelsTool() {
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [filename, setFilename] = useState("trimmed-image");
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const image = await loadImageElement(dataUrl);
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Unable to prepare the image canvas.");
      }

      context.drawImage(image, 0, 0);
      const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);

      let minX = width;
      let minY = height;
      let maxX = -1;
      let maxY = -1;

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const alpha = data[(y * width + x) * 4 + 3];
          if (alpha > 0) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      if (maxX === -1 || maxY === -1) {
        throw new Error("The selected image appears to be fully transparent.");
      }

      const trimmedCanvas = document.createElement("canvas");
      const trimmedWidth = maxX - minX + 1;
      const trimmedHeight = maxY - minY + 1;
      trimmedCanvas.width = trimmedWidth;
      trimmedCanvas.height = trimmedHeight;
      const trimmedContext = trimmedCanvas.getContext("2d");

      if (!trimmedContext) {
        throw new Error("Unable to prepare the image canvas.");
      }

      trimmedContext.drawImage(canvas, minX, minY, trimmedWidth, trimmedHeight, 0, 0, trimmedWidth, trimmedHeight);

      setSource(dataUrl);
      setResult(canvasToDataUrl(trimmedCanvas));
      setFilename(file.name.replace(/\.[^.]+$/, "") || "trimmed-image");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to trim transparent pixels from the selected image.");
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="mb-6 text-center">
          
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Upload a transparent image to trim</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Automatically remove transparent outer padding and download the tighter image bounds.
            </p>
          
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <FilePicker label="Image file" onFile={handleFile} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full">
          {result ? (
              <button
                type="button"
                onClick={() => downloadDataUrl(result, `${filename}-trimmed.${inferImageExtension(result)}`)}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                Download image
              </button>
            ) : null}
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </ImageCard>

      {source && result ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <ImageCard>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Original</h2>
            <PreviewImage src={source} alt="Original uploaded image" />
          </ImageCard>
          <ImageCard>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Trimmed result</h2>
            <PreviewImage src={result} alt="Image after trimming transparent pixels" />
          </ImageCard>
        </div>
      ) : null}
    </div>
  );
}
