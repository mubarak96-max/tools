"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import type { CarouselSlide, CarouselTemplate } from "@/lib/carousel/types";

type SlideRendererProps = {
    slide: CarouselSlide;
    template: CarouselTemplate;
    className?: string;
    transparent?: boolean;
};

const cn = (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(" ");

const getTitleSize = (size: number) => `${Math.max(28, size * 0.78)}px`;
const getBodySize = (size: number) => `${Math.max(14, size * 0.94)}px`;

function Badge({
    text,
    template,
}: {
    text: string;
    template: CarouselTemplate;
}) {
    return (
        <span
            className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide"
            style={{
                backgroundColor: `${template.styles.colors.primary}18`,
                color: template.styles.colors.text,
                border: `1px solid ${template.styles.colors.primary}30`,
            }}
        >
            {text}
        </span>
    );
}

function CTAButton({
    text,
    template,
}: {
    text: string;
    template: CarouselTemplate;
}) {
    return (
        <span
            className="inline-flex rounded-full px-4 py-2 text-xs font-semibold sm:text-sm"
            style={{
                backgroundColor: template.styles.colors.primary,
                color: "#ffffff",
            }}
        >
            {text}
        </span>
    );
}

function TextBlock({
    slide,
    template,
    align = "left",
    compact = false,
}: {
    slide: CarouselSlide;
    template: CarouselTemplate;
    align?: "left" | "center";
    compact?: boolean;
}) {
    const { title, body, badge, bullets, buttonText } = slide.data;

    const titleStyle: CSSProperties = {
        color: template.styles.colors.text,
        fontFamily: template.styles.typography.fontTitle,
        fontWeight: template.styles.typography.fontWeightTitle ?? 700,
        fontSize: getTitleSize(template.styles.typography.titleSize),
        lineHeight: 1.06,
        textAlign: align,
    };

    const bodyStyle: CSSProperties = {
        color: template.styles.colors.text,
        fontFamily: template.styles.typography.fontBody,
        fontWeight: template.styles.typography.fontWeightBody ?? 400,
        fontSize: getBodySize(template.styles.typography.bodySize),
        lineHeight: template.styles.typography.lineHeight,
        textAlign: align,
    };

    return (
        <div
            className={cn(
                "relative z-[2] flex flex-col",
                align === "center" && "items-center",
                compact ? "gap-3" : "gap-4"
            )}
        >
            {badge ? <Badge text={badge} template={template} /> : null}

            {title ? (
                <h2 className="whitespace-pre-wrap" style={titleStyle}>
                    {title}
                </h2>
            ) : null}

            {body ? (
                <p
                    className={cn(
                        "whitespace-pre-wrap",
                        align === "left" ? "max-w-[34ch]" : "max-w-[32ch]"
                    )}
                    style={bodyStyle}
                >
                    {body}
                </p>
            ) : null}

            {bullets?.length ? (
                <ul className={cn("space-y-2", align === "center" && "text-center")}>
                    {bullets.map((bullet, index) => (
                        <li
                            key={`${bullet}-${index}`}
                            className={cn(
                                "flex gap-2",
                                align === "center" ? "justify-center" : "justify-start"
                            )}
                            style={bodyStyle}
                        >
                            <span className="mt-[0.52em] inline-block h-1.5 w-1.5 rounded-full bg-current" />
                            <span>{bullet}</span>
                        </li>
                    ))}
                </ul>
            ) : null}

            {buttonText ? (
                <div className={cn("pt-2", align === "center" && "flex justify-center")}>
                    <CTAButton text={buttonText} template={template} />
                </div>
            ) : null}
        </div>
    );
}

function FramedImage({
    src,
    alt,
    behavior = "framed",
    rounded = true,
    className,
}: {
    src: string;
    alt: string;
    behavior?: string;
    rounded?: boolean;
    className?: string;
}) {
    const isHero = behavior === "hero-left" || behavior === "hero-right";
    const isOverlap = behavior === "overlap-next";

    return (
        <div
            className={cn(
                "relative transition-all duration-500",
                behavior === "framed" && "overflow-hidden border border-black/10 bg-white/40 shadow-sm",
                behavior === "none" && "overflow-hidden",
                isHero && "overflow-hidden scale-105 shadow-xl",
                isOverlap && "overflow-hidden border-2 border-white/20 shadow-lg",
                rounded ? "rounded-[24px]" : "rounded-none",
                className
            )}
        >
            <Image
                src={src}
                alt={alt}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 560px"
            />
        </div>
    );
}

function BackgroundImage({
    src,
    opacity = 0.3,
}: {
    src: string;
    opacity?: number;
}) {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
                src={src}
                alt=""
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 560px"
            />
            <div className="absolute inset-0 bg-black/20" style={{ opacity }} />
        </div>
    );
}

