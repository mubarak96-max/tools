'use client';

import React from 'react';
import { useEditorStore } from '../../_store/useEditorStore';
import { Toolbar } from './Toolbar';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { SlideStrip } from './SlideStrip';
import { SlideCanvas } from '../canvas/SlideCanvas';

export function DesktopEditor() {
    const { slides, activeSlideIndex } = useEditorStore();
    const activeSlide = slides[activeSlideIndex];

    return (
        <div className="flex flex-col h-[720px] bg-white border border-gray-200 rounded-xl overflow-hidden">
            <Toolbar />
            <div className="flex flex-1 overflow-hidden">
                <LeftSidebar />
                <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-hidden p-6">
                    <SlideCanvas
                        slide={activeSlide}
                        slideIndex={activeSlideIndex}
                        totalSlides={slides.length}
                    />
                </div>
                <RightSidebar />
            </div>
            <SlideStrip />
        </div>
    );
}