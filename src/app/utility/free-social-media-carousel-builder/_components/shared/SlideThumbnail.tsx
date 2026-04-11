'use client';

import React from 'react';
import type { Slide } from '../../_types';
import { FONTS } from '../../_data/fonts';

interface Props { slide: Slide; isActive: boolean; onClick: () => void; }

export function SlideThumbnail({ slide, isActive, onClick }: Props) {
    const font = FONTS.find(f => f.id === slide.fontId);
    return (
        <button
            onClick={onClick}
            className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${isActive ? 'border-violet-500' : 'border-transparent'}`}
            style={{ background: slide.background, fontFamily: font?.css }}
        >
            <div className="w-full h-full p-1.5 flex flex-col justify-center">
                <div className="w-5 h-0.5 rounded mb-1" style={{ background: slide.accentColor }} />
                <div className="text-[7px] font-bold text-white leading-tight line-clamp-2">{slide.headline}</div>
            </div>
        </button>
    );
}