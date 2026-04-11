import { PremiumElement, Position2D, Dimensions } from '../types/premium';
import { AlignmentGuide } from './canvasRenderer';

export interface InteractionManagerOptions {
    snapThreshold?: number;
    enableMultiSelect?: boolean;
    enableGroupSelect?: boolean;
}

export interface MouseEventModifiers {
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    button?: number;
}

export interface InteractionResult {
    action: 'none' | 'select' | 'drag' | 'resize' | 'rotate';
    cursor?: string;
    needsRender?: boolean;
}

export type ResizeHandle =
    | 'top-left' | 'top-center' | 'top-right'
    | 'right-center' | 'bottom-right' | 'bottom-center'
    | 'bottom-left' | 'left-center';

export class InteractionManager {
    private canvas: HTMLCanvasElement;
    private options: Required<InteractionManagerOptions>;
    private elements: PremiumElement[] = [];
    private selectedElements: string[] = [];
    private isDragging = false;
    private isResizing = false;
    private dragStartPoint: Position2D | null = null;
    private dragOffset: Position2D = { x: 0, y: 0 };
    private resizeHandle: ResizeHandle | null = null;
    private resizeStartBounds: DOMRect | null = null;
    private alignmentGuides: AlignmentGuide[] = [];

    // Callbacks
    onElementSelect?: (elementIds: string[]) => void;
    onElementMove?: (elementIds: string[], delta: Position2D) => void;
    onElementResize?: (elementId: string, dimensions: Dimensions) => void;
    onElementUpdate?: (elementId: string, updates: Partial<PremiumElement>) => void;
    onCanvasClick?: (position: Position2D) => void;

    constructor(canvas: HTMLCanvasElement, options: InteractionManagerOptions = {}) {
        this.canvas = canvas;
        this.options = {
            snapThreshold: options.snapThreshold ?? 5,
            enableMultiSelect: options.enableMultiSelect ?? true,
            enableGroupSelect: options.enableGroupSelect ?? true
        };
    }

    setElements(elements: PremiumElement[]): void {
        this.elements = elements;
    }

    setSelectedElements(elementIds: string[]): void {
        this.selectedElements = elementIds;
    }

    handleMouseDown(point: Position2D, modifiers: MouseEventModifiers): InteractionResult {
        this.dragStartPoint = point;

        // Check for resize handle first
        const resizeHandle = this.getResizeHandleAt(point);
        if (resizeHandle && this.selectedElements.length === 1) {
            this.isResizing = true;
            this.resizeHandle = resizeHandle;

            const element = this.elements.find(el => el.id === this.selectedElements[0]);
            if (element) {
                this.resizeStartBounds = new DOMRect(
                    element.position.x,
                    element.position.y,
                    element.dimensions.width,
                    element.dimensions.height
                );
            }

            return { action: 'resize', cursor: this.getResizeCursor(resizeHandle) };
        }

        // Check for element selection
        const elementAtPoint = this.getElementAt(point);

        if (elementAtPoint) {
            // Handle multi-selection
            if (modifiers.ctrlKey || modifiers.shiftKey) {
                if (this.options.enableMultiSelect) {
                    const isSelected = this.selectedElements.includes(elementAtPoint.id);
                    if (isSelected) {
                        this.selectedElements = this.selectedElements.filter(id => id !== elementAtPoint.id);
                    } else {
                        this.selectedElements.push(elementAtPoint.id);
                    }
                }
            } else {
                // Single selection
                if (!this.selectedElements.includes(elementAtPoint.id)) {
                    this.selectedElements = [elementAtPoint.id];
                }
            }

            // Start dragging if element is selected
            if (this.selectedElements.includes(elementAtPoint.id)) {
                this.isDragging = true;
                this.dragOffset = {
                    x: point.x - elementAtPoint.position.x,
                    y: point.y - elementAtPoint.position.y
                };

                this.onElementSelect?.(this.selectedElements);
                return { action: 'drag', cursor: 'grabbing', needsRender: true };
            }
        } else {
            // Clicked on empty space
            if (!modifiers.ctrlKey && !modifiers.shiftKey) {
                this.selectedElements = [];
                this.onElementSelect?.([]);
                this.onCanvasClick?.(point);
                return { action: 'select', needsRender: true };
            }
        }

        return { action: 'none' };
    }

