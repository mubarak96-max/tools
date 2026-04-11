'use client';

import React from 'react';

interface TextEditorProps {
    elementId: string;
    content: string;
    fontSize: number;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right';
    onContentChange: (content: string) => void;
    onFontSizeChange: (size: number) => void;
    onFontWeightChange: (weight: string) => void;
    onColorChange: (color: string) => void;
    onTextAlignChange: (align: 'left' | 'center' | 'right') => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
    elementId,
    content,
    fontSize,
    fontWeight,
    color,
    textAlign,
    onContentChange,
    onFontSizeChange,
    onFontWeightChange,
    onColorChange,
    onTextAlignChange
}) => {
    const fontSizes = [24, 28, 32, 36, 42, 48, 56, 64, 72, 84, 96];
    const fontWeights = [
        { value: 'normal', label: 'Normal' },
        { value: 'bold', label: 'Bold' },
        { value: '600', label: 'Semi Bold' },
        { value: '300', label: 'Light' }
    ];

    const commonColors = [
        '#000000', '#ffffff', '#374151', '#6b7280', '#9ca3af',
        '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6',
        '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f59e0b'
    ];

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                </label>
                <textarea
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={elementId === 'headline' ? 3 : 5}
                    placeholder={`Enter ${elementId === 'headline' ? 'headline' : 'body text'}...`}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Size
                    </label>
                    <select
                        value={fontSize}
                        onChange={(e) => onFontSizeChange(Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {fontSizes.map(size => (
                            <option key={size} value={size}>{size}px</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Weight
                    </label>
                    <select
                        value={fontWeight}
                        onChange={(e) => onFontWeightChange(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {fontWeights.map(weight => (
                            <option key={weight.value} value={weight.value}>
                                {weight.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Alignment
                </label>
                <div className="flex gap-2">
                    {(['left', 'center', 'right'] as const).map(align => (
                        <button
                            key={align}
                            onClick={() => onTextAlignChange(align)}
                            className={`flex-1 p-2 border rounded-lg transition-colors ${textAlign === align
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-center">
                                {align === 'left' && (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {align === 'center' && (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2 4a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm2 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {align === 'right' && (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M17 4a1 1 0 01-1 1H4a1 1 0 110-2h12a1 1 0 011 1zm0 4a1 1 0 01-1 1H8a1 1 0 110-2h8a1 1 0 011 1zm0 4a1 1 0 01-1 1H4a1 1 0 110-2h12a1 1 0 011 1zm0 4a1 1 0 01-1 1H8a1 1 0 110-2h8a1 1 0 011 1z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                    {commonColors.map(colorOption => (
                        <button
                            key={colorOption}
                            onClick={() => onColorChange(colorOption)}
                            className={`w-8 h-8 rounded-lg border-2 transition-all ${color === colorOption
                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                            style={{ backgroundColor: colorOption }}
                            title={colorOption}
                        />
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => onColorChange(e.target.value)}
                        className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                        type="text"
                        value={color}
                        onChange={(e) => onColorChange(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="#000000"
                    />
                </div>
            </div>
        </div>
    );
};