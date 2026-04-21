"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type ClipboardEvent } from "react";
import { removeBackground } from "@imgly/background-removal";

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

function FilesPicker({
  label,
  accept,
  onFiles,
}: {
  label: string;
  accept: string;
  onFiles: (files: FileList) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOver, setIsOver] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    onFiles(files);
  }

  return (
    <div 
      className={`relative group w-full ${isOver ? 'scale-[1.02]' : ''} transition-all duration-300`}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => { e.preventDefault(); setIsOver(false); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.currentTarget.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`w-full flex flex-col items-center justify-center rounded-[2rem] border-4 border-dashed ${
          isOver ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white hover:border-primary/40 hover:bg-slate-50'
        } p-12 text-center transition-all duration-300 shadow-premium-sm hover:shadow-premium`}
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          {label}
        </h3>
        <p className="max-w-xs text-base text-slate-500 leading-relaxed">
          Drag and drop your image here, or <span className="text-primary font-semibold underline decoration-2 underline-offset-4">browse files</span>
        </p>
        <div className="mt-8 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          <span>PNG</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>JPG</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>WEBP</span>
        </div>
      </button>
    </div>
  );
}

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
  const [currentItem, setCurrentItem] = useState<ProcessedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progress, setProgress] = useState("");
  const [comparison, setComparison] = useState(50);
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>("transparent");
  const [backgroundColor, setBackgroundColor] = useState("#f8fafc");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [scale, setScale] = useState(1);
  const [softEdges, setSoftEdges] = useState(true);
  const [dropShadow, setDropShadow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDownload = Boolean(currentItem?.resultUrl);

  async function processImage(file: File) {
    if (!file) return;

    setCurrentItem({
      id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      name: file.name,
      originalUrl: URL.createObjectURL(file),
      resultUrl: null,
    });

    setIsProcessing(true);
    setError(null);
    setProgressPercent(5);
    setProgress("Analyzing your image");

    try {
      const blob = await (removeBackground as unknown as (
        input: File,
        options?: { progress?: (key: string, current: number, total: number) => void },
      ) => Promise<Blob>)(file, {
        progress: (key: string, current: number, total: number) => {
          const combined = total > 0 ? (current / total) * 100 : 20;
          setProgressPercent(Math.max(5, Math.min(95, combined)));
          setProgress(getStageMessage(key, current, total));
        },
      });

      const resultUrl = URL.createObjectURL(blob);
      setCurrentItem((curr) => curr ? { ...curr, resultUrl } : null);
      setProgressPercent(100);
      setProgress("Background successfully removed!");
    } catch (processingError) {
      setError("Failed to remove background. Please try a clearer image.");
      setProgress("");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleFiles(fileList: FileList) {
    const firstImage = Array.from(fileList).find((file) => file.type.startsWith("image/"));
    if (firstImage) {
      processImage(firstImage);
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const pastedFile = Array.from(event.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile())
      .find((file): file is File => Boolean(file && file.type.startsWith("image/")));

    if (pastedFile) {
      processImage(pastedFile);
    }
  }

  async function handleDownload() {
    if (!currentItem?.resultUrl) {
      return;
    }

    const image = await loadImage(currentItem.resultUrl);
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
    <section className="space-y-10" onPaste={handlePaste} tabIndex={0}>
      {!currentItem && (
        <div className="mx-auto max-w-2xl">
          <FilesPicker label="Upload an Image" accept="image/png, image/jpeg, image/webp" onFiles={handleFiles} />
        </div>
      )}

      {currentItem && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem] animate-fade-in">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-premium-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Preview Result</span>
                  <p className="mt-1 text-sm text-slate-500 truncate max-w-md">{currentItem.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setCurrentItem(null); setProgress(""); }}
                  className="flex-none secondary-button px-6 py-2.5 text-sm"
                >
                  Clear and Restart
                </button>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Original</p>
                  <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-slate-50 border border-slate-100 p-2">
                    <Image src={currentItem.originalUrl} alt="Original image" fill unoptimized className="object-contain p-2" />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">After</p>
                  <div
                    className="relative aspect-square overflow-hidden rounded-[1.5rem] border border-slate-100 shadow-inner"
                    style={getBackgroundStyle(backgroundMode, backgroundColor)}
                  >
                    {currentItem.resultUrl ? (
                      <Image
                        src={currentItem.resultUrl}
                        alt="Background removed result"
                        fill
                        unoptimized
                        className="object-contain p-2"
                        style={{
                          filter: `${softEdges ? "drop-shadow(0 0 0.5px rgba(15,23,42,0.35))" : ""} ${
                            dropShadow ? "drop-shadow(0 18px 24px rgba(15,23,42,0.26))" : ""
                          }`.trim() || undefined,
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-8 text-center bg-slate-50">
                        <div className="space-y-3">
                            <div className="flex justify-center">
                                <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                                    <div className="h-full bg-primary animate-progress-fast" style={{ width: '40%' }} />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-400">Processing cutout...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {currentItem.resultUrl && (
                <div className="mt-8 rounded-[1.5rem] border border-slate-100 bg-slate-50/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Slider comparison</p>
                    <span className="text-xs font-bold text-slate-900">{comparison}% Result</span>
                  </div>
                  <div className="relative aspect-video overflow-hidden rounded-[1.25rem] bg-white border border-slate-200 shadow-sm">
                    <Image src={currentItem.originalUrl} alt="Before" fill unoptimized className="object-contain p-4" />
                    <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${comparison}%` }}>
                      <div className="relative h-full w-[min(80vw,1200px)] max-w-none" style={getBackgroundStyle(backgroundMode, backgroundColor)}>
                        <Image src={currentItem.resultUrl} alt="After" fill unoptimized className="object-contain p-4" />
                      </div>
                    </div>
                    <div className="absolute inset-y-0 w-1 bg-primary shadow-lg" style={{ left: `${comparison}%` }}>
                        <div className="absolute top-1/2 -left-3 -translate-y-1/2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shadow-xl border-2 border-white">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 7l-4 4m0 0l4 4m-4-4h16m0 0l-4-4m4 4l-4 4" />
                            </svg>
                        </div>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={comparison}
                    onChange={(event) => setComparison(Number(event.target.value))}
                    className="mt-6 w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-premium-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Status</span>
                  <h2 className="mt-1 text-base font-bold text-slate-900">{isProcessing ? "Removing background..." : progress}</h2>
                </div>
                {isProcessing && <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />}
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
              {error && <p className="mt-4 text-sm font-medium text-red-500 bg-red-50 p-4 rounded-xl">{error}</p>}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-premium-sm space-y-6">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Options</span>
                    <h2 className="mt-1 text-xl font-bold text-slate-900">Final adjustments</h2>
                </div>

                <label className="block space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Background</span>
                    <select value={backgroundMode} onChange={(event) => setBackgroundMode(event.target.value as BackgroundMode)} className={selectClass}>
                        <option value="transparent">Transparent</option>
                        <option value="white">Solid White</option>
                        <option value="color">Custom Color</option>
                    </select>
                </label>

                {backgroundMode === "color" && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <label className="block space-y-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Pick Color</span>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={backgroundColor}
                                    onChange={(event) => setBackgroundColor(event.target.value)}
                                    className="h-12 w-20 flex-none cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
                                />
                                <input
                                    type="text"
                                    value={backgroundColor}
                                    onChange={(event) => setBackgroundColor(event.target.value)}
                                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-mono"
                                />
                            </div>
                        </label>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Format</span>
                        <select value={exportFormat} onChange={(event) => setExportFormat(event.target.value as ExportFormat)} className={selectClass}>
                            <option value="png">PNG</option>
                            <option value="jpg">JPG</option>
                        </select>
                    </label>
                    <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Upscale</span>
                        <select value={scale} onChange={(event) => setScale(Number(event.target.value))} className={selectClass}>
                            <option value={1}>1x Normal</option>
                            <option value={2}>2x High Res</option>
                        </select>
                    </label>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                    <label className="flex items-center gap-3 group cursor-pointer">
                        <div className={`flex items-center justify-center h-5 w-5 rounded border-2 transition-colors ${softEdges ? 'bg-primary border-primary' : 'border-slate-300 group-hover:border-primary'}`}>
                            {softEdges && <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                        </div>
                        <input type="checkbox" checked={softEdges} onChange={(e) => setSoftEdges(e.target.checked)} className="hidden" />
                        <span className="text-sm font-semibold text-slate-700">Smooth edges</span>
                    </label>
                    <label className="flex items-center gap-3 group cursor-pointer">
                        <div className={`flex items-center justify-center h-5 w-5 rounded border-2 transition-colors ${dropShadow ? 'bg-primary border-primary' : 'border-slate-300 group-hover:border-primary'}`}>
                            {dropShadow && <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                        </div>
                        <input type="checkbox" checked={dropShadow} onChange={(e) => setDropShadow(e.target.checked)} className="hidden" />
                        <span className="text-sm font-semibold text-slate-700">Soft drop shadow</span>
                    </label>
                </div>

                <button 
                  type="button" 
                  onClick={handleDownload} 
                  disabled={!canDownload} 
                  className="w-full primary-button py-4 text-base shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                >
                  Download {exportFormat.toUpperCase()}
                </button>
            </div>

            <div className="rounded-[2rem] bg-indigo-600 p-8 text-white shadow-premium">
                <h3 className="text-lg font-bold">Privacy Guarantee</h3>
                <p className="mt-2 text-sm leading-relaxed text-indigo-100">
                    Your photo never leaves your machine. Processing happens locally in your browser, making this a safe, private alternative to cloud editors.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    100% Client-Side
                </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
