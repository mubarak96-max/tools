'use client';

import React from 'react';
import { useEditorStore } from '../../../_store/useEditorStore';

export function TextSheet() {
    const { slides, activeSlideIndex, updateSlideText } = useEditorStore();
    const slide = slides[activeSlideIndex];

    return (
        <div className="px-4 flex flex-col gap-3 pb-6">
            {(['headline', 'subtitle', 'body'] as const).map(field => (
                <div key={field}>
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1.5">{field}</div>
                    <textarea
                        value={slide[field]}
                        onChange={e => updateSlideText(field, e.target.value)}
                        rows={field === 'body' ? 4 : 2}
                        className="w-full border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none resize-none focus:border-violet-500/60 transition-colors"
                        style={{ background: 'rgba(255,255,255,0.07)' }}
                    />
                </div>
            ))}
        </div>
    );
}