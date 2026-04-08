"use client";

import { useMemo, useState } from "react";

import { FilePicker, ImageCard, ImageField, ImageInput, PreviewImage } from "@/components/image/shared";
import { canvasToDataUrl, downloadDataUrl, inferImageExtension, loadImageElement, readFileAsDataUrl } from "@/lib/tools/image-utils";

export default function ImageCropperResizerTool() {
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [filename, setFilename] = useState("cropped-image");
  const [sourceSize, setSourceSize] = useState({ width: 0, height: 0 });
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(0);
  const [cropHeight, setCropHeight] = useState(0);
  const [outputWidth, setOutputWidth] = useState(0);
  const [outputHeight, setOutputHeight] = useState(0);

  const canRender = useMemo(() => {
    return source && cropWidth > 0 && cropHeight > 0 && outputWidth > 0 && outputHeight > 0;
  }, [cropHeight, cropWidth, outputHeight, outputWidth, source]);

  async function handleFile(file: File) {
    setError("");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const image = await loadImageElement(dataUrl);
      setSource(dataUrl);
      setFilename(file.name.replace(/\.[^.]+$/, "") || "cropped-image");
      setSourceSize({ width: image.width, height: image.height });
      setCropX(0);
      setCropY(0);
      setCropWidth(image.width);
      setCropHeight(image.height);
      setOutputWidth(image.width);
      setOutputHeight(image.height);
      setResult("");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to load the selected image.");
    }
  }

  async function renderResult() {
    if (!canRender) {
      return;
    }

    try {
      const image = await loadImageElement(source);
      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Unable to prepare the image canvas.");
      }

      const safeWidth = Math.max(1, Math.min(cropWidth, sourceSize.width - cropX));
      const safeHeight = Math.max(1, Math.min(cropHeight, sourceSize.height - cropY));

      context.drawImage(
        image,
        cropX,
        cropY,
        safeWidth,
        safeHeight,
        0,
        0,
        outputWidth,
        outputHeight,
      );

      setResult(canvasToDataUrl(canvas));
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to crop and resize the image.");
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload an image to crop and resize</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Select the crop region, choose the final output dimensions, and generate a new file entirely in the browser.
            </p>
          </div>
          <div className="flex gap-3">
            <FilePicker label="Image file" onFile={handleFile} />
            {result ? (
              <button
                type="button"
                onClick={() => downloadDataUrl(result, `${filename}-cropped.${inferImageExtension(result)}`)}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                Download image
              </button>
            ) : null}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
        {sourceSize.width > 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Source size: {sourceSize.width} x {sourceSize.height}px
          </p>
        ) : null}
      </ImageCard>

      {source ? (
        <>
          <ImageCard>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Crop and output settings</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <ImageField label="Crop X">
                <ImageInput type="number" min={0} max={Math.max(0, sourceSize.width - 1)} value={cropX} onChange={(event) => setCropX(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Crop Y">
                <ImageInput type="number" min={0} max={Math.max(0, sourceSize.height - 1)} value={cropY} onChange={(event) => setCropY(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Crop width">
                <ImageInput type="number" min={1} max={sourceSize.width} value={cropWidth} onChange={(event) => setCropWidth(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Crop height">
                <ImageInput type="number" min={1} max={sourceSize.height} value={cropHeight} onChange={(event) => setCropHeight(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Output width">
                <ImageInput type="number" min={1} value={outputWidth} onChange={(event) => setOutputWidth(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Output height">
                <ImageInput type="number" min={1} value={outputHeight} onChange={(event) => setOutputHeight(Number(event.target.value))} />
              </ImageField>
            </div>
            <button
              type="button"
              onClick={() => void renderResult()}
              className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              Render cropped image
            </button>
          </ImageCard>

          <div className="grid gap-6 xl:grid-cols-2">
            <ImageCard>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Original</h2>
              <PreviewImage src={source} alt="Original uploaded image" />
            </ImageCard>
            {result ? (
              <ImageCard>
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Cropped and resized result</h2>
                <PreviewImage src={result} alt="Cropped and resized image result" />
              </ImageCard>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