function DecorativeOverlay({ template }: { template: CarouselTemplate }) {
    return (
        <>
            <div
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl"
                style={{ backgroundColor: `${template.styles.colors.primary}20` }}
            />
            <div
                className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full blur-2xl"
                style={{ backgroundColor: `${template.styles.colors.accent}18` }}
            />
        </>
    );
}

function SplitLeftLayout({
    slide,
    template,
}: {
    slide: CarouselSlide;
    template: CarouselTemplate;
}) {
    const hasImage = !!slide.data.image;

    return (
        <div className="relative -m-[var(--slide-padding)] flex h-[calc(100%+2*var(--slide-padding))] w-[calc(100%+2*var(--slide-padding))] flex-col md:flex-row">
            <div className="flex flex-1 items-center p-[var(--slide-padding)] relative z-[2]">
                <TextBlock slide={slide} template={template} align="left" />
            </div>

            {hasImage ? (
                <div className="relative h-[280px] w-full md:h-full md:w-1/2 overflow-hidden border-l border-black/5">
                    <Image
                        src={slide.data.image!}
                        alt={slide.data.title || ""}
                        fill
                        unoptimized
                        className="object-cover"
                    />
                </div>
            ) : null}
        </div>
    );
}

function SplitRightLayout({
    slide,
    template,
}: {
    slide: CarouselSlide;
    template: CarouselTemplate;
}) {
    const hasImage = !!slide.data.image;

    return (
        <div className="relative -m-[var(--slide-padding)] flex h-[calc(100%+2*var(--slide-padding))] w-[calc(100%+2*var(--slide-padding))] flex-col md:flex-row">
            {hasImage ? (
                <div className="relative h-[280px] w-full md:h-full md:w-1/2 overflow-hidden order-2 md:order-1 border-r border-black/5">
                    <Image
                        src={slide.data.image!}
                        alt={slide.data.title || ""}
                        fill
                        unoptimized
                        className="object-cover"
                    />
                </div>
            ) : null}

            <div className="flex flex-1 items-center p-[var(--slide-padding)] relative z-[2] order-1 md:order-2">
                <TextBlock slide={slide} template={template} align="left" />
            </div>
        </div>
    );
}

function TopLayout({
    slide,
    template,
}: {
    slide: CarouselSlide;
    template: CarouselTemplate;
}) {
    return (
        <div className="relative flex h-full flex-col justify-start">
            <TextBlock slide={slide} template={template} align="left" />
        </div>
    );
}

function CenterLayout({
    slide,
    template,
}: {
    slide: CarouselSlide;
    template: CarouselTemplate;
}) {
    return (
        <div className="relative flex h-full items-center justify-center p-6">
            <div className="w-full max-w-[42ch]">
                <TextBlock
                    slide={slide}
                    template={template}
                    align="center"
                />
            </div>
        </div>
    );
}

function ImageTopLayout({
    slide,
    template,
}: {
    slide: CarouselSlide;
    template: CarouselTemplate;
}) {
    return (
        <div className="relative flex h-full flex-col gap-5">
            {slide.data.image ? (
                <FramedImage
                    src={slide.data.image}
                    alt={slide.data.title || "Slide image"}
                    className="h-[220px] w-full shrink-0"
                />
            ) : null}

            <div className="min-h-0 flex-1">
                <TextBlock slide={slide} template={template} align="left" compact />
            </div>
        </div>
    );
}

function ImageLeftLayout({
    slide,
    template,
}: {
    slide: CarouselSlide;
    template: CarouselTemplate;
}) {
    const isOverlap = slide.imageBehavior === "overlap-next";

    return (
        <div className="relative flex h-full flex-col gap-6 md:grid md:grid-cols-[0.8fr_1.2fr] md:items-center">
            {slide.data.image ? (
                <div 
                    className={cn(
                        "relative -rotate-1 transform transition-all duration-500 hover:rotate-0",
                        isOverlap && "translate-x-4 md:translate-x-12 scale-110 z-10"
                    )}
                >
                    <FramedImage
                        src={slide.data.image}
                        alt={slide.data.title || ""}
                        behavior={slide.imageBehavior}
                        className="h-[240px] w-full md:h-[300px]"
                    />
                </div>
            ) : null}

            <div className="md:pl-4">
                <TextBlock slide={slide} template={template} align="left" compact />
            </div>
        </div>
    );
}

