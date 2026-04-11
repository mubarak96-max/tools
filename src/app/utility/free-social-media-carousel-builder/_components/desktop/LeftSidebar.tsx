'use client';

import React from 'react';
import { CATEGORIES } from '../../_data/categories';
import { TEMPLATES } from '../../_data/templates';
import { useEditorStore } from '../../_store/useEditorStore';
import { TemplateCard } from '../shared/TemplateCard';

export function LeftSidebar() {
    const { activeCategoryId, setActiveCategory, applyTemplate } = useEditorStore();

    const filtered = activeCategoryId === 'all'
        ? TEMPLATES
        : TEMPLATES.filter(t => t.categoryId === activeCategoryId);

    return (
        <div className="w-[220px] border-r border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
            <div className="px-3.5 py-3 text-sm font-medium text-gray-800 border-b border-gray-100">Templates</div>
            <div className="flex-1 overflow-y-auto">
                {/* All */}
                <button
                    onClick={() => setActiveCategory('all')}
                    className={`w-full flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-md mx-1.5 my-0.5 transition-colors
            ${activeCategoryId === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
                    All templates
                </button>

                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-md mx-1.5 my-0.5 transition-colors
              ${activeCategoryId === cat.id ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                        {cat.label}
                    </button>
                ))}

                <div className="px-3 pb-4 mt-2">
                    <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                        {activeCategoryId === 'all' ? 'All' : CATEGORIES.find(c => c.id === activeCategoryId)?.label}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {filtered.map(tmpl => (
                            <TemplateCard key={tmpl.id} template={tmpl} onClick={() => applyTemplate(tmpl.id)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}