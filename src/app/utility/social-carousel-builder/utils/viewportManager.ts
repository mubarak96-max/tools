import { Position2D, Dimensions } from '../types/premium';

export interface ViewportManagerOptions {
    minZoom?: number;
    maxZoom?: number;
    smoothZoom?: boolean;
    boundsPadding?: number;
}

export class ViewportManager {
    private canvas: HTMLCanvasElement;
    private options: Required<ViewportManagerOptions>;
    private zoom = 1;
    private position: Position2D = { x: 0, y: 0 };
    private canvasSize: Dimensions = { width: 0, height: 0 };
    private contentBounds: DOMRect | null = null;

    constructor(canvas: HTMLCanvasElement, options: ViewportManagerOptions = {}) {
        this.canvas = canvas;
        this.options = {
            minZoom: options.minZoom ?? 0.1,
            maxZoom: options.maxZoom ?? 5,
            smoothZoom: options.smoothZoom ?? true,
            boundsPadding: options.boundsPadding ?? 50
        };

        this.updateCanvasSize();
    }

    updateCanvasSize(width?: number, height?: number): void {
        if (width !== undefined && height !== undefined) {
            this.canvasSize = { width, height };
        } else {
            const rect = this.canvas.getBoundingClientRect();
            this.canvasSize = { width: rect.width, height: rect.height };
        }
    }

    setZoom(zoom: number): void {
        const clampedZoom = Math.max(this.options.minZoom, Math.min(this.options.maxZoom, zoom));

        if (this.options.smoothZoom && Math.abs(clampedZoom - this.zoom) > 0.01) {
            this.animateZoom(clampedZoom);
        } else {
            this.zoom = clampedZoom;
        }
    }

    getZoom(): number {
        return this.zoom;
    }

    setPosition(position: Position2D): void {
        this.position = { ...position };
    }

    getPosition(): Position2D {
        return { ...this.position };
    }

    zoomAt(clientPoint: Position2D, zoomDelta: number): void {
        const oldZoom = this.zoom;
        const newZoom = Math.max(
            this.options.minZoom,
            Math.min(this.options.maxZoom, oldZoom * (1 + zoomDelta))
        );

        if (newZoom === oldZoom) return;

        // Calculate the point in canvas coordinates before zoom
        const canvasPoint = this.clientToCanvas(clientPoint);

        // Update zoom
        this.zoom = newZoom;

        // Calculate the new canvas point after zoom
        const newCanvasPoint = this.clientToCanvas(clientPoint);

        // Adjust position to keep the zoom point stable
        this.position.x += (canvasPoint.x - newCanvasPoint.x) * this.zoom;
        this.position.y += (canvasPoint.y - newCanvasPoint.y) * this.zoom;
    }

    pan(delta: Position2D): void {
        this.position.x += delta.x;
        this.position.y += delta.y;
        this.constrainPosition();
    }

    fitToContent(contentBounds: DOMRect, padding = this.options.boundsPadding): void {
        this.contentBounds = contentBounds;

        const availableWidth = this.canvasSize.width - padding * 2;
        const availableHeight = this.canvasSize.height - padding * 2;

        const scaleX = availableWidth / contentBounds.width;
        const scaleY = availableHeight / contentBounds.height;
        const scale = Math.min(scaleX, scaleY, this.options.maxZoom);

        this.zoom = Math.max(scale, this.options.minZoom);

        // Center the content
        const scaledWidth = contentBounds.width * this.zoom;
        const scaledHeight = contentBounds.height * this.zoom;

        this.position.x = (this.canvasSize.width - scaledWidth) / 2 - contentBounds.x * this.zoom;
        this.position.y = (this.canvasSize.height - scaledHeight) / 2 - contentBounds.y * this.zoom;
    }

    zoomToFit(contentBounds: DOMRect): void {
        this.fitToContent(contentBounds);
    }

    zoomToActualSize(): void {
        this.setZoom(1);
        this.centerContent();
    }

    centerContent(): void {
        if (!this.contentBounds) return;

        const scaledWidth = this.contentBounds.width * this.zoom;
        const scaledHeight = this.contentBounds.height * this.zoom;

        this.position.x = (this.canvasSize.width - scaledWidth) / 2 - this.contentBounds.x * this.zoom;
        this.position.y = (this.canvasSize.height - scaledHeight) / 2 - this.contentBounds.y * this.zoom;
    }

