'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SlideCanvasProps, TemplateElement } from '../types';
import { useCanvasInteraction } from '../hooks/useCanvasInteraction';
import { useTextEditing } from '../hooks/useTextEditing';
import {
    calculateCanvasScale,
    drawRoundedRect,
    getElementAtPosition,
    getWrappedTextLayout,
    renderSelectionIndicator,
    renderTextWithWordWrap,
} from '../utils/canvasUtils';
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
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
    const [scale, setScale] = useState(1);

    const {
        canvasRef,
        selectedElementId,
        isDragging,
        isResizing,
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

        const elements = [...slide.elements].sort((left, right) => left.position.z - right.position.z);

        elements.forEach((element) => {
            if (element.type === 'shape') {
                context.save();
                context.globalAlpha = element.style.opacity ?? 1;
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
                context.restore();
                return;
            }

            if (element.type === 'image') {
                context.save();
                context.globalAlpha = element.style.opacity ?? 1;
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
                        context.drawImage(
                            cachedImage,
                            element.position.x,
                            element.position.y,
                            element.dimensions.width,
                            element.dimensions.height
                        );
                    } else {
                        const image = new Image();
                        image.onload = () => {
                            imageCacheRef.current.set(imageSource, image);
                            renderCanvas();
                        };
                        image.src = imageSource;
                        imageCacheRef.current.set(imageSource, image);
                    }
                } else {
                    context.fillStyle = '#9ca3af';
                    context.font = `${Math.min(element.dimensions.width, element.dimensions.height) * 0.2}px Arial`;
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    context.fillText(
                        'Image',
                        element.position.x + element.dimensions.width / 2,
                        element.position.y + element.dimensions.height / 2
                    );
                }
                context.restore();
                return;
            }

            if (typeof element.content !== 'string') {
                return;
            }

            context.save();
            context.globalAlpha = element.style.opacity ?? 1;

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
                element.content,
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

            context.restore();
        });

        if (selectedElement && isEditable) {
            renderSelectionIndicator(context, selectedElement, { color: '#2563eb', handleSize: 10 });
        }
    }, [canvasRef, dimensions, isEditable, selectedElement, slide.backgroundColor, slide.elements]);

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
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
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
                    Selected: {selectedElement.id}
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
