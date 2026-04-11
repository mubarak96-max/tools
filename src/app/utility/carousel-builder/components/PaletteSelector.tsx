'use client';

import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { PALETTES } from '../data/palettes';

export const PaletteSelector: React.FC = () => {
    const { selectedPalette, setPalette } = useEditorStore();

    return (
        <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Color Palette</h4>
            <div className="grid grid-cols-2 gap-2">
                {PALETTES.map((palette) => (
                    <div
                        key={palette.id}
                        onClick={() => setPalette(palette)}
                        className={`
              cursor-pointer rounded-lg border-2 p-3 transition-all hover:shadow-sm
              ${selectedPalette.id === palette.id
                                ? 'border-blue-500 ring-2 ring-blue-200'
                                : 'border-gray-200 hover:border-gray-300'
                            }
            `}
                    >
                        {/* Palette Preview */}
                        <div className="flex gap-1 mb-2">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ background: palette.background }}
                            />
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: palette.accent }}
                            />
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: palette.textPrimary }}
                            />
                        </div>

                        {/* Palette Name */}
                        <div className="text-xs font-medium text-gray-900">
                            {palette.name}
                        </div>

                        {/* Selection Indicator */}
                        {selectedPalette.id === palette.id && (
                            <div className="mt-1">
                                <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};