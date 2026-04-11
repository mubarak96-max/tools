'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { TextEditor } from './TextEditor';

interface CanvasElement {
    id: string;
    type: 'text';
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
    fontSize: number;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right';
    selected: boolean;
}

export const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { slides, activeSlideIndex, selectedPalette, updateSlide } = useEditorStore();
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [textOverflow, setTextOverflow] = useState<Record<string, boolean>>({});

    const currentSlide = slides[activeSlideIndex];
    const CANVAS_WIDTH = 1080;
    const CANVAS_HEIGHT = 1350;
    const SCALE = 0.37; // Scale factor for display (400px / 1080px)

    // Initialize canvas elements from slide data
    const [elements, setElements] = useState<CanvasElement[]>([]);

    useEffect(() => {
        if (!currentSlide) return;

        const newElements: CanvasElement[] = [
            {
                id: 'headline',
                type: 'text',
                x: 60,
                y: 200,
                width: 960,
                height: 200,
                content: currentSlide.headline,
                fontSize: 72,
                fontWeight: 'bold',
                color: selectedPalette.textPrimary,
                textAlign: 'left',
                selected: false
            },
            {
                id: 'body',
                type: 'text',
                x: 60,
                y: 450,
                width: 960,
                height: 300,
                content: currentSlide.body,
                fontSize: 36,
                fontWeight: 'normal',
                color: selectedPalette.textSecondary,
                textAlign: 'left',
                selected: false
            }
        ];

        setElements(newElements);
    }, [currentSlide, selectedPalette, activeSlideIndex]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw background
        if (selectedPalette.background.includes('gradient')) {
            // Handle gradient backgrounds
            const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = selectedPalette.background;
        }
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Track text overflow
        const newTextOverflow: Record<string, boolean> = {};

        // Draw elements
        elements.forEach(element => {
            if (element.type === 'text') {
                ctx.fillStyle = element.color;
                ctx.font = `${element.fontWeight} ${element.fontSize}px Inter, system-ui, sans-serif`;
                ctx.textAlign = element.textAlign;
                ctx.textBaseline = 'top';

                // Calculate text alignment offset
                let textX = element.x + 10;
                if (element.textAlign === 'center') {
                    textX = element.x + element.width / 2;
                } else if (element.textAlign === 'right') {
                    textX = element.x + element.width - 10;
                }

                // Word wrap text and check for overflow
                const words = element.content.split(' ');
                const lines: string[] = [];
                let currentLine = '';
                const maxWidth = element.width - 20; // Padding

                words.forEach(word => {
                    const testLine = currentLine + (currentLine ? ' ' : '') + word;
                    const metrics = ctx.measureText(testLine);

                    if (metrics.width > maxWidth && currentLine) {
                        lines.push(currentLine);
                        currentLine = word;
                    } else {
                        currentLine = testLine;
                    }
                });

                if (currentLine) {
                    lines.push(currentLine);
                }

                // Check for text overflow
                const lineHeight = element.fontSize * 1.2;
                const totalTextHeight = lines.length * lineHeight;
                const availableHeight = element.height - 20; // Padding
                newTextOverflow[element.id] = totalTextHeight > availableHeight;

                // Draw text lines (truncate if overflow)
                const maxLines = Math.floor(availableHeight / lineHeight);
                const linesToDraw = lines.slice(0, maxLines);

                linesToDraw.forEach((line, index) => {
                    // Add ellipsis if this is the last line and there's overflow
                    let displayLine = line;
                    if (index === maxLines - 1 && lines.length > maxLines) {
                        // Try to fit ellipsis
                        const ellipsis = '...';
                        const ellipsisWidth = ctx.measureText(ellipsis).width;

                        while (ctx.measureText(displayLine + ellipsis).width > maxWidth && displayLine.length > 0) {
                            displayLine = displayLine.slice(0, -1);
                        }
                        displayLine += ellipsis;
                    }

                    ctx.fillText(
                        displayLine,
                        textX,
                        element.y + 10 + (index * lineHeight)
                    );
                });

                // Draw selection border
                if (element.selected || selectedElement === element.id) {
                    ctx.strokeStyle = '#3b82f6';
                    ctx.lineWidth = 3;
                    ctx.setLineDash([5, 5]);
                    ctx.strokeRect(element.x, element.y, element.width, element.height);
                    ctx.setLineDash([]);
                }

                // Draw overflow warning
                if (newTextOverflow[element.id]) {
                    ctx.strokeStyle = '#ef4444';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([3, 3]);
                    ctx.strokeRect(element.x, element.y, element.width, element.height);
                    ctx.setLineDash([]);

                    // Warning icon
                    ctx.fillStyle = '#ef4444';
                    ctx.fillRect(element.x + element.width - 30, element.y + 5, 20, 20);
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 14px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('!', element.x + element.width - 20, element.y + 18);
                }
            }
        });

        // Update overflow state
        setTextOverflow(newTextOverflow);

        // Draw slide number indicator
        const slideNumber = `${activeSlideIndex + 1}/${slides.length}`;
        ctx.fillStyle = selectedPalette.accent;
        ctx.fillRect(CANVAS_WIDTH - 120, CANVAS_HEIGHT - 60, 100, 40);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(slideNumber, CANVAS_WIDTH - 70, CANVAS_HEIGHT - 45);
    };

    useEffect(() => {
        drawCanvas();
    }, [elements, selectedPalette, activeSlideIndex, slides.length, selectedElement]);

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / SCALE;
        const y = (event.clientY - rect.top) / SCALE;

        // Find clicked element
        const clickedElement = elements.find(element =>
            x >= element.x &&
            x <= element.x + element.width &&
            y >= element.y &&
            y <= element.y + element.height
        );

        if (clickedElement) {
            setSelectedElement(clickedElement.id);
            setElements(prev => prev.map(el => ({
                ...el,
                selected: el.id === clickedElement.id
            })));
        } else {
            setSelectedElement(null);
            setElements(prev => prev.map(el => ({ ...el, selected: false })));
        }
    };

    const handleTextEditorChange = (property: string, value: any) => {
        if (!selectedElement) return;

        setElements(prev => prev.map(el =>
            el.id === selectedElement ? { ...el, [property]: value } : el
        ));

        // Update slide data
        if (selectedElement === 'headline' && property === 'content') {
            updateSlide(activeSlideIndex, { headline: value });
        } else if (selectedElement === 'body' && property === 'content') {
            updateSlide(activeSlideIndex, { body: value });
        }
    };

    const selectedElementData = elements.find(el => el.id === selectedElement);

    if (!currentSlide) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center text-gray-500">
                    No slide selected
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    Slide {activeSlideIndex + 1} of {slides.length}
                </h3>
                <div className="text-sm text-gray-500">
                    1080 × 1350px
                </div>
            </div>

            {/* Text Overflow Warnings */}
            {Object.entries(textOverflow).some(([_, hasOverflow]) => hasOverflow) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Text Overflow Warning</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                        Some text elements are too large for their containers. Consider reducing font size or content length.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Canvas Container */}
                <div className="lg:col-span-2" ref={containerRef}>
                    <div className="flex justify-center">
                        <div className="relative">
                            <canvas
                                ref={canvasRef}
                                width={CANVAS_WIDTH}
                                height={CANVAS_HEIGHT}
                                className="border border-gray-300 rounded-lg shadow-lg cursor-pointer"
                                style={{
                                    width: `${CANVAS_WIDTH * SCALE}px`,
                                    height: `${CANVAS_HEIGHT * SCALE}px`
                                }}
                                onClick={handleCanvasClick}
                            />
                        </div>
                    </div>
                </div>

                {/* Text Editor Panel */}
                <div className="lg:col-span-1">
                    {selectedElementData ? (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-4">
                                Edit {selectedElementData.id === 'headline' ? 'Headline' : 'Body Text'}
                                {textOverflow[selectedElementData.id] && (
                                    <span className="ml-2 text-red-600 text-sm">(Overflow!)</span>
                                )}
                            </h4>
                            <TextEditor
                                elementId={selectedElementData.id}
                                content={selectedElementData.content}
                                fontSize={selectedElementData.fontSize}
                                fontWeight={selectedElementData.fontWeight}
                                color={selectedElementData.color}
                                textAlign={selectedElementData.textAlign}
                                onContentChange={(content) => handleTextEditorChange('content', content)}
                                onFontSizeChange={(fontSize) => handleTextEditorChange('fontSize', fontSize)}
                                onFontWeightChange={(fontWeight) => handleTextEditorChange('fontWeight', fontWeight)}
                                onColorChange={(color) => handleTextEditorChange('color', color)}
                                onTextAlignChange={(textAlign) => handleTextEditorChange('textAlign', textAlign)}
                            />
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                            <p>Click on a text element to edit its properties</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Canvas Controls */}
            <div className="mt-6 flex justify-center gap-4">
                <button
                    onClick={() => useEditorStore.getState().setActiveSlide(Math.max(0, activeSlideIndex - 1))}
                    disabled={activeSlideIndex === 0}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    ← Previous
                </button>

                <button
                    onClick={() => useEditorStore.getState().setActiveSlide(Math.min(slides.length - 1, activeSlideIndex + 1))}
                    disabled={activeSlideIndex === slides.length - 1}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    Next →
                </button>
            </div>
        </div>
    );
};