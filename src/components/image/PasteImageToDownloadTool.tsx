"use client";

import { useEffect, useState } from "react";

import { ImageCard, PreviewImage } from "@/components/image/shared";
import { downloadDataUrl, inferImageExtension, readFileAsDataUrl } from "@/lib/tools/image-utils";

export default function PasteImageToDownloadTool() {
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function handlePaste(event: ClipboardEvent) {
      const items = Array.from(event.clipboardData?.items ?? []);
      const imageItem = items.find((item) => item.type.startsWith("image/"));

      if (!imageItem) {
        return;
      }

      const file = imageItem.getAsFile();
      if (!file) {
        return;
      }

      setError("");
      const dataUrl = await readFileAsDataUrl(file);
      setImage(dataUrl);
    }

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <div className="space-y-6">
      <ImageCard>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Paste an image from your clipboard</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Click anywhere on the page and press Ctrl+V or Cmd+V after copying an image. The pasted image will appear here and can be downloaded immediately.
        </p>
        {image ? (
          <button
            type="button"
            onClick={() => downloadDataUrl(image, `pasted-image.${inferImageExtension(image)}`)}
            className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Download image
          </button>
        ) : null}
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </ImageCard>

      {image ? (
        <ImageCard>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Pasted image</h2>
          <PreviewImage src={image} alt="Pasted clipboard image" />
        </ImageCard>
      ) : (
        <ImageCard>
          <div className="rounded-[1.5rem] border border-dashed border-border bg-slate-50 p-10 text-center">
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Clipboard ready</p>
            <p className="mt-3 text-base leading-7 text-foreground">
              Copy an image, return here, and paste it to turn the clipboard image into a downloadable file.
            </p>
          </div>
        </ImageCard>
      )}
    </div>
  );
}
