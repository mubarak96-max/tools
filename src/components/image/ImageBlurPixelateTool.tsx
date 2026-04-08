"use client";

import { useEffect, useState } from "react";

import { FilePicker, ImageCard, ImageField, ImageInput, PreviewImage } from "@/components/image/shared";
import { canvasToDataUrl, downloadDataUrl, inferImageExtension, loadImageElement, readFileAsDataUrl } from "@/lib/tools/image-utils";

export default function ImageBlurPixelateTool() {
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [filename, setFilename] = useState("blurred-image");
  const [error, setError] = useState("");
  const [blur, setBlur] = useState(8);
  const [pixelSize, setPixelSize] = useState(1);

  useEffect(() => {
    async function render() {
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

        if (pixelSize > 1) {
          const temp = document.createElement("canvas");
          temp.width = Math.max(1, Math.floor(image.width / pixelSize));
          temp.height = Math.max(1, Math.floor(image.height / pixelSize));
          const tempContext = temp.getContext("2d");

          if (!tempContext) {
            throw new Error("Unable to prepare the image canvas.");
          }

          tempContext.drawImage(image, 0, 0, temp.width, temp.height);
          context.imageSmoothingEnabled = false;
          context.drawImage(temp, 0, 0, temp.width, temp.height, 0, 0, image.width, image.height);
        } else {
          context.drawImage(image, 0, 0);
        }

        if (blur > 0) {
          const blurredCanvas = document.createElement("canvas");
          blurredCanvas.width = image.width;
          blurredCanvas.height = image.height;
          const blurredContext = blurredCanvas.getContext("2d");

          if (!blurredContext) {
            throw new Error("Unable to prepare the image canvas.");
          }

          blurredContext.filter = `blur(${blur}px)`;
          blurredContext.drawImage(canvas, 0, 0);
          setResult(canvasToDataUrl(blurredCanvas));
        } else {
          setResult(canvasToDataUrl(canvas));
        }
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to process the selected image.");
      }
    }

    void render();
  }, [blur, pixelSize, source]);

  async function handleFile(file: File) {
    setError("");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSource(dataUrl);
      setFilename(file.name.replace(/\.[^.]+$/, "") || "blurred-image");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to load the selected image.");
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload an image to blur or pixelate</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use blur, pixelation, or both on the same page, then preview and download the finished result.
            </p>
          </div>
          <div className="flex gap-3">
            <FilePicker label="Image file" onFile={handleFile} />
            {result ? (
              <button
                type="button"
                onClick={() => downloadDataUrl(result, `${filename}-edited.${inferImageExtension(result)}`)}
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
            <div className="grid gap-4 md:grid-cols-2">
              <ImageField label="Blur radius">
                <ImageInput type="number" min={0} max={40} step={1} value={blur} onChange={(event) => setBlur(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Pixel size">
                <ImageInput type="number" min={1} max={80} step={1} value={pixelSize} onChange={(event) => setPixelSize(Number(event.target.value))} />
              </ImageField>
            </div>
          </ImageCard>

          <div className="grid gap-6 xl:grid-cols-2">
            <ImageCard>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Original</h2>
              <PreviewImage src={source} alt="Original uploaded image" />
            </ImageCard>
            {result ? (
              <ImageCard>
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Processed result</h2>
                <PreviewImage src={result} alt="Blurred or pixelated image result" />
              </ImageCard>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
