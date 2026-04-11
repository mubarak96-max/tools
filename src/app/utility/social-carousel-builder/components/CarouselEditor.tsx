'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CarouselEditorProps } from '../types';
import { getWrappedTextLayout } from '../utils/canvasUtils';
import { fileToDataURL, generateId, isValidFileSize, isValidImageType } from '../utils';
import { PreviewModal } from './PreviewModal';
import { SlideCanvas } from './SlideCanvas';
import { SlideThumbnail } from './SlideThumbnail';

const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    const tagName = target.tagName.toLowerCase();
    return tagName === 'input' || tagName === 'textarea' || tagName === 'select' || target.isContentEditable;
};

export const CarouselEditor: React.FC<CarouselEditorProps> = ({
    slides,
    currentSlide,
    template,
    platform,
    format,
    seamlessStrip,
    isApplyingSeamlessStrip,
    onSlideUpdate,
    onCurrentSlideChange,
    onSlideAdd,
    onSlideDelete,
    onSlideReorder,
    onManualSave,
    onExportCurrent,
    onExportAll,
    onRetryExport,
    onExportTypeChange,
    onExportQualityChange,
    onSeamlessStripUpload,
    onSeamlessStripChange,
    onSeamlessStripClear,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    canRetryExport,
    exportType,
    exportQuality,
    saveStatus,
    exportStatus,
    isExporting,
}) => {
    const [activeInspectorTab, setActiveInspectorTab] = useState<'design' | 'images' | 'selection' | 'export'>('design');
    const [imageNotice, setImageNotice] = useState('');
    const [textNotice, setTextNotice] = useState('');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [draggedSlideIndex, setDraggedSlideIndex] = useState<number | null>(null);
    const [selectedCanvasElementIds, setSelectedCanvasElementIds] = useState<string[]>([]);
    const [activeCropElementId, setActiveCropElementId] = useState<string | null>(null);
    const [canvasActionTarget, setCanvasActionTarget] = useState<'background' | 'image' | null>(null);
    const slide = slides[currentSlide];

    const updateBackgroundColor = (value: string) => {
        onSlideUpdate(currentSlide, {
            ...slide,
            backgroundColor: value,
        });
    };

    const imageElements = slide.elements.filter((element) => element.type === 'image');
    const selectedCanvasElementId = selectedCanvasElementIds[selectedCanvasElementIds.length - 1] ?? null;
    const orderedElements = useMemo(
        () => [...slide.elements].sort((left, right) => left.position.z - right.position.z),
        [slide.elements]
    );
    const selectedCanvasElements = useMemo(
        () => orderedElements.filter((element) => selectedCanvasElementIds.includes(element.id)),
        [orderedElements, selectedCanvasElementIds]
    );
    const selectedCanvasElement = useMemo(
        () => slide.elements.find((element) => element.id === selectedCanvasElementId) ?? null,
        [selectedCanvasElementId, slide.elements]
    );
    const selectedCanvasElementIndex = useMemo(
        () => orderedElements.findIndex((element) => element.id === selectedCanvasElementId),
        [orderedElements, selectedCanvasElementId]
    );
    const isSelectedElementLocked = selectedCanvasElement
        ? selectedCanvasElement.constraints.allowMove === false && selectedCanvasElement.constraints.allowResize === false
        : false;
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
                            crop: {
                                x: 0,
                                y: 0,
                                zoom: 1,
                            },
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

    const updateImageCrop = (elementId: string, updates: { x?: number; y?: number; zoom?: number }) => {
        const updatedSlide = {
            ...slide,
            elements: slide.elements.map((element) =>
                element.id === elementId && typeof element.content !== 'string'
                    ? {
                        ...element,
                        content: {
                            ...element.content,
                            crop: {
                                x: element.content.crop?.x ?? 0,
                                y: element.content.crop?.y ?? 0,
                                zoom: element.content.crop?.zoom ?? 1,
                                ...updates,
                            },
                        },
                    }
                    : element
            ),
        };
        onSlideUpdate(currentSlide, updatedSlide);
    };

    const duplicateSelectedElement = () => {
        if (!selectedCanvasElements.length) {
            return;
        }

        const maxZ = Math.max(...slide.elements.map((element) => element.position.z));
        const duplicatedElements = selectedCanvasElements.map((element, index) => ({
            ...element,
            id: generateId(),
            position: {
                ...element.position,
                x: Math.max(0, element.position.x + 16),
                y: Math.max(0, element.position.y + 16),
                z: maxZ + index + 1,
            },
            style: { ...element.style },
            dimensions: { ...element.dimensions },
            constraints: element.constraints ? { ...element.constraints } : element.constraints,
            content:
                typeof element.content === 'string'
                    ? element.content
                    : {
                        ...element.content,
                        crop: element.content.crop
                            ? { ...element.content.crop }
                            : undefined,
                    },
        }));

        onSlideUpdate(currentSlide, {
            ...slide,
            elements: [...slide.elements, ...duplicatedElements],
        });
        setSelectedCanvasElementIds(duplicatedElements.map((element) => element.id));
    };

    const deleteSelectedElement = () => {
        if (!selectedCanvasElements.length) {
            return;
        }

        const shouldDelete = window.confirm(
            selectedCanvasElements.length === 1
                ? `Delete element "${selectedCanvasElements[0].id}"?`
                : `Delete ${selectedCanvasElements.length} selected elements?`
        );
        if (!shouldDelete) {
            return;
        }

        onSlideUpdate(currentSlide, {
            ...slide,
            elements: slide.elements.filter((element) => !selectedCanvasElementIds.includes(element.id)),
        });
        setSelectedCanvasElementIds([]);
    };

    const moveSelectedElementLayer = (direction: 'forward' | 'backward') => {
        if (!selectedCanvasElement) {
            return;
        }

        const currentIndex = orderedElements.findIndex((element) => element.id === selectedCanvasElement.id);
        if (currentIndex === -1) {
            return;
        }

        const targetIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
        if (targetIndex < 0 || targetIndex >= orderedElements.length) {
            return;
        }

        const reordered = [...orderedElements];
        const [moved] = reordered.splice(currentIndex, 1);
        reordered.splice(targetIndex, 0, moved);

        onSlideUpdate(currentSlide, {
            ...slide,
            elements: reordered.map((element, index) => ({
                ...element,
                position: {
                    ...element.position,
                    z: index,
                },
            })),
        });
    };

    const updateSelectedElementRotation = (rotation: number) => {
        if (!selectedCanvasElement) {
            return;
        }

        onSlideUpdate(currentSlide, {
            ...slide,
            elements: slide.elements.map((element) =>
                element.id === selectedCanvasElement.id
                    ? {
                        ...element,
                        style: {
                            ...element.style,
                            rotation,
                        },
                    }
                    : element
            ),
        });
    };

    const toggleSelectedElementLock = () => {
        if (!selectedCanvasElement) {
            return;
        }

        const nextLockedState = !isSelectedElementLocked;

        onSlideUpdate(currentSlide, {
            ...slide,
            elements: slide.elements.map((element) =>
                element.id === selectedCanvasElement.id
                    ? {
                        ...element,
                        constraints: {
                            ...element.constraints,
                            allowMove: !nextLockedState,
                            allowResize: !nextLockedState,
                        },
                    }
                    : element
            ),
        });
    };

    const handleSelectionChange = (elementIds: string[]) => {
        setSelectedCanvasElementIds(elementIds);
        const nextSelectedId = elementIds[elementIds.length - 1] ?? null;
        const nextSelectedElement = slide.elements.find((element) => element.id === nextSelectedId) ?? null;

        if (!nextSelectedElement) {
            setCanvasActionTarget('background');
            return;
        }

        setCanvasActionTarget(nextSelectedElement.type === 'image' ? 'image' : null);
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

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (isHelpOpen) {
                    setIsHelpOpen(false);
                    return;
                }

                if (activeCropElementId) {
                    setActiveCropElementId(null);
                }
            }

            if (!selectedCanvasElement || isInteractiveTarget(event.target)) {
                return;
            }

            if ((event.key === 'Delete' || event.key === 'Backspace') && !event.metaKey && !event.ctrlKey) {
                event.preventDefault();
                deleteSelectedElement();
                return;
            }

            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'd') {
                event.preventDefault();
                duplicateSelectedElement();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeCropElementId, deleteSelectedElement, duplicateSelectedElement, isHelpOpen, selectedCanvasElement]);

    useEffect(() => {
        setSelectedCanvasElementIds([]);
        setActiveCropElementId(null);
        setCanvasActionTarget(null);
    }, [currentSlide]);

    useEffect(() => {
        if (selectedCanvasElement) {
            setActiveInspectorTab('selection');
        }
    }, [selectedCanvasElement]);

    return (
        <div className="space-y-4 p-4 lg:p-5">
            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Editor</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={onManualSave}
                            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsPreviewOpen(true)}
                            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                        >
                            Preview
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">Slide {currentSlide + 1} of {slides.length}</span>
                    <span className={`rounded-full px-3 py-1 font-medium ${
                        seamlessStrip ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                        {seamlessStrip ? 'Seamless strip on' : 'Standard background'}
                    </span>
                    {isApplyingSeamlessStrip ? (
                        <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-800">
                            Updating strip
                        </span>
                    ) : null}
                    {overflowingTextElements.length ? (
                        <span className="rounded-full bg-rose-100 px-3 py-1 font-medium text-rose-700">
                            {overflowingTextElements.length} warning{overflowingTextElements.length !== 1 ? 's' : ''}
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[15rem_minmax(0,1fr)_20rem]">
                <aside className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Slides
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">
                        Sequence
                    </h3>
                    <div className="mt-4 space-y-3">
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
                                className={`rounded-2xl border p-3 transition ${
                                    index === currentSlide
                                        ? 'border-slate-900 bg-slate-50'
                                        : draggedSlideIndex === index
                                            ? 'border-sky-300 bg-sky-50'
                                            : 'border-slate-200 bg-white'
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => onCurrentSlideChange(index)}
                                    className="w-full text-left"
                                >
                                    <SlideThumbnail
                                        slide={item}
                                        format={format}
                                        alt={`Slide ${index + 1} thumbnail`}
                                        className="aspect-[4/5] w-full rounded-xl border border-slate-200 object-cover"
                                    />
                                    <span className="mt-2 block text-sm font-semibold text-slate-900">Slide {index + 1}</span>
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 space-y-2">
                        <button
                            type="button"
                            onClick={onSlideAdd}
                            disabled={slides.length >= 10}
                            className="w-full rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Add slide
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteCurrentSlide}
                            disabled={slides.length <= 1}
                            className="w-full rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Delete current slide
                        </button>
                    </div>
                </aside>

                <div className="relative rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                    {canvasActionTarget ? (
                        <div className="absolute right-6 top-6 z-10 flex flex-wrap gap-2">
                            {canvasActionTarget === 'background' ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setActiveInspectorTab('design')}
                                        className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                                    >
                                        Background
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveInspectorTab('design')}
                                        className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                                    >
                                        Seamless
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setActiveInspectorTab('images')}
                                    className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                                >
                                    Edit image
                                </button>
                            )}
                        </div>
                    ) : null}
                    <SlideCanvas
                        slide={slide}
                        template={template}
                        dimensions={format.dimensions}
                        isEditable
                        onSelectionChange={handleSelectionChange}
                        cropTargetElementId={activeCropElementId}
                        onImageCropChange={updateImageCrop}
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
                    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Inspector
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {[
                                { id: 'design', label: 'Design' },
                                { id: 'images', label: 'Images' },
                                { id: 'selection', label: 'Selection' },
                                { id: 'export', label: 'Export' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveInspectorTab(tab.id as 'design' | 'images' | 'selection' | 'export')}
                                    className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                                        activeInspectorTab === tab.id
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeInspectorTab === 'design' ? (
                        <div className="space-y-4">
                            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                                <h3 className="font-semibold text-slate-900">Background</h3>
                                <div className="mt-4 space-y-4">
                                    <label className="block">
                                        <span className="mb-1 block text-sm font-medium text-slate-700">Background color</span>
                                        <input
                                            type="color"
                                            value={slide.backgroundColor || '#ffffff'}
                                            onChange={(event) => updateBackgroundColor(event.target.value)}
                                            className="h-10 w-full cursor-pointer rounded border border-slate-300"
                                        />
                                    </label>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">Seamless strip</p>
                                            </div>
                                            {seamlessStrip ? (
                                                <button
                                                    type="button"
                                                    onClick={onSeamlessStripClear}
                                                    className="rounded-full border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-white"
                                                >
                                                    Clear
                                                </button>
                                            ) : null}
                                        </div>
                                        <label className="mt-4 block">
                                            <span className="mb-1 block text-sm font-medium text-slate-700">Strip image</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                                                onChange={(event) => {
                                                    const file = event.target.files?.[0] || null;
                                                    void onSeamlessStripUpload(file);
                                                    event.target.value = '';
                                                }}
                                            />
                                        </label>
                                        {seamlessStrip ? (
                                            <div className="mt-4 space-y-4">
                                                <p className="text-sm text-slate-600">{seamlessStrip.alt}</p>
                                                <label className="block">
                                                    <span className="mb-1 block text-sm font-medium text-slate-700">
                                                        Zoom ({seamlessStrip.zoom.toFixed(2)}x)
                                                    </span>
                                                    <input
                                                        type="range"
                                                        min="1"
                                                        max="2.5"
                                                        step="0.01"
                                                        value={seamlessStrip.zoom}
                                                        onChange={(event) => void onSeamlessStripChange({ zoom: Number(event.target.value) })}
                                                        className="w-full"
                                                    />
                                                </label>
                                                <label className="block">
                                                    <span className="mb-1 block text-sm font-medium text-slate-700">
                                                        Horizontal shift ({Math.round(seamlessStrip.offsetX)}px)
                                                    </span>
                                                    <input
                                                        type="range"
                                                        min={-format.dimensions.width * slides.length}
                                                        max={format.dimensions.width * slides.length}
                                                        step="1"
                                                        value={seamlessStrip.offsetX}
                                                        onChange={(event) => void onSeamlessStripChange({ offsetX: Number(event.target.value) })}
                                                        className="w-full"
                                                    />
                                                </label>
                                                <label className="block">
                                                    <span className="mb-1 block text-sm font-medium text-slate-700">
                                                        Vertical shift ({Math.round(seamlessStrip.offsetY)}px)
                                                    </span>
                                                    <input
                                                        type="range"
                                                        min={-format.dimensions.height}
                                                        max={format.dimensions.height}
                                                        step="1"
                                                        value={seamlessStrip.offsetY}
                                                        onChange={(event) => void onSeamlessStripChange({ offsetY: Number(event.target.value) })}
                                                        className="w-full"
                                                    />
                                                </label>
                                            </div>
                                        ) : (
                                            <p className="mt-3 text-sm text-slate-500">No strip uploaded.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {overflowingTextElements.length ? (
                                <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-4 shadow-sm">
                                    <h3 className="font-semibold text-amber-950">Text warnings</h3>
                                    <div className="mt-3 space-y-3">
                                        {overflowingTextElements.map((element) => (
                                            <div key={element.id} className="rounded-2xl border border-amber-200 bg-white/70 p-3">
                                                <p className="text-sm font-medium text-amber-950">{element.id}</p>
                                                <p className="mt-1 text-sm text-amber-900">
                                                    Hidden text detected. Approximate overflow: {element.hiddenHeight}px.
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => autoFitTextElement(element.id)}
                                                    className="mt-3 rounded-full border border-amber-300 px-3 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100"
                                                >
                                                    Auto-fit text
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {textNotice ? <p className="mt-3 text-sm text-amber-900">{textNotice}</p> : null}
                                </div>
                            ) : textNotice ? (
                                <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                                    <p className="text-sm text-slate-600">{textNotice}</p>
                                </div>
                            ) : null}
                        </div>
                    ) : null}

                    {activeInspectorTab === 'images' ? (
                        imageElements.length ? (
                            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                                <h3 className="font-semibold text-slate-900">Image elements</h3>
                                {imageNotice ? <p className="mt-3 text-sm text-slate-600">{imageNotice}</p> : null}
                                <div className="mt-4 space-y-4">
                                    {imageElements.map((element) => (
                                        <div key={element.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                            <p className="text-sm font-medium text-slate-900">{element.id}</p>
                                            <div
                                                onDragOver={(event) => event.preventDefault()}
                                                onDrop={(event) => {
                                                    event.preventDefault();
                                                    const file = event.dataTransfer.files?.[0] || null;
                                                    void updateImageElement(element.id, file);
                                                }}
                                                className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-4 text-center text-sm text-slate-500"
                                            >
                                                Drop an image here or use the file picker below.
                                            </div>
                                            <label className="mt-3 block">
                                                <span className="mb-1 block text-sm font-medium text-slate-700">Replace image</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                                                    onChange={(event) => {
                                                        const file = event.target.files?.[0] || null;
                                                        void updateImageElement(element.id, file);
                                                        event.target.value = '';
                                                    }}
                                                />
                                            </label>
                                            <label className="mt-3 block">
                                                <span className="mb-1 block text-sm font-medium text-slate-700">Fit mode</span>
                                                <select
                                                    value={typeof element.content !== 'string' ? element.content.fit : 'cover'}
                                                    onChange={(event) => updateImageFit(element.id, event.target.value as 'cover' | 'contain' | 'fill')}
                                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                                                >
                                                    <option value="cover">Cover</option>
                                                    <option value="contain">Contain</option>
                                                    <option value="fill">Fill</option>
                                                </select>
                                            </label>
                                            <label className="mt-3 block">
                                                <span className="mb-1 block text-sm font-medium text-slate-700">
                                                    Zoom ({typeof element.content !== 'string' ? (element.content.crop?.zoom ?? 1).toFixed(2) : '1.00'}x)
                                                </span>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="3"
                                                    step="0.05"
                                                    value={typeof element.content !== 'string' ? element.content.crop?.zoom ?? 1 : 1}
                                                    onChange={(event) => updateImageCrop(element.id, { zoom: Number(event.target.value) })}
                                                    className="w-full"
                                                />
                                            </label>
                                            <label className="mt-3 block">
                                                <span className="mb-1 block text-sm font-medium text-slate-700">
                                                    Horizontal position ({typeof element.content !== 'string' ? Math.round(element.content.crop?.x ?? 0) : 0})
                                                </span>
                                                <input
                                                    type="range"
                                                    min="-100"
                                                    max="100"
                                                    step="1"
                                                    value={typeof element.content !== 'string' ? element.content.crop?.x ?? 0 : 0}
                                                    onChange={(event) => updateImageCrop(element.id, { x: Number(event.target.value) })}
                                                    className="w-full"
                                                />
                                            </label>
                                            <label className="mt-3 block">
                                                <span className="mb-1 block text-sm font-medium text-slate-700">
                                                    Vertical position ({typeof element.content !== 'string' ? Math.round(element.content.crop?.y ?? 0) : 0})
                                                </span>
                                                <input
                                                    type="range"
                                                    min="-100"
                                                    max="100"
                                                    step="1"
                                                    value={typeof element.content !== 'string' ? element.content.crop?.y ?? 0 : 0}
                                                    onChange={(event) => updateImageCrop(element.id, { y: Number(event.target.value) })}
                                                    className="w-full"
                                                />
                                            </label>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => updateImageCrop(element.id, { x: 0, y: 0, zoom: 1 })}
                                                    className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white"
                                                >
                                                    Reset crop
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveCropElementId((current) => current === element.id ? null : element.id)}
                                                    className={`rounded-full px-3 py-2 text-sm font-medium ${
                                                        activeCropElementId === element.id
                                                            ? 'bg-amber-500 text-white hover:bg-amber-600'
                                                            : 'border border-slate-300 text-slate-700 hover:bg-white'
                                                    }`}
                                                >
                                                    {activeCropElementId === element.id ? 'Stop canvas crop' : 'Adjust crop on canvas'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                                <h3 className="font-semibold text-slate-900">Image elements</h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    This slide does not have editable image elements.
                                </p>
                            </div>
                        )
                    ) : null}

                    {activeInspectorTab === 'selection' ? (
                        selectedCanvasElement ? (
                            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                                <h3 className="font-semibold text-slate-900">Selected element</h3>
                                <div className="mt-3 space-y-2 text-sm text-slate-600">
                                    <p><span className="font-medium text-slate-900">ID:</span> {selectedCanvasElement.id}</p>
                                    <p><span className="font-medium text-slate-900">Type:</span> {selectedCanvasElement.type}</p>
                                    <p><span className="font-medium text-slate-900">Layer:</span> {selectedCanvasElement.position.z}</p>
                                    <p><span className="font-medium text-slate-900">Rotation:</span> {Math.round(selectedCanvasElement.style.rotation ?? 0)}&deg;</p>
                                    <p><span className="font-medium text-slate-900">Locked:</span> {isSelectedElementLocked ? 'Yes' : 'No'}</p>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={duplicateSelectedElement}
                                        className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        {selectedCanvasElementIds.length > 1 ? 'Duplicate selected' : 'Duplicate'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={deleteSelectedElement}
                                        className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                                    >
                                        {selectedCanvasElementIds.length > 1 ? 'Delete selected' : 'Delete'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveSelectedElementLayer('backward')}
                                        disabled={selectedCanvasElementIds.length > 1 || selectedCanvasElementIndex <= 0}
                                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Send backward
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveSelectedElementLayer('forward')}
                                        disabled={selectedCanvasElementIds.length > 1 || selectedCanvasElementIndex === -1 || selectedCanvasElementIndex >= orderedElements.length - 1}
                                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Bring forward
                                    </button>
                                </div>
                                <div className="mt-4 space-y-3">
                                    <label className="block">
                                        <span className="mb-1 block text-sm font-medium text-slate-700">
                                            Rotation ({Math.round(selectedCanvasElement.style.rotation ?? 0)}&deg;)
                                        </span>
                                        <input
                                            type="range"
                                            min="-180"
                                            max="180"
                                            step="1"
                                            value={selectedCanvasElement.style.rotation ?? 0}
                                            onChange={(event) => updateSelectedElementRotation(Number(event.target.value))}
                                            className="w-full"
                                        />
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => updateSelectedElementRotation((selectedCanvasElement.style.rotation ?? 0) - 15)}
                                            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                        >
                                            -15&deg;
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateSelectedElementRotation(0)}
                                            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateSelectedElementRotation((selectedCanvasElement.style.rotation ?? 0) + 15)}
                                            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                        >
                                            +15&deg;
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={toggleSelectedElementLock}
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        {isSelectedElementLocked ? 'Unlock element' : 'Lock element'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                                <h3 className="font-semibold text-slate-900">Selection</h3>
                                <p className="mt-2 text-sm text-slate-600">Click an element.</p>
                            </div>
                        )
                    ) : null}

                    {activeInspectorTab === 'export' ? (
                        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                            <h3 className="font-semibold text-slate-900">Export actions</h3>
                            <div className="mt-3 space-y-3">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                                    <p className="font-medium text-slate-900">Save status</p>
                                    <p className="mt-1">{saveStatus}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                                    <p className="font-medium text-slate-900">Export status</p>
                                    <p className="mt-1">{exportStatus}</p>
                                </div>
                                <label className="block">
                                    <span className="mb-1 block text-sm font-medium text-slate-700">File format</span>
                                    <select
                                        value={exportType}
                                        onChange={(event) => onExportTypeChange(event.target.value as 'png' | 'jpg')}
                                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                                    >
                                        <option value="png">PNG (sharper text)</option>
                                        <option value="jpg">JPG (smaller files)</option>
                                    </select>
                                </label>
                                {exportType === 'jpg' ? (
                                    <label className="block">
                                        <span className="mb-1 block text-sm font-medium text-slate-700">
                                            JPG quality ({Math.round(exportQuality * 100)}%)
                                        </span>
                                        <input
                                            type="range"
                                            min="0.4"
                                            max="1"
                                            step="0.01"
                                            value={exportQuality}
                                            onChange={(event) => onExportQualityChange(Number(event.target.value))}
                                            className="w-full"
                                        />
                                    </label>
                                ) : null}
                                <p className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
                                    PNG keeps text sharper. JPG reduces file size using the selected quality value.
                                </p>
                                <button
                                    type="button"
                                    onClick={onExportCurrent}
                                    disabled={isExporting}
                                    className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Export current slide
                                </button>
                                <button
                                    type="button"
                                    onClick={onExportAll}
                                    disabled={isExporting}
                                    className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Export all slides as ZIP
                                </button>
                                <button
                                    type="button"
                                    onClick={onRetryExport}
                                    disabled={isExporting || !canRetryExport}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Retry last export
                                </button>
                            </div>
                        </div>
                    ) : null}
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

            {isHelpOpen ? (
                <div
                    className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Social carousel builder help"
                >
                    <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                                    Editor help
                                </p>
                                <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                                    Social carousel builder shortcuts
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsHelpOpen(false)}
                                className="rounded-full border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>

                        <div className="mt-6 grid gap-6 md:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">Mouse actions</h3>
                                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                                    <li>Single-click text to open the formatting toolbar.</li>
                                    <li>Shift-click elements to build a multi-selection.</li>
                                    <li>Double-click text to edit the copy inline.</li>
                                    <li>Drag elements to move them with grid and alignment snapping.</li>
                                    <li>Use canvas crop mode to drag an image inside its frame.</li>
                                    <li>Use resize handles to adjust element dimensions.</li>
                                    <li>Drag slide cards to reorder the carousel.</li>
                                </ul>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">Keyboard shortcuts</h3>
                                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                                    <li>Arrow keys move the selected element or group by 1px.</li>
                                    <li>Delete removes the selected element or group when you are not typing.</li>
                                    <li>Ctrl/Cmd+D duplicates the selected element or group.</li>
                                    <li>Ctrl/Cmd+Z undoes the last change.</li>
                                    <li>Ctrl/Cmd+Y redoes the next change.</li>
                                    <li>Ctrl/Cmd+Shift+Z also redoes on macOS.</li>
                                    <li>Escape closes active text controls and preview overlays.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
                            Local save, autosave, and session recovery all stay in the current browser. Exported slides are
                            generated from the live canvas state for the selected platform format.
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};
