'use client';

import React from 'react';
import { useEditorStore } from '../../_store/useEditorStore';
import type { ActiveSheet } from '../../_types';

const TABS: { id: ActiveSheet; label: string }[] = [
    { id: 'slides', label: 'Slides' },
    { id: 'templates', label: 'Templates' },
    { id: 'design', label: 'Design' },
    { id: 'export', label: 'Export' },
];

export function BottomNav() {
    const { activeSheet, setActiveSheet } = useEditorStore();

    return (
        <div className="h-[60px] border-t border-white/10 flex items-center flex-shrink-0 bg-[#0d1b2a]">
            {TABS.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveSheet(tab.id)}
                    className="flex-1 flex flex-col items-center gap-1 py-2"
                >
                    <span className={`text-[10px] font-medium transition-colors ${activeSheet === tab.id ? 'text-violet-400' : 'text-white/40'}`}>
                        {tab.label}
                    </span>
                </button>
            ))}
        </div>
    );
}