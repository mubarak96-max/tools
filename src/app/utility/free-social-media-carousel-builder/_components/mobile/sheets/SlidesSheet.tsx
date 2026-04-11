'use client';

import React from 'react';
import { useEditorStore } from '../../../_store/useEditorStore';
import { SlideThumbnail } from '../../shared/SlideThumbnail';

export function SlidesSheet() {
    const { slides, activeSlideIndex, setActiveSlide, setActiveSheet, addSlide } = useEditorStore();

    return (
        <div>
            <div className="flex items-center justify-between px-4 pb-3">
                <span className="text-xs text-white/50">All slides ({slides.length})</span>
                <button
                    onClick={() => addSlide(slides[activeSlideIndex].templateId)}
                    className="bg-violet-500/20 text-violet-300 text-xs rounded-full px-3 py-1.5"
                >
                    + Add
                </button>
            </div>
            <div className="flex gap-2.5 overflow-x-auto px-4 pb-4" style={{ scrollbarWidth: 'none' }}>
                {slides.map((slide, i) => (
                    <div key={slide.id} className="flex-shrink-0">
                        <SlideThumbnail
                            slide={slide}
                            isActive={i === activeSlideIndex}
                            onClick={() => { setActiveSlide(i); setActiveSheet(null); }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}