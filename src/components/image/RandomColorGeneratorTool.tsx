"use client";

import { useMemo, useState } from "react";

import { CopyButton, ImageCard, ImageField, ImageSelect } from "@/components/image/shared";

function randomHex() {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")}`;
}

function generatePalette(size: number) {
  return Array.from({ length: size }, () => randomHex());
}

export default function RandomColorGeneratorTool() {
  const [count, setCount] = useState(5);
  const [palette, setPalette] = useState<string[]>(() => generatePalette(5));
  const paletteText = useMemo(() => palette.join("\n"), [palette]);

  function regenerate(nextCount = count) {
    setPalette(generatePalette(nextCount));
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Generate a quick palette</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Create a fresh set of random colors for mockups, placeholders, experiments, and UI exploration.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ImageField label="Colors">
              <ImageSelect
                value={count}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  setCount(next);
                  regenerate(next);
                }}
              >
                {[3, 4, 5, 6, 8].map((entry) => (
                  <option key={entry} value={entry}>
                    {entry} colors
                  </option>
                ))}
              </ImageSelect>
            </ImageField>
            <button
              type="button"
              onClick={() => regenerate()}
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              Generate palette
            </button>
          </div>
        </div>
      </ImageCard>

      <ImageCard>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Palette preview</h2>
          <CopyButton value={paletteText} label="Copy palette" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {palette.map((hex) => (
            <div key={hex} className="rounded-[1.5rem] border border-border bg-background p-4">
              <div className="h-28 rounded-[1rem] border border-border" style={{ backgroundColor: hex }} />
              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{hex}</p>
                  <p className="text-xs text-muted-foreground">Hex value</p>
                </div>
                <CopyButton value={hex} label="Copy" />
              </div>
            </div>
          ))}
        </div>
      </ImageCard>
    </div>
  );
}
