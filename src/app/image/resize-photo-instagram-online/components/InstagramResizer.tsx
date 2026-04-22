"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Download,
  RefreshCcw,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  Check,
  Instagram,
  Settings2,
  Brush
} from "lucide-react";
import { INSTAGRAM_FORMATS, InstagramFormat, resizeImageToFit } from "@/lib/image/instagram-resize";

export default function InstagramResizer() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<InstagramFormat>(INSTAGRAM_FORMATS[0]);
  const [objectFit, setObjectFit] = useState<"contain" | "cover">("contain");
  const [bgMode, setBgMode] = useState<"solid" | "blur">("solid");
  const [blurAmount, setBlurAmount] = useState(40);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const handleResize = useCallback(() => {
    if (!originalImage) return;

    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = originalImage;
    img.onload = () => {
      const dataUrl = resizeImageToFit(img, selectedFormat.width, selectedFormat.height, {
        bgColor,
        bgMode,
        blurAmount,
        objectFit
      });
      setResizedImage(dataUrl);
      setIsLoading(false);
    };
  }, [originalImage, selectedFormat, objectFit, bgColor, bgMode, blurAmount]);

  useEffect(() => {
    if (originalImage) {
      handleResize();
    }
  }, [originalImage, selectedFormat, objectFit, bgColor, bgMode, blurAmount, handleResize]);

  const downloadImage = () => {
    if (!resizedImage) return;
    const link = document.createElement("a");
    link.download = `instagram-${selectedFormat.id}-${Date.now()}.jpg`;
    link.href = resizedImage;
    link.click();
  };

  const reset = () => {
    setOriginalImage(null);
    setResizedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        {!originalImage ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative overflow-hidden cursor-pointer rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-12 sm:p-20 flex flex-col items-center justify-center transition-all duration-500 hover:border-indigo-500 hover:bg-indigo-50/10 active:scale-[0.99]"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-colors" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-500/20 transition-colors" />

              <div className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-tr from-indigo-600 to-pink-600 p-[1px]">
                  <div className="w-full h-full rounded-[1.4rem] bg-white dark:bg-slate-900 flex items-center justify-center">
                    <Upload className="w-10 h-10 text-indigo-600" />
                  </div>
                </div>

                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
                  Upload your photo
                </h3>
                <p className="text-slate-500 max-w-sm mb-8 text-lg font-medium">
                  Drag and drop or click to browse.
                </p>


              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*"
            />
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid lg:grid-cols-[1fr_400px] gap-8 items-start"
          >
            {/* Main Preview Area */}
            <div className="space-y-6">
              <div className="relative group rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 aspect-square sm:aspect-auto sm:min-h-[600px] flex items-center justify-center p-8 sm:p-12 shadow-2xl">
                {/* Background effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.1),transparent)]" />

                {isLoading && (
                  <div className="absolute inset-0 z-10 bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm flex items-center justify-center">
                    <RefreshCcw className="w-12 h-12 text-indigo-500 animate-spin" />
                  </div>
                )}

                <div className="relative z-0 max-w-full max-h-full flex items-center justify-center">
                  {resizedImage ? (
                    <motion.img
                      layoutId="preview"
                      src={resizedImage}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-300 ring-1 ring-black/5"
                      style={{
                        aspectRatio: `${selectedFormat.width}/${selectedFormat.height}`
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                  )}
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-slate-200/50 text-sm font-bold text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  {selectedFormat.label} ({selectedFormat.width}x{selectedFormat.height})
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 py-2">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold transition-all text-sm"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Start Over
                </button>

                <button
                  onClick={downloadImage}
                  className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-xl shadow-indigo-500/20 text-sm group"
                >
                  <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  Download Post
                </button>
              </div>
            </div>

            {/* Sidebar Controls */}
            <div className="space-y-6 lg:sticky lg:top-8">
              <section className="bg-card border border-border rounded-[2rem] p-6 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />

                <div className="flex items-center gap-2 mb-6">
                  <Maximize2 className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                    Choose Format
                  </h4>
                </div>

                <div className="flex flex-col gap-3">
                  {INSTAGRAM_FORMATS.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format)}
                      className={`relative group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${selectedFormat.id === format.id
                        ? "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-500/10 shadow-lg shadow-indigo-500/5"
                        : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-200"
                        }`}
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedFormat.id === format.id ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-indigo-100"
                          }`}>
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${selectedFormat.id === format.id ? "text-indigo-900 dark:text-indigo-100" : "text-slate-700 dark:text-slate-300"}`}>
                            {format.label}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium">
                            {format.width} x {format.height} · {format.ratio}
                          </p>
                        </div>
                      </div>
                      {selectedFormat.id === format.id && (
                        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg">
                          <Check className="w-3 h-3 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-card border border-border rounded-[2rem] p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Settings2 className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                    Adjustment
                  </h4>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Scaling Mode</p>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      <button
                        onClick={() => setObjectFit("contain")}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${objectFit === "contain"
                          ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                          }`}
                      >
                        <Minimize2 className="w-3.5 h-3.5" />
                        Fit
                      </button>
                      <button
                        onClick={() => setObjectFit("cover")}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${objectFit === "cover"
                          ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                          }`}
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        Fill
                      </button>
                    </div>
                  </div>

                  {objectFit === "contain" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-1 duration-300">
                      <div>
                        <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Background Style</p>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                          <button
                            onClick={() => setBgMode("solid")}
                            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${bgMode === "solid"
                              ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm"
                              : "text-slate-500 hover:text-slate-700"
                              }`}
                          >
                            Solid
                          </button>
                          <button
                            onClick={() => setBgMode("blur")}
                            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${bgMode === "blur"
                              ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm"
                              : "text-slate-500 hover:text-slate-700"
                              }`}
                          >
                            <Brush className="w-3.5 h-3.5" />
                            Blurred
                          </button>
                        </div>
                      </div>

                      {bgMode === "blur" && (
                        <div className="animate-in zoom-in-95 duration-200">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Background Blur Intensity</p>
                            <span className="text-[11px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">{blurAmount}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={blurAmount}
                            onChange={(e) => setBlurAmount(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                          />
                        </div>
                      )}

                      {bgMode === "solid" && (
                        <div className="animate-in zoom-in-95 duration-200">
                          <div className="flex items-center justify-between mb-4 font-mono">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Color Picker</p>
                            <span className="text-[10px] text-slate-500 uppercase">{bgColor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={bgColor}
                              onChange={(e) => setBgColor(e.target.value)}
                              className="w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer p-0"
                            />
                            <div className="flex items-center gap-1.5 ml-2 overflow-hidden flex-wrap">
                              {["#ffffff", "#000000", "#f8fafc", "#fdf2f8"].map((color) => (
                                <button
                                  key={color}
                                  onClick={() => setBgColor(color)}
                                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${bgColor === color ? "border-indigo-500 scale-110" : "border-slate-200 dark:border-slate-700"
                                    }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
