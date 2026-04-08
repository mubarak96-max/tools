"use client";

import { useEffect, useState } from "react";

import { FilePicker, ImageCard, ImageField, ImageInput, PreviewImage } from "@/components/image/shared";
import { canvasToDataUrl, downloadDataUrl, inferImageExtension, loadImageElement, readFileAsDataUrl } from "@/lib/tools/image-utils";

type ImagePiece = {
  label: string;
  dataUrl: string;
};

export default function SplitImagesOnlineTool() {
  const [source, setSource] = useState("");
  const [pieces, setPieces] = useState<ImagePiece[]>([]);
  const [filename, setFilename] = useState("split-image");
  const [error, setError] = useState("");
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    async function splitImage() {
      if (!source) {
        return;
      }

      try {
        const image = await loadImageElement(source);
        const nextPieces: ImagePiece[] = [];

        for (let row = 0; row < rows; row += 1) {
          for (let column = 0; column < columns; column += 1) {
            const startX = Math.round((column * image.width) / columns);
            const endX = Math.round(((column + 1) * image.width) / columns);
            const startY = Math.round((row * image.height) / rows);
            const endY = Math.round(((row + 1) * image.height) / rows);
            const width = Math.max(1, endX - startX);
            const height = Math.max(1, endY - startY);
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext("2d");

            if (!context) {
              throw new Error("Unable to prepare the image canvas.");
            }

            context.drawImage(image, startX, startY, width, height, 0, 0, width, height);
            nextPieces.push({
              label: `Row ${row + 1}, Column ${column + 1}`,
              dataUrl: canvasToDataUrl(canvas),
            });
          }
        }

        setPieces(nextPieces);
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to split the selected image.");
      }
    }

    void splitImage();
  }, [columns, rows, source]);

  async function handleFile(file: File) {
    setError("");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSource(dataUrl);
      setFilename(file.name.replace(/\.[^.]+$/, "") || "split-image");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to load the selected image.");
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload an image to split into pieces</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Choose the number of rows and columns, then download the resulting image slices one by one.
            </p>
          </div>
          <FilePicker label="Image file" onFile={handleFile} />
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </ImageCard>

      {source ? (
        <>
          <ImageCard>
            <div className="grid gap-4 md:grid-cols-2">
              <ImageField label="Rows">
                <ImageInput type="number" min={1} max={12} step={1} value={rows} onChange={(event) => setRows(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Columns">
                <ImageInput type="number" min={1} max={12} step={1} value={columns} onChange={(event) => setColumns(Number(event.target.value))} />
              </ImageField>
            </div>
          </ImageCard>

          <ImageCard>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Original</h2>
            <PreviewImage src={source} alt="Original uploaded image" />
          </ImageCard>

          {pieces.length ? (
            <ImageCard>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Split pieces</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {pieces.map((piece, index) => (
                  <article key={piece.label} className="rounded-[1.25rem] border border-border bg-background p-4">
                    <PreviewImage src={piece.dataUrl} alt={piece.label} />
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{piece.label}</h3>
                        <p className="text-xs text-muted-foreground">Piece {index + 1}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => downloadDataUrl(piece.dataUrl, `${filename}-r${Math.floor(index / columns) + 1}-c${(index % columns) + 1}.${inferImageExtension(piece.dataUrl)}`)}
                        className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
                      >
                        Download
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </ImageCard>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
