"use client";

import { useState } from "react";

import { FilePicker, ImageCard, PreviewImage } from "@/components/image/shared";
import { canvasToDataUrl, downloadDataUrl, inferImageExtension, loadImageElement, readFileAsDataUrl } from "@/lib/tools/image-utils";

export default function ImageColorsInverterTool() {
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [filename, setFilename] = useState("inverted-image");

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
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      for (let index = 0; index < pixels.length; index += 4) {
        pixels[index] = 255 - pixels[index];
        pixels[index + 1] = 255 - pixels[index + 1];
        pixels[index + 2] = 255 - pixels[index + 2];
      }

      context.putImageData(imageData, 0, 0);
      setSource(dataUrl);
      setResult(canvasToDataUrl(canvas, file.type || "image/png"));
      setFilename(file.name.replace(/\.[^.]+$/, "") || "inverted-image");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to invert the selected image.");
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload an image to invert</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Invert every visible color channel and download the negative-style result directly in the browser.
            </p>
          </div>
          <div className="flex gap-3">
            <FilePicker label="Image file" onFile={handleFile} />
            {result ? (
              <button
                type="button"
                onClick={() => downloadDataUrl(result, `${filename}-inverted.${inferImageExtension(result)}`)}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                Download image
              </button>
            ) : null}
          </div>
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
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Inverted result</h2>
            <PreviewImage src={result} alt="Image with inverted colors" />
          </ImageCard>
        </div>
      ) : null}
    </div>
  );
}
