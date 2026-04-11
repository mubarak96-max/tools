'use client';

import React, { useRef } from 'react';
import type { IconOverlay } from '../../_types';
import { useEditorStore } from '../../_store/useEditorStore';

interface Props { icon: IconOverlay; readOnly?: boolean; }

export function IconElement({ icon, readOnly }: Props) {
    const { updateIconPosition, removeIconFromSlide } = useEditorStore();
    const dragging = useRef(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (readOnly) return;
        e.preventDefault();
        dragging.current = true;
        const canvas = (e.currentTarget as HTMLElement).parentElement!;
        const rect = canvas.getBoundingClientRect();

        const onMove = (ev: MouseEvent) => {
            const x = Math.max(0, Math.min(95, ((ev.clientX - rect.left) / rect.width) * 100));
            const y = Math.max(0, Math.min(95, ((ev.clientY - rect.top) / rect.height) * 100));
            updateIconPosition(icon.id, x, y);
        };
        const onUp = () => { dragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    };

    return (
        <div
            style={{ position: 'absolute', left: `${icon.x}%`, top: `${icon.y}%`, fontSize: icon.size, cursor: readOnly ? 'default' : 'move', userSelect: 'none', lineHeight: 1 }}
            onMouseDown={handleMouseDown}
            onDoubleClick={() => !readOnly && removeIconFromSlide(icon.id)}
            title={readOnly ? undefined : 'Drag · Double-click to remove'}
        >
            {icon.content}
        </div>
    );
}