    handleMouseMove(point: Position2D, modifiers: MouseEventModifiers): InteractionResult {
        if (this.isResizing && this.resizeHandle && this.resizeStartBounds && this.dragStartPoint) {
            return this.handleResize(point);
        }

        if (this.isDragging && this.dragStartPoint) {
            return this.handleDrag(point);
        }

        // Update cursor based on what's under the mouse
        const resizeHandle = this.getResizeHandleAt(point);
        if (resizeHandle && this.selectedElements.length === 1) {
            return { action: 'none', cursor: this.getResizeCursor(resizeHandle) };
        }

        const elementAtPoint = this.getElementAt(point);
        if (elementAtPoint) {
            return { action: 'none', cursor: 'grab' };
        }

        return { action: 'none', cursor: 'default' };
    }

    handleMouseUp(point: Position2D): InteractionResult {
        const wasDragging = this.isDragging;
        const wasResizing = this.isResizing;

        this.isDragging = false;
        this.isResizing = false;
        this.dragStartPoint = null;
        this.resizeHandle = null;
        this.resizeStartBounds = null;
        this.alignmentGuides = [];

        if (wasDragging || wasResizing) {
            return { action: 'none', needsRender: true };
        }

        return { action: 'none' };
    }

    handleDoubleClick(point: Position2D): InteractionResult {
        const elementAtPoint = this.getElementAt(point);

        if (elementAtPoint && elementAtPoint.type === 'text') {
            // Start text editing
            this.selectedElements = [elementAtPoint.id];
            this.onElementSelect?.(this.selectedElements);
            // Trigger text editing mode (would be handled by parent component)
            return { action: 'none', needsRender: true };
        }

        return { action: 'none' };
    }

    private handleDrag(point: Position2D): InteractionResult {
        if (!this.dragStartPoint) return { action: 'none' };

        const delta = {
            x: point.x - this.dragStartPoint.x,
            y: point.y - this.dragStartPoint.y
        };

        // Apply snapping
        const snappedDelta = this.applySnapping(delta);

        // Move selected elements
        this.onElementMove?.(this.selectedElements, snappedDelta);

        // Update drag start point for next move
        this.dragStartPoint = {
            x: this.dragStartPoint.x + snappedDelta.x,
            y: this.dragStartPoint.y + snappedDelta.y
        };

        return { action: 'drag', cursor: 'grabbing', needsRender: true };
    }

    private handleResize(point: Position2D): InteractionResult {
        if (!this.resizeHandle || !this.resizeStartBounds || !this.dragStartPoint) {
            return { action: 'none' };
        }

        const element = this.elements.find(el => el.id === this.selectedElements[0]);
        if (!element) return { action: 'none' };

        const delta = {
            x: point.x - this.dragStartPoint.x,
            y: point.y - this.dragStartPoint.y
        };

        const newDimensions = this.calculateResizedDimensions(
            this.resizeStartBounds,
            this.resizeHandle,
            delta,
            element.constraints?.lockAspectRatio
        );

        // Apply minimum size constraints
        const minWidth = element.constraints?.minWidth || 10;
        const minHeight = element.constraints?.minHeight || 10;
        const maxWidth = element.constraints?.maxWidth || Infinity;
        const maxHeight = element.constraints?.maxHeight || Infinity;

        newDimensions.width = Math.max(minWidth, Math.min(maxWidth, newDimensions.width));
        newDimensions.height = Math.max(minHeight, Math.min(maxHeight, newDimensions.height));

        this.onElementResize?.(element.id, newDimensions);

        return { action: 'resize', cursor: this.getResizeCursor(this.resizeHandle), needsRender: true };
    }

    private getElementAt(point: Position2D): PremiumElement | null {
        // Check elements in reverse z-order (top to bottom)
        const sortedElements = [...this.elements].sort((a, b) => b.position.z - a.position.z);

        for (const element of sortedElements) {
            if (this.isPointInElement(point, element)) {
                return element;
            }
        }

        return null;
    }

