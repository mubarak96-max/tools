import { Platform, PlatformFormat, Slide, TemplateElement } from '../types';

function isImageContent(
    content: TemplateElement['content']
): content is { src: string; alt: string; fit: 'cover' | 'contain' | 'fill' } {
    return typeof content === 'object' && content !== null && 'src' in content;
}

function drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
) {
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
}

function renderWrappedText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
) {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach((word) => {
        const candidate = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(candidate).width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = candidate;
        }
    });

    if (currentLine) {
        lines.push(currentLine);
    }

    lines.forEach((line, index) => {
        ctx.fillText(line, x, y + lineHeight * index);
    });
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });
}

export async function renderSlideToCanvas(slide: Slide, format: PlatformFormat): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    canvas.width = format.dimensions.width;
    canvas.height = format.dimensions.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Canvas is not available in this browser.');
    }

    ctx.fillStyle = slide.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const elements = [...slide.elements].sort((left, right) => left.position.z - right.position.z);

    for (const element of elements) {
        ctx.save();
        ctx.globalAlpha = element.style.opacity ?? 1;

        if (element.type === 'shape') {
            ctx.fillStyle = element.style.backgroundColor || '#e5e7eb';
            if (element.style.borderRadius) {
                drawRoundedRect(ctx, element.position.x, element.position.y, element.dimensions.width, element.dimensions.height, element.style.borderRadius);
                ctx.fill();
            } else {
                ctx.fillRect(element.position.x, element.position.y, element.dimensions.width, element.dimensions.height);
            }
            ctx.restore();
            continue;
        }

        if (element.type === 'image') {
            ctx.fillStyle = '#f3f4f6';
            ctx.fillRect(element.position.x, element.position.y, element.dimensions.width, element.dimensions.height);
            if (isImageContent(element.content) && element.content.src) {
                try {
                    const image = await loadImage(element.content.src);
                    ctx.drawImage(image, element.position.x, element.position.y, element.dimensions.width, element.dimensions.height);
                } catch {
                    ctx.fillStyle = '#9ca3af';
                    ctx.font = `${Math.min(element.dimensions.width, element.dimensions.height) * 0.18}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('Image', element.position.x + element.dimensions.width / 2, element.position.y + element.dimensions.height / 2);
                }
            }
            ctx.restore();
            continue;
        }

        if (typeof element.content !== 'string') {
            ctx.restore();
            continue;
        }

        if (element.style.backgroundColor) {
            ctx.fillStyle = element.style.backgroundColor;
            if (element.style.borderRadius) {
                drawRoundedRect(ctx, element.position.x, element.position.y, element.dimensions.width, element.dimensions.height, element.style.borderRadius);
                ctx.fill();
            } else {
                ctx.fillRect(element.position.x, element.position.y, element.dimensions.width, element.dimensions.height);
            }
        }

        const fontSize = element.style.fontSize || 28;
        const fontFamily = element.style.fontFamily || 'Inter, sans-serif';
        const fontWeight = element.style.fontWeight || 'normal';
        const textAlign = element.style.textAlign || 'left';

        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = element.style.color || '#111827';
        ctx.textAlign = textAlign;
        ctx.textBaseline = 'top';

        const padding = 12;
        const textX =
            textAlign === 'center'
                ? element.position.x + element.dimensions.width / 2
                : textAlign === 'right'
                    ? element.position.x + element.dimensions.width - padding
                    : element.position.x + padding;

        renderWrappedText(
            ctx,
            element.content,
            textX,
            element.position.y + padding,
            Math.max(20, element.dimensions.width - padding * 2),
            fontSize * 1.2
        );
        ctx.restore();
    }

    return canvas;
}

async function canvasToBlob(canvas: HTMLCanvasElement, type: 'png' | 'jpg') {
    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Unable to create export file.'));
                    return;
                }
                resolve(blob);
            },
            type === 'png' ? 'image/png' : 'image/jpeg',
            type === 'png' ? 1 : 0.92
        );
    });
}

function triggerBlobDownload(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
}

export async function exportSlideFile(
    slide: Slide,
    platform: Platform,
    format: PlatformFormat,
    type: 'png' | 'jpg',
    fileNamePrefix: string,
    slideIndex: number
) {
    const canvas = await renderSlideToCanvas(slide, format);
    const blob = await canvasToBlob(canvas, type);
    const extension = type === 'png' ? 'png' : 'jpg';
    const fileName = `${fileNamePrefix}_${platform.id}_${format.id}_slide_${String(slideIndex + 1).padStart(2, '0')}.${extension}`;
    triggerBlobDownload(blob, fileName);
}

export async function exportSlidesZip(
    slides: Slide[],
    platform: Platform,
    format: PlatformFormat,
    type: 'png' | 'jpg',
    fileNamePrefix: string
) {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    const extension = type === 'png' ? 'png' : 'jpg';

    for (let index = 0; index < slides.length; index += 1) {
        const canvas = await renderSlideToCanvas(slides[index], format);
        const blob = await canvasToBlob(canvas, type);
        const fileName = `${fileNamePrefix}_${platform.id}_${format.id}_slide_${String(index + 1).padStart(2, '0')}.${extension}`;
        zip.file(fileName, blob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    triggerBlobDownload(zipBlob, `${fileNamePrefix}_${platform.id}_${format.id}_carousel.zip`);
}
