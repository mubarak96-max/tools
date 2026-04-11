import { Slide, Palette } from '../types';

// Install required: npm install html-to-image jszip
export async function exportSlideToPNG(
    slide: Slide,
    palette: Palette,
    slideNumber: number,
    totalSlides: number
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        try {
            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.width = 1080;
            canvas.height = 1350;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Canvas context not available'));
                return;
            }

            // Set background
            if (palette.background.includes('gradient')) {
                // Handle gradient backgrounds
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, '#3B82F6');
                gradient.addColorStop(1, '#1E40AF');
                ctx.fillStyle = gradient;
            } else {
                ctx.fillStyle = palette.background;
            }
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Set text properties
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Draw headline
            ctx.fillStyle = palette.textPrimary;
            ctx.font = 'bold 72px Arial, sans-serif';

            // Word wrap for headline
            const headlineWords = slide.headline.split(' ');
            const maxWidth = canvas.width - 160; // 80px padding on each side
            let line = '';
            let y = canvas.height * 0.4; // Start at 40% from top

            for (let n = 0; n < headlineWords.length; n++) {
                const testLine = line + headlineWords[n] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;

                if (testWidth > maxWidth && n > 0) {
                    ctx.fillText(line, canvas.width / 2, y);
                    line = headlineWords[n] + ' ';
                    y += 90;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, canvas.width / 2, y);

            // Draw body text if exists
            if (slide.body.trim()) {
                ctx.fillStyle = palette.textSecondary;
                ctx.font = '36px Arial, sans-serif';

                const bodyWords = slide.body.split(' ');
                let bodyLine = '';
                let bodyY = y + 120;

                for (let n = 0; n < bodyWords.length; n++) {
                    const testLine = bodyLine + bodyWords[n] + ' ';
                    const metrics = ctx.measureText(testLine);
                    const testWidth = metrics.width;

                    if (testWidth > maxWidth && n > 0) {
                        ctx.fillText(bodyLine, canvas.width / 2, bodyY);
                        bodyLine = bodyWords[n] + ' ';
                        bodyY += 50;
                    } else {
                        bodyLine = testLine;
                    }
                }
                ctx.fillText(bodyLine, canvas.width / 2, bodyY);
            }

            // Draw slide number
            ctx.fillStyle = palette.accent;
            ctx.font = 'bold 24px Arial, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(`${slideNumber}/${totalSlides}`, canvas.width - 40, canvas.height - 40);

            // Convert to blob
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to create blob'));
                }
            }, 'image/png', 1.0);

        } catch (error) {
            reject(error);
        }
    });
}

export async function exportAllSlidesAsZIP(
    slides: Slide[],
    palette: Palette
): Promise<Blob> {
    // Dynamic import to reduce bundle size
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // Export each slide
    for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const slideBlob = await exportSlideToPNG(slide, palette, i + 1, slides.length);
        zip.file(`carousel-slide-${i + 1}.png`, slideBlob);
    }

    // Generate ZIP
    return await zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export async function exportSingleSlide(
    slide: Slide,
    palette: Palette,
    slideNumber: number,
    totalSlides: number
): Promise<void> {
    try {
        const blob = await exportSlideToPNG(slide, palette, slideNumber, totalSlides);
        downloadBlob(blob, `carousel-slide-${slideNumber}.png`);
    } catch (error) {
        console.error('Failed to export slide:', error);
        throw error;
    }
}

export async function exportAllSlides(slides: Slide[], palette: Palette): Promise<void> {
    try {
        const zipBlob = await exportAllSlidesAsZIP(slides, palette);
        downloadBlob(zipBlob, 'carousel-slides.zip');
    } catch (error) {
        console.error('Failed to export all slides:', error);
        throw error;
    }
}