"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ClipboardEvent } from "react";
import { removeBackground } from "@imgly/background-removal";

import { FilesPicker } from "@/components/image/shared";

type BackgroundMode = "transparent" | "white" | "color";
type ExportFormat = "png" | "jpg";

type ProcessedImage = {
  id: string;
  name: string;
  originalUrl: string;
  resultUrl: string | null;
};

const actionClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed disabled:opacity-50";

const selectClass =
  "w-full rounded-[1rem] border border-border bg-background px-3 py-3 text-sm text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary";

const linkActionClass =
  "inline-flex rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

function getBackgroundStyle(mode: BackgroundMode, color: string) {
  if (mode === "transparent") {
    return {
      backgroundImage:
        "url('data:image/svg+xml;utf8,<svg width=%2220%22 height=%2220%22 xmlns=%22http://www.w3.org/2000/svg%22><rect width=%2210%22 height=%2210%22 fill=%22%23e2e8f0%22/><rect x=%2210%22 y=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23e2e8f0%22/><rect x=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23f8fafc%22/><rect y=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23f8fafc%22/></svg>')",
      backgroundRepeat: "repeat",
    };
  }

  return {
    backgroundColor: mode === "white" ? "#ffffff" : color,
  };
}

function getStageMessage(key: string, current: number, total: number) {
  if (key.includes("fetch")) {
    return `Loading AI model ${Math.round((current / total) * 100)}%`;
  }

  if (key.includes("compute")) {
    return "Segmenting subject and refining edges";
  }

  return "Processing image";
}

async function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load processed image."));
    image.src = url;
  });
}

