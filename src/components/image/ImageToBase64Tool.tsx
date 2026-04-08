"use client";

import { useState } from "react";

import { CopyButton, FilePicker, ImageCard, PreviewImage } from "@/components/image/shared";
import { dataUrlToBase64, readFileAsDataUrl } from "@/lib/tools/image-utils";

export default function ImageToBase64Tool() {
  const [preview, setPreview] = useState("");
  const [base64, setBase64] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");
  const [filename, setFilename] = useState("");

  async function handleFile(file: File) {
    setError("");
    setFilename(file.name);
    try {
      const nextDataUrl = await readFileAsDataUrl(file);
      setPreview(nextDataUrl);
      setDataUrl(nextDataUrl);
      setBase64(dataUrlToBase64(nextDataUrl));
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to convert the selected image.");
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload an image</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Convert a local image into a raw Base64 string or a full data URL without sending it to a server.
            </p>
          </div>
          <FilePicker label="Image file" onFile={handleFile} />
        </div>
        {filename ? <p className="mt-4 text-sm text-muted-foreground">Selected: {filename}</p> : null}
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </ImageCard>

      {preview ? (
        <>
          <ImageCard>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Preview</h2>
            <PreviewImage src={preview} alt="Uploaded source preview" />
          </ImageCard>

          <ImageCard>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Base64 output</h2>
              <CopyButton value={base64} label="Copy Base64" />
            </div>
            <textarea
              readOnly
              value={base64}
              className="min-h-[220px] w-full rounded-[1.5rem] border border-border bg-background px-4 py-3 font-mono text-sm text-foreground"
            />
          </ImageCard>

          <ImageCard>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Data URL</h2>
              <CopyButton value={dataUrl} label="Copy data URL" />
            </div>
            <textarea
              readOnly
              value={dataUrl}
              className="min-h-[220px] w-full rounded-[1.5rem] border border-border bg-background px-4 py-3 font-mono text-sm text-foreground"
            />
          </ImageCard>
        </>
      ) : null}
    </div>
  );
}
