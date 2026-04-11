'use client';

import React from 'react';
import { useEditorStore } from '../../_store/useEditorStore';
import { SlideThumbnail } from '../shared/SlideThumbnail';

export function SlideStrip() {
    const { slides, activeSlideIndex, setActiveSlide, addSlide } = useEditorStore();

    return (
        <div className="h-[100px] border-t border-gray-200 bg-gray-50 flex items-center gap-2 px-4 overflow-x-auto flex-shrink-0">
            {slides.map((slide, i) => (
                <SlideThumbnail
                    key={slide.id}
                    slide={slide}
                    isActive={i === activeSlideIndex}
                    onClick={() => setActiveSlide(i)}
                />
            ))}
            <button
                onClick={() => addSlide(slides[activeSlideIndex].templateId)}
                className="w-16 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-2xl text-gray-400 hover:bg-gray-100 flex-shrink-0 transition-colors"
            >
                +
            </button>
        </div>
    );
}