function ImageRightLayout({
    slide,
    template,
}: {
    slide: CarouselSlide;
    template: CarouselTemplate;
}) {
    return (
        <div className="relative flex h-full flex-col gap-6 md:grid md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div className="order-2 md:order-1 md:pr-4">
                <TextBlock slide={slide} template={template} align="left" compact />
            </div>

            {slide.data.image ? (
                <div className="order-1 relative rotate-1 transform transition-transform hover:rotate-0 md:order-2">
                    <FramedImage
                        src={slide.data.image}
                        alt={slide.data.title || ""}
                        className="h-[240px] w-full md:h-[300px]"
                    />
                </div>
            ) : null}
        </div>
    );
}

function FullImageLayout({
    slide,
    template,
}: {
    slide: CarouselSlide;
    template: CarouselTemplate;
}) {
    return (
        <div className="relative flex h-full items-end">
            {slide.data.image ? <BackgroundImage src={slide.data.image} opacity={0.28} /> : null}

            <div className="relative z-[2] w-full rounded-[28px] border border-white/10 bg-black/20 p-5 backdrop-blur-[2px]">
                <TextBlock slide={slide} template={template} align="left" compact />
            </div>
        </div>
    );
}

function DualColumnLayout({
    slide,
    template,
}: {
    slide: CarouselSlide;
    template: CarouselTemplate;
}) {
    const { title, body, title2, body2, badge, bullets, buttonText } = slide.data;

    return (
        <div className="relative flex h-full items-center">
            <div className="grid h-full w-full grid-cols-1 gap-8 md:grid-cols-2">
                {/* Left Column: Primary Content */}
                <div className="flex flex-col justify-center gap-4 border-b border-black/5 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-8">
                    {badge ? <Badge text={badge} template={template} /> : null}
                    {title ? (
                        <h2 
                            className="whitespace-pre-wrap" 
                            style={{
                                color: template.styles.colors.text,
                                fontFamily: template.styles.typography.fontTitle,
                                fontWeight: template.styles.typography.fontWeightTitle ?? 700,
                                fontSize: getTitleSize(template.styles.typography.titleSize * 0.9),
                                lineHeight: 1.1,
                            }}
                        >
                            {title}
                        </h2>
                    ) : null}
                    {body ? (
                        <p
                            className="whitespace-pre-wrap opacity-90"
                            style={{
                                color: template.styles.colors.text,
                                fontFamily: template.styles.typography.fontBody,
                                fontSize: getBodySize(template.styles.typography.bodySize * 0.95),
                                lineHeight: 1.5,
                            }}
                        >
                            {body}
                        </p>
                    ) : null}
                </div>

                {/* Right Column: Secondary Content */}
                <div className="flex flex-col justify-center gap-4 md:pl-4">
                    {title2 ? (
                        <h2 
                            className="whitespace-pre-wrap" 
                            style={{
                                color: template.styles.colors.text,
                                fontFamily: template.styles.typography.fontTitle,
                                fontWeight: template.styles.typography.fontWeightTitle ?? 700,
                                fontSize: getTitleSize(template.styles.typography.titleSize * 0.9),
                                lineHeight: 1.1,
                            }}
                        >
                            {title2}
                        </h2>
                    ) : null}
                    {body2 ? (
                        <p
                            className="whitespace-pre-wrap opacity-90"
                            style={{
                                color: template.styles.colors.text,
                                fontFamily: template.styles.typography.fontBody,
                                fontSize: getBodySize(template.styles.typography.bodySize * 0.95),
                                lineHeight: 1.5,
                            }}
                        >
                            {body2}
                        </p>
                    ) : null}

                    {bullets?.length ? (
                        <ul className="space-y-1.5 mt-2">
                            {bullets.map((bullet, index) => (
                                <li key={index} className="flex gap-2">
                                    <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                                    <span className="text-[13px] opacity-90 leading-tight">{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    ) : null}

                    {buttonText ? (
                        <div className="pt-2">
                            <CTAButton text={buttonText} template={template} />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function IntroEmojiLayout({
    slide,
    template,
}: {
    slide: CarouselSlide;
    template: CarouselTemplate;
}) {
    const { emoji } = slide.data;
    return (
        <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
             {emoji && (
                 <div className="mb-6 text-7xl sm:text-8xl">
                     {emoji}
                 </div>
             )}
             <div className="w-full max-w-[42ch]">
                <TextBlock
                    slide={slide}
                    template={template}
                    align="center"
                />
            </div>
        </div>
    );
}

function IntroHeadshotLayout({
    slide,
    template,
}: {
    slide: CarouselSlide;
    template: CarouselTemplate;
}) {
    const { image, imagePosition = "top" } = slide.data;
    return (
        <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
             {image && imagePosition === "top" && (
                 <div className="relative mb-6 h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-xl">
                     <Image src={image} alt="Headshot" fill className="object-cover" unoptimized />
                 </div>
             )}
             
             <div className="w-full max-w-[42ch]">
                <TextBlock slide={slide} template={template} align="center" />
            </div>

            {image && imagePosition === "bottom" && (
                 <div className="relative mt-8 h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-lg">
                     <Image src={image} alt="Headshot" fill className="object-cover" unoptimized />
                 </div>
             )}
        </div>
    );
}

function IntroImageLayout({
    slide,
    template,
}: {
    slide: CarouselSlide;
    template: CarouselTemplate;
}) {
    const { image, imageScale = 1 } = slide.data;
    return (
        <div className="relative flex h-full flex-col justify-center p-8">
            <div className="relative z-10 w-full max-w-[36ch]">
                <TextBlock slide={slide} template={template} align="left" />
            </div>

            {image && (
                <div 
                    className="absolute bottom-0 left-0 z-0 h-2/3 w-2/3 origin-bottom-left transition-transform duration-500"
                    style={{ transform: `scale(${imageScale}) translate(-10%, 10%)` }}
                >
                    <Image 
                        src={image} 
                        alt="Decor" 
                        fill 
                        className="object-contain object-bottom-left grayscale-[0.2] opacity-90 drop-shadow-2xl" 
                        unoptimized 
                    />
                </div>
            )}
        </div>
    );
}

export default function SlideRenderer({
    slide,
    template,
    className,
    transparent = false,
}: SlideRendererProps) {
    const wrapperStyle: CSSProperties = {
        backgroundColor: transparent ? "transparent" : template.styles.colors.background,
        color: template.styles.colors.text,
        borderRadius: `${template.styles.spacing.radius + 10}px`,
        padding: `${template.styles.spacing.padding}px`,
        "--slide-padding": `${template.styles.spacing.padding}px`,
    } as any;

    const hasBorder = !transparent && !className?.includes("border-0");

    return (
        <div
            className={cn(
                "relative h-full w-full overflow-hidden",
                !transparent && "border border-black/10 shadow-sm",
                className
            )}
            style={wrapperStyle}
        >
            {template.styles.decorations?.shapes ? <DecorativeOverlay template={template} /> : null}

            {/* Background Faded Behavior */}
            {slide.imageBehavior === "background-faded" && slide.data.image ? (
                <BackgroundImage src={slide.data.image} opacity={0.12} />
            ) : null}

            <div className="relative z-[1] h-full w-full">
                {slide.layout === "split-left" ? (
                    <SplitLeftLayout slide={slide} template={template} />
                ) : slide.layout === "split-right" ? (
                    <SplitRightLayout slide={slide} template={template} />
                ) : slide.layout === "top" ? (
                    <TopLayout slide={slide} template={template} />
                ) : slide.layout === "center" || slide.layout === "intro-standard" ? (
                    <CenterLayout slide={slide} template={template} />
                ) : slide.layout === "intro-emoji" ? (
                    <IntroEmojiLayout slide={slide} template={template} />
                ) : slide.layout === "intro-headshot" ? (
                    <IntroHeadshotLayout slide={slide} template={template} />
                ) : slide.layout === "intro-image" ? (
                    <IntroImageLayout slide={slide} template={template} />
                ) : slide.layout === "image-top" ? (
                    <ImageTopLayout slide={slide} template={template} />
                ) : slide.layout === "image-left" ? (
                    <ImageLeftLayout slide={slide} template={template} />
                ) : slide.layout === "image-right" ? (
                    <ImageRightLayout slide={slide} template={template} />
                ) : slide.layout === "full-image" ? (
                    <FullImageLayout slide={slide} template={template} />
                ) : slide.layout === "dual-column" ? (
                    <DualColumnLayout slide={slide} template={template} />
                ) : (
                    <TopLayout slide={slide} template={template} />
                )}
            </div>
        </div>
    );
}