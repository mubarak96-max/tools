import { TemplateElement, Dimensions, Position } from '../types';

/**
 * Canvas rendering utilities for the slide editor
 */

export interface CanvasRenderOptions {
    scale?: number;
    showSelection?: boolean;
    selectedElementId?: string;
}

/**
 * Split text into wrapped lines for the current canvas font settings
 */
export const getWrappedTextLines = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

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

    return lines;
};

/**
 * Render text with word wrapping
 */
export const renderTextWithWordWrap = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
): number => {
    const lines = getWrappedTextLines(ctx, text, maxWidth);

    // Render lines
    lines.forEach((line, index) => {
        ctx.fillText(line, x, y + (index * lineHeight));
    });

    return lines.length * lineHeight;
};

export const getWrappedTextLayout = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    lineHeight: number,
    maxHeight: number
) => {
    const lines = getWrappedTextLines(ctx, text, maxWidth);
    const height = lines.length * lineHeight;

    return {
        lines,
        height,
        isOverflowing: height > maxHeight,
    };
};

/**
 * Draw rounded rectangle
 */
export const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
};

/**
 * Get text metrics for sizing
 */
export const getTextMetrics = (
    ctx: CanvasRenderingContext2D,
    text: string,
    fontSize: number,
    fontFamily: string,
    maxWidth?: number
): { width: number; height: number; lines: string[] } => {
    ctx.font = `${fontSize}px ${fontFamily}`;

    if (!maxWidth) {
        const metrics = ctx.measureText(text);
        return {
            width: metrics.width,
            height: fontSize,
            lines: [text]
        };
    }

    // Calculate with word wrap
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    let maxLineWidth = 0;

    words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            maxLineWidth = Math.max(maxLineWidth, ctx.measureText(currentLine).width);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });

    if (currentLine) {
        lines.push(currentLine);
        maxLineWidth = Math.max(maxLineWidth, ctx.measureText(currentLine).width);
    }

    return {
        width: maxLineWidth,
        height: lines.length * fontSize * 1.2,
        lines
    };
};

/**
 * Check if point is inside element bounds
 */
export const isPointInElement = (
    point: Position,
    element: TemplateElement
): boolean => {
    return (
        point.x >= element.position.x &&
        point.x <= element.position.x + element.dimensions.width &&
        point.y >= element.position.y &&
        point.y <= element.position.y + element.dimensions.height
    );
};

/**
 * Get element at position (considering z-index)
 */
export const getElementAtPosition = (
    elements: TemplateElement[],
    position: Position
): TemplateElement | null => {
    // Sort by z-index (highest first)
    const sortedElements = [...elements].sort((a, b) => b.position.z - a.position.z);

    for (const element of sortedElements) {
        if (isPointInElement(position, element)) {
            return element;
        }
    }

    return null;
};

/**
 * Calculate element bounds including any transformations
 */
export const getElementBounds = (element: TemplateElement) => {
    return {
        left: element.position.x,
        top: element.position.y,
        right: element.position.x + element.dimensions.width,
        bottom: element.position.y + element.dimensions.height,
        width: element.dimensions.width,
        height: element.dimensions.height
    };
};

/**
 * Check if element is within canvas bounds
 */
export const isElementInBounds = (
    element: TemplateElement,
    canvasDimensions: Dimensions
): boolean => {
    const bounds = getElementBounds(element);
    return (
        bounds.left >= 0 &&
        bounds.top >= 0 &&
        bounds.right <= canvasDimensions.width &&
        bounds.bottom <= canvasDimensions.height
    );
};

/**
 * Constrain element position to canvas bounds
 */
export const constrainElementToBounds = (
    element: TemplateElement,
    canvasDimensions: Dimensions
): Position => {
    return {
        x: Math.max(0, Math.min(element.position.x, canvasDimensions.width - element.dimensions.width)),
        y: Math.max(0, Math.min(element.position.y, canvasDimensions.height - element.dimensions.height)),
        z: element.position.z
    };
};

/**
 * Calculate optimal canvas scale for container
 */
