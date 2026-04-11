'use client';

import { useState, useCallback } from 'react';
import { useEditorStore } from '../_store/useEditorStore';
import type { Slide } from '../_types';
import { FONTS } from '../_data/fonts';

const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 1350;

// Renders one slide to an off-screen element and captures it as a data URL
async function captureSlide(slide: Slide, index: number, total: number): Promise<string> {
    // Wait for fonts to be fully loaded before capturing
    await document.fonts.ready;

    // Lazy-import html-to-image only when needed (not in SSR)
    const { toPng } = await import('html-to-image');

    const font = FONTS.find(f => f.id === slide.fontId) ?? FONTS[0];
    const textColor = slide.darkText ? '#1a1a2e' : '#ffffff';
    const subColor = slide.darkText ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.65)';

    // Build a temporary DOM node at full export resolution
    const el = document.createElement('div');
    el.style.cssText = `
    position: fixed;
    left: -${EXPORT_WIDTH + 100}px;
    top: 0;
    width: ${EXPORT_WIDTH}px;
    height: ${EXPORT_HEIGHT}px;
    overflow: hidden;
    border-radius: 0;
    font-family: ${font.css};
    background: ${slide.background};
  `;

    // Build the slide HTML for export — mirrors SlideCanvas layout logic
    // Using innerHTML for simplicity at export resolution (no React hydration needed)
    const tagBg = slide.accentColor;
    const tagColor = (tagBg === '#ffffff' || tagBg.toLowerCase() === '#fff') ? '#333333' : '#ffffff';

    const baseTag = `<div style="display:inline-block;background:${tagBg};color:${tagColor};font-size:18px;font-weight:600;letter-spacing:0.1em;padding:6px 24px;border-radius:40px;margin-bottom:24px;">${slide.tagText || 'SLIDE'}</div>`;
    const headlineStyle = `font-size:44px;font-weight:700;color:${textColor};line-height:1.2;margin-bottom:16px;`;
    const subtitleStyle = `font-size:26px;color:${subColor};margin-bottom:20px;`;
    const bodyStyle = `font-size:24px;color:${subColor};line-height:1.6;white-space:pre-line;`;
    const slideNum = `<div style="position:absolute;bottom:24px;right:28px;font-size:22px;color:${slide.darkText ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)'};">${index + 1} / ${total}</div>`;

    let inner = '';
    if (slide.layout === 'centered') {
        inner = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:64px;text-align:center;">${baseTag}<div style="${headlineStyle}">${slide.headline}</div>${slide.subtitle ? `<div style="${subtitleStyle}">${slide.subtitle}</div>` : ''}${slide.body ? `<div style="${bodyStyle}">${slide.body}</div>` : ''}</div>`;
    } else if (slide.layout === 'left') {
        inner = `<div style="display:flex;flex-direction:column;justify-content:center;height:100%;padding:64px 56px;">${baseTag}<div style="width:80px;height:6px;border-radius:4px;background:${slide.accentColor};margin-bottom:24px;"></div><div style="${headlineStyle}">${slide.headline}</div>${slide.subtitle ? `<div style="${subtitleStyle}">${slide.subtitle}</div>` : ''}${slide.body ? `<div style="${bodyStyle}">${slide.body}</div>` : ''}</div>`;
    } else if (slide.layout === 'top_accent') {
        inner = `<div style="height:100%;"><div style="height:12px;background:${slide.accentColor};"></div><div style="display:flex;flex-direction:column;justify-content:center;height:calc(100% - 12px);padding:56px;">${baseTag}<div style="${headlineStyle}">${slide.headline}</div>${slide.subtitle ? `<div style="${subtitleStyle}">${slide.subtitle}</div>` : ''}${slide.body ? `<div style="${bodyStyle}">${slide.body}</div>` : ''}</div></div>`;
    } else if (slide.layout === 'split') {
        const parts = slide.body.split('\n');
        inner = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:56px;gap:24px;text-align:center;">${baseTag}<div style="${headlineStyle}">${slide.headline}</div>${slide.subtitle ? `<div style="${subtitleStyle}">${slide.subtitle}</div>` : ''}<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;width:100%;margin-top:16px;"><div style="background:rgba(255,255,255,0.08);border-radius:20px;padding:28px;font-size:24px;color:${subColor};line-height:1.5;">${parts[0] ?? ''}</div><div style="background:rgba(255,255,255,0.08);border-radius:20px;padding:28px;font-size:24px;color:${subColor};line-height:1.5;">${parts[1] ?? ''}</div></div></div>`;
    } else if (slide.layout === 'minimal') {
        inner = `<div style="display:flex;flex-direction:column;justify-content:flex-end;height:100%;padding:56px 64px;"><div style="width:64px;height:4px;border-radius:2px;background:${slide.accentColor};margin-bottom:32px;"></div><div style="font-size:48px;font-weight:700;color:${textColor};line-height:1.2;margin-bottom:16px;">${slide.headline}</div>${slide.subtitle ? `<div style="${subtitleStyle}">${slide.subtitle}</div>` : ''}</div>`;
    } else { // bold
        inner = `<div style="height:100%;position:relative;overflow:hidden;"><div style="position:absolute;top:0;left:0;right:0;height:55%;background:${slide.accentColor};opacity:0.15;"></div><div style="display:flex;flex-direction:column;justify-content:center;height:100%;padding:64px 56px;position:relative;">${baseTag}<div style="font-size:52px;font-weight:800;color:${textColor};line-height:1.1;margin-bottom:20px;">${slide.headline}</div>${slide.subtitle ? `<div style="${subtitleStyle}">${slide.subtitle}</div>` : ''}${slide.body ? `<div style="${bodyStyle}">${slide.body}</div>` : ''}</div></div>`;
    }

    el.innerHTML = inner + slideNum;

    // Add icon overlays
    slide.icons.forEach(icon => {
        const iconEl = document.createElement('div');
        iconEl.style.cssText = `position:absolute;left:${icon.x}%;top:${icon.y}%;font-size:${icon.size * 2}px;line-height:1;`;
        iconEl.textContent = icon.content;
        el.appendChild(iconEl);
    });

    document.body.appendChild(el);

    try {
        const dataUrl = await toPng(el, {
            width: EXPORT_WIDTH,
            height: EXPORT_HEIGHT,
            pixelRatio: 1,
        });
        return dataUrl;
    } finally {
        document.body.removeChild(el);
    }
}

function downloadDataUrl(dataUrl: string, filename: string) {
    const a = document.createElement('a');
    a.download = filename;
    a.href = dataUrl;
    a.click();
}

export function useExport() {
    const [isExporting, setIsExporting] = useState(false);
    const { slides } = useEditorStore();

    const exportAllPNG = useCallback(async () => {
        setIsExporting(true);
        try {
            for (let i = 0; i < slides.length; i++) {
                const dataUrl = await captureSlide(slides[i], i, slides.length);
                downloadDataUrl(dataUrl, `carousel-slide-${i + 1}.png`);
                await new Promise(r => setTimeout(r, 150)); // Small delay between downloads
            }
        } finally {
            setIsExporting(false);
        }
    }, [slides]);

    const exportZIP = useCallback(async () => {
        setIsExporting(true);
        try {
            const JSZip = (await import('jszip')).default;
            const zip = new JSZip();

            for (let i = 0; i < slides.length; i++) {
                const dataUrl = await captureSlide(slides[i], i, slides.length);
                const base64 = dataUrl.replace('data:image/png;base64,', '');
                zip.file(`carousel-slide-${i + 1}.png`, base64, { base64: true });
            }

            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            downloadDataUrl(url, 'carousel.zip');
            URL.revokeObjectURL(url);
        } finally {
            setIsExporting(false);
        }
    }, [slides]);

    return { exportAllPNG, exportZIP, isExporting };
}