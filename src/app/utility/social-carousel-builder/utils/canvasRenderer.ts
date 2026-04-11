import { PremiumElement, SlideBackground, Dimensions, Position2D } from '../types/premium';

export interface CanvasRendererOptions {
    enableDirtyRegions?: boolean;
    enableTextureAtlas?: boolean;
    maxTextureSize?: number;
    devicePixelRatio?: number;
}

export interface RenderElementOptions {
    selected?: boolean;
    highlighted?: boolean;
    opacity?: number;
}

export interface SelectionIndicatorOptions {
    color?: string;
    handleSize?: number;
    showHandles?: boolean;
    showBounds?: boolean;
}

export interface GridOptions {
    size: number;
    subdivisions: number;
    color: string;
    opacity: number;
}

export interface GuideOptions {
    color: string;
    width: number;
    dashPattern?: number[];
}

export interface AlignmentGuide {
    type: 'horizontal' | 'vertical';
    position: number;
    start: number;
    end: number;
}

export class CanvasRenderer {
    private context: CanvasRenderingContext2D;
    private options: Required<CanvasRendererOptions>;
    private imageCache = new Map<string, HTMLImageElement>();
    private dirtyRegions: DOMRect[] = [];
    private transform = { x: 0, y: 0, scale: 1 };

    constructor(context: CanvasRenderingContext2D, options: CanvasRendererOptions = {}) {
        this.context = context;
        this.options = {
            enableDirtyRegions: options.enableDirtyRegions ?? true,
            enableTextureAtlas: options.enableTextureAtlas ?? true,
            maxTextureSize: options.maxTextureSize ?? 2048,
            devicePixelRatio: options.devicePixelRatio ?? window.devicePixelRatio || 1
        };

        // Set up high-quality rendering
        this.context.imageSmoothingEnabled = true;
        this.context.imageSmoothingQuality = 'high';
        this.context.textBaseline = 'top';
    }

    clear(): void {
        const canvas = this.context.canvas;
        this.context.clearRect(0, 0, canvas.width, canvas.height);
        this.dirtyRegions = [];
    }

    setTransform(transform: { x: number; y: number; scale: number }): void {
        this.transform = transform;
        this.context.setTransform(
            transform.scale,
            0,
            0,
            transform.scale,
            transform.x,
            transform.y
        );
    }

    async renderBackground(background: SlideBackground, dimensions: Dimensions): Promise<void> {
        this.context.save();

        switch (background.type) {
            case 'color':
                if (typeof background.value === 'string') {
                    this.context.fillStyle = background.value;
                    this.context.fillRect(0, 0, dimensions.width, dimensions.height);
                }
                break;

            case 'gradient':
                if (typeof background.value === 'object' && 'stops' in background.value) {
                    const gradient = this.createGradient(background.value, dimensions);
                    this.context.fillStyle = gradient;
                    this.context.fillRect(0, 0, dimensions.width, dimensions.height);
                }
                break;

            case 'image':
                if (typeof background.value === 'object' && 'src' in background.value) {
                    const image = await this.loadImage(background.value.src);
                    if (image) {
                        this.drawBackgroundImage(image, background.value, dimensions);
                    }
                }
                break;
        }

        // Apply overlay if present
        if (background.overlay) {
            this.context.globalAlpha = background.overlay.opacity;

            if (background.overlay.color) {
                this.context.fillStyle = background.overlay.color;
                this.context.fillRect(0, 0, dimensions.width, dimensions.height);
            }

            if (background.overlay.gradient) {
                const gradient = this.createGradient(background.overlay.gradient, dimensions);
                this.context.fillStyle = gradient;
                this.context.fillRect(0, 0, dimensions.width, dimensions.height);
            }
        }

        this.context.restore();
    }

