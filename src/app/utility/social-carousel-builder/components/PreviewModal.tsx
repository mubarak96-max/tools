'use client';

import React, { useEffect, useState } from 'react';
import { PreviewModalProps } from '../types';
import { renderSlideToCanvas } from '../utils/export';

export const PreviewModal: React.FC<PreviewModalProps> = ({
    slides,
    isOpen,
    onClose,
    platform,
    format,
    initialSlide = 0,
    projectName,
    autoPlay = false,
    showControls = true,
}) => {
    const [currentSlide, setCurrentSlide] = useState(initialSlide);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isRendering, setIsRendering] = useState(false);
    const [renderError, setRenderError] = useState('');
    const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        setCurrentSlide(Math.min(initialSlide, Math.max(slides.length - 1, 0)));
        setIsAutoPlaying(autoPlay);
    }, [autoPlay, initialSlide, isOpen, slides.length]);

    useEffect(() => {
        if (!isOpen || !slides.length) {
            return;
        }

        let isCancelled = false;

        const renderPreview = async () => {
            setIsRendering(true);
            setRenderError('');

            try {
                const canvas = await renderSlideToCanvas(slides[currentSlide], format);
                if (!isCancelled) {
                    setPreviewUrl(canvas.toDataURL('image/png'));
                }
            } catch (error) {
                if (!isCancelled) {
                    setRenderError(error instanceof Error ? error.message : 'Unable to render the preview.');
                }
            } finally {
                if (!isCancelled) {
                    setIsRendering(false);
                }
            }
        };

        void renderPreview();

        return () => {
            isCancelled = true;
        };
    }, [currentSlide, format, isOpen, slides]);

    useEffect(() => {
        if (!isOpen || !isAutoPlaying || slides.length <= 1) {
            return;
        }

        const interval = window.setInterval(() => {
            setCurrentSlide((current) => (current + 1) % slides.length);
        }, 2800);

        return () => window.clearInterval(interval);
    }, [isAutoPlaying, isOpen, slides.length]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
                return;
            }

            if (event.key === 'ArrowRight') {
                setCurrentSlide((current) => (current + 1) % slides.length);
            }

            if (event.key === 'ArrowLeft') {
                setCurrentSlide((current) => (current - 1 + slides.length) % slides.length);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, slides.length]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Carousel slideshow preview"
        >
            <div className="relative flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5 text-white">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                            {platform.name} preview
                        </p>
                        <h2 className="mt-1 text-2xl font-semibold">
                            {projectName || 'Carousel preview'}
                        </h2>
                        <p className="mt-1 text-sm text-slate-300">
                            {format.name} | {format.dimensions.width} x {format.dimensions.height} | Slide {currentSlide + 1} of {slides.length}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsAutoPlaying((current) => !current)}
                            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-300 hover:text-cyan-200"
                        >
                            {isAutoPlaying ? 'Pause autoplay' : 'Start autoplay'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
                        >
                            Close
                        </button>
                    </div>
                </div>

                <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[minmax(0,1fr)_18rem]">
                    <div className="flex min-h-[32rem] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.22),_transparent_40%),linear-gradient(180deg,_rgba(15,23,42,1),_rgba(2,6,23,1))] p-6">
                        <div className="relative w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                            <div className="absolute left-6 top-6 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                                {platform.name}
                            </div>
                            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950">
                                {isRendering ? (
                                    <div className="flex aspect-[4/5] min-h-[26rem] items-center justify-center text-sm text-slate-300">
                                        Rendering preview...
                                    </div>
                                ) : renderError ? (
                                    <div className="flex aspect-[4/5] min-h-[26rem] items-center justify-center px-6 text-center text-sm text-rose-200">
                                        {renderError}
                                    </div>
                                ) : (
                                    <img
                                        src={previewUrl}
                                        alt={`Preview of slide ${currentSlide + 1}`}
                                        className="h-auto w-full transition-opacity duration-300"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <aside className="flex flex-col gap-4 border-l border-white/10 bg-slate-950/70 p-5 text-white">
                        {showControls ? (
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setCurrentSlide((current) => (current - 1 + slides.length) % slides.length)}
                                    disabled={slides.length <= 1}
                                    className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium transition hover:border-cyan-300 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCurrentSlide((current) => (current + 1) % slides.length)}
                                    disabled={slides.length <= 1}
                                    className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium transition hover:border-cyan-300 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        ) : null}

                        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Preview checks
                            </p>
                            <ul className="mt-3 space-y-2 text-sm text-slate-200">
                                <li>Review text spacing and line breaks on every slide.</li>
                                <li>Confirm image crops match the selected fit mode.</li>
                                <li>Use arrow keys to inspect the sequence before export.</li>
                            </ul>
                        </div>

                        <div className="space-y-2">
                            {slides.map((slide, index) => (
                                <button
                                    key={slide.id}
                                    type="button"
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                                        index === currentSlide
                                            ? 'border-cyan-300 bg-cyan-400/10 text-cyan-100'
                                            : 'border-white/10 bg-white/[0.03] text-slate-200 hover:border-white/20 hover:bg-white/[0.06]'
                                    }`}
                                >
                                    <p className="text-sm font-semibold">Slide {index + 1}</p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {slide.elements.length} editable element{slide.elements.length !== 1 ? 's' : ''}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};
