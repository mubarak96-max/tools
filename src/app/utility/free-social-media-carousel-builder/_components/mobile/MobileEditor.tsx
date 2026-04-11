'use client';

import React from 'react';
import { useEditorStore } from '../../_store/useEditorStore';
import { SlideCanvas } from '../canvas/SlideCanvas';
import { BottomNav } from './BottomNav';
import { BottomSheet } from './BottomSheet';
import { SlidesSheet } from './sheets/SlidesSheet';
import { TemplatesSheet } from './sheets/TemplatesSheet';
import { DesignSheet } from './sheets/DesignSheet';
import { TextSheet } from './sheets/TextSheet';
import { IconSheet } from './sheets/IconSheet';
import { ExportSheet } from './sheets/ExportSheet';
import { TEMPLATES } from '../../_data/templates';

export function MobileEditor() {
    const { slides, activeSlideIndex, activeSheet, setActiveSheet, setActiveSlide } = useEditorStore();
    const activeSlide = slides[activeSlideIndex];
    const tmpl = TEMPLATES.find(t => t.id === activeSlide.templateId);

    return (
        <div className="flex flex-col bg-[#0d1b2a] overflow-hidden relative" style={{ height: 'calc(100svh - 120px)', minHeight: 500 }}>
            {/* Top bar */}
            <div className="h-12 flex items-center justify-between px-4 border-b border-white/10 flex-shrink-0">
                <span className="text-white/60 text-sm">●</span>
                <span className="text-white text-sm font-medium">{tmpl?.name ?? 'Slide'}</span>
                <button
                    onClick={() => setActiveSheet('export')}
                    className="h-7 px-3 bg-violet-500 text-white text-xs rounded-full"
                >
                    Export
                </button>
            </div>

            {/* Canvas area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4">
                <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden mb-3">
                    <SlideCanvas
                        slide={activeSlide}
                        slideIndex={activeSlideIndex}
                        totalSlides={slides.length}
                        fillContainer
                    />
                </div>

                {/* Dot nav */}
                <div className="flex justify-center gap-1.5 mb-4">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveSlide(i)}
                            className={`h-1.5 rounded-full transition-all ${i === activeSlideIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/30'}`}
                        />
                    ))}
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                        onClick={() => setActiveSheet('text')}
                        className="bg-white/5 border border-white/10 rounded-xl p-3 text-left"
                    >
                        <div className="text-white text-lg font-bold mb-1">T</div>
                        <div className="text-white/50 text-xs">Edit text</div>
                    </button>
                    <button
                        onClick={() => setActiveSheet('design')}
                        className="bg-white/5 border border-white/10 rounded-xl p-3 text-left"
                    >
                        <div className="text-white text-sm font-medium mb-1">Style</div>
                        <div className="text-white/50 text-xs">Colors, fonts, layout</div>
                    </button>
                </div>

                {/* Element pills */}
                <div className="flex gap-2 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
                    {(['+ Icon', '+ Divider', '+ CTA'] as const).map(label => (
                        <button
                            key={label}
                            onClick={() => label === '+ Icon' ? setActiveSheet('icons') : undefined}
                            className="flex-shrink-0 bg-white/5 border border-white/10 rounded-full px-3 py-2 text-xs text-white/60 whitespace-nowrap"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom nav */}
            <BottomNav />

            {/*
        CRITICAL: All sheets are ALWAYS mounted in the DOM.
        Visibility is controlled via CSS transform only (translateY).
        Never use conditional rendering or display:none here.
        This ensures TemplatesSheet stays mounted and its derived state
        (filtered templates) is always up-to-date.
      */}
            <BottomSheet height="52%" isOpen={activeSheet === 'slides'}>
                <SlidesSheet />
            </BottomSheet>
            <BottomSheet height="60%" isOpen={activeSheet === 'templates'}>
                <TemplatesSheet />
            </BottomSheet>
            <BottomSheet height="65%" isOpen={activeSheet === 'design'}>
                <DesignSheet />
            </BottomSheet>
            <BottomSheet height="70%" isOpen={activeSheet === 'text'}>
                <TextSheet />
            </BottomSheet>
            <BottomSheet height="55%" isOpen={activeSheet === 'icons'}>
                <IconSheet />
            </BottomSheet>
            <BottomSheet height="45%" isOpen={activeSheet === 'export'}>
                <ExportSheet />
            </BottomSheet>
        </div>
    );
}