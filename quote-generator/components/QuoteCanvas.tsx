"use client";

import { StyleOptions } from "@/lib/types";

interface QuoteCanvasProps {
  imageUrl: string | null;
  quote: { content: string; author: string } | null;
  style: StyleOptions;
}

const CANVAS_ASPECT = 16 / 9;

export default function QuoteCanvas({ imageUrl, quote, style }: QuoteCanvasProps) {
  const positionClass = {
    top: "justify-start pt-10",
    center: "justify-center",
    bottom: "justify-end pb-10",
  }[style.textPosition];

  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[style.textAlign];

  const getQuoteContent = () => {
    if (!quote) return null;

    const baseStyle = {
      fontFamily: style.fontFamily,
      fontSize: `${style.fontSize}px`,
      color: style.textColor,
      textAlign: style.textAlign,
      lineHeight: style.fontFamily === "Bebas Neue" ? "1.1" : "1.5",
    };

    switch (style.quoteStyle) {
      case "minimal":
        return (
          <div className={`flex flex-col gap-3 ${alignClass} max-w-[80%]`}>
            <p style={baseStyle} className="font-light drop-shadow-lg">
              &ldquo;{quote.content}&rdquo;
            </p>
            {style.showAuthor && (
              <p
                style={{
                  color: style.textColor,
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: `${Math.max(12, style.fontSize * 0.45)}px`,
                  opacity: 0.8,
                  letterSpacing: "0.1em",
                  textAlign: style.textAlign,
                }}
              >
                — {quote.author}
              </p>
            )}
          </div>
        );

      case "boxed":
        return (
          <div
            className={`flex flex-col gap-3 ${alignClass} max-w-[80%] p-6 backdrop-blur-sm`}
            style={{
              border: `1px solid ${style.textColor}40`,
              backgroundColor: `${style.overlayColor}60`,
            }}
          >
            <p style={baseStyle} className="drop-shadow-lg">
              &ldquo;{quote.content}&rdquo;
            </p>
            {style.showAuthor && (
              <p
                style={{
                  color: style.textColor,
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: `${Math.max(12, style.fontSize * 0.45)}px`,
                  opacity: 0.8,
                  letterSpacing: "0.1em",
                  textAlign: style.textAlign,
                }}
              >
                — {quote.author}
              </p>
            )}
          </div>
        );

      case "underline":
        return (
          <div className={`flex flex-col gap-4 ${alignClass} max-w-[80%]`}>
            <p style={baseStyle} className="drop-shadow-lg">
              {quote.content}
            </p>
            <div
              style={{ backgroundColor: style.textColor, opacity: 0.6 }}
              className={`h-px ${style.textAlign === "center" ? "w-24 self-center" : style.textAlign === "right" ? "w-24 self-end" : "w-24"}`}
            />
            {style.showAuthor && (
              <p
                style={{
                  color: style.textColor,
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: `${Math.max(12, style.fontSize * 0.45)}px`,
                  opacity: 0.8,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textAlign: style.textAlign,
                }}
              >
                {quote.author}
              </p>
            )}
          </div>
        );

      case "serif-large":
        return (
          <div className={`flex flex-col gap-3 ${alignClass} max-w-[85%] relative`}>
            {/* Large decorative quote mark */}
            <span
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontSize: `${style.fontSize * 4}px`,
                color: style.textColor,
                opacity: 0.15,
                lineHeight: 0.8,
                position: "absolute",
                top: `-${style.fontSize * 1.5}px`,
                left: style.textAlign === "right" ? "auto" : style.textAlign === "center" ? "50%" : "0",
                transform: style.textAlign === "center" ? "translateX(-50%)" : "none",
                right: style.textAlign === "right" ? "0" : "auto",
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              &ldquo;
            </span>
            <p
              style={{
                ...baseStyle,
                fontStyle: "italic",
                fontWeight: 300,
              }}
              className="drop-shadow-lg relative z-10"
            >
              {quote.content}
            </p>
            {style.showAuthor && (
              <p
                style={{
                  color: style.textColor,
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: `${Math.max(14, style.fontSize * 0.5)}px`,
                  fontStyle: "italic",
                  opacity: 0.9,
                  textAlign: style.textAlign,
                }}
              >
                — {quote.author}
              </p>
            )}
          </div>
        );
    }
  };

  const isEmpty = !imageUrl && !quote;

  return (
    <div
      id="quote-preview"
      className="relative w-full overflow-hidden rounded-xl"
      style={{ aspectRatio: `${CANVAS_ASPECT}` }}
    >
      {/* Background Image */}
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
          crossOrigin="anonymous"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1612] via-[#0f0e0c] to-[#241f18]" />
      )}

      {/* Overlay */}
      {(imageUrl || !isEmpty) && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: style.overlayColor,
            opacity: style.overlayOpacity,
          }}
        />
      )}

      {/* Content */}
      <div className={`absolute inset-0 flex flex-col px-12 ${positionClass}`}>
        {getQuoteContent()}
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="text-[var(--ash)] text-center">
            <div className="text-5xl mb-3 opacity-30" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              &ldquo;&rdquo;
            </div>
            <p className="text-sm opacity-50 tracking-widest uppercase font-light">
              Your quote will appear here
            </p>
          </div>
        </div>
      )}

      {/* Decorative corner marks */}
      {!isEmpty && (
        <>
          <div className="absolute top-3 left-3 w-6 h-6 border-t border-l" style={{ borderColor: `${style.textColor}30` }} />
          <div className="absolute top-3 right-3 w-6 h-6 border-t border-r" style={{ borderColor: `${style.textColor}30` }} />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l" style={{ borderColor: `${style.textColor}30` }} />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r" style={{ borderColor: `${style.textColor}30` }} />
        </>
      )}
    </div>
  );
}
