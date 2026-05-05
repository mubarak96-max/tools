"use client";

import { useState } from "react";
import { Download, Loader2, Check } from "lucide-react";

interface DownloadButtonProps {
  disabled?: boolean;
  filename?: string;
}

export default function DownloadButton({ disabled = false, filename = "quote" }: DownloadButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const handleDownload = async () => {
    if (state !== "idle" || disabled) return;
    setState("loading");

    try {
      // Dynamically import html2canvas to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default;
      const el = document.getElementById("quote-preview");

      if (!el) {
        setState("idle");
        return;
      }

      const canvas = await html2canvas(el, {
        useCORS: true,
        allowTaint: false,
        scale: 2,
        logging: false,
        backgroundColor: null,
        imageTimeout: 15000,
      });

      const timestamp = new Date().toISOString().slice(0, 10);
      const link = document.createElement("a");
      link.download = `${filename}-${timestamp}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();

      setState("done");
      setTimeout(() => setState("idle"), 2500);
    } catch (error) {
      console.error("Download error:", error);
      setState("idle");
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || state !== "idle"}
      className={`
        relative w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-medium
        text-sm tracking-wide transition-all duration-300
        ${disabled
          ? "bg-white/5 text-[var(--ash)] border border-white/8 cursor-not-allowed"
          : state === "done"
            ? "bg-emerald-600/20 border border-emerald-500/40 text-emerald-400"
            : "btn-gold text-[var(--ink)]"
        }
      `}
    >
      {state === "loading" ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating…
        </>
      ) : state === "done" ? (
        <>
          <Check className="w-4 h-4" />
          Downloaded!
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download PNG
        </>
      )}
    </button>
  );
}
