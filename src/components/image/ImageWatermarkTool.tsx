"use client";

import { useEffect, useState } from "react";

import { FilePicker, ImageCard, ImageField, ImageInput, ImageSelect, PreviewImage } from "@/components/image/shared";
import { canvasToDataUrl, downloadDataUrl, inferImageExtension, loadImageElement, readFileAsDataUrl } from "@/lib/tools/image-utils";

export default function ImageWatermarkTool() {
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [filename, setFilename] = useState("watermarked-image");
  const [error, setError] = useState("");
  const [text, setText] = useState("© Your Brand");
  const [position, setPosition] = useState("bottom-right");
  const [opacity, setOpacity] = useState(0.35);
  const [fontSize, setFontSize] = useState(36);
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    async function renderWatermark() {
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
        context.globalAlpha = opacity;
        context.fillStyle = color;
        context.font = `700 ${fontSize}px sans-serif`;
        context.textBaseline = "top";
        const metrics = context.measureText(text);
        const padding = 24;

        let x = padding;
        let y = padding;

        if (position.includes("right")) {
          x = canvas.width - metrics.width - padding;
        } else if (position === "center") {
          x = (canvas.width - metrics.width) / 2;
        }

        if (position.includes("bottom")) {
          y = canvas.height - fontSize - padding;
        } else if (position === "center") {
          y = (canvas.height - fontSize) / 2;
        }

        context.fillText(text, x, y);
        setResult(canvasToDataUrl(canvas));
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to watermark the selected image.");
      }
    }

    void renderWatermark();
  }, [color, fontSize, opacity, position, source, text]);

  async function handleFile(file: File) {
    setError("");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSource(dataUrl);
      setFilename(file.name.replace(/\.[^.]+$/, "") || "watermarked-image");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to load the selected image.");
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="mb-6 text-center">
          
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Upload an image to watermark</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Add a text watermark, adjust position and opacity, preview the result, and download the updated image.
            </p>
          
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <FilePicker label="Image file" onFile={handleFile} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full">
          {result ? (
              <button
                type="button"
                onClick={() => downloadDataUrl(result, `${filename}-watermarked.${inferImageExtension(result)}`)}
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
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <ImageField label="Watermark text">
                <ImageInput value={text} onChange={(event) => setText(event.target.value)} />
              </ImageField>
              <ImageField label="Position">
                <ImageSelect value={position} onChange={(event) => setPosition(event.target.value)}>
                  <option value="top-left">Top left</option>
                  <option value="top-right">Top right</option>
                  <option value="bottom-left">Bottom left</option>
                  <option value="bottom-right">Bottom right</option>
                  <option value="center">Center</option>
                </ImageSelect>
              </ImageField>
              <ImageField label="Opacity">
                <ImageInput type="number" min={0.05} max={1} step={0.05} value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Font size">
                <ImageInput type="number" min={12} max={200} step={1} value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} />
              </ImageField>
            </div>
            <div className="mt-4 max-w-xs">
              <ImageField label="Text color">
                <ImageInput type="color" value={color} onChange={(event) => setColor(event.target.value)} className="h-12 p-2" />
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
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Watermarked result</h2>
                <PreviewImage src={result} alt="Watermarked image result" />
              </ImageCard>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