    private isPointInElement(point: Position2D, element: PremiumElement): boolean {
        const { x, y } = element.position;
        const { width, height } = element.dimensions;

        return (
            point.x >= x &&
            point.x <= x + width &&
            point.y >= y &&
            point.y <= y + height
        );
    }

    private getResizeHandleAt(point: Position2D): ResizeHandle | null {
        if (this.selectedElements.length !== 1) return null;

        const element = this.elements.find(el => el.id === this.selectedElements[0]);
        if (!element || element.constraints?.allowResize === false) return null;

        const { x, y } = element.position;
        const { width, height } = element.dimensions;
        const handleSize = 8;
        const halfHandle = handleSize / 2;

        const handles: { handle: ResizeHandle; bounds: DOMRect }[] = [
            { handle: 'top-left', bounds: new DOMRect(x - halfHandle, y - halfHandle, handleSize, handleSize) },
            { handle: 'top-center', bounds: new DOMRect(x + width / 2 - halfHandle, y - halfHandle, handleSize, handleSize) },
            { handle: 'top-right', bounds: new DOMRect(x + width - halfHandle, y - halfHandle, handleSize, handleSize) },
            { handle: 'right-center', bounds: new DOMRect(x + width - halfHandle, y + height / 2 - halfHandle, handleSize, handleSize) },
            { handle: 'bottom-right', bounds: new DOMRect(x + width - halfHandle, y + height - halfHandle, handleSize, handleSize) },
            { handle: 'bottom-center', bounds: new DOMRect(x + width / 2 - halfHandle, y + height - halfHandle, handleSize, handleSize) },
            { handle: 'bottom-left', bounds: new DOMRect(x - halfHandle, y + height - halfHandle, handleSize, handleSize) },
            { handle: 'left-center', bounds: new DOMRect(x - halfHandle, y + height / 2 - halfHandle, handleSize, handleSize) },
        ];

        for (const { handle, bounds } of handles) {
            if (
                point.x >= bounds.left &&
                point.x <= bounds.right &&
                point.y >= bounds.top &&
                point.y <= bounds.bottom
            ) {
                return handle;
            }
        }

        return null;
    }

    private getResizeCursor(handle: ResizeHandle): string {
        switch (handle) {
            case 'top-left':
            case 'bottom-right':
                return 'nw-resize';
            case 'top-right':
            case 'bottom-left':
                return 'ne-resize';
            case 'top-center':
            case 'bottom-center':
                return 'n-resize';
            case 'left-center':
            case 'right-center':
                return 'e-resize';
            default:
                return 'default';
        }
    }

    private calculateResizedDimensions(
        startBounds: DOMRect,
        handle: ResizeHandle,
        delta: Position2D,
        lockAspectRatio?: boolean
    ): Dimensions {
        let newWidth = startBounds.width;
        let newHeight = startBounds.height;

        switch (handle) {
            case 'top-left':
                newWidth = startBounds.width - delta.x;
                newHeight = startBounds.height - delta.y;
                break;
            case 'top-center':
                newHeight = startBounds.height - delta.y;
                break;
            case 'top-right':
                newWidth = startBounds.width + delta.x;
                newHeight = startBounds.height - delta.y;
                break;
            case 'right-center':
                newWidth = startBounds.width + delta.x;
                break;
            case 'bottom-right':
                newWidth = startBounds.width + delta.x;
                newHeight = startBounds.height + delta.y;
                break;
            case 'bottom-center':
                newHeight = startBounds.height + delta.y;
                break;
            case 'bottom-left':
                newWidth = startBounds.width - delta.x;
                newHeight = startBounds.height + delta.y;
                break;
            case 'left-center':
                newWidth = startBounds.width - delta.x;
                break;
        }

        // Apply aspect ratio lock
        if (lockAspectRatio) {
            const aspectRatio = startBounds.width / startBounds.height;

            if (handle.includes('corner')) {
                // For corner handles, maintain aspect ratio
                if (Math.abs(delta.x) > Math.abs(delta.y)) {
                    newHeight = newWidth / aspectRatio;
                } else {
                    newWidth = newHeight * aspectRatio;
                }
            }
        }

        return { width: newWidth, height: newHeight };
    }

