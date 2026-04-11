'use client';

import React from 'react';
import { useEditorStore } from '../../_store/useEditorStore';

interface Props {
    height: string;
    isOpen: boolean;
    children: React.ReactNode;
}

export function BottomSheet({ height, isOpen, children }: Props) {
    const { setActiveSheet } = useEditorStore();

    return (
        <>
            {/* Backdrop — only rendered when open to avoid blocking touch events */}
            {isOpen && (
                <div
                    className="absolute inset-0 bg-black/30 z-10"
                    onClick={() => setActiveSheet(null)}
                />
            )}
            {/* Sheet — ALWAYS in DOM, position controlled by transform only */}
            <div
                className="absolute bottom-0 left-0 right-0 z-20 rounded-t-2xl bg-[#1a2438] border-t border-white/10 overflow-y-auto transition-transform duration-300 ease-out"
                style={{
                    height,
                    transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
                }}
            >
                <div className="w-9 h-1 bg-white/20 rounded-full mx-auto mt-2.5 mb-3.5" />
                {children}
            </div>
        </>
    );
}