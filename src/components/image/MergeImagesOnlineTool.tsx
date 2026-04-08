"use client";

import { useEffect, useRef, useState } from "react";

import { ImageCard, ImageField, ImageInput, ImageSelect, PreviewImage } from "@/components/image/shared";
import { canvasToDataUrl, downloadDataUrl, inferImageExtension, loadImageElement, readFileAsDataUrl } from "@/lib/tools/image-utils";

type UploadedImage = {
  name: string;
  src: string;
  width: number;
  height: number;
};

export default function MergeImagesOnlineTool() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [direction, setDirection] = useState<"horizontal" | "vertical">("horizontal");
  const [gap, setGap] = useState(16);
  const [background, setBackground] = useState("#ffffff");

  useEffect(() => {
    async function mergeImages() {
      if (!images.length) {
        return;
      }

      try {
        const loaded = await Promise.all(images.map((image) => loadImageElement(image.src)));
        const canvas = document.createElement("canvas");

        if (direction === "horizontal") {
          canvas.width = loaded.reduce((sum, image) => sum + image.width, 0) + gap * Math.max(0, loaded.length - 1);
          canvas.height = Math.max(...loaded.map((image) => image.height));
        } else {
          canvas.width = Math.max(...loaded.map((image) => image.width));
          canvas.height = loaded.reduce((sum, image) => sum + image.height, 0) + gap * Math.max(0, loaded.length - 1);
        }

        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Unable to prepare the image canvas.");
        }

        context.fillStyle = background;
        context.fillRect(0, 0, canvas.width, canvas.height);

        let offset = 0;
        loaded.forEach((image) => {
          if (direction === "horizontal") {
            const y = (canvas.height - image.height) / 2;
            context.drawImage(image, offset, y);
            offset += image.width + gap;
          } else {
            const x = (canvas.width - image.width) / 2;
            context.drawImage(image, x, offset);
            offset += image.height + gap;
          }
        });

        setResult(canvasToDataUrl(canvas));
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to merge the selected images.");
      }
    }

    void mergeImages();
  }, [background, direction, gap, images]);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) {
      return;
    }

    setError("");

    try {
      const nextImages = await Promise.all(
        Array.from(fileList).map(async (file) => {
          const src = await readFileAsDataUrl(file);
          const image = await loadImageElement(src);
          return {
            name: file.name.replace(/\.[^.]+$/, "") || "image",
            src,
            width: image.width,
            height: image.height,
          };
        }),
      );

      setImages(nextImages);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to load the selected images.");
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload multiple images to merge</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Combine several images into one horizontal or vertical file with gap and background controls.
            </p>
          </div>
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => void handleFiles(event.target.files)}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
            >
              Choose images
            </button>
            {result ? (
              <button
                type="button"
                onClick={() => downloadDataUrl(result, `merged-image.${inferImageExtension(result)}`)}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                Download image
              </button>
            ) : null}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </ImageCard>

      {images.length ? (
        <>
          <ImageCard>
            <div className="grid gap-4 md:grid-cols-3">
              <ImageField label="Direction">
                <ImageSelect value={direction} onChange={(event) => setDirection(event.target.value as "horizontal" | "vertical")}>
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                </ImageSelect>
              </ImageField>
              <ImageField label="Gap (px)">
                <ImageInput type="number" min={0} max={200} step={1} value={gap} onChange={(event) => setGap(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Background color">
                <ImageInput type="color" value={background} onChange={(event) => setBackground(event.target.value)} className="h-12 p-2" />
              </ImageField>
            </div>
          </ImageCard>

          <ImageCard>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Selected images</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {images.map((image) => (
                <article key={image.src} className="rounded-[1.25rem] border border-border bg-background p-4">
                  <PreviewImage src={image.src} alt={image.name} />
                  <p className="mt-3 text-sm text-muted-foreground">
                    {image.name} · {image.width} x {image.height}px
                  </p>
                </article>
              ))}
            </div>
          </ImageCard>

          {result ? (
            <ImageCard>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Merged result</h2>
              <PreviewImage src={result} alt="Merged image result" />
            </ImageCard>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