    clientToCanvas(clientPoint: Position2D): Position2D {
        return {
            x: (clientPoint.x - this.position.x) / this.zoom,
            y: (clientPoint.y - this.position.y) / this.zoom
        };
    }

    canvasToClient(canvasPoint: Position2D): Position2D {
        return {
            x: canvasPoint.x * this.zoom + this.position.x,
            y: canvasPoint.y * this.zoom + this.position.y
        };
    }

    getTransform(): { x: number; y: number; scale: number } {
        return {
            x: this.position.x,
            y: this.position.y,
            scale: this.zoom
        };
    }

    getVisibleBounds(): DOMRect {
        const topLeft = this.clientToCanvas({ x: 0, y: 0 });
        const bottomRight = this.clientToCanvas({
            x: this.canvasSize.width,
            y: this.canvasSize.height
        });

        return new DOMRect(
            topLeft.x,
            topLeft.y,
            bottomRight.x - topLeft.x,
            bottomRight.y - topLeft.y
        );
    }

    isPointVisible(point: Position2D, margin = 0): boolean {
        const bounds = this.getVisibleBounds();
        return (
            point.x >= bounds.left - margin &&
            point.x <= bounds.right + margin &&
            point.y >= bounds.top - margin &&
            point.y <= bounds.bottom + margin
        );
    }

    isRectVisible(rect: DOMRect, margin = 0): boolean {
        const bounds = this.getVisibleBounds();
        return !(
            rect.right + margin < bounds.left ||
            rect.left - margin > bounds.right ||
            rect.bottom + margin < bounds.top ||
            rect.top - margin > bounds.bottom
        );
    }

    private animateZoom(targetZoom: number): void {
        const startZoom = this.zoom;
        const duration = 200; // ms
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);

            this.zoom = startZoom + (targetZoom - startZoom) * easeOut;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.zoom = targetZoom;
            }
        };

        requestAnimationFrame(animate);
    }

    private constrainPosition(): void {
        if (!this.contentBounds) return;

        const scaledWidth = this.contentBounds.width * this.zoom;
        const scaledHeight = this.contentBounds.height * this.zoom;
        const padding = this.options.boundsPadding;

        // Don't constrain if content is smaller than viewport
        if (scaledWidth <= this.canvasSize.width && scaledHeight <= this.canvasSize.height) {
            return;
        }

        // Constrain horizontal position
        if (scaledWidth > this.canvasSize.width) {
            const minX = this.canvasSize.width - scaledWidth - this.contentBounds.x * this.zoom - padding;
            const maxX = -this.contentBounds.x * this.zoom + padding;
            this.position.x = Math.max(minX, Math.min(maxX, this.position.x));
        }

        // Constrain vertical position
        if (scaledHeight > this.canvasSize.height) {
            const minY = this.canvasSize.height - scaledHeight - this.contentBounds.y * this.zoom - padding;
            const maxY = -this.contentBounds.y * this.zoom + padding;
            this.position.y = Math.max(minY, Math.min(maxY, this.position.y));
        }
    }

    // Smooth panning animation
    panTo(targetPosition: Position2D, duration = 300): Promise<void> {
        return new Promise((resolve) => {
            const startPosition = { ...this.position };
            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function (ease-in-out)
                const easeInOut = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                this.position.x = startPosition.x + (targetPosition.x - startPosition.x) * easeInOut;
                this.position.y = startPosition.y + (targetPosition.y - startPosition.y) * easeInOut;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.position = { ...targetPosition };
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    // Smooth zoom animation with target point
    zoomToPoint(targetZoom: number, targetPoint: Position2D, duration = 300): Promise<void> {
        return new Promise((resolve) => {
            const startZoom = this.zoom;
            const startPosition = { ...this.position };

            // Calculate target position to keep the point stable
            const canvasPoint = this.clientToCanvas(targetPoint);
            const targetPosition = {
                x: targetPoint.x - canvasPoint.x * targetZoom,
                y: targetPoint.y - canvasPoint.y * targetZoom
            };

            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function (ease-in-out)
                const easeInOut = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                this.zoom = startZoom + (targetZoom - startZoom) * easeInOut;
                this.position.x = startPosition.x + (targetPosition.x - startPosition.x) * easeInOut;
                this.position.y = startPosition.y + (targetPosition.y - startPosition.y) * easeInOut;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.zoom = targetZoom;
                    this.position = { ...targetPosition };
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    dispose(): void {
        // Clean up any resources if needed
    }
}