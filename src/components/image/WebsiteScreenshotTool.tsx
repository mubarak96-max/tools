"use client";

import { useState } from "react";

import { ImageCard, ImageField, ImageInput, PreviewImage } from "@/components/image/shared";
import { downloadDataUrl, inferImageExtension } from "@/lib/tools/image-utils";

export default function WebsiteScreenshotTool() {
  const [url, setUrl] = useState("");
  const [width, setWidth] = useState(1440);
  const [height, setHeight] = useState(960);
  const [fullPage, setFullPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  async function handleCapture() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/website-screenshot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          width,
          height,
          fullPage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to capture the website screenshot.");
      }

      setResult(data.dataUrl || "");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to capture the website screenshot.");
      setResult("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Capture a website screenshot</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Enter a URL, choose the browser viewport, and generate a downloadable screenshot of the rendered page.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ImageField label="Website URL">
              <ImageInput type="url" placeholder="https://example.com" value={url} onChange={(event) => setUrl(event.target.value)} />
            </ImageField>
            <ImageField label="Viewport width">
              <ImageInput type="number" min={320} max={2560} step={10} value={width} onChange={(event) => setWidth(Number(event.target.value))} />
            </ImageField>
            <ImageField label="Viewport height">
              <ImageInput type="number" min={320} max={4000} step={10} value={height} onChange={(event) => setHeight(Number(event.target.value))} />
            </ImageField>
            <label className="flex items-center gap-3 pt-8 text-sm text-muted-foreground">
              <input type="checkbox" checked={fullPage} onChange={(event) => setFullPage(event.target.checked)} />
              Capture full page
            </label>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void handleCapture()}
              disabled={loading || !url.trim()}
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Capturing..." : "Capture screenshot"}
            </button>
            {result ? (
              <button
                type="button"
                onClick={() => downloadDataUrl(result, `website-screenshot.${inferImageExtension(result)}`)}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
              >
                Download image
              </button>
            ) : null}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </ImageCard>

      {result ? (
        <ImageCard>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Website screenshot</h2>
          <PreviewImage src={result} alt="Captured website screenshot" />
        </ImageCard>
      ) : null}
    </div>
  );
}
