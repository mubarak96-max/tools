'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { TemplateElement, Position, Dimensions } from '../types';
import {
    getElementAtPosition,
    constrainElementToBounds,
    screenToCanvas,
    getSelectionHandles,
} from '../utils/canvasUtils';

interface UseCanvasInteractionProps {
    elements: TemplateElement[];
    canvasDimensions: Dimensions;
    scale: number;
    isEditable: boolean;
    onElementUpdate: (elementId: string, updates: Partial<TemplateElement>) => void;
}

type AlignmentGuide = { orientation: 'horizontal' | 'vertical'; position: number };
type ElementStateMap = Record<string, TemplateElement>;

interface InteractionState {
    selectedElementIds: string[];
    selectedElementId: string | null;
    isDragging: boolean;
    isResizing: boolean;
    dragOffset: Position;
    resizeHandle: string | null;
    initialElementState: TemplateElement | null;
    initialSelectedStates: ElementStateMap;
    alignmentGuides: AlignmentGuide[];
}

const GRID_SIZE = 10;
const SNAP_THRESHOLD = 4;

const snapToGrid = (value: number) => {
    const snapped = Math.round(value / GRID_SIZE) * GRID_SIZE;
    return Math.abs(snapped - value) <= SNAP_THRESHOLD ? snapped : value;
};

const findElementSnap = (
    axisStart: number,
    axisSize: number,
    others: TemplateElement[],
    axis: 'x' | 'y'
): { delta: number; guide: number } | null => {
    const candidatePoints = [
        axisStart,
        axisStart + axisSize / 2,
        axisStart + axisSize,
    ];

    let bestMatch: { delta: number; guide: number } | null = null;

    others.forEach((element) => {
        const otherStart = axis === 'x' ? element.position.x : element.position.y;
        const otherSize = axis === 'x' ? element.dimensions.width : element.dimensions.height;
        const otherPoints = [
            otherStart,
            otherStart + otherSize / 2,
            otherStart + otherSize,
        ];

        candidatePoints.forEach((candidatePoint) => {
            otherPoints.forEach((otherPoint) => {
                const delta = otherPoint - candidatePoint;
                if (Math.abs(delta) > SNAP_THRESHOLD * 2) {
                    return;
                }

                if (!bestMatch || Math.abs(delta) < Math.abs(bestMatch.delta)) {
                    bestMatch = {
                        delta,
                        guide: otherPoint,
                    };
                }
            });
        });
    });

    return bestMatch;
};

const canMoveElement = (element: TemplateElement) => element.constraints.allowMove !== false;
const canResizeElement = (element: TemplateElement) => element.constraints.allowResize !== false;