    async renderElement(element: PremiumElement, options: RenderElementOptions = {}): Promise<void> {
        this.context.save();

        // Apply element transform
        this.context.translate(element.position.x, element.position.y);

        if (element.style.transform?.rotation) {
            const centerX = element.dimensions.width / 2;
            const centerY = element.dimensions.height / 2;
            this.context.translate(centerX, centerY);
            this.context.rotate((element.style.transform.rotation * Math.PI) / 180);
            this.context.translate(-centerX, -centerY);
        }

        // Apply opacity
        this.context.globalAlpha = (element.style.opacity ?? 1) * (options.opacity ?? 1);

        // Apply filters
        if (element.style.filters && element.style.filters.length > 0) {
            this.context.filter = this.createFilterString(element.style.filters);
        }

        // Render based on element type
        switch (element.type) {
            case 'text':
                await this.renderTextElement(element);
                break;
            case 'image':
                await this.renderImageElement(element);
                break;
            case 'shape':
                await this.renderShapeElement(element);
                break;
            case 'icon':
                await this.renderIconElement(element);
                break;
            case 'chart':
                await this.renderChartElement(element);
                break;
        }

        // Render selection highlight
        if (options.selected) {
            this.renderElementSelection(element);
        }

        this.context.restore();
    }

    private async renderTextElement(element: PremiumElement): Promise<void> {
        if (typeof element.content !== 'string') return;

        const style = element.style;

        // Set up text styling
        const fontSize = style.fontSize || 16;
        const fontFamily = style.fontFamily || 'Inter, sans-serif';
        const fontWeight = style.fontWeight || 'normal';

        this.context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        this.context.fillStyle = style.color || '#000000';
        this.context.textAlign = (style.textAlign as CanvasTextAlign) || 'left';

        // Render background if present
        if (style.backgroundColor) {
            this.context.fillStyle = style.backgroundColor;
            this.drawRoundedRect(0, 0, element.dimensions.width, element.dimensions.height, style.borderRadius);
            this.context.fill();
        }

        // Render text with word wrapping
        this.context.fillStyle = style.color || '#000000';
        this.renderWrappedText(
            element.content,
            element.dimensions.width,
            element.dimensions.height,
            fontSize,
            style.lineHeight || 1.2
        );
    }

    private async renderImageElement(element: PremiumElement): Promise<void> {
        if (typeof element.content === 'string' || !('src' in element.content)) return;

        const image = await this.loadImage(element.content.src);
        if (!image) return;

        // Create clipping path if border radius is present
        if (element.style.borderRadius) {
            this.context.save();
            this.drawRoundedRect(0, 0, element.dimensions.width, element.dimensions.height, element.style.borderRadius);
            this.context.clip();
        }

        // Calculate image positioning based on fit mode
        const { x, y, width, height } = this.calculateImageFit(
            image,
            element.dimensions,
            element.content.fit || 'cover',
            element.content.crop
        );

        this.context.drawImage(image, x, y, width, height);

        if (element.style.borderRadius) {
            this.context.restore();
        }
    }

    private async renderShapeElement(element: PremiumElement): Promise<void> {
        if (typeof element.content === 'string' || !('type' in element.content)) return;

        const style = element.style;

        // Set up styling
        if (style.backgroundColor) {
            this.context.fillStyle = style.backgroundColor;
        }

        if (style.border) {
            this.context.strokeStyle = style.border.color;
            this.context.lineWidth = style.border.width;
            this.setLineDash(style.border.style);
        }

        // Render shape based on type
        switch (element.content.type) {
            case 'rectangle':
                this.drawRoundedRect(0, 0, element.dimensions.width, element.dimensions.height, style.borderRadius);
                break;
            case 'circle':
                this.drawCircle(element.dimensions.width / 2, element.dimensions.height / 2, Math.min(element.dimensions.width, element.dimensions.height) / 2);
                break;
            case 'triangle':
                this.drawTriangle(element.dimensions.width, element.dimensions.height);
                break;
            case 'custom':
                if (element.content.path) {
                    this.drawPath(element.content.path);
                }
                break;
        }

        // Fill and stroke
        if (style.backgroundColor) {
            this.context.fill();
        }

        if (style.border) {
            this.context.stroke();
        }
    }

