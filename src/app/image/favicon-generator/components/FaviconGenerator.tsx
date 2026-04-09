"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import JSZip from "jszip";
import { FilePicker } from "@/components/image/shared";

const SIZES = [
  { size: 16, name: "favicon-16x16.png", type: "favicon" },
  { size: 32, name: "favicon-32x32.png", type: "favicon" },
  { size: 48, name: "favicon.ico", type: "ico" }, // We will just export a png renamed or standard png. Actually, true .ico requires a complex buffer. We'll use 48x48 PNG for modern browsers.
  { size: 180, name: "apple-touch-icon.png", type: "apple" },
  { size: 192, name: "android-chrome-192x192.png", type: "android" },
  { size: 512, name: "android-chrome-512x512.png", type: "android" },
];

export default function FaviconGenerator() {
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const processImage = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setSourceUrl(objectUrl);
  };

  const generateZip = async () => {
    if (!imgRef.current || !sourceUrl) return;
    setIsProcessing(true);

    try {
      const zip = new JSZip();
      
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) throw new Error("Could not get canvas context");

      // Set image rendering quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Calculate crop to make it a perfect square
      const img = imgRef.current;
      const size = Math.min(img.naturalWidth, img.naturalHeight);
      const startX = (img.naturalWidth - size) / 2;
      const startY = (img.naturalHeight - size) / 2;

      for (const format of SIZES) {
        canvas.width = format.size;
        canvas.height = format.size;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, startX, startY, size, size, 0, 0, format.size, format.size);

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), "image/png");
        });

        if (blob) {
           zip.file(format.name, blob);
        }
      }

      // Generate HTML snippet
      const htmlSnippet = `<!-- Place this code in the <head> of your document -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon.ico">`;
      
      zip.file("instructions.html", htmlSnippet);

      // Download
      const content = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `favicon-package-${Date.now()}.zip`;
      link.click();
      URL.revokeObjectURL(downloadUrl);
      
    } catch (error) {
      console.error("Failed to generate zip", error);
      alert("Something went wrong generating the zip file.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-8 xl:grid-cols-2">
          
          {/* Upload Area */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">1. Upload Logo</h2>
            <FilePicker
              label="Select Master Image"
              accept="image/png, image/jpeg, image/webp, image/svg+xml"
              onFile={processImage}
            />

            {sourceUrl && (
              <div className="rounded-[1.5rem] border border-border bg-slate-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Original Image</p>
                <div className="relative aspect-square w-full overflow-hidden rounded-[1rem] bg-white border border-border shadow-inner flex items-center justify-center p-8 bg-[url('data:image/svg+xml;utf8,<svg width=%2220%22 height=%2220%22 xmlns=%22http://www.w3.org/2000/svg%22><rect width=%2210%22 height=%2210%22 fill=%22%23e2e8f0%22/><rect x=%2210%22 y=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23e2e8f0%22/><rect x=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23f8fafc%22/><rect y=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23f8fafc%22/></svg>')] bg-repeat">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imgRef}
                    src={sourceUrl}
                    alt="Source Graphic"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">2. Download Package</h2>
            
            <div className="flex h-full min-h-[300px] flex-col rounded-[1.5rem] border border-border bg-card p-5 xl:sticky xl:top-6">
              {!sourceUrl ? (
                <div className="flex flex-1 items-center justify-center rounded-[1rem] border border-dashed border-border bg-background p-6 text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Upload your site's logo using the picker. A high-resolution square image works best (at least 512x512).
                  </p>
                </div>
              ) : (
                <div className="flex flex-1 flex-col">
                   <div className="flex-1 space-y-4">
                      
                      <div className="grid grid-cols-[1fr_auto] gap-4 items-center bg-muted/50 p-3 rounded-xl border border-border/50">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-md border border-border/50 overflow-hidden bg-white shrink-0 relative">
                             <Image src={sourceUrl} alt="16x16" fill className="object-cover" unoptimized/>
                           </div>
                           <div className="flex flex-col">
                             <span className="text-sm font-semibold text-foreground">favicon-16x16.png</span>
                             <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Standard Tab</span>
                           </div>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">16px</span>
                      </div>

                      <div className="grid grid-cols-[1fr_auto] gap-4 items-center bg-muted/50 p-3 rounded-xl border border-border/50">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-md border border-border/50 overflow-hidden bg-white shrink-0 relative">
                             <Image src={sourceUrl} alt="32x32" fill className="object-cover" unoptimized/>
                           </div>
                           <div className="flex flex-col">
                             <span className="text-sm font-semibold text-foreground">favicon-32x32.png</span>
                             <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Retina Tab</span>
                           </div>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">32px</span>
                      </div>

                      <div className="grid grid-cols-[1fr_auto] gap-4 items-center bg-muted/50 p-3 rounded-xl border border-border/50">
                        <div className="flex items-center gap-3">
                           <div className="h-14 w-14 rounded-[0.9rem] border border-border/50 overflow-hidden bg-white shrink-0 relative">
                             <Image src={sourceUrl} alt="Apple Touch" fill className="object-cover" unoptimized/>
                           </div>
                           <div className="flex flex-col">
                             <span className="text-sm font-semibold text-foreground">apple-touch-icon.png</span>
                             <span className="text-[10px] text-muted-foreground uppercase tracking-widest">iOS & iPad</span>
                           </div>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">180px</span>
                      </div>

                   </div>

                   <button
                    onClick={generateZip}
                    disabled={isProcessing}
                    className={`mt-8 w-full py-3.5 px-4 rounded-[1rem] text-sm font-semibold transition-all flex justify-center items-center gap-2 ${
                      isProcessing 
                        ? "bg-primary/50 text-white cursor-wait" 
                        : "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg shadow-primary/25"
                    }`}
                   >
                     {isProcessing ? (
                       <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                     )}
                     Download Entire .ZIP Package
                   </button>
                   <p className="text-center text-xs text-muted-foreground mt-3">
                     Includes all required icons and an HTML tag sheet.
                   </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
