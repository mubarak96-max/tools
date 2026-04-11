'use client';

import React from 'react';
import { PALETTES } from '../../_data/palettes';
import { FONTS } from '../../_data/fonts';
import { useEditorStore } from '../../_store/useEditorStore';
import type { LayoutId } from '../../_types';

const LAYOUT_OPTIONS: { id: LayoutId; label: string }[] = [
    { id: 'centered', label: 'Center' },
    { id: 'left', label: 'Left' },
    { id: 'split', label: 'Split' },
    { id: 'top_accent', label: 'Top' },
    { id: 'minimal', label: 'Min' },
    { id: 'bold', label: 'Bold' },
];

const QUICK_ICONS = ['🚀', '⭐', '🔥', '💡', '✅', '→', '♥', '◆'];

export function RightSidebar() {
    const { slides, activeSlideIndex, updateSlideBackground, updateSlideAccent, updateSlideFont, updateSlideLayout, addIconToSlide } = useEditorStore();
    const slide = slides[activeSlideIndex];

    return (
        <div className="w-[220px] border-l border-gray-200 overflow-y-auto flex-shrink-0">
            {/* Palette */}
            <div className="p-3.5 border-b border-gray-100">
                <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Color Palette</div>
                <div className="flex flex-wrap gap-1.5">
                    {PALETTES.map(p => (
                        <button
                            key={p.id}
                            onClick={() => { updateSlideBackground(p.background); updateSlideAccent(p.accent); }}
                            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110
                ${slide.background === p.background ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                            style={{ background: p.background }}
                            title={p.id}
                        />
                    ))}
                </div>
            </div>

            {/* Font */}
            <div className="p-3.5 border-b border-gray-100">
                <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Font Style</div>
                <div className="flex flex-col gap-1">
                    {FONTS.map(f => (
                        <button
                            key={f.id}
                            onClick={() => updateSlideFont(f.id)}
                            className={`px-2 py-1.5 text-xs text-left rounded-md border transition-colors
                ${slide.fontId === f.id ? 'bg-gray-100 border-gray-300' : 'border-gray-200 hover:bg-gray-50'}`}
                            style={{ fontFamily: f.css }}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Layout */}
            <div className="p-3.5 border-b border-gray-100">
                <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Layout</div>
                <div className="grid grid-cols-3 gap-1">
                    {LAYOUT_OPTIONS.map(l => (
                        <button
                            key={l.id}
                            onClick={() => updateSlideLayout(l.id)}
                            className={`aspect-[4/5] rounded border flex flex-col items-center justify-center gap-0.5 p-1 transition-colors
                ${slide.layout === l.id ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                            <span className="w-4/5 h-1 rounded bg-gray-300 block" />
                            <span className="w-3/4 h-0.5 rounded bg-gray-200 block" />
                            <span className="w-2/3 h-0.5 rounded bg-gray-200 block" />
                            <span className="text-[7px] text-gray-400 mt-0.5">{l.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Elements */}
            <div className="p-3.5">
                <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Add Element</div>
                <div className="grid grid-cols-4 gap-1">
                    {QUICK_ICONS.map(icon => (
                        <button
                            key={icon}
                            onClick={() => addIconToSlide({ content: icon, x: 50, y: 40, size: 32 })}
                            className="aspect-square flex items-center justify-center text-lg border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                            title={`Add ${icon}`}
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}