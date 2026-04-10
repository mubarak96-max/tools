'use client';

import React, { useState, useEffect } from 'react';
import { PlatformSelectorProps } from '../types';
import { getAllPlatforms } from '../constants/platforms';
import {
    getPlatformBestPractices,
    getSafeZones,
    getRecommendedFileFormat,
    getPlatformMetadata
} from '../utils/platformUtils';

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
    selectedPlatform,
    selectedFormat,
    onPlatformChange
}) => {
    const platforms = getAllPlatforms();
    const [showDetails, setShowDetails] = useState(false);
    const [bestPractices, setBestPractices] = useState<string[]>([]);

    useEffect(() => {
        setBestPractices(getPlatformBestPractices(selectedPlatform));
    }, [selectedPlatform]);

    const safeZones = getSafeZones(selectedPlatform, selectedFormat);
    const recommendedFormat = getRecommendedFileFormat(selectedPlatform);
    const metadata = getPlatformMetadata(selectedPlatform, selectedFormat);

    const handlePlatformChange = (platform: typeof selectedPlatform) => {
        // Auto-select the first format when platform changes
        onPlatformChange(platform, platform.formats[0]);
    };

    const handleFormatChange = (format: typeof selectedFormat) => {
        onPlatformChange(selectedPlatform, format);
    };

    return (
        <div className="space-y-6">
            {/* Platform Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Platform
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {platforms.map((platform) => (
                        <button
                            key={platform.id}
                            onClick={() => handlePlatformChange(platform)}
                            className={`
                p-4 rounded-lg border-2 font-medium transition-all duration-200 text-left
                ${selectedPlatform.id === platform.id
                                    ? 'bg-blue-50 text-blue-900 border-blue-500 shadow-md'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                }
              `}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-semibold">{platform.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {platform.formats.length} format{platform.formats.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                                {selectedPlatform.id === platform.id && (
                                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Format Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Format for {selectedPlatform.name}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedPlatform.formats.map((format) => (
                        <button
                            key={format.id}
                            onClick={() => handleFormatChange(format)}
                            className={`
                p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${selectedFormat.id === format.id
                                    ? 'bg-blue-50 text-blue-900 border-blue-500 shadow-md'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                }
              `}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-semibold">{format.name}</div>
                                {selectedFormat.id === format.id && (
                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                                <div>{format.dimensions.width} × {format.dimensions.height} px</div>
                                <div className="font-medium text-blue-600">{format.aspectRatio}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Current Selection Details */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Current Selection</h4>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        {showDetails ? 'Hide Details' : 'Show Details'}
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <div className="font-medium text-gray-700">Platform</div>
                        <div className="text-gray-900">{selectedPlatform.name}</div>
                    </div>
                    <div>
                        <div className="font-medium text-gray-700">Format</div>
                        <div className="text-gray-900">{selectedFormat.name}</div>
                    </div>
                    <div>
                        <div className="font-medium text-gray-700">Dimensions</div>
                        <div className="text-gray-900">{selectedFormat.dimensions.width} × {selectedFormat.dimensions.height}</div>
                    </div>
                    <div>
                        <div className="font-medium text-gray-700">Aspect Ratio</div>
                        <div className="text-gray-900">{selectedFormat.aspectRatio}</div>
                    </div>
                </div>

                {showDetails && (
                    <div className="mt-6 pt-6 border-t border-blue-200 space-y-4">
                        {/* Safe Zones */}
                        {(safeZones.top > 0 || safeZones.bottom > 0) && (
                            <div>
                                <h5 className="font-medium text-gray-900 mb-2">Safe Zones</h5>
                                <div className="text-sm text-gray-600 bg-white rounded p-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>Top: {safeZones.top}px</div>
                                        <div>Bottom: {safeZones.bottom}px</div>
                                        <div>Left: {safeZones.left}px</div>
                                        <div>Right: {safeZones.right}px</div>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Keep important content within these margins to avoid being cut off.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Recommended Settings */}
                        <div>
                            <h5 className="font-medium text-gray-900 mb-2">Recommended Settings</h5>
                            <div className="text-sm text-gray-600 bg-white rounded p-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>File Format: {recommendedFormat.toUpperCase()}</div>
                                    <div>Color Profile: {metadata.colorProfile}</div>
                                    <div>Quality: {metadata.quality}</div>
                                    <div>Compression: {metadata.compression || 'Standard'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Best Practices */}
                        <div>
                            <h5 className="font-medium text-gray-900 mb-2">Best Practices</h5>
                            <div className="bg-white rounded p-3">
                                <ul className="text-sm text-gray-600 space-y-1">
                                    {bestPractices.map((practice, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="text-blue-500 mr-2">•</span>
                                            {practice}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};