"use client";

import { useState } from "react";

import ImageSelector from "./components/ImageSelector";
import QuoteCanvas from "./components/QuoteCanvas";
import QuoteSelector from "./components/QuoteSelector";

export default function QuoteImageGeneratorClient() {
  const [selectedImage, setSelectedImage] = useState("");
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(32);
  const [overlayOpacity, setOverlayOpacity] = useState(0.4);
  const [format, setFormat] = useState<"square" | "portrait">("square");

  const handleQuoteSelect = (selectedQuote: string, selectedAuthor: string) => {
    setQuote(selectedQuote);
    setAuthor(selectedAuthor);
  };

  return (
    <main className="min-h-screen bg-slate-100 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-8 text-center text-4xl font-bold text-slate-900">Quote Image Generator</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-slate-900">1. Choose Background</h2>
              <ImageSelector format={format} selectedImage={selectedImage} onSelect={setSelectedImage} />
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-slate-900">2. Choose Quote</h2>
              <QuoteSelector onSelect={handleQuoteSelect} />
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-slate-900">3. Style Options</h2>
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">Format</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormat("square")}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                        format === "square"
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      Square
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormat("portrait")}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                        format === "portrait"
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      9:16
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-slate-700">Text Color:</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(event) => setTextColor(event.target.value)}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="min-w-20 text-sm font-medium text-slate-700">Font Size:</label>
                  <input
                    type="range"
                    min="16"
                    max="72"
                    value={fontSize}
                    onChange={(event) => setFontSize(Number(event.target.value))}
                    className="flex-1"
                  />
                  <span className="w-12 text-sm text-slate-600">{fontSize}px</span>
                </div>

                <div className="flex items-center gap-4">
                  <label className="min-w-20 text-sm font-medium text-slate-700">Overlay:</label>
                  <input
                    type="range"
                    min="0"
                    max="0.8"
                    step="0.05"
                    value={overlayOpacity}
                    onChange={(event) => setOverlayOpacity(Number(event.target.value))}
                    className="flex-1"
                  />
                  <span className="w-12 text-sm text-slate-600">{Math.round(overlayOpacity * 100)}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-fit rounded-xl bg-white p-6 shadow-sm md:sticky md:top-28">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Preview</h2>
            <QuoteCanvas
              author={author}
              backgroundImage={selectedImage}
              fontSize={fontSize}
              format={format}
              overlayOpacity={overlayOpacity}
              quote={quote}
              textColor={textColor}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
