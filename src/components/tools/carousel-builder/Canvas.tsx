"use client";

import SlideRenderer from "./SlideRenderer";
import type {
  BackgroundPreset,
  CarouselSlide,
  CarouselTemplate,
} from "@/lib/carousel/types";
import { getBackgroundStyle } from "@/lib/carousel/renderBackground";

type CanvasProps = {
  slide?: CarouselSlide;
  template?: CarouselTemplate;
  background?: BackgroundPreset;
  slideIndex?: number;
  totalSlides?: number;
  className?: string;
};

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export default function Canvas({
  slide,
  template,
  background,
  slideIndex = 0,
  totalSlides = 1,
  className,
}: CanvasProps) {
  if (!slide || !template) {
    return (
      <div
        className={cn(
          "flex aspect-square w-full items-center justify-center rounded-[26px] border border-gray-200 bg-white text-sm text-gray-400 shadow-sm",
          className
        )}
      >
        No slide selected
      </div>
    );
  }

  const bgStyle = background
    ? getBackgroundStyle(
        background.pattern,
        background.opacity,
        template.styles.colors.primary
      )
    : undefined;

  const segmentWidthPercent = 100 / Math.max(totalSlides, 1);
  const backgroundPositionX =
    totalSlides > 1 ? `${(slideIndex / Math.max(totalSlides - 1, 1)) * 100}%` : "0%";

  return (
    <div
      className={cn(
        "relative aspect-[4/5] w-full overflow-hidden rounded-[26px] border border-gray-200 shadow-sm",
        className
      )}
      style={{
        backgroundColor: template.styles.colors.background || "#ffffff",
      }}
    >
      {background ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            ...bgStyle,
            opacity: background.opacity,
            backgroundSize:
              background.type === "continuous"
                ? `${Math.max(totalSlides, 1) * 100}% 100%, ${
                    Math.max(totalSlides, 1) * 100
                  }% 100%`
                : bgStyle?.backgroundSize,
            backgroundPosition:
              background.type === "continuous"
                ? `${backgroundPositionX} 0%`
                : "0% 0%",
          }}
        />
      ) : null}

      <div className="relative z-[1] h-full w-full">
        <SlideRenderer
          slide={slide}
          template={template}
          transparent
          className="h-full w-full rounded-none border-0 shadow-none"
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex justify-between px-3 py-3">
        <span className="rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-600 backdrop-blur-sm">
          {slide.role}
        </span>

        <span className="rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-[10px] font-medium text-gray-500 backdrop-blur-sm">
          {slideIndex + 1}/{totalSlides}
        </span>
      </div>

      {background?.type === "continuous" ? (
        <div
          className="pointer-events-none absolute bottom-0 left-0 z-[2] h-1"
          style={{
            width: `${segmentWidthPercent}%`,
            transform: `translateX(${slideIndex * 100}%)`,
            backgroundColor: `${template.styles.colors.primary}`,
            opacity: 0.35,
          }}
        />
      ) : null}
    </div>
  );
}
