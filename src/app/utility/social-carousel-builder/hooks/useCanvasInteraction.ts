'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { TemplateElement, Position, Dimensions } from '../types';
import {
    getElementAtPosition,
    constrainElementToBounds,
    screenToCanvas,
    getSelectionHandles
} from '../utils/canvasUtils';

interface UseCanvasInteractionProps {
    elements: TemplateElement[];
    canvasDimensions: Dimensions;
    scale: number;
    isEditable: boolean;
    onElementUpdate: (elementId: string, updates: Partial<TemplateElement>) => void;
}

interface InteractionState {
    selectedElementId: string | null;
    isDragging: boolean;
    isResizing: boolean;
    dragOffset: Position;
    resizeHandle: string | null;
    initialElementState: TemplateElement | null;
}

export const useCanvasInteraction = ({
    elements,
    canvasDimensions,
    scale,
    isEditable,
    onElementUpdate
}: UseCanvasInteractionProps) => {
    const [state, setState] = useState<InteractionState>({
        selectedElementId: null,
        isDragging: false,
        isResizing: false,
        dragOffset: { x: 0, y: 0, z: 0 },
        resizeHandle: null,
        initialElementState: null
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Get canvas rect for coordinate conversion
    const getCanvasRect = useCallback((): DOMRect | null => {
        return canvasRef.current?.getBoundingClientRect() || null;
    }, []);

    // Convert mouse event to canvas coordinates
    const getCanvasPosition = useCallback((event: MouseEvent | React.MouseEvent): Position | null => {
        const rect = getCanvasRect();
        if (!rect) return null;

        return screenToCanvas(
            { x: event.clientX, y: event.clientY, z: 0 },
            rect,
            scale
        );
    }, [scale, getCanvasRect]);

    // Select element
    const selectElement = useCallback((elementId: string | null) => {
        setState(prev => ({
            ...prev,
            selectedElementId: elementId,
            isDragging: false,
            isResizing: false,
            resizeHandle: null,
            initialElementState: null
        }));
    }, []);

    // Check if position is on a resize handle
    const getResizeHandle = useCallback((position: Position, element: TemplateElement): string | null => {
        const handles = getSelectionHandles(element, 8);

        for (const handle of handles) {
            if (
                position.x >= handle.x &&
                position.x <= handle.x + 8 &&
                position.y >= handle.y &&
                position.y <= handle.y + 8
            ) {
                return handle.id;
            }
        }

        return null;
    }, []);

    // Handle mouse down
    const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isEditable) return;

        const position = getCanvasPosition(event);
        if (!position) return;

        const clickedElement = getElementAtPosition(elements, position);

        if (clickedElement) {
            // Check if clicking on a resize handle
            if (state.selectedElementId === clickedElement.id) {
                const resizeHandle = getResizeHandle(position, clickedElement);
                if (resizeHandle) {
                    setState(prev => ({
                        ...prev,
                        isResizing: true,
                        resizeHandle,
                        initialElementState: { ...clickedElement }
                    }));
                    return;
                }
            }

            // Start dragging
            selectElement(clickedElement.id);
            setState(prev => ({
                ...prev,
                isDragging: true,
                dragOffset: {
                    x: position.x - clickedElement.position.x,
                    y: position.y - clickedElement.position.y,
                    z: 0
                },
                initialElementState: { ...clickedElement }
            }));
        } else {
            // Clicked on empty space
            selectElement(null);
        }
    }, [isEditable, getCanvasPosition, elements, state.selectedElementId, getResizeHandle, selectElement]);

    // Handle mouse move
    const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isEditable) return;

        const position = getCanvasPosition(event);
        if (!position) return;

        // Update cursor based on hover state
        const canvas = canvasRef.current;
        if (canvas) {
            if (state.selectedElementId) {
                const selectedElement = elements.find(el => el.id === state.selectedElementId);
                if (selectedElement) {
                    const resizeHandle = getResizeHandle(position, selectedElement);
                    if (resizeHandle) {
                        const handle = getSelectionHandles(selectedElement, 8).find(h => h.id === resizeHandle);
                        canvas.style.cursor = handle?.cursor || 'default';
                    } else {
                        canvas.style.cursor = state.isDragging ? 'grabbing' : 'grab';
                    }
                }
            } else {
                const hoveredElement = getElementAtPosition(elements, position);
                canvas.style.cursor = hoveredElement ? 'grab' : 'default';
            }
        }

        // Handle dragging
        if (state.isDragging && state.selectedElementId && state.initialElementState) {
            const newPosition = constrainElementToBounds(
                {
                    ...state.initialElementState,
                    position: {
                        x: position.x - state.dragOffset.x,
                        y: position.y - state.dragOffset.y,
                        z: state.initialElementState.position.z
                    }
                },
                canvasDimensions
            );

            onElementUpdate(state.selectedElementId, { position: newPosition });
        }

        // Handle resizing
        if (state.isResizing && state.selectedElementId && state.initialElementState && state.resizeHandle) {
            const element = state.initialElementState;
            const newDimensions = { ...element.dimensions };
            const newPosition = { ...element.position };

            const deltaX = position.x - (element.position.x + element.dimensions.width / 2);
            const deltaY = position.y - (element.position.y + element.dimensions.height / 2);

            switch (state.resizeHandle) {
                case 'top-left':
                    newDimensions.width = Math.max(20, element.dimensions.width - deltaX);
                    newDimensions.height = Math.max(20, element.dimensions.height - deltaY);
                    newPosition.x = element.position.x + deltaX;
                    newPosition.y = element.position.y + deltaY;
                    break;
                case 'top-right':
                    newDimensions.width = Math.max(20, element.dimensions.width + deltaX);
                    newDimensions.height = Math.max(20, element.dimensions.height - deltaY);
                    newPosition.y = element.position.y + deltaY;
                    break;
                case 'bottom-left':
                    newDimensions.width = Math.max(20, element.dimensions.width - deltaX);
                    newDimensions.height = Math.max(20, element.dimensions.height + deltaY);
                    newPosition.x = element.position.x + deltaX;
                    break;
                case 'bottom-right':
                    newDimensions.width = Math.max(20, element.dimensions.width + deltaX);
                    newDimensions.height = Math.max(20, element.dimensions.height + deltaY);
                    break;
                case 'top':
                    newDimensions.height = Math.max(20, element.dimensions.height - deltaY);
                    newPosition.y = element.position.y + deltaY;
                    break;
                case 'bottom':
                    newDimensions.height = Math.max(20, element.dimensions.height + deltaY);
                    break;
                case 'left':
                    newDimensions.width = Math.max(20, element.dimensions.width - deltaX);
                    newPosition.x = element.position.x + deltaX;
                    break;
                case 'right':
                    newDimensions.width = Math.max(20, element.dimensions.width + deltaX);
                    break;
            }

            // Ensure element stays within bounds
            if (newPosition.x + newDimensions.width > canvasDimensions.width) {
                newDimensions.width = canvasDimensions.width - newPosition.x;
            }
            if (newPosition.y + newDimensions.height > canvasDimensions.height) {
                newDimensions.height = canvasDimensions.height - newPosition.y;
            }
            if (newPosition.x < 0) {
                newDimensions.width += newPosition.x;
                newPosition.x = 0;
            }
            if (newPosition.y < 0) {
                newDimensions.height += newPosition.y;
                newPosition.y = 0;
            }

            onElementUpdate(state.selectedElementId, {
                position: newPosition,
                dimensions: newDimensions
            });
        }
    }, [
        isEditable,
        getCanvasPosition,
        state,
        elements,
        getResizeHandle,
        canvasDimensions,
        onElementUpdate
    ]);

    // Handle mouse up
    const handleMouseUp = useCallback(() => {
        setState(prev => ({
            ...prev,
            isDragging: false,
            isResizing: false,
            resizeHandle: null,
            initialElementState: null
        }));

        // Reset cursor
        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'default';
        }
    }, []);

    // Handle mouse leave
    const handleMouseLeave = useCallback(() => {
        handleMouseUp();
    }, [handleMouseUp]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isEditable || !state.selectedElementId) return;

            switch (event.key) {
                case 'Delete':
                case 'Backspace':
                    // Handle element deletion (would need to be implemented in parent)
                    break;
                case 'Escape':
                    selectElement(null);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    moveSelectedElement(0, -1);
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    moveSelectedElement(0, 1);
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    moveSelectedElement(-1, 0);
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    moveSelectedElement(1, 0);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isEditable, state.selectedElementId, selectElement]);

    // Move selected element
    const moveSelectedElement = useCallback((deltaX: number, deltaY: number) => {
        if (!state.selectedElementId) return;

        const element = elements.find(el => el.id === state.selectedElementId);
        if (!element) return;

        const newPosition = constrainElementToBounds(
            {
                ...element,
                position: {
                    x: element.position.x + deltaX,
                    y: element.position.y + deltaY,
                    z: element.position.z
                }
            },
            canvasDimensions
        );

        onElementUpdate(state.selectedElementId, { position: newPosition });
    }, [state.selectedElementId, elements, canvasDimensions, onElementUpdate]);

    return {
        canvasRef,
        selectedElementId: state.selectedElementId,
        isDragging: state.isDragging,
        isResizing: state.isResizing,
        selectElement,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleMouseLeave
    };
};