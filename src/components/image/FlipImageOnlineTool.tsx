"use client";

import { useEffect, useState } from "react";

import { FilePicker, ImageCard, PreviewImage } from "@/components/image/shared";
import { canvasToDataUrl, downloadDataUrl, inferImageExtension, loadImageElement, readFileAsDataUrl } from "@/lib/tools/image-utils";

export default function FlipImageOnlineTool() {
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [filename, setFilename] = useState("flipped-image");
  const [flipHorizontal, setFlipHorizontal] = useState(true);
  const [flipVertical, setFlipVertical] = useState(false);

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

        context.save();
        context.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
        context.drawImage(
          image,
          flipHorizontal ? -image.width : 0,
          flipVertical ? -image.height : 0,
          image.width,
          image.height,
        );
        context.restore();

        setResult(canvasToDataUrl(canvas));
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to flip the selected image.");
      }
    }

    void render();
  }, [source, flipHorizontal, flipVertical]);

  async function handleFile(file: File) {
    setError("");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSource(dataUrl);
      setFilename(file.name.replace(/\.[^.]+$/, "") || "flipped-image");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to load the selected image.");
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="mb-6 text-center">
          
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Upload an image to flip</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Mirror the image horizontally, vertically, or both, then download the result without leaving the browser.
            </p>
          
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <FilePicker label="Image file" onFile={handleFile} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={flipHorizontal} onChange={(event) => setFlipHorizontal(event.target.checked)} />
              Horizontal flip
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={flipVertical} onChange={(event) => setFlipVertical(event.target.checked)} />
              Vertical flip
            </label>
            {result ? (
              <button
                type="button"
                onClick={() => downloadDataUrl(result, `${filename}-flipped.${inferImageExtension(result)}`)}
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
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Flipped result</h2>
            <PreviewImage src={result} alt="Flipped image result" />
          </ImageCard>
        </div>
      ) : null}
    </div>
  );
}
