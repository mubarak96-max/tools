'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { PremiumSlide, PremiumElement, Dimensions, Position2D } from '../../types/premium';
import { CanvasRenderer } from '../../utils/canvasRenderer';
import { ViewportManager } from '../../utils/viewportManager';
import { InteractionManager } from '../../utils/interactionManager';
import { cn } from '../../utils/cn';

interface PremiumCanvasProps {
    slide: PremiumSlide;
    dimensions: Dimensions;
    zoom: number;
    position: Position2D;
    selectedElements: string[];
    showGrid: boolean;
    showGuides: boolean;
    isEditable: boolean;
    onElementSelect: (elementIds: string[]) => void;
    onElementUpdate: (elementId: string, updates: Partial<PremiumElement>) => void;
    onElementMove: (elementIds: string[], delta: Position2D) => void;
    onElementResize: (elementId: string, dimensions: Dimensions) => void;
    onCanvasClick: (position: Position2D) => void;
    className?: string;
}

export const PremiumCanvas: React.FC<PremiumCanvasProps> = ({
    slide,
    dimensions,
    zoom,
    position,
    selectedElements,
    showGrid,
    showGuides,
    isEditable,
    onElementSelect,
    onElementUpdate,
    onElementMove,
    onElementResize,
    onCanvasClick,
    className
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<CanvasRenderer>();
    const viewportRef = useRef<ViewportManager>();
    const interactionRef = useRef<InteractionManager>();

    const [isRendering, setIsRendering] = useState(false);
    const [renderTime, setRenderTime] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    // Initialize canvas systems
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (!canvas || !container) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Initialize renderer
        rendererRef.current = new CanvasRenderer(context, {
            enableDirtyRegions: true,
            enableTextureAtlas: true,
            maxTextureSize: 2048,
            devicePixelRatio: window.devicePixelRatio || 1
        });

        // Initialize viewport manager
        viewportRef.current = new ViewportManager(canvas, {
            minZoom: 0.1,
            maxZoom: 5,
            smoothZoom: true,
            boundsPadding: 50
        });

        // Initialize interaction manager
        if (isEditable) {
            interactionRef.current = new InteractionManager(canvas, {
                snapThreshold: 5,
                enableMultiSelect: true,
                enableGroupSelect: true
            });

            // Set up interaction callbacks
            interactionRef.current.onElementSelect = onElementSelect;
            interactionRef.current.onElementMove = onElementMove;
            interactionRef.current.onElementResize = onElementResize;
            interactionRef.current.onElementUpdate = onElementUpdate;
            interactionRef.current.onCanvasClick = onCanvasClick;
        }

        return () => {
            rendererRef.current?.dispose();
            viewportRef.current?.dispose();
            interactionRef.current?.dispose();
        };
    }, [isEditable, onElementSelect, onElementMove, onElementResize, onElementUpdate, onCanvasClick]);

    // Update canvas size
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (!canvas || !container) return;

        const updateCanvasSize = () => {
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            const context = canvas.getContext('2d');
            if (context) {
                context.scale(dpr, dpr);
            }

            // Update viewport
            viewportRef.current?.updateCanvasSize(rect.width, rect.height);
        };

        updateCanvasSize();

        const resizeObserver = new ResizeObserver(updateCanvasSize);
        resizeObserver.observe(container);

        return () => resizeObserver.disconnect();
    }, []);

    // Update viewport when zoom or position changes
    useEffect(() => {
        viewportRef.current?.setZoom(zoom);
        viewportRef.current?.setPosition(position);
    }, [zoom, position]);

    // Render slide
    const renderSlide = useCallback(async () => {
        const renderer = rendererRef.current;
        const viewport = viewportRef.current;

        if (!renderer || !viewport) return;

        setIsRendering(true);
        const startTime = performance.now();

        try {
            // Clear canvas
            renderer.clear();

            // Set viewport transform
            renderer.setTransform(viewport.getTransform());

            // Render background
            await renderer.renderBackground(slide.background, dimensions);

            // Render grid if enabled
            if (showGrid) {
                renderer.renderGrid(dimensions, {
                    size: 20,
                    subdivisions: 4,
                    color: '#e5e7eb',
                    opacity: 0.5
                });
            }

            // Sort elements by z-index
            const sortedElements = [...slide.elements].sort((a, b) => a.position.z - b.position.z);

            // Render elements
            for (const element of sortedElements) {
                await renderer.renderElement(element, {
                    selected: selectedElements.includes(element.id),
                    highlighted: false,
                    opacity: element.style.opacity || 1
                });
            }

            // Render selection indicators
            if (selectedElements.length > 0 && isEditable) {
                const selected = slide.elements.filter(el => selectedElements.includes(el.id));
                renderer.renderSelectionIndicators(selected, {
                    color: '#3B82F6',
                    handleSize: 8,
                    showHandles: true,
                    showBounds: true
                });
            }

            // Render guides if enabled
            if (showGuides && isEditable) {
                const guides = interactionRef.current?.getAlignmentGuides() || [];
                renderer.renderGuides(guides, {
                    color: '#10B981',
                    width: 1,
                    dashPattern: [5, 5]
                });
            }

            const endTime = performance.now();
            setRenderTime(endTime - startTime);

        } catch (error) {
            console.error('Canvas render error:', error);
        } finally {
            setIsRendering(false);
        }
    }, [slide, dimensions, selectedElements, showGrid, showGuides, isEditable]);

    // Render when slide or settings change
    useEffect(() => {
        renderSlide();
    }, [renderSlide]);

    // Handle mouse events
    const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isEditable || !interactionRef.current) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const clientPoint = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };

        const canvasPoint = viewportRef.current?.clientToCanvas(clientPoint) || clientPoint;

        const result = interactionRef.current.handleMouseDown(canvasPoint, {
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            button: event.button
        });

        if (result.action === 'drag') {
            setIsDragging(true);
        } else if (result.action === 'resize') {
            setIsResizing(true);
        }

        // Prevent default to avoid text selection
        event.preventDefault();
    }, [isEditable]);

    const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isEditable || !interactionRef.current) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const clientPoint = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };

        const canvasPoint = viewportRef.current?.clientToCanvas(clientPoint) || clientPoint;

        const result = interactionRef.current.handleMouseMove(canvasPoint, {
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey
        });

        // Update cursor based on interaction state
        if (result.cursor) {
            event.currentTarget.style.cursor = result.cursor;
        }

        // Re-render if elements moved
        if (result.needsRender) {
            renderSlide();
        }
    }, [isEditable, renderSlide]);

    const handleMouseUp = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isEditable || !interactionRef.current) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const clientPoint = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };

        const canvasPoint = viewportRef.current?.clientToCanvas(clientPoint) || clientPoint;

        interactionRef.current.handleMouseUp(canvasPoint);

        setIsDragging(false);
        setIsResizing(false);

        // Reset cursor
        event.currentTarget.style.cursor = 'default';
    }, [isEditable]);

    const handleWheel = useCallback((event: React.WheelEvent<HTMLCanvasElement>) => {
        if (!viewportRef.current) return;

        event.preventDefault();

        const rect = event.currentTarget.getBoundingClientRect();
        const clientPoint = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };

        if (event.ctrlKey || event.metaKey) {
            // Zoom
            const zoomDelta = -event.deltaY * 0.001;
            viewportRef.current.zoomAt(clientPoint, zoomDelta);
        } else {
            // Pan
            const panDelta = {
                x: -event.deltaX,
                y: -event.deltaY
            };
            viewportRef.current.pan(panDelta);
        }

        renderSlide();
    }, [renderSlide]);

    const handleDoubleClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isEditable || !interactionRef.current) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const clientPoint = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };

        const canvasPoint = viewportRef.current?.clientToCanvas(clientPoint) || clientPoint;

        interactionRef.current.handleDoubleClick(canvasPoint);
    }, [isEditable]);

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative w-full h-full bg-neutral-100 rounded-lg overflow-hidden',
                isDragging && 'cursor-grabbing',
                isResizing && 'cursor-nw-resize',
                className
            )}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onWheel={handleWheel}
                onDoubleClick={handleDoubleClick}
                style={{ touchAction: 'none' }}
            />

            {/* Performance indicators */}
            {process.env.NODE_ENV === 'development' && (
                <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    <div>Render: {renderTime.toFixed(1)}ms</div>
                    <div>Zoom: {(zoom * 100).toFixed(0)}%</div>
                    <div>Elements: {slide.elements.length}</div>
                    {isRendering && <div className="text-yellow-400">Rendering...</div>}
                </div>
            )}

            {/* Loading overlay */}
            {isRendering && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};