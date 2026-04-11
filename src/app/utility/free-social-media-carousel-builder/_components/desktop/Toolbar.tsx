'use client';

import React from 'react';
import { useEditorStore } from '../../_store/useEditorStore';
import { useExport } from '../../_hooks/useExport';
import { TEMPLATES } from '../../_data/templates';

export function Toolbar() {
    const { slides, activeSlideIndex, addSlide, duplicateSlide } = useEditorStore();
    const { exportAllPNG, exportZIP, isExporting } = useExport();
    const activeSlide = slides[activeSlideIndex];
    const tmpl = TEMPLATES.find(t => t.id === activeSlide.templateId);

    return (
        <div className="h-12 border-b border-gray-200 flex items-center gap-2 px-4 flex-shrink-0">
            <span className="text-sm text-gray-500">{tmpl?.name ?? 'Slide'}</span>
            <span className="text-xs text-gray-400 ml-1">{activeSlideIndex + 1}/{slides.length}</span>
            <div className="flex-1" />
            <button
                onClick={() => addSlide(activeSlide.templateId)}
                className="h-7 px-3 text-xs border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
                + Slide
            </button>
            <button
                onClick={() => duplicateSlide(activeSlideIndex)}
                className="h-7 px-3 text-xs border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
                Duplicate
            </button>
            <button
                onClick={exportAllPNG}
                disabled={isExporting}
                className="h-7 px-3 text-xs bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:opacity-50 transition-colors"
            >
                {isExporting ? 'Exporting…' : 'Export PNG'}
            </button>
            <button
                onClick={exportZIP}
                disabled={isExporting}
                className="h-7 px-3 text-xs border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
                ZIP
            </button>
        </div>
    );
}