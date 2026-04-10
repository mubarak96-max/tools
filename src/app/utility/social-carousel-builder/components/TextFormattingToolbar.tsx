'use client';

import React from 'react';
import { ElementStyle } from '../types';

interface TextFormattingToolbarProps {
    style: ElementStyle;
    onStyleChange: (updates: Partial<ElementStyle>) => void;
    position?: { x: number; y: number };
    isVisible: boolean;
}

export const TextFormattingToolbar: React.FC<TextFormattingToolbarProps> = ({
    style,
    onStyleChange,
    position,
    isVisible
}) => {
    if (!isVisible) return null;

    const toolbarStyle = position
        ? {
            position: 'absolute' as const,
            left: position.x,
            top: position.y - 60,
            zIndex: 1000
        }
        : {};

    return (
        <div
            className="bg-white border border-gray-300 rounded-lg shadow-lg p-2 flex items-center space-x-1"
            style={toolbarStyle}
        >
            {/* Font Size */}
            <div className="flex items-center space-x-1">
                <button
                    onClick={() => onStyleChange({ fontSize: Math.max(8, (style.fontSize || 16) - 2) })}
                    className="p-1 hover:bg-gray-100 rounded text-sm"
                    title="Decrease font size"
                >
                    A-
                </button>
                <span className="text-xs text-gray-600 min-w-8 text-center">
                    {style.fontSize || 16}
                </span>
                <button
                    onClick={() => onStyleChange({ fontSize: Math.min(200, (style.fontSize || 16) + 2) })}
                    className="p-1 hover:bg-gray-100 rounded text-sm"
                    title="Increase font size"
                >
                    A+
                </button>
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Font Weight */}
            <button
                onClick={() => onStyleChange({
                    fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold'
                })}
                className={`p-1 rounded text-sm font-bold ${style.fontWeight === 'bold'
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100'
                    }`}
                title="Bold"
            >
                B
            </button>

            <div className="w-px h-6 bg-gray-300" />

            {/* Text Alignment */}
            <div className="flex items-center">
                {(['left', 'center', 'right'] as const).map((align) => (
                    <button
                        key={align}
                        onClick={() => onStyleChange({ textAlign: align })}
                        className={`p-1 rounded text-sm ${style.textAlign === align
                                ? 'bg-blue-100 text-blue-700'
                                : 'hover:bg-gray-100'
                            }`}
                        title={`Align ${align}`}
                    >
                        {align === 'left' && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                        {align === 'center' && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2 4a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm2 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 4a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                        {align === 'right' && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M17 4a1 1 0 01-1 1H4a1 1 0 110-2h12a1 1 0 011 1zm0 4a1 1 0 01-1 1h-6a1 1 0 110-2h6a1 1 0 011 1zm0 4a1 1 0 01-1 1H4a1 1 0 110-2h12a1 1 0 011 1zm0 4a1 1 0 01-1 1h-6a1 1 0 110-2h6a1 1 0 011 1z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                ))}
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Text Color */}
            <div className="flex items-center space-x-1">
                <input
                    type="color"
                    value={style.color || '#000000'}
                    onChange={(e) => onStyleChange({ color: e.target.value })}
                    className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                    title="Text color"
                />
                <input
                    type="color"
                    value={style.backgroundColor || '#ffffff'}
                    onChange={(e) => onStyleChange({ backgroundColor: e.target.value })}
                    className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                    title="Background color"
                />
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Clear Background */}
            <button
                onClick={() => onStyleChange({ backgroundColor: undefined })}
                className="p-1 hover:bg-gray-100 rounded text-xs"
                title="Remove background"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};