    private async renderIconElement(element: PremiumElement): Promise<void> {
        // Icon rendering would depend on icon format (SVG, font icon, etc.)
        // This is a simplified implementation
        if (typeof element.content === 'string') {
            this.context.font = `${element.dimensions.height}px Arial`;
            this.context.fillStyle = element.style.color || '#000000';
            this.context.textAlign = 'center';
            this.context.textBaseline = 'middle';
            this.context.fillText(
                element.content,
                element.dimensions.width / 2,
                element.dimensions.height / 2
            );
        }
    }

    private async renderChartElement(element: PremiumElement): Promise<void> {
        if (typeof element.content === 'string' || !('data' in element.content)) return;

        // Basic chart rendering - would need more sophisticated implementation
        const data = element.content.data;
        const config = element.content.config;

        switch (element.content.type) {
            case 'bar':
                this.renderBarChart(data, element.dimensions, config);
                break;
            case 'pie':
                this.renderPieChart(data, element.dimensions, config);
                break;
            // Add more chart types as needed
        }
    }

    renderGrid(dimensions: Dimensions, options: GridOptions): void {
        this.context.save();
        this.context.strokeStyle = options.color;
        this.context.globalAlpha = options.opacity;
        this.context.lineWidth = 1;

        const { size, subdivisions } = options;
        const subSize = size / subdivisions;

        // Draw main grid lines
        this.context.lineWidth = 1;
        for (let x = 0; x <= dimensions.width; x += size) {
            this.context.beginPath();
            this.context.moveTo(x, 0);
            this.context.lineTo(x, dimensions.height);
            this.context.stroke();
        }

        for (let y = 0; y <= dimensions.height; y += size) {
            this.context.beginPath();
            this.context.moveTo(0, y);
            this.context.lineTo(dimensions.width, y);
            this.context.stroke();
        }

        // Draw subdivision lines
        this.context.globalAlpha = options.opacity * 0.5;
        this.context.lineWidth = 0.5;

        for (let x = 0; x <= dimensions.width; x += subSize) {
            if (x % size !== 0) {
                this.context.beginPath();
                this.context.moveTo(x, 0);
                this.context.lineTo(x, dimensions.height);
                this.context.stroke();
            }
        }

        for (let y = 0; y <= dimensions.height; y += subSize) {
            if (y % size !== 0) {
                this.context.beginPath();
                this.context.moveTo(0, y);
                this.context.lineTo(dimensions.width, y);
                this.context.stroke();
            }
        }

        this.context.restore();
    }

    renderSelectionIndicators(elements: PremiumElement[], options: SelectionIndicatorOptions): void {
        this.context.save();
        this.context.strokeStyle = options.color || '#3B82F6';
        this.context.fillStyle = options.color || '#3B82F6';
        this.context.lineWidth = 2;

        elements.forEach(element => {
            const { x, y } = element.position;
            const { width, height } = element.dimensions;

            if (options.showBounds) {
                // Draw selection bounds
                this.context.strokeRect(x - 1, y - 1, width + 2, height + 2);
            }

            if (options.showHandles) {
                const handleSize = options.handleSize || 8;
                const halfHandle = handleSize / 2;

                // Draw resize handles
                const handles = [
                    { x: x - halfHandle, y: y - halfHandle }, // Top-left
                    { x: x + width / 2 - halfHandle, y: y - halfHandle }, // Top-center
                    { x: x + width - halfHandle, y: y - halfHandle }, // Top-right
                    { x: x + width - halfHandle, y: y + height / 2 - halfHandle }, // Right-center
                    { x: x + width - halfHandle, y: y + height - halfHandle }, // Bottom-right
                    { x: x + width / 2 - halfHandle, y: y + height - halfHandle }, // Bottom-center
                    { x: x - halfHandle, y: y + height - halfHandle }, // Bottom-left
                    { x: x - halfHandle, y: y + height / 2 - halfHandle }, // Left-center
                ];

                handles.forEach(handle => {
                    this.context.fillRect(handle.x, handle.y, handleSize, handleSize);
                    this.context.strokeRect(handle.x, handle.y, handleSize, handleSize);
                });
            }
        });

        this.context.restore();
    }

