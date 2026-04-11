'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SlideCanvasProps, TemplateElement } from '../types';
import { useCanvasInteraction } from '../hooks/useCanvasInteraction';
import { useTextEditing } from '../hooks/useTextEditing';
import {
    calculateCanvasScale,
    drawFittedImage,
    drawRoundedRect,
    getElementAtPosition,
    getWrappedTextLayout,
    renderSelectionIndicator,
    renderTextWithWordWrap,
    withElementRotation,
} from '../utils/canvasUtils';
import { clamp } from '../utils';
import { TextEditor } from './TextEditor';
import { TextFormattingToolbar } from './TextFormattingToolbar';

function isImageContent(
    content: TemplateElement['content']
): content is { src: string; alt: string; fit: 'cover' | 'contain' | 'fill' } {
    return typeof content === 'object' && content !== null && 'src' in content;
}

export const SlideCanvas: React.FC<SlideCanvasProps> = ({
    slide,
    dimensions,
    isEditable,
    onElementUpdate,
    onSelectionChange,
    cropTargetElementId,
    onImageCropChange,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
    const [scale, setScale] = useState(1);
    const [cropDragState, setCropDragState] = useState<{ active: boolean; lastX: number; lastY: number }>({
        active: false,
        lastX: 0,
        lastY: 0,
    });

    const {
        canvasRef,
        selectedElementId,
        selectedElementIds,
        isDragging,
        isResizing,
        alignmentGuides,
        selectElement,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleMouseLeave,
    } = useCanvasInteraction({
        elements: slide.elements,
        canvasDimensions: dimensions,
        scale,
        isEditable,
        onElementUpdate,
    });

    const {
        editingElementId,
        toolbarElementId,
        toolbarPosition,
        startTextEditing,
        showToolbarForElement,
        stopTextEditing,
        hideToolbar,
        stopAllTextUi,
        updateTextContent,
        updateTextStyle,
    } = useTextEditing({ onElementUpdate });

    const selectedElement = useMemo(
        () => slide.elements.find((element) => element.id === selectedElementId) ?? null,
        [selectedElementId, slide.elements]
    );
    const selectedElements = useMemo(
        () => slide.elements.filter((element) => selectedElementIds.includes(element.id)),
        [selectedElementIds, slide.elements]
    );

    const editingElement = useMemo(
        () => slide.elements.find((element) => element.id === editingElementId) ?? null,
        [editingElementId, slide.elements]
    );

    const toolbarElement = useMemo(
        () => slide.elements.find((element) => element.id === toolbarElementId) ?? null,
        [toolbarElementId, slide.elements]
    );
    const hasOverflowingText = useMemo(() => {
        if (typeof document === 'undefined') {
            return false;
        }

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
            return false;
        }

        return slide.elements.some((element) => {
            if (element.type !== 'text' || typeof element.content !== 'string') {
                return false;
            }

            const fontSize = element.style.fontSize || 28;
            const fontFamily = element.style.fontFamily || 'Inter, sans-serif';
            const fontWeight = element.style.fontWeight || 'normal';
            context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

            return getWrappedTextLayout(
                context,
                element.content,
                Math.max(20, element.dimensions.width - 24),
                fontSize * 1.2,
                element.dimensions.height - 24
            ).isOverflowing;
        });
    }, [slide.elements]);

    const renderCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        context.clearRect(0, 0, dimensions.width, dimensions.height);
        context.fillStyle = slide.backgroundColor || '#ffffff';
        context.fillRect(0, 0, dimensions.width, dimensions.height);

        if (slide.backgroundImage) {
            const cachedBackground = imageCacheRef.current.get(slide.backgroundImage);
            if (cachedBackground && cachedBackground.complete) {
                context.drawImage(cachedBackground, 0, 0, dimensions.width, dimensions.height);
            } else {
                const background = new Image();
                background.onload = () => {
                    imageCacheRef.current.set(slide.backgroundImage!, background);
                    renderCanvas();
                };
                background.src = slide.backgroundImage;
                imageCacheRef.current.set(slide.backgroundImage, background);
            }
        }

        const elements = [...slide.elements].sort((left, right) => left.position.z - right.position.z);

        elements.forEach((element) => {
            if (element.type === 'shape') {
                context.save();
                context.globalAlpha = element.style.opacity ?? 1;
                withElementRotation(context, element, () => {
                    context.fillStyle = element.style.backgroundColor || '#e5e7eb';
                    if (element.style.borderRadius) {
                        drawRoundedRect(
                            context,
                            element.position.x,
                            element.position.y,
                            element.dimensions.width,
                            element.dimensions.height,
                            element.style.borderRadius
                        );
                        context.fill();
                    } else {
                        context.fillRect(
                            element.position.x,
                            element.position.y,
                            element.dimensions.width,
                            element.dimensions.height
                        );
                    }
                });
                context.restore();
                return;
            }

            if (element.type === 'image') {
                context.save();
                context.globalAlpha = element.style.opacity ?? 1;
                withElementRotation(context, element, () => {
                    context.fillStyle = '#f3f4f6';
                    context.fillRect(
                        element.position.x,
                        element.position.y,
                        element.dimensions.width,
                        element.dimensions.height
                    );

                    if (isImageContent(element.content) && element.content.src) {
                        const imageSource = element.content.src;
                        const cachedImage = imageCacheRef.current.get(imageSource);
                        if (cachedImage && cachedImage.complete) {
                            drawFittedImage(
                                context,
                                cachedImage,
                                {
                                    x: element.position.x,
                                    y: element.position.y,
                                    width: element.dimensions.width,
                                    height: element.dimensions.height,
                                },
                                element.content,
                                element.style.borderRadius
                            );
                            return;
                        }

                        const image = new Image();
                        image.onload = () => {
                            imageCacheRef.current.set(imageSource, image);
                            renderCanvas();
                        };
                        image.src = imageSource;
                        imageCacheRef.current.set(imageSource, image);
                        return;
                    }

                    context.fillStyle = '#9ca3af';
                    context.font = `${Math.min(element.dimensions.width, element.dimensions.height) * 0.2}px Arial`;
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    context.fillText(
                        'Image',
                        element.position.x + element.dimensions.width / 2,
                        element.position.y + element.dimensions.height / 2
                    );
                });
                context.restore();
                return;
            }

            if (typeof element.content !== 'string') {
                return;
            }

            const textContent = element.content;

            context.save();
            context.globalAlpha = element.style.opacity ?? 1;
            withElementRotation(context, element, () => {
                if (element.style.backgroundColor) {
                    context.fillStyle = element.style.backgroundColor;
                    if (element.style.borderRadius) {
                        drawRoundedRect(
                            context,
                            element.position.x,
                            element.position.y,
                            element.dimensions.width,
                            element.dimensions.height,
                            element.style.borderRadius
                        );
                        context.fill();
                    } else {
                        context.fillRect(
                            element.position.x,
                            element.position.y,
                            element.dimensions.width,
                            element.dimensions.height
                        );
                    }
                }

                const fontSize = element.style.fontSize || 28;
                const fontFamily = element.style.fontFamily || 'Inter, sans-serif';
                const fontWeight = element.style.fontWeight || 'normal';
                const textAlign = element.style.textAlign || 'left';

                context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
                context.fillStyle = element.style.color || '#111827';
                context.textAlign = textAlign;
                context.textBaseline = 'top';

                const lineHeight = fontSize * 1.2;
                const horizontalPadding = 12;
                const maxTextWidth = Math.max(20, element.dimensions.width - horizontalPadding * 2);
                const textX =
                    textAlign === 'center'
                        ? element.position.x + element.dimensions.width / 2
                        : textAlign === 'right'
                            ? element.position.x + element.dimensions.width - horizontalPadding
                            : element.position.x + horizontalPadding;
                const renderedHeight = renderTextWithWordWrap(
                    context,
                    textContent,
                    textX,
                    element.position.y + 12,
                    maxTextWidth,
                    lineHeight
                );

                if (renderedHeight > element.dimensions.height - 24) {
                    context.strokeStyle = '#dc2626';
                    context.setLineDash([6, 4]);
                    context.strokeRect(
                        element.position.x + 1,
                        element.position.y + 1,
                        element.dimensions.width - 2,
                        element.dimensions.height - 2
                    );
                    context.setLineDash([]);

                    context.fillStyle = '#dc2626';
                    context.fillRect(
                        element.position.x + element.dimensions.width - 80,
                        element.position.y + 8,
                        72,
                        20
                    );
                    context.fillStyle = '#ffffff';
                    context.font = '600 11px Inter, sans-serif';
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    context.fillText(
                        'Overflow',
                        element.position.x + element.dimensions.width - 44,
                        element.position.y + 18
                    );
                }
            });

            context.restore();
        });

        if (selectedElements.length && isEditable) {
            selectedElements.forEach((element, index) => {
                renderSelectionIndicator(context, element, {
                    color: index === selectedElements.length - 1 ? '#2563eb' : '#60a5fa',
                    handleSize: 10,
                });
            });
        }

        if (isEditable && alignmentGuides.length) {
            context.save();
            context.strokeStyle = '#0ea5e9';
            context.lineWidth = 1.5;
            context.setLineDash([8, 6]);

            alignmentGuides.forEach((guide) => {
                context.beginPath();
                if (guide.orientation === 'vertical') {
                    context.moveTo(guide.position, 0);
                    context.lineTo(guide.position, dimensions.height);
                } else {
                    context.moveTo(0, guide.position);
                    context.lineTo(dimensions.width, guide.position);
                }
                context.stroke();
            });

            context.restore();
        }
    }, [alignmentGuides, canvasRef, dimensions, isEditable, selectedElements, slide.backgroundColor, slide.elements]);

    useEffect(() => {
        const updateScale = () => {
            const container = containerRef.current;
            if (!container) {
                return;
            }
            const nextScale = calculateCanvasScale(
                dimensions,
                {
                    width: Math.max(240, container.clientWidth - 24),
                    height: Math.max(240, container.clientHeight - 24),
                },
                1
            );
            setScale(nextScale);
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [dimensions]);

    useEffect(() => {
        renderCanvas();
    }, [renderCanvas]);

    useEffect(() => {
        onSelectionChange?.(selectedElementIds);
    }, [onSelectionChange, selectedElementIds]);

    const getRelativeClickPosition = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }, []);

    const getCanvasPoint = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) / scale,
            y: (event.clientY - rect.top) / scale,
            z: 0,
        };
    }, [scale]);

    const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isEditable) {
            return;
        }
        const clickedElement = getElementAtPosition(slide.elements, getCanvasPoint(event));
        if (clickedElement?.type === 'text') {
            showToolbarForElement(clickedElement.id, getRelativeClickPosition(event));
            return;
        }
        hideToolbar();
    }, [getCanvasPoint, getRelativeClickPosition, hideToolbar, isEditable, showToolbarForElement, slide.elements]);

    const handleCanvasMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (isEditable && cropTargetElementId) {
            const clickedElement = getElementAtPosition(slide.elements, getCanvasPoint(event));
            if (clickedElement?.id === cropTargetElementId && clickedElement.type === 'image') {
                setCropDragState({
                    active: true,
                    lastX: event.clientX,
                    lastY: event.clientY,
                });
                selectElement(clickedElement.id);
                return;
            }
        }

        handleMouseDown(event);
    }, [cropTargetElementId, getCanvasPoint, handleMouseDown, isEditable, selectElement, slide.elements]);

    const handleCanvasMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (cropDragState.active && cropTargetElementId && onImageCropChange) {
            const targetElement = slide.elements.find((element) => element.id === cropTargetElementId);
            if (targetElement?.type === 'image' && typeof targetElement.content !== 'string') {
                const deltaX = event.clientX - cropDragState.lastX;
                const deltaY = event.clientY - cropDragState.lastY;
                const nextCropX = clamp((targetElement.content.crop?.x ?? 0) + (deltaX / Math.max(1, targetElement.dimensions.width * scale)) * 220, -100, 100);
                const nextCropY = clamp((targetElement.content.crop?.y ?? 0) + (deltaY / Math.max(1, targetElement.dimensions.height * scale)) * 220, -100, 100);

                onImageCropChange(cropTargetElementId, {
                    x: nextCropX,
                    y: nextCropY,
                });
                setCropDragState({
                    active: true,
                    lastX: event.clientX,
                    lastY: event.clientY,
                });
                return;
            }
        }

        handleMouseMove(event);
    }, [cropDragState.active, cropTargetElementId, handleMouseMove, onImageCropChange, scale, slide.elements]);

    const handleCanvasMouseUp = useCallback(() => {
        if (cropDragState.active) {
            setCropDragState({
                active: false,
                lastX: 0,
                lastY: 0,
            });
        }
        handleMouseUp();
    }, [cropDragState.active, handleMouseUp]);

    const handleCanvasMouseLeave = useCallback(() => {
        if (cropDragState.active) {
            setCropDragState({
                active: false,
                lastX: 0,
                lastY: 0,
            });
        }
        handleMouseLeave();
    }, [cropDragState.active, handleMouseLeave]);

    const handleCanvasDoubleClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isEditable) {
            return;
        }
        const clickedElement = getElementAtPosition(slide.elements, getCanvasPoint(event));
        if (clickedElement?.type === 'text') {
            startTextEditing(clickedElement.id);
            return;
        }
        stopAllTextUi();
    }, [getCanvasPoint, isEditable, slide.elements, startTextEditing, stopAllTextUi]);

    const handleStyleChange = useCallback((updates: Partial<TemplateElement['style']>) => {
        if (!toolbarElement) {
            return;
        }
        updateTextStyle(toolbarElement.id, {
            ...toolbarElement.style,
            ...updates,
        });
    }, [toolbarElement, updateTextStyle]);

    return (
        <div
            ref={containerRef}
            className="relative flex min-h-[480px] w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100 p-3"
        >
            <div
                className="relative"
                style={{
                    width: dimensions.width * scale,
                    height: dimensions.height * scale,
                }}
            >
                <canvas
                    ref={canvasRef}
                    className={`h-full w-full rounded-md border border-gray-300 bg-white shadow-sm ${
                        isEditable ? (isDragging || isResizing ? 'cursor-grabbing' : 'cursor-pointer') : ''
                    }`}
                    style={{ width: dimensions.width * scale, height: dimensions.height * scale }}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseLeave}
                    onClick={handleCanvasClick}
                    onDoubleClick={handleCanvasDoubleClick}
                />

                {toolbarElement && toolbarPosition ? (
                    <TextFormattingToolbar
                        style={toolbarElement.style}
                        onStyleChange={handleStyleChange}
                        position={toolbarPosition}
                        isVisible={isEditable && !editingElement}
                    />
                ) : null}

                {editingElement ? (
                    <TextEditor
                        element={editingElement}
                        scale={scale}
                        onClose={stopTextEditing}
                        onSave={(value) => {
                            updateTextContent(editingElement.id, value);
                            stopTextEditing();
                        }}
                    />
                ) : null}
            </div>

            <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-600 shadow">
                {Math.round(scale * 100)}% canvas scale
            </div>
            {selectedElement ? (
                <div className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-600 shadow">
                    {selectedElementIds.length > 1
                        ? `${selectedElementIds.length} elements selected`
                        : `Selected: ${selectedElement.id}`}
                </div>
            ) : null}
            {hasOverflowingText ? (
                <div className="absolute left-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-xs font-medium text-white shadow">
                    Text overflow detected
                </div>
            ) : !isEditable ? (
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-600 shadow">
                    Preview mode
                </div>
            ) : null}
            {isEditable ? (
                <div className="absolute bottom-12 left-3 rounded-full bg-sky-600 px-3 py-1 text-xs font-medium text-white shadow">
                    Snap to grid and center guides active
                </div>
            ) : null}
            {cropTargetElementId ? (
                <div className="absolute left-3 top-12 rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-white shadow">
                    Crop mode active: drag the image to reposition the crop
                </div>
            ) : null}
            {isEditable ? (
                <button
                    type="button"
                    onClick={() => {
                        selectElement(null);
                        stopAllTextUi();
                    }}
                    className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow hover:bg-gray-50"
                >
                    Clear selection
                </button>
            ) : null}
        </div>
    );
};
