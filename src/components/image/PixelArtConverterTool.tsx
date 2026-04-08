"use client";

import { useEffect, useState } from "react";

import { FilePicker, ImageCard, ImageField, ImageInput, PreviewImage } from "@/components/image/shared";
import { canvasToDataUrl, downloadDataUrl, inferImageExtension, loadImageElement, readFileAsDataUrl } from "@/lib/tools/image-utils";

export default function PixelArtConverterTool() {
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [filename, setFilename] = useState("pixel-art");
  const [error, setError] = useState("");
  const [blockSize, setBlockSize] = useState(12);
  const [colorLevels, setColorLevels] = useState(6);

  useEffect(() => {
    async function renderPixelArt() {
      if (!source) {
        return;
      }

      try {
        const image = await loadImageElement(source);
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
        const imageData = tempContext.getImageData(0, 0, scaledWidth, scaledHeight);
        const step = colorLevels > 1 ? 255 / (colorLevels - 1) : 255;

        for (let index = 0; index < imageData.data.length; index += 4) {
          imageData.data[index] = Math.round(imageData.data[index] / step) * step;
          imageData.data[index + 1] = Math.round(imageData.data[index + 1] / step) * step;
          imageData.data[index + 2] = Math.round(imageData.data[index + 2] / step) * step;
        }

        tempContext.putImageData(imageData, 0, 0);

        const output = document.createElement("canvas");
        output.width = image.width;
        output.height = image.height;
        const outputContext = output.getContext("2d");

        if (!outputContext) {
          throw new Error("Unable to prepare the image canvas.");
        }

        outputContext.imageSmoothingEnabled = false;
        outputContext.drawImage(temp, 0, 0, scaledWidth, scaledHeight, 0, 0, image.width, image.height);
        setResult(canvasToDataUrl(output));
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to convert the selected image into pixel art.");
      }
    }

    void renderPixelArt();
  }, [blockSize, colorLevels, source]);

  async function handleFile(file: File) {
    setError("");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSource(dataUrl);
      setFilename(file.name.replace(/\.[^.]+$/, "") || "pixel-art");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to load the selected image.");
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload an image to convert into pixel art</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Increase the pixel block size, simplify the colors, and download a more retro-style version of the image.
            </p>
          </div>
          <div className="flex gap-3">
            <FilePicker label="Image file" onFile={handleFile} />
            {result ? (
              <button
                type="button"
                onClick={() => downloadDataUrl(result, `${filename}-pixel-art.${inferImageExtension(result)}`)}
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
              <ImageField label="Pixel block size">
                <ImageInput type="number" min={2} max={80} step={1} value={blockSize} onChange={(event) => setBlockSize(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Color levels">
                <ImageInput type="number" min={2} max={16} step={1} value={colorLevels} onChange={(event) => setColorLevels(Number(event.target.value))} />
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
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Pixel-art result</h2>
                <PreviewImage src={result} alt="Image converted into pixel art" />
              </ImageCard>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
