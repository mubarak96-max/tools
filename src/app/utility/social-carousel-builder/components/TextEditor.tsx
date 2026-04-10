'use client';

import React, { useEffect, useState } from 'react';
import { TemplateElement } from '../types';

interface TextEditorProps {
    element: TemplateElement;
    scale: number;
    onSave: (value: string) => void;
    onClose: () => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
    element,
    scale,
    onSave,
    onClose
}) => {
    const [value, setValue] = useState(typeof element.content === 'string' ? element.content : '');

    useEffect(() => {
        setValue(typeof element.content === 'string' ? element.content : '');
    }, [element]);

    const left = element.position.x * scale;
    const top = element.position.y * scale;
    const width = Math.max(180, element.dimensions.width * scale);
    const minHeight = Math.max(120, element.dimensions.height * scale);

    return (
        <div
            className="absolute z-30 rounded-lg border border-blue-300 bg-white p-3 shadow-xl"
            style={{ left, top, width }}
        >
            <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Editing text
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
                >
                    Close
                </button>
            </div>
            <textarea
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="min-h-[120px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                style={{ minHeight }}
                autoFocus
            />
            <div className="mt-3 flex items-center justify-end gap-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={() => onSave(value)}
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Save text
                </button>
            </div>
        </div>
    );
};
