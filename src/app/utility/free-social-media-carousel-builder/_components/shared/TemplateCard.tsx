'use client';

import React from 'react';
import type { SlideTemplate } from '../../_types';

interface Props { template: SlideTemplate; onClick: () => void; isSelected?: boolean; }

export function TemplateCard({ template, onClick, isSelected }: Props) {
    return (
        <button
            onClick={onClick}
            className={`rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 aspect-[4/5] relative w-full
        ${isSelected ? 'border-violet-500' : 'border-transparent'}`}
        >
            <div className="w-full h-full flex flex-col justify-center items-center gap-1 p-2" style={{ background: template.background }}>
                <div className="w-8 h-0.5 rounded-full" style={{ background: template.accentColor }} />
                <div className="text-[8px] font-bold text-white text-center leading-tight line-clamp-2">{template.defaultHeadline}</div>
                {template.defaultSubtitle && <div className="text-[7px] text-white/55 text-center">{template.defaultSubtitle}</div>}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] py-1 px-1.5 truncate">{template.name}</div>
        </button>
    );
}