export const useCanvasInteraction = ({
    elements,
    canvasDimensions,
    scale,
    isEditable,
    onElementUpdate,
}: UseCanvasInteractionProps) => {
    const [state, setState] = useState<InteractionState>({
        selectedElementIds: [],
        selectedElementId: null,
        isDragging: false,
        isResizing: false,
        dragOffset: { x: 0, y: 0, z: 0 },
        resizeHandle: null,
        initialElementState: null,
        initialSelectedStates: {},
        alignmentGuides: [],
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const getCanvasRect = useCallback((): DOMRect | null => {
        return canvasRef.current?.getBoundingClientRect() || null;
    }, []);

    const getCanvasPosition = useCallback((event: MouseEvent | React.MouseEvent): Position | null => {
        const rect = getCanvasRect();
        if (!rect) {
            return null;
        }

        return screenToCanvas(
            { x: event.clientX, y: event.clientY, z: 0 },
            rect,
            scale
        );
    }, [getCanvasRect, scale]);

    const selectElement = useCallback((elementId: string | null, additive: boolean = false) => {
        setState((prev) => {
            if (!elementId) {
                return {
                    ...prev,
                    selectedElementIds: [],
                    selectedElementId: null,
                    isDragging: false,
                    isResizing: false,
                    resizeHandle: null,
                    initialElementState: null,
                    initialSelectedStates: {},
                    alignmentGuides: [],
                };
            }

            if (!additive) {
                return {
                    ...prev,
                    selectedElementIds: [elementId],
                    selectedElementId: elementId,
                    isDragging: false,
                    isResizing: false,
                    resizeHandle: null,
                    initialElementState: null,
                    initialSelectedStates: {},
                    alignmentGuides: [],
                };
            }

            const alreadySelected = prev.selectedElementIds.includes(elementId);
            const nextSelected = alreadySelected
                ? prev.selectedElementIds.filter((id) => id !== elementId)
                : [...prev.selectedElementIds, elementId];

            return {
                ...prev,
                selectedElementIds: nextSelected,
                selectedElementId: alreadySelected
                    ? nextSelected[nextSelected.length - 1] ?? null
                    : elementId,
                isDragging: false,
                isResizing: false,
                resizeHandle: null,
                initialElementState: null,
                initialSelectedStates: {},
                alignmentGuides: [],
            };
        });
    }, []);

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

    const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isEditable) {
            return;
        }

        const position = getCanvasPosition(event);
        if (!position) {
            return;
        }

        const clickedElement = getElementAtPosition(elements, position);
        const isAdditiveSelection = event.shiftKey;

        if (!clickedElement) {
            selectElement(null);
            return;
        }

        if (isAdditiveSelection) {
            selectElement(clickedElement.id, true);
            return;
        }

        const activeSelection = state.selectedElementIds.includes(clickedElement.id)
            ? state.selectedElementIds
            : [clickedElement.id];
        const initialSelectedStates = Object.fromEntries(
            activeSelection
                .map((id) => elements.find((element) => element.id === id))
                .filter((element): element is TemplateElement => Boolean(element))
                .map((element) => [element.id, { ...element }])
        );

        if (
            activeSelection.length === 1 &&
            state.selectedElementId === clickedElement.id &&
            canResizeElement(clickedElement)
        ) {
            const resizeHandle = getResizeHandle(position, clickedElement);
            if (resizeHandle) {
                setState((prev) => ({
                    ...prev,
                    selectedElementIds: [clickedElement.id],
                    selectedElementId: clickedElement.id,
                    isResizing: true,
                    resizeHandle,
                    initialElementState: { ...clickedElement },
                    initialSelectedStates,
                }));
                return;
            }
        }

        if (activeSelection.length > 1 || canMoveElement(clickedElement)) {
            setState((prev) => ({
                ...prev,
                selectedElementIds: activeSelection,
                selectedElementId: clickedElement.id,
                isDragging: true,
                dragOffset: {
                    x: position.x - clickedElement.position.x,
                    y: position.y - clickedElement.position.y,
                    z: 0,
                },
                initialElementState: { ...clickedElement },
                initialSelectedStates,
                alignmentGuides: [],
                isResizing: false,
                resizeHandle: null,
            }));
            return;
        }

        setState((prev) => ({
            ...prev,
            selectedElementIds: [clickedElement.id],
            selectedElementId: clickedElement.id,
            alignmentGuides: [],
        }));
    }, [elements, getCanvasPosition, getResizeHandle, isEditable, selectElement, state.selectedElementId, state.selectedElementIds]);

    const moveElements = useCallback((elementIds: string[], deltaX: number, deltaY: number, sourceStates?: ElementStateMap) => {
        elementIds.forEach((elementId) => {
            const element = sourceStates?.[elementId] ?? elements.find((candidate) => candidate.id === elementId);
            if (!element || !canMoveElement(element)) {
                return;
            }

            const newPosition = constrainElementToBounds(
                {
                    ...element,
                    position: {
                        x: element.position.x + deltaX,
                        y: element.position.y + deltaY,
                        z: element.position.z,
                    },
                },
                canvasDimensions
            );

            onElementUpdate(elementId, { position: newPosition });
        });
    }, [canvasDimensions, elements, onElementUpdate]);

    const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isEditable) {
            return;
        }

        const position = getCanvasPosition(event);
        if (!position) {
            return;
        }

        const canvas = canvasRef.current;
        if (canvas) {
            if (state.selectedElementId) {
                const selectedElement = elements.find((element) => element.id === state.selectedElementId);
                if (selectedElement && state.selectedElementIds.length === 1) {
                    const resizeHandle = canResizeElement(selectedElement)
                        ? getResizeHandle(position, selectedElement)
                        : null;
                    if (resizeHandle) {
                        const handle = getSelectionHandles(selectedElement, 8).find((candidate) => candidate.id === resizeHandle);
                        canvas.style.cursor = handle?.cursor || 'default';
                    } else if (canMoveElement(selectedElement)) {
                        canvas.style.cursor = state.isDragging ? 'grabbing' : 'grab';
                    } else {
                        canvas.style.cursor = 'default';
                    }
                }
            } else {
                const hoveredElement = getElementAtPosition(elements, position);
                canvas.style.cursor = hoveredElement ? 'grab' : 'default';
            }
        }

        if (state.isDragging && state.selectedElementId && state.initialElementState) {
            const tentativeX = snapToGrid(position.x - state.dragOffset.x);
            const tentativeY = snapToGrid(position.y - state.dragOffset.y);
            const primaryInitialState = state.initialSelectedStates[state.selectedElementId] ?? state.initialElementState;
            const tentativePrimary = {
                ...primaryInitialState,
                position: {
                    x: tentativeX,
                    y: tentativeY,
                    z: primaryInitialState.position.z,
                },
            };
            const newPrimaryPosition = constrainElementToBounds(tentativePrimary, canvasDimensions);
            const guides: AlignmentGuide[] = [];
            const elementCenterX = newPrimaryPosition.x + primaryInitialState.dimensions.width / 2;
            const elementCenterY = newPrimaryPosition.y + primaryInitialState.dimensions.height / 2;
            const canvasCenterX = canvasDimensions.width / 2;
            const canvasCenterY = canvasDimensions.height / 2;
            const otherElements = elements.filter((element) => !state.selectedElementIds.includes(element.id));

            if (Math.abs(elementCenterX - canvasCenterX) <= SNAP_THRESHOLD * 2) {
                newPrimaryPosition.x = canvasCenterX - primaryInitialState.dimensions.width / 2;
                guides.push({ orientation: 'vertical', position: canvasCenterX });
            }

            if (Math.abs(elementCenterY - canvasCenterY) <= SNAP_THRESHOLD * 2) {
                newPrimaryPosition.y = canvasCenterY - primaryInitialState.dimensions.height / 2;
                guides.push({ orientation: 'horizontal', position: canvasCenterY });
            }

            const horizontalSnap = findElementSnap(
                newPrimaryPosition.x,
                primaryInitialState.dimensions.width,
                otherElements,
                'x'
            );
            if (horizontalSnap) {
                newPrimaryPosition.x += horizontalSnap.delta;
                guides.push({ orientation: 'vertical', position: horizontalSnap.guide });
            }

            const verticalSnap = findElementSnap(
                newPrimaryPosition.y,
                primaryInitialState.dimensions.height,
                otherElements,
                'y'
            );
            if (verticalSnap) {
                newPrimaryPosition.y += verticalSnap.delta;
                guides.push({ orientation: 'horizontal', position: verticalSnap.guide });
            }

            const deltaX = newPrimaryPosition.x - primaryInitialState.position.x;
            const deltaY = newPrimaryPosition.y - primaryInitialState.position.y;
            moveElements(state.selectedElementIds, deltaX, deltaY, state.initialSelectedStates);

            setState((prev) => ({
                ...prev,
                alignmentGuides: guides,
            }));
        }

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

            newDimensions.width = Math.max(20, snapToGrid(newDimensions.width));
            newDimensions.height = Math.max(20, snapToGrid(newDimensions.height));

            const guides: AlignmentGuide[] = [];
            const resizedCenterX = newPosition.x + newDimensions.width / 2;
            const resizedCenterY = newPosition.y + newDimensions.height / 2;
            const canvasCenterX = canvasDimensions.width / 2;
            const canvasCenterY = canvasDimensions.height / 2;

            if (Math.abs(resizedCenterX - canvasCenterX) <= SNAP_THRESHOLD * 2) {
                guides.push({ orientation: 'vertical', position: canvasCenterX });
            }

            if (Math.abs(resizedCenterY - canvasCenterY) <= SNAP_THRESHOLD * 2) {
                guides.push({ orientation: 'horizontal', position: canvasCenterY });
            }

            setState((prev) => ({
                ...prev,
                alignmentGuides: guides,
            }));

            onElementUpdate(state.selectedElementId, {
                position: newPosition,
                dimensions: newDimensions,
            });
        }
    }, [
        canvasDimensions,
        elements,
        getCanvasPosition,
        getResizeHandle,
        isEditable,
        moveElements,
        onElementUpdate,
        state,
    ]);

    const handleMouseUp = useCallback(() => {
        setState((prev) => ({
            ...prev,
            isDragging: false,
            isResizing: false,
            resizeHandle: null,
            initialElementState: null,
            initialSelectedStates: {},
            alignmentGuides: [],
        }));

        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'default';
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        handleMouseUp();
    }, [handleMouseUp]);

    const moveSelectedElement = useCallback((deltaX: number, deltaY: number) => {
        if (!state.selectedElementIds.length) {
            return;
        }

        moveElements(state.selectedElementIds, deltaX, deltaY);
    }, [moveElements, state.selectedElementIds]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isEditable || !state.selectedElementIds.length) {
                return;
            }

            switch (event.key) {
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
    }, [isEditable, moveSelectedElement, selectElement, state.selectedElementIds.length]);

    return {
        canvasRef,
        selectedElementId: state.selectedElementId,
        selectedElementIds: state.selectedElementIds,
        isDragging: state.isDragging,
        isResizing: state.isResizing,
        alignmentGuides: state.alignmentGuides,
        selectElement,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleMouseLeave,
    };
};
