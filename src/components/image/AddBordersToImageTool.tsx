"use client";

import { useEffect, useState } from "react";

import { FilePicker, ImageCard, ImageField, ImageInput, PreviewImage } from "@/components/image/shared";
import { canvasToDataUrl, downloadDataUrl, inferImageExtension, loadImageElement, readFileAsDataUrl } from "@/lib/tools/image-utils";

export default function AddBordersToImageTool() {
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [filename, setFilename] = useState("bordered-image");
  const [error, setError] = useState("");
  const [borderSize, setBorderSize] = useState(24);
  const [borderColor, setBorderColor] = useState("#111827");

  useEffect(() => {
    async function renderBorder() {
      if (!source) {
        return;
      }

      try {
        const image = await loadImageElement(source);
        const canvas = document.createElement("canvas");
        canvas.width = image.width + borderSize * 2;
        canvas.height = image.height + borderSize * 2;
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Unable to prepare the image canvas.");
        }

        context.fillStyle = borderColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, borderSize, borderSize);
        setResult(canvasToDataUrl(canvas));
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to add a border to the selected image.");
      }
    }

    void renderBorder();
  }, [borderColor, borderSize, source]);

  async function handleFile(file: File) {
    setError("");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSource(dataUrl);
      setFilename(file.name.replace(/\.[^.]+$/, "") || "bordered-image");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to load the selected image.");
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="mb-6 text-center">
          
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Upload an image to add a border</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Add a solid frame around screenshots, product images, or social assets without opening a heavier editor.
            </p>
          
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <FilePicker label="Image file" onFile={handleFile} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full">
          {result ? (
              <button
                type="button"
                onClick={() => downloadDataUrl(result, `${filename}-bordered.${inferImageExtension(result)}`)}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                Download image
              </button>
            ) : null}
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </ImageCard>

      {source ? (
        <>
          <ImageCard>
            <div className="grid gap-4 md:grid-cols-2">
              <ImageField label="Border size (px)">
                <ImageInput
                  type="number"
                  min={0}
                  max={300}
                  step={1}
                  value={borderSize}
                  onChange={(event) => setBorderSize(Number(event.target.value))}
                />
              </ImageField>
              <ImageField label="Border color">
                <ImageInput
                  type="color"
                  value={borderColor}
                  onChange={(event) => setBorderColor(event.target.value)}
                  className="h-12 p-2"
                />
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
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Bordered result</h2>
                <PreviewImage src={result} alt="Image with a new border" />
              </ImageCard>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
