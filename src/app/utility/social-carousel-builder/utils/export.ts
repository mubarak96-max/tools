import { Platform, PlatformFormat, Slide, TemplateElement } from '../types';
import { drawFittedImage, drawRoundedRect, renderTextWithWordWrap, withElementRotation } from './canvasUtils';

function isImageContent(
    content: TemplateElement['content']
): content is { src: string; alt: string; fit: 'cover' | 'contain' | 'fill' } {
    return typeof content === 'object' && content !== null && 'src' in content;
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
            withElementRotation(ctx, element, () => {
                ctx.fillStyle = element.style.backgroundColor || '#e5e7eb';
                if (element.style.borderRadius) {
                    drawRoundedRect(
                        ctx,
                        element.position.x,
                        element.position.y,
                        element.dimensions.width,
                        element.dimensions.height,
                        element.style.borderRadius
                    );
                    ctx.fill();
                } else {
                    ctx.fillRect(element.position.x, element.position.y, element.dimensions.width, element.dimensions.height);
                }
            });
            ctx.restore();
            continue;
        }

        if (element.type === 'image') {
            let loadedImage: HTMLImageElement | null = null;
            if (isImageContent(element.content) && element.content.src) {
                try {
                    loadedImage = await loadImage(element.content.src);
                } catch {
                    loadedImage = null;
                }
            }

            withElementRotation(ctx, element, () => {
                ctx.fillStyle = '#f3f4f6';
                ctx.fillRect(element.position.x, element.position.y, element.dimensions.width, element.dimensions.height);
                if (isImageContent(element.content) && element.content.src && loadedImage) {
                    drawFittedImage(
                        ctx,
                        loadedImage,
                        {
                            x: element.position.x,
                            y: element.position.y,
                            width: element.dimensions.width,
                            height: element.dimensions.height,
                        },
                        element.content,
                        element.style.borderRadius
                    );
                    return;
                }

                ctx.fillStyle = '#9ca3af';
                ctx.font = `${Math.min(element.dimensions.width, element.dimensions.height) * 0.18}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Image', element.position.x + element.dimensions.width / 2, element.position.y + element.dimensions.height / 2);
            });
            ctx.restore();
            continue;
        }

        if (typeof element.content !== 'string') {
            ctx.restore();
            continue;
        }

        const textContent = element.content;

        withElementRotation(ctx, element, () => {
            if (element.style.backgroundColor) {
                ctx.fillStyle = element.style.backgroundColor;
                if (element.style.borderRadius) {
                    drawRoundedRect(
                        ctx,
                        element.position.x,
                        element.position.y,
                        element.dimensions.width,
                        element.dimensions.height,
                        element.style.borderRadius
                    );
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

            renderTextWithWordWrap(
                ctx,
                textContent,
                textX,
                element.position.y + padding,
                Math.max(20, element.dimensions.width - padding * 2),
                fontSize * 1.2
            );
        });
        ctx.restore();
    }

    return canvas;
}

const sanitizeFileName = (value: string) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'carousel';

const clampQuality = (quality: number) => Math.min(1, Math.max(0.4, quality));

async function canvasToBlob(canvas: HTMLCanvasElement, type: 'png' | 'jpg', quality: number) {
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
            type === 'png' ? 1 : clampQuality(quality)
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
    slideIndex: number,
    quality: number = 0.92
) {
    const canvas = await renderSlideToCanvas(slide, format);
    const blob = await canvasToBlob(canvas, type, quality);
    const extension = type === 'png' ? 'png' : 'jpg';
    const fileName = `${sanitizeFileName(fileNamePrefix)}_${platform.id}_${format.id}_slide_${String(slideIndex + 1).padStart(2, '0')}.${extension}`;
    triggerBlobDownload(blob, fileName);
}

export async function exportSlidesZip(
    slides: Slide[],
    platform: Platform,
    format: PlatformFormat,
    type: 'png' | 'jpg',
    fileNamePrefix: string,
    onProgress?: (current: number, total: number) => void,
    quality: number = 0.92
) {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    const extension = type === 'png' ? 'png' : 'jpg';
    const sanitizedPrefix = sanitizeFileName(fileNamePrefix);
    for (let index = 0; index < slides.length; index += 1) {
        const canvas = await renderSlideToCanvas(slides[index], format);
        const blob = await canvasToBlob(canvas, type, quality);
        const fileName = `${sanitizedPrefix}_${platform.id}_${format.id}_slide_${String(index + 1).padStart(2, '0')}.${extension}`;
        zip.file(fileName, blob);
        onProgress?.(index + 1, slides.length);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    triggerBlobDownload(zipBlob, `${sanitizedPrefix}_${platform.id}_${format.id}_carousel.zip`);
}
