"use client";

import { useCallback, useRef } from "react";
import { toPng } from "html-to-image";

interface QuoteCanvasProps {
  author: string;
  backgroundImage: string;
  fontSize?: number;
  format: "square" | "portrait";
  overlayOpacity?: number;
  quote: string;
  textColor?: string;
}

export default function QuoteCanvas({
  author,
  backgroundImage,
  fontSize = 32,
  format,
  overlayOpacity = 0.4,
  quote,
  textColor = "#ffffff",
}: QuoteCanvasProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  const downloadImage = useCallback(async () => {
    if (!previewRef.current) {
      return;
    }

    try {
      const dataUrl = await toPng(previewRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `quote-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate image:", error);
    }
  }, []);

  const aspectClass = format === "portrait" ? "aspect-[9/16]" : "aspect-square";

  return (
    <div className="space-y-4">
      <div
        ref={previewRef}
        className={`relative w-full overflow-hidden rounded-lg shadow-lg ${aspectClass}`}
        style={
          backgroundImage
            ? {
                backgroundImage: `url(${backgroundImage})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }
            : undefined
        }
      >
        {!backgroundImage ? (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />
        ) : null}

        <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          {quote ? (
            <>
              <p
                className="mb-4 font-serif leading-tight drop-shadow-lg"
                style={{
                  color: textColor,
                  fontSize: `${fontSize}px`,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                &ldquo;{quote}&rdquo;
              </p>
              {author ? (
                <p
                  className="font-light drop-shadow-md"
                  style={{
                    color: textColor,
                    fontSize: `${fontSize * 0.6}px`,
                    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                  }}
                >
                  - {author}
                </p>
              ) : null}
            </>
          ) : (
            <p className="rounded-full bg-black/35 px-4 py-2 text-sm text-white/85">
              Background selected. Add a quote to finish the image.
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={downloadImage}
        disabled={!quote}
        className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700"
      >
        Download Image
      </button>
    </div>
  );
}
