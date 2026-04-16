"use client";

import React, { useState, useRef } from "react";
import { Upload, Crop, Download, Trash2, LayoutTemplate } from "lucide-react";

export function TrimTransparentPixels() {
  const [image, setImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [margin, setMargin] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name.replace(/\.[^/.]+$/, ""));
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setCroppedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const trimImage = () => {
    if (!image) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      let top = 0, bottom = canvas.height - 1, left = 0, right = canvas.width - 1;

      // Find top
      topLoop: for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const alpha = data[(y * canvas.width + x) * 4 + 3];
          if (alpha > 0) {
            top = y;
            break topLoop;
          }
        }
      }

      // Find bottom
      bottomLoop: for (let y = canvas.height - 1; y >= 0; y--) {
        for (let x = 0; x < canvas.width; x++) {
          const alpha = data[(y * canvas.width + x) * 4 + 3];
          if (alpha > 0) {
            bottom = y;
            break bottomLoop;
          }
        }
      }

      // Find left
      leftLoop: for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
          const alpha = data[(y * canvas.width + x) * 4 + 3];
          if (alpha > 0) {
            left = x;
            break leftLoop;
          }
        }
      }

      // Find right
      rightLoop: for (let x = canvas.width - 1; x >= 0; x--) {
        for (let y = 0; y < canvas.height; y++) {
          const alpha = data[(y * canvas.width + x) * 4 + 3];
          if (alpha > 0) {
            right = x;
            break rightLoop;
          }
        }
      }

      // In the case of an entirely blank image
      if (top > bottom || left > right) {
        setIsProcessing(false);
        setCroppedImage(image); // just return original
        return;
      }

      // Add margins, clamped to original canvas bounds for safety
      const finalLeft = Math.max(0, left - margin);
      const finalTop = Math.max(0, top - margin);
      const finalRight = Math.min(canvas.width - 1, right + margin);
      const finalBottom = Math.min(canvas.height - 1, bottom + margin);

      const finalWidth = finalRight - finalLeft + 1;
      const finalHeight = finalBottom - finalTop + 1;

      const trimmedData = ctx.getImageData(finalLeft, finalTop, finalWidth, finalHeight);

      const resCanvas = document.createElement("canvas");
      resCanvas.width = finalWidth;
      resCanvas.height = finalHeight;
      resCanvas.getContext("2d")?.putImageData(trimmedData, 0, 0);

      setCroppedImage(resCanvas.toDataURL("image/png"));
      setIsProcessing(false);
    };
  };

  const handleDownload = () => {
    if (!croppedImage) return;
    const link = document.createElement("a");
    link.href = croppedImage;
    link.download = `${fileName}-trimmed.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clear = () => {
    setImage(null);
    setCroppedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw">
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
        
        {/* Controls */}
        <div className="space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-muted/5 border border-border/50 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" /> Settings
            </h3>
            
            {!image ? (
              <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-[2rem] bg-background hover:bg-muted/10 transition-all cursor-pointer group">
                <Upload className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
                <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Upload File</span>
                <span className="text-[10px] text-muted-foreground mt-2 opacity-60">PNG or WEBP</span>
                <input ref={fileInputRef} type="file" accept="image/png,image/webp" className="hidden" onChange={onFileChange} />
              </label>
            ) : (
              <div className="relative rounded-[2rem] overflow-hidden border border-border bg-[#e5e5f7] opacity-100" style={{ backgroundImage: "radial-gradient(#444cf722 1px, transparent 1px)", backgroundSize: "10px 10px" }}>
                <img src={image} alt="Preview" className="w-full aspect-video object-contain" />
                <button onClick={clear} className="absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur shadow-lg hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="space-y-2 pt-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Margin Around Content (px)</label>
              <div className="relative">
                <input type="number" min="0" value={margin} onChange={(e) => setMargin(parseInt(e.target.value) || 0)}
                  className="w-full bg-muted/10 border-2 border-border focus:border-primary/50 flex-1 rounded-2xl px-5 pr-14 py-4 text-xl font-bold outline-none transition-all" />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground text-sm">px</span>
              </div>
            </div>

            <button
              onClick={trimImage}
              disabled={!image || isProcessing}
              className="w-full py-5 flex items-center justify-center gap-2 rounded-full bg-foreground text-background font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <Crop className="w-4 h-4" /> {isProcessing ? "Processing..." : "Trim Pixels"}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="bg-muted/5 rounded-[3rem] border border-border/50 p-8 flex flex-col justify-center items-center relative overflow-hidden">
          {!croppedImage ? (
            <div className="text-center space-y-6 max-w-sm">
              <LayoutTemplate className="w-24 h-24 text-muted-foreground/20 mx-auto" />
              <div>
                <h4 className="text-lg font-black italic text-foreground">Awaiting Image</h4>
                <p className="text-sm text-muted-foreground mt-2">Upload a transparent graphic to automatically crop it to its visual bounds.</p>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center">
                <h4 className="text-2xl font-black italic tracking-tighter text-foreground">Trimmed Output</h4>
                <p className="text-sm text-muted-foreground mt-1">Ready for download with intact transparency.</p>
              </div>

              <div className="rounded-[2rem] border border-border bg-[#e5e5f7] overflow-hidden flex items-center justify-center min-h-[300px] p-8" style={{ backgroundImage: "radial-gradient(#444cf722 1px, transparent 1px)", backgroundSize: "10px 10px" }}>
                <img src={croppedImage} alt="Trimmed" className="max-w-full max-h-[300px] object-contain shadow-2xl ring-1 ring-border" />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleDownload}
                  className="w-full py-4 rounded-full bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" /> Download Final Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
