'use client';

import React from 'react';
import { useEditorStore } from '../../../_store/useEditorStore';

const ICONS = [
    '🚀', '⭐', '🔥', '💡', '✅', '❌', '→', '↗', '♥', '◆', '▲', '●',
    '🎯', '📈', '💰', '🏆', '🎉', '⚡', '🌟', '💎', '🔑', '🛡', '⚙️', '🎨',
];

export function IconSheet() {
    const { addIconToSlide, setActiveSheet } = useEditorStore();

    return (
        <div className="px-4 pb-6">
            <div className="text-xs text-white/50 mb-3">Tap to add to slide · Double-tap placed icon to remove</div>
            <div className="grid grid-cols-6 gap-2">
                {ICONS.map(icon => (
                    <button
                        key={icon}
                        onClick={() => {
                            addIconToSlide({ content: icon, x: 50, y: 30, size: 36 });
                            setActiveSheet(null);
                        }}
                        className="aspect-square flex items-center justify-center text-2xl rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        {icon}
                    </button>
                ))}
            </div>
        </div>
    );
}