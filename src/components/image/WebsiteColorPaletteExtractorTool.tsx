"use client";

import { useState } from "react";

import { CopyButton, ImageCard, ImageField, ImageInput } from "@/components/image/shared";

type PaletteColor = {
  color: string;
  count: number;
};

export default function WebsiteColorPaletteExtractorTool() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [colors, setColors] = useState<PaletteColor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleExtract() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/website-palette", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to extract website colors.");
      }

      setTitle(data.title || "");
      setColors(data.colors || []);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to extract website colors.");
      setColors([]);
      setTitle("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Extract a website color palette</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Enter a website URL to scan its source and stylesheet content for recurring brand and interface colors.
            </p>
          </div>
          <div className="w-full max-w-xl">
            <ImageField label="Website URL">
              <ImageInput
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
            </ImageField>
          </div>
          <button
            type="button"
            onClick={() => void handleExtract()}
            disabled={loading || !url.trim()}
            className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Extracting..." : "Extract palette"}
          </button>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </ImageCard>

      {colors.length ? (
        <ImageCard>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Extracted colors</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {title ? `Detected from ${title}.` : "Detected from the submitted website source."}
              </p>
            </div>
            <CopyButton value={colors.map((entry) => entry.color).join(", ")} label="Copy palette" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {colors.map((entry) => (
              <article key={`${entry.color}-${entry.count}`} className="rounded-[1.25rem] border border-border bg-background p-4">
                <div className="h-24 rounded-[1rem]" style={{ backgroundColor: entry.color }} />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{entry.color}</h3>
                    <p className="text-xs text-muted-foreground">Detected {entry.count} times</p>
                  </div>
                  <CopyButton value={entry.color} label="Copy" />
                </div>
              </article>
            ))}
          </div>
        </ImageCard>
      ) : null}
    </div>
  );
}