    renderGuides(guides: AlignmentGuide[], options: GuideOptions): void {
        this.context.save();
        this.context.strokeStyle = options.color;
        this.context.lineWidth = options.width;

        if (options.dashPattern) {
            this.context.setLineDash(options.dashPattern);
        }

        guides.forEach(guide => {
            this.context.beginPath();

            if (guide.type === 'horizontal') {
                this.context.moveTo(guide.start, guide.position);
                this.context.lineTo(guide.end, guide.position);
            } else {
                this.context.moveTo(guide.position, guide.start);
                this.context.lineTo(guide.position, guide.end);
            }

            this.context.stroke();
        });

        this.context.restore();
    }

    // Utility methods
    private async loadImage(src: string): Promise<HTMLImageElement | null> {
        if (this.imageCache.has(src)) {
            return this.imageCache.get(src)!;
        }

        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.imageCache.set(src, img);
                resolve(img);
            };
            img.onerror = () => resolve(null);
            img.src = src;
        });
    }

    private createGradient(gradient: any, dimensions: Dimensions): CanvasGradient {
        let canvasGradient: CanvasGradient;

        if (gradient.type === 'linear') {
            const angle = (gradient.angle * Math.PI) / 180;
            const x1 = dimensions.width / 2 - Math.cos(angle) * dimensions.width / 2;
            const y1 = dimensions.height / 2 - Math.sin(angle) * dimensions.height / 2;
            const x2 = dimensions.width / 2 + Math.cos(angle) * dimensions.width / 2;
            const y2 = dimensions.height / 2 + Math.sin(angle) * dimensions.height / 2;

            canvasGradient = this.context.createLinearGradient(x1, y1, x2, y2);
        } else {
            const centerX = (gradient.centerX / 100) * dimensions.width;
            const centerY = (gradient.centerY / 100) * dimensions.height;
            const radius = (gradient.radius / 100) * Math.max(dimensions.width, dimensions.height);

            canvasGradient = this.context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        }

        gradient.stops.forEach((stop: any) => {
            canvasGradient.addColorStop(stop.position / 100, stop.color);
        });

        return canvasGradient;
    }

    private drawRoundedRect(x: number, y: number, width: number, height: number, radius?: number | any): void {
        if (!radius) {
            this.context.rect(x, y, width, height);
            return;
        }

        const r = typeof radius === 'number' ? radius : 0;

        this.context.beginPath();
        this.context.moveTo(x + r, y);
        this.context.lineTo(x + width - r, y);
        this.context.quadraticCurveTo(x + width, y, x + width, y + r);
        this.context.lineTo(x + width, y + height - r);
        this.context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
        this.context.lineTo(x + r, y + height);
        this.context.quadraticCurveTo(x, y + height, x, y + height - r);
        this.context.lineTo(x, y + r);
        this.context.quadraticCurveTo(x, y, x + r, y);
        this.context.closePath();
    }

    private drawCircle(x: number, y: number, radius: number): void {
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, 2 * Math.PI);
    }

    private drawTriangle(width: number, height: number): void {
        this.context.beginPath();
        this.context.moveTo(width / 2, 0);
        this.context.lineTo(width, height);
        this.context.lineTo(0, height);
        this.context.closePath();
    }

    private drawPath(pathString: string): void {
        const path = new Path2D(pathString);
        this.context.stroke(path);
        this.context.fill(path);
    }

    private renderWrappedText(text: string, maxWidth: number, maxHeight: number, fontSize: number, lineHeight: number): void {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        // Word wrap
        words.forEach(word => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = this.context.measureText(testLine);

            if (metrics.width > maxWidth - 20 && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });

        if (currentLine) {
            lines.push(currentLine);
        }

        // Render lines
        const lineHeightPx = fontSize * lineHeight;
        lines.forEach((line, index) => {
            const y = 10 + index * lineHeightPx;
            if (y + lineHeightPx <= maxHeight) {
                this.context.fillText(line, 10, y);
            }
        });
    }

    private calculateImageFit(
        image: HTMLImageElement,
        dimensions: Dimensions,
        fit: string,
        crop?: any
    ): { x: number; y: number; width: number; height: number } {
        const imgRatio = image.width / image.height;
        const containerRatio = dimensions.width / dimensions.height;

        let width = dimensions.width;
        let height = dimensions.height;
        let x = 0;
        let y = 0;

        switch (fit) {
            case 'cover':
                if (imgRatio > containerRatio) {
                    width = height * imgRatio;
                    x = (dimensions.width - width) / 2;
                } else {
                    height = width / imgRatio;
                    y = (dimensions.height - height) / 2;
                }
                break;
            case 'contain':
                if (imgRatio > containerRatio) {
                    height = width / imgRatio;
                    y = (dimensions.height - height) / 2;
                } else {
                    width = height * imgRatio;
                    x = (dimensions.width - width) / 2;
                }
                break;
            case 'fill':
                // Use container dimensions (default)
                break;
        }

        // Apply crop if present
        if (crop) {
            x += crop.x * width / 100;
            y += crop.y * height / 100;
            width *= crop.zoom || 1;
            height *= crop.zoom || 1;
        }

        return { x, y, width, height };
    }

    private createFilterString(filters: any[]): string {
        return filters.map(filter => {
            switch (filter.type) {
                case 'blur':
                    return `blur(${filter.value}px)`;
                case 'brightness':
                    return `brightness(${filter.value})`;
                case 'contrast':
                    return `contrast(${filter.value})`;
                case 'grayscale':
                    return `grayscale(${filter.value})`;
                case 'hue-rotate':
                    return `hue-rotate(${filter.value}deg)`;
                case 'invert':
                    return `invert(${filter.value})`;
                case 'opacity':
                    return `opacity(${filter.value})`;
                case 'saturate':
                    return `saturate(${filter.value})`;
                case 'sepia':
                    return `sepia(${filter.value})`;
                default:
                    return '';
            }
        }).join(' ');
    }

    private setLineDash(style: string): void {
        switch (style) {
            case 'dashed':
                this.context.setLineDash([5, 5]);
                break;
            case 'dotted':
                this.context.setLineDash([2, 2]);
                break;
            default:
                this.context.setLineDash([]);
        }
    }

    private renderElementSelection(element: PremiumElement): void {
        this.context.save();
        this.context.strokeStyle = '#3B82F6';
        this.context.lineWidth = 2;
        this.context.setLineDash([4, 4]);
        this.context.strokeRect(-2, -2, element.dimensions.width + 4, element.dimensions.height + 4);
        this.context.restore();
    }

    private renderBarChart(data: any[], dimensions: Dimensions, config: any): void {
        // Simplified bar chart implementation
        const barWidth = dimensions.width / data.length;
        const maxValue = Math.max(...data.map(d => d.value));

        data.forEach((item, index) => {
            const barHeight = (item.value / maxValue) * dimensions.height * 0.8;
            const x = index * barWidth;
            const y = dimensions.height - barHeight;

            this.context.fillStyle = item.color || '#3B82F6';
            this.context.fillRect(x, y, barWidth * 0.8, barHeight);
        });
    }

    private renderPieChart(data: any[], dimensions: Dimensions, config: any): void {
        // Simplified pie chart implementation
        const centerX = dimensions.width / 2;
        const centerY = dimensions.height / 2;
        const radius = Math.min(dimensions.width, dimensions.height) / 2 * 0.8;

        const total = data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = 0;

        data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;

            this.context.beginPath();
            this.context.moveTo(centerX, centerY);
            this.context.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            this.context.closePath();

            this.context.fillStyle = item.color || `hsl(${index * 360 / data.length}, 70%, 50%)`;
            this.context.fill();

            currentAngle += sliceAngle;
        });
    }

    dispose(): void {
        this.imageCache.clear();
        this.dirtyRegions = [];
    }
}