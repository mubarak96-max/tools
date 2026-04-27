"use client";

import Image from "next/image";
import { useRef, useState, DragEvent } from "react";
import { Upload, FileText, Copy, Loader2, CheckCircle2, AlertCircle, Image as ImageIcon, X } from "lucide-react";

type OcrResult = {
  text: string;
  confidence: number | null;
};

export default function ImageToText() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState("");
  const [filename, setFilename] = useState("");
  const [result, setResult] = useState<OcrResult>({ text: "", confidence: null });
  const [status, setStatus] = useState("Idle");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPG, PNG, WEBP, or BMP).");
      return;
    }

    setError("");
    setFilename(file.name);
    setPreview(URL.createObjectURL(file));
    setResult({ text: "", confidence: null });
    setIsRunning(true);
    setStatus("Loading OCR engine...");

    try {
      const tesseract = await import("tesseract.js");
      const output = await tesseract.recognize(file, "eng", {
        logger(message) {
          if (message.status === "recognizing text") {
            const percent = typeof message.progress === "number" ? Math.round(message.progress * 100) : 0;
            setStatus(`Extracting text... ${percent}%`);
          } else {
            setStatus(message.status);
          }
        },
      });
      setResult({
        text: output.data.text.trim(),
        confidence: typeof output.data.confidence === "number" ? output.data.confidence : null,
      });
      setStatus("Extraction complete.");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to extract text from this image.");
      setStatus("Failed.");
    } finally {
      setIsRunning(false);
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  async function copyText() {
    if (!result.text) return;
    await navigator.clipboard.writeText(result.text);
    setStatus("Text copied to clipboard!");
    setTimeout(() => setStatus("Extraction complete."), 2000);
  }

  const reset = () => {
    setPreview("");
    setFilename("");
    setResult({ text: "", confidence: null });
    setStatus("Idle");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Drag & Drop Area */}
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative cursor-pointer rounded-[2.5rem] border-2 border-dashed p-12 transition-all duration-300
            flex flex-col items-center justify-center text-center group
            ${isDragging ? "border-primary bg-primary/5 scale-[0.99]" : "border-slate-200 bg-slate-50/50 hover:border-primary/30 hover:bg-slate-50"}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/bmp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          
          <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-10 h-10" />
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 mb-2">Drop your image here</h3>
          <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
            Support JPG, PNG, WEBP, and BMP. Text is extracted locally in your browser for 100% privacy.
          </p>
          
          <div className="primary-button px-8 py-3 rounded-full flex items-center gap-2">
            Select Files
          </div>

          {error && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-red-500 font-bold text-xs">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2 items-start">
          {/* Left Side: Preview & Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{filename}</span>
              </div>
              <button 
                onClick={reset}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-premium">
              <Image
                src={preview}
                alt="Source preview"
                width={1200}
                height={800}
                unoptimized
                className="max-h-[500px] w-full object-contain bg-slate-50"
              />
              {isRunning && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <p className="font-black text-slate-900 tracking-tight uppercase text-xs">{status}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-slate-900">Extracted Text</span>
              </div>
              {result.confidence && (
                <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-widest">
                  Accuracy: {Math.round(result.confidence)}%
                </span>
              )}
            </div>

            <div className="relative group">
              <textarea
                value={result.text}
                onChange={(e) => setResult(c => ({ ...c, text: e.target.value }))}
                placeholder={isRunning ? "Analyzing image pixels..." : "No text found."}
                className="w-full min-h-[400px] rounded-[2rem] border border-slate-100 bg-white p-8 text-sm leading-relaxed text-slate-700 shadow-premium outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
              
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={copyText}
                  disabled={!result.text || isRunning}
                  className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  <Copy className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100/50">
              {isRunning ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              ) : result.text ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-slate-300" />
              )}
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">
                {status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

