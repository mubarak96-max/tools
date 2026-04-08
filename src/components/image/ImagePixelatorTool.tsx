"use client";

import { useEffect, useState } from "react";

import { FilePicker, ImageCard, ImageField, ImageInput, PreviewImage } from "@/components/image/shared";
import { canvasToDataUrl, downloadDataUrl, inferImageExtension, loadImageElement, readFileAsDataUrl } from "@/lib/tools/image-utils";

export default function ImagePixelatorTool() {
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [filename, setFilename] = useState("pixelated-image");
  const [error, setError] = useState("");
  const [blockSize, setBlockSize] = useState(14);

  useEffect(() => {
    async function renderPixelated() {
      if (!source) {
        return;
      }

      try {
        const image = await loadImageElement(source);
        const target = document.createElement("canvas");
        target.width = image.width;
        target.height = image.height;
        const targetContext = target.getContext("2d");

        if (!targetContext) {
          throw new Error("Unable to prepare the image canvas.");
        }

        const scaledWidth = Math.max(1, Math.floor(image.width / blockSize));
        const scaledHeight = Math.max(1, Math.floor(image.height / blockSize));
        const temp = document.createElement("canvas");
        temp.width = scaledWidth;
        temp.height = scaledHeight;
        const tempContext = temp.getContext("2d");

        if (!tempContext) {
          throw new Error("Unable to prepare the image canvas.");
        }

        tempContext.drawImage(image, 0, 0, scaledWidth, scaledHeight);
        targetContext.imageSmoothingEnabled = false;
        targetContext.drawImage(temp, 0, 0, scaledWidth, scaledHeight, 0, 0, image.width, image.height);
        setResult(canvasToDataUrl(target));
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to pixelate the selected image.");
      }
    }

    void renderPixelated();
  }, [blockSize, source]);

  async function handleFile(file: File) {
    setError("");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSource(dataUrl);
      setFilename(file.name.replace(/\.[^.]+$/, "") || "pixelated-image");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to load the selected image.");
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload an image to pixelate</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Increase the block size until the image reaches the retro or censored look you want.
            </p>
          </div>
          <div className="flex gap-3">
            <FilePicker label="Image file" onFile={handleFile} />
            {result ? (
              <button
                type="button"
                onClick={() => downloadDataUrl(result, `${filename}-pixelated.${inferImageExtension(result)}`)}
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
            <div className="max-w-xs">
              <ImageField label="Pixel size">
                <ImageInput type="number" min={2} max={80} step={1} value={blockSize} onChange={(event) => setBlockSize(Number(event.target.value))} />
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
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Pixelated result</h2>
                <PreviewImage src={result} alt="Pixelated image result" />
              </ImageCard>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
