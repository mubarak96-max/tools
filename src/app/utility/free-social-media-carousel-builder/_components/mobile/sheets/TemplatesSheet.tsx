'use client';

import React from 'react';
import { CATEGORIES } from '../../../_data/categories';
import { TEMPLATES } from '../../../_data/templates';
import { useEditorStore } from '../../../_store/useEditorStore';

export function TemplatesSheet() {
    const { activeCategoryId, setActiveCategory, applyTemplate, setActiveSheet } = useEditorStore();

    // IMPORTANT: This derived value recomputes every render.
    // Because this component is always mounted (never unmounted by BottomSheet),
    // changing activeCategoryId in the store immediately triggers a re-render
    // and filtered updates correctly. No useEffect or manual re-render needed.
    const filtered = activeCategoryId === 'all'
        ? TEMPLATES
        : TEMPLATES.filter(t => t.categoryId === activeCategoryId);

    return (
        <div>
            <div className="text-xs text-white/40 px-4 pb-2">Choose template</div>

            {/* Category chips */}
            <div className="flex gap-2 overflow-x-auto px-4 pb-3" style={{ scrollbarWidth: 'none' }}>
                <button
                    onClick={() => setActiveCategory('all')}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors
            ${activeCategoryId === 'all'
                            ? 'bg-violet-500/30 border-violet-500 text-white'
                            : 'border-white/15 text-white/50'}`}
                >
                    All
                </button>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors
              ${activeCategoryId === cat.id
                                ? 'bg-violet-500/30 border-violet-500 text-white'
                                : 'border-white/15 text-white/50'}`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Template row */}
            <div className="flex gap-2.5 overflow-x-auto px-4 pb-4" style={{ scrollbarWidth: 'none' }}>
                {filtered.map(tmpl => (
                    <button
                        key={tmpl.id}
                        onClick={() => {
                            applyTemplate(tmpl.id);
                            setTimeout(() => setActiveSheet(null), 250);
                        }}
                        className="flex-shrink-0 w-20 rounded-xl overflow-hidden border-2 border-transparent hover:border-violet-500 transition-colors"
                    >
                        <div
                            className="h-[100px] flex flex-col justify-center items-center gap-1 p-2"
                            style={{ background: tmpl.background }}
                        >
                            <div className="w-8 h-0.5 rounded-full" style={{ background: tmpl.accentColor }} />
                            <div className="text-[8px] font-bold text-white text-center leading-tight line-clamp-2">
                                {tmpl.defaultHeadline}
                            </div>
                        </div>
                        <div className="bg-black/40 text-[9px] text-white/70 text-center py-1 px-1 truncate">
                            {tmpl.name}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}