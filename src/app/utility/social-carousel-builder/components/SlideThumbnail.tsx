'use client';

import React, { useEffect, useState } from 'react';
import { PlatformFormat, Slide } from '../types';
import { renderSlideToCanvas } from '../utils/export';

interface SlideThumbnailProps {
    slide: Slide;
    format: PlatformFormat;
    alt: string;
    className?: string;
}

export const SlideThumbnail: React.FC<SlideThumbnailProps> = ({
    slide,
    format,
    alt,
    className = '',
}) => {
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        let isCancelled = false;

        const renderPreview = async () => {
            try {
                const canvas = await renderSlideToCanvas(slide, format);
                if (!isCancelled) {
                    setPreviewUrl(canvas.toDataURL('image/png'));
                }
            } catch {
                if (!isCancelled) {
                    setPreviewUrl('');
                }
            }
        };

        void renderPreview();

        return () => {
            isCancelled = true;
        };
    }, [format, slide]);

    if (!previewUrl) {
        return (
            <div className={`flex items-center justify-center bg-slate-100 text-xs font-medium text-slate-500 ${className}`}>
                Loading preview...
            </div>
        );
    }

    return (
        <img
            src={previewUrl}
            alt={alt}
            className={className}
        />
    );
};
