'use client';

import React from 'react';
import { PALETTES } from '../../../_data/palettes';
import { FONTS } from '../../../_data/fonts';
import { useEditorStore } from '../../../_store/useEditorStore';
import type { LayoutId } from '../../../_types';

const LAYOUT_IDS: LayoutId[] = ['centered', 'left', 'split', 'top_accent', 'minimal', 'bold'];

export function DesignSheet() {
    const { slides, activeSlideIndex, updateSlideBackground, updateSlideAccent, updateSlideFont, updateSlideLayout } = useEditorStore();
    const slide = slides[activeSlideIndex];

    return (
        <div>
            <div className="text-[10px] uppercase tracking-widest text-white/40 px-4 pb-2">Color palette</div>
            <div className="flex gap-2 overflow-x-auto px-4 pb-4" style={{ scrollbarWidth: 'none' }}>
                {PALETTES.map(p => (
                    <button
                        key={p.id}
                        onClick={() => { updateSlideBackground(p.background); updateSlideAccent(p.accent); }}
                        className={`w-8 h-8 rounded-full flex-shrink-0 border-2 transition-transform hover:scale-110
              ${slide.background === p.background ? 'border-white scale-110' : 'border-transparent'}`}
                        style={{ background: p.background }}
                    />
                ))}
            </div>

            <div className="text-[10px] uppercase tracking-widest text-white/40 px-4 pb-2">Font</div>
            <div className="flex gap-2 overflow-x-auto px-4 pb-4" style={{ scrollbarWidth: 'none' }}>
                {FONTS.map(f => (
                    <button
                        key={f.id}
                        onClick={() => updateSlideFont(f.id)}
                        className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs border transition-colors
              ${slide.fontId === f.id ? 'bg-violet-500/30 border-violet-500 text-white' : 'border-white/15 text-white/60'}`}
                        style={{ fontFamily: f.css }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="text-[10px] uppercase tracking-widest text-white/40 px-4 pb-2">Layout</div>
            <div className="flex gap-2 overflow-x-auto px-4 pb-4" style={{ scrollbarWidth: 'none' }}>
                {LAYOUT_IDS.map(id => (
                    <button
                        key={id}
                        onClick={() => updateSlideLayout(id)}
                        className={`flex-shrink-0 w-14 h-[70px] rounded-xl border flex flex-col items-center justify-center gap-1 p-1.5 transition-colors
              ${slide.layout === id ? 'border-violet-500 bg-violet-500/20' : 'border-white/15'}`}
                    >
                        <span className="w-4/5 h-1 rounded bg-white/30 block" />
                        <span className="w-3/4 h-0.5 rounded bg-white/20 block" />
                        <span className="w-2/3 h-0.5 rounded bg-white/20 block" />
                        <span className="text-[7px] text-white/30 mt-0.5">{id}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}