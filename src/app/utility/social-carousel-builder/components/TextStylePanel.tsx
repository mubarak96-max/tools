'use client';

import React, { useState, useCallback } from 'react';
import { TemplateElement, ElementStyle } from '../types';

interface TextStylePanelProps {
    element: TemplateElement;
    onUpdate: (updates: Partial<TemplateElement>) => void;
}

const FONT_FAMILIES = [
    { value: 'Inter, sans-serif', label: 'Inter' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Helvetica, sans-serif', label: 'Helvetica' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Times New Roman, serif', label: 'Times' },
    { value: 'Courier New, monospace', label: 'Courier' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet' }
];

const FONT_WEIGHTS = [
    { value: 'normal', label: 'Normal' },
    { value: 'bold', label: 'Bold' },
    { value: '300', label: 'Light' },
    { value: '500', label: 'Medium' },
    { value: '600', label: 'Semi Bold' },
    { value: '700', label: 'Bold' },
    { value: '800', label: 'Extra Bold' }
];

const TEXT_ALIGNMENTS = [
    { value: 'left', label: 'Left', icon: '⬅️' },
    { value: 'center', label: 'Center', icon: '↔️' },
    { value: 'right', label: 'Right', icon: '➡️' }
];

export const TextStylePanel: React.FC<TextStylePanelProps> = ({
    element,
    onUpdate
}) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);

    const updateStyle = useCallback((styleUpdates: Partial<ElementStyle>) => {
        onUpdate({
            style: {
                ...element.style,
                ...styleUpdates
            }
        });
    }, [element.style, onUpdate]);

    const handleFontSizeChange = useCallback((fontSize: number) => {
        updateStyle({ fontSize: Math.max(8, Math.min(200, fontSize)) });
    }, [updateStyle]);

    if (element.type !== 'text') {
        return null;
    }

    return (
        <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Text Styling</h3>

            {/* Font Family */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Font Family
                </label>
                <select
                    value={element.style.fontFamily || 'Inter, sans-serif'}
                    onChange={(e) => updateStyle({ fontFamily: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {FONT_FAMILIES.map(font => (
                        <option key={font.value} value={font.value}>
                            {font.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Font Size and Weight */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Size
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            min="8"
                            max="200"
                            value={element.style.fontSize || 16}
                            onChange={(e) => handleFontSizeChange(parseInt(e.target.value) || 16)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-500">px</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight
                    </label>
                    <select
                        value={element.style.fontWeight || 'normal'}
                        onChange={(e) => updateStyle({ fontWeight: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {FONT_WEIGHTS.map(weight => (
                            <option key={weight.value} value={weight.value}>
                                {weight.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Text Alignment */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alignment
                </label>
                <div className="flex space-x-1">
                    {TEXT_ALIGNMENTS.map(alignment => (
                        <button
                            key={alignment.value}
                            onClick={() => updateStyle({ textAlign: alignment.value as any })}
                            className={`
                flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${element.style.textAlign === alignment.value || (!element.style.textAlign && alignment.value === 'left')
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }
              `}
                            title={alignment.label}
                        >
                            {alignment.icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Text Color
                    </label>
                    <div className="relative">
                        <button
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className="w-full h-10 border border-gray-300 rounded-md flex items-center justify-between px-3"
                            style={{ backgroundColor: element.style.color || '#000000' }}
                        >
                            <span className="text-white text-sm font-medium drop-shadow">
                                {element.style.color || '#000000'}
                            </span>
                        </button>
                        {showColorPicker && (
                            <div className="absolute top-12 left-0 z-10">
                                <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                                    <input
                                        type="color"
                                        value={element.style.color || '#000000'}
                                        onChange={(e) => updateStyle({ color: e.target.value })}
                                        className="w-full h-8"
                                    />
                                    <button
                                        onClick={() => setShowColorPicker(false)}
                                        className="mt-2 w-full px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Background
                    </label>
                    <div className="relative">
                        <button
                            onClick={() => setShowBackgroundPicker(!showBackgroundPicker)}
                            className="w-full h-10 border border-gray-300 rounded-md flex items-center justify-between px-3"
                            style={{
                                backgroundColor: element.style.backgroundColor || 'transparent',
                                backgroundImage: !element.style.backgroundColor ?
                                    'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                                backgroundSize: !element.style.backgroundColor ? '8px 8px' : 'auto',
                                backgroundPosition: !element.style.backgroundColor ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto'
                            }}
                        >
                            <span className="text-gray-700 text-sm font-medium">
                                {element.style.backgroundColor || 'None'}
                            </span>
                        </button>
                        {showBackgroundPicker && (
                            <div className="absolute top-12 left-0 z-10">
                                <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                                    <input
                                        type="color"
                                        value={element.style.backgroundColor || '#ffffff'}
                                        onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                                        className="w-full h-8 mb-2"
                                    />
                                    <button
                                        onClick={() => updateStyle({ backgroundColor: undefined })}
                                        className="w-full px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded mb-2"
                                    >
                                        Remove Background
                                    </button>
                                    <button
                                        onClick={() => setShowBackgroundPicker(false)}
                                        className="w-full px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Opacity */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opacity
                </label>
                <div className="flex items-center space-x-3">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={element.style.opacity || 1}
                        onChange={(e) => updateStyle({ opacity: parseFloat(e.target.value) })}
                        className="flex-1"
                    />
                    <span className="text-sm text-gray-600 w-12">
                        {Math.round((element.style.opacity || 1) * 100)}%
                    </span>
                </div>
            </div>

            {/* Border Radius */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Border Radius
                </label>
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        min="0"
                        max="50"
                        value={element.style.borderRadius || 0}
                        onChange={(e) => updateStyle({ borderRadius: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">px</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Actions
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => updateStyle({
                            fontWeight: 'bold',
                            fontSize: Math.max((element.style.fontSize || 16) + 4, 20)
                        })}
                        className="px-3 py-2 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md"
                    >
                        Make Bold & Bigger
                    </button>
                    <button
                        onClick={() => updateStyle({
                            color: '#ffffff',
                            backgroundColor: '#000000',
                            borderRadius: 8
                        })}
                        className="px-3 py-2 text-sm bg-gray-800 text-white hover:bg-gray-900 rounded-md"
                    >
                        Dark Theme
                    </button>
                </div>
            </div>
        </div>
    );
};