export const calculateCanvasScale = (
    canvasDimensions: Dimensions,
    containerDimensions: Dimensions,
    maxScale: number = 1
): number => {
    const scaleX = containerDimensions.width / canvasDimensions.width;
    const scaleY = containerDimensions.height / canvasDimensions.height;

    return Math.min(scaleX, scaleY, maxScale);
};

/**
 * Convert screen coordinates to canvas coordinates
 */
export const screenToCanvas = (
    screenPosition: Position,
    canvasRect: DOMRect,
    scale: number
): Position => {
    return {
        x: (screenPosition.x - canvasRect.left) / scale,
        y: (screenPosition.y - canvasRect.top) / scale,
        z: 0
    };
};

/**
 * Convert canvas coordinates to screen coordinates
 */
export const canvasToScreen = (
    canvasPosition: Position,
    canvasRect: DOMRect,
    scale: number
): Position => {
    return {
        x: (canvasPosition.x * scale) + canvasRect.left,
        y: (canvasPosition.y * scale) + canvasRect.top,
        z: 0
    };
};

/**
 * Generate selection handles for an element
 */
export const getSelectionHandles = (element: TemplateElement, handleSize: number = 8) => {
    const { position, dimensions } = element;

    return [
        {
            id: 'top-left',
            x: position.x - handleSize / 2,
            y: position.y - handleSize / 2,
            cursor: 'nw-resize'
        },
        {
            id: 'top-right',
            x: position.x + dimensions.width - handleSize / 2,
            y: position.y - handleSize / 2,
            cursor: 'ne-resize'
        },
        {
            id: 'bottom-left',
            x: position.x - handleSize / 2,
            y: position.y + dimensions.height - handleSize / 2,
            cursor: 'sw-resize'
        },
        {
            id: 'bottom-right',
            x: position.x + dimensions.width - handleSize / 2,
            y: position.y + dimensions.height - handleSize / 2,
            cursor: 'se-resize'
        },
        // Edge handles
        {
            id: 'top',
            x: position.x + dimensions.width / 2 - handleSize / 2,
            y: position.y - handleSize / 2,
            cursor: 'n-resize'
        },
        {
            id: 'right',
            x: position.x + dimensions.width - handleSize / 2,
            y: position.y + dimensions.height / 2 - handleSize / 2,
            cursor: 'e-resize'
        },
        {
            id: 'bottom',
            x: position.x + dimensions.width / 2 - handleSize / 2,
            y: position.y + dimensions.height - handleSize / 2,
            cursor: 's-resize'
        },
        {
            id: 'left',
            x: position.x - handleSize / 2,
            y: position.y + dimensions.height / 2 - handleSize / 2,
            cursor: 'w-resize'
        }
    ];
};

/**
 * Render selection indicator with handles
 */
export const renderSelectionIndicator = (
    ctx: CanvasRenderingContext2D,
    element: TemplateElement,
    options: { color?: string; handleSize?: number } = {}
) => {
    const { color = '#3b82f6', handleSize = 8 } = options;
    const { position, dimensions } = element;

    // Selection outline
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(position.x - 2, position.y - 2, dimensions.width + 4, dimensions.height + 4);
    ctx.setLineDash([]);

    // Selection handles
    const handles = getSelectionHandles(element, handleSize);
    ctx.fillStyle = color;

    handles.forEach(handle => {
        ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
    });
};

/**
 * Export canvas as image data URL
 */
export const exportCanvasAsImage = (
    canvas: HTMLCanvasElement,
    format: 'png' | 'jpeg' = 'png',
    quality: number = 1
): string => {
    if (format === 'jpeg') {
        return canvas.toDataURL('image/jpeg', quality);
    }
    return canvas.toDataURL('image/png');
};

/**
 * Create high-resolution canvas for export
 */
export const createHighResCanvas = (
    dimensions: Dimensions,
    pixelRatio: number = 2
): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    // Set actual size in memory (scaled up for high DPI)
    canvas.width = dimensions.width * pixelRatio;
    canvas.height = dimensions.height * pixelRatio;

    // Scale the drawing context so everything draws at the correct size
    ctx.scale(pixelRatio, pixelRatio);

    return canvas;
};
