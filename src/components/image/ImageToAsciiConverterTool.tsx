"use client";

import { useEffect, useState } from "react";

import { CopyButton, FilePicker, ImageCard, ImageField, ImageInput, ImageSelect, PreviewImage } from "@/components/image/shared";
import { loadImageElement, readFileAsDataUrl } from "@/lib/tools/image-utils";

const CHARSETS = {
  detailed: "@%#*+=-:. ",
  simple: "@#S%?*+;:,. ",
  blocks: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
} as const;

export default function ImageToAsciiConverterTool() {
  const [source, setSource] = useState("");
  const [ascii, setAscii] = useState("");
  const [error, setError] = useState("");
  const [outputWidth, setOutputWidth] = useState(90);
  const [charset, setCharset] = useState<keyof typeof CHARSETS>("detailed");
  const [invert, setInvert] = useState(false);

  useEffect(() => {
    async function renderAscii() {
      if (!source) {
        return;
      }

      try {
        const image = await loadImageElement(source);
        const width = Math.max(12, outputWidth);
        const height = Math.max(8, Math.round((image.height / image.width) * width * 0.55));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Unable to prepare the image canvas.");
        }

        context.drawImage(image, 0, 0, width, height);
        const { data } = context.getImageData(0, 0, width, height);
        const sourceChars = CHARSETS[charset];
        const chars = invert ? sourceChars.split("").reverse().join("") : sourceChars;
        const rows: string[] = [];

        for (let y = 0; y < height; y += 1) {
          let row = "";

          for (let x = 0; x < width; x += 1) {
            const index = (y * width + x) * 4;
            const brightness = (data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114) / 255;
            const charIndex = Math.min(chars.length - 1, Math.floor(brightness * (chars.length - 1)));
            row += chars[charIndex] ?? " ";
          }

          rows.push(row);
        }

        setAscii(rows.join("\n"));
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to convert the selected image into ASCII.");
      }
    }

    void renderAscii();
  }, [charset, invert, outputWidth, source]);

  async function handleFile(file: File) {
    setError("");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSource(dataUrl);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to load the selected image.");
    }
  }

  function downloadAscii() {
    const blob = new Blob([ascii], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "ascii-art.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload an image to turn it into ASCII</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Convert image brightness into characters, then copy or download the plain-text ASCII output.
            </p>
          </div>
          <FilePicker label="Image file" onFile={handleFile} />
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </ImageCard>

      {source ? (
        <>
          <ImageCard>
            <div className="grid gap-4 md:grid-cols-3">
              <ImageField label="Output width (chars)">
                <ImageInput type="number" min={20} max={180} step={1} value={outputWidth} onChange={(event) => setOutputWidth(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Character set">
                <ImageSelect value={charset} onChange={(event) => setCharset(event.target.value as keyof typeof CHARSETS)}>
                  <option value="detailed">Detailed</option>
                  <option value="simple">Simple</option>
                  <option value="blocks">Dense blocks</option>
                </ImageSelect>
              </ImageField>
              <label className="flex items-center gap-3 pt-8 text-sm text-muted-foreground">
                <input type="checkbox" checked={invert} onChange={(event) => setInvert(event.target.checked)} />
                Invert brightness mapping
              </label>
            </div>
          </ImageCard>

          <div className="grid gap-6 xl:grid-cols-2">
            <ImageCard>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Original</h2>
              <PreviewImage src={source} alt="Original uploaded image" />
            </ImageCard>
            <ImageCard>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">ASCII output</h2>
                <div className="flex gap-2">
                  <CopyButton value={ascii} label="Copy text" />
                  {ascii ? (
                    <button
                      type="button"
                      onClick={downloadAscii}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
                    >
                      Download TXT
                    </button>
                  ) : null}
                </div>
              </div>
              <pre className="max-h-[480px] overflow-auto rounded-[1.25rem] border border-border bg-background p-4 text-[10px] leading-3 text-foreground sm:text-[11px] sm:leading-4">
                {ascii || "ASCII output will appear here after you upload an image."}
              </pre>
            </ImageCard>
          </div>
        </>
      ) : null}
    </div>
  );
}
