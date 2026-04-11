"use client";

import { useState } from "react";
import Image from "next/image";
import { removeBackground } from "@imgly/background-removal";
import { FilePicker } from "@/components/image/shared";

export default function AIBackgroundRemover() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string>("Initializing AI model. This may take a moment on the first run...");

  const processImage = async (file: File) => {
    try {
      setIsProcessing(true);
      setResultUrl(null);
      setProgress("Loading image...");

      // Display original instantly
      const objectUrl = URL.createObjectURL(file);
      setOriginalUrl(objectUrl);

      // Perform background removal setup
      const blob = await (removeBackground as any)(file, {
        progress: (key: string, current: number, total: number) => {
          if (key.includes("fetch")) {
            setProgress(`Processing Image: ${Math.round((current / total) * 100)}%`);
          } else if (key.includes("compute")) {
            setProgress("Computing mask and removing background...");
          }
        }
      });

      const processedUrl = URL.createObjectURL(blob);
      setResultUrl(processedUrl);
    } catch (error) {
      console.error("Error removing background:", error);
      alert("Something went wrong while processing the image. Please try a different photo.");
    } finally {
      setIsProcessing(false);
      setProgress("");
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `removed-bg-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-8 xl:grid-cols-2">

          {/* Left Column: Upload */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">1. Upload Image</h2>
            <FilePicker
              label="Select Photo"
              accept="image/png, image/jpeg, image/webp"
              onFile={processImage}
            />

            {originalUrl && (
              <div className="rounded-[1.5rem] border border-border bg-slate-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Original Image</p>
                <div className="relative aspect-video w-full overflow-hidden rounded-[1rem] bg-white drop-shadow-sm">
                  <Image
                    src={originalUrl}
                    alt="Original Upload"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Processing / Result */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">2. Transparent Result</h2>

            <div className="flex h-full min-h-[300px] flex-col rounded-[1.5rem] border border-border bg-card p-5 xl:sticky xl:top-6">

              {!originalUrl && !isProcessing && (
                <div className="flex flex-1 items-center justify-center rounded-[1rem] border border-dashed border-border bg-background p-6 text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Your transparent image will appear here. No data is sent to our servers.
                  </p>
                </div>
              )}

              {isProcessing && (
                <div className="flex flex-1 flex-col items-center justify-center space-y-4 rounded-[1rem] border border-primary/20 bg-primary-soft p-6 text-center shadow-inner">
                  <svg className="h-8 w-8 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold tracking-tight text-primary">Processing...</p>
                    <p className="text-xs font-medium text-primary/70">{progress}</p>
                  </div>
                </div>
              )}

              {resultUrl && !isProcessing && (
                <>
                  {/* Checkerboard background wrapper to show transparency */}
                  <div className="relative aspect-square sm:aspect-video w-full overflow-hidden rounded-[1rem] border border-border shadow-sm bg-[url('data:image/svg+xml;utf8,<svg width=%2220%22 height=%2220%22 xmlns=%22http://www.w3.org/2000/svg%22><rect width=%2210%22 height=%2210%22 fill=%22%23e2e8f0%22/><rect x=%2210%22 y=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23e2e8f0%22/><rect x=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23f8fafc%22/><rect y=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23f8fafc%22/></svg>')] bg-repeat">
                    <Image
                      src={resultUrl}
                      alt="Background Removed Result"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <button
                    onClick={handleDownload}
                    className="w-full mt-6 py-3 px-4 rounded-[1rem] text-sm font-semibold transition-all bg-emerald-500 text-white hover:-translate-y-0.5 hover:shadow-lg shadow-emerald-500/25"
                  >
                    Download Transparent PNG
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
