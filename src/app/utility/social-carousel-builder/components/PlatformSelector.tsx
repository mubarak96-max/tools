'use client';

import React from 'react';
import { PlatformSelectorProps } from '../types';
import { getAllPlatforms } from '../constants/platforms';

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
    selectedPlatform,
    selectedFormat,
    onPlatformChange,
}) => {
    const platforms = getAllPlatforms();

    return (
        <div className="space-y-4">
            <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Platform</p>
                <div className="flex flex-wrap gap-2">
                    {platforms.map((platform) => (
                        <button
                            key={platform.id}
                            type="button"
                            onClick={() => onPlatformChange(platform, platform.formats[0])}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                selectedPlatform.id === platform.id
                                    ? 'bg-slate-900 text-white'
                                    : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            {platform.name}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Format</p>
                <div className="flex flex-wrap gap-2">
                    {selectedPlatform.formats.map((format) => (
                        <button
                            key={format.id}
                            type="button"
                            onClick={() => onPlatformChange(selectedPlatform, format)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                selectedFormat.id === format.id
                                    ? 'bg-sky-100 text-sky-900'
                                    : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            {format.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {selectedPlatform.name} · {selectedFormat.dimensions.width} x {selectedFormat.dimensions.height} · {selectedFormat.aspectRatio}
            </div>
        </div>
    );
};