export default function AIBackgroundRemover() {
  const [items, setItems] = useState<ProcessedImage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progress, setProgress] = useState("Upload PNG, JPG, or WEBP images to remove backgrounds.");
  const [comparison, setComparison] = useState(50);
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>("transparent");
  const [backgroundColor, setBackgroundColor] = useState("#f8fafc");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [scale, setScale] = useState(1);
  const [softEdges, setSoftEdges] = useState(true);
  const [dropShadow, setDropShadow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? items[0] ?? null,
    [items, selectedId],
  );
  const completedCount = items.filter((item) => item.resultUrl).length;
  const canDownload = Boolean(selectedItem?.resultUrl);

  async function processImages(files: File[]) {
    if (!files.length) {
      return;
    }

    const nextItems = files.map((file) => ({
      id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      name: file.name,
      originalUrl: URL.createObjectURL(file),
      resultUrl: null,
    }));

    setItems(nextItems);
    setSelectedId(nextItems[0]?.id ?? null);
    setIsProcessing(true);
    setError(null);
    setProgressPercent(3);
    setProgress("Preparing images");

    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const currentItem = nextItems[index];

        if (!currentItem) {
          continue;
        }

        setSelectedId(currentItem.id);
        setProgress(`Detecting subject (${index + 1}/${files.length})`);

        const blob = await (removeBackground as unknown as (
          input: File,
          options?: { progress?: (key: string, current: number, total: number) => void },
        ) => Promise<Blob>)(file, {
          progress: (key: string, current: number, total: number) => {
            const localProgress = total > 0 ? current / total : 0.2;
            const combined = ((index + localProgress) / files.length) * 100;
            setProgressPercent(Math.max(4, Math.min(98, combined)));
            setProgress(`${getStageMessage(key, current, total)} (${index + 1}/${files.length})`);
          },
        });

        const resultUrl = URL.createObjectURL(blob);
        setItems((current) =>
          current.map((item) => (item.id === currentItem.id ? { ...item, resultUrl } : item)),
        );
      }

      setProgressPercent(100);
      setProgress("Background removal complete. Review, replace, and export.");
    } catch (processingError) {
      const message = processingError instanceof Error ? processingError.message : "Background removal failed.";
      setError(message);
      setProgress("Processing failed. Try a clearer image with a distinct subject.");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleFiles(fileList: FileList) {
    processImages(Array.from(fileList).filter((file) => file.type.startsWith("image/")));
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const pastedFiles = Array.from(event.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile())
      .filter((file): file is File => Boolean(file && file.type.startsWith("image/")));

    if (pastedFiles.length) {
      processImages(pastedFiles);
    }
  }

  async function handleDownload() {
    if (!selectedItem?.resultUrl) {
      return;
    }

    const image = await loadImage(selectedItem.resultUrl);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const shouldFill = backgroundMode !== "transparent" || exportFormat === "jpg";
    if (shouldFill) {
      context.fillStyle = backgroundMode === "color" ? backgroundColor : "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (dropShadow) {
      context.shadowColor = "rgba(15, 23, 42, 0.28)";
      context.shadowBlur = Math.round(24 * scale);
      context.shadowOffsetY = Math.round(10 * scale);
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `removed-bg-${Date.now()}.${exportFormat}`;
        link.click();
        URL.revokeObjectURL(url);
      },
      exportFormat === "png" ? "image/png" : "image/jpeg",
      0.92,
    );
  }

  return (
    <section className="tool-frame p-4 sm:p-6" onPaste={handlePaste} tabIndex={0}>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Upload workflow
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                  Remove backgrounds from one image or a batch
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Drag, browse, or paste images. The first model load can take longer; later edits use the cached browser model.
                </p>
              </div>
              <FilesPicker label="Upload images" accept="image/png, image/jpeg, image/webp" onFiles={handleFiles} />
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Before / after</p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">
                  {selectedItem ? selectedItem.name : "Upload an image to preview the cutout"}
                </h2>
              </div>
              {items.length > 1 ? (
                <select
                  value={selectedItem?.id ?? ""}
                  onChange={(event) => setSelectedId(event.target.value)}
                  className="rounded-[1rem] border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                >
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.25rem] border border-border bg-card p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Original</p>
                <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-background">
                  {selectedItem ? (
                    <Image src={selectedItem.originalUrl} alt="Original image" fill unoptimized className="object-contain" />
                  ) : (
                    <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                      Upload an image (PNG, JPG, or WEBP) to remove the background instantly.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-border bg-card p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">After</p>
                <div
                  className="relative aspect-square overflow-hidden rounded-[1rem]"
                  style={getBackgroundStyle(backgroundMode, backgroundColor)}
                >
                  {selectedItem?.resultUrl ? (
                    <Image
                      src={selectedItem.resultUrl}
                      alt="Background removed result"
                      fill
                      unoptimized
                      className="object-contain"
                      style={{
                        filter: `${softEdges ? "drop-shadow(0 0 0.5px rgba(15,23,42,0.35))" : ""} ${
                          dropShadow ? "drop-shadow(0 18px 24px rgba(15,23,42,0.26))" : ""
                        }`.trim() || undefined,
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                      {isProcessing ? "Processed cutout will appear here." : "Transparent result appears here after processing."}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedItem?.resultUrl ? (
              <div className="mt-5 rounded-[1.25rem] border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Slider comparison
                  </p>
                  <span className="text-xs font-medium text-muted-foreground">{comparison}% after</span>
                </div>
                <div className="relative mt-3 aspect-video overflow-hidden rounded-[1rem] bg-background">
                  <Image src={selectedItem.originalUrl} alt="Before comparison" fill unoptimized className="object-contain" />
                  <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${comparison}%` }}>
                    <div className="relative h-full w-[min(80vw,900px)] max-w-none" style={getBackgroundStyle(backgroundMode, backgroundColor)}>
                      <Image src={selectedItem.resultUrl} alt="After comparison" fill unoptimized className="object-contain" />
                    </div>
                  </div>
                  <div className="absolute inset-y-0 w-0.5 bg-primary" style={{ left: `${comparison}%` }} />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={comparison}
                  onChange={(event) => setComparison(Number(event.target.value))}
                  className="mt-3 w-full"
                />
              </div>
            ) : null}
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Processing feedback</p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">{isProcessing ? "Processing image..." : progress}</h2>
              </div>
              <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {completedCount}/{items.length || 0} complete
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
            {error ? <p className="mt-3 text-sm leading-6 text-danger-soft-foreground">{error}</p> : null}
          </div>
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Edit and export</p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Prepare the final asset</h2>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Background</span>
            <select value={backgroundMode} onChange={(event) => setBackgroundMode(event.target.value as BackgroundMode)} className={selectClass}>
              <option value="transparent">Transparent</option>
              <option value="white">White background</option>
              <option value="color">Custom color</option>
            </select>
          </label>

          {backgroundMode === "color" ? (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Background color</span>
              <input
                type="color"
                value={backgroundColor}
                onChange={(event) => setBackgroundColor(event.target.value)}
                className="h-12 w-full rounded-[1rem] border border-border bg-background p-1"
              />
            </label>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Format</span>
              <select value={exportFormat} onChange={(event) => setExportFormat(event.target.value as ExportFormat)} className={selectClass}>
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Resolution</span>
              <select value={scale} onChange={(event) => setScale(Number(event.target.value))} className={selectClass}>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
              </select>
            </label>
          </div>

          <div className="rounded-[1rem] border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Refinement controls</p>
            <div className="mt-3 space-y-3">
              <label className="flex items-center gap-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={softEdges}
                  onChange={(event) => setSoftEdges(event.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                Smooth edge preview
              </label>
              <label className="flex items-center gap-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={dropShadow}
                  onChange={(event) => setDropShadow(event.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                Add soft shadow
              </label>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Manual restore and erase brushes are planned as a deeper editor pass.
            </p>
          </div>

          <button type="button" onClick={handleDownload} disabled={!canDownload} className={`${actionClass} w-full justify-center py-3`}>
            Download {exportFormat.toUpperCase()}
          </button>

          <div className="rounded-[1rem] border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Continue workflow</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/image/image-cropper-resizer" className={linkActionClass}>
                Resize image
              </Link>
              <Link href="/image/image-compressor" className={linkActionClass}>
                Compress image
              </Link>
              <Link href="/image/convert-png-to-jpg" className={linkActionClass}>
                Convert format
              </Link>
            </div>
          </div>

          <div className="rounded-[1rem] border border-success/20 bg-success-soft p-4 text-sm leading-6 text-success-soft-foreground">
            Images are processed locally in your browser and are not uploaded or stored. Best results come from clear subjects with visible edges.
          </div>
        </aside>
      </div>
    </section>
  );
}
