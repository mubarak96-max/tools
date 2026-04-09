"use client";

import { useEffect, useState } from "react";

import { FilesPicker, ImageCard, ImageField, ImageInput, PreviewImage } from "@/components/image/shared";
import { canvasToDataUrl, downloadDataUrl, inferImageExtension, loadImageElement, readFileAsDataUrl } from "@/lib/tools/image-utils";

type UploadedImage = {
  name: string;
  src: string;
  width: number;
  height: number;
};

export default function OnlineCollageMakerTool() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [columns, setColumns] = useState(2);
  const [gap, setGap] = useState(16);
  const [padding, setPadding] = useState(20);
  const [background, setBackground] = useState("#ffffff");

  useEffect(() => {
    async function renderCollage() {
      if (!images.length) {
        return;
      }

      try {
        const loaded = await Promise.all(images.map((image) => loadImageElement(image.src)));
        const cellWidth = Math.max(...loaded.map((image) => image.width));
        const cellHeight = Math.max(...loaded.map((image) => image.height));
        const rows = Math.ceil(loaded.length / columns);
        const canvas = document.createElement("canvas");
        canvas.width = padding * 2 + columns * cellWidth + (columns - 1) * gap;
        canvas.height = padding * 2 + rows * cellHeight + (rows - 1) * gap;
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Unable to prepare the image canvas.");
        }

        context.fillStyle = background;
        context.fillRect(0, 0, canvas.width, canvas.height);

        loaded.forEach((image, index) => {
          const column = index % columns;
          const row = Math.floor(index / columns);
          const cellX = padding + column * (cellWidth + gap);
          const cellY = padding + row * (cellHeight + gap);
          const x = cellX + (cellWidth - image.width) / 2;
          const y = cellY + (cellHeight - image.height) / 2;
          context.drawImage(image, x, y);
        });

        setResult(canvasToDataUrl(canvas));
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to build the collage.");
      }
    }

    void renderCollage();
  }, [background, columns, gap, images, padding]);

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
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload images to create a collage</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Arrange a set of images into a simple grid layout, then download the finished collage as one file.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <FilesPicker label="Collage images" onFiles={(fileList) => void handleFiles(fileList)} />
            {result ? (
              <button
                type="button"
                onClick={() => downloadDataUrl(result, `collage-image.${inferImageExtension(result)}`)}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                Download collage
              </button>
            ) : null}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </ImageCard>

      {images.length ? (
        <>
          <ImageCard>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <ImageField label="Columns">
                <ImageInput type="number" min={1} max={6} step={1} value={columns} onChange={(event) => setColumns(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Gap (px)">
                <ImageInput type="number" min={0} max={120} step={1} value={gap} onChange={(event) => setGap(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Padding (px)">
                <ImageInput type="number" min={0} max={120} step={1} value={padding} onChange={(event) => setPadding(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Background color">
                <ImageInput type="color" value={background} onChange={(event) => setBackground(event.target.value)} className="h-12 p-2" />
              </ImageField>
            </div>
          </ImageCard>

          <ImageCard>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Selected images</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {images.map((image) => (
                <article key={image.src} className="rounded-[1.25rem] border border-border bg-background p-4">
                  <PreviewImage src={image.src} alt={image.name} />
                  <p className="mt-3 text-sm text-muted-foreground">{image.name} - {image.width} x {image.height}px</p>
                </article>
              ))}
            </div>
          </ImageCard>

          {result ? (
            <ImageCard>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Collage result</h2>
              <PreviewImage src={result} alt="Collage image result" />
            </ImageCard>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
