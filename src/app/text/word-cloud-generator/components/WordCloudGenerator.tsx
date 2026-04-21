"use client";

import { useMemo, useState } from "react";

import { generateWordCloud } from "@/lib/tools/word-cloud";

const textareaClass =
  "min-h-[14rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

const buttonClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

const toneClasses = [
  "text-primary",
  "text-success",
  "text-warning",
  "text-danger",
  "text-foreground",
];

type PositionedWord = {
  word: string;
  count: number;
  weight: number;
  x: number;
  y: number;
  fontSize: number;
  color: string;
};

const svgColors = ["#4F46E5", "#059669", "#D97706", "#DC2626", "#0F172A"];

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildCloudLayout(items: Array<{ word: string; count: number; weight: number }>) {
  const width = 1400;
  const height = 900;
  const paddingX = 48;
  const paddingY = 68;
  const lineGap = 18;
  let cursorX = paddingX;
  let baselineY = paddingY;
  let lineHeight = 0;

  const positioned: PositionedWord[] = [];
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const fontSize = Math.round(24 + item.weight * 54);
    const estWidth = Math.max(28, Math.round(item.word.length * fontSize * 0.58));

    if (cursorX + estWidth > width - paddingX) {
      cursorX = paddingX;
      baselineY += lineHeight + lineGap;
      lineHeight = 0;
    }

    if (baselineY > height - paddingY) {
      break;
    }

    positioned.push({
      ...item,
      x: cursorX,
      y: baselineY,
      fontSize,
      color: svgColors[index % svgColors.length],
    });
    cursorX += estWidth + 26;
    lineHeight = Math.max(lineHeight, fontSize);
  }

  return { positioned, width, height };
}

async function downloadCloudPng(items: Array<{ word: string; count: number; weight: number }>) {
  if (!items.length) {
    return false;
  }

  const { positioned, width, height } = buildCloudLayout(items);
  if (!positioned.length) {
    return false;
  }

  const labels = positioned
    .map(
      (item) =>
        `<text x="${item.x}" y="${item.y}" font-family="Inter, system-ui, sans-serif" font-size="${item.fontSize}" font-weight="700" fill="${item.color}">${escapeXml(item.word)}</text>`,
    )
    .join("");
  const subtitle = `<text x="48" y="40" font-family="Inter, system-ui, sans-serif" font-size="20" font-weight="600" fill="#334155">Word Cloud Generator</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#ffffff"/><rect x="16" y="16" width="${width - 32}" height="${height - 32}" rx="24" fill="#f8fafc" stroke="#e2e8f0"/>${subtitle}${labels}</svg>`;

  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Image export failed"));
    });

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return false;
    }
    ctx.drawImage(img, 0, 0);

    const pngUrl = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = pngUrl;
    anchor.download = "word-cloud.png";
    anchor.click();
    return true;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function WordCloudGenerator() {
  const [text, setText] = useState("");
  const [maxWords, setMaxWords] = useState(40);
  const [minLength, setMinLength] = useState(3);
  const [ignoreStopWords, setIgnoreStopWords] = useState(true);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [downloadState, setDownloadState] = useState<"idle" | "done" | "error">("idle");

  const result = useMemo(
    () =>
      generateWordCloud(text, {
        maxWords,
        minLength,
        ignoreStopWords,
      }),
    [ignoreStopWords, maxWords, minLength, text],
  );

  const exportText = useMemo(
    () => ["word,count", ...result.items.map((item) => `${item.word},${item.count}`)].join("\n"),
    [result.items],
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 1800);
    }
  }

  function handleClear() {
    setText("");
    setCopyState("idle");
    setDownloadState("idle");
  }

  async function handleDownload() {
    try {
      const ok = await downloadCloudPng(result.items);
      setDownloadState(ok ? "done" : "error");
      window.setTimeout(() => setDownloadState("idle"), 1800);
    } catch {
      setDownloadState("error");
      window.setTimeout(() => setDownloadState("idle"), 1800);
    }
  }

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Paste text for the word cloud</span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Paste an article, essay, transcript, or keyword-rich draft to generate a word cloud."
              className={textareaClass}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Max words</span>
              <input
                type="number"
                min={10}
                max={100}
                value={maxWords}
                onChange={(event) => setMaxWords(Math.max(10, Math.min(100, Number(event.target.value) || 40)))}
                className={fieldClass}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Min length</span>
              <input
                type="number"
                min={1}
                max={12}
                value={minLength}
                onChange={(event) => setMinLength(Math.max(1, Math.min(12, Number(event.target.value) || 3)))}
                className={fieldClass}
              />
            </label>

            <label className="flex items-center gap-3 rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                checked={ignoreStopWords}
                onChange={() => setIgnoreStopWords((value) => !value)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              Ignore common words
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleCopy} className={buttonClass}>
              {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy top words"}
            </button>
            <button type="button" onClick={handleDownload} className={buttonClass}>
              {downloadState === "done"
                ? "Downloaded"
                : downloadState === "error"
                  ? "Download failed"
                  : "Download PNG"}
            </button>
            <button type="button" onClick={handleClear} className={buttonClass}>
              Clear text
            </button>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-foreground">Word cloud</h2>
              <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {result.items.length} words shown
              </span>
            </div>

            {result.items.length ? (
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-4 rounded-[1rem] border border-border bg-card p-5">
                {result.items.map((item, index) => (
                  <span
                    key={item.word}
                    className={`font-semibold leading-none ${toneClasses[index % toneClasses.length]}`}
                    style={{
                      fontSize: `${16 + item.weight * 32}px`,
                    }}
                    title={`${item.word}: ${item.count}`}
                  >
                    {item.word}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[1rem] border border-dashed border-border bg-card px-4 py-8 text-sm leading-6 text-muted-foreground">
                Add text above to generate a frequency-based word cloud.
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Cloud stats
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Word cloud snapshot</h2>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Words analyzed</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.totalWords}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Unique words</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.uniqueWords}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Top word</p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">{result.topWord ?? "-"}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.topWord ? `${result.topCount} uses` : "No words yet"}
              </p>
            </div>
          </div>


        </aside>
      </div>
    </section>
  );
}