    private applySnapping(delta: Position2D): Position2D {
        if (this.selectedElements.length === 0) return delta;

        const selectedElement = this.elements.find(el => el.id === this.selectedElements[0]);
        if (!selectedElement) return delta;

        const newPosition = {
            x: selectedElement.position.x + delta.x,
            y: selectedElement.position.y + delta.y
        };

        const snappedPosition = this.snapToElements(newPosition, selectedElement);
        const gridSnappedPosition = this.snapToGrid(snappedPosition);

        return {
            x: gridSnappedPosition.x - selectedElement.position.x,
            y: gridSnappedPosition.y - selectedElement.position.y
        };
    }

    private snapToElements(position: Position2D, element: PremiumElement): Position2D {
        const threshold = this.options.snapThreshold;
        let snappedX = position.x;
        let snappedY = position.y;

        this.alignmentGuides = [];

        // Get other elements to snap to
        const otherElements = this.elements.filter(el =>
            el.id !== element.id && !this.selectedElements.includes(el.id)
        );

        for (const other of otherElements) {
            const elementRight = position.x + element.dimensions.width;
            const elementBottom = position.y + element.dimensions.height;
            const elementCenterX = position.x + element.dimensions.width / 2;
            const elementCenterY = position.y + element.dimensions.height / 2;

            const otherRight = other.position.x + other.dimensions.width;
            const otherBottom = other.position.y + other.dimensions.height;
            const otherCenterX = other.position.x + other.dimensions.width / 2;
            const otherCenterY = other.position.y + other.dimensions.height / 2;

            // Horizontal snapping
            if (Math.abs(position.x - other.position.x) < threshold) {
                snappedX = other.position.x;
                this.alignmentGuides.push({
                    type: 'vertical',
                    position: other.position.x,
                    start: Math.min(position.y, other.position.y),
                    end: Math.max(elementBottom, otherBottom)
                });
            } else if (Math.abs(elementRight - otherRight) < threshold) {
                snappedX = otherRight - element.dimensions.width;
                this.alignmentGuides.push({
                    type: 'vertical',
                    position: otherRight,
                    start: Math.min(position.y, other.position.y),
                    end: Math.max(elementBottom, otherBottom)
                });
            } else if (Math.abs(elementCenterX - otherCenterX) < threshold) {
                snappedX = otherCenterX - element.dimensions.width / 2;
                this.alignmentGuides.push({
                    type: 'vertical',
                    position: otherCenterX,
                    start: Math.min(position.y, other.position.y),
                    end: Math.max(elementBottom, otherBottom)
                });
            }

            // Vertical snapping
            if (Math.abs(position.y - other.position.y) < threshold) {
                snappedY = other.position.y;
                this.alignmentGuides.push({
                    type: 'horizontal',
                    position: other.position.y,
                    start: Math.min(position.x, other.position.x),
                    end: Math.max(elementRight, otherRight)
                });
            } else if (Math.abs(elementBottom - otherBottom) < threshold) {
                snappedY = otherBottom - element.dimensions.height;
                this.alignmentGuides.push({
                    type: 'horizontal',
                    position: otherBottom,
                    start: Math.min(position.x, other.position.x),
                    end: Math.max(elementRight, otherRight)
                });
            } else if (Math.abs(elementCenterY - otherCenterY) < threshold) {
                snappedY = otherCenterY - element.dimensions.height / 2;
                this.alignmentGuides.push({
                    type: 'horizontal',
                    position: otherCenterY,
                    start: Math.min(position.x, other.position.x),
                    end: Math.max(elementRight, otherRight)
                });
            }
        }

        return { x: snappedX, y: snappedY };
    }

    private snapToGrid(position: Position2D, gridSize = 20): Position2D {
        const threshold = this.options.snapThreshold;

        const snappedX = Math.round(position.x / gridSize) * gridSize;
        const snappedY = Math.round(position.y / gridSize) * gridSize;

        return {
            x: Math.abs(position.x - snappedX) < threshold ? snappedX : position.x,
            y: Math.abs(position.y - snappedY) < threshold ? snappedY : position.y
        };
    }

    getAlignmentGuides(): AlignmentGuide[] {
        return this.alignmentGuides;
    }

    dispose(): void {
        this.elements = [];
        this.selectedElements = [];
        this.alignmentGuides = [];
    }
}