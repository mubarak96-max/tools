"use client";

import { useState } from "react";
import { StyleOptions } from "@/lib/types";
import ImagePicker from "@/components/ImagePicker";
import QuoteSearch from "@/components/QuoteSearch";
import StyleControls from "@/components/StyleControls";
import QuoteCanvas from "@/components/QuoteCanvas";
import DownloadButton from "@/components/DownloadButton";
import { Image, Quote, Palette, Eye, ChevronRight, Sparkles } from "lucide-react";

const DEFAULT_STYLE: StyleOptions = {
  overlayOpacity: 0.45,
  overlayColor: "#000000",
  textColor: "#f5f0e8",
  fontSize: 28,
  fontFamily: "Cormorant Garamond",
  textAlign: "center",
  textPosition: "center",
  showAuthor: true,
  quoteStyle: "minimal",
};

type Step = "image" | "quote" | "style" | "preview";

const STEPS: { id: Step; label: string; icon: typeof Image }[] = [
  { id: "image", label: "Background", icon: Image },
  { id: "quote", label: "Quote", icon: Quote },
  { id: "style", label: "Style", icon: Palette },
  { id: "preview", label: "Preview", icon: Eye },
];

export default function Home() {
  const [activeStep, setActiveStep] = useState<Step>("image");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<{ content: string; author: string } | null>(null);
  const [style, setStyle] = useState<StyleOptions>(DEFAULT_STYLE);

  const isReadyToDownload = !!(selectedImage && selectedQuote);

  const stepIndex = STEPS.findIndex((s) => s.id === activeStep);

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setActiveStep(STEPS[stepIndex + 1].id);
    }
  };

  const getStepStatus = (step: Step) => {
    if (step === "image") return selectedImage ? "done" : "pending";
    if (step === "quote") return selectedQuote ? "done" : "pending";
    if (step === "style") return "ready";
    return "ready";
  };

  return (
    <div className="min-h-screen bg-[var(--ink)]">
      {/* Header */}
      <header className="border-b border-white/6 sticky top-0 z-50 backdrop-blur-md bg-[var(--ink)]/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--gold-dark)] to-[var(--gold)] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[var(--ink)]" />
              </div>
            </div>
            <div>
              <span
                className="text-xl font-light tracking-wide"
                style={{ fontFamily: "Cormorant Garamond, Georgia, serif", color: "var(--parchment)" }}
              >
                Quotecraft
              </span>
            </div>
          </div>

          {/* Step indicators (desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const status = getStepStatus(step.id);
              const isActive = step.id === activeStep;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs tracking-wide transition-all duration-200 ${
                    isActive
                      ? "bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30"
                      : "text-[var(--ash)] hover:text-[var(--parchment)] hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {step.label}
                  {status === "done" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" />
                  )}
                  {i < STEPS.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-white/20 ml-1" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-[var(--ash)] font-mono hidden lg:block">
            Free · No signup required
          </div>
        </div>
      </header>

      {/* Mobile step tabs */}
      <div className="md:hidden flex border-b border-white/8 bg-[var(--ink)]/90 sticky top-16 z-40">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = step.id === activeStep;
          const status = getStepStatus(step.id);
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-all relative ${
                isActive ? "text-[var(--gold)]" : "text-[var(--ash)]"
              }`}
            >
              {isActive && (
                <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[var(--gold)] rounded-t-full" />
              )}
              <Icon className="w-4 h-4" />
              <span className="text-[10px] tracking-wide">{step.label}</span>
              {status === "done" && (
                <span className="absolute top-2 right-3 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 lg:gap-8">

          {/* LEFT: Preview (sticky on desktop) */}
          <div className="lg:order-2 space-y-4">
            <div className="lg:sticky lg:top-28">
              {/* Canvas */}
              <div className="rounded-2xl overflow-hidden border border-white/8 shadow-2xl">
                <QuoteCanvas
                  imageUrl={selectedImage}
                  quote={selectedQuote}
                  style={style}
                />
              </div>

              {/* Status indicators below preview */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className={`px-3 py-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                  selectedImage
                    ? "border-emerald-500/30 bg-emerald-500/8 text-emerald-400"
                    : "border-white/8 bg-white/3 text-[var(--ash)]"
                }`}>
                  <Image className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{selectedImage ? "Image set ✓" : "No image selected"}</span>
                </div>
                <div className={`px-3 py-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                  selectedQuote
                    ? "border-emerald-500/30 bg-emerald-500/8 text-emerald-400"
                    : "border-white/8 bg-white/3 text-[var(--ash)]"
                }`}>
                  <Quote className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{selectedQuote ? "Quote set ✓" : "No quote selected"}</span>
                </div>
              </div>

              {/* Download */}
              <div className="mt-4">
                <DownloadButton
                  disabled={!isReadyToDownload}
                  filename="quotecraft"
                />
                {!isReadyToDownload && (
                  <p className="text-center text-[var(--ash)] text-xs mt-2">
                    {!selectedImage && !selectedQuote
                      ? "Select an image and quote to download"
                      : !selectedImage
                        ? "Select a background image to download"
                        : "Select a quote to download"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Controls panel */}
          <div className="lg:order-1 space-y-4">

            {/* Step: Image */}
            <Section
              id="image"
              activeStep={activeStep}
              title="Choose Background"
              icon={Image}
              badge={selectedImage ? "Set" : undefined}
              onActivate={() => setActiveStep("image")}
            >
              <ImagePicker
                selectedImage={selectedImage}
                onSelectImage={(url) => {
                  setSelectedImage(url);
                  // Auto-advance if no quote yet
                  if (!selectedQuote) {
                    setTimeout(() => setActiveStep("quote"), 300);
                  }
                }}
              />
              {selectedImage && (
                <button
                  onClick={goNext}
                  className="mt-4 w-full py-2.5 rounded-lg text-sm text-[var(--gold)] border border-[var(--gold)]/30 hover:bg-[var(--gold)]/8 transition-all flex items-center justify-center gap-2"
                >
                  Next: Choose Quote <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </Section>

            <div className="gold-line" />

            {/* Step: Quote */}
            <Section
              id="quote"
              activeStep={activeStep}
              title="Choose Quote"
              icon={Quote}
              badge={selectedQuote ? "Set" : undefined}
              onActivate={() => setActiveStep("quote")}
            >
              <QuoteSearch
                selectedQuote={selectedQuote}
                onSelectQuote={(q) => {
                  setSelectedQuote(q);
                  // Auto-advance to style
                  setTimeout(() => setActiveStep("style"), 300);
                }}
              />
              {selectedQuote && (
                <button
                  onClick={goNext}
                  className="mt-4 w-full py-2.5 rounded-lg text-sm text-[var(--gold)] border border-[var(--gold)]/30 hover:bg-[var(--gold)]/8 transition-all flex items-center justify-center gap-2"
                >
                  Next: Customize Style <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </Section>

            <div className="gold-line" />

            {/* Step: Style */}
            <Section
              id="style"
              activeStep={activeStep}
              title="Customize Style"
              icon={Palette}
              onActivate={() => setActiveStep("style")}
            >
              <StyleControls style={style} onChange={setStyle} />
            </Section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/6 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[var(--ash)] text-xs">
            Images provided by{" "}
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-[var(--gold)] hover:underline">
              Unsplash
            </a>
            {" "}· Quotes from{" "}
            <a href="https://quotable.io" target="_blank" rel="noopener noreferrer" className="text-[var(--gold)] hover:underline">
              Quotable
            </a>
            {" "}· Built with Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}

// Collapsible section component
function Section({
  id,
  activeStep,
  title,
  icon: Icon,
  badge,
  children,
  onActivate,
}: {
  id: Step;
  activeStep: Step;
  title: string;
  icon: typeof Image;
  badge?: string;
  children: React.ReactNode;
  onActivate: () => void;
}) {
  const isActive = activeStep === id;

  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
      isActive
        ? "border-[var(--gold)]/25 bg-white/3"
        : "border-white/6 bg-white/1"
    }`}>
      <button
        onClick={onActivate}
        className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all ${
          isActive ? "cursor-default" : "hover:bg-white/3 cursor-pointer"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            isActive
              ? "bg-[var(--gold)] text-[var(--ink)]"
              : "bg-white/6 text-[var(--ash)]"
          }`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className={`font-medium text-sm tracking-wide ${
            isActive ? "text-[var(--parchment)]" : "text-[var(--ash)]"
          }`}>
            {title}
          </span>
        </div>
        {badge && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
            {badge}
          </span>
        )}
      </button>

      {isActive && (
        <div className="px-5 pb-5 animate-fade-up">
          {children}
        </div>
      )}
    </div>
  );
}
