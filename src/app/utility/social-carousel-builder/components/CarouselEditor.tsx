'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CarouselEditorProps } from '../types';
import { getWrappedTextLayout } from '../utils/canvasUtils';
import { fileToDataURL, isValidFileSize, isValidImageType } from '../utils';
import { PlatformCompatibilityWarning } from './PlatformCompatibilityWarning';
import { PreviewModal } from './PreviewModal';
import { SlideCanvas } from './SlideCanvas';

export const CarouselEditor: React.FC<CarouselEditorProps> = ({
    slides,
    currentSlide,
    template,
    platform,
    format,
    onSlideUpdate,
    onCurrentSlideChange,
    onSlideAdd,
    onSlideDelete,
    onSlideReorder,
    onManualSave,
    onExportCurrent,
    onExportAll,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    saveStatus,
    exportStatus,
    isExporting,
}) => {
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
    const [imageNotice, setImageNotice] = useState('');
    const [textNotice, setTextNotice] = useState('');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [draggedSlideIndex, setDraggedSlideIndex] = useState<number | null>(null);
    const slide = slides[currentSlide];

    const elementCounts = useMemo(() => {
        return slide.elements.reduce(
            (counts, element) => {
                counts[element.type] += 1;
                return counts;
            },
            { text: 0, image: 0, shape: 0 }
        );
    }, [slide.elements]);

    const updateBackgroundColor = (value: string) => {
        onSlideUpdate(currentSlide, {
            ...slide,
            backgroundColor: value,
        });
    };

    const imageElements = slide.elements.filter((element) => element.type === 'image');
    const overflowingTextElements = useMemo(() => {
        if (typeof document === 'undefined') {
            return [];
        }

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
            return [];
        }

        return slide.elements.flatMap((element) => {
            if (element.type !== 'text' || typeof element.content !== 'string') {
                return [];
            }

            const fontSize = element.style.fontSize || 28;
            const fontFamily = element.style.fontFamily || 'Inter, sans-serif';
            const fontWeight = element.style.fontWeight || 'normal';
            context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

            const layout = getWrappedTextLayout(
                context,
                element.content,
                Math.max(20, element.dimensions.width - 24),
                fontSize * 1.2,
                element.dimensions.height - 24
            );

            if (!layout.isOverflowing) {
                return [];
            }

            return [{
                id: element.id,
                fontSize,
                hiddenHeight: Math.ceil(layout.height - (element.dimensions.height - 24)),
            }];
        });
    }, [slide.elements]);

    const updateImageElement = async (elementId: string, file: File | null) => {
        if (!file) {
            return;
        }
        if (!isValidImageType(file)) {
            setImageNotice('Please upload a JPG, PNG, GIF, or WebP image.');
            return;
        }
        if (!isValidFileSize(file, 10)) {
            setImageNotice('Image files must be 10MB or smaller.');
            return;
        }

        const dataUrl = await fileToDataURL(file);
        const updatedSlide = {
            ...slide,
            elements: slide.elements.map((element) =>
                element.id === elementId && typeof element.content !== 'string'
                    ? {
                        ...element,
                        content: {
                            ...element.content,
                            src: dataUrl,
                            alt: file.name,
                        },
                    }
                    : element
            ),
        };
        setImageNotice(`Updated image element "${elementId}".`);
        onSlideUpdate(currentSlide, updatedSlide);
    };

    const handleDeleteCurrentSlide = () => {
        if (slides.length <= 1) {
            return;
        }

        const shouldDelete = window.confirm(`Delete slide ${currentSlide + 1}? This action cannot be undone.`);
        if (!shouldDelete) {
            return;
        }

        onSlideDelete(currentSlide);
    };

    const autoFitTextElement = (elementId: string) => {
        const element = slide.elements.find((candidate) => candidate.id === elementId);
        if (!element || element.type !== 'text' || typeof element.content !== 'string' || typeof document === 'undefined') {
            return;
        }

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
            setTextNotice('Text auto-fit is not available in this browser.');
            return;
        }

        const fontFamily = element.style.fontFamily || 'Inter, sans-serif';
        const fontWeight = element.style.fontWeight || 'normal';
        const minFontSize = 10;
        let nextFontSize = element.style.fontSize || 28;

        while (nextFontSize > minFontSize) {
            context.font = `${fontWeight} ${nextFontSize}px ${fontFamily}`;
            const layout = getWrappedTextLayout(
                context,
                element.content,
                Math.max(20, element.dimensions.width - 24),
                nextFontSize * 1.2,
                element.dimensions.height - 24
            );

            if (!layout.isOverflowing) {
                break;
            }

            nextFontSize -= 1;
        }

        const updatedSlide = {
            ...slide,
            elements: slide.elements.map((candidate) =>
                candidate.id === elementId
                    ? {
                        ...candidate,
                        style: {
                            ...candidate.style,
                            fontSize: nextFontSize,
                        },
                    }
                    : candidate
            ),
        };

        onSlideUpdate(currentSlide, updatedSlide);
        setTextNotice(
            nextFontSize === minFontSize
                ? `Reduced "${elementId}" to ${minFontSize}px. Review the layout because it may still be tight.`
                : `Auto-fit applied to "${elementId}" at ${nextFontSize}px.`
        );
    };

    const updateImageFit = (elementId: string, fit: 'cover' | 'contain' | 'fill') => {
        const updatedSlide = {
            ...slide,
            elements: slide.elements.map((element) =>
                element.id === elementId && typeof element.content !== 'string'
                    ? {
                        ...element,
                        content: {
                            ...element.content,
                            fit,
                        },
                    }
                    : element
            ),
        };
        onSlideUpdate(currentSlide, updatedSlide);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isModifierPressed = event.metaKey || event.ctrlKey;
            if (!isModifierPressed) {
                return;
            }

            const key = event.key.toLowerCase();
            if (key === 'z' && !event.shiftKey) {
                event.preventDefault();
                onUndo();
                return;
            }

            if (key === 'y' || (key === 'z' && event.shiftKey)) {
                event.preventDefault();
                onRedo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onRedo, onUndo]);

    return (
        <div className="space-y-6 p-6">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <PlatformCompatibilityWarning
                    template={template}
                    platform={platform}
                    format={format}
                />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    {(['edit', 'preview'] as const).map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                activeTab === tab
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {tab === 'edit' ? 'Edit' : 'Preview'}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-gray-600">
                        Slide {currentSlide + 1} of {slides.length}
                    </span>
                    <button
                        type="button"
                        onClick={onUndo}
                        disabled={!canUndo}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Undo
                    </button>
                    <button
                        type="button"
                        onClick={onRedo}
                        disabled={!canRedo}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Redo
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsPreviewOpen(true)}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        Open slideshow preview
                    </button>
                    <button
                        type="button"
                        onClick={onSlideAdd}
                        disabled={slides.length >= 10}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Add Slide
                    </button>
                    <button
                        type="button"
                        onClick={handleDeleteCurrentSlide}
                        disabled={slides.length <= 1}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Delete Slide
                    </button>
                    <button
                        type="button"
                        onClick={onManualSave}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Save project
                    </button>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                        Slide navigation
                    </h3>
                    <p className="text-xs text-gray-500">
                        Select a slide, then move it left or right to reorder the carousel.
                    </p>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {slides.map((item, index) => (
                        <div
                            key={item.id}
                            draggable
                            onDragStart={() => setDraggedSlideIndex(index)}
                            onDragEnd={() => setDraggedSlideIndex(null)}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={() => {
                                if (draggedSlideIndex === null || draggedSlideIndex === index) {
                                    setDraggedSlideIndex(null);
                                    return;
                                }
                                onSlideReorder(draggedSlideIndex, index);
                                setDraggedSlideIndex(null);
                            }}
                            className={`min-w-[128px] rounded-xl border p-3 transition ${
                                draggedSlideIndex === index
                                    ? 'border-blue-300 bg-blue-50'
                                    : 'border-gray-200 bg-gray-50'
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => onCurrentSlideChange(index)}
                                className={`flex h-20 w-full items-center justify-center rounded-lg border text-sm font-semibold ${
                                    index === currentSlide
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Slide {index + 1}
                            </button>
                            <div className="mt-2 flex items-center justify-between gap-2">
                                <button
                                    type="button"
                                    onClick={() => onSlideReorder(index, Math.max(0, index - 1))}
                                    disabled={index === 0}
                                    className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Left
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onSlideReorder(index, Math.min(slides.length - 1, index + 1))}
                                    disabled={index === slides.length - 1}
                                    className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Right
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                    {activeTab === 'preview' ? (
                        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                            <p className="font-medium">Preview mode is read-only.</p>
                            <p className="mt-1">
                                Inspect this slide on-canvas or open the slideshow preview to review the full carousel sequence.
                            </p>
                        </div>
                    ) : null}
                    <SlideCanvas
                        slide={slide}
                        template={template}
                        dimensions={format.dimensions}
                        isEditable={activeTab === 'edit'}
                        onElementUpdate={(elementId, updates) => {
                            const updatedSlide = {
                                ...slide,
                                elements: slide.elements.map((element) =>
                                    element.id === elementId
                                        ? {
                                            ...element,
                                            ...updates,
                                            style: updates.style
                                                ? { ...element.style, ...updates.style }
                                                : element.style,
                                        }
                                        : element
                                ),
                            };
                            onSlideUpdate(currentSlide, updatedSlide);
                        }}
                    />
                </div>

                <aside className="space-y-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                        <h3 className="font-semibold text-gray-900">Slide properties</h3>
                        <div className="mt-4 space-y-4">
                            <label className="block">
                                <span className="mb-1 block text-sm font-medium text-gray-700">Background color</span>
                                <input
                                    type="color"
                                    value={slide.backgroundColor || '#ffffff'}
                                    onChange={(event) => updateBackgroundColor(event.target.value)}
                                    className="h-10 w-full cursor-pointer rounded border border-gray-300"
                                />
                            </label>
                            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                                <p className="font-medium text-gray-900">Editing tips</p>
                                <ul className="mt-2 space-y-1">
                                    <li>Click an element to select it.</li>
                                    <li>Drag selected elements to reposition them.</li>
                                    <li>Use resize handles to change size.</li>
                                    <li>Double-click text to edit its content.</li>
                                    <li>Use arrow keys for fine movement.</li>
                                    <li>Use Ctrl/Cmd+Z and Ctrl/Cmd+Y for undo and redo.</li>
                                </ul>
                            </div>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                                <p className="font-medium text-gray-900">Save status</p>
                                <p className="mt-1">{saveStatus}</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                                <p className="font-medium text-gray-900">Export status</p>
                                <p className="mt-1">{exportStatus}</p>
                            </div>
                        </div>
                    </div>

                    {overflowingTextElements.length ? (
                        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
                            <h3 className="font-semibold text-rose-900">Text overflow warnings</h3>
                            <p className="mt-2 text-sm text-rose-800">
                                These text boxes currently exceed their available space. Use auto-fit or edit the copy.
                            </p>
                            {textNotice ? <p className="mt-2 text-sm text-rose-700">{textNotice}</p> : null}
                            <div className="mt-4 space-y-3">
                                {overflowingTextElements.map((item) => (
                                    <div key={item.id} className="rounded-lg border border-rose-200 bg-white p-3">
                                        <p className="text-sm font-medium text-gray-900">{item.id}</p>
                                        <p className="mt-1 text-xs text-gray-600">
                                            Current font size: {item.fontSize}px | Hidden content height: about {item.hiddenHeight}px
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => autoFitTextElement(item.id)}
                                            className="mt-3 rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700"
                                        >
                                            Auto-fit text
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {imageElements.length ? (
                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <h3 className="font-semibold text-gray-900">Image elements</h3>
                            {imageNotice ? <p className="mt-2 text-sm text-gray-600">{imageNotice}</p> : null}
                            <div className="mt-4 space-y-4">
                                {imageElements.map((element) => (
                                    <div key={element.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                                        <p className="text-sm font-medium text-gray-900">{element.id}</p>
                                        <div
                                            onDragOver={(event) => event.preventDefault()}
                                            onDrop={(event) => {
                                                event.preventDefault();
                                                const file = event.dataTransfer.files?.[0] || null;
                                                void updateImageElement(element.id, file);
                                            }}
                                            className="mt-3 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-4 text-center text-sm text-gray-500"
                                        >
                                            Drop an image here or use the file picker below.
                                        </div>
                                        <label className="mt-3 block">
                                            <span className="mb-1 block text-sm font-medium text-gray-700">Replace image</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="block w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
                                                onChange={(event) => {
                                                    const file = event.target.files?.[0] || null;
                                                    void updateImageElement(element.id, file);
                                                    event.target.value = '';
                                                }}
                                            />
                                        </label>
                                        <label className="mt-3 block">
                                            <span className="mb-1 block text-sm font-medium text-gray-700">Fit mode</span>
                                            <select
                                                value={typeof element.content !== 'string' ? element.content.fit : 'cover'}
                                                onChange={(event) => updateImageFit(element.id, event.target.value as 'cover' | 'contain' | 'fill')}
                                                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
                                            >
                                                <option value="cover">Cover</option>
                                                <option value="contain">Contain</option>
                                                <option value="fill">Fill</option>
                                            </select>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                        <h3 className="font-semibold text-gray-900">Slide summary</h3>
                        <div className="mt-3 space-y-2 text-sm text-gray-600">
                            <p><span className="font-medium text-gray-900">Template:</span> {template.name}</p>
                            <p><span className="font-medium text-gray-900">Platform:</span> {platform.name}</p>
                            <p><span className="font-medium text-gray-900">Format:</span> {format.name}</p>
                            <p><span className="font-medium text-gray-900">Dimensions:</span> {format.dimensions.width} x {format.dimensions.height}</p>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2">
                            <div className="rounded-lg bg-blue-50 p-3 text-center">
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">Text</p>
                                <p className="mt-1 text-xl font-semibold text-blue-900">{elementCounts.text}</p>
                            </div>
                            <div className="rounded-lg bg-emerald-50 p-3 text-center">
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">Images</p>
                                <p className="mt-1 text-xl font-semibold text-emerald-900">{elementCounts.image}</p>
                            </div>
                            <div className="rounded-lg bg-violet-50 p-3 text-center">
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-600">Shapes</p>
                                <p className="mt-1 text-xl font-semibold text-violet-900">{elementCounts.shape}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                        <h3 className="font-semibold text-gray-900">Export actions</h3>
                        <div className="mt-3 space-y-3">
                            <button
                                type="button"
                                onClick={onExportCurrent}
                                disabled={isExporting}
                                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Export current slide
                            </button>
                            <button
                                type="button"
                                onClick={onExportAll}
                                disabled={isExporting}
                                className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Export all slides as ZIP
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            <PreviewModal
                slides={slides}
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                platform={platform}
                format={format}
                initialSlide={currentSlide}
                projectName={`${template.name} Carousel`}
            />
        </div>
    );
};
